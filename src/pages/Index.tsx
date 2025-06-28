
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { CosmeticGrid } from "@/components/CosmeticGrid";
import { Randomizer } from "@/components/Randomizer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";

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
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<"browse" | "randomizer">("browse");
  const { toast } = useToast();

  const categories = [
    { id: "outfit", name: "Outfits", apiType: "outfit" },
    { id: "backpack", name: "Back Blings", apiType: "backpack" },
    { id: "pickaxe", name: "Pickaxes", apiType: "pickaxe" },
    { id: "glider", name: "Gliders", apiType: "glider" },
    { id: "emote", name: "Emotes", apiType: "emote" }
  ];

  useEffect(() => {
    fetchCosmetics();
  }, []);

  useEffect(() => {
    if (currentView === "browse") {
      filterCosmetics();
    }
  }, [currentCategory, cosmetics, currentView]);

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

  const handleCategoryChange = (categoryId: string) => {
    setCurrentCategory(categoryId);
    setCurrentView("browse");
  };

  const handleRandomizerView = () => {
    setCurrentView("randomizer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar 
        categories={categories}
        currentCategory={currentCategory}
        onCategoryChange={handleCategoryChange}
        onRandomizerView={handleRandomizerView}
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
            />
          ) : (
            <Randomizer cosmetics={cosmetics} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
