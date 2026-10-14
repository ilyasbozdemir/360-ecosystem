/* eslint-disable */
import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  Building2,
  Users,
  FileText,
  GitCommitHorizontal,
  Sparkles,
  Edit,
  ExternalLink,
  Trash2,
} from "lucide-react";

// Hooks
import { useTakip } from "./components/useTakip";
import { useSurecAkisi } from "../surec-akisi/hooks/useSurecAkisi";

// Takip Bileşenleri
import { TakipHeader } from "./components/TakipHeader";
import { TakipActiveDosyaSummary } from "./components/TakipActiveDosyaSummary";
import { TakipDosyaTarihlerWidget } from "./components/TakipDosyaTarihlerWidget";
import { TakipUretilenBelgelerWidget } from "./components/TakipUretilenBelgelerWidget";
import { TakipAsamaStepper } from "./components/TakipAsamaStepper";
import { TakipIsAkisiYonergesi } from "./components/TakipIsAkisiYonergesi";
import { TakipKalemlerVeFirmalarGrid } from "./components/TakipKalemlerVeFirmalarGrid";
import { TakipDosyaDetayBilgileri } from "./components/TakipDosyaDetayBilgileri";
import { TakipAsamaAciklamalari } from "./components/TakipAsamaAciklamalari";
import { TakipGenelMetrikView } from "./components/TakipGenelMetrikView";
import { DosyaNotlariWidget } from "../../notlar/components/DosyaNotlariWidget";

// Süreç Akışı Sekme Bileşenleri & Modalları
import { SurecAkisiHeader } from "../surec-akisi/components/SurecAkisiHeader";
import { BelgeOnizlemeModal } from "../surec-akisi/components/BelgeOnizlemeModal";
import { OzetTab } from "../surec-akisi/components/tabs/OzetTab";
import { MalzemeTab } from "../surec-akisi/components/tabs/MalzemeTab";
import { FirmalarTab } from "../surec-akisi/components/tabs/FirmalarTab";
import { KomisyonTab } from "../surec-akisi/components/tabs/KomisyonTab";
import { BelgelerTab } from "../surec-akisi/components/tabs/BelgelerTab";
import { SurecTab } from "../surec-akisi/components/tabs/SurecTab";
import { YeniNesilBelgeStudyosuTab } from "../surec-akisi/components/YeniNesilBelgeStudyosuTab";
import { APP_ROUTES } from "../../../constants/routeConstants";

