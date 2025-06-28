import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { CosmeticGrid } from "@/components/CosmeticGrid";
import { Randomizer } from "@/components/Randomizer";
import { SavedCombos } from "@/components/SavedCombos";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";
import { SortOption } from "@/components/SortDropdown";

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

const Index = () => {
  const [cosmetics, setCosmetics] = useState<CosmeticItem[]>([]);
  const [filteredCosmetics, setFilteredCosmetics] = useState<CosmeticItem[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>("outfit");
  const [currentSort, setCurrentSort] = useState<SortOption>("alphabetical-a-z");
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<"browse" | "randomizer" | "saved-combos">("browse");
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

  useEffect(() => {
    fetchCosmetics();
  }, []);

  useEffect(() => {
    if (currentView === "browse") {
      filterCosmetics();
    }
  }, [currentCategory, cosmetics, currentView]);

  useEffect(() => {
    if (currentView === "browse") {
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
        setCosmetics(data.data);
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
      setLoading(false);
    }
  };

  const filterCosmetics = () => {
    const categoryConfig = categories.find(cat => cat.id === currentCategory);
    if (!categoryConfig) return;

    const filtered = cosmetics.filter(item => 
      item.type.value.toLowerCase() === categoryConfig.apiType.toLowerCase()
    );
    
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
    setCurrentCategory(categoryId);
    setCurrentView("browse");
  };

  const handleRandomizerView = () => {
    setCurrentView("randomizer");
  };

  const handleSavedCombosView = () => {
    setCurrentView("saved-combos");
  };

  const handleSortChange = (sort: SortOption) => {
    setCurrentSort(sort);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar 
        categories={categories}
        currentCategory={currentCategory}
        onCategoryChange={handleCategoryChange}
        onRandomizerView={handleRandomizerView}
        onSavedCombosView={handleSavedCombosView}
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

          {loading ? (
            <LoadingSpinner />
          ) : currentView === "browse" ? (
            <CosmeticGrid 
              cosmetics={filteredCosmetics}
              category={categories.find(cat => cat.id === currentCategory)?.name || "Items"}
              currentSort={currentSort}
              onSortChange={handleSortChange}
            />
          ) : currentView === "randomizer" ? (
            <Randomizer cosmetics={cosmetics} />
          ) : (
            <SavedCombos onBackToRandomizer={() => setCurrentView("randomizer")} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
