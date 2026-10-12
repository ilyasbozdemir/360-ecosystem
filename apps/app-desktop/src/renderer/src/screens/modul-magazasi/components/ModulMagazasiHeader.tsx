import React from 'react'
import {
  Store,
  Sparkles,
  CheckCircle2,
  Layers,
  Search,
  FileSpreadsheet,
  FileCheck2
} from 'lucide-react'
import type { ModulKategoriFiltresi } from '../modulMagazasi.types'

interface ModulMagazasiHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  activeKategori: ModulKategoriFiltresi
  onSelectKategori: (kategori: ModulKategoriFiltresi) => void
  stats: {
    total: number
    installed: number
    available: number
    totalTemplates: number
  }
}

const KATEGORI_SEKMELERI: { id: ModulKategoriFiltresi; label: string; icon: React.ReactNode }[] = [
  { id: 'tum', label: 'Tüm Modüller', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'kurulu', label: 'Kurulu Paketler', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  { id: 'alim_ihale', label: 'Alım & İhale (4734)', icon: <FileCheck2 className="w-3.5 h-3.5" /> },
  { id: 'satis_kiralama', label: 'Satış & Kiralama (2886)', icon: <Store className="w-3.5 h-3.5" /> },
  { id: 'ozel_istisna', label: 'İstisnalar & Doğrudan', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'yapim_hakedis', label: 'Yapım & Hakediş', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> }
]

export const ModulMagazasiHeader: React.FC<ModulMagazasiHeaderProps> = ({
  searchQuery,
  onSearchChange,
  activeKategori,
  onSelectKategori,
  stats
}) => {
  return (
    <div className="space-y-6">
      {/* Üst Banner & Başlık */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 p-6 md:p-8 shadow-xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-48 -bottom-16 w-56 h-56 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              Süreç, Mevzuat & Şablon Ekosistemi
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Store className="w-8 h-8 text-indigo-400" />
              Modül & Süreç Mağazası
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Kamu alımları, ihale süreçleri ve taşınmaz yönetimi için resmi mevzuat paketlerini
              tek tıkla kurun, hazır evrak şablonlarını ve süreç adımlarını projenize dahil edin.
            </p>
          </div>

          {/* İstatistik Rozetleri */}
          <div className="flex flex-wrap md:flex-nowrap gap-3 shrink-0">
            <div className="flex-1 md:flex-none px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-sm text-center">
              <div className="text-2xl font-black text-indigo-400">{stats.installed}</div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Kurulu Paket</div>
            </div>
            <div className="flex-1 md:flex-none px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-sm text-center">
              <div className="text-2xl font-black text-sky-400">{stats.total}</div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Katalog Paketi</div>
            </div>
            <div className="flex-1 md:flex-none px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-sm text-center">
              <div className="text-2xl font-black text-emerald-400">{stats.totalTemplates}+</div>
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Resmi Şablon</div>
            </div>
          </div>
        </div>
      </div>

      {/* Arama ve Filtreleme Araç Çubuğu */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Arama Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Modül adı, kanun maddesi (örn: 22/d, 2886) veya şablon ara..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-900/60 dark:bg-slate-900/80 border border-slate-700/70 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-200 placeholder-slate-400 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
            >
              Temizle
            </button>
          )}
        </div>

        {/* Kategori Hapları */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {KATEGORI_SEKMELERI.map((sekme) => {
            const isActive = activeKategori === sekme.id
            return (
              <button
                key={sekme.id}
                onClick={() => onSelectKategori(sekme.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50'
                }`}
              >
                {sekme.icon}
                <span>{sekme.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
