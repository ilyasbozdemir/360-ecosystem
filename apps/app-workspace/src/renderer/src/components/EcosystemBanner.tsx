import React from 'react'
import { ShieldCheck, Layers, FolderSync } from 'lucide-react'

export const EcosystemBanner: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: 'var(--theme-bg-200)',
        borderColor: 'var(--theme-border-100)'
      }}
      className="p-5 rounded-2xl border mb-6 shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Bağımsızlık ve Güvenlik */}
        <div className="flex items-start gap-3">
          <div
            style={{
              backgroundColor: 'var(--theme-badge-installed-bg)',
              color: 'var(--theme-badge-installed-text)'
            }}
            className="p-2.5 rounded-xl shrink-0"
          >
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: 'var(--theme-text-100)' }}>
              Temin 360 Koruma Altında
            </h4>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--theme-text-200)' }}>
              Mevcut .temin arşivleri, SQLite veritabanı, NSIS kurulum altyapısı ve release kanalı bağımsız ve güvendedir.
            </p>
          </div>
        </div>

        {/* Card 2: Birleşik Dosya 360 Yaklaşımı */}
        <div className="flex items-start gap-3">
          <div
            style={{
              backgroundColor: 'var(--theme-badge-planned-bg)',
              color: 'var(--theme-badge-planned-text)'
            }}
            className="p-2.5 rounded-xl shrink-0"
          >
            <FolderSync size={20} />
          </div>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: 'var(--theme-text-100)' }}>
              Birleşik Dosya 360
            </h4>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--theme-text-200)' }}>
              Hızlı Arama, Etiketler/Koleksiyonlar, Yinelenen Dosyalar ve Temizlik/Karantina tek bir güçlü masaüstü aracında birleşmektedir.
            </p>
          </div>
        </div>

        {/* Card 3: Modüler Mimari */}
        <div className="flex items-start gap-3">
          <div
            style={{
              backgroundColor: 'var(--theme-bg-300)',
              color: 'var(--theme-text-100)'
            }}
            className="p-2.5 rounded-xl shrink-0"
          >
            <Layers size={20} />
          </div>
          <div>
            <h4 className="text-sm font-semibold" style={{ color: 'var(--theme-text-100)' }}>
              Doğrulanabilir Manifestolar
            </h4>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--theme-text-200)' }}>
              Tüm ürünler sürümlü, benzersiz appId ve şema denetimine sahip yerel manifestolar üzerinden doğrulanır.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
