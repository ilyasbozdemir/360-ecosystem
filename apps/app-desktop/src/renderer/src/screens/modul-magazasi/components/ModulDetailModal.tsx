import React, { useState } from 'react'
import {
  X,
  FileText,
  GitFork,
  BookOpen,
  CheckCircle2,
  Download,
  Trash2,
  BadgeAlert,
  Wrench,
  Check
} from 'lucide-react'
import type { ModulPaketi } from '../modulMagazasi.types'

interface ModulDetailModalProps {
  modul: ModulPaketi | null
  isInstalled: boolean
  onClose: () => void
  onToggleInstall: (id: string) => void
}

type TabType = 'belgeler' | 'asamalar' | 'mevzuat'

export const ModulDetailModal: React.FC<ModulDetailModalProps> = ({
  modul,
  isInstalled,
  onClose,
  onToggleInstall
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('belgeler')

  if (!modul) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
        {/* Üst Başlık & Kapatma */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 font-mono">
                {modul.kod}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{modul.mevzuat}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">({modul.versiyon})</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{modul.baslik}</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl">{modul.kisaAciklama}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sekme Butonları */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('belgeler')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'belgeler'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Belge Şablonları ({modul.belgeler.length})
          </button>
          <button
            onClick={() => setActiveTab('asamalar')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'asamalar'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <GitFork className="w-4 h-4" />
            Süreç Aşamaları ({modul.asamalar.length})
          </button>
          <button
            onClick={() => setActiveTab('mevzuat')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'mevzuat'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Mevzuat & Araçlar
          </button>
        </div>

        {/* Gövde / İçerik Alanı */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: Belgeler */}
          {activeTab === 'belgeler' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                Bu modül kurulduğunda projenizde otomatik aktifleşecek resmi evrak şablonları:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {modul.belgeler.map((belge, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-indigo-400/50 dark:hover:border-indigo-500/40 transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 border border-slate-200 dark:border-slate-700">
                        {belge.kod}
                      </span>
                      {belge.zorunluMu ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 flex items-center gap-1">
                          <BadgeAlert className="w-3 h-3" />
                          Zorunlu Belge
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400">
                          Seçimlik
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{belge.ad}</div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
                      {belge.aciklama}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Aşamalar */}
          {activeTab === 'asamalar' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                Bu modülün standart iş akışındaki yürütme adımları ve hiyerarşisi:
              </div>
              <div className="relative pl-6 border-l-2 border-indigo-200 dark:border-indigo-500/30 space-y-6">
                {modul.asamalar.map((asama) => (
                  <div key={asama.sira} className="relative group">
                    <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-600 dark:border-indigo-500 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-black">
                      {asama.sira}
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 group-hover:border-indigo-400/50 dark:group-hover:border-indigo-500/40 transition-all">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{asama.baslik}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{asama.aciklama}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Mevzuat & Araçlar */}
          {activeTab === 'mevzuat' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                  Yasal Dayanak & Kapsam
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                  {modul.detayliAciklama}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  Dahili Otomasyon & Hesaplama Araçları
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {modul.araclar.map((arac, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/40 text-xs text-slate-700 dark:text-slate-300 font-medium"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{arac}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Alt Kısım: Aksiyonlar */}
        <div className="p-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {isInstalled ? (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Bu modül çalışma alanınızda şu anda kurulu ve aktif.
              </span>
            ) : (
              <span className="text-slate-500 dark:text-slate-400">
                Bu modül henüz kurulu değil. Kurulum anında şablonlar kullanıma açılır.
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Kapat
            </button>
            {isInstalled ? (
              <button
                onClick={() => onToggleInstall(modul.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Modülü Kaldır
              </button>
            ) : (
              <button
                onClick={() => onToggleInstall(modul.id)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Modülü Hemen Kur
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
