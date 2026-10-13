import {
  ExplicitState,
  TemplateCapabilities,
  TemplateGroup,
  TemplateType,
  TemplateWorkflow,
  WorkflowProfileName,
} from "../types";
import { getWorkflowProfile } from "./workflowProfiles";

const DEFAULT_CAPABILITIES: TemplateCapabilities = {
  supportsOlur: false,
  supportsCommission: false,
  supportedCommissionTypes: ["none"],
  supportsPersonnelList: true,
  supportsKalemListesi: true,
  supportsFirmaListesi: false,
  supportsMuhatap: false,
  supportsIlgi: false,
  supportsEk: false,
  supportsDagitim: false,
  supportsRota: false,
};

export type TemplateInput = {
  id: string;
  name: string;
  title: string;
  category: string;
  description?: string;
  group?: TemplateGroup;
  groups?: TemplateGroup[];
  capabilities?: Partial<TemplateCapabilities>;
  workflow?: TemplateWorkflow;
  workflowProfile?: WorkflowProfileName;
  workflowOverride?: Partial<TemplateWorkflow>;
  inheritsFrom?: string;
};

/**
 * Derin nesne birleştirme yardımcısı (Workflow birleştirme için)
 */
function deepMergeWorkflow(
  base: TemplateWorkflow,
  override?: Partial<TemplateWorkflow>
): TemplateWorkflow {
  if (!override) return base;

  const result: TemplateWorkflow = {
    ...base,
    ...override,
    routing: override.routing
      ? { ...base.routing, ...override.routing } as any
      : base.routing,
    signatures: override.signatures
      ? [...override.signatures]
      : base.signatures ? [...base.signatures] : undefined,
  };

  return result;
}

export function defineTemplate(input: TemplateInput): TemplateType {
  const groups = input.groups ?? (input.group ? [input.group] : []);

  // Workflow Çözümleme Önceliği:
  // 1. Şablonun doğrudan tanımlı workflow'u (kendi workflow'u)
  // 2. workflowOverride ile derin birleştirilmiş workflowProfile
  // 3. inheritsFrom ile ana belgeden miras alma
  let resolvedWorkflow: TemplateWorkflow | undefined = undefined;

  if (input.workflow) {
    resolvedWorkflow = {
      ...input.workflow,
      explicitState: input.workflow.explicitState ?? "explicit_defined",
    };
  } else if (input.inheritsFrom) {
    resolvedWorkflow = {
      inheritsFrom: input.inheritsFrom,
      explicitState: "from_profile",
      routing: { mode: "none" },
      signatures: [],
    };
  } else if (input.workflowProfile) {
    const profileWorkflow = getWorkflowProfile(input.workflowProfile);
    resolvedWorkflow = deepMergeWorkflow(profileWorkflow, input.workflowOverride);
    resolvedWorkflow.explicitState = "from_profile";
  }

  return {
    id: input.id,
    name: input.name,
    title: input.title,
    category: input.category,
    description: input.description,
    group: input.group ?? (groups.length > 0 ? groups[0] : undefined),
    groups,
    capabilities: {
      ...DEFAULT_CAPABILITIES,
      ...input.capabilities,
    },
    workflow: resolvedWorkflow,
  };
}

