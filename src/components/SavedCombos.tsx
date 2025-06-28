
import { useState, useEffect } from "react";
import { CosmeticItem } from "@/pages/Index";
import { CosmeticCard } from "./CosmeticCard";
import { Button } from "@/components/ui/button";
import { Trash2, Heart } from "lucide-react";

interface SavedCombo {
  id: string;
  name: string;
  outfit?: CosmeticItem;
  backpack?: CosmeticItem;
  pickaxe?: CosmeticItem;
  glider?: CosmeticItem;
  savedAt: string;
}

interface SavedCombosProps {
  onBackToRandomizer: () => void;
}

export const SavedCombos = ({ onBackToRandomizer }: SavedCombosProps) => {
  const [savedCombos, setSavedCombos] = useState<SavedCombo[]>([]);

  useEffect(() => {
    loadSavedCombos();
  }, []);

  const loadSavedCombos = () => {
    const saved = localStorage.getItem('fortnite-saved-combos');
    if (saved) {
      setSavedCombos(JSON.parse(saved));
    }
  };

  const deleteCombo = (id: string) => {
    const updated = savedCombos.filter(combo => combo.id !== id);
    setSavedCombos(updated);
    localStorage.setItem('fortnite-saved-combos', JSON.stringify(updated));
  };

  const comboItems = (combo: SavedCombo) => [
    { key: "outfit", item: combo.outfit, label: "Outfit" },
    { key: "backpack", item: combo.backpack, label: "Back Bling" },
    { key: "pickaxe", item: combo.pickaxe, label: "Pickaxe" },
    { key: "glider", item: combo.glider, label: "Glider" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Heart className="w-8 h-8 text-pink-400" />
          <h2 className="text-4xl font-bold text-white bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Saved Combos
          </h2>
          <Heart className="w-8 h-8 text-pink-400" />
        </div>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Your favorite Fortnite loadout combinations saved for quick access.
        </p>
      </div>

      {/* Back Button */}
      <div className="text-center">
        <Button
          onClick={onBackToRandomizer}
          variant="outline"
          className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
        >
          Back to Randomizer
        </Button>
      </div>

      {/* Saved Combos */}
      {savedCombos.length > 0 ? (
        <div className="space-y-8">
          {savedCombos.map((combo) => (
            <div key={combo.id} className="bg-slate-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">{combo.name}</h3>
                  <p className="text-gray-400">Saved on {new Date(combo.savedAt).toLocaleDateString()}</p>
                </div>
                <Button
                  onClick={() => deleteCombo(combo.id)}
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {comboItems(combo).map(({ key, item, label }, index) => (
                  <div key={key} className="space-y-3">
                    <h4 className="text-lg font-semibold text-center text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {label}
                    </h4>
                    {item ? (
                      <CosmeticCard cosmetic={item} index={index} />
                    ) : (
                      <div className="aspect-square bg-slate-800/50 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center text-gray-400">
                        <div className="text-4xl mb-2">❓</div>
                        <p className="text-sm">No {label}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-8xl mb-6">💔</div>
          <h3 className="text-2xl font-semibold text-white mb-4">No Saved Combos Yet</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            Start by generating random combos and save your favorites to see them here!
          </p>
          <Button
            onClick={onBackToRandomizer}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Generate Your First Combo
          </Button>
        </div>
      )}
    </div>
  );
};
