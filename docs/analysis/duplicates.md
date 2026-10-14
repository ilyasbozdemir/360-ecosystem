# TEMİN 360 - Mükerrer Fonksiyon ve Gövde Analiz Raporu

> Bu rapor AST tabanlı TypeScript Compiler API ayrıştırması, gövde hash kontrolü, yapısal normalizasyon ve token benzerlik analizi ile oluşturulmuştur.

## 📊 Genel İstatistikler
- **Taranan Kaynak Dosya Sayısı:** 1418
- **Çıkarılan Fonksiyon Sayısı:** 3315
- **Adaş Fonksiyon Grubu (Birden fazla dosyada tanımlı):** 178
- **A: Birebir Aynı Gövdeler:** 25 adet
- **B: Yapısal Olarak Aynı Gövdeler:** 11 adet
- **C: Yüksek Benzerlik Gösterenler (>= %80):** 37 adet
- **D: Sadece İsim Aynı (Farklı Gövde):** 105 adet
- **Gizli Kopyalar (Farklı İsim, Birebir/Yapısal Aynı):** 17 grup (1 birebir, 16 yapısal)

---

## 🟢 Grup A: Birebir Aynı Fonksiyonlar (25 adet)
Bu fonksiyonlar normalize edilmiş gövde hash'leri birebir eşleşen tam kopyalardır. **En hızlı ve en güvenli birleştirme adaylarıdır.**

