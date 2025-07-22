
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ProfileStats } from '@/types/profile';
import { 
  Fish,
  MessageCircle,
  Users,
  Heart,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface MobileStatsGridProps {
  stats: ProfileStats;
  isOwnProfile?: boolean;
}

const MobileStatsGrid = ({
  stats,
  isOwnProfile = true
}: MobileStatsGridProps) => {
  const [animatedStats, setAnimatedStats] = useState<ProfileStats>({
    total_catches: 0,
    total_posts: 0,
    followers_count: 0,
    following_count: 0
  });

  useEffect(() => {
    Object.keys(stats).forEach((key) => {
      let start = 0;
      const end = stats[key as keyof ProfileStats] || 0;
      const duration = 1500;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setAnimatedStats(prev => ({ ...prev, [key]: end }));
          clearInterval(timer);
        } else {
          setAnimatedStats(prev => ({ ...prev, [key]: Math.floor(start) }));
        }
      }, 16);
    });
  }, [stats]);

  const statsData = [
    {
      key: 'catches',
      value: animatedStats.total_catches,
      icon: Fish,
      gradient: 'from-amber-400 via-orange-400 to-red-400',
      bgGradient: 'from-amber-500/20 via-orange-500/15 to-red-500/10',
      glowColor: 'shadow-amber-500/30'
    },
    {
      key: 'posts',
      value: animatedStats.total_posts,
      icon: MessageCircle,
      gradient: 'from-emerald-400 via-teal-400 to-cyan-400',
      bgGradient: 'from-emerald-500/20 via-teal-500/15 to-cyan-500/10',
      glowColor: 'shadow-emerald-500/30'
    },
    {
      key: 'followers',
      value: animatedStats.followers_count,
      icon: Users,
      gradient: 'from-blue-400 via-indigo-400 to-purple-400',
      bgGradient: 'from-blue-500/20 via-indigo-500/15 to-purple-500/10',
      glowColor: 'shadow-blue-500/30'
    },
    {
      key: 'following',
      value: animatedStats.following_count,
      icon: Heart,
      gradient: 'from-pink-400 via-rose-400 to-red-400',
      bgGradient: 'from-pink-500/20 via-rose-500/15 to-red-500/10',
      glowColor: 'shadow-pink-500/30'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
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
      className="grid grid-cols-4 gap-2.5 p-4"
    >
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.key}
          variants={itemVariants}
          className="relative group"
        >
          {/* Main Card */}
          <motion.div
            className="relative overflow-hidden rounded-2xl aspect-square"
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.1 }}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient}`} />
            
            {/* Glass Effect */}
            <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl" />
            
            {/* Border */}
            <div className="absolute inset-0 rounded-2xl border border-white/40 dark:border-gray-700/40" />
            
            {/* Glow Effect on Hover */}
            <motion.div
              className={`absolute inset-0 rounded-2xl ${stat.glowColor} opacity-0 group-hover:opacity-50 blur-xl`}
              transition={{ duration: 0.3 }}
            />

            {/* Content */}
            <div className="relative z-10 p-3 h-full flex flex-col items-center justify-center">
              {/* Icon */}
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg mb-2`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>

              {/* Value */}
              <motion.p 
                className="text-lg font-bold text-gray-900 dark:text-white leading-none"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + (index * 0.05) }}
              >
                {stat.value?.toLocaleString() || 0}
              </motion.p>

              {/* Trend Indicator */}
              <div className="flex items-center mt-1">
                <TrendingUp className="w-2.5 h-2.5 text-green-500" />
                <span className="text-[9px] text-green-500 font-medium ml-0.5">+8%</span>
              </div>
            </div>

            {/* Floating Particle */}
            <motion.div
              className="absolute top-1.5 right-1.5 w-1 h-1 bg-white/30 rounded-full"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: index * 0.3
              }}
            />
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MobileStatsGrid;
