import {
  DogrudanTeminDosyasi,
  ExistingDossierSummary,
  SyncOptions,
  SyncResult
} from './types'
import { validateDogrudanTeminPayload } from './hariciAktarimSchema'

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

    const validation = validateDogrudanTeminPayload(parsed)
    if (!validation.success) {
      return {
        success: false,
        error: `Şema doğrulama hatası:\n• ${validation.errors?.join('\n• ')}`
      }
    }

    return {
      success: true,
      data: validation.data as DogrudanTeminDosyasi
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

export async function searchDossiers(query: string): Promise<ExistingDossierSummary[]> {
  try {
    if (!window.electron?.ipcRenderer || !query.trim()) {
      return []
    }
    const pattern = `%${query.trim()}%`
    const rows = await window.electron.ipcRenderer.invoke(
      'db:query',
      `SELECT id, temin_no, ekap_no, konu, butce_yili, durum_asama_id, yaklasik_maliyet, created_at
       FROM DATA_TeminDosyasi
       WHERE is_deleted = 0 AND (temin_no LIKE ? OR ekap_no LIKE ? OR konu LIKE ?)
       ORDER BY id DESC
       LIMIT 50`,
      [pattern, pattern, pattern]
    )
    return (rows || []) as ExistingDossierSummary[]
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
  let isNew = false

  // 1. Yeni Dosya Eklenecekse Hedef ID'yi Önceden Belirle (Tek bir atomik transaction içinde eklemek için)
  if (finalDosyaId === null) {
    const maxRow = await ipc.invoke(
      'db:query',
      'SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM DATA_TeminDosyasi'
    )
    finalDosyaId = Number(maxRow?.[0]?.next_id || 1)
    isNew = true
  }

  // Atomik Transaction Sorguları Listesi (Tüm ana ve alt kayıtlar TEK bir transaction ile çalışır)
  const txQueries: Array<{ sql: string; params?: unknown[] }> = []

  try {
    // 2. Yeni Dosya ise Header Kaydını Transaction'ın 1. Sorgusu Olarak Ekle
    if (isNew) {
      txQueries.push({
        sql: `INSERT INTO DATA_TeminDosyasi (
          id, temin_no, ekap_no, konu, isin_aciklamasi, dosya_acilis_tarihi, butce_yili, butce_tipi,
          birim, sunulacak_makam, ihtiyac_yeri, ihale_sekli, ihale_tipi, tur,
          teklif_sozlesme_turu, alt_yuklenici_olacak_mi, kismi_teklif_verilecek_mi,
          fiyat_farki_dayanagi, yatirim_proje_no, avans_verilecek_mi, yaklasik_maliyet_hesaplamasi,
          kdv, hesaplama_esasi, komisyon_takdiri, tibbi_cihaz_alimi_mi, son_teklif_verme_tarihi,
          teslim_tarihi, fonksiyonel_kod, e_butce, finansman_kodu, notlar, durum_asama_id, is_deleted
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, 1, 0
        )`,
        params: [
          finalDosyaId,
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
          info.fiyatFarkiDayanagi || 'Fiyat Farkı Ödenmeyecek',
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
      // Temizle
      txQueries.push({
        sql: 'DELETE FROM DATA_TeminKalemTeklif WHERE temin_dosya_id = ?',
        params: [finalDosyaId]
      })
      txQueries.push({
        sql: 'DELETE FROM DATA_TeminKalem WHERE temin_dosya_id = ?',
        params: [finalDosyaId]
      })

      if (data.malzemeler.length > 0) {
        for (let i = 0; i < data.malzemeler.length; i++) {
          const m = data.malzemeler[i]
          const siraNo = m.siraNo || i + 1
          const miktar = Number(m.miktar) || 1
          const kdvOrani = Number(m.kdvOrani) || 20
          const birimFiyat = Number(m.birimFiyat) || 0
          const toplamTutar = m.toplamTutar ? Number(m.toplamTutar) : miktar * birimFiyat

          calculatedYaklasikMaliyet += toplamTutar

          txQueries.push({
            sql: `INSERT INTO DATA_TeminKalem (
              temin_dosya_id, dosya_id, sira_no, kalem_adi, aciklama, birim,
              miktar, kdv_orani, tasinir_kodu, okas_kodu, tipi, poz_no
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            params: [
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
          })
          materialsCount++
        }

        if (calculatedYaklasikMaliyet > 0) {
          txQueries.push({
            sql: 'UPDATE DATA_TeminDosyasi SET yaklasik_maliyet = ? WHERE id = ?',
            params: [calculatedYaklasikMaliyet, finalDosyaId]
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
      txQueries.push({
        sql: 'DELETE FROM DATA_TeminKalemTeklif WHERE temin_dosya_id = ?',
        params: [finalDosyaId]
      })
      txQueries.push({
        sql: 'DELETE FROM DATA_TeminFirma WHERE temin_dosya_id = ?',
        params: [finalDosyaId]
      })

      if (data.teklifler.length > 0) {
        for (let i = 0; i < data.teklifler.length; i++) {
          const t = data.teklifler[i]
          const firmaAdi = t.firma.trim()

          // TANIM_Firma tablosunda yoksa ekle (güvenli INSERT OR IGNORE)
          txQueries.push({
            sql: `INSERT OR IGNORE INTO TANIM_Firma (unvan, vergi_no, telefon, adres)
                  VALUES (?, ?, ?, ?)`,
            params: [firmaAdi, t.vergiNo || null, t.iletisim || null, t.yer || null]
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
              finalDosyaId,
              finalDosyaId,
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

              // KDV oranını önce kalemden, yoksa tekliften al, yoksa %20 varsay
              const rawKdvRate =
                matchedItem?.kdvOrani !== undefined
                  ? Number(matchedItem.kdvOrani)
                  : t.kdvOrani !== undefined
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
                  finalDosyaId,
                  finalDosyaId,
                  finalDosyaId,
                  itemSira,
                  finalDosyaId,
                  itemKalemAdi,
                  finalDosyaId,
                  firmaAdi,
                  kfVal,
                  kdvTutari
                ]
              })
            }
          }

          if (isKazanan === 1) {
            txQueries.push({
              sql: `UPDATE DATA_TeminDosyasi SET firma_id = (
                SELECT id FROM DATA_TeminFirma WHERE temin_dosya_id = ? AND unvan = ? LIMIT 1
              ) WHERE id = ?`,
              params: [finalDosyaId, firmaAdi, finalDosyaId]
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
      txQueries.push({
        sql: 'DELETE FROM DATA_TeminKomisyon WHERE temin_dosya_id = ?',
        params: [finalDosyaId]
      })

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
        txQueries.push({
          sql: `INSERT OR IGNORE INTO TANIM_Personel (ad_soyad, unvan, gorev) VALUES (?, ?, ?)`,
          params: [m.adiSoyadi.trim(), m.unvani || null, m.gorevi || null]
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
            finalDosyaId,
            finalDosyaId,
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
    }

    return {
      success: true,
      dosyaId: finalDosyaId,
      isNew,
      updatedFields,
      materialsCount,
      offersCount,
      commissionsCount,
      message: isNew
        ? `Dosya başarıyla sisteme aktarıldı (ID: ${finalDosyaId}).`
        : `Hedef dosya (ID: ${finalDosyaId}) gelen verilerle başarıyla güncellendi (ezildi).`
    }
  } catch (err: unknown) {
    // Yeni dosya oluşturulduysa ve sonraki transaction patladıysa dosyayı temizle (Rollback güvencesi)
    if (isNew && finalDosyaId) {
      try {
        await ipc.invoke('db:run', 'DELETE FROM DATA_TeminDosyasi WHERE id = ?', [finalDosyaId])
      } catch (cleanupErr) {
        console.error('Yetim dosya temizleme hatası:', cleanupErr)
      }
    }
    throw err
  }
}
