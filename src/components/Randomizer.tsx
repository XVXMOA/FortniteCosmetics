import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shuffle, Save } from "lucide-react";
import { CosmeticItem } from "@/pages/Index";
import { CosmeticCard } from "./CosmeticCard";
import { CosmeticDetailModal } from "./CosmeticDetailModal";
import { useToast } from "@/hooks/use-toast";

interface RandomizerProps {
  cosmetics: CosmeticItem[];
}

interface RandomCombo {
  outfit?: CosmeticItem;
  backpack?: CosmeticItem;
  pickaxe?: CosmeticItem;
  glider?: CosmeticItem;
  emote?: CosmeticItem;
}

export const Randomizer = ({ cosmetics }: RandomizerProps) => {
  const [currentCombo, setCurrentCombo] = useState<RandomCombo>({});
  const [selectedCosmetic, setSelectedCosmetic] = useState<CosmeticItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleCosmeticClick = (cosmetic: CosmeticItem) => {
    console.log('Randomizer card clicked:', cosmetic.name);
    setSelectedCosmetic(cosmetic);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCosmetic(null);
  };

  const getRandomItemByType = (type: string): CosmeticItem | undefined => {
    const items = cosmetics.filter(item => 
      item.type.value.toLowerCase() === type.toLowerCase()
    );
    if (items.length === 0) return undefined;
    return items[Math.floor(Math.random() * items.length)];
  };

  const generateRandomCombo = () => {
    const newCombo: RandomCombo = {
      outfit: getRandomItemByType("outfit"),
      backpack: getRandomItemByType("backpack"),
      pickaxe: getRandomItemByType("pickaxe"),
      glider: getRandomItemByType("glider"),
      emote: getRandomItemByType("emote")
    };
    
    setCurrentCombo(newCombo);
    
    toast({
      title: "New combo generated!",
      description: "Your random Fortnite loadout is ready.",
    });
  };

  const saveCombo = () => {
    if (Object.keys(currentCombo).length === 0) {
      toast({
        title: "No combo to save",
        description: "Generate a combo first before saving.",
        variant: "destructive",
      });
      return;
    }

    const savedCombos = JSON.parse(localStorage.getItem('fortnite-saved-combos') || '[]');
    const comboWithId = {
      id: Date.now().toString(),
      ...currentCombo,
      createdAt: new Date().toISOString()
    };
    
    savedCombos.push(comboWithId);
    localStorage.setItem('fortnite-saved-combos', JSON.stringify(savedCombos));
    
    toast({
      title: "Combo saved!",
      description: "Your combo has been saved to your collection.",
    });
  };

  const hasCombo = Object.values(currentCombo).some(item => item !== undefined);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Loadout Randomizer
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Generate random Fortnite combinations and discover new styles
        </p>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            onClick={generateRandomCombo}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Shuffle className="w-5 h-5 mr-2" />
            Generate Random Combo
          </Button>
          
          {hasCombo && (
            <Button
              onClick={saveCombo}
              size="lg"
              variant="outline"
              className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Combo
            </Button>
          )}
        </div>
      </div>

      {hasCombo && (
        <div className="bg-slate-800/50 rounded-2xl p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Your Random Loadout
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Object.entries(currentCombo).map(([type, item], index) => {
              if (!item) return null;
              
              return (
                <div key={type} className="text-center">
                  <h4 className="text-lg font-semibold text-white mb-3 capitalize">
                    {type === "outfit" ? "Skin" : type}
                  </h4>
                  <CosmeticCard 
                    cosmetic={item} 
                    index={index}
                    onClick={handleCosmeticClick}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!hasCombo && (
        <div className="text-center py-20">
          <div className="text-8xl mb-6">🎲</div>
          <h3 className="text-2xl font-semibold text-white mb-4">
            Ready to randomize?
          </h3>
          <p className="text-gray-400 text-lg">
            Click the button above to generate your first random combo!
          </p>
        </div>
      )}

      <CosmeticDetailModal
        cosmetic={selectedCosmetic}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};
