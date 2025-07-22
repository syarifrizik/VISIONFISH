
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Fish, 
  BookOpen, 
  Users, 
  Heart,
  TrendingUp,
  Award
} from 'lucide-react';

interface ProfileStats {
  total_catches: number;
  total_posts: number;
  followers_count: number;
  following_count: number;
}

interface OptimizedMobileProfileStatsProps {
  stats: ProfileStats;
  isOwnProfile?: boolean;
  onEditStats?: () => void;
}

const OptimizedMobileProfileStats = ({ 
  stats, 
  isOwnProfile = false,
  onEditStats
}: OptimizedMobileProfileStatsProps) => {
  const statsData = [
    {
      key: 'catches',
      value: stats.total_catches || 0,
      icon: Fish,
      color: 'from-cyan-400 to-blue-500',
      bgColor: 'bg-cyan-500/20'
    },
    {
      key: 'posts',
      value: stats.total_posts || 0,
      icon: BookOpen,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-500/20'
    },
    {
      key: 'followers',
      value: stats.followers_count || 0,
      icon: Users,
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-500/20'
    },
    {
      key: 'following',
      value: stats.following_count || 0,
      icon: Heart,
      color: 'from-red-400 to-rose-500',
      bgColor: 'bg-red-500/20'
    }
  ];

  return (
    <div className="px-4 mb-4">
      <div className="grid grid-cols-2 gap-3">
        {statsData.map((stat, index) => {
          const IconComponent = stat.icon;
          
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
              onClick={isOwnProfile && stat.key === 'catches' ? onEditStats : undefined}
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className={`w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                  whileHover={{ rotate: 5 }}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <motion.p 
                    className="text-2xl font-bold text-white leading-none mb-1"
                    animate={{ 
                      textShadow: [
                        '0 0 10px rgba(255, 255, 255, 0.3)',
                        '0 0 20px rgba(255, 255, 255, 0.5)',
                        '0 0 10px rgba(255, 255, 255, 0.3)'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {stat.value > 999 ? `${(stat.value / 1000).toFixed(1)}k` : stat.value}
                  </motion.p>
                  {stat.key === 'catches' && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-400 font-medium">+12%</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Achievement Badge */}
      {isOwnProfile && stats.total_catches > 50 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-3 border border-yellow-400/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-yellow-400">Master Angler</p>
              <p className="text-xs text-white/70">50+ tangkapan tercatat</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OptimizedMobileProfileStats;