### `mutationFn` (20 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Farklı modüller (dosya süreci vs sistem ekranı) arasında paylaşımlı utils gerektirir. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/hooks/useProjeHooks.ts:75` (21 satır)
  - `apps/app-desktop/src/renderer/src/hooks/useProjeHooks.ts:103` (31 satır)
  - `apps/app-desktop/src/renderer/src/hooks/useProjeHooks.ts:141` (10 satır)
  - `apps/app-desktop/src/renderer/src/screens/ambar/ambar.hooks.ts:241` (25 satır)
  - `apps/app-desktop/src/renderer/src/screens/ambar/ambar.hooks.ts:270` (12 satır)
  - `apps/app-desktop/src/renderer/src/screens/ambar/ambar.hooks.ts:286` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/ambar/ambar.hooks.ts:300` (93 satır)
  - `apps/app-desktop/src/renderer/src/screens/ambar/ambar.hooks.ts:398` (110 satır)
  - `apps/app-desktop/src/renderer/src/screens/ambar/ambar.hooks.ts:513` (14 satır)
  - `apps/app-desktop/src/renderer/src/screens/ambar/ambar.hooks.ts:532` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/ayarlar/ayarlar.hooks.ts:32` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/ayarlar/ayarlar.hooks.ts:41` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/ayarlar/ayarlar.hooks.ts:53` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/ayarlar/ayarlar.hooks.ts:62` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/birimler/birimler.hooks.ts:84` (32 satır)
  - `apps/app-desktop/src/renderer/src/screens/birimler/birimler.hooks.ts:120` (17 satır)
  - `apps/app-desktop/src/renderer/src/screens/birimler/birimler.hooks.ts:141` (37 satır)
  - `apps/app-desktop/src/renderer/src/screens/butcekod/butcekod.hooks.ts:510` (22 satır)
  - `apps/app-desktop/src/renderer/src/screens/butcekod/butcekod.hooks.ts:539` (34 satır)
  - `apps/app-desktop/src/renderer/src/screens/butcekod/butcekod.hooks.ts:580` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/dosyalar.hooks.ts:137` (42 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/dosyalar.hooks.ts:194` (33 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/dosyalar.hooks.ts:234` (10 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/dosyalar.hooks.ts:251` (10 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/dosyalar.hooks.ts:268` (12 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/dosyalar.hooks.ts:287` (12 satır)
  - `apps/app-desktop/src/renderer/src/screens/firmalar/firmalar.hooks.ts:65` (87 satır)
  - `apps/app-desktop/src/renderer/src/screens/firmalar/firmalar.hooks.ts:156` (46 satır)
  - `apps/app-desktop/src/renderer/src/screens/firmalar/firmalar.hooks.ts:206` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/firmalar/firmalar.hooks.ts:260` (23 satır)
  - `apps/app-desktop/src/renderer/src/screens/firmalar/firmalar.hooks.ts:290` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyon-gorevleri/index.screen.tsx:45` (21 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyon-gorevleri/index.screen.tsx:75` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/components/hizli-kadro/useHizliKadro.ts:379` (126 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/components/komisyon-olustur/useKomisyonOlustur.ts:238` (177 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/components/PersonelAtaModal.tsx:75` (17 satır)
  - `apps/app-desktop/src/renderer/src/screens/malzemeler/malzemeler.hooks.ts:53` (42 satır)
  - `apps/app-desktop/src/renderer/src/screens/malzemeler/malzemeler.hooks.ts:101` (43 satır)
  - `apps/app-desktop/src/renderer/src/screens/malzemeler/malzemeler.hooks.ts:150` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/notlar/notlar.hooks.ts:61` (31 satır)
  - `apps/app-desktop/src/renderer/src/screens/notlar/notlar.hooks.ts:98` (19 satır)
  - `apps/app-desktop/src/renderer/src/screens/notlar/notlar.hooks.ts:123` (10 satır)
  - `apps/app-desktop/src/renderer/src/screens/notlar/notlar.hooks.ts:139` (32 satır)
  - `apps/app-desktop/src/renderer/src/screens/notlar/notlar.hooks.ts:177` (6 satır)
  - `apps/app-desktop/src/renderer/src/screens/okaskod/okaskod.hooks.ts:30` (7 satır)
  - `apps/app-desktop/src/renderer/src/screens/okaskod/okaskod.hooks.ts:43` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/olcubirimleri/olcubirimleri.hooks.ts:65` (61 satır)
  - `apps/app-desktop/src/renderer/src/screens/olcubirimleri/olcubirimleri.hooks.ts:137` (31 satır)
  - `apps/app-desktop/src/renderer/src/screens/olcubirimleri/olcubirimleri.hooks.ts:199` (46 satır)
  - `apps/app-desktop/src/renderer/src/screens/olcubirimleri/olcubirimleri.hooks.ts:255` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/personel.hooks.ts:191` (51 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/personel.hooks.ts:250` (68 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/personel.hooks.ts:326` (19 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/personel.hooks.ts:380` (20 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/personel.hooks.ts:407` (20 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/personel.hooks.ts:434` (10 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/pozlar.hooks.ts:56` (38 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/pozlar.hooks.ts:102` (52 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/pozlar.hooks.ts:162` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/pozlar.hooks.ts:178` (46 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:138` (77 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:224` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:242` (16 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:267` (17 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:294` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:313` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/mevzuat/kik-limitleri.hooks.ts:60` (56 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/mevzuat/kik-limitleri.hooks.ts:123` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/tasinirkod/tasinirkod.hooks.ts:33` (16 satır)
  - `apps/app-desktop/src/renderer/src/screens/tasinirkod/tasinirkod.hooks.ts:55` (9 satır)

### `queryFn` (18 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Farklı modüller (dosya süreci vs sistem ekranı) arasında paylaşımlı utils gerektirir. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/ActiveFileSidebar.tsx:121` (8 satır)
  - `apps/app-desktop/src/renderer/src/hooks/useProjeHooks.ts:180` (13 satır)
  - `apps/app-desktop/src/renderer/src/screens/ambar/ambar.hooks.ts:220` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/ambar/ambar.hooks.ts:225` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/ambar/ambar.hooks.ts:230` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/CiktiMerkezi.tsx:26` (11 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/CiktiMerkezi.tsx:66` (10 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/components/malzeme-tablosu/useMalzemeTablosuActions.ts:284` (22 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/components/DosyaHizliIcerikPopover.tsx:87` (12 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/components/DosyaHizliIcerikPopover.tsx:105` (29 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/components/DosyaHizliIcerikPopover.tsx:140` (43 satır)
  - `apps/app-desktop/src/renderer/src/screens/firmalar/firmalar.hooks.ts:241` (10 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyon-gorevleri/index.screen.tsx:22` (14 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/components/hizli-kadro/useHizliKadro.ts:40` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/components/hizli-kadro/useHizliKadro.ts:53` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/components/komisyon-olustur/useKomisyonOlustur.ts:26` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/components/komisyon-olustur/useKomisyonOlustur.ts:40` (12 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/components/komisyon-olustur/useKomisyonOlustur.ts:58` (18 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/components/komisyon-olustur/useKomisyonOlustur.ts:82` (52 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/components/PersonelAtaModal.tsx:34` (19 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/components/PersonelAtaModal.tsx:63` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/detay.screen.tsx:40` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/detay.screen.tsx:80` (33 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/useKomisyonlarScreenLogic.tsx:73` (169 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/useKomisyonlarScreenLogic.tsx:247` (52 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/useKomisyonlarScreenLogic.tsx:305` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/olcubirimleri/olcubirimleri.hooks.ts:50` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/olcubirimleri/olcubirimleri.hooks.ts:178` (14 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/personel.hooks.ts:375` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:33` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:47` (10 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:64` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:78` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:92` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:108` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/mevzuat/kik-limitleri.hooks.ts:42` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/takip/components/useTakip.ts:179` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/takip/components/useTakip.ts:194` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/takip/components/useTakip.ts:207` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/takip/components/useTakip.ts:221` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/takip/components/useTakip.ts:236` (12 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/takip/components/useTakip.ts:254` (9 satır)

### `formatMoney` (12 farklı dosya)
- **Önerilen Hedef Modül:** `packages/document-templates/src/utils/ veya packages/domain/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/temin-selector/teminSelector.utils.ts:4` (6 satır)
  - `apps/app-desktop/src/renderer/src/components/ui/YiUfePriceBadge.tsx:45` (7 satır)
  - `apps/app-desktop/src/renderer/src/screens/devlet-ihale-2886/components/dosya-yonetimi/dosyaYonetimi2886.utils.tsx:4` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/devlet-ihale-2886/components/IhaleGunuVeTekliflerTab.tsx:10` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/devlet-ihale-2886/components/KiraVeTahsilatTakipTab.tsx:23` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/devlet-ihale-2886/components/MuhammenBedelVeTakdirTab.tsx:202` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/hooks/useDosyaScreenData.ts:363` (7 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/components/DosyaHizliIcerikPopover.tsx:196` (7 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/components/inspector/types.ts:25` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/components/useDosyalarScreenLogic.ts:335` (1 satır)
  - `apps/app-web/src/app/dosyalar/page.tsx:174` (8 satır)
  - `packages/document-templates/src/utils/textHelpers.ts:180` (45 satır)

### `showToast` (9 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** useCallback/Hook içinde: Component closure (state/props) bağımlılıkları incelenmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/hooks/useCiktiMerkeziScreen.ts:60` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/hizliGrid/useHizliTopluKalem.ts:90` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/ImzaliBelgeler.tsx:36` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/islak-imza/islak-imzali-belge.screen.tsx:49` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/kurum/components/LogolarTab.tsx:199` (6 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/components/toplu/useTopluPozlar.ts:41` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/useYeniPoz.ts:133` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/profil/index.screen.tsx:80` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/components/FormBuilderV2Playground.tsx:81` (6 satır)

### `fmt` (8 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/KabulVeOdeme/useKabulVeOdemeData.ts:341` (6 satır)
  - `apps/app-desktop/src/renderer/src/screens/kurum/components/ButceOdenekTanimTab.tsx:57` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/AylikOzetView.tsx:21` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/ButceOdenekView.tsx:7` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/ButceView.tsx:7` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/KayitFormuView.tsx:7` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/MalzemeHarcamaView.tsx:6` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/YillikOzetView.tsx:6` (1 satır)

### `handlePrint` (8 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** useCallback/Hook içinde: Component closure (state/props) bağımlılıkları incelenmeli. Farklı modüller (dosya süreci vs sistem ekranı) arasında paylaşımlı utils gerektirir. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/belgelerim/components/BelgeEditorModal.tsx:190` (25 satır)
  - `apps/app-desktop/src/renderer/src/screens/devlet-ihale-2886/components/studyo/useBelgeVeSablonStudyo.ts:319` (25 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/components/DocumentPreviewModalV3/hooks/useDocumentPreviewData.ts:276` (14 satır)
  - `apps/app-desktop/src/renderer/src/screens/ebys/components/resmi-ust-yazi/useResmiUstYazi.ts:245` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/ebys/hooks/useEbysStudio.ts:115` (31 satır)
  - `apps/app-desktop/src/renderer/src/screens/islak-imza/islak-imzali-belge.screen.tsx:54` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/KayitFormuView.tsx:55` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/surec-akisi/hooks/useDTEbysStudio.ts:205` (22 satır)

### `handleClear` (6 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/FiyatIstenenFirmalari/FirmaMektupMenu.tsx:57` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/FiyatIstenenFirmalari/RowMenu.tsx:69` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/KabulVeOdeme/tutanaklar/HeaderDigerActionsMenu.tsx:59` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/KabulVeOdeme/tutanaklar/TutanakRowActionsMenu.tsx:81` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/components/manage/DosyaManageHeader.tsx:59` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/components/useDosyalarScreenLogic.ts:52` (3 satır)

### `handlePresetsChange` (5 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Farklı modüller (dosya süreci vs sistem ekranı) arasında paylaşımlı utils gerektirir. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/ActiveFileSidebar.tsx:88` (8 satır)
  - `apps/app-desktop/src/renderer/src/components/ui/BelgeAksiyonlari.tsx:85` (6 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/components/PrintDropdownButton.tsx:70` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/hooks/usePiyasaFiyatArastirmasi/usePiyasaFiyatPresets.ts:24` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/taslak-yoneticisi/taslak-yoneticisi.screen.tsx:75` (8 satır)

### `handler` (5 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/FiyatIstenenFirmalari/FirmaMektupMenu.tsx:46` (11 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/FiyatIstenenFirmalari/RowMenu.tsx:58` (11 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/KabulVeOdeme/tutanaklar/HeaderDigerActionsMenu.tsx:48` (11 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/KabulVeOdeme/tutanaklar/TutanakRowActionsMenu.tsx:70` (11 satır)
  - `apps/app-desktop/src/renderer/src/utils/appEvents.ts:198` (15 satır)

### `onClick` (5 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:9` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:14` (4 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:21` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:25` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:29` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:34` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:38` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:42` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:46` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:50` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:59` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:63` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:67` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:71` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:75` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:84` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:88` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:92` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:97` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:12` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:16` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:20` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:24` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:28` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:32` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:36` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:47` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:51` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:55` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:59` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:63` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:67` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:76` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:80` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:84` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:88` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:92` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:103` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:107` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:112` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:117` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:41` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:44` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:48` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:52` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:57` (15 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:77` (16 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:96` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:100` (25 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:148` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:152` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:157` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:159` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:162` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:166` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:170` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:174` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:176` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:177` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:180` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:184` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:187` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:190` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:195` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:200` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:204` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:206` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:9` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:13` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:17` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:19` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:21` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:22` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:32` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:36` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:40` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:44` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:48` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:55` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:58` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:60` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:70` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:74` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:78` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:80` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:15` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:19` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:23` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:27` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:31` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:35` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:40` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:44` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:48` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:52` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:56` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:61` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:73` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:77` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:81` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:85` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:89` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:94` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:98` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:102` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:107` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:118` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:122` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:126` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:130` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:134` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:138` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:143` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:147` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:151` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:156` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:161` (1 satır)

### `handleChange` (4 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/ambar/components/AmbarFormModal.tsx:77` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/birimler/index.screen.tsx:153` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/firmalar/index.screen.tsx:76` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/kurum/index.screen.tsx:180` (3 satır)

### `handleUpgradeAndOpen` (4 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** useCallback/Hook içinde: Component closure (state/props) bağımlılıkları incelenmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/FileSelector.tsx:53` (8 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/useHeader.ts:76` (8 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/hooks/useWorkspaceLifecycle.ts:27` (10 satır)
  - `apps/app-desktop/src/renderer/src/screens/launcher/useLauncherLogic.ts:112` (8 satır)

### `generateDefaultProjectCode` (3 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/ui/ProjectInlineSection.tsx:22` (3 satır)
  - `apps/app-desktop/src/renderer/src/components/ui/ProjectSelectModal.tsx:26` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/projeler/constants.ts:33` (3 satır)

### `pad` (3 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/shared/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/main/ipc/workspace/gdrive.ipc.ts:462` (1 satır)
  - `apps/app-desktop/src/main/network/autoCloudSync.ts:192` (1 satır)
  - `apps/app-desktop/src/renderer/src/constants/madde-22d-donemler.ts:33` (1 satır)

### `findVal` (2 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/main/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/main/ipc/db/kalemExcelHandlers.ts:91` (9 satır)
  - `apps/app-desktop/src/main/ipc/db/tasinirOkasHandlers.ts:86` (9 satır)
  - `apps/app-desktop/src/main/ipc/db/tasinirOkasHandlers.ts:209` (9 satır)

### `handleCloseWorkspace` (2 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** useCallback/Hook içinde: Component closure (state/props) bağımlılıkları incelenmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/header/useHeader.ts:85` (3 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/Sidebar.tsx:79` (3 satır)

### `handleCopyCode` (2 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** useCallback/Hook içinde: Component closure (state/props) bağımlılıkları incelenmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/ebys/hooks/useEbysStudio.ts:65` (11 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/surec-akisi/hooks/useDTEbysStudio.ts:191` (11 satır)

### `handleCurrencyChange` (2 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/modals/SayiyiYaziyaCevirModal.tsx:116` (12 satır)
  - `apps/app-desktop/src/renderer/src/screens/araclar/components/SayiyiYaziyaCevirTab.tsx:56` (12 satır)

### `handleMode` (2 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/firmalar/index.screen.tsx:118` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/useKomisyonlarScreenLogic.tsx:323` (5 satır)

### `handleReload` (2 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/devlet-ihale-2886/components/DosyaYonetimi2886Tab.tsx:36` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/devlet-ihale-2886/components/studyo/useBelgeVeSablonStudyo.ts:37` (3 satır)

### `handleUpdateRow` (2 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/hizliGrid/useHizliTopluKalem.ts:116` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/components/toplu/useTopluPozlar.ts:56` (3 satır)

### `handleVariableChange` (2 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** useCallback/Hook içinde: Component closure (state/props) bağımlılıkları incelenmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/ebys/hooks/useEbysStudio.ts:33` (6 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/surec-akisi/hooks/useDTEbysStudio.ts:156` (6 satır)

### `isSablonDisabled` (2 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/ActiveFileSidebar.tsx:171` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/useDosyaAsamasiSablons.ts:495` (3 satır)

### `middleware` (2 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-web/src/middleware.ts:4` (18 satır)
  - `apps/app-landing/src/middleware.ts:4` (18 satır)

### `robots` (2 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-web/src/app/robots.ts:4` (35 satır)
  - `apps/app-landing/src/app/robots.ts:4` (36 satır)

---

## 🟡 Grup B: Yapısal Olarak Aynı Fonksiyonlar (11 adet)
Bu fonksiyonlar AST seviyesinde değişken isimleri, parametre adları veya sabit literaller hariç **birebir aynı kontrol akışı ve mantığa** sahiptir. Tek bir parametrik yardımcı fonksiyonda toplanabilirler.

### `onSuccess` (21 dosya, Yapısal Eşleşme)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Değişken adları ve literaller farklı; ortak parametreli genel fonksiyon yapılmalı. Farklı modüller (dosya süreci vs sistem ekranı) arasında paylaşımlı utils gerektirir. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/hooks/useProjeHooks.ts:96` (4 satır)
  - `apps/app-desktop/src/renderer/src/hooks/useProjeHooks.ts:134` (4 satır)
  - `apps/app-desktop/src/renderer/src/hooks/useProjeHooks.ts:151` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/ayarlar/ayarlar.hooks.ts:37` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/ayarlar/ayarlar.hooks.ts:46` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/ayarlar/ayarlar.hooks.ts:58` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/birimler/birimler.hooks.ts:116` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/birimler/birimler.hooks.ts:137` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/birimler/birimler.hooks.ts:178` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/butcekod/butcekod.hooks.ts:532` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/butcekod/butcekod.hooks.ts:573` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/butcekod/butcekod.hooks.ts:589` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/dosyalar.hooks.ts:179` (12 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/dosyalar.hooks.ts:227` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/dosyalar.hooks.ts:244` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/dosyalar.hooks.ts:261` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/dosyalar.hooks.ts:280` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/dosyalar.hooks.ts:299` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/firmalar/firmalar.hooks.ts:152` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/firmalar/firmalar.hooks.ts:202` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/firmalar/firmalar.hooks.ts:215` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/firmalar/firmalar.hooks.ts:283` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/firmalar/firmalar.hooks.ts:299` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyon-gorevleri/index.screen.tsx:66` (6 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyon-gorevleri/index.screen.tsx:84` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/components/hizli-kadro/useHizliKadro.ts:505` (13 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/components/komisyon-olustur/useKomisyonOlustur.ts:415` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/components/PersonelAtaModal.tsx:92` (13 satır)
  - `apps/app-desktop/src/renderer/src/screens/malzemeler/malzemeler.hooks.ts:95` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/malzemeler/malzemeler.hooks.ts:144` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/malzemeler/malzemeler.hooks.ts:159` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/notlar/notlar.hooks.ts:92` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/notlar/notlar.hooks.ts:117` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/notlar/notlar.hooks.ts:133` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/notlar/notlar.hooks.ts:171` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/notlar/notlar.hooks.ts:183` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/okaskod/okaskod.hooks.ts:37` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/okaskod/okaskod.hooks.ts:52` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/olcubirimleri/index.screen.tsx:125` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/olcubirimleri/index.screen.tsx:221` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/olcubirimleri/olcubirimleri.hooks.ts:126` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/olcubirimleri/olcubirimleri.hooks.ts:168` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/olcubirimleri/olcubirimleri.hooks.ts:245` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/olcubirimleri/olcubirimleri.hooks.ts:264` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/personel.hooks.ts:242` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/personel.hooks.ts:318` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/personel.hooks.ts:345` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/personel.hooks.ts:400` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/personel.hooks.ts:427` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/personel.hooks.ts:444` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/pozlar.hooks.ts:94` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/pozlar.hooks.ts:154` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/pozlar.hooks.ts:171` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/pozlar.hooks.ts:224` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/components/SablonEditor.tsx:300` (30 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:215` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:233` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:258` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:284` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:303` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:318` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/mevzuat/kik-limitleri.hooks.ts:116` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/mevzuat/kik-limitleri.hooks.ts:132` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/tasinirkod/tasinirkod.hooks.ts:49` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/tasinirkod/tasinirkod.hooks.ts:64` (3 satır)

### `handleClearAll` (5 dosya, Yapısal Eşleşme)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Değişken adları ve literaller farklı; ortak parametreli genel fonksiyon yapılmalı. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/WorkspaceCloseModal.tsx:167` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/hizliGrid/useHizliTopluKalem.ts:156` (40 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/SiparisVeSozlesme/Step2SonucOnay.tsx:91` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/components/hizli-kadro/HizliKadroBelgeSecimModal.tsx:76` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/components/toplu/useTopluPozlar.ts:68` (5 satır)

### `updateCoords` (5 dosya, Yapısal Eşleşme)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** useCallback/Hook içinde: Component closure (state/props) bağımlılıkları incelenmeli. Değişken adları ve literaller farklı; ortak parametreli genel fonksiyon yapılmalı. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/components/DocumentPreviewModalV3/components/DocumentPreviewTabBar.tsx:59` (15 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/FiyatIstenenFirmalari/FirmaMektupMenu.tsx:19` (13 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/FiyatIstenenFirmalari/RowMenu.tsx:31` (13 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/KabulVeOdeme/tutanaklar/HeaderDigerActionsMenu.tsx:21` (13 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/KabulVeOdeme/tutanaklar/TutanakRowActionsMenu.tsx:42` (14 satır)

### `DELETE` (4 dosya, Yapısal Eşleşme)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Değişken adları ve literaller farklı; ortak parametreli genel fonksiyon yapılmalı. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-web/src/app/api/dosyalar/[id]/route.ts:149` (21 satır)
  - `apps/app-web/src/app/api/firmalar/[id]/route.ts:55` (15 satır)
  - `apps/app-web/src/app/api/gdrive/route.ts:71` (25 satır)
  - `apps/app-web/src/app/api/kalemler/[id]/route.ts:66` (15 satır)

### `Field` (3 dosya, Yapısal Eşleşme)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Değişken adları ve literaller farklı; ortak parametreli genel fonksiyon yapılmalı. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/ambar/components/AmbarFormModal.tsx:37` (14 satır)
  - `apps/app-desktop/src/renderer/src/screens/birimler/components/BirimModal.tsx:40` (14 satır)
  - `apps/app-desktop/src/renderer/src/screens/firmalar/components/FirmaModal.tsx:25` (18 satır)

### `handleDeleteSelected` (3 dosya, Yapısal Eşleşme)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Değişken adları ve literaller farklı; ortak parametreli genel fonksiyon yapılmalı. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/components/malzeme-tablosu/useMalzemeTablosuActions.ts:68` (22 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/tabs/IhtiyacListesiTab.tsx:108` (22 satır)
  - `apps/app-desktop/src/renderer/src/screens/malzemeler/useMalzemelerScreenLogic.ts:87` (52 satır)

### `handleOpenModal` (3 dosya, Yapısal Eşleşme)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Değişken adları ve literaller farklı; ortak parametreli genel fonksiyon yapılmalı. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/FiyatIstenenFirmalarınSecilmesi.tsx:78` (7 satır)
  - `apps/app-desktop/src/renderer/src/screens/okaskod/index.screen.tsx:103` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/tasinirkod/index.screen.tsx:18` (5 satır)

### `handleViewClick` (3 dosya, Yapısal Eşleşme)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Değişken adları ve literaller farklı; ortak parametreli genel fonksiyon yapılmalı. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/birimler/index.screen.tsx:234` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/firmalar/index.screen.tsx:72` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/index.screen.tsx:121` (4 satır)

### `getAllTemplates` (2 dosya, Yapısal Eşleşme)
- **Önerilen Hedef Modül:** `packages/document-templates/src/utils/ veya packages/domain/`
- **Risk Notu:** Değişken adları ve literaller farklı; ortak parametreli genel fonksiyon yapılmalı. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/templates/utils/TemplateManager.ts:61` (3 satır)
  - `packages/document-templates/src/services/templateRegistryService.ts:27` (3 satır)

### `handleOpenInNewWindow` (2 dosya, Yapısal Eşleşme)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Değişken adları ve literaller farklı; ortak parametreli genel fonksiyon yapılmalı. Farklı modüller (dosya süreci vs sistem ekranı) arasında paylaşımlı utils gerektirir. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/components/useDosyalarScreenLogic.ts:99` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/takip/components/useTakip.ts:90` (9 satır)

### `RootLayout` (2 dosya, Yapısal Eşleşme)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Değişken adları ve literaller farklı; ortak parametreli genel fonksiyon yapılmalı. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-web/src/app/layout.tsx:66` (15 satır)
  - `apps/app-landing/src/app/layout.tsx:96` (15 satır)

---

## 🟠 Grup C: Yüksek Benzerlik Gösteren Fonksiyonlar (>= %80) (37 adet)
Bu fonksiyonların gövdeleri token düzeyinde %80 ve üzeri benzerdir. Ufak dal/koşul veya parametre farkları içerir.

### `handleDelete` (17 dosya, Benzerlik: %94)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. Farklı modüller (dosya süreci vs sistem ekranı) arasında paylaşımlı utils gerektirir. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/belgelerim/components/YerTutucuYonetimiModal.tsx:95` (19 satır)
  - `apps/app-desktop/src/renderer/src/screens/butcekod/index.screen.tsx:108` (12 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/FaturaVeIrsaliye.tsx:102` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/ImzaliBelgeler.tsx:144` (21 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/components/useDosyalarScreenLogic.ts:109` (19 satır)
  - `apps/app-desktop/src/renderer/src/screens/firmalar/index.screen.tsx:99` (10 satır)
  - `apps/app-desktop/src/renderer/src/screens/islak-imza/components/signer-list.tsx:32` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/kurum/components/ButceOdenekTanimTab.tsx:40` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/kurum/components/KurumMetadataManager.tsx:66` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/malzemeler/useMalzemelerScreenLogic.ts:28` (29 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/components/PersonelUnvanGecmisiCard.tsx:112` (10 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/index.screen.tsx:146` (11 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/detay.screen.tsx:83` (11 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/index.screen.tsx:81` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/DokumanlarView.tsx:58` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/takip/components/useTakip.ts:100` (18 satır)
  - `apps/app-desktop/src/renderer/src/screens/tasinirkod/index.screen.tsx:58` (9 satır)

### `handleSubmit` (15 dosya, Benzerlik: %91)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/LockScreen.tsx:105` (34 satır)
  - `apps/app-desktop/src/renderer/src/components/ui/TifOlusturModal.tsx:166` (51 satır)
  - `apps/app-desktop/src/renderer/src/screens/ambar/components/AmbarFormModal.tsx:81` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/ambar/components/StokHareketModal.tsx:81` (49 satır)
  - `apps/app-desktop/src/renderer/src/screens/birimler/index.screen.tsx:157` (24 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/FiyatIstenenFirmalari/YeniFirmaModali.tsx:15` (23 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/KabulVeOdeme/KabulTutanakModal.tsx:234` (24 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/KabulVeOdeme/tutanaklar/KabulHizliEkleModal.tsx:73` (17 satır)
  - `apps/app-desktop/src/renderer/src/screens/firmalar/index.screen.tsx:80` (18 satır)
  - `apps/app-desktop/src/renderer/src/screens/notlar/components/NotModal.tsx:91` (29 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/components/PersonelUnvanGecmisiCard.tsx:71` (40 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/index.screen.tsx:131` (14 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/useYeniPoz.ts:207` (62 satır)
  - `apps/app-desktop/src/renderer/src/screens/profil/components/KurumProfileModal.tsx:59` (17 satır)
  - `apps/app-desktop/src/renderer/src/screens/projeler/useProjelerScreen.ts:116` (29 satır)

### `handleSave` (13 dosya, Benzerlik: %90)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. Farklı modüller (dosya süreci vs sistem ekranı) arasında paylaşımlı utils gerektirir. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/ayarlar/theme/useTemaScreen.ts:171` (19 satır)
  - `apps/app-desktop/src/renderer/src/screens/belgelerim/components/YerTutucuYonetimiModal.tsx:77` (17 satır)
  - `apps/app-desktop/src/renderer/src/screens/butcekod/index.screen.tsx:61` (45 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/components/komisyon-atama/useKomisyonAtama.ts:356` (219 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/hizliGrid/useHizliTopluKalem.ts:416` (61 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/SiparisVeSozlesme/ButceVeOdenekCard.tsx:207` (35 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/yeni.hooks.ts:573` (141 satır)
  - `apps/app-desktop/src/renderer/src/screens/kurum/index.screen.tsx:184` (27 satır)
  - `apps/app-desktop/src/renderer/src/screens/malzemeler/yeni.hooks.ts:218` (61 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/ButceOdenekModal.tsx:81` (41 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/components/SablonEditor.tsx:269` (67 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/hizli-dosya-ekle/components/useHizliDosyaEkle.ts:140` (98 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/mevzuat/tabs/OranlarTab.tsx:109` (16 satır)

### `GET` (12 dosya, Benzerlik: %94)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-web/src/app/api/documents/route.ts:4` (40 satır)
  - `apps/app-web/src/app/api/dosyalar/route.ts:6` (62 satır)
  - `apps/app-web/src/app/api/dosyalar/[id]/route.ts:8` (39 satır)
  - `apps/app-web/src/app/api/firmalar/route.ts:4` (25 satır)
  - `apps/app-web/src/app/api/gdrive/route.ts:5` (22 satır)
  - `apps/app-web/src/app/api/health/route.ts:4` (12 satır)
  - `apps/app-web/src/app/api/kalemler/route.ts:4` (22 satır)
  - `apps/app-web/src/app/api/keys/route.ts:32` (18 satır)
  - `apps/app-web/src/app/api/kurum/route.ts:4` (27 satır)
  - `apps/app-web/src/app/api/socket/events/route.ts:4` (39 satır)
  - `apps/app-web/src/app/api/stats/route.ts:7` (96 satır)
  - `apps/app-web/src/app/api/sync/route.ts:5` (58 satır)

### `loadData` (12 dosya, Benzerlik: %84)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** useCallback/Hook içinde: Component closure (state/props) bağımlılıkları incelenmeli. Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/belgelerim/BelgelerimScreen.tsx:54` (28 satır)
  - `apps/app-desktop/src/renderer/src/screens/belgelerim/components/YerTutucuYonetimiModal.tsx:48` (11 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/CiktiMerkezi.hooks.ts:33` (54 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/components/komisyon-atama/useKomisyonAtama.ts:74` (206 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/useMalzemeListesi.ts:130` (26 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/SiparisVeSozlesme/useSiparisVeSozlesmeData.ts:59` (21 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/hooks/usePiyasaFiyatArastirmasi/usePiyasaFiyatData.ts:29` (139 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/yeni.hooks.ts:197` (91 satır)
  - `apps/app-desktop/src/renderer/src/screens/kurum/components/ButceOdenekTanimTab.tsx:14` (21 satır)
  - `apps/app-desktop/src/renderer/src/screens/profil/index.screen.tsx:59` (18 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/ButceOdenekView.tsx:18` (44 satır)
  - `apps/app-web/src/app/dosyalar/page.tsx:55` (26 satır)

### `formatCurrency` (9 dosya, Benzerlik: %97)
- **Önerilen Hedef Modül:** `packages/document-templates/src/utils/ veya packages/domain/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dashboard/components/dashboardV2.helpers.ts:23` (7 satır)
  - `apps/app-desktop/src/renderer/src/screens/dashboard/HarcamaMerkeziScreen.tsx:18` (7 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/mevzuat/components/KikLimitleriSection.tsx:123` (6 satır)
  - `apps/app-desktop/src/renderer/src/utils/formatters.ts:31` (30 satır)
  - `apps/app-desktop/src/renderer/src/utils/turkishCalculationUtils.ts:435` (4 satır)
  - `packages/document-templates/src/templates/dogrudan-temin-onay-belgesi/DogrudanTeminOnayBelgesi.template.tsx:62` (3 satır)
  - `packages/document-templates/src/templates/harcama-pusulasi/HarcamaPusulasi.template.tsx:27` (11 satır)
  - `packages/document-templates/src/templates/luzum-muzekkeresi-teslim-tesellum/LuzumMuzekkeresiTeslimTesellum.template.tsx:22` (16 satır)
  - `packages/document-templates/src/utils/textHelpers.ts:145` (31 satır)

### `POST` (9 dosya, Benzerlik: %88)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-web/src/app/api/db/query/route.ts:4` (40 satır)
  - `apps/app-web/src/app/api/dosyalar/route.ts:69` (89 satır)
  - `apps/app-web/src/app/api/firmalar/route.ts:30` (42 satır)
  - `apps/app-web/src/app/api/gdrive/route.ts:28` (42 satır)
  - `apps/app-web/src/app/api/kalemler/route.ts:27` (47 satır)
  - `apps/app-web/src/app/api/keys/route.ts:51` (35 satır)
  - `apps/app-web/src/app/api/presets/route.ts:3` (22 satır)
  - `apps/app-web/src/app/api/socket/events/route.ts:44` (13 satır)
  - `apps/app-web/src/app/api/sync/route.ts:64` (95 satır)

### `handleCopy` (7 dosya, Benzerlik: %91)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/modals/SayiyiYaziyaCevirModal.tsx:79` (36 satır)
  - `apps/app-desktop/src/renderer/src/screens/araclar/components/SayiyiYaziyaCevirTab.tsx:45` (10 satır)
  - `apps/app-desktop/src/renderer/src/screens/butcekod/index.screen.tsx:30` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/kurum/components/KurumViewCard.tsx:57` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/playground/index.screen.tsx:14` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/profil/components/PasswordHistoryCard.tsx:35` (6 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/mevzuat/tabs/ButceKodlariTab.tsx:15` (5 satır)

### `handleKeyDown` (7 dosya, Benzerlik: %91)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/FindInPage.tsx:91` (15 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/useHeader.ts:94` (6 satır)
  - `apps/app-desktop/src/renderer/src/components/splash/SplashScreen.tsx:141` (5 satır)
  - `apps/app-desktop/src/renderer/src/components/ui/PersonelCombobox.tsx:75` (6 satır)
  - `apps/app-desktop/src/renderer/src/components/ui/TagInput.tsx:60` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/components/DocumentPreviewModalV3/components/DocumentPreviewTabBar.tsx:101` (6 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/components/tabs/PdfTab.tsx:42` (5 satır)

### `handleToggleSelectAll` (7 dosya, Benzerlik: %98)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** useCallback/Hook içinde: Component closure (state/props) bağımlılıkları incelenmeli. Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/ui/DetsisSubUnitsModal.tsx:116` (7 satır)
  - `apps/app-desktop/src/renderer/src/hooks/useSetSelection.ts:29` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/components/KatalogSenkronizasyonModal.tsx:63` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/components/malzeme-tablosu/useMalzemeTablosuActions.ts:49` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/KabulVeOdeme/KabulTutanaklariListCard.tsx:67` (7 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/tabs/IhtiyacListesiTab.tsx:104` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/malzemeler/useMalzemelerScreenLogic.ts:79` (7 satır)

### `handleAdd` (6 dosya, Benzerlik: %87)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/ui/TagInput.tsx:39` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyon-gorevleri/index.screen.tsx:95` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/kurum/components/KurumMetadataManager.tsx:38` (11 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/mevzuat/components/KikLimitleriSection.tsx:38` (76 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/mevzuat/tabs/components/CodeListEditor.tsx:42` (12 satır)
  - `apps/app-desktop/src/renderer/src/screens/tasinirkod/index.screen.tsx:24` (33 satır)

### `handleImport` (5 dosya, Benzerlik: %81)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/ui/DetsisSubUnitsModal.tsx:134` (14 satır)
  - `apps/app-desktop/src/renderer/src/components/ui/ExcelActions.tsx:73` (25 satır)
  - `apps/app-desktop/src/renderer/src/screens/ayarlar/theme/useTemaScreen.ts:232` (16 satır)
  - `apps/app-desktop/src/renderer/src/screens/belgelerim/components/PaketIceAktarModal.tsx:54` (56 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/import/components/useImportScreenLogic.ts:115` (37 satır)

### `handleExportCSV` (4 dosya, Benzerlik: %84)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/ButceOdenekView.tsx:67` (35 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/DokumanlarView.tsx:64` (13 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/KayitFormuView.tsx:20` (34 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/MalzemeHarcamaView.tsx:128` (16 satır)

### `PUT` (4 dosya, Benzerlik: %97)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-web/src/app/api/dosyalar/[id]/route.ts:51` (94 satır)
  - `apps/app-web/src/app/api/firmalar/[id]/route.ts:7` (44 satır)
  - `apps/app-web/src/app/api/kalemler/[id]/route.ts:7` (55 satır)
  - `apps/app-web/src/app/api/kurum/route.ts:32` (49 satır)

### `queryExecutor` (4 dosya, Benzerlik: %89)
- **Önerilen Hedef Modül:** `packages/document-templates/src/utils/ veya packages/domain/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/hooks/useTemplateData.ts:42` (10 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/components/DocumentPreviewModalV3/hooks/helpers/previewDataLoader.ts:26` (8 satır)
  - `apps/app-desktop/src/renderer/src/services/documentPreloadService.ts:104` (9 satır)
  - `packages/document-templates/src/resolver/mappingResolver.ts:22` (7 satır)

### `getDb` (3 dosya, Benzerlik: %84)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/main/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/main/database/workspace/DtmWorkspace.ts:313` (4 satır)
  - `apps/app-desktop/src/main/database/workspace/workspaceManager.ts:67` (4 satır)
  - `apps/app-desktop/src/main/ipc/kutuphane.ipc.ts:10` (1 satır)

### `handleCreate` (3 dosya, Benzerlik: %93)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/ui/ProjectInlineSection.tsx:42` (37 satır)
  - `apps/app-desktop/src/renderer/src/components/ui/ProjectSelectModal.tsx:58` (39 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/index.screen.tsx:18` (5 satır)

### `handleFileUpload` (3 dosya, Benzerlik: %89)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/belgelerim/components/PaketIceAktarModal.tsx:24` (12 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/components/toplu/useTopluPozlar.ts:119` (76 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/import/components/useImportScreenLogic.ts:77` (14 satır)

### `handleModeEvent` (3 dosya, Benzerlik: %97)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/header/hooks/useProcurementMode.ts:41` (4 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/Sidebar.tsx:67` (8 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/temin-selector/useTeminSelector.ts:84` (6 satır)

### `handleQuickAdd` (3 dosya, Benzerlik: %82)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/detay.screen.tsx:50` (23 satır)
  - `apps/app-desktop/src/renderer/src/screens/notlar/components/DosyaNotlariWidget.tsx:32` (18 satır)
  - `apps/app-desktop/src/renderer/src/screens/notlar/useNotlarScreenLogic.ts:136` (28 satır)

### `handleSelectTemplate` (3 dosya, Benzerlik: %96)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** useCallback/Hook içinde: Component closure (state/props) bağımlılıkları incelenmeli. Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/devlet-ihale-2886/components/studyo/useBelgeVeSablonStudyo.ts:100` (7 satır)
  - `apps/app-desktop/src/renderer/src/screens/ebys/hooks/useEbysStudio.ts:25` (7 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/surec-akisi/hooks/useDTEbysStudio.ts:145` (7 satır)

### `handleUpdate` (3 dosya, Benzerlik: %91)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/islak-imza/components/signer-list.tsx:26` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/kurum/components/KurumMetadataManager.tsx:62` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/mevzuat/tabs/YiUfeEndeksTab.tsx:79` (4 satır)

### `toggleSelect` (3 dosya, Benzerlik: %84)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/components/TekTikYazdirModal.tsx:166` (12 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/hooks/useCiktiMerkeziScreen.ts:287` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/DokumanlarView.tsx:37` (5 satır)

### `closeTab` (2 dosya, Benzerlik: %88)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/store/globalDocumentPreviewStore.ts:136` (37 satır)
  - `apps/app-desktop/src/renderer/src/store/tabStore.ts:265` (27 satır)

### `FiyatFarkiTab` (2 dosya, Benzerlik: %82)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/araclar/components/FiyatFarkiTab.tsx:6` (238 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/mevzuat/tabs/FiyatFarkiTab.tsx:12` (610 satır)

### `formatTR` (2 dosya, Benzerlik: %92)
- **Önerilen Hedef Modül:** `packages/document-templates/src/utils/ veya packages/domain/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/hooks/usePiyasaFiyatArastirmasi/usePiyasaFiyatDocuments.ts:131` (4 satır)
  - `packages/document-templates/src/resolver/helpers/resolveTableArray.ts:61` (6 satır)

### `getDerivedStateFromError` (2 dosya, Benzerlik: %89)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/ui/ModalErrorBoundary.tsx:24` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/components/DocumentPreviewModalV3/TemplateErrorBoundary.tsx:12` (3 satır)

### `getStatusBadgeClass` (2 dosya, Benzerlik: %81)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/ActiveFileSidebar.tsx:27` (30 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/utils/statusUtils.ts:29` (21 satır)

### `GithubIcon` (2 dosya, Benzerlik: %89)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/pozlar/components/toplu/TopluPozlarHeader.tsx:21` (9 satır)
  - `apps/app-landing/src/app/page.tsx:38` (16 satır)

### `handleCreateNewFile` (2 dosya, Benzerlik: %91)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/FileSelector.tsx:62` (19 satır)
  - `apps/app-desktop/src/renderer/src/screens/launcher/useLauncherLogic.ts:48` (15 satır)

### `handleGlobalChange` (2 dosya, Benzerlik: %87)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/ui/BelgeAksiyonlari.tsx:91` (6 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/taslak-yoneticisi/taslak-yoneticisi.screen.tsx:83` (8 satır)

### `handleOpenFile` (2 dosya, Benzerlik: %93)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/FileSelector.tsx:82` (25 satır)
  - `apps/app-desktop/src/renderer/src/screens/launcher/useLauncherLogic.ts:121` (31 satır)

### `handleRemove` (2 dosya, Benzerlik: %94)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/ui/TagInput.tsx:69` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/mevzuat/tabs/components/CodeListEditor.tsx:66` (3 satır)

### `handleRemoveFirm` (2 dosya, Benzerlik: %84)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/components/istekli-firmalar/useIstekliFirmalarLogic.ts:89` (18 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/hooks/usePiyasaFiyatArastirmasi/usePiyasaFiyatData.ts:340` (28 satır)

### `isMemberVisibleInDocument` (2 dosya, Benzerlik: %90)
- **Önerilen Hedef Modül:** `packages/document-templates/src/utils/ veya packages/domain/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `packages/document-templates/src/constants/visibility.config.ts:137` (3 satır)
  - `packages/document-templates/src/services/templateRegistryService.ts:163` (3 satır)

### `toggleStar` (2 dosya, Benzerlik: %86)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. Farklı modüller (dosya süreci vs sistem ekranı) arasında paylaşımlı utils gerektirir. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/useDosyaAsamasiSablons.ts:471` (23 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/taslak-yoneticisi/taslak-yoneticisi.screen.tsx:228` (18 satır)

### `toggleTheme` (2 dosya, Benzerlik: %80)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-web/src/app/page.tsx:261` (6 satır)
  - `apps/app-landing/src/app/page.tsx:173` (10 satır)

---

## 🔴 Grup D: Sadece İsim Aynı Olan Fonksiyonlar (105 adet)
Bu fonksiyonlar yalnızca adaştır (örneğin UI handler adları: `handleKaydet`, `handleUpdate`, `handleBack`, `calculateTotal`). Gövdeleri ve sorumlulukları tamamen farklıdır. **ASLA BİRLEŞTİRİLMEMELİDİR.**

| Fonksiyon Adı | Dosya Sayısı | Açıklama |
| :--- | :--- | :--- |
| `handleClose` | 7 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %79) |
| `handleEdit` | 5 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %68) |
| `get` | 4 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %62) |
| `handleConfirm` | 4 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %62) |
| `handleSelectAll` | 4 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %74) |
| `testConnection` | 4 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %69) |
| `formatTL` | 3 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %70) |
| `handleAction` | 3 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %29) |
| `handleAddRow` | 3 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %58) |
| `handleBulkDelete` | 3 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %75) |
| `handleDeletePreset` | 3 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %47) |
| `handleSaveToDosya` | 3 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %41) |
| `loadSettings` | 3 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %55) |
| `openEditModal` | 3 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %63) |
| `applyRolePolicy` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %6) |
| `BirimModal` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %71) |
| `cleanup` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %43) |
| `close` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %64) |
| `closeWorkspace` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %64) |
| `componentDidCatch` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %23) |
| `convertToTemin` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %37) |
| `copyToClipboard` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %37) |
| `create` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %57) |
| `createWorkspace` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %54) |
| `fetchAsamalar` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %80) |
| `fetchData` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %65) |
| `fetchDosyalar` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %79) |
| `fetchKalemler` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %34) |
| `findFile` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %73) |
| `formatNumber` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %75) |
| `generateMetadata` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %79) |
| `getCurrentFilePath` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %48) |
| `getDbPath` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %75) |
| `getDirtySummary` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %35) |
| `getDocumentStatus` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %49) |
| `getEstimatedCostTotal` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %44) |
| `getMeta` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %48) |
| `handle` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %68) |
| `handleAddPreset` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %16) |
| `handleApply` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %69) |
| `handleApplyDetsisData` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %77) |
| `handleBack` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %54) |
| `handleClick` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %60) |
| `handleCopyJson` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %62) |
| `handleDeleteBirim` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %33) |
| `handleDeleteConfirm` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %47) |
| `handleDeleteItem` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %35) |
| `handleDeleteRow` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %61) |
| `handleDownloadTemplate` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %72) |
| `handleExportDocx` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %42) |
| `handleExportJson` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %75) |
| `handleGenerate` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %17) |
| `handleInputChange` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %51) |
| `handleInstitutionTypeChange` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %80) |
| `handleKaydet` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %77) |
| `handleMappingChange` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %61) |
| `handleModeChange` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %30) |
| `handleMouseMove` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %66) |
| `handleMouseUp` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %15) |
| `handleMoveDown` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %43) |
| `handleMoveUp` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %43) |
| `handleOpenDoc` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %45) |
| `handleOpenEdit` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %77) |
| `handleOpenSablonByDosyaAdi` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %48) |
| `handlePriceChange` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %18) |
| `handleRemoveRow` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %38) |
| `handleResetVariables` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %70) |
| `handleResize` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %45) |
| `handleRestore` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %22) |
| `handleSaveRevision` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %55) |
| `handleSaveToDb` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %76) |
| `handleSelect` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %76) |
| `handleSelectPreset` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %38) |
| `handleTabChange` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %56) |
| `handleToggleBelgedeGoster` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %74) |
| `handleToggleExpand` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %62) |
| `handleToggleSelect` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %73) |
| `handleUpdateStatus` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %73) |
| `hasChanges` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %25) |
| `Home` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %62) |
| `InspectorHeader` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %41) |
| `isOpen` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %70) |
| `listWorkspaces` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %75) |
| `markSynced` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %41) |
| `onError` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %69) |
| `openAddModal` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %40) |
| `openWorkspace` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %28) |
| `parse` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %46) |
| `parseStatusAndName` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %80) |
| `purgeExpired` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %50) |
| `pushWorkspace` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %79) |
| `readRecentLogs` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %19) |
| `recordMutation` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %20) |
| `replaceDatabase` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %60) |
| `resetDirty` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %34) |
| `resolveRoleVisibility` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %11) |
| `sanitizeHtml` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %30) |
| `saveAs` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %67) |
| `saveWorkspace` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %34) |
| `SubScreen` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %51) |
| `toggleGroup` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %37) |
| `toLocativeSuffix` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %11) |
| `toPossessiveSuffix` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %12) |
| `validate` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %26) |
| `YaklasikMaliyetCetveli` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %45) |

