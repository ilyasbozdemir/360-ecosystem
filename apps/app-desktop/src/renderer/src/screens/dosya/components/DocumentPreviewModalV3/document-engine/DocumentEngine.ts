import React from 'react'
import { renderToString } from 'react-dom/server'
import {
  TemplateKey,
  resolveTemplateKey,
  DocumentValidationService,
  ValidationReport
} from '@temin360/document-templates'
import { DocumentRenderer } from './DocumentRenderer'
import { dosyaResolver } from './dosyaResolver'
import { resolveTemplateConfig } from '../templateResolver'
import { documentPreloadService } from '../../../../../services/documentPreloadService'
import { usePrintQueueStore } from '../../../../../store/printQueueStore'
import { useSettingsStore } from '../../../../../store/settingsStore'
import { buildExportFileName } from '../../../../../utils/exportFileName'
import { DocumentResolveContext, DocumentResolveResult } from './types'

export interface DocumentRecord<T = Record<string, unknown>> {
  id?: number
  dosyaId: number
  templateKey: string
  data: T
  sablonVersiyon: number
  createdAt?: string
  updatedAt?: string
  isExisting: boolean
  personelListesi?: unknown[]
  firmaListesi?: unknown[]
  birimListesi?: unknown[]
  dosyaRecord?: unknown
  validationReport?: ValidationReport
}

export interface LoadOrCreateDocumentParams {
  dosyaId: number
  templateKey: string
  context?: DocumentResolveContext
  forceDefault?: boolean
}

export interface SaveDocumentParams<T = Record<string, unknown>> {
  dosyaId: number
  templateKey: string
  data: T
  sablonVersiyon?: number
  validateBeforeSave?: boolean
}

export interface ResetDocumentParams {
  dosyaId: number
  templateKey: string
  context?: DocumentResolveContext
}

export interface DeleteDocumentParams {
  dosyaId: number
  templateKey: string
}

export interface CompileHtmlParams {
  templateKey: string
  data: Record<string, unknown>
  orientation?: 'portrait' | 'landscape'
  personelListesi?: unknown[]
  firmaListesi?: unknown[]
  birimListesi?: unknown[]
  firstPageLimit?: number
  activeTemplateConf?: { name?: string }
}

export interface ExportPdfParams {
  dosyaId: number
  templateKey: string
  data: Record<string, unknown>
  orientation?: 'portrait' | 'landscape'
  dosyaRecord?: unknown
  personelListesi?: unknown[]
  firmaListesi?: unknown[]
  firstPageLimit?: number
}

/**
 * Merkezi Belge Yönetim ve Çıktı Motoru (Central Document Engine)
 * - dosyaId + templateKey üzerinden dosya bazlı belge yaşam döngüsünü yönetir.
 * - Mevcut belge varsa yükler, yoksa kaynak veriden default DTO oluşturup kaydeder.
 * - Kullanıcı özelleştirmelerini kaynak veri değişimlerinde korur.
 * - Önizleme ve PDF çıktısının birebir aynı belge modelini kullanmasını garanti eder.
 */
export class DocumentEngine {
  private static get ipc() {
    if (typeof window !== 'undefined' && window.electron?.ipcRenderer) {
      return window.electron.ipcRenderer
    }
    return null
  }

  /**
   * Şablon anahtarını kanonik biçime çözümler
   */
  static resolveKey(templateKey: string): string {
    const resolved = resolveTemplateKey(templateKey)
    return (
      resolved ||
      String(templateKey)
        .replace(/\.html$/i, '')
        .trim()
    )
  }