export const TEMPLATE_REGISTRY: TemplateType[] = [
  defineTemplate({
    id: "ihtiyac-listesi",
    name: "IhtiyacListesi",
    title: "İhtiyaç Listesi",
    category: "1-ihtiyac-tespiti-ve-baslangic",
    description: "Alımı yapılacak mal/hizmet kalemlerinin detaylı ihtiyaç tablosu",
    workflowProfile: "ic_form",
  }),
  defineTemplate({
    id: "ihtiyac-talep-formu",
    name: "IhtiyacTalepFormu",
    title: "İhtiyaç Talep Formu",
    category: "1-ihtiyac-tespiti-ve-baslangic",
    description: "Birimlerin mal/hizmet taleplerini yetkili makama ilettiği resmi form",
    workflowProfile: "ic_form",
  }),
  defineTemplate({
    id: "tasinir-kayit-yetkilisi-gorusu",
    name: "TasinirKayitYetkilisiGorusu",
    title: "Taşınır Kayıt Yetkilisi Görüşü",
    category: "1-ihtiyac-tespiti-ve-baslangic",
    description: "Stokta malzeme bulunup bulunmadığına ilişkin ambar yetkilisi görüşü",
    workflowProfile: "ic_form",
  }),
  defineTemplate({
    id: "teknik-sartname",
    name: "TeknikSartname",
    title: "Teknik Şartname",
    category: "1-ihtiyac-tespiti-ve-baslangic",
    description: "İşin ve malzemelerin teknik kriterlerini belirleyen doküman",
    workflowProfile: "ic_form",
  }),
  defineTemplate({
    id: "luzum-muzekkeresi",
    name: "LuzumMuzekkeresi",
    title: "Lüzum Müzekkeresi",
    category: "1-ihtiyac-tespiti-ve-baslangic",
    description: "Harcama biriminin alım gerekliliğini onaylatan başlangıç müzekkeresi",
    capabilities: {
      supportsOlur: true,
      supportsMuhatap: true,
      supportsIlgi: true,
      supportsEk: true,
      supportsDagitim: false,
      supportsRota: false,
    },
    // KARAR GEREKLİ: Lüzum müzekkeresi idari usulde 'ic_form' olarak mı yoksa Harcama Yetkilisi 'olur_onay' olarak mı çalışacak?
    workflowProfile: "ic_form",
  }),
  defineTemplate({
    id: "luzum-muzekkeresi-onay-eki",
    name: "LuzumMuzekkeresiOnayEki",
    title: "Lüzum Müzekkeresi Onay Eki",
    category: "1-ihtiyac-tespiti-ve-baslangic",
    description: "Lüzum müzekkeresine eklenen kalem ve açıklama listesi",
    inheritsFrom: "luzum-muzekkeresi",
  }),
  defineTemplate({
    id: "luzum-muzekkeresi-teslim-tesellum",
    name: "LuzumMuzekkeresiTeslimTesellum",
    title: "Lüzum Müzekkeresi Teslim Tesellüm",
    category: "1-ihtiyac-tespiti-ve-baslangic",
    group: "muayene_kabul",
    description: "Lüzum müzekkeresi teslim alma ve evrak devir tutanağı",
    inheritsFrom: "luzum-muzekkeresi",
  }),
  defineTemplate({
    id: "harcama-talimati",
    name: "HarcamaTalimati",
    title: "Harcama Talimatı",
    category: "1-ihtiyac-tespiti-ve-baslangic",
    group: "olur_onay",
    description: "Harcama Yetkilisi tarafından imzalanan alım ve ihale başlatma oluru",
    capabilities: { supportsOlur: true },
    workflow: {
      routing: {
        mode: "role",
        targetRole: "harcama_yetkilisi",
        usesDynamicInstitutionalHeading: true,
        fallbackHeading: "HARCAMA YETKİLİLİĞİNE",
      },
      signatures: [
        { role: "gerceklestirme_gorevlisi", slotType: "checked_by", requirementSource: "statutory" },
        { role: "harcama_yetkilisi", slotType: "approved_by", requirementSource: "statutory" },
      ],
      approvalRole: "harcama_yetkilisi",
      explicitState: "explicit_defined",
    },
  }),
  defineTemplate({
    id: "komisyon-gorevlendirme-onayi",
    name: "KomisyonGorevlendirmeOnayi",
    title: "Komisyon Görevlendirme Onayı",
    category: "1-ihtiyac-tespiti-ve-baslangic",
    groups: ["piyasa_arastirma", "muayene_kabul", "olur_onay"],
    description: "Piyasa Araştırma veya Muayene Kabul Komisyon üyelerinin görevlendirme oluru",
    capabilities: {
      supportsOlur: true,
      supportsCommission: true,
      supportedCommissionTypes: ["piyasa_fiyat", "muayene_kabul", "yaklasik_maliyet", "ihale_komisyonu", "all"],
      supportsKalemListesi: false,
      roleVisibility: {
        harcama_yetkilisi: "show",
        onaylayan: "show",
      },
    },
    workflow: {
      routing: {
        mode: "role",
        targetRole: "harcama_yetkilisi",
        usesDynamicInstitutionalHeading: true,
        fallbackHeading: "HARCAMA YETKİLİLİĞİNE",
      },
      signatures: [
        { role: "harcama_yetkilisi", slotType: "approved_by", requirementSource: "administrative" },
      ],
      approvalRole: "harcama_yetkilisi",
      explicitState: "explicit_defined",
    },
  }),
  defineTemplate({
    id: "komisyon-gorevlendirme-onayi-eki",
    name: "KomisyonGorevlendirmeOnayiEki",
    title: "Komisyon Görevlendirme Onayı Eki",
    category: "1-ihtiyac-tespiti-ve-baslangic",
    groups: ["piyasa_arastirma", "muayene_kabul", "olur_onay"],
    description: "Görevlendirilen komisyon üyelerinin detaylı görev dağılım listesi",
    capabilities: {
      supportsCommission: true,
      supportedCommissionTypes: ["piyasa_fiyat", "muayene_kabul", "yaklasik_maliyet", "ihale_komisyonu", "all"],
      supportsKalemListesi: false,
      roleVisibility: {
        harcama_yetkilisi: "hide",
        onaylayan: "hide",
      },
    },
    workflow: {
      routing: { mode: "none" },
      signatures: [
        { role: "komisyon_baskani", slotType: "president", requirementSource: "administrative" },
        { role: "komisyon_uyesi", slotType: "member", requirementSource: "administrative" },
      ],
      explicitState: "explicit_defined",
    },
  }),
  defineTemplate({
    id: "piyasa-fiyat-arastirma-gorevlendirmesi",
    name: "PiyasaFiyatArastirmaGorevlendirmesi",
    title: "Piyasa Fiyat Araştırma Görevlendirmesi",
    category: "1-ihtiyac-tespiti-ve-baslangic",
    group: "piyasa_arastirma",
    description: "Piyasa fiyat araştırmasını yapmak üzere görevlendirilen personelin olur belgesi",
    capabilities: {
      supportsOlur: true,
      supportsCommission: true,
      supportedCommissionTypes: ["piyasa_fiyat", "yaklasik_maliyet"],
      supportsKalemListesi: false,
      roleVisibility: {
        harcama_yetkilisi: "show",
        onaylayan: "show",
      },
    },
    workflowProfile: "olur_onay",
  }),
  defineTemplate({
    id: "son-alim-fiyat-cetveli",
    name: "SonAlimFiyatCetveli",
    title: "Son Alım Fiyat Cetveli",
    category: "1-ihtiyac-tespiti-ve-baslangic",
    group: "piyasa_arastirma",
    description: "Geçmiş alımlara ait birim fiyat ve fatura karşılaştırma cetveli",
    capabilities: { supportsOlur: true },
    // KARAR GEREKLİ: Son alım fiyat cetveli iç çalışma formu ('ic_form') mu yoksa yaklaşık maliyet/komisyon eki mi?
    workflowProfile: "ic_form",
  }),
  defineTemplate({
    id: "fiyat-arastirma-mektubu",
    name: "FiyatArastirmaMektubu",
    title: "Fiyat Araştırma Mektubu",
    category: "2-piyasa-fiyat-arastirmasi",
    group: "piyasa_arastirma",
    description: "Firmalara teklif sunmaları için gönderilen resmi davet yazısı",
    capabilities: { supportsFirmaListesi: true },
    workflowProfile: "dis_yazi",
  }),
  defineTemplate({
    id: "birim-fiyat-teklif-mektubu",
    name: "BirimFiyatTeklifMektubu",
    title: "Birim Fiyat Teklif Mektubu",
    category: "2-piyasa-fiyat-arastirmasi",
    group: "piyasa_arastirma",
    description: "Firmaların birim fiyatlarını doldurarak imzaladığı teklif mektubu",
    capabilities: {
      supportsPersonnelList: false,
      supportsFirmaListesi: true,
      roleVisibility: {
        harcama_yetkilisi: "hide",
        onaylayan: "hide",
        hazirlayan: "hide",
      },
    },
    workflowProfile: "firma_belgesi",
  }),
  defineTemplate({
    id: "birim-fiyat-teklif-cetveli",
    name: "BirimFiyatTeklifCetveli",
    title: "Birim Fiyat Teklif Cetveli",
    category: "2-piyasa-fiyat-arastirmasi",
    group: "piyasa_arastirma",
    description: "İsteklilerin kalem bazlı birim fiyatlarını sunduğu detaylı cetvel",
    capabilities: {
      supportsPersonnelList: false,
      supportsFirmaListesi: true,
      roleVisibility: {
        harcama_yetkilisi: "hide",
        onaylayan: "hide",
        hazirlayan: "hide",
      },
    },
    workflowProfile: "firma_belgesi",
  }),
  defineTemplate({
    id: "arastirma-mektubu",
    name: "ArastirmaMektubu",
    title: "Araştırma Mektubu",
    category: "2-piyasa-fiyat-arastirmasi",
    group: "piyasa_arastirma",
    description: "Piyasa araştırması kapsamında gönderilen bilgi ve teklif toplama yazısı",
    capabilities: { supportsFirmaListesi: true },
    workflowProfile: "dis_yazi",
  }),
  defineTemplate({
    id: "yaklasik-maliyet-cetveli",
    name: "YaklasikMaliyetCetveli",
    title: "Yaklaşık Maliyet Cetveli",
    category: "2-piyasa-fiyat-arastirmasi",
    group: "piyasa_arastirma",
    description: "Toplanan tekliflerden alımın yaklaşık maliyetinin hesaplandığı cetvel",
    capabilities: {
      supportsCommission: true,
      supportedCommissionTypes: ["piyasa_fiyat", "yaklasik_maliyet"],
      supportsFirmaListesi: true,
    },
    workflowProfile: "komisyon_tutanagi",
  }),
  defineTemplate({
    id: "piyasa-fiyat-arastirma-tutanagi",
    name: "PiyasaFiyatArastirmaTutanagi",
    title: "Piyasa Fiyat Araştırma Tutanağı",
    category: "2-piyasa-fiyat-arastirmasi",
    group: "piyasa_arastirma",
    description: "Piyasa fiyat araştırması görevlilerinin teklifleri değerlendirdiği ana tutanak",
    capabilities: {
      supportsOlur: true,
      supportsCommission: true,
      supportedCommissionTypes: ["piyasa_fiyat", "yaklasik_maliyet"],
      supportsFirmaListesi: true,
    },
    workflowProfile: "komisyon_tutanagi",
  }),
  defineTemplate({
    id: "kabul-edilen-teklif",
    name: "KabulEdilenTeklif",
    title: "Kabul Edilen Teklif Bildirimi",
    category: "3-siparis-ve-sozlesme",
    group: "olur_onay",
    description: "En avantajlı teklifi veren firmaya yapılan alım kabul bildirimi",
    capabilities: { supportsFirmaListesi: true },
    // KARAR GEREKLİ: Kabul edilen teklif bildirimi dış yazı ('dis_yazi') olarak mı yoksa firma teyit yazısı olarak mı çalışacak?
    workflowProfile: "dis_yazi",
  }),
  defineTemplate({
    id: "dogrudan-temin-onay-belgesi",
    name: "DogrudanTeminOnayBelgesi",
    title: "Doğrudan Temin Onay Belgesi",
    category: "3-siparis-ve-sozlesme",
    group: "olur_onay",
    description: "Karara bağlanan alımın yetkili makam onay belgesi",
    capabilities: {
      supportsOlur: true,
      supportsFirmaListesi: true,
      supportsMuhatap: true,
      supportsIlgi: true,
      supportsEk: true,
      supportsDagitim: false,
      supportsRota: false,
    },
    workflowProfile: "olur_onay",
  }),
  defineTemplate({
    id: "butce-sorgusu",
    name: "ButceSorgusu",
    title: "Bütçe Sorgusu ve Ödenek Belgesi",
    category: "3-siparis-ve-sozlesme",
    group: "olur_onay",
    description: "Alım tutarının ilgili bütçe tertibinden karşılanabilirliğini gösteren form",
    workflowProfile: "olur_onay",
  }),
  defineTemplate({
    id: "dogrudan-temin-sozlesmesi",
    name: "DogrudanTeminSozlesmesi",
    title: "Doğrudan Temin Sözleşmesi",
    category: "3-siparis-ve-sozlesme",
    group: "olur_onay",
    description: "Yüklenici firma ile İdare arasında imzalanan matbu alım sözleşmesi",
    capabilities: { supportsFirmaListesi: true },
    // KARAR GEREKLİ: Sözleşme iki taraflı (İdare + Firma) olduğundan firma_belgesi mi yoksa özel iki taraflı profil mi olmalı?
    workflowProfile: "firma_belgesi",
  }),
  defineTemplate({
    id: "sozlesmeye-davet",
    name: "SozlesmeyeDavet",
    title: "Sözleşmeye Davet Yazısı",
    category: "3-siparis-ve-sozlesme",
    group: "olur_onay",
    description: "Kazanan yükleniciye sözleşme imzalaması için iletilen davet yazısı",
    capabilities: {
      supportsKalemListesi: false,
      supportsFirmaListesi: true,
    },
    workflowProfile: "dis_yazi",
  }),
  defineTemplate({
    id: "muayene-kabul-tutanagi",
    name: "MuayeneKabulTutanagi",
    title: "Muayene ve Kabul Tutanağı",
    category: "4-kabul-ve-odeme-islemleri",
    group: "muayene_kabul",
    description: "Teslim alınan mal veya hizmetin muayene ve kabul tutanağı cetveli",
    capabilities: {
      supportsOlur: true,
      supportsCommission: true,
      supportedCommissionTypes: ["muayene_kabul"],
      supportsFirmaListesi: true,
    },
    workflowProfile: "komisyon_tutanagi",
  }),
  defineTemplate({
    id: "muayene-kabul-komisyonu",
    name: "MuayeneKabulKomisyonu",
    title: "Muayene ve Kabul Komisyon Kararı",
    category: "4-kabul-ve-odeme-islemleri",
    group: "muayene_kabul",
    description: "Teslim alınan mal veya hizmetin muayene kabul komisyonunca onaylanma kararı",
    capabilities: {
      supportsOlur: true,
      supportsCommission: true,
      supportedCommissionTypes: ["muayene_kabul"],
    },
    workflowProfile: "komisyon_tutanagi",
  }),
  defineTemplate({
    id: "harcama-pusulasi",
    name: "HarcamaPusulasi",
    title: "Harcama Pusulası",
    category: "4-kabul-ve-odeme-islemleri",
    group: "muayene_kabul",
    description: "Fatura kesme yükümlülüğü olmayan gerçek kişilerden yapılan alımların tutanağı",
    capabilities: {
      roleVisibility: {
        harcama_yetkilisi: "show",
        onaylayan: "show",
      },
    },
    workflowProfile: "komisyon_tutanagi",
  }),
  defineTemplate({
    id: "odeme-yazisi",
    name: "OdemeYazisi",
    title: "Ödeme Yazısı",
    category: "4-kabul-ve-odeme-islemleri",
    group: "olur_onay",
    description: "Mali hizmetler / muhasebe müdürlüğüne yazılan ödeme üst yazısı",
    capabilities: {
      supportsOlur: true,
      supportsKalemListesi: false,
      supportsFirmaListesi: true,
      supportsMuhatap: true,
      supportsIlgi: true,
      supportsEk: true,
      supportsDagitim: false,
      supportsRota: false,
    },
    workflowProfile: "dis_yazi",
  }),
  defineTemplate({
    id: "dogrudan-temin-sonuc-onay-belgesi",
    name: "DogrudanTeminSonucOnayBelgesi",
    title: "Doğrudan Temin Sonuç Onay Belgesi",
    category: "3-siparis-ve-sozlesme",
    group: "olur_onay",
    description: "Alım sonucunun yetkili makam onay belgesi",
    capabilities: {
      supportsOlur: true,
      supportsFirmaListesi: true,
    },
    workflowProfile: "olur_onay",
  }),
  defineTemplate({
    id: "gorevlendirme-yazisi",
    name: "GorevlendirmeYazisi",
    title: "Görevlendirme Yazısı",
    category: "2-piyasa-fiyat-arastirmasi",
    group: "piyasa_arastirma",
    description: "Piyasa fiyat araştırması görevlendirme yazısı",
    capabilities: {
      supportsOlur: true,
      supportsCommission: true,
      supportedCommissionTypes: ["piyasa_fiyat"],
      supportsKalemListesi: false,
      roleVisibility: {
        harcama_yetkilisi: "show",
        onaylayan: "show",
      },
    },
    workflowProfile: "olur_onay",
  }),
  defineTemplate({
    id: "idare-onay-belgesi",
    name: "IdareOnayBelgesi",
    title: "İdare Onay Belgesi",
    category: "3-siparis-ve-sozlesme",
    group: "olur_onay",
    description: "İdare onay ve karar belgesi",
    capabilities: {
      supportsOlur: true,
      supportsFirmaListesi: true,
    },
    workflowProfile: "olur_onay",
  }),
];

