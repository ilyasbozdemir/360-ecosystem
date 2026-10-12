import { useState, useMemo, useCallback } from 'react'
import type { ModulPaketi, ModulKategoriFiltresi } from '../modulMagazasi.types'
import { RESMI_MODUL_PAKETLERI } from '../data/moduller.data'
import { useModuleStore } from '@renderer/store/moduleStore'

export function useModulMagazasiLogic() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeKategori, setActiveKategori] = useState<ModulKategoriFiltresi>('tum')
  const [activeDetailModul, setActiveDetailModul] = useState<ModulPaketi | null>(null)

  // Global store
  const { installedIds, isInstalled, installModule, uninstallModule } = useModuleStore()

  // Kurulum animasyonu durumu
  const [installingId, setInstallingId] = useState<string | null>(null)

  // Kaldırma onay modalı adayı
  const [uninstallCandidate, setUninstallCandidate] = useState<ModulPaketi | null>(null)

  const handleStartInstall = useCallback(
    (id: string) => {
      setInstallingId(id)
      setTimeout(() => {
        installModule(id)
        setInstallingId(null)
      }, 1200)
    },
    [installModule]
  )

  const handlePromptUninstall = useCallback((modul: ModulPaketi) => {
    setUninstallCandidate(modul)
  }, [])

  const handleConfirmUninstall = useCallback(() => {
    if (uninstallCandidate) {
      uninstallModule(uninstallCandidate.id)
      setUninstallCandidate(null)
    }
  }, [uninstallCandidate, uninstallModule])

  const handleCloseUninstallModal = useCallback(() => {
    setUninstallCandidate(null)
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
    const installedCount = RESMI_MODUL_PAKETLERI.filter((m) => installedIds.includes(m.id)).length
    return {
      total: RESMI_MODUL_PAKETLERI.length,
      installed: installedCount,
      available: RESMI_MODUL_PAKETLERI.length - installedCount,
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
    installingId,
    handleStartInstall,
    uninstallCandidate,
    handlePromptUninstall,
    handleConfirmUninstall,
    handleCloseUninstallModal,
    filteredModuller,
    stats
  }
}
