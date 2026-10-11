/**
 * Parses and resolves tokenized formula strings e.g. {{TANIM_Kurum.detsis_kodu}}
 */
export async function resolveFormula(
  formul: string,
  activeDosyaId: number,
  queryExecutor: (sql: string, params: any[]) => Promise<any[]>
): Promise<string> {
  const tokenRegex = /\{\{([^}]+)\}\}/g;
  let resolved = formul;

  const matches = [...formul.matchAll(tokenRegex)];

  for (const m of matches) {
    const fullToken = m[0];
    const path = m[1].trim();
    const parts = path.split('.');

    if (parts.length === 2) {
      let [table, column] = parts;

      // Column normalization in formulas
      if (table === 'TANIM_Kurum' && column === 'ust_idari_birim') {
        column = 'ust_kurum_adi';
      }
      if (table === 'DATA_TeminDosyasi') {
        if (column === 'temin_no_clean') {
          column = 'temin_no';
        } else if (column === 'olusturma_tarihi') {
          column = 'dosya_acilis_tarihi';
        } else if (column === 'onaylayan_personel_id') {
          column = 'onay_personel_id';
        } else if (column === 'kazanan_firma_id') {
          column = 'firma_id';
        }
      }

      try {
        let query = `SELECT ${column} FROM ${table} LIMIT 1`;
        let params: any[] = [];

        if (table.toLowerCase().startsWith('data_')) {
          query = `SELECT ${column} FROM ${table} WHERE id = ? LIMIT 1`;
          params = [activeDosyaId];
        }

        const res = await queryExecutor(query, params);
        let val = res?.[0]?.[column] ?? '';
        if (parts[1] === 'temin_no_clean' && typeof val === 'string') {
          val = val.replace(/[^0-9]/g, '') || val;
        }
        if (column === 'detsis_kodu' && (!val || String(val).trim() === '')) {
          val = '0000000000';
        }
        resolved = resolved.replace(fullToken, String(val));
      } catch (err) {
        resolved = resolved.replace(fullToken, '');
      }
    }
  }
  return resolved;
}
