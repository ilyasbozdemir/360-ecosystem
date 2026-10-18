import React from 'react'
import {
  DocumentPage,
  TemplateKey,
  TemplateData,
  TemplateEditProvider
} from '@temin360/document-templates'
import { TemplateErrorBoundary } from '../TemplateErrorBoundary'

export interface DocumentRendererProps<K extends TemplateKey = TemplateKey> {
  /**
   * Gösterilecek şablon kimliği (snake_case veya kebab-case)
   */
  templateKey: K | string
  /**
   * Şablona aktarılacak veri nesnesi
   */
  data: TemplateData<K> | Record<string, any>
  /**
   * Sayfa yönelimi
   */
  orientation?: 'portrait' | 'landscape'
  /**
   * Çizim biçimi:
   * - 'bare': Yalnızca saf sayfa (A4 210mm/297mm, yazdırma ve PDF için)
   * - 'paper': Gri zemin, gölge, kaydırma ve kağıt efekti (ekran önizlemesi için)
   */
  chrome?: 'paper' | 'bare'
  /**
   * Yakınlaştırma / ölçekleme katsayısı (varsayılan: 1)
   */
  scale?: number
  /**
   * Düzenleme modu aktif mi?
   */
  isEditing?: boolean
  /**
   * Alan değeri değiştiğinde tetiklenecek fonksiyon
   */
  onFieldChange?: (key: string, val: any) => void
  /**
   * Personel seçim listesi
   */
  personelListesi?: any[]
  /**
   * Firma seçim listesi
   */
  firmaListesi?: any[]
  /**
   * Birim seçim listesi
   */
  birimListesi?: any[]
  /**
   * İlk sayfa tablo satır limiti
   */
  firstPageLimit?: number
  /**
   * Kapsayıcı CSS sınıfları
   */
  className?: string
  /**
   * Kapsayıcı stil nesnesi
   */
  style?: React.CSSProperties
  /**
   * Kapsayıcı DOM referansı
   */
  containerRef?: React.RefObject<HTMLDivElement | null>
}

/**
 * Uygulama içi merkezi belge çizim bileşeni.
 * - Saf sayfa çizimi için paketteki `<DocumentPage />` bileşenini kullanır.
 * - 'paper' modunda kullanıcı arayüzü stillerini (koyu tema, gri arka plan, gölge, ölçeklendirme) sağlar.
 * - 'bare' modunda yazdırma ve PDF çıktıları için saf DOM üretir.
 */
export function DocumentRenderer<K extends TemplateKey = TemplateKey>({
  templateKey,
  data,
  orientation = 'portrait',
  chrome = 'paper',
  scale = 1,
  isEditing = false,
  onFieldChange,
  personelListesi = [],
  firmaListesi = [],
  birimListesi = [],
  firstPageLimit,
  className = '',
  style = {},
  containerRef
}: DocumentRendererProps<K>): React.JSX.Element {
  const isLandscape = orientation === 'landscape'

  // Saf sayfa içeriği
  const pageContent = (
    <TemplateErrorBoundary
      fallback={
        <div className="p-8 text-center text-red-500 font-semibold bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl m-4">
          ⚠️ Belge şablonu çizilirken bir hata oluştu. Lütfen şablon verilerini kontrol ediniz.
        </div>
      }
    >
      <TemplateEditProvider
        isEditing={isEditing}
        onFieldChange={onFieldChange || (() => {})}
        personelListesi={personelListesi}
        firmaListesi={firmaListesi}
        birimListesi={birimListesi}
        firstPageLimit={firstPageLimit ?? (data as any)?.firstPageLimit}
      >
        <DocumentPage
          templateKey={templateKey}
          data={data}
          orientation={orientation}
        />
      </TemplateEditProvider>
    </TemplateErrorBoundary>
  )

  // Bare mod: Yalnızca saf sayfa (yazdırma / PDF)
  if (chrome === 'bare') {
    return (
      <div
        ref={containerRef}
        className={`document-renderer-bare inline-block ${className}`.trim()}
        style={style}
      >
        {pageContent}
      </div>
    )
  }

  // Paper mod: Ekran arayüzü, gri zemin, gölge ve isteğe bağlı ölçeklendirme
  if (scale !== 1) {
    const baseWidth = isLandscape ? 1131 : 800
    const baseHeight = isLandscape ? 800 : 1131

    return (
      <div
        ref={containerRef}
        className={`flex-1 bg-slate-200/50 dark:bg-slate-950 flex justify-center items-start overflow-x-hidden overflow-y-auto shadow-inner h-full py-8 custom-scrollbar min-h-0 min-w-0 ${className}`.trim()}
        style={style}
      >
        <div
          style={{
            width: `${baseWidth * scale}px`,
            minHeight: `${baseHeight * scale}px`,
            position: 'relative',
            flexShrink: 0
          }}
        >
          <div
            className="bg-white shadow-2xl transition-transform duration-200 ease-out origin-top"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              width: `${baseWidth}px`,
              minHeight: `${baseHeight}px`,
              position: 'absolute',
              top: 0,
              left: '50%',
              translate: '-50% 0'
            }}
          >
            {pageContent}
          </div>
        </div>
      </div>
    )
  }

  // scale === 1 kağıt modu
  return (
    <div
      ref={containerRef}
      className={`w-full flex justify-center items-start overflow-auto bg-slate-200/50 dark:bg-slate-950 p-4 sm:p-8 custom-scrollbar ${className}`.trim()}
      style={style}
    >
      <div className="bg-white shadow-2xl rounded-sm overflow-hidden shrink-0">
        {pageContent}
      </div>
    </div>
  )
}
