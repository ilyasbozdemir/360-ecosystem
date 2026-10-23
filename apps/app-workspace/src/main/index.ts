import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join, resolve, basename } from 'path'
import { spawn } from 'child_process'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import fs from 'fs'

let mainWindow: BrowserWindow | null = null

function getIconPath(): string | undefined {
  const possiblePaths = [
    join(__dirname, '../../resources/icon.ico'),
    join(__dirname, '../../resources/icon.png'),
    join(process.resourcesPath, 'icon.ico'),
    join(process.resourcesPath, 'icon.png')
  ]

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p
    }
  }
  return undefined
}

function getRepoRoot(): string {
  // __dirname in dev: apps/app-workspace/out/main
  return resolve(__dirname, '../../../..')
}

export interface AppDetectionResult {
  /** Çalıştırılabilir (EXE) kurulu sürüm bulundu mu? */
  installed: boolean
  isDevSource?: boolean
  /** Monorepo içinde kaynak kodu mevcut mu? (kurulu anlamına gelmez) */
  sourceAvailable?: boolean
  /** Bu makinede gerçekten başlatılabilir mi? (EXE veya tanımlı dev script'i) */
  launchable?: boolean
  /** Geliştirici modunda kullanılacak paket adı */
  packageName?: string
  path?: string
  details?: string
}

function readDevScriptInfo(
  appDir: string
): { packageName: string; hasDevScript: boolean } | null {
  try {
    const pkg = JSON.parse(fs.readFileSync(join(appDir, 'package.json'), 'utf-8')) as {
      name?: string
      scripts?: Record<string, string>
    }
    if (!pkg.name) return null
    return { packageName: pkg.name, hasDevScript: Boolean(pkg.scripts?.dev) }
  } catch {
    return null
  }
}

function detectTemin360(): AppDetectionResult {
  const repoRoot = getRepoRoot()

  // 1. Check local production dist-local or unpacked build
  const localDevUnpacked = resolve(repoRoot, 'apps/app-desktop/dist-local/win-unpacked/TEMIN360.exe')
  if (fs.existsSync(localDevUnpacked)) {
    return {
      installed: true,
      isDevSource: false,
      path: localDevUnpacked,
      details: 'Yerel paketlenmiş sürüm (dist-local/win-unpacked)'
    }
  }

  // 2. Check standard Windows installation directories
  const localAppData = process.env.LOCALAPPDATA || ''
  const programFiles = process.env.ProgramFiles || ''
  const programFilesX86 = process.env['ProgramFiles(x86)'] || ''

  const candidatePaths = [
    join(localAppData, 'Programs', 'temin360', 'TEMIN360.exe'),
    join(localAppData, 'temin360', 'TEMIN360.exe'),
    join(localAppData, 'Programs', 'TEMİN 360', 'TEMIN360.exe'),
    join(programFiles, 'TEMİN 360', 'TEMIN360.exe'),
    join(programFilesX86, 'TEMİN 360', 'TEMIN360.exe')
  ]

  for (const p of candidatePaths) {
    if (p && fs.existsSync(p)) {
      return {
        installed: true,
        isDevSource: false,
        path: p,
        details: 'Windows kurulu sürüm'
      }
    }
  }

  // 3. Check if running inside development workspace repo with source available
  const desktopSourcePkg = resolve(repoRoot, 'apps/app-desktop/package.json')
  if (fs.existsSync(desktopSourcePkg)) {
    return {
      installed: true,
      isDevSource: true,
      path: resolve(repoRoot, 'apps/app-desktop'),
      details: 'Geliştirici ortamı kaynak kodu (apps/app-desktop)'
    }
  }

  return {
    installed: false,
    details: 'Uygulama sistemi üzerinde bulunamadı.'
  }
}

