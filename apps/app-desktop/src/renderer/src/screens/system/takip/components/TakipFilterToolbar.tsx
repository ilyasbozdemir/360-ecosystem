import React from "react";
import { FilePlus2, Filter, Search, Sparkles, X } from "lucide-react";

export interface TakipFilterToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedYil: string;
  setSelectedYil: (yil: string) => void;
  selectedTur: string;
  setSelectedTur: (tur: string) => void;
  uniqueYillar: number[];
  totalCount?: number;
  filteredCount?: number;
  onOpenWizard?: (stageId?: number) => void;
}

export function TakipFilterToolbar({
  searchQuery,
  setSearchQuery,
  selectedYil,
  setSelectedYil,
  selectedTur,
  setSelectedTur,
  uniqueYillar,
  totalCount,
  filteredCount,
  onOpenWizard,
}: TakipFilterToolbarProps): React.JSX.Element {
  const isFiltered = searchQuery.trim() !== "" || selectedYil !== "all" ||
    selectedTur !== "all";

  const handleResetFilters = (): void => {
    setSearchQuery("");
    setSelectedYil("all");
    setSelectedTur("all");
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 rounded-2xl shadow-2xs">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Konu, dosya no veya birim adına göre ara..."
          className="w-full pl-9 pr-8 py-1.5 text-xs font-semibold bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            title="Aramayı Temizle"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Filters and Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Year Filter */}
        <select
          value={selectedYil}
          onChange={(e) => setSelectedYil(e.target.value)}
          className="px-2.5 py-1.5 text-xs font-semibold bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-slate-700 dark:text-slate-200 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          title="Bütçe Yılına Göre Filtrele"
        >
          <option value="all">Tüm Yıllar</option>
          {uniqueYillar.map((y) => (
            <option key={y} value={String(y)}>
              {y} Yılı
            </option>
          ))}
        </select>

        {/* Tur Filter */}
        <select
          value={selectedTur}
          onChange={(e) => setSelectedTur(e.target.value)}
          className="px-2.5 py-1.5 text-xs font-semibold bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-slate-700 dark:text-slate-200 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          title="Alım Türüne Göre Filtrele"
        >
          <option value="all">Tüm Alım Türleri</option>
          <option value="mal">Mal Alımı</option>
          <option value="hizmet">Hizmet Alımı</option>
          <option value="yapim_isi">Yapım İşi</option>
          <option value="danismanlik">Danışmanlık</option>
        </select>

        {/* Reset Filters button if any filter is active */}
        {isFiltered && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
            title="Tüm Filtreleri Sıfırla"
          >
            <Filter size={12} />
            <span>Temizle</span>
          </button>
        )}

        {/* Dossier Count Badge */}
        {typeof filteredCount === "number" && (
          <div className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
            {filteredCount}{" "}
            {typeof totalCount === "number" && totalCount !== filteredCount
              ? `/ ${totalCount}`
              : ""} dosya
          </div>
        )}
      </div>
    </div>
  );
}
