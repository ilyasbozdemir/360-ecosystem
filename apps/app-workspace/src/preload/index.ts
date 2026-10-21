import { contextBridge, ipcRenderer } from 'electron'
import type { WorkspaceAPI } from './index.d'

const api: WorkspaceAPI = {
  isElectron: true,
  launchApp: (appId: string) => ipcRenderer.invoke('workspace:launch-app', appId),
  checkAppInstalled: (appId: string) => ipcRenderer.invoke('workspace:check-app', appId),
  getSystemInfo: () => ipcRenderer.invoke('workspace:get-system-info'),
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close')
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('workspaceAPI', api)
  } catch (error) {
    console.error('Failed to expose workspaceAPI in isolated context:', error)
  }
} else {
  window.workspaceAPI = api
}
