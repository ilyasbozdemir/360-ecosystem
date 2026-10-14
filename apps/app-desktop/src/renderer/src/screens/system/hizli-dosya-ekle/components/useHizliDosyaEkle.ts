import { useState, useRef, useCallback, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  DosyaRow,
  emptyRow,
  reverseMapTur,
  reverseMapStatus,
  mapStatus,
  mapTur
} from './hizliDosyaEkle.types'

export function useHizliDosyaEkle() {
  const queryClient = useQueryClient()
  const [rows, setRows] = useState<DosyaRow[]>([])
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    inserted: number
    updated: number
    errors: string[]
  } | null>(null)
  const [loadLimit, setLoadLimit] = useState(50)
  const tableRef = useRef<HTMLDivElement>(null)

  const updateRow = (key: string, field: keyof DosyaRow, value: string) => {
    setRows((prev) =>
      prev.map((r) => (r._key === key ? { ...r, [field]: value, _dirty: true } : r))
    )
  }

  const addRow = () => {
    setRows((prev) => [...prev, emptyRow()])
    setTimeout(() => {
      tableRef.current?.scrollTo({
        top: tableRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }, 50)
  }

  const removeRow = async (row: DosyaRow) => {
    const isPersisted = row.id !== null
    const hasData =
      row.dosya_no.trim() || row.dt_no.trim() || row.dosya_adi.trim() || row.aciklama.trim()

    if (isPersisted) {
      if (
        !confirm(
          `"${
            row.dosya_adi || 'Dosya'
          }" kaydını veritabanından tamamen silmek istediğinize emin misiniz?`
        )
      ) {
        return
      }
      setIsSaving(true)
      try {
        const res = await window.electron.ipcRenderer.invoke(
          'db:run',
          'UPDATE DATA_TeminDosyasi SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [row.id]
        )
        if (res.success) {
          queryClient.invalidateQueries({ queryKey: ['dosyalar'] })
        } else {
          alert('Silme işlemi başarısız oldu: ' + res.error)
          return
        }
      } catch (err: unknown) {
        alert('Hata: ' + (err instanceof Error ? err.message : String(err)))
        return
      } finally {
        setIsSaving(false)
      }
    } else if (hasData) {
      if (
        !confirm(
          'Satırdaki doldurulmuş verileri iptal edip satırı silmek istediğinize emin misiniz?'
        )
      ) {
        return
      }
    }

    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r._key !== row._key) : [emptyRow()]))
    setSelectedKeys((prev) => {
      const next = new Set(prev)
      next.delete(row._key)
      return next
    })
  }

  const loadExisting = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await window.electron.ipcRenderer.invoke(
        'db:query',
        `SELECT id, temin_no, ekap_no, konu, isin_aciklamasi, ihale_tipi, ihale_sekli, dosya_acilis_tarihi, status, tur
         FROM DATA_TeminDosyasi
         WHERE is_deleted = 0
         ORDER BY COALESCE(dosya_acilis_tarihi, created_at) DESC, id DESC
         LIMIT ?`,
        [loadLimit]
      )
      if (res.success) {
        const loaded: DosyaRow[] = res.data.map((d: any) => ({
          _key: Math.random().toString(36).slice(2),
          id: d.id,
          dosya_no: d.temin_no || '',
          dt_no: d.ekap_no || '',
          dosya_adi: d.konu || '',
          aciklama: d.isin_aciklamasi || '',
          ihale_turu: reverseMapTur(d.tur || 'mal'),
          ihale_sekli: d.ihale_sekli || '22/d',
          ihale_tarihi: d.dosya_acilis_tarihi || '',
          ihale_asamasi: reverseMapStatus(d.status || 'devam_ediyor'),
          _dirty: false
        }))
        setRows(loaded.length > 0 ? loaded : [emptyRow(), emptyRow(), emptyRow()])
        setSelectedKeys(new Set())
        setResult(null)
      } else {
        alert('Kayıtlar yüklenemedi: ' + res.error)
      }
    } catch (err: unknown) {
      alert('Hata: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setIsLoading(false)
    }
  }, [loadLimit])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadExisting()
    }, 0)
    return () => clearTimeout(timer)
  }, [loadExisting])

  const handleSave = async () => {
    const toProcess = rows.filter((r) => r.dosya_adi.trim() !== '' && r._dirty)
    const toInsert = toProcess.filter((r) => r.id === null)
    const toUpdate = toProcess.filter((r) => r.id !== null)

    if (toProcess.length === 0) {
      alert('Değiştirilmiş veya doldurulmuş satır yok.')
      return
    }

    setIsSaving(true)
    setResult(null)
    let insertCount = 0
    let updateCount = 0
    const errors: string[] = []

    for (const row of toInsert) {
      try {
        const res = await window.electron.ipcRenderer.invoke(
          'db:run',
          `INSERT INTO DATA_TeminDosyasi
            (temin_no, ekap_no, konu, isin_aciklamasi, ihale_tipi, ihale_sekli, dosya_acilis_tarihi, status, tur, is_deleted)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
          [
            row.dosya_no || null,
            row.dt_no || null,
            row.dosya_adi.trim(),
            row.aciklama || null,
            row.ihale_turu || 'Mal',
            row.ihale_sekli || null,
            row.ihale_tarihi || null,
            mapStatus(row.ihale_asamasi),
            mapTur(row.ihale_turu)
          ]
        )
        if (res.success) {
          insertCount++
        } else {
          errors.push(`EKLE "${row.dosya_adi}" - ${res.error}`)
        }
      } catch (err: unknown) {
        errors.push(`EKLE "${row.dosya_adi}" - ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    for (const row of toUpdate) {
      try {
        const res = await window.electron.ipcRenderer.invoke(
          'db:run',
          `UPDATE DATA_TeminDosyasi SET
            temin_no = ?, ekap_no = ?, konu = ?, isin_aciklamasi = ?,
            ihale_tipi = ?, ihale_sekli = ?, dosya_acilis_tarihi = ?,
            status = ?, tur = ?, updated_at = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [
            row.dosya_no || null,
            row.dt_no || null,
            row.dosya_adi.trim(),
            row.aciklama || null,
            row.ihale_turu || 'Mal',
            row.ihale_sekli || null,
            row.ihale_tarihi || null,
            mapStatus(row.ihale_asamasi),
            mapTur(row.ihale_turu),
            row.id
          ]
        )
        if (res.success) {
          updateCount++
          setRows((prev) => prev.map((r) => (r._key === row._key ? { ...r, _dirty: false } : r)))
        } else {
          errors.push(`GÜNCELLE "${row.dosya_adi}" - ${res.error}`)
        }
      } catch (err: unknown) {
        errors.push(
          `GÜNCELLE "${row.dosya_adi}" - ${err instanceof Error ? err.message : String(err)}`
        )
      }
    }

    setResult({ inserted: insertCount, updated: updateCount, errors })
    setIsSaving(false)

    if (insertCount > 0) {
      queryClient.invalidateQueries({ queryKey: ['dosyalar'] })
      const erroredNames = new Set(
        errors.filter((e) => e.startsWith('EKLE')).map((e) => e.split('"')[1])
      )
      setRows((prev) =>
        prev.filter(
          (r) => r.id !== null || r.dosya_adi.trim() === '' || erroredNames.has(r.dosya_adi.trim())
        )
      )
    }
    if (updateCount > 0) {
      queryClient.invalidateQueries({ queryKey: ['dosyalar'] })
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const lines = text.trim().split('\n').filter(Boolean)
      const newRows: DosyaRow[] = lines.map((line) => {
        const c = line.split('\t')
        return {
          _key: Math.random().toString(36).slice(2),
          id: null,
          dosya_no: c[0]?.trim() || '',
          dt_no: c[1]?.trim() || '',
          dosya_adi: c[2]?.trim() || '',
          aciklama: c[3]?.trim() || '',
          ihale_turu: c[4]?.trim() || 'Mal',
          ihale_sekli: c[5]?.trim() || '22/d',
          ihale_tarihi: c[6]?.trim() || '',
          ihale_asamasi: c[7]?.trim() || 'Hazırlık',
          _dirty: true
        }
      })
      if (newRows.length > 0) {
        setRows((prev) => {
          const allEmpty = prev.every((r) => r.dosya_adi === '' && r.id === null)
          return allEmpty ? newRows : [...prev, ...newRows]
        })
      }
    } catch {
      alert('Pano okuma başarısız.')
    }
  }

  const toggleSelectRow = (key: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const toggleSelectAll = () => {
    const validRows = rows.filter((r) => r.dosya_adi.trim() !== '')
    if (selectedKeys.size === validRows.length && validRows.length > 0) {
      setSelectedKeys(new Set())
    } else {
      setSelectedKeys(new Set(validRows.map((r) => r._key)))
    }
  }

  const handleBulkDelete = async () => {
    const selectedRows = rows.filter((r) => selectedKeys.has(r._key))
    const idsToDelete = selectedRows.map((r) => r.id).filter((id): id is number => id !== null)

    if (idsToDelete.length === 0) {
      if (
        !confirm('Seçilen kaydedilmemiş satırları listeden kaldırmak istediğinize emin misiniz?')
      ) {
        return
      }
      setRows((prev) => prev.filter((r) => !selectedKeys.has(r._key)))
      setSelectedKeys(new Set())
      return
    }

    if (
      !confirm(
        `Seçilen ${idsToDelete.length} dosyayı veritabanından tamamen silmek istediğinize emin misiniz?`
      )
    ) {
      return
    }

    setIsSaving(true)
    let deletedCount = 0
    const errors: string[] = []

    for (const id of idsToDelete) {
      try {
        const res = await window.electron.ipcRenderer.invoke(
          'db:run',
          'UPDATE DATA_TeminDosyasi SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [id]
        )
        if (res.success) {
          deletedCount++
        } else {
          errors.push(`ID #${id} silinemedi: ${res.error}`)
        }
      } catch (err: unknown) {
        errors.push(`ID #${id} silinemedi: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    setIsSaving(false)
    queryClient.invalidateQueries({ queryKey: ['dosyalar'] })

    setRows((prev) => prev.filter((r) => r.id === null || !idsToDelete.includes(r.id)))
    setSelectedKeys(new Set())

    if (errors.length > 0) {
      alert('Bazı dosyalar silinirken hata oluştu:\n' + errors.join('\n'))
    } else {
      alert(`${deletedCount} dosya başarıyla silindi.`)
    }
  }

  const handleBulkChangeAsama = (newAsama: string) => {
    setRows((prev) =>
      prev.map((r) =>
        selectedKeys.has(r._key) ? { ...r, ihale_asamasi: newAsama, _dirty: true } : r
      )
    )
  }

  const handleBulkChangeTur = (newTur: string) => {
    setRows((prev) =>
      prev.map((r) => (selectedKeys.has(r._key) ? { ...r, ihale_turu: newTur, _dirty: true } : r))
    )
  }

  const newCount = rows.filter((r) => r.dosya_adi.trim() !== '' && r.id === null && r._dirty).length
  const updateCount = rows.filter(
    (r) => r.dosya_adi.trim() !== '' && r.id !== null && r._dirty
  ).length
  const totalDirty = newCount + updateCount
  const validRowsCount = rows.filter((r) => r.dosya_adi.trim() !== '').length
  const isAllSelected = validRowsCount > 0 && selectedKeys.size === validRowsCount

  return {
    rows,
    setRows,
    selectedKeys,
    isSaving,
    isLoading,
    result,
    loadLimit,
    setLoadLimit,
    tableRef,
    updateRow,
    addRow,
    removeRow,
    loadExisting,
    handleSave,
    handlePaste,
    toggleSelectRow,
    toggleSelectAll,
    handleBulkDelete,
    handleBulkChangeAsama,
    handleBulkChangeTur,
    newCount,
    updateCount,
    totalDirty,
    validRowsCount,
    isAllSelected
  }
}
