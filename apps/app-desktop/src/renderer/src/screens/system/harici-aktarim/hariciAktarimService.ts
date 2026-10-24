import { validateDogrudanTeminPayload } from './hariciAktarimSchema'
import {
  DogrudanTeminDosyasi,
  DosyaBilgileri,
  ExistingDossierSummary,
  KazananFirma,
  KomisyonUyesi,
  MalzemeKalemi,
  ParsedJsonResult,
  SyncOptions,
  SyncResult,
  TeklifKaydi
} from './types'

export function normalizeTur(alimTuru?: string): string {
  if (!alimTuru) return 'mal'
  const lower = alimTuru.toLowerCase()
  if (lower.includes('hizmet')) return 'hizmet'
  if (lower.includes('yapım') || lower.includes('yapim')) return 'yapim_isi'
  if (lower.includes('danışman') || lower.includes('danisman')) return 'danismanlik'
  return 'mal'
}

export function normalizeSingleDossier(raw: any, index = 0): DogrudanTeminDosyasi | null {
  if (!raw || typeof raw !== 'object') return null

  // 1. Raw 'f' (Dosya Alanları) -> dosyaBilgileri
  const f = raw.f || {}
  const db = raw.dosyaBilgileri || {}

  const getVal = (...keys: string[]): string => {
    for (const k of keys) {
      if (f[k] !== undefined && f[k] !== null && String(f[k]).trim() !== '') {
        return String(f[k]).trim()
      }
      if (db[k] !== undefined && db[k] !== null && String(db[k]).trim() !== '') {
        return String(db[k]).trim()
      }
    }
    return ''
  }

  const isinAdi =
    getVal(
      'İşin Adı / Tanımı',
      'isinAdi',
      'isin_adi',
      'işin adı',
      'İşin Adı',
      'Açıklama',
      'aciklama'
    ) || undefined

  const dosyaNo =
    getVal('Dosya No', 'dosyaNo', 'dosya_no') ||
    getVal('Doğrudan Temin Numarası', 'dogrudanTeminNumarasi') ||
    (raw.id ? String(raw.id) : undefined)

  const dosyaBilgileri: DosyaBilgileri = {
    dosyaNo,
    isinAdi,
    dosyaAcilisTarihi:
      getVal('Dosya Açılış Tarihi', 'dosyaAcilisTarihi', 'dosya_acilis_tarihi') || undefined,
    butceYili: getVal('Bütçe Yılı', 'butceYili', 'butce_yili') || String(new Date().getFullYear()),
    butce: getVal('Bütçe', 'butce') || 'Genel Bütçe',
    dogrudanTeminNumarasi: getVal('Doğrudan Temin Numarası', 'dogrudanTeminNumarasi') || dosyaNo,
    ihaleTarihi: getVal('İhale Tarihi', 'ihaleTarihi') || undefined,
    ihaleAsamasi: getVal('İhale Aşaması', 'ihaleAsamasi') || 'Teklif Toplama',
    aciklama: getVal('Açıklama', 'aciklama') || undefined,
    ihalesiYapilacakBirim: getVal('İhalesi Yapılacak Birim', 'ihalesiYapilacakBirim') || undefined,
    sunulacakMakam: getVal('Sunulacak Makam', 'sunulacakMakam') || undefined,
    ihtiyacYeri: getVal('İhtiyaç Yeri', 'ihtiyacYeri') || undefined,
    talepTarihSayisi: getVal('Talep Tarih/Sayısı', 'talepTarihSayisi') || undefined,
    kurumsalKod: getVal('Kurumsal Kod', 'kurumsalKod') || undefined,
    fonksiyonelKod: getVal('Fonksiyonel Kod', 'fonksiyonelKod') || undefined,
    finansalKod: getVal('Finansal Kod', 'finansalKod') || undefined,
    ihaleTipi: getVal('İhale Tipi', 'ihaleTipi') || 'Doğrudan Temin',
    alimTuru: getVal('Alım Türü', 'alimTuru') || 'Mal Alımı',
    madde: getVal('Madde', 'madde') || '22/d*',
    teklifSozlesmeTuru: getVal('Teklif ve Sözleşme Türü', 'teklifSozlesmeTuru') || 'Birim Fiyat',
    altYuklenici: getVal('Alt yüklenici olacak mı', 'altYuklenici') || 'Hayır',
    kismiTeklif: getVal('Kısmi teklif verilecek mi', 'kismiTeklif') || 'Hayır',
    fiyatFarkiDayanagi: getVal('Fiyat Farkı Dayanağı', 'fiyatFarkiDayanagi') || undefined,
    yatirimProjeNo: getVal('Yatırım Proje Numarası', 'yatirimProjeNo') || undefined,
    avans: getVal('Avans Verilecek mi', 'avans') || 'Hayır',
    yaklasikMaliyetDurumu:
      getVal('Yaklaşık Maliyet', 'yaklasikMaliyetDurumu') || 'Burada Hesaplanacak',
    kdv: getVal('KDV', 'kdv') || 'Hariç',
    hesaplamaEsasi: getVal('Hesaplama Esası', 'hesaplamaEsasi') || 'En düşük fiyat esasına göre',
    hesaplamada:
      getVal('Hesaplamada', 'hesaplamada') || 'Sadece araştırma fiyatları dikkate alınacak',
    tibbiCihaz: getVal('Tıbbi Cihaz Alımı mı', 'tibbiCihaz') || 'Hayır',
    irtibatYetkilisi: getVal('İrtibat Yetkilisi', 'irtibatYetkilisi') || undefined,
    sonTeklifVermeTarihSaati:
      getVal('Son Teklif Verme Tarih/Saati', 'sonTeklifVermeTarihSaati') || undefined,
    tahminiBitisTarihi: getVal('Tahmini Bitiş Tarihi', 'tahminiBitisTarihi') || undefined
  }

  // 2. Malzemeler ('mat' veya 'malzemeler')
  const malzemeler: MalzemeKalemi[] = []
  if (Array.isArray(raw.mat) && raw.mat.length > 0) {
    raw.mat.forEach((row: any, idx: number) => {
      if (!Array.isArray(row)) return
      const ad = String(row[2] || row[4] || row[3] || '').trim()
      if (!ad) return
      const miktarNum = parseFloat(String(row[6]).replace(',', '.')) || 1
      const birimFiyatNum = parseFloat(String(row[7]).replace(',', '.')) || 0
      malzemeler.push({
        siraNo: parseInt(String(row[0]), 10) || idx + 1,
        malzemeKodu: row[1] ? String(row[1]).trim() : undefined,
        malzemeAdi: ad,
        ozelligi: row[3] ? String(row[3]).trim() : undefined,
        birimi: row[4] ? String(row[4]).trim() : 'Adet',
        kdvOrani: row[5] !== undefined ? String(row[5]).trim() : '20',
        miktar: miktarNum,
        birimFiyat: birimFiyatNum,
        toplamTutar: miktarNum * birimFiyatNum,
        fiyatKaynagi: row[8] ? String(row[8]).trim() : undefined,
        tasinirKodu: row[9] ? String(row[9]).trim() : undefined,
        okasKodu: row[10] ? String(row[10]).trim() : undefined
      })
    })
  } else if (Array.isArray(raw.malzemeler)) {
    raw.malzemeler.forEach((m: any, idx: number) => {
      if (!m || !m.malzemeAdi) return
      malzemeler.push({
        siraNo: m.siraNo || idx + 1,
        malzemeKodu: m.malzemeKodu,
        malzemeAdi: m.malzemeAdi,
        ozelligi: m.ozelligi,
        birimi: m.birimi || 'Adet',
        kdvOrani: m.kdvOrani ?? '20',
        miktar: parseFloat(m.miktar) || 1,
        birimFiyat: parseFloat(m.birimFiyat) || 0,
        toplamTutar:
          parseFloat(m.toplamTutar) ||
          (parseFloat(m.miktar) || 1) * (parseFloat(m.birimFiyat) || 0),
        fiyatKaynagi: m.fiyatKaynagi,
        tasinirKodu: m.tasinirKodu,
        okasKodu: m.okasKodu
      })
    })
  }

  // 3. Teklifler ('tek' veya 'teklifler')
  const teklifler: TeklifKaydi[] = []
  const rawTeklifler = Array.isArray(raw.tek) && raw.tek.length > 0 ? raw.tek : raw.teklifler
  if (Array.isArray(rawTeklifler)) {
    rawTeklifler.forEach((t: any, idx: number) => {
      if (!t || (!t.firma && !t.firmaUnvani)) return
      const firmaAd = String(t.firma || t.firmaUnvani).trim()
      let tutarNum = parseFloat(String(t.tutar || t.tutarKdvHaric || '').replace(',', '.')) || 0
      if (!tutarNum && Array.isArray(t.kalemler)) {
        tutarNum = t.kalemler.reduce(
          (acc: number, v: any) => acc + (parseFloat(String(v).replace(',', '.')) || 0),
          0
        )
      }
      teklifler.push({
        id: t.id ? String(t.id) : `tek_${idx + 1}`,
        siraNo: t.siraNo || idx + 1,
        firma: firmaAd,
        firmaNo: t.firmaNo ? String(t.firmaNo) : undefined,
        vergiNo: t.vergiNo ? String(t.vergiNo) : undefined,
        iletisim: t.iletisim ? String(t.iletisim) : undefined,
        yer: t.yer ? String(t.yer) : undefined,
        yetkili: t.yetkili ? String(t.yetkili) : undefined,
        istekTarihi: t.istekTarihi || undefined,
        istekSekli: t.sekil || t.istekSekli || 'E-posta',
        durum: t.durum || 'Teklif Geldi',
        teklifTarihi: t.teklifTarihi || undefined,
        tutarKdvHaric: tutarNum,
        kdvOrani: t.kdv ?? '20',
        gecerlilikGun: t.gecerlilik,
        not: t.not,
        kalemFiyatlari: Array.isArray(t.kalemler) ? t.kalemler : t.kalemFiyatlari
      })
    })
  }

  // 4. Komisyonlar ('yak', 'muay' veya 'komisyonlar')
  const yaklasikMaliyet: KomisyonUyesi[] = []
  const muayeneKabul: KomisyonUyesi[] = []

  if (Array.isArray(raw.yak)) {
    raw.yak.forEach((row: any, idx: number) => {
      if (!Array.isArray(row)) return
      const ad = String(row[2] || '').trim()
      if (!ad || ad.toLowerCase() === 'seçiniz' || ad.toLowerCase() === 'seciniz') return
      yaklasikMaliyet.push({
        siraNo: parseInt(String(row[0]), 10) || idx + 1,
        gorevi: row[1] ? String(row[1]).trim() : 'Üye',
        adiSoyadi: ad,
        unvani: row[3] ? String(row[3]).trim() : undefined
      })
    })
  } else if (raw.komisyonlar?.yaklasikMaliyet) {
    yaklasikMaliyet.push(...raw.komisyonlar.yaklasikMaliyet)
  }

  if (Array.isArray(raw.muay)) {
    raw.muay.forEach((row: any, idx: number) => {
      if (!Array.isArray(row)) return
      const ad = String(row[2] || '').trim()
      if (!ad || ad.toLowerCase() === 'seçiniz' || ad.toLowerCase() === 'seciniz') return
      muayeneKabul.push({
        siraNo: parseInt(String(row[0]), 10) || idx + 1,
        gorevi: row[1] ? String(row[1]).trim() : 'Üye',
        adiSoyadi: ad,
        unvani: row[3] ? String(row[3]).trim() : undefined
      })
    })
  } else if (raw.komisyonlar?.muayeneKabul) {
    muayeneKabul.push(...raw.komisyonlar.muayeneKabul)
  }

  // 5. Kazanan firmalar ('win' veya 'kazananFirmalar')
  const kazananFirmalar: KazananFirma[] = []
  if (Array.isArray(raw.win)) {
    raw.win.forEach((w: any) => {
      if (!Array.isArray(w)) return
      const unvan = String(w[1] || '').trim()
      if (!unvan) return
      kazananFirmalar.push({
        firmaNo: w[0] ? String(w[0]) : undefined,
        firmaUnvani: unvan,
        iletisim: w[2] ? String(w[2]) : undefined,
        semtSehir: w[3] ? String(w[3]) : undefined
      })
    })
  } else if (Array.isArray(raw.kazananFirmalar)) {
    kazananFirmalar.push(...raw.kazananFirmalar)
  }

  return {
    id: raw.id ? String(raw.id) : dosyaNo ? `dt_${dosyaNo.replace(/[^a-zA-Z0-9_-]/g, '_')}` : `dt_${index + 1}`,
    versiyon: raw.versiyon || '1.0',
    aktarimTarihi: raw.aktarimTarihi || new Date().toISOString(),
    dosyaBilgileri,
    malzemeler,
    teklifler,
    komisyonlar: {
      yaklasikMaliyet,
      muayeneKabul
    },
    kazananFirmalar,
    f: raw.f,
    mat: raw.mat,
    tek: raw.tek,
    win: raw.win,
    con: raw.con,
    yak: raw.yak,
    muay: raw.muay,
    kab: raw.kab,
    ek: raw.ek,
    sablon: raw.sablon
  }
}

