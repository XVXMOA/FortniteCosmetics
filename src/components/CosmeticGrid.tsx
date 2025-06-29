import { useState } from "react";
import { CosmeticItem } from "@/pages/Index";
import { CosmeticCard } from "./CosmeticCard";
import { CosmeticDetailModal } from "./CosmeticDetailModal";
import { SortDropdown, SortOption } from "./SortDropdown";
import { SearchBar } from "./SearchBar";
import { FilterDropdown, FilterOptions } from "./FilterDropdown";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [showSearch, setShowSearch] = useState(false);
  const isMobile = useIsMobile();

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
    <div className="space-y-6 max-w-full">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          {category} 
          <span className="text-base sm:text-lg font-normal text-gray-400 ml-2">
            ({cosmetics.length} items)
          </span>
        </h2>
      </div>

      {/* Search and Controls */}
      <div className="space-y-4 w-full">
        {/* Mobile: Search Icon and Expandable Bar */}
        {isMobile ? (
          <div className="w-full d-flex align-items-center position-relative mb-2">
            {!showSearch && (
              <button
                className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center p-0"
                style={{ width: 40, height: 40 }}
                onClick={() => setShowSearch(true)}
                aria-label="Open search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242 1.106a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
                </svg>
              </button>
            )}
            {showSearch && (
              <div className="flex-grow-1 d-flex align-items-center" style={{ width: '100%' }}>
                <SearchBar
                  value={searchQuery}
                  onChange={onSearchChange}
                  placeholder={`Search ${category.toLowerCase()}...`}
                />
                <button
                  className="btn btn-link text-white ms-2"
                  onClick={() => setShowSearch(false)}
                  aria-label="Close search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              placeholder={`Search ${category.toLowerCase()}...`}
            />
          </div>
        )}
        {/* Filters and Sort - Scrollable Container */}
        {!isMobile || !showSearch ? (
          <div className="w-100 overflow-auto flex-nowrap d-flex gap-3 pb-2 pr-4" style={{ WebkitOverflowScrolling: 'touch' }}>
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
        ) : null}
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
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
