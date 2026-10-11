import React from 'react'
import { useHizliDosyaEkle } from './components/hizli-dosya-ekle/useHizliDosyaEkle'
import { HizliDosyaEkleHeader } from './components/hizli-dosya-ekle/HizliDosyaEkleHeader'
import { HizliDosyaEkleBulkBar } from './components/hizli-dosya-ekle/HizliDosyaEkleBulkBar'
import { HizliDosyaEkleTable } from './components/hizli-dosya-ekle/HizliDosyaEkleTable'

export default function HizliDosyaEkleScreen(): React.JSX.Element {
  const {
    rows,
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
    isAllSelected
  } = useHizliDosyaEkle()

  return (
    <div className="flex flex-col gap-5 h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <HizliDosyaEkleHeader
        loadLimit={loadLimit}
        setLoadLimit={setLoadLimit}
        isLoading={isLoading}
        loadExisting={loadExisting}
        handlePaste={handlePaste}
        addRow={addRow}
        handleSave={handleSave}
        isSaving={isSaving}
        totalDirty={totalDirty}
        newCount={newCount}
        updateCount={updateCount}
      />

      {/* Toplu İşlem Paneli */}
      <HizliDosyaEkleBulkBar
        selectedCount={selectedKeys.size}
        handleBulkChangeAsama={handleBulkChangeAsama}
        handleBulkChangeTur={handleBulkChangeTur}
        handleBulkDelete={handleBulkDelete}
      />

      {/* Tablo ve Sonuç */}
      <HizliDosyaEkleTable
        rows={rows}
        selectedKeys={selectedKeys}
        isAllSelected={isAllSelected}
        toggleSelectAll={toggleSelectAll}
        toggleSelectRow={toggleSelectRow}
        updateRow={updateRow}
        removeRow={removeRow}
        addRow={addRow}
        result={result}
        tableRef={tableRef}
      />
    </div>
  )
}
