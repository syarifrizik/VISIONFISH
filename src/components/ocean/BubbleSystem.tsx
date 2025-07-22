
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';

interface BubbleProps {
  size?: number;
  delay?: number;
  startX?: number;
  duration?: number;
}

const BubbleSVG = ({ size = 8 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
    <circle
      cx="6"
      cy="6"
      r="5"
      fill="rgba(255, 255, 255, 0.3)"
      stroke="rgba(255, 255, 255, 0.5)"
      strokeWidth="0.5"
    />
    <circle
      cx="4"
      cy="4"
      r="1.5"
      fill="rgba(255, 255, 255, 0.6)"
    />
  </svg>
);

const SingleBubble: React.FC<BubbleProps> = ({
  size = 8,
  delay = 0,
  startX = 50,
  duration = 12
}) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: startX + '%',
        zIndex: -8
      }}
      initial={{ 
        y: '110vh',
        opacity: 0,
        scale: 0.5
      }}
      animate={{
        y: '-10vh',
        opacity: [0, 0.8, 0.8, 0],
        scale: [0.5, 1, 1.2, 0.3],
        x: [0, Math.random() * 40 - 20, Math.random() * 60 - 30, Math.random() * 20 - 10]
      }}
      transition={{
        duration: duration + Math.random() * 5,
        delay: delay,
        repeat: Infinity,
        ease: "easeOut",
        repeatDelay: Math.random() * 8
      }}
    >
      <motion.div
        animate={{
          rotate: [0, 360]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <BubbleSVG size={size} />
      </motion.div>
    </motion.div>
  );
};

const BubbleCluster = ({ count = 5, centerX = 50 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SingleBubble
          key={i}
          size={Math.random() * 8 + 4}
          delay={i * 0.5 + Math.random() * 2}
          startX={centerX + (Math.random() * 20 - 10)}
          duration={10 + Math.random() * 8}
        />
      ))}
    </>
  );
};

const BubbleSystem = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -8 }}>
      {/* Multiple bubble sources */}
      <BubbleCluster count={3} centerX={15} />
      <BubbleCluster count={4} centerX={35} />
      <BubbleCluster count={3} centerX={55} />
      <BubbleCluster count={4} centerX={75} />
      <BubbleCluster count={2} centerX={90} />
      
      {/* Ambient bubbles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <SingleBubble
          key={`ambient-${i}`}
          size={Math.random() * 6 + 3}
          delay={i * 2 + Math.random() * 5}
          startX={Math.random() * 100}
          duration={15 + Math.random() * 10}
        />
      ))}
    </div>
  );
};

export default BubbleSystem;
