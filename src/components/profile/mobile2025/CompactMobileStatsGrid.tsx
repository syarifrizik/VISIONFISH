
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { ProfileStats } from '@/types/profile';
import { 
  Users, 
  Heart, 
  Fish, 
  BookOpen, 
  TrendingUp
} from 'lucide-react';

interface CompactMobileStatsGridProps {
  stats: ProfileStats;
  isOwnProfile: boolean;
}

const CompactMobileStatsGrid = ({ stats, isOwnProfile }: CompactMobileStatsGridProps) => {
  const statsData = useMemo(() => [
    {
      key: 'catches',
      value: stats.total_catches || 0,
      icon: Fish,
      label: 'Tangkapan',
      gradient: 'from-cyan-400 to-blue-500',
      bgGradient: 'from-cyan-500/15 to-blue-500/10'
    },
    {
      key: 'posts',
      value: stats.total_posts || 0,
      icon: BookOpen,
      label: 'Postingan',
      gradient: 'from-green-400 to-emerald-500',
      bgGradient: 'from-green-500/15 to-emerald-500/10'
    },
    {
      key: 'followers',
      value: stats.followers_count || 0,
      icon: Users,
      label: 'Pengikut',
      gradient: 'from-purple-400 to-pink-500',
      bgGradient: 'from-purple-500/15 to-pink-500/10'
    },
    {
      key: 'following',
      value: stats.following_count || 0,
      icon: Heart,
      label: 'Mengikuti',
      gradient: 'from-orange-400 to-red-500',
      bgGradient: 'from-orange-500/15 to-red-500/10'
    }
  ], [stats]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <div className="px-4 pb-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-2"
      >
        {statsData.map((stat) => (
          <motion.div
            key={stat.key}
            variants={itemVariants}
            className="relative group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative h-20 rounded-2xl overflow-hidden">
              {/* Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient}`} />
              <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl" />
              <div className="absolute inset-0 border border-white/30 dark:border-gray-700/30 rounded-2xl" />

              {/* Content */}
              <div className="relative z-10 p-3 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className={`w-7 h-7 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-md`}>
                    <stat.icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-400/20 rounded-full">
                    <TrendingUp className="w-2.5 h-2.5 text-green-400" />
                    <span className="text-xs text-green-400 font-medium">+5%</span>
                  </div>
                </div>

                <div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white mb-0.5">
                    {stat.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CompactMobileStatsGrid;
