import {
  DogrudanTeminDosyasi,
  ExistingDossierSummary,
  SyncOptions,
  SyncResult
} from './types'

export function normalizeTur(alimTuru?: string): string {
  if (!alimTuru) return 'mal'
  const lower = alimTuru.toLowerCase()
  if (lower.includes('hizmet')) return 'hizmet'
  if (lower.includes('yapım') || lower.includes('yapim')) return 'yapim_isi'
  if (lower.includes('danışman') || lower.includes('danisman')) return 'danismanlik'
  return 'mal'
}

export function parseDogrudanTeminJson(rawJson: string): {
  success: boolean
  data?: DogrudanTeminDosyasi
  error?: string
} {
  try {
    if (!rawJson || !rawJson.trim()) {
      return { success: false, error: 'JSON içeriği boş olamaz.' }
    }
    const parsed = JSON.parse(rawJson)

    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Geçersiz JSON formatı: Obje bekleniyor.' }
    }

    if (!parsed.dosyaBilgileri) {
      return { success: false, error: 'JSON içinde "dosyaBilgileri" anahtarı bulunamadı.' }
    }

    if (!parsed.dosyaBilgileri.isinAdi && !parsed.dosyaBilgileri.dosyaNo) {
      return {
        success: false,
        error: '"dosyaBilgileri" içerisinde en az "isinAdi" veya "dosyaNo" alanı bulunmalıdır.'
      }
    }

    return {
      success: true,
      data: parsed as DogrudanTeminDosyasi
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

  // 3. Harici ID'ye göre eşleşme (ekap_no veya açıklama)
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
    const rows = await window.electron.ipcRenderer.invoke(
      'db:query',
      `SELECT id, temin_no, ekap_no, konu, butce_yili, durum_asama_id, yaklasik_maliyet, created_at
       FROM DATA_TeminDosyasi
       WHERE is_deleted = 0
       ORDER BY id DESC
       LIMIT 200`
    )
    return (rows || []) as ExistingDossierSummary[]
  } catch (err) {
    console.error('Dosyalar listelenirken hata:', err)
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

  const info = data.dosyaBilgileri
  const butceYiliInt = parseInt(info.butceYili || '', 10) || new Date().getFullYear()
  const altYukleniciInt = info.altYuklenici === 'Evet' ? 1 : 0
  const kismiTeklifInt = info.kismiTeklif === 'Evet' ? 1 : 0
  const avansInt = info.avans === 'Evet' ? 1 : 0
  const tibbiCihazInt = info.tibbiCihaz === 'Evet' ? 1 : 0
  const turCode = normalizeTur(info.alimTuru)

  const updatedFields: string[] = []
  let finalDosyaId = targetId
  let isNew = false

  // 1. DOSYA GENEL BİLGİLERİNİ GÜNCELLE (EZ) VEYA YENİ DOSYA OLUŞTUR
  if (finalDosyaId === null) {
    // Yeni dosya oluştur
    const insertRes = await ipc.invoke(
      'db:run',
      `INSERT INTO DATA_TeminDosyasi (
        temin_no, ekap_no, konu, isin_aciklamasi, dosya_acilis_tarihi, butce_yili, butce_tipi,
        birim, sunulacak_makam, ihtiyac_yeri, ihale_sekli, ihale_tipi, tur,
        teklif_sozlesme_turu, alt_yuklenici_olacak_mi, kismi_teklif_verilecek_mi,
        yatirim_proje_no, avans_verilecek_mi, yaklasik_maliyet_hesaplamasi, kdv,
        hesaplama_esasi, komisyon_takdiri, tibbi_cihaz_alimi_mi, son_teklif_verme_tarihi,
        teslim_tarihi, fonksiyonel_kod, e_butce, finansman_kodu, notlar, durum_asama_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'devam_ediyor')`,
      [
        info.dosyaNo || info.dogrudanTeminNumarasi || '2026/DT-YENI',
        info.dogrudanTeminNumarasi || data.id || null,
        info.isinAdi,
        info.aciklama || null,
        info.dosyaAcilisTarihi || new Date().toISOString().slice(0, 10),
        butceYiliInt,
        info.butce || 'Genel Bütçe',
        info.ihalesiYapilacakBirim || null,
        info.sunulacakMakam || null,
        info.ihtiyacYeri || null,
        info.madde || '22/d*',
        info.ihaleTipi || 'Doğrudan Temin',
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
    )

    if (!insertRes.success) {
      throw new Error(`Yeni dosya eklenirken hata: ${insertRes.error}`)
    }
    finalDosyaId = insertRes.lastInsertRowid || insertRes.id
    isNew = true
    updatedFields.push('Yeni Dosya Kaydı Oluşturuldu')
  } else if (options.overwriteGeneralInfo) {
    // Mevcut dosyayı ez / güncelle
    const updateRes = await ipc.invoke(
      'db:run',
      `UPDATE DATA_TeminDosyasi SET
        temin_no = ?, ekap_no = ?, konu = ?, isin_aciklamasi = ?, dosya_acilis_tarihi = ?,
        butce_yili = ?, butce_tipi = ?, birim = ?, sunulacak_makam = ?, ihtiyac_yeri = ?,
        ihale_sekli = ?, ihale_tipi = ?, tur = ?, teklif_sozlesme_turu = ?,
        alt_yuklenici_olacak_mi = ?, kismi_teklif_verilecek_mi = ?, yatirim_proje_no = ?,
        avans_verilecek_mi = ?, yaklasik_maliyet_hesaplamasi = ?, kdv = ?,
        hesaplama_esasi = ?, komisyon_takdiri = ?, tibbi_cihaz_alimi_mi = ?,
        son_teklif_verme_tarihi = ?, teslim_tarihi = ?, fonksiyonel_kod = ?,
        e_butce = ?, finansman_kodu = ?, notlar = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
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
        info.ihaleTipi || 'Doğrudan Temin',
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
    )

    if (!updateRes.success) {
      throw new Error(`Dosya güncellenirken hata: ${updateRes.error}`)
    }
    updatedFields.push('Dosya Genel Bilgileri ve İdari Parametreler')
  }

  // 2. MALZEME KALEMLERİNİ EZ / GÜNCELLE
  let materialsCount = 0
  let calculatedYaklasikMaliyet = 0

  if (options.overwriteMaterials && data.malzemeler && data.malzemeler.length > 0) {
    // Mevcut kalemleri temizle
    await ipc.invoke('db:run', 'DELETE FROM DATA_TeminKalem WHERE temin_dosya_id = ?', [finalDosyaId])

    for (let i = 0; i < data.malzemeler.length; i++) {
      const m = data.malzemeler[i]
      const siraNo = m.siraNo || i + 1
      const miktar = Number(m.miktar) || 1
      const kdvOrani = Number(m.kdvOrani) || 20
      const birimFiyat = Number(m.birimFiyat) || 0
      const toplamTutar = m.toplamTutar ? Number(m.toplamTutar) : miktar * birimFiyat

      calculatedYaklasikMaliyet += toplamTutar

      await ipc.invoke(
        'db:run',
        `INSERT INTO DATA_TeminKalem (
          temin_dosya_id, dosya_id, sira_no, kalem_adi, aciklama, birim,
          miktar, kdv_orani, tasinir_kodu, okas_kodu, tipi, poz_no
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          finalDosyaId,
          finalDosyaId,
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
      )
      materialsCount++
    }

    // Yaklaşık maliyet toplamını ana dosyaya yansıt
    if (calculatedYaklasikMaliyet > 0) {
      await ipc.invoke(
        'db:run',
        'UPDATE DATA_TeminDosyasi SET yaklasik_maliyet = ? WHERE id = ?',
        [calculatedYaklasikMaliyet, finalDosyaId]
      )
    }
    updatedFields.push(`${materialsCount} Adet Malzeme / Hizmet Kalemi`)
  }

  // 3. TEKLİFLER VE İSTEKLİ FİRMALARI EZ / GÜNCELLE
  let offersCount = 0
  if (options.overwriteOffers && data.teklifler && data.teklifler.length > 0) {
    // Eski teklif bağlantılarını temizle
    await ipc.invoke('db:run', 'DELETE FROM DATA_TeminKalemTeklif WHERE temin_dosya_id = ?', [finalDosyaId])
    await ipc.invoke('db:run', 'DELETE FROM DATA_TeminFirma WHERE temin_dosya_id = ?', [finalDosyaId])

    for (let i = 0; i < data.teklifler.length; i++) {
      const t = data.teklifler[i]
      const firmaAdi = t.firma.trim()

      // Firmayı TANIM_Firma tablosunda bul veya ekle
      const existingFirma = await ipc.invoke(
        'db:query',
        'SELECT id FROM TANIM_Firma WHERE unvan = ? LIMIT 1',
        [firmaAdi]
      )
      let firmaId = existingFirma?.[0]?.id

      if (!firmaId) {
        const newFirmaRes = await ipc.invoke(
          'db:run',
          'INSERT INTO TANIM_Firma (unvan, vergi_no, telefon, email, adres) VALUES (?, ?, ?, ?, ?)',
          [firmaAdi, t.vergiNo || null, t.iletisim || null, null, t.yer || null]
        )
        firmaId = newFirmaRes.lastInsertRowid || newFirmaRes.id
      }

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
      const teminFirmaRes = await ipc.invoke(
        'db:run',
        `INSERT INTO DATA_TeminFirma (
          temin_dosya_id, dosya_id, firma_id, unvan, vergi_no, telefon, email,
          teklif_verdi_mi, teklif_toplami, kazandi_mi, kazanan_mi, teklif_durumu,
          davet_tarihi, teklif_tarihi
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          finalDosyaId,
          finalDosyaId,
          firmaId,
          firmaAdi,
          t.vergiNo || null,
          t.iletisim || null,
          null,
          1,
          t.tutarKdvHaric || 0,
          isKazanan,
          isKazanan,
          t.durum || 'Teklif Geldi',
          t.istekTarihi || null,
          t.teklifTarihi || null
        ]
      )

      if (isKazanan === 1) {
        // Ana dosyada kazanan firma_id güncelle
        await ipc.invoke('db:run', 'UPDATE DATA_TeminDosyasi SET firma_id = ? WHERE id = ?', [
          teminFirmaRes.lastInsertRowid || teminFirmaRes.id,
          finalDosyaId
        ])
      }

      offersCount++
    }
    updatedFields.push(`${offersCount} İstekli Firma & Teklif`)
  }

  // 4. KOMİSYON VE HEYETLERİ EZ / GÜNCELLE
  let commissionsCount = 0
  if (options.overwriteCommissions && data.komisyonlar) {
    await ipc.invoke('db:run', 'DELETE FROM DATA_TeminKomisyon WHERE temin_dosya_id = ?', [finalDosyaId])

    const allMembers = [
      ...(data.komisyonlar.yaklasikMaliyet || []).map((m) => ({
        ...m,
        komisyonTuru: 'Yaklaşık Maliyet'
      })),
      ...(data.komisyonlar.muayeneKabul || []).map((m) => ({
        ...m,
        komisyonTuru: 'Muayene ve Kabul'
      }))
    ]

    for (const m of allMembers) {
      // Personel bul veya oluştur
      const existingPersonel = await ipc.invoke(
        'db:query',
        'SELECT id FROM TANIM_Personel WHERE ad_soyad = ? LIMIT 1',
        [m.adiSoyadi.trim()]
      )
      let personelId = existingPersonel?.[0]?.id

      if (!personelId) {
        const pRes = await ipc.invoke(
          'db:run',
          'INSERT INTO TANIM_Personel (ad_soyad, unvan, gorev) VALUES (?, ?, ?)',
          [m.adiSoyadi.trim(), m.unvani || null, m.gorevi || null]
        )
        personelId = pRes.lastInsertRowid || pRes.id
      }

      await ipc.invoke(
        'db:run',
        `INSERT INTO DATA_TeminKomisyon (
          temin_dosya_id, dosya_id, komisyon_id, personel_id, ad_soyad, unvan,
          gorev, rol, komisyon_turu, belgede_goster, asli_yedek, kaynak
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'Asil', 'harici_aktarim')`,
        [
          finalDosyaId,
          finalDosyaId,
          m.komisyonTuru === 'Yaklaşık Maliyet' ? 1 : 2,
          personelId,
          m.adiSoyadi.trim(),
          m.unvani || '',
          m.gorevi || 'Üye',
          'Asil',
          m.komisyonTuru
        ]
      )
      commissionsCount++
    }
    if (commissionsCount > 0) {
      updatedFields.push(`${commissionsCount} Komisyon Üyesi`)
    }
  }

  return {
    success: true,
    dosyaId: finalDosyaId as number,
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
