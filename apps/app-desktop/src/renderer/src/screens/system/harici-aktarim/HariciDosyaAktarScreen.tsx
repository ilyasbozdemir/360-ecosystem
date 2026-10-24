import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  FileCheck2,
  FileCode2,
  FolderOpen,
  Package,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  UploadCloud,
  Users,
} from "lucide-react";
import {
  executeDossierEzmeSync,
  fetchExistingDossiers,
  findMatchingDossier,
  parseDogrudanTeminJson,
} from "./hariciAktarimService";
import {
  DogrudanTeminDosyasi,
  ExistingDossierSummary,
  SyncOptions,
  SyncResult,
} from "./types";
import { SAMPLE_DOGRUDA_TEMIN_JSON } from "./sampleData";
import { APP_ROUTES } from "../../../constants/routeConstants";

type ActiveTab = "genel" | "malzemeler" | "teklifler" | "komisyonlar";

export default function HariciDosyaAktarScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rawJson, setRawJson] = useState("");
  const [existingDossiers, setExistingDossiers] = useState<
    ExistingDossierSummary[]
  >([]);
  const [selectedTargetId, setSelectedTargetId] = useState<
    number | "new" | null
  >(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("genel");

  const [options, setOptions] = useState<SyncOptions>({
    overwriteGeneralInfo: true,
    overwriteMaterials: true,
    overwriteOffers: true,
    overwriteCommissions: true,
    createNewIfNotFound: false,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Mevcut dosyaları yükle
  useEffect(() => {
    let isMounted = true;
    fetchExistingDossiers().then((list) => {
      if (isMounted) setExistingDossiers(Array.isArray(list) ? list : []);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // JSON çözümleme
  const parseResult = useMemo(() => {
    if (!rawJson.trim()) return null;
    return parseDogrudanTeminJson(rawJson);
  }, [rawJson]);

  const parsedData: DogrudanTeminDosyasi | null = parseResult?.data || null;

  // Eşleşen dosyayı otomatik tespit et
  const autoMatch = useMemo(() => {
    if (!parsedData || !Array.isArray(existingDossiers) || existingDossiers.length === 0) return null;
    return findMatchingDossier(existingDossiers, parsedData);
  }, [parsedData, existingDossiers]);

  // Etkin hedef dosya kimliği
  const effectiveTargetId = useMemo(() => {
    if (selectedTargetId !== null) return selectedTargetId;
    if (autoMatch) return autoMatch.id;
    if (parsedData) return "new";
    return null;
  }, [selectedTargetId, autoMatch, parsedData]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event): void => {
      const text = event.target?.result as string;
      setRawJson(text || "");
      setSyncResult(null);
      setErrorMsg(null);
    };
    reader.readAsText(file);
  };

  const handleFillSample = (): void => {
    setRawJson(SAMPLE_DOGRUDA_TEMIN_JSON);
    setSyncResult(null);
    setErrorMsg(null);
    setSelectedTargetId(null);
  };

  const targetDossier = typeof effectiveTargetId === "number" && Array.isArray(existingDossiers)
    ? existingDossiers.find((d) => d.id === effectiveTargetId) || null
    : null;

  const handleExecuteSync = async (): Promise<void> => {
    if (!parsedData) return;
    setShowConfirm(false);
    setIsProcessing(true);
    setErrorMsg(null);
    setSyncResult(null);

    try {
      const isNewTarget = effectiveTargetId === "new";
      const targetId = isNewTarget ? null : effectiveTargetId;
      // Yeni dosya seçildiyse oluşturma izni açıkça verilir; mevcut dosyada kapalı kalır.
      const res = await executeDossierEzmeSync(targetId, parsedData, {
        ...options,
        createNewIfNotFound: isNewTarget,
      });
      setSyncResult(res);
      const refreshed = await fetchExistingDossiers();
      setExistingDossiers(Array.isArray(refreshed) ? refreshed : []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Üst Başlık & Açıklama */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <FileCode2 size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
                Harici Dosya Entegrasyonu &amp; Ezme (JSON Sync)
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-semibold">
                  API &amp; Dosya No Eşleme
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Harici servislerden gelen Doğrudan Temin JSON verilerini asıl
                dosya no, DT no veya harici ID ile eşleştirip mevcut dosyayı
                üzerine yazarak (ezerek) güncelleyin.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFillSample}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Sparkles size={14} className="text-amber-500" />
            Örnek JSON&apos;ı Doldur
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1.5 transition-all"
          >
            <UploadCloud size={14} />
            JSON Dosyası Yükle
          </button>
        </div>
      </div>

      {/* JSON Girdi Alanı */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <FileCode2 size={14} />
              Gelen JSON Verisi (Doğrudan Temin Şeması)
            </label>
            {rawJson && (
              <button
                onClick={() => setRawJson("")}
                className="text-xs text-rose-500 hover:underline"
              >
                Temizle
              </button>
            )}
          </div>

          <textarea
            value={rawJson}
            onChange={(e) => {
              setRawJson(e.target.value);
              setSyncResult(null);
              setErrorMsg(null);
            }}
            placeholder='{\n  "id": "dt_2025_2_183260",\n  "dosyaBilgileri": {\n    "dosyaNo": "2025/2",\n    "isinAdi": "Su Sayacı Alımı"\n  }\n}'
            className="w-full h-96 p-3.5 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none shadow-xs"
          />

          {parseResult?.error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-400">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{parseResult.error}</span>
            </div>
          )}

          {parsedData && (
            <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
              <CheckCircle2
                size={16}
                className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400"
              />
              <div>
                <span className="font-bold">JSON Doğrulandı:</span>{" "}
                {parsedData.dosyaBilgileri.isinAdi}
                <div className="text-[11px] opacity-80 mt-1">
                  Asıl Dosya No: {parsedData.dosyaBilgileri.dosyaNo} · DT No:
                  {" "}
                  {parsedData.dosyaBilgileri.dogrudanTeminNumarasi || "Yok"}
                  {" "}
                  · Harici ID: {parsedData.id || "N/A"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Eşleşme ve Önizleme Paneli */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {parsedData
            ? (
              <>
                {/* Hedef Dosya Seçimi & Ezme Kararı */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <SlidersHorizontal size={16} className="text-blue-500" />
                      Hedef Dosya Seçimi ve Ezme Stratejisi
                    </h3>
                    {autoMatch && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        🎯 Otomatik Eşleşti
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="flex items-start gap-2 p-3 rounded-lg border cursor-pointer transition-all border-slate-200 dark:border-slate-800 hover:border-blue-400">
                        <input
                          type="radio"
                          name="targetChoice"
                          checked={effectiveTargetId !== "new"}
                          onChange={() => {
                            if (autoMatch) setSelectedTargetId(autoMatch.id);
                            else if (existingDossiers.length > 0) {
                              setSelectedTargetId(existingDossiers[0].id);
                            }
                          }}
                          className="mt-0.5 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">
                            Mevcut Dosyayı Ez / Güncelle
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            Seçilen dosyanın parametre ve kalemleri bu verilerle
                            üzerine yazılır.
                          </span>
                        </div>
                      </label>

                      <label className="flex items-start gap-2 p-3 rounded-lg border cursor-pointer transition-all border-slate-200 dark:border-slate-800 hover:border-blue-400">
                        <input
                          type="radio"
                          name="targetChoice"
                          checked={effectiveTargetId === "new"}
                          onChange={() => setSelectedTargetId("new")}
                          className="mt-0.5 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">
                            Yeni Dosya Olarak Ekle
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            Mevcut hiçbir dosyaya dokunmadan yeni bir doğrudan
                            temin kaydı oluşturur.
                          </span>
                        </div>
                      </label>
                    </div>

                    {effectiveTargetId !== "new" && (
                      <div className="flex flex-col gap-1.5 mt-1">
                        <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          Eşlenecek / Ezilecek Hedef Dosya:
                        </label>
                        <select
                          value={typeof effectiveTargetId === "number"
                            ? effectiveTargetId
                            : ""}
                          onChange={(e) =>
                            setSelectedTargetId(Number(e.target.value))}
                          className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {existingDossiers.map((d) => (
                            <option key={d.id} value={d.id}>
                              [ID: {d.id}] — {d.temin_no || "No Yok"} — {d.konu}
                              {" "}
                              ({d.butce_yili || "Bütçe Yok"})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Ezme Kapsamı Seçenekleri */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                      <span className="text-[11px] font-bold uppercase tracking-wider block text-slate-500 mb-2">
                        Ezilecek Alanlar &amp; Modüller
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.overwriteGeneralInfo}
                            onChange={(e) =>
                              setOptions((p) => ({
                                ...p,
                                overwriteGeneralInfo: e.target.checked,
                              }))}
                            className="rounded text-blue-600"
                          />
                          <span>Genel Bilgiler &amp; Kodlar</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.overwriteMaterials}
                            onChange={(e) =>
                              setOptions((p) => ({
                                ...p,
                                overwriteMaterials: e.target.checked,
                              }))}
                            className="rounded text-blue-600"
                          />
                          <span>
                            Malzeme Kalemleri ({parsedData.malzemeler?.length ||
                              0})
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.overwriteOffers}
                            onChange={(e) =>
                              setOptions((p) => ({
                                ...p,
                                overwriteOffers: e.target.checked,
                              }))}
                            className="rounded text-blue-600"
                          />
                          <span>
                            Teklifler &amp; Firmalar
                            ({parsedData.teklifler?.length || 0})
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={options.overwriteCommissions}
                            onChange={(e) =>
                              setOptions((p) => ({
                                ...p,
                                overwriteCommissions: e.target.checked,
                              }))}
                            className="rounded text-blue-600"
                          />
                          <span>Komisyon Heyetleri</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Önizleme Sekmeleri */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <button
                      onClick={() => setActiveTab("genel")}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        activeTab === "genel"
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      Dosya Bilgileri
                    </button>
                    <button
                      onClick={() => setActiveTab("malzemeler")}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                        activeTab === "malzemeler"
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Package size={12} />
                      Malzemeler ({parsedData.malzemeler?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab("teklifler")}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                        activeTab === "teklifler"
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Building2 size={12} />
                      Teklifler ({parsedData.teklifler?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab("komisyonlar")}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                        activeTab === "komisyonlar"
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Users size={12} />
                      Komisyonlar
                    </button>
                  </div>

                  {/* Sekme İçerikleri */}
                  {activeTab === "genel" && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                        <span className="text-[10px] text-slate-500 block">
                          Asıl Dosya No
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {parsedData.dosyaBilgileri.dosyaNo || "-"}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                        <span className="text-[10px] text-slate-500 block">
                          Doğrudan Temin No
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {parsedData.dosyaBilgileri.dogrudanTeminNumarasi ||
                            "-"}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                        <span className="text-[10px] text-slate-500 block">
                          Harici ID
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                          {parsedData.id || "-"}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 col-span-2">
                        <span className="text-[10px] text-slate-500 block">
                          İşin Adı
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {parsedData.dosyaBilgileri.isinAdi}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                        <span className="text-[10px] text-slate-500 block">
                          Alım Türü / Madde
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {parsedData.dosyaBilgileri.alimTuru}{" "}
                          ({parsedData.dosyaBilgileri.madde})
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                        <span className="text-[10px] text-slate-500 block">
                          Birim / Makam
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                          {parsedData.dosyaBilgileri.ihalesiYapilacakBirim ||
                            "-"}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                        <span className="text-[10px] text-slate-500 block">
                          Bütçe / Yıl
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {parsedData.dosyaBilgileri.butce}{" "}
                          ({parsedData.dosyaBilgileri.butceYili})
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                        <span className="text-[10px] text-slate-500 block">
                          KDV &amp; Hesaplama
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {parsedData.dosyaBilgileri.kdv} ·{" "}
                          {parsedData.dosyaBilgileri.hesaplamaEsasi}
                        </span>
                      </div>
                    </div>
                  )}

                  {activeTab === "malzemeler" && (
                    <div className="overflow-x-auto max-h-56">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          <tr>
                            <th className="p-1.5">Sıra</th>
                            <th className="p-1.5">Malzeme Adı</th>
                            <th className="p-1.5">Miktar</th>
                            <th className="p-1.5">Birim Fiyat</th>
                            <th className="p-1.5">Toplam Tutar</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {(parsedData.malzemeler || []).map((m, idx) => (
                            <tr
                              key={idx}
                              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                            >
                              <td className="p-1.5 font-mono">
                                {m.siraNo || idx + 1}
                              </td>
                              <td className="p-1.5 font-medium">
                                {m.malzemeAdi}
                              </td>
                              <td className="p-1.5">
                                {m.miktar} {m.birimi || "Adet"}
                              </td>
                              <td className="p-1.5 font-mono">
                                {m.birimFiyat ? `${m.birimFiyat} ₺` : "-"}
                              </td>
                              <td className="p-1.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                                {m.toplamTutar ? `${m.toplamTutar} ₺` : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === "teklifler" && (
                    <div className="overflow-x-auto max-h-56">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          <tr>
                            <th className="p-1.5">Firma</th>
                            <th className="p-1.5">Durum</th>
                            <th className="p-1.5">Vergi No</th>
                            <th className="p-1.5">Teklif Tutarı</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {(parsedData.teklifler || []).map((t, idx) => (
                            <tr
                              key={idx}
                              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                            >
                              <td className="p-1.5 font-medium">{t.firma}</td>
                              <td className="p-1.5">
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                                    t.durum === "Kabul Edildi"
                                      ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                  }`}
                                >
                                  {t.durum || "Teklif"}
                                </span>
                              </td>
                              <td className="p-1.5 font-mono">
                                {t.vergiNo || "-"}
                              </td>
                              <td className="p-1.5 font-mono font-bold text-slate-800 dark:text-slate-100">
                                {t.tutarKdvHaric ? `${t.tutarKdvHaric} ₺` : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === "komisyonlar" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                        <span className="font-bold block mb-1 text-slate-800 dark:text-slate-200">
                          Yaklaşık Maliyet Komisyonu
                        </span>
                        {(parsedData.komisyonlar?.yaklasikMaliyet || []).map((
                          k,
                          i,
                        ) => (
                          <div
                            key={i}
                            className="flex justify-between py-0.5 border-b border-slate-100 dark:border-slate-800/50"
                          >
                            <span className="font-medium">{k.adiSoyadi}</span>
                            <span className="text-slate-500">{k.gorevi}</span>
                          </div>
                        ))}
                      </div>
                      <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                        <span className="font-bold block mb-1 text-slate-800 dark:text-slate-200">
                          Muayene ve Kabul Komisyonu
                        </span>
                        {(parsedData.komisyonlar?.muayeneKabul || []).map((
                          k,
                          i,
                        ) => (
                          <div
                            key={i}
                            className="flex justify-between py-0.5 border-b border-slate-100 dark:border-slate-800/50"
                          >
                            <span className="font-medium">{k.adiSoyadi}</span>
                            <span className="text-slate-500">{k.gorevi}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Hata Bildirimi */}
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-400">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Başarı Bildirimi */}
                {syncResult && (
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <CheckCircle2
                        size={18}
                        className="text-emerald-600 dark:text-emerald-400"
                      />
                      <span>{syncResult.message}</span>
                    </div>
                    <div className="text-[11px] opacity-90">
                      Güncellenen Bileşenler:{" "}
                      {syncResult.updatedFields.join(", ")}
                    </div>
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigate({
                            to: APP_ROUTES.DOSYA_MANAGE,
                            search: { id: syncResult.dosyaId },
                          })}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 transition-all"
                      >
                        <FolderOpen size={14} />
                        Dosyayı Yönetim Ekranında Aç
                      </button>
                    </div>
                  </div>
                )}

                {/* Son Onay Paneli */}
                {showConfirm && (
                  <div className="p-4 rounded-xl border-2 border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-950/30 text-xs text-amber-900 dark:text-amber-200 flex flex-col gap-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <AlertCircle size={16} />
                      {effectiveTargetId === "new"
                        ? "Yeni Kayıt Onayı"
                        : "Üzerine Yazma Onayı"}
                    </div>
                    {effectiveTargetId === "new"
                      ? (
                        <div>
                          Yeni doğrudan temin dosyası oluşturulacak:{" "}
                          <strong>
                            {parsedData.dosyaBilgileri.dosyaNo || "-"} —{" "}
                            {parsedData.dosyaBilgileri.isinAdi}
                          </strong>
                        </div>
                      )
                      : (
                        <div>
                          Hedef dosya:{" "}
                          <strong>
                            [ID: {effectiveTargetId}]{" "}
                            {targetDossier?.temin_no || "No Yok"} —{" "}
                            {targetDossier?.konu || "-"}
                          </strong>
                          <div className="mt-0.5">
                            Gelen JSON:{" "}
                            {parsedData.dosyaBilgileri.dosyaNo || "-"} —{" "}
                            {parsedData.dosyaBilgileri.isinAdi}
                          </div>
                        </div>
                      )}
                    <ul className="list-disc pl-5 space-y-0.5">
                      {options.overwriteGeneralInfo && (
                        <li>Genel bilgiler ve kodlar güncellenecek</li>
                      )}
                      {options.overwriteMaterials && (
                        <li>
                          Malzeme kalemleri ({parsedData.malzemeler?.length ||
                            0})
                          {effectiveTargetId !== "new" &&
                            " — mevcutlar silinip yeniden yazılacak"}
                        </li>
                      )}
                      {options.overwriteOffers && (
                        <li>
                          Teklifler ({parsedData.teklifler?.length || 0})
                          {effectiveTargetId !== "new" &&
                            " — mevcutlar silinip yeniden yazılacak"}
                        </li>
                      )}
                      {options.overwriteCommissions && (
                        <li>
                          Komisyon heyetleri
                          {effectiveTargetId !== "new" &&
                            " — mevcutlar silinip yeniden yazılacak"}
                        </li>
                      )}
                    </ul>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={handleExecuteSync}
                        className="px-3.5 py-1.5 rounded-lg font-semibold bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        Onayla ve Uygula
                      </button>
                      <button
                        onClick={() => setShowConfirm(false)}
                        className="px-3.5 py-1.5 rounded-lg font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                      >
                        Vazgeç
                      </button>
                    </div>
                  </div>
                )}

                {/* Ana İşlem Butonu */}
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={isProcessing || showConfirm}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing
                    ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Veriler Eşleniyor ve Dosya Eziliyor...</span>
                      </>
                    )
                    : (
                      <>
                        <FileCheck2 size={18} />
                        <span>
                          {effectiveTargetId === "new"
                            ? "Verileri Sisteme Yeni Dosya Olarak Ekle"
                            : `Verileri Eşle ve Hedef Dosyayı (${effectiveTargetId}) Ez / Güncelle`}
                        </span>
                        <ArrowRight size={16} />
                      </>
                    )}
                </button>
              </>
            )
            : (
              <div className="h-96 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center text-center p-8 text-slate-400 dark:text-slate-500">
                <FileCode2
                  size={48}
                  className="mb-3 opacity-40 text-blue-500"
                />
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  JSON Verisi Bekleniyor
                </h3>
                <p className="text-xs max-w-sm mt-1 text-slate-500">
                  Sol tarafa harici Doğrudan Temin JSON kodunu yapıştırın veya
                  yukarıdaki{" "}
                  <strong>&quot;Örnek JSON&apos;ı Doldur&quot;</strong>{" "}
                  butonuna tıklayarak testi başlatın.
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
