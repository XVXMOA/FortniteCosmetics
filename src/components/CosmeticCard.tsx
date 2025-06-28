
import { CosmeticItem } from "@/pages/Index";
import { cn } from "@/lib/utils";

interface CosmeticCardProps {
  cosmetic: CosmeticItem;
  index: number;
}

const rarityColors = {
  common: "from-gray-400 to-gray-600 border-gray-400/30",
  uncommon: "from-green-400 to-green-600 border-green-400/30",
  rare: "from-blue-400 to-blue-600 border-blue-400/30",
  epic: "from-purple-400 to-purple-600 border-purple-400/30",
  legendary: "from-orange-400 to-orange-600 border-orange-400/30",
  mythic: "from-yellow-400 to-yellow-600 border-yellow-400/30",
  exotic: "from-cyan-400 to-cyan-600 border-cyan-400/30",
  transcendent: "from-red-400 to-red-600 border-red-400/30",
  frozen: "from-blue-200 to-blue-400 border-blue-200/30",
  lava: "from-red-500 to-orange-500 border-red-500/30",
  legendary_series: "from-cyan-400 to-purple-500 border-cyan-400/30",
  dark_series: "from-purple-600 to-black border-purple-600/30",
  marvel_series: "from-red-500 to-yellow-500 border-red-500/30",
  dc_series: "from-blue-600 to-gray-800 border-blue-600/30",
  icon_series: "from-cyan-300 to-pink-400 border-cyan-300/30",
  shadow_series: "from-gray-700 to-black border-gray-700/30",
  slurp_series: "from-cyan-400 to-blue-500 border-cyan-400/30",
  gaming_legends_series: "from-purple-500 to-blue-500 border-purple-500/30"
};

export const CosmeticCard = ({ cosmetic, index }: CosmeticCardProps) => {
  const rarityKey = cosmetic.rarity?.value?.toLowerCase() as keyof typeof rarityColors;
  const rarityGradient = rarityColors[rarityKey] || rarityColors.common;
  
  const imageUrl = cosmetic.images?.icon || cosmetic.images?.smallIcon || cosmetic.images?.featured;

  return (
    <div 
      className={cn(
        "group relative bg-slate-800/80 backdrop-blur-sm rounded-xl overflow-hidden",
        "border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl",
        "animate-fade-in cursor-pointer",
        `bg-gradient-to-br ${rarityGradient}`
      )}
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: "both"
      }}
    >
      {/* Image */}
      <div className="aspect-square relative overflow-hidden bg-slate-900/50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={cosmetic.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🎮
          </div>
        )}
        
        {/* Rarity badge */}
        <div className="absolute top-2 right-2">
          <span className={cn(
            "px-2 py-1 text-xs font-bold rounded-full text-white shadow-lg",
            `bg-gradient-to-r ${rarityGradient}`
          )}>
            {cosmetic.rarity?.displayValue || "Common"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 bg-slate-800/90">
        <h3 className="font-bold text-white text-sm mb-1 truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
          {cosmetic.name}
        </h3>
        
        {cosmetic.description && (
          <p className="text-xs text-gray-300 line-clamp-2 mb-2">
            {cosmetic.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400 capitalize">
            {cosmetic.type?.displayValue || "Item"}
          </span>
          
          {cosmetic.introduction && (
            <span className="text-blue-400 font-medium">
              C{cosmetic.introduction.chapter}S{cosmetic.introduction.season}
            </span>
          )}
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};
