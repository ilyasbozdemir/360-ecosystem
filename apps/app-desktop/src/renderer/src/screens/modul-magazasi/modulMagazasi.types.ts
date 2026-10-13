/**
 * Modül & Belge Mağazası Tipleri ve Sabit Tanımları
 */

/** Paket türleri (İngilizce sabit dizi) */
export const MODULE_PACKAGE_TYPES = ['modul', 'extension', 'utils'] as const
export type ModulPaketTipi = (typeof MODULE_PACKAGE_TYPES)[number]

/** Modül kategorileri (İngilizce/sabit dizi) */
export const MODULE_CATEGORIES = [
  'alim_ihale',
  'satis_kiralama',
  'ozel_istisna',
  'yapim_hakedis',
  'finans_hesap',
  'entegrasyon'
] as const
export type ModulKategori = (typeof MODULE_CATEGORIES)[number]

/** Modül sürüm olgunluk aşamaları */
export const MODULE_RELEASE_STAGES = ['Alfa', 'Beta', 'Kararlı'] as const
export type SurumAsamasi = (typeof MODULE_RELEASE_STAGES)[number]

/** Kategori görsel ve etiket yapılandırması */
export const MODULE_CATEGORY_LABELS: Record<ModulKategori, { label: string; icon: string }> = {
  alim_ihale: { label: 'Alım & İhale', icon: 'FileCheck' },
  satis_kiralama: { label: 'Satış & Kiralama', icon: 'Landmark' },
  ozel_istisna: { label: 'Özel İstisna & 22/a-b-c', icon: 'ShieldCheck' },
  yapim_hakedis: { label: 'Yapım & Hakediş', icon: 'FileSpreadsheet' },
  finans_hesap: { label: 'Finans & Hesaplama', icon: 'Coins' },
  entegrasyon: { label: 'Entegrasyon & Denetim', icon: 'Puzzle' }
}

/** Çöp kutusuna taşınan modül kayıt öğesi */
export interface ModuleTrashItem {
  id: string
  trashedAt: string
  expiresAt: string
  retentionDays: number
}

export interface ModulBelge {
  ad: string
  kod: string
  aciklama: string
  zorunluMu: boolean
}

export interface ModulAsama {
  sira: number
  baslik: string
  aciklama: string
}

export interface ModulPaketi {
  id: string
  kod: string
  baslik: string
  kisaAciklama: string
  detayliAciklama: string
  mevzuat: string
  kategori: ModulKategori
  paketTipi?: ModulPaketTipi
  ikon: string
  renk: string
  versiyon: string
  surumAsamasi?: SurumAsamasi
  etiketler: string[]
  belgeler: ModulBelge[]
  asamalar: ModulAsama[]
  araclar: string[]
  routePath?: string
  /** Modül kaldırılabilir / çöp kutusuna taşınabilir mi? (Çekirdek sistem modülleri silinemez, false olur) */
  removable?: boolean
  silinebilir?: boolean
}

/** Modülün kaldırılabilir olup olmadığını belirleyen kontrol */
export const isModulRemovable = (modul?: ModulPaketi | null): boolean => {
  if (!modul) return false
  if (modul.id === 'kik-dogrudan-temin-22d') return false
  if (modul.removable === false) return false
  if (modul.silinebilir === false) return false
  return true
}

export type ModulKategoriFiltresi =
  | 'tum'
  | 'kurulu'
  | 'cop_kutusu'
  | 'tip_modul'
  | 'tip_extension'
  | 'tip_utils'
  | ModulKategori
