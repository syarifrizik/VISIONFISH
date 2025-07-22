
import React from 'react';
import { motion } from 'framer-motion';

interface ScrollIndicatorProps {
  currentIndex: number;
  totalItems: number;
  onIndicatorClick?: (index: number) => void;
  incomplete?: boolean;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  currentIndex,
  totalItems,
  onIndicatorClick,
  incomplete = false,
}) => {
  const handleIndicatorClick = (index: number) => {
    console.log('ScrollIndicator handleClick:', { index, currentIndex, totalItems });
    onIndicatorClick?.(index);
  };

  return (
    <div className="flex gap-2 py-2 justify-center"> {/* Reduced padding */}
      {Array.from({ length: totalItems }, (_, index) => (
        <motion.button
          key={index}
          className={`h-2 rounded-full transition-all duration-300 touch-manipulation relative
            ${
              index === currentIndex
                ? 'bg-purple-500 dark:bg-purple-400 w-6'
                : 'bg-purple-300 dark:bg-purple-600 w-2 hover:bg-purple-400 dark:hover:bg-purple-500'
            }
            ${incomplete && index === currentIndex ? 'animate-pulse' : ''}
            `}
          onClick={() => handleIndicatorClick(index)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          aria-label={`Go to parameter ${index + 1}`}
          style={{
            minHeight: '12px',
            minWidth: index === currentIndex ? '24px' : '12px',
          }}
        >
          {/* Active indicator enhanced visual */}
          {index === currentIndex && (
            <motion.div
              className="absolute inset-0 rounded-full bg-purple-400/30 dark:bg-purple-300/30"
              initial={{ scale: 0 }}
              animate={{ scale: 1.5 }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default ScrollIndicator;
