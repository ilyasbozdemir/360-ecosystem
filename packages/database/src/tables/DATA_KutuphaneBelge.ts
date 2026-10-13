export const DATA_KutuphaneBelge = {
  name: 'DATA_KutuphaneBelge',
  description: 'Belgelerim eklentisi serbest kullanıcı belgeleri',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
    { name: 'grup_id', type: 'INTEGER', description: 'Bağlı Olduğu Grup ID' },
    { name: 'ad', type: 'TEXT', notNull: true, description: 'Belge Adı' },
    { name: 'etiketler', type: 'TEXT', default: '[]', description: 'Serbest Etiketler (JSON String)' },
    { name: 'aktif_surum_id', type: 'INTEGER', description: 'Geçerli / Aktif Sürüm ID' },
    { name: 'arsiv_mi', type: 'INTEGER', default: 0, description: 'Arşivlendi mi? (0/1)' },
    { name: 'favori_mi', type: 'INTEGER', default: 0, description: 'Favori mi? (0/1)' },
    { name: 'silindi_at', type: 'DATETIME', description: 'Çöp Kutusuna Atılma Tarihi (30 gün saklanır)' }
  ],
  constraints: [
    'FOREIGN KEY(grup_id) REFERENCES DATA_KutuphaneGrup(id) ON DELETE SET NULL'
  ],
  initialData: []
}
