/**
 * Süreç ve Hazır Metin Kalıpları Veri Kaynağı
 * TEK GERÇEKLİK KAYNAĞI (Single Source of Truth):
 * Modül listesi, mevzuat, aşamalar ve resmi evrak tanımları moduller.data.ts üzerinden beslenir.
 * Bu dosya sadece ilgili modüllere ait hazır metin kalıplarını (dilekçe, tutanak, onay) ve rehberleri tanımlar;
 * Süreç paketlerini (SUREC_PAKETLERI_DATA) ise moduller.data.ts'teki RESMI_MODUL_PAKETLERI'nden dinamik türetir.
 */
import { RESMI_MODUL_PAKETLERI } from './moduller.data'
import type { HazirMetinKalibi, RehberMaddesi } from '../modulMagazasi.types'

export type { HazirMetinKalibi, RehberMaddesi }

export interface EvrakMaddesi {
  sira: number
  kod: string
  baslik: string
  aciklama: string
  tur: 'word' | 'pdf' | 'modul' | 'ekap'
  otomatikDolanAlanlar: string[]
  zorunluMu: boolean
  wordIndirilebilir: boolean
  pdfIndirilebilir: boolean
  formBuilderUyumlumu: boolean
}

export interface SurecPaketiVerisi {
  id: string
  kod: string
  baslik: string
  kisaBaslik: string
  kategori: string
  mevzuat: string
  aciklama: string
  otomatikDoldurmaBilgisi: string
  hazirMaddeSayisiMetni: string
  evraklar: EvrakMaddesi[]
  hazirMetinler: HazirMetinKalibi[]
  rehberMaddeleri: RehberMaddesi[]
}

