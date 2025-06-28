import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft } from "lucide-react";
import { CosmeticItem } from "@/pages/Index";
import { CosmeticCard } from "./CosmeticCard";
import { CosmeticDetailModal } from "./CosmeticDetailModal";
import { useToast } from "@/hooks/use-toast";

interface SavedCombo {
  id: string;
  outfit?: CosmeticItem;
  backpack?: CosmeticItem;
  pickaxe?: CosmeticItem;
  glider?: CosmeticItem;
  emote?: CosmeticItem;
  createdAt: string;
}

interface SavedCombosProps {
  onBackToRandomizer: () => void;
}

export const SavedCombos = ({ onBackToRandomizer }: SavedCombosProps) => {
  const [savedCombos, setSavedCombos] = useState<SavedCombo[]>([]);
  const [selectedCosmetic, setSelectedCosmetic] = useState<CosmeticItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleCosmeticClick = (cosmetic: CosmeticItem) => {
    console.log('SavedCombos card clicked:', cosmetic.name);
    setSelectedCosmetic(cosmetic);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCosmetic(null);
  };

  useEffect(() => {
    loadSavedCombos();
  }, []);

  const loadSavedCombos = () => {
    const saved = JSON.parse(localStorage.getItem('fortnite-saved-combos') || '[]');
    setSavedCombos(saved.reverse()); // Show newest first
  };

  const deleteCombo = (comboId: string) => {
    const updatedCombos = savedCombos.filter(combo => combo.id !== comboId);
    setSavedCombos(updatedCombos);
    localStorage.setItem('fortnite-saved-combos', JSON.stringify(updatedCombos.reverse()));
    
    toast({
      title: "Combo deleted",
      description: "The combo has been removed from your collection.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (savedCombos.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={onBackToRandomizer}
            variant="outline"
            size="sm"
            className="text-gray-400 border-gray-600 hover:text-white hover:border-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Randomizer
          </Button>
          <h2 className="text-4xl font-bold text-white">Saved Combos</h2>
        </div>

        <div className="text-center py-20">
          <div className="text-8xl mb-6">📦</div>
          <h3 className="text-2xl font-semibold text-white mb-4">
            No saved combos yet
          </h3>
          <p className="text-gray-400 text-lg mb-8">
            Generate and save some combos from the randomizer to see them here!
          </p>
          <Button
            onClick={onBackToRandomizer}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Go to Randomizer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={onBackToRandomizer}
          variant="outline"
          size="sm"
          className="text-gray-400 border-gray-600 hover:text-white hover:border-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Randomizer
        </Button>
        <h2 className="text-4xl font-bold text-white">
          Saved Combos
          <span className="text-lg font-normal text-gray-400 ml-2">
            ({savedCombos.length} saved)
          </span>
        </h2>
      </div>

      <div className="space-y-8">
        {savedCombos.map((combo, comboIndex) => (
          <div 
            key={combo.id} 
            className="bg-slate-800/50 rounded-2xl p-6 border border-gray-700 relative"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">
                Combo #{savedCombos.length - comboIndex}
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">
                  Saved on {formatDate(combo.createdAt)}
                </span>
                <Button
                  onClick={() => deleteCombo(combo.id)}
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(combo).map(([type, item]) => {
                if (!item || type === 'id' || type === 'createdAt') return null;
                
                const itemIndex = Object.keys(combo).indexOf(type);
                
                return (
                  <div key={type} className="text-center">
                    <h4 className="text-sm font-medium text-gray-300 mb-2 capitalize">
                      {type === "outfit" ? "Skin" : type}
                    </h4>
                    <CosmeticCard 
                      cosmetic={item} 
                      index={itemIndex}
                      onClick={handleCosmeticClick}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <CosmeticDetailModal
        cosmetic={selectedCosmetic}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};
