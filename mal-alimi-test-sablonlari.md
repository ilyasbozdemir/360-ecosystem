# 📄 TEMİN 360 - Mal, Hizmet ve Yapım İşleri Evrak ve Doküman Şablonları Test Rehberi

Bu belge, **TEMİN 360** sisteminde **Mal Alımı**, **Hizmet Alımı** ve **Yapım İşi (Küçük Onarım / Tadilat)** (Doğrudan Temin 4734 Sayılı Kanun Madde 22/d & İhale Usulleri) süreçlerinde otomatik üretilen tüm resmi evrak ve doküman şablonlarının tam listesini, alım türlerine göre mevzuat dayanaklarını ve test kontrol listesini içerir.

> **Nasıl Kullanılır?** İncelediğiniz veya sistemde aktif/öncelikli olmasını istediğiniz şablonların başındaki `[ ]` kutucuğunu `[+]` veya `[x]` olarak işaretleyebilirsiniz.

---

## 📑 ŞABLON LİSTESİ GENEL TABLOSU (MAL / HİZMET / YAPIM)

| Durum | Şablon ID | Şablon Adı | Geçerli Alım Türleri | Aşama | Olur/Onay | Mevzuat Dayanağı |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- |
| [ ] | `ihtiyac-listesi` | İhtiyaç Listesi / İş Kalemleri | Mal, Hizmet, Yapım | 1. Başlangıç | ❌ | İlgili Birim İhtiyaç Bildirimi / Keşif |
| [ ] | `ihtiyac-talep-formu` | İhtiyaç Talep Formu | Mal, Hizmet | 1. Başlangıç | ❌ | Taşınır / İdare İhtiyaç Talebi |
| [ ] | `luzum-muzekkeresi` | Lüzum Müzekkeresi (Gerekçe Raporu) | Mal, Hizmet, Yapım | 1. Başlangıç | ✅ | Harcama Yetkilisi Onayı |
| [ ] | `luzum-muzekkeresi-onay-eki` | Lüzum Müzekkeresi Onay Eki | Mal, Hizmet, Yapım | 1. Başlangıç | ❌ | Detaylı Malzeme / Mahal / Poz Cetveli |
| [ ] | `luzum-muzekkeresi-teslim-tesellum` | Ön Teslim / Tesellüm Tutanağı | Mal, Hizmet | 1. Başlangıç | ❌ | Ön İnceleme ve Teslim Tutanağı |
| [ ] | `harcama-talimati` | Harcama Talimatı / Onay Belgesi | Mal, Hizmet, Yapım | 1. Başlangıç | ✅ | 5018 SK / 4734 SK Madde 22 |
| [ ] | `komisyon-gorevlendirme-onayi` | Komisyon Görevlendirme Onayı | Mal, Hizmet, Yapım | 1. Başlangıç | ✅ | Harcama Yetkilisi Oluru |
| [ ] | `komisyon-gorevlendirme-onayi-eki` | Komisyon Dağılım Listesi Eki | Mal, Hizmet, Yapım | 1. Başlangıç | ❌ | Asıl / Yedek Üye Dağılımı |
| [ ] | `piyasa-fiyat-arastirma-gorevlendirmesi` | Piyasa Fiyat Araştırma Görevlendirmesi | Mal, Hizmet, Yapım | 1. Başlangıç | ✅ | Harcama Yetkilisi Yetkilendirme |
| [ ] | `son-alim-fiyat-cetveli` | Son Alım / Emsal Fiyat Cetveli | Mal, Hizmet, Yapım | 1. Başlangıç | ✅ | Yaklaşık Maliyet Dayanak Cetveli |
| [ ] | `fiyat-arastirma-mektubu` | Fiyat Araştırma Mektubu (Teklif İsteme) | Mal, Hizmet, Yapım | 2. Piyasa & Teklif | ❌ | İsteklilere Gönderilen Resmi Davet |
| [ ] | `birim-fiyat-teklif-mektubu` | Birim Fiyat Teklif Mektubu | Mal, Hizmet, Yapım | 2. Piyasa & Teklif | ❌ | Standart İstekli Teklif Mektubu |
| [ ] | `birim-fiyat-teklif-cetveli` | Birim Fiyat Teklif Cetveli | Mal, Hizmet, Yapım | 2. Piyasa & Teklif | ❌ | KİK Standart Teklif Cetveli / Pozlar |
| [ ] | `arastirma-mektubu` | Piyasa Fiyat İsteme Formu (Hızlı) | Mal, Hizmet | 2. Piyasa & Teklif | ❌ | Faks / E-Posta Teklif Formu |
| [ ] | `yaklasik-maliyet-cetveli` | Yaklaşık Maliyet Hesap Cetveli | Mal, Hizmet, Yapım | 2. Piyasa & Teklif | ❌ | 4734 SK Md. 9 / ÇŞB Birim Fiyatları |
| [ ] | `piyasa-fiyat-arastirma-tutanagi` | Piyasa Fiyat Araştırma Tutanağı | Mal, Hizmet, Yapım | 2. Piyasa & Teklif | ✅ | KİK Doğrudan Temin Standart Tutanağı |
| [ ] | `kabul-edilen-teklif` | Sipariş Mektubu / İşe Başlama Bildirimi | Mal, Hizmet, Yapım | 3. Karar & Sipariş | ❌ | Yükleniciye Resmi Tebligat |
| [ ] | `dogrudan-temin-sonuc-onay-belgesi` | Doğrudan Temin Sonuç Onay Belgesi | Mal, Hizmet, Yapım | 3. Karar & Sipariş | ✅ | Harcama Yetkilisi Kesin Kararı |
| [ ] | `sozlesmeye-davet` | Sözleşmeye Davet Mektubu | Mal, Hizmet, Yapım | 3. Karar & Sipariş | ❌ | Sözleşme İmzalama Tebligatı |
| [ ] | `dogrudan-temin-sozlesmesi` | Doğrudan Temin Alım Sözleşmesi | Mal, Hizmet, Yapım | 3. Karar & Sipariş | ❌ | Tip Mal/Hizmet/Yapım Sözleşmesi |
| [ ] | `gunluk-calisma-puantaj-cizelgesi` | Günlük Çalışma ve Puantaj Çizelgesi | Hizmet, Yapım | 4. Kabul & Ödeme | ✅ | Hizmet İşleri Genel Şartnamesi |
| [ ] | `hizmet-isleri-kabul-teklif-belgesi` | Hizmet İşleri Kabul Teklif Belgesi | Hizmet | 4. Kabul & Ödeme | ❌ | Kontrol Teşkilatı Kabul Teklifi |
| [ ] | `hizmet-isleri-kabul-tutanagi` | Hizmet İşleri Kabul Tutanağı | Hizmet | 4. Kabul & Ödeme | ✅ | Hizmet Alımları Muayene ve Kabul Yön. |
| [ ] | `muayene-kabul-komisyonu` | Muayene ve Kabul Komisyonu Tutanağı | Mal | 4. Kabul & Ödeme | ✅ | Taşınır Mal Yön. / Mal Kabul Yön. |
| [ ] | `muayene-kabul-tutanagi` | Muayene ve Kabul Tutanağı (Standart) | Mal, Yapım | 4. Kabul & Ödeme | ✅ | Geçici Kabul / Muayene Tutanağı |
| [ ] | `hakedis-raporu` | Hakediş Raporu ve İcmal Cetveli | Hizmet, Yapım | 4. Kabul & Ödeme | ✅ | Yapım ve Hizmet Hakediş Yönetmeliği |
| [ ] | `sure-uzatim-talebi` | Süre Uzatımı Talep ve Karar Belgesi | Hizmet, Yapım | 4. Kabul & Ödeme | ✅ | Mücbir Sebep / İlave İş Onayı |
| [ ] | `kesin-teminat-iadesi` | Kesin Teminat İadesi Yazısı | Mal, Hizmet, Yapım | 4. Kabul & Ödeme | ❌ | SGK ve Vergi İlişiksizlik Kontrolü |
| [ ] | `is-deneyim-belgesi-talebi` | İş Bitirme / İş Deneyim Belgesi | Hizmet, Yapım | 4. Kabul & Ödeme | ✅ | KİK İş Deneyim Yönetmeliği |
| [ ] | `tasinir-islem-fisi` | Taşınır İşlem Fişi (TİF) | Mal | 4. Kabul & Ödeme | ❌ | Taşınır Mal Yönetmeliği |
| [ ] | `odeme-yazisi` / `odeme-emri-belgesi`| Ödeme Emri Belgesi ve Eki | Mal, Hizmet, Yapım | 4. Kabul & Ödeme | ✅ | Muhasebat Genel Müdürlüğü |
| [ ] | `harcama-pusulasi` | Harcama Pusulası (Vergisiz/Esnaf Alımı) | Mal, Hizmet | 4. Kabul & Ödeme | ❌ | Vergi Usul Kanunu Md. 234 |

