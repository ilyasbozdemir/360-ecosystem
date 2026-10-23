import { describe, it, expect } from 'vitest';
import {
  resolveEvrakSayisi,
  formatOfficialEvrakSayisi,
  resolveAntetSatirlari,
  resolveFormula
} from '../resolver/mappingResolver';

describe('Document Templates - mappingResolver Modular Helpers', () => {
  it('resolveEvrakSayisi produces a valid DETSIS formatted code with defaults', async () => {
    const mockExecutor = async (_sql: string, _params: any[]) => [];
    const evrakSayisi = await resolveEvrakSayisi(1, mockExecutor);
    expect(evrakSayisi).toMatch(/^\d{8}-934\.\d{2}-\d{4}$/);
    expect(evrakSayisi).toBe('00000000-934.01-0001');
  });

  it('resolveEvrakSayisi formats custom detsis code and service type', async () => {
    const mockExecutor = async (sql: string, params: any[]) => {
      if (sql.includes('TANIM_Kurum')) {
        return [{ detsis_kodu: '12345678' }];
      }
      if (sql.includes('DATA_TeminDosyasi') && sql.includes('WHERE id = ?')) {
        return [{ temin_no: '2026/0042', tur: 'hizmet', butce_yili: 2026 }];
      }
      return [];
    };

    const evrakSayisi = await resolveEvrakSayisi(5, mockExecutor);
    expect(evrakSayisi).toBe('12345678-934.02-0042');
  });

  it('resolveAntetSatirlari returns parsed JSON lines when available', async () => {
    const mockExecutor = async (sql: string) => {
      if (sql.includes('TANIM_Kurum')) {
        return [{ kurum_anteti: JSON.stringify(['T.C.', 'ANKARA BÜYÜKŞEHİR BELEDİYESİ']) }];
      }
      return [];
    };

    const antet = await resolveAntetSatirlari(1, mockExecutor);
    expect(antet).toEqual(['T.C.', 'ANKARA BÜYÜKŞEHİR BELEDİYESİ']);
  });

  it('resolveFormula resolves {{table.column}} tokens correctly', async () => {
    const mockExecutor = async (sql: string) => {
      if (sql.includes('TANIM_Kurum')) {
        return [{ detsis_kodu: '99887766' }];
      }
      return [];
    };

    const formula = 'DETSIS-{{TANIM_Kurum.detsis_kodu}}';
    const result = await resolveFormula(formula, 1, mockExecutor);
    expect(result).toBe('DETSIS-99887766');
  });

  it('formatOfficialEvrakSayisi formats slashed or unpadded numbers correctly', () => {
    // When evrakSayisi is slashed like '2026/1'
    const res1 = formatOfficialEvrakSayisi({
      evrakSayisi: '2026/1',
      detsisNo: '10234521',
      tur: 'mal'
    });
    expect(res1).toBe('10234521-934.01-0001');

    // When already official format with E- prefix, strips E-
    const res2 = formatOfficialEvrakSayisi({
      evrakSayisi: 'E-10234521-934.01-0005'
    });
    expect(res2).toBe('10234521-934.01-0005');

    // When hizmet with padded sayisi
    const res3 = formatOfficialEvrakSayisi({
      sayisi: '42',
      detsisNo: '87654321',
      tur: 'hizmet'
    });
    expect(res3).toBe('87654321-934.02-0042');
  });
});
