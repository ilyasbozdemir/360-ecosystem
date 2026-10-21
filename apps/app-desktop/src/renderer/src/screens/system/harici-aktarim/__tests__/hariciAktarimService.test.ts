import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  normalizeTur,
  parseDogrudanTeminJson,
  findMatchingDossier,
  executeDossierEzmeSync
} from '../hariciAktarimService'
import { DogrudanTeminDosyasi, ExistingDossierSummary } from '../types'
import { SAMPLE_HARICI_DT_JSON } from '../sampleData'

describe('hariciAktarimService', () => {
  describe('normalizeTur', () => {
    it('alım türlerini veri tabanı kodlarına doğru çevirir', () => {
      expect(normalizeTur('Mal Alımı')).toBe('mal')
      expect(normalizeTur('Hizmet Alımı')).toBe('hizmet')
      expect(normalizeTur('Yapım İşi')).toBe('yapim_isi')
      expect(normalizeTur('Danışmanlık')).toBe('danismanlik')
      expect(normalizeTur(undefined)).toBe('mal')
      expect(normalizeTur('')).toBe('mal')
    })
  })

  describe('parseDogrudanTeminJson', () => {
    it('örnek doğrudan temin JSON verisini başarıyla ayrıştırır', () => {
      const result = parseDogrudanTeminJson(SAMPLE_HARICI_DT_JSON)
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data?.id).toBe('dt_2025_2_183260')
      expect(result.data?.dosyaBilgileri.dosyaNo).toBe('2025/2')
      expect(result.data?.dosyaBilgileri.isinAdi).toBe('Su Sayacı Alımı')
      expect(result.data?.malzemeler?.length).toBe(1)
      expect(result.data?.teklifler?.length).toBe(2)
      expect(result.data?.komisyonlar?.yaklasikMaliyet?.length).toBe(3)
    })

    it('boş metinde hata döner', () => {
      const result = parseDogrudanTeminJson('   ')
      expect(result.success).toBe(false)
      expect(result.error).toContain('boş olamaz')
    })

    it('geçersiz JSON sözdiziminde açıklayıcı hata döner', () => {
      const result = parseDogrudanTeminJson('{ invalid json: true ')
      expect(result.success).toBe(false)
      expect(result.error).toContain('JSON ayrıştırma hatası')
    })

    it('dosyaBilgileri eksikse hata döner', () => {
      const result = parseDogrudanTeminJson(JSON.stringify({ id: 'test_123' }))
      expect(result.success).toBe(false)
      expect(result.error).toContain('dosyaBilgileri')
    })

    it('hem isinAdi hem de dosyaNo eksikse hata döner', () => {
      const result = parseDogrudanTeminJson(JSON.stringify({ dosyaBilgileri: {} }))
      expect(result.success).toBe(false)
      expect(result.error).toContain('en az "isinAdi" veya "dosyaNo"')
    })
  })

  describe('findMatchingDossier', () => {
    const mockDossiers: ExistingDossierSummary[] = [
      {
        id: 10,
        temin_no: '2025/1',
        ekap_no: 'dt_2025_1_001',
        konu: 'Kırtasiye Alımı',
        butce_yili: 2025
      },
      {
        id: 20,
        temin_no: '2025/2',
        ekap_no: 'dt_2025_2_183260',
        konu: 'Su Sayacı Alımı',
        butce_yili: 2025
      },
      {
        id: 30,
        temin_no: 'DT-99',
        ekap_no: '99',
        konu: 'Boya İşi',
        butce_yili: 2025
      }
    ]

    it('asıl dosya numarasına (dosyaNo) göre birebir eşleştirir', () => {
      const data: DogrudanTeminDosyasi = {
        dosyaBilgileri: {
          dosyaNo: '2025/2',
          isinAdi: 'Su Sayacı'
        }
      }
      const match = findMatchingDossier(mockDossiers, data)
      expect(match).not.toBeNull()
      expect(match?.id).toBe(20)
      expect(match?.temin_no).toBe('2025/2')
    })

    it('harici id üzerinden eşleştirir (asıl dosyaNo farklı olsa bile)', () => {
      const data: DogrudanTeminDosyasi = {
        id: 'dt_2025_1_001',
        dosyaBilgileri: {
          dosyaNo: '9999/FARKLI',
          isinAdi: 'Farklı İsim'
        }
      }
      // dosyaNo tutmazsa id eşleşmesi devreye girer
      const customDossiers: ExistingDossierSummary[] = [
        { id: 45, temin_no: 'ESKI/1', ekap_no: 'dt_2025_1_001', konu: 'Test' }
      ]
      const match = findMatchingDossier(customDossiers, data)
      expect(match).not.toBeNull()
      expect(match?.id).toBe(45)
    })

    it('doğrudan temin numarasına (DT No) göre eşleştirir', () => {
      const data: DogrudanTeminDosyasi = {
        dosyaBilgileri: {
          dosyaNo: '',
          dogrudanTeminNumarasi: 'DT-99',
          isinAdi: 'Boya İşi'
        }
      }
      const match = findMatchingDossier(mockDossiers, data)
      expect(match).not.toBeNull()
      expect(match?.id).toBe(30)
    })

    it('hiçbir kriter tutmuyorsa null döner', () => {
      const data: DogrudanTeminDosyasi = {
        id: 'bulunamayan_id',
        dosyaBilgileri: {
          dosyaNo: '2029/999',
          dogrudanTeminNumarasi: '9999',
          isinAdi: 'Bilinmeyen İş'
        }
      }
      const match = findMatchingDossier(mockDossiers, data)
      expect(match).toBeNull()
    })
  })

  describe('executeDossierEzmeSync (Atomic Ezdirtme & Eşleme İşlemi)', () => {
    let originalElectron: unknown
    const mockInvoke = vi.fn()

    beforeEach(() => {
      originalElectron = (window as unknown as { electron?: unknown }).electron
      ;(window as unknown as { electron: unknown }).electron = {
        ipcRenderer: {
          invoke: mockInvoke
        }
      }
    })

    afterEach(() => {
      ;(window as unknown as { electron: unknown }).electron = originalElectron
      vi.clearAllMocks()
    })

    it('mevcut dosya ID seçildiğinde verileri ezerek (overwrite) günceller', async () => {
      const parsed = parseDogrudanTeminJson(SAMPLE_HARICI_DT_JSON)
      expect(parsed.success).toBe(true)
      const data = parsed.data!

      // Mock IPC calls
      mockInvoke.mockImplementation(async (channel: string, sql: string) => {
        if (channel === 'db:query') {
          if (sql.includes('FROM TANIM_Firma')) {
            return [{ id: 101, unvan: 'Anadolu Sayaç' }]
          }
          if (sql.includes('FROM DATA_TeminDosyasi')) {
            return [{ id: 20 }]
          }
          return []
        }
        if (channel === 'db:run' || channel === 'db:execute') {
          return { success: true, lastInsertRowid: 20, changes: 1 }
        }
        return { success: true }
      })

      const syncResult = await executeDossierEzmeSync(20, data, {
        overwriteGeneralInfo: true,
        overwriteMaterials: true,
        overwriteOffers: true,
        overwriteCommissions: true,
        createNewIfNotFound: false
      })

      expect(syncResult.success).toBe(true)
      expect(syncResult.isNew).toBe(false)
      expect(syncResult.dosyaId).toBe(20)
      expect(syncResult.materialsCount).toBe(1)
      expect(syncResult.offersCount).toBe(2)
      expect(syncResult.commissionsCount).toBe(6) // 3 yaklaşık maliyet + 3 muayene kabul

      // Temin dosyasının güncellendiğini doğrula
      const updateCalls = mockInvoke.mock.calls.filter(
        ([channel, sql]) =>
          (channel === 'db:run' || channel === 'db:execute') &&
          typeof sql === 'string' &&
          sql.includes('UPDATE DATA_TeminDosyasi')
      )
      expect(updateCalls.length).toBeGreaterThan(0)

      // Eski kalemlerin silinip yenilerinin eklendiğini doğrula
      const deleteKalemCalls = mockInvoke.mock.calls.filter(
        ([channel, sql]) =>
          (channel === 'db:run' || channel === 'db:execute') &&
          typeof sql === 'string' &&
          sql.includes('DELETE FROM DATA_TeminKalem WHERE')
      )
      expect(deleteKalemCalls.length).toBe(1)
    })

    it('yeni dosya seçildiğinde (targetId: null) yeni dosya kaydı oluşturur', async () => {
      const parsed = parseDogrudanTeminJson(SAMPLE_HARICI_DT_JSON)
      const data = parsed.data!

      mockInvoke.mockImplementation(async (channel: string) => {
        if (channel === 'db:query') {
          return []
        }
        if (channel === 'db:run' || channel === 'db:execute') {
          return { success: true, lastInsertRowid: 999, changes: 1 }
        }
        return { success: true }
      })

      const syncResult = await executeDossierEzmeSync(null, data, {
        overwriteGeneralInfo: true,
        overwriteMaterials: true,
        overwriteOffers: true,
        overwriteCommissions: true,
        createNewIfNotFound: true
      })

      expect(syncResult.success).toBe(true)
      expect(syncResult.isNew).toBe(true)
      expect(syncResult.dosyaId).toBe(999)
      expect(syncResult.materialsCount).toBe(1)
    })
  })
})