export function parseDogrudanTeminJson(rawJson: string): ParsedJsonResult {
  try {
    if (!rawJson || !rawJson.trim()) {
      return { success: false, error: 'JSON içeriği boş olamaz.' }
    }
    const parsed = JSON.parse(rawJson)

    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Geçersiz JSON formatı: Obje veya Dizi bekleniyor.' }
    }

    // Çoğul dosya tespiti: { files: [...] } veya [...]
    let rawList: any[] = []
    let isMulti = false

    if (Array.isArray(parsed)) {
      rawList = parsed
      isMulti = true
    } else if (Array.isArray(parsed.files)) {
      rawList = parsed.files
      isMulti = true
    } else {
      rawList = [parsed]
      isMulti = false
    }

    if (rawList.length === 0) {
      return { success: false, error: 'JSON içinde aktarılacak dosya kaydı bulunamadı.' }
    }

    const normalizedList: DogrudanTeminDosyasi[] = []
    for (let i = 0; i < rawList.length; i++) {
      const item = rawList[i]
      if (!item.f && !item.dosyaBilgileri && !item.isinAdi && !item.mat && !item.dosyaNo) {
        continue
      }
      const norm = normalizeSingleDossier(item, i)
      if (norm) {
        const validation = validateDogrudanTeminPayload(norm)
        if (!validation.success) {
          return {
            success: false,
            error: `Şema doğrulama hatası:\n• ${validation.errors?.join('\n• ')}`
          }
        }
        normalizedList.push(norm)
      }
    }

    if (normalizedList.length === 0) {
      return {
        success: false,
        error:
          'JSON içinde geçerli doğrudan temin verisi ("f" veya "dosyaBilgileri" anahtarı) bulunamadı.'
      }
    }

    return {
      success: true,
      isMulti: normalizedList.length > 1 || isMulti,
      totalCount: normalizedList.length,
      files: normalizedList,
      data: normalizedList[0]
    }
  } catch (err: unknown) {
    return {
      success: false,
      error: `JSON ayrıştırma hatası: ${err instanceof Error ? err.message : String(err)}`
    }
  }
}

