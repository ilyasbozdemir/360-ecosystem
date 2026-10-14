import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  FileText,
  Maximize2,
  Minimize2,
  Printer,
  Search,
  Send,
  Sparkles,
} from "lucide-react";
import { BelgeAyarlariPaneli } from "./BelgeAyarlariPaneli";
import { TopluAyarOnayModal } from "./TopluAyarOnayModal";
import { ResmiUstYaziTab } from "../../../ebys/components/ResmiUstYaziTab";
import {
  mergeEvrakSettings,
  validateDocumentSettings,
} from "../documentSettingsUtils";
import type { DocumentEvrakSettings } from "../documentSettings.types";
import { TemplateRegistryService } from "@temin360/document-templates";
import { dosyaSablonVeriService } from "../../../../modules/dosya-sablon-veri";

const EMPTY_SETTINGS: DocumentEvrakSettings = {};

interface BelgeItem {
  id: string;
  kod?: string;
  ad: string;
  zorunlu?: boolean;
  asamaNo?: number;
  asamaAdi?: string;
  tamamlandi?: boolean;
  pdfVar?: boolean;
}

interface YeniNesilBelgeStudyosuTabProps {
  dosya: any;
  belgeler: BelgeItem[];
  kalemler: any[];
  firmalar: any[];
  komisyonlar: any[];
  toplamBedel: number;
  dosyaContext?: any;
  onBelgeOlustur?: (belge: any) => Promise<any>;
  onPreviewBelge?: (belge: any) => void;
  onNavigateToV2?: () => void;
}

