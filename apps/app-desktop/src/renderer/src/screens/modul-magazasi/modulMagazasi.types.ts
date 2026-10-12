export type ModulKategori = 'alim_ihale' | 'satis_kiralama' | 'ozel_istisna' | 'yapim_hakedis'

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
  ikon: string
  renk: string
  durum: ModulDurumu
  versiyon: string
  surumAsamasi?: 'Alfa' | 'Beta' | 'Kararlı'
  etiketler: string[]
  belgeler: ModulBelge[]
  asamalar: ModulAsama[]
  araclar: string[]
}

export type ModulKategoriFiltresi = 'tum' | 'kurulu' | ModulKategori
