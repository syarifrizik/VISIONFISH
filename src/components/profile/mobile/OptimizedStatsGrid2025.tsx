
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { ProfileStats } from '@/types/profile';
import { Users, Heart, Star, Activity, TrendingUp } from 'lucide-react';

interface OptimizedStatsGrid2025Props {
  stats: ProfileStats;
  className?: string;
}

const OptimizedStatsGrid2025 = ({
  stats,
  className = ""
}: OptimizedStatsGrid2025Props) => {
  
  const statsData = useMemo(() => [
    {
      key: 'followers',
      value: stats.followers_count || 0,
      icon: Users,
      gradient: 'from-blue-400 via-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/20 via-blue-500/15 to-cyan-500/10',
      glowColor: 'shadow-blue-500/30',
      label: 'Pengikut'
    },
    {
      key: 'following',
      value: stats.following_count || 0,
      icon: Heart,
      gradient: 'from-pink-400 via-rose-500 to-red-500',
      bgGradient: 'from-pink-500/20 via-rose-500/15 to-red-500/10',
      glowColor: 'shadow-pink-500/30',
      label: 'Mengikuti'
    },
    {
      key: 'catches',
      value: stats.total_catches || 0,
      icon: Star,
      gradient: 'from-amber-400 via-yellow-500 to-orange-500',
      bgGradient: 'from-amber-500/20 via-yellow-500/15 to-orange-500/10',
      glowColor: 'shadow-amber-500/30',
      label: 'Tangkapan'
    },
    {
      key: 'posts',
      value: stats.total_posts || 0,
      icon: Activity,
      gradient: 'from-emerald-400 via-green-500 to-teal-500',
      bgGradient: 'from-emerald-500/20 via-green-500/15 to-teal-500/10',
      glowColor: 'shadow-emerald-500/30',
      label: 'Postingan'
    }
  ], [stats]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
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
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid grid-cols-2 gap-3 ${className}`}
    >
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.key}
          variants={itemVariants}
          className="relative group overflow-hidden"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Enhanced Glassmorphism Card */}
          <div className="relative aspect-square rounded-2xl overflow-hidden">
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient}`} />
            
            {/* Glass Effect */}
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl" />
            
            {/* Border */}
            <div className="absolute inset-0 rounded-2xl border border-white/40 dark:border-gray-700/40" />
            
            {/* Hover Glow Effect */}
            <motion.div
              className={`absolute inset-0 rounded-2xl ${stat.glowColor} opacity-0 group-hover:opacity-40 blur-lg transition-opacity duration-300`}
            />

            {/* Content */}
            <div className="relative z-10 p-4 h-full flex flex-col items-center justify-center text-center">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>

              {/* Value with Counter Animation */}
              <motion.p 
                className="text-xl font-bold text-gray-900 dark:text-white leading-none mb-1"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 + (index * 0.05) }}
              >
                {stat.value.toLocaleString()}
              </motion.p>

              {/* Label */}
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-2">
                {stat.label}
              </p>

              {/* Trend Indicator */}
              <div className="flex items-center">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-[10px] text-green-500 font-medium">+5%</span>
              </div>
            </div>

            {/* Floating Particle */}
            <motion.div
              className="absolute top-2 right-2 w-1 h-1 bg-white/40 rounded-full"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default OptimizedStatsGrid2025;