---

## 🔍 ALIM TÜRLERİNE GÖRE AŞAMA AŞAMA ŞABLON DETAYLARI

---

### 🟢 1. AŞAMA: İHTİYAÇ TESPİTİ VE BAŞLANGIÇ BELGELERİ

#### [ ] 1.1. İhtiyaç Listesi (`ihtiyac-listesi`)
- **Amaç:** Talep edilen alım kalemlerini (malı, hizmeti veya yapım imalat kalemlerini) miktar, birim ve gerekçesiyle düzenler.
- **Mal Alımında:** Malzeme adı, Taşınır Kodları (`150.01.01...`), Ölçü birimleri (`Adet`, `Paket`, `Koli`, `Litre`).
- **Hizmet Alımında:** Hizmetin tanımı, kişi sayısı, hizmet süresi (`Ay`, `Gün`, `Saat`), servis güzergâhı, vardiya dökümü.
- **Yapım İşinde:** İmalatın yapıldığı mahal (Kat, Oda, Çatı vb.), ÇŞB / Kamu Poz Numarası, İmalat kalemi tanımı, Birim (`m²`, `m³`, `mt`, `Ton`, `Takım`).

#### [ ] 1.2. İhtiyaç Talep Formu (`ihtiyac-talep-formu`)
- **Amaç:** Talep eden birimin ambar, destek hizmetleri veya teknik servise ilettiği resmi talep belgesidir.
- **Mal Alımında:** Ambar stok mevcudu sorgusu; ambarda yoksa doğrudan temin açılması şerhi.
- **Hizmet Alımında:** Hizmet ihtiyacının gerekçesi ve mevcut personelle karşılanamadığına dair gerekçe.
- **Yapım İşinde:** Teknik arıza, bakım/onarım ihtiyacı tespit formu ve fen elemanı keşif raporu.

