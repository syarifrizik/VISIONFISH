
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ResponsiveGridProps {
  children: ReactNode;
  variant?: 'mobile' | 'desktop';
}

const ResponsiveGrid = ({ children, variant = 'mobile' }: ResponsiveGridProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (variant === 'desktop') {
    return (
      <motion.div 
        className="container mx-auto px-6 lg:px-8 max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          {/* Header Section - Full Width */}
          <motion.div 
            className="col-span-12"
            variants={itemVariants}
          >
            {children}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="container mx-auto px-4 max-w-sm sm:max-w-md"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="space-y-4"
        variants={itemVariants}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default ResponsiveGrid;
