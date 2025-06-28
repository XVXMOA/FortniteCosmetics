import { useState, useEffect } from "react";
import { CosmeticItem } from "@/pages/Index";
import { CosmeticCard } from "./CosmeticCard";
import { Button } from "@/components/ui/button";
import { Trash2, Heart } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { SortDropdown, SortOption } from "./SortDropdown";
import { CosmeticDetailModal } from "./CosmeticDetailModal";

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
  const [filteredCombos, setFilteredCombos] = useState<SavedCombo[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSort, setCurrentSort] = useState<SortOption>("most-recent");
  const [selectedCosmetic, setSelectedCosmetic] = useState<CosmeticItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadSavedCombos();
  }, []);

  useEffect(() => {
    filterAndSortCombos();
  }, [savedCombos, searchQuery, currentSort]);

  const loadSavedCombos = () => {
    const saved = localStorage.getItem('fortnite-saved-combos');
    if (saved) {
      setSavedCombos(JSON.parse(saved));
    }
  };

  const filterAndSortCombos = () => {
    let filtered = [...savedCombos];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(combo =>
        combo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (currentSort) {
        case "alphabetical-a-z":
          return a.name.localeCompare(b.name);
        case "alphabetical-z-a":
          return b.name.localeCompare(a.name);
        case "most-recent":
          return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
        case "last-seen":
          return new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredCombos(filtered);
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

  const handleCosmeticClick = (cosmetic: CosmeticItem) => {
    setSelectedCosmetic(cosmetic);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCosmetic(null);
  };

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

      {/* Search and Controls */}
      {savedCombos.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search saved combos..."
          />
          
          <div className="flex gap-3">
            <SortDropdown 
              currentSort={currentSort}
              onSortChange={setCurrentSort}
            />
            <Button
              onClick={onBackToRandomizer}
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
            >
              Back to Randomizer
            </Button>
          </div>
        </div>
      )}

      {/* Saved Combos */}
      {filteredCombos.length > 0 ? (
        <div className="space-y-8">
          {filteredCombos.map((combo) => (
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
                      <CosmeticCard 
                        cosmetic={item} 
                        index={index} 
                        onClick={handleCosmeticClick}
                      />
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
      ) : savedCombos.length > 0 ? (
        <div className="text-center py-12">
          <div className="text-8xl mb-6">🔍</div>
          <h3 className="text-2xl font-semibold text-white mb-4">No Results Found</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            No saved combos match your search. Try adjusting your search terms.
          </p>
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

      <CosmeticDetailModal
        cosmetic={selectedCosmetic}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};
