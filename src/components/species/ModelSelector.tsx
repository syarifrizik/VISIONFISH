
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Fish, Sparkles, Zap, Brain, Gem, Loader2, ChevronDown, Bot, Info } from "lucide-react";
import { toast } from "sonner";
import { AVAILABLE_MODELS, AI_MODELS, hasPremiumAccess } from '@/utils/ai-models-enhanced';
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";

interface ModelSelectorProps {
  selectedModel: AI_MODELS;
  onModelChange: (modelId: AI_MODELS) => void;
  isLoading?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  isLoading = false
}) => {
  const navigate = useNavigate();
  const { isPremium } = useAuth();
  const isMobile = useIsMobile();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const handleModelChange = (modelId: AI_MODELS) => {
    const model = AVAILABLE_MODELS.find(m => m.id === modelId);
    if (model?.isPremium && !hasPremiumAccess(isPremium)) {
      toast.warning("Model ini membutuhkan akses Premium", {
        description: "Upgrade ke Premium untuk menggunakan model AI terdepan",
        action: {
          label: "Upgrade Premium",
          onClick: () => navigate("/premium")
        }
      });
      return;
    }
    onModelChange(modelId);
    setIsDropdownOpen(false);
  };

  const getModelIcon = (modelId: AI_MODELS, size: string = "h-4 w-4") => {
    const iconClass = `${size} transition-all duration-200`;
    switch (modelId) {
      case AI_MODELS.NEPTUNE_FLOW:
        return <Fish className={iconClass} />;
      case AI_MODELS.CORAL_WAVE:
        return <Brain className={iconClass} />;
      case AI_MODELS.REGAL_TIDE:
        return <Zap className={iconClass} />;
      default:
        return <Bot className={iconClass} />;
    }
  };

  const getModelDisplayName = (name: string) => {
    // Remove parentheses for mobile
    if (isMobile) {
      const nameWithoutParentheses = name.replace(/\s*\([^)]*\)/g, '').trim();
      if (nameWithoutParentheses.length > 18) {
        return nameWithoutParentheses.substring(0, 15) + "...";
      }
      return nameWithoutParentheses;
    }
    return name;
  };

  const getModelTypeInfo = (modelId: AI_MODELS) => {
    switch (modelId) {
      case AI_MODELS.NEPTUNE_FLOW:
        return "Standard - Model standar untuk analisis umum dan informasi praktis";
      case AI_MODELS.CORAL_WAVE:
        return "Scientific - Model ilmiah untuk analisis mendalam dan referensi penelitian";
      case AI_MODELS.REGAL_TIDE:
        return "Business - Model bisnis untuk strategi pasar dan implementasi teknologi";
      default:
        return "Model AI untuk analisis spesies";
    }
  };

  const selectedModelData = AVAILABLE_MODELS.find(m => m.id === selectedModel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        ease: [0.4, 0, 0.2, 1],
        type: "spring",
        stiffness: 100
      }}
      className="relative"
    >
      {/* Main Container - Fixed transparency and sizing */}
      <div className="relative overflow-hidden rounded-2xl bg-background/95 backdrop-blur-sm border border-border shadow-lg">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        
        {/* Header Section - Compact */}
        <div className="relative z-10 p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">
                AI Model Selector
              </h3>
              <p className="text-sm text-muted-foreground">
                Pilih model AI untuk analisis yang optimal
              </p>
            </div>
          </div>
        </div>

        {/* Model Selection Card - Compact */}
        <div className="relative z-10 p-4">
          <div className="relative">
            {/* Selected Model Display - Simplified */}
            <div className="bg-card border border-border rounded-xl p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    {selectedModelData && getModelIcon(selectedModelData.id, "h-4 w-4")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">
                      {selectedModelData ? getModelDisplayName(selectedModelData.name) : "Pilih Model AI"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedModelData?.description || "Belum ada model yang dipilih"}
                    </p>
                  </div>
                </div>
                
                {selectedModelData?.isPremium && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <Crown className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Premium</span>
                  </div>
                )}
              </div>

              {/* Dropdown Trigger - Simplified */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={isLoading}
                className="w-full p-2 rounded-lg border border-border bg-background hover:bg-accent 
                  transition-colors duration-200 flex items-center justify-between text-sm
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="font-medium text-foreground">
                  {isLoading ? "Memuat..." : "Ganti Model AI"}
                </span>
                <div className="flex items-center gap-2">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <ChevronDown 
                      className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  )}
                </div>
              </button>
            </div>

            {/* Accordion-style Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden mt-2 bg-card border border-border rounded-xl"
                >
                  <div className="py-1">
                    {AVAILABLE_MODELS.map((model) => (
                      <div key={model.id} className="relative">
                        <button
                          onClick={() => handleModelChange(model.id)}
                          className="w-full px-3 py-2 hover:bg-accent transition-colors flex items-center gap-3 text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            {getModelIcon(model.id, "h-4 w-4")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground truncate">
                                {getModelDisplayName(model.name)}
                              </span>
                              {model.isPremium && (
                                <Crown className="h-3 w-3 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                              )}
                              {isMobile && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowTooltip(showTooltip === model.id ? null : model.id);
                                  }}
                                  className="ml-1 p-1 hover:bg-accent rounded-md transition-colors"
                                >
                                  <Info className="h-3 w-3 text-muted-foreground" />
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {model.description}
                            </p>
                          </div>
                          {selectedModel === model.id && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </button>
                        
                        {/* Tooltip for mobile */}
                        {isMobile && showTooltip === model.id && (
                          <div className="absolute top-full left-0 right-0 z-50 mt-1 p-3 bg-card border border-border rounded-lg shadow-lg">
                            <p className="text-xs text-foreground">
                              {getModelTypeInfo(model.id)}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Premium Upgrade Notice - Compact */}
        {!hasPremiumAccess(isPremium) && (
          <div className="p-4 border-t border-border/50">
            <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                  <Gem className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-amber-900 dark:text-amber-100">
                    Unlock Premium AI Models
                  </h4>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    Akses model AI terdepan dengan akurasi tinggi
                  </p>
                </div>
                <button
                  onClick={() => navigate("/premium")}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  Upgrade
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
};

export default ModelSelector;
