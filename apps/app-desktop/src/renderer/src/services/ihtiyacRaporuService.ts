import { dbClient } from './db/dbClient'
import {
  mapIhtiyacKalemToTeminKalem,
  sanitizeMiktar,
  sanitizeKdvOrani,
  sanitizeBirimFiyat
} from './ihtiyacRaporuAdapter'

export type TransferKalemMode = 'append_if_missing' | 'replace_all' | 'append_all'

export interface LinkToDosyaOptions {
  copyItemsToDosya?: boolean
  transferMode?: TransferKalemMode
}

export interface LinkToDosyaResult {
  success: boolean
  transferredCount: number
  skippedCount: number
  totalRaporKalemCount: number
}

export type IhtiyacRaporuDurum =
  | 'taslak'
  | 'inceleniyor'
  | 'onaylandi'
  | 'dosyaya_aktarildi'
  | 'iptal'

export type KalemTipi = 'Mal' | 'Hizmet' | 'Yapım' | 'Danışmanlık'

export interface IhtiyacRaporuKalem {
  id?: number
  rapor_id?: number
  sira_no?: number
  kalem_adi: string
  tipi: KalemTipi
  birim: string
  miktar: number
  kdv_orani?: number
  tasinir_kodu?: string | null
  okas_kodu?: string | null
  poz_no?: string | null
  aciklama?: string | null
  tahmini_birim_fiyat?: number
  created_at?: string
  updated_at?: string
}

export interface IhtiyacRaporu {
  id: number
  rapor_no: string
  baslik: string
  gerekce?: string | null
  birim_id?: number | null
  birim_adi?: string | null
  talep_eden_personel_id?: number | null
  talep_eden_personel?: string | null
  talep_eden_unvan?: string | null
  durum: IhtiyacRaporuDurum
  temin_dosya_id?: number | null
  tarih: string
  onay_tarihi?: string | null
  /** Ön bilgi / bütçe öngörüsü tutarı (Resmi yaklaşık maliyet hesabı değildir) */
  tahmini_butce?: number
  notlar?: string | null
  evrak_sayisi?: string | null
  created_at?: string
  updated_at?: string
  // İlişkili alanlar (Join)
  kalem_sayisi?: number
  dosya_no?: string | null
  dosya_konu?: string | null
  dosya_tur?: string | null
  dosya_evrak_sayisi?: string | null
}

export interface DosyaOption {
  id: number
  temin_no?: string | null
  dosya_no?: string | null
  konu: string
  tur?: string | null
  tarih?: string | null
  status?: string | null
}

let tablesChecked = false

export async function ensureIhtiyacRaporuTables(): Promise<void> {
  if (tablesChecked) return
  try {
    await dbClient.run(`CREATE TABLE IF NOT EXISTS DATA_IhtiyacRaporu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rapor_no TEXT NOT NULL UNIQUE,
      baslik TEXT NOT NULL,
      gerekce TEXT,
      birim_id INTEGER,
      birim_adi TEXT,
      talep_eden_personel_id INTEGER,
      talep_eden_personel TEXT,
      talep_eden_unvan TEXT,
      durum TEXT DEFAULT 'taslak',
      temin_dosya_id INTEGER,
      tarih DATE DEFAULT CURRENT_DATE,
      onay_tarihi DATE,
      tahmini_butce REAL DEFAULT 0,
      notlar TEXT,
      evrak_sayisi TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(temin_dosya_id) REFERENCES DATA_TeminDosyasi(id) ON DELETE SET NULL,
      FOREIGN KEY(birim_id) REFERENCES TANIM_Birim(id) ON DELETE SET NULL,
      FOREIGN KEY(talep_eden_personel_id) REFERENCES TANIM_Personel(id) ON DELETE SET NULL
    )`)
    await dbClient.run(`CREATE TABLE IF NOT EXISTS DATA_IhtiyacRaporuKalem (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rapor_id INTEGER NOT NULL,
      sira_no INTEGER,
      kalem_adi TEXT NOT NULL,
      tipi TEXT DEFAULT 'Mal',
      birim TEXT DEFAULT 'Adet',
      miktar REAL NOT NULL DEFAULT 1,
      kdv_orani REAL DEFAULT 20,
      tasinir_kodu TEXT,
      okas_kodu TEXT,
      poz_no TEXT,
      aciklama TEXT,
      tahmini_birim_fiyat REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(rapor_id) REFERENCES DATA_IhtiyacRaporu(id) ON DELETE CASCADE
    )`)
    // İndeksler
    await dbClient.run(
      `CREATE UNIQUE INDEX IF NOT EXISTS idx_ihtiyac_raporu_no ON DATA_IhtiyacRaporu(rapor_no)`
    )
    await dbClient.run(
      `CREATE INDEX IF NOT EXISTS idx_ihtiyac_raporu_temin_dosya ON DATA_IhtiyacRaporu(temin_dosya_id)`
    )
    await dbClient.run(
      `CREATE INDEX IF NOT EXISTS idx_ihtiyac_raporu_kalem_rapor ON DATA_IhtiyacRaporuKalem(rapor_id)`
    )
    tablesChecked = true
  } catch (e) {
    console.warn('[ihtiyacRaporuService] Auto-init tables warning:', e)
  }
}

