import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const require = createRequire(import.meta.url)
const ts = require(path.join(rootDir, 'apps/app-desktop/node_modules/typescript/lib/typescript.js'))

console.log('🚀 Starting codebase function body analysis...')

const targetDirs = [
  'apps/app-desktop/src',
  'apps/app-web/src',
  'apps/app-landing/src',
  'packages/database/src',
  'packages/document-templates/src',
  'packages/domain/src',
  'packages/pdf-generator/src'
]

function getSourceFiles(dir) {
  let results = []
  const fullDir = path.isAbsolute(dir) ? dir : path.join(rootDir, dir)
  if (!fs.existsSync(fullDir)) return results
  const list = fs.readdirSync(fullDir)
  for (const file of list) {
    const filePath = path.join(fullDir, file)
    const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/')
    const stat = fs.statSync(filePath)
    if (stat && stat.isDirectory()) {
      if (!['node_modules', 'dist', 'out', '.git', '.gemini', 'build', '.agents', 'dist-electron'].includes(file)) {
        results = results.concat(getSourceFiles(filePath))
      }
    } else {
      if (/\.(ts|tsx|js|jsx)$/.test(file) && !file.endsWith('.d.ts')) {
        if (!file.includes('.test.') && !file.includes('.spec.') && !relPath.includes('__tests__')) {
          results.push(relPath)
        }
      }
    }
  }
  return results
}

const files = targetDirs.flatMap(d => getSourceFiles(d))
console.log(`📁 Total source files found: ${files.length}`)

// Helper for hashing
function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex')
}

// Tokenize & normalize functions
function processBodyText(bodyText) {
  // 1. Scanner-based normalization & structural tokens
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, /*skipTrivia*/ true, ts.LanguageVariant.JSX, bodyText)
  
  const normTokens = []
  const structTokens = []
  const tokenFreq = new Map()

  let token
  while ((token = scanner.scan()) !== ts.SyntaxKind.EndOfFileToken) {
    const text = scanner.getTokenText()
    normTokens.push(text)

    let sToken
    if (token === ts.SyntaxKind.Identifier) {
      sToken = '$ID'
    } else if (
      token === ts.SyntaxKind.StringLiteral ||
      token === ts.SyntaxKind.NoSubstitutionTemplateLiteral ||
      token === ts.SyntaxKind.FirstTemplateToken
    ) {
      sToken = '$STR'
    } else if (token === ts.SyntaxKind.NumericLiteral) {
      sToken = '$NUM'
    } else if (token === ts.SyntaxKind.RegularExpressionLiteral) {
      sToken = '$REGEX'
    } else {
      sToken = ts.tokenToString(token) || ts.SyntaxKind[token]
    }
    structTokens.push(sToken)

    tokenFreq.set(sToken, (tokenFreq.get(sToken) || 0) + 1)
  }

  const normalizedStr = normTokens.join(' ')
  const structuralStr = structTokens.join(' ')
  const normHash = md5(normalizedStr)
  const structHash = md5(structuralStr)

  return {
    normalizedStr,
    structuralStr,
    normHash,
    structHash,
    structTokens,
    tokenFreq,
    tokenCount: structTokens.length
  }
}

// Token similarity calculation (multiset / Sørensen-Dice coefficient)
function calcSimilarity(fnA, fnB) {
  if (fnA.normHash === fnB.normHash) return 1.0
  if (fnA.structHash === fnB.structHash) return 0.95 // structurally identical

  const freqA = fnA.tokenFreq
  const freqB = fnB.tokenFreq
  let overlap = 0

  for (const [token, countA] of freqA.entries()) {
    const countB = freqB.get(token) || 0
    overlap += Math.min(countA, countB)
  }

  const total = fnA.tokenCount + fnB.tokenCount
  if (total === 0) return 1.0
  return (2 * overlap) / total
}

// Extract all functions from AST
const allFunctions = []
const ignoredNames = new Set([
  'App', 'render', 'default', 'Component', 'constructor',
  'useMemo', 'useEffect', 'useState'
])

