import React from 'react'
import {
  Sliders,
  Plus,
  Code2,
  History,
  Building2,
  MapPin,
  DollarSign,
  Copy,
  Trash2,
  Check,
  RotateCcw
} from 'lucide-react'
import type { Dosya2886Item } from '../../../../components/layout/temin-selector/teminSelector.types'
import type { FormDataType, CustomField, StudyoLeftTab } from './studyoTypes'

interface StudyoLeftSidebarProps {
  leftTab: StudyoLeftTab
  onSetLeftTab: (tab: StudyoLeftTab) => void
  currentDosya: Dosya2886Item | null
  formData: FormDataType
  onSetFormData: (data: FormDataType) => void
  customFields: CustomField[]
  onCustomFieldChange: (id: string, value: string) => void
  onDeleteCustomField: (id: string) => void
  // Add field form
  showAddField: boolean
  onToggleShowAddField: () => void
  newFieldKey: string
  onSetNewFieldKey: (val: string) => void
  newFieldLabel: string
  onSetNewFieldLabel: (val: string) => void
  newFieldTip: 'metin' | 'sayi' | 'para' | 'tarih' | 'secim' | 'cok_satirli'
  onSetNewFieldTip: (
    tip: 'metin' | 'sayi' | 'para' | 'tarih' | 'secim' | 'cok_satirli'
  ) => void
  newFieldVal: string
  onSetNewFieldVal: (val: string) => void
  onAddCustomField: () => void
  // Vars
  templateContext: Record<string, string | number>
  copiedVar: string | null
  onCopyVar: (key: string) => void
  // Revisions
  onSaveRevision: () => void
  onRestoreRevision: (html: string) => void
}

