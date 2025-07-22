
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Ultra2025MobileContainerProps {
  children: ReactNode;
  className?: string;
}

const Ultra2025MobileContainer = ({ 
  children, 
  className = "" 
}: Ultra2025MobileContainerProps) => {
  return (
    <div className={`min-h-screen relative overflow-hidden ${className}`}>
      {/* Ultra Modern 2025+ Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
        {/* Dynamic Mesh Gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.3),transparent_50%), radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent_50%), radial-gradient(circle_at_40%_80%,rgba(120,255,198,0.3),transparent_50%)]" />
        </div>
        
        {/* Animated Orbs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 blur-3xl"
          style={{ top: '10%', right: '10%' }}
          animate={{
            scale: [1, 1.2, 1.1, 1],
            opacity: [0.3, 0.6, 0.4, 0.3],
            x: [0, 50, -30, 0],
            y: [0, -60, 40, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-emerald-400/25 via-blue-500/25 to-violet-500/25 blur-2xl"
          style={{ bottom: '20%', left: '10%' }}
          animate={{
            scale: [1, 1.4, 0.8, 1.2, 1],
            opacity: [0.2, 0.5, 0.3, 0.4, 0.2],
            x: [0, -40, 30, -20, 0],
            y: [0, 40, -50, 30, 0]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 4 === 0 ? 'w-2 h-2 bg-cyan-400/60' :
              i % 4 === 1 ? 'w-1.5 h-1.5 bg-purple-400/50' :
              i % 4 === 2 ? 'w-1 h-1 bg-pink-400/40' :
              'w-1.5 h-1.5 bg-emerald-400/45'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -60 - Math.random() * 40, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Ultra2025MobileContainer;
