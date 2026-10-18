import React from 'react'
import { DocumentPreviewModalV3 } from '../../dosya/components/DocumentPreviewModalV3'

interface LuzumOnayEkiTabProps {
  raporId: number
  onClose?: () => void
}

export function LuzumOnayEkiTab({ raporId, onClose }: LuzumOnayEkiTabProps): React.JSX.Element {
  return (
    <div className="relative w-full h-[85vh] min-h-187.5 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xs bg-slate-100 dark:bg-slate-950">
      <DocumentPreviewModalV3
        isOpen={true}
        isModal={false}
        source={{ kind: 'ihtiyacRaporu', raporId }}
        initialTemplateId="luzum_onay_eki"
        onClose={onClose || ((): void => {})}
      />
    </div>
  )
}
