export const DATA_KutuphaneBelgeSurum = {
  name: 'DATA_KutuphaneBelgeSurum',
  description: 'Belgelerim eklentisi değişmez belge sürümleri ve revizyon geçmişi',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
    { name: 'belge_id', type: 'INTEGER', notNull: true, description: 'Bağlı Belge ID' },
    { name: 'surum_no', type: 'INTEGER', notNull: true, description: 'Sıralı Sürüm Numarası (1, 2, 3...)' },
    { name: 'etiket', type: 'TEXT', description: 'İsteğe Bağlı Sürüm Etiketi (Örn: v1.0, İhale Öncesi Taslak)' },
    { name: 'not', type: 'TEXT', description: 'Sürüm Değişiklik Notu' },
    { name: 'icerik_html', type: 'TEXT', notNull: true, description: 'Kanonik HTML İçeriği (data-ph, data-cond, data-each)' },
    { name: 'kosullar_json', type: 'TEXT', default: '[]', description: 'Belgeye Bağlı Koşullar (JSON Array)' },
    {
      name: 'created_at',
      type: 'DATETIME',
      default: 'CURRENT_TIMESTAMP',
      description: 'Sürüm Oluşturulma Tarihi'
    }
  ],
  constraints: [
    'FOREIGN KEY(belge_id) REFERENCES DATA_KutuphaneBelge(id) ON DELETE CASCADE'
  ],
  initialData: []
}
