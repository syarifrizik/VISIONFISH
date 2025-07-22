
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

interface FishProps {
  size?: number;
  depth?: number;
  speed?: number;
  delay?: number;
  color?: string;
  direction?: 'left' | 'right';
  path?: 'straight' | 'wave' | 'curve';
}

const FishSVG = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M6.5 12c0-1.5 1.5-3 3.5-3s3.5 1.5 3.5 3-1.5 3-3.5 3-3.5-1.5-3.5-3z"
      fill={color}
      opacity="0.8"
    />
    <path
      d="M13.5 12l3-1.5v3l-3-1.5z"
      fill={color}
      opacity="0.6"
    />
    <circle cx="9" cy="11" r="1" fill="white" opacity="0.9" />
    <circle cx="9" cy="11" r="0.5" fill="black" />
    <path
      d="M6 12c-1.5-0.5-3-1-4-1.5v3c1-0.5 2.5-1 4-1.5z"
      fill={color}
      opacity="0.4"
    />
  </svg>
);

const SwimmingFish: React.FC<FishProps> = ({
  size = 24,
  depth = 1,
  speed = 30,
  delay = 0,
  color,
  direction = 'right',
  path = 'straight'
}) => {
  const { theme } = useTheme();
  
  const fishColor = color || (theme === 'light' 
    ? `hsl(${200 + depth * 20}, 70%, ${60 - depth * 10}%)`
    : `hsl(${180 + depth * 30}, 80%, ${40 + depth * 10}%)`);

  const opacity = Math.max(0.3, 1 - depth * 0.15);
  const scale = Math.max(0.5, 1 - depth * 0.1);
  const startX = direction === 'right' ? -100 : window.innerWidth + 100;
  const endX = direction === 'right' ? window.innerWidth + 100 : -100;
  const baseY = Math.random() * 70 + 10; // 10% to 80% of viewport height

  const getAnimationPath = () => {
    switch (path) {
      case 'wave':
        return {
          x: [startX, endX],
          y: [
            baseY + '%',
            (baseY + Math.sin(0.3) * 15) + '%',
            (baseY + Math.sin(0.6) * 15) + '%',
            (baseY + Math.sin(0.9) * 15) + '%',
            baseY + '%'
          ]
        };
      case 'curve':
        return {
          x: [startX, endX],
          y: [
            baseY + '%',
            (baseY - 10) + '%',
            (baseY + 5) + '%',
            baseY + '%'
          ]
        };
      default:
        return {
          x: [startX, endX],
          y: baseY + '%'
        };
    }
  };

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        opacity,
        scale,
        zIndex: -9 + depth
      }}
      initial={{ x: startX, y: baseY + '%' }}
      animate={getAnimationPath()}
      transition={{
        duration: speed + Math.random() * 10,
        delay: delay + Math.random() * 5,
        repeat: Infinity,
        ease: "linear",
        repeatDelay: Math.random() * 15
      }}
    >
      <motion.div
        animate={{
          rotateY: direction === 'left' ? 180 : 0,
          rotateZ: path === 'wave' ? [0, 5, -5, 0] : 0
        }}
        transition={{
          rotateZ: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <FishSVG size={size} color={fishColor} />
      </motion.div>
    </motion.div>
  );
};

export default SwimmingFish;
