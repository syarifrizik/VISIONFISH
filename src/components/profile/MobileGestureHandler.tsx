
import { ReactNode } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { useState } from 'react';

interface MobileGestureHandlerProps {
  children: ReactNode;
  enableSwipeNavigation?: boolean;
  enablePullToRefresh?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onPullDown?: () => void;
  className?: string;
}

const MobileGestureHandler = ({
  children,
  enableSwipeNavigation = false,
  enablePullToRefresh = false,
  onSwipeLeft,
  onSwipeRight,
  onPullDown,
  className = ""
}: MobileGestureHandlerProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handlePan = (event: any, info: PanInfo) => {
    // Swipe detection
    if (enableSwipeNavigation) {
      const { offset, velocity } = info;
      
      if (Math.abs(offset.x) > 100 && Math.abs(velocity.x) > 500) {
        if (offset.x > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (offset.x < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
    }

    // Pull to refresh detection
    if (enablePullToRefresh && info.offset.y > 100 && info.velocity.y > 500) {
      if (onPullDown && !isRefreshing) {
        setIsRefreshing(true);
        onPullDown();
        setTimeout(() => setIsRefreshing(false), 2000);
      }
    }
  };

  return (
    <motion.div
      className={className}
      onPan={handlePan}
      style={{ touchAction: 'pan-y' }}
    >
      {isRefreshing && (
        <motion.div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-full px-4 py-2 shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Refreshing...</span>
          </div>
        </motion.div>
      )}
      {children}
    </motion.div>
  );
};

export default MobileGestureHandler;
