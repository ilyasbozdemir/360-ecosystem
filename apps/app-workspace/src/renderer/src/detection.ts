export interface RealAppStatus {
  installed: boolean
  isDevSource?: boolean
  sourceAvailable?: boolean
  launchable?: boolean
  packageName?: string
  path?: string
  details?: string
}

/**
 * Uygulama gerçekten başlatılabilir mi?
 * - Kurulu uygulama: her zaman.
 * - Yalnızca kaynak kodu varsa: ancak dev script'i bulunuyorsa (geliştirici modu).
 */
export function canLaunch(status: RealAppStatus | undefined): boolean {
  if (!status) return false
  return status.installed || (!!status.sourceAvailable && !!status.launchable)
}
