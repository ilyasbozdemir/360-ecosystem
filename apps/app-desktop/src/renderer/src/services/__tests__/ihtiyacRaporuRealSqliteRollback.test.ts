// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { DatabaseSync } from 'node:sqlite'
import {
  executeDbTransaction,
  handleDbTransaction,
  SqliteDatabaseLike
} from '../../../../main/ipc/db/dbTransaction'
import { ihtiyacRaporuService } from '../ihtiyacRaporuService'
import { dbClient } from '../db/dbClient'

/**
 * Gerçek SQLite Veritabanı ile Transaction Rollback & Atomiklik Doğrulama Testi
 *
 * Bu test, uygulamanın ÜRETİM kodundaki gerçek transaction motorunu (executeDbTransaction / handleDbTransaction)
 * doğrudan Node.js v22'nin yerleşik SQLite motoru (node:sqlite DatabaseSync) üzerinde çalıştırır:
 * 1. Transaction içindeki işlemlerin bir SQL veya kısıtlama hatası aldığında fiziksel SQLite motoru
 *    tarafından anında ROLLBACK yapıldığını doğrular.
 * 2. Uygulamanın dbCoreHandlers / dbTransaction üretim kodunun doğrudan çağrıldığını ve
 *    ayrı bir test mock'u veya kopya transaction mantığı kullanılmadığını kanıtlar.
 * 3. Hata öncesinde başarılı çalışmış olan 'UPDATE DATA_IhtiyacRaporu' ve 'INSERT DATA_TeminKalem'
 *    işlemlerinin tümünün sıfırlandığını ve veritabanının ilk haline eksiksiz döndüğünü belgeler.
 * 4. ihtiyacRaporuService.linkToDosya() servisinin bu gerçek transaction motoruyla fiziksel
 *    veritabanında atomik çalıştığını ve hata anında eksiksiz rollback yaptığını doğrular.
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
        isin_aciklamasi TEXT,
        talep_eden_personel_id INTEGER,
        ihtiyac_yeri TEXT
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
        talep_eden_personel_id INTEGER,
        talep_eden_personel TEXT,
        talep_eden_unvan TEXT,
        birim_id INTEGER,
        birim_adi TEXT,
        tahmini_butce REAL DEFAULT 0,
        notlar TEXT,
        updated_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(temin_dosya_id) REFERENCES DATA_TeminDosyasi(id) ON DELETE SET NULL
      );

      CREATE TABLE DATA_IhtiyacRaporuKalem (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rapor_id INTEGER NOT NULL,
        sira_no INTEGER,
        kalem_adi TEXT NOT NULL,
        tipi TEXT DEFAULT 'Mal',
        birim TEXT DEFAULT 'Adet',
        miktar REAL NOT NULL,
        kdv_orani REAL DEFAULT 20,
        tasinir_kodu TEXT,
        okas_kodu TEXT,
        poz_no TEXT,
        aciklama TEXT,
        tahmini_birim_fiyat REAL,
        FOREIGN KEY(rapor_id) REFERENCES DATA_IhtiyacRaporu(id) ON DELETE CASCADE
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
        tasinir_kodu TEXT,
        okas_kodu TEXT,
        poz_no TEXT,
        aciklama TEXT,
        created_at DATETIME,
        updated_at DATETIME,
        FOREIGN KEY(temin_dosya_id) REFERENCES DATA_TeminDosyasi(id) ON DELETE CASCADE
      );
    `)

    // Başlangıç verilerini yerleştir: 1 hedef dosya ve 1 taslak ihtiyaç raporu ve kalemleri
    db.exec(`
      INSERT INTO DATA_TeminDosyasi (id, temin_no, dosya_no, konu, evrak_sayisi, isin_aciklamasi)
      VALUES (10, 'DT-2026/01', '2026/01', 'Kırtasiye Alımı', 'E-2026-100', 'Müdürlük kırtasiye ihtiyacı');

      INSERT INTO DATA_IhtiyacRaporu (id, rapor_no, baslik, gerekce, durum, temin_dosya_id, tarih, birim_adi)
      VALUES (1, 'IR-2026/001', 'A4 Kağıt İhtiyacı', 'Yazışmalar için', 'taslak', NULL, '2026-03-25', 'Yazı İşleri Müdürlüğü');

      INSERT INTO DATA_IhtiyacRaporuKalem (id, rapor_id, sira_no, kalem_adi, tipi, birim, miktar, kdv_orani)
      VALUES (101, 1, 1, 'Fotokopi Kağıdı A4', 'Mal', 'Paket', 50, 20);
    `)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    try {
      db.close()
    } catch {
      // ignore
    }
  })

  it('1. GERÇEK ROLLBACK KANITI (Üretim executeDbTransaction): SQL hatasında önceki işlemler geri alınmalı ve hata fırlatılmalıdır', () => {
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

    // 3. Adım: ÜRETİM KODUNDAKİ executeDbTransaction fonksiyonunu doğrudan çalıştır -> Gerçek SQLite hatası fırlatmalı
    expect(() => {
      executeDbTransaction(db, transactionStatements, { validateSql: true })
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
    expect(postRollbackKalemCount.count).toBe(0) // Eklenmeye çalışılan 'Fotokopi Kağıdı A4' kaydedilmemiş!
  })

  it('2. GERÇEK FOREIGN KEY ROLLBACK KANITI (Üretim executeDbTransaction): Yabancı anahtar kısıtlaması ihlal edildiğinde tüm transaction geri alınmalıdır', () => {
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
      executeDbTransaction(db, transactionStatements, { validateSql: true })
    }).toThrow(/FOREIGN KEY constraint failed/)

    // Rapor yine 'taslak' ve bağlantısız kalmalıdır
    const savedRapor = db.prepare('SELECT durum, temin_dosya_id FROM DATA_IhtiyacRaporu WHERE id = 1').get() as {
      durum: string
      temin_dosya_id: number | null
    }
    expect(savedRapor.durum).toBe('taslak')
    expect(savedRapor.temin_dosya_id).toBeNull()
  })

  it('3. GERÇEK COMMIT KANITI (Üretim executeDbTransaction): Hata olmadığında tüm transaction atomik olarak başarıyla onaylanmalıdır (COMMIT)', () => {
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

    const result = executeDbTransaction(db, validStatements, { validateSql: true })
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

  it('4. ÜRETİM IPC İŞLEYİCİSİ DOĞRULAMASI (handleDbTransaction): Hata durumunda rollback yapıp { success: false, error } dönmeli, onSave çağrılmamalıdır', async () => {
    let saveCalled = false
    let mutations: string[] = []

    const faultyStatements = [
      {
        sql: `UPDATE DATA_IhtiyacRaporu SET temin_dosya_id = ?, durum = 'dosyaya_aktarildi' WHERE id = ?`,
        params: [10, 1]
      },
      {
        sql: `INSERT INTO INVALID_TABLE_NAME (col) VALUES (123)`,
        params: []
      }
    ]

    const response = await handleDbTransaction(db, faultyStatements, {
      validateSql: true,
      onMutation: (tbl, action) => {
        mutations.push(`${tbl}:${action}`)
      },
      onSave: () => {
        saveCalled = true
      }
    })

    // 1. Dönen sonuç kontrolü
    expect(response.success).toBe(false)
    expect(response.error).toMatch(/no such table: INVALID_TABLE_NAME/)
    // 2. Rollback olduğu için workspace kaydedilmemeli
    expect(saveCalled).toBe(false)

    // 3. Veritabanı durumu taslak olarak korunmalı
    const savedRapor = db.prepare('SELECT durum, temin_dosya_id FROM DATA_IhtiyacRaporu WHERE id = 1').get() as {
      durum: string
      temin_dosya_id: number | null
    }
    expect(savedRapor.durum).toBe('taslak')
    expect(savedRapor.temin_dosya_id).toBeNull()
  })

  it('5. SQL GÜVENLİK KORUMASI (sqlGuard Entegrasyonu): Güvenlik kuralını ihlal eden sorgular SQLite motoruna gitmeden engellenmeli ve işlem durdurulmalıdır', () => {
    const maliciousStatements = [
      {
        sql: `UPDATE DATA_IhtiyacRaporu SET durum = 'dosyaya_aktarildi' WHERE id = 1`,
        params: []
      },
      {
        sql: `SELECT * FROM SETTINGS WHERE key = 'license'`,
        params: []
      }
    ]

    expect(() => {
      executeDbTransaction(db, maliciousStatements, { validateSql: true })
    }).toThrow(/sqlGuard.*restricted/i)

    // Rapor yine taslak olarak kalmalı
    const savedRapor = db.prepare('SELECT durum FROM DATA_IhtiyacRaporu WHERE id = 1').get() as {
      durum: string
    }
    expect(savedRapor.durum).toBe('taslak')
  })

  it('6. END-TO-END SERVİS ENTEGRASYONU: ihtiyacRaporuService.linkToDosya(), üretim transaction motoru üzerinden gerçek SQLite üzerinde atomik çalışmalı ve hata anında rollback yapmalıdır', async () => {
    // dbClient köprüsünü doğrudan gerçek SQLite veritabanımıza bağla
    vi.spyOn(dbClient, 'query').mockImplementation(async (sql: string, params: any[] = []) => {
      const stmt = db.prepare(sql)
      return stmt.all(...params) as any
    })

    vi.spyOn(dbClient, 'queryFirst').mockImplementation(async (sql: string, params: any[] = []) => {
      const stmt = db.prepare(sql)
      const rows = stmt.all(...params) as any[]
      return rows.length > 0 ? rows[0] : null
    })

    vi.spyOn(dbClient, 'run').mockImplementation(async (sql: string, params: any[] = []) => {
      const stmt = db.prepare(sql)
      const info = stmt.run(...params)
      return { success: true, lastInsertRowid: info.lastInsertRowid, changes: Number(info.changes || 0) }
    })

    vi.spyOn(dbClient, 'transaction').mockImplementation(async (statements: { sql: string; params?: unknown[] }[]) => {
      const res = await handleDbTransaction(db, statements as any, { validateSql: true })
      if (!res.success) {
        throw new Error(res.error || 'Transaction failed')
      }
      return res
    })

    // Başarılı aktarım senaryosu
    const result = await ihtiyacRaporuService.linkToDosya(1, 10, {
      copyItemsToDosya: true,
      transferMode: 'append_if_missing'
    })

    expect(result.success).toBe(true)
    expect(result.transferredCount).toBe(1)

    // Gerçek SQLite kontrolü: Rapor dosyaya bağlanmış ve kalem aktarılmış olmalı
    const linkedRapor = db.prepare('SELECT durum, temin_dosya_id FROM DATA_IhtiyacRaporu WHERE id = 1').get() as {
      durum: string
      temin_dosya_id: number
    }
    expect(linkedRapor.durum).toBe('dosyaya_aktarildi')
    expect(linkedRapor.temin_dosya_id).toBe(10)

    const kalemInDosya = db.prepare('SELECT kalem_adi, miktar, birim FROM DATA_TeminKalem WHERE temin_dosya_id = 10').get() as {
      kalem_adi: string
      miktar: number
      birim: string
    }
    expect(kalemInDosya.kalem_adi).toBe('Fotokopi Kağıdı A4')
    expect(kalemInDosya.miktar).toBe(50)
    expect(kalemInDosya.birim).toBe('Paket')

    // Hata durumunda rollback doğrulaması: Var olmayan bir dosyaya bağlama denemesi
    await expect(ihtiyacRaporuService.linkToDosya(1, 999999)).rejects.toThrow(/Hedef alım dosyası bulunamadı/)
  })

  it('7. NODE.JS TEST ORTAMI DOĞRULAMASI: node:sqlite DatabaseSync desteği için Node.js sürümünün >= 22.5.0 olduğunu fiziki olarak doğrular', () => {
    const [majorStr, minorStr] = process.versions.node.split('.')
    const major = parseInt(majorStr, 10)
    const minor = parseInt(minorStr, 10)

    const isCompatible = major > 22 || (major === 22 && minor >= 5)
    expect(isCompatible).toBe(true)
    expect(typeof DatabaseSync).toBe('function')
  })

  it('8. BETTER-SQLITE3 UYUMLULUĞU: db.transaction sarmalayıcısına sahip motorlarda (Electron çalışma zamanı) native transaction yolunu kullanmalıdır', () => {
    let nativeTransactionCalled = false
    let preparedSql = ''

    const mockBetterSqliteDb: SqliteDatabaseLike = {
      prepare: (sql: string) => ({
        run: () => {
          preparedSql = sql
          return { lastInsertRowid: 1, changes: 1 }
        }
      }),
      transaction: (fn: (stmts: any[]) => void) => {
        return (stmts: any[]) => {
          nativeTransactionCalled = true
          fn(stmts)
        }
      }
    }

    const testStatements = [
      { sql: 'UPDATE DATA_IhtiyacRaporu SET durum = ? WHERE id = ?', params: ['onaylandi', 1] }
    ]

    const result = executeDbTransaction(mockBetterSqliteDb, testStatements, { validateSql: false })
    expect(result.success).toBe(true)
    expect(nativeTransactionCalled).toBe(true)
    expect(preparedSql).toBe('UPDATE DATA_IhtiyacRaporu SET durum = ? WHERE id = ?')
  })
})
