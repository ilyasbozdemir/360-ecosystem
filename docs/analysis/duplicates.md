# TEMİN 360 - Mükerrer Fonksiyon ve Gövde Analiz Raporu

> Bu rapor AST tabanlı TypeScript Compiler API ayrıştırması, gövde hash kontrolü, yapısal normalizasyon ve token benzerlik analizi ile oluşturulmuştur.

## 📊 Genel İstatistikler
- **Taranan Kaynak Dosya Sayısı:** 1086
- **Çıkarılan Fonksiyon Sayısı:** 2866
- **Adaş Fonksiyon Grubu (Birden fazla dosyada tanımlı):** 178
- **A: Birebir Aynı Gövdeler:** 26 adet
- **B: Yapısal Olarak Aynı Gövdeler:** 12 adet
- **C: Yüksek Benzerlik Gösterenler (>= %80):** 41 adet
- **D: Sadece İsim Aynı (Farklı Gövde):** 99 adet
- **Gizli Kopyalar (Farklı İsim, Birebir/Yapısal Aynı):** 15 grup (1 birebir, 14 yapısal)

---

## 🟢 Grup A: Birebir Aynı Fonksiyonlar (26 adet)
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
  - `apps/app-desktop/src/renderer/src/screens/pozlar/pozlar.hooks.ts:57` (38 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/pozlar.hooks.ts:103` (52 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/pozlar.hooks.ts:163` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/pozlar.hooks.ts:179` (46 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:138` (77 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:224` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:242` (16 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:267` (17 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:294` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:313` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/kik-limitleri.hooks.ts:60` (56 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/kik-limitleri.hooks.ts:123` (9 satır)
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
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/MalzemeTablosu.tsx:364` (24 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/components/DosyaHizliIcerikPopover.tsx:86` (12 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/components/DosyaHizliIcerikPopover.tsx:104` (29 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/components/DosyaHizliIcerikPopover.tsx:139` (43 satır)
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
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/index.screen.tsx:112` (159 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/index.screen.tsx:276` (52 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/index.screen.tsx:334` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/olcubirimleri/olcubirimleri.hooks.ts:50` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/olcubirimleri/olcubirimleri.hooks.ts:178` (14 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/personel.hooks.ts:375` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:33` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:47` (10 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:64` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:78` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:92` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:108` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/components/takip/useTakip.ts:178` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/components/takip/useTakip.ts:193` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/components/takip/useTakip.ts:206` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/components/takip/useTakip.ts:220` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/components/takip/useTakip.ts:235` (12 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/components/takip/useTakip.ts:253` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/kik-limitleri.hooks.ts:42` (8 satır)

### `formatMoney` (12 farklı dosya)
- **Önerilen Hedef Modül:** `packages/document-templates/src/utils/ veya packages/domain/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/temin-selector/teminSelector.utils.ts:4` (6 satır)
  - `apps/app-desktop/src/renderer/src/components/ui/YiUfePriceBadge.tsx:44` (7 satır)
  - `apps/app-desktop/src/renderer/src/screens/devlet-ihale-2886/components/DosyaYonetimi2886Tab.tsx:289` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/devlet-ihale-2886/components/IhaleGunuVeTekliflerTab.tsx:10` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/devlet-ihale-2886/components/KiraVeTahsilatTakipTab.tsx:23` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/devlet-ihale-2886/components/MuhammenBedelVeTakdirTab.tsx:204` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/index.screen.tsx:389` (7 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/components/DosyaHizliIcerikPopover.tsx:195` (7 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/components/inspector/types.ts:25` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/index.screen.tsx:343` (1 satır)
  - `apps/app-web/src/app/dosyalar/page.tsx:174` (8 satır)
  - `packages/document-templates/src/utils/textHelpers.ts:113` (45 satır)

### `fmt` (8 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/KabulVeOdeme/useKabulVeOdemeData.ts:341` (6 satır)
  - `apps/app-desktop/src/renderer/src/screens/kurum/components/ButceOdenekTanimTab.tsx:57` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/AylikOzetView.tsx:21` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/ButceOdenekView.tsx:6` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/ButceView.tsx:7` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/KayitFormuView.tsx:6` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/MalzemeHarcamaView.tsx:5` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/YillikOzetView.tsx:6` (1 satır)

### `showToast` (7 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** useCallback/Hook içinde: Component closure (state/props) bağımlılıkları incelenmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/hooks/useCiktiMerkeziScreen.ts:70` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/HizliTopluKalemGrid.tsx:298` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/kurum/components/LogolarTab.tsx:199` (6 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/toplu.screen.tsx:164` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/yeni.screen.tsx:347` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/profil/index.screen.tsx:128` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/components/FormBuilderV2Playground.tsx:81` (6 satır)

### `handleClear` (6 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/FiyatIstenenFirmalari/FirmaMektupMenu.tsx:57` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/FiyatIstenenFirmalari/RowMenu.tsx:69` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/KabulVeOdeme/tutanaklar/HeaderDigerActionsMenu.tsx:59` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/KabulVeOdeme/tutanaklar/TutanakRowActionsMenu.tsx:81` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/components/manage/DosyaManageHeader.tsx:59` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/index.screen.tsx:60` (3 satır)

### `handlePresetsChange` (5 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Farklı modüller (dosya süreci vs sistem ekranı) arasında paylaşımlı utils gerektirir. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/ActiveFileSidebar.tsx:88` (8 satır)
  - `apps/app-desktop/src/renderer/src/components/ui/BelgeAksiyonlari.tsx:85` (6 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/components/PrintDropdownButton.tsx:70` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/hooks/usePiyasaFiyatArastirmasi/usePiyasaFiyatPresets.ts:23` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/TaslakYoneticisi.tsx:90` (8 satır)

### `handler` (5 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/FiyatIstenenFirmalari/FirmaMektupMenu.tsx:46` (11 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/FiyatIstenenFirmalari/RowMenu.tsx:58` (11 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/KabulVeOdeme/tutanaklar/HeaderDigerActionsMenu.tsx:48` (11 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/KabulVeOdeme/tutanaklar/TutanakRowActionsMenu.tsx:70` (11 satır)
  - `apps/app-desktop/src/renderer/src/utils/appEvents.ts:194` (15 satır)

### `onClick` (5 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:8` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:13` (4 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:20` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:24` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:28` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:33` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:37` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:41` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:45` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:49` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:58` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:62` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:66` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:70` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:74` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:83` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:87` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:91` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDevletIhale.ts:96` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:11` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:15` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:19` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:23` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:27` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:31` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:35` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:46` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:50` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:54` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:58` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:62` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:66` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:75` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:79` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:83` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:87` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:91` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:102` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:106` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:111` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavDogrudanTemin.ts:116` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:40` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:43` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:47` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:52` (15 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:72` (16 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:91` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:95` (25 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:143` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:147` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:152` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:154` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:157` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:161` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:165` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:167` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:168` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:171` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:175` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:178` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:181` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:186` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:191` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:195` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavigation.ts:197` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:8` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:12` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:16` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:18` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:20` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:21` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:31` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:35` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:39` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:43` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:47` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:54` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:57` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:59` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:69` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:73` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:77` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavIhale.ts:79` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:14` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:18` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:22` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:26` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:30` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:34` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:39` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:43` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:47` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:51` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:55` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:60` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:72` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:76` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:80` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:84` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:88` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:93` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:97` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:101` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:106` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:117` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:121` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:125` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:129` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:133` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:137` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:142` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:146` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:150` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:155` (1 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/headerNavSistemTanimlari.ts:160` (1 satır)

### `handleChange` (4 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/ambar/index.screen.tsx:116` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/birimler/index.screen.tsx:153` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/firmalar/index.screen.tsx:76` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/kurum/index.screen.tsx:180` (3 satır)

### `handleUpgradeAndOpen` (4 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** useCallback/Hook içinde: Component closure (state/props) bağımlılıkları incelenmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/FileSelector.tsx:53` (8 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/useHeader.ts:76` (8 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/hooks/useWorkspaceLifecycle.ts:26` (10 satır)
  - `apps/app-desktop/src/renderer/src/screens/launcher/index.screen.tsx:134` (8 satır)

### `generateDefaultProjectCode` (3 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/ui/ProjectInlineSection.tsx:22` (3 satır)
  - `apps/app-desktop/src/renderer/src/components/ui/ProjectSelectModal.tsx:26` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/projeler/index.screen.tsx:60` (3 satır)

### `getSetting` (3 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/main/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/main/ai/index.ts:19` (11 satır)
  - `apps/app-desktop/src/main/ipc/db/dbAuthHandlers.ts:287` (10 satır)
  - `apps/app-desktop/src/main/ipc/db/dbSettingsHandlers.ts:137` (10 satır)

### `calculateTableTotal` (2 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/components/builder/inspector/InspectorTableManager.tsx:18` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/components/builder/utils.ts:29` (8 satır)

### `generateBarcode` (2 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/malzemeler/yeni.screen.tsx:74` (1 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/pozlar.hooks.ts:37` (1 satır)

### `getCleanName` (2 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/components/PrintDropdownButton.tsx:120` (6 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/hooks/usePiyasaFiyatArastirmasi/usePiyasaFiyatPresets.ts:42` (6 satır)

### `getSmtpSetting` (2 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/main/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/main/ipc/workspace.ipc.ts:1194` (10 satır)
  - `apps/app-desktop/src/main/network/autoCloudSync.ts:54` (10 satır)

### `handleCloseWorkspace` (2 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** useCallback/Hook içinde: Component closure (state/props) bağımlılıkları incelenmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/header/useHeader.ts:85` (3 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/Sidebar.tsx:126` (3 satır)

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
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/index.screen.tsx:352` (5 satır)

### `handleReload` (2 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/devlet-ihale-2886/components/BelgeVeSablonStudyoTab.tsx:436` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/devlet-ihale-2886/components/DosyaYonetimi2886Tab.tsx:44` (3 satır)

### `handleUpdateRow` (2 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/HizliTopluKalemGrid.tsx:324` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/toplu.screen.tsx:179` (3 satır)

### `isSablonDisabled` (2 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/ActiveFileSidebar.tsx:171` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/useDosyaAsamasiSablons.ts:496` (3 satır)

### `middleware` (2 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-web/src/middleware.ts:4` (18 satır)
  - `apps/app-landing/src/middleware.ts:4` (18 satır)

### `normalizeTemplateKey` (2 farklı dosya)
- **Önerilen Hedef Modül:** `packages/document-templates/src/utils/ veya packages/domain/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/components/DocumentPreviewModalV2/templateResolver.ts:501` (24 satır)
  - `packages/document-templates/src/constants/template-constants.ts:203` (22 satır)

### `robots` (2 farklı dosya)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-web/src/app/robots.ts:4` (35 satır)
  - `apps/app-landing/src/app/robots.ts:4` (36 satır)

---

## 🟡 Grup B: Yapısal Olarak Aynı Fonksiyonlar (12 adet)
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
  - `apps/app-desktop/src/renderer/src/screens/pozlar/pozlar.hooks.ts:95` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/pozlar.hooks.ts:155` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/pozlar.hooks.ts:172` (4 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/pozlar.hooks.ts:225` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/components/SablonEditor.tsx:274` (28 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:215` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:233` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:258` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:284` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:303` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/sablonlar.hooks.ts:318` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/kik-limitleri.hooks.ts:116` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/kik-limitleri.hooks.ts:132` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/tasinirkod/tasinirkod.hooks.ts:49` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/tasinirkod/tasinirkod.hooks.ts:64` (3 satır)

### `handleDelete` (16 dosya, Yapısal Eşleşme)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Değişken adları ve literaller farklı; ortak parametreli genel fonksiyon yapılmalı. Farklı modüller (dosya süreci vs sistem ekranı) arasında paylaşımlı utils gerektirir. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/butcekod/index.screen.tsx:264` (12 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/FaturaVeIrsaliye.tsx:102` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/ImzaliBelgeler.tsx:73` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/index.screen.tsx:117` (19 satır)
  - `apps/app-desktop/src/renderer/src/screens/firmalar/index.screen.tsx:99` (10 satır)
  - `apps/app-desktop/src/renderer/src/screens/kurum/components/ButceOdenekTanimTab.tsx:40` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/kurum/components/KurumMetadataManager.tsx:66` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/malzemeler/index.screen.tsx:111` (31 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/components/PersonelUnvanGecmisiCard.tsx:112` (10 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/index.screen.tsx:167` (11 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/detay.screen.tsx:83` (11 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/index.screen.tsx:81` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/profil/index.screen.tsx:220` (10 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/DokumanlarView.tsx:57` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/components/takip/useTakip.ts:99` (18 satır)
  - `apps/app-desktop/src/renderer/src/screens/tasinirkod/index.screen.tsx:58` (9 satır)

### `handleClearAll` (5 dosya, Yapısal Eşleşme)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Değişken adları ve literaller farklı; ortak parametreli genel fonksiyon yapılmalı. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/WorkspaceCloseModal.tsx:167` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/HizliTopluKalemGrid.tsx:364` (28 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/SiparisVeSozlesme/Step2SonucOnay.tsx:91` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/components/hizli-kadro/HizliKadroBelgeSecimModal.tsx:76` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/toplu.screen.tsx:191` (5 satır)

### `DELETE` (4 dosya, Yapısal Eşleşme)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Değişken adları ve literaller farklı; ortak parametreli genel fonksiyon yapılmalı. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-web/src/app/api/dosyalar/[id]/route.ts:149` (21 satır)
  - `apps/app-web/src/app/api/firmalar/[id]/route.ts:55` (15 satır)
  - `apps/app-web/src/app/api/gdrive/route.ts:71` (25 satır)
  - `apps/app-web/src/app/api/kalemler/[id]/route.ts:66` (15 satır)

### `updateCoords` (4 dosya, Yapısal Eşleşme)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** useCallback/Hook içinde: Component closure (state/props) bağımlılıkları incelenmeli. Değişken adları ve literaller farklı; ortak parametreli genel fonksiyon yapılmalı. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/FiyatIstenenFirmalari/FirmaMektupMenu.tsx:19` (13 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/FiyatIstenenFirmalari/RowMenu.tsx:31` (13 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/KabulVeOdeme/tutanaklar/HeaderDigerActionsMenu.tsx:21` (13 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/KabulVeOdeme/tutanaklar/TutanakRowActionsMenu.tsx:42` (14 satır)

### `handleClickOutside` (3 dosya, Yapısal Eşleşme)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Değişken adları ve literaller farklı; ortak parametreli genel fonksiyon yapılmalı. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/components/DocumentPreviewModalV2/components/DocumentPreviewTabBar.tsx:43` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/components/DocumentPreviewModalV2/hooks/useDocumentPreviewData.ts:224` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/hooks/usePiyasaFiyatArastirmasi/index.ts:32` (5 satır)

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
  - `apps/app-desktop/src/renderer/src/screens/birimler/index.screen.tsx:231` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/firmalar/index.screen.tsx:72` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/index.screen.tsx:142` (4 satır)

### `getAllTemplates` (2 dosya, Yapısal Eşleşme)
- **Önerilen Hedef Modül:** `packages/document-templates/src/utils/ veya packages/domain/`
- **Risk Notu:** Değişken adları ve literaller farklı; ortak parametreli genel fonksiyon yapılmalı. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/templates/utils/TemplateManager.ts:61` (3 satır)
  - `packages/document-templates/src/services/templateRegistryService.ts:27` (3 satır)

### `getDeviceInfo` (2 dosya, Yapısal Eşleşme)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/main/utils/`
- **Risk Notu:** Değişken adları ve literaller farklı; ortak parametreli genel fonksiyon yapılmalı. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/main/ipc/workspace.ipc.ts:17` (12 satır)
  - `apps/app-desktop/src/main/utils/deviceInfo.ts:4` (12 satır)

### `handleOpenInNewWindow` (2 dosya, Yapısal Eşleşme)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Değişken adları ve literaller farklı; ortak parametreli genel fonksiyon yapılmalı. Farklı modüller (dosya süreci vs sistem ekranı) arasında paylaşımlı utils gerektirir. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/index.screen.tsx:107` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/components/takip/useTakip.ts:89` (9 satır)

### `RootLayout` (2 dosya, Yapısal Eşleşme)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Değişken adları ve literaller farklı; ortak parametreli genel fonksiyon yapılmalı. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-web/src/app/layout.tsx:66` (15 satır)
  - `apps/app-landing/src/app/layout.tsx:96` (15 satır)

---

## 🟠 Grup C: Yüksek Benzerlik Gösteren Fonksiyonlar (>= %80) (41 adet)
Bu fonksiyonların gövdeleri token düzeyinde %80 ve üzeri benzerdir. Ufak dal/koşul veya parametre farkları içerir.

### `handleSave` (13 dosya, Benzerlik: %90)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. Farklı modüller (dosya süreci vs sistem ekranı) arasında paylaşımlı utils gerektirir. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/ayarlar/TemaScreen.tsx:399` (20 satır)
  - `apps/app-desktop/src/renderer/src/screens/butcekod/index.screen.tsx:217` (45 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/components/komisyon-atama/useKomisyonAtama.ts:283` (219 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/HizliTopluKalemGrid.tsx:628` (61 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/SiparisVeSozlesme/ButceVeOdenekCard.tsx:207` (35 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/yeni.hooks.ts:572` (141 satır)
  - `apps/app-desktop/src/renderer/src/screens/kurum/index.screen.tsx:184` (27 satır)
  - `apps/app-desktop/src/renderer/src/screens/malzemeler/yeni.screen.tsx:272` (61 satır)
  - `apps/app-desktop/src/renderer/src/screens/projeler/index.screen.tsx:175` (29 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/ButceOdenekModal.tsx:81` (41 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/components/SablonEditor.tsx:243` (65 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/HizliDosyaEkle.screen.tsx:207` (98 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/tabs/OranlarTab.tsx:109` (16 satır)

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

### `handleSubmit` (12 dosya, Benzerlik: %91)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/LockScreen.tsx:105` (34 satır)
  - `apps/app-desktop/src/renderer/src/components/ui/TifOlusturModal.tsx:166` (51 satır)
  - `apps/app-desktop/src/renderer/src/screens/ambar/components/StokHareketModal.tsx:81` (49 satır)
  - `apps/app-desktop/src/renderer/src/screens/birimler/index.screen.tsx:157` (23 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/FiyatIstenenFirmalari/YeniFirmaModali.tsx:15` (23 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/KabulVeOdeme/KabulTutanakModal.tsx:234` (24 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/KabulVeOdeme/tutanaklar/KabulHizliEkleModal.tsx:73` (17 satır)
  - `apps/app-desktop/src/renderer/src/screens/firmalar/index.screen.tsx:80` (18 satır)
  - `apps/app-desktop/src/renderer/src/screens/notlar/components/NotModal.tsx:91` (29 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/components/PersonelUnvanGecmisiCard.tsx:71` (40 satır)
  - `apps/app-desktop/src/renderer/src/screens/personel/index.screen.tsx:152` (14 satır)
  - `apps/app-desktop/src/renderer/src/screens/pozlar/yeni.screen.tsx:423` (63 satır)

### `loadData` (10 dosya, Benzerlik: %84)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** useCallback/Hook içinde: Component closure (state/props) bağımlılıkları incelenmeli. Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/CiktiMerkezi.hooks.ts:40` (411 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/components/komisyon-atama/useKomisyonAtama.ts:69` (138 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/useMalzemeListesi.ts:130` (26 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/SiparisVeSozlesme/useSiparisVeSozlesmeData.ts:59` (21 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/hooks/usePiyasaFiyatArastirmasi/usePiyasaFiyatData.ts:29` (139 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/yeni.hooks.ts:196` (91 satır)
  - `apps/app-desktop/src/renderer/src/screens/kurum/components/ButceOdenekTanimTab.tsx:14` (21 satır)
  - `apps/app-desktop/src/renderer/src/screens/profil/index.screen.tsx:107` (18 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/ButceOdenekView.tsx:17` (44 satır)
  - `apps/app-web/src/app/dosyalar/page.tsx:55` (26 satır)

### `formatCurrency` (9 dosya, Benzerlik: %94)
- **Önerilen Hedef Modül:** `packages/document-templates/src/utils/ veya packages/domain/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dashboard/HarcamaMerkeziScreen.tsx:48` (7 satır)
  - `apps/app-desktop/src/renderer/src/screens/dashboard/index2.screen.tsx:171` (7 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/KikLimitleriSection.tsx:123` (6 satır)
  - `apps/app-desktop/src/renderer/src/utils/formatters.ts:31` (30 satır)
  - `apps/app-desktop/src/renderer/src/utils/turkishCalculationUtils.ts:435` (4 satır)
  - `packages/document-templates/src/templates/dogrudan-temin-onay-belgesi/DogrudanTeminOnayBelgesi.template.tsx:62` (3 satır)
  - `packages/document-templates/src/templates/harcama-pusulasi/HarcamaPusulasi.template.tsx:27` (11 satır)
  - `packages/document-templates/src/templates/luzum-muzekkeresi-teslim-tesellum/LuzumMuzekkeresiTeslimTesellum.template.tsx:22` (16 satır)
  - `packages/document-templates/src/utils/textHelpers.ts:78` (31 satır)

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

### `handleCopy` (7 dosya, Benzerlik: %96)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/modals/SayiyiYaziyaCevirModal.tsx:79` (36 satır)
  - `apps/app-desktop/src/renderer/src/screens/araclar/components/SayiyiYaziyaCevirTab.tsx:45` (10 satır)
  - `apps/app-desktop/src/renderer/src/screens/butcekod/index.screen.tsx:186` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/kurum/components/KurumViewCard.tsx:68` (28 satır)
  - `apps/app-desktop/src/renderer/src/screens/playground/index.screen.tsx:32` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/profil/index.screen.tsx:685` (6 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/tabs/ButceKodlariTab.tsx:14` (5 satır)

### `handleAdd` (6 dosya, Benzerlik: %87)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/ui/TagInput.tsx:39` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/komisyon-gorevleri/index.screen.tsx:95` (5 satır)
  - `apps/app-desktop/src/renderer/src/screens/kurum/components/KurumMetadataManager.tsx:38` (11 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/KikLimitleriSection.tsx:38` (76 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/tabs/components/CodeListEditor.tsx:42` (12 satır)
  - `apps/app-desktop/src/renderer/src/screens/tasinirkod/index.screen.tsx:24` (33 satır)

### `handleKeyDown` (6 dosya, Benzerlik: %90)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/FindInPage.tsx:91` (15 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/header/useHeader.ts:94` (6 satır)
  - `apps/app-desktop/src/renderer/src/components/splash/SplashScreen.tsx:141` (5 satır)
  - `apps/app-desktop/src/renderer/src/components/ui/PersonelCombobox.tsx:75` (6 satır)
  - `apps/app-desktop/src/renderer/src/components/ui/TagInput.tsx:60` (8 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/components/tabs/PdfTab.tsx:42` (5 satır)

### `handleToggleSelectAll` (6 dosya, Benzerlik: %98)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/ui/DetsisSubUnitsModal.tsx:116` (7 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/components/KatalogSenkronizasyonModal.tsx:63` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/MalzemeTablosu.tsx:123` (7 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/KabulVeOdeme/KabulTutanaklariListCard.tsx:67` (7 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/tabs/IhtiyacListesiTab.tsx:110` (7 satır)
  - `apps/app-desktop/src/renderer/src/screens/malzemeler/index.screen.tsx:50` (7 satır)

### `handleExportCSV` (4 dosya, Benzerlik: %88)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/ButceOdenekView.tsx:66` (41 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/DokumanlarView.tsx:63` (18 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/KayitFormuView.tsx:19` (46 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/MalzemeHarcamaView.tsx:127` (22 satır)

### `handleImport` (4 dosya, Benzerlik: %81)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/ui/DetsisSubUnitsModal.tsx:134` (14 satır)
  - `apps/app-desktop/src/renderer/src/components/ui/ExcelActions.tsx:73` (25 satır)
  - `apps/app-desktop/src/renderer/src/screens/ayarlar/TemaScreen.tsx:518` (16 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/ImportScreen.tsx:344` (38 satır)

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
  - `apps/app-desktop/src/renderer/src/screens/dosya/components/DocumentPreviewModalV2/hooks/helpers/previewDataLoader.ts:37` (8 satır)
  - `apps/app-desktop/src/renderer/src/services/documentPreloadService.ts:104` (9 satır)
  - `packages/document-templates/src/resolver/mappingResolver.ts:274` (7 satır)

### `Field` (3 dosya, Benzerlik: %98)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/ambar/index.screen.tsx:61` (14 satır)
  - `apps/app-desktop/src/renderer/src/screens/birimler/components/BirimModal.tsx:40` (14 satır)
  - `apps/app-desktop/src/renderer/src/screens/firmalar/components/FirmaModal.tsx:25` (18 satır)

### `formatTR` (3 dosya, Benzerlik: %98)
- **Önerilen Hedef Modül:** `packages/document-templates/src/utils/ veya packages/domain/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/CiktiMerkezi.contextBuilder.ts:34` (6 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/hooks/usePiyasaFiyatArastirmasi/usePiyasaFiyatDocuments.ts:131` (4 satır)
  - `packages/document-templates/src/resolver/mappingResolver.ts:368` (6 satır)

### `handleCreate` (3 dosya, Benzerlik: %93)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/ui/ProjectInlineSection.tsx:42` (37 satır)
  - `apps/app-desktop/src/renderer/src/components/ui/ProjectSelectModal.tsx:58` (39 satır)
  - `apps/app-desktop/src/renderer/src/screens/sablonlar/index.screen.tsx:18` (5 satır)

### `handleDeleteSelected` (3 dosya, Benzerlik: %97)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/MalzemeTablosu.tsx:131` (24 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/tabs/IhtiyacListesiTab.tsx:118` (22 satır)
  - `apps/app-desktop/src/renderer/src/screens/malzemeler/index.screen.tsx:58` (52 satır)

### `handleModeEvent` (3 dosya, Benzerlik: %97)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/header/hooks/useProcurementMode.ts:41` (4 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/Sidebar.tsx:114` (8 satır)
  - `apps/app-desktop/src/renderer/src/components/layout/temin-selector/useTeminSelector.ts:83` (6 satır)

### `handleQuickAdd` (3 dosya, Benzerlik: %82)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/komisyonlar/detay.screen.tsx:50` (23 satır)
  - `apps/app-desktop/src/renderer/src/screens/notlar/components/DosyaNotlariWidget.tsx:31` (18 satır)
  - `apps/app-desktop/src/renderer/src/screens/notlar/index.screen.tsx:150` (27 satır)

### `toggleSelect` (3 dosya, Benzerlik: %84)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/components/TekTikYazdirModal.tsx:137` (12 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/hooks/useCiktiMerkeziScreen.ts:297` (9 satır)
  - `apps/app-desktop/src/renderer/src/screens/raporlar/components/DokumanlarView.tsx:36` (5 satır)

### `closeTab` (2 dosya, Benzerlik: %88)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/store/globalDocumentPreviewStore.ts:119` (37 satır)
  - `apps/app-desktop/src/renderer/src/store/tabStore.ts:247` (27 satır)

### `FiyatFarkiTab` (2 dosya, Benzerlik: %82)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/araclar/components/FiyatFarkiTab.tsx:6` (238 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/tabs/FiyatFarkiTab.tsx:12` (610 satır)

### `formatFileSize` (2 dosya, Benzerlik: %91)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/GoogleDriveFooterWidget.tsx:212` (7 satır)
  - `apps/app-desktop/src/renderer/src/components/ui/google-drive/gdriveUtils.ts:59` (8 satır)

### `getDb` (2 dosya, Benzerlik: %84)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/main/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/main/database/workspace/DtmWorkspace.ts:313` (4 satır)
  - `apps/app-desktop/src/main/database/workspace/workspaceManager.ts:67` (4 satır)

### `getDerivedStateFromError` (2 dosya, Benzerlik: %89)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/ui/ModalErrorBoundary.tsx:24` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/components/DocumentPreviewModalV2/TemplateErrorBoundary.tsx:12` (3 satır)

### `getStatusBadgeClass` (2 dosya, Benzerlik: %81)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/ActiveFileSidebar.tsx:27` (30 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/utils/statusUtils.ts:22` (21 satır)

### `GithubIcon` (2 dosya, Benzerlik: %89)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/pozlar/toplu.screen.tsx:28` (9 satır)
  - `apps/app-landing/src/app/page.tsx:38` (16 satır)

### `handleCreateNewFile` (2 dosya, Benzerlik: %91)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/FileSelector.tsx:62` (19 satır)
  - `apps/app-desktop/src/renderer/src/screens/launcher/index.screen.tsx:69` (16 satır)

### `handleGlobalChange` (2 dosya, Benzerlik: %87)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/ui/BelgeAksiyonlari.tsx:91` (6 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/TaslakYoneticisi.tsx:98` (8 satır)

### `handleOpenFile` (2 dosya, Benzerlik: %93)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/layout/FileSelector.tsx:82` (25 satır)
  - `apps/app-desktop/src/renderer/src/screens/launcher/index.screen.tsx:143` (32 satır)

### `handleRemove` (2 dosya, Benzerlik: %94)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/components/ui/TagInput.tsx:69` (3 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/tabs/components/CodeListEditor.tsx:66` (3 satır)

### `handleRemoveFirm` (2 dosya, Benzerlik: %84)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/IstekliFirmalar.screen.tsx:85` (18 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/hooks/usePiyasaFiyatArastirmasi/usePiyasaFiyatData.ts:340` (28 satır)

### `handleToggleSelectRow` (2 dosya, Benzerlik: %95)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/MalzemeTablosu.tsx:111` (11 satır)
  - `apps/app-desktop/src/renderer/src/screens/dosyalar/tabs/IhtiyacListesiTab.tsx:98` (11 satır)

### `isMemberVisibleInDocument` (2 dosya, Benzerlik: %90)
- **Önerilen Hedef Modül:** `packages/document-templates/src/utils/ veya packages/domain/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `packages/document-templates/src/constants/visibility.config.ts:137` (3 satır)
  - `packages/document-templates/src/services/templateRegistryService.ts:158` (3 satır)

### `normalizeForMatch` (2 dosya, Benzerlik: %95)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/hooks/useCiktiMerkeziScreen.ts:16` (12 satır)
  - `apps/app-desktop/src/renderer/src/utils/formatters.ts:155` (13 satır)

### `pad` (2 dosya, Benzerlik: %96)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/shared/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/main/ipc/workspace.ipc.ts:566` (1 satır)
  - `apps/app-desktop/src/renderer/src/constants/madde-22d-donemler.ts:33` (1 satır)

### `parseTargets` (2 dosya, Benzerlik: %97)
- **Önerilen Hedef Modül:** `packages/document-templates/src/utils/ veya packages/domain/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `packages/document-templates/src/constants/visibility.config.ts:108` (10 satır)
  - `packages/document-templates/src/services/memberVisibilityResolver.ts:182` (10 satır)

### `toggleStar` (2 dosya, Benzerlik: %86)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. Farklı modüller (dosya süreci vs sistem ekranı) arasında paylaşımlı utils gerektirir. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/useDosyaAsamasiSablons.ts:472` (23 satır)
  - `apps/app-desktop/src/renderer/src/screens/system/TaslakYoneticisi.tsx:243` (18 satır)

### `toggleTheme` (2 dosya, Benzerlik: %80)
- **Önerilen Hedef Modül:** `apps/app-desktop/src/renderer/src/utils/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-web/src/app/page.tsx:261` (6 satır)
  - `apps/app-landing/src/app/page.tsx:173` (10 satır)

### `toPossessiveSuffix` (2 dosya, Benzerlik: %98)
- **Önerilen Hedef Modül:** `packages/document-templates/src/utils/ veya packages/domain/`
- **Risk Notu:** Mantık %80+ benzer ancak bazı branching/edge-case farkları var; opsiyonel parametre veya config nesnesiyle birleştirilmeli. REFACTORING_NOTES uyumu: any yerine domain tipleri (@temin360/database) kullanılmalı, prop daraltmada Pick tercih edilmeli.
- **Tanım Konumları:**
  - `apps/app-desktop/src/renderer/src/utils/kurumHelper.ts:147` (27 satır)
  - `packages/document-templates/src/utils/textHelpers.ts:43` (27 satır)

---

## 🔴 Grup D: Sadece İsim Aynı Olan Fonksiyonlar (99 adet)
Bu fonksiyonlar yalnızca adaştır (örneğin UI handler adları: `handleKaydet`, `handleUpdate`, `handleBack`, `calculateTotal`). Gövdeleri ve sorumlulukları tamamen farklıdır. **ASLA BİRLEŞTİRİLMEMELİDİR.**

| Fonksiyon Adı | Dosya Sayısı | Açıklama |
| :--- | :--- | :--- |
| `handleClose` | 5 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %75) |
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
| `handlePrint` | 3 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %47) |
| `loadSettings` | 3 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %56) |
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
| `handleAddPreset` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %16) |
| `handleApply` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %69) |
| `handleApplyDetsisData` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %77) |
| `handleBack` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %50) |
| `handleCopyJson` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %62) |
| `handleDeleteBirim` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %33) |
| `handleDeleteConfirm` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %47) |
| `handleDeleteItem` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %35) |
| `handleDeleteRow` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %61) |
| `handleDownloadTemplate` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %73) |
| `handleExportDocx` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %44) |
| `handleFileUpload` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %22) |
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
| `handleOpenEdit` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %41) |
| `handleOpenSablonByDosyaAdi` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %48) |
| `handlePriceChange` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %18) |
| `handleRemoveRow` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %38) |
| `handleResize` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %45) |
| `handleSaveToDb` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %76) |
| `handleSaveToDosya` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %22) |
| `handleSelect` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %75) |
| `handleSelectPreset` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %38) |
| `handleTabChange` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %53) |
| `handleToggleBelgedeGoster` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %74) |
| `handleToggleExpand` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %62) |
| `handleToggleSelect` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %73) |
| `handleUpdate` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %67) |
| `handleUpdateStatus` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %73) |
| `hasChanges` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %25) |
| `Home` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %62) |
| `InspectorHeader` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %41) |
| `isOpen` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %70) |
| `listWorkspaces` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %75) |
| `markSynced` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %41) |
| `onClose` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %59) |
| `onError` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %71) |
| `openAddModal` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %40) |
| `openWorkspace` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %28) |
| `parse` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %46) |
| `parseStatusAndName` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %80) |
| `pushWorkspace` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %79) |
| `readRecentLogs` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %19) |
| `recordMutation` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %20) |
| `replaceDatabase` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %60) |
| `resetDirty` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %34) |
| `resolveRoleVisibility` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %11) |
| `saveAs` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %67) |
| `saveWorkspace` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %34) |
| `SubScreen` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %69) |
| `toggleGroup` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %37) |
| `validate` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %26) |
| `YaklasikMaliyetCetveli` | 2 dosya | Farklı bileşen/ekran yerel mantığı (max benzerlik: %45) |