---

## 🕵️ Gizli Kopyalar: Farklı İsimli Ama Gövdesi Aynı Olan Fonksiyonlar (17 grup)
Farklı isimlerle tanımlanmış ancak 5+ satırlık mantığı birebir veya yapısal olarak tamamen aynı olan fonksiyonlardır.

### 1. Birebir Gizli Kopyalar (1 grup)

#### Fonksiyonlar: `forceQuit, handleClose` (Hash: `39eee8d9`)
- `forceQuit` -> `apps/app-desktop/src/renderer/src/hooks/useWindowControls.ts:21` (5 satır)
- `handleClose` -> `apps/app-desktop/src/renderer/src/screens/launcher/useLauncherLogic.ts:244` (5 satır)

### 2. Yapısal Gizli Kopyalar (16 grup)

#### Fonksiyonlar: `disconnectFromServer, close, stopExpressServer` (Yapısal Hash: `5bcbfc74`)
- `disconnectFromServer` -> `apps/app-desktop/src/main/client.ts:55` (6 satır)
- `close` -> `apps/app-desktop/src/main/database/workspace/workspaceManager.ts:58` (6 satır)
- `stopExpressServer` -> `apps/app-desktop/src/main/network/expressServer.ts:156` (6 satır)

#### Fonksiyonlar: `handlePresetsChange, handleGlobalChange` (Yapısal Hash: `d7287d96`)
- `handlePresetsChange` -> `apps/app-desktop/src/renderer/src/components/layout/ActiveFileSidebar.tsx:88` (8 satır)
- `handlePresetsChange` -> `apps/app-desktop/src/renderer/src/screens/dosya/components/PrintDropdownButton.tsx:70` (8 satır)
- `handlePresetsChange` -> `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/hooks/usePiyasaFiyatArastirmasi/usePiyasaFiyatPresets.ts:24` (8 satır)
- `handlePresetsChange` -> `apps/app-desktop/src/renderer/src/screens/system/taslak-yoneticisi/taslak-yoneticisi.screen.tsx:75` (8 satır)
- `handleGlobalChange` -> `apps/app-desktop/src/renderer/src/screens/system/taslak-yoneticisi/taslak-yoneticisi.screen.tsx:83` (8 satır)

