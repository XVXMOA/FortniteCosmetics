
import { useState, useRef, useEffect } from "react";
import { CosmeticItem } from "@/pages/Index";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const viewerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    setRotation(prev => prev + deltaX * 0.5);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - startX;
    setRotation(prev => prev + deltaX * 0.5);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const resetRotation = () => {
    setRotation(0);
  };

  const comboItems = [
    { key: "outfit", item: combo.outfit, label: "Outfit", position: { x: 0, y: 0, z: 0 } },
    { key: "backpack", item: combo.backpack, label: "Back Bling", position: { x: -20, y: 10, z: -10 } },
    { key: "pickaxe", item: combo.pickaxe, label: "Pickaxe", position: { x: 30, y: -10, z: 5 } },
    { key: "glider", item: combo.glider, label: "Glider", position: { x: -30, y: 20, z: -15 } },
    { key: "emote", item: combo.emote, label: "Emote", position: { x: 0, y: -30, z: 0 } },
  ];

  return (
    <div className="space-y-6">
      {/* 3D Viewer */}
      <div className="relative">
        <div
          ref={viewerRef}
          className="w-full h-96 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border border-gray-700 overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            perspective: "1000px",
            userSelect: "none"
          }}
        >
          {/* 3D Scene Container */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              transform: `rotateY(${rotation}deg)`,
              transformStyle: "preserve-3d",
              transition: isDragging ? "none" : "transform 0.3s ease-out"
            }}
          >
            {/* Central Platform */}
            <div
              className="absolute w-32 h-4 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-full"
              style={{
                transform: "rotateX(90deg) translateZ(-2px)",
                boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)"
              }}
            />

            {/* Combo Items */}
            {comboItems.map(({ key, item, label, position }) => {
              if (!item) return null;
              
              return (
                <div
                  key={key}
                  className="absolute transition-all duration-300"
                  style={{
                    transform: `translate3d(${position.x}px, ${position.y}px, ${position.z}px)`,
                    transformStyle: "preserve-3d"
                  }}
                >
                  <div className="relative group">
                    {/* Item Card */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-600 shadow-lg bg-slate-800">
                      <img
                        src={item.images.icon || item.images.smallIcon}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Item Label */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.name}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Lighting Effects */}
            <div
              className="absolute w-full h-full pointer-events-none"
              style={{
                background: "radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)"
              }}
            />
          </div>

          {/* Instructions */}
          <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-3 py-2 rounded">
            Drag to rotate
          </div>
        </div>

        {/* Reset Button */}
        <Button
          onClick={resetRotation}
          variant="outline"
          size="sm"
          className="absolute bottom-4 left-4 border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset View
        </Button>
      </div>

      {/* Combo Summary */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-2xl font-bold text-white mb-4 text-center">Combo Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {comboItems.map(({ key, item, label }) => (
            <div key={key} className="text-center space-y-2">
              <h4 className="text-sm font-semibold text-purple-400">{label}</h4>
              {item ? (
                <div className="space-y-2">
                  <div className="w-16 h-16 mx-auto rounded-lg overflow-hidden border border-gray-600">
                    <img
                      src={item.images.icon || item.images.smallIcon}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-gray-300 truncate">{item.name}</p>
                </div>
              ) : (
                <div className="w-16 h-16 mx-auto bg-slate-700 rounded-lg border border-gray-600 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">None</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
