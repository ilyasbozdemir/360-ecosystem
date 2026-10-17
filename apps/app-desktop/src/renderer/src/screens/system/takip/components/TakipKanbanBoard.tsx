import React, { useState, useMemo } from 'react'
import {
  Search,
  Plus,
  Layers,
  Sparkles,
  AlertCircle
} from 'lucide-react'
import { TakipKanbanCard } from './TakipKanbanCard'
import { logActivity } from '../../../../utils/logger'
import { emitAppEvent } from '../../../../utils/appEvents'
import { useQueryClient } from '@tanstack/react-query'
import type { TeminDosyasi } from '../../../dosyalar/dosyalar.hooks'

export interface TakipKanbanBoardProps {
  dosyalar: TeminDosyasi[]
  activeDosyaId: number | null
  setActiveDosyaId: (id: number) => void
  formatCurrency: (val: number) => string
  onOpenWizard: (targetStage?: number) => void
  onOpenSurec: (dosya: TeminDosyasi) => void
  onEdit: (dosyaId: number) => void
}

interface StageColumnDef {
  stageId: number
  title: string
  subtitle: string
  badgeColor: string
  borderColor: string
  headerBg: string
  accentColor: string
}

const KANBAN_STAGES: StageColumnDef[] = [
  {
    stageId: 1,
    title: 'Hazırlıkta',
    subtitle: 'İhtiyaç Tespiti & Başlangıç',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    borderColor: 'border-amber-200 dark:border-amber-900/40',
    headerBg: 'bg-amber-50/50 dark:bg-amber-950/20',
    accentColor: 'text-amber-600 dark:text-amber-400'
  },
  {
    stageId: 2,
    title: 'Teklif Toplanıyor',
    subtitle: 'Piyasa Fiyat Araştırması',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-900/40',
    headerBg: 'bg-blue-50/50 dark:bg-blue-950/20',
    accentColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    stageId: 3,
    title: 'Onayda',
    subtitle: 'Sipariş & Sözleşme',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300',
    borderColor: 'border-purple-200 dark:border-purple-900/40',
    headerBg: 'bg-purple-50/50 dark:bg-purple-950/20',
    accentColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    stageId: 4,
    title: 'Tamamlandı',
    subtitle: 'Kabul & Ödeme İşlemleri',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    borderColor: 'border-emerald-200 dark:border-emerald-900/40',
    headerBg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    accentColor: 'text-emerald-600 dark:text-emerald-400'
  }
]

