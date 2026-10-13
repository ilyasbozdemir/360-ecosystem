import type { ModulPaketi } from '../modulMagazasi.types'

export const RESMI_MODUL_PAKETLERI: ModulPaketi[] = [
  // =========================================================================
  // 1. SÜREÇ & KANUN MODÜLLERİ (paketTipi: 'modul')
  // =========================================================================
  {
    id: 'kik-dogrudan-temin-22d',
    kod: 'KİK-22-D',
    paketTipi: 'modul',
    baslik: '4734 Doğrudan Temin Süreç & Belge Paketi',
    kisaAciklama:
      '4734 Sayılı Kanun Madde 22/d uyarınca parasal limitler dahilinde mal, hizmet ve yapım alımları süreç yönetimi.',
    detayliAciklama:
      'Belediyeler, il özel idareleri ve kamu kurumları için doğrudan temin (22/d) mevzuatına tam uyumlu; piyasa araştırmasından muayene kabule kadar 8 aşamalı tam entegre belge ve süreç paketi.',
    mevzuat: '4734 Sayılı KİK m.22/d',
    kategori: 'alim_ihale',
    ikon: 'FileCheck',
    renk: 'blue',
    versiyon: 'v2.4.0',
    surumAsamasi: 'Beta',
    etiketler: ['Doğrudan Temin', '22/d', 'Piyasa Araştırması', 'Resmi Onay'],
    removable: false,
    silinebilir: false,
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
    id: 'ebys-resmi-yazisma-studyosu',
    kod: 'EBYS-STD',
    paketTipi: 'modul',
    baslik: 'Türkçe EBYS Resmî Yazışma Şablonları & Stüdyosu',
    kisaAciklama:
      'Resmî Yazışmalarda Uygulanacak Usul ve Esaslar Hakkında Yönetmelik ve e-Yazışma Paketi (EYP 2.0) uyumlu şablon ve stüdyo paketi.',
    detayliAciklama:
      'Tüm kamu kurum ve kuruluşları, belediyeler ve üniversiteler için Resmî Yazışma Yönetmeliğine tam uyumlu üst yazı, iç yazışma, olur/onay, dağıtımlı yazılar ve rota motoru stüdyosu.',
    mevzuat: 'Resmî Yazışma Yönetmeliği & EYP 2.0',
    kategori: 'entegrasyon',
    ikon: 'FileText',
    renk: 'indigo',
    versiyon: 'v1.0.0',
    surumAsamasi: 'Kararlı',
    etiketler: ['EBYS', 'Resmî Yazışma', 'Üst Yazı', 'Olur/Onay', 'EYP 2.0'],
    removable: false,
    silinebilir: false,
    araclar: ['EYP 2.0 Doğrulayıcı', 'Dinamik Makam Hitap Üretici', 'EBYS Rota & Paraf Motoru'],
    asamalar: [
      { sira: 1, baslik: 'Taslak Hazırlama & Şablon Seçimi', aciklama: 'Resmî yazı tipine göre uygun EYP şablonunun seçilmesi.' },
      { sira: 2, baslik: 'Muhatap & Dağıtım Belirleme', aciklama: 'Gereği ve bilgi muhataplarının ve hitap hiyerarşisinin belirlenmesi.' },
      { sira: 3, baslik: 'Paraf & İmza Rotası', aciklama: 'Hazırlayan, kontrol eden ve imza makamı hiyerarşik onay adımları.' },
      { sira: 4, baslik: 'Üretim & e-Yazışma Paketi', aciklama: 'Resmi antetli çıktının üretilmesi ve evrak doğrulama kodlaması.' }
    ],
    belgeler: [
      { ad: 'Resmî Üst Yazı Şablonu', kod: 'EBYS-01', aciklama: 'Kurumlar arası giden evrak standart şablonu.', zorunluMu: true },
      { ad: 'Birim İçi Olur / Onay Yazısı', kod: 'EBYS-02', aciklama: 'Makam onayına sunulan teklif ve olur belgesi.', zorunluMu: true },
      { ad: 'Dağıtımlı Genelge / Duyuru Yazısı', kod: 'EBYS-03', aciklama: 'Çoklu birim veya dış idarelere hitap eden dağıtımlı yazı.', zorunluMu: false },
      { ad: 'İç Yazışma / Müzekkere', kod: 'EBYS-04', aciklama: 'Birimler arası bilgi ve koordinasyon yazısı.', zorunluMu: false }
    ]
  },
  {
    id: 'dik-devlet-ihale-2886',
    kod: 'DİK-2886',
    paketTipi: 'modul',
    baslik: '2886 Devlet İhale Kanunu Paketi (Satış & Kiralama)',
    kisaAciklama:
      'Taşınmaz satış, kiralama, trampa ve irtifak hakkı tesisine yönelik encümen onaylı gelir ihaleleri paketi.',
    detayliAciklama:
      'Kamu ve belediye mülklerinin 2886 Sayılı Kanun Madde 35, 36, 45 ve 51 kapsamında ihale edilmesi için şartnameler, kıymet takdir kararları, ilan metinleri ve sözleşmeler paketi.',
    mevzuat: '2886 Sayılı DİK m.35-51',
    kategori: 'satis_kiralama',
    ikon: 'Landmark',
    renk: 'emerald',
    versiyon: 'v2.1.0',
    surumAsamasi: 'Alfa',
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
    paketTipi: 'modul',
    baslik: '4734 Açık İhale & Pazarlık Süreç Modülü',
    kisaAciklama:
      'KİK Madde 19 (Açık İhale) ve Madde 21 (Pazarlık Usulü) tam kapsamlı ihale dosyası ve EKAP uyum paketi.',
    detayliAciklama:
      'Büyük ölçekli mal, hizmet ve danışmanlık ihaleleri için İKN alma hazırlığından teklif zarflarının açılmasına, aşırı düşük sorgulamasından kesin teminat ve sözleşmeye kadar ana ihale motoru.',
    mevzuat: '4734 Sayılı KİK m.19, m.21/b, m.21/f',
    kategori: 'alim_ihale',
    ikon: 'Gavel',
    renk: 'purple',
    versiyon: 'v3.0.0',
    surumAsamasi: 'Alfa',
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
    paketTipi: 'modul',
    baslik: '4734 İstisnalar & Özel Teminler (22/a, 22/b, 22/c, 22/e)',
    kisaAciklama:
      'Tek satıcı, fikri ve sınai mülkiyet, mevcut malın tamamlayıcısı ve taşınmaz kiralama özel alım gerekçeleri.',
    detayliAciklama:
      'Piyasa araştırması yapılamayan tek satıcı durumları (22/a), müelliflik ve sanat eserleri (22/b), mevcut sistemin devamı yedek parça ve lisanslar (22/c) ile bina kiralama (22/e) işlemleri için gerekçeli raporlar paketi.',
    mevzuat: '4734 Sayılı KİK m.22/a, b, c, e',
    kategori: 'ozel_istisna',
    ikon: 'ShieldCheck',
    renk: 'amber',
    versiyon: 'v1.8.0',
    surumAsamasi: 'Alfa',
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
    paketTipi: 'modul',
    baslik: 'Fen İşleri, Park & Bahçeler Hakediş & Metraj Paketi',
    kisaAciklama:
      'Yapım ve bakım işleri için yer teslimi, metraj cetvelleri, ataşman defteri, yeşil defter ve hakediş kapakları.',
    detayliAciklama:
      'Park yapımları, yol ve bina tadilatları gibi sahada imalat gerektiren alımlarda yükleniciye ara ve kesin hakediş ödemesi yapmak için gereken tüm mühendislik ve kontrolörlük evrakları.',
    mevzuat: 'Yapım İşleri Genel Şartnamesi & 4735 Sayılı Kanun',
    kategori: 'yapim_hakedis',
    ikon: 'FileSpreadsheet',
    renk: 'cyan',
    versiyon: 'v2.0.0',
    surumAsamasi: 'Alfa',
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
  },

  // =========================================================================
  // 2. HESAPLAMA ARAÇLARI & YARDIMCILAR (paketTipi: 'utils')
  // =========================================================================
  {
    id: 'arac-vergi-tevkifat',
    kod: 'HSP-VERGİ',
    paketTipi: 'utils',
    baslik: 'Damga Vergisi, Stopaj & KDV Tevkifat Hesaplayıcı',
    kisaAciklama:
      'İhale ve doğrudan teminlerde binde 9,48 damga vergisi, 2/10 - 9/10 tevkifat ve net-brüt tahakkuk hesabı.',
    detayliAciklama:
      '488 Sayılı Damga Vergisi Kanunu ve 3065 Sayılı KDV Kanunu genel tebliğleri doğrultusunda sözleşme ve karar pulu kesintilerini, KDV tevkifat oranlarını ve ödeme emri net tutarlarını kuruşu kuruşuna hesaplar.',
    mevzuat: '488 S. Damga Vergisi & 3065 S. KDV Kanunu',
    kategori: 'finans_hesap',
    ikon: 'Coins',
    renk: 'amber',
    versiyon: 'v2.2.0',
    surumAsamasi: 'Kararlı',
    etiketler: ['KDV Tevkifat', 'Damga Vergisi', 'Stopaj', 'Tahakkuk', 'Net-Brüt'],
    araclar: ['Tevkifat Matrah Motoru', 'Binde 9.48 ve Binde 5.69 Kesinti Tablosu', 'Ödeme Emri Net Tutar Dağıtıcısı'],
    asamalar: [
      { sira: 1, baslik: 'Fatura / Hakediş Matrah Girişi', aciklama: 'KDV hariç veya dahil tutarın Decimal duyarlılıkla girilmesi.' },
      { sira: 2, baslik: 'Tevkifat Oranı Seçimi', aciklama: 'Tebliğe uygun 2/10, 5/10, 7/10 veya 9/10 tevkifat türünün belirlenmesi.' },
      { sira: 3, baslik: 'Kesintiler ve Net Tutar', aciklama: 'Damga vergisi, KİK payı ve gelir stopajı düşülerek net ödemenin dökülmesi.' }
    ],
    belgeler: [
      { ad: 'Vergi ve Tevkifat Hesap Tablosu', kod: 'VRG-01', aciklama: 'Muhasebe işlem fişine iliştirilecek detaylı hesap pusulası.', zorunluMu: true },
      { ad: 'Net-Brüt Hakediş Kesinti İcmali', kod: 'VRG-02', aciklama: 'Yükleniciye ödenecek ve vergi dairesine yatırılacak tutarlar özeti.', zorunluMu: true }
    ]
  },
  {
    id: 'arac-tuik-fiyat-farki',
    kod: 'HSP-FİYAT-FARKI',
    paketTipi: 'utils',
    baslik: 'TÜİK Fiyat Farkı & Katsayı Hesaplama Motoru',
    kisaAciklama:
      'Mal, hizmet ve yapım sözleşmelerinde Yİ-ÜFE ve TÜFE endeksleri üzerinden resmi fiyat farkı hesabı.',
    detayliAciklama:
      '4734 Sayılı Kanun Madde 8 ve 4735 Sayılı Kanuna dayalı Fiyat Farkı Esasları uyarınca ihale tarihi ile hakediş/teslim tarihi arasındaki endeks değişimlerini (Pn, Po formülü) tek tıkla hesaplar.',
    mevzuat: '4734 S. Kanun m.8 & Bakanlar Kurulu Fiyat Farkı Esasları',
    kategori: 'finans_hesap',
    ikon: 'TrendingUp',
    renk: 'blue',
    versiyon: 'v1.9.0',
    surumAsamasi: 'Alfa',
    etiketler: ['Fiyat Farkı', 'TÜİK Endeks', 'Yİ-ÜFE', 'Pn Katsayısı', 'Akaryakıt'],
    araclar: ['Ağırlık Oranları (a,b,c,d) Matrisi', 'Akaryakıt & Çimento Katsayıları', 'Kümülatif Fark Çıktısı'],
    asamalar: [
      { sira: 1, baslik: 'Temel Endeks Belirleme (Po)', aciklama: 'İhale veya teklif tarihinin ait olduğu ayın Yİ-ÜFE genel/özel endeksi.' },
      { sira: 2, baslik: 'Uygulama Ayı Endeksi (Pn)', aciklama: 'Hakedişin veya mal tesliminin gerçekleştiği ayın güncel endeksi.' },
      { sira: 3, baslik: 'Pn Katsayısı ve Fark Hesabı', aciklama: 'F = An x B x (Pn - 1) formülü ile net ödenecek fiyat farkı çıktısı.' }
    ],
    belgeler: [
      { ad: 'Fiyat Farkı Hesap Cetveli', kod: 'FF-01', aciklama: 'İdare ve yüklenici onayına sunulan resmi katsayı hesap tablosu.', zorunluMu: true },
      { ad: 'TÜİK Endeks Karşılaştırma Raporu', kod: 'FF-02', aciklama: 'İlgili aylara ait resmi bülten endekslerinin dökümü.', zorunluMu: false }
    ]
  },
  {
    id: 'arac-gecikme-cezasi-faiz',
    kod: 'HSP-CEZA-FAİZ',
    paketTipi: 'utils',
    baslik: 'Gecikme Cezası & Yasal Faiz Hesaplayıcı',
    kisaAciklama:
      'Taahhüdün süresinde yerine getirilmemesi durumunda günlük ceza kesintisi ve 3095 S. yasal temerrüt faizi.',
    detayliAciklama:
      'Tip sözleşmelerdeki onbinde 3 ile onbinde 5 arasındaki gecikme cezası oranlarını tatil günleri dahil net takvim gününe göre hesaplar; alacak/borç ilişkilerinde yasal ve ticari temerrüt faizini çıkarır.',
    mevzuat: '3095 Sayılı Kanuni Faiz ve Temerrüt Faizi Kanunu',
    kategori: 'finans_hesap',
    ikon: 'Clock',
    renk: 'rose',
    versiyon: 'v1.5.0',
    surumAsamasi: 'Alfa',
    etiketler: ['Gecikme Cezası', 'Yasal Faiz', 'Temerrüt', 'Onbinde 5', 'Sözleşme Feshi'],
    araclar: ['Günlük Ceza Oranı Çarpımı', 'TCMB Avans/Temerrüt Faiz Oranları', 'Hakedişten Mahsup Çizelgesi'],
    asamalar: [
      { sira: 1, baslik: 'Sözleşme Bitiş & Teslim Tarihi', aciklama: 'İşin bitirilmesi gereken gün ile fiili teslim günü arasındaki fark.' },
      { sira: 2, baslik: 'Sözleşme Bedeli ve Oran', aciklama: 'İhale sözleşmesinde yazılı günlük ceza oranının (onbinde 3-5) işletilmesi.' },
      { sira: 3, baslik: 'İrat Kaydı veya Kesinti', aciklama: 'Cezanın hakedişten kesilmesi veya teminattan tahsil kararı.' }
    ],
    belgeler: [
      { ad: 'Gecikme Cezası Tahakkuk Müzekkeresi', kod: 'CZ-01', aciklama: 'Muhasebeye bildirilen ceza kesinti yazısı.', zorunluMu: true },
      { ad: 'Süre Uzatımı ve İhtarlı Tebligat Tutanağı', kod: 'CZ-02', aciklama: 'Firmaya verilen ek süre ve ceza uyarısı resmi bildirimi.', zorunluMu: false }
    ]
  },
  {
    id: 'arac-sayi-yazi-cevirici',
    kod: 'HSP-YAZI-ÇEVİR',
    paketTipi: 'utils',
    baslik: 'Çift Yönlü Sayı ↔ Yazı & Metin Çevirici',
    kisaAciklama:
      'Rakamla yazılan parasal tutarları kuruş haneli Türkçe metne, metinleri sayısal tutara dönüştürür.',
    detayliAciklama:
      'Sözleşmelerde, teklif mektuplarında ve kabul tutanaklarında zorunlu olan "Yalnız ... Türk Lirası ... Kuruş" ibaresini hatasız oluşturur; kopyalanan metinlerdeki yazılı tutarları anında sayıya çevirir.',
    mevzuat: 'Maliye Muhasebe Standartları & TTK Genel Hükümleri',
    kategori: 'finans_hesap',
    ikon: 'Calculator',
    renk: 'emerald',
    versiyon: 'v2.0.0',
    surumAsamasi: 'Kararlı',
    etiketler: ['Yazıyla Tutar', 'Kuruş Formatlama', 'Çift Yönlü', 'Sözleşme Metni'],
    araclar: ['Decimal.js Yüksek Hassasiyet', 'Çift Yönlü Algılama', 'Standart Banka / Çek İbaresi'],
    asamalar: [
      { sira: 1, baslik: 'Sayı veya Yazı Girişi', aciklama: 'Rakamla tutar girildiğinde anında metne; metin girildiğinde sayıya dönüştürür.' },
      { sira: 2, baslik: 'Kuruş & Para Birimi Biçimi', aciklama: 'TL/Kuruş, Dolar/Cent veya Euro/Cent biçiminde resmi standart metin üretir.' }
    ],
    belgeler: [
      { ad: 'Resmi Tutar Yazı Karşılığı Formu', kod: 'YZ-01', aciklama: 'Sözleşme ve teklif mektuplarına yapıştırılacak standart onay metni.', zorunluMu: false }
    ]
  },
  {
    id: 'arac-butce-tavani-denetim',
    kod: 'HSP-BÜTÇE-%10',
    paketTipi: 'utils',
    baslik: '%10 Bütçe Tavanı & Parasal Limit Denetleyicisi',
    kisaAciklama:
      '4734 Sayılı Kanun Madde 62/ı uyarınca doğrudan teminlerin bütçe ödeneğine oranını (%10) denetler.',
    detayliAciklama:
      'İdarenin bütçesine konulan ödeneklerin yüzde 10’unu aşan doğrudan temin (22/d) alımlarında Kamu İhale Kurulu izni zorunludur. Bu araç kurum bütçesini analiz ederek limit aşımı risklerini önceden raporlar.',
    mevzuat: '4734 Sayılı KİK m.62/ı & m.22/d',
    kategori: 'finans_hesap',
    ikon: 'Percent',
    renk: 'purple',
    versiyon: 'v1.4.0',
    surumAsamasi: 'Alfa',
    etiketler: ['%10 Bütçe Tavanı', '62/ı Maddesi', 'KİK İzin', 'Ödenek Takibi'],
    araclar: ['Yıllık Kümülatif Limit Grafiği', 'Kalan Güvenli Limit Uyarısı', 'Kurul İzni Başvuru Rehberi'],
    asamalar: [
      { sira: 1, baslik: 'Kurum Yıllık Mal/Hizmet Ödeneği', aciklama: 'Bütçe kanunu veya belediye meclisi onaylı yıllık başlangıç ödeneği.' },
      { sira: 2, baslik: 'Gerçekleşen 22/d Alımları Toplamı', aciklama: 'Yıl başından itibaren yapılan tüm doğrudan temin harcamaları.' },
      { sira: 3, baslik: '%10 Eşik Değer Alarmı', aciklama: '%8 seviyesinde sarı ikaz, %10 seviyesinde KİK izin gereklilik bildirimi.' }
    ],
    belgeler: [
      { ad: 'Yıllık %10 Doğrudan Temin İcmal Raporu', kod: 'BT-01', aciklama: 'Harcama yetkilisi ve Sayıştay denetimine sunulan tavan takip cetveli.', zorunluMu: true }
    ]
  },
  {
    id: 'arac-dinamik-formul-motoru',
    kod: 'HSP-FORMÜL',
    paketTipi: 'utils',
    baslik: 'Dinamik Formül Motoru & Birim Çevirici',
    kisaAciklama:
      'Ölçü birimleri dönüşümleri (m, m2, m3, ton), yoğunluk katsayıları ve kurum içi özel hesaplama formülleri.',
    detayliAciklama:
      'Fen işleri, destek hizmetleri ve fen metrajları için değişken parametreli (x, y, z) özel matematik formülleri oluşturup saklayabileceğiniz, birimler arası otomatik katsayı çevirimi sağlayan yardımcı motor.',
    mevzuat: 'Mühendislik Metraj & Standart Ölçü Formülleri',
    kategori: 'finans_hesap',
    ikon: 'Cpu',
    renk: 'cyan',
    versiyon: 'v1.6.0',
    surumAsamasi: 'Alfa',
    etiketler: ['Formül Motoru', 'Birim Çevirici', 'Metraj', 'Yoğunluk', 'Katsayı'],
    araclar: ['Ölçü Birimleri Matrisi', 'Özel Değişken Tanımlayıcı', 'Formül Kütüphanesi'],
    asamalar: [
      { sira: 1, baslik: 'Formül ve Parametre Tanımı', aciklama: 'Örn: Asfalt ton hesabı = Boy x En x Kalınlık x 2.4 yoğunluk katsayısı.' },
      { sira: 2, baslik: 'Değişkenlerin Girilmesi', aciklama: 'Saha ölçüm değerleri girilerek anında hesaplama üretimi.' }
    ],
    belgeler: [
      { ad: 'Dinamik Formül Hesap Çıktısı', kod: 'FM-01', aciklama: 'Yaklaşık maliyete dayanak oluşturan metraj detay dökümü.', zorunluMu: false }
    ]
  },

  // =========================================================================
  // 3. EKLENTİLER & ENTEGRASYONLAR (paketTipi: 'extension')
  // =========================================================================
  {
    id: 'ext-ekap-entegrator',
    kod: 'EXT-EKAP',
    paketTipi: 'extension',
    baslik: 'EKAP İKN & Yasaklılık Entegratörü',
    kisaAciklama:
      'EKAP üzerinden İhale Kayıt Numarası (İKN) eşitleme, firma yasaklılık teyit belgesi ve e-İhale bildirimleri.',
    detayliAciklama:
      'Elektronik Kamu Alımları Platformu (EKAP) ile dosya verilerini senkronize eder; firmaların vergi numarası ile KİK yasaklılar listesinde olup olmadığını tek tıkla sorgulayıp resmi teyit çıktısı üretir.',
    mevzuat: 'EKAP Yönetmeliği & 4734 Sayılı Kanun m.58',
    kategori: 'entegrasyon',
    ikon: 'Puzzle',
    renk: 'emerald',
    versiyon: 'v2.5.0',
    surumAsamasi: 'Alfa',
    etiketler: ['EKAP', 'İKN', 'Yasaklılık Sorgusu', 'e-İhale', 'Vergi Kimlik No'],
    araclar: ['Otomatik Yasaklılık Kontrolü', 'EKAP İKN Senkronizasyonu', 'e-Tebligat Takibi'],
    asamalar: [
      { sira: 1, baslik: 'VKN/TCKN ile Yasaklılık Sorgusu', aciklama: 'KİK resmi yasaklılık veri tabanından anlık teyit alma.' },
      { sira: 2, baslik: 'İKN Dosya Eşitleme', aciklama: 'EKAP üzerinde açılan ihalenin numarasını ve ilan metnini bağlama.' },
      { sira: 3, baslik: 'Teyit Belgesi Arşivi', aciklama: 'İhale günü alınan yasaklılık belgesinin dosya klasörüne eklenmesi.' }
    ],
    belgeler: [
      { ad: 'EKAP Yasaklılık Teyit Belgesi', kod: 'EKP-01', aciklama: 'İsteklinin ihalelere katılmaktan yasaklı olmadığını gösteren teyit çıktısı.', zorunluMu: true },
      { ad: 'EKAP İKN Bilgi Kartı', kod: 'EKP-02', aciklama: 'EKAP sistemindeki ihale özet parametreleri çıktısı.', zorunluMu: false }
    ]
  },
  {
    id: 'ext-sayistay-raporlayici',
    kod: 'EXT-SAYIŞTAY',
    paketTipi: 'extension',
    baslik: 'Sayıştay & İç Denetim Standartları Paketi',
    kisaAciklama:
      'Harcama ve ihale dosyalarını Sayıştay denetim kriterlerine göre tarar; eksik evrak ve riskleri raporlar.',
    detayliAciklama:
      '6085 Sayılı Sayıştay Kanunu ve Kamu İç Denetim Standartları uyarınca, denetim müfettişlerinin aradığı standart klasör fihristini, dizi pusulalarını ve mevzuat kontrol listelerini otomatik oluşturur.',
    mevzuat: '6085 Sayılı Sayıştay Kanunu & Kamu İç Denetim Kılavuzu',
    kategori: 'entegrasyon',
    ikon: 'ShieldCheck',
    renk: 'purple',
    versiyon: 'v1.7.0',
    surumAsamasi: 'Alfa',
    etiketler: ['Sayıştay', 'İç Denetim', 'Dizi Pusulası', 'Risk Taraması', 'Müfettiş Klasörü'],
    araclar: ['Eksik Evrak Erken Uyarı Sistemi', '5018 Harcama Kontrol Matrisi', 'Müfettiş Dizi Pusulası Çıktısı'],
    asamalar: [
      { sira: 1, baslik: 'Dosya Evrak Eksiklik Taraması', aciklama: 'Zorunlu tutanak ve onayların varlık kontrolü.' },
      { sira: 2, baslik: 'Mevzuat Maddesi Uygunluk Denetimi', aciklama: 'Parasal limit, tevkifat ve imza yetkisi doğruluk analizi.' },
      { sira: 3, baslik: 'Denetim Klasörü Paketi Çıktısı', aciklama: 'Sayıştay fihrist sıralamasına uygun PDF dizi pusulası oluşturma.' }
    ],
    belgeler: [
      { ad: 'Sayıştay Standart Dizi Pusulası', kod: 'SY-01', aciklama: 'Dosyadaki tüm evrakların sayfa numaralı fihrist listesi.', zorunluMu: true },
      { ad: 'İç Denetim Uygunluk Kontrol Raporu', kod: 'SY-02', aciklama: 'Olası zimmet ve kamu zararı risklerini önceden işaretleyen denetim raporu.', zorunluMu: false }
    ]
  },
  {
    id: 'ext-excel-aktarici',
    kod: 'EXT-EXCEL-DOC',
    paketTipi: 'extension',
    baslik: 'Akıllı Excel Tablo & Medya Dönüştürücü',
    kisaAciklama:
      'Pano veya Excel dosyasından kopyalanan yaklaşık maliyet tablolarını ve belgeleri tek tıkla içe aktarır.',
    detayliAciklama:
      'Excel veya web sayfalarından kopyalanan tablolardaki malzeme adı, miktar, birim fiyat ve KDV sütunlarını otomatik tanır; Word, PDF ve görsel belgeler arası format dönüşümünü yerel olarak gerçekleştirir.',
    mevzuat: 'Ofis ve Veri Entegrasyonu Standartları',
    kategori: 'entegrasyon',
    ikon: 'FileSpreadsheet',
    renk: 'blue',
    versiyon: 'v2.1.0',
    surumAsamasi: 'Beta',
    etiketler: ['Excel Aktarımı', 'Pano Yapıştırma', 'Tablo Ayrıştırıcı', 'PDF Dönüştürücü'],
    araclar: ['Clipboard Akıllı Parser', 'Sütun Otomatik Eşleştirici', 'Word/PDF Çıktı Motoru'],
    asamalar: [
      { sira: 1, baslik: 'Excel veya Pano Verisi Yapıştırma', aciklama: 'Ctrl+V ile tablonun panodan okunması.' },
      { sira: 2, baslik: 'Sütun Eşleme ve Doğrulama', aciklama: 'Malzeme adı, miktar ve fiyat sütunlarının otomatik tespiti.' },
      { sira: 3, baslik: 'Tek Tıkla Dosyaya Aktarım', aciklama: 'İhtiyaç listesi veya yaklaşık maliyet cetveline aktarım.' }
    ],
    belgeler: [
      { ad: 'Excel İçe Aktarım Doğrulama Raporu', kod: 'EX-01', aciklama: 'Aktarılan satır sayısı ve toplam maliyet teyit formu.', zorunluMu: false }
    ]
  },
  {
    id: 'kutuphane-belgelerim',
    kod: 'EXT-BELGELERIM',
    paketTipi: 'extension',
    baslik: 'Belgelerim & Şablon Kütüphanesi',
    kisaAciklama:
      'Kullanıcıya ait, serbestçe adlandırılıp gruplanan zengin metin belgeleri, dinamik yer tutucular ve koşullu bloklar stüdyosu.',
    detayliAciklama:
      'Sabit belge türü veya kategori dayatması olmaksızın; hiyerarşik grup ağacı, çoklu etiketleme, TipTap tabanlı A4 yazım alanı, yer tutucular, koşullu bloklar ve liste döngüleri, değişmez sürüm geçmişi ve JSON dışa/içe aktarma paketi sunan gelişmiş kütüphane eklentisi.',
    mevzuat: 'Kullanıcı Özel Belge Yönetimi',
    kategori: 'entegrasyon',
    ikon: 'FolderGit2',
    renk: 'emerald',
    versiyon: 'v1.0.0',
    surumAsamasi: 'Kararlı',
    etiketler: ['Belgelerim', 'Yer Tutucu', 'Koşullu Blok', 'A4 Editör', 'Sürümleme', 'JSON Paket'],
    removable: true,
    silinebilir: true,
    araclar: ['Kanonik TipTap Motoru', 'Güvenli Yer Tutucu Yeniden Adlandırma', 'Sürüm Karşılaştırma (Diff)', 'JSON Paket Doğrulayıcı'],
    asamalar: [
      { sira: 1, baslik: 'Serbest Gruplama & Belge Oluşturma', aciklama: 'İç içe klasörler ve etiketlerle belge alanını yapılandırma.' },
      { sira: 2, baslik: 'A4 Editörde Yer Tutucu & Koşul Tanımlama', aciklama: 'Kanonik etiketlerle dinamik alanlar ve şartlı metin blokları yazma.' },
      { sira: 3, baslik: 'Sürümleme & Değişmez Geçmiş', aciklama: 'Düzenlemeleri yeni sürümler olarak kaydetme ve karşılaştırma.' },
      { sira: 4, baslik: 'Formdan Doldurma & Çıktı / Dışa Aktarma', aciklama: 'Değerleri girerek anında derleme veya JSON paketi olarak arşivleme.' }
    ],
    belgeler: [
      { ad: 'Kullanıcı Özel Belgesi', kod: 'KB-01', aciklama: 'Kullanıcı tarafından oluşturulan dinamik içerikli belge.', zorunluMu: false }
    ]
  }
]
