/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import {
  ClipboardList,
  Edit,
  Columns3,
  LayoutGrid,
  List,
  BarChart3,
  Sparkles
} from 'lucide-react'

export type TakipViewMode = 'kanban' | 'grid' | 'list' | 'metrik' | 'detay'

interface TakipHeaderProps {
  activeDosya?: any
  onEditClick: () => void
  activeView: TakipViewMode
  setActiveView: (view: TakipViewMode) => void
  onOpenWizard: () => void
}

export function TakipHeader({
  activeDosya,
  onEditClick,
  activeView,
  setActiveView,
  onOpenWizard
}: TakipHeaderProps): React.JSX.Element {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-855 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-blue-600" />
          Süreç Takip & İş Akışı Paneli
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Doğrudan temin dosyalarınızın yasal işlem adımlarını, kanban iş akışını ve belge tamamlama durumlarını buradan izleyebilirsiniz.
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {/* VIEW MODE TOGGLE (ORTAK GÖRÜNÜM SİSTEMİ: KANBAN, GRID, LİSTE, METRİK) */}
        <div className="flex bg-slate-100/90 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => setActiveView('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'kanban'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-750 dark:hover:text-slate-300'
            }`}
            title="Kanban İş Akışı Tahtası (Aşamalara göre sürükle-bırak panosu)"
          >
            <Columns3 size={14} />
            <span>Kanban</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'grid'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-750 dark:hover:text-slate-300'
            }`}
            title="Grid / Kart Görünümü (Tüm dosyaların düzenli kart ızgarası)"
          >
            <LayoutGrid size={14} />
            <span>Kart / Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'list'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-750 dark:hover:text-slate-300'
            }`}
            title="Kompakt Liste / Tablo Görünümü (Yoğun bilgi sunan taranabilir liste)"
          >
            <List size={14} />
            <span>Liste</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('metrik')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'metrik'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-500 hover:text-slate-750 dark:hover:text-slate-300'
            }`}
            title="Süreç Metrikleri ve Grafikler"
          >
            <BarChart3 size={14} />
            <span>Metrikler</span>
          </button>
        </div>

        {/* WIZARD BUTTON */}
        <button
          type="button"
          onClick={onOpenWizard}
          className="px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer shrink-0"
        >
          <Sparkles size={14} />
          Dosya Sihirbazı
        </button>

        {activeDosya && activeView === 'detay' && (
          <button
            type="button"
            onClick={onEditClick}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <Edit size={14} />
            Düzenle
          </button>
        )}
      </div>
    </div>
  );
}

