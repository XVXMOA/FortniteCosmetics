
import { useState } from "react";
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
}

export const FilterDropdown = ({
  selectedFilters,
  onFiltersChange,
  availableRarities,
  availableSeries,
}: FilterDropdownProps) => {
  const rarityOrder = [
    "Common",
    "Uncommon", 
    "Rare",
    "Epic",
    "Legendary",
    "Mythic",
    "Exotic",
    "Transcendent"
  ];

  const sortedRarities = availableRarities.sort((a, b) => {
    const indexA = rarityOrder.indexOf(a);
    const indexB = rarityOrder.indexOf(b);
    
    // If both rarities are in the order array, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    
    // If only one is in the order array, prioritize it
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    
    // If neither is in the order array, sort alphabetically
    return a.localeCompare(b);
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

  return (
    <div className="flex gap-2">
      {/* Rarity Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
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
        <DropdownMenuContent className="w-48 bg-slate-800 border-gray-600" style={{ zIndex: 9999 }}>
          <ScrollArea className="h-60">
            <div className="p-1">
              <DropdownMenuLabel className="text-white text-sm">Rarities</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-600 my-2" />
              {sortedRarities.map((rarity) => (
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
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
          <DropdownMenuContent className="w-48 bg-slate-800 border-gray-600" style={{ zIndex: 9999 }}>
            <ScrollArea className="h-60">
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