export function TakipScreen(): React.JSX.Element {
  const navigate = useNavigate();

  // 1. Takip Kancası
  const {
    activeDosyaId,
    setActiveDosyaId,
    activeDosya,
    dosyalar,
    dbBelgeler,
    allBelgeler,
    kalemler: takipKalemler,
    firmalar: takipFirmalar,
    komisyonlar: takipKomisyonlar,
    stages,
    dbAsamalar,
    currentAsamaSira,
    STAGE_ROUTES,
    STAGE_SHORT_LABELS,
    status,
    setStatus,
    acilisTarihi,
    setAcilisTarihi,
    sonTeklifTarihi,
    setSonTeklifTarihi,
    teminTarihi,
    setTeminTarihi,
    teslimTarihi,
    setTeslimTarihi,
    notlar,
    setNotlar,
    saveLoading,
    saveMessage,
    handleEditDosya,
    handleSurecAkisi,
    handleOpenInNewWindow,
    handleDelete,
    handleUpdateDosya,
    handleToggleSign,
    formatCurrency,
  } = useTakip();

  // 2. Süreç Akışı Kancası
  const {
    dosyaContext,
    dosya,
    selectedTab,
    setSelectedTab,
    kalemler: surecKalemler,
    firmalar: surecFirmalar,
    komisyonlar: surecKomisyonlar,
    belgeler,
    selectedBelge,
    setSelectedBelge,
    menuAcikId,
    setMenuAcikId,
    previewBelge,
    setPreviewBelge,
    selectedAsamaFilter,
    setSelectedAsamaFilter,
    taranmisBelgeler,
    surukleniyor,
    setSurukleniyor,
    expandedKomisyon,
    setExpandedKomisyon,
    stagesWithStatus,
    toggleTask,
    belgeOlustur,
    dosyalariEkle,
    taranmisBelgeSil,
    toplamBedel,
    overallProgress,
    belgeTamamlanan,
    pdfYuklenenSayisi,
    filteredBelgeler,
  } = useSurecAkisi();

  const totalKalemCount = surecKalemler.length || takipKalemler.length;
  const totalFirmaCount = surecFirmalar.length || takipFirmalar.length;
  const totalKomisyonCount = surecKomisyonlar.length || takipKomisyonlar.length;

  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // Navigasyon Fonksiyonları
  const handleNavigateCiktiMerkezi = () =>
    navigate({ to: APP_ROUTES.CIKTI_MERKEZI_DASHBOARD as any });
  const handleNavigateFirmalar = () =>
    navigate({ to: APP_ROUTES.FIRMALAR as any });
  const handleNavigateKomisyonlar = () =>
    navigate({ to: APP_ROUTES.KOMISYONLAR as any });

  const handleBelgeOlustur = useCallback(
    async (b: any) => {
      belgeOlustur(Number(b.id));
    },
    [belgeOlustur],
  );

  const normalizedBelgeler = useMemo(() => {
    return belgeler.map((b: any, idx: number) => ({
      ...b,
      id: String(b.kod || b.id || `doc-${idx}`),
      zorunlu: Boolean(b.zorunlu || b.zorunluMu),
    }));
  }, [belgeler]);

  // Sekme Tanımları
  const tabs = [
    {
      id: "ozet",
      label: "Genel Bakış & Takip",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "malzeme",
      label: "Malzeme Listesi",
      icon: Package,
      badge: totalKalemCount > 0 ? totalKalemCount : null,
    },
    {
      id: "firmalar",
      label: "İstekli Firmalar",
      icon: Building2,
      badge: totalFirmaCount > 0 ? totalFirmaCount : null,
    },
    {
      id: "komisyon",
      label: "Komisyon & Yetkililer",
      icon: Users,
      badge: totalKomisyonCount > 0 ? totalKomisyonCount : null,
    },
    {
      id: "belgeler",
      label: "Belgeler & İmzalar",
      icon: FileText,
      badge: belgeler.length > 0 ? belgeler.length : null,
    },
    {
      id: "surec",
      label: "Süreç Akışı & Yönerge",
      icon: GitCommitHorizontal,
      badge: null,
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* AKTİF DOSYA YOKSA: GENEL METRİK VE LİSTE GÖRÜNÜMÜ */}
      {!activeDosya ? (
        <div className="space-y-6">
          <TakipHeader activeDosya={null} onEditClick={handleEditDosya} />
          <TakipGenelMetrikView
            dosyalar={dosyalar}
            allBelgeler={allBelgeler}
            stages={stages}
            dbAsamalar={dbAsamalar}
            formatCurrency={formatCurrency}
            setActiveDosyaId={setActiveDosyaId}
          />
        </div>
      ) : (
        /* AKTİF DOSYA SEÇİLİ İSE: BİRLEŞİK SEKMELİ YÖNETİM MERKEZİ */
        <div className="space-y-6">
          {/* ÜST BAŞLIK VE CANLI STATS BANNER */}
          <div className="space-y-4">
            <SurecAkisiHeader
              dosya={dosya}
              konu={activeDosya?.konu}
              komisyonlarCount={totalKomisyonCount}
              stagesWithStatus={stagesWithStatus}
              onSelectTab={setSelectedTab}
              onOpenStudio={() => setIsStudioOpen(true)}
            />

            {/* Hızlı Aksiyon Araç Çubuğu */}
            <div className="flex items-center justify-between flex-wrap gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Aktif Dosya:
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100/60 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
                  {activeDosya.temin_no || "Dosya No Yok"}
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-md">
                  {activeDosya.konu}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleEditDosya}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white border border-blue-200 dark:border-blue-800/60 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  <Edit size={13} />
                  Dosya Formunu Düzenle
                </button>

                <button
                  type="button"
                  onClick={handleOpenInNewWindow}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  title="Ayrı Pencerede Aç"
                >
                  <ExternalLink size={13} />
                  Yeni Pencere
                </button>

                <button
                  type="button"
                  onClick={() => setIsStudioOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <Sparkles size={13} />
                  Belge Stüdyosu
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl border border-transparent hover:border-rose-200 dark:hover:border-rose-900/40 transition-colors cursor-pointer"
                  title="Dosyayı Sil"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* TAB BAR (SEKME MENÜSÜ) */}
          <div className="border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = selectedTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 rounded-t-xl shadow-2xs"
                        : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 rounded-t-xl"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.badge !== null && (
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEKME 1: GENEL BAKIŞ & TAKİP */}
          {selectedTab === "ozet" && (
            <div className="space-y-6">
              {/* ÜST 12 SÜTUNLU DENGELİ GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* SOL SÜTUN (8 COL): ÖZET KARTLARI, 4 TEMEL AŞAMA & STEPPER */}
                <div className="lg:col-span-8 space-y-6">
                  <TakipActiveDosyaSummary
                    activeDosya={activeDosya}
                    kalemler={takipKalemler}
                    firmalar={takipFirmalar}
                    formatCurrency={formatCurrency}
                    onEditClick={handleEditDosya}
                    onSurecAkisiClick={() => setSelectedTab("surec")}
                    onOpenNewWindowClick={handleOpenInNewWindow}
                    onDeleteClick={handleDelete}
                  />

                  {/* İŞLEM AŞAMASI İLERLEME STEPPER'I (SOLDA BOŞLUĞU MÜKEMMEL KAPATIR) */}
                  <TakipAsamaStepper
                    stages={stages}
                    currentAsamaSira={currentAsamaSira}
                    stageRoutes={STAGE_ROUTES}
                    stageShortLabels={STAGE_SHORT_LABELS}
                  />
                </div>

                {/* SAĞ SÜTUN (4 COL): NOTLAR, TARİH VE BELGE İMZA YÖNETİMİ */}
                <div className="lg:col-span-4 space-y-6">
                  {activeDosyaId && (
                    <DosyaNotlariWidget
                      dosyaId={activeDosyaId}
                      dosyaNo={activeDosya?.temin_no}
                    />
                  )}

                  <TakipDosyaTarihlerWidget
                    status={status}
                    setStatus={setStatus}
                    acilisTarihi={acilisTarihi}
                    setAcilisTarihi={setAcilisTarihi}
                    sonTeklifTarihi={sonTeklifTarihi}
                    setSonTeklifTarihi={setSonTeklifTarihi}
                    teminTarihi={teminTarihi}
                    setTeminTarihi={setTeminTarihi}
                    teslimTarihi={teslimTarihi}
                    setTeslimTarihi={setTeslimTarihi}
                    notlar={notlar}
                    setNotlar={setNotlar}
                    saveLoading={saveLoading}
                    saveMessage={saveMessage}
                    onSubmit={handleUpdateDosya}
                  />

                  <TakipUretilenBelgelerWidget
                    dbBelgeler={dbBelgeler}
                    onToggleSign={handleToggleSign}
                  />
                </div>
              </div>

              {/* HIZLI METRİK ÖZETİ TABLOSU */}
              <OzetTab
                overallProgress={overallProgress}
                pdfYuklenenSayisi={pdfYuklenenSayisi}
                belgelerLength={belgeler.length}
                toplamBedel={toplamBedel}
                kalemlerLength={surecKalemler.length}
                belgeTamamlanan={belgeTamamlanan}
                stagesWithStatus={stagesWithStatus}
                komisyonlar={surecKomisyonlar}
                onSelectTab={setSelectedTab}
              />
            </div>
          )}

          {/* SEKME 2: MALZEME LİSTESİ */}
          {selectedTab === "malzeme" && (
            <div className="space-y-6">
              <MalzemeTab
                kalemler={surecKalemler}
                toplamBedel={toplamBedel}
                belgeler={belgeler}
                onPreview={setPreviewBelge}
                onDosyalariEkle={dosyalariEkle}
                onNavigateCiktiMerkezi={handleNavigateCiktiMerkezi}
                onSelectTab={setSelectedTab}
              />
            </div>
          )}

          {/* SEKME 3: İSTEKLİ FİRMALAR */}
          {selectedTab === "firmalar" && (
            <div className="space-y-6">
              <FirmalarTab
                firmalar={surecFirmalar}
                belgeler={belgeler}
                onPreview={setPreviewBelge}
                onDosyalariEkle={dosyalariEkle}
                onNavigateFirmalar={handleNavigateFirmalar}
                onNavigateCiktiMerkezi={handleNavigateCiktiMerkezi}
                onSelectTab={setSelectedTab}
              />
            </div>
          )}

          {/* SEKME 4: KOMİSYON & YETKİLİLER */}
          {selectedTab === "komisyon" && (
            <div className="space-y-6">
              <KomisyonTab
                komisyonlar={surecKomisyonlar}
                expandedKomisyon={expandedKomisyon}
                setExpandedKomisyon={setExpandedKomisyon}
                belgeler={belgeler}
                onPreview={setPreviewBelge}
                onDosyalariEkle={dosyalariEkle}
                onNavigateKomisyonlar={handleNavigateKomisyonlar}
                onNavigateCiktiMerkezi={handleNavigateCiktiMerkezi}
                onSelectTab={setSelectedTab}
              />

              {/* Detaylı Dosya ve Yetkili Bilgileri */}
              <TakipDosyaDetayBilgileri
                activeDosya={activeDosya}
                komisyonlar={takipKomisyonlar}
                onEditClick={handleEditDosya}
              />
            </div>
          )}

          {/* SEKME 5: BELGELER & İMZALAR */}
          {selectedTab === "belgeler" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8">
                  <BelgelerTab
                    belgeler={belgeler}
                    selectedBelge={selectedBelge}
                    setSelectedBelge={setSelectedBelge}
                    menuAcikId={menuAcikId}
                    setMenuAcikId={setMenuAcikId}
                    taranmisBelgeler={taranmisBelgeler}
                    surukleniyor={surukleniyor}
                    setSurukleniyor={setSurukleniyor}
                    onPreview={setPreviewBelge}
                    onBelgeOlustur={belgeOlustur}
                    onDosyalariEkle={dosyalariEkle}
                    onTaranmisBelgeSil={taranmisBelgeSil}
                    onNavigateCiktiMerkezi={handleNavigateCiktiMerkezi}
                  />
                </div>
                <div className="lg:col-span-4">
                  <TakipUretilenBelgelerWidget
                    dbBelgeler={dbBelgeler}
                    onToggleSign={handleToggleSign}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SEKME 6: SÜREÇ AKIŞI & YÖNERGE */}
          {selectedTab === "surec" && (
            <div className="space-y-6">
              <SurecTab
                stagesWithStatus={stagesWithStatus}
                filteredBelgeler={filteredBelgeler}
                selectedAsamaFilter={selectedAsamaFilter}
                setSelectedAsamaFilter={setSelectedAsamaFilter}
                onToggleTask={toggleTask}
                onSelectTab={setSelectedTab}
                onPreview={setPreviewBelge}
                onDosyalariEkle={dosyalariEkle}
                onNavigateCiktiMerkezi={handleNavigateCiktiMerkezi}
              />

              <TakipIsAkisiYonergesi />

              <TakipAsamaAciklamalari
                stages={stages}
                currentAsamaSira={currentAsamaSira}
              />
            </div>
          )}
        </div>
      )}

      {/* BELGE ÖNİZLEME & YAZDIRMA MODALI */}
      <BelgeOnizlemeModal
        previewBelge={previewBelge}
        onClose={() => setPreviewBelge(null)}
        dosya={dosya}
        kalemler={surecKalemler}
        firmalar={surecFirmalar}
        komisyonlar={surecKomisyonlar}
        toplamBedel={toplamBedel}
        dosyaContext={dosyaContext}
        onBelgeOlustur={belgeOlustur}
        onDosyalariEkle={dosyalariEkle}
      />

      {/* BELGE VE RESMÎ YAZIŞMA STÜDYOSU - TAM EKRAN MODU */}
      {isStudioOpen && (
        <div className="dark fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col p-3 md:p-6 overflow-y-auto animate-in fade-in duration-200 text-slate-100">
          <div className="w-full max-w-7xl mx-auto flex-1">
            <YeniNesilBelgeStudyosuTab
              dosya={dosya}
              belgeler={normalizedBelgeler}
              kalemler={surecKalemler}
              firmalar={surecFirmalar}
              komisyonlar={surecKomisyonlar}
              toplamBedel={toplamBedel}
              dosyaContext={dosyaContext}
              onBelgeOlustur={handleBelgeOlustur}
              onPreviewBelge={setPreviewBelge}
              onClose={() => setIsStudioOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TakipScreen;
