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
    },
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
    },
    {
      id: 'dt-metin-hizmet-is-artisi',
      kategori: 'İş Artışı & Süre',
      baslik: 'Hizmet / Yapım Alımı İş Artışı ve Süre Uzatımı Raporu',
      kisaAciklama: 'Doğrudan temin kapsamında öngörülemeyen durumlar için yasal sınır dahilinde iş artışı gerekçesi.',
      varsayilanHitap: 'HARCAMA YETKİLİSİNE',
      varsayilanKonu: 'İş Artışı ve Ek Süre Talebi',
      tamMetin:
        'İdaremizce 4734 Sayılı Kanunun 22/d maddesi kapsamında temin edilen hizmetin ifası sırasında; sözleşme/sipariş konusu işin öngörülemeyen teknik zorunluluklar sebebiyle kanuni oranlar (%20) dahilinde artırılması ve ek süre verilmesi zorunluluğu hasıl olmuştur. Gerekli ödenek mevcut olup, iş artışının ve süre uzatımının onaylanmasını arz ederim.',
      rehberNotu: 'Doğrudan temin limitini aşacak şekilde iş artışı yapılamaz.',
      etiket: 'İş Artışı',
      formTipi: 'onay_belgesi'
    },
    {
      id: 'dt-metin-yasaklilik-teyit',
      kategori: 'Piyasa Araştırması',
      baslik: 'EKAP İhale Yasaklılık Teyit Tutanağı',
      kisaAciklama: 'Sipariş veya sözleşme öncesi yüklenicinin yasaklılık sorgusunun tescili.',
      varsayilanHitap: 'TUTANAKTIR',
      varsayilanKonu: 'EKAP Yasaklılık Kontrol Kaydı',
      tamMetin:
        '4734 Sayılı Kamu İhale Kanununun 22. maddesi kapsamında doğrudan temin yöntemiyle alım yapılması kararlaştırılan yüklenici firmanın / isteklinin, Elektronik Kamu Alımları Platformu (EKAP) üzerinden yapılan sorgulamasında kamu ihalelerine katılmaktan yasaklı bulunmadığı tespit edilmiş olup işbu tutanak tanzim edilmiştir.',
      rehberNotu: 'EKAP sorgulama ekran çıktısı doğrudan temin dosyasında muhafaza edilmelidir.',
      etiket: 'EKAP',
      formTipi: 'tutanak'
    }
  ],

  'dik-devlet-ihale-2886': [
    {
      id: 'dik-ihale-talep',
      kategori: 'İhale Onayı',
      baslik: 'Taşınmaz Satış / Kira İhale Açılış Talep Müzekkeresi',
      kisaAciklama: 'Belediye Encümeni veya İta Amirine sunulan ihale açılış gerekçeli üst yazısı.',
      varsayilanHitap: 'BELEDİYE BAŞKANLIĞINA (Encümen Başkanlığı)',
      varsayilanKonu: '2886 Sayılı Kanun Uyarınca İhale Açılışı',
      tamMetin:
        'Mülkiyeti İdaremize ait olan ve tapunun [İLÇE / MAHALLE], [ADA] ada [PARSEL] parsel numarasında kayıtlı taşınmazın; kamu yararı ve gelir getirici amaçla 2886 Sayılı Devlet İhale Kanununun ilgili maddesi (m.35/m.45) gereğince [SATIŞ / KİRALAMA] ihalesine çıkarılması hususunu Encümeninizin tensiplerine arz ederim.',
      rehberNotu: 'Tapu takyidat belgesi ve imar çapı müzekkereye eklenmelidir.',
      etiket: 'İhale Talebi',
      formTipi: 'ust_yazi'
    },
    {
      id: 'dik-kiymet-takdir',
      kategori: 'Kıymet Takdiri',
      baslik: 'Kıymet Takdir Komisyonu Muhammen Bedel Tespit Kararı',
      kisaAciklama: 'Taşınmazın muhammen bedelinin ve %3 geçici teminatının belirlendiği karar zaptı.',
      varsayilanHitap: 'KIYMET TAKDİR KOMİSYONU KARARIDIR',
      varsayilanKonu: 'Muhammen Bedel Tespit Tutanağı',
      tamMetin:
        '2886 Sayılı Devlet İhale Kanununun 9 ve 13. maddeleri uyarınca teşekkül eden Kıymet Takdir Komisyonumuzca mahallinde yapılan inceleme, emsal rayiçler ve piyasa araştırmaları sonucunda; söz konusu taşınmazın tahmini (muhammen) bedeli KDV hariç [BEDEL] TL, %3 oranındaki geçici teminat miktarı ise [TEMİNAT] TL olarak oy birliğiyle tespit edilmiştir.',
      rehberNotu: 'Komisyon başkanı ve tüm üyelerin ıslak imzası zorunludur.',
      etiket: 'Muhammen Bedel',
      formTipi: 'tutanak'
    },
    {
      id: 'dik-istekli-dilekce',
      kategori: 'İstekli Başvurusu',
      baslik: 'İhale Şartnamesi Alma ve İştirak Başvuru Dilekçesi',
      kisaAciklama: 'İhaleye katılmak isteyen istekli tarafından sunulan resmi katılım dilekçesi.',
      varsayilanHitap: 'İHALE KOMİSYONU BAŞKANLIĞINA',
      varsayilanKonu: 'İhaleye Katılma Başvurusu',
      tamMetin:
        'İdarenizce 2886 Sayılı Kanun kapsamında ihalesi ilan edilen taşınmaza ait idari şartname ve eklerini okudum, aynen kabul ettim. İhaleye iştirak için gereken geçici teminat makbuzu ve istenilen tüm belgeler ekte eksiksiz olarak sunulmuştur. İhaleye kabulümü arz ederim.',
      rehberNotu: 'Geçici teminat makbuzu aslı ve imza sirküleri mutlaka ekte olmalıdır.',
      etiket: 'İştirak',
      formTipi: 'dilekce'
    },
    {
      id: 'dik-teminat-iade',
      kategori: 'Teminat İşlemleri',
      baslik: 'Geçici Teminat İadesi Talep Dilekçesi',
      kisaAciklama: 'İhaleyi kazanamayan veya çekilen isteklinin yatırdığı teminatı geri alma dilekçesi.',
      varsayilanHitap: 'MALİ HİZMETLER MÜDÜRLÜĞÜNE',
      varsayilanKonu: 'Geçici Teminatın İadesi',
      tamMetin:
        '2886 Sayılı Kanun uyarınca [TARİH] tarihinde yapılan ihaleye katılmak amacıyla yatırmış olduğum [MİKTAR] TL tutarındaki geçici teminatımın; ihale uhdemde kalmadığından dolayı aşağıda belirtmiş olduğum banka IBAN hesabıma iade edilmesini saygılarımla arz ederim.',
      rehberNotu: 'İade yalnızca geçici teminatı yatıran şahıs veya şirketin kendi hesabına yapılabilir.',
      etiket: 'Teminat İade',
      formTipi: 'dilekce'
    },
    {
      id: 'dik-sozlesme-davet',
      kategori: 'Tebligat & Sözleşme',
      baslik: 'İhale Kararı Tebligatı ve Kesin Teminat / Sözleşmeye Davet Mektubu',
      kisaAciklama: 'İhaleyi kazanan istekliye noter veya tebligat yoluyla gönderilen resmi davet mektubu.',
      varsayilanHitap: 'SAYIN [YÜKLENİCİ / İSTEKLİ]',
      varsayilanKonu: 'İhale Kararı ve Sözleşmeye Davet (2886 m.31 & m.57)',
      tamMetin:
        'İdaremizce 2886 Sayılı Devlet İhale Kanunu uyarınca gerçekleştirilen ihale, İta Amirinin onayıyla kesinleşmiş olup uhdenizde kalmıştır. Kanunun 57. maddesi gereğince, tebligat tarihinden itibaren 15 (on beş) gün içerisinde ihale bedeli üzerinden hesaplanan kesin teminatı yatırarak noter tasdikli kira/satış sözleşmesini imzalamak üzere İdaremize müracaat etmeniz hususu tebliğ olunur.',
      rehberNotu: '15 günlük yasal süre tebligatın tebellüğ edildiği tarihten itibaren başlar.',
      etiket: 'Davet',
      formTipi: 'ust_yazi'
    },
    {
      id: 'dik-teslim-tutanak',
      kategori: 'Teslim & Kabul',
      baslik: 'Taşınmaz Yer Teslim ve Tahliye Tespit Tutanağı',
      kisaAciklama: 'Taşınmazın fiziki durumunun taraflarca tespit edilerek anahtarlarının teslim tutanağı.',
      varsayilanHitap: 'TUTANAKTIR',
      varsayilanKonu: 'Taşınmaz Yer Teslim Tutanağı',
      tamMetin:
        'İdaremiz ile kiracı/alıcı arasında imzalanan sözleşme uyarınca, bahse konu taşınmaz mahallinde incelenmiş; elektrik, su sayaç endeksleri okunmuş ve fiziki durumu fotoğraflanarak kullanıma hazır vaziyette kiracıya/alıcıya fiilen teslim edilmiştir. İşbu tutanak 3 nüsha olarak düzenlenip imza altına alınmıştır.',
      rehberNotu: 'Sayaç endeksleri ve demirbaş listesi tutanağa eklenmelidir.',
      etiket: 'Teslimat',
      formTipi: 'tutanak'
    },
    {
      id: 'dik-kira-ihtar',
      kategori: 'İhtar & Hukuk',
      baslik: 'Vadesi Geçmiş Kira Borcu ve Tahliye İhtarnamesi',
      kisaAciklama: 'Kirasını ödemeyen kiracıya yasal 30 günlük fesih ve tahliye ihtarı.',
      varsayilanHitap: 'KİRACI SAYIN [KİRACI ADI / ÜNVANI]',
      varsayilanKonu: 'Kira Borcunun Ödenmesi ve Tahliye İhtarı (TBK m.315)',
      tamMetin:
        'İdaremiz kiracısı bulunduğunuz taşınmaza ait vadesi geçmiş [DÖNEM] aylarına ait toplam [BORÇ] TL kira borcunuz bulunmaktadır. İşbu ihtarnamenin tebliğinden itibaren Türk Borçlar Kanunu gereğince 30 (otuz) gün içinde ödenmesi, aksi halde sözleşmenin feshedilerek taşınmazın tahliyesi ve icra takibi başlatılacağı ihtaren bildirilir.',
      rehberNotu: 'Sayıştay denetiminde tahakkuk ve tahsilat takibinin zamanında yapıldığı bu ihtarlarla ispatlanır.',
      etiket: 'İhtarname',
      formTipi: 'ust_yazi'
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
    },
    {
      id: 'ebys-kurumlar-arasi-yazi',
      kategori: 'Dış Yazışma',
      baslik: 'Kurumlar Arası Bilgi ve Görüş İsteme Resmî Yazısı',
      kisaAciklama: 'Başka bir kamu idaresine resmi bilgi, görüş veya belge sorma yazısı.',
      varsayilanHitap: 'ÇEVRE, ŞEHİRCİLİK VE İKLİM DEĞİŞİKLİĞİ İL MÜDÜRLÜĞÜNE',
      varsayilanKonu: 'Teknik Görüş ve İnceleme Talebi',
      tamMetin:
        'İdaremizce yürütülmekte olan proje ve kamu hizmetleri kapsamında; mevzuat ve uygulamaya esas olmak üzere bahse konu husustaki teknik ve hukuki görüşünüz ile varsa ilgili kayıt ve belgelerin birer suretinin tarafımıza gönderilmesini arz ve rica ederim.',
      rehberNotu: 'Üst makamlara "Arz ederim", ast veya muadillere "Rica ederim", karma dağıtımda "Arz ve rica ederim" kullanılır.',
      etiket: 'Resmi Yazı',
      formTipi: 'ust_yazi'
    },
    {
      id: 'ebys-vekalet-oluru',
      kategori: 'Makam Oluru',
      baslik: 'İmza Yetkisi Devri ve Göreve Vekalet Oluru',
      kisaAciklama: 'İzin, rapor veya görev sebebiyle ayrılan yöneticinin imza yetkisi devri.',
      varsayilanHitap: 'BAŞKANLIK MAKAMINA / KAYMAKAMLIK MAKAMINA',
      varsayilanKonu: 'Göreve Vekalet ve İmza Yetkisi',
      tamMetin:
        'Daire Başkanlığımız / Müdürlüğümüz uhdesinde görevli Harcama Yetkilisinin kanuni izin/rapor sebebiyle görevde bulunamayacağı [TARİH-1] - [TARİH-2] tarihleri arasında; kamu hizmetlerinin aksamaması adına ilgili görevin [VEKİL PERSONEL] tarafından vekaleten yürütülmesini ve imza yetkisinin devrini olurlarınıza arz ederim.',
      rehberNotu: 'Vekalet oluru olmadan atılan imzalar hukuken yetkisiz imza sayılır.',
      etiket: 'Vekalet',
      formTipi: 'onay_belgesi'
    }
  ],

  'modul-personel-izin': [
    {
      id: 'pers-mazeret-evlilik-dogum',
      kategori: 'Mazeret İzni',
      baslik: '657 DMK Madde 104 Mazeret İzni Talep Dilekçesi',
      kisaAciklama: 'Memurun evlilik, doğum, babalık veya birinci derece yakın vefatı mazeret izni dilekçesi.',
      varsayilanHitap: 'İNSAN KAYNAKLARI VE EĞİTİM MÜDÜRLÜĞÜNE',
      varsayilanKonu: 'Mazeret İzni Talebi (657 Sayılı Kanun m.104)',
      tamMetin:
        'Müdürlüğünüz bünyesinde görev yapmaktayım. 657 Sayılı Devlet Memurları Kanununun 104. maddesi gereğince, [EVLİLİK / DOĞUM / VEFAT] mazeretim dolayısıyla tarafıma kanunda belirtilen sürede (7 veya 10 gün) mazeret izni verilmesini saygılarımla arz ederim.',
      rehberNotu: 'Evlilik cüzdanı, doğum raporu veya ölüm belgesi dilekçe ekine iliştirilmelidir.',
      etiket: 'Mazeret',
      formTipi: 'dilekce'
    },
    {
      id: 'pers-saglik-rapor-intikal',
      kategori: 'Sağlık & Rapor',
      baslik: 'İstirahat / Sağlık Raporu İntikal ve İzne Çevrilme Müzekkeresi',
      kisaAciklama: 'Personelin sağlık tesisinden aldığı istirahat raporunun resmi izne dönüştürülmesi.',
      varsayilanHitap: 'HARCAMA YETKİLİĞİ MAKAMINA',
      varsayilanKonu: 'Sağlık Raporunun İzne Çevrilmesi',
      tamMetin:
        'Birimimiz personeli [AD SOYAD]\'ın [SAĞLIK KURULUŞU] tarafından tanzim edilen ve [GÜN] gün istirahatini uygun gören sağlık raporu ekte sunulmuştur. Devlet Memurlarına Verilecek Hastalık Raporları Yönetmeliği uyarınca söz konusu raporun hastalık iznine dönüştürülmesini olurlarınıza arz ederim.',
      rehberNotu: 'Tek hekim raporu en fazla 10 gün verilebilir; kontrol muayenesiyle toplam 20 günü geçemez.',
      etiket: 'Sağlık Raporu',
      formTipi: 'ust_yazi'
    },
    {
      id: 'pers-gorev-devir-tutanak',
      kategori: 'Görev Devri',
      baslik: 'Yıllık İzin Öncesi İş ve Dosya Teslim-Tesellüm Tutanağı',
      kisaAciklama: 'İzne çıkan personelin devam eden işlerini vekalet eden personele devir tutanağı.',
      varsayilanHitap: 'TUTANAKTIR',
      varsayilanKonu: 'İş ve Dosya Devir-Teslim Tutanağı',
      tamMetin:
        'Müdürlüğümüzde yürütülmekte olan doğrudan temin ve satın alma dosyaları ile evrak kayıt defteri; kanuni izne ayrılan [DEVREDEN PERSONEL] tarafından, izin süresince takip edilmek üzere [TESLİM ALAN VEKİL PERSONEL]\'e noksansız ve tüm ekleriyle birlikte teslim edilmiş ve işbu tutanak mahallinde imza altına alınmıştır.',
      rehberNotu: 'Sayıştay denetiminde acil sürelerin kaçırılmaması ve sorumluluk tespiti için hayati önem taşır.',
      etiket: 'Teslim Tutanağı',
      formTipi: 'tutanak'
    },
    {
      id: 'pers-fazla-mesai-idari-izin',
      kategori: 'Fazla Çalışma',
      baslik: 'Fazla Çalışma / Nöbet Karşılığı İdari İzin Talep Dilekçesi',
      kisaAciklama: 'Hafta sonu veya bayram mesaisi karşılığında idari izin kullanma dilekçesi.',
      varsayilanHitap: 'BİRİM MÜDÜRLÜĞÜNE',
      varsayilanKonu: 'Fazla Mesai Karşılığı İzin Talebi',
      tamMetin:
        'Kurumumuz bünyesinde [TARİHLERDE] acil hizmet ve projelerin tamamlanması maksadıyla mesai saatleri haricinde ifa etmiş olduğum [SAAT] saatlik fazla çalışmama istinaden; mevzuat gereğince tarafıma idari izin verilmesi hususunu müsaadelerinize arz ederim.',
      rehberNotu: 'Fazla mesai çizelgesi veya nöbet defteri fotokopisi dilekçeye eklenmelidir.',
      etiket: 'Mesai İzni',
      formTipi: 'dilekce'
    },
    {
      id: 'pers-gecici-gorev-yolluk',
      kategori: 'Görevlendirme',
      baslik: 'Geçici Görevlendirme ve Harcırah / Avans Talep Oluru',
      kisaAciklama: 'Birim dışı veya şehir dışı göreve giden personelin resmi yolluk onayı.',
      varsayilanHitap: 'HARCAMA YETKİLİSİNE',
      varsayilanKonu: 'Geçici Görevlendirme ve Yolluk Onayı (6245 Sayılı Kanun)',
      tamMetin:
        'Birimimiz personeli [AD SOYAD / UNVAN]\'ın [GÖREV YERİ] mahallinde gerçekleştirilecek inceleme, eğitim veya koordinasyon toplantısına katılmak üzere [TARİHLER] arasında geçici olarak görevlendirilmesini; 6245 Sayılı Harcırah Kanunu gereğince yolluk ve yevmiyesinin ilgili bütçe tertibinden ödenmesini uygun görüşle arz ederim.',
      rehberNotu: 'Ulaşım aracı (otobüs, uçak, resmi araç) onay belgesinde açıkça belirtilmelidir.',
      etiket: 'Görevlendirme',
      formTipi: 'onay_belgesi'
    },
    {
      id: 'pers-isci-ucretsiz-izin',
      kategori: 'İşçi İzinleri',
      baslik: '4857 Sayılı İş Kanunu Sürekli İşçi Ücretsiz Mazeret İzni Dilekçesi',
      kisaAciklama: 'Sürekli işçi ve sözleşmeli personelin yasal ücretsiz izin talebi.',
      varsayilanHitap: 'İNSAN KAYNAKLARI MÜDÜRLÜĞÜNE',
      varsayilanKonu: 'Ücretsiz Mazeret İzni Talebi (4857 Sayılı Kanun)',
      tamMetin:
        'Kurumunuzda 4857 Sayılı İş Kanunu kapsamında sürekli işçi kadrosunda görev yapmaktayım. Ailevi ve şahsi mazeretim sebebiyle [TARİH-1] ile [TARİH-2] tarihleri arasında tarafıma [GÜN] gün ücretsiz izin verilmesini saygılarımla arz ederim.',
      rehberNotu: 'İşverenin onayı olmadan ücretsiz izne çıkılamaz; SGK prim bildirgeleri buna göre düzenlenir.',
      etiket: 'İşçi İzni',
      formTipi: 'dilekce'
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
    },
    {
      baslik: 'Tutanaklarda Tarih, Saat ve Heyet İmzası Mecburiyeti',
      icerik:
        'Muayene ve kabul tutanakları hukuki tespit belgesidir. Mutlaka düzenlendiği gün, saat ve heyet üyelerinin (en az 2-3 kişi) imzasıyla tanzim edilmelidir.',
      tip: 'onemli'
    }
  ],

  'dik-devlet-ihale-2886': [
    {
      baslik: '2886 m.35 ve m.45 Açık Teklif İhale Kararı',
      icerik:
        'Taşınmaz satış ve kiralamalarında 2886 Sayılı Kanun m.45 uyarınca açık teklif usulü esastır. İhale günü katılımcıların huzurunda teklif zarfları açılır ve pey sürümü yaptırılarak karar zaptına bağlanır.',
      tip: 'mevzuat'
    },
    {
      baslik: '%3 Geçici Teminat ve %6 Kesin Teminat Oranı',
      icerik:
        'İhaleye katılabilmek için muhammen bedelin en az %3\'ü oranında geçici teminat yatırılması zorunludur. İhale üzerinde kalan istekli sözleşme öncesinde bedelin %6\'sı oranında kesin teminat yatırmakla mükelleftir.',
      tip: 'onemli'
    },
    {
      baslik: 'Basın İlan Kurumu ve Yerel Gazete Süreleri',
      icerik:
        'İlanlar ihale tarihinden en az 10 gün önce Resmî Gazete veya Basın İlan Kurumu aracılığıyla yerel gazetede yayımlanmalıdır. İlan yapılmadan gerçekleştirilen ihaleler Sayıştay denetiminde usulsüzlük gerekçesiyle iptal edilir.',
      tip: 'ipucu'
    },
    {
      baslik: 'İta Amirinin 15 Günlük Onay Süresi',
      icerik:
        'İhale komisyonu (encümen) tarafından alınan ihale kararı, ita amirince (Belediye Başkanı / Kaymakam) karar tarihinden itibaren en geç 15 iş günü içinde onaylanır veya iptal edilir.',
      tip: 'mevzuat'
    }
  ],

  'ebys-resmi-yazisma-studyosu': [
    {
      baslik: 'Yazışmalarda "Arz Ederim" ve "Rica Ederim" Kuralı',
      icerik:
        'Resmî Yazışma Yönetmeliğine göre; ast veya muadil kurumlara "Rica ederim", üst makamlara "Arz ederim", hem üst hem ast makamlara dağıtımlı yazılarda ise "Arz ve rica ederim" ibaresi kullanılır.',
      tip: 'onemli'
    },
    {
      baslik: 'DETSİS ve Dosya Planı Numaralama Mecburiyeti',
      icerik:
        'Her resmi evrakın sayı bloğunda İdarenin Devlet Teşkilatı Merkezi Kayıt Sistemi (DETSİS) kodu ve Standart Dosya Planı kodu bulunmalıdır.',
      tip: 'mevzuat'
    },
    {
      baslik: 'Karekod ve Belge Doğrulama Kodu',
      icerik:
        'E-imza ile imzalanan resmi yazıların alt bilgi kısmında evrak doğrulama linki ve karekod (QR kod) yer alması Resmî Yazışma Yönetmeliği m.26 gereğince zorunludur.',
      tip: 'ipucu'
    }
  ],

  'modul-personel-izin': [
    {
      baslik: '657 m.102 Yıllık İzin Hak Ediş Süreleri',
      icerik:
        'Hizmeti 1 yıldan 10 yıla kadar (10 yıl dahil) olan memurlar için 20 gün, hizmeti 10 yıldan fazla olanlar için 30 gün yıllık izin verilir. Zorunlu hallerde bu sürelere gidiş ve dönüş için en çok ikişer gün yol izni eklenebilir.',
      tip: 'mevzuat'
    },
    {
      baslik: 'Mazeret İzinleri Paraya Çevrilemez ve Ertelenemez',
      icerik:
        '657 m.104 kapsamında verilen evlilik (7 gün), babalık (10 gün) ve vefat (7 gün) mazeret izinleri olayın gerçekleştiği tarihten itibaren kullanılmak zorundadır; sonraki yıla devredilemez.',
      tip: 'onemli'
    },
    {
      baslik: 'Hastalık Raporlarının İntikal Süresi',
      icerik:
        'Memurlar, sağlık kurumlarınca verilen istirahat raporlarını raporun düzenlendiği günü takip eden mesai saati bitimine kadar kurumlarına intikal ettirmekle yükümlüdür.',
      tip: 'onemli'
    },
    {
      baslik: 'Vekalet Belirlenmeden Görev Mahallinden Ayrılma Yasağı',
      icerik:
        'İmza yetkisi veya mali sorumluluğu olan memurların izne ayrılmadan önce görevlerini vekaleten yürütecek personeli birim amirine bildirip onaylatmaları hizmetin aksamaması için zorunludur.',
      tip: 'ipucu'
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
