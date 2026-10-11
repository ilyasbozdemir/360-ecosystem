import React, { useMemo, useEffect } from 'react'
import { useGlobalDocumentPreviewStore } from '../../store/globalDocumentPreviewStore'
import { useTabStore } from '../../store/tabStore'
import { DocumentPreviewModalV3 } from './components/DocumentPreviewModalV3'
import { APP_ROUTES } from '@renderer/constants/routeConstants'

export function BelgeOnizlemeScreen(): React.JSX.Element | null {
  const {
    tabs,
    activeTabId,
    switchTab,
    closeTab,
    openDocument,
    closeDocument
  } = useGlobalDocumentPreviewStore()
  const { activeTabPath, closeTab: closeAppTab } = useTabStore()

  // URL'den olası parametreleri oku
  const searchParams = useMemo(() => {
    return new URLSearchParams(activeTabPath.split('?')[1] || '')
  }, [activeTabPath])

  const urlDocId = searchParams.get('doc') || searchParams.get('documentId') || null
  const urlDosyaId = searchParams.get('id') ? Number(searchParams.get('id')) : null
  const urlTitle = searchParams.get('title') ? decodeURIComponent(searchParams.get('title') || '') : undefined

  // Eğer store'da henüz sekme yoksa ama URL'de parametre varsa otomatik olarak store'a yükle
  useEffect(() => {
    if (tabs.length === 0 && urlDocId) {
      openDocument({
        documentId: urlDocId,
        dosyaId: urlDosyaId,
        documentTitle: urlTitle
      })
    }
  }, [tabs.length, urlDocId, urlDosyaId, urlTitle, openDocument])

  const activeTab = useMemo(() => {
    if (urlDocId) {
      const match = tabs.find((t) => t.documentId === urlDocId)
      if (match) return match
    }
    return tabs.find((t) => t.tabId === activeTabId) || tabs[0] || null
  }, [tabs, activeTabId, urlDocId])

  const handleClose = (): void => {
    if (activeTab) {
      closeTab(activeTab.tabId)
    } else {
      closeDocument()
    }
    if (activeTabPath.startsWith(APP_ROUTES.BELGE_ONIZLEME)) {
      const nextPath = closeAppTab(activeTabPath)
      if (nextPath && typeof window !== 'undefined') {
        window.location.hash = nextPath
      }
    }
  }

  // Henüz sekme yüklenmemişse URL parametreleriyle tekil render et
  if (!activeTab) {
    if (!urlDocId) {
      return (
        <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500 text-sm">
          Açık belge bulunamadı.
        </div>
      )
    }
    return (
      <DocumentPreviewModalV3
        isOpen={true}
        documentId={urlDocId}
        dosyaId={urlDosyaId}
        isModal={false}
        onClose={handleClose}
        tabs={tabs}
        activeTabId={activeTabId}
        onSwitchTab={switchTab}
        onCloseTab={closeTab}
        onAddTab={openDocument}
      />
    )
  }

  return (
    <DocumentPreviewModalV3
      key={activeTab.tabId}
      isOpen={true}
      documentId={activeTab.documentId}
      dosyaId={activeTab.dosyaId}
      invitedFirms={activeTab.invitedFirms}
      selectedFirma={activeTab.selectedFirma}
      initialData={activeTab.initialData || undefined}
      isModal={false}
      onClose={handleClose}
      tabs={tabs}
      activeTabId={activeTab.tabId}
      onSwitchTab={switchTab}
      onCloseTab={closeTab}
      onAddTab={openDocument}
    />
  )
}

export default BelgeOnizlemeScreen
