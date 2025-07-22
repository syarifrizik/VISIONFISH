
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import EnhancedMobileContainer from './EnhancedMobileContainer';
import MobileGestureHandler from './MobileGestureHandler';

interface ModernMobileProfileProps {
  children: ReactNode;
  enableGestures?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onRefresh?: () => Promise<void>;
}

const ModernMobileProfile = ({ 
  children, 
  enableGestures = true,
  onSwipeLeft,
  onSwipeRight,
  onRefresh
}: ModernMobileProfileProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <>{children}</>;
  }

  // Wrapper to ensure onRefresh always returns a Promise
  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Enhanced mobile background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/98 via-blue-50/95 to-purple-50/98 dark:from-gray-950/98 dark:via-blue-950/95 dark:to-purple-950/98" />
      
      {/* Floating background elements optimized for mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/15 rounded-full blur-2xl top-8 right-4"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/15 rounded-full blur-xl bottom-16 left-4"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/3 dark:bg-black/3 backdrop-blur-[0.5px]" />

      {/* Content wrapper with gestures */}
      <div className="relative z-10">
        {enableGestures ? (
          <MobileGestureHandler
            enableSwipeNavigation={true}
            enablePullToRefresh={!!onRefresh}
            onSwipeLeft={onSwipeLeft}
            onSwipeRight={onSwipeRight}
            onPullDown={handleRefresh}
            className="min-h-screen"
          >
            <EnhancedMobileContainer
              enablePullToRefresh={!!onRefresh}
              onRefresh={handleRefresh}
              className="px-2 py-3"
            >
              {children}
            </EnhancedMobileContainer>
          </MobileGestureHandler>
        ) : (
          <EnhancedMobileContainer className="px-2 py-3">
            {children}
          </EnhancedMobileContainer>
        )}
      </div>

      {/* Mobile-specific bottom padding for navigation */}
      <div className="h-16 bg-gradient-to-t from-white/10 to-transparent dark:from-black/10" />
    </div>
  );
};

export default ModernMobileProfile;
