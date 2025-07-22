
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface ModernDesktopProfileProps {
  children: ReactNode;
}

const ModernDesktopProfile = ({ children }: ModernDesktopProfileProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Enhanced desktop background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/99 via-blue-50/97 to-purple-50/99 dark:from-gray-950/99 dark:via-blue-950/97 dark:to-purple-950/99" />
      
      {/* Enhanced floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary floating elements */}
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-br from-blue-400/12 to-cyan-400/8 rounded-full blur-3xl top-20 right-20"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.6, 0.4],
            x: [0, 25, 0],
            y: [0, -15, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute w-72 h-72 bg-gradient-to-br from-purple-400/12 to-pink-400/8 rounded-full blur-3xl bottom-40 left-20"
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -20, 0],
            y: [0, 20, 0]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
        
        {/* Secondary floating elements */}
        <motion.div
          className="absolute w-48 h-48 bg-gradient-to-br from-emerald-400/10 to-teal-400/6 rounded-full blur-2xl top-40 left-1/3"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute w-64 h-64 bg-gradient-to-br from-yellow-400/8 to-orange-400/6 rounded-full blur-3xl bottom-20 right-1/3"
          animate={{
            scale: [1, 1.18, 1],
            opacity: [0.25, 0.45, 0.25],
            x: [0, 15, 0],
            y: [0, -10, 0]
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6
          }}
        />
        
        {/* Enhanced floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-white/25 to-white/15 dark:from-white/15 dark:to-white/8 backdrop-blur-sm"
            style={{
              width: `${8 + Math.random() * 12}px`,
              height: `${8 + Math.random() * 12}px`,
              left: `${10 + (i * 8)}%`,
              top: `${20 + (i * 6)}%`,
            }}
            animate={{
              y: [0, -40 - Math.random() * 20, 0],
              x: [0, (Math.random() - 0.5) * 30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1 + Math.random() * 0.5, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 6,
              repeat: Infinity,
              delay: i * 1.8,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Geometric shapes */}
        <motion.div
          className="absolute w-32 h-32 border border-blue-200/30 dark:border-blue-700/30 rounded-2xl top-32 right-40 backdrop-blur-sm"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute w-24 h-24 border border-purple-200/30 dark:border-purple-700/30 rounded-full bottom-32 left-40 backdrop-blur-sm"
          animate={{
            rotate: [360, 0],
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Enhanced glassmorphism overlays */}
      <div className="absolute inset-0 bg-white/2 dark:bg-black/2 backdrop-blur-[0.5px]" />
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-white/1 via-transparent to-purple/1 dark:from-black/1 dark:to-purple-900/1"
        animate={{
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Enhanced content wrapper */}
      <div className="relative z-10 container mx-auto px-8 py-10 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 1,
            ease: [0.25, 0.46, 0.45, 0.94],
            staggerChildren: 0.1
          }}
          className="relative"
        >
          {/* Content background enhancement */}
          <motion.div
            className="absolute inset-0 bg-white/5 dark:bg-black/5 rounded-3xl backdrop-blur-sm -z-10"
            animate={{
              scale: [1, 1.01, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {children}
        </motion.div>
      </div>
      
      {/* Enhanced corner decorations */}
      <motion.div
        className="absolute top-10 left-10 w-6 h-6 border-l-2 border-t-2 border-blue-300/40 dark:border-blue-600/40 rounded-tl-lg"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-10 right-10 w-6 h-6 border-r-2 border-t-2 border-purple-300/40 dark:border-purple-600/40 rounded-tr-lg"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div
        className="absolute bottom-10 left-10 w-6 h-6 border-l-2 border-b-2 border-emerald-300/40 dark:border-emerald-600/40 rounded-bl-lg"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-6 h-6 border-r-2 border-b-2 border-pink-300/40 dark:border-pink-600/40 rounded-br-lg"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />
    </div>
  );
};

export default ModernDesktopProfile;
