
import { useState } from "react";
import { CosmeticItem } from "@/pages/Index";
import { CosmeticCard } from "./CosmeticCard";
import { CosmeticDetailModal } from "./CosmeticDetailModal";
import { SortDropdown, SortOption } from "./SortDropdown";
import { SearchBar } from "./SearchBar";
import { FilterDropdown, FilterOptions } from "./FilterDropdown";

interface CosmeticGridProps {
  cosmetics: CosmeticItem[];
  category: string;
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableRarities: string[];
  availableSeries: string[];
}

export const CosmeticGrid = ({ 
  cosmetics, 
  category, 
  currentSort, 
  onSortChange,
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  availableRarities,
  availableSeries
}: CosmeticGridProps) => {
  const [selectedCosmetic, setSelectedCosmetic] = useState<CosmeticItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCosmeticClick = (cosmetic: CosmeticItem) => {
    setSelectedCosmetic(cosmetic);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCosmetic(null);
  };

  if (cosmetics.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎮</div>
        <h3 className="text-2xl font-semibold text-white mb-2">No {category} Found</h3>
        <p className="text-gray-400">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-3xl font-bold text-white">
          {category} 
          <span className="text-lg font-normal text-gray-400 ml-2">
            ({cosmetics.length} items)
          </span>
        </h2>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={`Search ${category.toLowerCase()}...`}
        />
        
        <div className="flex gap-3">
          <FilterDropdown
            selectedFilters={filters}
            onFiltersChange={onFiltersChange}
            availableRarities={availableRarities}
            availableSeries={availableSeries}
          />
          <SortDropdown 
            currentSort={currentSort}
            onSortChange={onSortChange}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {cosmetics.map((cosmetic, index) => (
          <CosmeticCard 
            key={cosmetic.id} 
            cosmetic={cosmetic} 
            index={index}
            onClick={handleCosmeticClick}
          />
        ))}
      </div>

      <CosmeticDetailModal
        cosmetic={selectedCosmetic}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};
