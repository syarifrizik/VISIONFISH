
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, ProfileStats } from '@/types/profile';
import { supabase } from '@/integrations/supabase/client';

interface MobileProfileContainer2025Props {
  children: React.ReactNode;
}

const MobileProfileContainer2025 = ({ children }: MobileProfileContainer2025Props) => {
  const [backgroundEffects, setBackgroundEffects] = useState(true);

  // Advanced background effects with particles
  const generateParticles = () => {
    return [...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className={`absolute rounded-full ${
          i % 4 === 0 ? 'w-2 h-2 bg-cyan-400/30' :
          i % 4 === 1 ? 'w-1.5 h-1.5 bg-purple-400/25' :
          i % 4 === 2 ? 'w-1 h-1 bg-pink-400/20' :
          'w-0.5 h-0.5 bg-blue-400/15'
        }`}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30 - Math.random() * 20, 0],
          x: [0, Math.random() * 10 - 5, 0],
          opacity: [0, 0.8, 0],
          scale: [0, 1.2, 0]
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: "easeInOut"
        }}
      />
    ));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Revolutionary 2025+ Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950" />
      
      {/* Dynamic Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-br from-cyan-400/20 via-blue-500/15 to-purple-600/25 rounded-full blur-3xl"
          style={{ top: '10%', right: '10%' }}
          animate={{
            scale: [1, 1.3, 1.1, 1],
            opacity: [0.2, 0.5, 0.3, 0.2],
            x: [0, 40, -30, 0],
            y: [0, -50, 30, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute w-80 h-80 bg-gradient-to-br from-pink-400/25 via-purple-500/20 to-cyan-400/25 rounded-full blur-2xl"
          style={{ bottom: '20%', left: '5%' }}
          animate={{
            scale: [1, 1.4, 0.8, 1.2, 1],
            opacity: [0.15, 0.4, 0.25, 0.35, 0.15],
            x: [0, -35, 25, -15, 0],
            y: [0, 35, -45, 25, 0]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 7
          }}
        />

        {/* Floating Particles */}
        {backgroundEffects && generateParticles()}
      </div>

      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default MobileProfileContainer2025;
