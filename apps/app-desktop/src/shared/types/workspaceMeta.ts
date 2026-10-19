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

export function normalizeMeta(raw: any): WorkspaceMeta {
  return {
    dtal_version: raw.dtal_version || '1.0',
    app_version: raw.app_version || raw.version || '1.0.0',
    created_at:
      raw.created_at ||
      (raw.createdAt ? raw.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]),
    institution: raw.institution || raw.institutionName || 'Bilinmeyen Kurum',
    schema_version: parseInt(raw.schema_version || raw.schemaVersion || '1', 10) || 1,
    platform: raw.platform || (typeof process !== 'undefined' ? process.platform : 'win32'),
    file_version: raw.file_version || parseInt(raw.fileVersion || '1', 10) || 1,
    active_db_file: raw.active_db_file || 'database.sqlite',
    updated_at: raw.updated_at || raw.updatedAt || new Date().toISOString(),
    last_user_mutation_at:
      raw.last_user_mutation_at ||
      raw.lastUserMutationAt ||
      raw.updated_at ||
      new Date().toISOString(),
    integrity_hash: raw.integrity_hash,
    project_id:
      raw.project_id ||
      raw.projectId ||
      (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'default-proj-id'),
    data_revision:
      typeof raw.data_revision === 'number'
        ? raw.data_revision
        : typeof raw.dataRevision === 'number'
          ? raw.dataRevision
          : 1,
    last_backup_id: raw.last_backup_id || raw.lastBackupId || null,
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
