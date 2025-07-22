
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Activity, Eye, ArrowRight, Settings } from "lucide-react";
import { FishParameter } from "@/utils/fish-analysis";
import BatchInputModal from "@/components/fish-analysis/BatchInputModal";

interface ActionButtonsProps {
  completedParams: number;
  isComplete: boolean;
  parameters: FishParameter;
  onReviewAndSubmit: () => void;
  onShowReviewModal: () => void;
  onBatchApply: (newParameters: FishParameter) => void;
  onBatchAnalyze: () => void;
}

const ActionButtons = React.memo<ActionButtonsProps>(function ActionButtons({
  completedParams,
  isComplete,
  parameters,
  onReviewAndSubmit,
  onShowReviewModal,
  onBatchApply,
  onBatchAnalyze
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="pt-6 space-y-3"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          {completedParams > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline"
                    onClick={onShowReviewModal}
                    className="flex items-center gap-2 border-purple-300 hover:bg-purple-50 text-purple-600"
                  >
                    <Eye className="w-4 h-4" />
                    Review
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tinjau parameter sebelum analisis</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <BatchInputModal
            parameters={parameters}
            onApply={onBatchApply}
            onAnalyze={onBatchAnalyze}
          >
            <Button 
              variant="outline"
              className="flex items-center gap-2 border-purple-300 hover:bg-purple-50 text-purple-600"
            >
              <Settings className="w-4 h-4" />
              Batch Input
            </Button>
          </BatchInputModal>
        </div>
        
        <Button 
          onClick={onReviewAndSubmit} 
          className={`flex-1 neon-button flex items-center gap-2 transition-all duration-300 ${
            !isComplete 
              ? 'bg-purple-400 hover:bg-purple-500 cursor-not-allowed opacity-70' 
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
          disabled={!isComplete}
        >
          <Activity className="w-4 h-4" /> 
          Analisis Kualitas Ikan
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-1">
        <p className="text-xs text-center text-muted-foreground">
          Gunakan panah keyboard untuk navigasi • Ctrl+Enter untuk analisis
        </p>
        <p className="text-xs text-center text-muted-foreground">
          Klik "Review" untuk melihat ringkasan sebelum analisis
        </p>
      </div>
    </motion.div>
  );
});

export default ActionButtons;