export function StudyoLeftSidebar({
  leftTab,
  onSetLeftTab,
  currentDosya,
  formData,
  onSetFormData,
  customFields,
  onCustomFieldChange,
  onDeleteCustomField,
  showAddField,
  onToggleShowAddField,
  newFieldKey,
  onSetNewFieldKey,
  newFieldLabel,
  onSetNewFieldLabel,
  newFieldTip,
  onSetNewFieldTip,
  newFieldVal,
  onSetNewFieldVal,
  onAddCustomField,
  templateContext,
  copiedVar,
  onCopyVar,
  onSaveRevision,
  onRestoreRevision
}: StudyoLeftSidebarProps): React.JSX.Element {
  return (
    <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col h-205 overflow-hidden">
      {/* Sol Panel Sekme Başlıkları */}
      <div className="shrink-0 flex items-center border-b border-slate-200 dark:border-slate-800 p-2 bg-slate-50/70 dark:bg-slate-850/50 gap-1 overflow-x-auto custom-scrollbar">
        <button
          type="button"
          onClick={() => onSetLeftTab('form')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            leftTab === 'form'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Form Verileri</span>
        </button>

        <button
          type="button"
          onClick={() => onSetLeftTab('builder')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            leftTab === 'builder'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Form Builder ({customFields.length})</span>
        </button>

        <button
          type="button"
          onClick={() => onSetLeftTab('vars')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            leftTab === 'vars'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Yer Tutucular</span>
        </button>

        <button
          type="button"
          onClick={() => onSetLeftTab('revisions')}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            leftTab === 'revisions'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Sürümler ({currentDosya?.surumler?.length || 0})</span>
        </button>
      </div>

      {/* Sol Panel İçeriği (Kaydırılabilir) */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
        {/* SEKME 1: TEMEL FORM VERİLERİ */}
        {leftTab === 'form' && (
          <div className="space-y-4">
            {/* 1. Genel İhale Tanımı */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                <Building2 className="w-4 h-4 text-purple-500" />
                <span>İhale & Dosya Bilgileri</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Kayıt No
                  </label>
                  <input
                    type="text"
                    value={formData.ihaleKayitNo}
                    onChange={(e) => onSetFormData({ ...formData, ihaleKayitNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    İşlem Türü
                  </label>
                  <select
                    value={formData.islemTuru}
                    onChange={(e) => onSetFormData({ ...formData, islemTuru: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                  >
                    <option value="satis">🏷️ Mülkiyet Satışı</option>
                    <option value="kiralama">🏢 Taşınmaz Kiralama</option>
                    <option value="irtifak_hakki">📜 Sınırlı Ayni Hak / İrtifak</option>
                    <option value="trampa">🔄 Trampa (Takas)</option>
                  </select>
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  İhale Konusu / Taşınmaz Adı
                </label>
                <input
                  type="text"
                  value={formData.ihaleAdi}
                  onChange={(e) => onSetFormData({ ...formData, ihaleAdi: e.target.value })}
                  placeholder="Örn: 104 Ada 12 Parsel Taşınmaz Satışı"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    İhale Usulü
                  </label>
                  <select
                    value={formData.usul}
                    onChange={(e) => onSetFormData({ ...formData, usul: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                  >
                    <option value="acik_teklif_45">Madde 45 (Açık Teklif)</option>
                    <option value="kapali_teklif_36">Madde 36 (Kapalı Teklif)</option>
                    <option value="pazarlik_51">Madde 51 (Pazarlık)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    İhale Yeri
                  </label>
                  <input
                    type="text"
                    value={formData.ihaleYeri}
                    onChange={(e) => onSetFormData({ ...formData, ihaleYeri: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    İhale Tarihi
                  </label>
                  <input
                    type="date"
                    value={formData.ihaleTarihi}
                    onChange={(e) => onSetFormData({ ...formData, ihaleTarihi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    İhale Saati
                  </label>
                  <input
                    type="time"
                    value={formData.ihaleSaati}
                    onChange={(e) => onSetFormData({ ...formData, ihaleSaati: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 2. Tapu ve Taşınmaz Detayları */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>Tapu & Taşınmaz Bilgileri</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    İl / İlçe
                  </label>
                  <input
                    type="text"
                    value={`${formData.il} / ${formData.ilce}`}
                    onChange={(e) => {
                      const parts = e.target.value.split('/')
                      onSetFormData({
                        ...formData,
                        il: parts[0]?.trim() || '',
                        ilce: parts[1]?.trim() || ''
                      })
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Ada / Parsel
                  </label>
                  <input
                    type="text"
                    value={`${formData.ada} / ${formData.parsel}`}
                    onChange={(e) => {
                      const parts = e.target.value.split('/')
                      onSetFormData({
                        ...formData,
                        ada: parts[0]?.trim() || '',
                        parsel: parts[1]?.trim() || ''
                      })
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Yüzölçümü (m²)
                  </label>
                  <input
                    type="number"
                    value={formData.yuzolcumuM2 || ''}
                    onChange={(e) =>
                      onSetFormData({ ...formData, yuzolcumuM2: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Taşınmaz Cinsi / Vasfı
                </label>
                <input
                  type="text"
                  value={formData.cinsi}
                  onChange={(e) => onSetFormData({ ...formData, cinsi: e.target.value })}
                  placeholder="Örn: Arsa, Kargir Bina, Dükkan"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* 3. Muhammen Bedel ve Teminat */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-1.5">
                <DollarSign className="w-4 h-4 text-amber-500" />
                <span>Muhammen Bedel & Teminat</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Muhammen Bedel (₺)
                  </label>
                  <input
                    type="number"
                    value={formData.muhammenBedel}
                    onChange={(e) =>
                      onSetFormData({
                        ...formData,
                        muhammenBedel: parseFloat(e.target.value) || 0
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    %3 Geçici Teminat (₺)
                  </label>
                  <div className="w-full px-3 py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
                    ₺{Math.round((Number(formData.muhammenBedel) || 0) * 0.03).toLocaleString('tr-TR')}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Kullanıcının Eklediği Özel Alanlar Girişi */}
            {customFields.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300 border-b border-purple-100 dark:border-purple-950 pb-1.5">
                  <Sliders className="w-4 h-4" />
                  <span>Özel Form Alanları (Builder)</span>
                </div>

                {customFields.map((cf) => (
                  <div key={cf.id} className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        {cf.label}
                      </label>
                      <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400">
                        {`{{${cf.key}}}`}
                      </span>
                    </div>
                    {cf.tip === 'cok_satirli' ? (
                      <textarea
                        rows={2}
                        value={cf.deger}
                        onChange={(e) => onCustomFieldChange(cf.id, e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                      />
                    ) : (
                      <input
                        type={cf.tip === 'sayi' || cf.tip === 'para' ? 'number' : 'text'}
                        value={cf.deger}
                        onChange={(e) => onCustomFieldChange(cf.id, e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SEKME 2: DİNAMİK FORM BUILDER (ALAN TANIMLAMA) */}
        {leftTab === 'builder' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Özel Form Alanları Tasarımı
                </h3>
                <p className="text-[11px] text-slate-500">
                  İhale belgenize özel yeni dinamik alanlar ve yer tutucular tanımlayın.
                </p>
              </div>
              <button
                type="button"
                onClick={onToggleShowAddField}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yeni Alan Ekle</span>
              </button>
            </div>

            {/* Yeni Alan Ekleme Formu */}
            {showAddField && (
              <div className="bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-xl p-3.5 space-y-3">
                <div className="text-xs font-bold text-purple-900 dark:text-purple-200">
                  Yeni Form Alanı Oluştur
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                      Alan Başlığı (Label)
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: İmar Durumu"
                      value={newFieldLabel}
                      onChange={(e) => onSetNewFieldLabel(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                      Değişken Kodu (Key)
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: imar_durumu"
                      value={newFieldKey}
                      onChange={(e) => onSetNewFieldKey(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                      Alan Tipi
                    </label>
                    <select
                      value={newFieldTip}
                      onChange={(e) =>
                        onSetNewFieldTip(
                          e.target.value as
                            | 'metin'
                            | 'sayi'
                            | 'para'
                            | 'tarih'
                            | 'secim'
                            | 'cok_satirli'
                        )
                      }
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                    >
                      <option value="metin">📝 Tek Satır Metin</option>
                      <option value="cok_satirli">📄 Çok Satırlı Paragraf</option>
                      <option value="sayi">🔢 Sayısal Değer</option>
                      <option value="para">💰 Para (₺ Tutar)</option>
                      <option value="tarih">📅 Tarih</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                      Varsayılan Değer
                    </label>
                    <input
                      type="text"
                      placeholder="Varsayılan değer..."
                      value={newFieldVal}
                      onChange={(e) => onSetNewFieldVal(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onToggleShowAddField}
                    className="px-3 py-1 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-xs"
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    onClick={onAddCustomField}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold"
                  >
                    Alanı Ekle
                  </button>
                </div>
              </div>
            )}

            {/* Tanımlı Özel Alanlar Listesi */}
            <div className="space-y-2">
              {customFields.map((cf) => (
                <div
                  key={cf.id}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-xl"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {cf.label}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-mono">
                        {`{{${cf.key}}}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate max-w-70 mt-0.5">
                      Tip: {cf.tip} • Değer: {cf.deger || '(Boş)'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onCopyVar(cf.key)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 transition-colors"
                      title="Yer tutucu kodunu kopyala"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCustomField(cf.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                      title="Alanı Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {customFields.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Henüz özel alan tanımlanmadı. &quot;Yeni Alan Ekle&quot; butonu ile ekleyebilirsiniz.
                </div>
              )}
            </div>
          </div>
        )}

        {/* SEKME 3: KULLANILABİLİR YER TUTUCULAR LİSTESİ */}
        {leftTab === 'vars' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-500 leading-relaxed">
              Aşağıdaki rozetlere tıklayarak değişken etiketini kopyalayabilir ve şablon metninizin istediğiniz yerine yapıştırabilirsiniz:
            </div>

            <div className="space-y-2">
              {Object.entries(templateContext).map(([key, val]) => (
                <div
                  key={key}
                  onClick={() => onCopyVar(key)}
                  className="group flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-700 bg-slate-50/60 dark:bg-slate-850/60 transition-all cursor-pointer"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300">
                        {`{{${key}}}`}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      Değer: <span className="font-semibold text-slate-700 dark:text-slate-300">{String(val)}</span>
                    </div>
                  </div>

                  <div className="shrink-0 text-slate-400 group-hover:text-purple-600">
                    {copiedVar === key ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEKME 4: SÜRÜMLER & GEÇMİŞ */}
        {leftTab === 'revisions' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Kayıtlı Belge Sürümleri
              </span>
              <button
                type="button"
                onClick={onSaveRevision}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Yeni Sürüm Al</span>
              </button>
            </div>

            {currentDosya?.surumler && currentDosya.surumler.length > 0 ? (
              <div className="space-y-2">
                {currentDosya.surumler.map((rev) => (
                  <div
                    key={rev.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {rev.baslik}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {rev.tarih}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRestoreRevision(rev.html)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Geri Yükle</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                Henüz kayıtlı bir sürüm bulunmuyor. &quot;Yeni Sürüm Al&quot; ile belge anlık halini dondurabilirsiniz.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
