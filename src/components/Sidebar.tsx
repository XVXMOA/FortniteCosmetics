
import { useState } from "react";
import { Menu, X, ChevronDown, ChevronRight, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  apiType: string;
}

interface SidebarProps {
  categories: Category[];
  currentCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onRandomizerView: () => void;
  onSavedCombosView: () => void;
  onCreateComboView: () => void;
  onMapView: (chapter: number, season: number) => void;
  currentView: "browse" | "randomizer" | "saved-combos" | "create-combo" | "map";
  currentMapSelection?: { chapter: number; season: number };
}

export const Sidebar = ({ 
  categories, 
  currentCategory, 
  onCategoryChange, 
  onRandomizerView,
  onSavedCombosView,
  onCreateComboView,
  onMapView,
  currentView,
  currentMapSelection
}: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cosmeticsExpanded, setCosmeticsExpanded] = useState(true);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<number[]>([]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleChapter = (chapter: number) => {
    setExpandedChapters(prev => 
      prev.includes(chapter) 
        ? prev.filter(c => c !== chapter)
        : [...prev, chapter]
    );
  };

  // Define chapters and their seasons
  const chapters = [
    { number: 1, seasons: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { number: 2, seasons: [1, 2, 3, 4, 5, 6, 7, 8] },
    { number: 3, seasons: [1, 2, 3, 4] },
    { number: 4, seasons: [1, 2, 3, 4] },
    { number: 5, seasons: [1, 2, 3, 4] }
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-slate-800/95 backdrop-blur-sm border-r border-purple-500/20 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-purple-500/20">
            <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Fortnite Vault
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {/* Cosmetics Section */}
              <div>
                <button
                  onClick={() => setCosmeticsExpanded(!cosmeticsExpanded)}
                  className="w-full flex items-center justify-between px-4 py-3 text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <span className="font-medium">Cosmetics</span>
                  {cosmeticsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                
                {cosmeticsExpanded && (
                  <div className="ml-4 mt-2 space-y-1">
                    {categories.map((category, index) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          onCategoryChange(category.id);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 rounded-lg transition-all duration-200 text-sm",
                          "animate-fade-in",
                          currentCategory === category.id && currentView === "browse"
                            ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                            : "text-gray-300 hover:bg-slate-700/50 hover:text-purple-300"
                        )}
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animationFillMode: "both"
                        }}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Map Section */}
              <div>
                <button
                  onClick={() => setMapExpanded(!mapExpanded)}
                  className="w-full flex items-center justify-between px-4 py-3 text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapIcon size={16} />
                    <span className="font-medium">Map</span>
                  </div>
                  {mapExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                
                {mapExpanded && (
                  <div className="ml-4 mt-2 space-y-1">
                    {chapters.map((chapter) => (
                      <div key={chapter.number}>
                        <button
                          onClick={() => toggleChapter(chapter.number)}
                          className="w-full flex items-center justify-between px-4 py-2 text-gray-300 hover:bg-slate-700/50 rounded-lg transition-colors text-sm"
                        >
                          <span>Chapter {chapter.number}</span>
                          {expandedChapters.includes(chapter.number) ? 
                            <ChevronDown size={14} /> : <ChevronRight size={14} />
                          }
                        </button>
                        
                        {expandedChapters.includes(chapter.number) && (
                          <div className="ml-4 mt-1 space-y-1">
                            {chapter.seasons.map((season) => (
                              <button
                                key={`${chapter.number}-${season}`}
                                onClick={() => {
                                  onMapView(chapter.number, season);
                                  setIsOpen(false);
                                }}
                                className={cn(
                                  "w-full text-left px-4 py-2 rounded-lg transition-colors text-xs",
                                  currentView === "map" && 
                                  currentMapSelection?.chapter === chapter.number && 
                                  currentMapSelection?.season === season
                                    ? "bg-green-600 text-white shadow-lg"
                                    : "text-gray-400 hover:bg-slate-700/50 hover:text-green-300"
                                )}
                              >
                                Season {season}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-purple-500/20 my-4"></div>
              
              {/* Create Your Own Combo button */}
              <button
                onClick={() => {
                  onCreateComboView();
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105",
                  "animate-fade-in relative overflow-hidden",
                  currentView === "create-combo"
                    ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg shadow-green-500/25"
                    : "text-white hover:bg-gradient-to-r hover:from-green-600/20 hover:to-blue-600/20 border-2 border-green-400/30"
                )}
              >
                Create Your Own Combo
              </button>
              
              {/* Randomizer button */}
              <button
                onClick={() => {
                  onRandomizerView();
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105",
                  "animate-fade-in relative overflow-hidden",
                  currentView === "randomizer"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 border-2 border-blue-400/30"
                )}
              >
                Randomizer
              </button>

              {/* Saved Combos button */}
              <button
                onClick={() => {
                  onSavedCombosView();
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105",
                  "animate-fade-in relative overflow-hidden",
                  currentView === "saved-combos"
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/25"
                    : "text-white hover:bg-gradient-to-r hover:from-pink-600/20 hover:to-purple-600/20 border-2 border-pink-400/30"
                )}
              >
                Saved Combos
              </button>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-purple-500/20">
            <p className="text-xs text-gray-400 text-center">
              Powered by Fortnite-API
            </p>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
