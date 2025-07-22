
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FishParameter } from "@/utils/fish-analysis";
import ParameterSummaryCard from "@/components/fish-analysis/ParameterSummaryCard";
import ParameterReviewModal from "@/components/fish-analysis/ParameterReviewModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Import new focused components
import SNIStandardsInfo from "@/components/fish-analysis/SNIStandardsInfo";
import ProgressIndicator from "@/components/fish-analysis/ProgressIndicator";
import ParameterInputArea from "@/components/fish-analysis/ParameterInputArea";
import ActionButtons from "@/components/fish-analysis/ActionButtons";
import ResetButton from "@/components/fish-analysis/ResetButton";

interface InputParametersSectionProps {
  parameters: FishParameter;
  onChangeParameter: (name: keyof FishParameter, value: number[]) => void;
  onSubmit: () => void;
  fishName?: string;
}

const InputParametersSection = React.memo<InputParametersSectionProps>(function InputParametersSection({
  parameters,
  onChangeParameter,
  onSubmit,
  fishName = "",
}) {
  const isMobile = useIsMobile();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Memoized parameter change handler
  const handleParameterChange = useCallback((name: keyof FishParameter, value: number[]) => {
    onChangeParameter(name, value);
  }, [onChangeParameter]);

  // Get parameter entries consistently
  const parameterEntries = useMemo(() => Object.entries(parameters), [parameters]);

  // Fixed progress calculations
  const { 
    completedParams, 
    isComplete, 
    currentParamIncomplete 
  } = useMemo(() => {
    const completedParams = parameterEntries.filter(([_, value]) => 
      value !== null && value !== 4
    ).length;
    
    const totalValidParams = parameterEntries.filter(([_, value]) => value !== 4).length;
    const isComplete = completedParams > 0 && completedParams === totalValidParams;
    
    const safeIndex = Math.max(0, Math.min(currentCardIndex, parameterEntries.length - 1));
    const currentParamIncomplete = isMobile && parameterEntries[safeIndex] && 
      (parameterEntries[safeIndex][1] === null || parameterEntries[safeIndex][1] === 4);

    return {
      completedParams,
      isComplete,
      currentParamIncomplete
    };
  }, [parameterEntries, isMobile, currentCardIndex]);

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          setCurrentCardIndex(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          setCurrentCardIndex(prev => Math.min(parameterEntries.length - 1, prev + 1));
          break;
        case 'Enter':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            if (isComplete) {
              handleReviewAndSubmit();
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [parameterEntries.length, isComplete]);

  // Ensure currentCardIndex stays within bounds
  useEffect(() => {
    if (currentCardIndex >= parameterEntries.length) {
      setCurrentCardIndex(Math.max(0, parameterEntries.length - 1));
    }
  }, [parameterEntries.length, currentCardIndex]);

  const handleReviewAndSubmit = useCallback(() => {
    setShowReviewModal(true);
  }, []);

  const handleConfirmSubmit = useCallback(() => {
    setShowReviewModal(false);
    onSubmit();
  }, [onSubmit]);

  const handleBatchApply = useCallback((newParameters: FishParameter) => {
    Object.entries(newParameters).forEach(([param, value]) => {
      if (value !== null && value !== undefined) {
        handleParameterChange(param as keyof FishParameter, [value]);
      }
    });
  }, [handleParameterChange]);

  const handleBatchAnalyze = useCallback(() => {
    onSubmit();
  }, [onSubmit]);

  // Fixed reset function
  const handleReset = useCallback(() => {
    console.log('Resetting all parameters to null');
    Object.keys(parameters).forEach((param) => {
      onChangeParameter(param as keyof FishParameter, []);
    });
    setCurrentCardIndex(0);
    toast.success("Semua parameter telah direset!");
  }, [parameters, onChangeParameter]);

  // Navigation handlers
  const handleNavigateToCard = useCallback((index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, parameterEntries.length - 1));
    setCurrentCardIndex(clampedIndex);
  }, [parameterEntries.length]);

  const handlePreviousCard = useCallback(() => {
    setCurrentCardIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleNextCard = useCallback(() => {
    setCurrentCardIndex(prev => Math.min(parameterEntries.length - 1, prev + 1));
  }, [parameterEntries.length]);

  const handleCardChange = useCallback((index: number) => {
    setCurrentCardIndex(index);
  }, []);

  return (
    <div className="space-y-6">
      <SNIStandardsInfo />

      <ResetButton onReset={handleReset} />

      {isMobile && (
        <ProgressIndicator
          completedParams={completedParams}
          totalParams={parameterEntries.length}
          isComplete={isComplete}
        />
      )}

      {completedParams > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <ParameterSummaryCard 
            parameters={parameters}
            className="mb-4"
            onClick={() => setShowReviewModal(true)}
          />
        </motion.div>
      )}
      
      <ParameterInputArea
        isMobile={isMobile}
        parameterEntries={parameterEntries}
        currentCardIndex={currentCardIndex}
        currentParamIncomplete={currentParamIncomplete}
        onParameterChange={handleParameterChange}
        onNavigateToCard={handleNavigateToCard}
        onPreviousCard={handlePreviousCard}
        onNextCard={handleNextCard}
        onCardChange={handleCardChange}
      />
      
      <ActionButtons
        completedParams={completedParams}
        isComplete={isComplete}
        parameters={parameters}
        onReviewAndSubmit={handleReviewAndSubmit}
        onShowReviewModal={() => setShowReviewModal(true)}
        onBatchApply={handleBatchApply}
        onBatchAnalyze={handleBatchAnalyze}
      />

      <ParameterReviewModal
        open={showReviewModal}
        onOpenChange={setShowReviewModal}
        parameters={parameters}
        fishName={fishName}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
});

export default InputParametersSection;
