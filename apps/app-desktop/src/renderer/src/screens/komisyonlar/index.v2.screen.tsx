import React, { useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  FileSearch,
  History,
  Info,
  Layers,
  RefreshCw,
  Search,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { resolveCommissionCategory } from "@temin360/document-templates";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { DosyaKomisyonDetayView } from "./components/DosyaKomisyonDetayView";
import { HizliKadroGuncelleModal } from "./components/HizliKadroGuncelleModal";
import {
  applyInstitutionalTemplateToDossier,
  copyCommissionBetweenDossiers,
} from "../../services/commission/commissionSeedService";

export interface DosyaKomisyonMember {
  id?: number;
  personel_id: number;
  ad_soyad: string;
  unvan?: string;
  gorev_adi?: string;
  asli_yedek?: string;
  asli_mi?: number;
}

export interface DosyaKomisyonItem {
  id: number;
  dosya_no: string;
  is_tanimi: string;
  created_at: string;
  history_count: number;
  isCustomized: boolean;
  source: "custom" | "template" | "empty";
  piyasaMembers: DosyaKomisyonMember[];
  muayeneMembers: DosyaKomisyonMember[];
  totalMembersCount: number;
  lastUpdate: string | null;
}

export interface GlobalHistoryItem {
  id: number;
  temin_dosya_id: number;
  dosya_no: string;
  is_tanimi: string;
  komisyon_turu: string;
  islem_turu: string;
  islem_yapan: string;
  snapshot_data: string;
  created_at: string;
}

export default function KomisyonlarV2Screen({
  isSubComponent = false,
}: {
  isSubComponent?: boolean;
}): React.JSX.Element {
  const queryClient = useQueryClient();

  // Ana Sekme: 'dosyalar' (Dosya Bazlı) | 'sablonlar' (Kurumsal Şablon) | 'tarihce' (Tüm Dosyaların Revizyon Çizelgesi)
  const [activeTab, setActiveTab] = useState<
    "dosyalar" | "sablonlar" | "tarihce"
  >("dosyalar");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<
    "all" | "custom" | "template" | "empty"
  >("all");

  // Seçili Dosya Detay Görünümü (Tam Ekran)
  const [selectedDosya, setSelectedDosya] = useState<
    {
      id: number;
      dosya_no: string;
      is_tanimi: string;
      initialTab: "kadro" | "revizyon";
    } | null
  >(null);

  // Kadro Kopyalama Modalı State
  const [copyTargetDosya, setCopyTargetDosya] = useState<
    DosyaKomisyonItem | null
  >(null);
  const [selectedSourceDosyaId, setSelectedSourceDosyaId] = useState<
    number | null
  >(null);
  const [isCopying, setIsCopying] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Kurumsal Şablon Düzenleme Modalı State
  const [editingTemplateKomisyon, setEditingTemplateKomisyon] = useState<
    {
      id: number;
      ad: string;
    } | null
  >(null);

  // 1. Kurumsal Genel Komisyon Şablonu Tanımları ve Üyeleri
  const {
    data: templateData = {
      komisyonlar: [],
      piyasaDefaults: [],
      muayeneDefaults: [],
    },
    isLoading: isTemplateLoading,
    refetch: refetchTemplate,
  } = useQuery({
    queryKey: ["kurumsal-komisyon-tanimlari"],
    queryFn: async () => {
      const kRes = await window.electron.ipcRenderer.invoke(
        "db:query",
        "SELECT * FROM TANIM_Komisyon WHERE aktif_mi = 1 ORDER BY id ASC",
      );
      const komisyonlar = kRes.success ? kRes.data || [] : [];

      const uRes = await window.electron.ipcRenderer.invoke(
        "db:query",
        `SELECT u.id as role_id, u.komisyon_id, u.asil_mi, u.personel_id, 
                COALESCE(p.ad_soyad, 'İsimsiz') as ad_soyad, 
                COALESCE(p.unvan, '') as unvan, 
                COALESCE(g.ad, 'Üye') as gorev_adi,
                k.ad as komisyon_adi,
                k.tur as komisyon_tur_kodu
         FROM TANIM_KomisyonUye u
         LEFT JOIN TANIM_Personel p ON u.personel_id = p.id
         LEFT JOIN TANIM_KomisyonGorevi g ON u.gorev_id = g.id
         LEFT JOIN TANIM_Komisyon k ON u.komisyon_id = k.id
         WHERE u.personel_id IS NOT NULL
         ORDER BY u.komisyon_id ASC, u.sira ASC`,
      );
      const members = uRes.success ? uRes.data || [] : [];

      const isPiyasaCheck = (m: any) => {
        if (m.komisyon_id === 1) return true;
        const cat = resolveCommissionCategory(m);
        if (cat === "maliyet") return true;
        const str = `${m.komisyon_adi || ""} ${m.gorev_adi || ""}`
          .toLowerCase();
        return str.includes("maliyet") || str.includes("fiyat") ||
          str.includes("piyasa");
      };

      const isMuayeneCheck = (m: any) => {
        if (m.komisyon_id === 2) return true;
        const cat = resolveCommissionCategory(m);
        if (cat === "muayene") return true;
        const str = `${m.komisyon_adi || ""} ${m.gorev_adi || ""}`
          .toLowerCase();
        return str.includes("muayene") || str.includes("kabul");
      };

      const piyasaDefaults: DosyaKomisyonMember[] = members
        .filter(isPiyasaCheck)
        .map((m: any) => ({
          id: m.role_id,
          personel_id: m.personel_id,
          ad_soyad: m.ad_soyad,
          unvan: m.unvan,
          gorev_adi: m.gorev_adi,
          asli_mi: m.asil_mi,
          asli_yedek: m.asil_mi === 1 ? "Asil" : "Yedek",
        }));

      const muayeneDefaults: DosyaKomisyonMember[] = members
        .filter(isMuayeneCheck)
        .map((m: any) => ({
          id: m.role_id,
          personel_id: m.personel_id,
          ad_soyad: m.ad_soyad,
          unvan: m.unvan,
          gorev_adi: m.gorev_adi,
          asli_mi: m.asil_mi,
          asli_yedek: m.asil_mi === 1 ? "Asil" : "Yedek",
        }));

      return {
        komisyonlar,
        members,
        piyasaDefaults,
        muayeneDefaults,
      };
    },
  });

  // 2. Dosya Komisyonları Listesi Sorgusu (Dosya Bazlı Kadrolar)
  const {
    data: dosyaKomisyonList = [],
    isLoading: isDosyaLoading,
    isRefetching: isDosyaRefetching,
    refetch: refetchDosyaList,
  } = useQuery<DosyaKomisyonItem[]>({
    queryKey: ["dosya-komisyonlari-v2-list"],
    queryFn: async () => {
      const dosyaRes = await window.electron.ipcRenderer.invoke(
        "db:query",
        `SELECT d.id, 
                COALESCE(d.dosya_no, d.temin_no, '#' || d.id) as dosya_no, 
                COALESCE(d.is_tanimi, d.konu, 'Doğrudan Temin Dosyası') as is_tanimi, 
                d.created_at,
                (SELECT COUNT(*) FROM DATA_TeminKomisyonHistory h WHERE h.temin_dosya_id = d.id) as history_count
         FROM DATA_TeminDosyasi d
         WHERE COALESCE(d.is_deleted, 0) = 0
         ORDER BY d.id DESC`,
      );
      if (!dosyaRes.success) return [];
      const dosyalar = dosyaRes.data || [];

      const membersRes = await window.electron.ipcRenderer.invoke(
        "db:query",
        `SELECT k.id, k.temin_dosya_id, k.komisyon_id, k.komisyon_turu, k.asli_yedek, k.personel_id, k.gorev, k.updated_at,
                COALESCE(k.ad_soyad, p.ad_soyad) as ad_soyad, 
                COALESCE(k.unvan, p.unvan) as unvan, 
                COALESCE(k.gorev, 'Üye') as gorev_adi
         FROM DATA_TeminKomisyon k
         LEFT JOIN TANIM_Personel p ON k.personel_id = p.id
         ORDER BY k.id ASC`,
      );
      const members = membersRes.success ? membersRes.data || [] : [];

      const isPiyasa = (m: any) => {
        if (m.komisyon_id === 1) return true;
        const cat = resolveCommissionCategory(m);
        if (cat === "maliyet") return true;
        const str = `${m.komisyon_turu || ""} ${m.gorev || ""} ${
          m.gorev_adi || ""
        }`.toLowerCase();
        return (
          str.includes("yaklaşık") ||
          str.includes("yaklasik") ||
          str.includes("maliyet") ||
          str.includes("fiyat") ||
          str.includes("piyasa")
        );
      };

      const isMuayene = (m: any) => {
        if (m.komisyon_id === 2) return true;
        const cat = resolveCommissionCategory(m);
        if (cat === "muayene") return true;
        const str = `${m.komisyon_turu || ""} ${m.gorev || ""} ${
          m.gorev_adi || ""
        }`.toLowerCase();
        return str.includes("muayene") || str.includes("kabul");
      };

      return dosyalar.map((d: any) => {
        const dosyaMembers = members.filter((m: any) =>
          m.temin_dosya_id === d.id
        );
        const isCustomized = dosyaMembers.length > 0;

        let piyasaMembers: DosyaKomisyonMember[] = [];
        let muayeneMembers: DosyaKomisyonMember[] = [];
        let source: "custom" | "template" | "empty" = "empty";

        if (isCustomized) {
          source = "custom";
          piyasaMembers = dosyaMembers.filter(isPiyasa).map((m: any) => ({
            id: m.id,
            personel_id: m.personel_id,
            ad_soyad: m.ad_soyad,
            unvan: m.unvan,
            gorev_adi: m.gorev_adi,
            asli_yedek: m.asli_yedek || "Asil",
          }));
          muayeneMembers = dosyaMembers.filter(isMuayene).map((m: any) => ({
            id: m.id,
            personel_id: m.personel_id,
            ad_soyad: m.ad_soyad,
            unvan: m.unvan,
            gorev_adi: m.gorev_adi,
            asli_yedek: m.asli_yedek || "Asil",
          }));
        } else if (
          templateData.piyasaDefaults.length > 0 ||
          templateData.muayeneDefaults.length > 0
        ) {
          source = "template";
          piyasaMembers = templateData.piyasaDefaults;
          muayeneMembers = templateData.muayeneDefaults;
        } else {
          source = "empty";
        }

        let lastUpdate: string | null = null;
        dosyaMembers.forEach((m: any) => {
          if (m.updated_at) {
            if (!lastUpdate || new Date(m.updated_at) > new Date(lastUpdate)) {
              lastUpdate = m.updated_at;
            }
          }
        });

        return {
          ...d,
          isCustomized,
          source,
          piyasaMembers,
          muayeneMembers,
          totalMembersCount: isCustomized
            ? dosyaMembers.length
            : piyasaMembers.length + muayeneMembers.length,
          lastUpdate,
        };
      });
    },
  });

  // 3. Tüm Dosyaların Global Revizyon Çizelgesi (Audit Log)
  const {
    data: globalHistoryList = [],
    isLoading: isGlobalHistoryLoading,
    refetch: refetchGlobalHistory,
  } = useQuery<GlobalHistoryItem[]>({
    queryKey: ["global-komisyon-history-list"],
    queryFn: async () => {
      const res = await window.electron.ipcRenderer.invoke(
        "db:query",
        `SELECT h.id, h.temin_dosya_id, h.komisyon_turu, h.islem_turu, h.islem_yapan, h.snapshot_data, h.created_at,
                COALESCE(d.dosya_no, d.temin_no, '#' || d.id) as dosya_no,
                COALESCE(d.is_tanimi, d.konu, 'Doğrudan Temin Dosyası') as is_tanimi
         FROM DATA_TeminKomisyonHistory h
         LEFT JOIN DATA_TeminDosyasi d ON h.temin_dosya_id = d.id
         ORDER BY h.id DESC
         LIMIT 150`,
      );
      return res.success ? res.data || [] : [];
    },
  });

  // Tek Tıkla Kurumsal Şablonu Dosyaya Uygulama
  const handleApplyTemplate = async (dosyaId: number) => {
    try {
      const res = await applyInstitutionalTemplateToDossier(dosyaId);
      if (res.success) {
        queryClient.invalidateQueries({
          queryKey: ["dosya-komisyonlari-v2-list"],
        });
        queryClient.invalidateQueries({
          queryKey: ["global-komisyon-history-list"],
        });
        refetchDosyaList();
      } else {
        alert(
          "Kurumsal şablon aktarılırken hata: " +
            (res.error || "Bilinmeyen hata"),
        );
      }
    } catch (err: any) {
      alert("Aktarım hatası: " + err.message);
    }
  };

  // Başka Dosyadan Kadro Kopyalama İşlemi
  const handleExecuteCopy = async () => {
    if (!copyTargetDosya || !selectedSourceDosyaId) return;
    setIsCopying(true);
    setCopyFeedback(null);
    try {
      const res = await copyCommissionBetweenDossiers(
        copyTargetDosya.id,
        selectedSourceDosyaId,
      );
      if (res.success) {
        setCopyFeedback(
          "Kadro başarıyla kopyalandı ve bu dosyaya özel olarak kaydedildi!",
        );
        queryClient.invalidateQueries({
          queryKey: ["dosya-komisyonlari-v2-list"],
        });
        queryClient.invalidateQueries({
          queryKey: ["global-komisyon-history-list"],
        });
        setTimeout(() => {
          setCopyTargetDosya(null);
          setSelectedSourceDosyaId(null);
          setCopyFeedback(null);
          refetchDosyaList();
        }, 1200);
      } else {
        setCopyFeedback("Hata: " + (res.error || "Kopyalama başarısız oldu"));
      }
    } catch (err: any) {
      setCopyFeedback("Hata: " + err.message);
    } finally {
      setIsCopying(false);
    }
  };

  // Filtrelenmiş Dosya Listesi
  const filteredDosyaList = useMemo(() => {
    return dosyaKomisyonList.filter((item) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term ||
        item.dosya_no?.toLowerCase().includes(term) ||
        item.is_tanimi?.toLowerCase().includes(term) ||
        item.piyasaMembers.some((m) =>
          m.ad_soyad?.toLowerCase().includes(term)
        ) ||
        item.muayeneMembers.some((m) =>
          m.ad_soyad?.toLowerCase().includes(term)
        );

      if (!matchesSearch) return false;

      if (filterMode === "custom") return item.source === "custom";
      if (filterMode === "template") return item.source === "template";
      if (filterMode === "empty") return item.source === "empty";

      return true;
    });
  }, [dosyaKomisyonList, searchTerm, filterMode]);

  // Filtrelenmiş Global Tarihçe Listesi
  const filteredHistoryList = useMemo(() => {
    if (!searchTerm.trim()) return globalHistoryList;
    const term = searchTerm.toLowerCase().trim();
    return globalHistoryList.filter(
      (h) =>
        h.dosya_no?.toLowerCase().includes(term) ||
        h.is_tanimi?.toLowerCase().includes(term) ||
        h.komisyon_turu?.toLowerCase().includes(term) ||
        h.islem_turu?.toLowerCase().includes(term) ||
        h.snapshot_data?.toLowerCase().includes(term),
    );
  }, [globalHistoryList, searchTerm]);

  const totalFiles = dosyaKomisyonList.length;
  const customFilesCount =
    dosyaKomisyonList.filter((d) => d.source === "custom").length;
  const templateFilesCount =
    dosyaKomisyonList.filter((d) => d.source === "template").length;
  const emptyFilesCount =
    dosyaKomisyonList.filter((d) => d.source === "empty").length;

  // Tam Ekran Dosya Komisyon Detayı Açık İse
  if (selectedDosya) {
    return (
      <DosyaKomisyonDetayView
        dosyaId={selectedDosya.id}
        dosyaNo={selectedDosya.dosya_no}
        isTanimi={selectedDosya.is_tanimi}
        initialTab={selectedDosya.initialTab}
        onBack={() => {
          setSelectedDosya(null);
          refetchDosyaList();
          refetchGlobalHistory();
        }}
        onRefreshList={() => {
          refetchDosyaList();
          refetchGlobalHistory();
        }}
      />
    );
  }

  // Kopyalama Kaynağı Olabilecek Dosyalar (Kendisi hariç, kadrosu olanlar)
  const availableSourceDosyalar = dosyaKomisyonList.filter(
    (d) =>
      copyTargetDosya && d.id !== copyTargetDosya.id && d.totalMembersCount > 0,
  );
  const selectedSourceItem = availableSourceDosyalar.find((d) =>
    d.id === selectedSourceDosyaId
  );

  return (
    <div
      className={isSubComponent
        ? "flex flex-col h-full space-y-4 w-full animate-in fade-in duration-200"
        : "flex flex-col h-full space-y-4"}
    >
      {/* ÜST BAŞLIK VE SEKME YÖNETİM BARI */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
              Komisyon Yönetimi &amp; Kadro Dağılımı (v2)
            </h1>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Dosya Bazlı &amp; Kurumsal Şablon
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Dosyalara özel atanan komisyon kadrolarını yönetin, kurumsal
            şablondan aktarın veya dosyalar arası kadro kopyalayın.
          </p>
        </div>

        {/* Ana Sekme Değiştirici: Dosyalar | Şablonlar | Tarihçe */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl shrink-0 self-start lg:self-auto shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab("dosyalar")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "dosyalar"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200 dark:border-slate-700"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>📁 Dosya Komisyonları</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-mono font-bold">
              {totalFiles}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sablonlar")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "sablonlar"
                ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs border border-slate-200 dark:border-slate-700"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-500" />
            <span>👑 Kurumsal Şablon</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tarihce")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "tarihce"
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200 dark:border-slate-700"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <History className="w-4 h-4 text-indigo-500" />
            <span>🕒 Tüm Dosyaların Revizyon Çizelgesi</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-mono font-bold">
              {globalHistoryList.length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SEKME 1: DOSYA KOMİSYONLARI (DOSYA BAZLI KADROLAR)                       */}
      {/* ========================================================================= */}
      {activeTab === "dosyalar" && (
        <div className="flex-1 flex flex-col space-y-3 min-h-0">
          {/* Bilgilendirme ve Ayrım Barı */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-gradient-to-r from-blue-50/80 via-slate-50 to-indigo-50/80 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 border border-blue-200/70 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-slate-700 dark:text-slate-300">
                <strong>Dosya Bazlı Komisyon Mimarisi:</strong>{" "}
                Her dosyanın kadrosu bağımsızdır.{" "}
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                  Özel Kadrolu
                </span>{" "}
                dosyalarda yapılan değişiklikler diğer dosyaları veya kurumsal
                şablonu etkilemez.{" "}
                <span className="text-amber-700 dark:text-amber-400 font-bold">
                  Kurumsal Şablonlu
                </span>{" "}
                dosyalar ise tek tıkla dosyaya özel kadroya dönüştürülebilir.
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                refetchDosyaList();
                refetchTemplate();
              }}
              disabled={isDosyaRefetching}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-all cursor-pointer shadow-2xs shrink-0"
              title="Listeyi Yenile"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  isDosyaRefetching ? "animate-spin text-blue-600" : ""
                }`}
              />
            </button>
          </div>

          {/* Arama ve Filtreleme Araç Çubuğu */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Dosya no, konu veya görevli personel ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold"
              />
            </div>

            {/* Durum Filtre Butonları */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setFilterMode("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterMode === "all"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                Tümü ({totalFiles})
              </button>

              <button
                type="button"
                onClick={() => setFilterMode("custom")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterMode === "custom"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-300" />
                <span>Dosyaya Özel ({customFilesCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterMode("template")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterMode === "template"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-300" />
                <span>Kurumsal Şablon ({templateFilesCount})</span>
              </button>

              {emptyFilesCount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilterMode("empty")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filterMode === "empty"
                      ? "bg-slate-700 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>Atanmamış ({emptyFilesCount})</span>
                </button>
              )}
            </div>
          </div>

          {/* Kartlar ve Dosya Listesi */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
            {isDosyaLoading
              ? (
                <div className="p-16 text-center text-slate-400 text-xs">
                  Dosya komisyon verileri yükleniyor...
                </div>
              )
              : filteredDosyaList.length === 0
              ? (
                <div className="p-16 text-center text-xs text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                  <History className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="font-semibold">
                    Kriterlere uygun temin dosyası bulunamadı.
                  </p>
                </div>
              )
              : (
                filteredDosyaList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 hover:border-blue-300 dark:hover:border-blue-700/60 shadow-xs hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      {/* Sol: Dosya Bilgileri */}
                      <div className="space-y-3 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-black text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
                            {item.dosya_no}
                          </span>
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                            {item.is_tanimi}
                          </span>

                          {/* Kadro Kaynak Rozeti */}
                          {item.source === "custom"
                            ? (
                              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-extrabold border border-emerald-300 dark:border-emerald-800 shadow-2xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Dosyaya Özel Kadro
                              </span>
                            )
                            : item.source === "template"
                            ? (
                              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-extrabold border border-amber-300 dark:border-amber-800 shadow-2xs">
                                <Building2 className="w-3 h-3 text-amber-600" />
                                Kurumsal Şablon (Varsayılan)
                              </span>
                            )
                            : (
                              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold border border-slate-300 dark:border-slate-700">
                                Henüz Kadro Atanmadı
                              </span>
                            )}

                          {item.history_count > 0 && (
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                              <History className="w-3 h-3" />
                              {item.history_count} Revizyon
                            </span>
                          )}
                        </div>

                        {/* Şablon Mirası Uyarısı ve Hızlı Sabitleme */}
                        {item.source === "template" && (
                          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-800 dark:text-amber-300">
                            <span className="flex items-center gap-1.5 font-medium">
                              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              Bu dosya kurumsal şablon kadrosunu miras alıyor.
                              Tek tıkla bu dosyaya özel bağımsız kadro olarak
                              sabitleyebilirsiniz.
                            </span>
                            <button
                              type="button"
                              onClick={() => handleApplyTemplate(item.id)}
                              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[11px] transition-colors shrink-0 cursor-pointer shadow-2xs"
                            >
                              ⚡ Dosyaya Özel Sabitle
                            </button>
                          </div>
                        )}

                        {/* Komisyon Görevlileri Izgarası */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-0.5">
                          {/* 1. Piyasa Fiyat Araştırma Komisyonu */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                            <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <FileSearch className="w-3.5 h-3.5" />{" "}
                                Piyasa Fiyat Araştırması Görevlileri
                              </span>
                              <span className="font-mono font-bold text-slate-500">
                                {item.piyasaMembers.length} Personel
                              </span>
                            </div>
                            {item.piyasaMembers.length > 0
                              ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {item.piyasaMembers.map((m, mIdx) => (
                                    <span
                                      key={mIdx}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800"
                                    >
                                      <span className="font-bold">
                                        {m.ad_soyad}
                                      </span>
                                      {m.gorev_adi && (
                                        <span className="text-[10px] text-slate-400 font-normal">
                                          ({m.gorev_adi})
                                        </span>
                                      )}
                                    </span>
                                  ))}
                                </div>
                              )
                              : (
                                <span className="text-xs text-amber-600 dark:text-amber-400 italic font-medium">
                                  Henüz görevli atanmadı.
                                </span>
                              )}
                          </div>

                          {/* 2. Muayene ve Kabul Komisyonu */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                            <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />{" "}
                                Muayene &amp; Kabul Komisyonu
                              </span>
                              <span className="font-mono font-bold text-slate-500">
                                {item.muayeneMembers.length} Personel
                              </span>
                            </div>
                            {item.muayeneMembers.length > 0
                              ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {item.muayeneMembers.map((m, mIdx) => (
                                    <span
                                      key={mIdx}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800"
                                    >
                                      <span className="font-bold">
                                        {m.ad_soyad}
                                      </span>
                                      {m.gorev_adi && (
                                        <span className="text-[10px] text-slate-400 font-normal">
                                          ({m.gorev_adi})
                                        </span>
                                      )}
                                    </span>
                                  ))}
                                </div>
                              )
                              : (
                                <span className="text-xs text-amber-600 dark:text-amber-400 italic font-medium">
                                  Henüz görevli atanmadı.
                                </span>
                              )}
                          </div>
                        </div>

                        {item.lastUpdate && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono pt-0.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Son Değişiklik:</span>
                            <span className="font-bold text-slate-600 dark:text-slate-300">
                              {new Date(item.lastUpdate).toLocaleString(
                                "tr-TR",
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Sağ: Aksiyon Butonları */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-start pt-1 flex-wrap justify-end">
                        {/* Başka Dosyadan Kopyala Butonu */}
                        <button
                          type="button"
                          onClick={() => {
                            setCopyTargetDosya(item);
                            setSelectedSourceDosyaId(null);
                            setCopyFeedback(null);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shadow-2xs"
                          title="Başka bir temin dosyasının komisyon kadrosunu bu dosyaya kopyala"
                        >
                          <Copy className="w-3.5 h-3.5 text-blue-600" />
                          <span>Dosyadan Kopyala</span>
                        </button>

                        {/* Revizyon Çizelgesi Butonu */}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedDosya({
                              id: item.id,
                              dosya_no: item.dosya_no,
                              is_tanimi: item.is_tanimi,
                              initialTab: "revizyon",
                            })}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800 transition-colors cursor-pointer shadow-2xs"
                          title="Bu dosyadaki komisyon üye değişiklikleri geçmişini aç"
                        >
                          <History className="w-3.5 h-3.5" />
                          <span>Revizyon Çizelgesi ({item.history_count})</span>
                        </button>

                        {/* Kadroyu Güncelle Butonu */}
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 rounded-xl px-3.5 py-2 shadow-xs cursor-pointer"
                          onClick={() =>
                            setSelectedDosya({
                              id: item.id,
                              dosya_no: item.dosya_no,
                              is_tanimi: item.is_tanimi,
                              initialTab: "kadro",
                            })}
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Kadroyu Güncelle</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEKME 2: KURUMSAL GENEL ŞABLON KADROSU                                   */}
      {/* ========================================================================= */}
      {activeTab === "sablonlar" && (
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
          {/* Kurumsal Şablon Açıklama Kutusu */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <h3 className="text-sm font-black text-amber-900 dark:text-amber-200">
                Kurumsal Genel Komisyon Şablonları Havuzu
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Bu bölümde tanımlanan personel kadroları, kurumunuzun doğrudan
              temin ve ihale süreçleri için{" "}
              <strong>genel şablon havuzudur</strong>. Yeni bir temin dosyası
              açıldığında veya bir dosyada{" "}
              <em>&quot;Kurumsal Şablonu Aktar&quot;</em>{" "}
              işlemi yapıldığında bu kadro varsayılan olarak dosyaya kopyalanır.
              Bir dosyada yapılan özel değişiklikler buradaki şablon kadrosunu
              asla bozmaz.
            </p>
          </div>

          {/* Şablon Kartları Izgarası */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 1. Piyasa Fiyat Araştırma Şablonu */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <FileSearch className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white">
                      Piyasa Fiyat Araştırması Şablon Kadrosu
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Doğrudan temin fiyat araştırmasında görev alacak
                      varsayılan personel
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setEditingTemplateKomisyon({
                      id: 1,
                      ad: "Piyasa Fiyat Araştırması",
                    })}
                  className="text-xs font-bold gap-1 rounded-xl cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Şablonu Düzenle</span>
                </Button>
              </div>

              {/* Üyeler */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Şablon Görevlileri ({templateData.piyasaDefaults.length})
                </span>
                {templateData.piyasaDefaults.length === 0
                  ? (
                    <p className="text-xs text-amber-600 dark:text-amber-400 italic">
                      Şablonda henüz tanımlı görevli bulunmuyor.
                    </p>
                  )
                  : (
                    <div className="space-y-1.5">
                      {templateData.piyasaDefaults.map((m, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-100">
                              {m.ad_soyad}
                            </span>
                            {m.unvan && (
                              <span className="text-slate-400 ml-1.5">
                                ({m.unvan})
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                            {m.gorev_adi || "Üye"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>

            {/* 2. Muayene ve Kabul Şablonu */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white">
                      Muayene ve Kabul Komisyonu Şablon Kadrosu
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      Muayene kabul ve teslim alma süreçlerinde varsayılan heyet
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setEditingTemplateKomisyon({
                      id: 2,
                      ad: "Muayene ve Kabul Komisyonu",
                    })}
                  className="text-xs font-bold gap-1 rounded-xl cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Şablonu Düzenle</span>
                </Button>
              </div>

              {/* Üyeler */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Şablon Görevlileri ({templateData.muayeneDefaults.length})
                </span>
                {templateData.muayeneDefaults.length === 0
                  ? (
                    <p className="text-xs text-amber-600 dark:text-amber-400 italic">
                      Şablonda henüz tanımlı görevli bulunmuyor.
                    </p>
                  )
                  : (
                    <div className="space-y-1.5">
                      {templateData.muayeneDefaults.map((m, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-100">
                              {m.ad_soyad}
                            </span>
                            {m.unvan && (
                              <span className="text-slate-400 ml-1.5">
                                ({m.unvan})
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900">
                            {m.gorev_adi || "Üye"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEKME 3: TÜM DOSYALARIN REVİZYON ÇİZELGESİ (GLOBAL AUDIT LOG)            */}
      {/* ========================================================================= */}
      {activeTab === "tarihce" && (
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-500" />
                Tüm Dosyaların Komisyon Revizyon &amp; Snapshot Çizelgesi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tüm doğrudan temin dosyalarında yapılan komisyon değişiklikleri
                ve kopyalama işlemleri anlık snapshot kaydı olarak burada
                arşivlenir.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Geçmiş kayıtlarda ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl text-xs"
              />
            </div>
          </div>

          {isGlobalHistoryLoading
            ? (
              <div className="p-16 text-center text-xs text-slate-400">
                Revizyon kayıtları yükleniyor...
              </div>
            )
            : filteredHistoryList.length === 0
            ? (
              <div className="p-16 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-950/30 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                <History className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                <p className="font-semibold">
                  Kayıtlı revizyon snapshot&apos;ı bulunamadı.
                </p>
              </div>
            )
            : (
              <div className="space-y-3">
                {filteredHistoryList.map((log) => {
                  let parsedSnapshot: any[] = [];
                  try {
                    parsedSnapshot = JSON.parse(log.snapshot_data);
                  } catch {
                    parsedSnapshot = [];
                  }

                  return (
                    <div
                      key={log.id}
                      className="p-3.5 sm:p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-900 transition-colors space-y-2.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-black text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                            {log.dosya_no}
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {log.is_tanimi}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            {log.komisyon_turu}
                          </span>
                          <span className="text-slate-500 font-semibold">
                            • {log.islem_turu}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[11px] text-slate-400">
                            {new Date(log.created_at).toLocaleString("tr-TR")}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedDosya({
                                id: log.temin_dosya_id,
                                dosya_no: log.dosya_no,
                                is_tanimi: log.is_tanimi,
                                initialTab: "revizyon",
                              })}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                          >
                            <span>Dosyayı Aç</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Snapshot Üye Dağılımı */}
                      {Array.isArray(parsedSnapshot) &&
                        parsedSnapshot.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {parsedSnapshot.map((m, mIdx) => (
                            <span
                              key={mIdx}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                            >
                              <span className="font-bold">{m.ad_soyad}</span>
                              {m.gorev && (
                                <span className="text-[10px] text-slate-400">
                                  ({m.gorev})
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BAŞKA DOSYADAN KADRO KOPYALAMA MODALI                              */}
      {/* ========================================================================= */}
      {copyTargetDosya && (
        <Modal
          isOpen={true}
          onClose={() => {
            setCopyTargetDosya(null);
            setSelectedSourceDosyaId(null);
            setCopyFeedback(null);
          }}
          title={`Kadro Kopyala: ${copyTargetDosya.dosya_no}`}
          description="Başka bir doğrudan temin dosyasının komisyon üyelerini bu dosyaya bağımsız olarak aktarın."
          className="max-w-2xl"
        >
          <div className="space-y-4 py-1">
            <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300 space-y-1">
              <p className="font-bold">
                🎯 Hedef Dosya: {copyTargetDosya.dosya_no} -{" "}
                {copyTargetDosya.is_tanimi}
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Aşağıdan seçeceğiniz dosyanın Piyasa Fiyat ve Muayene Kabul
                komisyon görevlileri bu dosyaya kopyalanır ve yeni bir revizyon
                kaydı oluşturulur.
              </p>
            </div>

            {/* Kaynak Dosya Seçimi */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Kadrosu Alınacak Kaynak Dosyayı Seçin:
              </label>
              <select
                value={selectedSourceDosyaId || ""}
                onChange={(e) =>
                  setSelectedSourceDosyaId(Number(e.target.value) || null)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold"
              >
                <option value="">-- Kaynak Dosya Seçin --</option>
                {availableSourceDosyalar.map((src) => (
                  <option key={src.id} value={src.id}>
                    {src.dosya_no} - {src.is_tanimi} ({src.totalMembersCount}
                    {" "}
                    Üye)
                  </option>
                ))}
              </select>
            </div>

            {/* Seçili Kaynak Dosyanın Üye Önizlemesi */}
            {selectedSourceItem && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <span className="font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                  📋 Kopyalanacak Kadro Önizlemesi ({selectedSourceItem
                    .dosya_no}):
                </span>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-blue-600 text-[11px]">
                      Piyasa Fiyat:
                    </span>
                    {selectedSourceItem.piyasaMembers.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold"
                      >
                        {m.ad_soyad} ({m.gorev_adi})
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-emerald-600 text-[11px]">
                      Muayene Kabul:
                    </span>
                    {selectedSourceItem.muayeneMembers.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold"
                      >
                        {m.ad_soyad} ({m.gorev_adi})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Geri Bildirim Mesajı */}
            {copyFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-bold ${
                  copyFeedback.startsWith("Hata")
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                {copyFeedback}
              </div>
            )}

            {/* Butonlar */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCopyTargetDosya(null)}
                className="text-xs rounded-xl"
              >
                İptal
              </Button>

              <Button
                size="sm"
                disabled={!selectedSourceDosyaId || isCopying}
                onClick={handleExecuteCopy}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 rounded-xl cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>
                  {isCopying ? "Kopyalanıyor..." : "Kopyala ve Dosyaya Aktar"}
                </span>
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL: KURUMSAL ŞABLON KADRO DÜZENLEME MODALI                            */}
      {/* ========================================================================= */}
      {editingTemplateKomisyon && (
        <HizliKadroGuncelleModal
          isOpen={true}
          onClose={() => {
            setEditingTemplateKomisyon(null);
            refetchTemplate();
            refetchDosyaList();
          }}
          komisyonId={editingTemplateKomisyon.id}
          komisyonAdi={editingTemplateKomisyon.ad}
        />
      )}
    </div>
  );
}
