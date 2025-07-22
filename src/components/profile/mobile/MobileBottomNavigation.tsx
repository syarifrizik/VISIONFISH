
import { motion } from 'framer-motion';
import { Activity, BookOpen, Users, History, User } from 'lucide-react';

interface MobileBottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileBottomNavigation = ({
  activeTab,
  onTabChange
}: MobileBottomNavigationProps) => {
  const tabs = [
    { id: 'aktivitas', icon: Activity, label: 'Aktivitas' },
    { id: 'catatan', icon: BookOpen, label: 'Catatan' },
    { id: 'komunitas', icon: Users, label: 'Komunitas' },
    { id: 'riwayat', icon: History, label: 'Riwayat' },
    { id: 'pengguna', icon: User, label: 'Pengguna' }
  ];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      {/* Enhanced glassmorphism background with blur */}
      <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl" />
      <div className="absolute inset-0 border-t border-white/20 dark:border-gray-700/20" />
      
      {/* Navigation content */}
      <div className="relative z-10 px-5 py-4">
        <div className="flex items-center justify-between">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center justify-center min-w-0 flex-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {/* Active background */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl"
                    transition={{ duration: 0.3 }}
                  />
                )}
                
                {/* Icon container */}
                <motion.div
                  className={`relative z-10 p-3 rounded-2xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                  animate={isActive ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut"
                  }}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>

                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute bottom-1 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Safe area padding for modern phones */}
      <div className="h-safe-bottom" />
    </motion.div>
  );
};

export default MobileBottomNavigation;
