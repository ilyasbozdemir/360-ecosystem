export const DATA_IhtiyacRaporuKalem = {
  name: 'DATA_IhtiyacRaporuKalem',
  description: 'İhtiyaç raporuna bağlı malzeme, hizmet veya yapım işi kalemleri',
  columns: [
    {
      name: 'id',
      type: 'INTEGER',
      primaryKey: true,
      autoIncrement: true,
      description: 'Kalem Sıra / ID'
    },
    {
      name: 'rapor_id',
      type: 'INTEGER',
      notNull: true,
      description: 'Bağlı Olduğu İhtiyaç Raporu ID'
    },
    { name: 'sira_no', type: 'INTEGER', description: 'Kalem Sıra No' },
    { name: 'kalem_adi', type: 'TEXT', notNull: true, description: 'Malzeme / Hizmet / Yapım Adı' },
    {
      name: 'tipi',
      type: 'TEXT',
      notNull: true,
      default: "'Mal'",
      description: 'Alım Tipi (Mal | Hizmet | Yapım | Danışmanlık)'
    },
    {
      name: 'birim',
      type: 'TEXT',
      default: "'Adet'",
      description: 'Ölçü Birimi (Adet, Kg, Lt, Metre, Gün vb.)'
    },
    { name: 'miktar', type: 'REAL', notNull: true, default: 1, description: 'Talep Edilen Miktar' },
    { name: 'kdv_orani', type: 'REAL', default: 20, description: 'KDV Oranı (%)' },
    { name: 'tasinir_kodu', type: 'TEXT', description: 'Taşınır Kod No' },
    { name: 'okas_kodu', type: 'TEXT', description: 'OKAS Kod No' },
    { name: 'poz_no', type: 'TEXT', description: 'Poz No (Yapım İşleri İçin)' },
    { name: 'aciklama', type: 'TEXT', description: 'Teknik Özellik / Kalem Açıklaması' },
    { name: 'tahmini_birim_fiyat', type: 'REAL', default: 0, description: 'Tahmini Birim Fiyat (Opsiyonel Ön Bilgi)' },
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
  constraints: ['FOREIGN KEY(rapor_id) REFERENCES DATA_IhtiyacRaporu(id) ON DELETE CASCADE'],
  initialData: []
}
