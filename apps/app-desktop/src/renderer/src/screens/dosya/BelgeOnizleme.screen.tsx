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
    if (activeTabId) {
      const match = tabs.find((t) => t.tabId === activeTabId)
      if (match) return match
    }
    if (urlDocId) {
      const match = tabs.find((t) => t.documentId === urlDocId)
      if (match) return match
    }
    return tabs[0] || null
  }, [tabs, activeTabId, urlDocId])

  // Aktif sekme değiştiğinde üst sekme başlığını güncelle
  useEffect(() => {
    if (activeTab && activeTabPath.startsWith(APP_ROUTES.BELGE_ONIZLEME)) {
      const docTitle = activeTab.documentTitle || activeTab.documentId
      useTabStore.getState().updateTabLabel(activeTabPath, `📄 ${docTitle}`)
    }
  }, [activeTab, activeTabPath])

  // İç sekmeyi değiştirme
  const handleSwitchTab = (tabId: string): void => {
    switchTab(tabId)
    const target = tabs.find((t) => t.tabId === tabId)
    if (target && activeTabPath.startsWith(APP_ROUTES.BELGE_ONIZLEME)) {
      const docTitle = target.documentTitle || target.documentId
      useTabStore.getState().updateTabLabel(activeTabPath, `📄 ${docTitle}`)
    }
  }

  // İç sekmeyi kapatma (son sekme kapandığında üst sekmeyi de kapat)
  const handleCloseInnerTab = (tabId: string): void => {
    const isLastTab = tabs.length <= 1
    closeTab(tabId)
    if (isLastTab) {
      if (activeTabPath.startsWith(APP_ROUTES.BELGE_ONIZLEME)) {
        const nextPath = closeAppTab(activeTabPath)
        if (nextPath && typeof window !== 'undefined') {
          window.location.hash = nextPath
        }
      }
    }
  }

  // Tüm önizleme ekranını kapatma
  const handleClose = (): void => {
    closeDocument()
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
        onSwitchTab={handleSwitchTab}
        onCloseTab={handleCloseInnerTab}
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
      onSwitchTab={handleSwitchTab}
      onCloseTab={handleCloseInnerTab}
      onAddTab={openDocument}
    />
  )
}

export default BelgeOnizlemeScreen
