import {
  DocumentResolver,
  DocumentSource,
  DocumentResolveContext,
  DocumentResolveResult
} from './types'
import { TEMPLATE_OPTIONS, TemplateOptionItem } from '../templateResolver'
import { loadDocumentPreviewData } from '../hooks/helpers'
import { useSettingsStore } from '../../../../../store/settingsStore'

export const dosyaResolver: DocumentResolver = {
  async templates(_source: DocumentSource): Promise<TemplateOptionItem[]> {
    void _source
    return TEMPLATE_OPTIONS
  },

  async resolve(
    source: DocumentSource,
    templateId: string,
    context?: DocumentResolveContext
  ): Promise<DocumentResolveResult> {
    if (source.kind !== 'dosya') {
      throw new Error(
        `dosyaResolver yalnızca "dosya" kaynaklarını destekler. Alınan: ${source.kind}`
      )
    }

    const {
      showLogoLeft,
      showLogoRight,
      logoLeft,
      logoRight,
      institutionLogo,
      subInstitutionType,
      customSubInstitutionLabel,
      customSubInstitutionKurumumuz,
      customSubInstitutionKurumu,
      customSubInstitutionKurumlari
    } = useSettingsStore.getState()

    const result = await loadDocumentPreviewData({
      activeDosyaId: source.dosyaId,
      resolvedId: templateId,
      selectedDocId: templateId,
      propInvitedFirms: context?.invitedFirms as unknown[],
      showLogoLeft,
      showLogoRight,
      logoLeft,
      logoRight,
      institutionLogo,
      subInstitutionType,
      customSubInstitutionLabel,
      customSubInstitutionKurumumuz,
      customSubInstitutionKurumu,
      customSubInstitutionKurumlari
    })

    return {
      resolvedData: result.finalData,
      formData: result.finalData,
      personelListesi: result.personelListesi,
      birimListesi: result.birimListesi,
      firmaListesi: result.firmaListesi,
      dosyaRecord: result.dosyaRecord,
      activeLogoLeft: result.activeLogoLeft,
      activeLogoRight: result.activeLogoRight,
      activeOrientation: result.activeOrientation,
      initialSnapshotJson: result.initialSnapshotJson
    }
  }
}
