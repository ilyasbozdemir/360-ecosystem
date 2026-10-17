import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  ihtiyacRaporuService,
  IhtiyacRaporu,
  IhtiyacRaporuKalem
} from '../ihtiyacRaporuService'
import { dbClient } from '../db/dbClient'

describe('ihtiyacRaporuService Tests', () => {
  // In-memory mock database state
  let mockRaporlar: any[] = []
  let mockKalemler: any[] = []
  let mockDosyalar: any[] = []
  let mockTeminKalemler: any[] = []
  let nextRaporId = 1
  let nextKalemId = 1
  let nextTeminKalemId = 1

  beforeEach(() => {
    mockRaporlar = []
    mockKalemler = []
    mockDosyalar = [
      {
        id: 10,
        temin_no: '2026/DT-001',
        dosya_no: '2026/DT-001',
        konu: 'Belediye Hizmet Binası Kırtasiye Alımı',
        tur: 'mal',
        status: 'devam_ediyor'
      }
    ]
    mockTeminKalemler = []
    nextRaporId = 1
    nextKalemId = 1
    nextTeminKalemId = 1

    // Mock dbClient.query
    vi.spyOn(dbClient, 'query').mockImplementation(async (sql: string, params: any[] = []) => {
      // getRaporlar
      if (sql.includes('FROM DATA_IhtiyacRaporu r') && sql.includes('GROUP BY r.id')) {
        let results = mockRaporlar.map((r) => {
          const kCount = mockKalemler.filter((k) => k.rapor_id === r.id).length
          const d = mockDosyalar.find((dosya) => dosya.id === r.temin_dosya_id)
          return {
            ...r,
            kalem_sayisi: kCount,
            dosya_no: d?.temin_no || d?.dosya_no || null,
            dosya_konu: d?.konu || null,
            dosya_tur: d?.tur || null
          }
        })

        if (sql.includes('r.durum = ?')) {
          const durumParam = params[0]
          results = results.filter((r) => r.durum === durumParam)
        }

        if (sql.includes('r.id = ?')) {
          const idParam = params[0]
          results = results.filter((r) => r.id === idParam)
        }

        return results
      }

      // getRaporKalemleri
      if (sql.includes('FROM DATA_IhtiyacRaporuKalem') && sql.includes('WHERE rapor_id = ?')) {
        const rId = params[0]
        return mockKalemler.filter((k) => k.rapor_id === rId)
      }

      // getDosyalarForSelect
      if (sql.includes('FROM DATA_TeminDosyasi')) {
        return mockDosyalar
      }

      return []
    })

    // Mock dbClient.queryFirst
    vi.spyOn(dbClient, 'queryFirst').mockImplementation(async (sql: string, params: any[] = []) => {
      if (sql.includes('WHERE r.id = ?')) {
        const id = params[0]
        const r = mockRaporlar.find((item) => item.id === id)
        if (!r) return null
        const kCount = mockKalemler.filter((k) => k.rapor_id === r.id).length
        const d = mockDosyalar.find((dosya) => dosya.id === r.temin_dosya_id)
        return {
          ...r,
          kalem_sayisi: kCount,
          dosya_no: d?.temin_no || d?.dosya_no || null,
          dosya_konu: d?.konu || null,
          dosya_tur: d?.tur || null
        }
      }

      if (sql.includes('SELECT rapor_no FROM DATA_IhtiyacRaporu')) {
        const prefix = (params[0] || '').replace('%', '')
        const matches = mockRaporlar
          .filter((r) => r.rapor_no && String(r.rapor_no).startsWith(prefix))
          .sort((a, b) => b.id - a.id)
        return matches.length > 0 ? { rapor_no: matches[0].rapor_no } : null
      }

      if (sql.includes('MAX(sira_no)')) {
        const dId = params[0]
        const items = mockTeminKalemler.filter((tk) => tk.temin_dosya_id === dId)
        const max = items.reduce((m, i) => Math.max(m, i.sira_no || 0), 0)
        return { max_sira: max }
      }

      return null
    })

    // Mock dbClient.run
    vi.spyOn(dbClient, 'run').mockImplementation(async (sql: string, params: any[] = []) => {
      if (
        sql.includes('CREATE TABLE') ||
        sql.includes('CREATE INDEX') ||
        sql.includes('ALTER TABLE')
      ) {
        return { success: true, changes: 0 }
      }

      // Insert Kalem (must check before DATA_IhtiyacRaporu)
      if (sql.includes('INSERT INTO DATA_IhtiyacRaporuKalem')) {
        const id = nextKalemId++
        mockKalemler.push({
          id,
          rapor_id: params[0],
          sira_no: params[1],
          kalem_adi: params[2],
          tipi: params[3],
          birim: params[4],
          miktar: params[5],
          kdv_orani: params[6],
          tasinir_kodu: params[7],
          okas_kodu: params[8],
          poz_no: params[9],
          aciklama: params[10],
          tahmini_birim_fiyat: params[11]
        })
        return { success: true, lastInsertRowid: id, changes: 1 }
      }

      // Insert Rapor
      if (sql.includes('INSERT INTO DATA_IhtiyacRaporu (')) {
        const id = nextRaporId++
        const newRecord = {
          id,
          rapor_no: params[0],
          baslik: params[1],
          gerekce: params[2],
          birim_id: params[3],
          birim_adi: params[4],
          talep_eden_personel_id: params[5],
          talep_eden_personel: params[6],
          talep_eden_unvan: params[7],
          durum: params[8],
          temin_dosya_id: params[9],
          tarih: params[10],
          onay_tarihi: params[11],
          tahmini_butce: params[12],
          notlar: params[13]
        }
        mockRaporlar.push(newRecord)
        return { success: true, lastInsertRowid: id, changes: 1 }
      }

      // Delete Kalemler by rapor_id
      if (sql.includes('DELETE FROM DATA_IhtiyacRaporuKalem WHERE rapor_id = ?')) {
        const rId = params[0]
        mockKalemler = mockKalemler.filter((k) => k.rapor_id !== rId)
        return { success: true, changes: 1 }
      }

      // Update Rapor
      if (sql.includes('UPDATE DATA_IhtiyacRaporu SET')) {
        const id = params[params.length - 1]
        const r = mockRaporlar.find((item) => item.id === id)
        if (r) {
          if (sql.includes('temin_dosya_id = ?')) {
            r.temin_dosya_id = params[0]
            if (sql.includes("durum = 'dosyaya_aktarildi'")) {
              r.durum = 'dosyaya_aktarildi'
            }
          }
          if (sql.includes('temin_dosya_id = NULL')) {
            r.temin_dosya_id = null
            r.durum = 'taslak'
          }
        }
        return { success: true, changes: 1 }
      }

      // Delete Rapor
      if (sql.includes('DELETE FROM DATA_IhtiyacRaporu WHERE id = ?')) {
        const id = params[0]
        mockRaporlar = mockRaporlar.filter((r) => r.id !== id)
        mockKalemler = mockKalemler.filter((k) => k.rapor_id !== id)
        return { success: true, changes: 1 }
      }

      // Insert into DATA_TeminKalem
      if (sql.includes('INSERT INTO DATA_TeminKalem')) {
        const id = nextTeminKalemId++
        mockTeminKalemler.push({
          id,
          temin_dosya_id: params[0],
          sira_no: params[1],
          kalem_adi: params[2],
          tipi: params[3],
          birim: params[4],
          miktar: params[5],
          kdv_orani: params[6],
          tasinir_kodu: params[7],
          okas_kodu: params[8],
          poz_no: params[9],
          aciklama: params[10]
        })
        return { success: true, lastInsertRowid: id, changes: 1 }
      }

      return { success: true }
    })
  })

  it('1. should create an independent need report without requiring an active dossier', async () => {
    const kalemler: IhtiyacRaporuKalem[] = [
      {
        kalem_adi: 'A4 Kağıt (80 gr)',
        tipi: 'Mal',
        birim: 'Paket',
        miktar: 100,
        kdv_orani: 20,
        tahmini_birim_fiyat: 150
      },
      {
        kalem_adi: 'Mavi Tükenmez Kalem',
        tipi: 'Mal',
        birim: 'Kutu',
        miktar: 10,
        kdv_orani: 20,
        tahmini_birim_fiyat: 80
      }
    ]

    const newId = await ihtiyacRaporuService.createRapor(
      {
        rapor_no: 'IR-2026/001',
        baslik: '2026 Yılı 1. Çeyrek Kırtasiye İhtiyacı',
        gerekce: 'Müdürlük birimlerimizin günlük idari iş ve işlemlerinin aksamaması için',
        birim_id: 1,
        birim_adi: 'Yazı İşleri Müdürlüğü',
        durum: 'taslak',
        temin_dosya_id: null,
        tarih: '2026-03-01',
        onay_tarihi: null,
        tahmini_butce: 15800,
        notlar: 'Bütçe onayına sunulacak'
      },
      kalemler
    )

    expect(newId).toBe(1)
    expect(mockRaporlar.length).toBe(1)
    expect(mockRaporlar[0].temin_dosya_id).toBeNull()
    expect(mockRaporlar[0].durum).toBe('taslak')
    expect(mockKalemler.length).toBe(2)
    expect(mockKalemler[0].kalem_adi).toBe('A4 Kağıt (80 gr)')
  })

  it('2. should list need reports and support detail queries', async () => {
    await ihtiyacRaporuService.createRapor(
      {
        rapor_no: 'IR-2026/001',
        baslik: 'Yazıcı Kartuşu İhtiyacı',
        durum: 'taslak',
        temin_dosya_id: null,
        tarih: '2026-03-01',
        tahmini_butce: 5000
      },
      [{ kalem_adi: 'Toner', tipi: 'Mal', birim: 'Adet', miktar: 5 }]
    )

    const list = await ihtiyacRaporuService.getRaporlar()
    expect(list.length).toBe(1)
    expect(list[0].kalem_sayisi).toBe(1)

    const detail = await ihtiyacRaporuService.getRaporById(1)
    expect(detail).toBeDefined()
    expect(detail?.baslik).toBe('Yazıcı Kartuşu İhtiyacı')

    const items = await ihtiyacRaporuService.getRaporKalemleri(1)
    expect(items.length).toBe(1)
    expect(items[0].kalem_adi).toBe('Toner')
  })

  it('3. should duplicate a report as a completely independent new record', async () => {
    // Kaynak rapor oluştur
    const origId = await ihtiyacRaporuService.createRapor(
      {
        rapor_no: 'IR-2026/001',
        baslik: 'Yol Bakım Malzemesi',
        gerekce: 'Asfalt yama çalışmaları',
        durum: 'onaylandi',
        temin_dosya_id: 10, // Bağlı dosya var
        tarih: '2026-01-15',
        tahmini_butce: 20000
      },
      [
        { kalem_adi: 'Soğuk Asfalt', tipi: 'Mal', birim: 'Torba', miktar: 50, tahmini_birim_fiyat: 400 }
      ]
    )

    // Kopyalama işlemini çalıştır
    const clonedId = await ihtiyacRaporuService.duplicateRapor(origId)

    expect(clonedId).not.toBe(origId)
    expect(mockRaporlar.length).toBe(2)

    const cloned = mockRaporlar.find((r) => r.id === clonedId)
    expect(cloned).toBeDefined()
    expect(cloned.baslik).toBe('Yol Bakım Malzemesi (Kopya)')
    // Klonlanan rapor taslak olmalı ve eski dosya bağlantısı taşınmamalıdır
    expect(cloned.durum).toBe('taslak')
    expect(cloned.temin_dosya_id).toBeNull()

    // Orijinal rapor değişmemelidir
    const original = mockRaporlar.find((r) => r.id === origId)
    expect(original.durum).toBe('onaylandi')
    expect(original.temin_dosya_id).toBe(10)

    // Klonlanan kalemler bağımsız olmalıdır
    const clonedItems = mockKalemler.filter((k) => k.rapor_id === clonedId)
    expect(clonedItems.length).toBe(1)
    expect(clonedItems[0].kalem_adi).toBe('Soğuk Asfalt')
    expect(clonedItems[0].rapor_id).toBe(clonedId)
  })

  it('4. should link report to a dossier and optionally clone items to DATA_TeminKalem', async () => {
    const raporId = await ihtiyacRaporuService.createRapor(
      {
        rapor_no: 'IR-2026/002',
        baslik: 'Boya ve Tiner İhtiyacı',
        durum: 'taslak',
        temin_dosya_id: null,
        tarih: '2026-02-10'
      },
      [
        { kalem_adi: 'İç Cephe Boyası', tipi: 'Mal', birim: 'Kova', miktar: 20, kdv_orani: 20 },
        { kalem_adi: 'Sentetik Tiner', tipi: 'Mal', birim: 'Teneke', miktar: 5, kdv_orani: 20 }
      ]
    )

    // Dosyaya bağla ve kalemleri kopyala
    await ihtiyacRaporuService.linkToDosya(raporId, 10, { copyItemsToDosya: true })

    const updated = mockRaporlar.find((r) => r.id === raporId)
    expect(updated.temin_dosya_id).toBe(10)
    expect(updated.durum).toBe('dosyaya_aktarildi')

    // DATA_TeminKalem'e kopyalanan kalemleri doğrula
    expect(mockTeminKalemler.length).toBe(2)
    expect(mockTeminKalemler[0].temin_dosya_id).toBe(10)
    expect(mockTeminKalemler[0].kalem_adi).toBe('İç Cephe Boyası')
    expect(mockTeminKalemler[1].kalem_adi).toBe('Sentetik Tiner')

    // Rapordaki kendi kalemleri bozulmadan kalmalı
    const repKalemler = mockKalemler.filter((k) => k.rapor_id === raporId)
    expect(repKalemler.length).toBe(2)
  })

  it('5. should unlink report from dossier safely', async () => {
    const raporId = await ihtiyacRaporuService.createRapor(
      {
        rapor_no: 'IR-2026/003',
        baslik: 'Bağlantısı Kaldırılacak Rapor',
        durum: 'dosyaya_aktarildi',
        temin_dosya_id: 10,
        tarih: '2026-02-15'
      },
      []
    )

    await ihtiyacRaporuService.unlinkFromDosya(raporId)

    const updated = mockRaporlar.find((r) => r.id === raporId)
    expect(updated.temin_dosya_id).toBeNull()
    expect(updated.durum).toBe('taslak')
  })

  it('6. should delete report and its items', async () => {
    const id = await ihtiyacRaporuService.createRapor(
      {
        rapor_no: 'IR-2026/004',
        baslik: 'Silinecek Rapor',
        durum: 'taslak',
        temin_dosya_id: null,
        tarih: '2026-02-20'
      },
      [{ kalem_adi: 'Geçici Kalem', tipi: 'Mal', birim: 'Adet', miktar: 1 }]
    )

    expect(mockRaporlar.length).toBe(1)
    expect(mockKalemler.length).toBe(1)

    await ihtiyacRaporuService.deleteRapor(id)

    expect(mockRaporlar.length).toBe(0)
    expect(mockKalemler.length).toBe(0)
  })
})
