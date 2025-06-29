import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export const ItemShop = () => {
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedBundle, setExpandedBundle] = useState<string | null>(null);

  const fetchShop = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://fortnite-api.com/v2/shop");
      const data = await res.json();
      if (data.status === 200 && data.data) {
        setShop(data.data);
      } else {
        setError(data.error || "Failed to load shop.");
      }
    } catch (e) {
      setError("Failed to load shop.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShop();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-400 text-center mt-8">{error}</div>;
  if (!shop) return null;

  // Helper to render V-Bucks price
  const vbuckIcon = shop.vbuckIcon;
  const renderPrice = (price: number) => (
    <span className="inline-flex items-center gap-1 font-semibold">
      <img src={vbuckIcon} alt="V-Bucks" className="w-5 h-5 inline-block" />
      <span className="text-white">{price}</span>
    </span>
  );

  // Group entries by layout.name (or layoutId if name missing), filtering out jam tracks/music
  const isJamTrack = (entry: any) => {
    // Check if any item in brItems is a music track or layout is a jam track section
    if (entry.layout?.name?.toLowerCase().includes('jam track')) return true;
    if (entry.brItems) {
      for (const item of entry.brItems) {
        if (
          item.type?.value?.toLowerCase() === 'music' ||
          item.type?.displayValue?.toLowerCase() === 'music'
        ) {
          return true;
        }
      }
    }
    return false;
  };
  const groups: Record<string, { name: string; entries: any[] }> = {};
  for (const entry of shop.entries) {
    if (isJamTrack(entry)) continue;
    const layoutName = entry.layout?.name || entry.layoutId || "Other";
    if (!groups[layoutName]) {
      groups[layoutName] = { name: layoutName, entries: [] };
    }
    groups[layoutName].entries.push(entry);
  }
  const groupList = Object.values(groups);

  // Rarity color map
  const rarityBg: Record<string, string> = {
    common: 'bg-gray-700',
    uncommon: 'bg-green-700',
    rare: 'bg-blue-700',
    epic: 'bg-purple-700',
    legendary: 'bg-yellow-700',
    mythic: 'bg-orange-700',
    exotic: 'bg-yellow-600',
    transcendent: 'bg-pink-700',
  };
  // Rarity glow map
  const rarityGlow: Record<string, string> = {
    common: 'shadow-[0_0_24px_0_rgba(156,163,175,0.7)]', // gray
    uncommon: 'shadow-[0_0_24px_0_rgba(34,197,94,0.7)]', // green
    rare: 'shadow-[0_0_24px_0_rgba(59,130,246,0.7)]', // blue
    epic: 'shadow-[0_0_24px_0_rgba(168,85,247,0.7)]', // purple
    legendary: 'shadow-[0_0_24px_0_rgba(253,224,71,0.7)]', // yellow
    mythic: 'shadow-[0_0_24px_0_rgba(251,146,60,0.7)]', // orange
    exotic: 'shadow-[0_0_24px_0_rgba(253,224,71,0.7)]', // yellow
    transcendent: 'shadow-[0_0_24px_0_rgba(236,72,153,0.7)]', // pink
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Current Item Shop</h2>
        <button
          onClick={fetchShop}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow hover:scale-105 transition"
        >
          Refresh
        </button>
      </div>
      
      <div className="space-y-10">
        {groupList.map((group) => {
          if (!group.entries.length) return null;
          // Revert: Split entries into rows of 4, with skins (outfits) at the top
          // Separate bundles and singles
          const bundles = group.entries.filter((e: any) => e.bundle);
          const singles = group.entries.filter((e: any) => !e.bundle);
          // Sort singles: outfits first, then others
          const sortedSingles = [
            ...singles.filter((e: any) => {
              const item = e.brItems?.[0];
              return item && item.type?.value?.toLowerCase() === 'outfit';
            }),
            ...singles.filter((e: any) => {
              const item = e.brItems?.[0];
              return !item || item.type?.value?.toLowerCase() !== 'outfit';
            })
          ];
          // Merge bundles (original order) and sorted singles
          const allEntries = [...bundles, ...sortedSingles];
          // Now split into rows of 4
          const rows = [];
          for (let i = 0; i < allEntries.length; i += 4) {
            rows.push(allEntries.slice(i, i + 4));
          }
          return (
            <div key={group.name} className="mb-14">
              <h3 className="text-xl font-bold text-purple-300 text-center mb-2">{group.name}</h3>
              <div className="flex justify-center mb-6">
                <div className="w-24 border-b-2 border-purple-400 opacity-60" />
              </div>
              <div className="space-y-6">
                {rows.map((row, rowIdx) => (
                  <div key={rowIdx} className="bg-slate-800 rounded-2xl p-6 border border-purple-700 shadow-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                      {row.map((entry: any, colIdx) => {
                        if (!entry) return <div key={`empty-${colIdx}`} />;
                        // If bundle, show bundle image and all items
                        if (entry.bundle) {
                          return (
                            <div key={entry.offerId} className="bg-slate-900 rounded-xl p-4 border border-purple-500 shadow flex flex-col items-center w-full">
                              <img src={entry.bundle?.image || entry.newDisplayAsset?.renderImages?.[0]?.image} alt={entry.bundle?.name} className="w-20 h-20 sm:w-24 sm:h-24 md:w-full md:h-40 object-contain mb-3 rounded-lg bg-slate-800 mx-auto" />
                              <h4 className="text-sm sm:text-lg font-bold text-white text-center mb-1">{entry.bundle?.name}</h4>
                              <div className="text-gray-300 text-xs sm:text-sm mb-2 text-center">{entry.bundle?.info}</div>
                              <div className="mb-2">{renderPrice(entry.finalPrice)}</div>
                            </div>
                          );
                        }
                        // Single item
                        const item = entry.brItems?.[0];
                        if (!item) return null;
                        const rarity = item.rarity?.value?.toLowerCase() || 'common';
                        const cardBg = rarityBg[rarity] || 'bg-gray-700';
                        const cardGlow = rarityGlow[rarity] || 'shadow-[0_0_24px_0_rgba(156,163,175,0.7)]';
                        return (
                          <div key={entry.offerId} className={`${cardBg} ${cardGlow} rounded-xl p-4 border border-blue-500 flex flex-col items-center`}>
                            <img src={item.images.icon || item.images.smallIcon} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 md:w-full md:h-40 object-contain mb-3 rounded-lg bg-slate-800" />
                            <h4 className="text-sm sm:text-lg font-bold text-white text-center mb-1">{item.name}</h4>
                            <div className="mb-2">{renderPrice(entry.finalPrice)}</div>
                          </div>
                        );
                      })}
                      {/* Fill empty columns if row has < 4 items */}
                      {row.length < 4 && Array.from({ length: 4 - row.length }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}; 