#### [ ] 1.3. Lüzum Müzekkeresi (`luzum-muzekkeresi`) & Ekleri
- **Amaç:** Alımın başlatılması için Harcama Yetkilisinden yetki ve onay talep edilen resmi gerekçe yazısıdır.
- **Bileşenler:**
  - `luzum-muzekkeresi` (Gerekçe metni, yasal dayanak ve Olur/Onay bloğu)
  - `luzum-muzekkeresi-onay-eki` (Ekli detaylı kalem / mahal / keşif cetveli)
  - `luzum-muzekkeresi-teslim-tesellum` (Varsa ön tespit, numune veya keşif tutanağı)
- **Test Edilecek Alanlar:**
  - Bütçe tertibi (`03.2 Mal ve Malzeme Alımları`, `03.5 Hizmet Alımları`, `03.8 / 06.5 Küçük Onarım ve Yapım Giderleri`).
  - Kullanılabilir ödenek kontrolü.
  - Harcama Yetkilisi imza bloğu ("UYGUNDUR / OLUR").

#### [ ] 1.4. Harcama Talimatı / Onay Belgesi (`harcama-talimati`)
- **Amaç:** 5018 Sayılı Kanun Md. 31 ve 4734 Sayılı Kanun Md. 22 uyarınca alımın resmi başlatma belgesidir.
- **Test Edilecek Alanlar:**
  - **Alım Türü:** Mal Alımı / Hizmet Alımı / Yapım İşi seçimi.
  - **İhale/Temin Usulü:** `4734 Sayılı Kanun Madde 22/d (Doğrudan Temin)`.
  - **Yaklaşık Maliyet Tutarı:** Rakamla ve **Yazı ile Türk Lirası**.
  - **Avans/Fiyat Farkı:** Verilip verilmeyeceği (Yapım işlerinde Bakanlar Kurulu Kararı kontrolü).
  - Görevlendirilen Piyasa Fiyat Araştırması Personelleri.

