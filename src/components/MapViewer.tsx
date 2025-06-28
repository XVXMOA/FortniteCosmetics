
import React from 'react';

interface MapViewerProps {
  chapter: number;
  season: number;
}

export const MapViewer = ({ chapter, season }: MapViewerProps) => {
  // Map image URL from Fortnite-API
  const mapImageUrl = `https://media.fortniteapi.io/images/map.png?showPOI=false`;
  
  const getSeasonName = (chapter: number, season: number) => {
    // You can add more specific season names here
    const seasonNames: { [key: string]: string } = {
      "1-1": "Season 1",
      "1-2": "Season 2", 
      "1-3": "Season 3",
      "1-4": "Season 4",
      "2-1": "Chapter 2 Season 1",
      "2-2": "Chapter 2 Season 2",
      // Add more as needed
    };
    
    return seasonNames[`${chapter}-${season}`] || `Chapter ${chapter} Season ${season}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          {getSeasonName(chapter, season)}
        </h2>
        <p className="text-gray-300">
          Interactive map for Chapter {chapter}, Season {season}
        </p>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6">
        <div className="aspect-square max-w-4xl mx-auto bg-slate-700/50 rounded-lg overflow-hidden">
          <img 
            src={mapImageUrl}
            alt={`Chapter ${chapter} Season ${season} Map`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            Map data from Fortnite API
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-purple-500/20 p-4">
          <h3 className="text-white font-semibold mb-2">Chapter Info</h3>
          <p className="text-gray-300 text-sm">Chapter {chapter}</p>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-purple-500/20 p-4">
          <h3 className="text-white font-semibold mb-2">Season Info</h3>
          <p className="text-gray-300 text-sm">Season {season}</p>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-purple-500/20 p-4">
          <h3 className="text-white font-semibold mb-2">Map Features</h3>
          <p className="text-gray-300 text-sm">Interactive POI locations</p>
        </div>
      </div>
    </div>
  );
};
