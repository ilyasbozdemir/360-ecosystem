import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import os from 'os'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const {
  parseScope,
  getFileLines,
  isTestFile,
  countFile,
  countDir,
  resolvePackages,
  readWorkspacePatterns,
  sourceDirOf,
  writeLocJsonAtomic,
  runCount,
  allowedExtensions,
  ignoredDirs
} = require('../count-loc.js')

describe('LOC Counter (count-loc.js) Kapsamlı Test Paketi', () => {
  let tempRoot: string

  beforeEach(() => {
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'loc-test-'))
  })

  afterEach(() => {
    if (fs.existsSync(tempRoot)) {
      fs.rmSync(tempRoot, { recursive: true, force: true })
    }
  })

  describe('1. Satır Ayrıştırma ve Normalizasyon Kuralları (getFileLines)', () => {
    it('boş dosya (0 bayt) için 0 satır döndürür', () => {
      expect(getFileLines('')).toEqual([])
      expect(getFileLines(null)).toEqual([])
      expect(getFileLines(undefined)).toEqual([])
    })

    it('satır sonu karakteri olmayan tek satırlık dosyayı 1 satır olarak sayar', () => {
      const res = getFileLines('const x = 1;')
      expect(res).toEqual(['const x = 1;'])
      expect(res.length).toBe(1)
    })

    it('LF ile biten tek satırlık dosyayı (Prettier standardı) 1 satır sayar, hayali boş satır üretmez', () => {
      const res = getFileLines('const x = 1;\n')
      expect(res).toEqual(['const x = 1;'])
      expect(res.length).toBe(1)
    })

    it('CRLF ile biten tek satırlık dosyayı (Windows standardı) 1 satır sayar', () => {
      const res = getFileLines('const x = 1;\r\n')
      expect(res).toEqual(['const x = 1;'])
      expect(res.length).toBe(1)
    })

    it('LF ve CRLF içeren çok satırlı dosyaları eşit sayıda satıra böler', () => {
      const lf = getFileLines('satir1\nsatir2\nsatir3\n')
      const crlf = getFileLines('satir1\r\nsatir2\r\nsatir3\r\n')
      expect(lf).toEqual(['satir1', 'satir2', 'satir3'])
      expect(crlf).toEqual(['satir1', 'satir2', 'satir3'])
      expect(lf.length).toBe(3)
      expect(crlf.length).toBe(3)
    })

    it('dosya sonundaki gerçek boş satırları (çift enter) doğru şekilde korur', () => {
      const res = getFileLines('satir1\n\n')
      expect(res).toEqual(['satir1', ''])
      expect(res.length).toBe(2)
    })

    it('yalnızca boşluk/tab içeren satırları satır olarak sayar fakat kod satırı saymaz', () => {
      const res = getFileLines('   \n\t\t\n')
      expect(res.length).toBe(2)
      let nonBlank = 0
      for (const line of res) {
        if (line.trim().length > 0) nonBlank++
      }
      expect(nonBlank).toBe(0)
    })
  })

  describe('2. Test Dosyası Sınıflandırması (isTestFile)', () => {
    it('__tests__ klasöründeki dosyaları test olarak tanır', () => {
      expect(isTestFile('src/renderer/src/screens/__tests__/Dosya.test.tsx')).toBe(true)
      expect(isTestFile('packages/document-templates/src/__tests__/registry.test.ts')).toBe(true)
    })

    it('.test.* ve .spec.* uzantılı dosyaları test olarak tanır', () => {
      expect(isTestFile('src/utils/math.test.ts')).toBe(true)
      expect(isTestFile('src/components/Button.spec.tsx')).toBe(true)
      expect(isTestFile('scripts/__tests__/version.test.ts')).toBe(true)
    })

    it('mock, fixture ve e2e dizinlerini test olarak tanır', () => {
      expect(isTestFile('src/renderer/src/__mocks__/api.ts')).toBe(true)
      expect(isTestFile('src/renderer/src/__fixtures__/sample.ts')).toBe(true)
      expect(isTestFile('apps/app-desktop/e2e/smoke.spec.ts')).toBe(true)
    })

    it('normal üretim dosyalarını test olarak sınıflandırmaz', () => {
      expect(isTestFile('src/renderer/src/screens/dosya/DosyaView.tsx')).toBe(false)
      expect(isTestFile('src/main/index.ts')).toBe(false)
      expect(isTestFile('packages/database/src/schema.ts')).toBe(false)
      expect(isTestFile('packages/document-templates/src/templates/LuzumMuzekkeresi.tsx')).toBe(
        false
      )
    })
  })

  describe('3. Dosya Sayımı ve Metrik Bütünlüğü (countFile)', () => {
    it('boş olmayan, boş satırları ve toplam satırları matematiksel olarak tutarlı hesaplar', () => {
      const filePath = path.join(tempRoot, 'sample.ts')
      fs.writeFileSync(
        filePath,
        'import React from "react"\n\nconst a = 1\n// aciklama\n\nexport default a\n'
      )
      const stat = countFile(filePath)
      expect(stat.lines).toBe(6)
      expect(stat.code).toBe(4) // nonBlank: import, const, // aciklama, export
      expect(stat.blank).toBe(2) // 2 boş satır
      expect(stat.lines).toBe(stat.code + stat.blank)
      expect(stat.isTest).toBe(false)
    })
  })

  describe('4. Dizin Tarama, Uzantı ve Hariç Tutma Filtreleri (countDir)', () => {
    it('izin verilen uzantıları (.ts, .tsx, .css, .html, .js, .jsx) dahil eder, diğerlerini (.json, .md, .png) eler', () => {
      const dir = path.join(tempRoot, 'src')
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(path.join(dir, 'app.tsx'), 'const a = 1;\n')
      fs.writeFileSync(path.join(dir, 'style.css'), 'body { margin: 0; }\n')
      fs.writeFileSync(path.join(dir, 'index.html'), '<html></html>\n')
      fs.writeFileSync(path.join(dir, 'data.json'), '{"name": "test"}\n')
      fs.writeFileSync(path.join(dir, 'readme.md'), '# Readme\n')

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
      countDir(dir, acc)

      expect(acc.files).toBe(3) // app.tsx, style.css, index.html
      expect(acc.prodFiles).toBe(3)
      expect(acc.testFiles).toBe(0)
    })

    it('.d.ts ve minified (*.min.*) dosyaları hariç tutar', () => {
      const dir = path.join(tempRoot, 'src')
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(path.join(dir, 'types.d.ts'), 'export type X = string;\n')
      fs.writeFileSync(path.join(dir, 'bundle.min.js'), 'console.log(1);\n')
      fs.writeFileSync(path.join(dir, 'valid.ts'), 'export const y = 2;\n')

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
      countDir(dir, acc)

      expect(acc.files).toBe(1)
      expect(acc.code).toBe(1)
    })

    it('hariç tutulan dizinleri (node_modules, dist, out, coverage, .git vb.) taramaz', () => {
      const dir = path.join(tempRoot, 'src')
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(path.join(dir, 'index.ts'), 'export const a = 1;\n')

      for (const ign of [
        'node_modules',
        'dist',
        'out',
        'coverage',
        '.git',
        '.next',
        'dist-local'
      ]) {
        const sub = path.join(dir, ign)
        fs.mkdirSync(sub, { recursive: true })
        fs.writeFileSync(path.join(sub, 'ignored.ts'), 'console.log("ignore me");\n')
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
      countDir(dir, acc)

      expect(acc.files).toBe(1) // yalnızca root index.ts
    })

    it('çıktı dosyasını (generated-loc.json veya .tmp) sayaca kazara dahil etmez', () => {
      const dir = path.join(tempRoot, 'src')
      fs.mkdirSync(dir, { recursive: true })
      const outputFile = path.join(dir, 'generated-loc.json')
      fs.writeFileSync(outputFile, '{"totalFiles": 999}\n')
      fs.writeFileSync(path.join(dir, 'temp.tmp'), 'temporary data\n')
      fs.writeFileSync(path.join(dir, 'code.ts'), 'const x = 10;\n')

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
      countDir(dir, acc, outputFile)

      expect(acc.files).toBe(1) // sadece code.ts
    })
  })

  describe('5. Atomik Yazma (writeLocJsonAtomic)', () => {
    it('JSON dosyasını atomik olarak yazar ve geçersiz .tmp bırakmaz', () => {
      const target = path.join(tempRoot, 'out/generated-loc.json')
      const payload = { test: 123, status: 'ok' }

      writeLocJsonAtomic(target, payload)

      expect(fs.existsSync(target)).toBe(true)
      const read = JSON.parse(fs.readFileSync(target, 'utf-8'))
      expect(read.test).toBe(123)
      expect(read.status).toBe('ok')

      // out dizininde artık .tmp kalmamalı
      const files = fs.readdirSync(path.dirname(target))
      expect(files.filter((f) => f.endsWith('.tmp')).length).toBe(0)
    })
  })

  describe('6. Workspace ve Kapsam Çözümleme Testleri (resolvePackages)', () => {
    beforeEach(() => {
      // Mock workspace tree:
      // tempRoot/
      // ├── pnpm-workspace.yaml
      // ├── apps/
      // │   ├── app-desktop/ (package.json deps: @dt/database, @temin360/document-templates)
      // │   └── app-web/     (package.json)
      // └── packages/
      //     ├── database/
      //     └── document-templates/
      fs.writeFileSync(
        path.join(tempRoot, 'pnpm-workspace.yaml'),
        'packages:\n  - "apps/*"\n  - "packages/*"\n'
      )

      const appDesktopDir = path.join(tempRoot, 'apps/app-desktop')
      fs.mkdirSync(path.join(appDesktopDir, 'src'), { recursive: true })
      fs.writeFileSync(
        path.join(appDesktopDir, 'package.json'),
        JSON.stringify({
          name: 'app-desktop',
          dependencies: {
            '@dt/database': 'workspace:*',
            '@temin360/document-templates': 'workspace:*'
          }
        })
      )

      const appWebDir = path.join(tempRoot, 'apps/app-web')
      fs.mkdirSync(path.join(appWebDir, 'src'), { recursive: true })
      fs.writeFileSync(path.join(appWebDir, 'package.json'), JSON.stringify({ name: 'app-web' }))

      const dbDir = path.join(tempRoot, 'packages/database')
      fs.mkdirSync(path.join(dbDir, 'src'), { recursive: true })
      fs.writeFileSync(path.join(dbDir, 'package.json'), JSON.stringify({ name: '@dt/database' }))

      const docDir = path.join(tempRoot, 'packages/document-templates')
      fs.mkdirSync(path.join(docDir, 'src'), { recursive: true })
      fs.writeFileSync(
        path.join(docDir, 'package.json'),
        JSON.stringify({ name: '@temin360/document-templates' })
      )
    })

    it('--scope=app yalnızca ana uygulamayı (app-desktop) çözümler', () => {
      const appDesktopDir = path.join(tempRoot, 'apps/app-desktop')
      const pkgs = resolvePackages('app', tempRoot, appDesktopDir)
      expect(pkgs.length).toBe(1)
      expect(pkgs[0].name).toBe('app-desktop')
    })

    it('--scope=app+deps ana uygulamayı ve workspace bağımlılıklarını çözümler', () => {
      const appDesktopDir = path.join(tempRoot, 'apps/app-desktop')
      const pkgs = resolvePackages('app+deps', tempRoot, appDesktopDir)
      expect(pkgs.length).toBe(3)
      const names = pkgs.map((p: any) => p.name).sort()
      expect(names).toEqual(['@dt/database', '@temin360/document-templates', 'app-desktop'].sort())
    })

    it('--scope=repo tüm workspace paketlerini (app-web dahil) çözümler', () => {
      const appDesktopDir = path.join(tempRoot, 'apps/app-desktop')
      const pkgs = resolvePackages('repo', tempRoot, appDesktopDir)
      expect(pkgs.length).toBe(4)
      const names = pkgs.map((p: any) => p.name).sort()
      expect(names).toEqual(
        ['@dt/database', '@temin360/document-templates', 'app-desktop', 'app-web'].sort()
      )
    })

    it('src/ klasörü olmayan bir paketi kök dizini üzerinden taramaya devam eder', () => {
      const noSrcDir = path.join(tempRoot, 'packages/nosrc')
      fs.mkdirSync(noSrcDir, { recursive: true })
      fs.writeFileSync(path.join(noSrcDir, 'package.json'), JSON.stringify({ name: 'nosrc-pkg' }))
      const srcDir = sourceDirOf({ dir: noSrcDir })
      expect(srcDir).toBe(noSrcDir)
    })
  })

  describe('7. Gerçek Repo Sayımı ve JSON Şema Doğrulaması (runCount)', () => {
    it('gerçek proje üzerinde runCount çalıştırıldığında paket toplamları genel toplama tam eşittir', () => {
      const result = runCount({ scope: 'app+deps' })

      expect(result.totalFiles).toBeGreaterThan(0)
      expect(result.totalLines).toBe(result.nonBlankLines + result.blankLines)
      expect(result.codeLines).toBe(result.nonBlankLines)
      expect(result.totalFiles).toBe(result.prodFiles + result.testFiles)
      expect(result.totalLines).toBe(result.prodLines + result.testLines)
      expect(result.nonBlankLines).toBe(result.prodNonBlankLines + result.testNonBlankLines)

      // Breakdown toplamları kontrolü
      const sumFiles = result.breakdown.reduce((acc: number, b: any) => acc + b.files, 0)
      const sumLines = result.breakdown.reduce((acc: number, b: any) => acc + b.totalLines, 0)
      const sumCode = result.breakdown.reduce((acc: number, b: any) => acc + b.codeLines, 0)
      const sumBlank = result.breakdown.reduce((acc: number, b: any) => acc + b.blankLines, 0)
      const sumTestFiles = result.breakdown.reduce((acc: number, b: any) => acc + b.testFiles, 0)
      const sumProdFiles = result.breakdown.reduce((acc: number, b: any) => acc + b.prodFiles, 0)

      expect(result.totalFiles).toBe(sumFiles)
      expect(result.totalLines).toBe(sumLines)
      expect(result.codeLines).toBe(sumCode)
      expect(result.blankLines).toBe(sumBlank)
      expect(result.testFiles).toBe(sumTestFiles)
      expect(result.prodFiles).toBe(sumProdFiles)

      // Var olan tüketicilerin beklediği alanların mevcudiyeti
      expect(typeof result.totalFiles).toBe('number')
      expect(typeof result.totalLines).toBe('number')
      expect(typeof result.codeLines).toBe('number')
      expect(typeof result.timestamp).toBe('string')
      expect(result.scope).toBe('app+deps')
      expect(Array.isArray(result.breakdown)).toBe(true)
    })
  })
})