for (const relPath of files) {
  const fullPath = path.join(rootDir, relPath)
  const content = fs.readFileSync(fullPath, 'utf8')
  const sf = ts.createSourceFile(relPath, content, ts.ScriptTarget.Latest, true)

  function visit(node) {
    let fnName = null
    let fnBodyNode = null
    let isHookOrCallback = false

    // 1. FunctionDeclaration
    if (ts.isFunctionDeclaration(node) && node.name && node.body) {
      fnName = node.name.text
      fnBodyNode = node.body
    }
    // 2. VariableDeclaration
    else if (ts.isVariableDeclaration(node) && node.name && ts.isIdentifier(node.name) && node.initializer) {
      const vName = node.name.text
      const init = node.initializer

      if ((ts.isArrowFunction(init) || ts.isFunctionExpression(init)) && init.body) {
        fnName = vName
        fnBodyNode = init.body
      } else if (
        ts.isCallExpression(init) &&
        ts.isIdentifier(init.expression) &&
        init.expression.text === 'useCallback' &&
        init.arguments.length > 0
      ) {
        const firstArg = init.arguments[0]
        if ((ts.isArrowFunction(firstArg) || ts.isFunctionExpression(firstArg)) && firstArg.body) {
          fnName = vName
          fnBodyNode = firstArg.body
          isHookOrCallback = true
        }
      }
    }
    // 3. MethodDeclaration
    else if (ts.isMethodDeclaration(node) && node.name && node.body) {
      if (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) {
        fnName = node.name.text
        fnBodyNode = node.body
      }
    }
    // 4. PropertyAssignment with function
    else if (ts.isPropertyAssignment(node) && node.name && node.initializer) {
      if (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) {
        const init = node.initializer
        if ((ts.isArrowFunction(init) || ts.isFunctionExpression(init)) && init.body) {
          fnName = node.name.text
          fnBodyNode = init.body
        }
      }
    }

    if (fnName && fnBodyNode && !ignoredNames.has(fnName)) {
      const start = sf.getLineAndCharacterOfPosition(fnBodyNode.getStart(sf))
      const end = sf.getLineAndCharacterOfPosition(fnBodyNode.getEnd())
      const lineCount = end.line - start.line + 1
      const bodyText = content.substring(fnBodyNode.getStart(sf), fnBodyNode.getEnd())

      if (bodyText.trim().length > 0) {
        const processed = processBodyText(bodyText)
        allFunctions.push({
          name: fnName,
          file: relPath,
          startLine: start.line + 1,
          endLine: end.line + 1,
          lines: lineCount,
          rawBody: bodyText,
          isHookOrCallback,
          ...processed
        })
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(sf)
}

console.log(`⚡ Extracted ${allFunctions.length} functions across codebase.`)

// Group by name to find homonymous duplicates
const byName = new Map()
for (const fn of allFunctions) {
  if (!byName.has(fn.name)) byName.set(fn.name, [])
  byName.get(fn.name).push(fn)
}

const homonymousNames = []
for (const [name, list] of byName.entries()) {
  const uniqueFiles = new Set(list.map(f => f.file))
  if (uniqueFiles.size > 1) {
    homonymousNames.push({ name, list, fileCount: uniqueFiles.size })
  }
}

homonymousNames.sort((a, b) => b.fileCount - a.fileCount || a.name.localeCompare(b.name))
console.log(`🔍 Found ${homonymousNames.length} homonymous function names with multi-file occurrences.`)

// Classification of homonymous functions:
// A: Birebir aynı (normHash same across all or pairwise identical)
// B: Yapısal olarak aynı (structHash same across all, but not normHash)
// C: Benzer (token similarity >= 0.80)
// D: Sadece isim aynı (similarity < 0.80)

const groupA = [] // Exact duplicate
const groupB = [] // Structurally identical
const groupC = [] // Similar (>= 80%)
const groupD = [] // Different bodies (< 80%)

for (const item of homonymousNames) {
  const { name, list } = item

  // Calculate pairwise max similarity and hash matches
  let allExact = true
  let allStruct = true
  let maxSim = 0
  let hasExactPair = false
  let hasStructPair = false

  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      if (list[i].file === list[j].file) continue // skip same file definitions
      const sim = calcSimilarity(list[i], list[j])
      if (sim > maxSim) maxSim = sim
      if (list[i].normHash === list[j].normHash) {
        hasExactPair = true
      } else {
        allExact = false
      }
      if (list[i].structHash === list[j].structHash) {
        hasStructPair = true
      } else {
        allStruct = false
      }
    }
  }

  // Determine category
  if (hasExactPair && (allExact || maxSim === 1.0)) {
    groupA.push({ ...item, maxSim, category: 'A' })
  } else if (hasStructPair) {
    groupB.push({ ...item, maxSim, category: 'B' })
  } else if (maxSim >= 0.80) {
    groupC.push({ ...item, maxSim, category: 'C' })
  } else {
    groupD.push({ ...item, maxSim, category: 'D' })
  }
}

console.log(`📊 Classification Results:
- Category A (Birebir Aynı): ${groupA.length}
- Category B (Yapısal Aynı): ${groupB.length}
- Category C (Benzer >=%80): ${groupC.length}
- Category D (Sadece İsim Aynı): ${groupD.length}
Total homonymous analyzed: ${groupA.length + groupB.length + groupC.length + groupD.length}
`)

// Section 5: Hidden Duplicates (Adaş olmayan ama gövdesi aynı olanlar >= 5 satır)
console.log('🔎 Searching for hidden duplicates (non-homonymous, lines >= 5)...')
const qualifiedFunctions = allFunctions.filter(f => f.lines >= 5 && f.tokenCount >= 10)
const byNormHash = new Map()
const byStructHash = new Map()

for (const fn of qualifiedFunctions) {
  if (!byNormHash.has(fn.normHash)) byNormHash.set(fn.normHash, [])
  byNormHash.get(fn.normHash).push(fn)

  if (!byStructHash.has(fn.structHash)) byStructHash.set(fn.structHash, [])
  byStructHash.get(fn.structHash).push(fn)
}

const hiddenExact = []
for (const [hash, list] of byNormHash.entries()) {
  const uniqueNames = new Set(list.map(f => f.name))
  const uniqueFiles = new Set(list.map(f => f.file))
  if (uniqueNames.size > 1 && uniqueFiles.size > 1) {
    hiddenExact.push({ hash, count: list.length, functions: list, type: 'Birebir Gizli Kopya' })
  }
}

const hiddenStruct = []
for (const [hash, list] of byStructHash.entries()) {
  const uniqueNames = new Set(list.map(f => f.name))
  const uniqueFiles = new Set(list.map(f => f.file))
  // only if not already captured in hiddenExact
  if (uniqueNames.size > 1 && uniqueFiles.size > 1) {
    const isAlreadyExact = hiddenExact.some(h => h.hash === list[0].normHash)
    if (!isAlreadyExact) {
      hiddenStruct.push({ hash, count: list.length, functions: list, type: 'Yapısal Gizli Kopya' })
    }
  }
}

console.log(`✨ Found ${hiddenExact.length} exact hidden duplicates and ${hiddenStruct.length} structural hidden duplicates.`)

// Helper to determine suggested module and risk
function analyzeMergeTargetAndRisk(fnList, category) {
  const files = fnList.map(f => f.file)
  const isAllDesktop = files.every(f => f.startsWith('apps/app-desktop'))
  const isMain = files.some(f => f.includes('/src/main/'))
  const isRenderer = files.some(f => f.includes('/src/renderer/'))
  const isShared = files.some(f => f.includes('/src/shared/') || f.startsWith('packages/'))

  let suggestedModule = 'apps/app-desktop/src/renderer/src/utils/'
  if (isShared || (!isAllDesktop && files.some(f => f.startsWith('packages/')))) {
    suggestedModule = 'packages/document-templates/src/utils/ veya packages/domain/'
  } else if (isMain && !isRenderer) {
    suggestedModule = 'apps/app-desktop/src/main/utils/'
  } else if (isMain && isRenderer) {
    suggestedModule = 'apps/app-desktop/src/shared/utils/'
  } else if (fnList[0].name.startsWith('use')) {
    suggestedModule = 'apps/app-desktop/src/renderer/src/hooks/'
  }

  // Risk notes:
  const riskNotes = []
  if (fnList.some(f => f.isHookOrCallback)) {
    riskNotes.push('useCallback/Hook içinde: Component closure (state/props) bağımlılıkları incelenmeli.')
  }
  if (category === 'B') {
    riskNotes.push('Değişken adları ve literaller farklı; ortak parametreli genel fonksiyon yapılmalı.')
  }
  if (category === 'C') {
    riskNotes.push('Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli.')
  }
  if (files.some(f => f.includes('screens/dosya')) && files.some(f => f.includes('screens/system'))) {
    riskNotes.push('Farklı modüller (dosya süreci vs sistem ekranı) arasında paylaşımlı utils gerektirir.')
  }
  riskNotes.push('REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.')

  return { suggestedModule, riskNote: riskNotes.join(' ') }
}

// Generate JSON export
const duplicatesJson = {
  summary: {
    totalFilesScanned: files.length,
    totalFunctionsExtracted: allFunctions.length,
    homonymousGroupsCount: homonymousNames.length,
    groupACount: groupA.length,
    groupBCount: groupB.length,
    groupCCount: groupC.length,
    groupDCount: groupD.length,
    hiddenExactCount: hiddenExact.length,
    hiddenStructCount: hiddenStruct.length
  },
  groupA: groupA.map(g => ({
    name: g.name,
    fileCount: g.fileCount,
    occurrences: g.list.map(f => ({ file: f.file, line: f.startLine, lines: f.lines })),
    ...analyzeMergeTargetAndRisk(g.list, 'A')
  })),
  groupB: groupB.map(g => ({
    name: g.name,
    fileCount: g.fileCount,
    maxSim: Number(g.maxSim.toFixed(2)),
    occurrences: g.list.map(f => ({ file: f.file, line: f.startLine, lines: f.lines })),
    ...analyzeMergeTargetAndRisk(g.list, 'B')
  })),
  groupC: groupC.map(g => ({
    name: g.name,
    fileCount: g.fileCount,
    maxSim: Number(g.maxSim.toFixed(2)),
    occurrences: g.list.map(f => ({ file: f.file, line: f.startLine, lines: f.lines })),
    ...analyzeMergeTargetAndRisk(g.list, 'C')
  })),
  groupD: groupD.map(g => ({
    name: g.name,
    fileCount: g.fileCount,
    maxSim: Number(g.maxSim.toFixed(2)),
    occurrences: g.list.map(f => ({ file: f.file, line: f.startLine, lines: f.lines }))
  })),
  hiddenDuplicates: {
    exact: hiddenExact.map(h => ({
      hash: h.hash,
      functions: h.functions.map(f => ({ name: f.name, file: f.file, line: f.startLine, lines: f.lines }))
    })),
    structural: hiddenStruct.map(h => ({
      hash: h.hash,
      functions: h.functions.map(f => ({ name: f.name, file: f.file, line: f.startLine, lines: f.lines }))
    }))
  }
}

// Generate Markdown export
function generateDuplicatesMd() {
  const lines = []
  lines.push('# TEMİN 360 - Mükerrer Fonksiyon ve Gövde Analiz Raporu')
  lines.push('')
  lines.push('> Bu rapor AST tabanlı TypeScript Compiler API ayrıştırması, gövde hash kontrolü, yapısal normalizasyon ve token benzerlik analizi ile oluşturulmuştur.')
  lines.push('')
  lines.push('## 📊 Genel İstatistikler')
  lines.push(`- **Taranan Kaynak Dosya Sayısı:** ${files.length}`)
  lines.push(`- **Çıkarılan Fonksiyon Sayısı:** ${allFunctions.length}`)
  lines.push(`- **Adaş Fonksiyon Grubu (Birden fazla dosyada tanımlı):** ${homonymousNames.length}`)
  lines.push(`- **A: Birebir Aynı Gövdeler:** ${groupA.length} adet`)
  lines.push(`- **B: Yapısal Olarak Aynı Gövdeler:** ${groupB.length} adet`)
  lines.push(`- **C: Yüksek Benzerlik Gösterenler (>= %80):** ${groupC.length} adet`)
  lines.push(`- **D: Sadece İsim Aynı (Farklı Gövde):** ${groupD.length} adet`)
  lines.push(`- **Gizli Kopyalar (Farklı İsim, Birebir/Yapısal Aynı):** ${hiddenExact.length + hiddenStruct.length} grup (${hiddenExact.length} birebir, ${hiddenStruct.length} yapısal)`)
  lines.push('')
  lines.push('---')
  lines.push('')

  // Section A
  lines.push(`## 🟢 Grup A: Birebir Aynı Fonksiyonlar (${groupA.length} adet)`)
  lines.push('Bu fonksiyonlar normalize edilmiş gövde hash\'leri birebir eşleşen tam kopyalardır. **En hızlı ve en güvenli birleştirme adaylarıdır.**')
  lines.push('')
  for (const item of groupA) {
    const analysis = analyzeMergeTargetAndRisk(item.list, 'A')
    lines.push(`### \`${item.name}\` (${item.fileCount} farklı dosya)`)
    lines.push(`- **Önerilen Hedef Modül:** \`${analysis.suggestedModule}\``)
    lines.push(`- **Risk Notu:** ${analysis.riskNote}`)
    lines.push('- **Tanım Konumları:**')
    const seen = new Set()
    for (const f of item.list) {
      const key = `${f.file}:${f.startLine}`
      if (!seen.has(key)) {
        seen.add(key)
        lines.push(`  - \`${f.file}:${f.startLine}\` (${f.lines} satır)`)
      }
    }
    lines.push('')
  }

  // Section B
  lines.push('---')
  lines.push('')
  lines.push(`## 🟡 Grup B: Yapısal Olarak Aynı Fonksiyonlar (${groupB.length} adet)`)
  lines.push('Bu fonksiyonlar AST seviyesinde değişken isimleri, parametre adları veya sabit literaller hariç **birebir aynı kontrol akışı ve mantığa** sahiptir. Tek bir parametrik yardımcı fonksiyonda toplanabilirler.')
  lines.push('')
  for (const item of groupB) {
    const analysis = analyzeMergeTargetAndRisk(item.list, 'B')
    lines.push(`### \`${item.name}\` (${item.fileCount} dosya, Yapısal Eşleşme)`)
    lines.push(`- **Önerilen Hedef Modül:** \`${analysis.suggestedModule}\``)
    lines.push(`- **Risk Notu:** ${analysis.riskNote}`)
    lines.push('- **Tanım Konumları:**')
    const seen = new Set()
    for (const f of item.list) {
      const key = `${f.file}:${f.startLine}`
      if (!seen.has(key)) {
        seen.add(key)
        lines.push(`  - \`${f.file}:${f.startLine}\` (${f.lines} satır)`)
      }
    }
    lines.push('')
  }

  // Section C
  lines.push('---')
  lines.push('')
  lines.push(`## 🟠 Grup C: Yüksek Benzerlik Gösteren Fonksiyonlar (>= %80) (${groupC.length} adet)`)
  lines.push('Bu fonksiyonların gövdeleri token düzeyinde %80 ve üzeri benzerdir. Ufak dal/koşul veya parametre farkları içerir.')
  lines.push('')
  for (const item of groupC) {
    const analysis = analyzeMergeTargetAndRisk(item.list, 'C')
    lines.push(`### \`${item.name}\` (${item.fileCount} dosya, Benzerlik: %${Math.round(item.maxSim * 100)})`)
    lines.push(`- **Önerilen Hedef Modül:** \`${analysis.suggestedModule}\``)
    lines.push(`- **Risk Notu:** ${analysis.riskNote}`)
    lines.push('- **Tanım Konumları:**')
    const seen = new Set()
    for (const f of item.list) {
      const key = `${f.file}:${f.startLine}`
      if (!seen.has(key)) {
        seen.add(key)
        lines.push(`  - \`${f.file}:${f.startLine}\` (${f.lines} satır)`)
      }
    }
    lines.push('')
  }

  // Section D
  lines.push('---')
  lines.push('')
  lines.push(`## 🔴 Grup D: Sadece İsim Aynı Olan Fonksiyonlar (${groupD.length} adet)`)
  lines.push('Bu fonksiyonlar yalnızca adaştır (örneğin UI handler adları: `handleKaydet`, `handleUpdate`, `handleBack`, `calculateTotal`). Gövdeleri ve sorumlulukları tamamen farklıdır. **ASLA BİRLEŞTİRİLMEMELİDİR.**')
  lines.push('')
  lines.push('| Fonksiyon Adı | Dosya Sayısı | Açıklama |')
  lines.push('| :--- | :--- | :--- |')
  for (const item of groupD) {
    lines.push(`| \`${item.name}\` | ${item.fileCount} dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %${Math.round(item.maxSim * 100)}) |`)
  }
  lines.push('')

  // Section Hidden
  lines.push('---')
  lines.push('')
  lines.push(`## 🕵️ Gizli Kopyalar: Farklı İsimli Ama Gövdesi Aynı Olan Fonksiyonlar (${hiddenExact.length + hiddenStruct.length} grup)`)
  lines.push('Farklı isimlerle tanımlanmış ancak 5+ satırlık mantığı birebir veya yapısal olarak tamamen aynı olan fonksiyonlardır.')
  lines.push('')
  lines.push(`### 1. Birebir Gizli Kopyalar (${hiddenExact.length} grup)`)
  lines.push('')
  for (const h of hiddenExact) {
    const names = [...new Set(h.functions.map(f => f.name))].join(', ')
    lines.push(`#### Fonksiyonlar: \`${names}\` (Hash: \`${h.hash.substring(0, 8)}\`)`)
    for (const f of h.functions) {
      lines.push(`- \`${f.name}\` -> \`${f.file}:${f.startLine}\` (${f.lines} satır)`)
    }
    lines.push('')
  }

  lines.push(`### 2. Yapısal Gizli Kopyalar (${hiddenStruct.length} grup)`)
  lines.push('')
  for (const h of hiddenStruct) {
    const names = [...new Set(h.functions.map(f => f.name))].join(', ')
    lines.push(`#### Fonksiyonlar: \`${names}\` (Yapısal Hash: \`${h.hash.substring(0, 8)}\`)`)
    for (const f of h.functions) {
      lines.push(`- \`${f.name}\` -> \`${f.file}:${f.startLine}\` (${f.lines} satır)`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

// Ensure docs/analysis exists
const analysisDir = path.join(rootDir, 'docs', 'analysis')
if (!fs.existsSync(analysisDir)) {
  fs.mkdirSync(analysisDir, { recursive: true })
}

fs.writeFileSync(path.join(analysisDir, 'duplicates.json'), JSON.stringify(duplicatesJson, null, 2), 'utf8')
fs.writeFileSync(path.join(analysisDir, 'duplicates.md'), generateDuplicatesMd(), 'utf8')

console.log('✅ Duplicates analysis completed and saved to docs/analysis/duplicates.json and duplicates.md!')
