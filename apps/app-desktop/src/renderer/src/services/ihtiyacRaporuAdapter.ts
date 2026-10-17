import { IhtiyacRaporu, IhtiyacRaporuKalem } from './ihtiyacRaporuService'

/**
 * Lüzum Müzekkeresi ve Onay Eki şablonlarının beklediği tekil kalem veri yapısı
 */
export interface LuzumMuzekkeresiKalemItem {
  siraNo: number
  kodu: string
  malzemeAdi: string
  ozelligi: string
  birimi: string
  kdvOrani: number
  miktar: number
  // Ayrı tutulan kod alanları (İleri düzey şablonlar ve denetim için)
  tasinirKodu: string
  okasKodu: string
  pozNo: string
  tahminiBirimFiyat: number
  satirTutari: number
}

/**
 * Lüzum Müzekkeresi şablonuna doğrudan aktarılabilir tam belge veri modeli
 */
export interface LuzumMuzekkeresiDocumentData {
  antetSatirlari?: string[]
  dosyaKonusu: string
  evrakSayisi: string
  tarih: string
  onayaSunulanTarih: string
  onayTarihi: string
  sunulacakMakamAdi: string
  isinAciklamasi: string
  gerekce: string
  talepEdenPersonelAdi: string
  talepEdenPersonelUnvan: string
  ihtiyacYeri: string
  ihtiyacKalemleri: LuzumMuzekkeresiKalemItem[]
  tahminiButce: number
  notlar: string
  olurYazisi: boolean
  kurumIci: boolean
  [key: string]: unknown
}

/**
 * Mevcut alım dosyasının İhtiyaç Listesi tablosuna (DATA_TeminKalem) eklenecek veri modeli
 */
export interface TeminKalemInsertPayload {
  temin_dosya_id: number
  sira_no: number
  kalem_adi: string
  tipi: string
  birim: string
  miktar: number
  kdv_orani: number
  tasinir_kodu: string | null
  okas_kodu: string | null
  poz_no: string | null
  aciklama: string | null
}

/**
 * İhtiyaç Raporu Kalemini, Lüzum Müzekkeresi şablonunun beklediği formata eşler.
 * Alan eşleştirmesi:
 * - kalem_adi -> malzemeAdi
 * - aciklama -> ozelligi
 * - birim -> birimi
 * - tasinir_kodu || okas_kodu || poz_no -> kodu
 * - kdv_orani -> kdvOrani
 * - miktar -> miktar
 */
export function mapIhtiyacKalemToLuzumMuzekkeresiItem(
  kalem: IhtiyacRaporuKalem,
  index?: number
): LuzumMuzekkeresiKalemItem {
  const miktar = Number(kalem.miktar) || 1
  const birimFiyat = Number(kalem.tahmini_birim_fiyat) || 0
  const satirTutari = miktar * birimFiyat

  // Kod öncelik çözümlemesi (Taşınır Kodu > OKAS Kodu > Poz No)
  const resolvedKodu =
    (kalem.tasinir_kodu || '').trim() ||
    (kalem.okas_kodu || '').trim() ||
    (kalem.poz_no || '').trim() ||
    ''

  return {
    siraNo: kalem.sira_no || (index !== undefined ? index + 1 : 1),
    kodu: resolvedKodu,
    malzemeAdi: (kalem.kalem_adi || '').trim(),
    ozelligi: (kalem.aciklama || '').trim(),
    birimi: (kalem.birim || 'Adet').trim(),
    kdvOrani: Number(kalem.kdv_orani) || 20,
    miktar,
    tasinirKodu: (kalem.tasinir_kodu || '').trim(),
    okasKodu: (kalem.okas_kodu || '').trim(),
    pozNo: (kalem.poz_no || '').trim(),
    tahminiBirimFiyat: birimFiyat,
    satirTutari
  }
}

/**
 * İhtiyaç Raporunu ve kalemlerini Lüzum Müzekkeresi şablon verisine dönüştürür.
 */
export function mapRaporToLuzumMuzekkeresiData(
  rapor: IhtiyacRaporu,
  kalemler: IhtiyacRaporuKalem[],
  kurumInfo?: {
    kurum_anteti?: string[]
    makam_adi?: string
  }
): LuzumMuzekkeresiDocumentData {
  const mappedKalemler = kalemler.map((k, idx) => mapIhtiyacKalemToLuzumMuzekkeresiItem(k, idx))

  return {
    antetSatirlari: kurumInfo?.kurum_anteti,
    dosyaKonusu: rapor.baslik || 'Lüzum Müzekkeresi',
    evrakSayisi: rapor.rapor_no,
    tarih: rapor.tarih,
    onayaSunulanTarih: rapor.tarih,
    onayTarihi: rapor.onay_tarihi || rapor.tarih,
    sunulacakMakamAdi: kurumInfo?.makam_adi || 'Harcama Yetkilisine',
    isinAciklamasi: rapor.baslik,
    gerekce: rapor.gerekce || '',
    talepEdenPersonelAdi: rapor.talep_eden_personel || '',
    talepEdenPersonelUnvan: rapor.talep_eden_unvan || '',
    ihtiyacYeri: rapor.birim_adi || '',
    ihtiyacKalemleri: mappedKalemler,
    tahminiButce: Number(rapor.tahmini_butce) || 0,
    notlar: rapor.notlar || '',
    olurYazisi: true,
    kurumIci: true
  }
}

/**
 * İhtiyaç Raporu Kalemini, DATA_TeminKalem tablosuna aktarılacak formata dönüştürür.
 */
export function mapIhtiyacKalemToTeminKalem(
  kalem: IhtiyacRaporuKalem,
  teminDosyaId: number,
  siraNo: number
): TeminKalemInsertPayload {
  return {
    temin_dosya_id: teminDosyaId,
    sira_no: siraNo,
    kalem_adi: (kalem.kalem_adi || '').trim(),
    tipi: kalem.tipi || 'Mal',
    birim: (kalem.birim || 'Adet').trim(),
    miktar: Number(kalem.miktar) || 1,
    kdv_orani: Number(kalem.kdv_orani) || 20,
    tasinir_kodu: kalem.tasinir_kodu?.trim() || null,
    okas_kodu: kalem.okas_kodu?.trim() || null,
    poz_no: kalem.poz_no?.trim() || null,
    aciklama: kalem.aciklama?.trim() || null
  }
}
