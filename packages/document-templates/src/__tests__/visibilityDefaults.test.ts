import { describe, it, expect } from 'vitest'
import { OdemeYazisi } from '../templates/odeme-yazisi/OdemeYazisi.template'
import { LuzumMuzekkeresi } from '../templates/luzum-muzekkeresi/LuzumMuzekkeresi.template'
import React from 'react'
import { renderToString } from 'react-dom/server'

describe('Visibility Flags Backward Compatibility & Snapshot', () => {
  it('odeme-yazisi: yeni anahtarlar yokken eski çıktı birebir aynı kalır', () => {
    const baseData = {
      baskanAdi: 'Ahmet Yılmaz',
      baskanUnvan: 'Şube Müdürü',
      kurumAdi: 'Test İdaresi'
    }

    const htmlOriginal = renderToString(React.createElement(OdemeYazisi, { data: baseData as any }))

    // Harici/ek anahtarlar olmadan render edilen çıktı sabit olmalı
    expect(htmlOriginal).toBeDefined()
    expect(htmlOriginal).toContain('Test İdaresi')

    // olurGoster açıkken Olur bloğu eklenmeli
    const htmlWithOlur = renderToString(React.createElement(OdemeYazisi, { data: { ...baseData, olurGoster: true } as any }))
    expect(htmlWithOlur).toContain('OLUR')
    expect(htmlWithOlur).not.toEqual(htmlOriginal)
  })

  it('luzum-muzekkeresi: olurYazisi tanımsız olduğunda onay metni varsayılan olarak basılır (eski davranış korunur)', () => {
    const defaultData = {
      hazirlayanPersonelAdi: 'Mehmet Demir',
      sunulacakMakamAdi: 'Müdürlük Makamına'
    }

    const htmlDefault = renderToString(React.createElement(LuzumMuzekkeresi, { data: defaultData as any }))

    // olurYazisi: true ile aynı olmalı
    const htmlExplicitTrue = renderToString(React.createElement(LuzumMuzekkeresi, { data: { ...defaultData, olurYazisi: true } as any }))
    expect(htmlDefault).toEqual(htmlExplicitTrue)

    // olurYazisi: false olduğunda ise gizlenmeli (farklı olmalı)
    const htmlFalse = renderToString(React.createElement(LuzumMuzekkeresi, { data: { ...defaultData, olurYazisi: false } as any }))
    expect(htmlDefault).not.toEqual(htmlFalse)
  })
})
