
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';

interface ProfileLayoutProps {
  children: ReactNode;
  showBackgroundEffects?: boolean;
}

const ProfileLayout = ({ children, showBackgroundEffects = true }: ProfileLayoutProps) => {
  const { theme } = useTheme();

  const pageVariants = {
    initial: { 
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    in: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    out: { 
      opacity: 0,
      scale: 1.05,
      y: -20,
      transition: {
        duration: 0.4,
        ease: [0.55, 0.085, 0.68, 0.53]
      }
    }
  };

  return (
    <motion.div 
      className={`min-h-screen relative overflow-hidden ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#49225B] via-[#6E3482] to-[#A56ABD]'
          : 'bg-gradient-to-br from-[#F5EBFA] via-[#E7D0EF] to-[#A56ABD]'
      }`}
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
    >
      {/* Enhanced Background Effects */}
      {showBackgroundEffects && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated gradient orbs */}
          <motion.div
            className="absolute top-10 right-10 w-72 h-72 bg-white/5 dark:bg-white/3 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute bottom-20 left-10 w-64 h-64 bg-gradient-to-r from-[#A56ABD]/10 to-[#6E3482]/10 rounded-full blur-2xl"
            animate={{
              x: [0, -30, 0],
              y: [0, 20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 dark:bg-white/10 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-[1px]" />

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default ProfileLayout;
