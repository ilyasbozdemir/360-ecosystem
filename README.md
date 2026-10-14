# ⚖️ TEMİN 360

> **"Kamu Harcamaları, İhale, Doğrudan Temin ve Hakediş Süreçlerinde Akıllı Masaüstü Asistanı."**

**TEMİN 360**, kamu idareleri (Belediyeler, Bakanlıklar, Üniversiteler ve Özel Bütçeli Kurumlar) için 4734 Sayılı Kamu İhale Kanunu, 4735 Sayılı Sözleşmeler Kanunu, 5018 Sayılı Kamu Malî Yönetimi Kanunu ve 2886 Sayılı Devlet İhale Kanunu süreçlerini uçtan uca dijitalleştiren **modern, çevrimdışı öncelikli ve açık kaynaklı** bir kurumsal yönetim platformudur.

---

## 🌟 Öne Çıkan Özellikler

- ⚡ **360° Süreç Yönetimi:** İhtiyaç tespiti ve lüzum müzekkeresinden başlayıp piyasa araştırması, onay belgesi, sözleşme, muayene-kabul, hakediş ve taşınır işlem fişine (TİF) kadar tüm adımlar tek ekranda.
- 📦 **Tüm Alım Türleri Destekli:**
  - **Mal Alımları:** Taşınır kodları, ambar stok çıkış, muayene ve kabul komisyon tutanakları.
  - **Hizmet Alımları:** Puantaj çizelgeleri, KDV tevkifat hesapları, hizmet kabul tutanakları.
  - **Yapım İşleri & Küçük Onarım:** Keşif özetleri, poz ve metraj analizleri, hakediş icmalleri.
  - **2886 Sayılı DİK:** Taşınmaz kiralama, satış, trampa ve ecrimisil takip süreçleri.
- ✍️ **Resmi Evrak & Şablon Motoru:** Tek tıkla mevzuata tam uyumlu, barkodlu, karekodlu ve baskıya hazır resmi PDF/A ve Word belgeleri üretimi.
- 🗄️ **Tek Dosyada Taşınabilir Çalışma Alanı (`.temin`):** Her ihale veya doğrudan temin dosyası bağımsız, şifrelenebilir ve taşınabilir tek bir yerel veritabanı dosyası olarak saklanır.
- ☁️ **Akıllı Senkronizasyon & Yedekleme:** Google Drive, yerel klasör veya merkezi kurum sunucusuna otomatik kapanış yedeği ve arka plan eşitlemesi.
- 🛡️ **Mevzuat Karar Destek:** Güncel KİK limitleri, yaklaşık maliyet analizleri ve usul kontrolleri ile personele hata payı bırakmayan rehberlik.

---

## 📥 İndir ve Kur

En güncel kararlı masaüstü sürümlerini doğrudan indirebilirsiniz:

- 🚀 **Resmi Web Portalı:** [temin360.ilyasbozdemir.dev](https://temin360.ilyasbozdemir.dev)
- 📦 **Doğrudan İndirme:** [GitHub Releases](https://github.com/ilyasbozdemir/temin-360-app/releases) *(Windows `.exe` ve macOS `.dmg`)*
- ☁️ **Canlı Demo Gateway:** [temin360app.demo.ilyasbozdemir.dev](https://temin360app.demo.ilyasbozdemir.dev)

---

## 🛠️ Teknoloji Mimarisi

TEMİN 360 modern, yüksek performanslı ve çevrimdışı (offline-first) bir monorepo mimarisi üzerine inşa edilmiştir:

```text
temin-360-app/
├── apps/
│   ├── app-desktop/      # Electron 39 + React 19 + TypeScript + SQLite Masaüstü Uygulaması
│   ├── app-landing/      # Next.js 16 + Tailwind CSS Tanıtım ve Dağıtım Portalı
│   └── app-web/          # Next.js 16 Canlı Senkronizasyon ve API Gateway Servisi
└── packages/
    ├── document-templates/ # Modüler Kamu Evrak ve Tutanak Şablonları Motoru
    ├── pdf-generator/      # Yüksek Performanslı PDF Derleme Paketi
    └── database/           # SQLite ve Ortak Şema Tanımları
```

---

## 🚀 Geliştirici Ortamı (Hızlı Başlangıç)

Projeyi yerel geliştirme ortamınızda çalıştırmak için:

```bash
# 1. Depoyu klonlayın ve bağımlılıkları yükleyin
pnpm install

# 2. Masaüstü uygulamasını başlatın
pnpm dev:desktop

# 3. Tanıtım web portalını başlatın (Opsiyonel - http://localhost:3001)
pnpm dev:website

# 4. Web Gateway sunucusunu başlatın (Opsiyonel - http://localhost:3000)
pnpm dev:web
```

### Sık Kullanılan Komutlar

| Komut | Açıklama |
| :--- | :--- |
| `pnpm dev:desktop` | Masaüstü uygulamasını geliştirme modunda açar |
| `pnpm build:desktop` | Windows ve macOS için kurulum paketlerini derler |
| `pnpm typecheck` | Tüm çalışma alanında TypeScript tip kontrollerini çalıştırır |
| `pnpm format` | Prettier ile kod formatlamasını düzenler |
| `pnpm lint` | ESLint ile kod kalitesi denetimini yürütür |

---

## 📄 Lisans

Bu proje **Çift Lisanslama (Dual Licensing)** modeliyle sunulmaktadır:

1. **Açık Kaynak Sürüm:** Bireysel geliştiriciler ve akademik incelemeler için **GNU AGPLv3** lisansına tabidir.
2. **Kurumsal / Ticari Lisans:** Kamu kurumları, bakanlıklar ve özel entegratörler için intranet dağıtımı, kaynak kodu açma muafiyeti ve özel teknik destek imkânı sağlayan kurumsal lisans mevcuttur.

İletişim ve kurumsal talepler için: **[iletisim@ilyasbozdemir.dev](mailto:iletisim@ilyasbozdemir.dev)**
