
import { useState, useRef } from "react";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { RefreshCw, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobilePullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  className?: string;
}

const MobilePullToRefresh: React.FC<MobilePullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 80,
  className
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  
  const rotate = useTransform(y, [0, threshold], [0, 180]);
  const opacity = useTransform(y, [0, threshold], [0, 1]);
  const scale = useTransform(y, [0, threshold], [0.8, 1]);

  const handlePanStart = (event: any, info: PanInfo) => {
    // Only trigger if scrolled to top and pulling down
    if (containerRef.current?.scrollTop === 0 && info.delta.y > 0) {
      setIsPulling(true);
    }
  };

  const handlePan = (event: any, info: PanInfo) => {
    if (!isPulling) return;
    
    const pullDistance = Math.max(0, Math.min(info.offset.y, threshold * 1.5));
    y.set(pullDistance);
    
    // Haptic feedback when reaching threshold
    if (pullDistance >= threshold && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handlePanEnd = async (event: any, info: PanInfo) => {
    if (!isPulling) return;
    
    if (info.offset.y >= threshold) {
      setIsRefreshing(true);
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setIsPulling(false);
        y.set(0);
      }
    } else {
      setIsPulling(false);
      y.set(0);
    }
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center py-4"
        style={{ 
          y: useTransform(y, [0, threshold], [-60, 0]),
          opacity,
        }}
      >
        <motion.div
          className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg border"
          style={{ scale }}
        >
          {isRefreshing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="h-4 w-4 text-blue-600" />
              </motion.div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Memperbarui...
              </span>
            </>
          ) : (
            <>
              <motion.div style={{ rotate }}>
                <ArrowDown className="h-4 w-4 text-blue-600" />
              </motion.div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {y.get() >= threshold ? "Lepas untuk refresh" : "Tarik untuk refresh"}
              </span>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Content container */}
      <motion.div
        ref={containerRef}
        className="h-full overflow-y-auto"
        style={{ y }}
        onPanStart={handlePanStart}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={isPulling ? 0.2 : 0}
      >
        <div style={{ paddingTop: isPulling ? `${Math.max(0, y.get())}px` : 0 }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default MobilePullToRefresh;