export function findMatchingDossier(
  dossiers: ExistingDossierSummary[],
  data: DogrudanTeminDosyasi
): ExistingDossierSummary | null {
  if (!Array.isArray(dossiers) || !data?.dosyaBilgileri) return null

  const dosyaNo = data.dosyaBilgileri.dosyaNo?.trim()
  const dtNo = data.dosyaBilgileri.dogrudanTeminNumarasi?.trim()
  const hariciId = data.id?.trim()

  // 1. Asıl dosya numarasına göre birebir eşleşme
  if (dosyaNo) {
    const match = dossiers.find(
      (d) => d.temin_no && d.temin_no.trim().toLowerCase() === dosyaNo.toLowerCase()
    )
    if (match) return match
  }

  // 2. Doğrudan temin numarasına göre eşleşme
  if (dtNo) {
    const match = dossiers.find(
      (d) =>
        (d.temin_no && d.temin_no.trim() === dtNo) ||
        (d.ekap_no && d.ekap_no.trim() === dtNo)
    )
    if (match) return match
  }

  // 3. Harici ID'ye göre eşleşme (ekap_no)
  if (hariciId) {
    const match = dossiers.find((d) => d.ekap_no && d.ekap_no.trim() === hariciId)
    if (match) return match
  }

  return null
}

