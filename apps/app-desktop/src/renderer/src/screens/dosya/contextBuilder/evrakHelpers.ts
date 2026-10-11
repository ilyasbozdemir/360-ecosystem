export function buildFormattedEvrakSayisi(
  kurum: any,
  dosyaResData: any,
  rawTur: string,
  explicitIsEImza?: boolean
): string {
  const detsisNo = kurum?.detsis_kodu || ''
  const dosyaSayisi = String(dosyaResData?.temin_no || '')

  let sdpAltKodu = '99'
  if (rawTur === 'mal') {
    sdpAltKodu = '01'
  } else if (rawTur === 'hizmet' || rawTur === 'danismanlik') {
    sdpAltKodu = '02'
  } else if (rawTur === 'yapim_isi' || rawTur === 'yapim') {
    sdpAltKodu = '03'
  }
  const sdpKodu = `934.${sdpAltKodu}`

  const effectiveDetsis = detsisNo || '0000000000'
  const rawNumberStr = dosyaSayisi.includes('/')
    ? dosyaSayisi.split('/').pop()
    : dosyaSayisi.includes('-')
      ? dosyaSayisi.split('-').pop()
      : dosyaSayisi
  const cleanSayi = String(rawNumberStr || '').replace(/\D/g, '') || '1'
  const paddedSayi = cleanSayi.padStart(4, '0')

  // "E-" öneki evrak sayısının asli parçası değil, belgenin elektronik ortamda (EBYS'de / e-imzayla) düzenlendiğini gösteren ön ektir.
  // E-imzalı yazı: E-56383307-934.01-0001
  // Islak imzalı yazı: 56383307-934.01-0001 (başında E- olmaz)
  const imzaTuru = String(dosyaResData?.imza_turu ?? '').toLowerCase().trim()
  const isIslak =
    ['islak', 'ıslak', 'fiziksel'].includes(imzaTuru) ||
    [false, 'false', 0, '0'].includes(dosyaResData?.is_eimza) ||
    [false, 'false', 0, '0'].includes(dosyaResData?.e_imza)

  // Açık parametre varsa o kazanır, yoksa ıslak imza işareti yoksa e-imzalı kabul edilir
  const isEImza = typeof explicitIsEImza === 'boolean' ? explicitIsEImza : !isIslak

  const prefix = isEImza ? '' : ''
  return `${prefix}${effectiveDetsis}-${sdpKodu}-${paddedSayi}`
}