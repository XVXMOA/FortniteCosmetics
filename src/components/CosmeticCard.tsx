
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
};

// Helper function to convert hex colors to CSS custom properties
const getSeriesGradient = (colors: string[]) => {
  if (!colors || colors.length === 0) return rarityColors.common;
  
  // Remove the 'ff' alpha channel and convert to proper hex
  const cleanColors = colors.map(color => '#' + color.slice(0, 6));
  
  if (cleanColors.length === 1) {
    return `from-[${cleanColors[0]}] to-[${cleanColors[0]}] border-[${cleanColors[0]}]/30`;
  }
  
  // Use first and last colors for gradient
  const firstColor = cleanColors[0];
  const lastColor = cleanColors[cleanColors.length - 1];
  
  return `from-[${firstColor}] to-[${lastColor}] border-[${firstColor}]/30`;
};

export const CosmeticCard = ({ cosmetic, index }: CosmeticCardProps) => {
  // Check if item has series colors
  const hasSeriesColors = cosmetic.series?.colors && cosmetic.series.colors.length > 0;
  
  let rarityGradient: string;
  if (hasSeriesColors) {
    rarityGradient = getSeriesGradient(cosmetic.series.colors);
  } else {
    const rarityKey = cosmetic.rarity?.value?.toLowerCase() as keyof typeof rarityColors;
    rarityGradient = rarityColors[rarityKey] || rarityColors.common;
  }
  
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
            {cosmetic.series?.value || cosmetic.rarity?.displayValue || "Common"}
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
