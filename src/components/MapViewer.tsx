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
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [isMouseOverMap, setIsMouseOverMap] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Season-specific map image URL from Fortnite-API with proper format
  const getMapImageUrl = (chapter: number, season: number) => {
    // Try different URL formats for different seasons
    const timestamp = Date.now(); // Cache busting
    
    // For different chapters and seasons, use different API endpoints
    if (chapter === 1) {
      switch (season) {
        case 1:
          return `https://media.fortniteapi.io/images/C1S1_map.png?t=${timestamp}`;
        case 2:
          return `https://media.fortniteapi.io/images/C1S2_map.png?t=${timestamp}`;
        case 3:
          return `https://media.fortniteapi.io/images/C1S3_map.png?t=${timestamp}`;
        case 4:
          return `https://media.fortniteapi.io/images/C1S4_map.png?t=${timestamp}`;
        default:
          return `https://media.fortniteapi.io/images/map.png?showPOI=false&chapter=${chapter}&season=${season}&t=${timestamp}`;
      }
    } else if (chapter === 2) {
      switch (season) {
        case 1:
          return `https://media.fortniteapi.io/images/C2S1_map.png?t=${timestamp}`;
        case 2:
          return `https://media.fortniteapi.io/images/C2S2_map.png?t=${timestamp}`;
        default:
          return `https://media.fortniteapi.io/images/map.png?showPOI=false&chapter=${chapter}&season=${season}&t=${timestamp}`;
      }
    }
    
    // For newer chapters, use the API with parameters and cache busting
    return `https://media.fortniteapi.io/images/map.png?showPOI=false&chapter=${chapter}&season=${season}&t=${timestamp}`;
  };
  
  const mapImageUrl = getMapImageUrl(chapter, season);

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
    setZoom(prev => Math.min(prev + 0.25, 4));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 1)); // Changed minimum from 0.25 to 1
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Only handle wheel events when mouse is over the map
    if (!isMouseOverMap) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate zoom factor based on wheel delta
    const delta = -e.deltaY * 0.002;
    const newZoom = Math.min(Math.max(zoom + delta, 1), 4); // Changed minimum from 0.25 to 1
    
    if (newZoom !== zoom) {
      // Calculate zoom point relative to current position
      const zoomRatio = newZoom / zoom;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Adjust position to zoom towards mouse cursor
      const newX = position.x - (mouseX - centerX - position.x) * (zoomRatio - 1);
      const newY = position.y - (mouseY - centerY - position.y) * (zoomRatio - 1);
      
      // Apply boundaries
      const maxX = (rect.width * (newZoom - 1)) / 2;
      const maxY = (rect.height * (newZoom - 1)) / 2;
      
      setPosition({
        x: Math.min(Math.max(newX, -maxX), maxX),
        y: Math.min(Math.max(newY, -maxY), maxY)
      });
      
      setZoom(newZoom);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    
    const newX = position.x + deltaX;
    const newY = position.y + deltaY;
    
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
    
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
      setLastMousePos({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    
    const deltaX = touch.clientX - lastMousePos.x;
    const deltaY = touch.clientY - lastMousePos.y;
    
    const newX = position.x + deltaX;
    const newY = position.y + deltaY;
    
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
    
    setLastMousePos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMouseEnter = () => {
    setIsMouseOverMap(true);
  };

  const handleMouseLeave = () => {
    setIsMouseOverMap(false);
    setIsDragging(false);
  };

  // Reset position when zoom changes to prevent getting stuck or when chapter/season changes
  useEffect(() => {
    if (zoom <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [zoom]);

  // Reset zoom and position when chapter or season changes
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [chapter, season]);

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
            disabled={zoom <= 1} // Updated to reflect new minimum
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
            disabled={zoom >= 4}
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
          className="aspect-square max-w-4xl mx-auto bg-slate-700/50 rounded-lg overflow-hidden relative select-none"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ 
            cursor: isDragging ? 'grabbing' : (zoom > 1 ? 'grab' : 'default'),
            touchAction: 'none'
          }}
        >
          <img 
            ref={imageRef}
            src={mapImageUrl}
            alt={`Chapter ${chapter} Season ${season} Map`}
            className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-75 ease-out"
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              transformOrigin: 'center center'
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              console.log(`Failed to load map for Chapter ${chapter} Season ${season}, trying fallback`);
              // Fallback to generic current map if specific season map fails
              target.src = "https://media.fortniteapi.io/images/map.png?showPOI=false";
            }}
            draggable={false}
          />
          
          {/* Zoom hint */}
          {zoom === 1 && !isDragging && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm animate-fade-in">
              Scroll to zoom • Drag to pan
            </div>
          )}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            Map data from Fortnite API • Chapter {chapter} Season {season} • Zoom: {Math.round(zoom * 100)}% • {zoom > 1 ? 'Drag to pan' : 'Scroll to zoom'}
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
