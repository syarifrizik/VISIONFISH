
import { ReactNode, useRef, useState, useCallback } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';

interface MobileGestureHandlerProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onRefresh?: () => void;
  className?: string;
}

const MobileGestureHandler = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onRefresh,
  className = ""
}: MobileGestureHandlerProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const handlePanStart = useCallback(() => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }, []);

  const handlePan = useCallback((event: any, info: PanInfo) => {
    const { offset, velocity } = info;
    
    // Pull to refresh - only if scrolled to top
    if (offset.y > 0 && containerRef.current?.scrollTop === 0) {
      const distance = Math.min(offset.y, 120);
      setPullDistance(distance);
      
      if (distance > 80) {
        if (navigator.vibrate) {
          navigator.vibrate(20);
        }
      }
    }
  }, []);

  const handlePanEnd = useCallback(async (event: any, info: PanInfo) => {
    const { offset, velocity } = info;
    
    // Horizontal swipe detection with improved sensitivity
    if (Math.abs(offset.x) > Math.abs(offset.y) && Math.abs(offset.x) > 80) {
      if (offset.x > 0 && velocity.x > 300) {
        onSwipeRight?.();
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      } else if (offset.x < 0 && velocity.x < -300) {
        onSwipeLeft?.();
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }
    
    // Pull to refresh detection
    if (pullDistance > 80 && velocity.y > 0 && containerRef.current?.scrollTop === 0) {
      await handleRefresh();
    }
    
    // Reset pull distance
    setPullDistance(0);
    controls.start({ y: 0 });
  }, [pullDistance, onSwipeLeft, onSwipeRight, controls]);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing || !onRefresh) return;
    
    setIsRefreshing(true);
    
    try {
      await onRefresh();
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      }, 1500);
    }
  }, [isRefreshing, onRefresh]);

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-auto ${className}`}
      onPanStart={handlePanStart}
      onPan={handlePan}
      onPanEnd={handlePanEnd}
      animate={controls}
      style={{ 
        touchAction: 'pan-y',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Enhanced Pull to Refresh Indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: -60 }}
          animate={{ 
            opacity: pullDistance > 20 || isRefreshing ? 1 : 0, 
            y: pullDistance > 20 || isRefreshing ? 20 : -60,
            scale: pullDistance > 80 ? 1.1 : 1
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-2xl rounded-2xl px-6 py-4 shadow-2xl border border-white/30 dark:border-gray-700/30">
            <div className="flex items-center gap-3">
              <motion.div
                className={`w-6 h-6 rounded-full border-3 ${
                  pullDistance > 80 || isRefreshing
                    ? 'border-cyan-400 border-t-transparent'
                    : 'border-white/40 border-t-white/80'
                }`}
                animate={isRefreshing ? { rotate: 360 } : { rotate: pullDistance * 3 }}
                transition={isRefreshing ? {
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                } : {
                  type: "spring",
                  stiffness: 100
                }}
              />
              <motion.span 
                className="text-sm font-medium text-white"
                animate={{
                  scale: pullDistance > 80 ? [1, 1.05, 1] : 1
                }}
                transition={{
                  duration: 0.6,
                  repeat: pullDistance > 80 ? Infinity : 0
                }}
              >
                {isRefreshing ? 'Refreshing...' : 
                 pullDistance > 80 ? 'Release to refresh' : 
                 'Pull to refresh'}
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Content with pull offset */}
      <motion.div
        animate={{ y: pullDistance * 0.5 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default MobileGestureHandler;
