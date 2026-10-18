import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import {
  Sparkles,
  Package,
  Wrench,
  Hammer,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Building,
  Check,
  UserCheck,
  Info,
  ArrowLeft,
  ShieldCheck,
  Layers,
  FileSpreadsheet
} from 'lucide-react'
import { useDosyalarHooks } from './dosyalar.hooks'
import { useKikLimitDonemleri } from '../system/mevzuat/kik-limitleri.hooks'
import { useSettingsStore } from '../../store/settingsStore'
import { useWorkspaceStore } from '../../store/workspaceStore'
import { formatCurrency } from '../../utils/formatters'
import { logActivity } from '../../utils/logger'
import { APP_ROUTES } from '../../constants/routeConstants'

export type AlimTuru = 'mal' | 'hizmet' | 'yapim_isi' | 'danismanlik'

interface BirimOption {
  id: number
  birim_adi: string
}

interface PersonelOption {
  id: number
  ad_soyad: string
  unvan?: string
}

const ALIM_TURLERI: { id: AlimTuru; label: string; icon: React.ElementType; desc: string }[] = [
  {
    id: 'mal',
    label: 'Mal Alımı',
    icon: Package,
    desc: 'Tüketim malzemesi, demirbaş, teçhizat ve donanım alımları'
  },
  {
    id: 'hizmet',
    label: 'Hizmet Alımı',
    icon: Wrench,
    desc: 'Bakım-onarım, yazılım, temizlik, güvenlik ve genel hizmetler'
  },
  {
    id: 'yapim_isi',
    label: 'Yapım İşi',
    icon: Hammer,
    desc: 'Bina, tesis, tadilat, altyapı ve çevre düzenleme işleri'
  },
  {
    id: 'danismanlik',
    label: 'Danışmanlık',
    icon: FileText,
    desc: 'Müşavirlik, proje hazırlama, teknik kontrol ve etütler'
  }
]

export interface DosyaSihirbaziScreenProps {
  initialStage?: number
  onSuccess?: (createdDosyaId: number) => void
  onClose?: () => void
}

