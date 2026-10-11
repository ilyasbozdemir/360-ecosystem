import { describe, it, expect } from 'vitest'
import { HIZMET_SINIFLARI, YAPI_SINIFLARI } from '../constants'

describe('YeniMalzemeScreen Modularization', () => {
  it('correctly exports service classification constants', () => {
    expect(HIZMET_SINIFLARI.length).toBeGreaterThan(5)
    expect(HIZMET_SINIFLARI).toContain('Temizlik Hizmetleri')
    expect(HIZMET_SINIFLARI).toContain('Özel Güvenlik Hizmetleri')
  })

  it('correctly exports construction classification constants', () => {
    expect(YAPI_SINIFLARI.length).toBeGreaterThan(5)
    expect(YAPI_SINIFLARI).toContain('İnşaat İmalatları')
    expect(YAPI_SINIFLARI).toContain('Mekanik Tesisat')
  })
})
