
import { ReactNode, useState, useCallback } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { RefreshCw, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface EnhancedMobileContainerProps {
  children: ReactNode;
  enablePullToRefresh?: boolean;
  enableSwipeNavigation?: boolean;
  onRefresh?: () => Promise<void>;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

const EnhancedMobileContainer = ({
  children,
  enablePullToRefresh = false,
  enableSwipeNavigation = false,
  onRefresh,
  onSwipeLeft,
  onSwipeRight,
  className = ""
}: EnhancedMobileContainerProps) => {
  const isMobile = useIsMobile();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const controls = useAnimation();

  const handlePanStart = useCallback(() => {
    if (!enablePullToRefresh || window.scrollY > 0) return;
    setPullDistance(0);
    setSwipeDirection(null);
  }, [enablePullToRefresh]);

  const handlePan = useCallback((event: any, info: PanInfo) => {
    // Pull to refresh logic
    if (enablePullToRefresh && window.scrollY === 0 && info.offset.y > 0) {
      const distance = Math.max(0, info.offset.y);
      setPullDistance(Math.min(distance, 150));
    }

    // Swipe navigation logic
    if (enableSwipeNavigation && Math.abs(info.offset.y) < 50) {
      if (Math.abs(info.offset.x) > 50) {
        setSwipeDirection(info.offset.x > 0 ? 'right' : 'left');
      }
    }
  }, [enablePullToRefresh, enableSwipeNavigation]);

  const handlePanEnd = useCallback(async (event: any, info: PanInfo) => {
    // Handle pull to refresh
    if (enablePullToRefresh && window.scrollY === 0 && info.offset.y > 100 && info.velocity.y > 0) {
      setIsRefreshing(true);
      setPullDistance(0);
      
      if (onRefresh) {
        try {
          await onRefresh();
        } catch (error) {
          console.error('Refresh failed:', error);
        }
      }
      
      setTimeout(() => setIsRefreshing(false), 1500);
    } else {
      setPullDistance(0);
    }

    // Handle swipe navigation
    if (enableSwipeNavigation && Math.abs(info.offset.x) > 100 && Math.abs(info.velocity.x) > 500) {
      if (info.offset.x > 0 && onSwipeRight) {
        await controls.start({ x: 100, opacity: 0.8 });
        onSwipeRight();
        controls.set({ x: 0, opacity: 1 });
      } else if (info.offset.x < 0 && onSwipeLeft) {
        await controls.start({ x: -100, opacity: 0.8 });
        onSwipeLeft();
        controls.set({ x: 0, opacity: 1 });
      }
    }
    
    setSwipeDirection(null);
  }, [enablePullToRefresh, enableSwipeNavigation, onRefresh, onSwipeLeft, onSwipeRight, controls]);

  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate={controls}
      className={`min-h-screen relative ${className}`}
      onPanStart={handlePanStart}
      onPan={handlePan}
      onPanEnd={handlePanEnd}
      style={{ 
        paddingTop: pullDistance * 0.4,
        touchAction: enablePullToRefresh || enableSwipeNavigation ? 'pan-y' : 'auto'
      }}
    >
      {/* Enhanced Pull to refresh indicator */}
      {enablePullToRefresh && (pullDistance > 0 || isRefreshing) && (
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: -60, scale: 0.8 }}
          animate={{ 
            opacity: pullDistance > 40 || isRefreshing ? 1 : 0.7, 
            y: pullDistance > 0 || isRefreshing ? pullDistance * 0.3 : -60,
            scale: pullDistance > 80 || isRefreshing ? 1 : 0.8 + (pullDistance / 100) * 0.2
          }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/30 dark:border-gray-700/30 relative overflow-hidden">
            {/* Background gradient animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl"
              animate={isRefreshing ? {
                background: [
                  'linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2), rgba(6, 182, 212, 0.2))',
                  'linear-gradient(90deg, rgba(147, 51, 234, 0.2), rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2))',
                  'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))'
                ]
              } : {}}
              transition={{ duration: 2, repeat: isRefreshing ? Infinity : 0 }}
            />
            
            <div className="relative z-10 flex items-center gap-3">
              <motion.div
                className="relative"
                animate={isRefreshing ? { rotate: 360 } : { rotate: pullDistance * 2 }}
                transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : { duration: 0.2 }}
              >
                <RefreshCw className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                {isRefreshing && (
                  <motion.div
                    className="absolute inset-0"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <RefreshCw className="w-6 h-6 text-blue-400" />
                  </motion.div>
                )}
              </motion.div>
              
              <div className="text-center">
                <motion.p 
                  className="text-sm font-bold text-gray-700 dark:text-gray-300"
                  animate={isRefreshing ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.5, repeat: isRefreshing ? Infinity : 0 }}
                >
                  {isRefreshing ? 'Memuat ulang...' : pullDistance > 80 ? 'Lepas untuk memuat ulang' : 'Tarik untuk memuat ulang'}
                </motion.p>
                {!isRefreshing && (
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <motion.div 
                      className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                      animate={{ opacity: pullDistance > 50 ? 1 : 0.3 }}
                    />
                    <motion.div 
                      className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                      animate={{ opacity: pullDistance > 80 ? 1 : 0.3 }}
                    />
                  </div>
                )}
              </div>
              
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Enhanced Swipe Navigation Indicators */}
      {enableSwipeNavigation && swipeDirection && (
        <motion.div
          className={`fixed top-1/2 transform -translate-y-1/2 z-50 ${
            swipeDirection === 'left' ? 'right-4' : 'left-4'
          }`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl p-3 shadow-2xl border border-white/30 dark:border-gray-700/30">
            <motion.div
              animate={{ x: swipeDirection === 'left' ? [-5, 5, -5] : [5, -5, 5] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {swipeDirection === 'left' ? (
                <ArrowLeft className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              ) : (
                <ArrowRight className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              )}
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Enhanced Refreshing overlay */}
      {isRefreshing && (
        <motion.div
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl rounded-2xl px-6 py-3 shadow-2xl border border-white/30 dark:border-gray-700/30 relative overflow-hidden">
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10"
              animate={{
                background: [
                  'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(6, 182, 212, 0.1))',
                  'linear-gradient(90deg, rgba(147, 51, 234, 0.1), rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1))',
                  'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            <div className="flex items-center gap-3 relative z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Memuat ulang data...
              </span>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Content with enhanced animations */}
      <motion.div
        className="relative z-10"
        style={{ 
          transform: swipeDirection ? `translateX(${swipeDirection === 'left' ? '-5px' : '5px'})` : 'translateX(0)',
          transition: 'transform 0.2s ease-out'
        }}
      >
        {children}
      </motion.div>
      
      {/* Enhanced background decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <motion.div
          className="absolute w-32 h-32 bg-gradient-to-br from-blue-400/5 to-cyan-400/5 rounded-full blur-3xl top-20 right-8"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 10, 0],
            y: [0, -5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute w-24 h-24 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-full blur-2xl bottom-40 left-8"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -8, 0],
            y: [0, 8, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
    </motion.div>
  );
};

export default EnhancedMobileContainer;
