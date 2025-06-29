import { useState } from "react";
import { CosmeticItem } from "@/pages/Index";
import { CosmeticCard } from "./CosmeticCard";
import { CosmeticDetailModal } from "./CosmeticDetailModal";
import { SortDropdown, SortOption } from "./SortDropdown";
import { SearchBar } from "./SearchBar";
import { FilterDropdown, FilterOptions } from "./FilterDropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;
  const totalPages = Math.ceil(cosmetics.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = cosmetics.slice(startIndex, endIndex);
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
        <div className="w-full">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder={`Search ${category.toLowerCase()}...`}
          />
        </div>
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
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {currentItems.map((cosmetic, index) => (
          <CosmeticCard 
            key={cosmetic.id} 
            cosmetic={cosmetic} 
            index={startIndex + index}
            onClick={handleCosmeticClick}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <>
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNumber)}
                        isActive={currentPage === pageNumber}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          {/* Invisible footer spacer for mobile browser bar */}
          <div className="w-full h-16 sm:h-0 pointer-events-none select-none" style={{ background: 'transparent' }} />
        </>
      )}

      <CosmeticDetailModal
        cosmetic={selectedCosmetic}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};
