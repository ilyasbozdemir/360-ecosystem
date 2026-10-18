/* eslint-disable */
const fs = require('fs')
const path = require('path')

const appDir = path.join(__dirname, '..')
const outputFile = path.join(appDir, 'src/renderer/src/generated-loc.json')

const allowedExtensions = ['.ts', '.tsx', '.css', '.html', '.js', '.jsx']
const ignoredDirs = new Set([
  'node_modules',
  'dist',
  'out',
  'build',
  '.git',
  '.turbo',
  'coverage',
  '.next',
  'dist-local',
  'dist-electron',
  '.gemini',
  '.agents',
  '.vscode',
  '.idea'
])
const SCOPES = ['app', 'app+deps', 'repo']
const DEFAULT_SCOPE = 'app+deps'

/** @returns {string} */
function parseScope(args = process.argv.slice(2)) {
  let value = DEFAULT_SCOPE
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--scope=')) value = args[i].slice('--scope='.length)
    else if (args[i] === '--scope' && args[i + 1]) value = args[i + 1]
  }
  if (!SCOPES.includes(value)) {
    console.error(
      `[LOC Counter] Geçersiz kapsam: "${value}". Geçerli değerler: ${SCOPES.join(', ')}`
    )
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
  if (!fs.existsSync(file)) return ['apps/*', 'packages/*']
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

function resolvePackages(scope, root, currentAppDir = appDir) {
  if (!root) {
    if (scope !== 'app')
      console.warn(
        '[LOC Counter] Uyarı: pnpm-workspace.yaml bulunamadı, yalnızca uygulama sayılıyor.'
      )
    return [{ name: 'app-desktop', dir: currentAppDir, workspaceDeps: [] }]
  }
  const all = loadWorkspacePackages(root)
  const app = all.find((p) => path.resolve(p.dir) === path.resolve(currentAppDir))
  if (!app) return [{ name: 'app-desktop', dir: currentAppDir, workspaceDeps: [] }]

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

/**
 * Normalizes content and splits into lines, treating trailing newline as line terminator.
 * - Empty string "" yields 0 lines.
 * - Single trailing newline (\n or \r\n) is treated as terminator, avoiding phantom empty line.
 * @param {string} content
 * @returns {string[]}
 */
function getFileLines(content) {
  if (!content || content.length === 0) return []
  let text = content
  if (text.endsWith('\r\n')) {
    text = text.slice(0, -2)
  } else if (text.endsWith('\n')) {
    text = text.slice(0, -1)
  }
  return text.split(/\r?\n/)
}

/**
 * Detects whether a file is a test/spec/mock/fixture file.
 * Prevents double-counting across test categories.
 * @param {string} filePath
 * @returns {boolean}
 */
function isTestFile(filePath) {
  const normalized = filePath.split(path.sep).join('/')
  return (
    normalized.includes('/__tests__/') ||
    normalized.includes('/__mocks__/') ||
    normalized.includes('/__fixtures__/') ||
    /\.(test|spec)\.[jt]sx?$/.test(normalized) ||
    normalized.includes('/e2e/') ||
    normalized.includes('/tests/')
  )
}

/**
 * Counts lines and metrics for a single file.
 * @param {string} fullPath
 */
function countFile(fullPath) {
  const content = fs.readFileSync(fullPath, 'utf-8')
  const lines = getFileLines(content)
  let nonBlank = 0
  for (const line of lines) {
    if (line.trim().length > 0) nonBlank++
  }
  const total = lines.length
  const blank = total - nonBlank
  const isTest = isTestFile(fullPath)
  return {
    lines: total,
    code: nonBlank,
    blank,
    isTest
  }
}

function countDir(dir, acc, outPath = outputFile) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) continue
    const full = path.join(dir, entry.name)

    // Guard against counting output files or temporary files
    if (outPath && path.resolve(full) === path.resolve(outPath)) continue
    if (entry.name.endsWith('.tmp')) continue

    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) countDir(full, acc, outPath)
      continue
    }

    const lower = entry.name.toLowerCase()
    if (lower.endsWith('.d.ts') || lower.includes('.min.')) continue
    if (!allowedExtensions.includes(path.extname(lower))) continue

    try {
      const stat = countFile(full)
      acc.files++
      acc.lines += stat.lines
      acc.code += stat.code
      acc.blank += stat.blank

      if (stat.isTest) {
        acc.testFiles++
        acc.testLines += stat.lines
        acc.testCode += stat.code
      } else {
        acc.prodFiles++
        acc.prodLines += stat.lines
        acc.prodCode += stat.code
      }
    } catch (err) {
      console.warn(`[LOC Counter] Uyarı: ${full} okunamadı, atlandı (${err.message})`)
    }
  }
}