// =============================================================================
// 1. MODÜLLERE BAĞLI HAZIR METİN KALIPLARI (Dilekçe, Tutanak, Üst Yazı Şablonları)
// =============================================================================
export const HAZIR_METINLER_DATA: Record<string, HazirMetinKalibi[]> = {
  'kik-dogrudan-temin-22d': [
    {
      id: 'dt-metin-ihtiyac',
      kategori: 'İhtiyaç & Gerekçe',
      baslik: 'Mal Alımı İhtiyaç & Talep Gerekçesi',
      kisaAciklama: 'Birimce acil ihtiyaç duyulan sarf malzeme veya demirbaş alımı için standart gerekçe metni.',
      varsayilanHitap: 'DESTEK HİZMETLERİ DAİRESİ BAŞKANLIĞINA',
      varsayilanKonu: 'Doğrudan Temin Usulü İle Malzeme Alımı Talebi',
      tamMetin:
        'Birimimizin yürütmekte olduğu kamu hizmetlerinin aksamadan sürdürülebilmesi ve iş ve işlemlerin kesintiye uğramaması amacıyla, aşağıda teknik özellikleri ve adetleri belirtilen malzemelerin 4734 Sayılı Kamu İhale Kanununun 22/d maddesi kapsamında doğrudan temin usulüyle satın alınması hususunda gereğini tensiplerinize arz ederim.',
      rehberNotu: 'Bu metin harcama birimi üst yazısına bağlanır. İhtiyaç listesi ek olarak iliştirilmelidir.',
      etiket: 'Gerekçe',
      formTipi: 'dilekce'
    },
    {
      id: 'dt-metin-teklif-isteme',
      kategori: 'Piyasa Araştırması',
      baslik: 'Piyasa Fiyat Araştırması Teklif İsteme Yazısı',
      kisaAciklama: 'Firmalara fiyat teklifi vermeleri için gönderilen resmi davet mektubu.',
      varsayilanHitap: 'İLGİLİ FİRMA YETKİLİSİNE',
      varsayilanKonu: 'Fiyat Teklifi İstemi (4734 / 22-d)',
      tamMetin:
        'İdaremiz ihtiyacı olan ve ekli şartnamede/listede cinsi, miktarı ve özellikleri belirtilen mal/hizmet alımı işi 4734 Sayılı Kamu İhale Kanununun 22/d maddesi gereğince doğrudan temin yöntemiyle yaptırılacaktır. Söz konusu alıma ilişkin KDV hariç birim ve toplam fiyat teklifinizin kaşeli ve imzalı olarak en geç belirtilen tarih ve saate kadar İdaremize ulaştırılmasını rica ederiz.',
      rehberNotu: 'Faks veya e-posta ile gönderilecekse teyit alındı belgesinin dosyaya eklenmesi Sayıştay denetiminde aranır.',
      etiket: 'Teklif',
      formTipi: 'ust_yazi'
    },
    {
      id: 'dt-metin-yaklasik-maliyet',
      kategori: 'Maliyet & Onay',
      baslik: 'Yaklaşık Maliyet Tespit Tutanağı Açıklaması',
      kisaAciklama: 'Fiyat araştırması verilerine dayanılarak tahmini bedelin nasıl hesaplandığını açıklayan şerh.',
      varsayilanHitap: 'HARCAMA YETKİLİSİNE',
      varsayilanKonu: 'Yaklaşık Maliyet Tespit Kararı',
      tamMetin:
        '4734 Sayılı Kamu İhale Kanununun 9. maddesi ve Doğrudan Temin Esasları uyarınca yapılan piyasa araştırmasında, en az 3 farklı yetkili tedarikçiden alınan proforma faturalar ve piyasa rayiçleri incelenmiş; aritmetik ortalaması ve piyasa koşulları dikkate alınarak işin yaklaşık maliyeti KDV hariç olarak tespit edilerek onayınıza sunulmuştur.',
      rehberNotu: 'Yaklaşık maliyet gizlidir; piyasa araştırma görevlileri ve harcama yetkilisi haricinde kimseyle paylaşılmaz.',
      etiket: 'Maliyet',
      formTipi: 'tutanak'
    },
    {
      id: 'dt-metin-tek-kaynak',
      kategori: 'İhtiyaç & Gerekçe',
      baslik: 'Tek Kaynaktan Alım Gerekçe Raporu (22/a - 22/c)',
      kisaAciklama: 'Tekel niteliğindeki veya fikri hak sahibi olan tek firmadan alım gerekçesi.',
      varsayilanHitap: 'HARCAMA YETKİLİĞİ MAKAMINA',
      varsayilanKonu: 'Tek Kaynak Gerekçeli Alım Onayı',
      tamMetin:
        'Alımı planlanan ürünün/yazılımın Türkiye yetkili tek dağıtıcısı ve patent/telif hakları sahibi olduğu belgelendirildiğinden; başka bir kaynaktan temini teknik ve hukuki açıdan mümkün bulunmamaktadır. Bu nedenle alımın 4734 Sayılı Kanunun 22/a (veya 22/c) bendi uyarınca tek kaynaktan temin edilmesi hususunu olurlarınıza arz ederim.',
      rehberNotu: 'Telif/patent veya tek yetkili satıcılık belgesinin onay belgesine eklenmesi mecburidir.',
      etiket: 'Tek Kaynak',
      formTipi: 'onay_belgesi'
    },
    {
      id: 'dt-metin-muayene-kabul',
      kategori: 'Kabul & Muayene',
      baslik: 'Muayene ve Kabul Eksiklik / İhtar Metni',
      kisaAciklama: 'Teslimatta şartnameye uymayan kalemler için firmaya verilen düzeltme ihtarı.',
      varsayilanHitap: 'YÜKLENİCİ FİRMA YÖNETİMİNE',
      varsayilanKonu: 'Teslim Edilen Mallardaki Ayıplar ve Düzeltme İhtarı',
      tamMetin:
        'İdaremiz ile firmanız arasında akdedilen doğrudan temin siparişi kapsamında teslim edilen malların Muayene ve Kabul Komisyonumuzca yapılan fiziki ve fonksiyonel incelenmesinde; bazı kalemlerin teknik şartnamede belirtilen kriterleri karşılamadığı tespit edilmiştir. Söz konusu eksikliklerin sözleşme şartları gereği 3 (üç) iş günü içerisinde giderilerek uygun ürünlerle değiştirilmesi, aksi halde siparişin iptal edilerek gecikme cezası uygulanacağı hususu ihtaren bildirilir.',
      rehberNotu: 'Bu metin noterden veya iadeli taahhütlü/imzalı tebligat yoluyla firmaya ulaştırılmalıdır.',
      etiket: 'İhtar',
      formTipi: 'ust_yazi'
    },
    {
      id: 'dt-metin-odeme-tahakkuk',
      kategori: 'Maliyet & Onay',
      baslik: 'Ödeme Emri Belgesi Tahakkuk Açıklama Notu',
      kisaAciklama: 'Muhasebe servisine gönderilen ödeme emri belgesi üzerindeki standart gerekçe şerhi.',
      varsayilanHitap: 'STRATEJİ GELİŞTİRME DAİRESİ BAŞKANLIĞINA (Muhasebe Birimi)',
      varsayilanKonu: 'Ödeme Emri ve Hakediş Tahakkuku',
      tamMetin:
        'İdaremiz 4734 sayılı Kanunun 22/d maddesi gereğince gerçekleştirilen alıma ait fatura, muayene kabul tutanağı, piyasa fiyat araştırması tutanağı ve onay belgesi ekte sunulmuştur. İş eksiksiz teslim alınmış olup, ilgili mevzuat ve vergi kesintileri tatbik edilerek hakediş bedelinin yüklenicinin kayıtlı IBAN hesabına ödenmesini arz ederim.',
      rehberNotu: 'Vergi borcu sorgulaması (6183 m.22/A) 5.000 TL üzerindeki tüm kamu ödemelerinde eklenmelidir.',
      etiket: 'Ödeme',
      formTipi: 'dilekce'
    }
  ],

  'ebys-resmi-yazisma-studyosu': [
    {
      id: 'ebys-dilekce-izin',
      kategori: 'Personel & Özlük',
      baslik: 'Yıllık İzin / Mazeret İzni Talep Dilekçesi',
      kisaAciklama: 'Personelin mevzuata uygun şekilde izin kullanma talebi.',
      varsayilanHitap: 'MÜDÜRLÜĞÜNE',
      varsayilanKonu: 'Yıllık İzin Talebi',
      tamMetin:
        'Kurumunuz bünyesinde görev yapmaktayım. 657 Sayılı Devlet Memurları Kanununun ilgili maddeleri uyarınca, hakkım olan yıllık iznimden belirtilen tarihler arasında kullanmak istiyorum. İznimi geçireceğim adres ve irtibat numaram aşağıda belirtilmiş olup, gereğini müsaadelerinize arz ederim.',
      rehberNotu: 'İzin formu amir tarafından onaylanmadan görev mahallinden ayrılınmamalıdır.',
      etiket: 'İzin',
      formTipi: 'dilekce'
    },
    {
      id: 'ebys-avans-mahsup',
      kategori: 'Mali İşler',
      baslik: 'İş Avansı Mahsup ve Kapatma Dilekçesi',
      kisaAciklama: 'Acil harcamalar için açılan iş avansının harcama belgeleriyle kapatılması dilekçesi.',
      varsayilanHitap: 'STRATEJİ GELİŞTİRME DAİRESİ BAŞKANLIĞINA',
      varsayilanKonu: 'İş Avansı Mahsubu ve Kapatılması',
      tamMetin:
        'Birimimizce yürütülen acil alım ve hizmetler kapsamında adıma açılmış bulunan iş avansına ait harcama faturaları ve kanıtlayıcı belgeler ekte eksiksiz olarak sunulmuştur. Avansın kapatılarak mahsup işlemlerinin tamamlanmasını arz ederim.',
      rehberNotu: 'Avanslar alındığı tarihten itibaren 1 ay içinde kapatılmalıdır.',
      etiket: 'Avans',
      formTipi: 'dilekce'
    },
    {
      id: 'ebys-makam-oluru',
      kategori: 'Makam Oluru',
      baslik: 'Birim İçi Harcama & Etkinlik Oluru',
      kisaAciklama: 'Amir onayına sunulan resmi olur taslağı.',
      varsayilanHitap: 'KAYMAKAMLIK MAKAMINA / HARCAMA YETKİLİSİNE',
      varsayilanKonu: 'Harcama ve Organizasyon Oluru',
      tamMetin:
        'Müdürlüğümüz çalışma takvimi kapsamında gerçekleştirilecek faaliyet için gereken mal ve hizmetlerin alımı hususunda; kamu yararı ve hizmet gerekleri doğrultusunda gerekli harcamanın yapılması ve işlemlerin yürütülmesini uygun görüşle arz ederim.',
      rehberNotu: 'Sol alt tarafa "Uygun Görüşle Arz Ederim", sağ alt tarafa "OLUR" bloğu açılır.',
      etiket: 'Makam Oluru',
      formTipi: 'onay_belgesi'
    }
  ],

  'tutanak-studyosu': [
    {
      id: 'ttn-mal-kabul',
      kategori: 'Kabul & Muayene',
      baslik: 'Standart Mal Kabul ve Muayene Tutanak Metni',
      kisaAciklama: 'Malın şartnameye tam uygun teslim alındığını gösteren metin.',
      varsayilanHitap: 'TUTANAKTIR',
      varsayilanKonu: 'Mal Alımı Muayene ve Kabul Tutanağı',
      tamMetin:
        'İdaremiz Doğrudan Temin Kararı kapsamında yüklenici firma tarafından faturası ile teslim edilen malzemelerin fiziksel kontrolleri, parça sayımları ve teknik şartnameye uygunluk tetkikleri tarafımızca yapılmıştır. Teslim edilen malların evsafına uygun, noksansız ve çalışır durumda olduğu anlaşılmış olup işbu tutanak mahallinde 3 nüsha olarak tanzimle imza altına alınmıştır.',
      rehberNotu: 'En az 1 komisyon başkanı ve 2 asil üye tarafından imzalanmalıdır.',
      etiket: 'Kabul',
      formTipi: 'tutanak'
    },
    {
      id: 'ttn-hasar-tespit',
      kategori: 'Hasar & Ayıp',
      baslik: 'Kusurlu / Hasarlı Malzeme Tespit Tutanağı',
      kisaAciklama: 'Ambalajı hasarlı veya içeriği bozuk ürünlerin zabıt altına alınması.',
      varsayilanHitap: 'TUTANAKTIR',
      varsayilanKonu: 'Ayıplı Malzeme Tespit Tutanağı',
      tamMetin:
        'Yüklenici firma tarafından idaremize teslim edilmek üzere getirilen kolilerin açılması esnasında; ambalajın ezilmiş olduğu ve içerisindeki malzemenin kırık/kullanılamaz vaziyette bulunduğu tespit edilmiştir. İlgili mal teslim alınmamış, durum tespit edilerek işbu tutanak kurye ve ambar görevlileri huzurunda müştereken imza altına alınmıştır.',
      rehberNotu: 'Fotoğraf çekilip tutanak ekine konulması hukuki uyuşmazlıklarda ispat kolaylığı sağlar.',
      etiket: 'Hasar',
      formTipi: 'tutanak'
    }
  ]
}

