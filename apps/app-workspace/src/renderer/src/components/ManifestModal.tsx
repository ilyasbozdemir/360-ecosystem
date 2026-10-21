import React from 'react'
import { AppManifest } from '@worksuite-360/contracts'
import { X, CheckCircle2, ShieldAlert } from 'lucide-react'

interface ManifestModalProps {
  manifest: AppManifest | null
  onClose: () => void
}

export const ManifestModal: React.FC<ManifestModalProps> = ({ manifest, onClose }) => {
  if (!manifest) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        style={{
          backgroundColor: 'var(--theme-bg-100)',
          borderColor: 'var(--theme-border-100)'
        }}
        className="w-full max-w-2xl max-h-[85vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: 'var(--theme-bg-200)',
            borderBottom: '1px solid var(--theme-border-100)'
          }}
          className="p-4 flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold" style={{ color: 'var(--theme-text-100)' }}>
                {manifest.name} Manifestosu
              </h2>
              <span
                style={{
                  backgroundColor: 'var(--theme-bg-300)',
                  color: 'var(--theme-text-200)'
                }}
                className="text-[10px] px-2 py-0.5 rounded font-mono"
              >
                {manifest.id}.json
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--theme-text-200)' }}>
              WorkSuite 360 Doğrulanmış Yerel Uygulama Tanımı
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Kapat"
            style={{ color: 'var(--theme-text-200)' }}
            className="p-1 rounded-lg hover:bg-black/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 custom-scrollbar text-xs">
          {/* Status Alert */}
          {manifest.installState === 'installed' ? (
            <div
              style={{
                backgroundColor: 'var(--theme-badge-installed-bg)',
                borderColor: 'var(--theme-badge-installed-border)',
                color: 'var(--theme-badge-installed-text)'
              }}
              className="p-3 rounded-xl border flex items-center gap-2 font-medium"
            >
              <CheckCircle2 size={16} />
              <span>Bu uygulama sistemde kurulu ve başlatılmaya hazır.</span>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'var(--theme-badge-planned-bg)',
                borderColor: 'var(--theme-badge-planned-border)',
                color: 'var(--theme-badge-planned-text)'
              }}
              className="p-3 rounded-xl border flex items-center gap-2 font-medium"
            >
              <ShieldAlert size={16} />
              <span>Bu uygulama yol haritasında planlanan ürünler arasındadır. Henüz bağımsız kurulum altyapısı bulunmamaktadır.</span>
            </div>
          )}

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div
              style={{
                backgroundColor: 'var(--theme-bg-200)',
                borderColor: 'var(--theme-border-100)'
              }}
              className="p-3 rounded-xl border"
            >
              <span className="text-[10px] uppercase font-semibold text-zinc-400 block mb-0.5">
                Windows App ID
              </span>
              <span className="font-mono text-xs font-medium" style={{ color: 'var(--theme-text-100)' }}>
                {manifest.appId}
              </span>
            </div>

            <div
              style={{
                backgroundColor: 'var(--theme-bg-200)',
                borderColor: 'var(--theme-border-100)'
              }}
              className="p-3 rounded-xl border"
            >
              <span className="text-[10px] uppercase font-semibold text-zinc-400 block mb-0.5">
                Çalıştırılabilir Dosya (Executable)
              </span>
              <span className="font-mono text-xs font-medium" style={{ color: 'var(--theme-text-100)' }}>
                {manifest.executableName}
              </span>
            </div>
          </div>

          {/* File Associations */}
          {manifest.fileAssociations.length > 0 && (
            <div
              style={{
                backgroundColor: 'var(--theme-bg-200)',
                borderColor: 'var(--theme-border-100)'
              }}
              className="p-3 rounded-xl border"
            >
              <span className="text-[10px] uppercase font-semibold text-zinc-400 block mb-1">
                Kayıtlı Dosya Uzantıları
              </span>
              {manifest.fileAssociations.map((assoc, idx) => (
                <div key={idx} className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-1.5 py-0.5 bg-sky-500/10 text-sky-500 rounded font-bold">
                    .{assoc.ext}
                  </span>
                  <span style={{ color: 'var(--theme-text-100)' }}>{assoc.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Raw JSON Preview */}
          <div>
            <span className="text-[10px] uppercase font-semibold text-zinc-400 block mb-1">
              Doğrulanmış Manifesto JSON Çıktısı
            </span>
            <pre
              style={{
                backgroundColor: 'var(--theme-bg-300)',
                borderColor: 'var(--theme-border-100)',
                color: 'var(--theme-text-100)'
              }}
              className="p-3 rounded-xl border font-mono text-[11px] overflow-x-auto custom-scrollbar"
            >
              {JSON.stringify(manifest, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: 'var(--theme-bg-200)',
            borderTop: '1px solid var(--theme-border-100)'
          }}
          className="p-3 flex justify-end"
        >
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'var(--theme-bg-100)',
              borderColor: 'var(--theme-border-100)',
              color: 'var(--theme-text-100)'
            }}
            className="px-4 py-1.5 rounded-lg border text-xs font-medium hover:bg-black/5"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  )
}