#### [ ] 1.5. Piyasa Fiyat Araştırması Görevlendirmesi (`piyasa-fiyat-arastirma-gorevlendirmesi`)
- **Amaç:** Harcama yetkilisince piyasada fiyat araştırması yapacak personellerin yetkilendirilmesidir.
- **Yapım ve Hizmette:** En az bir personelin teknik şartnameyi bilen uzman veya fen elemanı (Mühendis, Mimar, Tekniker) olması kontrolü.

#### [ ] 1.6. Son Alım / Emsal Fiyat Cetveli (`son-alim-fiyat-cetveli`)
- **Amaç:** Yaklaşık maliyete dayanak oluşturmak üzere son 1-2 yıl içindeki benzer alımların, Çevre Şehircilik Bakanlığı poz birim fiyatlarının veya sözleşme bedellerinin listelendiği cetveldir.
- **Yapım İşinde:** İlgili yılın Çevre ve Şehircilik Bakanlığı resmi birim fiyatları ve rayiç analizleri.
- **Hizmet Alımında:** Kamu İhale Kurumu asgari işçilik maliyeti ve emsal hizmet faturaları.

---

### 🟡 2. AŞAMA: PİYASA FİYAT ARAŞTIRMASI VE TEKLİF BELGELERİ

#### [ ] 2.1. Fiyat Araştırma Mektubu (`fiyat-arastirma-mektubu`)
- **Amaç:** Firmalardan KDV hariç birim fiyat teklifi istemek üzere gönderilen resmi yazıdır.
- **Mal Alımında:** Malzemenin markası/muadili, teslim yeri (İdare ambarı), teslim süresi (Örn: 15 gün).
- **Hizmet Alımında:** İşin yapılma süresi, personel sayısı, çalışma saatleri, KDV tevkifat oranları hatırlatması.
- **Yapım İşinde:** Yer görme belgesi, keşif özeti, mahal listesi, işin tamamlanma süresi (Örn: 45 takvim günü).

#### [ ] 2.2. Birim Fiyat Teklif Mektubu (`birim-fiyat-teklif-mektubu`) & Cetveli (`birim-fiyat-teklif-cetveli`)
- **Amaç:** İsteklilerin doldurup kaşe-imza ile idareye sunduğu resmi teklif evrakıdır.
- **Test Edilecek Alanlar:**
  - İstekli firma adı, VKN/TCKN, Ticaret Sicil No, Adres ve IBAN bilgileri.
  - **Mal Alımı:** Her mal kalemi için KDV Hariç Birim Fiyat ve Toplam Fiyat.
  - **Hizmet Alımı:** Hizmet kalemi birim fiyatları, işçilik, malzeme ve varsa amortisman dökümü.
  - **Yapım İşi:** Poz no, iş kalemi adı, metrajı, birim fiyatı ve tutarı.
  - Teklifin geçerlilik süresi (Örn: 30 / 60 takvim günü).
  - Genel Toplam Tutar (Rakamla ve **Yazıyla TL**).

#### [ ] 2.3. Yaklaşık Maliyet Hesap Cetveli (`yaklasik-maliyet-cetveli`)
- **Amaç:** 4734 Sayılı Kanun Madde 9 ve KİK İhale Uygulama Yönetmelikleri uyarınca yaklaşık maliyetin hesaplandığı resmi cetveldir.
- **Hesaplama Yöntemleri:**
  - **Mal Alımı:** Firmalardan alınan tekliflerin aritmetik ortalaması veya en düşük piyasa fiyatı.
  - **Hizmet Alımı:** KİK Asgari İşçilik Modülü + genel giderler (%4) + malzeme/araç maliyetleri.
  - **Yapım İşi:** Resmi ÇŞB birim fiyatları + analizler + %25 Yüklenici Kârı ve Genel Giderler veya piyasa teklif ortalamaları.
- **İmza:** Piyasa araştırma görevlilerinin asıl/yedek imzaları.