---

## 🕵️ Gizli Kopyalar: Farklı İsimli Ama Gövdesi Aynı Olan Fonksiyonlar (15 grup)
Farklı isimlerle tanımlanmış ancak 5+ satırlık mantığı birebir veya yapısal olarak tamamen aynı olan fonksiyonlardır.

### 1. Birebir Gizli Kopyalar (1 grup)

#### Fonksiyonlar: `forceQuit, handleClose` (Hash: `39eee8d9`)
- `forceQuit` -> `apps/app-desktop/src/renderer/src/hooks/useWindowControls.ts:21` (5 satır)
- `handleClose` -> `apps/app-desktop/src/renderer/src/screens/launcher/index.screen.tsx:268` (5 satır)

### 2. Yapısal Gizli Kopyalar (14 grup)

#### Fonksiyonlar: `disconnectFromServer, close, stopExpressServer` (Yapısal Hash: `5bcbfc74`)
- `disconnectFromServer` -> `apps/app-desktop/src/main/client.ts:55` (6 satır)
- `close` -> `apps/app-desktop/src/main/database/workspace/workspaceManager.ts:58` (6 satır)
- `stopExpressServer` -> `apps/app-desktop/src/main/network/expressServer.ts:156` (6 satır)

#### Fonksiyonlar: `handlePresetsChange, handleGlobalChange` (Yapısal Hash: `d7287d96`)
- `handlePresetsChange` -> `apps/app-desktop/src/renderer/src/components/layout/ActiveFileSidebar.tsx:88` (8 satır)
- `handlePresetsChange` -> `apps/app-desktop/src/renderer/src/screens/dosya/components/PrintDropdownButton.tsx:70` (8 satır)
- `handlePresetsChange` -> `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/hooks/usePiyasaFiyatArastirmasi/usePiyasaFiyatPresets.ts:23` (8 satır)
- `handlePresetsChange` -> `apps/app-desktop/src/renderer/src/screens/system/TaslakYoneticisi.tsx:90` (8 satır)
- `handleGlobalChange` -> `apps/app-desktop/src/renderer/src/screens/system/TaslakYoneticisi.tsx:98` (8 satır)

