import { z } from "zod";

export const Kik048YapimGeciciKabulTeklifSchema = z.object({
  solLogo: z.string().optional(),
  sagLogo: z.string().optional(),
  kurumAdi: z.string().optional(),
  harcamaBirimi: z.string().optional(),
  
  // KİK & Standart Form Bilgileri (İsteğe Bağlı)
  kikKodu: z.string().optional(),
  kikAdi: z.string().optional(),
  standartFormKodu: z.string().optional(),
  standartFormAdi: z.string().optional(),
  
  // Tablo Başlık Alanları
  isinAdi: z.string().optional(),
  dosyaKonusu: z.string().optional(),
  yukleniciFirma: z.string().optional(),
  yukleniciYetkili: z.string().optional(),
  sozlesmeTarihi: z.string().optional(),
  sozlesmeBedeli: z.union([z.string(), z.number()]).optional(),
  isinSuresiGun: z.union([z.string(), z.number()]).optional(),
  sozlesmeyeGoreBitisTarihi: z.string().optional(),
  varsaSureUzatimlari: z.string().optional(),
  sureUzatimiDahilBitisTarihi: z.string().optional(),
  isinBitirildigiTarih: z.string().optional(),

  // Paragraf Değişkenleri
  yukleniciDilekceTarihi: z.string().optional(),
  talimatVerenMakam: z.string().optional(),
  onIncelemeTarihi: z.string().optional(),
  tamamlanmaDurumu: z.string().optional(), // 'tamamlandığı' veya 'tamamlanmadığı'
  kabuleHazirDurumu: z.string().optional(), // 'hazır olduğu' veya 'hazır olmadığı'
  
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
  komisyon: z.array(
    z.object({
      adSoyad: z.string().optional(),
      unvan: z.string().optional(),
      gorevi: z.string().optional(),
    })
  ).optional(),
});

export type Kik048YapimGeciciKabulTeklifData = z.infer<typeof Kik048YapimGeciciKabulTeklifSchema>;
