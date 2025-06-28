
import { useState } from "react";
import { CosmeticItem } from "@/pages/Index";
import { CosmeticCard } from "./CosmeticCard";
import { Button } from "@/components/ui/button";
import { Shuffle, Sparkles } from "lucide-react";

interface RandomizerProps {
  cosmetics: CosmeticItem[];
}

interface RandomCombo {
  outfit?: CosmeticItem;
  backpack?: CosmeticItem;
  pickaxe?: CosmeticItem;
  glider?: CosmeticItem;
}

export const Randomizer = ({ cosmetics }: RandomizerProps) => {
  const [randomCombo, setRandomCombo] = useState<RandomCombo>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const getRandomItem = (type: string): CosmeticItem | undefined => {
    const items = cosmetics.filter(item => 
      item.type.value.toLowerCase() === type.toLowerCase()
    );
    
    if (items.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  };

  const generateRandomCombo = async () => {
    setIsGenerating(true);
    
    // Add delay for animation effect
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCombo: RandomCombo = {
      outfit: getRandomItem("outfit"),
      backpack: getRandomItem("backpack"),
      pickaxe: getRandomItem("pickaxe"),
      glider: getRandomItem("glider"),
    };
    
    console.log("Generated random combo:", newCombo);
    setRandomCombo(newCombo);
    setIsGenerating(false);
  };

  const comboItems = [
    { key: "outfit", item: randomCombo.outfit, label: "Outfit" },
    { key: "backpack", item: randomCombo.backpack, label: "Back Bling" },
    { key: "pickaxe", item: randomCombo.pickaxe, label: "Pickaxe" },
    { key: "glider", item: randomCombo.glider, label: "Glider" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          <h2 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Combo Randomizer
          </h2>
          <Sparkles className="w-8 h-8 text-yellow-400" />
        </div>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Generate the perfect random loadout with one click! Get a complete combo with outfit, back bling, pickaxe, and glider.
        </p>
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <Button
          onClick={generateRandomCombo}
          disabled={isGenerating}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
              Generating...
            </>
          ) : (
            <>
              <Shuffle className="w-5 h-5 mr-3" />
              Generate Random Combo
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      {Object.keys(randomCombo).length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Your Random Combo</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {comboItems.map(({ key, item, label }, index) => (
              <div key={key} className="space-y-3">
                <h4 className="text-lg font-semibold text-center text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {label}
                </h4>
                {item ? (
                  <CosmeticCard cosmetic={item} index={index} />
                ) : (
                  <div className="aspect-square bg-slate-800/50 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center text-gray-400">
                    <div className="text-4xl mb-2">❓</div>
                    <p className="text-sm">No {label} Available</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Combo Actions */}
          <div className="text-center space-x-4">
            <Button
              onClick={generateRandomCombo}
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Generate New Combo
            </Button>
          </div>
        </div>
      )}

      {/* Getting Started */}
      {Object.keys(randomCombo).length === 0 && (
        <div className="text-center py-12">
          <div className="text-8xl mb-6">🎲</div>
          <h3 className="text-2xl font-semibold text-white mb-4">Ready to Get Random?</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Click the button above to generate your first random Fortnite combo. Mix and match items you might never have considered!
          </p>
        </div>
      )}
    </div>
  );
};
