
import { ReactNode, useState, useRef } from 'react';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

interface EnhancedMobileGestureHandlerProps {
  children: ReactNode;
  enablePullToRefresh?: boolean;
  enableSwipeNavigation?: boolean;
  onRefresh?: () => Promise<void>;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

const EnhancedMobileGestureHandler = ({
  children,
  enablePullToRefresh = true,
  enableSwipeNavigation = true,
  onRefresh,
  onSwipeLeft,
  onSwipeRight,
  className = ""
}: EnhancedMobileGestureHandlerProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const PULL_THRESHOLD = 80;
  const SWIPE_THRESHOLD = 100;
  const VELOCITY_THRESHOLD = 500;

  const handlePanStart = () => {
    setPullDistance(0);
    setSwipeDirection(null);
  };

  const handlePan = (event: any, info: PanInfo) => {
    const { offset, velocity } = info;

    // Pull to refresh logic
    if (enablePullToRefresh && offset.y > 0 && Math.abs(offset.x) < 50) {
      const distance = Math.min(offset.y, PULL_THRESHOLD * 1.5);
      setPullDistance(distance);
      
      if (containerRef.current) {
        containerRef.current.style.transform = `translateY(${distance * 0.5}px)`;
      }
    }

    // Swipe navigation logic
    if (enableSwipeNavigation && Math.abs(offset.x) > Math.abs(offset.y)) {
      if (Math.abs(offset.x) > 30) {
        setSwipeDirection(offset.x > 0 ? 'right' : 'left');
      }
    }
  };

  const handlePanEnd = async (event: any, info: PanInfo) => {
    const { offset, velocity } = info;

    // Handle pull to refresh
    if (enablePullToRefresh && pullDistance > PULL_THRESHOLD && onRefresh) {
      setIsRefreshing(true);
      
      try {
        await onRefresh();
        toast({
          title: "Berhasil diperbarui!",
          description: "Data profil telah dimuat ulang",
          duration: 2000,
        });
      } catch (error) {
        toast({
          title: "Gagal memperbarui",
          description: "Terjadi kesalahan saat memuat data",
          variant: "destructive",
          duration: 3000,
        });
      } finally {
        setIsRefreshing(false);
      }
    }

    // Handle swipe navigation
    if (enableSwipeNavigation && Math.abs(offset.x) > SWIPE_THRESHOLD && Math.abs(velocity.x) > VELOCITY_THRESHOLD) {
      if (offset.x > 0 && onSwipeRight) {
        onSwipeRight();
        toast({
          title: "Navigasi",
          description: "Beralih ke tab sebelumnya",
          duration: 1500,
        });
      } else if (offset.x < 0 && onSwipeLeft) {
        onSwipeLeft();
        toast({
          title: "Navigasi", 
          description: "Beralih ke tab selanjutnya",
          duration: 1500,
        });
      }
    }

    // Reset states
    setPullDistance(0);
    setSwipeDirection(null);
    
    if (containerRef.current && !isRefreshing) {
      containerRef.current.style.transform = 'translateY(0px)';
    }

    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Pull to refresh indicator */}
      {pullDistance > 20 && (
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: pullDistance > PULL_THRESHOLD ? 1 : pullDistance / PULL_THRESHOLD,
            y: Math.min(pullDistance - 40, 20)
          }}
          transition={{ duration: 0.1 }}
        >
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-full p-3 shadow-lg border border-white/20">
            <motion.div
              animate={{ 
                rotate: isRefreshing ? 360 : pullDistance > PULL_THRESHOLD ? 180 : 0 
              }}
              transition={{ 
                duration: isRefreshing ? 1 : 0.3,
                repeat: isRefreshing ? Infinity : 0,
                ease: "linear"
              }}
            >
              <RefreshCw className={`w-5 h-5 ${pullDistance > PULL_THRESHOLD ? 'text-green-500' : 'text-blue-500'}`} />
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Swipe indicators */}
      {swipeDirection && (
        <motion.div
          className={`absolute top-1/2 transform -translate-y-1/2 z-40 ${
            swipeDirection === 'left' ? 'right-4' : 'left-4'
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.8, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="bg-blue-500/20 backdrop-blur-sm rounded-full p-3">
            {swipeDirection === 'left' ? (
              <ChevronLeft className="w-6 h-6 text-blue-500" />
            ) : (
              <ChevronRight className="w-6 h-6 text-blue-500" />
            )}
          </div>
        </motion.div>
      )}

      {/* Main content with gesture detection */}
      <motion.div
        ref={containerRef}
        className="w-full"
        onPanStart={handlePanStart}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        style={{ touchAction: 'pan-y' }}
      >
        {children}
      </motion.div>

      {/* Loading overlay */}
      {isRefreshing && (
        <motion.div
          className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl z-30 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-5 h-5 text-blue-500" />
              </motion.div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Memperbarui data...
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedMobileGestureHandler;
