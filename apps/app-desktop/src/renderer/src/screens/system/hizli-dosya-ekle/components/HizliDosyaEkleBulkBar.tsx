import React from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '../../../../components/ui/Button'
import { IHALE_ASAMALARI, IHALE_TURLERI } from './hizliDosyaEkle.types'

interface HizliDosyaEkleBulkBarProps {
  selectedCount: number
  handleBulkChangeAsama: (newAsama: string) => void
  handleBulkChangeTur: (newTur: string) => void
  handleBulkDelete: () => void
}

export const HizliDosyaEkleBulkBar: React.FC<HizliDosyaEkleBulkBarProps> = ({
  selectedCount,
  handleBulkChangeAsama,
  handleBulkChangeTur,
  handleBulkDelete
}) => {
  if (selectedCount === 0) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-150 dark:border-blue-900/30 rounded-xl text-sm animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-blue-700 dark:text-blue-400">
          {selectedCount} satır seçildi:
        </span>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 dark:text-slate-400">Aşama:</span>
          <select
            title="Toplu aşama seçin"
            onChange={(e) => {
              if (e.target.value) {
                handleBulkChangeAsama(e.target.value)
                e.target.value = ''
              }
            }}
            className="h-8 px-2 text-xs rounded border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
          >
            <option value="">Seçin...</option>
            {IHALE_ASAMALARI.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 dark:text-slate-400">Tür:</span>
          <select
            title="Toplu tür seçin"
            onChange={(e) => {
              if (e.target.value) {
                handleBulkChangeTur(e.target.value)
                e.target.value = ''
              }
            }}
            className="h-8 px-2 text-xs rounded border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
          >
            <option value="">Seçin...</option>
            {IHALE_TURLERI.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="outline"
          onClick={handleBulkDelete}
          className="h-8 text-xs text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Seçilenleri Sil
        </Button>
      </div>
    </div>
  )
}
