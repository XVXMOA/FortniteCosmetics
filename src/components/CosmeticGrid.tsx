
import { CosmeticItem } from "@/pages/Index";
import { CosmeticCard } from "./CosmeticCard";

interface CosmeticGridProps {
  cosmetics: CosmeticItem[];
  category: string;
}

export const CosmeticGrid = ({ cosmetics, category }: CosmeticGridProps) => {
  if (cosmetics.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎮</div>
        <h3 className="text-2xl font-semibold text-white mb-2">No {category} Found</h3>
        <p className="text-gray-400">Try refreshing the page or check back later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">
          {category} 
          <span className="text-lg font-normal text-gray-400 ml-2">
            ({cosmetics.length} items)
          </span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {cosmetics.map((cosmetic, index) => (
          <CosmeticCard 
            key={cosmetic.id} 
            cosmetic={cosmetic} 
            index={index}
          />
        ))}
      </div>
    </div>
  );
};
