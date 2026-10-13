/**
 * Central Database Client (Infrastructure Layer)
 * Sadece CQRS Handler'ları tarafından kullanılır.
 * UI / TSX bileşenleri bu istemciye doğrudan erişmemelidir.
 */

export interface DbQueryResult<T = any> {
  success: boolean
  data?: T[]
  error?: string
}

export interface DbRunResult {
  success: boolean
  lastInsertRowid?: number | bigint
  changes?: number
  error?: string
}

class DatabaseClient {
  private get ipc() {
    if (typeof window !== 'undefined' && window.electron?.ipcRenderer) {
      return window.electron.ipcRenderer
    }
    throw new Error('[DbClient] Electron IPC Renderer ortamı bulunamadı!')
  }

  /**
   * SELECT sorgusu çalıştırır ve typed dizi döner
   */
  public async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    try {
      const res: DbQueryResult<T> = await this.ipc.invoke('db:query', sql, params)
      if (!res.success) {
        throw new Error(res.error || 'Veritabanı sorgusu başarısız oldu')
      }
      return res.data || []
    } catch (err: any) {
      console.error(`[DbClient Query Error] ${sql}:`, err)
      throw err
    }
  }

  /**
   * SELECT sorgusundan tek satır döner veya null
   */
  public async queryFirst<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const list = await this.query<T>(sql, params)
    return list.length > 0 ? list[0] : null
  }

  /**
   * INSERT / UPDATE / DELETE sorgusu çalıştırır
   */
  public async run(sql: string, params: any[] = []): Promise<DbRunResult> {
    try {
      const res: DbRunResult = await this.ipc.invoke('db:run', sql, params)
      if (!res.success) {
        throw new Error(res.error || 'Veritabanı çalıştırma işlemi başarısız oldu')
      }
      return res
    } catch (err: any) {
      console.error(`[DbClient Run Error] ${sql}:`, err)
      throw err
    }
  }
}

export const dbClient = new DatabaseClient()
