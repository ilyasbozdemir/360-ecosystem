/**
 * SQL Security Guard for validating IPC SQL queries.
 * Tokenizer-based SQL validation engine that strictly differentiates
 * SQL keywords, identifiers (quoted and unquoted), string literals, and comments.
 * Prevents multi-statement injections, mass unparameterized modifications,
 * destructive schema tampering, and raw SQL exfiltration of sensitive key-value tables.
 */

const RESTRICTED_TABLES = ['SETTINGS', 'TANIM_AYAR']

export type TokenType =
  | 'KEYWORD'
  | 'IDENTIFIER'
  | 'STRING'
  | 'NUMBER'
  | 'PUNCTUATION'
  | 'OPERATOR'

export interface SqlToken {
  type: TokenType
  value: string
  raw: string
}

const SQL_KEYWORDS = new Set([
  'SELECT',
  'INSERT',
  'UPDATE',
  'DELETE',
  'FROM',
  'WHERE',
  'SET',
  'INTO',
  'VALUES',
  'WITH',
  'AS',
  'JOIN',
  'LEFT',
  'RIGHT',
  'INNER',
  'OUTER',
  'ON',
  'GROUP',
  'BY',
  'ORDER',
  'LIMIT',
  'OFFSET',
  'UNION',
  'ALL',
  'CREATE',
  'DROP',
  'ALTER',
  'TRUNCATE',
  'TABLE',
  'VIEW',
  'INDEX',
  'TRIGGER',
  'ATTACH',
  'DETACH',
  'DATABASE',
  'PRAGMA',
  'BEGIN',
  'COMMIT',
  'ROLLBACK',
  'AND',
  'OR',
  'NOT',
  'IN',
  'IS',
  'NULL',
  'LIKE',
  'BETWEEN',
  'EXISTS',
  'CASE',
  'WHEN',
  'THEN',
  'ELSE',
  'END',
  'HAVING',
  'DISTINCT',
  'RETURNING'
])

export function tokenizeSql(sql: string): SqlToken[] {
  const tokens: SqlToken[] = []
  let i = 0
  const len = sql.length

  while (i < len) {
    const ch = sql[i]

    // 1. Whitespace
    if (/\s/.test(ch)) {
      i++
      continue
    }

    // 2. Line comment: --
    if (ch === '-' && sql[i + 1] === '-') {
      i += 2
      while (i < len && sql[i] !== '\n') i++
      continue
    }

    // 3. Block comment: /* ... */
    if (ch === '/' && sql[i + 1] === '*') {
      i += 2
      while (i < len && !(sql[i] === '*' && sql[i + 1] === '/')) i++
      if (i < len) i += 2
      continue
    }

    // 4. String literal: '...' (with '' escape)
    if (ch === "'") {
      let str = ''
      const start = i
      i++
      while (i < len) {
        if (sql[i] === "'") {
          if (sql[i + 1] === "'") {
            str += "'"
            i += 2
          } else {
            i++
            break
          }
        } else {
          str += sql[i]
          i++
        }
      }
      tokens.push({ type: 'STRING', value: str, raw: sql.slice(start, i) })
      continue
    }

    // 5. Double-quoted identifier: "..." (with "" escape)
    if (ch === '"') {
      let id = ''
      const start = i
      i++
      while (i < len) {
        if (sql[i] === '"') {
          if (sql[i + 1] === '"') {
            id += '"'
            i += 2
          } else {
            i++
            break
          }
        } else {
          id += sql[i]
          i++
        }
      }
      tokens.push({ type: 'IDENTIFIER', value: id, raw: sql.slice(start, i) })
      continue
    }

    // 6. Bracketed identifier: [...]
    if (ch === '[') {
      let id = ''
      const start = i
      i++
      while (i < len && sql[i] !== ']') {
        id += sql[i]
        i++
      }
      if (i < len && sql[i] === ']') i++
      tokens.push({ type: 'IDENTIFIER', value: id, raw: sql.slice(start, i) })
      continue
    }

    // 7. Backtick identifier: `...`
    if (ch === '`') {
      let id = ''
      const start = i
      i++
      while (i < len && sql[i] !== '`') {
        id += sql[i]
        i++
      }
      if (i < len && sql[i] === '`') i++
      tokens.push({ type: 'IDENTIFIER', value: id, raw: sql.slice(start, i) })
      continue
    }

    // 8. Numeric literals
    if (/\d/.test(ch)) {
      const start = i
      while (i < len && /[0-9.xXa-fA-F]/.test(sql[i])) i++
      tokens.push({ type: 'NUMBER', value: sql.slice(start, i), raw: sql.slice(start, i) })
      continue
    }

    // 9. Word (Keywords or unquoted identifiers)
    if (/[A-Za-z_\u0080-\uFFFF]/.test(ch)) {
      const start = i
      while (i < len && /[A-Za-z0-9_\u0080-\uFFFF]/.test(sql[i])) i++
      const word = sql.slice(start, i)
      const upper = word.toUpperCase()

      if (SQL_KEYWORDS.has(upper)) {
        tokens.push({ type: 'KEYWORD', value: upper, raw: word })
      } else {
        tokens.push({ type: 'IDENTIFIER', value: word, raw: word })
      }
      continue
    }

    // 10. Statement separator
    if (ch === ';') {
      tokens.push({ type: 'PUNCTUATION', value: ';', raw: ';' })
      i++
      continue
    }

    // 11. Operators and symbols
    tokens.push({ type: 'OPERATOR', value: ch, raw: ch })
    i++
  }

  return tokens
}

