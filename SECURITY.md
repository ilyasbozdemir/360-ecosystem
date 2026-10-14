# Güvenlik Politikası ve Lisans İhlal Bildirimi (Security & Compliance Policy)

Temin 360, doğrudan temin, ihale ve resmî yazışma gibi hassas mali ve kurumsal
süreçlerin yönetildiği kritik bir sistemdir. Kullanıcılarımızın ve kamu/özel
sektör paydaşlarımızın veri güvenliği ve mevzuata uyumu bizim için en yüksek
önceliktir.

---

## 1. Desteklenen Sürümler

Aşağıdaki tabloda güvenlik güncellemeleri ve yamaları alan aktif sürümler
belirtilmiştir:

| Sürüm                      | Güvenlik Desteği Durumu |
| :------------------------- | :---------------------: |
| **v2.x.x (Mevcut / Main)** |    Tam Destekleniyor    |
| **v1.x.x**                 |    ⚠️ Kritik Yamalar    |
| **< v1.0.0**               |    ❌ Desteklenmiyor    |

---

## 2. Güvenlik Açığı Bildirimi (Vulnerability Disclosure)

Eğer Temin 360 platformunda potansiyel bir güvenlik açığı (XSS, SQL Injection,
yetkilendirme atlatma, veri sızıntısı vb.) keşfettiyseniz, lütfen bunu **herkese
açık GitHub Issue olarak açmayınız**.

Güvenlik açıklarını bildirmek için:

1. **E-Posta:** `bozdemir.ib70@gmail.com` adresine konu kısmına
   `[GÜVENLİK AÇIĞI] - Temin 360` yazarak bildirimde bulununuz.
2. **GitHub Security Advisory:** Depomuzun
   [Security Advisories](https://github.com/ilyasbozdemir/temin-360-app/security/advisories)
   sekmesini kullanarak gizli güvenlik bildirimi (Private Vulnerability Report)
   oluşturabilirsiniz.

### Bildirimde Bulunması Gereken Bilgiler:

- Açığın etkilediği bileşen (Electron masaüstü, Web arayüzü, PocketBase veya
  SQLite modülü).
- Adım adım yeniden üretme adımları (PoC - Proof of Concept).
- Olası etki ve güvenlik riski derecesi.

### Süreç ve Taahhüdümüz:

- Bildiriminiz **48 saat** içerisinde incelenecek ve size teyit dönülecektir.
- Doğrulanan açıklar için en geç **7 iş günü** içinde düzeltme (patch)
  yayınlanacak ve sorumlu bildirimde bulunan araştırmacılara teşekkür
  edilecektir.

---

## 3. Lisans ve Telif İhlali Bildirimleri (License Violation Reporting)

Temin 360, **GNU AGPL-3.0** lisansı ile korunmaktadır.

Eğer bir firmanın, kurumun veya üçüncü tarafın;

- Temin 360 kaynak kodlarını veya türetilmiş versiyonlarını kapalı devre/ticari
  olarak kullanıp kaynak kodlarını AGPLv3 şartlarına göre paylaşmadığını,
- Telif hakkı (Copyright) veya yazar bilgilerini silerek dağıttığını,
- Geçerli bir ticari lisans sözleşmesi olmaksızın ürünü ticari paket olarak
  sattığını

fark ederseniz, lütfen kanıtlar (bağlantı, ekran görüntüsü, sözleşme veya web
adresi) ile birlikte `bozdemir.ib70@gmail.com` adresine iletiniz. Bildirimler
gizlilikle incelenecek ve gerekli yasal süreçler başlatılacaktır.
