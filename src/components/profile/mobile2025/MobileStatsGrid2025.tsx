
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { ProfileStats } from '@/types/profile';
import { Users, Heart, Fish, BookOpen, TrendingUp, Award, Target, Clock, Crown } from 'lucide-react';

interface MobileStatsGrid2025Props {
  stats: ProfileStats;
  isOwnProfile: boolean;
  isPremium?: boolean;
}

const MobileStatsGrid2025 = ({
  stats,
  isOwnProfile,
  isPremium = false
}: MobileStatsGrid2025Props) => {
  const statsData = useMemo(() => [
    {
      key: 'catches',
      value: stats.total_catches || 0,
      icon: Fish,
      label: 'Tangkapan',
      gradient: 'from-cyan-400 to-blue-500',
      bgGradient: 'from-cyan-500/20 to-blue-500/10',
      trend: '+12%',
      description: 'Total ikan'
    },
    {
      key: 'posts',
      value: stats.total_posts || 0,
      icon: BookOpen,
      label: 'Postingan',
      gradient: 'from-green-400 to-emerald-500',
      bgGradient: 'from-green-500/20 to-emerald-500/10',
      trend: '+8%',
      description: 'Cerita & tips'
    },
    {
      key: 'followers',
      value: stats.followers_count || 0,
      icon: Users,
      label: 'Pengikut',
      gradient: 'from-purple-400 to-pink-500',
      bgGradient: 'from-purple-500/20 to-pink-500/10',
      trend: '+25%',
      description: 'Total pengikut'
    },
    {
      key: 'following',
      value: stats.following_count || 0,
      icon: Heart,
      label: 'Mengikuti',
      gradient: 'from-orange-400 to-red-500',
      bgGradient: 'from-orange-500/20 to-red-500/10',
      trend: '+5%',
      description: 'Yang diikuti'
    }
  ], [stats]);

  // Additional achievement stats for own profile with premium access
  const achievementStats = useMemo(() => [
    {
      key: 'level',
      value: isPremium ? 15 : 5,
      icon: Award,
      label: 'Level',
      gradient: 'from-yellow-400 to-amber-500',
      description: isPremium ? 'Master Angler' : 'Novice Angler',
      isPremium: true
    },
    {
      key: 'streak',
      value: isPremium ? 7 : 3,
      icon: Target,
      label: 'Streak',
      gradient: 'from-emerald-400 to-teal-500',
      description: 'Hari beruntun',
      isPremium: true
    },
    {
      key: 'hours',
      value: isPremium ? 124 : 24,
      icon: Clock,
      label: 'Jam',
      gradient: 'from-indigo-400 to-purple-500',
      description: 'Total memancing',
      isPremium: true
    }
  ], [isPremium]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <div className="px-6 pb-6">
      {/* Main Stats Grid */}
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible" 
        className="grid grid-cols-2 gap-4 mb-6 mt-4"
      >
        {statsData.map(stat => (
          <motion.div 
            key={stat.key} 
            variants={itemVariants} 
            className="relative group" 
            whileHover={{ scale: 1.02, y: -2 }} 
            whileTap={{ scale: 0.98 }}
          >
            {/* Glassmorphism Card */}
            <div className="relative h-28 rounded-3xl overflow-hidden">
              {/* Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient}`} />
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl" />
              <div className="absolute inset-0 border border-white/20 rounded-3xl" />
              
              {/* Hover Effect */}
              <motion.div className="absolute inset-0 bg-white/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-400/20 rounded-full">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-green-400 font-medium">{stat.trend}</span>
                  </div>
                </div>

                <div>
                  <div className="text-2xl font-bold text-white mb-0.5">
                    {stat.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/60 mb-1">{stat.label}</div>
                  <div className="text-xs text-white/50">{stat.description}</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Achievement Stats for Own Profile */}
      {isOwnProfile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-white">Achievement Stats</h3>
            {isPremium && <Crown className="w-5 h-5 text-yellow-400" />}
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {achievementStats.map((stat, index) => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="relative group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative h-24 rounded-2xl overflow-hidden">
                  {/* Background with premium glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient}/20`} />
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-xl" />
                  <div className={`absolute inset-0 border rounded-2xl ${
                    isPremium ? 'border-yellow-400/40' : 'border-white/20'
                  }`} />
                  
                  {/* Premium glow effect */}
                  {isPremium && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-2xl"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  {/* Content */}
                  <div className="relative z-10 p-3 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg`}>
                        <stat.icon className="w-4 h-4 text-white" />
                      </div>
                      {isPremium && <Crown className="w-3 h-3 text-yellow-400" />}
                    </div>

                    <div>
                      <div className="text-xl font-bold text-white mb-0.5">
                        {stat.value}
                      </div>
                      <div className="text-xs text-white/60 mb-1">{stat.label}</div>
                      <div className="text-xs text-white/50 truncate">{stat.description}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MobileStatsGrid2025;
