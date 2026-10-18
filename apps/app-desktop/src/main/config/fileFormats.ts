import fs from 'fs'

/**
 * TEMİN 360 — Dosya Formatları Standardizasyonu
 * Standart ve tek aktif proje dosyası uzantısı: .temin
 */

export interface FileFormat {
  /** Uzantı (nokta olmadan, örn: 'temin') */
  ext: string
  /** Kullanıcıya gösterilecek açıklama */
  label: string
  /** Kısa açıklama (dialog filtresi adı) */
  dialogName: string
  /** Bu format varsayılan yeni dosya uzantısı mı? */
  isDefault?: boolean
}

/** Tek aktif standart dosya formatı */
export const PRIMARY_EXTENSION = 'temin'

export const SUPPORTED_FORMATS: FileFormat[] = [
  {
    ext: PRIMARY_EXTENSION,
    label: 'TEMİN 360 Proje Dosyası',
    dialogName: 'TEMİN 360 Proje Dosyası (*.temin)',
    isDefault: true
  }
]

/** Eski formatlar (Sadece geriye dönük tespit, açılışta algılama ve yükseltme için tutulur) */
export const LEGACY_EXTENSIONS = [
  'hkmp',
  'dtal',
  'dtm',
  'dte',
  'dta',
  'tmn360',
  'sqlite',
  'db'
] as const

/** Tüm aktif desteklenen uzantılar: Sadece ['temin'] */
export const allExtensions = SUPPORTED_FORMATS.map((f) => f.ext)

/** Varsayılan uzantı (yeni dosya oluştururken kullanılır) */
export const defaultFormat = SUPPORTED_FORMATS[0]

/** Electron dialog filter listesi — sadece standart aktif formatı gösterir */
export const allFormatsFilter = {
  name: 'TEMİN 360 Proje Dosyası (*.temin)',
  extensions: [PRIMARY_EXTENSION]
}

/** Her format için ayrı ayrı dialog filter listesi (Sadece standart format) */
export const perFormatFilters = SUPPORTED_FORMATS.map((f) => ({
  name: f.dialogName,
  extensions: [f.ext]
}))

/**
 * Dosya adından proje uzantısını (.temin veya eski uzantıları) temizler
 */
export function stripProjectExtension(fileName: string): string {
  if (!fileName) return ''
  return fileName.replace(/\.(temin|hkmp|dtal|dtm|dte|dta|tmn360|sqlite|db)$/i, '')
}

/**
 * Dosya yolunun geçerli bir TEMİN 360 dosyası veya yükseltilebilir eski dosya olup olmadığını doğrular
 */
export function isSupportedFile(filePath: string): boolean {
  if (!filePath || typeof filePath !== 'string') return false
  const cleanPath = filePath
    .trim()
    .replace(/^"+|"+$/g, '')
    .trim()
  if (cleanPath.startsWith('-')) return false
  const lower = cleanPath.toLowerCase()

  // 1. Standart uzantı kontrolü (.temin)
  if (lower.endsWith('.' + PRIMARY_EXTENSION)) return true

  // 2. Geriye dönük uyumluluk: Eski uzantı kontrolü
  if (LEGACY_EXTENSIONS.some((ext) => lower.endsWith('.' + ext))) return true

  // 3. Akıllı algılama: Dosya geçerli SQLite format 3 veya PK ZIP ise destekle
  try {
    if (fs.existsSync(cleanPath) && fs.statSync(cleanPath).isFile()) {
      const fd = fs.openSync(cleanPath, 'r')
      const buf = Buffer.alloc(16)
      fs.readSync(fd, buf, 0, 16, 0)
      fs.closeSync(fd)
      const sig = buf.toString('latin1')
      if (sig.includes('SQLite format 3') || (buf[0] === 0x50 && buf[1] === 0x4b)) {
        return true
      }
    }
  } catch {
    // İhmal et
  }

  return false
}