export function TakipKanbanBoard({
  dosyalar,
  activeDosyaId,
  setActiveDosyaId,
  formatCurrency,
  onOpenWizard,
  onOpenSurec,
  onEdit
}: TakipKanbanBoardProps): React.JSX.Element {
  const queryClient = useQueryClient()

  // Optimistic overrides for smooth drag & drop without cascading renders
  const [optimisticOverrides, setOptimisticOverrides] = useState<
    Record<number, { durum_asama_id: number; status: string }>
  >({})
  const [activeDropStage, setActiveDropStage] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedYil, setSelectedYil] = useState<string>('all')
  const [selectedTur, setSelectedTur] = useState<string>('all')

  // Apply optimistic overrides on top of incoming dosyalar
  const activeDosyalar = useMemo(() => {
    return dosyalar.map((d) => {
      const override = optimisticOverrides[d.id]
      return override ? { ...d, ...override } : d
    })
  }, [dosyalar, optimisticOverrides])

  // Extract unique years for filter
  const uniqueYillar = useMemo(() => {
    const years = new Set<number>()
    dosyalar.forEach((d) => {
      const y =
        d.butce_yili || (d.dosya_acilis_tarihi ? new Date(d.dosya_acilis_tarihi).getFullYear() : null)
      if (y) years.add(y)
    })
    return Array.from(years).sort((a, b) => b - a)
  }, [dosyalar])

  // Filtered Dossiers
  const filteredDosyalar = useMemo(() => {
    return activeDosyalar.filter((d) => {
      // Exclude soft deleted files
      if (d.is_deleted === 1) return false

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchKonu = (d.konu || '').toLowerCase().includes(q)
        const matchNo = (d.temin_no || '').toLowerCase().includes(q)
        const matchBirim = (
          (d as { birim_adi?: string; birim?: string }).birim_adi ||
          (d as { birim?: string }).birim ||
          ''
        )
          .toLowerCase()
          .includes(q)
        if (!matchKonu && !matchNo && !matchBirim) return false
      }

      // Year Filter
      if (selectedYil !== 'all') {
        const dYear =
          d.butce_yili ||
          (d.dosya_acilis_tarihi ? new Date(d.dosya_acilis_tarihi).getFullYear() : null)
        if (String(dYear) !== selectedYil) return false
      }

      // Type Filter
      if (selectedTur !== 'all') {
        if (d.tur !== selectedTur) return false
      }

      return true
    })
  }, [activeDosyalar, searchQuery, selectedYil, selectedTur])

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, stageId: number): void => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (activeDropStage !== stageId) {
      setActiveDropStage(stageId)
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>, stageId: number): void => {
    // Only clear if actually leaving the container
    if (e.currentTarget.contains(e.relatedTarget as Node)) return
    if (activeDropStage === stageId) {
      setActiveDropStage(null)
    }
  }

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    targetStageId: number
  ): Promise<void> => {
    e.preventDefault()
    setActiveDropStage(null)

    const rawId = e.dataTransfer.getData('text/plain')
    const dosyaId = parseInt(rawId, 10)
    if (!dosyaId || isNaN(dosyaId)) return

    const targetDosya = activeDosyalar.find((d) => d.id === dosyaId)
    if (!targetDosya) return

    // Normalizing current stage
    const currentStage =
      targetDosya.status === 'tamamlandi' ? 4 : targetDosya.durum_asama_id || 1

    if (currentStage === targetStageId) return

    const newStatus = targetStageId === 4 ? 'tamamlandi' : 'devam_ediyor'

    // 1. Optimistic Update via overrides map
    setOptimisticOverrides((prev) => ({
      ...prev,
      [dosyaId]: { durum_asama_id: targetStageId, status: newStatus }
    }))

    // 2. Persist to SQLite via IPC
    try {
      if (window.electron?.ipcRenderer) {
        const res = await window.electron.ipcRenderer.invoke(
          'db:run',
          'UPDATE DATA_TeminDosyasi SET durum_asama_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [targetStageId, newStatus, dosyaId]
        )

        if (!res?.success) {
          throw new Error(res?.error || 'Veritabanı güncelleme hatası')
        }

        // Emit synchronization events
        emitAppEvent('status:changed', { dosyaId, payload: { status: newStatus } })
        emitAppEvent('dossier:updated', { dosyaId })

        await logActivity(
          'Dosya Aşaması Değiştirildi',
          `#${targetDosya.temin_no || dosyaId} dosyası ${KANBAN_STAGES.find((s) => s.stageId === targetStageId)?.title} aşamasına taşındı.`,
          'info'
        )

        // Invalidate react-query cache
        queryClient.invalidateQueries({ queryKey: ['temin_dosyalari'] })
      }
    } catch (err: unknown) {
      console.error('Kanban aşama güncelleme hatası:', err)
      // Rollback optimistic override on error
      setOptimisticOverrides((prev) => {
        const updated = { ...prev }
        delete updated[dosyaId]
        return updated
      })
      const message = err instanceof Error ? err.message : 'Lütfen tekrar deneyiniz.'
      setErrorMessage(`Aşama güncellenirken hata oluştu: ${message}`)
      setTimeout(() => setErrorMessage(''), 5000)
    }
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* ERROR BANNER */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-2xl text-xs font-semibold text-rose-700 dark:text-rose-300 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* TOOLBAR: SEARCH, FILTERS & WIZARD ACTION */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 rounded-2xl shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Konu, dosya no veya birim adına göre ara..."
            className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters and Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Year Filter */}
          <select
            value={selectedYil}
            onChange={(e) => setSelectedYil(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <option value="all">Tüm Yıllar</option>
            {uniqueYillar.map((y) => (
              <option key={y} value={String(y)}>
                {y} Yılı
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedTur}
            onChange={(e) => setSelectedTur(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <option value="all">Tüm Alım Türleri</option>
            <option value="mal">Mal Alımı</option>
            <option value="hizmet">Hizmet Alımı</option>
            <option value="yapim_isi">Yapım İşi</option>
            <option value="danismanlik">Danışmanlık</option>
          </select>

          {/* New Dossier Wizard Button */}
          <button
            type="button"
            onClick={() => onOpenWizard(1)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer shrink-0"
            title="Adım adım yönlendirmeli sihirbaz ile yeni dosya oluştur"
          >
            <Sparkles size={14} />
            <span>Yeni Dosya Sihirbazı</span>
          </button>
        </div>
      </div>

      {/* 4-COLUMN KANBAN BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start select-none">
        {KANBAN_STAGES.map((col) => {
          // Filter dossiers for this column
          const columnDosyalar = filteredDosyalar.filter((d) => {
            const stage = d.status === 'tamamlandi' ? 4 : d.durum_asama_id || 1
            return stage === col.stageId
          })

          const totalMaliyet = columnDosyalar.reduce(
            (sum, d) => sum + (d.yaklasik_maliyet || 0),
            0
          )
          const isHovered = activeDropStage === col.stageId

          return (
            <div
              key={col.stageId}
              onDragOver={(e) => handleDragOver(e, col.stageId)}
              onDragLeave={(e) => handleDragLeave(e, col.stageId)}
              onDrop={(e) => handleDrop(e, col.stageId)}
              className={`flex flex-col rounded-3xl border transition-all duration-200 min-h-140 bg-slate-50/60 dark:bg-slate-900/40 p-3.5 ${
                col.borderColor
              } ${
                isHovered
                  ? 'ring-2 ring-blue-500 bg-blue-50/20 dark:bg-blue-950/20 scale-[1.01]'
                  : ''
              }`}
            >
              {/* Column Header */}
              <div
                className={`p-3.5 rounded-2xl border ${col.borderColor} ${col.headerBg} mb-3 shadow-2xs`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${col.badgeColor}`}
                    >
                      {col.stageId}
                    </span>
                    <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                      {col.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${col.badgeColor}`}
                    >
                      {columnDosyalar.length}
                    </span>

                    <button
                      type="button"
                      onClick={() => onOpenWizard(col.stageId)}
                      className="p-1 rounded-lg hover:bg-white/80 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                      title={`${col.title} aşamasında yeni dosya oluştur`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 pt-1.5 border-t border-slate-200/50 dark:border-slate-800">
                  <span className="truncate">{col.subtitle}</span>
                  <span className="font-mono font-bold shrink-0 ml-1">
                    {formatCurrency(totalMaliyet)}
                  </span>
                </div>
              </div>

              {/* Dossier Cards List */}
              <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto max-h-170 custom-scrollbar pr-0.5">
                {columnDosyalar.length > 0 ? (
                  columnDosyalar.map((dosya) => (
                    <TakipKanbanCard
                      key={dosya.id}
                      dosya={dosya}
                      formatCurrency={formatCurrency}
                      onSelect={setActiveDosyaId}
                      onOpenSurec={onOpenSurec}
                      onEdit={onEdit}
                      isActive={activeDosyaId === dosya.id}
                    />
                  ))
                ) : (
                  /* Empty Column State */
                  <div
                    className={`flex-1 flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed text-center min-h-55 transition-colors ${
                      isHovered
                        ? 'border-blue-400 bg-blue-50/30 text-blue-600'
                        : 'border-slate-200/80 dark:border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                      <Layers className="w-5 h-5 text-slate-400" />
                    </div>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      Bu Aşamada Dosya Yok
                    </p>
                    <p className="text-[10px] text-slate-400 max-w-37.5 mt-1">
                      Dosyaları bu sütuna sürükleyip bırakabilirsiniz.
                    </p>
                    <button
                      type="button"
                      onClick={() => onOpenWizard(col.stageId)}
                      className="mt-3 text-[10px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} />
                      Dosya Ekle
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
