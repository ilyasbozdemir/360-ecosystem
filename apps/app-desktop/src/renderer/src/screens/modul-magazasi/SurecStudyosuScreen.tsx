import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Calculator,
  CheckCircle2,
  CheckSquare,
  Cloud,
  Compass,
  Copy,
  Download,
  FileSpreadsheet,
  FileText,
  Landmark,
  Lightbulb,
  Link2,
  PackageCheck,
  Plus,
  Printer,
  Puzzle,
  Search,
  Sparkles,
  Trash2,
  Wrench,
} from "lucide-react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  HazirMetinKalibi,
  SUREC_PAKETLERI_DATA,
  SurecPaketiVerisi,
} from "./data/surecVeHazirMetinler.data";
import { APP_ROUTES } from "../../constants/routeConstants";
import { cn } from "../../utils/cn";

type StudioTab =
  | "nedir"
  | "luzum_kagidi"
  | "onay_belgesi"
  | "teklif_mektuplari"
  | "piyasa_arastirma"
  | "yaklasik_maliyet"
  | "muayene_kabul"
  | "hakedis_raporu"
  | "rehber_mys"
  | "rehber_tif"
  | "rehber_ekap"
  | "dilekce"
  | "tutanak"
  | "hazir_metinler";

const VALID_TABS: StudioTab[] = [
  "nedir",
  "luzum_kagidi",
  "onay_belgesi",
  "teklif_mektuplari",
  "piyasa_arastirma",
  "yaklasik_maliyet",
  "muayene_kabul",
  "hakedis_raporu",
  "rehber_mys",
  "rehber_tif",
  "rehber_ekap",
  "dilekce",
  "tutanak",
  "hazir_metinler",
];

