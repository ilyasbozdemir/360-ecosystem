/**
 * SQL Security Guard for validating IPC SQL queries.
 * Prevents multi-statement injections, mass unparameterized modifications,
 * destructive schema tampering, and raw SQL exfiltration of sensitive key-value tables.
 */

const RESTRICTED_TABLES = ['SETTINGS', 'TANIM_AYAR']

export function validateSqlQuery(sql: string, _params?: unknown[]): void {
  void _params
  const cleanSql = sql.trim()

  // 1. Strip comments
  let strippedSql = cleanSql
    .replace(/\/\*[\s\S]*?\*\//g, ' ') // Strip block comments
    .replace(/--.*$/gm, ' ') // Strip line comments

  // 2. Strip single-quoted string literals ONLY ('...').
  // NOTE: Double quotes ("), backticks (`), and brackets ([]) in SQLite are IDENTIFIERS (table/column names), NOT string literals!
  strippedSql = strippedSql.replace(/'(?:''|[^'])*'/g, "''")

  // Check for multi-statement injection (e.g. SELECT 1; DELETE FROM tutanaklar)
  const statements = strippedSql.split(';').filter((stmt) => stmt.trim().length > 0)
  if (statements.length > 1) {
    throw new Error('[sqlGuard] Multi-statement SQL injection detected and blocked.')
  }

  // 3. Normalize SQL identifiers by unwrapping double quotes, backticks, and square brackets
  // e.g. "settings" -> settings, [TANIM_AYAR] -> TANIM_AYAR, `settings` -> settings, "main"."settings" -> main.settings
  const normalizedSql = strippedSql
    .replace(/\[([^\]]+)\]/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/"((?:""|[^"])+)"/g, (_, id) => id.replace(/""/g, '"'))

  // 4. Reject destructive DDL statements (DROP, TRUNCATE, ALTER, ATTACH, DETACH)
  if (
    /\b(DROP\s+(?:TABLE|VIEW|DATABASE|INDEX)|TRUNCATE\s+TABLE|ALTER\s+TABLE|ATTACH\s+DATABASE|DETACH\s+DATABASE)\b/i.test(
      normalizedSql
    )
  ) {
    throw new Error(
      '[sqlGuard] Destructive DDL operations (DROP/TRUNCATE/ALTER/ATTACH/DETACH) are prohibited via IPC.'
    )
  }

  // 5. Reject mass DELETE / UPDATE without WHERE clause (including CTEs e.g. WITH ... DELETE/UPDATE)
  const hasDelete = /\bDELETE\s+FROM\b/i.test(normalizedSql)
  const hasUpdate = /\bUPDATE\s+([A-Za-z0-9_.]+\s+)?SET\b/i.test(normalizedSql)

  if (hasDelete && !/\bWHERE\b/i.test(normalizedSql)) {
    throw new Error('[sqlGuard] Unparameterized mass DELETE without WHERE clause is prohibited.')
  }
  if (hasUpdate && !/\bWHERE\b/i.test(normalizedSql)) {
    throw new Error('[sqlGuard] Unparameterized mass UPDATE without WHERE clause is prohibited.')
  }

  // 6. Default-Deny rule for restricted key-value tables (settings / TANIM_Ayar)
  // General db:query / db:run channels must NOT directly execute raw SQL on settings.
  // Named handlers (db:get-settings, db:save-settings) must be used.
  const containsRestrictedTable = RESTRICTED_TABLES.some((table) =>
    new RegExp(`\\b${table}\\b`, 'i').test(normalizedSql)
  )

  if (containsRestrictedTable) {
    throw new Error(
      '[sqlGuard] Direct raw SQL query on settings/TANIM_Ayar table is restricted. ' +
        'Use dedicated named handlers (e.g. db:get-settings, db:save-settings) instead.'
    )
  }
}

export function extractTableAndAction(sql: string): {
  tableName: string
  action: 'insert' | 'update' | 'delete' | 'other'
} {
  if (!sql || typeof sql !== 'string') return { tableName: 'Veritabanı', action: 'other' }
  const clean = sql.trim().replace(/\s+/g, ' ')

  let action: 'insert' | 'update' | 'delete' | 'other' = 'other'
  if (/\bINSERT\s+INTO\b/i.test(clean)) action = 'insert'
  else if (/\bUPDATE\b/i.test(clean)) action = 'update'
  else if (/\bDELETE\s+FROM\b/i.test(clean)) action = 'delete'

  let tableName = 'Veritabanı'
  const match = clean.match(
    /(?:FROM|INTO|UPDATE)\s+(?:["`'[\]]?[A-Za-z0-9_]+["`'[\]]?\.)?["`'[\]]?([A-Za-z0-9_]+)["`'[\]]?/i
  )
  if (match && match[1]) {
    tableName = match[1]
  }
  return { tableName, action }
}