#### [ ] 2.4. Piyasa Fiyat Araştırma Tutanağı (`piyasa-fiyat-arastirma-tutanagi`)
- **Amaç:** Alınan tekliflerin karşılaştırıldığı ve ekonomik açıdan en avantajlı teklifi veren yüklenicinin belirlendiği nihai karar tutanağıdır.
- **Test Edilecek Alanlar:**
  - Teklif veren tüm isteklilerin sıralı dökümü (Firma A: 120.000 TL, Firma B: 135.000 TL vb.).
  - En uygun teklifi veren istekli (Kazanan Firma) ve gerekçeli karar metni.
  - Piyasa araştırma görevlileri imzası.
  - Harcama Yetkilisi "ONAYLANMIŞTIR" onay bloğu.

---

### 🔵 3. AŞAMA: SİPARİŞ, SÖZLEŞME VE KARAR BELGELERİ

#### [ ] 3.1. Kabul Edilen Teklif / Sipariş Mektubu / İşe Başlama Bildirimi (`kabul-edilen-teklif`)
- **Amaç:** Teklifi uygun görülen istekliye işin/malın verildiğini bildiren resmi tebligattır.
- **Mal Alımında:** Sipariş mektubu, depo teslim tarihi, muayene şartları.
- **Hizmet Alımında:** İşe başlama tarihi, görevlendirilecek personel evraklarının idareye teslim süresi.
- **Yapım İşinde:** Yer teslimi randevusu, işe başlama talimatı ve şantiye sorumlusu bildirim çağrısı.

#### [ ] 3.2. Doğrudan Temin Sonuç Onay Belgesi (`dogrudan-temin-sonuc-onay-belgesi`)
- **Amaç:** Alımın hangi firmadan, ne kadarlık bedelle ve hangi bütçe tertibinden yapıldığını kesinleştiren nihai karardır.
- **Test Edilecek Alanlar:**
  - Kesinleşen alım bedeli (Rakamla ve **Yazı ile**).
  - Vergi/SGK sorgulaması şerhi.
  - Bütçe kodu ve kullanılabilir ödenek düşümü.

#### [ ] 3.3. Sözleşmeye Davet Mektubu (`sozlesmeye-davet`)
- **Amaç:** Doğrudan teminde sözleşme yapılması kararlaştırılan hallerde firmayı sözleşme imzalamaya çağıran resmi yazıdır.
- **İstenen Belgeler:**
  - Kesin teminat mektubu / makbuzu (%6 oranında).
  - Vergi borcu yoktur yazısı (GİB).
  - SGK prim borcu yoktur yazısı.
  - Yapım işlerinde Yapı Müteahhitliği Yetki Belgesi Numarası (YAMBİS).

#### [ ] 3.4. Doğrudan Temin Alım Sözleşmesi (`dogrudan-temin-sozlesmesi`)
- **Amaç:** İdare ile Yüklenici arasında akdedilen tip sözleşmedir.
- **Alım Türüne Göre Maddeler:**
  - **Mal Alımında:** Malın teslim yeri/şartları, garanti süresi, ayıplı malın 7 gün içinde değişimi, gecikme cezası (günlük %0.5).
  - **Hizmet Alımında:** Hizmetin ifası, personel kıyafeti/güvenliği, puantaj takibi, kıdem/ihbar sorumluluğu yükleniciye ait olma şartı, KDV tevkifatı.
  - **Yapım İşinde:** Yer teslimi, iş programı, hakediş ödeme dönemleri, nefaset kesintisi, şantiye güvenliği, all-risk sigorta, geçici ve kesin kabul süreleri, teminat süresi (12 ay vb.).

---

### 🟣 4. AŞAMA: KABUL, HAKEDİŞ, MUAYENE VE ÖDEME İŞLEMLERİ

#### [ ] 4.1. Muayene ve Kabul Komisyonu Tutanağı (`muayene-kabul-komisyonu` / `muayene-kabul-tutanagi`)
- **Amaç:** Mal veya basit onarımların şartnameye uygun teslim alındığını onaylayan tutanaktır.
- **Mal Alımında:**
  - Fatura ve İrsaliye bilgileri.
  - Parti, seri no, son kullanma tarihi kontrolleri.
  - Taşınır Kayıt Yetkilisi ve Muayene Komisyonu imzaları.
  - Taşınır İşlem Fişi (TİF) kesilmeye hazır onayı.
