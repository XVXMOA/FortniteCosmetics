
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-2 bg-purple-600 text-white text-xs rounded-full px-2 py-0.5">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-slate-800 border-gray-600">
        <DropdownMenuLabel className="text-white">Rarities</DropdownMenuLabel>
        {availableRarities.map((rarity) => (
          <DropdownMenuCheckboxItem
            key={rarity}
            checked={selectedFilters.rarities.includes(rarity)}
            onCheckedChange={() => handleRarityToggle(rarity)}
            className="text-gray-300 hover:bg-slate-700"
          >
            {rarity}
          </DropdownMenuCheckboxItem>
        ))}
        
        {availableSeries.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-gray-600" />
            <DropdownMenuLabel className="text-white">Series</DropdownMenuLabel>
            {availableSeries.map((series) => (
              <DropdownMenuCheckboxItem
                key={series}
                checked={selectedFilters.series.includes(series)}
                onCheckedChange={() => handleSeriesToggle(series)}
                className="text-gray-300 hover:bg-slate-700"
              >
                {series}
              </DropdownMenuCheckboxItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
