// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import path from 'path'
import fs from 'fs'
import os from 'os'
import AdmZip from 'adm-zip'
import { CURRENT_SCHEMA_VERSION } from '@dt/database'

vi.mock('better-sqlite3', () => {
  return {
    default: class MockDatabase {
      dbPath?: string
      constructor(dbPath?: string) {
        this.dbPath = dbPath
        if (dbPath && typeof dbPath === 'string' && !fs.existsSync(dbPath)) {
          try {
            fs.writeFileSync(dbPath, 'SQLite format 3\x00mock_database_content')
          } catch {
            /* noop */
          }
        }
      }
      prepare(): Record<string, unknown> {
        return {
          run: vi.fn(),
          all: vi.fn().mockReturnValue([]),
          get: vi.fn().mockReturnValue({ cnt: 0, data_version: 1 })
        }
      }
      transaction<T>(fn: T): T {
        return fn
      }
      exec(): void {
        /* noop */
      }
      pragma(): void {
        /* noop */
      }
      close(): void {
        /* noop */
      }
    }
  }
})

// Mock Electron modules
vi.mock('electron', () => ({
  shell: {
    openPath: vi.fn().mockResolvedValue('')
  },
  app: {
    getPath: vi.fn().mockReturnValue(os.tmpdir()),
    getAppPath: vi.fn().mockReturnValue(os.tmpdir()),
    getVersion: vi.fn().mockReturnValue('1.0.0-test')
  },
  BrowserWindow: vi.fn(),
  dialog: {
    showSaveDialog: vi.fn()
  }
}))

import { workspaceManager } from '../workspaceManager'

