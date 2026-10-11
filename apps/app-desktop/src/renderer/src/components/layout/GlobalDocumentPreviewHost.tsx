import React from "react";
import { useGlobalDocumentPreviewStore } from "../../store/globalDocumentPreviewStore";
import { DocumentPreviewModalV2 } from "../../screens/dosya/components/DocumentPreviewModalV2";
import { DocumentPreviewModalV3 } from "../../screens/dosya/components/DocumentPreviewModalV3";

export function GlobalDocumentPreviewHost(): React.JSX.Element | null {
  const {
    isOpen,
    isBalloon,
    tabs,
    activeTabId,
    switchTab,
    closeTab,
    openDocument,
    closeDocument,
  } = useGlobalDocumentPreviewStore();

  // Belge önizleme artık çalışma alanı sekmesinde (BelgeOnizlemeScreen) sunulduğundan,
  // global host yalnızca yüzen balon (isBalloon) modunda görünür.
  if (!isOpen || tabs.length === 0 || !isBalloon) return null;

  const activeTab = tabs.find((t) => t.tabId === activeTabId) || tabs[0];
  if (!activeTab) return null;

  const DOCUMENT_PREVIEW_VERSIONS = {
    v2: DocumentPreviewModalV2,
    v3: DocumentPreviewModalV3,
  } as const;

  type DocumentPreviewVersion = keyof typeof DOCUMENT_PREVIEW_VERSIONS;
  const ACTIVE_DOCUMENT_PREVIEW_VERSION: DocumentPreviewVersion = "v3";

  const ActiveDocumentPreview =
    DOCUMENT_PREVIEW_VERSIONS[ACTIVE_DOCUMENT_PREVIEW_VERSION];

  return (
    <ActiveDocumentPreview
      key={activeTab.tabId}
      isOpen={isOpen}
      documentId={activeTab.documentId}
      dosyaId={activeTab.dosyaId}
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
  );
}
