export const SAMPLE_DOGRUDA_TEMIN_JSON = JSON.stringify(
  {
    id: 'dt_2025_2_183260',
    versiyon: '1.0',
    aktarimTarihi: '2025-10-22T10:00:00.000Z',
    dosyaBilgileri: {
      dosyaNo: '2025/2',
      dosyaAcilisTarihi: '2025-10-22',
      butceYili: '2025',
      butce: 'Genel Bütçe',
      dogrudanTeminNumarasi: '2',
      ihaleTarihi: '2025-10-24',
      ihaleAsamasi: 'Yaklaşık Maliyet / Teklif Toplama',
      isinAdi: 'Su Sayacı Alımı',
      aciklama: 'Ev Su Sayacı Alımı',
      ihalesiYapilacakBirim: 'Fen İşleri Müdürlüğü',
      sunulacakMakam: 'İdare Başkanlığı Makamına',
      ihtiyacYeri: 'Ana Ambar / Merkez Depo',
      talepTarihSayisi: '2025/102',
      kurumsalKod: '57.31.__.__',
      fonksiyonelKod: '...',
      finansalKod: '',
      ihaleTipi: 'Doğrudan Temin',
      alimTuru: 'Mal Alımı',
      madde: '22/d*',
      teklifSozlesmeTuru: 'Birim Fiyat',
      altYuklenici: 'Hayır',
      kismiTeklif: 'Hayır',
      fiyatFarkiDayanagi: 'Fiyat Farkı Ödenmeyecek',
      yatirimProjeNo: '',
      avans: 'Hayır',
      yaklasikMaliyetDurumu: 'Burada Hesaplanacak',
      kdv: 'Hariç',
      hesaplamaEsasi: 'En düşük fiyat esasına göre',
      hesaplamada: 'Sadece araştırma fiyatları dikkate alınacak',
      tibbiCihaz: 'Hayır',
      irtibatYetkilisi: 'Mehmet MUTLU',
      sonTeklifVermeTarihSaati: '2025-10-24T14:30',
      tahminiBitisTarihi: '2025-10-24'
    },
    malzemeler: [
      {
        siraNo: 1,
        malzemeKodu: 'SAYAC-01',
        malzemeAdi: 'Ev Tipi Soğuk Su Sayacı',
        ozelligi: 'DN20 (3/4"), R160, Pirinç Gövde, Manyetik Korumalı',
        birimi: 'Adet',
        kdvOrani: '20',
        miktar: 100,
        birimFiyat: 450.0,
        toplamTutar: 45000.0,
        fiyatKaynagi: 'Anadolu Sayaç Ltd. Şti. (kazanan)',
        tasinirKodu: '150.01.02.04',
        okasKodu: '38411100-3'
      }
    ],
    teklifler: [
      {
        id: 'tek_101',
        siraNo: 1,
        firma: 'Anadolu Sayaç San. ve Tic. Ltd. Şti.',
        firmaNo: 'F-101',
        vergiNo: '1234567890',
        iletisim: '0312 444 01 02 · info@anadolusayac.com',
        yer: 'Yenimahalle / Ankara',
        yetkili: 'Ali KAYA',
        istekTarihi: '2025-10-22',
        istekSekli: 'E-posta',
        durum: 'Kabul Edildi',
        teklifTarihi: '2025-10-23',
        tutarKdvHaric: 45000.0,
        kdvOrani: '20',
        gecerlilikGun: '30',
        not: 'Nakliye ve ambar teslimi dahildir.',
        kalemFiyatlari: ['450.00']
      },
      {
        id: 'tek_102',
        siraNo: 2,
        firma: 'Toros Vana ve Su Sistemleri A.Ş.',
        firmaNo: 'F-102',
        vergiNo: '9876543210',
        iletisim: '0322 333 44 55 · satis@torosvana.com',
        yer: 'Seyhan / Adana',
        yetkili: 'Murat DEMİR',
        istekTarihi: '2025-10-22',
        istekSekli: 'E-posta',
        durum: 'Teklif Geldi',
        teklifTarihi: '2025-10-23',
        tutarKdvHaric: 48500.0,
        kdvOrani: '20',
        gecerlilikGun: '30',
        not: 'Fabrika teslim fiyattır.',
        kalemFiyatlari: ['485.00']
      }
    ],
    kazananFirmalar: [
      {
        firmaNo: 'F-101',
        firmaUnvani: 'Anadolu Sayaç San. ve Tic. Ltd. Şti.',
        iletisim: '0312 444 01 02',
        semtSehir: 'Yenimahalle / Ankara',
        sozlesme: '24.10.2025 Tarihli Mal Alım Sözleşmesi'
      }
    ],
    komisyonlar: {
      yaklasikMaliyet: [
        {
          siraNo: 1,
          gorevi: 'Başkan',
          adiSoyadi: 'Mehmet MUTLU',
          unvani: 'Fen İşleri Md. Yrd.'
        },
        {
          siraNo: 2,
          gorevi: 'Üye',
          adiSoyadi: 'Mustafa ÇALIŞKAN',
          unvani: 'Tekniker'
        },
        {
          siraNo: 3,
          gorevi: 'Üye',
          adiSoyadi: 'Durali DEMİRCAN',
          unvani: 'Personel'
        }
      ],
      muayeneKabul: [
        {
          siraNo: 1,
          gorevi: 'Başkan',
          adiSoyadi: 'Mehmet MUTLU',
          unvani: 'Fen İşleri Md. Yrd.'
        },
        {
          siraNo: 2,
          gorevi: 'Üye',
          adiSoyadi: 'Halis ERDOĞAN',
          unvani: 'Ambar Sorumlusu'
        },
        {
          siraNo: 3,
          gorevi: 'Üye',
          adiSoyadi: 'Ahmet ARI',
          unvani: 'Teknisyen'
        }
      ]
    },
    kabulTutanaklari: [
      {
        id: 'kab_001',
        kabulTarihi: '2025-10-24',
        firma: 'Anadolu Sayaç San. ve Tic. Ltd. Şti.',
        sayi: '2025/KT-02',
        teslimAlan: 'Halis ERDOĞAN',
        teslimYeri: 'Ana Ambar / Merkez Depo',
        faturaTarihi: '2025-10-24',
        faturaNo: 'ANS-2025-00412',
        not: 'Sayım ve kalibrasyon kontrolü yapılarak eksiksiz teslim alındı.',
        malzemeler: [
          {
            siraNo: 1,
            malzemeAdi: 'Ev Tipi Soğuk Su Sayacı',
            ozelligi: 'DN20 (3/4"), R160',
            birimi: 'Adet',
            miktari: '100',
            teslimAlinan: '100',
            kabulMiktari: '100'
          }
        ]
      }
    ],
    sablon: {
      evrakSayisi: 'E-2025/891',
      baskanAdi: 'Ahmet YILMAZ',
      baskanUnvan: 'İdare Yetkilisi',
      hazirlayanPersonelAdi: 'Mehmet MUTLU',
      hazirlayanPersonelUnvan: 'Fen İşleri Şube Müdürü',
      onaylayanPersonelAdi: 'Ahmet YILMAZ',
      onaylayanPersonelUnvan: 'Harcama Yetkilisi'
    }
  },
  null,
  2
)

export const SAMPLE_HARICI_DT_JSON = SAMPLE_DOGRUDA_TEMIN_JSON