#### Fonksiyonlar: `toggleExpanded, handleToggleSelect, handleToggleExpand, handleToggleSelectOne` (Yapısal Hash: `b8b8ed9d`)
- `toggleExpanded` -> `apps/app-desktop/src/renderer/src/components/layout/Sidebar.tsx:140` (8 satır)
- `handleToggleSelect` -> `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/components/KatalogSenkronizasyonModal.tsx:54` (8 satır)
- `handleToggleExpand` -> `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/components/MalzemeListesi/components/KatalogSenkronizasyonModal.tsx:73` (8 satır)
- `handleToggleSelectOne` -> `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/KabulVeOdeme/KabulTutanaklariListCard.tsx:75` (8 satır)

#### Fonksiyonlar: `toggleAction, toggleGroup, toggleDoc, handleSablonToggle, toggleSelect` (Yapısal Hash: `8d8774d7`)
- `toggleAction` -> `apps/app-desktop/src/renderer/src/components/layout/WorkspaceCloseModal.tsx:152` (5 satır)
- `toggleGroup` -> `apps/app-desktop/src/renderer/src/screens/dosyalar/index.screen.tsx:45` (5 satır)
- `toggleDoc` -> `apps/app-desktop/src/renderer/src/screens/komisyonlar/components/hizli-kadro/HizliKadroBelgeSecimModal.tsx:66` (5 satır)
- `handleSablonToggle` -> `apps/app-desktop/src/renderer/src/screens/komisyonlar/components/komisyon-olustur/useKomisyonOlustur.ts:222` (5 satır)
- `toggleSelect` -> `apps/app-desktop/src/renderer/src/screens/raporlar/components/DokumanlarView.tsx:36` (5 satır)

