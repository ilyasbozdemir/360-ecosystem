export const DATA_KutuphaneYerTutucu = {
  name: 'DATA_KutuphaneYerTutucu',
  description: 'Belgelerim eklentisi üç kapsamlı (genel, grup, belge) dinamik yer tutucu tanımları',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
    {
      name: 'kapsam',
      type: 'TEXT',
      notNull: true,
      description: 'Kapsam Seviyesi (genel, grup, belge)'
    },
    {
      name: 'kapsam_id',
      type: 'INTEGER',
      description: 'Kapsam ID (Grup ID veya Belge ID, genel için NULL)'
    },
    { name: 'anahtar', type: 'TEXT', notNull: true, description: 'Değişken Anahtarı (data-ph ile eşleşir)' },
    { name: 'etiket', type: 'TEXT', notNull: true, description: 'Görünen Etiket Adı' },
    {
      name: 'tip',
      type: 'TEXT',
      default: 'metin',
      description: 'Veri Tipi (metin, sayi, para, tarih, secim, cok_satirli, liste)'
    },
    { name: 'varsayilan', type: 'TEXT', description: 'Varsayılan Değer (JSON veya Düz Metin)' },
    { name: 'secenekler_json', type: 'TEXT', description: 'Seçenekler veya Liste Alt Alan Şeması (JSON String)' },
    { name: 'kaynak', type: 'TEXT', default: 'elle', description: 'Veri Kaynağı (elle veya dosya alanı)' },
    { name: 'sira', type: 'INTEGER', default: 0, description: 'Form Görüntülenme Sırası' }
  ],
  initialData: []
}
