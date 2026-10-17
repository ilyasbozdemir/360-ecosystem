export const DATA_IhtiyacRaporu = {
  name: 'DATA_IhtiyacRaporu',
  description: 'Bağımsız ihtiyaç raporu ve lüzum müzekkeresi hazırlık kayıtları',
  columns: [
    {
      name: 'id',
      type: 'INTEGER',
      primaryKey: true,
      autoIncrement: true,
      description: 'Rapor ID'
    },
    {
      name: 'rapor_no',
      type: 'TEXT',
      notNull: true,
      unique: true,
      description: 'Benzersiz Rapor Numarası (Örn: IR-2026/001)'
    },
    { name: 'baslik', type: 'TEXT', notNull: true, description: 'İşin Adı / Temin Konusu' },
    { name: 'gerekce', type: 'TEXT', description: 'İhtiyaç Gerekçesi ve Kapsamı (Lüzum Müzekkeresi gerekçe metni)' },
    { name: 'birim_id', type: 'INTEGER', description: 'İlgili Harcama Birimi ID' },
    { name: 'birim_adi', type: 'TEXT', description: 'İlgili Harcama Birimi Adı' },
    { name: 'talep_eden_personel_id', type: 'INTEGER', description: 'Talep Eden Personel ID' },
    { name: 'talep_eden_personel', type: 'TEXT', description: 'Talep Eden Personel Adı Soyadı' },
    { name: 'talep_eden_unvan', type: 'TEXT', description: 'Talep Eden Personel Unvanı' },
    {
      name: 'durum',
      type: 'TEXT',
      notNull: true,
      default: "'taslak'",
      description: 'Rapor Durumu (taslak | onaylandi | dosyaya_aktarildi | iptal)'
    },
    { name: 'temin_dosya_id', type: 'INTEGER', description: 'İlişkilendirilen Alım Dosyası ID' },
    { name: 'tarih', type: 'DATE', default: 'CURRENT_DATE', description: 'Rapor Tarihi' },
    { name: 'onay_tarihi', type: 'DATE', description: 'Onay Tarihi' },
    {
      name: 'tahmini_butce',
      type: 'REAL',
      default: 0,
      description: 'Tahmini Bütçe Tutarı (Ön bilgi amaçlı tahmini öngörü; yaklaşık maliyet hesabı değildir)'
    },
    { name: 'notlar', type: 'TEXT', description: 'Özel Notlar ve Açıklamalar' },
    {
      name: 'created_at',
      type: 'DATETIME',
      default: 'CURRENT_TIMESTAMP',
      description: 'Oluşturulma Tarihi'
    },
    {
      name: 'updated_at',
      type: 'DATETIME',
      default: 'CURRENT_TIMESTAMP',
      description: 'Son Güncelleme'
    }
  ],
  constraints: [
    'UNIQUE(rapor_no)',
    'FOREIGN KEY(temin_dosya_id) REFERENCES DATA_TeminDosyasi(id) ON DELETE SET NULL',
    'FOREIGN KEY(birim_id) REFERENCES TANIM_Birim(id) ON DELETE SET NULL',
    'FOREIGN KEY(talep_eden_personel_id) REFERENCES TANIM_Personel(id) ON DELETE SET NULL'
  ],
  initialData: []
}
