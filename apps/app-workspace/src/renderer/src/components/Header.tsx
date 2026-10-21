import React from 'react'
import { LayoutGrid, Moon, Sun, Search, Sparkles, Minus, Square, X } from 'lucide-react'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  isDark: boolean
  onToggleTheme: () => void
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  isDark,
  onToggleTheme
}) => {
  const isElectron = typeof window !== 'undefined' && !!window.workspaceAPI

  const handleMinimize = () => {
    window.workspaceAPI?.minimizeWindow()
  }

  const handleMaximize = () => {
    window.workspaceAPI?.maximizeWindow()
  }

  const handleClose = () => {
    window.workspaceAPI?.closeWindow()
  }

  return (
    <header
      style={{
        backgroundColor: 'var(--theme-bg-200)',
        borderBottom: '1px solid var(--theme-border-100)'
      }}
      className="sticky top-0 z-40 shadow-xs backdrop-blur-md select-none"
    >
      {/* Üst Vurgu Çizgisi - TEMİN 360 İmzası */}
      <div className="h-0.5 w-full bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500" />

      <div className="px-5 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Sol Alan: Logo, Başlık ve Ekosistem Rozeti */}
        <div className="flex items-center gap-3">
          <div
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              color: '#ffffff'
            }}
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md font-bold text-lg shrink-0"
          >
            <LayoutGrid size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight" style={{ color: 'var(--theme-text-100)' }}>
                Workspace 360
              </h1>
              <span
                style={{
                  backgroundColor: 'var(--theme-badge-planned-bg)',
                  color: 'var(--theme-badge-planned-text)',
                  borderColor: 'var(--theme-badge-planned-border)'
                }}
                className="text-[11px] px-2 py-0.5 rounded-full border font-semibold flex items-center gap-1"
              >
                <Sparkles size={11} /> WorkSuite 360
              </span>
            </div>
            <p className="text-[11px]" style={{ color: 'var(--theme-text-200)' }}>
              Merkezi Masaüstü Çalışma Alanı, Uygulama Kataloğu ve Başlatıcı
            </p>
          </div>
        </div>

        {/* Sağ Alan: Arama, Tema Geçişi ve Pencere Kontrolleri */}
        <div className="flex items-center gap-2">
          {/* Arama Kutusu */}
          <div className="relative w-full md:w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--theme-text-200)' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Uygulama veya modül ara..."
              style={{
                backgroundColor: 'var(--theme-bg-100)',
                color: 'var(--theme-text-100)',
                borderColor: 'var(--theme-border-100)'
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-1.5 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Tema Butonu */}
          <button
            onClick={onToggleTheme}
            aria-label="Tema Değiştir"
            style={{
              backgroundColor: 'var(--theme-bg-100)',
              borderColor: 'var(--theme-border-100)',
              color: 'var(--theme-text-100)'
            }}
            className="p-1.5 rounded-lg border hover:opacity-80 transition-all"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Electron Pencere Kontrolleri (Masaüstü Modunda Aktif) */}
          {isElectron && (
            <div
              className="flex items-center gap-1 pl-2 border-l ml-1"
              style={{ borderColor: 'var(--theme-border-100)' }}
            >
              <button
                onClick={handleMinimize}
                aria-label="Simge Durumuna Küçült"
                style={{ color: 'var(--theme-text-200)' }}
                className="p-1.5 rounded hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <Minus size={14} />
              </button>
              <button
                onClick={handleMaximize}
                aria-label="Ekranı Kapla"
                style={{ color: 'var(--theme-text-200)' }}
                className="p-1.5 rounded hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <Square size={12} />
              </button>
              <button
                onClick={handleClose}
                aria-label="Kapat"
                style={{ color: 'var(--theme-text-200)' }}
                className="p-1.5 rounded hover:bg-red-500 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
