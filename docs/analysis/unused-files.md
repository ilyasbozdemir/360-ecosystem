# TEMİN 360 - Kullanılmayan ve Ölü Dosyalar Analiz Raporu

Bu rapor `npx knip` statik analiz aracı, TypeScript AST referans taraması ve rota doğrulamaları sonucunda kod tabanında tespit edilen kullanılmayan (dead/orphan) dosyaların tam dökümünü içerir.

> ⚠️ **KULLANICI DİREKTİFİ & KORUMA İLKESİ:**  
> **"v2 olanlarda v1'leri asla silme"** kuralı uyarınca, geriye dönük uyumluluk veya köprü amacıyla varlığını sürdüren V1 dosyaları (`DocumentPreviewModal.tsx`, `DocumentPreviewModal/index.tsx` vb.) **kesinlikle "Silinmesi Güvenli" listesine ALINMAMIŞTIR**.

---

## 📊 Sayısal Özet

| Kategori | Dosya Sayısı | Toplam Satır Sayısı | Durum |
| :--- | :--- | :--- | :--- |
| 🟢 **Silinmesi Kesinlikle Güvenli** | **32 dosya** | **6.875 satır** | Faz 1 refactoring aşamasında temizlenebilir |
| 🟡 **Şüpheli / İnceleme Gerektiren** | **9 dosya** | **~480 satır** | İlerideki özellikler / tip tanımları için korunmalı |
| **Toplam Taranan Ölü Kod** | **41 dosya** | **~7.355 satır** | - |

---

## 🟢 1. Silinmesi Kesinlikle Güvenli Olan Dosyalar (32 Dosya - 6.875 Satır)

Aşağıdaki dosyalar rota (`routes.tsx`), dinamik import, barrel export veya doğrudan import zincirinde **hiçbir yerde yer almamaktadır**. Silinmeleri derleme (build), tip kontrolü (typecheck) veya çalışma zamanı (runtime) üzerinde hiçbir yan etki yaratmaz.

### A. Eski V1 Dashboard Artığı Olan Bileşenler (7 Dosya - 1.493 Satır)
`index2.screen.tsx` (V2 Dashboard) geçişi sonrası kullanılmayan eski dashboard bileşenleridir.

1. `apps/app-desktop/src/renderer/src/screens/dashboard/components/HeroHeader.tsx` (322 satır)
2. `apps/app-desktop/src/renderer/src/screens/dashboard/components/InstitutionCard.tsx` (264 satır)
3. `apps/app-desktop/src/renderer/src/screens/dashboard/components/StatsCards.tsx` (235 satır)
4. `apps/app-desktop/src/renderer/src/screens/dashboard/components/ChartsSection.tsx` (230 satır)
5. `apps/app-desktop/src/renderer/src/screens/dashboard/components/KpiCards.tsx` (189 satır)
6. `apps/app-desktop/src/renderer/src/screens/dashboard/components/ActiveFilesPipeline.tsx` (171 satır)
7. `apps/app-desktop/src/renderer/src/screens/dashboard/components/AnnouncementsPanel.tsx` (81 satır)

### B. Ölü Dosya Süreci ve Rota Dışı Ekranlar (12 Dosya - 2.822 Satır)
Bu dosyalar modüler `DosyaAsamalari` yapısına geçildikten sonra atıl kalmış, rotası olmayan veya yerini başka bileşenlere bırakmış parçalardır.

8. `apps/app-desktop/src/renderer/src/screens/dosya/MalzemeListesi.screen.tsx` (876 satır) — *Rotası olmayan monolitik ekran; yerine `useMalzemeListesi` modülleri çalışmaktadır.*
9. `apps/app-desktop/src/renderer/src/screens/dosya/components/PrintManagerModal.tsx` (285 satır)
10. `apps/app-desktop/src/renderer/src/screens/dosya/components/SelectedFileInspector.tsx` (282 satır)
11. `apps/app-desktop/src/renderer/src/screens/dosya/components/ChangelogWidget.tsx` (181 satır)
12. `apps/app-desktop/src/renderer/src/screens/dosya/components/CiktiPreviewModal.tsx` (170 satır)
13. `apps/app-desktop/src/renderer/src/screens/dosya/components/ProcessStats.tsx` (154 satır)
14. `apps/app-desktop/src/renderer/src/screens/dosya/components/VerticalStepper.tsx` (153 satır)
15. `apps/app-desktop/src/renderer/src/screens/dosya/components/PackageStructure.tsx` (116 satır)
16. `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/SubScreen.tsx` (116 satır)
17. `apps/app-desktop/src/renderer/src/screens/dosya/components/DteTransfer.tsx` (102 satır)
18. `apps/app-desktop/src/renderer/src/screens/dosya/components/UpdaterWidget.tsx` (101 satır)
19. `apps/app-desktop/src/renderer/src/screens/dosya/components/DocumentPreviewModalV2/utils.ts` (61 satır) — *İç fonksiyonları doğrudan previewDataLoader içine taşınmış atıl dosya.*

