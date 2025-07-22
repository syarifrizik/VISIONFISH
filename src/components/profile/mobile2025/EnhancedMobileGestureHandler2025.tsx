
import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface EnhancedMobileGestureHandler2025Props {
  children: React.ReactNode;
  onRefresh?: () => Promise<void>;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  enablePullToRefresh?: boolean;
  enableSwipeNavigation?: boolean;
  className?: string;
}

const EnhancedMobileGestureHandler2025 = ({
  children,
  onRefresh,
  onSwipeLeft,
  onSwipeRight,
  enablePullToRefresh = true,
  enableSwipeNavigation = true,
  className = ""
}: EnhancedMobileGestureHandler2025Props) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState(0);
  const constraintsRef = useRef<HTMLDivElement>(null);
  
  const y = useMotionValue(0);
  const x = useMotionValue(0);
  
  // Transform values for pull-to-refresh
  const refreshOpacity = useTransform(y, [0, 80], [0, 1]);
  const refreshScale = useTransform(y, [0, 80], [0.5, 1]);
  const refreshRotate = useTransform(y, [0, 80], [0, 180]);

  const handlePanEnd = async (event: any, info: PanInfo) => {
    const { offset, velocity } = info;
    
    // Pull to refresh logic
    if (enablePullToRefresh && offset.y > 80 && onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
        y.set(0);
      }
    }
    
    // Swipe navigation logic
    if (enableSwipeNavigation && Math.abs(velocity.x) > 500) {
      if (velocity.x > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (velocity.x < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }
    
    // Reset positions
    if (!isRefreshing) {
      y.set(0);
    }
    x.set(0);
  };

  const handlePan = (event: any, info: PanInfo) => {
    if (enablePullToRefresh && info.offset.y > 0) {
      // Calculate refresh progress
      const progress = Math.min(info.offset.y / 80, 1);
      setRefreshProgress(progress);
    }
  };

  return (
    <div ref={constraintsRef} className={`relative overflow-hidden ${className}`}>
      {/* Pull to Refresh Indicator */}
      {enablePullToRefresh && (
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full border border-white/30"
          style={{
            opacity: refreshOpacity,
            scale: refreshScale,
            y: y
          }}
        >
          <motion.div
            style={{ rotate: isRefreshing ? 360 : refreshRotate }}
            animate={isRefreshing ? { rotate: [0, 360] } : {}}
            transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
          >
            <RefreshCw className="w-5 h-5 text-white" />
          </motion.div>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        drag={enablePullToRefresh || enableSwipeNavigation}
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        style={{ y, x }}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        dragDirectionLock={true}
        className="min-h-screen"
      >
        {children}
      </motion.div>

      {/* Swipe Hints */}
      {enableSwipeNavigation && (
        <>
          <motion.div
            className="fixed left-2 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-transparent via-white/30 to-transparent rounded-full"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="fixed right-2 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-transparent via-white/30 to-transparent rounded-full"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
        </>
      )}
    </div>
  );
};

export default EnhancedMobileGestureHandler2025;