export function YeniNesilBelgeStudyosuTab({
  dosya,
  belgeler,
  kalemler,
  firmalar,
  komisyonlar,
  toplamBedel,
  dosyaContext,
  onBelgeOlustur,
  onPreviewBelge,
  onNavigateToV2,
}: YeniNesilBelgeStudyosuTabProps): React.JSX.Element {
  const [selectedDocId, setSelectedDocId] = useState<string>(
    belgeler[0]?.id || "luzum-muzekkeresi",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [evrakSettingsMap, setEvrakSettingsMap] = useState<
    Record<string, DocumentEvrakSettings>
  >({});
  const [isTopluAyarModalOpen, setIsTopluAyarModalOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [loadingPreview, setLoadingPreview] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Seçili belgeyi al
  const selectedDoc = useMemo(() => {
    return belgeler.find((b) => b.id === selectedDocId) || belgeler[0];
  }, [belgeler, selectedDocId]);

  // Aktif belgenin evrak ayarları
  const currentEvrakSettings = useMemo(() => {
    if (!selectedDoc?.id) return EMPTY_SETTINGS;
    return evrakSettingsMap[selectedDoc.id] || EMPTY_SETTINGS;
  }, [evrakSettingsMap, selectedDoc]);

  // Belge arama filtrelemesi
  const filteredBelgeler = useMemo(() => {
    if (!searchQuery.trim()) return belgeler;
    const q = searchQuery.toLowerCase();
    return belgeler.filter(
      (b) =>
        b.ad.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        (b.asamaAdi && b.asamaAdi.toLowerCase().includes(q)),
    );
  }, [belgeler, searchQuery]);

  // Her belgenin eksiklik doğrulamasını yap
  const validationMap = useMemo(() => {
    const result: Record<string, ReturnType<typeof validateDocumentSettings>> =
      {};
    belgeler.forEach((b) => {
      const template = TemplateRegistryService.getTemplateById(b.id);
      const evrak = evrakSettingsMap[b.id];
      result[b.id] = validateDocumentSettings(b.id, evrak, template);
    });
    return result;
  }, [belgeler, evrakSettingsMap]);

  // Debounced DB Kalıcılık: CQRS dosyaSablonVeriService üzerinden güncelleme
  const saveEvrakSettingsToDb = useCallback(
    async (docId: string, settings: DocumentEvrakSettings) => {
      if (!dosya?.id) return;
      try {
        // CQRS Query ile mevcut veriyi çek
        const existingData = await dosyaSablonVeriService.getVeri(
          dosya.id,
          docId,
        );
        const existingJson = existingData?.veri_json || "{}";
        const updatedJson = mergeEvrakSettings(existingJson, settings);

        // CQRS Command ile kaydet
        await dosyaSablonVeriService.saveVeri(dosya.id, docId, updatedJson);
      } catch (err) {
        console.error("Evrak ayarları CQRS kaydı sırasında hata:", err);
      }
    },
    [dosya],
  );

  // Evrak ayarı değiştiğinde state ve DB güncelle
  const handleEvrakSettingsChange = (updated: DocumentEvrakSettings) => {
    setEvrakSettingsMap((prev) => ({
      ...prev,
      [selectedDoc.id]: updated,
    }));
    // DB kalıcılığı
    saveEvrakSettingsToDb(selectedDoc.id, updated);
  };

  // Toplu Ayar Uygulama: Dosyadaki personel bilgilerini tüm belgelere senkronize et
  const handleConfirmTopluAyar = async () => {
    const hazirlayanPersonel = dosya?.hazirlayan_personel_adi ||
      "Birim Görevlisi";
    const onayPersonel = dosya?.onaylayan_personel_adi || "Harcama Yetkilisi";

    const newMap = { ...evrakSettingsMap };
    for (const b of belgeler) {
      newMap[b.id] = {
        ...newMap[b.id],
        rotaOnaylandi: true,
        sonGuncelleme: new Date().toISOString(),
      };
      await saveEvrakSettingsToDb(b.id, newMap[b.id]);
    }
    setEvrakSettingsMap(newMap);
    setIsTopluAyarModalOpen(false);
  };

  // Önizleme HTML'i yükle
  const onBelgeOlusturRef = useRef(onBelgeOlustur);
  useEffect(() => {
    onBelgeOlusturRef.current = onBelgeOlustur;
  }, [onBelgeOlustur]);

  useEffect(() => {
    let isCancelled = false;
    async function loadPreview() {
      if (!selectedDoc) return;
      setLoadingPreview(true);
      try {
        if (onBelgeOlusturRef.current) {
          const res = await onBelgeOlusturRef.current(selectedDoc);
          if (!isCancelled && res) {
            setPreviewHtml(typeof res === "string" ? res : res.html || "");
          }
        }
      } catch (err) {
        console.error("Önizleme yüklenirken hata:", err);
      } finally {
        if (!isCancelled) setLoadingPreview(false);
      }
    }
    loadPreview();
    return () => {
      isCancelled = true;
    };
  }, [selectedDoc]);

  // Firma listesi
  const firmalarList = useMemo(() => {
    return firmalar.map((f, i) => ({
      id: f.id || i + 1,
      unvan: f.unvan || f.firma_adi || `Firma ${i + 1}`,
    }));
  }, [firmalar]);

  const [activeSubView, setActiveSubView] = useState<'belgeler' | 'ust_yazi'>('belgeler');

  return (
    <div
      className={
        isFullScreen
          ? "fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl p-6 overflow-y-auto flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200"
          : "w-full flex flex-col gap-4 animate-in fade-in duration-300"
      }
    >
      {/* Üst Bilgi Rozeti & Görünüm Seçici */}
      <div className="bg-linear-to-r from-blue-600/10 via-indigo-600/10 to-transparent border border-blue-200 dark:border-blue-900/40 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-850 dark:text-slate-100">
                Doğrudan Temin Süreç Akışı v2 (Belge &amp; Resmî Yazışma Stüdyosu)
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                EYP 2.0 &amp; Yönetmelik Uyumlu
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Tüm belgelerin muhatap, ilgi, ekler, dağıtım ve imza/paraf rotasını tek merkezden yönetin.
            </p>
          </div>
        </div>

        {/* Eylemler: Görünüm Seçici & Tam Ekran */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveSubView('belgeler')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubView === 'belgeler'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Doğrudan Temin Belgeleri &amp; Ayarları</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubView('ust_yazi')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubView === 'ust_yazi'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Resmî Üst Yazı &amp; DETSİS Rota Motoru</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsFullScreen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition-all cursor-pointer shrink-0"
            title={isFullScreen ? "Pencere Moduna Dön" : "Afilli Tam Ekran Stüdyoyu Başlat"}
          >
            {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullScreen ? "Pencereye Dön" : "Afilli Tam Ekran"}</span>
          </button>
        </div>
      </div>

      {activeSubView === 'ust_yazi' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <ResmiUstYaziTab />
        </div>
      ) : (
        /* 3 SÜTUNLU ANA ÇALIŞMA ALANI */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[720px] items-stretch">
        {/* SOL SÜTUN (3 Kolon): BELGE LİSTESİ */}
        <div className="lg:col-span-3 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          {/* Arama Alanı */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Belge veya aşama ara..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Belge Kartları Listesi */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 max-h-[660px]">
            {filteredBelgeler.map((belge, idx) => {
              const isSelected = belge.id === selectedDoc?.id;
              const validation = validationMap[belge.id];
              const hasWarnings = validation && !validation.isValid;

              return (
                <div
                  key={`${belge.id}-${idx}`}
                  onClick={() => setSelectedDocId(belge.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedDocId(belge.id);
                    }
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 dark:border-blue-700 shadow-2xs"
                      : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileText
                        className={`w-4 h-4 shrink-0 ${
                          isSelected
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">
                        {belge.ad}
                      </span>
                    </div>
                    {belge.zorunlu && (
                      <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 px-1.5 py-0.2 rounded-md shrink-0">
                        Zorunlu
                      </span>
                    )}
                  </div>

                  {/* Eksiklik Uyarısı Rozetleri */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {belge.asamaAdi && (
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                        {belge.asamaAdi}
                      </span>
                    )}

                    {hasWarnings &&
                      validation.warnings.map((warn, i) => (
                        <span
                          key={i}
                          className="flex items-center gap-1 text-[10px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-1.5 py-0.5 rounded-md"
                        >
                          <AlertCircle className="w-2.5 h-2.5" />
                          {warn}
                        </span>
                      ))}

                    {validation?.isValid && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Hazır
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ORTA SÜTUN (5 Kolon): CANLI ÖNİZLEME */}
        <div className="lg:col-span-5 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          {/* Önizleme Üst Çubuğu */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                Önizleme: {selectedDoc?.ad}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {onPreviewBelge && (
                <button
                  type="button"
                  onClick={() => onPreviewBelge(selectedDoc)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
                  title="Tam Ekran Önizle"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Genişlet
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  const frame = document.getElementById(
                    "belge-preview-iframe",
                  ) as HTMLIFrameElement;
                  frame?.contentWindow?.print();
                }}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Yazdır
              </button>
            </div>
          </div>

          {/* Canlı Belge Çerçevesi */}
          <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-4 flex items-center justify-center overflow-auto min-h-[550px]">
            {loadingPreview
              ? (
                <div className="flex flex-col items-center gap-2 text-slate-600 dark:text-slate-400 text-xs">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Belge önizlemesi hazırlanıyor...
                </div>
              )
              : previewHtml
              ? (
                <iframe
                  id="belge-preview-iframe"
                  srcDoc={previewHtml}
                  title={selectedDoc?.ad || "Belge Önizleme"}
                  className="w-full h-full min-h-[600px] bg-white rounded-xl shadow-md border border-slate-300 dark:border-slate-800"
                />
              )
              : (
                <div className="text-center p-6 text-slate-600 dark:text-slate-400 text-xs">
                  <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  Bu belge için görsel önizleme oluşturulamadı veya veri
                  bekleniyor.
                </div>
              )}
          </div>
        </div>

        {/* SAĞ SÜTUN (4 Kolon): BELGE AYARLARI PANELİ */}
        <div className="lg:col-span-4 flex flex-col">
          <BelgeAyarlariPaneli
            selectedBelgeId={selectedDoc?.id}
            belgeAdi={selectedDoc?.ad}
            evrakSettings={currentEvrakSettings}
            onChange={handleEvrakSettingsChange}
            dosyaFirmalari={firmalarList}
            oncekiBelgeler={belgeler.map((b) => ({ id: b.id, baslik: b.ad }))}
            onTopluUygulaClick={() => setIsTopluAyarModalOpen(true)}
          />
        </div>
      </div>
      )}

      {/* Toplu Ayar Onay Modali */}
      <TopluAyarOnayModal
        isOpen={isTopluAyarModalOpen}
        onClose={() => setIsTopluAyarModalOpen(false)}
        onConfirm={handleConfirmTopluAyar}
        dosyaKonu={dosya?.konu}
        etkilenecekBelgeler={belgeler.map((b) => ({ id: b.id, ad: b.ad }))}
        hazirlayanAd={dosya?.hazirlayan_personel_adi}
        onaylayanAd={dosya?.onaylayan_personel_adi}
      />
    </div>
  );
}
