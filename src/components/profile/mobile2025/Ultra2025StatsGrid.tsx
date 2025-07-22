
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { ProfileStats } from '@/types/profile';
import { 
  Users, 
  Heart, 
  Fish, 
  BookOpen, 
  TrendingUp, 
  Award,
  Target,
  Clock,
  Zap,
  Star,
  Trophy,
  Activity
} from 'lucide-react';

interface Ultra2025StatsGridProps {
  stats: ProfileStats;
  isOwnProfile: boolean;
}

const Ultra2025StatsGrid = ({ stats, isOwnProfile }: Ultra2025StatsGridProps) => {
  const statsData = useMemo(() => [
    {
      key: 'catches',
      value: stats.total_catches || 0,
      icon: Fish,
      label: 'Tangkapan',
      gradient: 'from-cyan-400 via-blue-500 to-teal-500',
      bgGradient: 'from-cyan-500/30 to-blue-500/20',
      trend: '+12%',
      description: 'Total ikan',
      accentColor: 'cyan'
    },
    {
      key: 'posts',
      value: stats.total_posts || 0,
      icon: BookOpen,
      label: 'Postingan',
      gradient: 'from-green-400 via-emerald-500 to-teal-500',
      bgGradient: 'from-green-500/30 to-emerald-500/20',
      trend: '+8%',
      description: 'Cerita & tips',
      accentColor: 'emerald'
    },
    {
      key: 'followers',
      value: stats.followers_count || 0,
      icon: Users,
      label: 'Pengikut',
      gradient: 'from-purple-400 via-pink-500 to-rose-500',
      bgGradient: 'from-purple-500/30 to-pink-500/20',
      trend: '+25%',
      description: 'Total pengikut',
      accentColor: 'purple'
    },
    {
      key: 'following',
      value: stats.following_count || 0,
      icon: Heart,
      label: 'Mengikuti',
      gradient: 'from-orange-400 via-red-500 to-pink-500',
      bgGradient: 'from-orange-500/30 to-red-500/20',
      trend: '+5%',
      description: 'Yang diikuti',
      accentColor: 'red'
    }
  ], [stats]);

  const achievementStats = useMemo(() => [
    {
      key: 'level',
      value: 15,
      icon: Award,
      label: 'Level',
      gradient: 'from-yellow-400 via-amber-500 to-orange-500',
      description: 'Master Angler',
      glow: 'yellow'
    },
    {
      key: 'streak',
      value: 7,
      icon: Target,
      label: 'Streak',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
      description: 'Hari beruntun',
      glow: 'emerald'
    },
    {
      key: 'hours',
      value: 124,
      icon: Clock,
      label: 'Jam',
      gradient: 'from-indigo-400 via-purple-500 to-pink-500',
      description: 'Total memancing',
      glow: 'indigo'
    }
  ], []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <div className="px-4 pb-6">
      {/* Main Ultra Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3 mb-6"
      >
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.key}
            variants={itemVariants}
            className="relative group"
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Ultra Modern Bento Card */}
            <div className="relative h-32 rounded-3xl overflow-hidden">
              {/* Multi-layer Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient}`} />
              <div className="absolute inset-0 bg-white/15 backdrop-blur-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5" />
              
              {/* Dynamic Border with Glow */}
              <motion.div 
                className="absolute inset-0 border border-white/30 rounded-3xl"
                animate={{
                  boxShadow: [
                    `0 0 20px rgba(${stat.accentColor === 'cyan' ? '34, 211, 238' : 
                                    stat.accentColor === 'emerald' ? '16, 185, 129' :
                                    stat.accentColor === 'purple' ? '168, 85, 247' :
                                    '239, 68, 68'}, 0.3)`,
                    `0 0 40px rgba(${stat.accentColor === 'cyan' ? '34, 211, 238' : 
                                    stat.accentColor === 'emerald' ? '16, 185, 129' :
                                    stat.accentColor === 'purple' ? '168, 85, 247' :
                                    '239, 68, 68'}, 0.5)`,
                    `0 0 20px rgba(${stat.accentColor === 'cyan' ? '34, 211, 238' : 
                                    stat.accentColor === 'emerald' ? '16, 185, 129' :
                                    stat.accentColor === 'purple' ? '168, 85, 247' :
                                    '239, 68, 68'}, 0.3)`
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
              />
              
              {/* Hover Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />

              {/* Content */}
              <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <motion.div 
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-2xl`}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(255, 255, 255, 0.3)',
                        '0 0 30px rgba(255, 255, 255, 0.4)',
                        '0 0 20px rgba(255, 255, 255, 0.3)'
                      ]
                    }}
                    transition={{ 
                      boxShadow: { duration: 2, repeat: Infinity },
                      hover: { duration: 0.2 }
                    }}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-400/30 backdrop-blur-xl rounded-full border border-green-400/40"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400 font-bold">{stat.trend}</span>
                  </motion.div>
                </div>

                <div>
                  <motion.div 
                    className="text-3xl font-black text-white mb-1 leading-none"
                    animate={{ 
                      textShadow: [
                        '0 0 10px rgba(255, 255, 255, 0.5)',
                        '0 0 20px rgba(255, 255, 255, 0.7)',
                        '0 0 10px rgba(255, 255, 255, 0.5)'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {stat.value.toLocaleString()}
                  </motion.div>
                  <div className="text-xs text-white/90 font-semibold mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-white/60 leading-tight">
                    {stat.description}
                  </div>
                </div>
              </div>

              {/* Sparkle Effect */}
              <motion.div
                className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full"
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Ultra Achievement Stats */}
      {isOwnProfile && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-2"
        >
          {achievementStats.map((stat, index) => (
            <motion.div
              key={stat.key}
              variants={itemVariants}
              className="relative group"
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative h-24 rounded-2xl overflow-hidden">
                {/* Ultra Background */}
                <div className="absolute inset-0 bg-white/15 backdrop-blur-2xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-white/10" />
                
                {/* Glow Border */}
                <motion.div 
                  className="absolute inset-0 border border-white/40 rounded-2xl"
                  animate={{
                    boxShadow: [
                      `0 0 15px rgba(${stat.glow === 'yellow' ? '251, 191, 36' : 
                                      stat.glow === 'emerald' ? '16, 185, 129' :
                                      '99, 102, 241'}, 0.4)`,
                      `0 0 25px rgba(${stat.glow === 'yellow' ? '251, 191, 36' : 
                                      stat.glow === 'emerald' ? '16, 185, 129' :
                                      '99, 102, 241'}, 0.6)`,
                      `0 0 15px rgba(${stat.glow === 'yellow' ? '251, 191, 36' : 
                                      stat.glow === 'emerald' ? '16, 185, 129' :
                                      '99, 102, 241'}, 0.4)`
                    ]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.4 }}
                />
                
                {/* Content */}
                <div className="relative z-10 p-3 h-full flex flex-col items-center justify-center text-center">
                  <motion.div 
                    className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center mb-2 shadow-xl`}
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    animate={{
                      boxShadow: [
                        '0 0 15px rgba(255, 255, 255, 0.4)',
                        '0 0 25px rgba(255, 255, 255, 0.6)',
                        '0 0 15px rgba(255, 255, 255, 0.4)'
                      ]
                    }}
                    transition={{ 
                      boxShadow: { duration: 2, repeat: Infinity },
                      hover: { duration: 0.2 }
                    }}
                  >
                    <stat.icon className="w-5 h-5 text-white" />
                  </motion.div>
                  
                  <motion.div 
                    className="text-xl font-black text-white leading-none mb-1"
                    animate={{
                      textShadow: [
                        '0 0 10px rgba(255, 255, 255, 0.6)',
                        '0 0 15px rgba(255, 255, 255, 0.8)',
                        '0 0 10px rgba(255, 255, 255, 0.6)'
                      ]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-xs text-white/90 font-bold leading-none mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-white/70 leading-tight">
                    {stat.description}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Ultra2025StatsGrid;