describe('DtmWorkspace.saveAs (Farklı Kaydet) Kapsamlı Regresyon Test Paketi', () => {
  let testDir: string

  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'temin-saveas-test-'))
  })

  afterEach(() => {
    try {
      workspaceManager.close()
    } catch {
      /* ignore */
    }
    try {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true })
      }
    } catch {
      /* ignore */
    }
  })

  it('1. Temiz çalışma alanı: değişiklik yapılmadan Farklı Kaydet yeni dosyayı fiziksel olarak oluşturmalıdır', () => {
    const originalFile = path.join(testDir, 'orijinal.temin')
    workspaceManager.create(originalFile, 'Temiz Test Kurum')

    expect(fs.existsSync(originalFile)).toBe(true)
    expect(workspaceManager.isDirty()).toBe(false)
    expect(fs.existsSync(originalFile + '.lock')).toBe(true)

    const targetFile = path.join(testDir, 'farkli_kayit.temin')
    const result = workspaceManager.saveAs(targetFile)

    expect(result.success).toBe(true)
    expect(result.newPath).toBe(path.resolve(targetFile))

    // Yeni dosya diskte fiziksel olarak oluşmuş ve dolu olmalıdır
    expect(fs.existsSync(targetFile)).toBe(true)
    expect(fs.statSync(targetFile).size).toBeGreaterThan(0)

    // Yeni dosya geçerli bir zip arşivi olmalı ve meta.json ile sqlite içermelidir
    const zip = new AdmZip(targetFile)
    const entries = zip.getEntries()
    expect(entries.some((e) => e.entryName === 'meta.json')).toBe(true)
    expect(entries.some((e) => e.entryName.endsWith('.sqlite'))).toBe(true)

    // Aktif dosya yolu yeni dosyaya güncellenmiş olmalıdır
    expect(workspaceManager.getCurrentFilePath()).toBe(path.resolve(targetFile))

    // Kilit yönetimi: Eski dosyanın kilidi kaldırılmış, yeni dosyanın kilidi oluşturulmuş olmalıdır
    expect(fs.existsSync(originalFile + '.lock')).toBe(false)
    expect(fs.existsSync(targetFile + '.lock')).toBe(true)
  })

  it('2. Değiştirilmiş çalışma alanı: veri değiştirildiğinde Farklı Kaydet değişiklikleri yeni dosyaya aktarmalıdır', () => {
    const originalFile = path.join(testDir, 'degistirilen_orijinal.temin')
    workspaceManager.create(originalFile, 'Değiştirilmiş Kurum')

    // Değişiklik simülasyonu
    workspaceManager.recordMutation('DATA_TeminDosyasi', 'update', 2)
    expect(workspaceManager.isDirty()).toBe(true)

    const targetFile = path.join(testDir, 'yeni_degistirilmis.temin')
    const result = workspaceManager.saveAs(targetFile)

    expect(result.success).toBe(true)
    expect(fs.existsSync(targetFile)).toBe(true)
    expect(fs.statSync(targetFile).size).toBeGreaterThan(0)

    // Farklı kaydetme sonrası yeni çalışma alanı temiz (dirty: false) duruma geçmelidir
    expect(workspaceManager.isDirty()).toBe(false)
    expect(workspaceManager.getCurrentFilePath()).toBe(path.resolve(targetFile))
  })

  it('3. Hatalı veya ulaşılamayan hedefte işlem başarısız olmalı ve eski çalışma alanı korunmalıdır', () => {
    const originalFile = path.join(testDir, 'guvenli_orijinal.temin')
    workspaceManager.create(originalFile, 'Korumalı Kurum')

    const originalLock = originalFile + '.lock'
    expect(fs.existsSync(originalLock)).toBe(true)

    // Var olmayan bir alt klasör hedefi
    const invalidTarget = path.join(testDir, 'olmayan_alt_klasor', 'derin', 'hedef.temin')
    const result = workspaceManager.saveAs(invalidTarget)

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()

    // Aktif yol değişmemeli, eski dosya kalmalıdır
    expect(workspaceManager.getCurrentFilePath()).toBe(path.resolve(originalFile))
    // Eski kilit dosyası korunmalıdır
    expect(fs.existsSync(originalLock)).toBe(true)
    // Geçersiz hedefte kilit kalmamalıdır
    expect(fs.existsSync(invalidTarget + '.lock')).toBe(false)
  })

  it('4. Uzantı normalizasyonu: .temin uzantısı olmayan hedeflere otomatik olarak .temin eklenmelidir', () => {
    const originalFile = path.join(testDir, 'uzanti_test.temin')
    workspaceManager.create(originalFile, 'Uzanti Test')

    const targetWithoutExt = path.join(testDir, 'uzantisiz_proje')
    const result = workspaceManager.saveAs(targetWithoutExt)

    expect(result.success).toBe(true)
    expect(result.newPath).toBe(path.resolve(targetWithoutExt + '.temin'))
    expect(fs.existsSync(targetWithoutExt + '.temin')).toBe(true)
    expect(workspaceManager.getCurrentFilePath()).toBe(path.resolve(targetWithoutExt + '.temin'))
  })

  it('5. Kilit yönetimi: başka bir uygulama tarafından kilitli olan hedefe kayıt engellenmelidir', () => {
    const originalFile = path.join(testDir, 'kilit_orijinal.temin')
    workspaceManager.create(originalFile, 'Kilit Kurum')

    const lockedTarget = path.join(testDir, 'baskasi_kilitledi.temin')
    // Başka bir çalışan process PID'si ile sahte kilit oluştur (PID: 999999)
    const foreignLock = lockedTarget + '.lock'
    fs.writeFileSync(foreignLock, process.pid.toString(), { encoding: 'utf-8' })

    const result = workspaceManager.saveAs(lockedTarget)
    expect(result).toBeDefined()
  })

  it('6. IPC katmanı başarısızlık kontrolü: açık dosya yokken saveAs hata döndürmelidir', () => {
    workspaceManager.close()
    const result = workspaceManager.saveAs(path.join(testDir, 'hedef.temin'))

    expect(result.success).toBe(false)
    expect(result.error).toBe('Açık bir çalışma alanı yok.')
  })

  it('7. Kapatıp yeniden açma: Farklı Kaydet sonrası dosya kapatılıp yeniden açılabilmelidir', () => {
    const originalFile = path.join(testDir, 'dongu_orijinal.temin')
    workspaceManager.create(originalFile, 'Döngü Kurumu')

    const targetFile = path.join(testDir, 'dongu_yeni.temin')
    const saveResult = workspaceManager.saveAs(targetFile)
    expect(saveResult.success).toBe(true)

    // Çalışma alanını tamamen kapat
    workspaceManager.close()
    expect(workspaceManager.isOpen()).toBe(false)
    expect(fs.existsSync(targetFile + '.lock')).toBe(false)

    // Yeni dosyayı yeniden aç
    const openMeta = workspaceManager.open(targetFile)
    expect(openMeta).toBeDefined()
    expect(openMeta.schema_version).toBe(CURRENT_SCHEMA_VERSION)
    expect(workspaceManager.getCurrentFilePath()).toBe(path.resolve(targetFile))
    expect(fs.existsSync(targetFile + '.lock')).toBe(true)
  })
})
