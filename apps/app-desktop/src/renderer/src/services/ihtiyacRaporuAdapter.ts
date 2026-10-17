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
 * Güvenli sayı ve değer dönüştürücüleri (0 KDV oranı ve özel miktarlar için)
 * Number.isFinite() kontrolü ile NaN ve sonsuz (Infinity) değerler engellenir.
 */
export function sanitizeMiktar(val: unknown, defaultVal = 1): number {
  if (val === null || val === undefined || val === '') return defaultVal
  const num = Number(val)
  return Number.isFinite(num) && num > 0 ? num : defaultVal
}

export function sanitizeKdvOrani(val: unknown, defaultVal = 20): number {
  if (val === null || val === undefined || val === '') return defaultVal
  const num = Number(val)
  // %0 KDV geçerli bir muafiyet oranıdır, varsayılan 20 ile ezilmemelidir!
  return Number.isFinite(num) && num >= 0 ? num : defaultVal
}

export function sanitizeBirimFiyat(val: unknown, defaultVal = 0): number {
  if (val === null || val === undefined || val === '') return defaultVal
  const num = Number(val)
  return Number.isFinite(num) && num >= 0 ? num : defaultVal
}

/**
 * İhtiyaç Raporu Kalemini, Lüzum Müzekkeresi şablonunun beklediği formata eşler.
 * Alan eşleştirmesi:
 * - kalem_adi -> malzemeAdi
 * - aciklama -> ozelligi
 * - birim -> birimi
 * - tasinir_kodu || okas_kodu || poz_no -> kodu
 * - kdv_orani -> kdvOrani (0 oranı korunur)
 * - miktar -> miktar
 */
export function mapIhtiyacKalemToLuzumMuzekkeresiItem(
  kalem: IhtiyacRaporuKalem,
  index?: number
): LuzumMuzekkeresiKalemItem {
  const miktar = sanitizeMiktar(kalem.miktar, 1)
  const birimFiyat = sanitizeBirimFiyat(kalem.tahmini_birim_fiyat, 0)
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
    kdvOrani: sanitizeKdvOrani(kalem.kdv_orani, 20),
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
    evrak_sayisi?: string
  }
): LuzumMuzekkeresiDocumentData {
  const mappedKalemler = kalemler.map((k, idx) => mapIhtiyacKalemToLuzumMuzekkeresiItem(k, idx))

  // Şablonda gerekçe alanının doğrudan görünebilmesi için işin açıklaması ile gerekçeyi harmanla
  const hasGerekce = Boolean(rapor.gerekce && rapor.gerekce.trim())
  const formattedIsinAciklamasi = hasGerekce
    ? `${rapor.baslik}\n\nİhtiyaç Gerekçesi:\n${rapor.gerekce!.trim()}`
    : rapor.baslik

  // Onay tarihi: Sadece raporda gerçek bir onay_tarihi kayıtlıysa kullanılır.
  // Dosyaya bağlanmak tek başına resmi onay tarihi oluşturmaz; onay_tarihi yoksa boş kalmalıdır.
  const resolvedOnayTarihi = rapor.onay_tarihi ? String(rapor.onay_tarihi).trim() : ''

  return {
    antetSatirlari: kurumInfo?.kurum_anteti,
    dosyaKonusu: rapor.baslik || 'Lüzum Müzekkeresi',
    // Rapor numarası ile resmi EBYS evrak sayısı farklı kavramlardır:
    // Evrak sayısı sırasıyla: ekran parametresi -> raporda kayıtlı evrak_sayisi -> bağlı dosyanın evrak_sayisi
    evrakSayisi:
      (kurumInfo?.evrak_sayisi || '').trim() ||
      (rapor.evrak_sayisi || '').trim() ||
      (rapor.dosya_evrak_sayisi || '').trim() ||
      '',
    raporNo: rapor.rapor_no,
    tarih: rapor.tarih,
    dosyaTarihi: rapor.tarih,
    onayaSunulanTarih: rapor.tarih,
    onayTarihi: resolvedOnayTarihi,
    sunulacakMakamAdi: kurumInfo?.makam_adi || 'Harcama Yetkilisine',
    isinAdi: rapor.baslik,
    isinAciklamasi: formattedIsinAciklamasi,
    gerekce: rapor.gerekce || '',
    aciklamaMaddeleri: hasGerekce ? [{ maddeMetni: rapor.gerekce!.trim() }] : [],
    hasAciklamaMaddeleri: hasGerekce,
    talepEdenPersonelAdi: rapor.talep_eden_personel || '',
    talepEdenPersonelUnvan: rapor.talep_eden_unvan || '',
    hazirlayanPersonelAdi: rapor.talep_eden_personel || '',
    hazirlayanPersonelUnvan: rapor.talep_eden_unvan || '',
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
    miktar: sanitizeMiktar(kalem.miktar, 1),
    kdv_orani: sanitizeKdvOrani(kalem.kdv_orani, 20),
    tasinir_kodu: kalem.tasinir_kodu?.trim() || null,
    okas_kodu: kalem.okas_kodu?.trim() || null,
    poz_no: kalem.poz_no?.trim() || null,
    aciklama: kalem.aciklama?.trim() || null
  }
}
