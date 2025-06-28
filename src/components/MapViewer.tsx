import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapViewerProps {
  chapter: number;
  season: number;
}

export const MapViewer = ({ chapter, season }: MapViewerProps) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newZoom = Math.min(Math.max(zoom + delta, 0.5), 3);
    setZoom(newZoom);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Calculate boundaries to prevent dragging too far
      const container = containerRef.current;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const maxX = (containerRect.width * (zoom - 1)) / 2;
        const maxY = (containerRect.height * (zoom - 1)) / 2;
        
        setPosition({
          x: Math.min(Math.max(newX, -maxX), maxX),
          y: Math.min(Math.max(newY, -maxY), maxY)
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset position when zoom changes to prevent getting stuck
  useEffect(() => {
    if (zoom <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [zoom]);

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
        {/* Zoom Controls */}
        <div className="flex justify-center mb-4 gap-2">
          <Button
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            variant="outline"
            size="sm"
            className="bg-slate-700/50 border-purple-500/30 text-white hover:bg-slate-600/50"
          >
            <ZoomOut size={16} />
          </Button>
          
          <div className="flex items-center px-3 py-1 bg-slate-700/50 rounded border border-purple-500/30 text-white text-sm min-w-20 justify-center">
            {Math.round(zoom * 100)}%
          </div>
          
          <Button
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            variant="outline"
            size="sm"
            className="bg-slate-700/50 border-purple-500/30 text-white hover:bg-slate-600/50"
          >
            <ZoomIn size={16} />
          </Button>
          
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="bg-slate-700/50 border-purple-500/30 text-white hover:bg-slate-600/50"
          >
            <RotateCcw size={16} />
          </Button>
        </div>

        <div 
          ref={containerRef}
          className="aspect-square max-w-4xl mx-auto bg-slate-700/50 rounded-lg overflow-hidden relative cursor-grab active:cursor-grabbing"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img 
            ref={imageRef}
            src={mapImageUrl}
            alt={`Chapter ${chapter} Season ${season} Map`}
            className="w-full h-full object-cover transition-transform duration-200 select-none"
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
            draggable={false}
          />
          
          {/* Zoom hint */}
          {zoom === 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              Use mouse wheel or buttons to zoom
            </div>
          )}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            Map data from Fortnite API • Zoom: {Math.round(zoom * 100)}% • {zoom > 1 ? 'Drag to pan' : 'Scroll to zoom'}
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