// =============================================================================
// 2. MODÜLLERE BAĞLI MEVZUAT REHBER MADDELERİ
// =============================================================================
export const REHBERLER_DATA: Record<string, RehberMaddesi[]> = {
  'kik-dogrudan-temin-22d': [
    {
      baslik: 'KİK Parasal Limitlere Dikkat Edin',
      icerik:
        '4734 Sayılı Kanunun 22/d bendi için her yıl KİK tarafından ilan edilen parasal limit (Büyükşehirler ve diğer idareler için farklıdır) KDV hariç olarak hesaplanır. Alımları kısımlara bölerek limit altına çekmek Sayıştay denetiminde zimmet sebebidir.',
      tip: 'onemli'
    },
    {
      baslik: 'Piyasa Araştırmasında En Az 3 Teklif',
      icerik:
        'Kanunda sayı sınırlaması olmasa da İçişleri ve Maliye Bakanlığı tebliğleri uyarınca rekabet ve kamu yararı ilkeleri gereği en az 3 geçerli teklif toplanması önerilir.',
      tip: 'ipucu'
    },
    {
      baslik: 'Vergi ve SGK Borcu Teyidi',
      icerik:
        'Harcama yetkilisi onayından sonra ödeme aşamasında Hazine ve Maliye Bakanlığı genelgesi uyarınca firmanın vergi dairesinden vadesi geçmiş borcu olmadığına dair belge kontrol edilmelidir.',
      tip: 'mevzuat'
    }
  ],

  'ebys-resmi-yazisma-studyosu': [
    {
      baslik: 'Yazışmalarda "Arz Ederim" ve "Rica Ederim" Kuralı',
      icerik:
        'Resmî Yazışma Yönetmeliğine göre; ast veya muadil kurumlara "Rica ederim", üst makamlara "Arz ederim", hem üst hem ast makamlara dağıtımlı yazılarda ise "Arz ve rica ederim" ibaresi kullanılır.',
      tip: 'onemli'
    }
  ],

  'tutanak-studyosu': [
    {
      baslik: 'Tutanaklarda Tarih ve Saat Mecburiyeti',
      icerik:
        'Tutanak hukuki bir tespit belgesidir. Mutlaka düzenlendiği gün, saat ve yer net olarak belirtilmelidir.',
      tip: 'onemli'
    },
    {
      baslik: 'En Az İki İmza Kuralı',
      icerik:
        'Tek kişi tarafından düzenlenen evrak tutanak vasfı kazanmaz; geçerli olması için en az iki kişinin veya komisyon heyetinin imzası şarttır.',
      tip: 'mevzuat'
    }
  ]
}