/**
 * inheritsFrom zincirini çözümler ve döngüsel bağımlılıkları kontrol eder.
 */
export function resolveTemplateWorkflow(
  templateId: string,
  registry: TemplateType[] = TEMPLATE_REGISTRY
): TemplateWorkflow | undefined {
  const templateMap = new Map<string, TemplateType>();
  registry.forEach((t) => templateMap.set(t.id, t));

  const target = templateMap.get(templateId);
  if (!target) return undefined;
  if (!target.workflow) return undefined;

  // Doğrudan tanımlı veya profile bağlıysa
  if (!target.workflow.inheritsFrom) {
    return target.workflow;
  }

  // inheritsFrom zinciri çözümleme & Cycle Detection
  const visited = new Set<string>([templateId]);
  let currentId: string | undefined = target.workflow.inheritsFrom;

  while (currentId) {
    if (visited.has(currentId)) {
      throw new Error(
        `Döngüsel şablon bağımlılığı tespit edildi: ${Array.from(visited).join(" -> ")} -> ${currentId}`
      );
    }
    visited.add(currentId);

    const parent = templateMap.get(currentId);
    if (!parent) {
      throw new Error(
        `Miras alınacak şablon bulunamadı: "${currentId}" (referans veren: "${templateId}")`
      );
    }

    if (!parent.workflow?.inheritsFrom) {
      if (!parent.workflow) {
        throw new Error(`Miras alınacak şablonun workflow tanımı yok: "${currentId}"`);
      }
      return {
        ...parent.workflow,
        explicitState: "from_profile",
      };
    }

    currentId = parent.workflow.inheritsFrom;
  }

  return target.workflow;
}

/**
 * 'from_profile' explicitState durumundaki tüm şablonları listeler.
 */
export function getFromProfileTemplates(
  registry: TemplateType[] = TEMPLATE_REGISTRY
): TemplateType[] {
  return registry.filter((t) => t.workflow?.explicitState === "from_profile");
}

/**
 * Belirli bir explicitState durumundaki şablonları filtreler.
 */
export function getTemplatesByExplicitState(
  state: ExplicitState,
  registry: TemplateType[] = TEMPLATE_REGISTRY
): TemplateType[] {
  return registry.filter((t) => t.workflow?.explicitState === state);
}