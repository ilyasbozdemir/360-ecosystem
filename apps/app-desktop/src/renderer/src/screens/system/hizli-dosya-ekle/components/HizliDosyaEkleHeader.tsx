import React from 'react'
import { Edit3, RefreshCw, ClipboardList, Plus, Save } from 'lucide-react'
import { Button } from '../../../../components/ui/Button'

interface HizliDosyaEkleHeaderProps {
  loadLimit: number
  setLoadLimit: (val: number) => void
  isLoading: boolean
  loadExisting: () => void
  handlePaste: () => void
  addRow: () => void
  handleSave: () => void
  isSaving: boolean
  totalDirty: number
  newCount: number
  updateCount: number
}

export const HizliDosyaEkleHeader: React.FC<HizliDosyaEkleHeaderProps> = ({
  loadLimit,
  setLoadLimit,
  isLoading,
  loadExisting,
  handlePaste,
  addRow,
  handleSave,
  isSaving,
  totalDirty,
  newCount,
  updateCount
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Edit3 className="w-7 h-7 text-blue-600" />
          Hızlı Dosya Ekle / Güncelle
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Yeni kayıt ekleyin veya mevcut dosyaları yükleyip toplu düzenleyin.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Mevcut kayıtları yükle */}
        <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <select
            title="Kaç kayıt yüklensin"
            value={loadLimit}
            onChange={(e) => setLoadLimit(Number(e.target.value))}
            className="h-9 pl-3 pr-1 text-sm bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none border-r border-slate-200 dark:border-slate-700"
          >
            {[25, 50, 100, 200, 500].map((n) => (
              <option key={n} value={n}>
                Son {n}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={isLoading}
            onClick={loadExisting}
            className="flex items-center gap-1.5 h-9 px-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Yükleniyor...' : 'Yazıları Yükle'}
          </button>
        </div>

        <Button
          variant="outline"
          className="gap-2 text-sm rounded-xl h-9 px-4 cursor-pointer"
          onClick={handlePaste}
        >
          <ClipboardList className="w-4 h-4" /> Panodan Yapıştır
        </Button>
        <Button
          variant="outline"
          className="gap-2 text-sm rounded-xl h-9 px-4 cursor-pointer"
          onClick={addRow}
        >
          <Plus className="w-4 h-4" /> Satır Ekle
        </Button>
        <Button
          className="gap-2 text-sm rounded-xl h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-60 cursor-pointer"
          onClick={handleSave}
          disabled={isSaving || totalDirty === 0}
        >
          <Save className="w-4 h-4" />
          {isSaving
            ? 'Kaydediliyor...'
            : totalDirty === 0
              ? 'Değişiklik Yok'
              : `${newCount > 0 ? `${newCount} Ekle` : ''}${
                  newCount > 0 && updateCount > 0 ? ' + ' : ''
                }${updateCount > 0 ? `${updateCount} Güncelle` : ''}`}
        </Button>
      </div>
    </div>
  )
}
