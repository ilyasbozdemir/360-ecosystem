import React from 'react'
import { Database, RefreshCw, Search } from 'lucide-react'
import { TableInfo } from './types'

interface TableListSidebarProps {
  tableSearch: string
  setTableSearch: (val: string) => void
  filteredTables: TableInfo[]
  selectedTable: string
  setSelectedTable: (table: string) => void
  dbError: string | null
  loading: boolean
  loadTables: () => Promise<void>
}

export function TableListSidebar({
  tableSearch,
  setTableSearch,
  filteredTables,
  selectedTable,
  setSelectedTable,
  dbError,
  loading,
  loadTables
}: TableListSidebarProps): React.JSX.Element {
  return (
    <div className="w-1/4 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col gap-4 h-full bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Tablo ara..."
          value={tableSearch}
          onChange={(e) => setTableSearch(e.target.value)}
          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans text-left"
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1">
        {filteredTables.map((t) => (
          <button
            key={t.name}
            onClick={() => setSelectedTable(t.name)}
            className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all cursor-pointer border-0 ${
              selectedTable === t.name
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/10'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <Database
                className={`w-3.5 h-3.5 ${
                  selectedTable === t.name ? 'text-white' : 'text-slate-400'
                }`}
              />
              <span className="truncate font-mono">{t.name}</span>
            </div>
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold font-mono shrink-0 ${
                selectedTable === t.name
                  ? 'bg-blue-700 text-blue-100'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
        {filteredTables.length === 0 && (
          <div className="text-center py-6 px-2 text-xs text-slate-500 dark:text-slate-400 flex flex-col items-center gap-2">
            <span className="leading-relaxed">
              {dbError || 'Tablo bulunamadı veya veri dosyası açık değil.'}
            </span>
            <button
              onClick={() => void loadTables()}
              disabled={loading}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm text-xs border-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Yükleniyor...' : 'Yeniden Bağlan / Tabloları Yükle'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
