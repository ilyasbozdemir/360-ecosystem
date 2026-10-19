import React, { useState, useEffect, useCallback } from 'react'
import {
  AlertTriangle,
  Check,
  ClipboardPaste,
  Copy,
  Edit3,
  FileJson,
  Tag,
  Trash2,
  X
} from 'lucide-react'
import { ColumnInfo, EditingCell } from './types'

interface DataTableTabProps {
  filteredRows: Record<string, unknown>[]
  columns: ColumnInfo[]
  editingCell: EditingCell | null
  setEditingCell: (cell: EditingCell | null) => void
  editValue: string
  setEditValue: (val: string) => void
  handleCellClick: (rowIndex: number, colName: string, val: unknown) => void
  handleSaveCell: () => Promise<void>
  setDeletingRow: (row: Record<string, unknown>) => void
}

interface SelectedCell {
  rIdx: number
  colName: string
}

interface ContextMenuState {
  x: number
  y: number
  rIdx: number
  colName: string
  val: unknown
}

interface FeedbackState {
  rIdx: number
  colName: string
  type: 'copy' | 'paste'
  text: string
}

export function DataTableTab({
  filteredRows,
  columns,
  editingCell,
  setEditingCell,
  editValue,
  setEditValue,
  handleCellClick,
  handleSaveCell,
  setDeletingRow
}: DataTableTabProps): React.JSX.Element {
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null)
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)
  const [isEditValueCopied, setIsEditValueCopied] = useState<boolean>(false)

  const activeColInfo = editingCell
    ? columns.find((c) => c.name === editingCell.colName)
    : null
  const isEditingRelational =
    activeColInfo && (activeColInfo.pk === 1 || activeColInfo.name.endsWith('_id'))

  const showFeedback = useCallback(
    (rIdx: number, colName: string, type: 'copy' | 'paste', text: string): void => {
      setFeedback({ rIdx, colName, type, text })
      setTimeout(() => {
        setFeedback(null)
      }, 1800)
    },
    []
  )

  const handleCopyCellValue = useCallback(
    (rIdx: number, colName: string, val: unknown, e?: React.MouseEvent): void => {
      if (e) e.stopPropagation()
      const text =
        val === null || val === undefined
          ? ''
          : typeof val === 'object'
            ? JSON.stringify(val)
            : String(val)
      void navigator.clipboard.writeText(text)
      showFeedback(rIdx, colName, 'copy', 'Kopyalandı!')
    },
    [showFeedback]
  )

  const handlePasteToCell = useCallback(
    async (rIdx: number, colName: string, e?: React.MouseEvent): Promise<void> => {
      if (e) e.stopPropagation()
      try {
        const text = await navigator.clipboard.readText()
        const row = filteredRows[rIdx]
        const origVal = row ? row[colName] : null
        handleCellClick(rIdx, colName, origVal)
        setEditValue(text)
        showFeedback(rIdx, colName, 'paste', 'Yapıştırıldı!')
      } catch {
        /* clipboard read permission */
      }
    },
    [filteredRows, handleCellClick, setEditValue, showFeedback]
  )

  const handleCopyEditValue = (): void => {
    void navigator.clipboard.writeText(editValue)
    setIsEditValueCopied(true)
    setTimeout(() => {
      setIsEditValueCopied(false)
    }, 1800)
  }

  const handlePasteFromClipboard = async (): Promise<void> => {
    try {
      const text = await navigator.clipboard.readText()
      setEditValue(text)
    } catch {
      /* clipboard read permission */
    }
  }

  const handleSetNull = (): void => {
    setEditValue('')
  }

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = (): void => setContextMenu(null)
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  // Keyboard navigation & Shortcuts (Ctrl+C, Ctrl+V, Enter, Arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const activeTag = document.activeElement?.tagName.toLowerCase()
      if (activeTag === 'input' || activeTag === 'textarea') return

      if (!selectedCell || editingCell) return

      const { rIdx, colName } = selectedCell
      const row = filteredRows[rIdx]
      const val = row ? row[colName] : null

      // Copy: Ctrl+C / Cmd+C
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        e.preventDefault()
        handleCopyCellValue(rIdx, colName, val)
        return
      }

      // Paste: Ctrl+V / Cmd+V
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        e.preventDefault()
        void handlePasteToCell(rIdx, colName)
        return
      }

      // Edit: Enter or F2
      if (e.key === 'Enter' || e.key === 'F2') {
        e.preventDefault()
        handleCellClick(rIdx, colName, val)
        return
      }

      // Deselect: Escape
      if (e.key === 'Escape') {
        setSelectedCell(null)
        setContextMenu(null)
        return
      }

      // Arrow navigation
      const colIndex = columns.findIndex((c) => c.name === colName)
      if (colIndex === -1) return

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (rIdx > 0) setSelectedCell({ rIdx: rIdx - 1, colName })
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (rIdx < filteredRows.length - 1) setSelectedCell({ rIdx: rIdx + 1, colName })
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (colIndex > 0) setSelectedCell({ rIdx, colName: columns[colIndex - 1].name })
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (colIndex < columns.length - 1) setSelectedCell({ rIdx, colName: columns[colIndex + 1].name })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    selectedCell,
    editingCell,
    filteredRows,
    columns,
    handleCellClick,
    handleCopyCellValue,
    handlePasteToCell
  ])

  const selectedRowData = selectedCell ? filteredRows[selectedCell.rIdx] : null
  const selectedCellValue =
    selectedCell && selectedRowData ? selectedRowData[selectedCell.colName] : null

  return (
    <div className="h-full flex flex-col justify-between overflow-hidden relative">
      {/* 1. TOP BAR: A) EDITING MODE OR B) SELECTED CELL TOOLBAR */}
      {editingCell ? (
        <div className="mb-3 px-4 py-2.5 bg-linear-to-r from-blue-50 via-indigo-50/80 to-blue-50 dark:from-blue-950/80 dark:via-indigo-950/60 dark:to-blue-950/80 border-2 border-blue-500/80 dark:border-blue-400 rounded-xl flex items-center justify-between gap-3 shadow-md shadow-blue-500/10 animate-in fade-in slide-in-from-top-1 shrink-0 flex-wrap">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex items-center gap-1.5 bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-xs shrink-0">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Hücre Düzenleme Modu</span>
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-200 truncate font-sans">
              <span className="text-slate-400">Satır:</span>{' '}
              <strong className="font-mono text-blue-700 dark:text-blue-300 font-bold">
                #{editingCell.rowIndex + 1}
              </strong>
              <span className="mx-2 text-slate-300 dark:text-slate-700">|</span>
              <span className="text-slate-400">Kolon:</span>{' '}
              <strong className="font-mono text-blue-700 dark:text-blue-300 font-bold">
                {editingCell.colName}
              </strong>
              {isEditingRelational && (
                <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-sans">
                  ⚠️ İlişkili / ID Alanı
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-1 max-w-xl min-w-65">
            <div className="relative flex-1">
              <input
                type="text"
                autoFocus
                onFocus={(e) => e.target.select()}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void handleSaveCell()
                  if (e.key === 'Escape') setEditingCell(null)
                }}
                placeholder="Yeni değer yazın (Boş = NULL)..."
                className="w-full bg-white dark:bg-slate-900 border-2 border-blue-500 dark:border-blue-400 rounded-lg pl-3 pr-16 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
              />
              <div className="absolute right-1.5 top-1 flex items-center gap-1">
                {editValue !== String(editingCell.originalValue ?? '') && (
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold px-1">
                    *Değişti
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSetNull}
                  className="px-1.5 py-0.5 rounded text-[10px] font-sans font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border-0 cursor-pointer"
                  title="Değeri Boşalt / NULL Yap"
                >
                  NULL
                </button>
              </div>
            </div>

            {/* Quick Copy / Paste Buttons */}
            <button
              type="button"
              onClick={() => void handlePasteFromClipboard()}
              className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer border border-slate-200 dark:border-slate-700 shrink-0"
              title="Panodaki Metni Yapıştır (Ctrl+V)"
            >
              <ClipboardPaste className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Yapıştır</span>
            </button>

            <button
              type="button"
              onClick={handleCopyEditValue}
              className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer border border-slate-200 dark:border-slate-700 shrink-0"
              title="Mevcut Değeri Kopyala (Ctrl+C)"
            >
              {isEditValueCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Kopyala</span>
                </>
              )}
            </button>

            {/* Save / Cancel */}
            <button
              onClick={() => void handleSaveCell()}
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer border-0 shadow-sm shadow-emerald-600/20 shrink-0"
              title="Değişikliği Kaydet (Enter)"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Kaydet</span>
            </button>

            <button
              onClick={() => setEditingCell(null)}
              className="flex items-center gap-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer border-0 shrink-0"
              title="İptal (Esc)"
            >
              <X className="w-3.5 h-3.5" />
              <span>İptal</span>
            </button>
          </div>
        </div>
      ) : selectedCell ? (
        /* Selected Cell Quick Action Bar */
        <div className="mb-3 px-3.5 py-2 bg-linear-to-r from-blue-50/90 via-slate-50 to-indigo-50/70 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 border border-blue-200 dark:border-blue-900/60 rounded-xl flex items-center justify-between gap-3 shadow-xs shrink-0 flex-wrap animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-600 text-white shadow-xs">
              Seçili Hücre
            </span>
            <div className="text-xs text-slate-700 dark:text-slate-300 font-mono flex items-center gap-1.5 truncate">
              <span className="text-slate-400 font-sans text-[11px]">Satır:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                #{selectedCell.rIdx + 1}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-slate-400 font-sans text-[11px]">Sütun:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {selectedCell.colName}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-slate-400 font-sans text-[11px]">Değer:</span>
              <span className="font-semibold text-slate-600 dark:text-slate-400 truncate max-w-48 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                {selectedCellValue === null || selectedCellValue === undefined
                  ? 'NULL'
                  : String(selectedCellValue)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Direct Copy Button with shortcut badge */}
            <button
              type="button"
              onClick={() =>
                handleCopyCellValue(selectedCell.rIdx, selectedCell.colName, selectedCellValue)
              }
              className="flex items-center gap-1.5 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer transition-all active:scale-95"
              title="Hücreyi Panoya Kopyala"
            >
              <Copy className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Kopyala</span>
              <kbd className="text-[9px] bg-slate-100 dark:bg-slate-900 text-slate-400 px-1 py-0.2 rounded font-mono">
                Ctrl+C
              </kbd>
            </button>

            {/* Direct Paste Button */}
            <button
              type="button"
              onClick={() => void handlePasteToCell(selectedCell.rIdx, selectedCell.colName)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg border-0 shadow-xs shadow-blue-600/20 cursor-pointer transition-all active:scale-95"
              title="Panodaki Değeri Buraya Yapıştır"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>Yapıştır</span>
              <kbd className="text-[9px] bg-blue-700/80 text-blue-100 px-1 py-0.2 rounded font-mono">
                Ctrl+V
              </kbd>
            </button>

            {/* Edit Button */}
            <button
              type="button"
              onClick={() =>
                handleCellClick(selectedCell.rIdx, selectedCell.colName, selectedCellValue)
              }
              className="flex items-center gap-1 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer transition-all active:scale-95"
              title="Hücreyi Düzenle (Enter)"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Düzenle</span>
              <kbd className="text-[9px] bg-slate-100 dark:bg-slate-900 text-slate-400 px-1 py-0.2 rounded font-mono">
                Enter
              </kbd>
            </button>

            {/* Clear Selection */}
            <button
              type="button"
              onClick={() => setSelectedCell(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-0 bg-transparent cursor-pointer"
              title="Seçimi Kaldır (Esc)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : null}

      {/* 2. INTERACTIVE DATA GRID */}
      <div className="flex-1 overflow-auto border border-slate-200 dark:border-slate-800 rounded-xl custom-scrollbar relative bg-white dark:bg-slate-950 focus:outline-none">
        {filteredRows.length === 0 ? (
          <div className="text-center py-20 text-xs text-slate-400 italic">
            Bu tabloda aramanızla eşleşen kayıt bulunamadı.
          </div>
        ) : (
          <table className="w-full border-collapse text-[11px] text-left select-text">
            <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0 font-bold border-b border-slate-200 dark:border-slate-800 z-20">
              <tr>
                <th className="p-2 w-10 text-center border-r border-slate-200 dark:border-slate-800 text-slate-400 select-none">
                  #
                </th>
                {columns.map((c) => {
                  const isPk = c.pk === 1
                  const isFk = c.name.endsWith('_id') || (c.name === 'id' && !isPk)
                  const isSystemFlag = [
                    'durum_asama_id',
                    'aktif_mi',
                    'is_deleted',
                    'status'
                  ].includes(c.name)

                  return (
                    <th
                      key={c.name}
                      className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap select-none"
                    >
                      {c.name}
                      {isPk && (
                        <span
                          title="Birincil Anahtar (Kritik ID): Bu ID değiştirilirse ilişkili tüm tablolardaki bağlantılar kopabilir!"
                          className="ml-1 text-[8px] bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 px-1 py-0.5 rounded uppercase font-extrabold font-sans cursor-help"
                        >
                          PK 🔑
                        </span>
                      )}
                      {!isPk && isFk && (
                        <span
                          title="İlişkili Dış Anahtar (FK): Başka bir tablonun ID değerine işaret eder (Örn: temin_dosya_id, firma_id)."
                          className="ml-1 text-[8px] bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 px-1 py-0.5 rounded uppercase font-extrabold font-sans cursor-help"
                        >
                          FK 🔗
                        </span>
                      )}
                      {isSystemFlag && (
                        <span
                          title="Süreç ve Durum Kontrol Alanı: Uygulama mantığını etkiler."
                          className="ml-1 text-[8px] bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 px-1 py-0.5 rounded uppercase font-extrabold font-sans cursor-help"
                        >
                          SİSTEM ⚙️
                        </span>
                      )}
                    </th>
                  )
                })}
                <th className="p-2 w-12 text-center text-slate-400 font-sans select-none">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-mono">
              {filteredRows.map((row, rIdx) => {
                const isRowEditing = editingCell?.rowIndex === rIdx
                const isRowSelected = selectedCell?.rIdx === rIdx

                return (
                  <tr
                    key={rIdx}
                    className={`transition-colors ${
                      isRowEditing
                        ? 'bg-blue-50/60 dark:bg-blue-950/40 ring-1 ring-blue-200 dark:ring-blue-800'
                        : isRowSelected
                          ? 'bg-blue-50/20 dark:bg-blue-950/20'
                          : 'hover:bg-blue-50/30 dark:hover:bg-slate-900/40'
                    }`}
                  >
                    <td className="p-2 border-r border-slate-150 dark:border-slate-850 text-center text-slate-400 text-[10px] select-none">
                      {rIdx + 1}
                    </td>
                    {columns.map((c) => {
                      const val = row[c.name]
                      const isEditing =
                        editingCell?.rowIndex === rIdx && editingCell?.colName === c.name
                      const isSelected =
                        selectedCell?.rIdx === rIdx && selectedCell?.colName === c.name
                      const isRelational = c.pk === 1 || c.name.endsWith('_id')
                      const cellFeedback =
                        feedback?.rIdx === rIdx && feedback?.colName === c.name ? feedback : null

                      return (
                        <td
                          key={c.name}
                          onClick={() => setSelectedCell({ rIdx, colName: c.name })}
                          onDoubleClick={() => handleCellClick(rIdx, c.name, val)}
                          onContextMenu={(e) => {
                            e.preventDefault()
                            setSelectedCell({ rIdx, colName: c.name })
                            setContextMenu({
                              x: Math.min(e.clientX, window.innerWidth - 220),
                              y: Math.min(e.clientY, window.innerHeight - 260),
                              rIdx,
                              colName: c.name,
                              val
                            })
                          }}
                          className={`p-2 border-r border-slate-150 dark:border-slate-850 min-w-32 max-w-72 truncate cursor-pointer transition-all relative ${
                            isEditing
                              ? 'bg-blue-100/90 dark:bg-blue-900/70 ring-2 ring-blue-600 shadow-md z-15'
                              : isSelected
                                ? 'bg-blue-100/60 dark:bg-blue-900/40 ring-2 ring-blue-500 ring-inset shadow-xs z-10 font-semibold'
                                : cellFeedback
                                  ? cellFeedback.type === 'copy'
                                    ? 'bg-emerald-100/70 dark:bg-emerald-950/60 ring-2 ring-emerald-500/80 ring-inset'
                                    : 'bg-blue-100/70 dark:bg-blue-950/60 ring-2 ring-blue-500/80 ring-inset'
                                  : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                          }`}
                          title="Tıklayarak seçin • Çift tıklayarak düzenleyin • Sağ tıklayarak menüyü açın"
                        >
                          {/* Animated Feedback Badge (Kopyalandı / Yapıştırıldı) */}
                          {cellFeedback && (
                            <div
                              className={`absolute -top-3 right-1 z-30 px-2 py-0.5 rounded-full text-[9px] font-extrabold flex items-center gap-1 shadow-md animate-in fade-in zoom-in-90 duration-150 ${
                                cellFeedback.type === 'copy'
                                  ? 'bg-emerald-600 text-white shadow-emerald-600/30 ring-1 ring-emerald-400'
                                  : 'bg-blue-600 text-white shadow-blue-600/30 ring-1 ring-blue-400'
                              }`}
                            >
                              {cellFeedback.type === 'copy' ? (
                                <Check className="w-2.5 h-2.5" />
                              ) : (
                                <ClipboardPaste className="w-2.5 h-2.5" />
                              )}
                              <span>{cellFeedback.text}</span>
                            </div>
                          )}

                          {/* Active Cell Selection Corner Handle (Spreadsheet Accent) */}
                          {isSelected && !isEditing && (
                            <span className="absolute bottom-0 right-0 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-tl-xs pointer-events-none" />
                          )}

                          {isEditing ? (
                            <div className="flex flex-col gap-1 p-1 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-blue-400 dark:border-blue-500">
                              {isRelational && (
                                <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 font-sans flex items-center gap-1">
                                  <AlertTriangle className="w-2.5 h-2.5" /> İlişkili ID alanı!
                                </span>
                              )}
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  autoFocus
                                  onFocus={(e) => e.target.select()}
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      void handleSaveCell()
                                    }
                                    if (e.key === 'Escape') {
                                      setEditingCell(null)
                                    }
                                  }}
                                  className={`w-full bg-slate-50 dark:bg-slate-950 border rounded px-1.5 py-1 text-xs focus:outline-none font-mono font-bold text-slate-900 dark:text-white ${
                                    isRelational
                                      ? 'border-amber-500 focus:ring-1 focus:ring-amber-500'
                                      : 'border-blue-500 focus:ring-1 focus:ring-blue-500'
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={() => void handlePasteFromClipboard()}
                                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-950 border-0 bg-transparent shrink-0"
                                  title="Panodan Yapıştır"
                                >
                                  <ClipboardPaste className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => void handleSaveCell()}
                                  className="text-emerald-600 hover:text-emerald-700 cursor-pointer p-1 rounded hover:bg-emerald-50 dark:hover:bg-emerald-950 border-0 bg-transparent shrink-0"
                                  title="Kaydet (Enter)"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingCell(null)}
                                  className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 border-0 bg-transparent shrink-0"
                                  title="İptal (Esc)"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="group/cell flex items-center justify-between gap-1 w-full">
                              <span className="truncate select-text">
                                {val === null || val === undefined ? (
                                  <span className="text-slate-300 dark:text-slate-600 italic text-[10px]">
                                    NULL
                                  </span>
                                ) : typeof val === 'object' ? (
                                  JSON.stringify(val)
                                ) : (
                                  String(val)
                                )}
                              </span>

                              {/* Interactive Cell Action Pill: Visible on Selected or Hover */}
                              <div
                                className={`flex items-center gap-0.5 shrink-0 transition-opacity ${
                                  isSelected
                                    ? 'opacity-100'
                                    : 'opacity-0 group-hover/cell:opacity-100'
                                }`}
                              >
                                {/* Quick Copy Button */}
                                <button
                                  type="button"
                                  onClick={(e) => handleCopyCellValue(rIdx, c.name, val, e)}
                                  className={`p-1 rounded transition-all border cursor-pointer ${
                                    isSelected
                                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/50 shadow-xs'
                                      : 'hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 border-transparent bg-transparent'
                                  }`}
                                  title="Kopyala (Ctrl+C)"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>

                                {/* Quick Paste Button */}
                                <button
                                  type="button"
                                  onClick={(e) => void handlePasteToCell(rIdx, c.name, e)}
                                  className={`p-1 rounded transition-all border cursor-pointer ${
                                    isSelected
                                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 shadow-xs'
                                      : 'hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 border-transparent bg-transparent'
                                  }`}
                                  title="Panodan Yapıştır (Ctrl+V)"
                                >
                                  <ClipboardPaste className="w-3 h-3" />
                                </button>

                                {/* Quick Edit Button */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleCellClick(rIdx, c.name, val)
                                  }}
                                  className={`p-1 rounded transition-all border cursor-pointer ${
                                    isSelected
                                      ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 shadow-xs'
                                      : 'hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 border-transparent bg-transparent'
                                  }`}
                                  title="Düzenle (Enter / Çift tıkla)"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      )
                    })}
                    <td className="p-2 text-center select-none">
                      <button
                        onClick={() => setDeletingRow(row)}
                        className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 border-0 bg-transparent"
                        title="Kayıt Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* 3. RIGHT-CLICK CONTEXT MENU */}
      {contextMenu && (
        <div
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="fixed z-50 min-w-56 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-1 text-xs text-slate-700 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-2.5 py-1.5 border-b border-slate-150 dark:border-slate-800 text-[10px] text-slate-400 font-mono font-bold flex items-center justify-between">
            <span className="truncate max-w-32">{contextMenu.colName}</span>
            <span>Satır #{contextMenu.rIdx + 1}</span>
          </div>

          <div className="py-1 flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => {
                handleCopyCellValue(contextMenu.rIdx, contextMenu.colName, contextMenu.val)
                setContextMenu(null)
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-300 transition-colors text-left cursor-pointer border-0 bg-transparent"
            >
              <span className="flex items-center gap-2">
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Değeri Kopyala</span>
              </span>
              <kbd className="text-[9px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-slate-400">
                Ctrl+C
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                void handlePasteToCell(contextMenu.rIdx, contextMenu.colName)
                setContextMenu(null)
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-300 transition-colors text-left cursor-pointer border-0 bg-transparent"
            >
              <span className="flex items-center gap-2">
                <ClipboardPaste className="w-3.5 h-3.5 text-blue-500" />
                <span>Panodan Yapıştır</span>
              </span>
              <kbd className="text-[9px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-slate-400">
                Ctrl+V
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => {
                handleCellClick(contextMenu.rIdx, contextMenu.colName, contextMenu.val)
                setContextMenu(null)
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left cursor-pointer border-0 bg-transparent"
            >
              <span className="flex items-center gap-2">
                <Edit3 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Hücreyi Düzenle</span>
              </span>
              <kbd className="text-[9px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-slate-400">
                Enter
              </kbd>
            </button>

            <div className="h-px bg-slate-150 dark:bg-slate-800 my-1" />

            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(contextMenu.colName)
                showFeedback(contextMenu.rIdx, contextMenu.colName, 'copy', 'Sütun Kopyalandı!')
                setContextMenu(null)
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer border-0 bg-transparent text-[11px]"
            >
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Sütun Adını Kopyala</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const row = filteredRows[contextMenu.rIdx]
                if (row) {
                  void navigator.clipboard.writeText(JSON.stringify(row, null, 2))
                  showFeedback(contextMenu.rIdx, contextMenu.colName, 'copy', 'JSON Kopyalandı!')
                }
                setContextMenu(null)
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer border-0 bg-transparent text-[11px]"
            >
              <FileJson className="w-3.5 h-3.5 text-slate-400" />
              <span>Tüm Satırı JSON Kopyala</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. HELPER FOOTER WITH KEYBOARD SHORTCUTS & TIPS */}
      <div className="mt-2 flex justify-between items-center text-[10px] text-slate-400 font-sans italic shrink-0">
        <span className="flex items-center gap-1.5 flex-wrap">
          <span className="font-bold text-blue-600 dark:text-blue-400">💡 Hızlı Kontroller:</span>
          <span>
            Hücreye <strong>tek tık</strong> seçim yapar, <strong>çift tık</strong> düzenler.
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>
            <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 font-mono text-[9px]">
              Ctrl+C
            </kbd>{' '}
            Kopyala,{' '}
            <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 font-mono text-[9px]">
              Ctrl+V
            </kbd>{' '}
            Yapıştır,{' '}
            <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 font-mono text-[9px]">
              Enter
            </kbd>{' '}
            Düzenle / Kaydet,{' '}
            <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 font-mono text-[9px]">
              Esc
            </kbd>{' '}
            İptal.
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>
            Hücreye <strong>sağ tıklayarak</strong> detaylı menüye erişebilirsiniz.
          </span>
        </span>
        <span className="shrink-0">Sayfa başına limit: 200 kayıt</span>
      </div>
    </div>
  )
}
