import React, { useState, useMemo, useEffect } from 'react'
import { Sablon } from '../../sablonlar/sablonlar.hooks'
import {
  usePrintQueueStore,
  CURRENT_APP_VERSION,
  PrintSettings
} from '../../../store/printQueueStore'
import { useWorkspaceStore } from '../../../store/workspaceStore'
import { TekTikYazdirHeader } from './tek-tik-yazdir/TekTikYazdirHeader'
import { TekTikYazdirDocList } from './tek-tik-yazdir/TekTikYazdirDocList'
import { TekTikYazdirPreview } from './tek-tik-yazdir/TekTikYazdirPreview'
import { TekTikYazdirSettingsPanel } from './tek-tik-yazdir/TekTikYazdirSettingsPanel'
import { TekTikYazdirActionBar } from './tek-tik-yazdir/TekTikYazdirActionBar'

export interface TekTikYazdirModalProps {
  isOpen: boolean
  onClose: () => void
  sablons: Sablon[]
  activeDosya?: Record<string, unknown> | null
  activeStarredDocs?: string[]
  initialSelectedIds?: number[]
  renderHtml: (sablon: Sablon) => string
  onExecutePrint: (
    selectedSablons: Sablon[],
    action: 'print' | 'pdf' | 'zip',
    settings: PrintSettings
  ) => Promise<void>
  getMissingRequirement?: (sablon: Sablon) => string | null
  normalizeForMatch?: (str: string) => string
}