#### Fonksiyonlar: `toggleExpanded, handleToggleSelect, handleToggleExpand, handleToggleSelectOne` (Yapısal Hash: `b8b8ed9d`)
- `toggleExpanded` -> `apps/app-desktop/src/renderer/src/components/layout/Sidebar.tsx:93` (8 satır)
- `handleToggleSelect` -> `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/components/KatalogSenkronizasyonModal.tsx:54` (8 satır)
- `handleToggleExpand` -> `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/components/KatalogSenkronizasyonModal.tsx:73` (8 satır)
- `handleToggleSelectOne` -> `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/KabulVeOdeme/KabulTutanaklariListCard.tsx:75` (8 satır)

#### Fonksiyonlar: `toggleAction, toggleGroup, toggleDoc, handleSablonToggle, toggleSelect` (Yapısal Hash: `8d8774d7`)
- `toggleAction` -> `apps/app-desktop/src/renderer/src/components/layout/WorkspaceCloseModal.tsx:152` (5 satır)
- `toggleGroup` -> `apps/app-desktop/src/renderer/src/screens/dosyalar/components/useDosyalarScreenLogic.ts:37` (5 satır)
- `toggleDoc` -> `apps/app-desktop/src/renderer/src/screens/komisyonlar/components/hizli-kadro/HizliKadroBelgeSecimModal.tsx:66` (5 satır)
- `handleSablonToggle` -> `apps/app-desktop/src/renderer/src/screens/komisyonlar/components/komisyon-olustur/useKomisyonOlustur.ts:222` (5 satır)
- `toggleSelect` -> `apps/app-desktop/src/renderer/src/screens/raporlar/components/DokumanlarView.tsx:37` (5 satır)