export function validateSqlQuery(sql: string, _params?: unknown[]): void {
  void _params
  if (!sql || typeof sql !== 'string' || sql.trim().length === 0) {
    return
  }

  const tokens = tokenizeSql(sql)
  if (tokens.length === 0) return

  // 1. Check for multi-statement injection (semicolons followed by non-punctuation tokens)
  for (let idx = 0; idx < tokens.length; idx++) {
    if (tokens[idx].type === 'PUNCTUATION' && tokens[idx].value === ';') {
      const hasSubsequentTokens = tokens.slice(idx + 1).some((t) => t.type !== 'PUNCTUATION')
      if (hasSubsequentTokens) {
        throw new Error('[sqlGuard] Multi-statement SQL injection detected and blocked.')
      }
    }
  }

  // 2. Reject destructive DDL operations (DROP, TRUNCATE, ALTER, ATTACH, DETACH)
  for (let idx = 0; idx < tokens.length; idx++) {
    const t = tokens[idx]
    if (t.type === 'KEYWORD') {
      const nextToken = tokens[idx + 1]
      const nextVal = nextToken?.value?.toUpperCase()

      if (
        t.value === 'DROP' &&
        nextToken?.type === 'KEYWORD' &&
        ['TABLE', 'VIEW', 'DATABASE', 'INDEX', 'TRIGGER'].includes(nextVal)
      ) {
        throw new Error(
          '[sqlGuard] Destructive DDL operations (DROP/TRUNCATE/ALTER/ATTACH/DETACH) are prohibited via IPC.'
        )
      }
      if (t.value === 'TRUNCATE' && nextToken?.type === 'KEYWORD' && nextVal === 'TABLE') {
        throw new Error(
          '[sqlGuard] Destructive DDL operations (DROP/TRUNCATE/ALTER/ATTACH/DETACH) are prohibited via IPC.'
        )
      }
      if (t.value === 'ALTER' && nextToken?.type === 'KEYWORD' && nextVal === 'TABLE') {
        throw new Error(
          '[sqlGuard] Destructive DDL operations (DROP/TRUNCATE/ALTER/ATTACH/DETACH) are prohibited via IPC.'
        )
      }
      if (
        t.value === 'ATTACH' &&
        (nextVal === 'DATABASE' || nextToken?.type === 'STRING' || nextToken?.type === 'IDENTIFIER')
      ) {
        throw new Error(
          '[sqlGuard] Destructive DDL operations (DROP/TRUNCATE/ALTER/ATTACH/DETACH) are prohibited via IPC.'
        )
      }
      if (
        t.value === 'DETACH' &&
        (nextVal === 'DATABASE' || nextToken?.type === 'IDENTIFIER')
      ) {
        throw new Error(
          '[sqlGuard] Destructive DDL operations (DROP/TRUNCATE/ALTER/ATTACH/DETACH) are prohibited via IPC.'
        )
      }
    }
  }

  // 3. Reject mass DELETE / UPDATE without true WHERE keyword clause (including CTEs e.g. WITH ... DELETE/UPDATE)
  // An identifier named "WHERE" or string literal 'WHERE' does NOT qualify as a WHERE keyword!
  const hasDeleteKeyword = tokens.some((t) => t.type === 'KEYWORD' && t.value === 'DELETE')
  const hasUpdateKeyword = tokens.some((t) => t.type === 'KEYWORD' && t.value === 'UPDATE')
  const hasWhereKeyword = tokens.some((t) => t.type === 'KEYWORD' && t.value === 'WHERE')

  if (hasDeleteKeyword && !hasWhereKeyword) {
    throw new Error('[sqlGuard] Unparameterized mass DELETE without WHERE clause is prohibited.')
  }
  if (hasUpdateKeyword && !hasWhereKeyword) {
    throw new Error('[sqlGuard] Unparameterized mass UPDATE without WHERE clause is prohibited.')
  }

  // 4. Default-Deny rule for restricted key-value tables (settings / TANIM_Ayar)
  const RESTRICTED_SET = new Set(RESTRICTED_TABLES.map((t) => t.toUpperCase()))
  for (const t of tokens) {
    if (t.type === 'IDENTIFIER' || t.type === 'KEYWORD') {
      if (RESTRICTED_SET.has(t.value.toUpperCase())) {
        throw new Error(
          '[sqlGuard] Direct raw SQL query on settings/TANIM_Ayar table is restricted. ' +
            'Use dedicated named handlers (e.g. db:get-settings, db:save-settings) instead.'
        )
      }
    }
  }
}

