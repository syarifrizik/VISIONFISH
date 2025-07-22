
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  Activity, 
  BookOpen, 
  Users, 
  Fish,
  User
} from 'lucide-react';

interface RevolutionaryBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const RevolutionaryBottomNav = ({
  activeTab,
  onTabChange
}: RevolutionaryBottomNavProps) => {
  const [pressedTab, setPressedTab] = useState<string | null>(null);

  const tabs = [
    {
      id: 'aktivitas',
      icon: Activity,
      gradient: 'from-cyan-400 to-blue-500'
    },
    {
      id: 'catatan',
      icon: BookOpen,
      gradient: 'from-emerald-400 to-teal-500'
    },
    {
      id: 'komunitas',
      icon: Users,
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      id: 'riwayat',
      icon: Fish,
      gradient: 'from-orange-400 to-red-500'
    },
    {
      id: 'pengguna',
      icon: User,
      gradient: 'from-indigo-400 to-purple-500'
    }
  ];

  const handleTabPress = (tabId: string) => {
    setPressedTab(tabId);
    onTabChange(tabId);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    
    setTimeout(() => setPressedTab(null), 150);
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      {/* Floating Navigation Container */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 30,
          delay: 0.2 
        }}
        className="relative"
      >
        {/* Glassmorphism Background */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-2xl rounded-3xl border border-white/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-3xl" />
        
        {/* Navigation Content */}
        <div className="relative flex items-center px-6 py-4 gap-6">
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            const isPressed = pressedTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                className="relative flex items-center justify-center"
                onTap={() => handleTabPress(tab.id)}
                whileTap={{ scale: 0.85 }}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  delay: index * 0.08,
                  type: "spring",
                  stiffness: 500,
                  damping: 25
                }}
              >
                {/* Active Background */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className={`absolute inset-0 w-12 h-12 bg-gradient-to-r ${tab.gradient} rounded-2xl shadow-lg`}
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
                      className={`absolute inset-0 w-12 h-12 bg-gradient-to-r ${tab.gradient} rounded-2xl opacity-30`}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.3 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.1 }}
                    />
                  )}
                </AnimatePresence>

                {/* Glow Effect */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className={`absolute inset-0 w-12 h-12 bg-gradient-to-r ${tab.gradient} rounded-2xl blur-lg opacity-0`}
                      animate={{ opacity: 0.4 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>

                {/* Icon */}
                <motion.div
                  className="relative z-10 w-12 h-12 flex items-center justify-center"
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    rotate: isActive ? [0, -5, 5, 0] : 0
                  }}
                  transition={{ 
                    duration: isActive ? 0.6 : 0.2,
                    ease: "easeInOut"
                  }}
                >
                  <tab.icon 
                    className={`w-6 h-6 transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-white/60'
                    }`}
                  />
                </motion.div>

                {/* Active Dot Indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg"
                      initial={{ opacity: 0, scale: 0, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0, y: 10 }}
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

        {/* Bottom Shadow */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-black/20 blur-xl rounded-full" />
      </motion.div>
    </div>
  );
};

export default RevolutionaryBottomNav;
