import { useState } from "react";
import { CosmeticItem } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { CosmeticCard } from "./CosmeticCard";
import { ComboViewer3D } from "./ComboViewer3D";
import { useToast } from "@/hooks/use-toast";
import { SearchBar } from "./SearchBar";
import { SortDropdown, SortOption } from "./SortDropdown";
import { FilterDropdown, FilterOptions } from "./FilterDropdown";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

interface CreateComboProps {
  cosmetics: CosmeticItem[];
  onBack: () => void;
}

interface CustomCombo {
  outfit?: CosmeticItem;
  backpack?: CosmeticItem;
  pickaxe?: CosmeticItem;
  glider?: CosmeticItem;
  emote?: CosmeticItem;
}

type ComboStep = "outfit" | "backpack" | "pickaxe" | "glider" | "emote" | "preview";

const ITEMS_PER_PAGE = 90;

export const CreateCombo = ({ cosmetics, onBack }: CreateComboProps) => {
  const [currentStep, setCurrentStep] = useState<ComboStep>("outfit");
  const [selectedCombo, setSelectedCombo] = useState<CustomCombo>({});
  const [includeEmotes, setIncludeEmotes] = useState(false);
  const [includeBackpack, setIncludeBackpack] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSort, setCurrentSort] = useState<SortOption>("alphabetical-a-z");
  const [filters, setFilters] = useState<FilterOptions>({ rarities: [], series: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const steps: { key: ComboStep; label: string; required: boolean }[] = [
    { key: "outfit", label: "Outfit", required: true },
    { key: "backpack", label: "Back Bling", required: false },
    { key: "pickaxe", label: "Pickaxe", required: true },
    { key: "glider", label: "Glider", required: true },
    { key: "emote", label: "Emote", required: false },
    { key: "preview", label: "Preview", required: false },
  ];

  const getItemsForStep = (step: ComboStep): CosmeticItem[] => {
    const typeMap = {
      outfit: "outfit",
      backpack: "backpack", 
      pickaxe: "pickaxe",
      glider: "glider",
      emote: "emote"
    };
    
    let items = cosmetics.filter(item => 
      item.type.value.toLowerCase() === typeMap[step]?.toLowerCase()
    );

    // Apply search filter
    if (searchQuery.trim()) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply rarity filter
    if (filters.rarities.length > 0) {
      items = items.filter(item =>
        filters.rarities.includes(item.rarity.displayValue)
      );
    }

    // Apply series filter
    if (filters.series.length > 0) {
      items = items.filter(item =>
        item.series && filters.series.includes(item.series.value)
      );
    }

    // Apply sorting
    return items.sort((a, b) => {
      const rarityOrder = {
        "common": 1, "uncommon": 2, "rare": 3, "epic": 4, 
        "legendary": 5, "mythic": 6, "exotic": 7, "transcendent": 8
      };

      switch (currentSort) {
        case "rarity-low-high":
          const rarityA = rarityOrder[a.rarity.value.toLowerCase() as keyof typeof rarityOrder] || 0;
          const rarityB = rarityOrder[b.rarity.value.toLowerCase() as keyof typeof rarityOrder] || 0;
          return rarityA - rarityB;
        case "rarity-high-low":
          const rarityA2 = rarityOrder[a.rarity.value.toLowerCase() as keyof typeof rarityOrder] || 0;
          const rarityB2 = rarityOrder[b.rarity.value.toLowerCase() as keyof typeof rarityOrder] || 0;
          return rarityB2 - rarityA2;
        case "alphabetical-a-z":
          return a.name.localeCompare(b.name);
        case "alphabetical-z-a":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  };

  const handleItemSelect = (item: CosmeticItem) => {
    setSelectedCombo(prev => ({
      ...prev,
      [currentStep]: item
    }));
  };

  const handleNext = () => {
    const currentStepIndex = steps.findIndex(s => s.key === currentStep);
    let nextStepIndex = currentStepIndex + 1;
    
    // Skip optional steps if not included
    while (nextStepIndex < steps.length) {
      const nextStep = steps[nextStepIndex];
      if (nextStep.key === "backpack" && !includeBackpack) {
        nextStepIndex++;
        continue;
      }
      if (nextStep.key === "emote" && !includeEmotes) {
        nextStepIndex++;
        continue;
      }
      break;
    }
    
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex].key);
      setCurrentPage(1); // Reset to first page when changing steps
    }
  };

  const handlePrevious = () => {
    const currentStepIndex = steps.findIndex(s => s.key === currentStep);
    let prevStepIndex = currentStepIndex - 1;
    
    // Skip optional steps if not included
    while (prevStepIndex >= 0) {
      const prevStep = steps[prevStepIndex];
      if (prevStep.key === "backpack" && !includeBackpack) {
        prevStepIndex--;
        continue;
      }
      if (prevStep.key === "emote" && !includeEmotes) {
        prevStepIndex--;
        continue;
      }
      break;
    }
    
    if (prevStepIndex >= 0) {
      setCurrentStep(steps[prevStepIndex].key);
      setCurrentPage(1); // Reset to first page when changing steps
    }
  };

  const canProceed = () => {
    const step = steps.find(s => s.key === currentStep);
    if (!step) return false;
    
    if (step.required) {
      return selectedCombo[currentStep] !== undefined;
    }
    return true;
  };

  const isLastStep = () => {
    const enabledSteps = steps.filter(step => {
      if (step.key === "backpack" && !includeBackpack) return false;
      if (step.key === "emote" && !includeEmotes) return false;
      return true;
    });
    
    return currentStep === enabledSteps[enabledSteps.length - 1].key;
  };

  const saveCombo = () => {
    const comboName = `Custom Combo ${Date.now()}`;
    const savedCombo = {
      id: Date.now().toString(),
      name: comboName,
      ...selectedCombo,
      savedAt: new Date().toISOString(),
    };

    const existingSaved = localStorage.getItem('fortnite-saved-combos');
    const savedCombos = existingSaved ? JSON.parse(existingSaved) : [];
    savedCombos.push(savedCombo);
    
    localStorage.setItem('fortnite-saved-combos', JSON.stringify(savedCombos));
    
    toast({
      title: "Combo Saved!",
      description: `Your custom combo has been saved.`,
    });
  };

  const getAvailableRarities = () => {
    const items = getItemsForStep(currentStep);
    const rarities = [...new Set(items.map(item => item.rarity.displayValue))];
    return rarities.sort();
  };

  const getAvailableSeries = () => {
    const items = getItemsForStep(currentStep);
    const series = [...new Set(items
      .filter(item => item.series)
      .map(item => item.series!.value)
    )];
    return series.sort();
  };

  // Reset to first page when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setCurrentSort(sort);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  if (currentStep === "preview") {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Your Custom Combo
          </h2>
          <p className="text-xl text-gray-300">
            Rotate the 3D preview to see your combo from all angles
          </p>
        </div>

        <ComboViewer3D combo={selectedCombo} />

        <div className="flex justify-center gap-4">
          <Button
            onClick={handlePrevious}
            variant="outline"
            className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Edit
          </Button>
          <Button
            onClick={saveCombo}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            <Check className="w-4 h-4 mr-2" />
            Save Combo
          </Button>
          <Button
            onClick={onBack}
            variant="outline"
            className="border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white"
          >
            Create New Combo
          </Button>
        </div>
      </div>
    );
  }

  const currentStepData = steps.find(s => s.key === currentStep);
  const allItems = getItemsForStep(currentStep);
  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = allItems.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Create Your Own Combo
        </h2>
        <p className="text-xl text-gray-300">
          Step {steps.findIndex(s => s.key === currentStep) + 1} of {steps.length}: Select your {currentStepData?.label}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className={`flex items-center ${
                index < steps.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step.key === currentStep
                    ? 'bg-purple-600 text-white'
                    : selectedCombo[step.key] || step.key === "preview"
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 bg-gray-600 rounded">
                  <div
                    className={`h-full rounded transition-all duration-300 ${
                      selectedCombo[step.key] ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                    style={{ width: selectedCombo[step.key] ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Optional Settings */}
      {currentStep === "outfit" && (
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-white">Customize Your Experience</h3>
          <div className="flex justify-center gap-6">
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                checked={includeBackpack}
                onChange={(e) => setIncludeBackpack(e.target.checked)}
                className="rounded"
              />
              Include Back Bling
            </label>
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                checked={includeEmotes}
                onChange={(e) => setIncludeEmotes(e.target.checked)}
                className="rounded"
              />
              Include Emotes
            </label>
          </div>
        </div>
      )}

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={`Search ${currentStepData?.label.toLowerCase()}...`}
        />
        
        <div className="flex gap-3">
          <FilterDropdown
            selectedFilters={filters}
            onFiltersChange={handleFiltersChange}
            availableRarities={getAvailableRarities()}
            availableSeries={getAvailableSeries()}
          />
          <SortDropdown 
            currentSort={currentSort}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      {/* Current Selection */}
      {selectedCombo[currentStep] && (
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-4">Selected {currentStepData?.label}</h3>
          <div className="max-w-xs mx-auto">
            <CosmeticCard cosmetic={selectedCombo[currentStep]!} index={0} />
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 py-4">
        {steps.findIndex(s => s.key === currentStep) > 0 && (
          <Button
            onClick={handlePrevious}
            variant="outline"
            className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white bg-slate-800/90 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
        )}

        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
        >
          {isLastStep() ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Preview
            </>
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Pagination Info */}
      {allItems.length > 0 && (
        <div className="text-center text-gray-300 pb-4">
          Showing {startIndex + 1}-{Math.min(endIndex, allItems.length)} of {allItems.length} items
        </div>
      )}

      {/* Item Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 min-h-[600px]">
          {currentItems.map((item, index) => (
            <div
              key={item.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedCombo[currentStep]?.id === item.id
                  ? 'ring-4 ring-purple-500 rounded-xl'
                  : ''
              }`}
              onClick={() => handleItemSelect(item)}
            >
              <CosmeticCard cosmetic={item} index={index} />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
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
      )}

      {allItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold text-white mb-2">No Items Found</h3>
          <p className="text-gray-400">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="flex justify-center max-w-4xl mx-auto bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-slate-700">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Button>
      </div>
    </div>
  );
};