function writeLocJsonAtomic(targetPath, data) {
  const dir = path.dirname(targetPath)
  fs.mkdirSync(dir, { recursive: true })
  const tmpPath = `${targetPath}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}.tmp`
  const jsonStr = JSON.stringify(data, null, 2)
  fs.writeFileSync(tmpPath, jsonStr, 'utf-8')
  if (!fs.existsSync(tmpPath) || fs.statSync(tmpPath).size === 0) {
    throw new Error(`[LOC Counter] Atomik yazma hatası: ${tmpPath} boş veya oluşturulamadı.`)
  }
  fs.renameSync(tmpPath, targetPath)
}

function runCount(options = {}) {
  const chosenScope = options.scope || parseScope()
  const customAppDir = options.appDir || appDir
  const customOutputFile = options.outputFile !== undefined ? options.outputFile : outputFile
  const root = findWorkspaceRoot(customAppDir)
  const packages = resolvePackages(chosenScope, root, customAppDir)

  let totalFiles = 0
  let totalLines = 0
  let codeLines = 0
  let blankLines = 0
  let testFiles = 0
  let testLines = 0
  let testNonBlankLines = 0
  let prodFiles = 0
  let prodLines = 0
  let prodNonBlankLines = 0
  const breakdown = []

  for (const pkg of packages) {
    const dir = sourceDirOf(pkg)
    if (!fs.existsSync(dir)) {
      console.warn(`[LOC Counter] Uyarı: ${dir} bulunamadı, atlandı.`)
      continue
    }
    const acc = {
      files: 0,
      lines: 0,
      code: 0,
      blank: 0,
      testFiles: 0,
      testLines: 0,
      testCode: 0,
      prodFiles: 0,
      prodLines: 0,
      prodCode: 0
    }
    countDir(dir, acc, customOutputFile)

    totalFiles += acc.files
    totalLines += acc.lines
    codeLines += acc.code
    blankLines += acc.blank
    testFiles += acc.testFiles
    testLines += acc.testLines
    testNonBlankLines += acc.testCode
    prodFiles += acc.prodFiles
    prodLines += acc.prodLines
    prodNonBlankLines += acc.prodCode

    breakdown.push({
      name: pkg.name,
      path:
        path
          .relative(root || customAppDir, pkg.dir)
          .split(path.sep)
          .join('/') || '.',
      files: acc.files,
      totalLines: acc.lines,
      codeLines: acc.code,
      nonBlankLines: acc.code,
      blankLines: acc.blank,
      testFiles: acc.testFiles,
      testLines: acc.testLines,
      testNonBlankLines: acc.testCode,
      prodFiles: acc.prodFiles,
      prodLines: acc.prodLines,
      prodNonBlankLines: acc.prodCode
    })
  }

  const result = {
    totalFiles,
    totalLines,
    codeLines,
    nonBlankLines: codeLines,
    blankLines,
    testFiles,
    testLines,
    testNonBlankLines,
    prodFiles,
    prodLines,
    prodNonBlankLines,
    timestamp: new Date().toISOString(),
    scope: chosenScope,
    breakdown
  }

  if (customOutputFile) {
    writeLocJsonAtomic(customOutputFile, result)
  }

  return result
}

if (require.main === module) {
  const scope = parseScope()
  const result = runCount({ scope })

  console.log(`[LOC Counter] Kapsam: ${result.scope}`)
  for (const b of result.breakdown) {
    console.log(
      `  - ${b.name} (${b.path}): ${b.codeLines} kod satırı (üretim: ${b.prodNonBlankLines}, test: ${b.testNonBlankLines}) / ${b.files} dosya`
    )
  }
  console.log(
    `[LOC Counter] Toplam: ${result.codeLines} kod satırı (${result.totalLines} satır: ${result.codeLines} dolu, ${result.blankLines} boş) / ${result.totalFiles} dosya (üretim: ${result.prodFiles}, test: ${result.testFiles}).`
  )
}

module.exports = {
  allowedExtensions,
  ignoredDirs,
  SCOPES,
  DEFAULT_SCOPE,
  parseScope,
  findWorkspaceRoot,
  readWorkspacePatterns,
  expandPattern,
  loadWorkspacePackages,
  resolvePackages,
  sourceDirOf,
  getFileLines,
  isTestFile,
  countFile,
  countDir,
  writeLocJsonAtomic,
  runCount
}
