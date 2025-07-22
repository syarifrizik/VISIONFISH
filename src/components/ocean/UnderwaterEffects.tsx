
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

const FloatingParticle = ({ delay = 0, size = 2 }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      className={cn(
        "absolute rounded-full pointer-events-none",
        theme === 'light' ? 'bg-blue-200/40' : 'bg-cyan-400/20'
      )}
      style={{
        width: size,
        height: size,
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        zIndex: -7
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, Math.random() * 20 - 10, 0],
        opacity: [0.2, 0.6, 0.2]
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

const LightRay = ({ index = 0 }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${20 + index * 15}%`,
        top: '-10%',
        width: '2px',
        height: '120%',
        background: theme === 'light'
          ? 'linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0.1), transparent)'
          : 'linear-gradient(to bottom, rgba(0,255,255,0.2), rgba(0,255,255,0.05), transparent)',
        transform: 'rotate(5deg)',
        zIndex: -6
      }}
      animate={{
        opacity: [0.3, 0.7, 0.3],
        scaleY: [0.8, 1.2, 0.8],
        x: [0, 10, 0]
      }}
      transition={{
        duration: 6 + index * 0.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.8
      }}
    />
  );
};

const WaterDistortion = () => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: theme === 'light'
          ? 'radial-gradient(ellipse at center, transparent 30%, rgba(59,130,246,0.1) 70%)'
          : 'radial-gradient(ellipse at center, transparent 30%, rgba(6,182,212,0.1) 70%)',
        zIndex: -5
      }}
      animate={{
        background: theme === 'light'
          ? [
              'radial-gradient(ellipse at 30% 40%, transparent 30%, rgba(59,130,246,0.1) 70%)',
              'radial-gradient(ellipse at 70% 60%, transparent 30%, rgba(59,130,246,0.1) 70%)',
              'radial-gradient(ellipse at 30% 40%, transparent 30%, rgba(59,130,246,0.1) 70%)'
            ]
          : [
              'radial-gradient(ellipse at 30% 40%, transparent 30%, rgba(6,182,212,0.1) 70%)',
              'radial-gradient(ellipse at 70% 60%, transparent 30%, rgba(6,182,212,0.1) 70%)',
              'radial-gradient(ellipse at 30% 40%, transparent 30%, rgba(6,182,212,0.1) 70%)'
            ]
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

const UnderwaterEffects = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Light Rays */}
      {Array.from({ length: 5 }).map((_, i) => (
        <LightRay key={`ray-${i}`} index={i} />
      ))}
      
      {/* Floating Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <FloatingParticle
          key={`particle-${i}`}
          delay={i * 0.8}
          size={1 + Math.random() * 3}
        />
      ))}
      
      {/* Water Distortion */}
      <WaterDistortion />
    </div>
  );
};

export default UnderwaterEffects;
