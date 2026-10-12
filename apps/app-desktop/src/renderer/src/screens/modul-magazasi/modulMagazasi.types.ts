export type ModulPaketTipi = 'modul' | 'extension' | 'utils'

export type ModulKategori =
  | 'alim_ihale'
  | 'satis_kiralama'
  | 'ozel_istisna'
  | 'yapim_hakedis'
  | 'finans_hesap'
  | 'entegrasyon'

export type ModulDurumu = 'kurulu' | 'kurulabilir' | 'yeni'

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
  durum: ModulDurumu
  versiyon: string
  surumAsamasi?: 'Alfa' | 'Beta' | 'Kararlı'
  etiketler: string[]
  belgeler: ModulBelge[]
  asamalar: ModulAsama[]
  araclar: string[]
  routePath?: string
}

export type ModulKategoriFiltresi =
  | 'tum'
  | 'kurulu'
  | 'tip_modul'
  | 'tip_extension'
  | 'tip_utils'
  | ModulKategori