#### Fonksiyonlar: `handleToggleOne, toggleCategory` (Yapısal Hash: `4c8c9b45`)
- `handleToggleOne` -> `apps/app-desktop/src/renderer/src/components/ui/DetsisSubUnitsModal.tsx:124` (9 satır)
- `toggleCategory` -> `apps/app-desktop/src/renderer/src/screens/dosya/hooks/useCiktiMerkeziScreen.ts:207` (9 satır)

#### Fonksiyonlar: `fetchAmbarlar, fetchPozlar` (Yapısal Hash: `2e6cff94`)
- `fetchAmbarlar` -> `apps/app-desktop/src/renderer/src/screens/ambar/ambar.hooks.ts:132` (8 satır)
- `fetchPozlar` -> `apps/app-desktop/src/renderer/src/screens/pozlar/pozlar.hooks.ts:39` (8 satır)

#### Fonksiyonlar: `getHareketColor, getInstitutionTypeLabel` (Yapısal Hash: `c586e0b9`)
- `getHareketColor` -> `apps/app-desktop/src/renderer/src/screens/ambar/components/StokHareketModal.tsx:131` (16 satır)
- `getInstitutionTypeLabel` -> `apps/app-desktop/src/renderer/src/screens/dashboard/index2.screen.tsx:152` (16 satır)

