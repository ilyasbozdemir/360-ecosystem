import React from 'react'
import { AppCategory, AppInstallState } from '@worksuite-360/contracts'

interface CategoryNavProps {
  selectedCategory: AppCategory | 'all'
  onSelectCategory: (cat: AppCategory | 'all') => void
  selectedState: AppInstallState | 'all'
  onSelectState: (state: AppInstallState | 'all') => void
  totalCount: number
  installedCount: number
  plannedCount: number
}

const CATEGORIES: { id: AppCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Tüm Uygulamalar' },
  { id: 'procurement', label: 'Kamu Alımları & İhale' },
  { id: 'file-management', label: 'Dosya & Veri Yönetimi' },
  { id: 'workflow', label: 'Süreç & Görev' },
  { id: 'gis', label: 'Harita & Taşınmaz' },
  { id: 'hr', label: 'Personel' },
  { id: 'document', label: 'Belge & EBYS' },
  { id: 'archive', label: 'Arşiv' },
  { id: 'system', label: 'Sistem' }
]

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedState,
  onSelectState,
  totalCount,
  installedCount,
  plannedCount
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* State Filter Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectState('all')}
            style={{
              backgroundColor:
                selectedState === 'all' ? 'var(--theme-primary)' : 'var(--theme-bg-200)',
              color: selectedState === 'all' ? '#ffffff' : 'var(--theme-text-100)',
              borderColor: 'var(--theme-border-100)'
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shadow-sm"
          >
            Tümü ({totalCount})
          </button>
          <button
            onClick={() => onSelectState('installed')}
            style={{
              backgroundColor:
                selectedState === 'installed'
                  ? 'var(--theme-badge-installed-bg)'
                  : 'var(--theme-bg-200)',
              color:
                selectedState === 'installed'
                  ? 'var(--theme-badge-installed-text)'
                  : 'var(--theme-text-100)',
              borderColor:
                selectedState === 'installed'
                  ? 'var(--theme-badge-installed-border)'
                  : 'var(--theme-border-100)'
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Yüklü / Hazır ({installedCount})
          </button>
          <button
            onClick={() => onSelectState('planned')}
            style={{
              backgroundColor:
                selectedState === 'planned'
                  ? 'var(--theme-badge-planned-bg)'
                  : 'var(--theme-bg-200)',
              color:
                selectedState === 'planned'
                  ? 'var(--theme-badge-planned-text)'
                  : 'var(--theme-text-100)',
              borderColor:
                selectedState === 'planned'
                  ? 'var(--theme-badge-planned-border)'
                  : 'var(--theme-border-100)'
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            Geliştirilmekte / Planlanan ({plannedCount})
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              style={{
                backgroundColor: isActive ? 'var(--theme-bg-300)' : 'transparent',
                color: isActive ? 'var(--theme-text-100)' : 'var(--theme-text-200)',
                borderColor: isActive ? 'var(--theme-primary)' : 'var(--theme-border-100)'
              }}
              className="px-3 py-1 rounded-full text-xs whitespace-nowrap border transition-all font-medium hover:border-sky-500"
            >
              {cat.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
