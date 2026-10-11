export interface TableInfo {
  name: string
  count: number
}

export interface ColumnInfo {
  cid: number
  name: string
  type: string
  notnull: number
  dflt_value: unknown
  pk: number
}

export interface EditingCell {
  rowIndex: number
  colName: string
  originalValue: unknown
}

export type TabType = 'data' | 'schema' | 'console'

export interface StatusMessage {
  type: 'success' | 'error'
  text: string
}