#### Fonksiyonlar: `copyText, copyPromptToClipboard` (Yapısal Hash: `d54fb0a1`)
- `copyText` -> `apps/app-desktop/src/renderer/src/screens/araclar/components/VergiVeKesintiTab.tsx:14` (5 satır)
- `copyPromptToClipboard` -> `apps/app-desktop/src/renderer/src/screens/ayarlar/TemaScreen.tsx:393` (5 satır)

#### Fonksiyonlar: `fetchBirimler, fetchPersonelList, fetchKurumsalKodlar, fetchAsamalar, fetchFirmalar, queryFn, fetchKalemler, fetchOkasKodlar, fetchRoller, fetchTasinirKodlar` (Yapısal Hash: `80beca65`)
- `fetchBirimler` -> `apps/app-desktop/src/renderer/src/screens/birimler/birimler.hooks.ts:26` (8 satır)
- `fetchPersonelList` -> `apps/app-desktop/src/renderer/src/screens/birimler/birimler.hooks.ts:35` (8 satır)
- `fetchKurumsalKodlar` -> `apps/app-desktop/src/renderer/src/screens/birimler/birimler.hooks.ts:54` (8 satır)
- `fetchAsamalar` -> `apps/app-desktop/src/renderer/src/screens/dashboard/index2.screen.tsx:194` (8 satır)
- `fetchFirmalar` -> `apps/app-desktop/src/renderer/src/screens/firmalar/firmalar.hooks.ts:47` (8 satır)
- `queryFn` -> `apps/app-desktop/src/renderer/src/screens/komisyon-gorevleri/index.screen.tsx:22` (14 satır)
- `fetchKalemler` -> `apps/app-desktop/src/renderer/src/screens/malzemeler/malzemeler.hooks.ts:35` (8 satır)
- `fetchOkasKodlar` -> `apps/app-desktop/src/renderer/src/screens/okaskod/okaskod.hooks.ts:12` (8 satır)
- `queryFn` -> `apps/app-desktop/src/renderer/src/screens/olcubirimleri/olcubirimleri.hooks.ts:50` (8 satır)
- `queryFn` -> `apps/app-desktop/src/renderer/src/screens/olcubirimleri/olcubirimleri.hooks.ts:178` (14 satır)
- `fetchRoller` -> `apps/app-desktop/src/renderer/src/screens/personel/personel.hooks.ts:94` (8 satır)
- `queryFn` -> `apps/app-desktop/src/renderer/src/screens/system/kik-limitleri.hooks.ts:42` (8 satır)
- `fetchTasinirKodlar` -> `apps/app-desktop/src/renderer/src/screens/tasinirkod/tasinirkod.hooks.ts:15` (8 satır)

