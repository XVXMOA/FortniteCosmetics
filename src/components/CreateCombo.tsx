
import { useState } from "react";
import { CosmeticItem } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { CosmeticCard } from "./CosmeticCard";
import { ComboViewer3D } from "./ComboViewer3D";
import { useToast } from "@/hooks/use-toast";

interface CreateComboProps {
  cosmetics: CosmeticItem[];
  onBack: () => void;
}

interface CustomCombo {
  outfit?: CosmeticItem;
  backpack?: CosmeticItem;
  pickaxe?: CosmeticItem;
  glider?: CosmeticItem;
  emote?: CosmeticItem;
}

type ComboStep = "outfit" | "backpack" | "pickaxe" | "glider" | "emote" | "preview";

export const CreateCombo = ({ cosmetics, onBack }: CreateComboProps) => {
  const [currentStep, setCurrentStep] = useState<ComboStep>("outfit");
  const [selectedCombo, setSelectedCombo] = useState<CustomCombo>({});
  const [includeEmotes, setIncludeEmotes] = useState(false);
  const [includeBackpack, setIncludeBackpack] = useState(true);
  const { toast } = useToast();

  const steps: { key: ComboStep; label: string; required: boolean }[] = [
    { key: "outfit", label: "Outfit", required: true },
    { key: "backpack", label: "Back Bling", required: false },
    { key: "pickaxe", label: "Pickaxe", required: true },
    { key: "glider", label: "Glider", required: true },
    { key: "emote", label: "Emote", required: false },
    { key: "preview", label: "Preview", required: false },
  ];

  const getItemsForStep = (step: ComboStep): CosmeticItem[] => {
    const typeMap = {
      outfit: "outfit",
      backpack: "backpack",
      pickaxe: "pickaxe",
      glider: "glider",
      emote: "emote"
    };
    
    return cosmetics.filter(item => 
      item.type.value.toLowerCase() === typeMap[step]?.toLowerCase()
    );
  };

  const handleItemSelect = (item: CosmeticItem) => {
    setSelectedCombo(prev => ({
      ...prev,
      [currentStep]: item
    }));
  };

  const handleNext = () => {
    const currentStepIndex = steps.findIndex(s => s.key === currentStep);
    let nextStepIndex = currentStepIndex + 1;
    
    // Skip optional steps if not included
    while (nextStepIndex < steps.length) {
      const nextStep = steps[nextStepIndex];
      if (nextStep.key === "backpack" && !includeBackpack) {
        nextStepIndex++;
        continue;
      }
      if (nextStep.key === "emote" && !includeEmotes) {
        nextStepIndex++;
        continue;
      }
      break;
    }
    
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex].key);
    }
  };

  const handlePrevious = () => {
    const currentStepIndex = steps.findIndex(s => s.key === currentStep);
    let prevStepIndex = currentStepIndex - 1;
    
    // Skip optional steps if not included
    while (prevStepIndex >= 0) {
      const prevStep = steps[prevStepIndex];
      if (prevStep.key === "backpack" && !includeBackpack) {
        prevStepIndex--;
        continue;
      }
      if (prevStep.key === "emote" && !includeEmotes) {
        prevStepIndex--;
        continue;
      }
      break;
    }
    
    if (prevStepIndex >= 0) {
      setCurrentStep(steps[prevStepIndex].key);
    }
  };

  const canProceed = () => {
    const step = steps.find(s => s.key === currentStep);
    if (!step) return false;
    
    if (step.required) {
      return selectedCombo[currentStep] !== undefined;
    }
    return true;
  };

  const isLastStep = () => {
    const enabledSteps = steps.filter(step => {
      if (step.key === "backpack" && !includeBackpack) return false;
      if (step.key === "emote" && !includeEmotes) return false;
      return true;
    });
    
    return currentStep === enabledSteps[enabledSteps.length - 1].key;
  };

  const saveCombo = () => {
    const comboName = `Custom Combo ${Date.now()}`;
    const savedCombo = {
      id: Date.now().toString(),
      name: comboName,
      ...selectedCombo,
      savedAt: new Date().toISOString(),
    };

    const existingSaved = localStorage.getItem('fortnite-saved-combos');
    const savedCombos = existingSaved ? JSON.parse(existingSaved) : [];
    savedCombos.push(savedCombo);
    
    localStorage.setItem('fortnite-saved-combos', JSON.stringify(savedCombos));
    
    toast({
      title: "Combo Saved!",
      description: `Your custom combo has been saved.`,
    });
  };

  if (currentStep === "preview") {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Your Custom Combo
          </h2>
          <p className="text-xl text-gray-300">
            Rotate the 3D preview to see your combo from all angles
          </p>
        </div>

        <ComboViewer3D combo={selectedCombo} />

        <div className="flex justify-center gap-4">
          <Button
            onClick={handlePrevious}
            variant="outline"
            className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Edit
          </Button>
          <Button
            onClick={saveCombo}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            <Check className="w-4 h-4 mr-2" />
            Save Combo
          </Button>
          <Button
            onClick={onBack}
            variant="outline"
            className="border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white"
          >
            Create New Combo
          </Button>
        </div>
      </div>
    );
  }

  const currentStepData = steps.find(s => s.key === currentStep);
  const availableItems = getItemsForStep(currentStep);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Create Your Own Combo
        </h2>
        <p className="text-xl text-gray-300">
          Step {steps.findIndex(s => s.key === currentStep) + 1} of {steps.length}: Select your {currentStepData?.label}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className={`flex items-center ${
                index < steps.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step.key === currentStep
                    ? 'bg-purple-600 text-white'
                    : selectedCombo[step.key] || step.key === "preview"
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 bg-gray-600 rounded">
                  <div
                    className={`h-full rounded transition-all duration-300 ${
                      selectedCombo[step.key] ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                    style={{ width: selectedCombo[step.key] ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Optional Settings */}
      {currentStep === "outfit" && (
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-white">Customize Your Experience</h3>
          <div className="flex justify-center gap-6">
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                checked={includeBackpack}
                onChange={(e) => setIncludeBackpack(e.target.checked)}
                className="rounded"
              />
              Include Back Bling
            </label>
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                checked={includeEmotes}
                onChange={(e) => setIncludeEmotes(e.target.checked)}
                className="rounded"
              />
              Include Emotes
            </label>
          </div>
        </div>
      )}

      {/* Current Selection */}
      {selectedCombo[currentStep] && (
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-4">Selected {currentStepData?.label}</h3>
          <div className="max-w-xs mx-auto">
            <CosmeticCard cosmetic={selectedCombo[currentStep]!} index={0} />
          </div>
        </div>
      )}

      {/* Item Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-w-7xl mx-auto">
        {availableItems.map((item, index) => (
          <div
            key={item.id}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedCombo[currentStep]?.id === item.id
                ? 'ring-4 ring-purple-500 rounded-xl'
                : ''
            }`}
            onClick={() => handleItemSelect(item)}
          >
            <CosmeticCard cosmetic={item} index={index} />
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center max-w-4xl mx-auto">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Button>

        <div className="flex gap-4">
          {steps.findIndex(s => s.key === currentStep) > 0 && (
            <Button
              onClick={handlePrevious}
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
          >
            {isLastStep() ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Preview Combo
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