- **Basit Yapım/Onarımda:** Yapılan boya, tadilat, tesisat imalatlarının fiziki muayenesi ve fen kurallarına uygunluk onayı.

#### [ ] 4.2. Günlük Çalışma ve Puantaj Çizelgesi (`gunluk-calisma-puantaj-cizelgesi`)
- **Amaç:** Hizmet alımlarında ve yapım işlerinde personelin günlük mesai, vardiya ve çalışma günlerini takip eden belgedir.
- **Hizmet Alımında:** Personel adı-soyadı, TCKN, görev yeri, normal çalışma günleri, tatil/hafta sonu mesaileri, yüklenici ve kontrol teşkilatı imzaları.

#### [ ] 4.3. Hizmet İşleri Kabul Belgeleri (`hizmet-isleri-kabul-teklif-belgesi` & `hizmet-isleri-kabul-tutanagi`)
- **Amaç:** Hizmet Alımları Muayene ve Kabul Yönetmeliği uyarınca hizmetin eksiksiz görüldüğünü tevsik eden resmi kabul tutanağıdır.
- **Test Edilecek Alanlar:**
  - Sözleşme konusu hizmetin dönemi (Örn: 01.01.2026 - 31.01.2026).
  - Şartnameye aykırı eksik veya kusurlu hizmet bulunup bulunmadığı.
  - Varsa uygulanan gecikme/hizmet kesintisi tutarları.
  - Kontrol Teşkilatı ve Kabul Komisyonu üyelerinin imzaları, Harcama Yetkilisi Onayı.

#### [ ] 4.4. Hakediş Raporu ve İcmal Cetveli (`hakedis-raporu`)
- **Amaç:** Hizmet alımlarında aylık istihkakların, yapım işlerinde ise tamamlanan imalat metrajlarının parasal karşılığını hesaplayan hakediş evrakıdır.
- **Bileşenler:**
  - Hakediş Kapak Sayfası (Kümülatif toplamlar, önceki hakedişler, bu hakediş tutarı).
  - Hakediş İcmali (İş kalemleri / poz bazlı gerçekleşen metrajlar).
  - Kesintiler (Gelir vergisi stopajı, KDV tevkifatı, damga vergisi, gecikme cezası, avans mahsubu).
  - Ödenecek Net Tutar (Sayı ve **Yazı ile TL**).

#### [ ] 4.5. Süre Uzatımı Talep ve Karar Belgesi (`sure-uzatim-talebi`)
- **Amaç:** Yapım veya hizmet alımlarında hava şartları, doğal afet, idareden kaynaklı gecikme veya ilave iş artışı sebebiyle yükleniciye verilen ek sürenin onay belgesidir.
- **Test Edilecek Alanlar:**
  - Gecikme gerekçesi ve resmi meteoroloji/rapor dayanağı.
  - Komisyon incelemesi ve verilen ek süre (Örn: 15 takvim günü).
  - Harcama Yetkilisi Onayı.

#### [ ] 4.6. Kesin Teminat İadesi Yazısı (`kesin-teminat-iadesi`)
- **Amaç:** İş eksiksiz tamamlandıktan sonra emanet hesabındaki nakit teminatın veya banka teminat mektubunun yükleniciye iadesi yazısıdır.
- **Şartlar:** Sosyal Güvenlik Kurumundan (SGK) "İlişiksizlik Belgesi" ve Vergi Dairesinden borcu yoktur belgesinin alınmış olması.

#### [ ] 4.7. İş Bitirme / İş Deneyim Belgesi Talebi (`is-deneyim-belgesi-talebi`)
- **Amaç:** İşi başarıyla tamamlayan yükleniciye kamu ihalelerinde kullanmak üzere düzenlenen iş bitirme belgesidir (4734 SK Ek Madde ve Tebliğler).

#### [ ] 4.8. Taşınır İşlem Fişi (`tasinir-islem-fisi`) & Harcama Pusulası (`harcama-pusulasi`)
- **Taşınır İşlem Fişi:** Sadece **Mal Alımlarında** taşınırların ambar kaydına alınmasını sağlar.
- **Harcama Pusulası:** Vergi mükellefi olmayan gerçek kişilerden yapılan küçük bakım, onarım veya mal alımlarında stopaj kesilerek düzenlenen ödeme makbuzudur.

---