export const ihtiyacRaporuService = {
  /**
   * Tüm ihtiyaç raporlarını ilişkili alım dosyası bilgileri ve kalem sayılarıyla birlikte listeler
   */
  async getRaporlar(filters?: {
    search?: string
    durum?: string
    baglantiDurumu?: 'all' | 'bagli' | 'bagimsiz'
    temin_dosya_id?: number | null
  }): Promise<IhtiyacRaporu[]> {
    await ensureIhtiyacRaporuTables()
    let sql = `
      SELECT 
        r.*,
        COUNT(k.id) AS kalem_sayisi,
        COALESCE(d.temin_no, d.dosya_no) AS dosya_no,
        d.konu AS dosya_konu,
        d.tur AS dosya_tur
      FROM DATA_IhtiyacRaporu r
      LEFT JOIN DATA_IhtiyacRaporuKalem k ON k.rapor_id = r.id
      LEFT JOIN DATA_TeminDosyasi d ON d.id = r.temin_dosya_id
      WHERE 1=1
    `
    const params: (string | number)[] = []

    if (filters?.durum && filters.durum !== 'all') {
      sql += ` AND r.durum = ?`
      params.push(filters.durum)
    }

    if (filters?.temin_dosya_id != null) {
      sql += ` AND r.temin_dosya_id = ?`
      params.push(filters.temin_dosya_id)
    } else if (filters?.baglantiDurumu === 'bagli') {
      sql += ` AND r.temin_dosya_id IS NOT NULL`
    } else if (filters?.baglantiDurumu === 'bagimsiz') {
      sql += ` AND r.temin_dosya_id IS NULL`
    }

    if (filters?.search && filters.search.trim()) {
      const q = `%${filters.search.trim()}%`
      sql += ` AND (
        r.rapor_no LIKE ? 
        OR r.baslik LIKE ? 
        OR r.gerekce LIKE ? 
        OR r.birim_adi LIKE ?
        OR d.temin_no LIKE ?
        OR d.dosya_no LIKE ?
        OR d.konu LIKE ?
      )`
      params.push(q, q, q, q, q, q, q)
    }

    sql += ` GROUP BY r.id ORDER BY r.id DESC`

    return dbClient.query<IhtiyacRaporu>(sql, params)
  },

  /**
   * ID'ye göre tekil ihtiyaç raporunu getirir
   */
  async getRaporById(id: number): Promise<IhtiyacRaporu | null> {
    await ensureIhtiyacRaporuTables()
    const sql = `
      SELECT 
        r.*,
        COUNT(k.id) AS kalem_sayisi,
        COALESCE(d.temin_no, d.dosya_no) AS dosya_no,
        d.konu AS dosya_konu,
        d.tur AS dosya_tur,
        d.evrak_sayisi AS dosya_evrak_sayisi
      FROM DATA_IhtiyacRaporu r
      LEFT JOIN DATA_IhtiyacRaporuKalem k ON k.rapor_id = r.id
      LEFT JOIN DATA_TeminDosyasi d ON d.id = r.temin_dosya_id
      WHERE r.id = ?
      GROUP BY r.id
    `
    return dbClient.queryFirst<IhtiyacRaporu>(sql, [id])
  },

  /**
   * Rapora ait ihtiyaç kalemlerini sıralı olarak getirir
   */
  async getRaporKalemleri(raporId: number): Promise<IhtiyacRaporuKalem[]> {
    await ensureIhtiyacRaporuTables()
    const sql = `
      SELECT * FROM DATA_IhtiyacRaporuKalem
      WHERE rapor_id = ?
      ORDER BY COALESCE(sira_no, 999999) ASC, id ASC
    `
    return dbClient.query<IhtiyacRaporuKalem>(sql, [raporId])
  },

  /**
   * Yıl bazlı sıradaki rapor numarasını üretir (Örn: IR-2026/001)
   */
  async getNextRaporNo(year?: number): Promise<string> {
    await ensureIhtiyacRaporuTables()
    const targetYear = year || new Date().getFullYear()
    const prefix = `IR-${targetYear}/`
    const sql = `
      SELECT rapor_no FROM DATA_IhtiyacRaporu
      WHERE rapor_no LIKE ?
      ORDER BY id DESC LIMIT 1
    `
    const lastRow = await dbClient.queryFirst<{ rapor_no: string }>(sql, [`${prefix}%`])

    if (lastRow?.rapor_no) {
      const match = lastRow.rapor_no.match(/(\d+)$/)
      if (match) {
        const nextNum = parseInt(match[1], 10) + 1
        return `${prefix}${nextNum.toString().padStart(3, '0')}`
      }
    }
    return `${prefix}001`
  },

  /**
   * Yeni bir İhtiyaç Raporu ve kalemlerini oluşturur
   */
  async createRapor(
    rapor: Omit<IhtiyacRaporu, 'id' | 'created_at' | 'updated_at' | 'kalem_sayisi'>,
    kalemler: IhtiyacRaporuKalem[] = []
  ): Promise<number> {
    await ensureIhtiyacRaporuTables()
    const totalEst = kalemler.reduce(
      (sum, item) =>
        sum + sanitizeMiktar(item.miktar, 0) * sanitizeBirimFiyat(item.tahmini_birim_fiyat, 0),
      0
    )

    const insertSql = `
      INSERT INTO DATA_IhtiyacRaporu (
        rapor_no, baslik, gerekce, birim_id, birim_adi,
        talep_eden_personel_id, talep_eden_personel, talep_eden_unvan,
        durum, temin_dosya_id, tarih, onay_tarihi,
        tahmini_butce, notlar, evrak_sayisi, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `
    const res = await dbClient.run(insertSql, [
      rapor.rapor_no,
      rapor.baslik,
      rapor.gerekce || null,
      rapor.birim_id || null,
      rapor.birim_adi || null,
      rapor.talep_eden_personel_id || null,
      rapor.talep_eden_personel || null,
      rapor.talep_eden_unvan || null,
      rapor.durum || 'taslak',
      rapor.temin_dosya_id || null,
      rapor.tarih || new Date().toISOString().split('T')[0],
      rapor.onay_tarihi || null,
      rapor.tahmini_butce ?? totalEst,
      rapor.notlar || null,
      rapor.evrak_sayisi || null
    ])

    const newId = Number(res.lastInsertRowid)

    // Kalemleri kaydet
    if (newId && kalemler.length > 0) {
      await this.saveKalemler(newId, kalemler)
    }

    return newId
  },

  /**
   * Mevcut İhtiyaç Raporunu ve kalemlerini günceller
   */
  async updateRapor(
    id: number,
    rapor: Partial<IhtiyacRaporu>,
    kalemler?: IhtiyacRaporuKalem[]
  ): Promise<void> {
    const fields: string[] = []
    const values: (string | number | null)[] = []

    if (rapor.rapor_no !== undefined) {
      fields.push('rapor_no = ?')
      values.push(rapor.rapor_no)
    }
    if (rapor.baslik !== undefined) {
      fields.push('baslik = ?')
      values.push(rapor.baslik)
    }
    if (rapor.gerekce !== undefined) {
      fields.push('gerekce = ?')
      values.push(rapor.gerekce)
    }
    if (rapor.birim_id !== undefined) {
      fields.push('birim_id = ?')
      values.push(rapor.birim_id)
    }
    if (rapor.birim_adi !== undefined) {
      fields.push('birim_adi = ?')
      values.push(rapor.birim_adi)
    }
    if (rapor.talep_eden_personel_id !== undefined) {
      fields.push('talep_eden_personel_id = ?')
      values.push(rapor.talep_eden_personel_id)
    }
    if (rapor.talep_eden_personel !== undefined) {
      fields.push('talep_eden_personel = ?')
      values.push(rapor.talep_eden_personel)
    }
    if (rapor.talep_eden_unvan !== undefined) {
      fields.push('talep_eden_unvan = ?')
      values.push(rapor.talep_eden_unvan)
    }
    if (rapor.durum !== undefined) {
      fields.push('durum = ?')
      values.push(rapor.durum)
    }
    if (rapor.temin_dosya_id !== undefined) {
      fields.push('temin_dosya_id = ?')
      values.push(rapor.temin_dosya_id)
    }
    if (rapor.tarih !== undefined) {
      fields.push('tarih = ?')
      values.push(rapor.tarih)
    }
    if (rapor.onay_tarihi !== undefined) {
      fields.push('onay_tarihi = ?')
      values.push(rapor.onay_tarihi)
    }
    if (rapor.tahmini_butce !== undefined) {
      fields.push('tahmini_butce = ?')
      values.push(rapor.tahmini_butce)
    }
    if (rapor.notlar !== undefined) {
      fields.push('notlar = ?')
      values.push(rapor.notlar)
    }
    if (rapor.evrak_sayisi !== undefined) {
      fields.push('evrak_sayisi = ?')
      values.push(rapor.evrak_sayisi)
    }

    fields.push('updated_at = CURRENT_TIMESTAMP')

    if (fields.length > 0) {
      values.push(id)
      await dbClient.run(
        `UPDATE DATA_IhtiyacRaporu SET ${fields.join(', ')} WHERE id = ?`,
        values
      )
    }

    if (kalemler !== undefined) {
      await this.saveKalemler(id, kalemler)
    }
  },

  /**
   * Rapor kalemlerini temizleyip topluca yeniden kaydeder
   */
  async saveKalemler(raporId: number, kalemler: IhtiyacRaporuKalem[]): Promise<void> {
    await dbClient.run(`DELETE FROM DATA_IhtiyacRaporuKalem WHERE rapor_id = ?`, [raporId])

    for (let i = 0; i < kalemler.length; i++) {
      const k = kalemler[i]
      await dbClient.run(
        `
        INSERT INTO DATA_IhtiyacRaporuKalem (
          rapor_id, sira_no, kalem_adi, tipi, birim,
          miktar, kdv_orani, tasinir_kodu, okas_kodu,
          poz_no, aciklama, tahmini_birim_fiyat,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
        [
          raporId,
          k.sira_no || i + 1,
          k.kalem_adi.trim(),
          k.tipi || 'Mal',
          k.birim || 'Adet',
          sanitizeMiktar(k.miktar, 1),
          sanitizeKdvOrani(k.kdv_orani, 20),
          k.tasinir_kodu || null,
          k.okas_kodu || null,
          k.poz_no || null,
          k.aciklama || null,
          sanitizeBirimFiyat(k.tahmini_birim_fiyat, 0)
        ]
      )
    }
  },

  /**
   * Raporu siler (Kalemler CASCADE ile SQLite tarafından otomatik silinir)
   */
  async deleteRapor(id: number): Promise<void> {
    await dbClient.run(`DELETE FROM DATA_IhtiyacRaporu WHERE id = ?`, [id])
  },

  /**
   * Mevcut bir raporu kopyalayarak yeni, bağımsız bir kayıt oluşturur:
   * - Farklı ID ve yeni benzersiz Rapor Numarası
   * - Durum: 'taslak'
   * - temin_dosya_id: null (bağlantısız bağımsız kopya)
   * - Kalemler bağımsız olarak klonlanır
   */
  async duplicateRapor(id: number): Promise<number> {
    const source = await this.getRaporById(id)
    if (!source) {
      throw new Error(`Kopyalanacak rapor bulunamadı (ID: ${id})`)
    }

    const sourceKalemler = await this.getRaporKalemleri(id)

    // Yeni benzersiz rapor no
    const currentYear = new Date().getFullYear()
    const baseNewNo = await this.getNextRaporNo(currentYear)

    const newRapor: Omit<IhtiyacRaporu, 'id' | 'created_at' | 'updated_at' | 'kalem_sayisi'> = {
      rapor_no: baseNewNo,
      baslik: `${source.baslik} (Kopya)`,
      gerekce: source.gerekce || null,
      birim_id: source.birim_id || null,
      birim_adi: source.birim_adi || null,
      talep_eden_personel_id: source.talep_eden_personel_id || null,
      talep_eden_personel: source.talep_eden_personel || null,
      talep_eden_unvan: source.talep_eden_unvan || null,
      durum: 'taslak',
      temin_dosya_id: null, // Asla eski dosya bağlantısını taşımaz
      tarih: new Date().toISOString().split('T')[0],
      onay_tarihi: null,
      tahmini_butce: source.tahmini_butce || 0,
      evrak_sayisi: null, // Yeni rapor bağımsız bir taslak olduğundan eski resmî EBYS evrak numarasını taşımaz
      notlar: source.notlar
        ? `[${source.rapor_no} raporundan kopyalandı] ${source.notlar}`
        : `[${source.rapor_no} raporundan kopyalandı]`
    }

    const clonedKalemler: IhtiyacRaporuKalem[] = sourceKalemler.map((k) => ({
      kalem_adi: k.kalem_adi,
      tipi: k.tipi,
      birim: k.birim,
      miktar: k.miktar,
      kdv_orani: k.kdv_orani,
      tasinir_kodu: k.tasinir_kodu,
      okas_kodu: k.okas_kodu,
      poz_no: k.poz_no,
      aciklama: k.aciklama,
      tahmini_birim_fiyat: k.tahmini_birim_fiyat
    }))

    return this.createRapor(newRapor, clonedKalemler)
  },

  /**
   * Raporu mevcut bir alım dosyasına bağlar.
   * Atomik transaction ile:
   * 1. Raporun durumunu ve dosya bağlantısını günceller.
   * 2. Kalem aktarımı istenmişse seçilen moda göre:
   *    - 'append_if_missing': Hedef dosyadaki mevcut kalemleri kontrol eder, mükerrer olanları atlar.
   *    - 'replace_all': Hedef dosyadaki mevcut kalemleri siler ve baştan yazar.
   *    - 'append_all': Tüm kalemleri dosyadaki mevcutların üzerine ekler.
   * 3. Hedef dosyanın talep eden personeli veya iş açıklaması boşsa rapordan tamamlar.
   * Tüm işlemler tek bir veritabanı transaction'ı içinde gerçekleştirilir; hata durumunda tamamen geri alınır (rollback).
   */
  async linkToDosya(
    raporId: number,
    dosyaId: number,
    options?: LinkToDosyaOptions
  ): Promise<LinkToDosyaResult> {
    const copyItems = options?.copyItemsToDosya !== false
    const mode: TransferKalemMode = options?.transferMode || 'append_if_missing'

    // Hedef dosya ve raporun varlığını doğrula
    const targetDosya = await dbClient.queryFirst<{
      id: number
      talep_eden_personel_id?: number | null
      ihtiyac_yeri?: string | null
      isin_aciklamasi?: string | null
    }>(
      `SELECT id, talep_eden_personel_id, ihtiyac_yeri, isin_aciklamasi FROM DATA_TeminDosyasi WHERE id = ?`,
      [dosyaId]
    )

    if (!targetDosya) {
      throw new Error(`Hedef alım dosyası bulunamadı (ID: ${dosyaId})`)
    }

    const rapor = await this.getRaporById(raporId)
    if (!rapor) {
      throw new Error(`İhtiyaç raporu bulunamadı (ID: ${raporId})`)
    }

    const txStatements: { sql: string; params?: unknown[] }[] = []

    // 1. Rapor bağlantısı ve durum güncellemesi
    txStatements.push({
      sql: `UPDATE DATA_IhtiyacRaporu SET temin_dosya_id = ?, durum = 'dosyaya_aktarildi', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      params: [dosyaId, raporId]
    })

    let transferredCount = 0
    let skippedCount = 0
    const kalemler = await this.getRaporKalemleri(raporId)

    // 2. Kalemlerin aktarımı (Atomik işlem sırasına eklenir)
    if (copyItems && kalemler.length > 0) {
      const existingItems = await dbClient.query<{
        id: number
        sira_no: number
        kalem_adi: string
        tipi?: string | null
        birim: string
        tasinir_kodu?: string | null
        okas_kodu?: string | null
        poz_no?: string | null
        aciklama?: string | null
      }>(
        `SELECT id, sira_no, kalem_adi, tipi, birim, tasinir_kodu, okas_kodu, poz_no, aciklama FROM DATA_TeminKalem WHERE temin_dosya_id = ? ORDER BY sira_no ASC`,
        [dosyaId]
      )

      if (mode === 'replace_all') {
        txStatements.push({
          sql: `DELETE FROM DATA_TeminKalem WHERE temin_dosya_id = ?`,
          params: [dosyaId]
        })

        let curSira = 1
        for (const k of kalemler) {
          const payload = mapIhtiyacKalemToTeminKalem(k, dosyaId, curSira++)
          txStatements.push({
            sql: `
              INSERT INTO DATA_TeminKalem (
                temin_dosya_id, sira_no, kalem_adi, tipi, birim,
                miktar, kdv_orani, tasinir_kodu, okas_kodu,
                poz_no, aciklama, created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `,
            params: [
              payload.temin_dosya_id,
              payload.sira_no,
              payload.kalem_adi,
              payload.tipi,
              payload.birim,
              payload.miktar,
              payload.kdv_orani,
              payload.tasinir_kodu,
              payload.okas_kodu,
              payload.poz_no,
              payload.aciklama
            ]
          })
          transferredCount++
        }
      } else if (mode === 'append_if_missing') {
        // Kalem eşleştirmesi: Yalnızca ad ve birim değil; tür, taşınır/okas kodları, poz ve açıklama da dahil edilerek
        // farklı teknik nitelik veya koda sahip kalemlerin yanlışlıkla elenmesi önlenir.
        const normalizeItemKey = (item: {
          kalem_adi?: string | null
          tipi?: string | null
          birim?: string | null
          tasinir_kodu?: string | null
          okas_kodu?: string | null
          poz_no?: string | null
          aciklama?: string | null
        }): string => {
          const name = (item.kalem_adi || '').trim().toLowerCase()
          const tipi = (item.tipi || 'Mal').trim().toLowerCase()
          const birim = (item.birim || 'Adet').trim().toLowerCase()
          const tasinir = (item.tasinir_kodu || '').trim().toLowerCase()
          const okas = (item.okas_kodu || '').trim().toLowerCase()
          const poz = (item.poz_no || '').trim().toLowerCase()
          const aciklama = (item.aciklama || '').trim().toLowerCase()
          return `${name}___${tipi}___${birim}___${tasinir}___${okas}___${poz}___${aciklama}`
        }

        const existingSet = new Set(
          existingItems.map((item) => normalizeItemKey(item))
        )

        let curSira =
          existingItems.reduce((max, item) => Math.max(max, item.sira_no || 0), 0) + 1

        for (const k of kalemler) {
          const key = normalizeItemKey(k)
          if (existingSet.has(key)) {
            skippedCount++
          } else {
            existingSet.add(key)
            const payload = mapIhtiyacKalemToTeminKalem(k, dosyaId, curSira++)
            txStatements.push({
              sql: `
                INSERT INTO DATA_TeminKalem (
                  temin_dosya_id, sira_no, kalem_adi, tipi, birim,
                  miktar, kdv_orani, tasinir_kodu, okas_kodu,
                  poz_no, aciklama, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
              `,
              params: [
                payload.temin_dosya_id,
                payload.sira_no,
                payload.kalem_adi,
                payload.tipi,
                payload.birim,
                payload.miktar,
                payload.kdv_orani,
                payload.tasinir_kodu,
                payload.okas_kodu,
                payload.poz_no,
                payload.aciklama
              ]
            })
            transferredCount++
          }
        }
      } else {
        // mode === 'append_all'
        let curSira =
          existingItems.reduce((max, item) => Math.max(max, item.sira_no || 0), 0) + 1

        for (const k of kalemler) {
          const payload = mapIhtiyacKalemToTeminKalem(k, dosyaId, curSira++)
          txStatements.push({
            sql: `
              INSERT INTO DATA_TeminKalem (
                temin_dosya_id, sira_no, kalem_adi, tipi, birim,
                miktar, kdv_orani, tasinir_kodu, okas_kodu,
                poz_no, aciklama, created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            `,
            params: [
              payload.temin_dosya_id,
              payload.sira_no,
              payload.kalem_adi,
              payload.tipi,
              payload.birim,
              payload.miktar,
              payload.kdv_orani,
              payload.tasinir_kodu,
              payload.okas_kodu,
              payload.poz_no,
              payload.aciklama
            ]
          })
          transferredCount++
        }
      }
    }

    // 3. Hedef dosyanın talep eden personeli veya iş açıklaması boşsa rapordan tamamla
    const dosyaUpdates: string[] = []
    const dosyaParams: (string | number)[] = []

    if (!targetDosya.talep_eden_personel_id && rapor.talep_eden_personel_id) {
      dosyaUpdates.push('talep_eden_personel_id = ?')
      dosyaParams.push(rapor.talep_eden_personel_id)
    }
    if (!targetDosya.ihtiyac_yeri && rapor.birim_adi) {
      dosyaUpdates.push('ihtiyac_yeri = ?')
      dosyaParams.push(rapor.birim_adi)
    }
    if (!targetDosya.isin_aciklamasi && (rapor.gerekce || rapor.baslik)) {
      dosyaUpdates.push('isin_aciklamasi = ?')
      dosyaParams.push((rapor.gerekce || rapor.baslik) as string)
    }

    if (dosyaUpdates.length > 0) {
      dosyaParams.push(dosyaId)
      txStatements.push({
        sql: `UPDATE DATA_TeminDosyasi SET ${dosyaUpdates.join(', ')} WHERE id = ?`,
        params: dosyaParams
      })
    }

    // Tüm adımları tek bir atomik transaction içinde işlet
    await dbClient.transaction(txStatements)

    return {
      success: true,
      transferredCount,
      skippedCount,
      totalRaporKalemCount: kalemler.length
    }
  },

  /**
   * Raporun alım dosyası bağlantısını kaldırır
   */
  async unlinkFromDosya(raporId: number): Promise<void> {
    await dbClient.run(
      `UPDATE DATA_IhtiyacRaporu SET temin_dosya_id = NULL, durum = 'taslak', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [raporId]
    )
  },

  /**
   * Dosyaya bağlama modalında listelenecek alım dosyalarını getirir
   */
  async getDosyalarForSelect(): Promise<DosyaOption[]> {
    const sql = `
      SELECT id, temin_no, dosya_no, konu, tur, tarih, status
      FROM DATA_TeminDosyasi
      ORDER BY id DESC
    `
    return dbClient.query<DosyaOption>(sql)
  },

  /**
   * Belirli bir alım dosyasına bağlı ihtiyaç raporunu getirir
   */
  async getLinkedRaporForDosya(dosyaId: number): Promise<IhtiyacRaporu | null> {
    await ensureIhtiyacRaporuTables()
    const sql = `
      SELECT 
        r.*,
        COUNT(k.id) AS kalem_sayisi,
        COALESCE(d.temin_no, d.dosya_no) AS dosya_no,
        d.konu AS dosya_konu,
        d.tur AS dosya_tur
      FROM DATA_IhtiyacRaporu r
      LEFT JOIN DATA_IhtiyacRaporuKalem k ON k.rapor_id = r.id
      LEFT JOIN DATA_TeminDosyasi d ON d.id = r.temin_dosya_id
      WHERE r.temin_dosya_id = ?
      GROUP BY r.id
      LIMIT 1
    `
    return dbClient.queryFirst<IhtiyacRaporu>(sql, [dosyaId])
  }
}
