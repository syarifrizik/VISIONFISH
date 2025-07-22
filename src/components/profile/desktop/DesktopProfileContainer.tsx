
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserProfile, ProfileStats } from '@/types/profile';
import DesktopProfileHeader from './DesktopProfileHeader';
import DesktopProfileNavigation from './DesktopProfileNavigation';
import DesktopProfileContent from './DesktopProfileContent';

interface DesktopProfileContainerProps {
  user: UserProfile;
  stats: ProfileStats;
  isPremium?: boolean;
  onStatsUpdate?: (stats: ProfileStats) => void;
  onRefresh?: () => void;
}

const DesktopProfileContainer = ({
  user,
  stats,
  isPremium = false,
  onStatsUpdate,
  onRefresh
}: DesktopProfileContainerProps) => {
  const [activeTab, setActiveTab] = useState('aktivitas');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
      {/* Enhanced 2025+ Background with Glassmorphism 2.0 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Dynamic gradient layers */}
        <motion.div
          className="absolute w-[800px] h-[800px] bg-gradient-to-br from-cyan-400/15 via-blue-500/10 to-purple-600/15 rounded-full blur-3xl"
          style={{
            left: `${10 + mousePosition.x * 0.08}%`,
            top: `${5 + mousePosition.y * 0.06}%`,
          }}
          animate={{
            scale: [1, 1.2, 1.1, 1],
            opacity: [0.3, 0.5, 0.4, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute w-[600px] h-[600px] bg-gradient-to-br from-pink-400/12 via-purple-500/8 to-cyan-400/12 rounded-full blur-2xl"
          style={{
            right: `${15 + mousePosition.x * -0.06}%`,
            bottom: `${10 + mousePosition.y * -0.04}%`,
          }}
          animate={{
            scale: [1, 1.3, 0.9, 1.1, 1],
            opacity: [0.2, 0.4, 0.3, 0.4, 0.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8
          }}
        />

        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 3 === 0 ? 'w-2 h-2 bg-cyan-400/40' :
              i % 3 === 1 ? 'w-1.5 h-1.5 bg-pink-400/35' :
              'w-2.5 h-2.5 bg-purple-400/30'
            }`}
            style={{
              left: `${(i * 3.3) % 100}%`,
              top: `${(i * 2.7) % 100}%`,
            }}
            animate={{
              y: [0, -80 - Math.random() * 60, 0],
              x: [0, (Math.random() - 0.5) * 100, 0],
              opacity: [0, 1, 0.6, 0],
              scale: [0, 1.5, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 backdrop-blur-[1px] bg-black/5" />

      {/* Main content */}
      <motion.div 
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="container mx-auto px-8 py-8 max-w-7xl space-y-8">
          {/* Asymmetric Header with floating profile card */}
          <DesktopProfileHeader
            user={user}
            stats={stats}
            isPremium={isPremium}
            onStatsUpdate={onStatsUpdate}
          />

          {/* Navigation with micro-interactions */}
          <DesktopProfileNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Fluid content grid */}
          <DesktopProfileContent
            activeTab={activeTab}
            searchQuery={searchQuery}
            viewMode={viewMode}
            user={user}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default DesktopProfileContainer;
