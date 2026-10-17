import React, { useState, useEffect, useMemo } from 'react'
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
  Info
} from 'lucide-react'
import { Modal } from '../ui/Modal'
import { useDosyalarHooks } from '../../screens/dosyalar/dosyalar.hooks'
import { useKikLimitDonemleri } from '../../screens/system/mevzuat/kik-limitleri.hooks'
import { useSettingsStore } from '../../store/settingsStore'
import { useWorkspaceStore } from '../../store/workspaceStore'
import { formatCurrency } from '../../utils/formatters'
import { logActivity } from '../../utils/logger'

export interface DosyaSihirbaziModalProps {
  isOpen: boolean
  onClose: () => void
  initialStage?: number
  onSuccess?: (createdDosyaId: number) => void
}

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

export function DosyaSihirbaziModal({
  isOpen,
  onClose,
  initialStage = 1,
  onSuccess
}: DosyaSihirbaziModalProps): React.JSX.Element {
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

  const [ihaleSekli, setIhaleSekli] = useState<string>('22/d*')
  const [yaklasikMaliyet, setYaklasikMaliyet] = useState<string>('')
  const [kdvOrani, setKdvOrani] = useState<number>(20)
  const [kdvDahilMi, setKdvDahilMi] = useState<boolean>(false)

  const [ihtiyacYeri, setIhtiyacYeri] = useState<string>('')
  const [teslimGun, setTeslimGun] = useState<number>(7)
  const [irtibatYetkilisiId, setIrtibatYetkilisiId] = useState<number | ''>('')
  const [onayPersonelId, setOnayPersonelId] = useState<number | ''>('')
  const [notlar, setNotlar] = useState<string>('')
  const [customAsama, setCustomAsama] = useState<number | null>(null)
  const secilenAsama = customAsama ?? initialStage

  // DB Data
  const [birimler, setBirimler] = useState<BirimOption[]>([])
  const [personeller, setPersoneller] = useState<PersonelOption[]>([])

  const { addDosya, dosyalar } = useDosyalarHooks()
  const { limitType } = useSettingsStore()
  const { donemler } = useKikLimitDonemleri()
  const { setActiveDosyaId } = useWorkspaceStore()

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

  const resetForm = (): void => {
    setCustomTeminNo('')
    setIsTeminNoManual(false)
    setCustomAsama(null)
    setStep(1)
    setKonu('')
    setYaklasikMaliyet('')
    setErrorMsg('')
  }

  const handleClose = (): void => {
    resetForm()
    onClose()
  }

  // Load Birim and Personel for dropdowns
  useEffect(() => {
    if (!isOpen) return
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
  }, [isOpen])

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
        if (onSuccess) onSuccess(newId)
      }

      handleClose()
    } catch (err: unknown) {
      console.error('Sihirbaz kayıt hatası:', err)
      const message = err instanceof Error ? err.message : 'Kayıt sırasında bir hata oluştu.'
      setErrorMsg(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepsHeader = [
    { num: 1, title: 'Temel Bilgiler' },
    { num: 2, title: 'Mevzuat & Limit' },
    { num: 3, title: 'İdari & Yetkililer' },
    { num: 4, title: 'Özet & Onay' }
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Doğrudan Temin Dosyası Oluşturma Sihirbazı"
      description="Yasal limit denetimli akıllı sihirbaz ile adım adım yeni doğrudan temin dosyası başlatın."
      className="max-w-3xl"
    >
      <div className="flex flex-col gap-5">
        {/* WIZARD STEPPER */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          {stepsHeader.map((s, idx) => {
            const isPassed = step > s.num
            const isCurrent = step === s.num
            return (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPassed
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/40'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isPassed ? <Check size={14} className="stroke-3" /> : s.num}
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      isCurrent
                        ? 'text-blue-600 dark:text-blue-400'
                        : isPassed
                          ? 'text-slate-700 dark:text-slate-300'
                          : 'text-slate-400 dark:text-slate-600'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {idx < stepsHeader.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded ${
                      step > idx + 1 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* ERROR NOTIFICATION BANNER */}
        {errorMsg && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: TEMEL BİLGİLER & ALIM TÜRÜ */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Alım Türü Seçiniz <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ALIM_TURLERI.map((tur) => {
                  const Icon = tur.icon
                  const isSelected = alimTuru === tur.id
                  return (
                    <button
                      key={tur.id}
                      type="button"
                      onClick={() => setAlimTuru(tur.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-blue-600' : ''}`} />
                      <span className="text-xs font-bold">{tur.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bütçe Yılı <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="number"
                    value={butceYili}
                    onChange={(e) => setButceYili(parseInt(e.target.value, 10) || currentYear)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Doğrudan Temin Dosya No <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={teminNo}
                  onChange={(e) => {
                    setIsTeminNoManual(true)
                    setCustomTeminNo(e.target.value)
                  }}
                  placeholder={nextNoSuggestion || 'Örn: 2026/1'}
                  className="w-full px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                İşin Adı / Temin Konusu <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={konu}
                onChange={(e) => setKonu(e.target.value)}
                placeholder="Örn: Hizmet Binaları İçin Kırtasiye ve Büro Malzemesi Alımı"
                rows={2}
                className="w-full px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Talep Eden / İlgili Birim
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <select
                  value={birimId}
                  onChange={(e) => setBirimId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
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
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  İhale / Alım Şekli
                </label>
                <select
                  value={ihaleSekli}
                  onChange={(e) => setIhaleSekli(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="22/d*">22/d* (Büyükşehir Doğrudan Temin)</option>
                  <option value="22/d**">22/d** (Diğer İdareler Doğrudan Temin)</option>
                  <option value="22/a">22/a (Tek Satıcı / İhtiyaç Sahibi)</option>
                  <option value="22/b">22/b (Özel Hak Sahipliği)</option>
                  <option value="22/c">22/c (Mevcut Mal/Hizmet Uyumu)</option>
                  <option value="22/e">22/e (Taşınmaz Mal Alımı/Kiralaması)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tahmini / Yaklaşık Maliyet (TL) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={yaklasikMaliyet}
                  onChange={(e) => setYaklasikMaliyet(e.target.value)}
                  placeholder="Örn: 150000"
                  className="w-full px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  KDV Oranı (%)
                </label>
                <select
                  value={kdvOrani}
                  onChange={(e) => setKdvOrani(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value={20}>%20 (Standart)</option>
                  <option value={10}>%10 (İndirimli)</option>
                  <option value={1}>%1 (Temel Gıda / Tarım)</option>
                  <option value={0}>%0 (KDV Muaf)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="kdvDahilMi"
                  checked={kdvDahilMi}
                  onChange={(e) => setKdvDahilMi(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
                <label
                  htmlFor="kdvDahilMi"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Girilen tutar KDV DAHİLDİR
                </label>
              </div>
            </div>

            {/* AKILLI KİK BÜTÇE LİMİT DENETİM KARTI (22/d için limit, diğer bentler için muafiyet bilgisi) */}
            {is22d ? (
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      KİK 22/d Bütçe Limit Kontrolü ({butceYili} Yılı - {ihaleSekli})
                    </span>
                  </div>
                  {activeLimit ? (
                    <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400">
                      Geçerli Yasal Sınır: {formatCurrency(activeLimit)}
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-600 font-semibold">
                      Limit tanımlı değil
                    </span>
                  )}
                </div>

                {parsedMaliyet > 0 && activeLimit && (
                  <>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        <span>KDV Hariç Tutar: {formatCurrency(netMaliyetHaric)}</span>
                        <span>Limit Kullanım Oranı: %{limitUsagePercent}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isLimitExceeded ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${limitUsagePercent}%` }}
                        />
                      </div>
                    </div>

                    {isLimitExceeded ? (
                      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-100/60 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                        <div>
                          <strong className="block font-bold">KİK 22/d Parasal Limiti Aşıldı!</strong>
                          KDV hariç yaklaşık maliyet ({formatCurrency(netMaliyetHaric)}), {ihaleSekli}{' '}
                          için tanımlı olan yasal {formatCurrency(activeLimit)} limitini aşmaktadır.{' '}
                          4734 sayılı Kanun uyarınca doğrudan temin yapılamaz; açık ihale veya 21/f
                          usulü uygulanmalıdır.
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs">
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
              <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-bold">
                    4734 Sayılı Kanun Madde {ihaleSekli} Özel Hükmü
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-700 dark:text-amber-300">
                  Seçilen <strong>{ihaleSekli}</strong> alım usulü parasal limite tabi değildir. Bu
                  bent kapsamında yapılacak teminlerde mevzuatta öngörülen gerekçe raporu, yetkili
                  makam onayı ve piyasa fiyat araştırması tutanağı düzenlenmelidir.
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: İDARİ BİLGİLER & YETKİLİLER */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  İhtiyaç / Teslimat Yeri
                </label>
                <input
                  type="text"
                  value={ihtiyacYeri}
                  onChange={(e) => setIhtiyacYeri(e.target.value)}
                  placeholder="Örn: Fen İşleri Şantiyesi / Ambar"
                  className="w-full px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Teslim Süresi (İş Günü)
                </label>
                <input
                  type="number"
                  value={teslimGun}
                  onChange={(e) => setTeslimGun(parseInt(e.target.value, 10) || 7)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  İrtibat / İş Takip Yetkilisi
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <select
                    value={irtibatYetkilisiId}
                    onChange={(e) =>
                      setIrtibatYetkilisiId(e.target.value ? Number(e.target.value) : '')
                    }
                    className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Onaylayan / Harcama Yetkilisi
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <select
                    value={onayPersonelId}
                    onChange={(e) => setOnayPersonelId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Açıklama / Süreç Notları
              </label>
              <textarea
                value={notlar}
                onChange={(e) => setNotlar(e.target.value)}
                placeholder="Dosya ile ilgili özel notlar veya gerekçeler..."
                rows={2}
                className="w-full px-3 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* STEP 4: ÖZET & ONAY */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                    {teminNo}
                  </span>
                  <h4 className="text-sm font-bold text-slate-850 dark:text-slate-100 mt-1">
                    {konu}
                  </h4>
                </div>
                <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 uppercase">
                  {alimTuru}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">İhale Şekli</span>
                  <strong className="text-slate-700 dark:text-slate-300">{ihaleSekli}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">KDV Hariç Tutar</span>
                  <strong className="text-slate-700 dark:text-slate-300 font-mono">
                    {formatCurrency(netMaliyetHaric)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Limit Uygunluğu</span>
                  {is22d ? (
                    isLimitExceeded ? (
                      <span className="text-rose-600 font-bold flex items-center gap-1">
                        <AlertTriangle size={12} /> Limit Aşımı
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} /> Yasal Limit Dahilinde
                      </span>
                    )
                  ) : (
                    <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Parasal Limitten Muaf
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Başlangıç Aşaması Seçiniz
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                {[
                  { id: 1, name: '1. Hazırlıkta', desc: 'İhtiyaç Tespiti' },
                  { id: 2, name: '2. Teklif Toplama', desc: 'Fiyat Araştırması' },
                  { id: 3, name: '3. Onayda', desc: 'Sipariş & Sözleşme' },
                  { id: 4, name: '4. Tamamlandı', desc: 'Kabul & Ödeme' }
                ].map((asama) => (
                  <button
                    key={asama.id}
                    type="button"
                    onClick={() => setCustomAsama(asama.id)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      secilenAsama === asama.id
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold block">{asama.name}</span>
                    <span className="text-[10px] text-slate-400">{asama.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 flex items-start gap-2 text-xs text-blue-700 dark:text-blue-300">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Dosya kaydedildiğinde varsayılan satın alma komisyonları otomatik tohumlanacak ve
                dosya doğrudan Takip Kanban panosunda ilgili sütunda görüntülenecektir.
              </span>
            </div>
          </div>
        )}

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                <ChevronLeft size={14} />
                Geri
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              Vazgeç
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer"
              >
                İleri
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
              >
                <Check size={14} />
                {isSubmitting ? 'Oluşturuluyor...' : 'Dosyayı Oluştur'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
