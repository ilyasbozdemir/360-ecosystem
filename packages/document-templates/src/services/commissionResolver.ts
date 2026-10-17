export type CommissionCategory = 'maliyet' | 'muayene' | 'ihale' | 'unmapped';

export interface CommissionResolutionInput {
  komisyon_id?: number | string | null;
  komisyon_turu?: string | null;
  komisyon_adi?: string | null;
  gorev?: string | null;
  belge_kapsami?: string | null;
  belgeKapsami?: string | null;
  [key: string]: any;
}

/**
 * Central, type-safe commission category resolver.
 * Replaces scattered includes() and magic numbers with layered precedence:
 * 1. Explicit scope (belge_kapsami / belgeKapsami)
 * 2. Database ID fallback (komisyon_id = 1 -> maliyet, 2 -> muayene)
 * 3. Text classification fallback (komisyon_turu / komisyon_adi / gorev)
 */
export function resolveCommissionCategory(
  input: CommissionResolutionInput | null | undefined
): CommissionCategory {
  if (!input) return 'unmapped';

  // 1. Explicit Scope Precedence
  const rawScope = input.belge_kapsami ?? input.belgeKapsami;
  if (rawScope !== undefined && rawScope !== null) {
    const scope = String(rawScope).trim().toLowerCase();
    if (scope === 'piyasa_arastirma' || scope === 'yaklasik_maliyet') {
      return 'maliyet';
    }
    if (scope === 'muayene_kabul') {
      return 'muayene';
    }
    if (scope === 'ihale_komisyonu' || scope === 'ihale') {
      return 'ihale';
    }
    if (scope === 'gizli' || scope === 'none') {
      return 'unmapped';
    }
  }

  // 2. Tur / Type code precedence (from TANIM_Komisyon.tur or komisyon_tur_kodu)
  const rawTur = input.tur ?? input.komisyon_tur_kodu ?? input.komisyonTuruKodu;
  if (rawTur !== undefined && rawTur !== null && rawTur !== '') {
    const turStr = String(rawTur).trim().toLowerCase();
    if (turStr.includes('yaklasik') || turStr.includes('maliyet') || turStr.includes('fiyat') || turStr.includes('piyasa')) {
      return 'maliyet';
    }
    if (turStr.includes('muayene') || turStr.includes('kabul')) {
      return 'muayene';
    }
    if (turStr.includes('ihale')) {
      return 'ihale';
    }
  }

  // 3. Database ID Precedence:
  // In initial default seeds, komisyon_id = 1 was Yaklasik Maliyet.
  // komisyon_id = 2 was Muayene ONLY if the commission/task text does not explicitly say Yaklasik Maliyet or Fiyat Arastirma.
  // (In many databases, Yaklasik Maliyet was created with id = 2 and Muayene with id = 3).
  const rawId = input.komisyon_id;
  if (rawId !== undefined && rawId !== null && rawId !== '') {
    const numId = Number(rawId);
    if (numId === 1) return 'maliyet';
    if (numId === 2) {
      const text = `${input.komisyon_turu || ''} ${input.komisyon_adi || ''} ${input.komisyon_turu_adi || ''} ${input.gorev || ''} ${input.gorevi || ''}`.toLowerCase();
      if (text.includes('fiyat') || text.includes('maliyet') || text.includes('araştırma') || text.includes('arastirma') || text.includes('piyasa')) {
        return 'maliyet';
      }
      return 'muayene';
    }
  }

  // 4. Normalized Text Classification Fallback
  const textSource = `${input.komisyon_turu || ''} ${input.komisyon_adi || ''} ${input.komisyon_turu_adi || ''} ${input.gorev || ''} ${input.gorevi || ''} ${input.komisyonGorevi || ''}`.trim().toLowerCase();
  if (!textSource) return 'unmapped';

  if (
    textSource.includes('fiyat') ||
    textSource.includes('maliyet') ||
    textSource.includes('araştırma') ||
    textSource.includes('arastirma') ||
    textSource.includes('piyasa')
  ) {
    return 'maliyet';
  }

  if (textSource.includes('muayene') || textSource.includes('kabul')) {
    return 'muayene';
  }

  if (textSource.includes('ihale')) {
    return 'ihale';
  }

  return 'unmapped';
}

/**
 * Incompatible duty / task keywords for Muayene ve Kabul Komisyonu.
 * In Turkish public procurement (4734 sayılı KİK ve ilgili mevzuat), officials with approval,
 * payment realization, accounting, or initial price research duties cannot serve as inspection/acceptance members.
 */
export const INCOMPATIBLE_MUAYENE_TASKS = [
  'fiyat araştırma',
  'fiyat arastirma',
  'harcama yetkili',
  'muhasebe yetkili',
  'gerçekleştirme',
  'gerceklestirme'
] as const;

/**
 * Checks whether a specific task/duty (or commission member record) is legally and operationally
 * eligible to serve on the Muayene ve Kabul Komisyonu.
 *
 * NOTE: This is an independent task suitability policy. It must NOT be merged into
 * commission category resolution (resolveCommissionCategory), which solely determines
 * the type of committee.
 */
export function isTaskEligibleForMuayene(
  taskOrMember: string | CommissionResolutionInput | null | undefined
): boolean {
  if (!taskOrMember) return true;

  const duty =
    typeof taskOrMember === 'string'
      ? taskOrMember
      : String(taskOrMember.gorev || taskOrMember.gorevi || taskOrMember.komisyonGorevi || '');

  if (!duty.trim()) return true;

  const normalized = duty.toLowerCase();
  for (const incompatible of INCOMPATIBLE_MUAYENE_TASKS) {
    if (normalized.includes(incompatible)) {
      return false;
    }
  }
  return true;
}
