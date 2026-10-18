import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  BadgeAlert,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  Edit,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Link2,
  Package,
  Sparkles,
  TrendingUp,
  User
} from 'lucide-react'
import {
  IhtiyacRaporu,
  IhtiyacRaporuKalem,
  ihtiyacRaporuService
} from '../../../services/ihtiyacRaporuService'
import { calculateTotals, resolveKdvOrani } from '../../../utils/ihtiyacRaporuTotals'
import { formatCurrency, formatDate } from '../../../utils/formatters'
import { useWorkspaceStore } from '../../../store/workspaceStore'
import { useNavigate } from '@tanstack/react-router'
import { APP_ROUTES } from '../../../constants/routeConstants'
import { DocumentPreviewModalV3 } from '../../dosya/components/DocumentPreviewModalV3'

interface DetailViewProps {
  raporId: number
  onBack: () => void
  onEdit: (raporId: number) => void
  onDuplicate: (raporId: number) => void
  onOpenLinkModal: (rapor: IhtiyacRaporu) => void
}

type DetailTab = 'detay' | 'luzum_muzekkeresi' | 'luzum_onay_eki'

export function IhtiyacRaporuDetailView({
  raporId,
  onBack,
  onEdit,
  onDuplicate,
  onOpenLinkModal
}: DetailViewProps): React.JSX.Element {
  const [rapor, setRapor] = useState<IhtiyacRaporu | null>(null)
  const [kalemler, setKalemler] = useState<IhtiyacRaporuKalem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<DetailTab>('detay')

  const { setActiveDosyaId } = useWorkspaceStore()
  const navigate = useNavigate()

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [rep, items] = await Promise.all([
        ihtiyacRaporuService.getRaporById(raporId),
        ihtiyacRaporuService.getRaporKalemleri(raporId)
      ])

      if (!rep) {
        throw new Error(`İhtiyaç raporu bulunamadı (ID: ${raporId})`)
      }

      setRapor(rep)
      setKalemler(items || [])
    } catch (err: unknown) {
      console.error('İhtiyaç raporu detay yüklenemedi:', err)
      const msg =
        err instanceof Error ? err.message : 'İhtiyaç raporu detayları yüklenirken bir hata oluştu.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [raporId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const getStatusBadge = (durum: string): React.JSX.Element => {
    switch (durum) {
      case 'onaylandi':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/70 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-xs">
            <CheckCircle2 size={13} />
            Onaylandı
          </span>
        )
      case 'dosyaya_aktarildi':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100/70 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-300 dark:border-blue-800 shadow-xs">
            <Link2 size={13} />
            Dosyaya Aktarıldı
          </span>
        )
      case 'inceleniyor':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100/70 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-300 dark:border-purple-800 shadow-xs">
            <Clock size={13} />
            İnceleniyor
          </span>
        )
      case 'iptal':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100/70 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shadow-xs">
            <BadgeAlert size={13} />
            İptal
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100/70 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-xs">
            <Clock size={13} />
            Taslak
          </span>
        )
    }
  }

  const handleNavigateToDosya = (dosyaId: number): void => {
    setActiveDosyaId(dosyaId)
    navigate({ to: APP_ROUTES.HAZIRLIK_VE_IHTIYAC as string })
  }

  // Tek kaynak üzerinden tutar hesabı
  const totals = useMemo(() => calculateTotals(kalemler), [kalemler])

  // Hata Durumu
  if (error) {
    return (
      <div className="p-12 text-center text-slate-500 max-w-xl mx-auto space-y-5 animate-in fade-in duration-200">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-xs">
          <BadgeAlert size={28} />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-850 dark:text-slate-100">
            İhtiyaç Raporu Yüklenemedi
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{error}</p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Listeye Dön
          </button>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    )
  }

  // Yükleme Durumu
  if (loading || !rapor) {
    return (
      <div className="p-12 text-center text-slate-500 max-w-7xl mx-auto space-y-4">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium">İhtiyaç raporu detayları yükleniyor...</p>
      </div>
    )
  }

  const hasTotalDiff =
    rapor.tahmini_butce !== null &&
    rapor.tahmini_butce !== undefined &&
    Math.abs(Number(rapor.tahmini_butce) - totals.genelToplam) > 0.01

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-7 animate-in fade-in duration-300">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 transition-all shadow-xs flex items-center gap-2 cursor-pointer group"
            title="İhtiyaç Raporları Listesine Dön"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs font-bold">Listeye Dön</span>
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* Breadcrumb path */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span
              onClick={onBack}
              className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer font-medium"
            >
              İhtiyaç Raporları
            </span>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              {rapor.rapor_no}
            </span>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-400 dark:text-slate-500">
              {activeTab === 'detay'
                ? 'Detay ve Kalemler'
                : activeTab === 'luzum_muzekkeresi'
                  ? 'Lüzum Müzekkeresi Şablonu'
                  : 'Onay Eki Şablonu'}
            </span>
          </nav>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => onDuplicate(rapor.id)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Copy size={14} className="text-slate-500" />
            <span>Kopyala</span>
          </button>

          {!rapor.temin_dosya_id ? (
            <button
              onClick={() => onOpenLinkModal(rapor)}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Link2 size={14} />
              <span>Dosyaya Bağla</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenLinkModal(rapor)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Link2 size={14} />
              <span>Bağlantıyı Değiştir</span>
            </button>
          )}

          <button
            onClick={() => onEdit(rapor.id)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/25 flex items-center gap-1.5 cursor-pointer"
          >
            <Edit size={14} />
            <span>Düzenle</span>
          </button>
        </div>
      </div>

      {/* Hero Banner with Title and Key Details */}
      <div className="bg-linear-to-r from-slate-50 via-blue-50/40 to-indigo-50/30 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 text-slate-850 dark:text-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-mono text-xs font-extrabold border border-blue-400/30">
                {rapor.rapor_no}
              </span>
              {(rapor.evrak_sayisi || rapor.dosya_evrak_sayisi) && (
                <span
                  className="px-3 py-1 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-mono text-xs font-extrabold border border-purple-400/30"
                  title="Resmî EBYS Evrak Sayısı"
                >
                  EBYS: {rapor.evrak_sayisi || rapor.dosya_evrak_sayisi}
                </span>
              )}
              {getStatusBadge(rapor.durum)}
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                <Calendar size={13} className="text-slate-400 dark:text-slate-450" />
                {formatDate(rapor.tarih)}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              {rapor.baslik}
            </h1>
          </div>

          <div className="sm:text-right shrink-0 bg-white dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 sm:min-w-50 shadow-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 block">
              Hesaplanan Tahmini Bedel (KDV Dahil)
            </span>
            <span className="text-2xl font-mono font-black text-cyan-700 dark:text-cyan-400 block">
              {formatCurrency(totals.genelToplam)}
            </span>
            {hasTotalDiff && (
              <span
                className="inline-flex items-center gap-1 text-[10.5px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800"
                title={`Kayıtlı Bedel: ${formatCurrency(rapor.tahmini_butce || 0)}`}
              >
                <BadgeAlert size={12} />
                Kayıtlı Bedel ile Fark Var ({formatCurrency(rapor.tahmini_butce || 0)})
              </span>
            )}
            {totals.araToplam > 0 && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                KDV Hariç: {formatCurrency(totals.araToplam)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sub Tabs: Detay vs Lüzum Müzekkeresi Belge Önizleme */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('detay')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'detay'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText size={15} />
          <span>Rapor Detayı &amp; Kalemler</span>
        </button>

        <button
          onClick={() => setActiveTab('luzum_muzekkeresi')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'luzum_muzekkeresi'
              ? 'bg-cyan-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileSpreadsheet size={15} />
          <span>Doğrudan Temin Lüzum Müzekkeresi Belgesi</span>
        </button>

        <button
          onClick={() => setActiveTab('luzum_onay_eki')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'luzum_onay_eki'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Package size={15} />
          <span>Lüzum Müzekkeresi Onay Eki</span>
        </button>
      </div>

      {/* TAB 1: Rapor Detayı & Kalemler */}
      {activeTab === 'detay' && (
        <>
          {/* Meta Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Talep Eden Birim
              </span>
              <p className="text-sm font-bold text-slate-850 dark:text-slate-100 mt-1 flex items-center gap-2">
                <Building2 size={15} className="text-purple-500 shrink-0" />
                <span className="truncate">{rapor.birim_adi || 'Birim Belirtilmedi'}</span>
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Talep Eden Personel
              </span>
              <div className="mt-1 flex items-start gap-2">
                <User size={15} className="text-blue-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-850 dark:text-slate-100 truncate">
                    {rapor.talep_eden_personel || 'Belirtilmedi'}
                  </p>
                  {rapor.talep_eden_unvan && (
                    <p className="text-[11px] text-slate-450 dark:text-slate-400 truncate">
                      {rapor.talep_eden_unvan}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Toplam Kalem Sayısı
              </span>
              <p className="text-sm font-bold text-slate-850 dark:text-slate-100 mt-1 flex items-center gap-2">
                <Package size={15} className="text-emerald-500 shrink-0" />
                <span>{kalemler.length} Kalem</span>
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Hesaplanan KDV
              </span>
              <p className="text-sm font-bold font-mono text-slate-850 dark:text-slate-100 mt-1 flex items-center gap-2">
                <TrendingUp size={15} className="text-cyan-500 shrink-0" />
                <span>{formatCurrency(totals.kdv)}</span>
              </p>
            </div>
          </div>

          {/* Linked Dossier Card if connected */}
          {rapor.temin_dosya_id ? (
            <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Link2 size={22} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Bağlı Bulunan Alım Dosyası
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                      {rapor.dosya_tur || 'Doğrudan Temin'}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-850 dark:text-slate-100 mt-0.5 truncate">
                    <span className="font-mono text-blue-600 dark:text-blue-400 mr-2">
                      [{rapor.dosya_no || `Dosya #${rapor.temin_dosya_id}`}]
                    </span>
                    {rapor.dosya_konu || 'Alım Dosyası'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleNavigateToDosya(rapor.temin_dosya_id!)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <ExternalLink size={14} />
                <span>Dosyayı Aç &amp; Kalemleri Gör</span>
              </button>
            </div>
          ) : null}

          {/* Justification Box */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2">
                <FileText size={16} className="text-amber-500" />
                İhtiyaç Gerekçesi ve Kapsamı
              </h3>
              <span className="text-[11px] text-slate-400">
                Lüzum müzekkeresi &amp; alım hazırlık gerekçesi
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-855">
              {rapor.gerekce?.trim() || 'Gerekçe açıklaması girilmemiş.'}
            </p>
          </div>

          {/* Items Table Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-950/40">
              <div className="flex items-center gap-2.5">
                <Package size={17} className="text-blue-600" />
                <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100">
                  İhtiyaç Kalemleri Listesi
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
                  {kalemler.length} Kalem
                </span>
              </div>

              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                KDV Dahil Toplam: {formatCurrency(totals.genelToplam)}
              </span>
            </div>

            {kalemler.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-450 space-y-3">
                <Package size={32} className="mx-auto text-slate-300 dark:text-slate-700" />
                <p className="font-medium">Bu ihtiyaç raporuna henüz kalem eklenmemiş.</p>
                <button
                  onClick={() => onEdit(rapor.id)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <Edit size={13} />
                  Kalem Ekle
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/40 dark:bg-slate-950/20">
                      <th className="py-3 px-4 w-12 text-center">Sıra</th>
                      <th className="py-3 px-4">Kalem / İşin Adı &amp; Açıklama</th>
                      <th className="py-3 px-4 w-24">Tür</th>
                      <th className="py-3 px-4 w-32 text-right">Miktar &amp; Birim</th>
                      <th className="py-3 px-4 w-20 text-center">KDV</th>
                      <th className="py-3 px-4 w-32 text-right">Tahmini B. Fiyat</th>
                      <th className="py-3 px-4 w-32 text-right">Satır Tutarı</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {kalemler.map((k, idx) => {
                      const rowTotal =
                        (Number(k.miktar) || 0) * (Number(k.tahmini_birim_fiyat) || 0)
                      const kdvRate = resolveKdvOrani(k.kdv_orani)
                      return (
                        <tr
                          key={k.id || idx}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3 px-4 text-center font-mono text-slate-400 font-bold">
                            {k.sira_no || idx + 1}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-850 dark:text-slate-100 block text-xs">
                              {k.kalem_adi}
                            </span>
                            {k.aciklama && (
                              <span className="text-[11.5px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-relaxed">
                                {k.aciklama}
                              </span>
                            )}
                            {(k.tasinir_kodu || k.okas_kodu || k.poz_no) && (
                              <div className="flex gap-2.5 mt-1.5 text-[10.5px] text-slate-400 font-mono">
                                {k.tasinir_kodu && (
                                  <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                    TK: {k.tasinir_kodu}
                                  </span>
                                )}
                                {k.okas_kodu && (
                                  <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                    OKAS: {k.okas_kodu}
                                  </span>
                                )}
                                {k.poz_no && (
                                  <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                    POZ: {k.poz_no}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-md text-[10.5px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {k.tipi || 'Mal'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-slate-800 dark:text-slate-200">
                            <span className="font-bold font-mono text-xs">{k.miktar}</span>{' '}
                            <span className="text-[11px] text-slate-450 font-normal">
                              {k.birim}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-slate-500">
                            %{kdvRate}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                            {k.tahmini_birim_fiyat ? formatCurrency(k.tahmini_birim_fiyat) : '-'}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-850 dark:text-slate-100">
                            {rowTotal > 0 ? formatCurrency(rowTotal) : '-'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-950/60 font-bold">
                      <td colSpan={4} className="py-3 px-4 text-slate-500 text-xs">
                        Toplam {kalemler.length} Kalem
                      </td>
                      <td
                        colSpan={2}
                        className="py-3 px-4 text-right text-xs text-slate-600 dark:text-slate-300"
                      >
                        Ara Toplam (KDV Hariç):
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs text-slate-850 dark:text-slate-100">
                        {formatCurrency(totals.araToplam)}
                      </td>
                    </tr>
                    <tr className="bg-slate-50/80 dark:bg-slate-950/60 font-bold">
                      <td colSpan={4} />
                      <td
                        colSpan={2}
                        className="py-2 px-4 text-right text-xs text-slate-600 dark:text-slate-300"
                      >
                        Hesaplanan Toplam KDV:
                      </td>
                      <td className="py-2 px-4 text-right font-mono text-xs text-slate-850 dark:text-slate-100">
                        {formatCurrency(totals.kdv)}
                      </td>
                    </tr>
                    <tr className="bg-blue-50/50 dark:bg-blue-950/30 font-black text-sm border-t border-blue-200/50 dark:border-blue-900/40">
                      <td colSpan={4} />
                      <td
                        colSpan={2}
                        className="py-3 px-4 text-right text-blue-900 dark:text-blue-200"
                      >
                        Genel Toplam (KDV Dahil):
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-blue-700 dark:text-cyan-400">
                        {formatCurrency(totals.genelToplam)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* Notes if any */}
          {rapor.notlar && (
            <div className="bg-amber-50/60 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200/70 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                Rapor Notları ve Ek Açıklamalar:
              </span>
              <p className="leading-relaxed pl-5 whitespace-pre-line">{rapor.notlar}</p>
            </div>
          )}
        </>
      )}

      {/* TAB 2: Lüzum Müzekkeresi Standart Form Önizleme via DocumentPreviewModalV3 */}
      {activeTab === 'luzum_muzekkeresi' && (
        <div className="relative w-full h-[85vh] min-h-[750px] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xs bg-slate-100 dark:bg-slate-950">
          <DocumentPreviewModalV3
            isOpen={true}
            isModal={false}
            source={{ kind: 'ihtiyacRaporu', raporId }}
            initialTemplateId="luzum_muzekkeresi"
            onClose={() => setActiveTab('detay')}
          />
        </div>
      )}

      {/* TAB 3: Lüzum Müzekkeresi Onay Eki Önizleme via DocumentPreviewModalV3 */}
      {activeTab === 'luzum_onay_eki' && (
        <div className="relative w-full h-[85vh] min-h-[750px] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xs bg-slate-100 dark:bg-slate-950">
          <DocumentPreviewModalV3
            isOpen={true}
            isModal={false}
            source={{ kind: 'ihtiyacRaporu', raporId }}
            initialTemplateId="luzum_onay_eki"
            onClose={() => setActiveTab('detay')}
          />
        </div>
      )}

      {/* Bottom Sticky Action Bar (Tüm sekmelerin dışında, sayfa altında) */}
      <div className="sticky bottom-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-lg flex items-center justify-between gap-4 mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>İhtiyaç Raporları Listesine Dön</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onDuplicate(rapor.id)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Copy size={13} />
            <span>Kopyala &amp; Yeni Rapor</span>
          </button>

          <button
            onClick={() => onEdit(rapor.id)}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/25 flex items-center gap-1.5 cursor-pointer"
          >
            <Edit size={14} />
            <span>Raporu Düzenle</span>
          </button>
        </div>
      </div>
    </div>
  )
}
