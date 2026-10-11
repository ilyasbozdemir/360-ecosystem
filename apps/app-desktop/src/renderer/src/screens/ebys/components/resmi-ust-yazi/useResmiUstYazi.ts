import { useState, useRef, useMemo } from 'react'
import { BASE_DATA, PRESETS } from './constants'
import { RotaAdimi } from './types'

export function useResmiUstYazi() {
  const [templateKey, setTemplateKey] = useState<'arastirma' | 'bos'>('arastirma')
  const [activeRightTab, setActiveRightTab] = useState<'onizleme' | 'rota'>('onizleme')

  // Form states
  const [antet, setAntet] = useState(BASE_DATA.antet)
  const [solLogo, setSolLogo] = useState<string>('')
  const [sagLogo, setSagLogo] = useState<string>('')
  const [detsis, setDetsis] = useState(BASE_DATA.detsis)
  const [yil, setYil] = useState(BASE_DATA.yil)
  const [sayisi, setSayisi] = useState(BASE_DATA.sayisi)
  const [konu, setKonu] = useState(PRESETS.arastirma.konu)
  const [tarih, setTarih] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  })
  const [dagitimli, setDagitimli] = useState(false)
  const [muhatap, setMuhatap] = useState(PRESETS.arastirma.muhatap)
  const [ilgi, setIlgi] = useState(PRESETS.arastirma.ilgi)
  const [aciklama, setAciklama] = useState(PRESETS.arastirma.aciklama)
  const [imzalar, setImzalar] = useState(PRESETS.arastirma.imzalar)
  const [eimza, setEimza] = useState(PRESETS.arastirma.eimza)
  const [kod, setKod] = useState('A1B2C3D4-E5F6-7890')
  const [kalemler, setKalemler] = useState(PRESETS.arastirma.kalemler)
  const [fiyat, setFiyat] = useState(PRESETS.arastirma.fiyat)
  const [firma, setFirma] = useState(PRESETS.arastirma.firma)
  const [ek, setEk] = useState(PRESETS.arastirma.ek)
  const [gereg, setGereg] = useState(PRESETS.arastirma.gereg)
  const [bilgi, setBilgi] = useState(PRESETS.arastirma.bilgi)
  const [kurumici, setKurumici] = useState(PRESETS.arastirma.kurumici)
  const [adres, setAdres] = useState(BASE_DATA.adres)
  const [web, setWeb] = useState(BASE_DATA.web)
  const [eposta, setEposta] = useState(BASE_DATA.eposta)
  const [kep, setKep] = useState(BASE_DATA.kep)
  const [hazad, setHazad] = useState(BASE_DATA.hazad)
  const [hazun, setHazun] = useState(BASE_DATA.hazun)
  const [haztel, setHaztel] = useState(BASE_DATA.haztel)

  const [copyToast, setCopyToast] = useState(false)

  // Rota state
  const [rota, setRota] = useState<RotaAdimi[]>([
    { t: 'Hazırlayan', a: 'Ayşe Demir', u: 'V.H.K.İ.' },
    { t: 'Paraf', a: '', u: 'Şube Müdürü' },
    { t: 'Paraf', a: '', u: 'Daire Başkan Yardımcısı' },
    { t: 'İmza', a: '', u: 'Daire Başkanı' }
  ])

  // Accordion active sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    antet: true,
    sayi: false,
    muhatap: true,
    imza: false,
    kalemler: false,
    ek: false,
    alt: false
  })

  const sheetRef = useRef<HTMLDivElement>(null)

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handlePresetChange = (key: 'arastirma' | 'bos') => {
    setTemplateKey(key)
    const p = PRESETS[key]
    setKonu(p.konu)
    setMuhatap(p.muhatap)
    setAciklama(p.aciklama)
    setImzalar(p.imzalar)
    setKalemler(p.kalemler)
    setFiyat(p.fiyat)
    setFirma(p.firma)
    setKurumici(p.kurumici)
    setIlgi(p.ilgi)
    setEk(p.ek)
    setGereg(p.gereg)
    setBilgi(p.bilgi)
    setEimza(p.eimza)
    setDagitimli(false)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'sol' | 'sag') => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (side === 'sol') setSolLogo(reader.result as string)
      else setSagLogo(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleCopyText = async () => {
    if (!sheetRef.current) return
    try {
      await navigator.clipboard.writeText(sheetRef.current.innerText)
      setCopyToast(true)
      setTimeout(() => setCopyToast(false), 2000)
    } catch {
      // ignore
    }
  }

  const antetLines = useMemo(() => antet.split('\n').map((l) => l.trim()).filter(Boolean), [antet])
  const ilgiLines = useMemo(() => ilgi.split('\n').map((l) => l.trim()).filter(Boolean), [ilgi])
  const aciklamaParagraphs = useMemo(
    () => aciklama.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    [aciklama]
  )
  const imzaList = useMemo(
    () =>
      imzalar
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((x) => {
          const parts = x.split('|').map((z) => z.trim())
          return { g: parts[0] || '', a: parts[1] || '', u: parts[2] || '' }
        }),
    [imzalar]
  )
  const kalemList = useMemo(
    () =>
      kalemler
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((x) => x.split('|').map((z) => z.trim())),
    [kalemler]
  )
  const ekLines = useMemo(() => ek.split('\n').map((l) => l.trim()).filter(Boolean), [ek])
  const geregLines = useMemo(() => gereg.split('\n').map((l) => l.trim()).filter(Boolean), [gereg])
  const bilgiLines = useMemo(() => bilgi.split('\n').map((l) => l.trim()).filter(Boolean), [bilgi])

  const formatTrDate = (isoDate: string) => {
    if (!isoDate) return ''
    const parts = isoDate.split('-')
    if (parts.length !== 3) return isoDate
    return `${parts[2]}.${parts[1]}.${parts[0]}`
  }

  const handleAddRotaStep = () => {
    setRota((prev) => {
      const copy = [...prev]
      copy.splice(Math.max(copy.length - 1, 0), 0, { t: 'Paraf', a: '', u: '' })
      return copy
    })
  }

  const handleDeleteRotaStep = (index: number) => {
    setRota((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleUpdateRotaStep = (index: number, field: keyof RotaAdimi, value: any) => {
    setRota((prev) =>
      prev.map((step, idx) => (idx === index ? { ...step, [field]: value } : step))
    )
  }

  return {
    templateKey,
    activeRightTab,
    setActiveRightTab,
    antet,
    setAntet,
    solLogo,
    sagLogo,
    detsis,
    setDetsis,
    yil,
    setYil,
    sayisi,
    setSayisi,
    konu,
    setKonu,
    tarih,
    setTarih,
    dagitimli,
    setDagitimli,
    muhatap,
    setMuhatap,
    ilgi,
    setIlgi,
    aciklama,
    setAciklama,
    imzalar,
    setImzalar,
    eimza,
    setEimza,
    kod,
    setKod,
    kalemler,
    setKalemler,
    fiyat,
    setFiyat,
    firma,
    setFirma,
    ek,
    setEk,
    gereg,
    setGereg,
    bilgi,
    setBilgi,
    kurumici,
    setKurumici,
    adres,
    setAdres,
    web,
    setWeb,
    eposta,
    setEposta,
    kep,
    setKep,
    hazad,
    setHazad,
    hazun,
    setHazun,
    haztel,
    setHaztel,
    copyToast,
    rota,
    openSections,
    sheetRef,
    toggleSection,
    handlePresetChange,
    handleLogoUpload,
    handlePrint,
    handleCopyText,
    handleAddRotaStep,
    handleDeleteRotaStep,
    handleUpdateRotaStep,
    antetLines,
    ilgiLines,
    aciklamaParagraphs,
    imzaList,
    kalemList,
    ekLines,
    geregLines,
    bilgiLines,
    formatTrDate
  }
}