export function DosyaSihirbaziScreen({
  initialStage,
  onSuccess,
  onClose
}: DosyaSihirbaziScreenProps = {}): React.JSX.Element {
  const navigate = useNavigate()
  const search: { stage?: string | number; initialStage?: string | number } = useSearch({
    strict: false
  })

  // URL query or props stage fallback
  const resolvedInitialStage = useMemo(() => {
    if (typeof initialStage === 'number') return initialStage
    const fromSearch = search?.initialStage ?? search?.stage
    if (fromSearch) {
      const parsed = parseInt(String(fromSearch), 10)
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 4) return parsed
    }
    return 1
  }, [initialStage, search])

  const currentYear = new Date().getFullYear()
  const [step, setStep] = useState<number>(1)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')

  // Form Fields
  const [butceYili, setButceYili] = useState<number>(currentYear)
  const [customTeminNo, setCustomTeminNo] = useState<string>('')
  const [isTeminNoManual, setIsTeminNoManual] = useState<boolean>(false)
  const [alimTuru, setAlimTuru] = useState<AlimTuru>('mal')
  const [konu, setKonu] = useState<string>('')
  const [birimId, setBirimId] = useState<number | ''>('')

  const { addDosya, dosyalar } = useDosyalarHooks()
  const { limitType } = useSettingsStore()
  const { donemler } = useKikLimitDonemleri()
  const { setActiveDosyaId } = useWorkspaceStore()

  const defaultIhaleSekli = limitType === 'buyuksehir' ? '22/d*' : '22/d**'
  const [customIhaleSekli, setCustomIhaleSekli] = useState<string | null>(null)
  const ihaleSekli = customIhaleSekli ?? defaultIhaleSekli

  const [yaklasikMaliyet, setYaklasikMaliyet] = useState<string>('')
  const [kdvOrani, setKdvOrani] = useState<number>(20)
  const [kdvDahilMi, setKdvDahilMi] = useState<boolean>(false)

  const [ihtiyacYeri, setIhtiyacYeri] = useState<string>('')
  const [teslimGun, setTeslimGun] = useState<number>(7)
  const [irtibatYetkilisiId, setIrtibatYetkilisiId] = useState<number | ''>('')
  const [onayPersonelId, setOnayPersonelId] = useState<number | ''>('')
  const [notlar, setNotlar] = useState<string>('')
  const [customAsama, setCustomAsama] = useState<number | null>(null)
  const secilenAsama = customAsama ?? resolvedInitialStage

  // DB Data
  const [birimler, setBirimler] = useState<BirimOption[]>([])
  const [personeller, setPersoneller] = useState<PersonelOption[]>([])

  // Calculate Next Temin No automatically
  const nextNoSuggestion = useMemo(() => {
    const yearPrefix = `${butceYili}/`
    const yearDosyalar = dosyalar.filter((d) => {
      const dYear =
        d.butce_yili || (d.dosya_acilis_tarihi ? new Date(d.dosya_acilis_tarihi).getFullYear() : 0)
      return dYear === butceYili
    })

    let maxNum = 0
    yearDosyalar.forEach((d) => {
      if (d.temin_no) {
        const clean = d.temin_no.replace(yearPrefix, '').replace('DT-', '').trim()
        const parsed = parseInt(clean, 10)
        if (!isNaN(parsed) && parsed > maxNum) {
          maxNum = parsed
        }
      }
    })
    return `${butceYili}/${maxNum + 1}`
  }, [butceYili, dosyalar])

  const teminNo = isTeminNoManual ? customTeminNo : nextNoSuggestion

  // Load Birim and Personel for dropdowns
  useEffect(() => {
    let isMounted = true
    async function loadOptions(): Promise<void> {
      try {
        if (window.electron?.ipcRenderer) {
          const resBirim = await window.electron.ipcRenderer.invoke(
            'db:query',
            'SELECT id, birim_adi FROM TANIM_Birim WHERE aktif_mi = 1 ORDER BY birim_adi ASC'
          )
          if (isMounted && resBirim?.success) setBirimler(resBirim.data || [])

          const resPers = await window.electron.ipcRenderer.invoke(
            'db:query',
            'SELECT id, ad_soyad, unvan FROM TANIM_Personel WHERE aktif_mi = 1 ORDER BY ad_soyad ASC'
          )
          if (isMounted && resPers?.success) setPersoneller(resPers.data || [])
        }
      } catch (err: unknown) {
        console.warn('Sihirbaz veri yükleme uyarısı:', err)
      }
    }
    void loadOptions()
    return () => {
      isMounted = false
    }
  }, [])

  // KİK 22/d Check & Statutory Limit Calculation
  const is22d = useMemo(() => {
    return ihaleSekli.startsWith('22/d')
  }, [ihaleSekli])

  const activeLimit = useMemo(() => {
    if (!is22d || !donemler || donemler.length === 0) return null
    const yearStr = butceYili.toString()
    const donem = donemler.find((d) => d.donem_kodu.startsWith(yearStr)) || donemler[0]
    if (!donem) return null

    if (ihaleSekli === '22/d*') {
      return donem.buyuksehir_limit
    } else if (ihaleSekli === '22/d**') {
      return donem.diger_limit
    } else {
      return limitType === 'buyuksehir' ? donem.buyuksehir_limit : donem.diger_limit
    }
  }, [is22d, ihaleSekli, donemler, butceYili, limitType])

  const parsedMaliyet = useMemo(() => {
    const val = parseFloat(yaklasikMaliyet.replace(/\./g, '').replace(',', '.'))
    return isNaN(val) ? 0 : val
  }, [yaklasikMaliyet])

  // Calculate Net Excl. VAT (KİK limit applies strictly to Net Hariç Tutar)
  const netMaliyetHaric = useMemo(() => {
    if (!kdvDahilMi || kdvOrani <= 0) return parsedMaliyet
    return Number((parsedMaliyet / (1 + kdvOrani / 100)).toFixed(2))
  }, [parsedMaliyet, kdvDahilMi, kdvOrani])

  const isLimitExceeded = useMemo(() => {
    if (!is22d || !activeLimit || netMaliyetHaric <= 0) return false
    return netMaliyetHaric > activeLimit
  }, [is22d, activeLimit, netMaliyetHaric])

  const limitUsagePercent = useMemo(() => {
    if (!is22d || !activeLimit || activeLimit <= 0) return 0
    return Math.min(100, Number(((netMaliyetHaric / activeLimit) * 100).toFixed(1)))
  }, [is22d, activeLimit, netMaliyetHaric])

  // Step Validations
  const validateStep1 = (): boolean => {
    if (!konu.trim()) {
      setErrorMsg('Lütfen doğrudan temin konusunu (İşin Adı) giriniz.')
      return false
    }
    const currentNo = teminNo.trim() || nextNoSuggestion
    if (!currentNo) {
      setErrorMsg('Lütfen doğrudan temin dosya numarasını giriniz.')
      return false
    }
    setErrorMsg('')
    return true
  }

  const validateStep2 = (): boolean => {
    if (parsedMaliyet <= 0) {
      setErrorMsg('Lütfen geçerli bir tahmini / yaklaşık maliyet tutarı giriniz.')
      return false
    }
    if (is22d && isLimitExceeded && activeLimit) {
      setErrorMsg(
        `Seçilen ihale şekli (${ihaleSekli}) için yasal KİK 22/d parasal limiti (${formatCurrency(activeLimit)}) aşılamaz. Lütfen yaklaşık maliyeti düşürünüz veya uygun ihale / bent usulünü seçiniz.`
      )
      return false
    }
    setErrorMsg('')
    return true
  }

  const handleNext = (): void => {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setErrorMsg('')
    setStep((prev) => Math.min(4, prev + 1))
  }

  const handlePrev = (): void => {
    setErrorMsg('')
    setStep((prev) => Math.max(1, prev - 1))
  }

  const handleCancel = (): void => {
    if (onClose) {
      onClose()
      return
    }
    // Navigate back to dosyalar or previous screen
    if (window.history.length > 1) {
      window.history.back()
    } else {
      void navigate({ to: APP_ROUTES.DOSYALAR })
    }
  }

  // Final Submit Handler
  const handleSubmit = async (): Promise<void> => {
    if (!validateStep1() || !validateStep2()) return

    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const selectedBirim = birimler.find((b) => b.id === Number(birimId))
      const finalTeminNo = teminNo.trim() || nextNoSuggestion

      const payload = {
        temin_no: finalTeminNo,
        konu: konu.trim(),
        tur: alimTuru,
        butce_yili: butceYili,
        dosya_acilis_tarihi: new Date().toISOString().split('T')[0],
        birim_id: birimId ? Number(birimId) : null,
        birim: selectedBirim?.birim_adi || null,
        ihale_sekli: ihaleSekli,
        ihale_tipi: 'Doğrudan Temin',
        yaklasik_maliyet: netMaliyetHaric,
        yaklasik_maliyet_kdv_dahil_mi: 0,
        kdv: String(kdvOrani),
        ihtiyac_yeri: ihtiyacYeri.trim() || null,
        teslim_gun: teslimGun,
        irtibat_yetkilisi_id: irtibatYetkilisiId ? Number(irtibatYetkilisiId) : null,
        onay_personel_id: onayPersonelId ? Number(onayPersonelId) : null,
        notlar: notlar.trim() || null,
        durum_asama_id: secilenAsama,
        status: secilenAsama === 4 ? 'tamamlandi' : 'devam_ediyor',
        is_deleted: 0
      }

      const res = await addDosya(payload)
      const newId = (res as { lastInsertRowid?: number })?.lastInsertRowid

      await logActivity(
        'Dosya Sihirbazı ile Dosya Oluşturuldu',
        `${payload.temin_no} numaralı "${payload.konu}" dosyası sihirbazla ${secilenAsama}. aşamada kaydedildi.`,
        'success'
      )

      if (newId) {
        setActiveDosyaId(newId)
        if (onSuccess) {
          onSuccess(newId)
        }
      }

      if (onClose) {
        onClose()
        return
      }

      // Route to Takip screen (Kanban / Process view)
      void navigate({ to: APP_ROUTES.TAKIP })
    } catch (err: unknown) {
      console.error('Sihirbaz kayıt hatası:', err)
      const message = err instanceof Error ? err.message : 'Kayıt sırasında bir hata oluştu.'
      setErrorMsg(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepsHeader = [
    { num: 1, title: 'Temel Bilgiler', subtitle: 'Alım türü, bütçe yılı & konu' },
    { num: 2, title: 'Mevzuat & Limit', subtitle: 'KİK 22/d parasal sınır denetimi' },
    { num: 3, title: 'İdari & Yetkililer', subtitle: 'Teslimat yeri, süre ve yetkililer' },
    { num: 4, title: 'Özet & Onay', subtitle: 'Künye kontrolü ve başlangıç aşaması' }
  ]

  const selectedBirimObj = birimler.find((b) => b.id === Number(birimId))
  const selectedIrtibat = personeller.find((p) => p.id === Number(irtibatYetkilisiId))
  const selectedOnay = personeller.find((p) => p.id === Number(onayPersonelId))

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 p-4 md:p-8 animate-in fade-in duration-300">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* TOP NAVIGATION / HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
              title="Geri Dön"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  4734 Sayılı Kanun Kapsamı
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Adım {step} / 4
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                Doğrudan Temin Dosyası Oluşturma Sihirbazı
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              Vazgeç
            </button>
          </div>
        </div>

        {/* STEPPER WIDGET */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 md:p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stepsHeader.map((s) => {
              const isPassed = step > s.num
              const isCurrent = step === s.num
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    if (s.num < step) setStep(s.num)
                  }}
                  disabled={s.num > step}
                  className={`flex items-start gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-2 border-blue-600 dark:border-blue-500'
                      : isPassed
                        ? 'bg-slate-50 dark:bg-slate-800/40 border border-emerald-200 dark:border-emerald-800/60 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                        : 'bg-transparent border border-transparent opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-all ${
                      isPassed
                        ? 'bg-emerald-500 text-white shadow-xs shadow-emerald-500/20'
                        : isCurrent
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {isPassed ? <Check size={16} className="stroke-3" /> : s.num}
                  </div>
                  <div className="overflow-hidden">
                    <span
                      className={`text-xs font-bold block truncate ${
                        isCurrent
                          ? 'text-blue-700 dark:text-blue-400'
                          : isPassed
                            ? 'text-slate-800 dark:text-slate-200'
                            : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {s.title}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">
                      {s.subtitle}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ERROR NOTIFICATION BANNER */}
        {errorMsg && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs font-semibold shadow-xs">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="block font-bold">Lütfen formu kontrol ediniz:</strong>
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* MAIN CONTENT GRID (2 COLUMNS: FORM + SIDEBAR SUMMARY) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* LEFT 2 COLUMNS: FORM STEPS */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
              {/* STEP 1: TEMEL BİLGİLER & ALIM TÜRÜ */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Alım Türü Seçiniz <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[11px] text-slate-400">
                        Harcama ve onay süreçlerini belirler
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ALIM_TURLERI.map((tur) => {
                        const Icon = tur.icon
                        const isSelected = alimTuru === tur.id
                        return (
                          <button
                            key={tur.id}
                            type="button"
                            onClick={() => setAlimTuru(tur.id)}
                            className={`flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/50 text-blue-900 dark:text-blue-200 shadow-sm ring-1 ring-blue-500'
                                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div
                              className={`p-2.5 rounded-xl shrink-0 ${
                                isSelected
                                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                                  : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-xs font-bold block">{tur.label}</span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5 block">
                                {tur.desc}
                              </span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Bütçe Yılı <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                        <input
                          type="number"
                          value={butceYili}
                          onChange={(e) => setButceYili(parseInt(e.target.value, 10) || currentYear)}
                          className="w-full pl-10 pr-3.5 py-2.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Doğrudan Temin Dosya No <span className="text-rose-500">*</span>
                        </label>
                        {!isTeminNoManual && (
                          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                            Otomatik Sıradaki No
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={teminNo}
                        onChange={(e) => {
                          setIsTeminNoManual(true)
                          setCustomTeminNo(e.target.value)
                        }}
                        placeholder={nextNoSuggestion || 'Örn: 2026/1'}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      İşin Adı / Temin Konusu <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      value={konu}
                      onChange={(e) => setKonu(e.target.value)}
                      placeholder="Örn: Hizmet Binaları İçin Kırtasiye ve Büro Malzemesi Alımı"
                      rows={3}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Talep Eden / İlgili Birim
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <select
                        value={birimId}
                        onChange={(e) => setBirimId(e.target.value ? Number(e.target.value) : '')}
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      >
                        <option value="">Birim Seçiniz...</option>
                        {birimler.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.birim_adi}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: MEVZUAT & BÜTÇE LİMİT KONTROLÜ */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          İhale / Alım Şekli
                        </label>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          Kurum: {limitType === 'buyuksehir' ? 'Büyükşehir (22/d*)' : 'Diğer İdare (22/d**)'}
                        </span>
                      </div>
                      <select
                        value={ihaleSekli}
                        onChange={(e) => setCustomIhaleSekli(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      >
                        <option value="22/d**">22/d** (Diğer İdareler / İlçe-Belde Doğrudan Temin)</option>
                        <option value="22/d*">22/d* (Büyükşehir Belediyesi Doğrudan Temin)</option>
                        <option value="22/a">22/a (Tek Satıcı / İhtiyaç Sahibi)</option>
                        <option value="22/b">22/b (Özel Hak Sahipliği)</option>
                        <option value="22/c">22/c (Mevcut Mal/Hizmet Uyumu)</option>
                        <option value="22/e">22/e (Taşınmaz Mal Alımı/Kiralaması)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Tahmini / Yaklaşık Maliyet (TL) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={yaklasikMaliyet}
                        onChange={(e) => setYaklasikMaliyet(e.target.value)}
                        placeholder="Örn: 150000"
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        KDV Oranı (%)
                      </label>
                      <select
                        value={kdvOrani}
                        onChange={(e) => setKdvOrani(parseInt(e.target.value, 10))}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      >
                        <option value={20}>%20 (Genel Standart)</option>
                        <option value={10}>%10 (İndirimli Oran)</option>
                        <option value={1}>%1 (Temel Gıda / Tarım)</option>
                        <option value={0}>%0 (KDV Muafiyeti)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 pt-4">
                      <input
                        type="checkbox"
                        id="kdvDahilMiPage"
                        checked={kdvDahilMi}
                        onChange={(e) => setKdvDahilMi(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer"
                      />
                      <label
                        htmlFor="kdvDahilMiPage"
                        className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none"
                      >
                        Girilen yaklaşık maliyet tutarı KDV DAHİLDİR
                      </label>
                    </div>
                  </div>

                  {/* AKILLI KİK BÜTÇE LİMİT DENETİM KARTI */}
                  {is22d ? (
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <div>
                            <span className="text-xs font-black text-slate-900 dark:text-slate-100 block">
                              KİK 22/d Bütçe Limit Kontrolü ({butceYili} Yılı - {ihaleSekli})
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              4734 Sayılı Kanun Madde 22/d Yasal Parasal Sınır Doğrulaması
                            </span>
                          </div>
                        </div>
                        {activeLimit ? (
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block font-semibold">
                              Geçerli Yasal Tavan
                            </span>
                            <span className="text-xs font-mono font-black text-slate-800 dark:text-slate-200">
                              {formatCurrency(activeLimit)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-amber-600 font-semibold">
                            Limit tanımlı değil
                          </span>
                        )}
                      </div>

                      {parsedMaliyet > 0 && activeLimit && (
                        <>
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                              <span>Net KDV Hariç Tutar: {formatCurrency(netMaliyetHaric)}</span>
                              <span>Limit Kullanım Oranı: %{limitUsagePercent}</span>
                            </div>
                            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  isLimitExceeded ? 'bg-rose-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${limitUsagePercent}%` }}
                              />
                            </div>
                          </div>

                          {isLimitExceeded ? (
                            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-100/70 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-900 text-rose-900 dark:text-rose-100 text-xs">
                              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                              <div className="space-y-1">
                                <strong className="block font-bold">KİK 22/d Parasal Limiti Aşıldı!</strong>
                                <p className="leading-relaxed">
                                  KDV hariç yaklaşık maliyet ({formatCurrency(netMaliyetHaric)}), {ihaleSekli}{' '}
                                  için geçerli yasal {formatCurrency(activeLimit)} limitini aşmaktadır.{' '}
                                  4734 sayılı Kamu İhale Kanunu uyarınca doğrudan temin yöntemiyle
                                  alım yapılamaz; açık ihale veya 21/f pazarlık usulü uygulanmalıdır.
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs">
                              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                              <span>
                                Tutar yasal limit dahilindedir. Kalan limit marjı:{' '}
                                <strong>{formatCurrency(activeLimit - netMaliyetHaric)}</strong>
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2">
                      <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                        <Info className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
                        <span className="text-xs font-bold">
                          4734 Sayılı Kanun Madde {ihaleSekli} Özel Hükmü
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                        Seçilen <strong>{ihaleSekli}</strong> alım usulü parasal limite tabi değildir. Bu
                        bent kapsamında yapılacak teminlerde mevzuatta öngörülen gerekçe raporu,
                        yetkili makam onayı ve piyasa fiyat araştırması tutanağı düzenlenmelidir.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: İDARİ BİLGİLER & YETKİLİLER */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        İhtiyaç / Teslimat Yeri
                      </label>
                      <input
                        type="text"
                        value={ihtiyacYeri}
                        onChange={(e) => setIhtiyacYeri(e.target.value)}
                        placeholder="Örn: Fen İşleri Şantiyesi / Ambar"
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Teslim Süresi (İş Günü)
                      </label>
                      <input
                        type="number"
                        value={teslimGun}
                        onChange={(e) => setTeslimGun(parseInt(e.target.value, 10) || 7)}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        İrtibat / İş Takip Yetkilisi
                      </label>
                      <div className="relative">
                        <UserCheck className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                        <select
                          value={irtibatYetkilisiId}
                          onChange={(e) =>
                            setIrtibatYetkilisiId(e.target.value ? Number(e.target.value) : '')
                          }
                          className="w-full pl-10 pr-3.5 py-2.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        >
                          <option value="">Personel Seçiniz...</option>
                          {personeller.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.ad_soyad} {p.unvan ? `(${p.unvan})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Onaylayan / Harcama Yetkilisi
                      </label>
                      <div className="relative">
                        <UserCheck className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                        <select
                          value={onayPersonelId}
                          onChange={(e) => setOnayPersonelId(e.target.value ? Number(e.target.value) : '')}
                          className="w-full pl-10 pr-3.5 py-2.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        >
                          <option value="">Personel Seçiniz...</option>
                          {personeller.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.ad_soyad} {p.unvan ? `(${p.unvan})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Açıklama / Süreç Notları
                    </label>
                    <textarea
                      value={notlar}
                      onChange={(e) => setNotlar(e.target.value)}
                      placeholder="Dosya ile ilgili özel notlar, gerekçeler veya takip talimatları..."
                      rows={3}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: ÖZET & ONAY */}
              {step === 4 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                            {teminNo}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400">
                            Bütçe Yılı: {butceYili}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2">
                          {konu}
                        </h4>
                      </div>
                      <span className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                        {alimTuru}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700/60 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">İhale / Alım Şekli</span>
                        <strong className="text-slate-800 dark:text-slate-200">{ihaleSekli}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">KDV Hariç Maliyet</span>
                        <strong className="text-slate-800 dark:text-slate-200 font-mono text-sm">
                          {formatCurrency(netMaliyetHaric)}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Limit Durumu</span>
                        {is22d ? (
                          isLimitExceeded ? (
                            <span className="text-rose-600 font-bold flex items-center gap-1">
                              <AlertTriangle size={14} /> Limit Aşımı
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle2 size={14} /> Yasal Limit Dahilinde
                            </span>
                          )
                        ) : (
                          <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                            <CheckCircle2 size={14} /> Parasal Limitten Muaf
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">İlgili Birim</span>
                        <strong className="text-slate-800 dark:text-slate-200">
                          {selectedBirimObj?.birim_adi || 'Belirtilmedi'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Teslimat Yeri</span>
                        <strong className="text-slate-800 dark:text-slate-200">
                          {ihtiyacYeri || 'Belirtilmedi'} ({teslimGun} Gün)
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Yetkililer</span>
                        <strong className="text-slate-800 dark:text-slate-200">
                          {selectedIrtibat?.ad_soyad || 'İrtibat Yok'} / {selectedOnay?.ad_soyad || 'Onay Yok'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Dosyanın Başlatılacağı İş Akışı Aşaması
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      {[
                        { id: 1, name: '1. Hazırlıkta', desc: 'İhtiyaç Tespiti & Başlangıç' },
                        { id: 2, name: '2. Teklif Toplama', desc: 'Piyasa Fiyat Araştırması' },
                        { id: 3, name: '3. Onayda', desc: 'Sipariş & Sözleşme' },
                        { id: 4, name: '4. Tamamlandı', desc: 'Kabul & Harcama/Ödeme' }
                      ].map((asama) => (
                        <button
                          key={asama.id}
                          type="button"
                          onClick={() => setCustomAsama(asama.id)}
                          className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                            secilenAsama === asama.id
                              ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/50 text-blue-800 dark:text-blue-200 ring-1 ring-blue-500 shadow-xs'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          <span className="text-xs font-bold block">{asama.name}</span>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">{asama.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-start gap-3 text-xs text-blue-800 dark:text-blue-200">
                    <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-600" />
                    <p className="leading-relaxed">
                      Dosya kaydedildiğinde varsayılan satın alma komisyonları otomatik olarak tohumlanacak,
                      gerekli evrak şablonları atanacak ve dosya doğrudan <strong>Takip (Kanban)</strong> panosunda
                      seçilen aşama sütununda görüntülenecektir.
                    </p>
                  </div>
                </div>
              )}

              {/* FOOTER ACTIONS (NAVIGATION BETWEEN STEPS) */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <div>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
                    >
                      <ChevronLeft size={16} />
                      Önceki Adım
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    Vazgeç
                  </button>

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                    >
                      İleri
                      <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-7 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                    >
                      <Check size={16} className="stroke-3" />
                      {isSubmitting ? 'Oluşturuluyor...' : 'Dosyayı Oluştur'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 1 COLUMN: LIVE SIDEBAR SUMMARY & GUIDANCE */}
          <div className="space-y-6">
            {/* CANLI KÜNYE & ÖZET KARTI */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Canlı Dosya Künyesi
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                  {teminNo || '2026/1'}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-semibold">İşin Konusu</span>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 line-clamp-2">
                    {konu || 'Konu girilmedi...'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-semibold">Alım Türü</span>
                    <strong className="text-slate-700 dark:text-slate-300 uppercase text-[11px]">
                      {alimTuru}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-semibold">Usul</span>
                    <strong className="text-slate-700 dark:text-slate-300 text-[11px]">
                      {ihaleSekli}
                    </strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400 block text-[10px] font-semibold">
                    Net Maliyet (KDV Hariç)
                  </span>
                  <strong className="text-sm font-mono font-black text-slate-800 dark:text-slate-100">
                    {formatCurrency(netMaliyetHaric)}
                  </strong>
                </div>

                {selectedBirimObj && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-slate-400 block text-[10px] font-semibold">İlgili Birim</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                      {selectedBirimObj.birim_adi}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* MEVZUAT VE REHBERLİK KARTI */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold">Mevzuat Güvencesi</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Temin 360, 4734 Sayılı Kamu İhale Kanunu ve KİK ikincil mevzuatına göre limit
                aşımı denetimlerini anlık yürütür. Bütçe tavanı aşıldığında sistem sizi uyarır ve mevzuata
                uygun alternatif satın alma yöntemleri önerir.
              </p>
              <div className="flex items-center gap-2 pt-2 text-[10px] font-bold text-slate-400">
                <Layers size={13} />
                <span>Akıllı Satın Alma ve Dosya Takip Motoru</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DosyaSihirbaziScreen
