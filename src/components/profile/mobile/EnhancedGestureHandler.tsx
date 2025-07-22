
import { ReactNode, useRef, useState, useCallback } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';

interface EnhancedGestureHandlerProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onRefresh?: () => void;
  className?: string;
}

const EnhancedGestureHandler = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onRefresh,
  className = ""
}: EnhancedGestureHandlerProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const handlePanStart = useCallback(() => {
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
  }, []);

  const handlePan = useCallback((event: any, info: PanInfo) => {
    const { offset, velocity } = info;
    
    // Enhanced pull to refresh - only if scrolled to top
    if (offset.y > 0 && containerRef.current?.scrollTop === 0) {
      const distance = Math.min(offset.y * 0.6, 100);
      setPullDistance(distance);
      
      if (distance > 60 && navigator.vibrate) {
        navigator.vibrate(15);
      }
    }
  }, []);

  const handlePanEnd = useCallback(async (event: any, info: PanInfo) => {
    const { offset, velocity } = info;
    
    // Enhanced horizontal swipe detection
    const swipeThreshold = 50;
    const velocityThreshold = 200;
    
    if (Math.abs(offset.x) > Math.abs(offset.y) && Math.abs(offset.x) > swipeThreshold) {
      if (offset.x > 0 && velocity.x > velocityThreshold) {
        onSwipeRight?.();
        if (navigator.vibrate) {
          navigator.vibrate(30);
        }
      } else if (offset.x < 0 && velocity.x < -velocityThreshold) {
        onSwipeLeft?.();
        if (navigator.vibrate) {
          navigator.vibrate(30);
        }
      }
    }
    
    // Enhanced pull to refresh
    if (pullDistance > 60 && velocity.y > 0 && containerRef.current?.scrollTop === 0) {
      await handleRefresh();
    }
    
    // Reset pull distance with smooth animation
    setPullDistance(0);
    controls.start({ y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } });
  }, [pullDistance, onSwipeLeft, onSwipeRight, controls]);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing || !onRefresh) return;
    
    setIsRefreshing(true);
    
    try {
      await onRefresh();
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
      }
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      }, 1000);
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
          initial={{ opacity: 0, y: -80, scale: 0.8 }}
          animate={{ 
            opacity: pullDistance > 15 || isRefreshing ? 1 : 0, 
            y: pullDistance > 15 || isRefreshing ? -20 : -80,
            scale: pullDistance > 60 ? 1.1 : 1
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div className="bg-white/30 dark:bg-gray-900/40 backdrop-blur-3xl rounded-2xl px-6 py-4 shadow-2xl border border-white/40 dark:border-gray-700/40">
            <div className="flex items-center gap-3">
              <motion.div
                className={`w-6 h-6 rounded-full border-3 ${
                  pullDistance > 60 || isRefreshing
                    ? 'border-cyan-400 border-t-transparent'
                    : 'border-white/60 border-t-white/90'
                }`}
                animate={isRefreshing ? { rotate: 360 } : { rotate: pullDistance * 4 }}
                transition={isRefreshing ? {
                  duration: 0.8,
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
                  scale: pullDistance > 60 ? [1, 1.05, 1] : 1
                }}
                transition={{
                  duration: 0.5,
                  repeat: pullDistance > 60 ? Infinity : 0
                }}
              >
                {isRefreshing ? 'Memperbarui...' : 
                 pullDistance > 60 ? 'Lepas untuk memperbarui' : 
                 'Tarik untuk memperbarui'}
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Content with enhanced pull offset */}
      <motion.div
        animate={{ y: pullDistance * 0.4 }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default EnhancedGestureHandler;
