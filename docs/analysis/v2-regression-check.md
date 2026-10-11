# TEMİN 360 - Faz 0: V1/V2 Regresyon ve Davranış Doğrulama Raporu

Bu doküman, `ab376c85` commit'i ile kaldırılan V2 dosyalarının (`useDosyaAsamasiSablonsV2.ts`, `PrintDropdownButtonV2.tsx`, eski `dashboard/index.screen.tsx`) ardından V1 dosyalarında herhangi bir davranış kaybı veya regresyon oluşup oluşmadığını doğrulamak amacıyla hazırlanmıştır.

---

## 🔍 1. Temel Doğrulama (Baseline Status)

- **TypeScript Typecheck:** `pnpm typecheck` başarıyla tamamlandı (Desktop Node, Desktop Web ve App-Web: 0 hata).
- **Testler:** `pnpm test` (Vitest) 8 test dosyasında 38 testin tamamı başarılı (PASSED).
- **Desktop Build:** `pnpm build:desktop` (`electron-vite build`) başarıyla tamamlandı (0 hata).
- **Lint Durumu:** ESLint genel kontrolleri çalışıyor (Windows CRLF satır sonu formatlama uyarıları mevcut, derleme hatası yok).

---

## 🔎 2. V1 / V2 Davranış ve İmza Karşılaştırması

### A. `handleOpenPreviewForSablon` Akışı (`setPreviewModalOpen(true)` ve `initialData`)
- **Silinen V2 Dosyasındaki Durum (`useDosyaAsamasiSablonsV2.ts`):**
  - Fonksiyon `loadOrCreateSnapshot` ile `snapshotCtx` yüklüyordu.
  - `setPreviewData` çağrısı yaparak yerel modal verisini set ediyordu.
  - `setPreviewModalOpen(true)` ile modal görünürlüğünü açıyordu.
  - `useGlobalDocumentPreviewStore.getState().openDocument({... initialData: snapshotCtx})` ile global önizleme store'una veriyi iletiyordu.
- **Mevcut V1 Dosyasındaki Durum (`useDosyaAsamasiSablons.ts:220-252`):**
  - V1 dosyasında aynı akış korunmuştur:
    ```ts
    setPreviewData({
      sablonId: sablon.id,
      title,
      templateHtml: sablon.icerik,
      processPath,
      templateTestVerisi: '',
      snapshotContext: snapshotCtx,
      dosyaAdi: sablon.dosya_adi,
      selectedFirma: selectedFirma || null
    })
    setPreviewModalOpen(true)
    useGlobalDocumentPreviewStore.getState().openDocument({
      documentId: docId,
      dosyaId: activeDosyaId || undefined,
      documentTitle: title,
      selectedFirma: selectedFirma || null,
      initialData: snapshotCtx
    })
    ```
- **Bulgu & Değerlendirme:**
  - `initialData` akışı ve `setPreviewModalOpen(true)` davranışı V1 içinde **birebir eksiksiz mevcuttur**.
  - Herhangi bir veri kaybı veya modal açılış regresyonu **yoktur**.

---

### B. `isSablonDisabled` İmzası ve `PrintDropdownButton` Çağrı Yerleri
- **İmza Tutarsızlığı Tespiti:**
  - `PrintDropdownButtonProps` arayüzünde (satır 25) tip tanımı:
    `isSablonDisabled?: (sablon: any) => boolean`
  - Ancak butonun iç gövdesinde (satır 304):
    `const isDisabled = ciktiLoading || (isSablonDisabled && isSablonDisabled(cleanName))`
    Görüldüğü üzere fonksiyon şablon nesnesi (`sablon`) ile değil, ayıklanmış başlık metni olan `cleanName: string` ile çağrılmaktadır.
  - `useDosyaAsamasiSablons.ts` içerisindeki asıl fonksiyon tanımı (satır 504):
    `const isSablonDisabled = (cleanName: string): boolean => checkIsSablonDisabled(cleanName, dosyaContext)`
    Yani asıl işlev zaten `cleanName: string` beklemektedir.
- **Çağrı Yerlerinin İncelenmesi:**
  1. `MalzemeTablosu.tsx:58, 619`: Props olarak `isSablonDisabled?: (cleanName: string) => boolean` tanımlamış ve butona bunu aktarmıştır.
  2. `HazirlikVeIhtiyac.tsx:35, 109`: `useDosyaAsamasiSablons` hook'undan aldığı `isSablonDisabled`'ı `MalzemeTablosu`'na paslamaktadır.
  3. `KabulVeOdeme.tsx:35, 117`: Hook'tan aldığı `isSablonDisabled`'ı doğrudan `PrintDropdownButton`'a vermektedir.
  4. `KlasorKapakCiktiCard.tsx:19, 51`: `(sablon: any) => boolean` olarak tiplendirmiş olsa da `KlasorVeKapaklar.tsx` üzerinden hook fonksiyonunu iletmektedir.
- **Bulgu & Değerlendirme:**
  - Çalışma zamanında (runtime) tüm çağrıcılar ve buton içi mantık uyumludur; parametre olarak `cleanName` iletilmekte ve `checkIsSablonDisabled` doğru çalışmaktadır.
  - Tip tanımındaki `(sablon: any)` ifadesi gevşek (loose) tiplendirmedir. Kod davranışını bozmaz ancak Faz 2'de tip temizliği kapsamında `(cleanName: string) => boolean` olarak düzeltilmesi önerilir.

---

### C. `HazirlikVeIhtiyac.tsx` İçindeki Alias Kullanımı
- **Mevcut Kod (`HazirlikVeIhtiyac.tsx:5, 37`):**
  ```ts
  import { isV2Template, normalizeForMatch, useDosyaAsamasiSablons as useDosyaAsamasiSablonsV2 } from './useDosyaAsamasiSablons'
  ...
  const { ... } = useDosyaAsamasiSablonsV2()
  ```
- **Bulgu & Değerlendirme:**
  - `useDosyaAsamasiSablonsV2` dosyası silindiğinde import doğrudan V1 dosyasına yönlendirilmiş ve geriye dönük uyumluluk için alias (`as useDosyaAsamasiSablonsV2`) kullanılmıştır.
  - V1 hook'unun döndürdüğü state ve fonksiyonlar ile V2'nin sağladıkları birebir örtüştüğü için bileşenin render veya state yönetiminde hiçbir davranış farkı oluşmamıştır.

---

### D. `dashboard/index.screen.tsx` (V1) vs `dashboard/index2.screen.tsx` (V2)
- **Bulgu & Değerlendirme:**
  - `routes.tsx` incelendiğinde ana rota (`APP_ROUTES.DASHBOARD`), `ab376c85` commit'inden çok daha önce doğrudan `dashboard/index2.screen.tsx` dosyasına bağlanmıştı.
  - Silinen `dashboard/index.screen.tsx` tamamen rota dışı ve erişilemeyen ölü bir dosyaydı.
  - Dolayısıyla V2 dashboard uygulamanın tek ve resmi ekranı olmaya devam etmektedir; silinen eski V1 ekranı nedeniyle bir davranış kaybı yaşanmamıştır.

---

## 📌 Sonuç
Faz 0 doğrulaması tamamlanmıştır. `ab376c85` commit'i neticesinde çalışma zamanı (runtime) veya veri akışında hiçbir regresyon oluşmamıştır. Faz 1 ölü kod temizliğine güvenle geçilebilir.
