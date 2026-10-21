import React, { useState, useMemo, useEffect } from 'react'
import {
  DEFAULT_ECOSYSTEM_MANIFESTS,
  AppCategory,
  AppInstallState,
  AppManifest,
  filterCatalog
} from '@worksuite-360/contracts'
import { Header } from './components/Header.js'
import { EcosystemBanner } from './components/EcosystemBanner.js'
import { CategoryNav } from './components/CategoryNav.js'
import { AppCard } from './components/AppCard.js'
import { ManifestModal } from './components/ManifestModal.js'
import { SearchX, CheckCircle, AlertCircle } from 'lucide-react'

export const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | 'all'>('all')
  const [selectedState, setSelectedState] = useState<AppInstallState | 'all'>('all')
  const [inspectedManifest, setInspectedManifest] = useState<AppManifest | null>(null)
  const [isDark, setIsDark] = useState(false)
  const [launchNotification, setLaunchNotification] = useState<{
    message: string
    isError: boolean
  } | null>(null)
  const [realDetections, setRealDetections] = useState<
    Record<string, { installed: boolean; isDevSource?: boolean; path?: string; details?: string }>
  >({})

  useEffect(() => {
    if (window.workspaceAPI?.checkAppInstalled) {
      Promise.all(
        DEFAULT_ECOSYSTEM_MANIFESTS.map(async (m) => {
          try {
            const res = await window.workspaceAPI!.checkAppInstalled(m.appId)
            return [m.appId, res] as const
          } catch {
            return [m.appId, { installed: false }] as const
          }
        })
      ).then((results) => {
        const map: Record<string, { installed: boolean; isDevSource?: boolean; path?: string; details?: string }> = {}
        for (const [id, res] of results) {
          map[id] = res
        }
        setRealDetections(map)
      })
    }
  }, [])

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev
      if (next) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return next
    })
  }

  // Real detection'lar ile dinamik olarak güncellenmiş efektif manifest listesi
  const effectiveManifests = useMemo(() => {
    return DEFAULT_ECOSYSTEM_MANIFESTS.map((manifest) => {
      const real = realDetections[manifest.appId]
      if (real) {
        let state: AppInstallState = manifest.installState
        if (real.installed) {
          state = 'installed'
        } else if (manifest.installState === 'installed') {
          // Statik manifestte 'installed' olsa dahi sistemde bulunamadıysa 'not_installed' olarak işaretle
          state = 'not_installed'
        }
        return {
          ...manifest,
          installState: state
        }
      }
      return manifest
    })
  }, [realDetections])

  // Filter apps
  const filteredApps = useMemo(() => {
    return filterCatalog(effectiveManifests, {
      category: selectedCategory,
      installState: selectedState,
      search: searchQuery
    })
  }, [effectiveManifests, selectedCategory, selectedState, searchQuery])

  // Counts
  const totalCount = effectiveManifests.length
  const installedCount = useMemo(
    () => effectiveManifests.filter((a) => a.installState === 'installed').length,
    [effectiveManifests]
  )
  const plannedCount = useMemo(
    () => effectiveManifests.filter((a) => a.installState === 'planned').length,
    [effectiveManifests]
  )

  const handleLaunch = async (manifest: AppManifest) => {
    if (window.workspaceAPI?.launchApp) {
      try {
        const res = await window.workspaceAPI.launchApp(manifest.appId)
        setLaunchNotification({
          message:
            res.message ||
            (res.success ? `${manifest.name} başlatıldı.` : `${manifest.name} başlatılamadı.`),
          isError: !res.success
        })
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        setLaunchNotification({
          message: `${manifest.name} başlatılamadı: ${msg}`,
          isError: true
        })
      }
    } else {
      setLaunchNotification({
        message: `${manifest.name} başlatılıyor (${manifest.executableName})...`,
        isError: false
      })
    }
    setTimeout(() => {
      setLaunchNotification(null)
    }, 4000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        <EcosystemBanner />

        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedState={selectedState}
          onSelectState={setSelectedState}
          totalCount={totalCount}
          installedCount={installedCount}
          plannedCount={plannedCount}
        />

        {/* Launch Notification Toast */}
        {launchNotification && (
          <div
            style={
              launchNotification.isError
                ? {
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    color: '#ef4444'
                  }
                : {
                    backgroundColor: 'var(--theme-badge-installed-bg)',
                    borderColor: 'var(--theme-badge-installed-border)',
                    color: 'var(--theme-badge-installed-text)'
                  }
            }
            className="mb-6 p-4 rounded-xl border flex items-center gap-2 text-sm font-semibold shadow-md animate-in slide-in-from-top-2 duration-200"
          >
            {launchNotification.isError ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
            <span>{launchNotification.message}</span>
          </div>
        )}

        {/* Catalog Grid */}
        {filteredApps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredApps.map((manifest) => (
              <AppCard
                key={manifest.id}
                manifest={manifest}
                realStatus={realDetections[manifest.appId]}
                onInspect={setInspectedManifest}
                onLaunch={handleLaunch}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: 'var(--theme-bg-200)',
              borderColor: 'var(--theme-border-100)'
            }}
            className="p-12 text-center rounded-2xl border"
          >
            <SearchX
              size={48}
              className="mx-auto mb-3 opacity-40"
              style={{ color: 'var(--theme-text-200)' }}
            />
            <h3 className="text-base font-semibold" style={{ color: 'var(--theme-text-100)' }}>
              Kriterlere Uygun Uygulama Bulunamadı
            </h3>
            <p className="text-xs mt-1" style={{ color: 'var(--theme-text-200)' }}>
              Arama filtrenizi temizleyerek tüm ekosistem uygulamalarını görüntüleyebilirsiniz.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setSelectedState('all')
              }}
              style={{
                backgroundColor: 'var(--theme-primary)',
                color: '#ffffff'
              }}
              className="mt-4 px-4 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        )}
      </main>

      {/* Manifest Inspection Modal */}
      <ManifestModal
        manifest={inspectedManifest}
        onClose={() => setInspectedManifest(null)}
      />
    </div>
  )
}

export default App
