import { CosmeticItem } from "@/pages/Index";
import { cn } from "@/lib/utils";

interface CosmeticCardProps {
  cosmetic: CosmeticItem;
  index: number;
  onClick?: (cosmetic: CosmeticItem) => void;
}

const rarityColors = {
  common: "from-gray-400 to-gray-600 border-gray-400/30",
  uncommon: "from-green-400 to-green-600 border-green-400/30",
  rare: "from-blue-400 to-blue-600 border-blue-400/30",
  epic: "from-purple-400 to-purple-600 border-purple-400/30",
  legendary: "from-orange-400 to-orange-600 border-orange-400/30",
  mythic: "from-yellow-400 to-yellow-600 border-yellow-400/30",
};

// Authentic series color schemes based on Fortnite's actual colors
const seriesColors = {
  "marvel series": "from-red-600 to-red-800 border-red-600/30", // Marvel red
  "dc series": "from-blue-600 to-blue-900 border-blue-600/30", // DC blue
  "icon series": "from-cyan-400 to-pink-500 border-cyan-400/30", // Cyan to pink gradient
  "gaming legends series": "from-purple-600 to-indigo-700 border-purple-600/30", // Purple gaming theme
  "star wars series": "from-yellow-400 to-orange-500 border-yellow-400/30", // Star Wars gold/orange
  "shadow series": "from-gray-800 to-black border-gray-800/30", // Dark shadow theme
  "slurp series": "from-cyan-400 to-blue-500 border-cyan-400/30", // Slurp blue/cyan
  "lava series": "from-red-500 to-orange-600 border-red-500/30", // Lava red/orange
  "frozen series": "from-blue-200 to-blue-400 border-blue-200/30", // Ice blue
  "molten series": "from-orange-500 to-red-600 border-orange-500/30", // Molten orange/red
  "dark series": "from-purple-800 to-black border-purple-800/30", // Dark purple
  "cup series": "from-yellow-500 to-amber-600 border-yellow-500/30", // Tournament gold
};

// Helper function to get series gradient from API colors or fallback to predefined
const getSeriesGradient = (series: { value: string; colors?: string[] }) => {
  const seriesName = series.value.toLowerCase();
  
  // Check if we have predefined colors for this series
  if (seriesColors[seriesName as keyof typeof seriesColors]) {
    return seriesColors[seriesName as keyof typeof seriesColors];
  }
  
  // If API provides colors, use them
  if (series.colors && series.colors.length > 0) {
    const cleanColors = series.colors.map(color => '#' + color.slice(0, 6));
    
    if (cleanColors.length === 1) {
      return `from-[${cleanColors[0]}] to-[${cleanColors[0]}] border-[${cleanColors[0]}]/30`;
    }
    
    const firstColor = cleanColors[0];
    const lastColor = cleanColors[cleanColors.length - 1];
    
    return `from-[${firstColor}] to-[${lastColor}] border-[${firstColor}]/30`;
  }
  
  // Fallback to common rarity
  return rarityColors.common;
};

export const CosmeticCard = ({ cosmetic, index, onClick }: CosmeticCardProps) => {
  // Check if item has series
  const hasSeries = cosmetic.series?.value;
  
  let rarityGradient: string;
  if (hasSeries) {
    rarityGradient = getSeriesGradient(cosmetic.series);
  } else {
    const rarityKey = cosmetic.rarity?.value?.toLowerCase() as keyof typeof rarityColors;
    rarityGradient = rarityColors[rarityKey] || rarityColors.common;
  }
  
  const imageUrl = cosmetic.images?.icon || cosmetic.images?.smallIcon || cosmetic.images?.featured;

  const handleClick = () => {
    console.log('Card clicked:', cosmetic.name);
    if (onClick) {
      onClick(cosmetic);
    }
  };

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
      onClick={handleClick}
    >
      {/* Image */}
      <div className="aspect-square relative overflow-hidden bg-slate-900/50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={cosmetic.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
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

        {/* Last Seen and Source */}
        <div className="flex flex-col gap-1 mb-2">
          <span className="text-[11px] text-gray-400">
            <span className="font-semibold text-white">Last Seen:</span> {cosmetic.introduction ? `C${cosmetic.introduction.chapter}S${cosmetic.introduction.season}` : 'Unknown'}
          </span>
          <span className="text-[11px] text-gray-400">
            <span className="font-semibold text-white">Source:</span> {getSourceLabel(cosmetic)}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400 capitalize">
            {cosmetic.type?.displayValue || "Item"}
          </span>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

// Helper to infer source label
function getSourceLabel(cosmetic: CosmeticItem): string {
  // If series is a known collab
  if (cosmetic.series?.value) {
    const name = cosmetic.series.value.toLowerCase();
    if (name.includes('marvel') || name.includes('dc') || name.includes('star wars') || name.includes('gaming')) {
      return `Collaboration`;
    }
  }
  // If type is present, guess based on type
  if (cosmetic.type?.value) {
    const type = cosmetic.type.value.toLowerCase();
    if (type.includes('crew')) return 'Fortnite Crew';
    if (type.includes('starter')) return 'Starter Pack';
    if (type.includes('tournament') || type.includes('cup')) return 'Tournament';
  }
  // Fallback to Item Shop for most items
  return 'Item Shop';
}

// Helper to format date
function formatDate(dateString: string): string {
  if (!dateString) return 'Unknown';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
  } catch {
    return 'Unknown';
  }
}
