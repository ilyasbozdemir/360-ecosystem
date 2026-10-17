import { validateSqlQuery, extractTableAndAction } from '../utils/sqlGuard'

export interface TransactionQuery {
  sql: string
  params?: unknown[]
}

export interface TransactionResult {
  success: boolean
  lastInsertRowid?: number | bigint
  changes?: number
  error?: string
}

export interface ExecuteDbTransactionOptions {
  validateSql?: boolean
  onMutation?: (
    tableName: string,
    action: 'insert' | 'update' | 'delete' | 'other',
    count: number
  ) => void
}

export interface HandleDbTransactionOptions extends ExecuteDbTransactionOptions {
  onSave?: () => void
}

export interface SqliteDatabaseLike {
  transaction?: (fn: (stmts: TransactionQuery[]) => void) => (stmts: TransactionQuery[]) => void
  prepare: (
    sql: string
  ) => { run: (...params: unknown[]) => { lastInsertRowid?: number | bigint; changes?: number } }
  exec?: (sql: string) => void
}

/**
 * Çoklu SQL sorgularını tek bir atomik SQLite transaction'ı içinde yürütür.
 * Hem better-sqlite3 (Electron çalışma zamanı) hem de node:sqlite (test ortamı / Node 22+)
 * motorları ile doğrudan ve şeffaf olarak çalışır.
 *
 * Herhangi bir sorgu veya kısıtlama (FK, UNIQUE vb.) hatasında transaction geri alınır (ROLLBACK)
 * ve hata yukarı fırlatılır.
 */
export function executeDbTransaction(
  db: SqliteDatabaseLike,
  queries: TransactionQuery[],
  options?: ExecuteDbTransactionOptions
): { success: true; lastInsertRowid: number | bigint; changes: number } {
  if (!db) {
    throw new Error('[dbTransaction] Veritabanı bağlantısı sağlanamadı.')
  }

  if (options?.validateSql !== false) {
    for (const q of queries) {
      validateSqlQuery(q.sql, q.params || [])
    }
  }

  let lastInsertRowid: number | bigint = 0
  let totalChanges = 0

  const runAll = (stmts: TransactionQuery[]) => {
    for (const q of stmts) {
      const stmt = db.prepare(q.sql)
      const params = q.params || []
      const info = stmt.run(...params)
      lastInsertRowid = info.lastInsertRowid ?? lastInsertRowid
      totalChanges += Number(info.changes || 0)
      if (options?.onMutation) {
        const { tableName, action } = extractTableAndAction(q.sql)
        options.onMutation(tableName, action, Number(info.changes || 1))
      }
    }
  }

  if (typeof db.transaction === 'function') {
    // 1. Native better-sqlite3 transaction API (db.transaction)
    const tx = db.transaction((stmts: TransactionQuery[]) => {
      runAll(stmts)
    })
    tx(queries)
  } else if (typeof db.exec === 'function') {
    // 2. node:sqlite (DatabaseSync) veya genel SQLite motoru (BEGIN IMMEDIATE / COMMIT / ROLLBACK)
    db.exec('BEGIN IMMEDIATE;')
    try {
      runAll(queries)
      db.exec('COMMIT;')
    } catch (error) {
      try {
        db.exec('ROLLBACK;')
      } catch (rollbackError) {
        console.error('[dbTransaction] Rollback execution failed:', rollbackError)
      }
      throw error
    }
  } else {
    throw new Error('[dbTransaction] Veritabanı motoru ne db.transaction ne de db.exec destekliyor.')
  }

  return { success: true, lastInsertRowid, changes: totalChanges }
}

/**
 * IPC ve üst servis katmanları için güvenli transaction işleyicisi.
 * Hata oluştuğunda rollback'i garanti eder, onSave'i çağırmaz ve { success: false, error: message } döner.
 * Başarılı olduğunda commit sonrası onSave'i tetikler ve sonucu iletir.
 */
export async function handleDbTransaction(
  db: SqliteDatabaseLike,
  queries: TransactionQuery[],
  options?: HandleDbTransactionOptions
): Promise<TransactionResult> {
  try {
    const result = executeDbTransaction(db, queries, options)
    if (options?.onSave) {
      options.onSave()
    }
    return result
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
