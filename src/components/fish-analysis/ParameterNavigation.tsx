
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';

interface ParameterNavigationProps {
  currentIndex: number;
  totalCount: number;
  onNavigate: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
}

const ParameterNavigation: React.FC<ParameterNavigationProps> = ({
  currentIndex,
  totalCount,
  onNavigate,
  onPrevious,
  onNext,
  className = "",
}) => {
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < totalCount - 1;

  const handlePrevious = () => {
    console.log('ParameterNavigation: Previous clicked', { currentIndex });
    if (canGoPrevious) {
      onPrevious();
    }
  };

  const handleNext = () => {
    console.log('ParameterNavigation: Next clicked', { currentIndex });
    if (canGoNext) {
      onNext();
    }
  };

  const handleNavigate = (index: number) => {
    console.log('ParameterNavigation: Navigate to', { index, currentIndex });
    if (index !== currentIndex) {
      onNavigate(index);
    }
  };

  return (
    <motion.div 
      className={`flex items-center justify-between gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800/50 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-purple-300 dark:border-purple-700/50 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 bg-white dark:bg-gray-900/50"
          onClick={() => handleNavigate(0)}
          disabled={currentIndex === 0}
        >
          <SkipBack className="w-4 h-4" />
          <span className="hidden sm:inline">First</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-purple-300 dark:border-purple-700/50 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 bg-white dark:bg-gray-900/50"
          onClick={handlePrevious}
          disabled={!canGoPrevious}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
      </div>

      <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/40 rounded-full border border-purple-200 dark:border-purple-700/50">
        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
          {currentIndex + 1} / {totalCount}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-purple-300 dark:border-purple-700/50 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 bg-white dark:bg-gray-900/50"
          onClick={handleNext}
          disabled={!canGoNext}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-purple-300 dark:border-purple-700/50 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 bg-white dark:bg-gray-900/50"
          onClick={() => handleNavigate(totalCount - 1)}
          disabled={currentIndex === totalCount - 1}
        >
          <span className="hidden sm:inline">Last</span>
          <SkipForward className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default ParameterNavigation;