  /**
   * Dosyaya ait belgeyi bulur; diskte kayıt yoksa varsayılan veriyi oluşturup veritabanına kaydeder.
   */
  static async loadOrCreateDocument<T = Record<string, unknown>>(
    params: LoadOrCreateDocumentParams
  ): Promise<DocumentRecord<T>> {
    const { dosyaId, templateKey, context, forceDefault = false } = params
    const canonicalKey = this.resolveKey(templateKey)

    // 1. Önce veritabanında bu dosyaya özel kaydedilmiş belge var mı kontrol et
    if (!forceDefault && this.ipc) {
      try {
        const getRes = await this.ipc.invoke('belge:get-document', {
          dosyaId,
          templateKey: canonicalKey
        })

        if (getRes?.success && getRes.exists && getRes.record) {
          // Kayıtlı belge bulundu: periferik listeleri de resolver üzerinden tamamla
          const resolvedPeripheral = await dosyaResolver.resolve(
            { kind: 'dosya', dosyaId, documentId: canonicalKey },
            canonicalKey,
            context
          )

          const valReport = DocumentValidationService.validate(
            canonicalKey,
            getRes.record.data as Record<string, unknown>
          )

          return {
            id: getRes.record.id,
            dosyaId,
            templateKey: canonicalKey,
            data: getRes.record.data as T,
            sablonVersiyon: getRes.record.sablonVersiyon || 1,
            createdAt: getRes.record.createdAt,
            updatedAt: getRes.record.updatedAt,
            isExisting: true,
            personelListesi: resolvedPeripheral.personelListesi,
            firmaListesi: resolvedPeripheral.firmaListesi,
            birimListesi: resolvedPeripheral.birimListesi,
            dosyaRecord: resolvedPeripheral.dosyaRecord,
            validationReport: valReport
          }
        }
      } catch (err) {
        console.warn('[DocumentEngine] Saved document fetch error, falling back to resolver:', err)
      }
    }

    // 2. Kayıt yoksa: Kaynak verilerden varsayılan belge verisini oluştur
    const resolvedResult: DocumentResolveResult = await dosyaResolver.resolve(
      { kind: 'dosya', dosyaId, documentId: canonicalKey },
      canonicalKey,
      context
    )

    const defaultData = (resolvedResult.formData || resolvedResult.resolvedData || {}) as T
    const valReport = DocumentValidationService.validate(
      canonicalKey,
      defaultData as Record<string, unknown>
    )

    // 3. Varsayılan veriyi bu dosya için veritabanına ilk kayıt olarak güvenle kaydet
    let recordId: number | undefined = undefined
    let updatedAt: string | undefined = undefined

    if (this.ipc && dosyaId) {
      try {
        const saveRes = await this.ipc.invoke('belge:save-document', {
          dosyaId,
          templateKey: canonicalKey,
          data: defaultData,
          sablonVersiyon: 1
        })
        if (saveRes?.success) {
          recordId = saveRes.id
          updatedAt = saveRes.updatedAt
        }
      } catch (err) {
        console.warn('[DocumentEngine] Initial document auto-save error:', err)
      }
    }

    return {
      id: recordId,
      dosyaId,
      templateKey: canonicalKey,
      data: defaultData,
      sablonVersiyon: 1,
      updatedAt,
      isExisting: false,
      personelListesi: resolvedResult.personelListesi,
      firmaListesi: resolvedResult.firmaListesi,
      birimListesi: resolvedResult.birimListesi,
      dosyaRecord: resolvedResult.dosyaRecord,
      validationReport: valReport
    }
  }

  /**
   * Belge verisini doğrular ve ilişkili dosya kaydına atomik transaction ile yazar.
   */
  static async saveDocument<T = Record<string, unknown>>(
    params: SaveDocumentParams<T>
  ): Promise<{ success: boolean; id?: number; updatedAt?: string; error?: string }> {
    const { dosyaId, templateKey, data, sablonVersiyon = 1, validateBeforeSave = false } = params
    const canonicalKey = this.resolveKey(templateKey)

    if (validateBeforeSave) {
      const report = DocumentValidationService.validate(
        canonicalKey,
        data as Record<string, unknown>
      )
      if (report.hasErrors) {
        const errorMsgs = report.errors.map((e) => e.message).join(', ')
        throw new Error(`Belge doğrulama hataları nedeniyle kaydedilemedi: ${errorMsgs}`)
      }
    }

    if (!this.ipc) {
      return { success: true }
    }

    const res = await this.ipc.invoke('belge:save-document', {
      dosyaId,
      templateKey: canonicalKey,
      data,
      sablonVersiyon
    })

    if (!res?.success) {
      throw new Error(res?.error || 'Belge kaydedilirken veritabanı hatası oluştu.')
    }

    // Cache güncellemesi ve yazdırma kuyruğu geçersiz kılma
    documentPreloadService.updateCachedResolvedData(canonicalKey, dosyaId, data)
    usePrintQueueStore
      .getState()
      .invalidateReadyStatus(dosyaId, canonicalKey, 'Belge içeriği güncellendi')

    return {
      success: true,
      id: res.id,
      updatedAt: res.updatedAt
    }
  }

  /**
   * Kullanıcı açıkça talep ettiğinde belgeyi varsayılan durumuna sıfırlar.
   * Mevcut kullanıcı düzenlemesini revizyona arşivler ve kaynak verilerden taze belge oluşturur.
   */
  static async resetToDefault<T = Record<string, unknown>>(
    params: ResetDocumentParams
  ): Promise<DocumentRecord<T>> {
    const { dosyaId, templateKey, context } = params
    const canonicalKey = this.resolveKey(templateKey)

    if (this.ipc) {
      await this.ipc.invoke('belge:reset-document', {
        dosyaId,
        templateKey: canonicalKey
      })
    }

    return await this.loadOrCreateDocument<T>({
      dosyaId,
      templateKey: canonicalKey,
      context,
      forceDefault: true
    })
  }

