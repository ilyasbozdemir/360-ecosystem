import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ModuleStoreState {
  installedIds: string[]
  isInstalled: (id: string) => boolean
  installModule: (id: string) => void
  uninstallModule: (id: string) => void
  toggleInstall: (id: string) => void
}

export const useModuleStore = create<ModuleStoreState>()(
  persist(
    (set, get) => ({
      installedIds: ['kik-dogrudan-temin-22d'],
      isInstalled: (id: string) => get().installedIds.includes(id),
      installModule: (id: string) =>
        set((state) => ({
          installedIds: state.installedIds.includes(id)
            ? state.installedIds
            : [...state.installedIds, id]
        })),
      uninstallModule: (id: string) =>
        set((state) => ({
          installedIds: state.installedIds.filter((item) => item !== id)
        })),
      toggleInstall: (id: string) => {
        const { installedIds } = get()
        if (installedIds.includes(id)) {
          set({ installedIds: installedIds.filter((item) => item !== id) })
        } else {
          set({ installedIds: [...installedIds, id] })
        }
      }
    }),
    {
      name: 'temin360_installed_modules_v3'
    }
  )
)
