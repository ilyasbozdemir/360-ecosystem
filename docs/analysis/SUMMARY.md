# TEMİN 360 - Kod Tabanı Refactoring Analiz Özeti ve Yol Haritası

Bu doküman, kod tabanının TypeScript AST (Compiler API) analizi, gövde hash karşılaştırmaları, V1/V2 bağımlılık zincirleri ve `knip` ölü kod taramalarının nihai yönetici özetini ve iki aşamalı refactoring uygulama planını sunar.

---

## 📊 1. Sayısal Özet

| Metrik | Değer | Açıklama |
| :--- | :--- | :--- |
| **Taranan Kaynak Dosyalar** | **1.112 dosya** | Desktop, Web, Landing ve tüm packages (`database`, `document-templates`, `domain`, `pdf-generator`) |
| **Ayrıştırılan Fonksiyon Sayısı** | **2.915 fonksiyon** | AST ile çıkarılan fonksiyon, arrow ve useCallback tanımları |
| **Adaş Fonksiyon Grubu** | **179 grup** | Birden çok dosyada aynı isimle tanımlanmış fonksiyonlar |
| 🟢 **Grup A (Birebir Aynı Gövde)** | **27 grup** | Normalize gövde hash'i %100 aynı (sıfır riskle birleştirilebilir) |
| 🟡 **Grup B (Yapısal Olarak Aynı)** | **13 grup** | Mantık/akış birebir aynı, sadece değişken adı/literal farkı var |
| 🟠 **Grup C (Yüksek Benzerlik >= %80)** | **40 grup** | Token düzeyinde >= %80 benzerlik gösteren fonksiyonlar |
| 🔴 **Grup D (Sadece İsim Aynı)** | **99 grup** | Yerel UI olay yöneticileri (birleştirilmemeli) |
| 🕵️ **Gizli Kopyalar (Farklı İsim)** | **15 grup** | 5+ satırlık birebir (1) ve yapısal (14) kopya fonksiyonlar |
| 🗑️ **Silinebilecek Güvenli Dosya** | **32 dosya** | Hiçbir import veya rota referansı olmayan ölü dosyalar |
| 📉 **Kurtarılacak Tahmini Satır** | **~7.500+ satır** | 6.875 satır ölü dosya + ~700 satır mükerrer fonksiyon gövdesi |

---

## 🎯 2. Birleştirmeye En Değerli 10 Kopya Fonksiyon

*(Etki Puanı = Tekrar Sayısı × Ortalama Gövde Satır Sayısı)*

| Sıra | Fonksiyon / Mantık | Etki | Tekrar | Grup | Bulunduğu Dosyalar ve Önerilen Hedef |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **1** | `formatCurrency` / `formatMoney` / `fmt` | **320** | 21 dosya | **A/C** | `packages/document-templates/src/utils/textHelpers.ts` ve `apps/app-desktop/src/renderer/src/utils/formatters.ts`<br>👉 **Hedef:** `@temin360/domain` veya paylaşımlı `formatters.ts` |
| **2** | `handleExportCSV` | **127** | 4 dosya | **C** | `raporlar/components/{ButceOdenekView, DokumanlarView, KayitFormuView, MalzemeHarcamaView}.tsx`<br>👉 **Hedef:** `renderer/src/utils/exportUtils.ts` |
| **3** | `handleDeleteSelected` | **98** | 3 dosya | **C** | `MalzemeTablosu.tsx:131`, `IhtiyacListesiTab.tsx:118`, `malzemeler/index.screen.tsx:58`<br>👉 **Hedef:** `hooks/useTableBulkActions.ts` |
| **4** | `calculateTableTotal` | **90** | 2 dosya | **A** | `InspectorTableManager.tsx:18` ve `builder/utils.ts:29`<br>👉 **Hedef:** `builder/utils.ts` (mevcut dosya tekil kaynak olmalı) |
| **5** | `generateBarcode` | **85** | 2 dosya | **A** | `malzemeler/yeni.screen.tsx:74` ve `pozlar/pozlar.hooks.ts:37`<br>👉 **Hedef:** `renderer/src/utils/barcodeUtils.ts` |
| **6** | `toPossessiveSuffix` | **72** | 2 dosya | **A** | `renderer/src/utils/kurumHelper.ts:147` ve `packages/document-templates/src/utils/textHelpers.ts:43`<br>👉 **Hedef:** `@temin360/domain` veya `textHelpers.ts` |
| **7** | `parseTargets` | **60** | 2 dosya | **A** | `visibility.config.ts:108` ve `memberVisibilityResolver.ts:182`<br>👉 **Hedef:** `document-templates/src/services/memberVisibilityResolver.ts` |
| **8** | `handleCopy` / `handleCopyJson` | **95** | 8 dosya | **B/C** | `InspectorTabBar.tsx:34`, `FormBuilderV2Playground.tsx:274`, `SayiyiYaziyaCevirModal.tsx:79` vb.<br>👉 **Hedef:** `renderer/src/utils/clipboard.ts` |
| **9** | `getSetting` / `getSmtpSetting` | **50** | 3 dosya | **A** | `main/ipc/{settings, detsis, network}.ipc.ts`<br>👉 **Hedef:** `main/database/repositories/settingsRepository.ts` |
| **10** | `isSablonDisabled` | **45** | 2 dosya | **A** | `ActiveFileSidebar.tsx:9` ve `useDosyaAsamasiSablons.ts`<br>👉 **Hedef:** `useDosyaAsamasiSablons.ts` (sidebar doğrudan buradan import etmeli) |

