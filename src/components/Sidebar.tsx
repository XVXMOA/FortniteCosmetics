import { useState } from "react";
import { Menu, X } from "lucide-react";
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
  currentView: "browse" | "randomizer" | "saved-combos" | "create-combo";
}

export const Sidebar = ({ 
  categories, 
  currentCategory, 
  onCategoryChange, 
  onRandomizerView,
  onSavedCombosView,
  onCreateComboView,
  currentView 
}: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

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
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => {
                    onCategoryChange(category.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105",
                    "animate-fade-in",
                    currentCategory === category.id && currentView === "browse"
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25"
                      : "text-white hover:bg-slate-700/50 hover:text-purple-300"
                  )}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "both"
                  }}
                >
                  {category.name}
                </button>
              ))}
              
              {/* Create Your Own Combo button */}
              <button
                onClick={() => {
                  onCreateComboView();
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 mt-6",
                  "animate-fade-in",
                  currentView === "create-combo"
                    ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg shadow-green-500/25"
                    : "text-white hover:bg-gradient-to-r hover:from-green-600/20 hover:to-blue-600/20 border border-green-500/30"
                )}
                style={{
                  animationDelay: `${categories.length * 100}ms`,
                  animationFillMode: "both"
                }}
              >
                🎨 Create Your Own Combo
              </button>
              
              {/* Randomizer button */}
              <button
                onClick={() => {
                  onRandomizerView();
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105",
                  "animate-fade-in",
                  currentView === "randomizer"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 border border-blue-500/30"
                )}
                style={{
                  animationDelay: `${(categories.length + 1) * 100}ms`,
                  animationFillMode: "both"
                }}
              >
                🎲 Randomizer
              </button>

              {/* Saved Combos button */}
              <button
                onClick={() => {
                  onSavedCombosView();
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105",
                  "animate-fade-in",
                  currentView === "saved-combos"
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/25"
                    : "text-white hover:bg-gradient-to-r hover:from-pink-600/20 hover:to-purple-600/20 border border-pink-500/30"
                )}
                style={{
                  animationDelay: `${(categories.length + 2) * 100}ms`,
                  animationFillMode: "both"
                }}
              >
                💖 Saved Combos
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