function detectApp(appId: string): AppDetectionResult {
  if (appId === 'dev.ilyasbozdemir.temin360') {
    return detectTemin360()
  }

  if (appId === 'dev.ilyasbozdemir.workspace360') {
    return {
      installed: true,
      isDevSource: is.dev,
      path: process.execPath,
      details: 'Çalışan Workspace 360 oturumu'
    }
  }

  // Generic detection for other ecosystem apps
  const repoRoot = getRepoRoot()
  const localAppData = process.env.LOCALAPPDATA || ''
  const programFiles = process.env.ProgramFiles || ''
  const programFilesX86 = process.env['ProgramFiles(x86)'] || ''

  const appSlug = appId.replace('dev.ilyasbozdemir.', '')
  const exeName = `${appSlug.charAt(0).toUpperCase() + appSlug.slice(1)}.exe`

  const candidatePaths = [
    join(localAppData, 'Programs', appSlug, exeName),
    join(localAppData, appSlug, exeName),
    join(programFiles, appSlug, exeName),
    join(programFilesX86, appSlug, exeName),
    resolve(repoRoot, `apps/${appSlug}/dist-local/win-unpacked/${exeName}`)
  ]

  for (const p of candidatePaths) {
    if (p && fs.existsSync(p)) {
      return {
        installed: true,
        isDevSource: false,
        path: p,
        details: 'Kurulu sürüm tespit edildi'
      }
    }
  }

  const appDir = resolve(repoRoot, `apps/${appSlug}`)
  if (fs.existsSync(join(appDir, 'package.json'))) {
    const info = readDevScriptInfo(appDir)
    const launchable = Boolean(info?.hasDevScript)
    return {
      installed: false,
      isDevSource: true,
      sourceAvailable: true,
      launchable,
      packageName: info?.packageName,
      path: appDir,
      details: launchable
        ? 'Kurulu değil; monorepo kaynak kodu geliştirici modunda çalıştırılabilir.'
        : 'Kurulu değil; kaynak kodu var ancak tanımlı bir "dev" script\'i yok.'
    }
  }

  return {
    installed: false,
    details: 'Uygulama henüz kurulu değil veya planlama aşamasında.'
  }
}

async function launchTemin360(): Promise<{ success: boolean; message: string }> {
  const detection = detectTemin360()
  if (!detection.installed) {
    return {
      success: false,
      message: 'TEMİN 360 bulunamadı. Lütfen önce kurulumu gerçekleştirin.'
    }
  }

  return new Promise((resolvePromise) => {
    let resolved = false
    const markResolved = (res: { success: boolean; message: string }) => {
      if (!resolved) {
        resolved = true
        resolvePromise(res)
      }
    }

    try {
      if (!detection.isDevSource && detection.path && fs.existsSync(detection.path)) {
        const child = spawn(detection.path, [], {
          detached: true,
          stdio: 'ignore'
        })
        child.on('error', (err) => {
          markResolved({
            success: false,
            message: `Başlatma hatası: ${err.message}`
          })
        })
        child.on('exit', (code) => {
          if (code !== null && code !== 0) {
            markResolved({
              success: false,
              message: `TEMİN 360 başlatılamadı ve kapandı (Çıkış kodu: ${code}).`
            })
          }
        })
        setTimeout(() => {
          child.unref()
          markResolved({
            success: true,
            message: `TEMİN 360 masaüstü uygulaması başlatıldı (${basename(detection.path!)}).`
          })
        }, 500)
        return
      }

      const repoRoot = getRepoRoot()
      const pnpmCmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
      const child = spawn(pnpmCmd, ['--filter', 'app-desktop', 'dev'], {
        cwd: repoRoot,
        shell: true,
        detached: true,
        stdio: 'ignore'
      })
      child.on('error', (err) => {
        markResolved({
          success: false,
          message: `Geliştirici modu başlatma hatası: ${err.message}`
        })
      })
      child.on('exit', (code) => {
        if (code !== null && code !== 0) {
          markResolved({
            success: false,
            message: `TEMİN 360 geliştirici süreci sonlandı (Çıkış kodu: ${code}).`
          })
        }
      })
      setTimeout(() => {
        child.unref()
        markResolved({
          success: true,
          message: 'TEMİN 360 geliştirici modunda (pnpm dev) başlatılıyor...'
        })
      }, 600)
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      markResolved({
        success: false,
        message: `Başlatma hatası: ${errorMsg}`
      })
    }
  })
}

