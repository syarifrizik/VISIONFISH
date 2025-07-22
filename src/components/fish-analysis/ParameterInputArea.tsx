
import React from "react";
import { motion } from "framer-motion";
import { FishParameter } from "@/utils/fish-analysis";
import { ParameterCard } from "@/components/ui/parameter-card";
import HorizontalCardScroller from "@/components/fish-analysis/HorizontalCardScroller";
import ParameterNavigation from "@/components/fish-analysis/ParameterNavigation";
import CurrentParameterInfo from "@/components/fish-analysis/CurrentParameterInfo";

interface ParameterInputAreaProps {
  isMobile: boolean;
  parameterEntries: [string, number | null][];
  currentCardIndex: number;
  currentParamIncomplete: boolean;
  onParameterChange: (name: keyof FishParameter, value: number[]) => void;
  onNavigateToCard: (index: number) => void;
  onPreviousCard: () => void;
  onNextCard: () => void;
  onCardChange: (index: number) => void;
}

const ParameterInputArea = React.memo<ParameterInputAreaProps>(function ParameterInputArea({
  isMobile,
  parameterEntries,
  currentCardIndex,
  currentParamIncomplete,
  onParameterChange,
  onNavigateToCard,
  onPreviousCard,
  onNextCard,
  onCardChange
}) {
  // Ensure currentCardIndex is within valid bounds
  const safeCurrentIndex = Math.max(0, Math.min(currentCardIndex, parameterEntries.length - 1));

  console.log('ParameterInputArea render:', {
    currentCardIndex,
    safeCurrentIndex,
    parameterEntriesLength: parameterEntries.length,
    currentParam: parameterEntries[safeCurrentIndex]?.[0],
    isMobile
  });

  // Improved navigation handlers with immediate state sync
  const handleNavigateToCard = (index: number) => {
    const validIndex = Math.max(0, Math.min(index, parameterEntries.length - 1));
    console.log('ParameterInputArea handleNavigateToCard:', { 
      index, 
      validIndex, 
      currentCardIndex 
    });
    
    // Always call parent navigation to ensure state sync
    onNavigateToCard(validIndex);
  };

  const handlePreviousCard = () => {
    const newIndex = Math.max(0, safeCurrentIndex - 1);
    console.log('ParameterInputArea handlePreviousCard:', { 
      from: safeCurrentIndex, 
      to: newIndex 
    });
    
    // Always navigate, parent will handle if index is the same
    onPreviousCard();
  };

  const handleNextCard = () => {
    const newIndex = Math.min(parameterEntries.length - 1, safeCurrentIndex + 1);
    console.log('ParameterInputArea handleNextCard:', { 
      from: safeCurrentIndex, 
      to: newIndex 
    });
    
    // Always navigate, parent will handle if index is the same
    onNextCard();
  };

  // Direct pass-through for scroller changes - this ensures immediate sync
  const handleScrollerCardChange = (index: number) => {
    console.log('ParameterInputArea handleScrollerCardChange:', { 
      index, 
      currentCardIndex 
    });
    
    // Directly call parent handler to ensure immediate sync
    onCardChange(index);
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Current Parameter Info */}
        <CurrentParameterInfo
          parameterEntries={parameterEntries}
          currentCardIndex={safeCurrentIndex}
        />

        {/* Navigation Controls */}
        <ParameterNavigation
          currentIndex={safeCurrentIndex}
          totalCount={parameterEntries.length}
          onNavigate={handleNavigateToCard}
          onPrevious={handlePreviousCard}
          onNext={handleNextCard}
        />

        {/* Enhanced Horizontal Scroller with improved sync */}
        <HorizontalCardScroller
          title=""
          cardWidth="280px"
          cardGap={16}
          showControls={false}
          showIndicators={true}
          snapToCard={true}
          className="pb-2"
          onCardChange={handleScrollerCardChange}
          incomplete={currentParamIncomplete}
          currentIndex={safeCurrentIndex}
          forceSync={true} // New prop to force synchronization
        >
          {parameterEntries.map(([name, value]) => (
            <ParameterCard
              key={name}
              name={name}
              value={value}
              onChange={onParameterChange}
            />
          ))}
        </HorizontalCardScroller>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="grid grid-cols-2 md:grid-cols-3 gap-4"
    >
      {parameterEntries.map(([name, value]) => (
        <ParameterCard
          key={name}
          name={name}
          value={value}
          onChange={onParameterChange}
        />
      ))}
    </motion.div>
  );
});

export default ParameterInputArea;
