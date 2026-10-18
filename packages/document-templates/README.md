# @temin360/document-templates

Temin360 kamu ihale ve doğrudan temin süreçlerine ait standart form ve resmi belge şablonları kütüphanesidir.

## Mimari Prensipler

1. **Bağımsızlık (Uygulamadan Soyutlanmışlık):**
   - Bu paket saf React sunum katmanıdır.
   - Uygulama katmanına (`apps/*`, `@renderer/*`, `services`, `store`, `dbClient`) kesinlikle bağımlılık içermez (ESLint `no-restricted-imports` kuralıyla korunmaktadır).
   - Bağımlılık yönü daima: `apps/app-desktop` → `@temin360/document-templates` şeklindedir.

2. **Hesaplama Yapmama (Pure Presentation):**
   - Şablon bileşenleri içerisinde hiçbir tutar toplamı veya KDV hesabı yapılmaz.
   - Tüm toplamlar, ara toplamlar, KDV tutarları ve yazıyla tutar ifadeleri adapter/resolver katmanında hesaplanarak şablona `data` prop'u aracılığıyla hazır gönderilir.

3. **Saf Sayfa Bileşeni (`<DocumentPage />`):**
   - A4 (210mm x 297mm) veya yatay (297mm x 210mm) fiziksel boyutunu, `bg-white` zeminini ve `data-document-page="true"` özniteliğini taşır.
   - Ekran stilleri (gri zemin, koyu tema, dış gölge vb.) pakette yer almaz; uygulama katmanında `DocumentRenderer` (`chrome="paper"`) tarafından sarmalanır.

---

## Yeni Şablon Ekleme Rehberi (Adım Adım)

Yeni bir standart belge şablonu eklemek yalnızca **iki temel adımdan** oluşur:

### 1. Şablon Bileşenini Oluşturun
`packages/document-templates/src/templates/<yeni-sablon>/` altında:
- `YeniSablon.schema.ts` (Zod şeması ve TypeScript tipi)
- `YeniSablon.template.tsx` (React bileşeni - `data` ve `orientation` prop'ları alır)
- `index.ts` (Export'lar)

### 2. Registry'ye Kaydedin
`packages/document-templates/src/registry.ts` dosyasında `templateRegistry` nesnesine ekleyin:

```ts
export const templateRegistry = {
  // ... mevcut şablonlar
  yeni_sablon: {
    id: 'yeni-sablon',
    name: 'YeniSablon',
    title: 'Standart Form: Yeni Belge Başlığı',
    category: '1-ihtiyac-tespiti-ve-baslangic',
    categoryLabel: 'Hazırlık & İhtiyaç',
    description: 'Belgenin kısa açıklaması',
    component: YeniSablon,
    orientation: 'portrait', // veya 'landscape'
    capabilities: {
      supportsOlur: true,
      supportsLogos: true,
      supportsCommission: false,
    },
    standartFormKodu: 'MYHBY m.4/e',
    standartFormAdi: 'Yeni Belge Başlığı',
  },
} as const satisfies Record<string, TemplateDefinition<any>>;
```

Ve `REGISTRY_LOOKUP` tablosuna alias eşleştirmelerini ekleyin:
```ts
const REGISTRY_LOOKUP: Record<string, TemplateKey> = {
  yeni_sablon: 'yeni_sablon',
  'yeni-sablon': 'yeni_sablon',
};
```

Böylece şablon:
- `templateRegistry`'de yerini alır,
- `TemplateKey` ve `TemplateData<'yeni_sablon'>` tipleri otomatik türetilir,
- Hem UI önizlemede (V3 modal, canvas) hem de PDF/yazdırma motorunda doğrudan kullanılabilir hale gelir.