// =============================================================================
// 3. TEK KAYNAKTAN (RESMI_MODUL_PAKETLERI) DİNAMİK TÜRETİLEN SÜREÇ PAKETLERİ
// =============================================================================
export const SUREC_PAKETLERI_DATA: Record<string, SurecPaketiVerisi> = Object.fromEntries(
  RESMI_MODUL_PAKETLERI.map((modul) => {
    const hazirMetinler = HAZIR_METINLER_DATA[modul.id] || []
    const rehberMaddeleri = REHBERLER_DATA[modul.id] || []

    const evraklar: EvrakMaddesi[] = modul.belgeler.map((belge, idx) => {
      const kodUpper = (belge.kod || '').toUpperCase()
      const isPdf =
        kodUpper.includes('PDF') ||
        kodUpper.includes('023') ||
        kodUpper.includes('PUSULA') ||
        kodUpper.includes('FİHRİST')
      const isEkap = kodUpper.includes('EKAP')

      return {
        sira: idx + 1,
        kod: belge.kod,
        baslik: belge.ad,
        aciklama: belge.aciklama,
        tur: isEkap ? 'ekap' : isPdf ? 'pdf' : 'word',
        otomatikDolanAlanlar: ['Kurum Adı', 'Birim Adı', 'Tarih', 'Yetkili / İmza Makamı'],
        zorunluMu: belge.zorunluMu,
        wordIndirilebilir: !isEkap,
        pdfIndirilebilir: true,
        formBuilderUyumlumu: !isEkap
      }
    })

    const paket: SurecPaketiVerisi = {
      id: modul.id,
      kod: modul.kod,
      baslik: modul.baslik,
      kisaBaslik: modul.baslik,
      kategori: modul.kategori,
      mevzuat: modul.mevzuat,
      aciklama: modul.detayliAciklama || modul.kisaAciklama,
      otomatikDoldurmaBilgisi:
        'Belgeler çalışma dosyanızdaki kurum, birim, yaklaşık maliyet, firma teklifleri ve harcama yetkilisi bilgileriyle otomatik doldurulur. "Doldur ve İndir" dediğinizde alanlar kendiliğinden yazılır.',
      hazirMaddeSayisiMetni: `${evraklar.length} / ${evraklar.length} evrak için sistemde hazır şablon ve canlı üretim desteği var.`,
      evraklar,
      hazirMetinler,
      rehberMaddeleri
    }

    return [modul.id, paket]
  })
)
