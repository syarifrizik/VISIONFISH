
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  User, 
  Globe, 
  Activity, 
  Users, 
  BookOpen
} from 'lucide-react';

interface MobileBottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOwnProfile?: boolean;
}

const MobileBottomNavigation = ({
  activeTab,
  onTabChange,
  isOwnProfile = true
}: MobileBottomNavigationProps) => {
  const [pressedTab, setPressedTab] = useState<string | null>(null);

  const tabs = [
    {
      id: 'my-content',
      icon: User,
      gradient: 'from-blue-500 to-cyan-500',
      glowColor: 'shadow-blue-500/40'
    },
    {
      id: 'notes',
      icon: BookOpen,
      gradient: 'from-emerald-500 to-teal-500',
      glowColor: 'shadow-emerald-500/40'
    },
    {
      id: 'public-feed',
      icon: Globe,
      gradient: 'from-purple-500 to-pink-500',
      glowColor: 'shadow-purple-500/40'
    },
    {
      id: 'activity',
      icon: Activity,
      gradient: 'from-orange-500 to-red-500',
      glowColor: 'shadow-orange-500/40'
    },
    {
      id: 'users',
      icon: Users,
      gradient: 'from-indigo-500 to-purple-500',
      glowColor: 'shadow-indigo-500/40'
    }
  ];

  const handleTabPress = (tabId: string) => {
    setPressedTab(tabId);
    onTabChange(tabId);
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    setTimeout(() => setPressedTab(null), 100);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      {/* Enhanced Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/85 to-transparent dark:from-gray-900/95 dark:via-gray-900/85 backdrop-blur-2xl" />
      
      {/* Subtle Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200/60 to-transparent dark:via-gray-700/60" />
      
      <div className="relative px-4 py-3">
        <div className="flex items-center justify-center max-w-sm mx-auto">
          <div className="flex items-center justify-between w-full bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl p-2 border border-white/30 dark:border-gray-700/30">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              const isPressed = pressedTab === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  className="relative flex items-center justify-center w-12 h-12 rounded-xl"
                  onTap={() => handleTabPress(tab.id)}
                  whileTap={{ scale: 0.9 }}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  {/* Active Background */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-xl`}
                        layoutId="activeBackground"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Pressed Effect */}
                  <AnimatePresence>
                    {isPressed && (
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-xl opacity-60`}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.6 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.1 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Glow Effect */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        className={`absolute inset-0 rounded-xl ${tab.glowColor} blur-lg opacity-0`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Icon */}
                  <motion.div
                    className="relative z-10"
                    animate={{
                      scale: isActive ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <tab.icon 
                      className={`w-5 h-5 ${
                        isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                      }`}
                    />
                  </motion.div>

                  {/* Active Dot Indicator */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileBottomNavigation;
