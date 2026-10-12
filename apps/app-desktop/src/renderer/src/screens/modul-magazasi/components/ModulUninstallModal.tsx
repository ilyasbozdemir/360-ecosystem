import React from 'react'
import { AlertTriangle, Trash2, X, ShieldAlert } from 'lucide-react'
import type { ModulPaketi } from '../modulMagazasi.types'

interface ModulUninstallModalProps {
  modul: ModulPaketi | null
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const ModulUninstallModal: React.FC<ModulUninstallModalProps> = ({
  modul,
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !modul) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5">
        {/* Üst İkon & Kapatma */}
        <div className="flex items-start justify-between gap-4">
          <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 shadow-xs">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Başlık ve Uyarı Metni */}
        <div className="space-y-2">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
            Modülü Kaldırmak İstediğinize Emin Misiniz?
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong className="text-slate-800 dark:text-slate-100 font-semibold">{modul.baslik}</strong> paketini
            kaldırmak üzeresiniz.
          </p>
        </div>

        {/* Dikkat Kutusu */}
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            Önemli Veri & Süreç Uyarısı
          </div>
          <div>
            Bu modül kaldırıldığında üst menülerdeki ilgili süreç sekmeleri kapatılır. Modül tekrar
            kurulduğunda bu modüle ait taslak süreç yapılandırmaları ve şablon özelleştirmeleri
            sıfırlanabilir.
          </div>
        </div>

        {/* Alt Aksiyon Butonları */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            Vazgeç
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Evet, Modülü Kaldır
          </button>
        </div>
      </div>
    </div>
  )
}
