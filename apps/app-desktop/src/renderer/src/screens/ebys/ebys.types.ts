export type EbysCategory =
  | 'hepsi'
  | 'ust_yazi'
  | 'ic_yazisma'
  | 'olur_onay'
  | 'bilgi_gorus'
  | 'cevap'
  | 'gorevlendirme'
  | 'izin_olur'
  | 'dagitimli'
  | 'ekli'
  | 'cok_sayfali'

export interface EbysTemplateVariables {
  kurumAdi: string
  birimAdi: string
  sayi: string
  tarih: string
  konu: string
  muhatap: string
  muhatapEk?: string
  ilgi?: string
  metin: string
  sonucParagrafi: string
  imzaAdi: string
  imzaUnvani: string
  imzaTuru?: string
  ekler?: string[]
  dagitimGeregi?: string[]
  dagitimBilgi?: string[]
  uygunGorusAdi?: string
  uygunGorusUnvani?: string
  olurMakamAdi?: string
  olurMakamUnvani?: string
  olurTarihi?: string
  iletisimAdres?: string
  iletisimTelefon?: string
  iletisimFaks?: string
  iletisimEposta?: string
  iletisimKep?: string
  iletisimWeb?: string
  bilgiIcinAdi?: string
  bilgiIcinUnvani?: string
  evrakDogrulamaKodu?: string
}

export interface EbysTemplate {
  id: string
  name: string
  category: EbysCategory
  categoryLabel: string
  description: string
  sourceUrl: string
  sourceType: 'Resmî Mevzuat' | 'Kamu EBYS Kılavuzu' | 'e-Yazışma Rehberi' | 'Belediye / Bakanlık Şablonu'
  format: 'HTML/CSS' | 'EBYS Şablonu' | 'EYP 2.0'
  license: string
  complianceNotes: string[]
  defaultVariables: EbysTemplateVariables
  isMultiPage?: boolean
  generateHtml: (vars: EbysTemplateVariables) => string
  generateCss: () => string
}

export interface EbysResource {
  name: string
  url: string
  type: string
  format: string
  license: string
  isOfficial: boolean
  description: string
}
