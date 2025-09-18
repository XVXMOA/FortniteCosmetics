import { useState, useEffect, useRef } from "react";
import { Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface FilterOptions {
  rarities: string[];
  series: string[];
}

interface FilterDropdownProps {
  selectedFilters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableRarities: string[];
  availableSeries: string[];
  className?: string;
  hidden?: boolean;
}

export const FilterDropdown = ({
  selectedFilters,
  onFiltersChange,
  availableRarities,
  availableSeries,
  className = "",
  hidden = false,
}: FilterDropdownProps) => {
  const [rarityOpen, setRarityOpen] = useState(false);
  const [seriesOpen, setSeriesOpen] = useState(false);

  const defaultRarities = [
    "Common",
    "Uncommon", 
    "Rare",
    "Epic",
    "Legendary"
  ];

  // Filter available rarities to only include default ones
  const filteredRarities = availableRarities.filter(rarity => 
    defaultRarities.includes(rarity)
  ).sort((a, b) => {
    const indexA = defaultRarities.indexOf(a);
    const indexB = defaultRarities.indexOf(b);
    return indexA - indexB;
  });

  const handleRarityToggle = (rarity: string) => {
    const newRarities = selectedFilters.rarities.includes(rarity)
      ? selectedFilters.rarities.filter(r => r !== rarity)
      : [...selectedFilters.rarities, rarity];
    
    onFiltersChange({
      ...selectedFilters,
      rarities: newRarities,
    });
  };

  const handleSeriesToggle = (series: string) => {
    const newSeries = selectedFilters.series.includes(series)
      ? selectedFilters.series.filter(s => s !== series)
      : [...selectedFilters.series, series];
    
    onFiltersChange({
      ...selectedFilters,
      series: newSeries,
    });
  };

  const activeFiltersCount = selectedFilters.rarities.length + selectedFilters.series.length;

  // Close dropdowns on scroll/touchmove
  useEffect(() => {
    if (rarityOpen || seriesOpen) {
      const closeDropdowns = () => {
        setRarityOpen(false);
        setSeriesOpen(false);
      };
      window.addEventListener('scroll', closeDropdowns, { passive: true });
      window.addEventListener('touchmove', closeDropdowns, { passive: true });
      return () => {
        window.removeEventListener('scroll', closeDropdowns);
        window.removeEventListener('touchmove', closeDropdowns);
      };
    }
  }, [rarityOpen, seriesOpen]);

  if (hidden) return null;
  return (
    <div className={`d-flex flex-nowrap gap-2 overflow-auto ${className}`} style={{ WebkitOverflowScrolling: 'touch' }}>
      {/* Rarity Filter Dropdown */}
      <DropdownMenu open={rarityOpen} onOpenChange={setRarityOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700/50">
            <Filter className="w-4 h-4 mr-2" />
            Rarities
            {selectedFilters.rarities.length > 0 && (
              <span className="ml-2 bg-purple-600 text-white text-xs rounded-full px-2 py-0.5">
                {selectedFilters.rarities.length}
              </span>
            )}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-48 bg-slate-800 border-gray-600" 
          style={{ zIndex: 9999 }}
          onInteractOutside={() => setRarityOpen(false)}
        >
          <ScrollArea className="h-48">
            <div className="p-1">
              <DropdownMenuLabel className="text-white text-sm">Rarities</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-600 my-2" />
              {filteredRarities.map((rarity) => (
                <DropdownMenuCheckboxItem
                  key={rarity}
                  checked={selectedFilters.rarities.includes(rarity)}
                  onCheckedChange={() => handleRarityToggle(rarity)}
                  className="text-gray-300 hover:bg-slate-700 text-sm py-1.5"
                >
                  {rarity}
                </DropdownMenuCheckboxItem>
              ))}
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Series Filter Dropdown */}
      {availableSeries.length > 0 && (
        <DropdownMenu open={seriesOpen} onOpenChange={setSeriesOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700/50">
              <Filter className="w-4 h-4 mr-2" />
              Series
              {selectedFilters.series.length > 0 && (
                <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                  {selectedFilters.series.length}
                </span>
              )}
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-48 bg-slate-800 border-gray-600" 
            style={{ zIndex: 9999 }}
            onInteractOutside={() => setSeriesOpen(false)}
          >
            <ScrollArea className="h-48">
              <div className="p-1">
                <DropdownMenuLabel className="text-white text-sm">Series</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-600 my-2" />
                {availableSeries.sort().map((series) => (
                  <DropdownMenuCheckboxItem
                    key={series}
                    checked={selectedFilters.series.includes(series)}
                    onCheckedChange={() => handleSeriesToggle(series)}
                    className="text-gray-300 hover:bg-slate-700 text-sm py-1.5"
                  >
                    {series}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
