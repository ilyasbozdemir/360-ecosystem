import React from 'react';
import {
  TemplateKey,
  TemplateData,
  getTemplateDefinition,
  resolveTemplateKey,
} from './registry';

export interface DocumentPageProps<K extends TemplateKey = TemplateKey> {
  /**
   * Şablon kayıt defteri anahtarı (örn: 'luzum_muzekkeresi', 'ihtiyac_listesi', vb.)
   * Kebab-case id'ler ('luzum-muzekkeresi') otomatik olarak çözümlenir.
   */
  templateKey: K | string;
  /**
   * Şablonun beklediği veri nesnesi.
   */
  data: TemplateData<K> | Record<string, any>;
  /**
   * Sayfa yönelimi (varsayılan: şablonun tanımındaki yönelim veya 'portrait')
   */
  orientation?: 'portrait' | 'landscape';
  /**
   * Sayfa kapsayıcısı için ek CSS sınıfları (UI stilleri için değil, yazdırma/düzen hizalamaları için)
   */
  className?: string;
  /**
   * Satır içi stiller
   */
  style?: React.CSSProperties;
}

/**
 * Saf belge sayfası bileşeni.
 * - Sadece A4/A3 fiziksel sayfa boyutunu (210mm / 297mm), beyaz zeminini ve belge içeriğini çizer.
 * - Gri arayüz zemini, gölgeler, rounded köşeler veya koyu tema (dark mode) İÇERMEZ.
 * - Yazdırma ve PDF motorlarının hedeflemesi için `data-document-page="true"` özniteliğini taşır.
 */
export function DocumentPage<K extends TemplateKey = TemplateKey>({
  templateKey,
  data,
  orientation,
  className = '',
  style = {},
}: DocumentPageProps<K>): React.JSX.Element {
  const definition = getTemplateDefinition(templateKey);
  const resolvedKey = resolveTemplateKey(templateKey) || templateKey;

  const effectiveOrientation = orientation || definition?.orientation || 'portrait';
  const isLandscape = effectiveOrientation === 'landscape';

  if (!definition || !definition.component) {
    return (
      <div
        data-document-page="true"
        data-template-key={resolvedKey}
        data-orientation={effectiveOrientation}
        className={`bg-white text-slate-900 box-border mx-auto p-8 ${
          isLandscape ? 'w-[297mm] min-h-[210mm]' : 'w-[210mm] min-h-[297mm]'
        } ${className}`.trim()}
        style={{
          boxSizing: 'border-box',
          ...style,
        }}
      >
        <div className="p-4 border border-amber-300 bg-amber-50 rounded text-amber-900 text-sm">
          <strong>Uyarı:</strong> &quot;{String(templateKey)}&quot; için geçerli bir şablon bileşeni bulunamadı.
        </div>
      </div>
    );
  }

  const Component = definition.component;

  return (
    <div
      data-document-page="true"
      data-template-key={resolvedKey}
      data-orientation={effectiveOrientation}
      className={`bg-white text-slate-900 box-border mx-auto ${
        isLandscape ? 'w-[297mm] min-h-[210mm]' : 'w-[210mm] min-h-[297mm]'
      } ${className}`.trim()}
      style={{
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <Component data={data} orientation={effectiveOrientation} />
    </div>
  );
}
