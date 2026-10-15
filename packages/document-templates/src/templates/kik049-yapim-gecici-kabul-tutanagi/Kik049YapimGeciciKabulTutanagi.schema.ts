import { z } from "zod";

export const Kik049YapimGeciciKabulTutanagiSchema = z.object({
  solLogo: z.string().optional(),
  sagLogo: z.string().optional(),
  kurumAdi: z.string().optional(),
  idareAdi: z.string().optional(),
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
  sozlesmeyeGoreBitisTarihi: z.string().optional(),
  varsaSureUzatimlari: z.string().optional(),
  sureUzatimiDahilBitisTarihi: z.string().optional(),
  isinBitirildigiTarih: z.string().optional(),
  geciciKabulItibarTarihi: z.string().optional(),

  // Komisyon & İnceleme Metni
  makamOluruTarihi: z.string().optional(),
  baskanAdi: z.string().optional(),
  baskanUnvan: z.string().optional(),
  incelemeBaslangicTarihi: z.string().optional(),
  incelemeBitisTarihi: z.string().optional(),
  incelemeTarihAraligi: z.string().optional(),

  // İstisna ve Kusurlar
  kusurVeNoksanlar: z.string().optional(),

  // Sonuç
  bitimItibarTarihi: z.string().optional(),
  onayMakami: z.string().optional(),
  nushaSayisi: z.string().optional(),

  // İmzalar ve Tarih
  tarih: z.string().optional(),
  kabulTarihi: z.string().optional(),
  onayTarihi: z.string().optional(),
  harcamaYetkilisiAdi: z.string().optional(),
  harcamaYetkilisiUnvan: z.string().optional(),

  komisyon: z.array(
    z.object({
      adSoyad: z.string().optional(),
      unvan: z.string().optional(),
      gorevi: z.string().optional(),
    })
  ).optional(),
});

export type Kik049YapimGeciciKabulTutanagiData = z.infer<typeof Kik049YapimGeciciKabulTutanagiSchema>;
