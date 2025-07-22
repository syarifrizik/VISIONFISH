
import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/hooks/use-theme';

interface ConstrainedOceanAnimationsProps {
  intensity?: 'minimal' | 'normal' | 'full';
  enableAnimations?: boolean;
}

// Fish SVG Component - Proper fish shape with body, tail, and eye
const FishSvg = ({ size = 24, color = "#0EA5E9" }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 32 24" fill="none">
    {/* Fish body */}
    <ellipse cx="16" cy="12" rx="12" ry="8" fill={color} opacity="0.8" />
    {/* Fish tail */}
    <path d="M4 12 L0 8 L0 16 Z" fill={color} opacity="0.6" />
    {/* Dorsal fin */}
    <path d="M12 4 L16 2 L20 4 L16 8 Z" fill={color} opacity="0.5" />
    {/* Bottom fin */}
    <path d="M12 20 L16 22 L20 20 L16 16 Z" fill={color} opacity="0.5" />
    {/* Fish eye */}
    <circle cx="20" cy="10" r="2.5" fill="white" opacity="0.9" />
    <circle cx="20" cy="10" r="1.5" fill="black" />
    {/* Small highlight in eye */}
    <circle cx="20.5" cy="9.5" r="0.5" fill="white" />
  </svg>
);

const ConstrainedOceanAnimations: React.FC<ConstrainedOceanAnimationsProps> = ({
  intensity = 'normal',
  enableAnimations = true
}) => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  if (!enableAnimations) return null;

  // Reduce intensity on mobile for performance
  const mobileIntensity = isMobile && intensity === 'full' ? 'normal' : intensity;

  // Hide fish in light mode
  const showFish = theme === 'dark';

  const getAnimationConfig = () => {
    switch (mobileIntensity) {
      case 'minimal':
        return { fishCount: showFish ? 3 : 0, bubbleCount: 8 };
      case 'normal':
        return { fishCount: showFish ? 5 : 0, bubbleCount: 12 };
      case 'full':
        return { fishCount: showFish ? 7 : 0, bubbleCount: 16 };
      default:
        return { fishCount: showFish ? 4 : 0, bubbleCount: 10 };
    }
  };

  const config = getAnimationConfig();

  // Fish colors array for variety
  const fishColors = ['#0EA5E9', '#06B6D4', '#0891B2', '#0F766E', '#065F46'];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
      {/* Enhanced Ocean Background Gradient with Soft Movement */}
      <motion.div 
        className={`absolute inset-0 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-slate-900/20 via-blue-900/15 to-teal-900/25' 
            : 'bg-gradient-to-br from-sky-200/20 via-blue-300/15 to-cyan-400/20'
        }`}
        animate={{
          background: theme === 'dark'
            ? [
                "linear-gradient(to bottom right, rgb(15 23 42 / 0.2), rgb(30 58 138 / 0.15), rgb(13 148 136 / 0.25))",
                "linear-gradient(to bottom right, rgb(30 58 138 / 0.25), rgb(13 148 136 / 0.2), rgb(6 182 212 / 0.3))",
                "linear-gradient(to bottom right, rgb(15 23 42 / 0.2), rgb(30 58 138 / 0.15), rgb(13 148 136 / 0.25))"
              ]
            : [
                "linear-gradient(to bottom right, rgb(186 230 253 / 0.2), rgb(147 197 253 / 0.15), rgb(103 232 249 / 0.2))",
                "linear-gradient(to bottom right, rgb(147 197 253 / 0.25), rgb(103 232 249 / 0.2), rgb(34 211 238 / 0.25))",
                "linear-gradient(to bottom right, rgb(186 230 253 / 0.2), rgb(147 197 253 / 0.15), rgb(103 232 249 / 0.2))"
              ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Swimming Fish - Only in dark mode */}
      {showFish && Array.from({ length: config.fishCount }).map((_, i) => {
        const fishSize = isMobile ? 20 + Math.random() * 8 : 24 + Math.random() * 12;
        const direction = Math.random() > 0.5 ? 1 : -1;
        const startX = direction > 0 ? -50 : window.innerWidth + 50;
        const endX = direction > 0 ? window.innerWidth + 50 : -50;
        const yPosition = 15 + Math.random() * 60; // 15% to 75% of viewport height
        
        return (
          <motion.div
            key={`constrained-fish-${i}`}
            className="absolute"
            style={{
              top: `${yPosition}%`,
              left: startX,
              zIndex: -9 + (i % 3)
            }}
            animate={{
              x: endX - startX,
              y: [0, Math.sin(i) * 15, Math.cos(i) * 10, 0],
            }}
            transition={{
              duration: 20 + i * 4 + Math.random() * 8,
              repeat: Infinity,
              ease: "linear",
              delay: i * 3 + Math.random() * 5
            }}
          >
            <motion.div
              animate={{
                rotateY: direction < 0 ? 180 : 0,
                rotateZ: [0, 2, -2, 0]
              }}
              transition={{
                rotateZ: { 
                  duration: 3 + Math.random() * 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }
              }}
            >
              <FishSvg 
                size={fishSize} 
                color={fishColors[i % fishColors.length]} 
              />
            </motion.div>
          </motion.div>
        );
      })}
      
      {/* Enhanced Constrained Bubbles with More Variety */}
      {Array.from({ length: config.bubbleCount }).map((_, i) => (
        <motion.div
          key={`constrained-bubble-${i}`}
          className={`absolute rounded-full ${
            theme === 'dark' ? 'bg-white/25' : 'bg-blue-200/40'
          }`}
          style={{
            width: `${3 + Math.random() * 6}px`,
            height: `${3 + Math.random() * 6}px`,
            left: `${Math.random() * 100}%`,
            bottom: '-10px'
          }}
          animate={{
            y: [0, -(window.innerHeight + 20)],
            x: [0, Math.random() * 60 - 30],
            opacity: [0, 0.8, 0.8, 0],
            scale: [0.5, 1, 1.2, 0.8]
          }}
          transition={{
            duration: 10 + Math.random() * 6,
            repeat: Infinity,
            ease: "easeOut",
            delay: Math.random() * 8
          }}
        />
      ))}
      
      {/* Enhanced Subtle Light Rays - Mobile Safe */}
      {!isMobile && (
        <div className="absolute inset-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={`light-ray-${i}`}
              className={`absolute top-0 w-1 bg-gradient-to-b ${
                theme === 'dark' 
                  ? 'from-cyan-200/15 to-transparent' 
                  : 'from-blue-100/25 to-transparent'
              }`}
              style={{
                height: '50%',
                left: `${15 + i * 25}%`,
                transform: 'skewX(-15deg)'
              }}
              animate={{
                opacity: theme === 'dark' ? [0.15, 0.35, 0.15] : [0.25, 0.45, 0.25],
                scaleY: [1, 1.3, 1],
                x: [0, 10, 0]
              }}
              transition={{
                duration: 5 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.5
              }}
            />
          ))}
        </div>
      )}

      {/* Water Current Effect */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: theme === 'dark'
              ? "repeating-linear-gradient(45deg, rgba(13, 148, 136, 0.05) 0px, transparent 40px)"
              : "repeating-linear-gradient(45deg, rgba(103, 232, 249, 0.05) 0px, transparent 40px)"
          }}
        />
      </motion.div>
    </div>
  );
};

export default ConstrainedOceanAnimations;
