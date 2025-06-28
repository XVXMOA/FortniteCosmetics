
import { CosmeticItem } from "@/pages/Index";

interface ComboViewer3DProps {
  combo: {
    outfit?: CosmeticItem;
    backpack?: CosmeticItem;
    pickaxe?: CosmeticItem;
    glider?: CosmeticItem;
    emote?: CosmeticItem;
  };
}

export const ComboViewer3D = ({ combo }: ComboViewer3DProps) => {
  const comboItems = [
    { key: "outfit", item: combo.outfit, label: "Outfit" },
    { key: "backpack", item: combo.backpack, label: "Back Bling" },
    { key: "pickaxe", item: combo.pickaxe, label: "Pickaxe" },
    { key: "glider", item: combo.glider, label: "Glider" },
    { key: "emote", item: combo.emote, label: "Emote" },
  ];

  return (
    <div className="space-y-6">
      {/* Main Combo Display */}
      <div className="bg-slate-800/50 rounded-xl p-8 border border-gray-700">
        <h3 className="text-3xl font-bold text-white mb-8 text-center">Your Combo</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {comboItems.map(({ key, item, label }) => (
            <div key={key} className="text-center space-y-3">
              <h4 className="text-lg font-semibold text-purple-400">{label}</h4>
              {item ? (
                <div className="space-y-3">
                  <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden border-2 border-gray-600 bg-slate-700">
                    <img
                      src={item.images.icon || item.images.smallIcon}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{item.rarity.displayValue}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-24 h-24 mx-auto bg-slate-700 rounded-lg border-2 border-gray-600 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">None</span>
                  </div>
                  <p className="text-sm text-gray-500">Not selected</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Featured Item Display */}
      {combo.outfit && (
        <div className="bg-gradient-to-br from-slate-800/80 to-purple-900/20 rounded-xl p-6 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">Featured Outfit</h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-purple-500 bg-slate-700 flex-shrink-0">
              <img
                src={combo.outfit.images.featured || combo.outfit.images.icon || combo.outfit.images.smallIcon}
                alt={combo.outfit.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-2xl font-bold text-white mb-2">{combo.outfit.name}</h4>
              <p className="text-gray-300 mb-2">{combo.outfit.description}</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full capitalize">
                  {combo.outfit.rarity.displayValue}
                </span>
                {combo.outfit.series && (
                  <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                    {combo.outfit.series.value}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
