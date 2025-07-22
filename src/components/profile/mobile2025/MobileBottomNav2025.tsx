
import { motion } from 'framer-motion';
import { 
  Activity, 
  BookOpen, 
  Users, 
  History, 
  User,
  Plus,
  Zap
} from 'lucide-react';

interface MobileBottomNav2025Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOwnProfile: boolean;
}

const MobileBottomNav2025 = ({ 
  activeTab, 
  onTabChange, 
  isOwnProfile 
}: MobileBottomNav2025Props) => {
  const tabs = [
    {
      id: 'aktivitas',
      icon: Activity,
      label: 'Aktivitas',
      gradient: 'from-cyan-400 to-blue-500'
    },
    {
      id: 'catatan',
      icon: BookOpen,
      label: 'Catatan',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      id: 'komunitas',
      icon: Users,
      label: 'Komunitas',
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      id: 'riwayat',
      icon: History,
      label: 'Riwayat',
      gradient: 'from-orange-400 to-red-500'
    },
    {
      id: 'pengguna',
      icon: User,
      label: 'Profil',
      gradient: 'from-indigo-400 to-purple-500'
    }
  ];

  return (
    <>
      {/* Floating Action Button */}
      {isOwnProfile && (
        <motion.button
          className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl shadow-2xl flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(6, 182, 212, 0.3)',
              '0 0 30px rgba(6, 182, 212, 0.5)',
              '0 0 20px rgba(6, 182, 212, 0.3)'
            ]
          }}
          transition={{
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }
          }}
        >
          <Plus className="w-6 h-6 text-white" />
        </motion.button>
      )}

      {/* Bottom Navigation */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-40"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Glassmorphism Background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent backdrop-blur-2xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <div className="relative z-10 px-4 pt-2 pb-6">
          <div className="flex items-center justify-around">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="relative flex flex-col items-center gap-1 py-2 px-3 min-w-0"
                  whileTap={{ scale: 0.9 }}
                  animate={isActive ? { y: -2 } : { y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Active Background */}
                  {isActive && (
                    <motion.div
                      className={`absolute -inset-2 bg-gradient-to-r ${tab.gradient}/20 backdrop-blur-xl rounded-2xl border border-white/20`}
                      layoutId="activeTab"
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  )}
                  
                  {/* Icon Container */}
                  <motion.div
                    className={`relative w-8 h-8 rounded-xl flex items-center justify-center ${
                      isActive 
                        ? `bg-gradient-to-r ${tab.gradient} shadow-lg` 
                        : 'bg-white/10'
                    }`}
                    animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <tab.icon 
                      className={`w-4 h-4 ${
                        isActive ? 'text-white' : 'text-white/60'
                      }`} 
                    />
                  </motion.div>
                  
                  {/* Label */}
                  <span 
                    className={`text-xs font-medium transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-white/60'
                    }`}
                  >
                    {tab.label}
                  </span>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      className={`absolute -bottom-1 w-1 h-1 bg-gradient-to-r ${tab.gradient} rounded-full`}
                      layoutId="activeIndicator"
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default MobileBottomNav2025;