export async function fetchExistingDossiers(): Promise<ExistingDossierSummary[]> {
  try {
    if (!window.electron?.ipcRenderer) {
      return []
    }
    const res = await window.electron.ipcRenderer.invoke(
      'db:query',
      `SELECT id, temin_no, ekap_no, konu, butce_yili, durum_asama_id, yaklasik_maliyet, created_at
       FROM DATA_TeminDosyasi
       WHERE is_deleted = 0
       ORDER BY id DESC
       LIMIT 200`
    )
    if (Array.isArray(res)) return res as ExistingDossierSummary[]
    if (res && Array.isArray((res as { data?: unknown }).data)) {
      return (res as { data: ExistingDossierSummary[] }).data
    }
    return []
  } catch (err) {
    console.error('Dosyalar listelenirken hata:', err)
    return []
  }
}

export async function searchDossiers(query: string): Promise<ExistingDossierSummary[]> {
  try {
    if (!window.electron?.ipcRenderer || !query.trim()) {
      return []
    }
    const pattern = `%${query.trim()}%`
    const res = await window.electron.ipcRenderer.invoke(
      'db:query',
      `SELECT id, temin_no, ekap_no, konu, butce_yili, durum_asama_id, yaklasik_maliyet, created_at
       FROM DATA_TeminDosyasi
       WHERE is_deleted = 0 AND (temin_no LIKE ? OR ekap_no LIKE ? OR konu LIKE ?)
       ORDER BY id DESC
       LIMIT 50`,
      [pattern, pattern, pattern]
    )
    if (Array.isArray(res)) return res as ExistingDossierSummary[]
    if (res && Array.isArray((res as { data?: unknown }).data)) {
      return (res as { data: ExistingDossierSummary[] }).data
    }
    return []
  } catch (err) {
    console.error('Arama hatası:', err)
    return []
  }
}

