
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MobileSafeContainerProps {
  children: ReactNode;
  className?: string;
  enablePadding?: boolean;
  variant?: 'default' | 'full' | 'content';
}

const MobileSafeContainer = ({ 
  children, 
  className = "",
  enablePadding = true,
  variant = 'default'
}: MobileSafeContainerProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'full':
        return 'min-h-screen';
      case 'content':
        return 'min-h-[calc(100vh-8rem)]';
      default:
        return 'min-h-[calc(100vh-6rem)]';
    }
  };

  const getPaddingClasses = () => {
    if (!enablePadding) return '';
    return 'px-4 sm:px-6 lg:px-8 py-4 sm:py-6';
  };

  return (
    <motion.div 
      className={cn(
        'relative w-full',
        'safe-area-inset-top safe-area-inset-bottom',
        'safe-area-inset-left safe-area-inset-right',
        getVariantClasses(),
        getPaddingClasses(),
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default MobileSafeContainer;
