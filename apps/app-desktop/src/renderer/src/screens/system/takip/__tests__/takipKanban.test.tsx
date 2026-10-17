import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TakipKanbanBoard } from '../components/TakipKanbanBoard'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { TeminDosyasi } from '../../../dosyalar/dosyalar.hooks'

const mockQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false }
  }
})

describe('TakipKanbanBoard (Issue #11)', () => {
  const mockDosyalar = [
    {
      id: 101,
      temin_no: '2026/1',
      konu: 'Kırtasiye ve Büro Malzemesi Alımı',
      tur: 'mal',
      durum_asama_id: 1,
      status: 'devam_ediyor',
      yaklasik_maliyet: 45000,
      birim_adi: 'Yazı İşleri Müdürlüğü',
      butce_yili: 2026,
      is_deleted: 0
    },
    {
      id: 102,
      temin_no: '2026/2',
      konu: 'Park ve Bahçeler Çim Biçme Hizmeti',
      tur: 'hizmet',
      durum_asama_id: 2,
      status: 'devam_ediyor',
      yaklasik_maliyet: 120000,
      birim_adi: 'Park ve Bahçeler Müdürlüğü',
      butce_yili: 2026,
      is_deleted: 0
    },
    {
      id: 103,
      temin_no: '2026/3',
      konu: 'İstinat Duvarı Yapım İşi',
      tur: 'yapim_isi',
      durum_asama_id: 3,
      status: 'devam_ediyor',
      yaklasik_maliyet: 350000,
      birim_adi: 'Fen İşleri Müdürlüğü',
      butce_yili: 2026,
      is_deleted: 0
    },
    {
      id: 104,
      temin_no: '2026/4',
      konu: 'Jeolojik Etüt ve Danışmanlık',
      tur: 'danismanlik',
      durum_asama_id: 4,
      status: 'tamamlandi',
      yaklasik_maliyet: 85000,
      birim_adi: 'İmar ve Şehircilik Müdürlüğü',
      butce_yili: 2026,
      is_deleted: 0
    }
  ]

  const mockSetActiveDosyaId = vi.fn()
  const mockOpenWizard = vi.fn()
  const mockOpenSurec = vi.fn()
  const mockEdit = vi.fn()
  const formatCurrency = (val: number): string => `${val.toLocaleString('tr-TR')} ₺`

  beforeEach(() => {
    vi.clearAllMocks()
    window.electron = {
      ipcRenderer: {
        invoke: vi.fn().mockResolvedValue({ success: true }),
        send: vi.fn(),
        on: vi.fn(),
        removeListener: vi.fn()
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any
  })

  const renderBoard = (dosyalar = mockDosyalar as unknown as TeminDosyasi[]): ReturnType<typeof render> => {
    return render(
      <QueryClientProvider client={mockQueryClient}>
        <TakipKanbanBoard
          dosyalar={dosyalar}
          activeDosyaId={101}
          setActiveDosyaId={mockSetActiveDosyaId}
          formatCurrency={formatCurrency}
          onOpenWizard={mockOpenWizard}
          onOpenSurec={mockOpenSurec}
          onEdit={mockEdit}
        />
      </QueryClientProvider>
    )
  }

  it('4 ana kanban sütununu doğru başlıklarla görüntüler', () => {
    renderBoard()

    expect(screen.getByText('Hazırlıkta')).toBeTruthy()
    expect(screen.getByText('Teklif Toplanıyor')).toBeTruthy()
    expect(screen.getByText('Onayda')).toBeTruthy()
    expect(screen.getByText('Tamamlandı')).toBeTruthy()
  })

  it('dosyaları durum_asama_id değerlerine göre ilgili sütunlara yerleştirir', () => {
    renderBoard()

    expect(screen.getByText('Kırtasiye ve Büro Malzemesi Alımı')).toBeTruthy()
    expect(screen.getByText('Park ve Bahçeler Çim Biçme Hizmeti')).toBeTruthy()
    expect(screen.getByText('İstinat Duvarı Yapım İşi')).toBeTruthy()
    expect(screen.getByText('Jeolojik Etüt ve Danışmanlık')).toBeTruthy()
  })

  it('arama kutusuna yazılan metne göre dosyaları süzer', () => {
    renderBoard()

    const searchInput = screen.getByPlaceholderText(/Konu, dosya no veya birim/i)
    fireEvent.change(searchInput, { target: { value: 'İstinat' } })

    expect(screen.getByText('İstinat Duvarı Yapım İşi')).toBeTruthy()
    expect(screen.queryByText('Kırtasiye ve Büro Malzemesi Alımı')).toBeNull()
  })

  it('alım türüne göre dosyaları filtreler', () => {
    renderBoard()

    const filterSelects = screen.getAllByRole('combobox')
    const turSelect = filterSelects[1] // Second select is Alım Türü
    fireEvent.change(turSelect, { target: { value: 'hizmet' } })

    expect(screen.getByText('Park ve Bahçeler Çim Biçme Hizmeti')).toBeTruthy()
    expect(screen.queryByText('Kırtasiye ve Büro Malzemesi Alımı')).toBeNull()
  })

  it('sürükle-bırak işlemiyle dosya aşamasını veritabanında günceller', async () => {
    renderBoard()

    // Column 2 is "Teklif Toplanıyor" (stageId: 2)
    // Simulate drop of file 101 into stage 2
    const dataTransfer = {
      getData: vi.fn().mockReturnValue('101'),
      setData: vi.fn()
    }

    const columnStage2 = screen.getByText('Teklif Toplanıyor').closest('div')
    expect(columnStage2).toBeTruthy()

    // Find container element that has onDrop
    const dropZone = screen.getByText('Piyasa Fiyat Araştırması').closest('[class*="min-h"]')
    if (dropZone) {
      fireEvent.drop(dropZone, { dataTransfer })

      await waitFor(() => {
        expect(window.electron.ipcRenderer.invoke).toHaveBeenCalledWith(
          'db:run',
          expect.stringContaining('UPDATE DATA_TeminDosyasi SET durum_asama_id = ?'),
          [2, 'devam_ediyor', 101]
        )
      })
    }
  })

  it('Tamamlandı sütununa bırakılan dosyanın status alanını tamamlandi olarak günceller', async () => {
    renderBoard()

    const dataTransfer = {
      getData: vi.fn().mockReturnValue('101'),
      setData: vi.fn()
    }

    const dropZoneTamamlandi = screen.getByText('Kabul & Ödeme İşlemleri').closest('[class*="min-h"]')
    if (dropZoneTamamlandi) {
      fireEvent.drop(dropZoneTamamlandi, { dataTransfer })

      await waitFor(() => {
        expect(window.electron.ipcRenderer.invoke).toHaveBeenCalledWith(
          'db:run',
          expect.stringContaining('UPDATE DATA_TeminDosyasi SET durum_asama_id = ?'),
          [4, 'tamamlandi', 101]
        )
      })
    }
  })

  it('Yeni Dosya Sihirbazı butonuna tıklandığında onOpenWizard tetiklenir', () => {
    renderBoard()

    const wizardBtn = screen.getByRole('button', { name: /Yeni Dosya Sihirbazı/i })
    fireEvent.click(wizardBtn)

    expect(mockOpenWizard).toHaveBeenCalledWith(1)
  })
})