  /**
   * Belirli bir dosyanın belirli belge kaydını siler.
   */
  static async deleteDocument(params: DeleteDocumentParams): Promise<boolean> {
    const { dosyaId, templateKey } = params
    const canonicalKey = this.resolveKey(templateKey)

    if (this.ipc) {
      const res = await this.ipc.invoke('belge:delete-document', {
        dosyaId,
        templateKey: canonicalKey
      })
      return Boolean(res?.success)
    }
    return true
  }

  /**
   * Önizleme ve PDF çıktısı için ortak saf HTML derleyicisi.
   * Birebir DocumentRenderer (chrome: 'bare') kullanır.
   */
  static compileHtml(params: CompileHtmlParams): string {
    const {
      templateKey,
      data,
      orientation = 'portrait',
      personelListesi = [],
      firmaListesi = [],
      birimListesi = [],
      firstPageLimit,
      activeTemplateConf
    } = params

    const resolved = resolveTemplateKey(templateKey)
    if (!resolved) {
      throw new Error(`Geçersiz şablon kimliği: "${templateKey}".`)
    }

    const { config } = resolveTemplateConfig(resolved)
    const storeSettings = useSettingsStore.getState()
    const activeSolLogo =
      data.solLogo || storeSettings.logoLeft || storeSettings.institutionLogo || null
    const activeSagLogo = data.sagLogo || storeSettings.logoRight || null

    const mergedData = {
      ...data,
      personelListesi,
      firmaListesi,
      tarih: data.tarih || data.onayaSunulanTarih || '',
      onayTarihi: data.onayTarihi || data.dosyaTarihi || '',
      solLogo: activeSolLogo,
      sagLogo: activeSagLogo,
      olurYazisi: data.olurYazisi !== false,
      orientation
    }

    const bodyHtml = renderToString(
      React.createElement(DocumentRenderer, {
        templateKey: resolved as TemplateKey,
        data: mergedData,
        orientation,
        chrome: 'bare',
        isEditing: false,
        personelListesi,
        firmaListesi,
        birimListesi,
        firstPageLimit
      })
    )

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${activeTemplateConf?.name || config?.name || 'Belge Önizleme'}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: A4 ${orientation};
              margin: 10mm;
            }
            body {
              font-family: Arial, Helvetica, sans-serif;
              color: #000;
              margin: 0;
              padding: 0;
              background-color: #fff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            @media print {
              body {
                background: white !important;
                padding: 0 !important;
              }
              [data-document-page] {
                box-shadow: none !important;
                margin: 0 !important;
                width: 100% !important;
              }
              .page-break {
                page-break-before: always;
              }
            }
          </style>
        </head>
        <body>
          ${bodyHtml}
        </body>
      </html>
    `
  }

  /**
   * Belgeyi PDF olarak dışa aktarır (Önizleme ile birebir aynı veriyi kullanır).
   */
  static async exportPdf(
    params: ExportPdfParams
  ): Promise<{ success: boolean; filePath?: string }> {
    const {
      dosyaId,
      templateKey,
      data,
      orientation = 'portrait',
      dosyaRecord,
      personelListesi = [],
      firmaListesi = [],
      firstPageLimit
    } = params

    const { config } = resolveTemplateConfig(templateKey)
    const htmlContent = this.compileHtml({
      templateKey,
      data,
      orientation,
      personelListesi,
      firmaListesi,
      firstPageLimit,
      activeTemplateConf: config
    })

    const defaultFilename = buildExportFileName({
      dosya: (dosyaRecord as Record<string, unknown> | null | undefined) ?? null,
      butceYili: (data as any)?.butceYili || (dosyaRecord as any)?.butce_yili,
      teminNo: (data as any)?.teminNo || (dosyaRecord as any)?.temin_no,
      belgeAdi: config?.name || templateKey,
      extension: 'pdf'
    })

    if (!this.ipc) {
      return { success: true }
    }

    try {
      const res = await this.ipc.invoke('app:save-pdf-as', {
        html: htmlContent,
        orientation,
        defaultFilename
      })
      if (res && res.success) {
        return { success: true, filePath: res.filePath }
      }
      return { success: false }
    } catch {
      await this.ipc.invoke('belge:open-pdf-external', htmlContent)
      return { success: true }
    }
  }
}