export async function executeDossierEzmeSync(
  targetId: number | null,
  data: DogrudanTeminDosyasi,
  options: SyncOptions
): Promise<SyncResult> {
  const ipc = window.electron?.ipcRenderer
  if (!ipc) {
    throw new Error('Electron veritabanı köprüsüne erişilemedi.')
  }

  if (targetId === null && options.createNewIfNotFound === false) {
    throw new Error('Eşleşen dosya bulunamadı ve "Yeni Dosya Oluştur" seçeneği aktif değil.')
  }

  const info = data.dosyaBilgileri
  const butceYiliInt = parseInt(info.butceYili || '', 10) || new Date().getFullYear()
  const altYukleniciInt = info.altYuklenici === 'Evet' ? 1 : 0
  const kismiTeklifInt = info.kismiTeklif === 'Evet' ? 1 : 0
  const avansInt = info.avans === 'Evet' ? 1 : 0
  const tibbiCihazInt = info.tibbiCihaz === 'Evet' ? 1 : 0
  const turCode = normalizeTur(info.alimTuru)

  const updatedFields: string[] = []
  let finalDosyaId = targetId
  const isNew = finalDosyaId === null

  // Eşzamanlı çakışmaları önlemek için ID üretimini doğrudan SQLite'a bırakıyoruz.
  // Yeni dosya ise child tablolarda '$ROOT_ID' belirteci kullanılarak ilk INSERT'ün rowid'si bağlanır.
  const targetDosyaParam: number | { __txRef: 'ROOT_ID' } = isNew
    ? { __txRef: 'ROOT_ID' }
    : finalDosyaId!

  // Atomik Transaction Sorguları Listesi (Tüm ana ve alt kayıtlar TEK bir transaction ile çalışır)
  const txQueries: Array<{ sql: string; params?: unknown[] }> = []

  // 2. Yeni Dosya ise Header Kaydını Transaction'ın 1. Sorgusu Olarak Ekle (id AUTOINCREMENT'e bırakılır)
    if (isNew) {
      txQueries.push({
        sql: `INSERT INTO DATA_TeminDosyasi (
          temin_no, ekap_no, konu, isin_aciklamasi, dosya_acilis_tarihi, butce_yili, butce_tipi,
          birim, sunulacak_makam, ihtiyac_yeri, ihale_sekli, ihale_tipi, tur,
          teklif_sozlesme_turu, alt_yuklenici_olacak_mi, kismi_teklif_verilecek_mi,
          yatirim_proje_no, avans_verilecek_mi, yaklasik_maliyet_hesaplamasi,
          kdv, hesaplama_esasi, komisyon_takdiri, tibbi_cihaz_alimi_mi, son_teklif_verme_tarihi,
          teslim_tarihi, fonksiyonel_kod, e_butce, finansman_kodu, notlar, durum_asama_id, is_deleted
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, 1, 0
        )`,
        params: [
          info.dosyaNo || info.dogrudanTeminNumarasi || 'YENİ-DT',
          info.dogrudanTeminNumarasi || data.id || null,
          info.isinAdi || 'Doğrudan Temin Alımı',
          info.aciklama || null,
          info.dosyaAcilisTarihi || new Date().toISOString().slice(0, 10),
          butceYiliInt,
          info.butce || 'Genel Bütçe',
          info.ihalesiYapilacakBirim || null,
          info.sunulacakMakam || null,
          info.ihtiyacYeri || null,
          info.madde || '22/d*',
          'Doğrudan Temin',
          turCode,
          info.teklifSozlesmeTuru || 'Birim Fiyat',
          altYukleniciInt,
          kismiTeklifInt,
          info.yatirimProjeNo || null,
          avansInt,
          info.yaklasikMaliyetDurumu || 'Burada Hesaplanacak',
          info.kdv || 'Hariç',
          info.hesaplamaEsasi || 'En düşük fiyat esasına göre',
          info.hesaplamada || 'Sadece araştırma fiyatları dikkate alınacak',
          tibbiCihazInt,
          info.sonTeklifVermeTarihSaati || null,
          info.tahminiBitisTarihi || null,
          info.fonksiyonelKod || null,
          info.kurumsalKod || null,
          info.finansalKod || null,
          `[Harici Entegrasyon ID: ${data.id || 'N/A'}] ${info.talepTarihSayisi ? 'Talep No: ' + info.talepTarihSayisi : ''}`
        ]
      })
      updatedFields.push('Yeni Dosya Kaydı Oluşturuldu')
    } else if (options.overwriteGeneralInfo) {
      // 3. Mevcut Dosya Güncelleniyorsa Header Güncellemesini Transaction'a Ekle
      txQueries.push({
        sql: `UPDATE DATA_TeminDosyasi SET
          temin_no = ?, ekap_no = ?, konu = ?, isin_aciklamasi = ?, dosya_acilis_tarihi = ?,
          butce_yili = ?, butce_tipi = ?, birim = ?, sunulacak_makam = ?, ihtiyac_yeri = ?,
          ihale_sekli = ?, ihale_tipi = ?, tur = ?, teklif_sozlesme_turu = ?,
          alt_yuklenici_olacak_mi = ?, kismi_teklif_verilecek_mi = ?, yatirim_proje_no = ?,
          avans_verilecek_mi = ?, yaklasik_maliyet_hesaplamasi = ?, kdv = ?,
          hesaplama_esasi = ?, komisyon_takdiri = ?, tibbi_cihaz_alimi_mi = ?,
          son_teklif_verme_tarihi = ?, teslim_tarihi = ?, fonksiyonel_kod = ?,
          e_butce = ?, finansman_kodu = ?, notlar = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        params: [
          info.dosyaNo || info.dogrudanTeminNumarasi,
          info.dogrudanTeminNumarasi || data.id || null,
          info.isinAdi,
          info.aciklama || null,
          info.dosyaAcilisTarihi || null,
          butceYiliInt,
          info.butce || 'Genel Bütçe',
          info.ihalesiYapilacakBirim || null,
          info.sunulacakMakam || null,
          info.ihtiyacYeri || null,
          info.madde || '22/d*',
          'Doğrudan Temin',
          turCode,
          info.teklifSozlesmeTuru || 'Birim Fiyat',
          altYukleniciInt,
          kismiTeklifInt,
          info.yatirimProjeNo || null,
          avansInt,
          info.yaklasikMaliyetDurumu || 'Burada Hesaplanacak',
          info.kdv || 'Hariç',
          info.hesaplamaEsasi || 'En düşük fiyat esasına göre',
          info.hesaplamada || 'Sadece araştırma fiyatları dikkate alınacak',
          tibbiCihazInt,
          info.sonTeklifVermeTarihSaati || null,
          info.tahminiBitisTarihi || null,
          info.fonksiyonelKod || null,
          info.kurumsalKod || null,
          info.finansalKod || null,
          `[Harici Entegrasyon ID: ${data.id || 'N/A'}] ${info.talepTarihSayisi ? 'Talep No: ' + info.talepTarihSayisi : ''}`,
          finalDosyaId
        ]
      })
      updatedFields.push('Dosya Genel Bilgileri ve İdari Parametreler')
    }

    // 3. MALZEMELERİN İŞLENMESİ (Açık Politika: undefined ise koru, array ise değiştir/temizle)
    let materialsCount = 0
    let calculatedYaklasikMaliyet = 0

    if (options.overwriteMaterials && data.malzemeler !== undefined) {
      if (!isNew) {
        txQueries.push({
          sql: 'DELETE FROM DATA_TeminKalemTeklif WHERE temin_dosya_id = ?',
          params: [targetDosyaParam]
        })
        txQueries.push({
          sql: 'DELETE FROM DATA_TeminKalem WHERE temin_dosya_id = ?',
          params: [targetDosyaParam]
        })
      }

      if (data.malzemeler.length > 0) {
        for (let i = 0; i < data.malzemeler.length; i++) {
          const m = data.malzemeler[i]
          const siraNo = m.siraNo || i + 1
          // Sıfır (0) değerlerin varsayılana dönüşmesini engelle (0 miktar ve %0 KDV korunur)
          const miktar = m.miktar !== undefined && !isNaN(Number(m.miktar)) ? Number(m.miktar) : 1
          const kdvOrani =
            m.kdvOrani !== undefined && !isNaN(Number(m.kdvOrani)) ? Number(m.kdvOrani) : 20
          const birimFiyat =
            m.birimFiyat !== undefined && !isNaN(Number(m.birimFiyat)) ? Number(m.birimFiyat) : 0
          const toplamTutar =
            m.toplamTutar !== undefined && !isNaN(Number(m.toplamTutar))
              ? Number(m.toplamTutar)
              : miktar * birimFiyat

          calculatedYaklasikMaliyet += toplamTutar

          txQueries.push({
            sql: `INSERT INTO DATA_TeminKalem (
              temin_dosya_id, dosya_id, sira_no, kalem_adi, aciklama, birim,
              miktar, kdv_orani, tasinir_kodu, okas_kodu, tipi, poz_no
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            params: [
              targetDosyaParam,
              targetDosyaParam,
              siraNo,
              m.malzemeAdi,
              m.ozelligi || m.fiyatKaynagi || null,
              m.birimi || 'Adet',
              miktar,
              kdvOrani,
              m.tasinirKodu || null,
              m.okasKodu || null,
              turCode === 'mal' ? 'Mal' : turCode === 'hizmet' ? 'Hizmet' : 'Yapım',
              m.malzemeKodu || null
            ]
          })
          materialsCount++
        }

        if (calculatedYaklasikMaliyet > 0) {
          txQueries.push({
            sql: 'UPDATE DATA_TeminDosyasi SET yaklasik_maliyet = ? WHERE id = ?',
            params: [calculatedYaklasikMaliyet, targetDosyaParam]
          })
        }
        updatedFields.push(`${materialsCount} Adet Malzeme / Hizmet Kalemi`)
      } else {
        updatedFields.push('Malzeme Kalemleri Temizlendi')
      }
    }

    // 4. TEKLİFLER VE İSTEKLİ FİRMALARIN İŞLENMESİ
    let offersCount = 0
    if (options.overwriteOffers && data.teklifler !== undefined) {
      if (!isNew) {
        txQueries.push({
          sql: 'DELETE FROM DATA_TeminKalemTeklif WHERE temin_dosya_id = ?',
          params: [targetDosyaParam]
        })
        txQueries.push({
          sql: 'DELETE FROM DATA_TeminFirma WHERE temin_dosya_id = ?',
          params: [targetDosyaParam]
        })
      }

      if (data.teklifler.length > 0) {
        for (let i = 0; i < data.teklifler.length; i++) {
          const t = data.teklifler[i]
          const firmaAdi = t.firma.trim()

          // TANIM_Firma.unvan gerçek şemada UNIQUE değil; INSERT OR IGNORE her aktarımda mükerrer
          // kayıt üretirdi. Bu yüzden yalnızca aynı unvan yoksa ekleniyor.
          txQueries.push({
            sql: `INSERT INTO TANIM_Firma (unvan, vergi_no, telefon, adres)
                  SELECT ?, ?, ?, ?
                  WHERE NOT EXISTS (SELECT 1 FROM TANIM_Firma WHERE unvan = ?)`,
            params: [firmaAdi, t.vergiNo || null, t.iletisim || null, t.yer || null, firmaAdi]
          })

          const isKazanan =
            t.durum === 'Kabul Edildi' ||
            (data.kazananFirmalar &&
              data.kazananFirmalar.some(
                (kf) =>
                  kf.firmaUnvani.toLowerCase().trim() === firmaAdi.toLowerCase() ||
                  (kf.firmaNo && kf.firmaNo === t.firmaNo)
              ))
              ? 1
              : 0

          // DATA_TeminFirma kaydını oluştur
          txQueries.push({
            sql: `INSERT INTO DATA_TeminFirma (
              temin_dosya_id, dosya_id, firma_id, unvan, vergi_no, telefon,
              teklif_verdi_mi, teklif_toplami, kazandi_mi, kazanan_mi, teklif_durumu,
              davet_tarihi, teklif_tarihi
            ) VALUES (
              ?, ?,
              COALESCE((SELECT id FROM TANIM_Firma WHERE unvan = ? LIMIT 1), 0),
              ?, ?, ?, 1, ?, ?, ?, ?, ?, ?
            )`,
            params: [
              targetDosyaParam,
              targetDosyaParam,
              firmaAdi,
              firmaAdi,
              t.vergiNo || null,
              t.iletisim || null,
              t.tutarKdvHaric || 0,
              isKazanan,
              isKazanan,
              t.durum || 'Teklif Geldi',
              t.istekTarihi || null,
              t.teklifTarihi || null
            ]
          })

          // Kalem bazlı teklif fiyatları varsa DATA_TeminKalemTeklif tablosuna ekle
          if (t.kalemFiyatlari && Array.isArray(t.kalemFiyatlari) && t.kalemFiyatlari.length > 0) {
            for (let kIdx = 0; kIdx < t.kalemFiyatlari.length; kIdx++) {
              const kfVal = Number(t.kalemFiyatlari[kIdx]) || 0
              const matchedItem = data.malzemeler && data.malzemeler[kIdx]
              const itemSira = matchedItem?.siraNo || kIdx + 1
              const itemKalemAdi = matchedItem?.malzemeAdi || ''

              // KDV oranını önce kalemden, yoksa tekliften al, yoksa %20 varsay (0 KDV korunur)
              const rawKdvRate =
                matchedItem?.kdvOrani !== undefined && !isNaN(Number(matchedItem.kdvOrani))
                  ? Number(matchedItem.kdvOrani)
                  : t.kdvOrani !== undefined && !isNaN(Number(t.kdvOrani))
                    ? Number(t.kdvOrani)
                    : 20
              const effectiveKdvRate = isNaN(rawKdvRate) ? 20 : rawKdvRate
              const kdvTutari = (kfVal * effectiveKdvRate) / 100

              txQueries.push({
                sql: `INSERT INTO DATA_TeminKalemTeklif (
                  temin_dosya_id, dosya_id, temin_kalem_id, temin_firma_id,
                  birim_fiyat, kdv_tutari, teklif_verildi_mi
                ) VALUES (
                  ?, ?,
                  COALESCE(
                    (SELECT id FROM DATA_TeminKalem WHERE temin_dosya_id = ? AND sira_no = ? LIMIT 1),
                    (SELECT id FROM DATA_TeminKalem WHERE temin_dosya_id = ? AND kalem_adi = ? LIMIT 1),
                    0
                  ),
                  COALESCE((SELECT id FROM DATA_TeminFirma WHERE temin_dosya_id = ? AND unvan = ? LIMIT 1), 0),
                  ?, ?, 1
                )`,
                params: [
                  targetDosyaParam,
                  targetDosyaParam,
                  targetDosyaParam,
                  itemSira,
                  targetDosyaParam,
                  itemKalemAdi,
                  targetDosyaParam,
                  firmaAdi,
                  kfVal,
                  kdvTutari
                ]
              })
            }
          }

          if (isKazanan === 1) {
            // DATA_TeminDosyasi.firma_id uygulama genelinde TANIM_Firma.id ile JOIN'lenir
            // (dashboard, belge çıktıları vb.); DATA_TeminFirma.id yazılmamalı.
            txQueries.push({
              sql: `UPDATE DATA_TeminDosyasi SET firma_id = (
                SELECT firma_id FROM DATA_TeminFirma WHERE temin_dosya_id = ? AND unvan = ? LIMIT 1
              ) WHERE id = ?`,
              params: [targetDosyaParam, firmaAdi, targetDosyaParam]
            })
          }
          offersCount++
        }
        updatedFields.push(`${offersCount} İstekli Firma & Teklif`)
      } else {
        updatedFields.push('Firma Teklifleri Temizlendi')
      }
    }

    // 5. KOMİSYON ÜYELERİNİN İŞLENMESİ
    let commissionsCount = 0
    if (options.overwriteCommissions && data.komisyonlar !== undefined) {
      if (!isNew) {
        txQueries.push({
          sql: 'DELETE FROM DATA_TeminKomisyon WHERE temin_dosya_id = ?',
          params: [targetDosyaParam]
        })
      }

      const allMembers: Array<{
        komisyonTuru: 'Yaklaşık Maliyet' | 'Muayene Kabul'
        adiSoyadi: string
        gorevi?: string
        unvani?: string
      }> = []

      if (data.komisyonlar.yaklasikMaliyet) {
        data.komisyonlar.yaklasikMaliyet.forEach((m) =>
          allMembers.push({ ...m, komisyonTuru: 'Yaklaşık Maliyet' })
        )
      }
      if (data.komisyonlar.muayeneKabul) {
        data.komisyonlar.muayeneKabul.forEach((m) =>
          allMembers.push({ ...m, komisyonTuru: 'Muayene Kabul' })
        )
      }

      for (const m of allMembers) {
        // TANIM_Personel.ad_soyad UNIQUE değil; mükerrer personel oluşmaması için yalnızca yoksa ekle
        txQueries.push({
          sql: `INSERT INTO TANIM_Personel (ad_soyad, unvan, gorev)
                SELECT ?, ?, ?
                WHERE NOT EXISTS (SELECT 1 FROM TANIM_Personel WHERE ad_soyad = ?)`,
          params: [m.adiSoyadi.trim(), m.unvani || null, m.gorevi || null, m.adiSoyadi.trim()]
        })

        txQueries.push({
          sql: `INSERT INTO DATA_TeminKomisyon (
            temin_dosya_id, dosya_id, komisyon_id, personel_id, ad_soyad, unvan,
            gorev, rol, komisyon_turu, belgede_goster, asli_yedek, kaynak
          ) VALUES (
            ?, ?, ?,
            COALESCE((SELECT id FROM TANIM_Personel WHERE ad_soyad = ? LIMIT 1), 0),
            ?, ?, ?, 'Asil', ?, 1, 'Asil', 'harici_aktarim'
          )`,
          params: [
            targetDosyaParam,
            targetDosyaParam,
            m.komisyonTuru === 'Yaklaşık Maliyet' ? 1 : 2,
            m.adiSoyadi.trim(),
            m.adiSoyadi.trim(),
            m.unvani || '',
            m.gorevi || 'Üye',
            m.komisyonTuru
          ]
        })
        commissionsCount++
      }

      if (commissionsCount > 0) {
        updatedFields.push(`${commissionsCount} Komisyon Üyesi`)
      } else {
        updatedFields.push('Komisyon Üyeleri Temizlendi')
      }
    }

    // 6. ATOMİK TRANZAKSİYON YÜRÜTME (SQLite BEGIN TRANSACTION -> RUN ALL -> COMMIT / ROLLBACK)
    if (txQueries.length > 0) {
      const txResult = await ipc.invoke('db:transaction', txQueries)
      if (!txResult || !txResult.success) {
        throw new Error(
          txResult?.error || 'Veritabanı tranzaksiyonu başarısız oldu (Değişiklikler geri alındı).'
        )
      }
      if (isNew) {
        finalDosyaId = Number(txResult.rootInsertRowid || txResult.lastInsertRowid || 0)
      }
    }

    return {
      success: true,
      dosyaId: finalDosyaId ?? 0,
      isNew,
      updatedFields,
      materialsCount,
      offersCount,
      commissionsCount,
      message: isNew
        ? `Dosya başarıyla sisteme aktarıldı (ID: ${finalDosyaId}).`
        : `Hedef dosya (ID: ${finalDosyaId}) gelen verilerle başarıyla güncellendi (ezildi).`
    }
  }