#### Fonksiyonlar: `get2886UsulText, getFormatBadge` (Yapısal Hash: `e3b9e32b`)
- `get2886UsulText` -> `apps/app-desktop/src/renderer/src/screens/dashboard/components/ActiveDosyaCard.tsx:51` (12 satır)
- `getFormatBadge` -> `apps/app-desktop/src/renderer/src/screens/raporlar/components/DokumanlarView.tsx:82` (12 satır)

#### Fonksiyonlar: `handleModeChange, handleMode` (Yapısal Hash: `1a300525`)
- `handleModeChange` -> `apps/app-desktop/src/renderer/src/screens/dashboard/index2.screen.tsx:93` (5 satır)
- `handleMode` -> `apps/app-desktop/src/renderer/src/screens/firmalar/index.screen.tsx:118` (5 satır)
- `handleMode` -> `apps/app-desktop/src/renderer/src/screens/komisyonlar/index.screen.tsx:352` (5 satır)

#### Fonksiyonlar: `handleToggleSelectRow, toggleSelectRow` (Yapısal Hash: `f65b274e`)
- `handleToggleSelectRow` -> `apps/app-desktop/src/renderer/src/screens/dosyalar/tabs/IhtiyacListesiTab.tsx:98` (11 satır)
- `toggleSelectRow` -> `apps/app-desktop/src/renderer/src/screens/system/HizliDosyaEkle.screen.tsx:337` (11 satır)

