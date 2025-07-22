
import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavItem } from '@/types/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileSafeContainer from '@/components/layout/MobileSafeContainer';

interface MainContentProps {
  children: ReactNode;
  prevPath: string;
  navItems: NavItem[];
}

export const MainContent = ({ children, prevPath }: MainContentProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <main className="flex-1 min-h-0 mobile-constrained mobile-optimized">
        <MobileSafeContainer variant="content" className="pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={prevPath}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut"
              }}
              className="h-full min-h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </MobileSafeContainer>
      </main>
    );
  }

  return (
    <main className="flex-1 min-h-0 pb-20 lg:pb-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={prevPath}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut"
          }}
          className="h-full min-h-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </main>
  );
};
