import { useState, useMemo, useCallback, useEffect } from 'react'
import type { ModulPaketi, ModulKategoriFiltresi } from '../modulMagazasi.types'
import { RESMI_MODUL_PAKETLERI } from '../data/moduller.data'

const STORAGE_KEY = 'temin360_installed_modules'
const DEFAULT_INSTALLED = ['kik-dogrudan-temin-22d']

export function useModulMagazasiLogic() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeKategori, setActiveKategori] = useState<ModulKategoriFiltresi>('tum')
  const [activeDetailModul, setActiveDetailModul] = useState<ModulPaketi | null>(null)
  const [installedIds, setInstalledIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // ignore
    }
    return DEFAULT_INSTALLED
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(installedIds))
    } catch {
      // ignore
    }
  }, [installedIds])

  const isInstalled = useCallback(
    (id: string) => installedIds.includes(id),
    [installedIds]
  )

  const toggleInstall = useCallback((id: string) => {
    setInstalledIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }, [])

  const filteredModuller = useMemo(() => {
    return RESMI_MODUL_PAKETLERI.filter((modul) => {
      // Kategori filtresi
      if (activeKategori === 'kurulu') {
        if (!installedIds.includes(modul.id)) return false
      } else if (activeKategori !== 'tum') {
        if (modul.kategori !== activeKategori) return false
      }

      // Arama filtresi
      if (!searchQuery.trim()) return true
      const query = searchQuery.toLowerCase()
      const inBaslik = modul.baslik.toLowerCase().includes(query)
      const inKod = modul.kod.toLowerCase().includes(query)
      const inMevzuat = modul.mevzuat.toLowerCase().includes(query)
      const inAciklama = modul.kisaAciklama.toLowerCase().includes(query)
      const inEtiket = modul.etiketler.some((e) => e.toLowerCase().includes(query))
      const inBelge = modul.belgeler.some((b) => b.ad.toLowerCase().includes(query))

      return inBaslik || inKod || inMevzuat || inAciklama || inEtiket || inBelge
    })
  }, [activeKategori, searchQuery, installedIds])

  const stats = useMemo(() => {
    return {
      total: RESMI_MODUL_PAKETLERI.length,
      installed: RESMI_MODUL_PAKETLERI.filter((m) => installedIds.includes(m.id)).length,
      available: RESMI_MODUL_PAKETLERI.length - RESMI_MODUL_PAKETLERI.filter((m) => installedIds.includes(m.id)).length,
      totalTemplates: RESMI_MODUL_PAKETLERI.reduce((sum, m) => sum + m.belgeler.length, 0)
    }
  }, [installedIds])

  return {
    searchQuery,
    setSearchQuery,
    activeKategori,
    setActiveKategori,
    activeDetailModul,
    setActiveDetailModul,
    installedIds,
    isInstalled,
    toggleInstall,
    filteredModuller,
    stats
  }
}
