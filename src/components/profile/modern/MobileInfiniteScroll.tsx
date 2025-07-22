
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

interface MobileInfiniteScrollProps {
  children: React.ReactNode;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  emptyState?: React.ReactNode;
}

const MobileInfiniteScroll = ({
  children,
  hasMore,
  isLoading,
  onLoadMore,
  emptyState
}: MobileInfiniteScrollProps) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  const childrenArray = Array.isArray(children) ? children : [children];
  const hasContent = childrenArray.some(child => child != null);

  if (!hasContent && !isLoading) {
    return <div className="min-h-[400px]">{emptyState}</div>;
  }

  return (
    <div className="relative">
      {children}
      
      {/* Loading Trigger */}
      <div ref={loadingRef} className="py-8">
        {isLoading && (
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader className="w-5 h-5 text-white/60" />
              </motion.div>
              <span className="text-sm text-white/60 font-medium">Memuat konten...</span>
            </div>
          </motion.div>
        )}
        
        {!hasMore && hasContent && (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-sm text-white/40 font-medium">
              Semua konten telah dimuat
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MobileInfiniteScroll;