#### Fonksiyonlar: `handleToggleOne, toggleCategory` (Yapısal Hash: `4c8c9b45`)
- `handleToggleOne` -> `apps/app-desktop/src/renderer/src/components/ui/DetsisSubUnitsModal.tsx:124` (9 satır)
- `toggleCategory` -> `apps/app-desktop/src/renderer/src/screens/dosya/hooks/useCiktiMerkeziScreen.ts:197` (9 satır)

#### Fonksiyonlar: `formatMoney, formatCurrency` (Yapısal Hash: `fd1e0c01`)
- `formatMoney` -> `apps/app-desktop/src/renderer/src/components/ui/YiUfePriceBadge.tsx:45` (7 satır)
- `formatCurrency` -> `apps/app-desktop/src/renderer/src/screens/dashboard/HarcamaMerkeziScreen.tsx:18` (7 satır)

#### Fonksiyonlar: `handleToggleSelectRow, toggleSelectRow` (Yapısal Hash: `f65b274e`)
- `handleToggleSelectRow` -> `apps/app-desktop/src/renderer/src/hooks/useSetSelection.ts:17` (11 satır)
- `toggleSelectRow` -> `apps/app-desktop/src/renderer/src/screens/system/hizli-dosya-ekle/components/useHizliDosyaEkle.ts:270` (11 satır)