## 🧪 UÇTAN UCA TEST SENARYOLARI (3 FARKLI ALIM TÜRÜ)

---

### 🔹 SENARYO 1: MAL ALIMI (Kırtasiye, Sarf Malzemesi & Donanım)

1. **Giriş:** 5 Kalem Kırtasiye Malzemesi girilir (`A4 Fotokopi Kağıdı`, `Telli Dosya`, `Klasör`, `Mavi Tükenmez Kalem`, `Zımba Teli`).
2. **Onay:** `harcama-talimati` üretilir -> Yaklaşık maliyet rakam ve yazı ile doğrulanır.
3. **Teklif İsteme:** 3 Farklı İstekli için `fiyat-arastirma-mektubu` üretilir.
4. **Cetvel & Karar:** `yaklasik-maliyet-cetveli` ve `piyasa-fiyat-arastirma-tutanagi` oluşturulur -> En düşük teklif kazanan olarak seçilir.
5. **Sipariş:** `kabul-edilen-teklif` (Sipariş Mektubu) ve `dogrudan-temin-sonuc-onay-belgesi` üretilir.
6. **Kabul & Depo:** Malzemeler ambara gelince `muayene-kabul-komisyonu` tutanağı ve `tasinir-islem-fisi` (TİF) oluşturulup imzaya açılır.

---

### 🔹 SENARYO 2: HİZMET ALIMI (Klima & İklimlendirme Periyodik Bakım Hizmeti)

1. **Giriş:** Hizmet kalemi tanımlanır (`Hizmet Binası VRF ve Split Klimalar Yıllık Periyodik Bakım ve Onarım Hizmeti`, Miktar: 12 Ay).
2. **Onay:** `harcama-talimati` üretilir -> Hizmet alımı seçeneği, KDV tevkifatı kuralı (`Tadilat, Bakım ve Onarım Hizmetlerinde KDV Tevkifatı`) doğrulanır.
3. **Teklif:** İklimlendirme firmalarına `fiyat-arastirma-mektubu` gönderilir.
4. **Karar & Sözleşme:** `piyasa-fiyat-arastirma-tutanagi` imzalanır; ardından `dogrudan-temin-sozlesmesi` (Hizmet Alımı Şartları, aylık bakım periyotları, cezai şartlar) üretilir.
5. **İfa & Puantaj:** Bakım yapıldığında `gunluk-calisma-puantaj-cizelgesi` doldurulur.
6. **Kabul & Ödeme:** `hizmet-isleri-kabul-tutanagi` ve aylık bakım `hakedis-raporu` hazırlanarak ödeme emri düzenlenir.

---

### 🔹 SENARYO 3: YAPIM İŞİ / KÜÇÜK ONARIM (Hizmet Binası Islak Hacim Tadilatı)

1. **Keşif & Giriş:** Fen elemanı keşif kalemleri girilir:
   - Poz 1: `15.275.1101` - Seramik kaplama sökülmesi (`m²`)
   - Poz 2: `15.280.1002` - Duvar ve taban seramik kaplaması (`m²`)
   - Poz 3: `25.015.1001` - Gömme rezervuar ve asma klozet montajı (`Adet`)
2. **Onay:** `luzum-muzekkeresi` ve `harcama-talimati` üretilir -> Bütçe kodu `03.8.2.01 Küçük Onarım Giderleri` olarak belirlenir.
3. **Teklif & Metraj:** Müteahhit firmalara `birim-fiyat-teklif-cetveli` ile keşif özeti gönderilir.
4. **Yaklaşık Maliyet:** ÇŞB resmi poz rayiçleri ve firma teklifleriyle `yaklasik-maliyet-cetveli` üretilir.
5. **Karar & Sözleşme:** `piyasa-fiyat-arastirma-tutanagi` ve `dogrudan-temin-sozlesmesi` (Yapım İşi Tip Sözleşmesi: Yer teslimi 5 gün, iş süresi 30 gün, gecikme cezası %0.5) imzalanır.
6. **Hakediş & Kabul:** İmalat tamamlanınca metrajlar kontrol edilir; `hakedis-raporu` (Yeşil defter/icmal) ve `muayene-kabul-tutanagi` (Geçici kabul) onaylanarak yükleniciye istihkak ödenir.
