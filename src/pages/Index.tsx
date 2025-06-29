import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { CosmeticGrid } from "@/components/CosmeticGrid";
import { Randomizer } from "@/components/Randomizer";
import { SavedCombos } from "@/components/SavedCombos";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { SortOption } from "@/components/SortDropdown";
import { CreateCombo } from "@/components/CreateCombo";

export interface CosmeticItem {
  id: string;
  name: string;
  description: string;
  type: {
    value: string;
    displayValue: string;
  };
  rarity: {
    value: string;
    displayValue: string;
  };
  series?: {
    value: string;
    colors?: string[];
  };
  images: {
    smallIcon?: string;
    icon?: string;
    featured?: string;
  };
  introduction?: {
    chapter: string;
    season: string;
  };
}

export interface CustomCombo {
  outfit?: CosmeticItem;
  backpack?: CosmeticItem;
  pickaxe?: CosmeticItem;
  glider?: CosmeticItem;
  emote?: CosmeticItem;
}

const Index = () => {
  const [cosmetics, setCosmetics] = useState<CosmeticItem[]>([]);
  const [filteredCosmetics, setFilteredCosmetics] = useState<CosmeticItem[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>("outfit");
  const [currentSort, setCurrentSort] = useState<SortOption>("alphabetical-a-z");
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentView, setCurrentView] = useState<"browse" | "randomizer" | "saved-combos" | "create-combo">("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filters, setFilters] = useState<{ rarities: string[]; series: string[] }>({
    rarities: [],
    series: []
  });
  const { toast } = useToast();

  const categories = [
    { id: "outfit", name: "Outfits", apiType: "outfit" },
    { id: "backpack", name: "Back Blings", apiType: "backpack" },
    { id: "pickaxe", name: "Pickaxes", apiType: "pickaxe" },
    { id: "glider", name: "Gliders", apiType: "glider" },
    { id: "emote", name: "Emotes", apiType: "emote" }
  ];

  const rarityOrder = {
    "common": 1,
    "uncommon": 2,
    "rare": 3,
    "epic": 4,
    "legendary": 5,
    "mythic": 6,
    "exotic": 7,
    "transcendent": 8
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchCosmetics();
  }, []);

  // Only show loading for category changes, not search
  useEffect(() => {
    if (currentView === "browse" && cosmetics.length > 0) {
      const shouldShowLoading = currentCategory !== "outfit" || filters.rarities.length > 0 || filters.series.length > 0;
      
      if (shouldShowLoading) {
        setIsUpdating(true);
        setTimeout(() => {
          filterCosmetics();
          setIsUpdating(false);
        }, 200);
      } else {
        filterCosmetics();
      }
    }
  }, [currentCategory, cosmetics, currentView, debouncedSearchQuery, filters]);

  useEffect(() => {
    if (currentView === "browse" && filteredCosmetics.length > 0) {
      sortCosmetics();
    }
  }, [currentSort, filteredCosmetics.length]);

  const fetchCosmetics = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://fortnite-api.com/v2/cosmetics/br");
      
      if (!response.ok) {
        throw new Error("Failed to fetch cosmetics");
      }
      
      const data = await response.json();
      console.log("Fetched cosmetics:", data);
      
      if (data.status === 200 && data.data) {
        // Filter out test pickaxes and other test items
        const filteredData = data.data.filter((item: CosmeticItem) => {
          const isTestItem = item.name.toLowerCase().includes('test') || 
                           item.description.toLowerCase().includes('test') ||
                           item.id.toLowerCase().includes('test');
          return !isTestItem;
        });
        
        setCosmetics(filteredData);
        console.log("Filtered cosmetics (removed test items):", filteredData.length);
      } else {
        throw new Error("Invalid API response");
      }
    } catch (error) {
      console.error("Error fetching cosmetics:", error);
      toast({
        title: "Error",
        description: "Failed to load cosmetics. Please try again later.",
        variant: "destructive",
      });
    } finally {
      // Add a small delay to ensure everything is properly loaded
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const filterCosmetics = () => {
    const categoryConfig = categories.find(cat => cat.id === currentCategory);
    if (!categoryConfig) return;

    let filtered = cosmetics.filter(item => 
      item.type.value.toLowerCase() === categoryConfig.apiType.toLowerCase()
    );

    // Apply search filter
    if (debouncedSearchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }

    // Apply rarity filter
    if (filters.rarities.length > 0) {
      filtered = filtered.filter(item =>
        filters.rarities.includes(item.rarity.displayValue)
      );
    }

    // Apply series filter
    if (filters.series.length > 0) {
      filtered = filtered.filter(item =>
        item.series && filters.series.includes(item.series.value)
      );
    }
    
    console.log(`Filtered ${categoryConfig.name}:`, filtered.length, "items");
    setFilteredCosmetics(filtered);
  };

  const sortCosmetics = () => {
    const sorted = [...filteredCosmetics].sort((a, b) => {
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
        
        case "last-seen":
          // Sort by introduction date (older first for rarest)
          if (!a.introduction || !b.introduction) return 0;
          const aDate = `${a.introduction.chapter}.${a.introduction.season}`;
          const bDate = `${b.introduction.chapter}.${b.introduction.season}`;
          return aDate.localeCompare(bDate);
        
        case "most-recent":
          // Sort by introduction date (newer first)
          if (!a.introduction || !b.introduction) return 0;
          const aDate2 = `${a.introduction.chapter}.${a.introduction.season}`;
          const bDate2 = `${b.introduction.chapter}.${b.introduction.season}`;
          return bDate2.localeCompare(aDate2);
        
        default:
          return 0;
      }
    });
    
    setFilteredCosmetics(sorted);
  };

  const handleCategoryChange = (categoryId: string) => {
    setIsUpdating(true);
    setCurrentCategory(categoryId);
    setCurrentView("browse");
    setSearchQuery("");
    setFilters({ rarities: [], series: [] });
    // Loading state will be handled by useEffect
  };

  const handleRandomizerView = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setCurrentView("randomizer");
      setIsUpdating(false);
    }, 200);
  };

  const handleSavedCombosView = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setCurrentView("saved-combos");
      setIsUpdating(false);
    }, 200);
  };

  const handleCreateComboView = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setCurrentView("create-combo");
      setIsUpdating(false);
    }, 200);
  };

  const handleSortChange = (sort: SortOption) => {
    setCurrentSort(sort);
    // Loading state will be handled by useEffect
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Loading state will be handled by useEffect
  };

  const handleFiltersChange = (newFilters: { rarities: string[]; series: string[] }) => {
    setFilters(newFilters);
    // Loading state will be handled by useEffect
  };

  const getAvailableRarities = () => {
    const categoryConfig = categories.find(cat => cat.id === currentCategory);
    if (!categoryConfig) return [];
    
    const categoryItems = cosmetics.filter(item => 
      item.type.value.toLowerCase() === categoryConfig.apiType.toLowerCase()
    );
    
    const rarities = [...new Set(categoryItems.map(item => item.rarity.displayValue))];
    return rarities.sort();
  };

  const getAvailableSeries = () => {
    const categoryConfig = categories.find(cat => cat.id === currentCategory);
    if (!categoryConfig) return [];
    
    const categoryItems = cosmetics.filter(item => 
      item.type.value.toLowerCase() === categoryConfig.apiType.toLowerCase()
    );
    
    const series = [...new Set(categoryItems
      .filter(item => item.series)
      .map(item => item.series!.value)
    )];
    return series.sort();
  };

  // Show loading screen for initial load or when updating
  if (loading || cosmetics.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar 
        categories={categories}
        currentCategory={currentCategory}
        onCategoryChange={handleCategoryChange}
        onRandomizerView={handleRandomizerView}
        onSavedCombosView={handleSavedCombosView}
        onCreateComboView={handleCreateComboView}
        currentView={currentView}
      />
      
      <main className="transition-all duration-300 ease-in-out lg:ml-64">
        <div className="p-6">
          <header className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Fortnite Vault
            </h1>
            <p className="text-xl text-gray-300">
              Discover and randomize your perfect Fortnite loadout
            </p>
          </header>

          {currentView === "browse" ? (
            <>
              {isUpdating && (
                <div className="flex justify-center mb-4">
                  <LoadingSpinner />
                </div>
              )}
              <CosmeticGrid 
                cosmetics={filteredCosmetics}
                category={categories.find(cat => cat.id === currentCategory)?.name || "Items"}
                currentSort={currentSort}
                onSortChange={handleSortChange}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                availableRarities={getAvailableRarities()}
                availableSeries={getAvailableSeries()}
              />
            </>
          ) : currentView === "randomizer" ? (
            <Randomizer cosmetics={cosmetics} />
          ) : currentView === "create-combo" ? (
            <CreateCombo 
              cosmetics={cosmetics} 
              onBack={() => setCurrentView("browse")} 
            />
          ) : (
            <SavedCombos onBackToRandomizer={() => setCurrentView("randomizer")} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