---

## 🚀 3. Refactor Yol Haritası (Prompt'a Hazır Kesin Listeler)

### 📌 FAZ 1: Ölü Kod ve Kullanılmayan Dosyaların Silinmesi (32 Dosya)

> ⚠️ **UYARI:** `v2 olanlarda v1'leri asla silme` ilkesi uyarınca `DocumentPreviewModal.tsx` ve `DocumentPreviewModal/index.tsx` V1 köprüleri bu listeden **muaf tutulmuştur ve silinmeyecektir**.

```text
# 1. Eski V1 Dashboard Bileşenleri
apps/app-desktop/src/renderer/src/screens/dashboard/components/ActiveFilesPipeline.tsx
apps/app-desktop/src/renderer/src/screens/dashboard/components/AnnouncementsPanel.tsx
apps/app-desktop/src/renderer/src/screens/dashboard/components/ChartsSection.tsx
apps/app-desktop/src/renderer/src/screens/dashboard/components/HeroHeader.tsx
apps/app-desktop/src/renderer/src/screens/dashboard/components/InstitutionCard.tsx
apps/app-desktop/src/renderer/src/screens/dashboard/components/KpiCards.tsx
apps/app-desktop/src/renderer/src/screens/dashboard/components/StatsCards.tsx

# 2. Ölü Monolitik Dosya Ekranı ve Atıl Widget'lar
apps/app-desktop/src/renderer/src/screens/dosya/MalzemeListesi.screen.tsx
apps/app-desktop/src/renderer/src/screens/dosya/components/ChangelogWidget.tsx
apps/app-desktop/src/renderer/src/screens/dosya/components/CiktiPreviewModal.tsx
apps/app-desktop/src/renderer/src/screens/dosya/components/DteTransfer.tsx
apps/app-desktop/src/renderer/src/screens/dosya/components/PackageStructure.tsx
apps/app-desktop/src/renderer/src/screens/dosya/components/PrintManagerModal.tsx
apps/app-desktop/src/renderer/src/screens/dosya/components/ProcessStats.tsx
apps/app-desktop/src/renderer/src/screens/dosya/components/SelectedFileInspector.tsx
apps/app-desktop/src/renderer/src/screens/dosya/components/UpdaterWidget.tsx
apps/app-desktop/src/renderer/src/screens/dosya/components/VerticalStepper.tsx
apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/SubScreen.tsx
apps/app-desktop/src/renderer/src/screens/dosya/components/DocumentPreviewModalV2/utils.ts

# 3. Eski Dosya Aşamaları Sekmeleri ve Detay Panelleri
apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/SablonPanelleri.tsx
apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/DavetEdilenFirmalar.tsx
apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/DocumentsDashboard.tsx
apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/PiyasaFiyatArastirmasiFirmsTab.tsx
apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/SiparisVeSozlesme/SiparisStepperTabs.tsx
apps/app-desktop/src/renderer/src/screens/dosyalar/components/DosyaDetailPanel.tsx
apps/app-desktop/src/renderer/src/screens/dosyalar/components/DetailHelpers.tsx
apps/app-desktop/src/renderer/src/screens/dosyalar/tabs/TeknikSartnameTab.tsx

# 4. Atıl Modallar ve Test/Stub Dosyaları
packages/document-templates/src/resolver/MappingResolverTest.tsx
apps/app-desktop/src/renderer/src/screens/komisyonlar/components/GorevTanimlariModal.tsx
apps/app-desktop/src/renderer/src/screens/komisyonlar/components/KomisyonBelgeleriYonetModal.tsx
apps/app-desktop/src/renderer/src/screens/kurum/components/KurumsalYapiTab.tsx
apps/app-desktop/src/main/database/BaseTable.ts
```

