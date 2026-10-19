import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useWorkspaceStore } from '../../../../store/workspaceStore'
import { TableInfo, ColumnInfo, EditingCell, TabType, StatusMessage } from './types'

export function useDatabaseBrowser() {
  const { activeFilePath, openWorkspace } = useWorkspaceStore()
  const [tables, setTables] = useState<TableInfo[]>([])
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [tableSearch, setTableSearch] = useState<string>('')
  const [columns, setColumns] = useState<ColumnInfo[]>([])
  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [dataSearch, setDataSearch] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [dbError, setDbError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('data')
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null)

  // Cell Editing State
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
  const [editValue, setEditValue] = useState<string>('')

  // Add Record Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [newRowData, setNewRowData] = useState<Record<string, string>>({})

  // Delete Confirm Modal State
  const [deletingRow, setDeletingRow] = useState<Record<string, unknown> | null>(null)

  // SQL Console states
  const [consoleQuery, setConsoleQuery] = useState<string>('')
  const [consoleResults, setConsoleResults] = useState<Record<string, unknown>[]>([])
  const [consoleError, setConsoleError] = useState<string | null>(null)
  const [consoleLoading, setConsoleLoading] = useState<boolean>(false)

  // Primary key column detector
  const pkColumn = useMemo(() => {
    return columns.find((c) => c.pk > 0) || columns[0]
  }, [columns])

  const loadTables = useCallback(async (): Promise<void> => {
    setLoading(true)
    setDbError(null)
    try {
      let res = await window.electron.ipcRenderer.invoke(
        'db:query',
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      )

      // Eğer ana süreçte aktif veritabanı yoksa ama renderer tarafında dosya yolu kayıtlıysa tekrar açmayı dene
      if (!res.success && activeFilePath) {
        const openRes = await openWorkspace(activeFilePath)
        if (openRes.success) {
          res = await window.electron.ipcRenderer.invoke(
            'db:query',
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
          )
        }
      }

      if (res.success && res.data) {
        const list: TableInfo[] = []
        for (const t of res.data) {
          const countRes = await window.electron.ipcRenderer.invoke(
            'db:query',
            `SELECT COUNT(*) as row_count FROM ${t.name}`
          )
          list.push({
            name: t.name,
            count: countRes.success && countRes.data[0] ? countRes.data[0].row_count : 0
          })
        }
        setTables(list)
        setSelectedTable((prev) => prev || (list.length > 0 ? list[0].name : ''))
      } else {
        setDbError(res.error || 'Açık bir çalışma veritabanı (.temin) bulunamadı.')
      }
    } catch (e) {
      console.error('Failed to load sqlite tables:', e)
      const err = e as { message?: string }
      setDbError(err?.message || 'Veritabanına erişilemedi.')
    } finally {
      setLoading(false)
    }
  }, [activeFilePath, openWorkspace])

  useEffect(() => {
    void loadTables()

    const handleWorkspaceSaved = (): void => {
      void loadTables()
    }
    window.addEventListener('workspace-saved', handleWorkspaceSaved)
    return () => {
      window.removeEventListener('workspace-saved', handleWorkspaceSaved)
    }
  }, [loadTables])

  // Load table details (schema + rows)
  const loadTableDetails = async (): Promise<void> => {
    if (!selectedTable) return
    setLoading(true)
    setEditingCell(null)
    setStatusMessage(null)
    try {
      const schemaRes = await window.electron.ipcRenderer.invoke(
        'db:query',
        `PRAGMA table_info(${selectedTable})`
      )
      if (schemaRes.success) {
        setColumns(schemaRes.data || [])
      }

      const dataRes = await window.electron.ipcRenderer.invoke(
        'db:query',
        `SELECT * FROM ${selectedTable} LIMIT 200`
      )
      if (dataRes.success) {
        setRows(dataRes.data || [])
      }
    } catch (e) {
      console.error('Failed to load table details:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true
    if (!selectedTable) return

    const fetchDetails = async (): Promise<void> => {
      setLoading(true)
      setEditingCell(null)
      setStatusMessage(null)
      try {
        const schemaRes = await window.electron.ipcRenderer.invoke(
          'db:query',
          `PRAGMA table_info(${selectedTable})`
        )
        if (schemaRes.success && isMounted) {
          setColumns(schemaRes.data || [])
        }

        const dataRes = await window.electron.ipcRenderer.invoke(
          'db:query',
          `SELECT * FROM ${selectedTable} LIMIT 200`
        )
        if (dataRes.success && isMounted) {
          setRows(dataRes.data || [])
        }
      } catch (e) {
        console.error('Failed to load table details:', e)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    void fetchDetails()
    return () => {
      isMounted = false
    }
  }, [selectedTable])

  const filteredTables = useMemo(() => {
    const query = tableSearch.toLowerCase().trim()
    if (!query) return tables
    return tables.filter((t) => t.name.toLowerCase().includes(query))
  }, [tables, tableSearch])

  const filteredRows = useMemo(() => {
    const q = dataSearch.toLowerCase().trim()
    if (!q) return rows
    return rows.filter((row) =>
      Object.values(row).some((val) =>
        String(val ?? '')
          .toLowerCase()
          .includes(q)
      )
    )
  }, [rows, dataSearch])

  // Start cell editing
  const handleCellClick = (rowIndex: number, colName: string, val: unknown): void => {
    setEditingCell({ rowIndex, colName, originalValue: val })
    setEditValue(val === null || val === undefined ? '' : String(val))
  }

  // Save edited cell value to SQLite
  const handleSaveCell = async (): Promise<void> => {
    if (!editingCell || !selectedTable) return
    const row = rows[editingCell.rowIndex]
    if (!row) return

    const { colName, originalValue } = editingCell
    if (String(originalValue ?? '') === editValue.trim()) {
      setEditingCell(null)
      return
    }

    try {
      let query = ''
      const params: unknown[] = []

      if (pkColumn && row[pkColumn.name] !== undefined) {
        query = `UPDATE ${selectedTable} SET ${colName} = ? WHERE ${pkColumn.name} = ?`
        params.push(editValue.trim() === '' ? null : editValue, row[pkColumn.name])
      } else {
        const whereClauses = columns
          .map((c) => (row[c.name] === null ? `${c.name} IS NULL` : `${c.name} = ?`))
          .join(' AND ')
        const whereParams = columns.filter((c) => row[c.name] !== null).map((c) => row[c.name])
        query = `UPDATE ${selectedTable} SET ${colName} = ? WHERE ${whereClauses}`
        params.push(editValue.trim() === '' ? null : editValue, ...whereParams)
      }

      const res = await window.electron.ipcRenderer.invoke('db:run', query, params)
      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: `Hücre (${colName}) başarıyla güncellendi.`
        })
        await loadTableDetails()
        await loadTables()
      } else {
        setStatusMessage({
          type: 'error',
          text: res.error || 'Güncelleme başarısız oldu.'
        })
      }
    } catch (err: unknown) {
      const error = err as Error
      setStatusMessage({
        type: 'error',
        text: error.message || 'Güncelleme hatası.'
      })
    } finally {
      setEditingCell(null)
    }
  }

  // Insert new record
  const handleInsertRow = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!selectedTable) return

    const colsToInsert = Object.keys(newRowData).filter((k) => newRowData[k].trim() !== '')
    if (colsToInsert.length === 0) {
      setStatusMessage({
        type: 'error',
        text: 'Lütfen en az bir alan doldurun.'
      })
      return
    }

    const placeholders = colsToInsert.map(() => '?').join(', ')
    const values = colsToInsert.map((k) => newRowData[k])
    const sql = `INSERT INTO ${selectedTable} (${colsToInsert.join(', ')}) VALUES (${placeholders})`

    try {
      const res = await window.electron.ipcRenderer.invoke('db:run', sql, values)
      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: 'Yeni kayıt başarıyla eklendi.'
        })
        setIsAddModalOpen(false)
        setNewRowData({})
        await loadTableDetails()
        await loadTables()
      } else {
        setStatusMessage({
          type: 'error',
          text: res.error || 'Kayıt eklenemedi.'
        })
      }
    } catch (err: unknown) {
      const error = err as Error
      setStatusMessage({
        type: 'error',
        text: error.message || 'Ekleme hatası.'
      })
    }
  }

  // Delete row
  const handleDeleteRowConfirm = async (): Promise<void> => {
    if (!deletingRow || !selectedTable) return

    try {
      let sql = ''
      const params: unknown[] = []

      if (pkColumn && deletingRow[pkColumn.name] !== undefined) {
        sql = `DELETE FROM ${selectedTable} WHERE ${pkColumn.name} = ?`
        params.push(deletingRow[pkColumn.name])
      } else {
        const whereClauses = columns
          .map((c) => (deletingRow[c.name] === null ? `${c.name} IS NULL` : `${c.name} = ?`))
          .join(' AND ')
        params.push(
          ...columns.filter((c) => deletingRow[c.name] !== null).map((c) => deletingRow[c.name])
        )
        sql = `DELETE FROM ${selectedTable} WHERE ${whereClauses}`
      }

      const res = await window.electron.ipcRenderer.invoke('db:run', sql, params)
      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: 'Kayıt veritabanından silindi.'
        })
        setDeletingRow(null)
        await loadTableDetails()
        await loadTables()
      } else {
        setStatusMessage({
          type: 'error',
          text: res.error || 'Silme işlemi başarısız.'
        })
      }
    } catch (err: unknown) {
      const error = err as Error
      setStatusMessage({
        type: 'error',
        text: error.message || 'Silme hatası.'
      })
    }
  }

  // Export current view data as CSV/Excel
  const handleExportCsv = (): void => {
    if (rows.length === 0 || columns.length === 0) return

    const headers = columns.map((c) => `"${c.name.replace(/"/g, '""')}"`).join(',')
    const csvLines = rows.map((r) =>
      columns
        .map((c) => {
          const val = r[c.name]
          if (val === null || val === undefined) return '""'
          return `"${String(val).replace(/"/g, '""')}"`
        })
        .join(',')
    )

    const csvContent = '\uFEFF' + [headers, ...csvLines].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${selectedTable}_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Run SQL Console query
  const handleRunQuery = async (): Promise<void> => {
    const rawSql = consoleQuery.trim()
    if (!rawSql) return
    setConsoleLoading(true)
    setConsoleError(null)
    setConsoleResults([])

    try {
      const isMutation = /^(DELETE|INSERT|UPDATE|DROP|ALTER|CREATE|REPLACE|PRAGMA|VACUUM)/i.test(
        rawSql
      )
      const channel = isMutation ? 'db:run' : 'db:query'
      const res = await window.electron.ipcRenderer.invoke(channel, rawSql)

      if (res.success) {
        if (isMutation) {
          setConsoleResults([
            {
              durum: 'Başarılı',
              etkilenen_satir: res.changes ?? 1,
              mesaj: 'SQL komutu başarıyla yürütüldü.'
            }
          ])
          await loadTableDetails()
          await loadTables()
        } else {
          setConsoleResults(res.data || [])
        }
      } else {
        setConsoleError(res.error || 'Sorgu çalıştırılırken bilinmeyen bir hata oluştu.')
      }
    } catch (e) {
      const err = e as Error
      setConsoleError(err.message || 'Hata: Sorgu yürütülemedi.')
    } finally {
      setConsoleLoading(false)
    }
  }

  return {
    tables,
    selectedTable,
    setSelectedTable,
    tableSearch,
    setTableSearch,
    columns,
    rows,
    dataSearch,
    setDataSearch,
    loading,
    dbError,
    activeTab,
    setActiveTab,
    statusMessage,
    setStatusMessage,
    editingCell,
    setEditingCell,
    editValue,
    setEditValue,
    isAddModalOpen,
    setIsAddModalOpen,
    newRowData,
    setNewRowData,
    deletingRow,
    setDeletingRow,
    consoleQuery,
    setConsoleQuery,
    consoleResults,
    consoleError,
    consoleLoading,
    pkColumn,
    filteredTables,
    filteredRows,
    loadTables,
    handleCellClick,
    handleSaveCell,
    handleInsertRow,
    handleDeleteRowConfirm,
    handleExportCsv,
    handleRunQuery
  }
}
