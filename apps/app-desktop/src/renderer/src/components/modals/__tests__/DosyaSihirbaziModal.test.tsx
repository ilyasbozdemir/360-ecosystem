/* eslint-disable */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DosyaSihirbaziModal } from '../DosyaSihirbaziModal'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const mockQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false }
  }
})

describe('DosyaSihirbaziModal (Issue #9)', () => {
  const mockOnClose = vi.fn()
  const mockOnSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    window.electron = {
      ipcRenderer: {
        invoke: vi.fn().mockImplementation((channel, sql) => {
          if (sql.includes('TANIM_Birim')) {
            return Promise.resolve({
              success: true,
              data: [
                { id: 1, birim_adi: 'Fen İşleri Müdürlüğü' },
                { id: 2, birim_adi: 'Bilgi İşlem Müdürlüğü' }
              ]
            })
          }
          if (sql.includes('TANIM_Personel')) {
            return Promise.resolve({
              success: true,
              data: [
                { id: 1, ad_soyad: 'Ahmet Yılmaz', unvan: 'Müdür' },
                { id: 2, ad_soyad: 'Mehmet Demir', unvan: 'Mühendis' }
              ]
            })
          }
          if (sql.includes('TANIM_KikLimitDonemleri')) {
            return Promise.resolve({
              success: true,
              data: [
                {
                  id: 1,
                  donem_kodu: '2026-1',
                  baslangic_tarihi: '2026-01-01',
                  bitis_tarihi: '2026-12-31',
                  buyuksehir_limit: 1021827.0,
                  diger_limit: 340391.0
                }
              ]
            })
          }
          if (sql.includes('PRAGMA table_info')) {
            return Promise.resolve({
              success: true,
              data: [
                { name: 'id' },
                { name: 'temin_no' },
                { name: 'konu' },
                { name: 'tur' },
                { name: 'butce_yili' },
                { name: 'dosya_acilis_tarihi' },
                { name: 'birim_id' },
                { name: 'birim' },
                { name: 'ihale_sekli' },
                { name: 'ihale_tipi' },
                { name: 'yaklasik_maliyet' },
                { name: 'yaklasik_maliyet_kdv_dahil_mi' },
                { name: 'kdv' },
                { name: 'ihtiyac_yeri' },
                { name: 'teslim_gun' },
                { name: 'irtibat_yetkilisi_id' },
                { name: 'onay_personel_id' },
                { name: 'notlar' },
                { name: 'durum_asama_id' },
                { name: 'status' },
                { name: 'is_deleted' },
                { name: 'komisyon_seed_edildi' }
              ]
            })
          }
          if (sql.includes('INSERT INTO DATA_TeminDosyasi')) {
            return Promise.resolve({
              success: true,
              lastInsertRowid: 201
            })
          }
          return Promise.resolve({ success: true, data: [] })
        }),
        send: vi.fn(),
        on: vi.fn(),
        removeListener: vi.fn()
      }
    } as any
  })

  const renderModal = (isOpen = true) => {
    return render(
      <QueryClientProvider client={mockQueryClient}>
        <DosyaSihirbaziModal
          isOpen={isOpen}
          onClose={mockOnClose}
          initialStage={1}
          onSuccess={mockOnSuccess}
        />
      </QueryClientProvider>
    )
  }

  it('modal açıldığında ilk adımı (Temel Bilgiler) gösterir', () => {
    renderModal()

    expect(screen.getByText('Doğrudan Temin Dosyası Oluşturma Sihirbazı')).toBeTruthy()
    expect(screen.getByText('Alım Türü Seçiniz')).toBeTruthy()
    expect(screen.getByText('Bütçe Yılı')).toBeTruthy()
  })

  it('konu (İşin Adı) boş bırakıldığında sonraki adıma geçişi engeller ve uyarı verir', () => {
    renderModal()

    const nextBtn = screen.getByRole('button', { name: /İleri/i })
    fireEvent.click(nextBtn)

    expect(screen.getByText(/Lütfen doğrudan temin konusunu/i)).toBeTruthy()
  })

  it('konu girilip İleri tıklandığında Adım 2 (Mevzuat & Limit Kontrolü) ekranına geçer', async () => {
    renderModal()

    const konuInput = screen.getByPlaceholderText(/Örn: Hizmet Binaları İçin/i)
    fireEvent.change(konuInput, { target: { value: 'Büro Malzemesi Alımı' } })

    const nextBtn = screen.getByRole('button', { name: /İleri/i })
    fireEvent.click(nextBtn)

    await waitFor(() => {
      expect(screen.getByText(/Tahmini \/ Yaklaşık Maliyet/i)).toBeTruthy()
      expect(screen.getByText(/KİK 22\/d Bütçe Limit Kontrolü/i)).toBeTruthy()
    })
  })

  it('KİK 22/d limitini aşan bir yaklaşık maliyet girildiğinde limit aşım uyarısı gösterir', async () => {
    renderModal()

    // Step 1
    const konuInput = screen.getByPlaceholderText(/Örn: Hizmet Binaları İçin/i)
    fireEvent.change(konuInput, { target: { value: 'Büyük Bütçeli Araç Alımı' } })
    fireEvent.click(screen.getByRole('button', { name: /İleri/i }))

    // Step 2
    await waitFor(() => {
      expect(screen.getByText(/Tahmini \/ Yaklaşık Maliyet/i)).toBeTruthy()
    })

    const maliyetInput = screen.getByPlaceholderText(/Örn: 150000/i)
    // Enter 2.000.000 TL which exceeds the 1.021.827 TL threshold
    fireEvent.change(maliyetInput, { target: { value: '2000000' } })

    await waitFor(() => {
      expect(screen.getByText(/KİK 22\/d Parasal Limiti Aşıldı/i)).toBeTruthy()
    })
  })

  it('yasal limit dahilindeki tutarlarda onay rozeti görüntüler', async () => {
    renderModal()

    // Step 1
    const konuInput = screen.getByPlaceholderText(/Örn: Hizmet Binaları İçin/i)
    fireEvent.change(konuInput, { target: { value: 'Standart Malzeme Alımı' } })
    fireEvent.click(screen.getByRole('button', { name: /İleri/i }))

    // Step 2
    await waitFor(() => {
      expect(screen.getByText(/Tahmini \/ Yaklaşık Maliyet/i)).toBeTruthy()
    })

    const maliyetInput = screen.getByPlaceholderText(/Örn: 150000/i)
    // Enter 150.000 TL which is well within 1.021.827 TL
    fireEvent.change(maliyetInput, { target: { value: '150000' } })

    await waitFor(() => {
      expect(screen.getByText(/Tutar yasal limit dahilindedir/i)).toBeTruthy()
    })
  })

  it('tüm adımlar tamamlandığında dosyayı veritabanına ekler ve onSuccess callback çağırır', async () => {
    renderModal()

    // Step 1
    const konuInput = screen.getByPlaceholderText(/Örn: Hizmet Binaları İçin/i)
    fireEvent.change(konuInput, { target: { value: 'Bilgisayar ve Donanım Temini' } })
    await waitFor(() => {
      expect(screen.getByDisplayValue('Bilgisayar ve Donanım Temini')).toBeTruthy()
    })
    fireEvent.click(screen.getByRole('button', { name: /İleri/i }))

    // Step 2
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Örn: 150000/i)).toBeTruthy()
    })
    const maliyetInput = screen.getByPlaceholderText(/Örn: 150000/i)
    fireEvent.change(maliyetInput, { target: { value: '80000' } })
    await waitFor(() => {
      expect(screen.getByDisplayValue('80000')).toBeTruthy()
    })
    fireEvent.click(screen.getByRole('button', { name: /İleri/i }))

    // Step 3
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Örn: Fen İşleri Şantiyesi/i)).toBeTruthy()
    })
    fireEvent.click(screen.getByRole('button', { name: /İleri/i }))

    // Step 4
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Dosyayı Oluştur/i })).toBeTruthy()
    })

    const submitBtn = screen.getByRole('button', { name: /Dosyayı Oluştur/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(window.electron.ipcRenderer.invoke).toHaveBeenCalledWith(
        'db:run',
        expect.stringContaining('INSERT INTO DATA_TeminDosyasi'),
        expect.anything()
      )
      expect(mockOnSuccess).toHaveBeenCalledWith(201)
      expect(mockOnClose).toHaveBeenCalled()
    })
  })
})
