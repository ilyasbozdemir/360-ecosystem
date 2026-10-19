export interface WorkspaceMeta {
  dtal_version: string
  app_version: string
  created_at: string
  institution: string
  schema_version: number
  platform: string
  file_version: number
  active_db_file?: string
  updated_at?: string
  last_user_mutation_at?: string
  integrity_hash?: string
  project_id?: string
  data_revision?: number
  last_backup_id?: string | null
  warnings?: string[]
}

/**
 * Generates a deterministic UUID-formatted ID from project characteristics.
 * Works seamlessly in both Node.js and Browser environments without external dependencies.
 * Ensures that two computers opening the exact same legacy project derive the IDENTICAL project_id.
 */
export function deriveDeterministicProjectId(institution?: string, createdAt?: string): string {
  const cleanInst = (institution || 'DefaultInstitution').trim().toLowerCase()
  const cleanDate = (createdAt || '2026-01-01').trim()
  const seed = `temin360:proj:${cleanInst}:${cleanDate}`

  let h1 = 0x811c9dc5
  let h2 = 0x41c64e6d
  let h3 = 0x9e3779b9
  let h4 = 0x6a09e667

  for (let i = 0; i < seed.length; i++) {
    const code = seed.charCodeAt(i)
    h1 = Math.imul(h1 ^ code, 0x01000193)
    h2 = Math.imul(h2 ^ (code + i), 0x5bd1e995)
    h3 = Math.imul(h3 ^ (code >>> 2), 0x1000193)
    h4 = Math.imul(h4 ^ (code * 31), 0x27d4eb2f)
  }

  const p1 = (h1 >>> 0).toString(16).padStart(8, '0')
  const p2 = ((h2 >>> 16) & 0xffff).toString(16).padStart(4, '0')
  const p3 = ('5' + (h2 & 0x0fff).toString(16).padStart(3, '0')).slice(0, 4)
  const p4 = (
    (8 | ((h3 >>> 28) & 0x3)).toString(16) +
    ((h3 >>> 16) & 0x0fff).toString(16).padStart(3, '0')
  ).slice(0, 4)
  const p5 =
    (h3 >>> 0).toString(16).padStart(8, '0') +
    (h4 >>> 0).toString(16).padStart(8, '0').slice(0, 4)

  return `${p1}-${p2}-${p3}-${p4}-${p5}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeMeta(raw: any): WorkspaceMeta {
  const institution = raw?.institution || raw?.institutionName || 'Bilinmeyen Kurum'
  const createdAt =
    raw?.created_at ||
    (raw?.createdAt ? raw.createdAt.split('T')[0] : new Date().toISOString().split('T')[0])

  return {
    dtal_version: raw?.dtal_version || raw?.dtm_version || '1.0',
    app_version: raw?.app_version || raw?.version || '1.0.0',
    created_at: createdAt,
    institution,
    schema_version: parseInt(raw?.schema_version || raw?.schemaVersion || '1', 10) || 1,
    platform: raw?.platform || (typeof process !== 'undefined' ? process.platform : 'win32'),
    file_version: raw?.file_version || parseInt(raw?.fileVersion || '1', 10) || 1,
    active_db_file: raw?.active_db_file || 'database.sqlite',
    updated_at: raw?.updated_at || raw?.updatedAt || new Date().toISOString(),
    last_user_mutation_at:
      raw?.last_user_mutation_at ||
      raw?.lastUserMutationAt ||
      raw?.updated_at ||
      new Date().toISOString(),
    integrity_hash: raw?.integrity_hash,
    project_id:
      raw?.project_id || raw?.projectId || deriveDeterministicProjectId(institution, createdAt),
    data_revision:
      typeof raw?.data_revision === 'number'
        ? raw.data_revision
        : typeof raw?.dataRevision === 'number'
          ? raw.dataRevision
          : 1,
    last_backup_id: raw?.last_backup_id || raw?.lastBackupId || null,
    warnings: []
  }
}

export function calculateIntegrityHash(meta: Partial<WorkspaceMeta>): string {
  const payload = {
    dtal_version: meta.dtal_version,
    app_version: meta.app_version,
    schema_version: meta.schema_version,
    created_at: meta.created_at,
    institution: meta.institution,
    platform: meta.platform,
    project_id: meta.project_id,
    data_revision: meta.data_revision
  }
  const str = JSON.stringify(payload)
  // Simple hex hash calculation compatible with both Node and Web
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return Math.abs(hash).toString(16).padStart(8, '0')
}
