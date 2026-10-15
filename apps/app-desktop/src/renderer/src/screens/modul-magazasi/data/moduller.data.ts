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
    yeniMi: true,
    altMetinOzeti: 'Lüzum kağıdı · onay belgesi · teklif mektupları · piyasa fiyat araştırma -...',
    routePath: '/surec-studyosu?modulId=kik-dogrudan-temin-22d',
    removable: true,
    silinebilir: true,
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
      {
        ad: 'Standart Form: İhtiyaç Belgesi ve Harcama Talep Müzekkeresi (4734 Sayılı KİK m.22 / MYHBY m.4/e)',
        kod: 'KİK-İHTİYAÇ / MYHBY-4/e',
        aciklama: '4734 Sayılı Kanun ve MYHBY m.4/e uyarınca harcama birimi tarafından düzenlenen gerekçeli talep ve alım başlatma belgesi.',
        zorunluMu: true
      },
      {
        ad: 'Standart Form-KİK024.0/M: Doğrudan Temin Onay Belgesi (Harcama Talimatı)',
        kod: 'Standart Form-KİK024.0/M',
        aciklama: '4734 Sayılı KİK m.22 gereğince harcama yetkilisinden alınan bütçe ödeneği bloke ve resmi harcama talimatı.',
        zorunluMu: true
      },
      {
        ad: 'Standart Form-KİK027.0/M: Birim Fiyat Teklif Mektubu ve Fiyat İsteme Formu',
        kod: 'Standart Form-KİK027.0/M',
        aciklama: '4734 Sayılı KİK m.22 kapsamında isteklilerden kaşeli/imzalı teklif almak için gönderilen resmi mektup.',
        zorunluMu: true
      },
      {
        ad: 'Standart Form (MYHBY Örnek No: 2): Piyasa Fiyat Araştırması Tutanağı',
        kod: 'MYHBY-Örnek:2 (KİK m.22)',
        aciklama: 'Fiyatların kıyaslandığı, en avantajlı teklifin ve görevlendirilen piyasa araştırma görevlilerinin imzalarının yer aldığı tutanak.',
        zorunluMu: true
      },
      {
        ad: 'Standart Form-KİK054.0/M: Mal Alımları Muayene ve Kabul Komisyonu Tutanağı',
        kod: 'Standart Form-KİK054.0/M',
        aciklama: 'Mal Alımları Denetim Muayene ve Kabul İşlemlerine Dair Yönetmelik uyarınca kabulü tescil eden resmi tutanak.',
        zorunluMu: true
      },
      {
        ad: 'Standart Form-KİK048.0/Y: Yapım İşleri Geçici Kabul Teklif Belgesi',
        kod: 'Standart Form-KİK048.0/Y',
        aciklama: 'Doğrudan temin yapım işlerinde geçici kabul ön inceleme teklif belgesi.',
        zorunluMu: false
      },
      {
        ad: 'Standart Form-KİK049.0/Y: Yapım İşleri Geçici Kabul Tutanağı',
        kod: 'Standart Form-KİK049.0/Y',
        aciklama: 'Doğrudan temin yapım işlerinde geçici kabul komisyonu tutanağı.',
        zorunluMu: false
      },
      {
        ad: 'Standart Form-KİK050.0/Y: Yapım İşleri Kesin Kabul Teklif Belgesi',
        kod: 'Standart Form-KİK050.0/Y',
        aciklama: 'Doğrudan temin yapım işlerinde kesin kabul teklif belgesi.',
        zorunluMu: false
      },
      {
        ad: 'Standart Form-KİK051.0/Y: Yapım İşleri Kesin Kabul Tutanağı',
        kod: 'Standart Form-KİK051.0/Y',
        aciklama: 'Doğrudan temin yapım işlerinde kesin kabul komisyonu tutanağı.',
        zorunluMu: false
      },
      {
        ad: 'Standart Form-KİK: Doğrudan Temin Mal / Hizmet Tip Sözleşmesi',
        kod: 'KİK-TİP-SÖZ',
        aciklama: '4734 Sayılı Kanun tip sözleşme esaslarına uygun olarak idare ile yüklenici arasında imzalanan taahhüt sözleşmesi.',
        zorunluMu: false
      },
      {
        ad: 'Standart Form (KİK Tebliği m.22): Sipariş ve İş Bildirim / Tebligat Mektubu',
        kod: 'KİK-TEBLİGAT',
        aciklama: 'Sözleşme yapılmayan hallerde yüklenici firmaya işin verildiğini bildiren resmi tebligat.',
        zorunluMu: false
      },
      {
        ad: 'Standart Form (MYHBY Örnek No: 3): Harcama Pusulası ve Klasör Dizi Fihristi',
        kod: 'MYHBY-Örnek:3',
        aciklama: 'Ödeme belgesine bağlanan harcama ve ihale evraklarının sırasını gösteren resmi dizi fihristi.',
        zorunluMu: false
      }
    ]
  },
  {
    id: 'modul-personel-izin',
    kod: 'PERS-İZİN',
    paketTipi: 'modul',
    baslik: 'Personel & İzin / Görev Takip Sistemi (657 Memur & 4857 İşçi)',
    kisaAciklama:
      '657 DMK ve 4857 İş Kanunu uyarınca memur ve sürekli işçi izin hak edişi, sağlık raporu, mazeret ve görevlendirme yönetimi.',
    detayliAciklama:
      'Kamu kurumlarında görev yapan 657 Devlet Memuru ve 4857 Sürekli İşçilerin kıdemine göre yıllık izin gün hesaplaması, mazeret/babalık/evlilik izinleri, tek hekim ve heyet rapor intikalleri, resmi izin onay belgesi ve canlı A4 dilekçe üreticisi.',
    mevzuat: '657 Sayılı DMK m.102-108 & 4857 Sayılı İş Kanunu m.53-60',
    kategori: 'entegrasyon',
    ikon: 'Users',
    renk: 'indigo',
    versiyon: 'v2.0.0',
    surumAsamasi: 'Kararlı',
    etiketler: ['Personel', 'İzin Takibi', '657 Memur', '4857 İşçi', 'Sağlık Raporu', 'Kıdem Hesabı'],
    yeniMi: true,
    videoAnlatim: true,
    altMetinOzeti: 'Memur ve sürekli işçi izin hak edişi, resmi izin onay formu ve canlı dilekçe üretimi.',
    routePath: '/personel?tab=izinler',
    removable: true,
    silinebilir: true,
    araclar: ['657 / 4857 İzin Gün Hesabı Motoru', 'Otomatik İzin Onay Belgesi Üretici', 'SGK İş Göremezlik Bildirim Takipçisi'],
    asamalar: [
      { sira: 1, baslik: 'İzin / Rapor Talebi', aciklama: 'Personelin gerekçeli talep dilekçesi veya sağlık raporunun ibrazı.' },
      { sira: 2, baslik: 'İdare ve Görev Taksimi', aciklama: 'Vekil personel belirlenmesi ve birim amiri parafı.' },
      { sira: 3, baslik: 'Harcama Yetkilisi / Müdür Onayı', aciklama: 'Resmi izin onay belgesi imza ve mühür süreci.' },
      { sira: 4, baslik: 'Özlük Dosyası & MYS / KBS Girişi', aciklama: 'İzin kayıt defteri ve maaş/puantaj yansıması.' }
    ],
    belgeler: [
      { ad: '657 Memur Yıllık İzin Onay Belgesi (Form 1)', kod: 'İZN-01', aciklama: 'Harcama yetkilisi onaylı standart resmi memur izin formu.', zorunluMu: true },
      { ad: '4857 Sürekli İşçi Yıllık İzin Talep & Takip Formu', kod: 'İZN-02', aciklama: 'İş günü esasına göre hesaplanan sürekli işçi izin belgesi.', zorunluMu: true },
      { ad: 'Mazeret İzni Talep Dilekçesi (Babalık, Evlilik, Vefat)', kod: 'İZN-03', aciklama: 'Kanuni mazeret halleri için standart resmi dilekçe.', zorunluMu: false },
      { ad: 'Hastalık / Sağlık Raporu İntikal & İzin Çevirme Yazısı', kod: 'İZN-04', aciklama: 'Hastaneden alınan istirahat raporunun izne dönüştürülmesi.', zorunluMu: false },
      { ad: 'Görevlendirme ve Tebellüğ Tutanağı', kod: 'İZN-05', aciklama: 'Kurul/komisyon veya geçici görev bildirim evrakı.', zorunluMu: false }
    ]
  },
  {
    id: 'idareci-pano',
    kod: 'PANO-PRO',
    paketTipi: 'modul',
    baslik: 'Harcama Yetkilisi & İdareci Pano (Canlı Yönetim Kokpiti)',
    kisaAciklama:
      'İdareciler ve harcama yetkilileri için masaüstü canlı yönetim kokpiti: bekleyen 22/d onayları, KİK limit durumu, ihale takvimi ve imza süreçleri.',
    detayliAciklama:
      'Kamu idarelerinde harcama yetkilileri ve birim amirleri için masaüstünde tam ekran açık kalan; KİK 22/d parasal limit harcamalarını, bekleyen satın alma onaylarını, sözleşme teslim vadelerini ve komisyon görevlerini anlık gösteren canlı takip kokpiti.',
    mevzuat: '5018 Sayılı Kamu Mali Yönetimi & 4734 Sayılı Kanun',
    kategori: 'entegrasyon',
    ikon: 'Clock',
    renk: 'blue',
    versiyon: 'v2.1.0',
    surumAsamasi: 'Kararlı',
    etiketler: ['Canlı Pano', 'İdareci Kokpiti', 'Harcama Yetkilisi', 'Limit Takibi', 'Onay Masası'],
    kartStili: 'navy_gradient',
    videoAnlatim: true,
    yeniMi: true,
    altMetinOzeti: 'Masaüstü canlı yönetim kokpiti: bekleyen satın alma onayları, 22/d bütçe tavanı ve imza masası.',
    routePath: '/harcama-merkezi',
    araclar: ['Masaüstü Canlı Widget', 'KİK 22/d Limit Barı', 'Harcama Onay Masası'],
    asamalar: [
      { sira: 1, baslik: 'Günün Satın Alma & Onay Akışı', aciklama: 'İmzalanacak 22/d harcama talimatları ve piyasa fiyat araştırma tutanakları.' },
      { sira: 2, baslik: '22/d Parasal Limit ve Ödenek Kontrolü', aciklama: 'Yıllık doğrudan temin harcama tavanı ve bloke edilen bütçe bakiyesi.' }
    ],
    belgeler: [
      { ad: 'Bekleyen İdareci İmzaları & Onay Listesi', kod: 'PNO-01', aciklama: 'Harcama yetkilisi onayında bekleyen doğrudan temin evrakları.', zorunluMu: false },
      { ad: 'Günlük Satın Alma İcmal Raporu', kod: 'PNO-02', aciklama: 'Günün onaylanan ve tahakkuka giden alımları icmali.', zorunluMu: false }
    ]
  },
  {
    id: 'kik-butce-limit-denetleyici',
    kod: 'LİMİT-KONTROL',
    paketTipi: 'modul',
    baslik: 'Bütçe & KİK Parasal Limit Denetleyicisi',
    kisaAciklama:
      'Kurum bütçesi harcama tavanı denetleyicisi, 4734 m.22/d KİK parasal limit kontrolü ve kısımlara bölme önleyici.',
    detayliAciklama:
      'Sayıştay denetimlerinde en çok ceza kesilen alımların kısımlara bölünerek doğrudan temin yapılması riskini önleyen; kurum harcama tavanı ve parasal limit kontrollerini yürüten denetim aracı.',
    mevzuat: '4734 Sayılı Kanun m.22/d & Sayıştay Teamülleri',
    kategori: 'alim_ihale',
    ikon: 'TrendingUp',
    renk: 'rose',
    versiyon: 'v2.0.0',
    surumAsamasi: 'Kararlı',
    etiketler: ['KİK Limit', 'Kısımlara Bölme Riski', 'Bütçe Kontrol', 'Sayıştay'],
    kartStili: 'solid_red',
    yeniMi: true,
    altMetinOzeti: 'Kurum bütçe tavanı ve 4734 m.22/d KİK doğrudan temin parasal limit uyarısı.',
    routePath: '/hesaplama-araclari?tab=butce',
    araclar: ['KİK Parasal Limit Denetleyicisi', 'Bütçe Bloke Formülü'],
    asamalar: [
      { sira: 1, baslik: 'Bütçe Tavanı Kontrolü', aciklama: 'Yıllık 22/d limitinin aşılıp aşılmadığı denetimi.' },
      { sira: 2, baslik: 'Benzer Alım Taraması', aciklama: 'Aynı kodlu alımların kısımlara bölünme riski taraması.' }
    ],
    belgeler: [
      { ad: 'KİK 22/d Limit Kullanım Cetveli', kod: 'LMT-01', aciklama: 'Yıl içi toplam limit ve kalan bakiye tablosu.', zorunluMu: true }
    ]
  },
  {
    id: 'kamu-stratejik-eylem-plani',
    kod: 'STR-EYLEM',
    paketTipi: 'modul',
    baslik: 'Kamu İdareleri Stratejik Eylem & Satınalma Planı',
    kisaAciklama:
      'Yıllık ve çeyrek bazında kamu idareleri stratejik eylem planları, yatırım ve satın alma faaliyet takvimi.',
    detayliAciklama:
      'Kamu idareleri (belediyeler, üniversiteler, bakanlıklar ve il müdürlükleri) için 5018 sayılı Kanun kapsamında periyodik hazırlanan stratejik eylem planları, satın alma lüzum planları ve resmi performans raporlama paketi.',
    mevzuat: '5018 Sayılı Kanun & Kamu Stratejik Planlama Kılavuzu',
    kategori: 'entegrasyon',
    ikon: 'FileText',
    renk: 'purple',
    versiyon: 'v1.5.0',
    surumAsamasi: 'Kararlı',
    etiketler: ['Stratejik Plan', 'Eylem Planı', 'Performans Programı', 'İdari İşler'],
    kartStili: 'burgundy',
    yeniMi: true,
    ozelRozet: 'STRATEJİK PLAN',
    altMetinOzeti: 'Kurumsal eylem planları çeyrek ve dönem bazında: idari birimler ve satın alma hedefleri.',
    routePath: '/surec-studyosu?modulId=kamu-stratejik-eylem-plani',
    araclar: ['Dönemsel Eylem Matrisi', 'Performans & Faaliyet Raporlayıcı'],
    asamalar: [
      { sira: 1, baslik: 'Dönemsel Eylem ve Yatırım Planlaması', aciklama: 'Harcama birimlerine göre dönemsel satın alma ve yatırım hedefleri oluşturma.' },
      { sira: 2, baslik: 'Faaliyet & Malzeme İhtiyacı Eşleme', aciklama: 'Stratejik hedefler ile doğrudan temin ve ihale lüzum belgelerini bağlama.' }
    ],
    belgeler: [
      { ad: 'Dönemsel Kurumsal Eylem & Satınalma Planı Formu', kod: 'STR-01', aciklama: 'Dönemlik hedefler, bütçe tertipleri ve sorumlu birim tablosu.', zorunluMu: true }
    ]
  },
  {
    id: 'yapay-zeka-sartname',
    kod: 'AI-ŞARTNAME',
    paketTipi: 'utils',
    baslik: 'Komisyon Görev Dağıtım & Yapay Zekâ Şartname Robotu',
    kisaAciklama:
      'Yapay zekâ destekli KİK uyumlu piyasa rayiç analizi, teknik şartname hazırlama ve ihale komisyon görev taksimi.',
    detayliAciklama:
      'Kamu kurumları için teknik şartnamelerin 4734 sayılı Kanun m.12 ilkelerine uygun ve rekabeti engellemeyecek şekilde hazırlanması ve ihale komisyonlarında adil, çakışmasız görev taksim robotu.',
    mevzuat: 'KİK m.12 Teknik Şartname Esasları',
    kategori: 'finans_hesap',
    ikon: 'Cpu',
    renk: 'amber',
    versiyon: 'v3.0.0',
    surumAsamasi: 'Beta',
    etiketler: ['Yapay Zeka', 'Şartname Robotu', 'Adil Dağıtım', 'Rayiç Analizi'],
    kartStili: 'warm_orange',
    videoAnlatim: true,
    altMetinOzeti: 'Yapay zekâ destekli KİK teknik şartname oluşturucu ve çakışmasız komisyon görev taksimi.',
    routePath: '/komisyonlar?tab=gorev_dagilimi',
    araclar: ['AI Şartname Üretici', 'Çakışmasız Dağıtım Motoru'],
    asamalar: [
      { sira: 1, baslik: 'Girdi ve Kriter Tanımlama', aciklama: 'Mal/hizmet teknik özellikleri, standartlar veya komisyon görev kriterleri.' },
      { sira: 2, baslik: 'Yapay Zekâ Optimizasyonu & Şartname Üretimi', aciklama: 'KİK mevzuatına uygun şartname maddelerinin ve görev çizelgesinin üretilmesi.' }
    ],
    belgeler: [
      { ad: 'KİK Uyumlu Teknik Şartname Taslağı', kod: 'AI-01', aciklama: 'Yapay zekâ tarafından oluşturulan resmi teknik şartname metni.', zorunluMu: true },
      { ad: 'Komisyon & Görev Taksim Çizelgesi', kod: 'AI-02', aciklama: 'Birim ve personel bazlı görev programı.', zorunluMu: false }
    ]
  },
  {
    id: 'aylik-yonetim-akisi',
    kod: 'AYLIK-AKIŞ',
    paketTipi: 'modul',
    baslik: 'Aylık Yönetim & Satınalma Akışı',
    kisaAciklama:
      'Ocak ayından Aralık ayına, kamu mali yılı boyunca her ay yapılması gereken satın alma, ödenek ve kabul işlemleri.',
    detayliAciklama:
      'Kamu mali yılı boyunca (12 ay) her ay yapılması gereken doğrudan temin alımları, piyasa araştırmaları, ödenek aktarma kontrolleri, muayene kabul ve ambar sayım işlemleri kontrol listesi.',
    mevzuat: 'Kamu Mali Takvimi ve Harcama Esasları',
    kategori: 'entegrasyon',
    ikon: 'Clock',
    renk: 'blue',
    versiyon: 'v1.4.0',
    surumAsamasi: 'Kararlı',
    etiketler: ['Aylık Akış', 'İdari Takvim', 'Satınalma Zamanı'],
    videoAnlatim: true,
    altMetinOzeti: '12 aylık kamu mali takvimi: harcama birimleri için periyodik satın alma, ödenek ve kabul takvimi.',
    routePath: '/takip',
    araclar: ['Aylık Takvim Hatırlatıcısı', 'İşlem Kontrol Listesi'],
    asamalar: [
      { sira: 1, baslik: 'Ay Başı Görevleri', aciklama: 'Ödenek talebi ve maaş/puantaj bildirimleri.' },
      { sira: 2, baslik: 'Ay Sonu Kapanışları', aciklama: 'Fatura tahakkukları ve ambar sayımları.' }
    ],
    belgeler: [
      { ad: 'Aylık İdari İş ve İşlemler Çizelgesi', kod: 'AY-01', aciklama: 'Aylık kontrol formu.', zorunluMu: true }
    ]
  },
  {
    id: 'planlama-isleri',
    kod: 'PLANLAMA',
    paketTipi: 'modul',
    baslik: 'Planlama İşleri & Kurumsal Görev Dağılım Matrisi',
    kisaAciklama:
      'İhale komisyonları, muayene kabul heyetleri, piyasa araştırma görevlileri ve kurum içi personel görev dağılım matrisi.',
    detayliAciklama:
      'Tüm kamu kurumlarında (belediyeler, il/ilçe müdürlükleri, üniversiteler, hastaneler ve idareler) görev yapan personelin üzerinde bulunan ihale komisyonu, muayene kabul, piyasa araştırması ve proje sorumluluklarını tek havuzda toplayan; izin ve yetki devirleriyle entegre adil görev dağılım ve iş yükü dengeleme stüdyosu.',
    mevzuat: '5018 Kamu Mali Yönetimi & Kurum İçi Görev Standartları',
    kategori: 'entegrasyon',
    ikon: 'FileCheck',
    renk: 'emerald',
    versiyon: 'v2.0.0',
    surumAsamasi: 'Kararlı',
    etiketler: ['Komisyonlar', 'Görev Dağılımı', 'Heyet & Kurullar', 'İş Yükü Dengeleme'],
    videoAnlatim: true,
    altMetinOzeti: 'İhale komisyonları, muayene kabul heyetleri ve kurum içi personel görev dağılımı.',
    routePath: '/komisyonlar?tab=gorev_dagilimi',
    removable: true,
    silinebilir: true,
    araclar: ['Personel Görev Yükü Dengeleyici', 'Makam Onaylı Görev Dağılım Çizelgesi', 'Tebliğ-Tebellüğ Belgesi Üretici'],
    asamalar: [
      { sira: 1, baslik: 'Personel Görev Havuzu Oluşturma', aciklama: 'Kayıtlı personelin mevcut görevlerinin taranması.' },
      { sira: 2, baslik: 'İş Yükü Dengeleme & Atama', aciklama: 'İhale komisyonu, muayene kabul ve piyasa araştırma görevlerinin adil dağıtımı.' },
      { sira: 3, baslik: 'Makam Onayı & Tebligat', aciklama: 'Resmi görev dağılım çizelgesi ve tebellüğ imzaları.' }
    ],
    belgeler: [
      { ad: 'Makam Onaylı Kurum Görev Dağılım Çizelgesi', kod: 'PLN-01', aciklama: 'Yıl içi tüm personel görev atama matrisi.', zorunluMu: true },
      { ad: 'Görevlendirme ve Tebellüğ Belgesi', kod: 'PLN-02', aciklama: 'Personele tebliğ edilen görevlendirme yazısı.', zorunluMu: true }
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
    yeniMi: true,
    altMetinOzeti: '62 hazır resmî yazı — tebliğler, personel yazıları ve Doğrudan Temin evrakları...',
    routePath: '/ebys',
    removable: true,
    silinebilir: true,
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
    id: 'tutanak-studyosu',
    kod: 'TTN-STD',
    paketTipi: 'modul',
    baslik: 'Resmî Tutanak, Teslim & Sayım Stüdyosu',
    kisaAciklama:
      'Muayene kabul, hasar tespit, teslim-tesellüm, sayım ve olay tutanakları için çok imzalı resmi tutanak motoru.',
    detayliAciklama:
      'Kamu kurum ve idareleri için muayene kabul, ambar teslim tesellüm, hasar tespit ve olay zabıtlarını mevzuata uygun çok imzalı A4 formatında üreten resmi tutanak ve tespit paketi.',
    mevzuat: 'Mali Mevzuat & İdare Hukuku Teamülleri',
    kategori: 'entegrasyon',
    ikon: 'FileCheck',
    renk: 'emerald',
    versiyon: 'v1.5.0',
    surumAsamasi: 'Kararlı',
    etiketler: ['Tutanak', 'Muayene Kabul', 'Teslim Tesellüm', 'Hasar Tespit', 'Sayım'],
    yeniMi: true,
    altMetinOzeti: 'Muayene kabul, teslim-tesellüm, hasar tespit ve olay tutanakları stüdyosu.',
    routePath: '/surec-studyosu?modulId=tutanak-studyosu',
    removable: true,
    silinebilir: true,
    araclar: ['Çok İmzalı Tutanak Motoru', 'Fotoğraflı Hasar Tespit Eki', 'Canlı A4 Baskı Çıktısı'],
    asamalar: [
      { sira: 1, baslik: 'Olay & Tespit Mahalli', aciklama: 'Tutanak konusu fiili durum, tarih, saat ve mahallin belirlenmesi.' },
      { sira: 2, baslik: 'Heyet & Komisyon Teşkili', aciklama: 'En az iki resmi görevli personelin tutanak heyeti olarak tespiti.' },
      { sira: 3, baslik: 'Zabıt Metni & İmzalar', aciklama: 'Müşterek zabıt metninin yazılması ve ıslak/elektronik imza altına alınması.' }
    ],
    belgeler: [
      { ad: 'Mal Teslim - Tesellüm Tutanağı', kod: 'TTN-01', aciklama: 'Satın alınan mal veya demirbaşın ambar veya yetkili personele teslim edildiğini gösteren tutanak.', zorunluMu: true },
      { ad: 'Muayene & Kabul Komisyonu İnceleme Tutanağı', kod: 'TTN-02', aciklama: 'Ürünün numunelere, faturaya ve teknik şartnameye uygunluğunun tescil edildiği tutanak.', zorunluMu: true },
      { ad: 'Hasar / Eksik Malzeme Tespit Tutanağı', kod: 'TTN-03', aciklama: 'Kargo veya sevkiyat esnasında kırık, hasarlı veya eksik çıkan malzemelerin zabıt altına alınması.', zorunluMu: false },
      { ad: 'Standart Form-KİK049.0/Y: Yapım İşleri Geçici Kabul Tutanağı', kod: 'Standart Form-KİK049.0/Y', aciklama: 'Yapım işleri geçici kabul komisyonu muayene ve onay tutanağı.', zorunluMu: true },
      { ad: 'Standart Form-KİK051.0/Y: Yapım İşleri Kesin Kabul Tutanağı', kod: 'Standart Form-KİK051.0/Y', aciklama: 'Yapım işleri kesin kabul komisyonu ve yüklenici katılımıyla tanzim edilen kesin kabul tutanağı.', zorunluMu: true }
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
    routePath: '/devlet-ihale-2886',
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
    routePath: '/surec-studyosu?modulId=kik-acik-ihale-19-21',
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
      { ad: 'Standart Form-KİK001.0/M: İhale Onay Belgesi (Harcama Talimatı)', kod: 'Standart Form-KİK001.0/M', aciklama: 'İhale yetkilisinden alınan ana ihale onay formu ve harcama talimatı.', zorunluMu: true },
      { ad: 'Standart Form-KİK: İdari Şartname Taslağı', kod: 'KİK-İDŞAR', aciklama: 'İhaleye katılım ve yeterlik kurallarını içeren tip şartname.', zorunluMu: true },
      { ad: 'Standart Form-KİK002.0/M: Yaklaşık Maliyet Hesap Cetveli', kod: 'Standart Form-KİK002.0/M', aciklama: 'Gizli zarfta tutulan detaylı yaklaşık maliyet döküm cetveli.', zorunluMu: true },
      { ad: 'Standart Form: İhale Komisyonu Görevlendirme Kararı', kod: 'KİK-KOMİSYON', aciklama: 'Uzman üyeler ve muhasebe yetkilisi komisyon görevlendirme tebliği.', zorunluMu: true },
      { ad: 'Standart Form-KİK009.0/M: Zarf Açma ve Belge Kontrol Tutanağı', kod: 'Standart Form-KİK009.0/M', aciklama: '1. Oturumda teklif zarflarının kontrolü ve açılması tutanağı.', zorunluMu: true },
      { ad: 'Standart Form-KİK: Sınır Değer ve Aşırı Düşük Teklif Hesap Tablosu', kod: 'KİK-SINIR', aciklama: 'Kamu İhale Kanunu ve tebliğ esaslarına göre sınır değer tespiti cetveli.', zorunluMu: true },
      { ad: 'Standart Form-KİK018.0/M: İhale Komisyonu Kararı', kod: 'Standart Form-KİK018.0/M', aciklama: 'Ekonomik açıdan en avantajlı teklifi belirleyen gerekçeli ihale komisyon kararı.', zorunluMu: true },
      { ad: 'Standart Form-KİK021.0/M: Kesinleşen İhale Kararının Bildirilmesi Mektubu', kod: 'Standart Form-KİK021.0/M', aciklama: 'Tüm isteklilere gönderilen kesinleşen ihale kararı bildirim mektubu.', zorunluMu: true },
      { ad: 'Standart Form-KİK023.0/M: Sözleşmeye Davet Mektubu', kod: 'Standart Form-KİK023.0/M', aciklama: 'Kesin teminat yatırma çağrısı ve sözleşmeye davet mektubu.', zorunluMu: true }
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
    routePath: '/surec-studyosu?modulId=kik-istisnalar-22-abc',
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
    routePath: '/projeler',
    araclar: ['Yapım Fiyat Farkı (Bakanlar Kurulu Kararı)', 'KDV & Stopaj Kesinti Robotu', 'Metraj Çarpım Tablosu'],
    asamalar: [
      { sira: 1, baslik: 'Yer Teslimi & İş Programı', aciklama: 'Şantiyenin yükleniciye teslimi ve haftalık/aylık iş planı onayı.' },
      { sira: 2, baslik: 'İmalat & Metraj Cetveli', aciklama: 'Sahada yapılan işlerin ölçümü ve ataşman defteri kaydı.' },
      { sira: 3, baslik: 'Hakediş Raporunun Tanzimi', aciklama: 'Yeşil defterden hakediş arka kapağına aktarım ve kesintiler.' },
      { sira: 4, baslik: 'Geçici & Kesin Kabul', aciklama: 'Teknik heyet kabul tutanakları ve teminat iadesi süreci.' }
    ],
    belgeler: [
      { ad: 'Standart Form (YİGŞ m.6): İşyeri Teslim Tutanağı', kod: 'YİGŞ-İşyeriTeslim', aciklama: 'İşe başlama tarihini resmi olarak başlatan şantiye ve işyeri teslim tutanağı.', zorunluMu: true },
      { ad: 'Standart Form: İmalat Metraj ve Ataşman Cetveli', kod: 'HKD-METRAJ', aciklama: 'Yapılan imalat miktarlarının sahada tutulan rölöve ve ataşman ölçüm kaydı.', zorunluMu: true },
      { ad: 'Standart Form: Yeşil Defter (Hakediş İcmali)', kod: 'HKD-YEŞİLDEFTER', aciklama: 'Sözleşme birim fiyatlarıyla yapılan imalatların kümülatif parasal dökümü.', zorunluMu: true },
      { ad: 'Standart Form (MYHBY Örnek No: 4): Hakediş Raporu ve İcmal Cetveli', kod: 'MYHBY-Örnek:4', aciklama: 'Stopaj, avans, teminat, gecikme cezası kesintileri ve net tahakkuk cetveli.', zorunluMu: true },
      { ad: 'Standart Form-KİK048.0/Y: Yapım İşleri Geçici Kabul Teklif Belgesi', kod: 'Standart Form-KİK048.0/Y', aciklama: 'Yapım işinin bitirildiğine ilişkin yüklenici dilekçesi sonrası ön inceleme teklif belgesi.', zorunluMu: true },
      { ad: 'Standart Form-KİK049.0/Y: Yapım İşleri Geçici Kabul Tutanağı', kod: 'Standart Form-KİK049.0/Y', aciklama: 'Yapım işleri geçici kabul komisyonu muayene ve onay tutanağı.', zorunluMu: true },
      { ad: 'Standart Form-KİK050.0/Y: Yapım İşleri Kesin Kabul Teklif Belgesi', kod: 'Standart Form-KİK050.0/Y', aciklama: 'Teminat süresi sonunda kesin kabul muayenesinin yapılmasını talep eden teklif belgesi.', zorunluMu: true },
      { ad: 'Standart Form-KİK051.0/Y: Yapım İşleri Kesin Kabul Tutanağı', kod: 'Standart Form-KİK051.0/Y', aciklama: 'Kesin kabul komisyonu ve yüklenici katılımıyla tanzim edilen kesin kabul tutanağı.', zorunluMu: true },
      { ad: 'Standart Form (YİGŞ m.45): Kesin Kabul ve Teminat İade Müzekkeresi', kod: 'YİGŞ-Teminatİade', aciklama: 'Teminat süresi ve kesin kabulün tamamlanmasıyla nakit veya mektup teminatın iade yazısı.', zorunluMu: false }
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
    routePath: '/hesaplama-araclari?tab=vergi',
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
    routePath: '/hesaplama-araclari?tab=fiyatFarki',
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
    routePath: '/hesaplama-araclari?tab=ceza',
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
    routePath: '/hesaplama-araclari?tab=yazi',
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
    routePath: '/hesaplama-araclari?tab=butce',
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
    routePath: '/hesaplama-araclari?tab=formul',
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
    routePath: '/dosyalar',
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
    routePath: '/raporlar',
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
    routePath: '/hesaplama-araclari?tab=pano',
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
    routePath: '/belgelerim',
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
  },
  {
    id: 'ext-dt-ozel-belgeler',
    kod: 'EXT-DT-SABLON',
    paketTipi: 'extension',
    baslik: 'Doğrudan Temin Özelleştirilebilir Belge & Dinamik Yer Tutucu Stüdyosu',
    kisaAciklama:
      'Doğrudan temin süreçlerinde kuruma ve dosyaya özel ek belgeler, dinamik yer tutucular (placeholders) ve değişken bağlama eklentisi.',
    detayliAciklama:
      '4734 Sayılı Kanun Madde 22 doğrudan temin dosyaları için standart mevzuat belgelerinin ötesinde; kuruma ve işe özel şartname ekleri, teslim tesellüm tutanakları, özel taahhütnameler ve dinamik yer tutucuları ({{makam}}, {{teslim_adresi}}, {{ozel_hukum}}, {{firma_notu}} vb.) tanımlayıp doğrudan temin dosyalarına bağlayarak canlı çıktı almayı sağlayan esnek belge motoru eklentisi.',
    mevzuat: '4734 Sayılı KİK m.22 & Kurumsal Belge Standartları',
    kategori: 'alim_ihale',
    ikon: 'Puzzle',
    renk: 'indigo',
    versiyon: 'v1.0.0-beta',
    surumAsamasi: 'Beta',
    etiketler: ['Doğrudan Temin', 'Özelleştirilebilir Belge', 'Dinamik Yer Tutucu', 'Şablon Stüdyosu', 'Değişkenler', 'Beta'],
    removable: true,
    silinebilir: true,
    routePath: '/degiskenler',
    araclar: [
      'Dinamik Yer Tutucu Editörü',
      'Sürükle-Bırak Belge Tasarımcısı',
      'Dosya Değişkenleri Eşleştirici',
      'Özel Belge Çıktı Motoru'
    ],
    asamalar: [
      { sira: 1, baslik: 'Özel Belge & Şablon Tasarımı', aciklama: 'Kuruma özel evrak metni, antet ve tablo düzeni oluşturma.' },
      { sira: 2, baslik: 'Dinamik Yer Tutucu Tanımlama', aciklama: '{{dosya_no}}, {{yuklenici_firma}}, {{malzeme_listesi}} ve özel kurum alanlarını yerleştirme.' },
      { sira: 3, baslik: 'Doğrudan Temin Dosyasına Entegrasyon', aciklama: 'Hazırlanan özel belgenin ilgili aşamaya (İhtiyaç, Teklif, Karar, Muayene) eklenmesi.' },
      { sira: 4, baslik: 'Dinamik Çıktı & Arşiv', aciklama: 'Dosya verileriyle birleşen resmi PDF/A ve Word çıktısı üretimi.' }
    ],
    belgeler: [
      { ad: 'Özelleştirilebilir Doğrudan Temin Ek Belgesi', kod: 'DT-EXT-01', aciklama: 'Kuruma özel eklenen doğrudan temin belgesi.', zorunluMu: false },
      { ad: 'Özel İdari / Teknik Taahhütname', kod: 'DT-EXT-02', aciklama: 'Yüklenici veya birimden alınan özel taahhüt evrakı.', zorunluMu: false },
      { ad: 'Kurum İçi Özel Onay & Devir Tutanağı', kod: 'DT-EXT-03', aciklama: 'Birimler arası özel teslim veya ön kabul tutanağı.', zorunluMu: false },
      { ad: 'Dinamik Yer Tutucu ve Değişken Haritası', kod: 'DT-EXT-04', aciklama: 'Şablonda kullanılan tüm alanların değer eşleşme tablosu.', zorunluMu: false }
    ]
  }
]