#### Fonksiyonlar: `fetchAmbarlar, fetchPozlar` (Yapısal Hash: `2e6cff94`)
- `fetchAmbarlar` -> `apps/app-desktop/src/renderer/src/screens/ambar/ambar.hooks.ts:132` (8 satır)
- `fetchPozlar` -> `apps/app-desktop/src/renderer/src/screens/pozlar/pozlar.hooks.ts:38` (8 satır)

#### Fonksiyonlar: `getHareketColor, getInstitutionTypeLabel` (Yapısal Hash: `c586e0b9`)
- `getHareketColor` -> `apps/app-desktop/src/renderer/src/screens/ambar/components/StokHareketModal.tsx:131` (16 satır)
- `getInstitutionTypeLabel` -> `apps/app-desktop/src/renderer/src/screens/dashboard/components/dashboardV2.helpers.ts:5` (16 satır)

#### Fonksiyonlar: `copyText, copyPromptToClipboard, handleCopyTutanak` (Yapısal Hash: `d54fb0a1`)
- `copyText` -> `apps/app-desktop/src/renderer/src/screens/araclar/components/VergiVeKesintiTab.tsx:14` (5 satır)
- `copyPromptToClipboard` -> `apps/app-desktop/src/renderer/src/screens/ayarlar/theme/useTemaScreen.ts:165` (5 satır)
- `handleCopyTutanak` -> `apps/app-desktop/src/renderer/src/screens/devlet-ihale-2886/components/muhammen-bedel/KiymetTakdirTutanakModal.tsx:62` (5 satır)

