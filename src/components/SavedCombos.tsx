import { useState, useEffect } from "react";
import { CosmeticItem } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Eye, Share2, Heart } from "lucide-react";
import { CosmeticCard } from "./CosmeticCard";
import { ComboViewer3D } from "./ComboViewer3D";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface SavedCombo {
  id: string;
  name: string;
  description?: string;
  outfit_id?: string;
  outfit_name?: string;
  outfit_image?: string;
  backpack_id?: string;
  backpack_name?: string;
  backpack_image?: string;
  pickaxe_id?: string;
  pickaxe_name?: string;
  pickaxe_image?: string;
  glider_id?: string;
  glider_name?: string;
  glider_image?: string;
  emote_id?: string;
  emote_name?: string;
  emote_image?: string;
  is_public: boolean;
  likes_count: number;
  created_at: string;
  user_id?: string;
}

interface SavedCombosProps {
  onBackToRandomizer: () => void;
}

export const SavedCombos = ({ onBackToRandomizer }: SavedCombosProps) => {
  const [savedCombos, setSavedCombos] = useState<SavedCombo[]>([]);
  const [selectedCombo, setSelectedCombo] = useState<SavedCombo | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "view">("list");
  const [showPublicCombos, setShowPublicCombos] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadCombos();
  }, [showPublicCombos, user]);

  const loadCombos = async () => {
    if (!user) return;

    try {
      let query = supabase.from('combos').select('*');
      
      if (showPublicCombos) {
        query = query.eq('is_public', true);
      } else {
        query = query.eq('user_id', user.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setSavedCombos(data || []);
    } catch (error) {
      console.error('Error loading combos:', error);
      toast({
        title: "Error",
        description: "Failed to load combos.",
        variant: "destructive",
      });
    }
  };

  const deleteCombo = async (comboId: string) => {
    try {
      const { error } = await supabase
        .from('combos')
        .delete()
        .eq('id', comboId);
        
      if (error) throw error;
      
      setSavedCombos(prev => prev.filter(combo => combo.id !== comboId));
      toast({
        title: "Combo deleted",
        description: "Your combo has been removed.",
      });
    } catch (error) {
      console.error('Error deleting combo:', error);
      toast({
        title: "Error",
        description: "Failed to delete combo.",
        variant: "destructive",
      });
    }
  };

  const toggleComboVisibility = async (combo: SavedCombo) => {
    try {
      const { error } = await supabase
        .from('combos')
        .update({ is_public: !combo.is_public })
        .eq('id', combo.id);
        
      if (error) throw error;
      
      setSavedCombos(prev => 
        prev.map(c => 
          c.id === combo.id 
            ? { ...c, is_public: !c.is_public }
            : c
        )
      );
      
      toast({
        title: combo.is_public ? "Combo made private" : "Combo shared publicly",
        description: combo.is_public 
          ? "Your combo is now private." 
          : "Your combo is now visible to everyone.",
      });
    } catch (error) {
      console.error('Error updating combo visibility:', error);
      toast({
        title: "Error",
        description: "Failed to update combo visibility.",
        variant: "destructive",
      });
    }
  };

  const likeCombo = async (comboId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('combo_likes')
        .insert({ user_id: user.id, combo_id: comboId });
        
      if (error) throw error;
      
      // Refresh combos to get updated like count
      loadCombos();
      
      toast({
        title: "Combo liked!",
        description: "You liked this combo.",
      });
    } catch (error) {
      console.error('Error liking combo:', error);
      toast({
        title: "Error",
        description: "Failed to like combo.",
        variant: "destructive",
      });
    }
  };

  if (viewMode === "view" && selectedCombo) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {selectedCombo.name}
          </h2>
          <p className="text-xl text-gray-300">
            3D preview of your combo
          </p>
        </div>

        <ComboViewer3D combo={{
          outfit: selectedCombo.outfit_id ? {
            id: selectedCombo.outfit_id,
            name: selectedCombo.outfit_name || '',
            images: { icon: selectedCombo.outfit_image }
          } as CosmeticItem : undefined,
          backpack: selectedCombo.backpack_id ? {
            id: selectedCombo.backpack_id,
            name: selectedCombo.backpack_name || '',
            images: { icon: selectedCombo.backpack_image }
          } as CosmeticItem : undefined,
          pickaxe: selectedCombo.pickaxe_id ? {
            id: selectedCombo.pickaxe_id,
            name: selectedCombo.pickaxe_name || '',
            images: { icon: selectedCombo.pickaxe_image }
          } as CosmeticItem : undefined,
          glider: selectedCombo.glider_id ? {
            id: selectedCombo.glider_id,
            name: selectedCombo.glider_name || '',
            images: { icon: selectedCombo.glider_image }
          } as CosmeticItem : undefined,
          emote: selectedCombo.emote_id ? {
            id: selectedCombo.emote_id,
            name: selectedCombo.emote_name || '',
            images: { icon: selectedCombo.emote_image }
          } as CosmeticItem : undefined,
        }} />

        <div className="flex justify-center">
          <Button
            onClick={() => setViewMode("list")}
            variant="outline"
            className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  if (savedCombos.length === 0) {
    return (
      <div className="space-y-8">
        {/* Header with tabs */}
        <div className="text-center space-y-4 mb-6">
          <h2 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {showPublicCombos ? 'Community Combos' : 'Your Saved Combos'}
          </h2>
          <div className="flex justify-center gap-4">
            <Button
              variant={!showPublicCombos ? "default" : "outline"}
              onClick={() => setShowPublicCombos(false)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              My Combos
            </Button>
            <Button
              variant={showPublicCombos ? "default" : "outline"}
              onClick={() => setShowPublicCombos(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Community
            </Button>
          </div>
        </div>

        <div className="text-center py-20">
          <div className="text-8xl mb-6">📦</div>
          <h3 className="text-2xl font-semibold text-white mb-4">
            {showPublicCombos ? 'No public combos yet' : 'No saved combos yet'}
          </h3>
          <p className="text-gray-400 text-lg mb-8">
            {showPublicCombos 
              ? 'Be the first to share a combo with the community!' 
              : 'Create and save some combos to see them here!'
            }
          </p>
          <Button
            onClick={onBackToRandomizer}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {showPublicCombos ? 'Create a Combo' : 'Go to Creator'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with tabs */}
      <div className="text-center space-y-4 mb-6">
        <h2 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {showPublicCombos ? 'Community Combos' : 'Your Saved Combos'}
        </h2>
        <div className="flex justify-center gap-4">
          <Button
            variant={!showPublicCombos ? "default" : "outline"}
            onClick={() => setShowPublicCombos(false)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            My Combos
          </Button>
          <Button
            variant={showPublicCombos ? "default" : "outline"}
            onClick={() => setShowPublicCombos(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Community
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedCombos.map((combo) => (
          <div
            key={combo.id}
            className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-purple-500 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{combo.name}</h3>
                {combo.description && (
                  <p className="text-gray-300 text-sm mb-2">{combo.description}</p>
                )}
                <p className="text-xs text-gray-400">
                  Created: {new Date(combo.created_at).toLocaleDateString()}
                </p>
                {combo.is_public && (
                  <p className="text-xs text-green-400 mt-1">Public • {combo.likes_count} likes</p>
                )}
              </div>
            </div>

            {/* Preview items */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {combo.outfit_image && (
                <div className="text-center">
                  <img 
                    src={combo.outfit_image} 
                    alt={combo.outfit_name}
                    className="w-16 h-16 mx-auto rounded-lg object-cover"
                  />
                  <p className="text-xs text-gray-400 mt-1">Outfit</p>
                </div>
              )}
              {combo.backpack_image && (
                <div className="text-center">
                  <img 
                    src={combo.backpack_image} 
                    alt={combo.backpack_name}
                    className="w-16 h-16 mx-auto rounded-lg object-cover"
                  />
                  <p className="text-xs text-gray-400 mt-1">Back Bling</p>
                </div>
              )}
              {combo.pickaxe_image && (
                <div className="text-center">
                  <img 
                    src={combo.pickaxe_image} 
                    alt={combo.pickaxe_name}
                    className="w-16 h-16 mx-auto rounded-lg object-cover"
                  />
                  <p className="text-xs text-gray-400 mt-1">Pickaxe</p>
                </div>
              )}
              {combo.glider_image && (
                <div className="text-center">
                  <img 
                    src={combo.glider_image} 
                    alt={combo.glider_name}
                    className="w-16 h-16 mx-auto rounded-lg object-cover"
                  />
                  <p className="text-xs text-gray-400 mt-1">Glider</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  setSelectedCombo(combo);
                  setViewMode("view");
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
              
              {combo.user_id === user?.id ? (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleComboVisibility(combo)}
                    className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteCombo(combo.id)}
                    className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => likeCombo(combo.id)}
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
