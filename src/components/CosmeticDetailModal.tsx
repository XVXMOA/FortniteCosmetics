
import { useState, useEffect } from "react";
import { CosmeticItem } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { X, Calendar, Eye, Package, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface CosmeticDetailModalProps {
  cosmetic: CosmeticItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const rarityColors = {
  common: "from-gray-400 to-gray-600 border-gray-400/30",
  uncommon: "from-green-400 to-green-600 border-green-400/30",
  rare: "from-blue-400 to-blue-600 border-blue-400/30",
  epic: "from-purple-400 to-purple-600 border-purple-400/30",
  legendary: "from-orange-400 to-orange-600 border-orange-400/30",
  mythic: "from-yellow-400 to-yellow-600 border-yellow-400/30",
};

const seriesColors = {
  "marvel series": "from-red-600 to-red-800 border-red-600/30",
  "dc series": "from-blue-600 to-blue-900 border-blue-600/30",
  "icon series": "from-cyan-400 to-pink-500 border-cyan-400/30",
  "gaming legends series": "from-purple-600 to-indigo-700 border-purple-600/30",
  "star wars series": "from-yellow-400 to-orange-500 border-yellow-400/30",
  "shadow series": "from-gray-800 to-black border-gray-800/30",
  "slurp series": "from-cyan-400 to-blue-500 border-cyan-400/30",
  "lava series": "from-red-500 to-orange-600 border-red-500/30",
  "frozen series": "from-blue-200 to-blue-400 border-blue-200/30",
  "molten series": "from-orange-500 to-red-600 border-orange-500/30",
  "dark series": "from-purple-800 to-black border-purple-800/30",
  "cup series": "from-yellow-500 to-amber-600 border-yellow-500/30",
};

export const CosmeticDetailModal = ({ cosmetic, isOpen, onClose }: CosmeticDetailModalProps) => {
  const [cosmeticData, setCosmeticData] = useState<any>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (cosmetic && isOpen) {
      fetchCosmeticData();
    }
  }, [cosmetic, isOpen]);

  const fetchCosmeticData = async () => {
    if (!cosmetic) return;
    
    setLoadingHistory(true);
    try {
      // Search by name to get the most complete data
      const response = await fetch(`https://fortnite-api.com/v2/cosmetics/br/search?name=${encodeURIComponent(cosmetic.name)}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 200 && data.data) {
          setCosmeticData(data.data);
          console.log("Fetched detailed cosmetic data:", data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching cosmetic data:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  if (!isOpen || !cosmetic) return null;

  const hasSeries = cosmetic.series?.value;
  let rarityGradient: string;
  if (hasSeries) {
    const seriesName = cosmetic.series.value.toLowerCase();
    rarityGradient = seriesColors[seriesName as keyof typeof seriesColors] || rarityColors.common;
  } else {
    const rarityKey = cosmetic.rarity?.value?.toLowerCase() as keyof typeof rarityColors;
    rarityGradient = rarityColors[rarityKey] || rarityColors.common;
  }

  // Try to get the best image available
  const fullBodyImage = cosmetic.images?.featured || cosmetic.images?.icon || cosmetic.images?.smallIcon;
  
  // Fallback image from placeholder service if no image available
  const fallbackImage = `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=600&fit=crop`;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Unknown";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Unknown";
    }
  };

  const getLastSeen = () => {
    // Check if it has shop history first
    if (cosmeticData?.shopHistory && cosmeticData.shopHistory.length > 0) {
      const lastShopDate = formatDate(cosmeticData.shopHistory[0].date);
      return `${lastShopDate} (Item Shop)`;
    }
    
    // Check lastAppearance data
    if (cosmeticData?.lastAppearance?.date) {
      const lastSeenDate = formatDate(cosmeticData.lastAppearance.date);
      const daysAgo = cosmeticData.lastAppearance.unseenFor || 0;
      return `${lastSeenDate} (${daysAgo} days ago)`;
    }
    
    // Check if it's from Battle Pass based on introduction data
    if (cosmetic.introduction?.chapter && cosmetic.introduction?.season) {
      return `Chapter ${cosmetic.introduction.chapter}, Season ${cosmetic.introduction.season} (Battle Pass)`;
    }
    
    // Check if it has gameplayTags that might indicate source
    if (cosmeticData?.gameplayTags) {
      const tags = cosmeticData.gameplayTags;
      if (tags.some((tag: string) => tag.toLowerCase().includes('battlepass'))) {
        return "Battle Pass";
      }
      if (tags.some((tag: string) => tag.toLowerCase().includes('starter'))) {
        return "Starter Pack";
      }
      if (tags.some((tag: string) => tag.toLowerCase().includes('crew'))) {
        return "Fortnite Crew";
      }
    }
    
    // Default fallback
    return "Special Release";
  };

  const getReleaseDate = () => {
    if (cosmetic.introduction) {
      return `Chapter ${cosmetic.introduction.chapter}, Season ${cosmetic.introduction.season}`;
    }
    return "Unknown";
  };

  const getSetInfo = () => {
    // First check if the cosmetic has a series
    if (cosmetic.series?.value) {
      return cosmetic.series.value;
    }
    // Then check if the cosmetic data has set information
    if (cosmeticData?.set?.value) {
      return cosmeticData.set.value;
    }
    // If no set information is available
    return "No Set";
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">{cosmetic.name}</h2>
            <p className="text-gray-400 mt-1">{cosmetic.description || "No description available"}</p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className={cn(
                "aspect-[3/4] rounded-xl overflow-hidden border-4 bg-slate-800",
                `bg-gradient-to-br ${rarityGradient}`
              )}>
                <img
                  src={fullBodyImage || fallbackImage}
                  alt={cosmetic.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = fallbackImage;
                  }}
                />
              </div>
              
              {/* Rarity Badge */}
              <div className="flex justify-center">
                <span className={cn(
                  "px-4 py-2 text-lg font-bold rounded-full text-white shadow-lg",
                  `bg-gradient-to-r ${rarityGradient}`
                )}>
                  {cosmetic.series?.value || cosmetic.rarity?.displayValue || "Common"}
                </span>
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-slate-800/50 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Type</p>
                    <p className="text-white font-medium">{cosmetic.type?.displayValue || "Unknown"}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Rarity</p>
                    <p className="text-white font-medium capitalize">{cosmetic.rarity?.displayValue || "Common"}</p>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <p className="text-gray-400 text-sm">Set</p>
                    <p className="text-white font-medium">{getSetInfo()}</p>
                  </div>
                </div>
              </div>

              {/* Release Info */}
              <div className="bg-slate-800/50 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Release Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">First Released</p>
                    <p className="text-white font-medium">{getReleaseDate()}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Availability</p>
                    <div className="flex items-center gap-2">
                      {loadingHistory ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      ) : (
                        <Eye className="w-4 h-4 text-green-400" />
                      )}
                      <p className="text-white font-medium">
                        {loadingHistory ? "Loading..." : getLastSeen()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {cosmetic.series && (
                <div className="bg-slate-800/50 rounded-xl p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-400" />
                    Series Information
                  </h3>
                  
                  <div>
                    <p className="text-gray-400 text-sm">Part of Series</p>
                    <p className="text-white font-medium">{cosmetic.series.value}</p>
                  </div>
                </div>
              )}

              {/* Shop History */}
              {cosmeticData?.shopHistory && cosmeticData.shopHistory.length > 0 && (
                <div className="bg-slate-800/50 rounded-xl p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white">Recent Shop Appearances</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {cosmeticData.shopHistory.slice(0, 5).map((entry: any, index: number) => (
                      <div key={index} className="text-sm text-gray-300">
                        {formatDate(entry.date)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-6 bg-slate-800/50">
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
