
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, ProfileStats } from '@/types/profile';
import Revolutionary2025Header from './Revolutionary2025Header';
import ModernBottomNav2025 from './ModernBottomNav2025';
import DynamicContentCards from './DynamicContentCards';
import EnhancedGestureHandler from './EnhancedGestureHandler';

interface MobileProfileContainerProps {
  user: UserProfile;
  stats: ProfileStats;
  isPremium?: boolean;
  onStatsUpdate?: (stats: ProfileStats) => void;
  onRefresh?: () => void;
}

const MobileProfileContainer = ({
  user,
  stats,
  isPremium = false,
  onStatsUpdate,
  onRefresh
}: MobileProfileContainerProps) => {
  const [activeTab, setActiveTab] = useState('activity');

  const tabs = ['activity', 'notes', 'community', 'history', 'profile'];

  const handleSwipeLeft = () => {
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    setActiveTab(tabs[nextIndex]);
  };

  const handleSwipeRight = () => {
    const currentIndex = tabs.indexOf(activeTab);
    const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    setActiveTab(tabs[prevIndex]);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      {/* Revolutionary 2025+ Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary Gradient Orb */}
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-purple-600/30 rounded-full blur-3xl"
          style={{ top: '10%', right: '10%' }}
          animate={{
            scale: [1, 1.2, 1.1, 1],
            opacity: [0.3, 0.6, 0.4, 0.3],
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Secondary Gradient Orb */}
        <motion.div
          className="absolute w-80 h-80 bg-gradient-to-br from-pink-400/30 via-purple-500/20 to-cyan-400/30 rounded-full blur-2xl"
          style={{ bottom: '20%', left: '5%' }}
          animate={{
            scale: [1, 1.3, 0.9, 1.1, 1],
            opacity: [0.2, 0.5, 0.3, 0.4, 0.2],
            x: [0, -25, 15, -10, 0],
            y: [0, 25, -35, 15, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />

        {/* Floating Particles - Optimized */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 3 === 0 ? 'w-2 h-2 bg-cyan-400/60' :
              i % 3 === 1 ? 'w-1.5 h-1.5 bg-purple-400/50' :
              'w-1 h-1 bg-pink-400/40'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -40 - Math.random() * 20, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1.2, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Enhanced Glass Overlay */}
      <div className="absolute inset-0 bg-black/5 backdrop-blur-[0.5px]" />
      
      {/* Enhanced Gesture Handler */}
      <EnhancedGestureHandler
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        onRefresh={onRefresh}
        className="relative z-10 min-h-screen"
      >
        {/* Revolutionary Header */}
        <Revolutionary2025Header
          user={user}
          stats={stats}
          isPremium={isPremium}
          onStatsUpdate={onStatsUpdate}
        />

        {/* Dynamic Content Area */}
        <motion.div 
          className="mx-4 relative mb-32"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.98 }}
              transition={{ 
                duration: 0.3, 
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <DynamicContentCards
                activeTab={activeTab}
                user={user}
                stats={stats}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </EnhancedGestureHandler>

      {/* Modern Bottom Navigation */}
      <ModernBottomNav2025
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default MobileProfileContainer;
