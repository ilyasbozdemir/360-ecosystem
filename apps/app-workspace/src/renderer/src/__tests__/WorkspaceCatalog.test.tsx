import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App.js'

describe('Workspace 360 - Uygulama Kataloğu ve Başlatıcı', () => {
  it('ana başlığı, ekosistem afişini ve başlangıç uygulamalarını görüntülemelidir', () => {
    render(<App />)
    expect(screen.getAllByText('Workspace 360').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Temin 360 Koruma Altında')).toBeDefined()
    expect(screen.getByText('Birleşik Dosya 360')).toBeDefined()

    // Temin 360 kartı görünmeli
    expect(screen.getByText('TEMİN 360')).toBeDefined()
    // Dosya 360 kartı görünmeli
    expect(screen.getByText('Dosya 360')).toBeDefined()
  })

  it('Temin 360 için Yüklü/Hazır durumu ve Başlat butonu sunmalıdır', () => {
    render(<App />)
    const launchBtns = screen.getAllByText('Başlat')
    expect(launchBtns.length).toBeGreaterThanOrEqual(1)

    // Temin 360'a ait Başlat butonuna tıklandığında bildirim toast'ı tetiklenmeli
    fireEvent.click(launchBtns[0])
    expect(screen.getByText(/başlatılıyor/i)).toBeDefined()
  })

  it('Dosya 360 için planlandı durumu, modülleri ve devre dışı işlem sunmalıdır', () => {
    render(<App />)
    // Dosya 360 kartı ve modülleri
    expect(screen.getAllByText(/Hızlı Arama/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Etiketler ve Koleksiyonlar/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Yinelenen Dosyalar/i).length).toBeGreaterThanOrEqual(1)

    // Kuruluma hazır değil butonu
    const notReadyBtns = screen.getAllByText('Kuruluma Hazır Değil')
    expect(notReadyBtns.length).toBeGreaterThan(0)
  })

  it('kategori filtrelemesi yapıldığında yalnızca ilgili uygulamalar listelenmelidir', () => {
    render(<App />)
    // Kamu Alımları & İhale butonuna bas
    const catBtn = screen.getByRole('button', { name: 'Kamu Alımları & İhale' })
    fireEvent.click(catBtn)

    expect(screen.getByText('TEMİN 360')).toBeDefined()
    expect(screen.queryByText('Harita 360')).toBeNull()
  })

  it('durum filtresi (Yüklü / Hazır) seçildiğinde planlanan uygulamalar gizlenmelidir', () => {
    render(<App />)
    const installedFilter = screen.getByRole('button', { name: /Yüklü \/ Hazır/i })
    fireEvent.click(installedFilter)

    expect(screen.getByText('TEMİN 360')).toBeDefined()
    expect(screen.queryByText('Dosya 360')).toBeNull()
  })

  it('manifesto inceleme butonuna tıklandığında detay modalı açılmalıdır', () => {
    render(<App />)
    const inspectBtns = screen.getAllByText('Manifesto')
    fireEvent.click(inspectBtns[0])

    expect(screen.getByText(/Doğrulanmış Yerel Uygulama Tanımı/i)).toBeDefined()
    expect(screen.getByText(/Windows App ID/i)).toBeDefined()

    // Kapatma butonu
    const closeBtns = screen.getAllByRole('button', { name: 'Kapat' })
    fireEvent.click(closeBtns[0])
    expect(screen.queryByText(/Doğrulanmış Yerel Uygulama Tanımı/i)).toBeNull()
  })
})
