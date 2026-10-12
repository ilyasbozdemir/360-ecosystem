import React from 'react'
import {
  FileCheck,
  Landmark,
  FileSpreadsheet,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Download,
  Info,
  GitFork,
  Trash2
} from 'lucide-react'
import type { ModulPaketi } from '../modulMagazasi.types'

interface ModulCardProps {
  modul: ModulPaketi
  isInstalled: boolean
  onToggleInstall: (id: string) => void
  onOpenDetail: (modul: ModulPaketi) => void
}

const ICON_MAP: Record<string, React.ReactNode> = {
  FileCheck: <FileCheck className="w-6 h-6" />,
  Landmark: <Landmark className="w-6 h-6" />,
  FileSpreadsheet: <FileSpreadsheet className="w-6 h-6" />,
  FileText: <FileText className="w-6 h-6" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6" />
}

const COLOR_MAP: Record<
  string,
  {
    border: string
    badge: string
    glow: string
    iconBg: string
    text: string
  }
> = {
  blue: {
    border: 'hover:border-blue-500/50',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    glow: 'from-blue-600/10 to-transparent',
    iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    text: 'text-blue-400'
  },
  emerald: {
    border: 'hover:border-emerald-500/50',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    glow: 'from-emerald-600/10 to-transparent',
    iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    text: 'text-emerald-400'
  },
  purple: {
    border: 'hover:border-purple-500/50',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    glow: 'from-purple-600/10 to-transparent',
    iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    text: 'text-purple-400'
  },
  amber: {
    border: 'hover:border-amber-500/50',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    glow: 'from-amber-600/10 to-transparent',
    iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    text: 'text-amber-400'
  },
  cyan: {
    border: 'hover:border-cyan-500/50',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    glow: 'from-cyan-600/10 to-transparent',
    iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    text: 'text-cyan-400'
  }
}

export const ModulCard: React.FC<ModulCardProps> = ({
  modul,
  isInstalled,
  onToggleInstall,
  onOpenDetail
}) => {
  const colorTheme = COLOR_MAP[modul.renk] || COLOR_MAP.blue
  const icon = ICON_MAP[modul.ikon] || <FileText className="w-6 h-6" />

  return (
    <div
      className={`relative group flex flex-col justify-between rounded-2xl bg-slate-900/80 border border-slate-800/80 ${colorTheme.border} p-5 md:p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
    >
      {/* Arka plan yumuşak renk geçişi */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colorTheme.glow} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
      />

      {/* Üst Kısım: İkon, Başlık ve Durum Rozeti */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl border flex items-center justify-center shadow-inner ${colorTheme.iconBg}`}
            >
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold border tracking-wider uppercase ${colorTheme.badge}`}
                >
                  {modul.kod}
                </span>
                <span className="text-slate-400 text-xs font-mono">{modul.versiyon}</span>
              </div>
              <span className="text-xs text-slate-400 font-medium block mt-0.5">
                {modul.mevzuat}
              </span>
            </div>
          </div>

          {/* Kurulu / Kurulabilir rozeti */}
          {isInstalled ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Kurulu
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300">
              Kullanıma Hazır
            </span>
          )}
        </div>

        {/* Başlık ve Açıklama */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-white group-hover:text-indigo-200 transition-colors line-clamp-1">
            {modul.baslik}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
            {modul.kisaAciklama}
          </p>
        </div>

        {/* Metrikler: Şablon ve Aşama Sayısı */}
        <div className="flex items-center gap-4 py-2 border-y border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-200 font-bold">{modul.belgeler.length}</span> Resmi Şablon
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-700" />
          <div className="flex items-center gap-1.5 font-medium">
            <GitFork className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-200 font-bold">{modul.asamalar.length}</span> Süreç Aşaması
          </div>
        </div>

        {/* Etiketler */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {modul.etiketler.slice(0, 3).map((etiket, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800/90 text-slate-300 border border-slate-700/60"
            >
              #{etiket}
            </span>
          ))}
          {modul.etiketler.length > 3 && (
            <span className="px-1.5 py-0.5 rounded-md text-[10px] text-slate-400">
              +{modul.etiketler.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Alt Aksiyon Butonları */}
      <div className="relative z-10 pt-5 mt-4 border-t border-slate-800/80 flex items-center gap-2">
        <button
          onClick={() => onOpenDetail(modul)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 transition-all hover:border-slate-600"
        >
          <Info className="w-3.5 h-3.5 text-indigo-400" />
          Detayları & Belgeleri Gör
        </button>

        {isInstalled ? (
          <button
            onClick={() => onToggleInstall(modul.id)}
            title="Modülü kaldır veya pasife al"
            className="flex items-center justify-center p-2 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => onToggleInstall(modul.id)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Modülü Kur
          </button>
        )}
      </div>
    </div>
  )
}
