import React from 'react'
import { Archive, Clock, ShieldCheck } from 'lucide-react'

interface GenelTabProps {
  disableDocumentGuidance: boolean
  setDisableDocumentGuidance: (val: boolean) => void
  unifiedStepperMode: boolean
  setUnifiedStepperMode: (val: boolean) => void
  trashRetentionDays?: number
  setTrashRetentionDays?: (val: number) => void
}

export const GenelTab: React.FC<GenelTabProps> = ({
  disableDocumentGuidance,
  setDisableDocumentGuidance,
  unifiedStepperMode,
  setUnifiedStepperMode,
  trashRetentionDays = 30,
  setTrashRetentionDays
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
        <div>
          <h2 className="text-lg font-bold text-slate-850 dark:text-slate-100">
            Genel Sistem Ayarları
          </h2>
          <p className="text-xs text-slate-500">
            Uygulamanın genel davranışını, çöp kutusu saklama politikasını ve belge akış
            yönlendirmelerini düzenleyin.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Çöp Kutusu ve Soft Delete Saklama Süresi */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Archive className="w-4 h-4 text-amber-500" />
                Çöp Kutusu & Silinen Dosyaları Saklama Süresi (Soft Delete Retention)
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                Doğrudan temin dosyaları veya modüller kaldırıldığında hemen yok edilmez; Çöp
                Kutusu&apos;nda güvenle bekletilir. Bu süre zarfında dilediğiniz an tek tıkla geri
                yükleyebilirsiniz. Süre dolduğunda kalıcı olarak temizlenir.
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 shrink-0">
              <Clock className="w-3.5 h-3.5" />
              {trashRetentionDays} Gün Saklanır
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
            {[7, 15, 30, 60, 90].map((days) => {
              const isSelected = trashRetentionDays === days
              return (
                <button
                  key={days}
                  type="button"
                  onClick={() => setTrashRetentionDays && setTrashRetentionDays(days)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 border-amber-500 text-amber-900 dark:bg-amber-950/30 dark:border-amber-400 dark:text-amber-200 shadow-sm ring-1 ring-amber-500/20'
                      : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200 text-slate-700 dark:bg-slate-800/50 dark:border-slate-700/60 dark:text-slate-300'
                  }`}
                >
                  <div className="text-base font-extrabold">{days} Gün</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {days === 30
                      ? 'Standart (Önerilen)'
                      : days < 30
                        ? 'Kısa Süreli'
                        : 'Genişletilmiş'}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              Süre dolmadan önce <strong>Bildirimler</strong> panelinde hatırlatıcı bildirim
              gösterilir.
            </span>
          </div>
        </div>

        {/* Belge Çıkarma & Yönlendirme Modu */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-350 mb-2">
            Belge Çıkarma & Yönlendirme Modu
          </label>
          <p className="text-xs text-slate-500 mb-4">
            Diyalog adımlarında (Hazırlık, Teklifler, Sipariş, Kabul) belgeleri yazdırma ve işlem
            yapma butonlarının gösterilip gösterilmeyeceğini belirleyin.
          </p>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-205 dark:border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-100/30 dark:hover:bg-slate-800/20 transition-all">
              <input
                type="radio"
                name="documentGuidanceMode"
                checked={disableDocumentGuidance}
                onChange={() => setDisableDocumentGuidance(true)}
                className="mt-0.5 rounded-full border-slate-300 dark:border-slate-700 bg-slate-55 dark:bg-slate-950 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
              />
              <div>
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                  Serbest Belge Çıkarma Modu (Varsayılan)
                </span>
                <span className="text-[11px] text-slate-500 block mt-1 leading-relaxed">
                  {
                    'Dosya adımlarındaki "Belgeleri Yazdır" kılavuz butonunu gizler. Bunun yerine "İşlemler" menüsünü ve serbest belge çıkarma seçeneklerini gösterir.'
                  }
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-205 dark:border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-100/30 dark:hover:bg-slate-800/20 transition-all">
              <input
                type="radio"
                name="documentGuidanceMode"
                checked={!disableDocumentGuidance}
                onChange={() => setDisableDocumentGuidance(false)}
                className="mt-0.5 rounded-full border-slate-300 dark:border-slate-700 bg-slate-55 dark:bg-slate-950 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
              />
              <div>
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                  Kılavuzlu Belge Çıkarma Modu
                </span>
                <span className="text-[11px] text-slate-500 block mt-1 leading-relaxed">
                  {
                    'Her diyalog adımında "Belgeleri Yazdır" butonunu ön plana çıkararak sırayla çıkarılması gereken evrakları adım adım yönlendirir.'
                  }
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Görünüm Modu (Stepper vs Ayrı Sekmeler) */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-350 mb-2">
            Doğrudan Temin Süreç Görünüm Modu
          </label>
          <p className="text-xs text-slate-500 mb-4">
            Doğrudan temin aşamalarının (Hazırlık, Teklifler, Sipariş, Kabul vb.) tek bir ekran
            üzerinde mi yoksa ayrı sekmeler halinde mi gösterileceğini belirleyin.
          </p>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-205 dark:border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-100/30 dark:hover:bg-slate-800/20 transition-all">
              <input
                type="radio"
                name="unifiedStepperMode"
                checked={unifiedStepperMode}
                onChange={() => setUnifiedStepperMode(true)}
                className="mt-0.5 rounded-full border-slate-300 dark:border-slate-700 bg-slate-55 dark:bg-slate-950 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
              />
              <div>
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                  Tek Ekran (Stepper) Görünümü (Varsayılan)
                </span>
                <span className="text-[11px] text-slate-500 block mt-1 leading-relaxed">
                  Tüm aşamaları sol taraftaki menü yardımıyla tek bir ekrandan sayfa değiştirmeden
                  yönetin.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-205 dark:border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-100/30 dark:hover:bg-slate-800/20 transition-all">
              <input
                type="radio"
                name="unifiedStepperMode"
                checked={!unifiedStepperMode}
                onChange={() => setUnifiedStepperMode(false)}
                className="mt-0.5 rounded-full border-slate-300 dark:border-slate-700 bg-slate-55 dark:bg-slate-950 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
              />
              <div>
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                  Ayrı Sekmeler Görünümü
                </span>
                <span className="text-[11px] text-slate-500 block mt-1 leading-relaxed">
                  Aşamalara tıklandığında tam sayfa olarak ayrı bir sekmeye (sayfaya) yönlendirilir.
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
