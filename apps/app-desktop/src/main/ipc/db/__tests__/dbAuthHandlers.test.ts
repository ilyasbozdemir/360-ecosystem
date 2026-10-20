import { describe, it, expect } from 'vitest'
import { applyPassword, savePasswordToHistory, scrubPasswordHistory } from '../dbAuthHandlers'

// Simple mock for better-sqlite3 Database
class MockDb {
  private store: Map<string, string> = new Map()

  prepare(sql: string) {
    const store = this.store
    return {
      run(...args: any[]) {
        if (sql.includes('DELETE FROM settings WHERE key LIKE')) {
          // DELETE FROM settings WHERE key LIKE 'pcPass_' || ? || '_%'
          const prefix = `pcPass_${args[0]}_`
          for (const k of Array.from(store.keys())) {
            if (k.startsWith(prefix)) store.delete(k)
          }
          return { changes: 1 }
        }
        if (sql.includes('DELETE FROM settings WHERE key =')) {
          const key = `pcPass_${args[0]}`
          store.delete(key)
          return { changes: 1 }
        }
        if (sql.includes("VALUES ('passwordHistory', ?)")) {
          store.set('passwordHistory', args[0])
          return { changes: 1 }
        }
        if (sql.includes('INSERT OR REPLACE INTO settings')) {
          const [k, v] = args
          store.set(k, v)
          return { changes: 1 }
        }
        return { changes: 0 }
      },
      get(...args: any[]) {
        if (sql.includes("WHERE key = 'passwordHistory'")) {
          const val = store.get('passwordHistory')
          return val !== undefined ? { value: val } : undefined
        }
        if (sql.includes("WHERE key = 'adminPassword'")) {
          const val = store.get('adminPassword')
          return val !== undefined ? { value: val } : undefined
        }
        if (sql.includes("WHERE key = 'additionalUsers'")) {
          const val = store.get('additionalUsers')
          return val !== undefined ? { value: val } : undefined
        }
        if (sql.includes('WHERE key = ?')) {
          const val = store.get(args[0])
          return val !== undefined ? { value: val } : undefined
        }
        return undefined
      },
      all() {
        return Array.from(store.entries()).map(([key, value]) => ({ key, value }))
      }
    }
  }

  getRawStore() {
    return this.store
  }
}

describe('dbAuthHandlers password management and multi-device invalidation', () => {
  it('clears all stale pcPass entries across different machines when password is changed', () => {
    const db = new MockDb()
    const store = db.getRawStore()

    // Pre-populate old passwords on multiple machines
    store.set('adminUsername', 'admin')
    store.set('adminPassword', 'oldHashedAdminPassword')
    store.set('pcPass_admin_DESKTOP-OFFICE', 'oldHashedAdminPassword')
    store.set('pcPass_admin_LAPTOP-REMOTE', 'oldHashedAdminPassword')
    store.set('pcPass_operator_OTHER-PC', 'operatorPassword') // Another user

    // Now admin changes password on current machine "LAPTOP-HOME"
    applyPassword(db, 'admin', 'YeniGucluSifre2026!', 'LAPTOP-HOME')

    // 1. Current machine key must exist and not match old password
    expect(store.has('pcPass_admin_LAPTOP-HOME')).toBe(true)
    expect(store.get('pcPass_admin_LAPTOP-HOME')).not.toBe('oldHashedAdminPassword')

    // 2. Previous machine keys for admin must be completely wiped out!
    expect(store.has('pcPass_admin_DESKTOP-OFFICE')).toBe(false)
    expect(store.has('pcPass_admin_LAPTOP-REMOTE')).toBe(false)

    // 3. Other users are not affected
    expect(store.has('pcPass_operator_OTHER-PC')).toBe(true)
  })

  it('saves strictly audit-only data to passwordHistory without password or passwordHash', () => {
    const db = new MockDb()
    const store = db.getRawStore()

    savePasswordToHistory(db, 'admin', 'GizliParola123!', 'TEST-PC')

    const raw = store.get('passwordHistory')
    expect(raw).toBeDefined()
    const history = JSON.parse(raw!)
    expect(history.length).toBe(1)
    expect(history[0].username).toBe('admin')
    expect(history[0].hostname).toBe('TEST-PC')
    expect(history[0].createdAt).toBeDefined()
    // CRITICAL: No password or passwordHash in history!
    expect(history[0].password).toBeUndefined()
    expect(history[0].passwordHash).toBeUndefined()
    expect(raw).not.toContain('GizliParola123!')
  })

  it('scrubs legacy plain passwords and hashes from existing passwordHistory', () => {
    const db = new MockDb()
    const store = db.getRawStore()

    // Legacy history containing password and passwordHash
    const legacyHistory = [
      {
        id: '1',
        username: 'admin',
        password: 'eski_plain_sifre',
        passwordHash: 'hash_abc123',
        hostname: 'OLD-PC',
        createdAt: '2025-01-01'
      }
    ]
    store.set('passwordHistory', JSON.stringify(legacyHistory))

    scrubPasswordHistory(db)

    const cleaned = JSON.parse(store.get('passwordHistory')!)
    expect(cleaned[0].username).toBe('admin')
    expect(cleaned[0].hostname).toBe('OLD-PC')
    expect(cleaned[0].password).toBeUndefined()
    expect(cleaned[0].passwordHash).toBeUndefined()
  })
})
