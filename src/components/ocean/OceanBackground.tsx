
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

const OceanBackground = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -10 }}>
      {/* Enhanced Ocean Gradient Background with More Dynamic Animation */}
      <motion.div
        className={cn(
          "absolute inset-0 transition-all duration-1000",
          theme === 'light'
            ? "bg-gradient-to-b from-sky-200/30 via-blue-300/20 to-cyan-400/30"
            : "bg-gradient-to-b from-slate-900/50 via-blue-900/30 to-teal-900/40"
        )}
        animate={{
          background: theme === 'light'
            ? [
                "linear-gradient(to bottom, rgb(186 230 253 / 0.3), rgb(147 197 253 / 0.2), rgb(103 232 249 / 0.3))",
                "linear-gradient(to bottom, rgb(147 197 253 / 0.5), rgb(103 232 249 / 0.4), rgb(34 211 238 / 0.5))",
                "linear-gradient(to bottom, rgb(103 232 249 / 0.4), rgb(34 211 238 / 0.3), rgb(6 182 212 / 0.4))",
                "linear-gradient(to bottom, rgb(147 197 253 / 0.5), rgb(103 232 249 / 0.4), rgb(34 211 238 / 0.5))",
                "linear-gradient(to bottom, rgb(186 230 253 / 0.3), rgb(147 197 253 / 0.2), rgb(103 232 249 / 0.3))"
              ]
            : [
                "linear-gradient(to bottom, rgb(15 23 42 / 0.5), rgb(30 58 138 / 0.3), rgb(13 148 136 / 0.4))",
                "linear-gradient(to bottom, rgb(30 58 138 / 0.6), rgb(13 148 136 / 0.5), rgb(6 182 212 / 0.6))",
                "linear-gradient(to bottom, rgb(13 148 136 / 0.5), rgb(6 182 212 / 0.4), rgb(8 145 178 / 0.5))",
                "linear-gradient(to bottom, rgb(30 58 138 / 0.6), rgb(13 148 136 / 0.5), rgb(6 182 212 / 0.6))",
                "linear-gradient(to bottom, rgb(15 23 42 / 0.5), rgb(30 58 138 / 0.3), rgb(13 148 136 / 0.4))"
              ]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Enhanced Multiple Light Rays with Different Timings */}
      <motion.div
        className={cn(
          "absolute inset-0",
          theme === 'light' ? "opacity-40" : "opacity-30"
        )}
        animate={{
          rotate: [0, 8, -8, 0],
          scale: [1, 1.1, 0.9, 1],
          opacity: theme === 'light' ? [0.4, 0.6, 0.4] : [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className={cn(
          "absolute inset-0",
          theme === 'light' 
            ? "bg-gradient-to-br from-yellow-200/30 via-transparent to-transparent" 
            : "bg-gradient-to-br from-cyan-400/20 via-transparent to-transparent"
        )} />
      </motion.div>

      {/* Secondary Light Rays for Depth */}
      <motion.div
        className={cn(
          "absolute inset-0",
          theme === 'light' ? "opacity-25" : "opacity-20"
        )}
        animate={{
          rotate: [0, -5, 5, 0],
          scale: [1, 0.95, 1.05, 1]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        <div className={cn(
          "absolute inset-0",
          theme === 'light'
            ? "bg-gradient-to-tl from-blue-200/20 via-transparent to-transparent"
            : "bg-gradient-to-tl from-teal-400/15 via-transparent to-transparent"
        )} />
      </motion.div>

      {/* Wave Layers - Multiple Moving Waves */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        animate={{
          backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: theme === 'light'
              ? "repeating-linear-gradient(45deg, rgba(147, 197, 253, 0.1) 0px, transparent 20px, rgba(103, 232, 249, 0.1) 40px)"
              : "repeating-linear-gradient(45deg, rgba(30, 58, 138, 0.1) 0px, transparent 20px, rgba(13, 148, 136, 0.1) 40px)"
          }}
        />
      </motion.div>

      {/* Secondary Wave Layer */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        animate={{
          backgroundPosition: ["100% 100%", "0% 100%", "100% 100%"]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: theme === 'light'
              ? "repeating-linear-gradient(-45deg, rgba(186, 230, 253, 0.08) 0px, transparent 30px, rgba(34, 211, 238, 0.08) 60px)"
              : "repeating-linear-gradient(-45deg, rgba(15, 23, 42, 0.08) 0px, transparent 30px, rgba(6, 182, 212, 0.08) 60px)"
          }}
        />
      </motion.div>

      {/* Enhanced Water Surface Ripples */}
      <motion.div
        className="absolute top-0 left-0 w-full h-48 overflow-hidden"
        style={{
          background: theme === 'light'
            ? "linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(147, 197, 253, 0.1), transparent)"
            : "linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(30, 58, 138, 0.1), transparent)"
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
          transform: ["translateY(0px)", "translateY(5px)", "translateY(0px)"]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating Particles/Plankton Effect */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className={cn(
            "absolute w-1 h-1 rounded-full",
            theme === 'light' ? "bg-blue-300/40" : "bg-cyan-400/30"
          )}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 8 + Math.random() * 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
        />
      ))}

      {/* Caustic Light Effects (Pantulan Cahaya di Air) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: theme === 'light' ? [0.1, 0.3, 0.1] : [0.05, 0.15, 0.05]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: theme === 'light'
              ? "radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(147, 197, 253, 0.15) 0%, transparent 50%)"
              : "radial-gradient(ellipse at 30% 20%, rgba(103, 232, 249, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(13, 148, 136, 0.08) 0%, transparent 50%)"
          }}
        />
      </motion.div>

      {/* Breathing Color Pulse Effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundColor: theme === 'light' 
            ? ["rgba(186, 230, 253, 0.02)", "rgba(103, 232, 249, 0.04)", "rgba(186, 230, 253, 0.02)"]
            : ["rgba(15, 23, 42, 0.02)", "rgba(13, 148, 136, 0.04)", "rgba(15, 23, 42, 0.02)"]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default OceanBackground;
