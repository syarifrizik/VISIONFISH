
import { motion } from 'framer-motion';
import { 
  Activity, 
  BookOpen, 
  Users, 
  History, 
  User,
  Zap,
  Sparkles,
  Target
} from 'lucide-react';

interface Ultra2025BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOwnProfile: boolean;
}

const Ultra2025BottomNav = ({ 
  activeTab, 
  onTabChange, 
  isOwnProfile 
}: Ultra2025BottomNavProps) => {
  const tabs = [
    { 
      id: 'aktivitas', 
      icon: Activity, 
      label: 'Aktivitas',
      gradient: 'from-cyan-400 to-blue-500',
      glow: 'cyan'
    },
    { 
      id: 'catatan', 
      icon: BookOpen, 
      label: 'Catatan',
      gradient: 'from-green-400 to-emerald-500',
      glow: 'emerald'
    },
    { 
      id: 'komunitas', 
      icon: Users, 
      label: 'Komunitas',
      gradient: 'from-purple-400 to-pink-500',
      glow: 'purple'
    },
    { 
      id: 'riwayat', 
      icon: History, 
      label: 'Riwayat',
      gradient: 'from-orange-400 to-red-500',
      glow: 'orange'
    },
    { 
      id: 'pengguna', 
      icon: User, 
      label: 'Pengguna',
      gradient: 'from-indigo-400 to-purple-500',
      glow: 'indigo'
    }
  ];

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Ultra Glassmorphism Background */}
      <div className="mx-4 mb-4 relative">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-2xl rounded-3xl" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-3xl" />
        <motion.div 
          className="absolute inset-0 border border-white/20 rounded-3xl"
          animate={{
            boxShadow: [
              '0 0 30px rgba(255, 255, 255, 0.1)',
              '0 0 50px rgba(255, 255, 255, 0.15)',
              '0 0 30px rgba(255, 255, 255, 0.1)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* Navigation Content */}
        <div className="relative z-10 flex items-center justify-around px-2 py-3">
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onFocus={() => onTabChange(tab.id)}
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center justify-center p-3 rounded-2xl min-w-[60px]"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                animate={isActive ? { y: -5 } : { y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Active Background */}
                {isActive && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${tab.gradient}/30 backdrop-blur-xl rounded-2xl border border-white/30`}
                    layoutId="activeTab"
                    animate={{
                      boxShadow: [
                        `0 0 20px rgba(${tab.glow === 'cyan' ? '34, 211, 238' :
                                        tab.glow === 'emerald' ? '16, 185, 129' :
                                        tab.glow === 'purple' ? '168, 85, 247' :
                                        tab.glow === 'orange' ? '249, 115, 22' :
                                        '99, 102, 241'}, 0.4)`,
                        `0 0 40px rgba(${tab.glow === 'cyan' ? '34, 211, 238' :
                                        tab.glow === 'emerald' ? '16, 185, 129' :
                                        tab.glow === 'purple' ? '168, 85, 247' :
                                        tab.glow === 'orange' ? '249, 115, 22' :
                                        '99, 102, 241'}, 0.6)`,
                        `0 0 20px rgba(${tab.glow === 'cyan' ? '34, 211, 238' :
                                        tab.glow === 'emerald' ? '16, 185, 129' :
                                        tab.glow === 'purple' ? '168, 85, 247' :
                                        tab.glow === 'orange' ? '249, 115, 22' :
                                        '99, 102, 241'}, 0.4)`
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                
                {/* Icon Container */}
                <motion.div
                  className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-xl mb-1 ${
                    isActive 
                      ? `bg-gradient-to-r ${tab.gradient} shadow-xl` 
                      : 'bg-white/20 backdrop-blur-sm'
                  }`}
                  animate={isActive ? {
                    boxShadow: [
                      '0 0 15px rgba(255, 255, 255, 0.5)',
                      '0 0 25px rgba(255, 255, 255, 0.7)',
                      '0 0 15px rgba(255, 255, 255, 0.5)'
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <tab.icon 
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-white/70'
                    }`} 
                  />
                  
                  {/* Active Sparkle */}
                  {isActive && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2"
                      animate={{
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: index * 0.2
                      }}
                    >
                      <Sparkles className="w-2 h-2 text-yellow-400" />
                    </motion.div>
                  )}
                </motion.div>
                
                {/* Label */}
                <motion.span
                  className={`text-xs font-semibold ${
                    isActive 
                      ? 'text-white' 
                      : 'text-white/60'
                  }`}
                  animate={isActive ? {
                    textShadow: [
                      '0 0 10px rgba(255, 255, 255, 0.8)',
                      '0 0 20px rgba(255, 255, 255, 1)',
                      '0 0 10px rgba(255, 255, 255, 0.8)'
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {tab.label}
                </motion.span>
                
                {/* Active Indicator Dot */}
                {isActive && (
                  <motion.div
                    className={`absolute -bottom-1 w-1 h-1 bg-gradient-to-r ${tab.gradient} rounded-full`}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.7, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
        
        {/* Center Floating Action Button */}
        <motion.div
          className="absolute -top-6 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.button
            className="w-14 h-14 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            animate={{
              boxShadow: [
                '0 0 30px rgba(34, 211, 238, 0.6)',
                '0 0 50px rgba(168, 85, 247, 0.8)',
                '0 0 30px rgba(34, 211, 238, 0.6)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Target className="w-6 h-6 text-white" />
            
            {/* Ripple Effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/30"
              animate={{
                scale: [1, 1.5, 2],
                opacity: [0.8, 0.4, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Ultra2025BottomNav;
