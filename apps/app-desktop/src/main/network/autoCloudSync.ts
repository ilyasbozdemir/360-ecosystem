import fs from 'fs'
import { basename } from 'path'
import nodemailer from 'nodemailer'
import { workspaceManager } from '../database/workspace'
import { getSmtpSetting } from '../utils/settingsHelper'

export async function performAutoCloudSync(): Promise<void> {
  try {
    const db = workspaceManager.getDb()
    if (!db) return
    const urlRow = db.prepare("SELECT value FROM settings WHERE key = 'sync_server_url'").get() as
      | { value: string }
      | undefined
    const tokenRow = db
      .prepare("SELECT value FROM settings WHERE key = 'sync_server_token'")
      .get() as { value: string } | undefined

    const syncUrl = urlRow?.value
    const syncToken = tokenRow?.value

    let dosyalar: unknown[] = []
    const dCheck = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='dosyalar'")
      .get()
    if (dCheck) {
      dosyalar = db.prepare('SELECT * FROM dosyalar LIMIT 100').all()
    }

    // 1. Bulut API Eşitlemesi
    if (syncUrl) {
      const cleanUrl = String(syncUrl).trim().replace(/\/+$/, '')
      const fullUrl = `${cleanUrl}/api/sync`

      await fetch(fullUrl, {
        method: 'POST',
        headers: {
          Authorization: syncToken ? `Bearer ${syncToken}` : 'Bearer dta_desktop_client',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'auto-sync-on-close',
          dosyalar,
          syncedAt: new Date().toISOString()
        })
      }).catch(() => {})
    }

    // 2. Otomatik E-Posta Yedeklemesi (Dosyada güncelleme varsa SMTP üzerinden yollar)
    try {
      if (!workspaceManager.hasChanges('email')) {
        console.log(
          '[AutoCloudSync] Dosyada değişiklik bulunmadığı için otomatik e-posta gönderimi atlandı.'
        )
      } else {
        const host = getSmtpSetting('smtpHost', 'smtp_host')
        const user = getSmtpSetting('smtpUser', 'smtp_user')
        const pass = getSmtpSetting('smtpPass', 'smtp_pass')
        const portStr = getSmtpSetting('smtpPort', 'smtp_port')
        const receiver = getSmtpSetting('smtpReceiver', 'smtp_receiver') || user
        const secureStr = getSmtpSetting('smtpSecure', 'smtp_secure')

        if (host && user && pass) {
          const port = parseInt(portStr || '587') || 587
          const actualSecure = port === 465 ? true : port === 587 ? false : secureStr === 'true'

          const transporter = nodemailer.createTransport({
            host: host,
            port,
            secure: actualSecure,
            auth: {
              user: user,
              pass: pass
            },
            tls: { rejectUnauthorized: false }
          })

          const curFile = workspaceManager.getCurrentFilePath()
          const attachments =
            curFile && fs.existsSync(curFile)
              ? [{ filename: basename(curFile), path: curFile }]
              : []

          await transporter.sendMail({
            from: `"TEMİN 360 Otomatik Kapanış Yedeği" <${user}>`,
            to: receiver,
            subject: `TEMİN 360 Otomatik Veritabanı Yedeği - ${new Date().toLocaleDateString('tr-TR')}`,
            text: `Uygulama kapatılırken otomatik veritabanı yedeğiniz alınmıştır.\nAktarılan dosya sayısı: ${dosyalar.length}\nTarih: ${new Date().toLocaleString('tr-TR')}`,
            attachments
          })
          workspaceManager.markSynced('email')
        }
      }
    } catch {
      // Non-blocking mail fail-safe
    }

    // 3. Otomatik Google Drive Bulut Yedeklemesi (Dosyada güncelleme varsa son 7 sürümü saklar ve eskileri temizler)
    try {
      if (!workspaceManager.hasChanges('gdrive')) {
        console.log(
          '[AutoCloudSync] Dosyada değişiklik bulunmadığı için Google Drive yüklemesi atlandı.'
        )
      } else {
        const gdriveRow = db
          .prepare("SELECT value FROM settings WHERE key = 'gdriveAccessToken'")
          .get() as { value?: string } | undefined
        let token = gdriveRow?.value
        if (!token) {
          try {
            const refreshRow = db
              .prepare("SELECT value FROM settings WHERE key = 'gdriveRefreshToken'")
              .get() as { value?: string } | undefined
            const clientIdRow = db
              .prepare("SELECT value FROM settings WHERE key = 'gdriveClientId'")
              .get() as { value?: string } | undefined
            const clientSecretRow = db
              .prepare("SELECT value FROM settings WHERE key = 'gdriveClientSecret'")
              .get() as { value?: string } | undefined
            if (refreshRow?.value && clientIdRow?.value && clientSecretRow?.value) {
              const res = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                  client_id: clientIdRow.value.trim(),
                  client_secret: clientSecretRow.value.trim(),
                  refresh_token: refreshRow.value.trim(),
                  grant_type: 'refresh_token'
                }).toString()
              })
              if (res.ok) {
                const data = (await res.json()) as { access_token?: string }
                if (data.access_token) {
                  token = data.access_token
                  db.prepare(
                    "INSERT OR REPLACE INTO settings (key, value) VALUES ('gdriveAccessToken', ?)"
                  ).run(token)
                }
              }
            }
          } catch (tErr) {
            console.warn('[AutoCloudSync] Token refresh error:', tErr)
          }
        }
        const curFile = workspaceManager.getCurrentFilePath()
        if (token && curFile && fs.existsSync(curFile)) {
          const cleanToken = String(token)
            .trim()
            .replace(/^["']|["']$/g, '')
            .replace(/^Bearer\s+/i, '')
            .replace(/[\r\n\s]+/g, '')

          // Find or create TEMIN_360_YEDEKLER folder
          const folderName = 'TEMIN_360_YEDEKLER'
          const folderQuery = encodeURIComponent(
            `mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}' and trashed = false`
          )
          let folderId = ''
          const searchRes = await fetch(
            `https://www.googleapis.com/drive/v3/files?q=${folderQuery}&fields=files(id,name)`,
            {
              headers: { Authorization: `Bearer ${cleanToken}` }
            }
          )
          if (searchRes.ok) {
            const sData = (await searchRes.json()) as { files?: Array<{ id: string }> }
            if (sData.files && sData.files.length > 0) folderId = sData.files[0].id
          }
          if (!folderId) {
            const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${cleanToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
                description: 'TEMİN 360 Otomatik Kapanış Bulut Yedekleri'
              })
            })
            if (createRes.ok) {
              const cData = (await createRes.json()) as { id: string }
              folderId = cData.id
            }
          }

          if (folderId) {
            const fileName = basename(curFile)
            const fileData = fs.readFileSync(curFile)
            const now = new Date()
            const dateStr = now.toISOString().slice(0, 10)
            const timeStr = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`
            const rawBase = fileName
              .replace(/\.dtal$/i, '')
              .replace(/_\d{4}-\d{2}-\d{2}_\\d{2}-\\d{2}$/, '')
            const backupFileName = `${rawBase}_${dateStr}_${timeStr}.dtal`

            const boundary = '--------------------------' + Date.now().toString(16)
            const metadata = JSON.stringify({
              name: backupFileName,
              description: `TEMİN 360 Kapanış Otomatik Yedeği (${new Date().toLocaleString('tr-TR')})`,
              parents: [folderId]
            })

            const metadataBuffer = Buffer.from(
              `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`,
              'utf-8'
            )
            const fileHeaderBuffer = Buffer.from(
              `--${boundary}\r\nContent-Type: application/octet-stream\r\n\r\n`,
              'utf-8'
            )
            const closingBuffer = Buffer.from(`\r\n--${boundary}--`, 'utf-8')
            const multipartBody = Buffer.concat([
              metadataBuffer,
              fileHeaderBuffer,
              fileData,
              closingBuffer
            ])

            await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${cleanToken}`,
                'Content-Type': `multipart/related; boundary=${boundary}`
              },
              body: multipartBody
            })

            workspaceManager.markSynced('gdrive')

            // Prune: keep last 7 versions
            const qList = encodeURIComponent(
              `'${folderId}' in parents and trashed = false and (name contains '.dtal' or name contains '.hkmp')`
            )
            const listRes = await fetch(
              `https://www.googleapis.com/drive/v3/files?q=${qList}&fields=files(id,name,createdTime)&orderBy=createdTime%20desc`,
              {
                headers: { Authorization: `Bearer ${cleanToken}` }
              }
            )
            if (listRes.ok) {
              const lData = (await listRes.json()) as { files?: Array<{ id: string }> }
              const files = lData.files || []
              if (files.length > 7) {
                const toDel = files.slice(7)
                for (const f of toDel) {
                  await fetch(`https://www.googleapis.com/drive/v3/files/${f.id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${cleanToken}` }
                  }).catch(() => {})
                }
              }
            }
          }
        }
      }
    } catch {
      // Non-blocking gdrive fail-safe
    }
  } catch {
    // Non-blocking fail-safe
  }
}
