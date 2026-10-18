import React, { useMemo } from 'react'
import { DocumentPreviewModalV3 } from '../../dosya/components/DocumentPreviewModalV3'
import { useGlobalDocumentPreviewStore } from '../../../store/globalDocumentPreviewStore'

interface LuzumMuzekkeresiTabProps {
  raporId: number
  dosyaId?: number | null
  onClose?: () => void
}

export function LuzumMuzekkeresiTab({
  raporId,
  dosyaId,
  onClose
}: LuzumMuzekkeresiTabProps): React.JSX.Element {
  const { tabs, activeTabId, switchTab, closeTab, openDocument, closeDocument } =
    useGlobalDocumentPreviewStore()

  const activeTab = useMemo(() => {
    if (activeTabId) {
      const match = tabs.find((t) => t.tabId === activeTabId)
      if (match) return match
    }
    const matchDoc = tabs.find((t) => t.documentId === 'luzum_muzekkeresi')
    if (matchDoc) return matchDoc
    return tabs[0] || null
  }, [tabs, activeTabId])

  return (
    <div className="relative w-full h-[85vh] min-h-187.5 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xs bg-slate-100 dark:bg-slate-950">
      <DocumentPreviewModalV3
        key={activeTab?.tabId || 'luzum_muzekkeresi'}
        isOpen={true}
        documentId={activeTab?.documentId || 'luzum_muzekkeresi'}
        initialTemplateId="luzum_muzekkeresi"
        dosyaId={activeTab?.dosyaId ?? dosyaId}
        source={{ kind: 'ihtiyacRaporu', raporId }}
        invitedFirms={activeTab?.invitedFirms}
        selectedFirma={activeTab?.selectedFirma}
        initialData={activeTab?.initialData || undefined}
        isModal={false}
        tabs={tabs}
        activeTabId={activeTab?.tabId || activeTabId}
        onSwitchTab={switchTab}
        onCloseTab={closeTab}
        onAddTab={openDocument}
        onClose={onClose || closeDocument}
      />
    </div>
  )
}