export function extractTableAndAction(sql: string): {
  tableName: string
  action: 'insert' | 'update' | 'delete' | 'other'
} {
  if (!sql || typeof sql !== 'string') return { tableName: 'Veritabanı', action: 'other' }
  const tokens = tokenizeSql(sql)

  let action: 'insert' | 'update' | 'delete' | 'other' = 'other'
  let tableName = 'Veritabanı'

  for (let idx = 0; idx < tokens.length; idx++) {
    const t = tokens[idx]
    if (t.type === 'KEYWORD') {
      if (t.value === 'INSERT' && tokens[idx + 1]?.value === 'INTO') {
        action = 'insert'
        // Skip INTO and optional database.
        let targetIdx = idx + 2
        if (tokens[targetIdx]?.type === 'IDENTIFIER') {
          if (tokens[targetIdx + 1]?.value === '.' && tokens[targetIdx + 2]?.type === 'IDENTIFIER') {
            targetIdx += 2
          }
          tableName = tokens[targetIdx].value
        }
        break
      } else if (t.value === 'UPDATE') {
        action = 'update'
        let targetIdx = idx + 1
        if (tokens[targetIdx]?.type === 'IDENTIFIER') {
          if (tokens[targetIdx + 1]?.value === '.' && tokens[targetIdx + 2]?.type === 'IDENTIFIER') {
            targetIdx += 2
          }
          tableName = tokens[targetIdx].value
        }
        break
      } else if (t.value === 'DELETE' && tokens[idx + 1]?.value === 'FROM') {
        action = 'delete'
        let targetIdx = idx + 2
        if (tokens[targetIdx]?.type === 'IDENTIFIER') {
          if (tokens[targetIdx + 1]?.value === '.' && tokens[targetIdx + 2]?.type === 'IDENTIFIER') {
            targetIdx += 2
          }
          tableName = tokens[targetIdx].value
        }
        break
      }
    }
  }

  return { tableName, action }
}
