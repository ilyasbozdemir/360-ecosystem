import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import path from 'path'
import fs from 'fs'
import os from 'os'
import AdmZip from 'adm-zip'
import { CURRENT_SCHEMA_VERSION } from '@dt/database'

// Mock better-sqlite3 to run under standard Node.js Vitest runner without Electron ABI mismatch
vi.mock('better-sqlite3', () => {
  return {
    default: class MockDatabase {
      prepare(): Record<string, unknown> {
        return {
          run: vi.fn(),
          all: vi.fn().mockReturnValue([]),
          get: vi.fn()
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

// Mock Electron shell and app
vi.mock('electron', () => ({
  shell: {
    openPath: vi.fn().mockResolvedValue('')
  },
  app: {
    getPath: vi.fn().mockReturnValue(os.tmpdir()),
    getVersion: vi.fn().mockReturnValue('1.0.0-test')
  },
  BrowserWindow: vi.fn()
}))

import { workspaceManager } from '../workspaceManager'
import { DtmWorkspace } from '../DtmWorkspace'

describe('Workspace Security & Path Traversal Protections', () => {
  let testDir: string

  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'temin-sec-test-'))
  })

  afterEach(() => {
    try {
      workspaceManager.close()
    } catch {
      /* noop */
    }
    try {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true })
      }
    } catch {
      /* noop */
    }
  })

  describe('workspaceManager.openAttachment path traversal guards', () => {
    it('throws error when no active workspace is open', async () => {
      await expect(workspaceManager.openAttachment('attachments/test.pdf')).rejects.toThrow(
        'Açık bir çalışma dosyası yok.'
      )
    })

    it('rejects empty, non-string, or whitespace-only relative paths', async () => {
      const workspaceFile = path.join(testDir, 'test.temin')
      workspaceManager.create(workspaceFile, 'Test Kurum')

      await expect(workspaceManager.openAttachment('')).rejects.toThrow('Geçersiz ek dosya yolu.')
      await expect(workspaceManager.openAttachment('   ')).rejects.toThrow('Geçersiz ek dosya yolu.')
      await expect(
        workspaceManager.openAttachment(null as unknown as string)
      ).rejects.toThrow('Geçersiz ek dosya yolu.')
    })

    it('blocks directory traversal attempts attempting to access files outside tempDir', async () => {
      const workspaceFile = path.join(testDir, 'test.temin')
      workspaceManager.create(workspaceFile, 'Test Kurum')

      // Malicious path traversal attempts
      const maliciousPaths = [
        '../outside.txt',
        '../../outside.txt',
        '..\\..\\windows\\system32\\calc.exe',
        'attachments/../../sensitive.txt',
        'attachments/../../../etc/passwd'
      ]

      for (const badPath of maliciousPaths) {
        await expect(workspaceManager.openAttachment(badPath)).rejects.toThrow(
          'Geçersiz dosya yolu (path traversal engellendi).'
        )
      }
    })
  })

  describe('workspaceManager.uploadAttachment input validation', () => {
    it('rejects invalid or non-existent source file paths', () => {
      const workspaceFile = path.join(testDir, 'test.temin')
      workspaceManager.create(workspaceFile, 'Test Kurum')

      expect(() => workspaceManager.uploadAttachment('')).toThrow('Geçersiz kaynak dosya yolu.')
      expect(() => workspaceManager.uploadAttachment('   ')).toThrow('Geçersiz kaynak dosya yolu.')
      expect(() =>
        workspaceManager.uploadAttachment(path.join(testDir, 'non_existent_file.pdf'))
      ).toThrow('Kaynak dosya bulunamadı veya geçerli bir dosya değil.')
    })

    it('safely uploads valid files and generates sanitized filenames', () => {
      const workspaceFile = path.join(testDir, 'test.temin')
      workspaceManager.create(workspaceFile, 'Test Kurum')

      const sampleFile = path.join(testDir, 'şartname & ek [2026].pdf')
      fs.writeFileSync(sampleFile, 'Dummy PDF content')

      const result = workspaceManager.uploadAttachment(sampleFile)
      expect(result).toBeDefined()
      expect(result.relativePath).toMatch(/^attachments\//)
      expect(result.fileName).not.toContain(' ')
      expect(result.fileName).not.toContain('[')
      expect(result.fileName).not.toContain(']')
    })
  })

  describe('DtmWorkspace Zip Slip protection', () => {
    it('detects and rejects zip files with path traversal entries', () => {
      const maliciousZipPath = path.join(testDir, 'malicious.temin')
      const zip = new AdmZip()
      zip.addFile(
        'meta.json',
        Buffer.from(
          JSON.stringify({
            dtal_version: '1.0',
            schema_version: CURRENT_SCHEMA_VERSION,
            institution: 'Test Kurum'
          })
        )
      )
      zip.addFile('payload.txt', Buffer.from('payload content'))
      // Craft Zip Slip entry
      zip.getEntries()[1].entryName = '../../malicious_file.txt'
      fs.writeFileSync(maliciousZipPath, zip.toBuffer())

      const ws = new DtmWorkspace()
      let thrown: Error | null = null
      try {
        ws.openWorkspace(maliciousZipPath)
      } catch (err: unknown) {
        thrown = err as Error
      }
      expect(thrown?.message).toMatch(/Zip Slip/)
      ws.closeWorkspace()
    })
  })
})