### C. Eski Dosya Aşamaları Sekmeleri ve Detay Panelleri (7 Dosya - 1.878 Satır)

20. `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/SablonPanelleri.tsx` (528 satır)
21. `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/DocumentsDashboard.tsx` (500 satır)
22. `apps/app-desktop/src/renderer/src/screens/dosyalar/components/DosyaDetailPanel.tsx` (479 satır)
23. `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/DavetEdilenFirmalar.tsx` (167 satır)
24. `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/PiyasaFiyatArastirmasiFirmsTab.tsx` (106 satır)
25. `apps/app-desktop/src/renderer/src/screens/dosya/sub-screens/DosyaAsamalari/components/SiparisVeSozlesme/SiparisStepperTabs.tsx` (93 satır)
26. `apps/app-desktop/src/renderer/src/screens/dosyalar/components/DetailHelpers.tsx` (49 satır)
27. `apps/app-desktop/src/renderer/src/screens/dosyalar/tabs/TeknikSartnameTab.tsx` (48 satır)

### D. Diğer Ekranlardaki Atıl Modallar ve Test/Stub Dosyaları (6 Dosya - 816 Satır)

28. `packages/document-templates/src/resolver/MappingResolverTest.tsx` (349 satır) — *Paket içi çalışma zamanında kullanılmayan test bileşeni.*
29. `apps/app-desktop/src/renderer/src/screens/komisyonlar/components/GorevTanimlariModal.tsx` (247 satır)
30. `apps/app-desktop/src/renderer/src/screens/kurum/components/KurumsalYapiTab.tsx` (215 satır)
31. `apps/app-desktop/src/renderer/src/screens/komisyonlar/components/KomisyonBelgeleriYonetModal.tsx` (3 satır)
32. `apps/app-desktop/src/main/database/BaseTable.ts` (2 satır) — *`@dt/database` re-export stub'ı.*

---

## 🟡 2. Şüpheli / İnceleme Gerektiren Dosyalar (9 Dosya)

Aşağıdaki dosyalar şu anda aktif bir TSX/TS dosyasında doğrudan import edilmemektedir ancak **iş mantığı, dinamik yükleme veya gelecekteki özellikler** nedeniyle silinmesi risklidir:

1. `apps/app-desktop/src/shared/types/templates/4-kabul-ve-odeme-islemleri/tasinir-islem-fisi.ts`
   - *Sebep:* Taşınır İşlem Fişi şablonunun TypeScript tip sözleşmesidir. Şablon motorunun dinamik şablon eşleşmelerinde tip referansı olarak kullanılabilir.
2. `apps/app-desktop/src/shared/types/templates/5-klasor-ve-kapaklar/ihale-kapagi.ts`
   - *Sebep:* İhale kapağı şablon tipi sözleşmesi.
3. `apps/app-desktop/src/shared/types/templates/5-klasor-ve-kapaklar/kapak-ici-indeks-sablonu.ts`
   - *Sebep:* Kapak içi indeks şablon tipi sözleşmesi.
4. `apps/app-desktop/src/shared/types/templates/5-klasor-ve-kapaklar/klasor-sirtligi-3cm.ts`
   - *Sebep:* Sırtlık şablon sözleşmesi.
5. `apps/app-desktop/src/shared/types/templates/5-klasor-ve-kapaklar/klasor-sirtligi-5cm.ts`
   - *Sebep:* Sırtlık şablon sözleşmesi.
6. `apps/app-desktop/src/shared/types/templates/5-klasor-ve-kapaklar/klasor-sirtligi-7-5cm.ts`
   - *Sebep:* Sırtlık şablon sözleşmesi.
7. `apps/app-web/src/lib/pocketbase.ts`
   - *Sebep:* Web uygulamasının PocketBase backend istemcisidir. Web uygulaması geliştirme aşamasında olduğundan backend bağlantısı hazır tutulmuştur.
8. `packages/database/src/types.ts`
   - *Sebep:* `@temin360/database` paketinin genel dışa aktarılan tip arayüzleridir.
9. `apps/app-desktop/src/renderer/src/screens/dosya/components/DocumentPreviewModal/index.tsx` & `DocumentPreviewModal.tsx`
   - *Sebep:* **V1 Köprü Bileşeni.** V2'ye yönlendirme yapmaktadır. Kullanıcı kuralı gereğince kesinlikle silinmemelidir.
