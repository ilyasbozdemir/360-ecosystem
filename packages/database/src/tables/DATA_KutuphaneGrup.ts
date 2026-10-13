export const DATA_KutuphaneGrup = {
  name: 'DATA_KutuphaneGrup',
  description: 'Belgelerim eklentisi serbest kullanıcı klasör/grup ağacı',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
    { name: 'parent_id', type: 'INTEGER', description: 'Üst Grup ID (İç içe klasör yapısı)' },
    { name: 'ad', type: 'TEXT', notNull: true, description: 'Grup Adı' },
    { name: 'renk', type: 'TEXT', default: 'blue', description: 'Grup Rengi' },
    { name: 'ikon', type: 'TEXT', default: 'Folder', description: 'Grup İkonu' },
    { name: 'sira', type: 'INTEGER', default: 0, description: 'Görüntülenme Sırası' }
  ],
  constraints: [
    'FOREIGN KEY(parent_id) REFERENCES DATA_KutuphaneGrup(id) ON DELETE CASCADE'
  ],
  initialData: []
}
