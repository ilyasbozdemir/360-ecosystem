/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')

const appDir = path.join(__dirname, '..')
const outputFile = path.join(appDir, 'src/renderer/src/generated-loc.json')

const allowedExtensions = ['.ts', '.tsx', '.css', '.html', '.js', '.jsx']
const ignoredDirs = new Set(['node_modules', 'dist', 'out', 'build', '.git', '.turbo', 'coverage'])
const SCOPES = ['app', 'app+deps', 'repo']
const DEFAULT_SCOPE = 'app+deps'

/** @returns {string} */
function parseScope() {
  const args = process.argv.slice(2)
  let value = DEFAULT_SCOPE
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--scope=')) value = args[i].slice('--scope='.length)
    else if (args[i] === '--scope' && args[i + 1]) value = args[i + 1]
  }
  if (!SCOPES.includes(value)) {
    console.error(`[LOC Counter] Geçersiz kapsam: "${value}". Geçerli değerler: ${SCOPES.join(', ')}`)
    process.exit(1)
  }
  return value
}

function findWorkspaceRoot(start) {
  let dir = start
  while (true) {
    if (fs.existsSync(path.join(dir, 'pnpm-workspace.yaml'))) return dir
    const parent = path.dirname(dir)
    if (parent === dir) return null
    dir = parent
  }
}

function readWorkspacePatterns(root) {
  const file = path.join(root, 'pnpm-workspace.yaml')
  const patterns = []
  let inPackages = false
  for (const raw of fs.readFileSync(file, 'utf-8').split(/\r?\n/)) {
    if (/^packages\s*:/.test(raw)) {
      inPackages = true
      continue
    }
    if (inPackages) {
      if (/^\S/.test(raw) && raw.trim() !== '') break
      const m = raw.match(/^\s*-\s*['"]?([^'"#]+?)['"]?\s*(#.*)?$/)
      if (m && !m[1].startsWith('!')) patterns.push(m[1].trim())
    }
  }
  return patterns.length ? patterns : ['apps/*', 'packages/*']
}

function expandPattern(root, pattern) {
  const clean = pattern.replace(/\/+$/, '')
  if (clean.endsWith('/*') || clean.endsWith('/**')) {
    const base = path.join(root, clean.replace(/\/\*+$/, ''))
    if (!fs.existsSync(base)) return []
    return fs
      .readdirSync(base, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !ignoredDirs.has(d.name))
      .map((d) => path.join(base, d.name))
  }
  const exact = path.join(root, clean)
  return fs.existsSync(exact) ? [exact] : []
}

function loadWorkspacePackages(root) {
  const packages = []
  for (const pattern of readWorkspacePatterns(root)) {
    for (const dir of expandPattern(root, pattern)) {
      const pkgFile = path.join(dir, 'package.json')
      if (!fs.existsSync(pkgFile)) continue
      try {
        const json = JSON.parse(fs.readFileSync(pkgFile, 'utf-8'))
        const deps = { ...json.dependencies, ...json.devDependencies, ...json.optionalDependencies }
        const workspaceDeps = Object.entries(deps)
          .filter(([, v]) => typeof v === 'string' && v.startsWith('workspace:'))
          .map(([name]) => name)
        packages.push({ name: json.name || path.basename(dir), dir, workspaceDeps })
      } catch (err) {
        console.warn(`[LOC Counter] Uyarı: ${pkgFile} okunamadı, atlandı (${err.message})`)
      }
    }
  }
  return packages
}

function resolvePackages(scope, root) {
  if (!root) {
    if (scope !== 'app') console.warn('[LOC Counter] Uyarı: pnpm-workspace.yaml bulunamadı, yalnızca uygulama sayılıyor.')
    return [{ name: 'app-desktop', dir: appDir, workspaceDeps: [] }]
  }
  const all = loadWorkspacePackages(root)
  const app = all.find((p) => path.resolve(p.dir) === path.resolve(appDir))
  if (!app) return [{ name: 'app-desktop', dir: appDir, workspaceDeps: [] }]

  if (scope === 'repo') return all
  if (scope === 'app') return [app]

  const byName = new Map(all.map((p) => [p.name, p]))
  const seen = new Set([app.name])
  const queue = [app]
  while (queue.length) {
    const current = queue.shift()
    for (const depName of current.workspaceDeps) {
      const dep = byName.get(depName)
      if (dep && !seen.has(dep.name)) {
        seen.add(dep.name)
        queue.push(dep)
      }
    }
  }
  return all.filter((p) => seen.has(p.name))
}

function sourceDirOf(pkg) {
  const src = path.join(pkg.dir, 'src')
  return fs.existsSync(src) ? src : pkg.dir
}

function countDir(dir, acc) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) countDir(full, acc)
      continue
    }
    const lower = entry.name.toLowerCase()
    if (lower.endsWith('.d.ts') || lower.includes('.min.')) continue
    if (!allowedExtensions.includes(path.extname(lower))) continue
    try {
      const lines = fs.readFileSync(full, 'utf-8').split(/\r?\n/)
      acc.files++
      acc.lines += lines.length
      for (const line of lines) if (line.trim().length > 0) acc.code++
    } catch (err) {
      console.warn(`[LOC Counter] Uyarı: ${full} okunamadı, atlandı (${err.message})`)
    }
  }
}

const scope = parseScope()
const root = findWorkspaceRoot(appDir)
const packages = resolvePackages(scope, root)

let totalFiles = 0
let totalLines = 0
let codeLines = 0
const breakdown = []

for (const pkg of packages) {
  const dir = sourceDirOf(pkg)
  if (!fs.existsSync(dir)) {
    console.warn(`[LOC Counter] Uyarı: ${dir} bulunamadı, atlandı.`)
    continue
  }
  const acc = { files: 0, lines: 0, code: 0 }
  countDir(dir, acc)
  totalFiles += acc.files
  totalLines += acc.lines
  codeLines += acc.code
  breakdown.push({
    name: pkg.name,
    path: path.relative(root || appDir, pkg.dir).split(path.sep).join('/') || '.',
    files: acc.files,
    totalLines: acc.lines,
    codeLines: acc.code
  })
}

const result = {
  totalFiles,
  totalLines,
  codeLines,
  timestamp: new Date().toISOString(),
  scope,
  breakdown
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true })
fs.writeFileSync(outputFile, JSON.stringify(result, null, 2))

console.log(`[LOC Counter] Kapsam: ${scope}`)
for (const b of breakdown) {
  console.log(`  - ${b.name} (${b.path}): ${b.codeLines} kod satırı, ${b.files} dosya`)
}
console.log(
  `[LOC Counter] Toplam: ${codeLines} kod satırı (${totalLines} satır) / ${totalFiles} dosya.`
)