#### Fonksiyonlar: `toggleBelgeler, toggleStage, toggleMadde` (Yapısal Hash: `07b36e80`)
- `toggleBelgeler` -> `apps/app-desktop/src/renderer/src/screens/komisyonlar/index.screen.tsx:84` (6 satır)
- `toggleStage` -> `apps/app-desktop/src/renderer/src/screens/sablonlar/components/PlaceholderYonetimi.tsx:21` (6 satır)
- `toggleMadde` -> `apps/app-desktop/src/renderer/src/screens/system/tabs/MevzuatKutuphanesiTab.tsx:84` (6 satır)

#### Fonksiyonlar: `toggleTask, removeFromQueue, toggleReadyToPrint, updateStatus, invalidateReadyStatus, markAsPrinted, lockDocument, unlockDocument` (Yapısal Hash: `614d9094`)
- `toggleTask` -> `apps/app-desktop/src/renderer/src/screens/system/surec-akisi/hooks/useSurecAkisi.ts:327` (10 satır)
- `removeFromQueue` -> `apps/app-desktop/src/renderer/src/store/printQueueStore.ts:89` (7 satır)
- `toggleReadyToPrint` -> `apps/app-desktop/src/renderer/src/store/printQueueStore.ts:97` (36 satır)
- `updateStatus` -> `apps/app-desktop/src/renderer/src/store/printQueueStore.ts:134` (16 satır)
- `invalidateReadyStatus` -> `apps/app-desktop/src/renderer/src/store/printQueueStore.ts:151` (16 satır)
- `markAsPrinted` -> `apps/app-desktop/src/renderer/src/store/printQueueStore.ts:168` (41 satır)
- `lockDocument` -> `apps/app-desktop/src/renderer/src/store/printQueueStore.ts:210` (18 satır)
- `unlockDocument` -> `apps/app-desktop/src/renderer/src/store/printQueueStore.ts:229` (16 satır)
