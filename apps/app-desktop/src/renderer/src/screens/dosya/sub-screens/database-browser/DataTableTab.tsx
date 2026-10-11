import React from 'react'
import { AlertTriangle, Check, Trash2, X } from 'lucide-react'
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
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex-1 overflow-auto border border-slate-200 dark:border-slate-800 rounded-xl custom-scrollbar relative bg-white dark:bg-slate-950">
        {filteredRows.length === 0 ? (
          <div className="text-center py-20 text-xs text-slate-400 italic">
            Bu tabloda aramanızla eşleşen kayıt bulunamadı.
          </div>
        ) : (
          <table className="w-full border-collapse text-[11px] text-left select-none">
            <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0 font-bold border-b border-slate-200 dark:border-slate-800 z-10">
              <tr>
                <th className="p-2 w-10 text-center border-r border-slate-200 dark:border-slate-800 text-slate-400">
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
                      className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap"
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
                <th className="p-2 w-12 text-center text-slate-400 font-sans">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-mono">
              {filteredRows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className="hover:bg-blue-50/30 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <td className="p-2 border-r border-slate-150 dark:border-slate-850 text-center text-slate-400 text-[10px]">
                    {rIdx + 1}
                  </td>
                  {columns.map((c) => {
                    const val = row[c.name]
                    const isEditing =
                      editingCell?.rowIndex === rIdx && editingCell?.colName === c.name
                    const isRelational = c.pk === 1 || c.name.endsWith('_id')

                    return (
                      <td
                        key={c.name}
                        onDoubleClick={() => handleCellClick(rIdx, c.name, val)}
                        className={`p-2 border-r border-slate-150 dark:border-slate-850 max-w-60 truncate cursor-pointer transition-colors relative ${
                          isEditing
                            ? 'bg-blue-50 dark:bg-blue-950/60 ring-2 ring-blue-500'
                            : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                        }`}
                        title="Çift tıklayarak hücreyi düzenleyin"
                      >
                        {isEditing ? (
                          <div className="flex flex-col gap-1">
                            {isRelational && (
                              <span className="text-[8px] font-bold text-amber-600 dark:text-amber-400 font-sans flex items-center gap-1">
                                <AlertTriangle className="w-2.5 h-2.5" /> İlişkili ID alanı!
                              </span>
                            )}
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                autoFocus
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
                                className={`w-full bg-white dark:bg-slate-900 border rounded px-1.5 py-0.5 text-xs focus:outline-none font-mono ${
                                  isRelational ? 'border-amber-500' : 'border-blue-500'
                                }`}
                              />
                              <button
                                onClick={() => void handleSaveCell()}
                                className="text-emerald-600 hover:text-emerald-700 cursor-pointer p-0.5 border-0 bg-transparent"
                                title="Kaydet (Enter)"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingCell(null)}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 border-0 bg-transparent"
                                title="İptal (Esc)"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span>
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
                        )}
                      </td>
                    )
                  })}
                  <td className="p-2 text-center">
                    <button
                      onClick={() => setDeletingRow(row)}
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 border-0 bg-transparent"
                      title="Kayıt Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="mt-2 flex justify-between items-center text-[10px] text-slate-400 font-sans italic shrink-0">
        <span>
          💡 * İpucu: Herhangi bir hücreye <strong>çift tıklayarak</strong> değerini
          değiştirebilirsiniz.
        </span>
        <span>Sayfa başına limit: 200 kayıt</span>
      </div>
    </div>
  )
}
