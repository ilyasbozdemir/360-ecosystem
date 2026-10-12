import React from "react";
import { PackageOpen } from "lucide-react";
import { useModulMagazasiLogic } from "./hooks/useModulMagazasiLogic";
import { ModulMagazasiHeader } from "./components/ModulMagazasiHeader";
import { ModulCard } from "./components/ModulCard";
import { ModulDetailModal } from "./components/ModulDetailModal";

export const ModulMagazasiScreen: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    activeKategori,
    setActiveKategori,
    activeDetailModul,
    setActiveDetailModul,
    isInstalled,
    toggleInstall,
    filteredModuller,
    stats,
  } = useModulMagazasiLogic();

  return (
    <div className="min-h-full p-6 md:p-8 space-y-8 max-w-8xl mx-auto">
      {/* Üst Başlık, Arama ve Filtreler */}
      <ModulMagazasiHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeKategori={activeKategori}
        onSelectKategori={setActiveKategori}
        stats={stats}
      />

      {/* Modül Kartları Izgarası */}
      {filteredModuller.length > 0
        ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModuller.map((modul) => (
              <ModulCard
                key={modul.id}
                modul={modul}
                isInstalled={isInstalled(modul.id)}
                onToggleInstall={toggleInstall}
                onOpenDetail={setActiveDetailModul}
              />
            ))}
          </div>
        )
        : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
            <PackageOpen className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-300">
              Aramanıza Uygun Modül Bulunamadı
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
              Farklı anahtar kelimeler ile arama yapabilir veya kategori
              filtresini &apos;Tüm Modüller&apos; olarak seçebilirsiniz.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveKategori("tum");
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        )}

      {/* Detay & Belge İnceleme Modalı */}
      <ModulDetailModal
        modul={activeDetailModul}
        isInstalled={activeDetailModul
          ? isInstalled(activeDetailModul.id)
          : false}
        onClose={() => setActiveDetailModul(null)}
        onToggleInstall={toggleInstall}
      />
    </div>
  );
};

export default ModulMagazasiScreen;