export function TekTikYazdirModal({
  isOpen,
  onClose,
  sablons,
  activeDosya,
  initialSelectedIds = [],
  renderHtml,
  onExecutePrint,
  getMissingRequirement,
  normalizeForMatch = (s) => s.toLowerCase()
}: TekTikYazdirModalProps): React.JSX.Element | null {
  const { activeDosyaId } = useWorkspaceStore()
  const {
    getDocumentStatus,
    unlockDocument,
    markAsPrinted
  } = usePrintQueueStore()

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set(initialSelectedIds))
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [zoomLevel, setZoomLevel] = useState<number>(100)
  const [processingAction, setProcessingAction] = useState<'print' | 'pdf' | 'zip' | null>(null)
  const [showSettings, setShowSettings] = useState<boolean>(true)

  // Print settings
  const [printSettings, setPrintSettings] = useState<PrintSettings>({
    pageSize: 'A4',
    orientation: 'portrait',
    copies: 1,
    printBackground: true,
    showPageNumbers: true,
    scale: 100
  })

  // Auto-lock toggle
  const [autoLockOnPrint, setAutoLockOnPrint] = useState<boolean>(true)

  // Sync initialSelectedIds when modal opens
  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(() => {
      if (initialSelectedIds.length > 0) {
        setSelectedIds(new Set(initialSelectedIds))
      } else {
        const validIds = sablons
          .filter((s) => !(getMissingRequirement && getMissingRequirement(s)))
          .map((s) => s.id)
        setSelectedIds(new Set(validIds))
      }
      setActivePreviewIndex(0)
    }, 0)
    return () => clearTimeout(timer)
  }, [isOpen, initialSelectedIds, sablons, getMissingRequirement])

  // Filtered sablons list
  const filteredSablons = useMemo(() => {
    if (!searchQuery.trim()) return sablons
    const q = normalizeForMatch(searchQuery)
    return sablons.filter(
      (s) =>
        normalizeForMatch(s.ad).includes(q) ||
        normalizeForMatch(s.dosya_adi || '').includes(q) ||
        normalizeForMatch(s.kategori || '').includes(q)
    )
  }, [sablons, searchQuery, normalizeForMatch])

  // Selected Sablons array
  const selectedSablons = useMemo(() => {
    return sablons.filter((s) => selectedIds.has(s.id))
  }, [sablons, selectedIds])

  // Active preview sablon
  const currentPreviewSablon = selectedSablons[activePreviewIndex] || selectedSablons[0] || null

  // Render HTML for current preview
  const previewHtml = useMemo(() => {
    if (!currentPreviewSablon) return ''
    try {
      return renderHtml(currentPreviewSablon)
    } catch (e) {
      console.error('Error rendering HTML in preview:', e)
      return '<div style="padding: 40px; color: red;">Belge render edilirken hata oluştu.</div>'
    }
  }, [currentPreviewSablon, renderHtml])

  if (!isOpen) return null

  const toggleSelect = (id: number): void => {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedIds(next)
    if (activePreviewIndex >= next.size) {
      setActivePreviewIndex(Math.max(0, next.size - 1))
    }
  }

  const selectAll = (): void => {
    const valid = sablons
      .filter((s) => !(getMissingRequirement && getMissingRequirement(s)))
      .map((s) => s.id)
    setSelectedIds(new Set(valid))
  }

  const selectNone = (): void => {
    setSelectedIds(new Set())
  }

  const selectReadyOnly = (): void => {
    if (!activeDosyaId) return
    const readyIds = sablons
      .filter((s) => {
        const docKey = (s.dosya_adi || '').replace(/\.html$/, '')
        const status = getDocumentStatus(activeDosyaId, docKey)
        return status === 'ready_to_print'
      })
      .map((s) => s.id)
    setSelectedIds(new Set(readyIds))
  }

  const handleUnlock = (sablon: Sablon, e: React.MouseEvent): void => {
    e.stopPropagation()
    if (!activeDosyaId) return
    const docKey = (sablon.dosya_adi || '').replace(/\.html$/, '')
    const confirmUnlock = window.confirm(
      `"${sablon.ad}" belgesinin yazdırma kilidini açmak ve yeniden düzenlemeye izin vermek istiyor musunuz?`
    )
    if (confirmUnlock) {
      unlockDocument(activeDosyaId, docKey)
    }
  }

  const handleSelectPreview = (sablon: Sablon): void => {
    const selIndex = selectedSablons.findIndex((s) => s.id === sablon.id)
    if (selIndex >= 0) setActivePreviewIndex(selIndex)
  }

  const handleAction = async (action: 'print' | 'pdf' | 'zip'): Promise<void> => {
    if (selectedSablons.length === 0) return
    setProcessingAction(action)
    try {
      if (autoLockOnPrint && activeDosyaId && (action === 'print' || action === 'pdf')) {
        selectedSablons.forEach((s) => {
          const docKey = (s.dosya_adi || '').replace(/\.html$/, '')
          markAsPrinted(activeDosyaId, docKey, CURRENT_APP_VERSION, printSettings)
        })
      }
      await onExecutePrint(selectedSablons, action, printSettings)
      if (action === 'print') {
        onClose()
      }
    } finally {
      setProcessingAction(null)
    }
  }

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center p-2 md:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl w-full max-w-387.5 h-[92vh] flex flex-col overflow-hidden text-slate-100 animate-in zoom-in-95 duration-200">
        {/* TOP HEADER */}
        <TekTikYazdirHeader
          activeDosya={activeDosya}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          onClose={onClose}
        />

        {/* MAIN BODY */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT: DOCUMENT SELECTOR & LOCK STATUS */}
          <TekTikYazdirDocList
            sablons={sablons}
            filteredSablons={filteredSablons}
            selectedIds={selectedIds}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentPreviewSablon={currentPreviewSablon}
            activeDosyaId={activeDosyaId}
            getMissingRequirement={getMissingRequirement}
            onToggleSelect={toggleSelect}
            onSelectAll={selectAll}
            onSelectReadyOnly={selectReadyOnly}
            onSelectNone={selectNone}
            onUnlock={handleUnlock}
            onSelectPreview={handleSelectPreview}
          />

          {/* CENTER: LIVE HIGH-RESOLUTION DOCUMENT PREVIEW */}
          <TekTikYazdirPreview
            currentPreviewSablon={currentPreviewSablon}
            selectedSablonsCount={selectedSablons.length}
            activePreviewIndex={activePreviewIndex}
            setActivePreviewIndex={setActivePreviewIndex}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            previewHtml={previewHtml}
          />

          {/* RIGHT: PRINT SETTINGS PANEL */}
          {showSettings && (
            <TekTikYazdirSettingsPanel
              printSettings={printSettings}
              setPrintSettings={setPrintSettings}
              autoLockOnPrint={autoLockOnPrint}
              setAutoLockOnPrint={setAutoLockOnPrint}
            />
          )}
        </div>

        {/* BOTTOM ACTION BAR */}
        <TekTikYazdirActionBar
          selectedCount={selectedSablons.length}
          pageSize={printSettings.pageSize || 'A4'}
          orientation={printSettings.orientation || 'portrait'}
          processingAction={processingAction}
          onAction={handleAction}
        />
      </div>
    </div>
  )
}
