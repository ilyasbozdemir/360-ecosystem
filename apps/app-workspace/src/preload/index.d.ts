export interface SystemInfo {
  platform: string
  arch: string
  nodeVersion: string
  electronVersion: string
}

export interface WorkspaceAPI {
  isElectron: boolean
  launchApp: (appId: string) => Promise<{ success: boolean; message?: string }>
  checkAppInstalled: (appId: string) => Promise<{ installed: boolean; path?: string }>
  getSystemInfo: () => Promise<SystemInfo>
  minimizeWindow: () => void
  maximizeWindow: () => void
  closeWindow: () => void
}

declare global {
  interface Window {
    workspaceAPI?: WorkspaceAPI
  }
}
