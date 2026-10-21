// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { DatabaseSync } from 'node:sqlite'
import { handleDbTransaction } from '../../../../../../main/ipc/db/dbTransaction'
import { executeDossierEzmeSync, parseDogrudanTeminJson } from '../hariciAktarimService'
import { SAMPLE_HARICI_DT_JSON } from '../sampleData'

describe('Gerçek SQLite Motoru: Harici Dosya Aktarım & Atomik Rollback Doğrulaması', () => {
  let db: DatabaseSync
  let originalElectron: unknown

  beforeEach(() => {
    // 1. Gerçek fiziksel in-memory SQLite veritabanı
    db = new DatabaseSync(':memory:')
    db.exec('PRAGMA foreign_keys = ON;')

    // 2. Tablo şemalarını oluştur
    db.exec(`
      CREATE TABLE DATA_TeminDosyasi (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        temin_no TEXT,
        ekap_no TEXT,
        konu TEXT,
        isin_aciklamasi TEXT,
        dosya_acilis_tarihi TEXT,
        butce_yili INTEGER,
        butce_tipi TEXT,
        birim TEXT,
        sunulacak_makam TEXT,
        ihtiyac_yeri TEXT,
        ihale_sekli TEXT,
        ihale_tipi TEXT,
        tur TEXT,
        teklif_sozlesme_turu TEXT,
        alt_yuklenici_olacak_mi INTEGER DEFAULT 0,
        kismi_teklif_verilecek_mi INTEGER DEFAULT 0,
        fiyat_farki_dayanagi TEXT,
        yatirim_proje_no TEXT,
        avans_verilecek_mi INTEGER DEFAULT 0,
        yaklasik_maliyet_hesaplamasi TEXT,
        kdv TEXT,
        hesaplama_esasi TEXT,
        komisyon_takdiri TEXT,
        tibbi_cihaz_alimi_mi INTEGER DEFAULT 0,
        son_teklif_verme_tarihi TEXT,
        teslim_tarihi TEXT,
        fonksiyonel_kod TEXT,
        kurumsal_kod TEXT,
        e_butce TEXT,
        finansman_kodu TEXT,
        notlar TEXT,
        yaklasik_maliyet REAL DEFAULT 0,
        firma_id INTEGER,
        durum_asama_id INTEGER DEFAULT 1,
        is_deleted INTEGER DEFAULT 0,
        updated_at TEXT
      );

      CREATE TABLE DATA_TeminKalem (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        temin_dosya_id INTEGER,
        dosya_id INTEGER,
        sira_no INTEGER,
        kalem_adi TEXT,
        aciklama TEXT,
        birim TEXT,
        miktar REAL,
        birim_fiyat REAL,
        kdv_orani REAL,
        tasinir_kodu TEXT,
        okas_kodu TEXT,
        tipi TEXT,
        poz_no TEXT
      );

      CREATE TABLE TANIM_Firma (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        unvan TEXT UNIQUE,
        vergi_no TEXT,
        telefon TEXT,
        adres TEXT
      );

      CREATE TABLE DATA_TeminFirma (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        temin_dosya_id INTEGER,
        dosya_id INTEGER,
        firma_id INTEGER,
        unvan TEXT,
        vergi_no TEXT,
        telefon TEXT,
        email TEXT,
        teklif_verdi_mi INTEGER DEFAULT 1,
        teklif_toplami REAL DEFAULT 0,
        kazandi_mi INTEGER DEFAULT 0,
        kazanan_mi INTEGER DEFAULT 0,
        teklif_durumu TEXT,
        davet_tarihi TEXT,
        teklif_tarihi TEXT
      );

      CREATE TABLE DATA_TeminKalemTeklif (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        temin_dosya_id INTEGER,
        dosya_id INTEGER,
        temin_kalem_id INTEGER,
        temin_firma_id INTEGER,
        birim_fiyat REAL,
        kdv_tutari REAL,
        teklif_verildi_mi INTEGER DEFAULT 1
      );

      CREATE TABLE TANIM_Personel (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ad_soyad TEXT,
        unvan TEXT,
        gorev TEXT
      );

      CREATE TABLE DATA_TeminKomisyon (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        temin_dosya_id INTEGER,
        dosya_id INTEGER,
        komisyon_id INTEGER,
        personel_id INTEGER,
        ad_soyad TEXT,
        unvan TEXT,
        gorev TEXT,
        rol TEXT,
        komisyon_turu TEXT,
        belgede_goster INTEGER DEFAULT 1,
        asli_yedek TEXT,
        kaynak TEXT
      );
    `)

    // 3. Electron IPC köprüsünü bu in-memory SQLite motoruna bağla
    originalElectron = (globalThis as unknown as { window?: { electron?: unknown } }).window?.electron
    ;(globalThis as unknown as { window: unknown }).window = {
      electron: {
        ipcRenderer: {
          invoke: async (channel: string, arg1: unknown, arg2: unknown) => {
            if (channel === 'db:transaction') {
              const queries = arg1 as Array<{ sql: string; params?: unknown[] }>
              return await handleDbTransaction(db as any, queries, { validateSql: false })
            }
            if (channel === 'db:run') {
              const sql = arg1 as string
              const params = (arg2 as unknown[]) || []
              try {
                const stmt = db.prepare(sql)
                const info = stmt.run(...(params as any[]))
                return { success: true, lastInsertRowid: Number(info.lastInsertRowid), changes: Number(info.changes) }
              } catch (err: any) {
                return { success: false, error: err.message }
              }
            }
            if (channel === 'db:query') {
              const sql = arg1 as string
              const params = (arg2 as unknown[]) || []
              try {
                const stmt = db.prepare(sql)
                const rows = stmt.all(...(params as any[]))
                return rows
              } catch {
                return []
              }
            }
            return { success: true }
          }
        }
      }
    }
  })

  afterEach(() => {
    if ((globalThis as any).window?.electron) {
      ;(globalThis as any).window.electron = originalElectron
    }
    vi.clearAllMocks()
    try {
      db.close()
    } catch {}
  })

  it('gerçek SQLite üzerinde mevcut dosyayı başarıyla günceller ve kalem fiyatlarını DATA_TeminKalemTeklif tablosuna işler', async () => {
    // Başlangıç dosyası oluştur
    db.prepare(`
      INSERT INTO DATA_TeminDosyasi (id, temin_no, konu, butce_yili, yaklasik_maliyet)
      VALUES (1, '2025/2', 'Eski Konu', 2025, 1000)
    `).run()

    db.prepare(`
      INSERT INTO DATA_TeminKalem (temin_dosya_id, dosya_id, sira_no, kalem_adi, miktar, birim_fiyat)
      VALUES (1, 1, 1, 'Eski Malzeme', 5, 200)
    `).run()

    const parsed = parseDogrudanTeminJson(SAMPLE_HARICI_DT_JSON)
    expect(parsed.success).toBe(true)

    const syncRes = await executeDossierEzmeSync(1, parsed.data!, {
      overwriteGeneralInfo: true,
      overwriteMaterials: true,
      overwriteOffers: true,
      overwriteCommissions: true,
      createNewIfNotFound: false
    })

    expect(syncRes.success).toBe(true)
    expect(syncRes.dosyaId).toBe(1)

    // 1. Dosya başlığının güncellendiğini doğrula
    const dosyaRow = db.prepare('SELECT konu, yaklasik_maliyet FROM DATA_TeminDosyasi WHERE id = 1').get() as any
    expect(dosyaRow.konu).toBe('Su Sayacı Alımı')
    expect(dosyaRow.yaklasik_maliyet).toBe(45000)

    // 2. Yeni malzemenin eklendiğini doğrula
    const kalemRows = db.prepare('SELECT kalem_adi, miktar FROM DATA_TeminKalem WHERE temin_dosya_id = 1').all() as any[]
    expect(kalemRows.length).toBe(1)
    expect(kalemRows[0].kalem_adi).toBe('Ev Tipi Soğuk Su Sayacı')
    expect(kalemRows[0].miktar).toBe(100)

    // 3. Tekliflerin ve kalem fiyatlarının bağlandığını doğrula
    const teklifRows = db.prepare('SELECT birim_fiyat, teklif_verildi_mi FROM DATA_TeminKalemTeklif WHERE temin_dosya_id = 1').all() as any[]
    expect(teklifRows.length).toBeGreaterThan(0)
    expect(teklifRows[0].birim_fiyat).toBe(450)
    expect(teklifRows[0].teklif_verildi_mi).toBe(1)

    // 4. Komisyon üyelerinin yazıldığını doğrula
    const komisyonRows = db.prepare('SELECT ad_soyad, komisyon_turu FROM DATA_TeminKomisyon WHERE temin_dosya_id = 1').all() as any[]
    expect(komisyonRows.length).toBe(6)
  })

  it('hata durumunda atomik ROLLBACK: bir sorgu patlarsa tüm değişiklikler geri alınır, dosya orijinal kalır', async () => {
    // Başlangıç dosyası oluştur
    db.prepare(`
      INSERT INTO DATA_TeminDosyasi (id, temin_no, konu, butce_yili, yaklasik_maliyet)
      VALUES (2, '2025/99', 'Orijinal Dokunulmaz Dosya', 2025, 7777)
    `).run()

    db.prepare(`
      INSERT INTO DATA_TeminKalem (temin_dosya_id, dosya_id, sira_no, kalem_adi, miktar, birim_fiyat)
      VALUES (2, 2, 1, 'Kritik Kalem', 1, 7777)
    `).run()

    const parsed = parseDogrudanTeminJson(SAMPLE_HARICI_DT_JSON)
    const data = parsed.data!

    // Bilinçli olarak bir kısıtlama hatası yaratacak geçersiz bir teklif ekle (unvan NOT NULL olan yere null tetiklet)
    // Ya da IPC invoke katmanında db:transaction'ın SQLite hatası fırlatmasını simüle et
    const originalInvoke = (window as any).electron.ipcRenderer.invoke
    ;(window as any).electron.ipcRenderer.invoke = async (channel: string, arg1: any, arg2: any) => {
      if (channel === 'db:transaction') {
        const queries = arg1 as Array<{ sql: string; params?: unknown[] }>
        // Araya kasıtlı olarak patlayacak hatalı bir SQL ekle
        queries.push({ sql: 'INSERT INTO TabloBulunamadi_Hata (kolon) VALUES (?)', params: [123] })
        return await handleDbTransaction(db as any, queries, { validateSql: false })
      }
      return originalInvoke(channel, arg1, arg2)
    }

    // İşlemi çalıştır, hata fırlatmalı
    await expect(
      executeDossierEzmeSync(2, data, {
        overwriteGeneralInfo: true,
        overwriteMaterials: true,
        overwriteOffers: true,
        overwriteCommissions: true,
        createNewIfNotFound: false
      })
    ).rejects.toThrow()

    // DOĞRULAMA: Rollback yapılmış olmalı!
    // Dosya konusu ve yaklaşık maliyeti ASLA değişmemiş olmalı
    const dosyaRow = db.prepare('SELECT konu, yaklasik_maliyet FROM DATA_TeminDosyasi WHERE id = 2').get() as any
    expect(dosyaRow.konu).toBe('Orijinal Dokunulmaz Dosya')
    expect(dosyaRow.yaklasik_maliyet).toBe(7777)

    // Kalemler silinmemiş, eski haliyle kalmış olmalı
    const kalemler = db.prepare('SELECT kalem_adi FROM DATA_TeminKalem WHERE temin_dosya_id = 2').all() as any[]
    expect(kalemler.length).toBe(1)
    expect(kalemler[0].kalem_adi).toBe('Kritik Kalem')
  })

  it('malzemeler undefined gönderildiğinde mevcut kalemleri korur', async () => {
    db.prepare(`
      INSERT INTO DATA_TeminDosyasi (id, temin_no, konu, butce_yili)
      VALUES (3, '2025/3', 'Korunan Kalemli Dosya', 2025)
    `).run()

    db.prepare(`
      INSERT INTO DATA_TeminKalem (temin_dosya_id, dosya_id, sira_no, kalem_adi, miktar)
      VALUES (3, 3, 1, 'Mevcut Silinmeyecek Kalem', 10)
    `).run()

    const parsed = parseDogrudanTeminJson(SAMPLE_HARICI_DT_JSON)
    const data = { ...parsed.data! }
    delete (data as any).malzemeler // gönderilmemiş alan

    await executeDossierEzmeSync(3, data, {
      overwriteGeneralInfo: true,
      overwriteMaterials: true,
      overwriteOffers: false,
      overwriteCommissions: false,
      createNewIfNotFound: false
    })

    const kalemler = db.prepare('SELECT kalem_adi FROM DATA_TeminKalem WHERE temin_dosya_id = 3').all() as any[]
    expect(kalemler.length).toBe(1)
    expect(kalemler[0].kalem_adi).toBe('Mevcut Silinmeyecek Kalem')
  })
})
