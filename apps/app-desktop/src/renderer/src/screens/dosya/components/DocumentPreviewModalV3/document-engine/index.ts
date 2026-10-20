export * from './types'
export * from './dosyaResolver'
export * from './ihtiyacRaporuResolver'
export * from './DocumentRenderer'
export * from './DocumentEngine'
export type { TemplateOptionItem } from '../templateResolver'

import { DocumentResolver, DocumentSource } from './types'
import { dosyaResolver } from './dosyaResolver'
import { ihtiyacRaporuResolver } from './ihtiyacRaporuResolver'

export const resolvers: Record<DocumentSource['kind'], DocumentResolver> = {
  dosya: dosyaResolver,
  ihtiyacRaporu: ihtiyacRaporuResolver
}
