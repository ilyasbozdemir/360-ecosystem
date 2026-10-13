import { TemplateWorkflow, WorkflowProfileName } from '../types'

/**
 * Arketip İş Akışı Profilleri Kütüphanesi
 *
 * Şablon kayıt defterinde (TEMPLATE_REGISTRY) tek tek workflow tanımlamak yerine,
 * ortak mevzuat ve idari akış arketip profilleri burada tanımlanır.
 *
 * Kaynak Rozeti: Profilden gelen tüm workflow'lar explicitState: 'from_profile' ile işaretlenir.
 * Zorunluluk Ayrımı: Mevzuat zorunluluğu (5018 vb.) kesin olmayanlar 'administrative' işaretlenmiş
 * ve 'DOĞRULANACAK' yorumuyla not düşülmüştür.
 */
export const WORKFLOW_PROFILES: Record<WorkflowProfileName, TemplateWorkflow> = {
  /**
   * Olur / Onay Profili:
   * Hazırlayan -> Gerçekleştirme Görevlisi (checked_by) -> Harcama Yetkilisi (approved_by)
   * Routing: mode 'role', targetRole 'harcama_yetkilisi'
   */
  olur_onay: {
    routing: {
      mode: 'role',
      targetRole: 'harcama_yetkilisi',
      usesDynamicInstitutionalHeading: true,
      fallbackHeading: 'HARCAMA YETKİLİLİĞİNE'
    },
    signatures: [
      {
        role: 'hazirlayan',
        slotType: 'prepared_by',
        requirementSource: 'administrative' // DOĞRULANACAK: Hazırlayan paraf/imzası idari usul
      },
      {
        role: 'gerceklestirme_gorevlisi',
        slotType: 'checked_by',
        requirementSource: 'statutory' // 5018 S.K. uyarınca kontrol ve gerçekleştirme görevi
      },
      {
        role: 'harcama_yetkilisi',
        slotType: 'approved_by',
        requirementSource: 'statutory' // 5018 S.K. ve 4734 S.K. harcama yetkilisi oluru
      }
    ],
    approvalRole: 'harcama_yetkilisi',
    explicitState: 'from_profile'
  },

  /**
   * Komisyon Tutanağı Profili:
   * Komisyon Başkanı (president) + Komisyon Üyesi (member)
   * Routing: 'none'
   */
  komisyon_tutanagi: {
    routing: {
      mode: 'none'
    },
    signatures: [
      {
        role: 'komisyon_baskani',
        slotType: 'president',
        requirementSource: 'administrative' // DOĞRULANACAK: Görevlendirme kararı ve çalışma usulü idari
      },
      {
        role: 'komisyon_uyesi',
        slotType: 'member',
        requirementSource: 'administrative' // DOĞRULANACAK: Komisyon üye sayısı ve imza zorunluluğu teyit edilmeli
      }
    ],
    explicitState: 'from_profile'
  },

  /**
   * Dış Yazı Profili:
   * Hazırlayan -> İmza Yetkilisi (Harcama Yetkilisi / Onaylayan)
   * Routing: 'external' (dış kurum) veya 'firma'
   */
  dis_yazi: {
    routing: {
      mode: 'external'
    },
    signatures: [
      {
        role: 'hazirlayan',
        slotType: 'prepared_by',
        requirementSource: 'administrative' // DOĞRULANACAK: Resmî yazışma paraf/hazırlayan alanı
      },
      {
        role: 'harcama_yetkilisi',
        slotType: 'approved_by',
        requirementSource: 'administrative' // DOĞRULANACAK: İmza yetkisi devri / idare temsil yetkisi
      }
    ],
    approvalRole: 'harcama_yetkilisi',
    explicitState: 'from_profile'
  },

  /**
   * İç Form Profili:
   * Hazırlayan (+ talep eden birim)
   * Routing: 'none'
   */
  ic_form: {
    routing: {
      mode: 'none'
    },
    signatures: [
      {
        role: 'hazirlayan',
        slotType: 'prepared_by',
        requirementSource: 'administrative' // DOĞRULANACAK: İç birim talep formu hazırlayan imzası
      },
      {
        role: 'talep_eden',
        slotType: 'checked_by',
        requirementSource: 'administrative' // DOĞRULANACAK: Talep eden birim onay/kontrol imzası
      }
    ],
    explicitState: 'from_profile'
  },

  /**
   * Firma Belgesi Profili:
   * Yalnızca firma yetkilisi imzası
   * Routing: 'none'
   */
  firma_belgesi: {
    routing: {
      mode: 'none'
    },
    signatures: [
      {
        role: 'firma_yetkilisi',
        slotType: 'prepared_by',
        requirementSource: 'administrative' // DOĞRULANACAK: İstekli teklif/taahhüt imza yetkisi
      }
    ],
    explicitState: 'from_profile'
  },

  /**
   * Ek Belge Profili:
   * Kendi rotası yok, ana belgeyi izler (inheritsFrom)
   */
  ek_belge: {
    routing: {
      mode: 'none'
    },
    signatures: [],
    explicitState: 'from_profile'
  }
}

/**
 * Derin kopya alarak profil nesnesini döndürür
 */
export function getWorkflowProfile(name: WorkflowProfileName): TemplateWorkflow {
  const profile = WORKFLOW_PROFILES[name]
  if (!profile) {
    throw new Error(`Bilinmeyen workflow profili: ${name}`)
  }
  return JSON.parse(JSON.stringify(profile))
}