async function launchApp(appId: string): Promise<{ success: boolean; message: string }> {
  if (appId === 'dev.ilyasbozdemir.temin360') {
    return await launchTemin360()
  }

  const detection = detectApp(appId)

  // 1) Kurulu çalıştırılabilir dosya (yalnızca gerçek bir DOSYA ise spawn edilir)
  if (
    detection.installed &&
    detection.path &&
    fs.existsSync(detection.path) &&
    fs.statSync(detection.path).isFile()
  ) {
    return new Promise((resolvePromise) => {
      let resolved = false
      const finish = (res: { success: boolean; message: string }): void => {
        if (!resolved) {
          resolved = true
          resolvePromise(res)
        }
      }
      try {
        const child = spawn(detection.path!, [], { detached: true, stdio: 'ignore' })
        child.on('error', (err) => finish({ success: false, message: `Başlatma hatası: ${err.message}` }))
        child.on('exit', (code) => {
          if (code !== null && code !== 0) {
            finish({ success: false, message: `${appId} başlatılamadı (çıkış kodu: ${code}).` })
          }
        })
        setTimeout(() => {
          child.unref()
          finish({ success: true, message: `${appId} başlatıldı.` })
        }, 500)
      } catch (err: unknown) {
        finish({
          success: false,
          message: `Başlatma hatası: ${err instanceof Error ? err.message : String(err)}`
        })
      }
    })
  }

  // 2) Kaynak koddan geliştirici modunda başlatma (paketin kendi dev script'i ile)
  if (detection.sourceAvailable && detection.launchable && detection.packageName) {
    return new Promise((resolvePromise) => {
      let resolved = false
      const finish = (res: { success: boolean; message: string }): void => {
        if (!resolved) {
          resolved = true
          resolvePromise(res)
        }
      }
      try {
        const pnpmCmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
        const child = spawn(pnpmCmd, ['--filter', detection.packageName!, 'dev'], {
          cwd: getRepoRoot(),
          shell: true,
          detached: true,
          stdio: 'ignore'
        })
        child.on('error', (err) =>
          finish({ success: false, message: `Geliştirici modu başlatma hatası: ${err.message}` })
        )
        child.on('exit', (code) => {
          if (code !== null && code !== 0) {
            finish({
              success: false,
              message: `${appId} geliştirici süreci sonlandı (çıkış kodu: ${code}).`
            })
          }
        })
        setTimeout(() => {
          child.unref()
          finish({
            success: true,
            message: `${appId} geliştirici modunda (pnpm --filter ${detection.packageName} dev) başlatılıyor...`
          })
        }, 600)
      } catch (err: unknown) {
        finish({
          success: false,
          message: `Başlatma hatası: ${err instanceof Error ? err.message : String(err)}`
        })
      }
    })
  }

  if (detection.sourceAvailable) {
    return {
      success: false,
      message: `${appId} için kaynak kodu var ancak başlatılabilir bir "dev" script'i tanımlı değil.`
    }
  }

  return {
    success: false,
    message: `${appId} bulunamadı veya henüz yayınlanmadı.`
  }
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 980,
    minHeight: 640,
    show: false,
    autoHideMenuBar: true,
    title: 'Workspace 360 — WorkSuite 360 Merkezi Çalışma Alanı',
    icon: getIconPath(),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function registerIpcHandlers(): void {
  ipcMain.handle('workspace:launch-app', async (_event, appId: string) => {
    return await launchApp(appId)
  })

  ipcMain.handle('workspace:check-app', async (_event, appId: string) => {
    return detectApp(appId)
  })

  ipcMain.handle('workspace:get-system-info', async () => {
    return {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.versions.node,
      electronVersion: process.versions.electron
    }
  })

  ipcMain.on('window:minimize', () => {
    mainWindow?.minimize()
  })

  ipcMain.on('window:maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow?.maximize()
    }
  })

  ipcMain.on('window:close', () => {
    mainWindow?.close()
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('dev.ilyasbozdemir.workspace360')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerIpcHandlers()
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
