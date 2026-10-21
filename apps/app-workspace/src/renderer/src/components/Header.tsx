import React from 'react'
import { LayoutGrid, Moon, Sun, Search, Sparkles } from 'lucide-react'

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
  return (
    <header
      style={{
        backgroundColor: 'var(--theme-bg-200)',
        borderBottom: '1px solid var(--theme-border-100)'
      }}
      className="sticky top-0 z-40 px-6 py-4 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff'
            }}
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md font-bold text-lg"
          >
            <LayoutGrid size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--theme-text-100)' }}>
                Workspace 360
              </h1>
              <span
                style={{
                  backgroundColor: 'var(--theme-badge-planned-bg)',
                  color: 'var(--theme-badge-planned-text)',
                  borderColor: 'var(--theme-badge-planned-border)'
                }}
                className="text-xs px-2 py-0.5 rounded-full border font-medium flex items-center gap-1"
              >
                <Sparkles size={11} /> WorkSuite 360 Hub
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--theme-text-200)' }}>
              Merkezi Masaüstü Çalışma Alanı, Uygulama Kataloğu ve Başlatıcı
            </p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--theme-text-200)' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Uygulama, modül veya işlev ara..."
              style={{
                backgroundColor: 'var(--theme-bg-100)',
                color: 'var(--theme-text-100)',
                borderColor: 'var(--theme-border-100)'
              }}
              className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <button
            onClick={onToggleTheme}
            aria-label="Tema Değiştir"
            style={{
              backgroundColor: 'var(--theme-bg-100)',
              borderColor: 'var(--theme-border-100)',
              color: 'var(--theme-text-100)'
            }}
            className="p-2 rounded-lg border hover:opacity-80 transition-opacity"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  )
}
