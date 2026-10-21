import { AppCategory, AppInstallState, AppManifest } from './schema.js'

export interface CatalogFilterOptions {
  category?: AppCategory | 'all'
  installState?: AppInstallState | 'all'
  search?: string
}

export function filterCatalog(
  manifests: AppManifest[],
  options: CatalogFilterOptions = {}
): AppManifest[] {
  const { category = 'all', installState = 'all', search = '' } = options
  const normalizedSearch = search.trim().toLowerCase()

  return manifests.filter((manifest) => {
    // Kategori Filtresi
    if (category !== 'all' && manifest.category !== category) {
      return false
    }

    // Kurulum Durumu Filtresi
    if (installState !== 'all' && manifest.installState !== installState) {
      return false
    }

    // Arama Kelimesi Filtresi
    if (normalizedSearch) {
      const matchName = manifest.name.toLowerCase().includes(normalizedSearch)
      const matchSummary = manifest.summary.toLowerCase().includes(normalizedSearch)
      const matchDesc = manifest.description.toLowerCase().includes(normalizedSearch)
      const matchModules = manifest.modules.some((m) =>
        m.toLowerCase().includes(normalizedSearch)
      )
      if (!matchName && !matchSummary && !matchDesc && !matchModules) {
        return false
      }
    }

    return true
  })
}

export function checkAppIdUniqueness(manifests: AppManifest[]): boolean {
  const ids = new Set<string>()
  const appIds = new Set<string>()
  const executableNames = new Set<string>()

  for (const m of manifests) {
    if (ids.has(m.id)) {
      throw new Error(`Duplicate manifest id found: ${m.id}`)
    }
    ids.add(m.id)

    if (appIds.has(m.appId)) {
      throw new Error(`Duplicate appId found: ${m.appId}`)
    }
    appIds.add(m.appId)

    if (executableNames.has(m.executableName.toLowerCase())) {
      throw new Error(`Duplicate executableName found: ${m.executableName}`)
    }
    executableNames.add(m.executableName.toLowerCase())
  }

  return true
}