#### Fonksiyonlar: `handlePlaygroundVarChange, handleVariableChange` (Yapısal Hash: `ff4735f5`)
- `handlePlaygroundVarChange` -> `apps/app-desktop/src/renderer/src/screens/ayarlar/theme/useTemaScreen.ts:63` (6 satır)
- `handleVariableChange` -> `apps/app-desktop/src/renderer/src/screens/ebys/hooks/useEbysStudio.ts:33` (6 satır)
- `handleVariableChange` -> `apps/app-desktop/src/renderer/src/screens/system/surec-akisi/hooks/useDTEbysStudio.ts:156` (6 satır)

#### Fonksiyonlar: `fetchBirimler, fetchPersonelList, fetchKurumsalKodlar, fetchAsamalar, fetchFirmalar, queryFn, fetchKalemler, fetchOkasKodlar, fetchRoller, fetchTasinirKodlar` (Yapısal Hash: `80beca65`)
- `fetchBirimler` -> `apps/app-desktop/src/renderer/src/screens/birimler/birimler.hooks.ts:26` (8 satır)
- `fetchPersonelList` -> `apps/app-desktop/src/renderer/src/screens/birimler/birimler.hooks.ts:35` (8 satır)
- `fetchKurumsalKodlar` -> `apps/app-desktop/src/renderer/src/screens/birimler/birimler.hooks.ts:54` (8 satır)
- `fetchAsamalar` -> `apps/app-desktop/src/renderer/src/screens/dashboard/components/useDashboardV2Logic.ts:153` (8 satır)
- `fetchFirmalar` -> `apps/app-desktop/src/renderer/src/screens/firmalar/firmalar.hooks.ts:47` (8 satır)
- `queryFn` -> `apps/app-desktop/src/renderer/src/screens/komisyon-gorevleri/index.screen.tsx:22` (14 satır)
- `fetchKalemler` -> `apps/app-desktop/src/renderer/src/screens/malzemeler/malzemeler.hooks.ts:35` (8 satır)
- `fetchOkasKodlar` -> `apps/app-desktop/src/renderer/src/screens/okaskod/okaskod.hooks.ts:12` (8 satır)
- `queryFn` -> `apps/app-desktop/src/renderer/src/screens/olcubirimleri/olcubirimleri.hooks.ts:50` (8 satır)
- `queryFn` -> `apps/app-desktop/src/renderer/src/screens/olcubirimleri/olcubirimleri.hooks.ts:178` (14 satır)
- `fetchRoller` -> `apps/app-desktop/src/renderer/src/screens/personel/personel.hooks.ts:94` (8 satır)
- `queryFn` -> `apps/app-desktop/src/renderer/src/screens/system/mevzuat/kik-limitleri.hooks.ts:42` (8 satır)
- `fetchTasinirKodlar` -> `apps/app-desktop/src/renderer/src/screens/tasinirkod/tasinirkod.hooks.ts:15` (8 satır)

