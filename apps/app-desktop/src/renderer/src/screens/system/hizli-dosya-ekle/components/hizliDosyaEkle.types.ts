export interface DosyaRow {
  _key: string
  id: number | null // null => yeni kayit, number => guncelleme
  dosya_no: string
  dt_no: string
  dosya_adi: string
  aciklama: string
  ihale_turu: string
  ihale_sekli: string
  ihale_tarihi: string
  ihale_asamasi: string
  _dirty: boolean // kullanici degistirdi mi?
}

export const IHALE_TURLERI = ['Mal', 'Hizmet', 'Yapım İşi', 'Danışmanlık']
export const IHALE_SEKILLERI = ['22/d', '22/a', '22/b', '22/c', 'İhale (4734)', 'Diğer']
export const IHALE_ASAMALARI = [
  'Hazırlık',
  'Piyasa Araştırması',
  'Teklif Aşaması',
  'Sözleşme',
  'Muayene & Kabul & Ödeme',
  'Tamamlandı',
  'İptal'
]

export const mapTur = (t: string) => {
  if (t === 'Hizmet') return 'hizmet'
  if (t === 'Yapım İşi') return 'yapim_isi'
  if (t === 'Danışmanlık') return 'danismanlik'
  return 'mal'
}

export const mapStatus = (a: string) => {
  if (a === 'Tamamlandı') return 'tamamlandi'
  if (a === 'İptal') return 'iptal'
  return 'devam_ediyor'
}

export const reverseMapTur = (t: string) => {
  if (t === 'hizmet') return 'Hizmet'
  if (t === 'yapim_isi') return 'Yapım İşi'
  if (t === 'danismanlik') return 'Danışmanlık'
  return 'Mal'
}

export const reverseMapStatus = (s: string) => {
  if (s === 'tamamlandi') return 'Tamamlandı'
  if (s === 'iptal') return 'İptal'
  return 'Hazırlık'
}

export const emptyRow = (): DosyaRow => ({
  _key: Math.random().toString(36).slice(2),
  id: null,
  dosya_no: '',
  dt_no: '',
  dosya_adi: '',
  aciklama: '',
  ihale_turu: 'Mal',
  ihale_sekli: '22/d',
  ihale_tarihi: '',
  ihale_asamasi: 'Hazırlık',
  _dirty: false
})
