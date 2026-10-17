// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { DatabaseSync } from 'node:sqlite'

/**
 * Gerçek SQLite Veritabanı ile Transaction Rollback & Atomiklik Doğrulama Testi
 * 
 * Bu test, hiçbir mock kullanmadan doğrudan Node.js v22'nin yerleşik
 * SQLite C/C++ motoru (node:sqlite) üzerinde fiziksel bir SQLite bellekte veritabanı açarak:
 * 1. Transaction içindeki işlemlerin (Update + Insert) bir SQL veya kısıtlama hatası aldığında
 *    gerçekten SQLite tarafından anında ROLLBACK yapıldığını,
 * 2. Hata öncesinde başarılı çalışmış olan 'UPDATE DATA_IhtiyacRaporu' ve 'INSERT DATA_TeminKalem'
 *    işlemlerinin tümünün sıfırlandığını ve veritabanının ilk haline eksiksiz döndüğünü fiziki olarak kanıtlar.
 */
describe('Gerçek SQLite Motoru: İhtiyaç Raporu Transaction & Rollback Güvencesi', () => {
  let db: DatabaseSync

  beforeEach(() => {
    // 1. Gerçek fiziksel in-memory SQLite veritabanı oluştur
    db = new DatabaseSync(':memory:')

    // Foreign key ve kısıtlama kontrollerini aktif et
    db.exec('PRAGMA foreign_keys = ON;')

    // Üretim şemasıyla birebir uyumlu gerçek tabloları oluştur
    db.exec(`
      CREATE TABLE DATA_TeminDosyasi (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        temin_no TEXT,
        dosya_no TEXT,
        konu TEXT,
        evrak_sayisi TEXT,
        isin_aciklamasi TEXT
      );

      CREATE TABLE DATA_IhtiyacRaporu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rapor_no TEXT NOT NULL UNIQUE,
        baslik TEXT NOT NULL,
        gerekce TEXT,
        durum TEXT DEFAULT 'taslak',
        temin_dosya_id INTEGER,
        tarih DATE DEFAULT CURRENT_DATE,
        onay_tarihi DATE,
        evrak_sayisi TEXT,
        FOREIGN KEY(temin_dosya_id) REFERENCES DATA_TeminDosyasi(id) ON DELETE SET NULL
      );

      CREATE TABLE DATA_TeminKalem (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        temin_dosya_id INTEGER NOT NULL,
        sira_no INTEGER,
        kalem_adi TEXT NOT NULL,
        tipi TEXT DEFAULT 'Mal',
        birim TEXT DEFAULT 'Adet',
        miktar REAL NOT NULL,
        kdv_orani REAL DEFAULT 20,
        FOREIGN KEY(temin_dosya_id) REFERENCES DATA_TeminDosyasi(id) ON DELETE CASCADE
      );
    `)

    // Başlangıç verilerini yerleştir: 1 hedef dosya ve 1 taslak ihtiyaç raporu
    db.exec(`
      INSERT INTO DATA_TeminDosyasi (id, temin_no, dosya_no, konu, evrak_sayisi)
      VALUES (10, 'DT-2026/01', '2026/01', 'Kırtasiye Alımı', 'E-2026-100');

      INSERT INTO DATA_IhtiyacRaporu (id, rapor_no, baslik, durum, temin_dosya_id, tarih)
      VALUES (1, 'IR-2026/001', 'A4 Kağıt İhtiyacı', 'taslak', NULL, '2026-03-25');
    `)
  })

  afterEach(() => {
    try {
      db.close()
    } catch {
      // ignore
    }
  })

  /**
   * Main process tarafındaki dbCoreHandlers.ts'in SQLite transaction mantığının birebir kopyası:
   * BEGIN IMMEDIATE -> tüm SQL ifadelerini çalıştır -> hata olursa ROLLBACK fırlat -> başarılıysa COMMIT yap.
   */
  function executeNativeSqliteTransaction(
    statements: { sql: string; params?: unknown[] }[]
  ): { success: boolean; changes: number } {
    db.exec('BEGIN IMMEDIATE;')
    try {
      let totalChanges = 0
      for (const stmt of statements) {
        const prepared = db.prepare(stmt.sql)
        const info = prepared.run(...((stmt.params || []) as any[]))
        totalChanges += Number(info.changes || 0)
      }
      db.exec('COMMIT;')
      return { success: true, changes: totalChanges }
    } catch (error) {
      db.exec('ROLLBACK;')
      throw error
    }
  }

  it('1. GERÇEK ROLLBACK KANITI: Transaction içindeki bir SQL başarısız olduğunda, önceki işlemlerin hiçbiri kalıcı olmamalı ve geri alınmalıdır', () => {
    // 1. Adım: Başlangıç durumunu doğrula
    const initialRapor = db.prepare('SELECT durum, temin_dosya_id FROM DATA_IhtiyacRaporu WHERE id = 1').get() as {
      durum: string
      temin_dosya_id: number | null
    }
    expect(initialRapor.durum).toBe('taslak')
    expect(initialRapor.temin_dosya_id).toBeNull()

    const initialKalemCount = db.prepare('SELECT COUNT(*) as count FROM DATA_TeminKalem WHERE temin_dosya_id = 10').get() as {
      count: number
    }
    expect(initialKalemCount.count).toBe(0)

    // 2. Adım: İhtiyaç Raporu aktarım transaction listesi oluştur
    // İfade 1 (Geçerli): Rapor durumunu 'dosyaya_aktarildi' yap ve temin_dosya_id = 10 bağla
    // İfade 2 (Geçerli): 1. Kalemi hedef dosyaya ekle
    // İfade 3 (HATALI): Olmayan bir tabloya yazmaya çalışarak gerçek SQLite hatası üret (SQLITE_ERROR: no such table)
    const transactionStatements = [
      {
        sql: `UPDATE DATA_IhtiyacRaporu SET temin_dosya_id = ?, durum = 'dosyaya_aktarildi' WHERE id = ?`,
        params: [10, 1]
      },
      {
        sql: `INSERT INTO DATA_TeminKalem (temin_dosya_id, sira_no, kalem_adi, miktar) VALUES (?, ?, ?, ?)`,
        params: [10, 1, 'Fotokopi Kağıdı A4', 20]
      },
      {
        sql: `INSERT INTO NON_EXISTING_TABLE_TO_FORCE_SQLITE_ROLLBACK (id) VALUES (1)`,
        params: []
      }
    ]

    // 3. Adım: Transaction'ı çalıştır -> Gerçek SQLite hatasıyla patlamalı
    expect(() => {
      executeNativeSqliteTransaction(transactionStatements)
    }).toThrow(/no such table: NON_EXISTING_TABLE_TO_FORCE_SQLITE_ROLLBACK/)

    // 4. Adım: GERÇEK SQLITE VERİTABANI KONTROLÜ (Rollback kanıtı):
    // İfade 1 ve İfade 2 başarılı olmasına rağmen, İfade 3 hata verdiği için tüm transaction geri alınmış olmalıdır!
    const postRollbackRapor = db.prepare('SELECT durum, temin_dosya_id FROM DATA_IhtiyacRaporu WHERE id = 1').get() as {
      durum: string
      temin_dosya_id: number | null
    }
    expect(postRollbackRapor.durum).toBe('taslak') // Asla 'dosyaya_aktarildi' olarak kalmamış!
    expect(postRollbackRapor.temin_dosya_id).toBeNull() // Dosya bağlantısı sıfırlanmış!

    const postRollbackKalemCount = db.prepare('SELECT COUNT(*) as count FROM DATA_TeminKalem WHERE temin_dosya_id = 10').get() as {
      count: number
    }
    expect(postRollbackKalemCount.count).toBe(0) // Eklenmeye çalışılan 'Fotokopi Kağıdı A4' silinmiş/kaydedilmemiş!
  })

  it('2. GERÇEK FOREIGN KEY ROLLBACK KANITI: Yabancı anahtar (Foreign Key) kısıtlaması ihlal edildiğinde tüm transaction geri alınmalıdır', () => {
    // Hedefte olmayan bir dosya ID'sine kalem eklemeye çalışarak gerçek SQLITE_CONSTRAINT_FOREIGNKEY hatası üret
    const transactionStatements = [
      {
        sql: `UPDATE DATA_IhtiyacRaporu SET temin_dosya_id = ?, durum = 'dosyaya_aktarildi' WHERE id = ?`,
        params: [10, 1]
      },
      {
        sql: `INSERT INTO DATA_TeminKalem (temin_dosya_id, sira_no, kalem_adi, miktar) VALUES (?, ?, ?, ?)`,
        params: [999999, 1, 'Geçersiz Dosya Kalemi', 5] // 999999 ID'li dosya yok! Foreign key constraint ihlali
      }
    ]

    expect(() => {
      executeNativeSqliteTransaction(transactionStatements)
    }).toThrow(/FOREIGN KEY constraint failed/)

    // Rapor yine 'taslak' ve bağlantısız kalmalıdır
    const savedRapor = db.prepare('SELECT durum, temin_dosya_id FROM DATA_IhtiyacRaporu WHERE id = 1').get() as {
      durum: string
      temin_dosya_id: number | null
    }
    expect(savedRapor.durum).toBe('taslak')
    expect(savedRapor.temin_dosya_id).toBeNull()
  })

  it('3. GERÇEK COMMIT KANITI: Hata olmadığında tüm transaction atomik olarak başarıyla onaylanmalıdır (COMMIT)', () => {
    const validStatements = [
      {
        sql: `UPDATE DATA_IhtiyacRaporu SET temin_dosya_id = ?, durum = 'dosyaya_aktarildi' WHERE id = ?`,
        params: [10, 1]
      },
      {
        sql: `INSERT INTO DATA_TeminKalem (temin_dosya_id, sira_no, kalem_adi, miktar) VALUES (?, ?, ?, ?)`,
        params: [10, 1, 'Birinci Kalem', 10]
      },
      {
        sql: `INSERT INTO DATA_TeminKalem (temin_dosya_id, sira_no, kalem_adi, miktar) VALUES (?, ?, ?, ?)`,
        params: [10, 2, 'İkinci Kalem', 5]
      }
    ]

    const result = executeNativeSqliteTransaction(validStatements)
    expect(result.success).toBe(true)

    // Veritabanını sorgula ve tüm değişikliklerin kalıcı olduğunu doğrula
    const committedRapor = db.prepare('SELECT durum, temin_dosya_id FROM DATA_IhtiyacRaporu WHERE id = 1').get() as {
      durum: string
      temin_dosya_id: number | null
    }
    expect(committedRapor.durum).toBe('dosyaya_aktarildi')
    expect(committedRapor.temin_dosya_id).toBe(10)

    const committedKalemler = db.prepare('SELECT sira_no, kalem_adi, miktar FROM DATA_TeminKalem WHERE temin_dosya_id = 10 ORDER BY sira_no ASC').all() as {
      sira_no: number
      kalem_adi: string
      miktar: number
    }[]
    expect(committedKalemler.length).toBe(2)
    expect(committedKalemler[0].kalem_adi).toBe('Birinci Kalem')
    expect(committedKalemler[1].kalem_adi).toBe('İkinci Kalem')
  })
})