#### Fonksiyonlar: `get2886UsulText, getFormatBadge, kapanisIbaresi` (Yapısal Hash: `e3b9e32b`)
- `get2886UsulText` -> `apps/app-desktop/src/renderer/src/screens/dashboard/components/ActiveDosyaCard.tsx:52` (12 satır)
- `getFormatBadge` -> `apps/app-desktop/src/renderer/src/screens/raporlar/components/DokumanlarView.tsx:78` (12 satır)
- `kapanisIbaresi` -> `apps/app-desktop/src/renderer/src/screens/system/surec-akisi/documentSettingsUtils.ts:16` (12 satır)

#### Fonksiyonlar: `handleModeChange, handleMode` (Yapısal Hash: `1a300525`)
- `handleModeChange` -> `apps/app-desktop/src/renderer/src/screens/dashboard/components/useDashboardV2Logic.ts:77` (5 satır)
- `handleMode` -> `apps/app-desktop/src/renderer/src/screens/firmalar/index.screen.tsx:118` (5 satır)
- `handleMode` -> `apps/app-desktop/src/renderer/src/screens/komisyonlar/useKomisyonlarScreenLogic.tsx:323` (5 satır)

#### Fonksiyonlar: `toggleBelgeler, toggleStage, toggleMadde` (Yapısal Hash: `07b36e80`)
- `toggleBelgeler` -> `apps/app-desktop/src/renderer/src/screens/komisyonlar/useKomisyonlarScreenLogic.tsx:60` (6 satır)
- `toggleStage` -> `apps/app-desktop/src/renderer/src/screens/sablonlar/components/PlaceholderYonetimi.tsx:21` (6 satır)
- `toggleMadde` -> `apps/app-desktop/src/renderer/src/screens/system/mevzuat/tabs/MevzuatKutuphanesiTab.tsx:84` (6 satır)

#### Fonksiyonlar: `toggleTask, removeFromQueue, toggleReadyToPrint, updateStatus, invalidateReadyStatus, markAsPrinted, lockDocument, unlockDocument` (Yapısal Hash: `614d9094`)
- `toggleTask` -> `apps/app-desktop/src/renderer/src/screens/system/surec-akisi/hooks/useSurecAkisi.ts:327` (10 satır)
- `removeFromQueue` -> `apps/app-desktop/src/renderer/src/store/printQueueStore.ts:89` (7 satır)
- `toggleReadyToPrint` -> `apps/app-desktop/src/renderer/src/store/printQueueStore.ts:97` (36 satır)
- `updateStatus` -> `apps/app-desktop/src/renderer/src/store/printQueueStore.ts:134` (16 satır)
- `invalidateReadyStatus` -> `apps/app-desktop/src/renderer/src/store/printQueueStore.ts:151` (16 satır)
- `markAsPrinted` -> `apps/app-desktop/src/renderer/src/store/printQueueStore.ts:168` (41 satır)
- `lockDocument` -> `apps/app-desktop/src/renderer/src/store/printQueueStore.ts:210` (18 satır)
- `unlockDocument` -> `apps/app-desktop/src/renderer/src/store/printQueueStore.ts:229` (16 satır)
