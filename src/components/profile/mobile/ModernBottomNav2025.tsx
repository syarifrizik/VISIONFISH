
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  Activity, 
  BookOpen, 
  Users, 
  Star,
  User
} from 'lucide-react';

interface ModernBottomNav2025Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ModernBottomNav2025 = ({
  activeTab,
  onTabChange
}: ModernBottomNav2025Props) => {
  const [pressedTab, setPressedTab] = useState<string | null>(null);

  const tabs = [
    {
      id: 'activity',
      icon: Activity,
      gradient: 'from-cyan-400 to-blue-500',
      glowColor: 'shadow-cyan-500/30'
    },
    {
      id: 'notes',
      icon: BookOpen,
      gradient: 'from-emerald-400 to-teal-500',
      glowColor: 'shadow-emerald-500/30'
    },
    {
      id: 'community',
      icon: Users,
      gradient: 'from-purple-400 to-pink-500',
      glowColor: 'shadow-purple-500/30'
    },
    {
      id: 'history',
      icon: Star,
      gradient: 'from-orange-400 to-red-500',
      glowColor: 'shadow-orange-500/30'
    },
    {
      id: 'profile',
      icon: User,
      gradient: 'from-indigo-400 to-purple-500',
      glowColor: 'shadow-indigo-500/30'
    }
  ];

  const handleTabPress = (tabId: string) => {
    setPressedTab(tabId);
    onTabChange(tabId);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(25);
    }
    
    setTimeout(() => setPressedTab(null), 150);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      {/* Enhanced backdrop */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent backdrop-blur-2xl" />
      
      <div className="relative px-4 py-4">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 30,
            delay: 0.3 
          }}
          className="relative max-w-sm mx-auto"
        >
          {/* Floating Navigation Container */}
          <div className="relative overflow-hidden rounded-3xl">
            {/* Enhanced Glassmorphism Background */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/15 to-white/10" />
            <div className="absolute inset-0 border border-white/20 rounded-3xl" />
            
            {/* Navigation Content */}
            <div className="relative flex items-center justify-between px-6 py-4">
              {tabs.map((tab, index) => {
                const isActive = activeTab === tab.id;
                const isPressed = pressedTab === tab.id;
                
                return (
                  <motion.button
                    key={tab.id}
                    className="relative flex items-center justify-center w-12 h-12"
                    onTap={() => handleTabPress(tab.id)}
                    whileTap={{ scale: 0.85 }}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                      delay: index * 0.06,
                      type: "spring",
                      stiffness: 500,
                      damping: 25
                    }}
                  >
                    {/* Active Background with Morphing */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          layoutId="activeNavBackground"
                          className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-2xl shadow-lg`}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 500, 
                            damping: 30 
                          }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Pressed Effect */}
                    <AnimatePresence>
                      {isPressed && !isActive && (
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-2xl opacity-40`}
                          initial={{ scale: 1.2, opacity: 0 }}
                          animate={{ scale: 1, opacity: 0.4 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.1 }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Enhanced Glow Effect */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          className={`absolute inset-0 ${tab.glowColor} rounded-2xl blur-lg opacity-0`}
                          animate={{ opacity: 0.6 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Icon with Enhanced Animation */}
                    <motion.div
                      className="relative z-10"
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        rotate: isActive ? [0, -3, 3, 0] : 0
                      }}
                      transition={{ 
                        duration: isActive ? 0.6 : 0.2,
                        ease: "easeInOut"
                      }}
                    >
                      <tab.icon 
                        className={`w-6 h-6 transition-colors duration-200 ${
                          isActive ? 'text-white drop-shadow-lg' : 'text-white/70'
                        }`}
                      />
                    </motion.div>

                    {/* Active Indicator Dot */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-lg"
                          initial={{ opacity: 0, scale: 0, y: 5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0, y: 5 }}
                          transition={{ 
                            duration: 0.3,
                            delay: 0.1,
                            type: "spring",
                            stiffness: 400,
                            damping: 20
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Enhanced Bottom Shadow */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-4/5 h-6 bg-black/30 blur-2xl rounded-full" />
        </motion.div>
      </div>
    </div>
  );
};

export default ModernBottomNav2025;