---

### 📌 FAZ 2: Tekilleştirilecek ve Birleştirilecek Fonksiyonlar

`REFACTORING_NOTES.md` prensiplerine uygun olarak:
- Tipler `@temin360/database` veya `@temin360/domain` paketlerinden türetilecek,
- Bileşen prop yüzeyleri `Pick` ile daraltılacak,
- `any` kullanımları temizlenecektir.

```text
1. calculateTableTotal
   Kaynak A: apps/app-desktop/src/renderer/src/screens/sablonlar/components/builder/inspector/InspectorTableManager.tsx
   Kaynak B: apps/app-desktop/src/renderer/src/screens/sablonlar/components/builder/utils.ts
   Aksiyon: Kaynak A'daki fonksiyon silinmeli, Kaynak B'den import edilmelidir.

2. generateBarcode
   Kaynak A: apps/app-desktop/src/renderer/src/screens/malzemeler/yeni.screen.tsx:74
   Kaynak B: apps/app-desktop/src/renderer/src/screens/pozlar/pozlar.hooks.ts:37
   Aksiyon: Ortak utility apps/app-desktop/src/renderer/src/utils/barcodeUtils.ts oluşturulmalı.

3. toPossessiveSuffix
   Kaynak A: apps/app-desktop/src/renderer/src/utils/kurumHelper.ts:147
   Kaynak B: packages/document-templates/src/utils/textHelpers.ts:43
   Aksiyon: packages/document-templates/src/utils/textHelpers.ts tekil kaynak olmalı, desktop oradan tüketmelidir.

4. parseTargets
   Kaynak A: packages/document-templates/src/constants/visibility.config.ts:108
   Kaynak B: packages/document-templates/src/services/memberVisibilityResolver.ts:182
   Aksiyon: memberVisibilityResolver.ts tekil export sağlamalı, visibility.config.ts oradan almalıdır.

5. formatCurrency / formatMoney
   Kaynaklar: apps/app-desktop/src/renderer/src/utils/formatters.ts, packages/document-templates/src/utils/textHelpers.ts
   Aksiyon: formatCurrency tek isim altında standartlaştırılmalı, ad-hoc inline kopyalar silinmelidir.

6. handleExportCSV
   Kaynaklar: apps/app-desktop/src/renderer/src/screens/raporlar/components/{ButceOdenekView, DokumanlarView, KayitFormuView, MalzemeHarcamaView}.tsx
   Aksiyon: apps/app-desktop/src/renderer/src/utils/exportUtils.ts altında genel bir exportToCSV(data, filename) fonksiyonuna dönüştürülmelidir.

7. handleDeleteSelected
   Kaynaklar: MalzemeTablosu.tsx, IhtiyacListesiTab.tsx, malzemeler/index.screen.tsx
   Aksiyon: Ortak hook useBulkSelection / useTableBulkActions ile birleştirilmelidir.
```

---

## ❓ 4. İnsan Kararı Gerektiren Maddeler

1. **`FiyatFarkiTab` Bileşenleri (Araçlar vs Sistem/Mevzuat):**
   - İki bileşen de şu an aktiftir (`HesaplamaAraclariScreen` ve `MevzuatScreen`).
   - *Karar:* İkisi şimdilik ayrı tutulmalı mıdır, yoksa tek bir gelişmiş sekme bileşeni yapılıp parametre ile "Hızlı Mod / Mevzuat Modu" seçeneği mi sunulmalıdır?
2. **`DocumentPreviewModal` V1 Köprüsü:**
   - V1 köprüsü `komisyonlar` ve `TaslakYoneticisi` tarafından kullanılmaktadır.
   - *Tavsiye:* Kullanıcı kuralına uygun olarak V1 köprüsü **kesinlikle korunmaktadır**.
3. **Şablon Tip Tanımları (`shared/types/templates/`):**
   - Knip tarafından kullanılmayan olarak işaretlenen 6 adet şablon tip dosyası (`ihale-kapagi.ts`, `tasinir-islem-fisi.ts` vb.) gelecekteki şablon motoru için saklanmalı mıdır? (Önerimiz: Şimdilik silinmeyip korunmasıdır).