export default function SurecStudyosuScreen(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromSearchOrLocation = (): StudioTab => {
    // 1. location.search objesi veya stringi
    const searchObj = location.search as Record<string, unknown> | string | undefined;
    if (searchObj && typeof searchObj === "object" && "tab" in searchObj) {
      const val = String(searchObj.tab) as StudioTab;
      if (VALID_TABS.includes(val)) return val;
    }
    if (typeof searchObj === "string" && searchObj) {
      const p = new URLSearchParams(searchObj);
      const val = p.get("tab") as StudioTab;
      if (val && VALID_TABS.includes(val)) return val;
    }

    // 2. Fallback: window.location hash / search
    if (typeof window !== "undefined") {
      const hash = window.location.hash || "";
      const hashIdx = hash.indexOf("?");
      const hashParams = hashIdx !== -1
        ? new URLSearchParams(hash.substring(hashIdx))
        : null;
      const searchParams = new URLSearchParams(window.location.search);
      const t = (hashParams?.get("tab") || searchParams.get("tab")) as StudioTab;
      if (t && VALID_TABS.includes(t)) return t;
    }
    return "nedir";
  };

  const getModulIdFromSearchOrLocation = (): string => {
    const searchObj = location.search as Record<string, unknown> | string | undefined;
    if (searchObj && typeof searchObj === "object" && "modulId" in searchObj) {
      const val = String(searchObj.modulId);
      if (SUREC_PAKETLERI_DATA[val]) return val;
    }
    if (typeof searchObj === "string" && searchObj) {
      const p = new URLSearchParams(searchObj);
      const val = p.get("modulId");
      if (val && SUREC_PAKETLERI_DATA[val]) return val;
    }

    if (typeof window !== "undefined") {
      const hash = window.location.hash || "";
      const hashIdx = hash.indexOf("?");
      const hashParams = hashIdx !== -1
        ? new URLSearchParams(hash.substring(hashIdx))
        : null;
      const searchParams = new URLSearchParams(window.location.search);
      const mId = hashParams?.get("modulId") || searchParams.get("modulId");
      if (mId && SUREC_PAKETLERI_DATA[mId]) return mId;
    }
    return "kik-dogrudan-temin-22d";
  };

  // Aktif Sekme (Varsayılan: "Doğrudan Temin Nedir?" veya URL'den gelen tab)
  const [activeTab, setActiveTab] = useState<StudioTab>(getTabFromSearchOrLocation());

  // Seçili Süreç Paketi
  const [selectedPaketId, setSelectedPaketId] = useState<string>(
    getModulIdFromSearchOrLocation(),
  );

  // Router search değiştiğinde sekme ve paket senkronizasyonu
  const searchKey = typeof location.search === "string" ? location.search : JSON.stringify(location.search);
  const [prevSearch, setPrevSearch] = useState(searchKey);

  if (prevSearch !== searchKey) {
    setPrevSearch(searchKey);
    const mId = getModulIdFromSearchOrLocation();
    setSelectedPaketId(mId);
    const nextTab = getTabFromSearchOrLocation();
    if (nextTab) setActiveTab(nextTab);
  }

  React.useEffect(() => {
    const handleLocationChange = (): void => {
      setSelectedPaketId(getModulIdFromSearchOrLocation());
      const nextTab = getTabFromSearchOrLocation();
      if (nextTab) setActiveTab(nextTab);
    };
    window.addEventListener("hashchange", handleLocationChange);
    window.addEventListener("popstate", handleLocationChange);
    return () => {
      window.removeEventListener("hashchange", handleLocationChange);
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  const aktifPaket: SurecPaketiVerisi = SUREC_PAKETLERI_DATA[selectedPaketId] ||
    SUREC_PAKETLERI_DATA["kik-dogrudan-temin-22d"];

  // =========================================================================
  // ORTAK BİLGİLER STATE'İ (Görsel 2 - Bütün evraklara zincirleme yansıyan veriler)
  // =========================================================================
  const [ortakBilgiler, setOrtakBilgiler] = useState({
    kurumAdi: "T.C. İDARE BAŞKANLIĞI / DESTEK HİZMETLERİ",
    isAdi: "Temizlik ve Kırtasiye Malzemesi Alımı İşi",
    nitelik: "Tüketim",
    ilce: "ÇANKAYA",
    il: "ANKARA",
    butceTertibi: "03.2.1.01 - Kırtasiye ve Büro Malzemesi Alımları",
    harcamaYetkilisi: "Mustafa ÖZTÜRK",
    harcamaYetkilisiUnvan: "Harcama Yetkilisi / Birim Amiri",
    gerceklestirmeGorevlisi: "Ahmet YILMAZ",
    gerceklestirmeUnvan: "Müdür Yardımcısı / Gerçekleştirme Görevlisi",
    tarih: new Date().toISOString().split("T")[0],
    saat: "14:00",
    kararNo: "2026/DT-104",
    yaklasikMaliyet: "44.800,00 ₺",
  });

  // Evrak Tamamlanma Durumları (Görsel 2'deki "henüz eksik" / "tamamlandı" rozetleri)
  const [evrakTamamlandi, setEvrakTamamlandi] = useState<
    Record<string, boolean>
  >({
    luzum_kagidi: false,
    onay_belgesi: false,
    teklif_mektuplari: false,
    piyasa_arastirma: false,
    yaklasik_maliyet: false,
    muayene_kabul: false,
    hakedis_raporu: false,
  });

  // Malzeme Kalemleri (Dinamik Tablo)
  const [kalemler, setKalemler] = useState([
    {
      id: "1",
      sira: 1,
      ad: "A4 Fotokopi Kâğıdı (80 gr 500lü)",
      miktar: 100,
      birim: "Paket",
      birimFiyat: 140,
      toplam: 14000,
    },
    {
      id: "2",
      sira: 2,
      ad: "Sıvı El Sabunu (5 Litre Antibakteriyel)",
      miktar: 40,
      birim: "Bidon",
      birimFiyat: 185,
      toplam: 7400,
    },
    {
      id: "3",
      sira: 3,
      ad: "Lazer Yazıcı Toneri (Orijinal Yüksek Kapasite)",
      miktar: 6,
      birim: "Adet",
      birimFiyat: 2850,
      toplam: 17100,
    },
    {
      id: "4",
      sira: 4,
      ad: "Yüzey Temizleyici Dezenfektan (5L)",
      miktar: 30,
      birim: "Bidon",
      birimFiyat: 210,
      toplam: 6300,
    },
  ]);

  // Piyasa Fiyat Teklifleri (3 Firma Kıyaslaması)
  const [firmalar, setFirmalar] = useState([
    {
      id: "f-1",
      ad: "A Tipi Kırtasiye ve Büro Malz. Ltd. Şti.",
      teklifTutari: "44.800,00 ₺",
      uygunMu: true,
    },
    {
      id: "f-2",
      ad: "B Başarı Ticaret San. A.Ş.",
      teklifTutari: "47.250,00 ₺",
      uygunMu: false,
    },
    {
      id: "f-3",
      ad: "C Çağdaş Tedarik Dağıtım Ltd.",
      teklifTutari: "49.100,00 ₺",
      uygunMu: false,
    },
  ]);

  // Komisyon & Heyet İmzacıları
  const [komisyonUyeleri, setKomisyonUyeleri] = useState([
    {
      id: "1",
      ad: "Ahmet YILMAZ",
      unvan: "Müdür Yardımcısı",
      rol: "Komisyon Başkanı",
    },
    {
      id: "2",
      ad: "Ali DEMİR",
      unvan: "Mühendis / Teknik Personel",
      rol: "Teknik Üye",
    },
    { id: "3", ad: "Fatma ŞAHİN", unvan: "V.H.K.İ. / Memur", rol: "İdari Üye" },
  ]);

  // Serbest Dilekçe & Tutanak Metinleri
  const [gerekceMetni, setGerekceMetni] = useState(
    "Birimimizin yürütmekte olduğu kamu hizmetlerinin kesintisiz sürdürülebilmesi ve idari hizmetlerin aksamaması amacıyla, yukarıda özellikleri ve miktarları belirtilen malzemelerin 4734 Sayılı Kanunun 22/d maddesi kapsamında doğrudan temin usulüyle satın alınması hususunda gereğini tensiplerinize arz ederim.",
  );

  const [tutanakZabitMetni, setTutanakZabitMetni] = useState(
    "İdaremiz Doğrudan Temin Onay Belgesi kapsamında yüklenici firma tarafından fatura mukabili teslim edilen malzemelerin fiziki muayenesi, adet sayımları ve teknik şartnameye uygunluk tetkikleri tarafımızca yapılmıştır. Teslim edilen malların evsafına uygun, çalışır durumda ve noksansız olduğu tespit edilerek işbu tutanak müştereken imza altına alınmıştır.",
  );

  // Toast Mesajı
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string): void => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Ortak Bilgileri Güncelleme
  const handleUpdateOrtak = (field: string, val: string): void => {
    setOrtakBilgiler((prev) => ({ ...prev, [field]: val }));
  };

  // Evrak Durumunu Değiştirme
  const toggleEvrakDurumu = (evrakKey: string): void => {
    setEvrakTamamlandi((prev) => {
      const nextVal = !prev[evrakKey];
      showToast(
        nextVal
          ? "Evrak tamamlandı olarak işaretlendi"
          : "Evrak eksik olarak işaretlendi",
      );
      return { ...prev, [evrakKey]: nextVal };
    });
  };

  // Kalem Değişikliği
  const handleKalemFiyatChange = (id: string, fiyat: number): void => {
    setKalemler((prev) =>
      prev.map((
        k,
      ) => (k.id === id
        ? { ...k, birimFiyat: fiyat, toplam: k.miktar * fiyat }
        : k)
      )
    );
  };

  // Kalem Ekle
  const handleAddKalem = (): void => {
    const yeniNo = kalemler.length + 1;
    setKalemler((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sira: yeniNo,
        ad: "Yeni Malzeme / Hizmet Kalemi",
        miktar: 10,
        birim: "Adet",
        birimFiyat: 100,
        toplam: 1000,
      },
    ]);
  };

  // Kalem Sil
  const handleDeleteKalem = (id: string): void => {
    if (kalemler.length <= 1) {
      showToast("En az bir malzeme kalemi bulunmalıdır!");
      return;
    }
    setKalemler((prev) => prev.filter((k) => k.id !== id));
  };

  // Komisyon Üyesi Ekle
  const handleAddKomisyonUyesi = (): void => {
    setKomisyonUyeleri((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        ad: "",
        unvan: "Görevli Personel",
        rol: "Komisyon Üyesi",
      },
    ]);
  };

  // Komisyon Üyesi Sil
  const handleDeleteKomisyonUyesi = (id: string): void => {
    if (komisyonUyeleri.length <= 2) {
      showToast("Tutanak ve komisyonlarda en az 2 imza sahibi bulunmalıdır!");
      return;
    }
    setKomisyonUyeleri((prev) => prev.filter((u) => u.id !== id));
  };

  // Hazır Metin Kullanıldığında Formu Doldur
  const handleUseMetin = (metin: HazirMetinKalibi): void => {
    if (metin.formTipi === "tutanak") {
      setTutanakZabitMetni(metin.tamMetin);
      setActiveTab("muayene_kabul");
    } else {
      setGerekceMetni(metin.tamMetin);
      setActiveTab("luzum_kagidi");
    }
    showToast(`"${metin.baslik}" şablonu yüklendi!`);
  };

  // Panoya Kopyala
  const handleCopyText = (text: string): void => {
    navigator.clipboard.writeText(text);
    showToast("Metin panoya kopyalandı!");
  };

  // Toplam Tutar Hesabı
  const toplamKalemTutari = useMemo(() => {
    return kalemler.reduce((acc, curr) => acc + curr.toplam, 0);
  }, [kalemler]);

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden font-sans select-none">
      {/* Toast Bildirimi */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-200 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-xs font-bold shadow-2xl border border-slate-700/50 animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SOL KENAR ÇUBUĞU (Görsel 2 Birebir Sol Menü) */}
      {/* ========================================================================= */}
      <aside className="w-64 sm:w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0 z-20">
        {/* Üst Geri Dönüş ve Başlık */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => navigate({ to: APP_ROUTES.MODUL_MAGAZASI })}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Doğrudan Temin</span>
          </button>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Otomatik</span>
          </div>
        </div>

        {/* Menü Grupları */}
        <nav className="p-3 space-y-4 flex-1 overflow-y-auto custom-scrollbar text-xs">
          {/* GRUP 1: DOĞRUDAN TEMİN GENEL */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-black uppercase text-slate-400 tracking-wider">
              DOĞRUDAN TEMİN
            </div>
            <button
              onClick={() => setActiveTab("nedir")}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer text-left",
                activeTab === "nedir"
                  ? "bg-[#183661] text-white shadow-md font-extrabold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
              )}
            >
              <Lightbulb
                className={cn(
                  "w-4 h-4 shrink-0",
                  activeTab === "nedir" ? "text-amber-300" : "text-amber-500",
                )}
              />
              <span>Doğrudan Temin Nedir?</span>
            </button>
          </div>

          {/* GRUP 2: EVRAKLAR (TARİH SIRASIYLA) */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-black uppercase text-slate-400 tracking-wider">
              EVRAKLAR (TARİH SIRASIYLA)
            </div>

            {/* 1. Lüzum Kâğıdı */}
            <button
              onClick={() => setActiveTab("luzum_kagidi")}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer text-left font-medium",
                activeTab === "luzum_kagidi"
                  ? "bg-blue-600 text-white font-bold shadow-xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
              )}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">Lüzum Kâğıdı</span>
              </div>
              {evrakTamamlandi.luzum_kagidi
                ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                )
                : (
                  <span className="text-[10px] text-amber-500 dark:text-amber-400">
                    eksik
                  </span>
                )}
            </button>

            {/* 2. Onay Belgesi */}
            <button
              onClick={() => setActiveTab("onay_belgesi")}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer text-left font-medium",
                activeTab === "onay_belgesi"
                  ? "bg-blue-600 text-white font-bold shadow-xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
              )}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Onay Belgesi</span>
              </div>
              {evrakTamamlandi.onay_belgesi
                ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                )
                : (
                  <span className="text-[10px] text-amber-500 dark:text-amber-400">
                    eksik
                  </span>
                )}
            </button>

            {/* 3. Teklif Mektupları */}
            <button
              onClick={() => setActiveTab("teklif_mektuplari")}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer text-left font-medium",
                activeTab === "teklif_mektuplari"
                  ? "bg-blue-600 text-white font-bold shadow-xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
              )}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <FileSpreadsheet className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">Teklif Mektupları (Fiyat)</span>
              </div>
              {evrakTamamlandi.teklif_mektuplari
                ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                )
                : (
                  <span className="text-[10px] text-amber-500 dark:text-amber-400">
                    eksik
                  </span>
                )}
            </button>

            {/* 4. Piyasa Fiyat Araştırma Tutanağı */}
            <button
              onClick={() => setActiveTab("piyasa_arastirma")}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer text-left font-medium",
                activeTab === "piyasa_arastirma"
                  ? "bg-blue-600 text-white font-bold shadow-xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
              )}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Search className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">
                  Piyasa Fiyat Araştırma Tutanağı
                </span>
              </div>
              {evrakTamamlandi.piyasa_arastirma
                ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                )
                : (
                  <span className="text-[10px] text-amber-500 dark:text-amber-400">
                    eksik
                  </span>
                )}
            </button>

            {/* 5. Yaklaşık Maliyet Hesap Cetveli */}
            <button
              onClick={() => setActiveTab("yaklasik_maliyet")}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer text-left font-medium",
                activeTab === "yaklasik_maliyet"
                  ? "bg-blue-600 text-white font-bold shadow-xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
              )}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Calculator className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="truncate">Yaklaşık Maliyet Cetveli</span>
              </div>
              {evrakTamamlandi.yaklasik_maliyet
                ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                )
                : (
                  <span className="text-[10px] text-amber-500 dark:text-amber-400">
                    eksik
                  </span>
                )}
            </button>

            {/* 6. Muayene ve Kabul Komisyonu Tutanağı */}
            <button
              onClick={() => setActiveTab("muayene_kabul")}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer text-left font-medium",
                activeTab === "muayene_kabul"
                  ? "bg-blue-600 text-white font-bold shadow-xs"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
              )}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <PackageCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="truncate">Muayene ve Kabul Tutanağı</span>
              </div>
              {evrakTamamlandi.muayene_kabul
                ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                )
                : (
                  <span className="text-[10px] text-amber-500 dark:text-amber-400">
                    eksik
                  </span>
                )}
            </button>
          </div>

          {/* GRUP 3: REHBER */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-black uppercase text-slate-400 tracking-wider">
              REHBER
            </div>
            <button
              onClick={() => setActiveTab("rehber_mys")}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer text-left font-medium",
                activeTab === "rehber_mys"
                  ? "bg-blue-600 text-white font-bold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
              )}
            >
              <Compass className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">MYS Doğrudan Temin İş Akışı</span>
            </button>
            <button
              onClick={() => setActiveTab("rehber_tif")}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer text-left font-medium",
                activeTab === "rehber_tif"
                  ? "bg-blue-600 text-white font-bold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
              )}
            >
              <Building className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span className="truncate">TİF Ekleme İşlemleri</span>
            </button>
            <button
              onClick={() => setActiveTab("rehber_ekap")}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer text-left font-medium",
                activeTab === "rehber_ekap"
                  ? "bg-blue-600 text-white font-bold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
              )}
            >
              <Landmark className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="truncate">EKAP Yükleme</span>
            </button>
          </div>

          {/* GRUP 4: BAKIM ONARIM / HİZMET ALIMI */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-black uppercase text-slate-400 tracking-wider">
              BAKIM ONARIM / HİZMET ALIMI
            </div>
            <button
              onClick={() => setActiveTab("hakedis_raporu")}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer text-left font-medium",
                activeTab === "hakedis_raporu"
                  ? "bg-blue-600 text-white font-bold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
              )}
            >
              <Wrench className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="truncate">Hakediş & Kabul Tutanağı</span>
            </button>
          </div>

          {/* GRUP 5: ENTEGRASYON & ŞABLON ARAÇLARI */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
            <button
              onClick={() => setActiveTab("hazir_metinler")}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer text-left font-medium",
                activeTab === "hazir_metinler"
                  ? "bg-amber-500 text-white font-bold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
              )}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Hazır Metin Kalıpları</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200">
                {aktifPaket.hazirMetinler.length}
              </span>
            </button>

            <button
              onClick={() => navigate({ to: APP_ROUTES.FORM_BUILDER })}
              className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Puzzle className="w-3.5 h-3.5 text-indigo-600" />
                <span>Form Builder'da Özelleştir</span>
              </div>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </nav>
      </aside>

      {/* ========================================================================= */}
      {/* SAĞ İÇERİK ALANI */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950">
        {/* Üst Durum Çubuğu */}
        <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Doğrudan Temin</span>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-bold">
              {activeTab === "nedir" && "Doğrudan Temin Nedir?"}
              {activeTab === "luzum_kagidi" && "Lüzum Kâğıdı (İhtiyaç Formu)"}
              {activeTab === "onay_belgesi" && "Doğrudan Temin Onay Belgesi"}
              {activeTab === "teklif_mektuplari" &&
                "Piyasa Fiyat Teklif İsteme Mektubu"}
              {activeTab === "piyasa_arastirma" &&
                "Piyasa Fiyat Araştırması Tutanağı"}
              {activeTab === "yaklasik_maliyet" &&
                "Yaklaşık Maliyet Hesap Cetveli"}
              {activeTab === "muayene_kabul" &&
                "Muayene ve Kabul Komisyonu Tutanağı"}
              {activeTab === "hakedis_raporu" &&
                "Hakediş Raporu ve Hizmet Kabulü"}
              {activeTab === "rehber_mys" &&
                "MYS Doğrudan Temin İş Akışı Kılavuzu"}
              {activeTab === "rehber_tif" &&
                "Taşınır Mal Yönetmeliği TİF Rehberi"}
              {activeTab === "rehber_ekap" &&
                "EKAP Yasaklılık ve Kayıt Rehberi"}
              {activeTab === "hazir_metinler" && "Hazır Metin & Kalıp Havuzu"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
              <Cloud className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>Otomatik kaydediliyor</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SEÇİLEN SEKMEYE GÖRE İÇERİK */}
        {/* ========================================================================= */}
        <div className="p-6 md:p-8 flex-1">
          {/* ===================================================================== */}
          {/* GÖRÜNÜM 1: DOĞRUDAN TEMİN NEDİR? (Görsel 2 Birebir Ekranı) */}
          {/* ===================================================================== */}
          {activeTab === "nedir" && (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
              {/* Başlık ve Açıklama */}
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Doğrudan Temin{" "}
                  <span className="text-slate-400 font-normal">/</span>{" "}
                  Doğrudan Temin Nedir?
                </h1>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Lüzum kağıdından muayene ve kabule doğrudan temin evrakları —
                  bilgiler bir kez girilir, bütün evraklara yansır.
                </p>
                <p className="text-xs text-slate-650 dark:text-slate-300 mt-3 leading-relaxed">
                  <span className="font-bold">Doğrudan temin,</span>{" "}
                  4734 sayılı Kamu İhale Kanunu'nun{" "}
                  <span className="font-bold">22. maddesi</span>{" "}
                  uyarınca ihale yapılmadan, ihale komisyonu kurulmadan ve
                  teminat alınmadan, harcama yetkilisinin onayıyla mal ve hizmet
                  alımı yöntemidir. Kamu idarelerinde kırtasiye, sarf malzeme,
                  bilişim/donanım, bakım-onarım gibi alımlar çoğunlukla{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    22/d (parasal limit)
                  </span>{" "}
                  kapsamında yapılır.
                </p>
              </div>

              {/* Sarı/Amber Uyarı Kutusu (Görsel 2 Birebir) */}
              <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3 shadow-xs">
                <Link2 className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                  <span className="font-bold">Bilgileri bir kez yazın.</span>
                  {" "}
                  Kurum adı, işin adı, malzeme listesi, firmalar, fiyatlar ve
                  görevliler bütün evraklara kendiliğinden geçer; herhangi bir
                  evrakta değiştirirseniz hepsinde değişir. Bilgiler hesabınıza
                  kaydedilir, başka cihazda da açılır.
                </p>
              </div>

              {/* Ortak Bilgiler Form Kartı (Görsel 2 Birebir) */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-sm">
                  <span>🏛️</span>
                  <span>Ortak bilgiler</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Kurum Adı */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                      <span>Kurum adı</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold">
                        🔗 ortak
                      </span>
                    </label>
                    <input
                      type="text"
                      value={ortakBilgiler.kurumAdi}
                      onChange={(e) =>
                        handleUpdateOrtak("kurumAdi", e.target.value)}
                      placeholder="T.C. KAMU İDARESİ"
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* İşin / Malın Adı */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                      <span>İşin / malın adı</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold">
                        🔗 ortak
                      </span>
                    </label>
                    <input
                      type="text"
                      value={ortakBilgiler.isAdi}
                      onChange={(e) =>
                        handleUpdateOrtak("isAdi", e.target.value)}
                      placeholder="Örn. Temizlik Malzemesi Alımı"
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Niteliği */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 block">
                      Niteliği
                    </label>
                    <select
                      value={ortakBilgiler.nitelik}
                      onChange={(e) =>
                        handleUpdateOrtak("nitelik", e.target.value)}
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Tüketim">Tüketim (Sarf Malzeme)</option>
                      <option value="Hizmet">Hizmet Alımı</option>
                      <option value="Demirbaş / Taşınır">
                        Dayanıklı Taşınır / Demirbaş
                      </option>
                      <option value="Küçük Onarım">Küçük Onarım & Bakım</option>
                    </select>
                  </div>

                  {/* İlçe */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                      <span>İlçe</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold">
                        🔗 ortak
                      </span>
                    </label>
                    <input
                      type="text"
                      value={ortakBilgiler.ilce}
                      onChange={(e) =>
                        handleUpdateOrtak("ilce", e.target.value)}
                      placeholder="ÇANKAYA"
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* İl */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                      <span>İl</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold">
                        🔗 ortak
                      </span>
                    </label>
                    <input
                      type="text"
                      value={ortakBilgiler.il}
                      onChange={(e) => handleUpdateOrtak("il", e.target.value)}
                      placeholder="ANKARA"
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Bütçe Tertibi */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                      <span>Bütçe Tertibi</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold">
                        🔗 ortak
                      </span>
                    </label>
                    <input
                      type="text"
                      value={ortakBilgiler.butceTertibi}
                      onChange={(e) =>
                        handleUpdateOrtak("butceTertibi", e.target.value)}
                      placeholder="03.2.1.01 - Kırtasiye"
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Evraklar — Düzenleme Sırasıyla Liste (Görsel 2 Birebir) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-sm">
                  <span>📑</span>
                  <span>Evraklar — düzenleme sırasıyla</span>
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      id: "luzum_kagidi",
                      no: 1,
                      title: "Lüzum Kağıdı",
                      desc: "İhtiyaç ve gerekçeli talep formu",
                    },
                    {
                      id: "onay_belgesi",
                      no: 2,
                      title: "Onay Belgesi",
                      desc: "Harcama talimatı ve ödenek bloke yazısı",
                    },
                    {
                      id: "teklif_mektuplari",
                      no: 3,
                      title: "Teklif Mektupları (Fiyat Teklifleri)",
                      desc: "Firmalara gönderilen resmi teklif isteme mektubu",
                    },
                    {
                      id: "piyasa_arastirma",
                      no: 4,
                      title: "Piyasa Fiyat Araştırma Tutanağı",
                      desc:
                        "Tekliflerin kıyaslandığı ve en uygun teklifin açıklandığı tutanak",
                    },
                    {
                      id: "yaklasik_maliyet",
                      no: 5,
                      title: "Yaklaşık Maliyet Hesap Cetveli",
                      desc: "Tahmini bedel tespit cetveli",
                    },
                    {
                      id: "muayene_kabul",
                      no: 6,
                      title: "Muayene ve Kabul Komisyonu Tutanağı",
                      desc:
                        "Teslim edilen malın teknik şartlara uygunluk kabulü",
                    },
                    {
                      id: "hakedis_raporu",
                      no: 7,
                      title: "Hakediş Raporu ve Hizmet İşleri Kabul Tutanağı",
                      desc: "Bakım onarım veya hizmet alımı için kabul evrakı",
                    },
                  ].map((evrak) => {
                    const isDone = evrakTamamlandi[evrak.id];
                    return (
                      <div
                        key={evrak.id}
                        className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 dark:hover:border-blue-500/50 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs flex items-center justify-center shrink-0">
                            {evrak.no}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {evrak.title}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {evrak.desc}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleEvrakDurumu(evrak.id)}
                            className={cn(
                              "px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors",
                              isDone
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300"
                                : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
                            )}
                          >
                            {isDone ? "✓ tamamlandı" : "henüz eksik"}
                          </button>

                          <button
                            onClick={() => setActiveTab(evrak.id as StudioTab)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white transition-all cursor-pointer flex items-center gap-1"
                          >
                            <span>Doldur ve Gör</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* GÖRÜNÜM 2: EVRAK DÜZENLEME & CANLI A4 ÖNİZLEME (Split Layout) */}
          {/* ===================================================================== */}
          {activeTab !== "nedir" && activeTab !== "hazir_metinler" &&
            !activeTab.startsWith("rehber_") && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              {/* SOL KOLON: FORM GİRİŞLERİ (Görsel 2/3 Form Düzeni) */}
              <div className="xl:col-span-5 space-y-5">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setActiveTab("nedir")}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Ortak Bilgilere Dön</span>
                  </button>

                  <button
                    onClick={() => toggleEvrakDurumu(activeTab)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer",
                      evrakTamamlandi[activeTab]
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                        : "bg-amber-50 text-amber-700 border border-amber-300",
                    )}
                  >
                    {evrakTamamlandi[activeTab]
                      ? "✓ Tamamlandı"
                      : "Eksik Olarak İşaretli"}
                  </button>
                </div>

                {/* Form Kutusu */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Belge Parametreleri
                  </div>

                  {/* Makam & Konu */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Hitap Edilen Makam
                    </label>
                    <input
                      type="text"
                      value={ortakBilgiler.kurumAdi}
                      onChange={(e) =>
                        handleUpdateOrtak("kurumAdi", e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      İşin / Malın Adı
                    </label>
                    <input
                      type="text"
                      value={ortakBilgiler.isAdi}
                      onChange={(e) =>
                        handleUpdateOrtak("isAdi", e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                    />
                  </div>

                  {/* Gerekçe / Açıklama Metni */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        Açıklama / Zabıt Metni
                      </label>
                      <button
                        onClick={() => setActiveTab("hazir_metinler")}
                        className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Hazır Metin Seç</span>
                      </button>
                    </div>
                    <textarea
                      rows={5}
                      value={activeTab === "muayene_kabul"
                        ? tutanakZabitMetni
                        : gerekceMetni}
                      onChange={(e) =>
                        activeTab === "muayene_kabul"
                          ? setTutanakZabitMetni(e.target.value)
                          : setGerekceMetni(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 leading-relaxed font-sans"
                    />
                  </div>

                  {/* Kalemler Düzenleyicisi */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        Malzeme / Hizmet Kalemleri ({kalemler.length})
                      </div>
                      <button
                        onClick={handleAddKalem}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Kalem Ekle</span>
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                      {kalemler.map((kalem) => (
                        <div
                          key={kalem.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs"
                        >
                          <div className="truncate flex-1 pr-2">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {kalem.ad}
                            </span>
                            <div className="text-[10px] text-slate-400">
                              {kalem.miktar} {kalem.birim} ×{" "}
                              {kalem.birimFiyat.toLocaleString("tr-TR")} ₺
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900 dark:text-white">
                              {kalem.toplam.toLocaleString("tr-TR")} ₺
                            </span>
                            <button
                              onClick={() => handleDeleteKalem(kalem.id)}
                              className="text-slate-400 hover:text-red-500 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* İmzacı / Komisyon Heyeti */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        Komisyon / Heyet Üyeleri ({komisyonUyeleri.length})
                      </div>
                      <button
                        onClick={handleAddKomisyonUyesi}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Üye Ekle</span>
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
                      {komisyonUyeleri.map((uye) => (
                        <div
                          key={uye.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs"
                        >
                          <div>
                            <div className="font-bold text-slate-800 dark:text-slate-200">
                              {uye.ad || "İsimsiz Görevli"}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {uye.unvan} ({uye.rol})
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteKomisyonUyesi(uye.id)}
                            className="text-slate-400 hover:text-red-500 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SAĞ KOLON: GERÇEK ZAMANLI A4 RESMİ KÂĞIT SİMÜLASYONU (Görsel 2/3 Sağ Kolon) */}
              <div className="xl:col-span-7 space-y-3">
                {/* Belge Aksiyon Araç Çubuğu */}
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>Resmî Baskı Önizlemesi (A4)</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast("Word (.docx) olarak indirildi")}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Doldur ve İndir (Word)</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Yazdır</span>
                    </button>

                    <button
                      onClick={() => handleCopyText(gerekceMetni)}
                      className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      title="Metni Kopyala"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* A4 Kâğıt Sayfası (Görsel 2 & 3 Tasarımı: Times New Roman, Resmî Antet, Noktalı Alanlar) */}
                <div className="w-full bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-xl border border-slate-300 min-h-[700px] flex flex-col justify-between font-serif text-[13px] leading-relaxed select-text">
                  <div className="space-y-6">
                    {/* Antet */}
                    <div className="text-center font-bold tracking-wide space-y-0.5">
                      <div>T.C.</div>
                      <div>
                        {ortakBilgiler.il.toUpperCase()} VALİLİĞİ / KAYMAKAMLIĞI
                      </div>
                      <div>{ortakBilgiler.kurumAdi.toUpperCase()}</div>
                    </div>

                    {/* Sayı ve Tarih Satırı */}
                    <div className="flex items-center justify-between text-xs font-sans">
                      <div>Sayı : E-2026/{ortakBilgiler.kararNo}</div>
                      <div>Tarih : {ortakBilgiler.tarih}</div>
                    </div>

                    {/* Konu Satırı */}
                    <div className="font-sans text-xs">
                      <span className="font-bold">Konu :</span>
                      <span>{ortakBilgiler.isAdi}</span>
                    </div>

                    {/* Hitap Başlığı */}
                    <div className="text-center font-bold py-2 tracking-wider">
                      {activeTab === "muayene_kabul"
                        ? "MUAYENE VE KABUL KOMİSYONU TUTANAĞI"
                        : "HARCAMA YETKİLİSİ MAKAMINA"}
                    </div>

                    {/* Paragraf Metni */}
                    <p className="text-justify indent-8">
                      {activeTab === "muayene_kabul"
                        ? tutanakZabitMetni
                        : gerekceMetni}
                    </p>

                    {/* Malzeme Kalem Tablosu */}
                    <div className="pt-2">
                      <table className="w-full border-collapse border border-slate-400 text-xs font-sans text-left">
                        <thead>
                          <tr className="bg-slate-100 font-bold border-b border-slate-400">
                            <th className="border border-slate-400 p-1.5 w-10 text-center">
                              S.No
                            </th>
                            <th className="border border-slate-400 p-1.5">
                              Malzeme / İş Kalemi
                            </th>
                            <th className="border border-slate-400 p-1.5 w-20 text-center">
                              Miktar
                            </th>
                            <th className="border border-slate-400 p-1.5 w-24 text-right">
                              Birim Fiyat
                            </th>
                            <th className="border border-slate-400 p-1.5 w-24 text-right">
                              Toplam Tutar
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {kalemler.map((kalem) => (
                            <tr
                              key={kalem.id}
                              className="border-b border-slate-300"
                            >
                              <td className="border border-slate-400 p-1.5 text-center font-mono">
                                {kalem.sira}
                              </td>
                              <td className="border border-slate-400 p-1.5 font-medium">
                                {kalem.ad}
                              </td>
                              <td className="border border-slate-400 p-1.5 text-center">
                                {kalem.miktar} {kalem.birim}
                              </td>
                              <td className="border border-slate-400 p-1.5 text-right font-mono">
                                {kalem.birimFiyat.toLocaleString("tr-TR")} ₺
                              </td>
                              <td className="border border-slate-400 p-1.5 text-right font-mono font-bold">
                                {kalem.toplam.toLocaleString("tr-TR")} ₺
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-slate-50 font-bold border-t-2 border-slate-500">
                            <td
                              colSpan={4}
                              className="border border-slate-400 p-2 text-right"
                            >
                              TOPLAM (KDV Hariç):
                            </td>
                            <td className="border border-slate-400 p-2 text-right font-mono text-sm">
                              {toplamKalemTutari.toLocaleString("tr-TR")} ₺
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* İmza Bloğu (Görsel 3 Tutanak Yan Yana İmzalar veya Tekli Harcama Yetkilisi) */}
                  <div className="pt-12 font-sans">
                    {activeTab === "muayene_kabul"
                      ? (
                        <div className="grid grid-cols-3 gap-6 text-center text-xs">
                          {komisyonUyeleri.map((uye) => (
                            <div key={uye.id} className="space-y-1">
                              <div className="font-bold">
                                {uye.ad || "........................"}
                              </div>
                              <div className="text-slate-600">{uye.unvan}</div>
                              <div className="text-slate-500 text-[10px]">
                                {uye.rol}
                              </div>
                              <div className="pt-4 text-slate-300 tracking-widest text-[10px]">
                                İmza
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                      : (
                        <div className="flex justify-end">
                          <div className="text-center space-y-1 w-64 text-xs">
                            <div className="font-bold">
                              {ortakBilgiler.harcamaYetkilisi}
                            </div>
                            <div className="text-slate-600">
                              {ortakBilgiler.harcamaYetkilisiUnvan}
                            </div>
                            <div className="pt-6 text-slate-300 tracking-widest text-[10px]">
                              İmza / Mühür
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* GÖRÜNÜM 3: HAZIR METİN KALIPLARI (Görsel 4 Birebir Ekranı) */}
          {/* ===================================================================== */}
          {activeTab === "hazir_metinler" && (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                  Tutanak & Dilekçe /{" "}
                  <span className="text-blue-600">Hazır Metinler</span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Birine tıklayın; metin belgenize otomatik aktarılır, oradan
                  düzenlersiniz. Noktalı yerleri olaya göre doldurun.
                </p>
              </div>

              {/* Mavi Bilgilendirme Bannerı (Görsel 4 Birebir) */}
              <div className="p-4 rounded-2xl bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-start gap-3 shadow-xs">
                <span className="text-lg">💡</span>
                <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed font-medium">
                  Bu metinler{" "}
                  <span className="font-bold">başlangıç taslağıdır.</span>{" "}
                  Alım ve tutanak gerekçesini kendi cümlelerinizle,{" "}
                  <span className="font-bold">yorum katmadan</span>{" "}
                  yazmanız Sayıştay ve KİK denetiminde her zaman daha doğrudur.
                </p>
              </div>

              {/* Kalıp Kartları Listesi */}
              <div className="space-y-4">
                {aktifPaket.hazirMetinler.map((metin) => (
                  <div
                    key={metin.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 dark:hover:border-blue-500/50 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-slate-900 dark:text-white">
                        {metin.baslik}
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {metin.kategori}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-mono bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      {metin.tamMetin}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400">
                        {metin.rehberNotu}
                      </span>
                      <button
                        onClick={() => handleUseMetin(metin)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>Bu metni kullan</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* GÖRÜNÜM 4: REHBER SEKMELERİ (MYS, TİF, EKAP) */}
          {/* ===================================================================== */}
          {activeTab.startsWith("rehber_") && (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                    {activeTab === "rehber_mys" &&
                      "MYS Doğrudan Temin İş Akışı"}
                    {activeTab === "rehber_tif" &&
                      "Taşınır Mal Yönetmeliği TİF Ekleme"}
                    {activeTab === "rehber_ekap" &&
                      "EKAP Yasaklılık ve Bildirim Kılavuzu"}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Maliye ve KİK sistemlerine veri aktarımında dikkat edilecek
                    adımlar ve mevzuat kontrol listesi.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("nedir")}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                >
                  ← Sürece Dön
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="font-bold text-xs uppercase tracking-wider text-blue-600">
                    1. Aşama: Harcama Talimatı & Bloke
                  </div>
                  <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed">
                    MYS sistemi üzerinden Harcama Yönetimi {">"}{" "}
                    Harcama Talimatı modülüne girilerek 4734 Sayılı Kanun 22/d
                    bendi seçilir. Bütçe ödeneği bloke edilir.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="font-bold text-xs uppercase tracking-wider text-emerald-600">
                    2. Aşama: Muayene Kabul & Fatura Girişi
                  </div>
                  <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed">
                    Mal/hizmet teslim alındıktan sonra e-fatura MYS sistemine
                    düşer. Muayene kabul tutanağı ile fatura eşleştirilir.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="font-bold text-xs uppercase tracking-wider text-purple-600">
                    3. Aşama: TİF ve Taşınır Kaydı
                  </div>
                  <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed">
                    TKYS sistemi üzerinden Taşınır İşlem Fişi (TİF) düzenlenir.
                    Sarf malzemeler için ambar çıkışı, demirbaşlar için oda
                    barkodu basılır.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="font-bold text-xs uppercase tracking-wider text-amber-600">
                    4. Aşama: Ödeme Emri & Muhasebe
                  </div>
                  <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed">
                    Vergi borcu sorgusu (6183 m.22/A) yapılır. Ödeme emri
                    belgesi oluşturularak Strateji/Malmüdürlüğü servisine
                    gönderilir.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
