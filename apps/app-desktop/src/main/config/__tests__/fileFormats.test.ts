import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import os from 'os'
import {
  isSupportedFile,
  allExtensions,
  defaultFormat,
  allFormatsFilter,
  perFormatFilters,
  LEGACY_EXTENSIONS,
  stripProjectExtension,
  PRIMARY_EXTENSION
} from '../fileFormats'

describe('File Formats Configuration & Validation (Standardized .temin)', () => {
  let tempDir: string

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'temin360-test-'))
  })

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
  })

  it('should have .temin as single active format', () => {
    expect(PRIMARY_EXTENSION).toBe('temin')
    expect(defaultFormat).toBeDefined()
    expect(defaultFormat.ext).toBe('temin')
    expect(defaultFormat.isDefault).toBe(true)
    expect(allExtensions).toEqual(['temin'])
  })

  it('should only expose .temin in dialog filters', () => {
    expect(allFormatsFilter.extensions).toEqual(['temin'])
    expect(perFormatFilters).toHaveLength(1)
    expect(perFormatFilters[0].extensions).toEqual(['temin'])
  })

  it('should maintain legacy extension definitions for migration detection', () => {
    expect(LEGACY_EXTENSIONS).toContain('hkmp')
    expect(LEGACY_EXTENSIONS).toContain('dtal')
    expect(LEGACY_EXTENSIONS).toContain('dtm')
    expect(LEGACY_EXTENSIONS).toContain('dte')
    expect(LEGACY_EXTENSIONS).toContain('dta')
    expect(LEGACY_EXTENSIONS).toContain('tmn360')
    expect(LEGACY_EXTENSIONS).toContain('sqlite')
    expect(LEGACY_EXTENSIONS).toContain('db')
  })

  it('should strip project extensions accurately', () => {
    expect(stripProjectExtension('Belediye_Projesi.temin')).toBe('Belediye_Projesi')
    expect(stripProjectExtension('Eski_Proje.hkmp')).toBe('Eski_Proje')
    expect(stripProjectExtension('Veri.dtal')).toBe('Veri')
    expect(stripProjectExtension('Arsiv.tmn360')).toBe('Arsiv')
    expect(stripProjectExtension('')).toBe('')
  })

  it('should return false for invalid or empty file paths', () => {
    expect(isSupportedFile('')).toBe(false)
    // @ts-expect-error testing runtime null safety
    expect(isSupportedFile(null)).toBe(false)
    // @ts-expect-error testing runtime undefined safety
    expect(isSupportedFile(undefined)).toBe(false)
    expect(isSupportedFile('-flag-arg')).toBe(false)
  })

  it('should return true for active and legacy supported file extensions', () => {
    expect(isSupportedFile('C:\\Projects\\test.temin')).toBe(true)
    expect(isSupportedFile('/user/docs/file.hkmp')).toBe(true)
    expect(isSupportedFile('archive.tmn360')).toBe(true)
    expect(isSupportedFile('data.dtal')).toBe(true)
    expect(isSupportedFile('data.sqlite')).toBe(true)
  })

  it('should return false for unsupported file extensions', () => {
    expect(isSupportedFile('document.docx')).toBe(false)
    expect(isSupportedFile('script.js')).toBe(false)
    expect(isSupportedFile('executable.exe')).toBe(false)
  })

  it('should correctly strip surrounding quotes in file path', () => {
    expect(isSupportedFile('"project.temin"')).toBe(true)
    expect(isSupportedFile('  "project.dtal"  ')).toBe(true)
  })

  it('should identify a SQLite database file by magic bytes regardless of extension', () => {
    const customFilePath = path.join(tempDir, 'mydata.customext')
    // SQLite header magic string: 'SQLite format 3\0'
    const header = Buffer.from('SQLite format 3\0', 'binary')
    fs.writeFileSync(customFilePath, header)

    expect(isSupportedFile(customFilePath)).toBe(true)
  })

  it('should identify a ZIP/TEMIN archive file by PK magic bytes regardless of extension', () => {
    const zipFilePath = path.join(tempDir, 'data.unknown')
    // PK header: 0x50, 0x4B
    const header = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x00, 0x00])
    fs.writeFileSync(zipFilePath, header)

    expect(isSupportedFile(zipFilePath)).toBe(true)
  })
})
