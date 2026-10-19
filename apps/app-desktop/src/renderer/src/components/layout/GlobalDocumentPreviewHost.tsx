import React from 'react'
import { useGlobalDocumentPreviewStore } from '../../store/globalDocumentPreviewStore'
import { DocumentPreviewModalV3 } from '../../screens/dosya/components/DocumentPreviewModalV3'

export function GlobalDocumentPreviewHost(): React.JSX.Element | null {
  const { isOpen, isBalloon, tabs, activeTabId, switchTab, closeTab, openDocument, closeDocument } =
    useGlobalDocumentPreviewStore()

  // Belge önizleme artık çalışma alanı sekmesinde (BelgeOnizlemeScreen) sunulduğundan,
  // global host yalnızca yüzen balon (isBalloon) modunda görünür.
  if (!isOpen || tabs.length === 0 || !isBalloon) return null

  const activeTab = tabs.find((t) => t.tabId === activeTabId) || tabs[0]
  if (!activeTab) return null

  return (
    <DocumentPreviewModalV3
      key={activeTab.tabId}
      isOpen={isOpen}
      documentId={activeTab.documentId}
      dosyaId={activeTab.dosyaId}
      currentStage={activeTab.stage || undefined}
      invitedFirms={activeTab.invitedFirms}
      selectedFirma={activeTab.selectedFirma}
      initialData={activeTab.initialData || undefined}
      onClose={closeDocument}
      isModal={false}
      tabs={tabs}
      activeTabId={activeTab.tabId}
      onSwitchTab={switchTab}
      onCloseTab={closeTab}
      onAddTab={openDocument}
    />
  )
}
