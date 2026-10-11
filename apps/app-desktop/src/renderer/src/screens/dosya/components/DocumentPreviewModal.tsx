import React, { useEffect } from 'react'
import { useGlobalDocumentPreviewStore } from '../../../store/globalDocumentPreviewStore'

/**
 * @deprecated Belge önizleme modalları merkezi olarak GlobalDocumentPreviewHost üzerinden yönetilmektedir.
 * Doğrudan modal render etmek yerine useGlobalDocumentPreviewStore.getState().openDocument(...) kullanınız.
 */
export function DocumentPreviewModal(props: {
  isOpen?: boolean
  documentId?: string
  dosyaAdi?: string
  dosyaId?: number | null
  title?: string
  invitedFirms?: unknown[]
  selectedFirma?: Record<string, unknown> | null
  initialData?: Record<string, unknown> | null
  baseContext?: Record<string, unknown> | null
  onClose?: () => void
  [key: string]: unknown
}): React.JSX.Element | null {
  useEffect(() => {
    if (props.isOpen) {
      const documentId =
        props.documentId ||
        (props.dosyaAdi ? props.dosyaAdi.replace('.html', '') : '')
      if (documentId) {
        useGlobalDocumentPreviewStore.getState().openDocument({
          documentId,
          dosyaId: props.dosyaId,
          documentTitle: props.title,
          invitedFirms: props.invitedFirms,
          selectedFirma: props.selectedFirma,
          initialData: props.initialData || props.baseContext,
          onClose: props.onClose
        })
      }
    }
  }, [
    props.isOpen,
    props.documentId,
    props.dosyaAdi,
    props.dosyaId,
    props.title,
    props.invitedFirms,
    props.selectedFirma,
    props.initialData,
    props.baseContext,
    props.onClose
  ])

  return null
}

export default DocumentPreviewModal
