import type { ModulPaketi } from '../modulMagazasi.types'

export const RESMI_MODUL_PAKETLERI: ModulPaketi[] = [
  {
    id: 'kik-dogrudan-temin-22d',
    kod: 'KİK-22-D',
    baslik: '4734 Doğrudan Temin Süreç & Belge Paketi',
    kisaAciklama:
      '4734 Sayılı Kanun Madde 22/d uyarınca parasal limitler dahilinde mal, hizmet ve yapım alımları süreç yönetimi.',
    detayliAciklama:
      'Belediyeler, il özel idareleri ve kamu kurumları için doğrudan temin (22/d) mevzuatına tam uyumlu; piyasa araştırmasından muayene kabule kadar 8 aşamalı tam entegre belge ve süreç paketi.',
    mevzuat: '4734 Sayılı KİK m.22/d',
    kategori: 'alim_ihale',
    ikon: 'FileCheck',
    renk: 'blue',
    durum: 'kurulu',
    versiyon: 'v2.4.0',
    etiketler: ['Doğrudan Temin', '22/d', 'Piyasa Araştırması', 'Resmi Onay'],
    araclar: ['KİK Parasal Limit Denetleyicisi', 'KDV Tevkifat Hesaplama', 'EKAP Yasaklılık Kontrol'],
    asamalar: [
      { sira: 1, baslik: 'İhtiyaç Tespiti & Talep', aciklama: 'Birim talep fişi ve ihtiyaç gerekçesinin oluşturulması.' },
      { sira: 2, baslik: 'Harcama Yetkilisi Onayı', aciklama: '22/d Onay Belgesi ve bütçe ödeneği bloke işlemi.' },
      { sira: 3, baslik: 'Piyasa Fiyat Araştırması', aciklama: 'Firmalara teklif isteme mektubu ve tekliflerin toplanması.' },
      { sira: 4, baslik: 'Piyasa Araştırma Tutanağı', aciklama: 'En avantajlı teklifin tespiti ve komisyon/görevli imzaları.' },
      { sira: 5, baslik: 'Sipariş veya Sözleşme', aciklama: 'Yükleniciye sipariş mektubu veya doğrudan temin sözleşmesi.' },
      { sira: 6, baslik: 'Muayene & Kabul', aciklama: 'Malın/hizmetin teslim alınarak kabul tutanağının düzenlenmesi.' },
      { sira: 7, baslik: 'Ödeme Emri & Muhasebe', aciklama: 'Fatura tahakkuk müzekkeresi ve harcama evraklarının teslimi.' }
    ],
    belgeler: [
      { ad: 'İhtiyaç ve Talep Müzekkeresi', kod: 'DT-01', aciklama: 'Alımı yapacak servis tarafından düzenlenen gerekçeli talep formu.', zorunluMu: true },
      { ad: 'Doğrudan Temin Onay Belgesi (Standart Form)', kod: 'DT-02', aciklama: 'Harcama yetkilisinden alınan resmi harcama talimatı.', zorunluMu: true },
      { ad: 'Piyasa Fiyat Araştırması Teklif Mektubu', kod: 'DT-03', aciklama: 'Firmalardan kaşeli/imzalı teklif almak için gönderilen mektup.', zorunluMu: true },
      { ad: 'Piyasa Fiyat Araştırması Tutanağı', kod: 'DT-04', aciklama: 'Fiyatların kıyaslandığı ve en uygun teklifin açıklandığı tutanak.', zorunluMu: true },
      { ad: 'Muayene ve Kabul Komisyonu Tutanağı', kod: 'DT-05', aciklama: 'Teslim edilen mal veya hizmetin şartlara uygunluğunu tescil eden evrak.', zorunluMu: true },
      { ad: 'Doğrudan Temin Tip Sözleşmesi', kod: 'DT-06', aciklama: 'Gerektiğinde firma ile idare arasında imzalanan taahhüt sözleşmesi.', zorunluMu: false },
      { ad: 'Sipariş ve Bildirim Mektubu', kod: 'DT-07', aciklama: 'Yüklenici firmaya işin verildiğini bildiren resmi tebligat.', zorunluMu: false },
      { ad: 'Harcama Pusulası / Dizi Pusulası', kod: 'DT-08', aciklama: 'Dosyadaki tüm evrakların sırasını gösteren klasör kapak fihristi.', zorunluMu: false }
    ]
  },
  {
    id: 'dik-devlet-ihale-2886',
    kod: 'DİK-2886',
    baslik: '2886 Devlet İhale Kanunu Paketi (Satış & Kiralama)',
    kisaAciklama:
      'Taşınmaz satış, kiralama, trampa ve irtifak hakkı tesisine yönelik encümen onaylı gelir ihaleleri paketi.',
    detayliAciklama:
      'Kamu ve belediye mülklerinin 2886 Sayılı Kanun Madde 35, 36, 45 ve 51 kapsamında ihale edilmesi için şartnameler, kıymet takdir kararları, ilan metinleri ve sözleşmeler paketi.',
    mevzuat: '2886 Sayılı DİK m.35-51',
    kategori: 'satis_kiralama',
    ikon: 'Landmark',
    renk: 'emerald',
    durum: 'kurulabilir',
    versiyon: 'v2.1.0',
    etiketler: ['2886', 'Gelir İhalesi', 'Taşınmaz Satışı', 'Kira', 'Encümen'],
    araclar: ['Muhammen Bedel & %3 Geçici Teminat Hesabı', 'Yİ-ÜFE Kira Artış Robotu', 'İhale Usul Karar Matrisi'],
    asamalar: [
      { sira: 1, baslik: 'Taşınmaz Tespiti & Tapu Kaydı', aciklama: 'Ada, parsel, yüzölçümü ve mülkiyet bilgilerinin tescili.' },
      { sira: 2, baslik: 'Kıymet Takdiri (Muhammen Bedel)', aciklama: 'Takdir komisyonunca tahmini bedel ve geçici teminatın belirlenmesi.' },
      { sira: 3, baslik: 'İhale Onayı & Usul Seçimi', aciklama: 'Encümen / İta amirinden alınan onay ve 45/36/51 usul tespiti.' },
      { sira: 4, baslik: 'Şartname ve İlan Yayını', aciklama: 'Resmi Gazete veya yerel gazetede ilan metninin yayınlanması.' },
      { sira: 5, baslik: 'İhale Günü & Teklifler', aciklama: 'Zarf açımı, açık artırma peyleri ve komisyon kararının yazımı.' },
      { sira: 6, baslik: 'Onay, Tebligat & Kesinleşme', aciklama: 'İta amiri onayı ve istekliye noter/iadeli taahhütlü tebligat.' },
      { sira: 7, baslik: 'Sözleşme & Feragat / Teslim', aciklama: 'Bedelin tahsili, kira sözleşmesi veya tapu devir işlemleri.' }
    ],
    belgeler: [
      { ad: '2886 İhale Onay Belgesi', kod: 'DI-01', aciklama: 'Encümene sunulacak ihale açılış onayı.', zorunluMu: true },
      { ad: 'Kıymet Takdir Komisyonu Raporu', kod: 'DI-02', aciklama: 'Taşınmazın muhammen bedelinin tespit edildiği gerekçeli rapor.', zorunluMu: true },
      { ad: 'Taşınmaz Satış / Kira İdari Şartnamesi', kod: 'DI-03', aciklama: 'İhaleye katılma koşullarını belirten şartname metni.', zorunluMu: true },
      { ad: 'Basın ve Gazete İlan Metni Taslağı', kod: 'DI-04', aciklama: '2886 m.17 gereğince yayınlanacak standart ilan metni.', zorunluMu: true },
      { ad: 'İhale Komisyonu (Encümen) Kararı', kod: 'DI-05', aciklama: 'İhalenin kime kaldığını bildiren resmi karar zaptı.', zorunluMu: true },
      { ad: 'Taşınmaz Teslim & Tahliye Taahhüdü', kod: 'DI-06', aciklama: 'Taşınmazın alıcıya veya kiracıya teslim tutanağı.', zorunluMu: false },
      { ad: 'Kira Sözleşmesi Tasarısı (2886)', kod: 'DI-07', aciklama: 'Kira süresi ve artış oranlarını bağlayan resmi sözleşme.', zorunluMu: false }
    ]
  },
  {
    id: 'kik-acik-ihale-19-21',
    kod: 'KİK-19/21',
    baslik: '4734 Açık İhale & Pazarlık Süreç Modülü',
    kisaAciklama:
      'KİK Madde 19 (Açık İhale) ve Madde 21 (Pazarlık Usulü) tam kapsamlı ihale dosyası ve EKAP uyum paketi.',
    detayliAciklama:
      'Büyük ölçekli mal, hizmet ve danışmanlık ihaleleri için İKN alma hazırlığından teklif zarflarının açılmasına, aşırı düşük sorgulamasından kesin teminat ve sözleşmeye kadar ana ihale motoru.',
    mevzuat: '4734 Sayılı KİK m.19, m.21/b, m.21/f',
    kategori: 'alim_ihale',
    ikon: 'Gavel',
    renk: 'purple',
    durum: 'kurulabilir',
    versiyon: 'v3.0.0',
    etiketler: ['Açık İhale', 'Pazarlık 21/b', 'EKAP', 'Komisyon Kararı', 'İdari Şartname'],
    araclar: ['Sınır Değer & R Katsayısı Hesaplayıcı', 'Kesin Teminat Oranı Takvimi', 'EKAP Form Eşleştirici'],
    asamalar: [
      { sira: 1, baslik: 'İhale İhtiyacı & Teknik Şartname', aciklama: 'Teknik şartname hazırlığı ve birim onay süreci.' },
      { sira: 2, baslik: 'Yaklaşık Maliyet Tespiti', aciklama: 'Kapsamlı piyasa sorgusu ve onaylı detay cetvelinin oluşturulması.' },
      { sira: 3, baslik: 'İhale Onayı & Komisyon Teşkili', aciklama: 'KİK standart ihale onay formu ve asil/yedek komisyon atamaları.' },
      { sira: 4, baslik: 'İdari Şartname & Sözleşme Tasarısı', aciklama: 'Tip şartnameye uygun yeterlik kriterlerinin belirlenmesi.' },
      { sira: 5, baslik: 'EKAP İKN & İlan Süreci', aciklama: 'İhale Kayıt Numarası ile ilan gün ve sürelerinin takvime bağlanması.' },
      { sira: 6, baslik: 'Zarf Açma & Teklif Değerlendirme', aciklama: 'Geçici teminat ve yeterlik belgeleri kontrolü; 1. ve 2. oturumlar.' },
      { sira: 7, baslik: 'Sınır Değer & Kesinleşen Karar', aciklama: 'Aşırı düşük incelemesi ve gerekçeli ihale komisyon kararının yazımı.' },
      { sira: 8, baslik: 'Kesinleşme Tebligatı & Sözleşme', aciklama: 'İtiraz süreleri (10 gün) sonrası kesin teminat alımı ve tescil.' }
    ],
    belgeler: [
      { ad: 'KİK İhale Onay Belgesi (Standart Form KİK001)', kod: 'KIK-01', aciklama: 'İhale yetkilisinden alınan ana ihale onay formu.', zorunluMu: true },
      { ad: 'İdari Şartname Taslağı (KİK Standart Form)', kod: 'KIK-02', aciklama: 'İhaleye katılım ve yeterlik kurallarını içeren şartname.', zorunluMu: true },
      { ad: 'Fiyatlı Yaklaşık Maliyet Hesap Cetveli', kod: 'KIK-03', aciklama: 'Gizli zarfta tutulan detaylı maliyet dökümü.', zorunluMu: true },
      { ad: 'İhale Komisyonu Atama ve Görevlendirme Kararı', kod: 'KIK-04', aciklama: 'Uzman üyeler ve muhasebe yetkilisi görev tebliği.', zorunluMu: true },
      { ad: 'Zarf Açma ve İstekli Yoklama Tutanağı', kod: 'KIK-05', aciklama: '1. Oturumda teklif zarflarının kontrolü ve tutanağı.', zorunluMu: true },
      { ad: 'Sınır Değer ve Aşırı Düşük Teklif Hesap Tablosu', kod: 'KIK-06', aciklama: 'Kanuni formüle göre sınır değer tespiti.', zorunluMu: true },
      { ad: 'Gerekçeli İhale Komisyon Kararı', kod: 'KIK-07', aciklama: 'Ekonomik açıdan en avantajlı teklifi bildiren resmi karar.', zorunluMu: true },
      { ad: 'Kesinleşen İhale Kararı Tebligat Mektubu', kod: 'KIK-08', aciklama: 'Tüm isteklilere gönderilen resmi sonuç bildirimi.', zorunluMu: true },
      { ad: 'Sözleşmeye Davet Mektubu & Sözleşme Tasarısı', kod: 'KIK-09', aciklama: 'Kesin teminat yatırma çağrısı ve sözleşme metni.', zorunluMu: true }
    ]
  },
  {
    id: 'kik-istisnalar-22-abc',
    kod: 'KİK-İSTİSNA',
    baslik: '4734 İstisnalar & Özel Teminler (22/a, 22/b, 22/c, 22/e)',
    kisaAciklama:
      'Tek satıcı, fikri ve sınai mülkiyet, mevcut malın tamamlayıcısı ve taşınmaz kiralama özel alım gerekçeleri.',
    detayliAciklama:
      'Piyasa araştırması yapılamayan tek satıcı durumları (22/a), müelliflik ve sanat eserleri (22/b), mevcut sistemin devamı yedek parça ve lisanslar (22/c) ile bina kiralama (22/e) işlemleri için gerekçeli raporlar paketi.',
    mevzuat: '4734 Sayılı KİK m.22/a, b, c, e',
    kategori: 'ozel_istisna',
    ikon: 'ShieldCheck',
    renk: 'amber',
    durum: 'kurulabilir',
    versiyon: 'v1.8.0',
    etiketler: ['Tek Satıcı', 'Yedek Parça', 'Lisans', 'Taşınmaz Kiralama', 'Müelliflik'],
    araclar: ['Tek Satıcılık Belgesi Doğrulama', 'Ekspertiz Kira Bedel Tespit Formülü'],
    asamalar: [
      { sira: 1, baslik: 'Gerekçe ve İstisna Tespiti', aciklama: 'Alımın neden 22/a, b veya c kapsamına girdiğine dair teknik rapor.' },
      { sira: 2, baslik: 'Fiyat Görüşmesi & Pazarlık', aciklama: 'Tek yetkili firma ile fiyat üzerinde protokol görüşmesi.' },
      { sira: 3, baslik: 'Onay ve Sözleşme Tescili', aciklama: 'Gerekçeli karar ve taahhüt sözleşmesinin imzalanması.' }
    ],
    belgeler: [
      { ad: 'Tek Kaynaktan Temin Gerekçe Raporu (22/a)', kod: 'İST-01', aciklama: 'Piyasada başka satıcı bulunmadığını kanıtlayan resmi rapor.', zorunluMu: true },
      { ad: 'Fikri ve Sanat Eseri Alım Tutanağı (22/b)', kod: 'İST-02', aciklama: 'Eser sahibi veya varisinden alım yapma gerekçe tutanağı.', zorunluMu: true },
      { ad: 'Mevcut Malın Devamı / Uyumluluk Raporu (22/c)', kod: 'İST-03', aciklama: 'Yedek parça ve yazılım bakım gerekçesi teknik heyet raporu.', zorunluMu: true },
      { ad: 'Taşınmaz Kiralama Ekspertiz Kararı (22/e)', kod: 'İST-04', aciklama: 'Hizmet binası vb. kiralama bedeli tespit tutanağı.', zorunluMu: true }
    ]
  },
  {
    id: 'yapim-fen-isleri-hakedis',
    kod: 'FEN-HAKEDİŞ',
    baslik: 'Fen İşleri, Park & Bahçeler Hakediş & Metraj Paketi',
    kisaAciklama:
      'Yapım ve bakım işleri için yer teslimi, metraj cetvelleri, ataşman defteri, yeşil defter ve hakediş kapakları.',
    detayliAciklama:
      'Park yapımları, yol ve bina tadilatları gibi sahada imalat gerektiren alımlarda yükleniciye ara ve kesin hakediş ödemesi yapmak için gereken tüm mühendislik ve kontrolörlük evrakları.',
    mevzuat: 'Yapım İşleri Genel Şartnamesi & 4735 Sayılı Kanun',
    kategori: 'yapim_hakedis',
    ikon: 'Wrench',
    renk: 'rose',
    durum: 'kurulabilir',
    versiyon: 'v2.0.0',
    etiketler: ['Hakediş', 'Yeşil Defter', 'Metraj', 'Ataşman', 'Yer Teslimi', 'Geçici Kabul'],
    araclar: ['Yapım Fiyat Farkı (Bakanlar Kurulu Kararı)', 'KDV & Stopaj Kesinti Robotu', 'Metraj Çarpım Tablosu'],
    asamalar: [
      { sira: 1, baslik: 'Yer Teslimi & İş Programı', aciklama: 'Şantiyenin yükleniciye teslimi ve haftalık/aylık iş planı onayı.' },
      { sira: 2, baslik: 'İmalat & Metraj Cetveli', aciklama: 'Sahada yapılan işlerin ölçümü ve ataşman defteri kaydı.' },
      { sira: 3, baslik: 'Hakediş Raporunun Tanzimi', aciklama: 'Yeşil defterden hakediş arka kapağına aktarım ve kesintiler.' },
      { sira: 4, baslik: 'Geçici & Kesin Kabul', aciklama: 'Teknik heyet kabul tutanakları ve teminat iadesi süreci.' }
    ],
    belgeler: [
      { ad: 'Yer Teslim Tutanağı (Şantiye Açılışı)', kod: 'HKD-01', aciklama: 'İşe başlama tarihini resmi olarak başlatan tutanak.', zorunluMu: true },
      { ad: 'İmalat Metraj ve Ataşman Cetveli', kod: 'HKD-02', aciklama: 'Yapılan imalat miktarlarının sahada tutulan ölçüm kaydı.', zorunluMu: true },
      { ad: 'Yeşil Defter (Hakediş İcmali)', kod: 'HKD-03', aciklama: 'Birim fiyatlarla yapılan imalatların parasal dökümü.', zorunluMu: true },
      { ad: 'Hakediş Arka Kapağı ve Kesintiler Cetveli', kod: 'HKD-04', aciklama: 'Stopaj, avans, gecikme cezası ve net ödenecek tutar özeti.', zorunluMu: true },
      { ad: 'Geçici Kabul Komisyonu Tutanağı', kod: 'HKD-05', aciklama: 'İşin bitiminde oluşturulan kontrol heyeti kabul tutanağı.', zorunluMu: true },
      { ad: 'Kesin Kabul ve Teminat İade Yazısı', kod: 'HKD-06', aciklama: 'Teminat süresi sonunda teminatın çözülmesi yazısı.', zorunluMu: false }
    ]
  }
]
