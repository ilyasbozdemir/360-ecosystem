import { z } from "zod";

export const Kik050YapimKesinKabulTeklifSchema = z.object({
  solLogo: z.string().optional(),
  sagLogo: z.string().optional(),
  kurumAdi: z.string().optional(),
  harcamaBirimi: z.string().optional(),

  // KİK & Standart Form Bilgileri (İsteğe Bağlı)
  kikKodu: z.string().optional(),
  kikAdi: z.string().optional(),
  standartFormKodu: z.string().optional(),
  standartFormAdi: z.string().optional(),

  // Tablo Alanları
  isinAdi: z.string().optional(),
  dosyaKonusu: z.string().optional(),
  yukleniciFirma: z.string().optional(),
  yukleniciYetkili: z.string().optional(),
  sozlesmeTarihi: z.string().optional(),
  sozlesmeBedeli: z.union([z.string(), z.number()]).optional(),
  isinSuresiGun: z.union([z.string(), z.number()]).optional(),
  sozlesmeyeGoreBitimTarihi: z.string().optional(),
  varsaGeciciKabuldenOncekiSureUzatimi: z.string().optional(),
  varsaGeciciKabuldenSonrakiSureUzatimi: z.string().optional(),
  sureUzatimiDahilBitisTarihi: z.string().optional(),
  isinBitirildigiTarih: z.string().optional(),
  geciciKabulItibarTarihi: z.string().optional(),
  teminatSuresi: z.string().optional(),

  // Metin Değişkenleri
  geciciKabulTarihi: z.string().optional(),
  kesinKabulZamaniTarihi: z.string().optional(),
  muayeneTarihi: z.string().optional(),
  kesinKabulUygunlukDurumu: z.string().optional(), // 'olduğu' veya 'olmadığı'
  komisyonTeskilTalebi: z.string().optional(), // 'edilmesini' veya 'edilmemesini'

  // İmzalar ve Tarih
  tarih: z.string().optional(),
  kabulTarihi: z.string().optional(),

  gorevliler: z.array(
    z.object({
      adSoyad: z.string().optional(),
      unvan: z.string().optional(),
      gorevi: z.string().optional(),
    })
  ).optional(),
});

export type Kik050YapimKesinKabulTeklifData = z.infer<typeof Kik050YapimKesinKabulTeklifSchema>;
