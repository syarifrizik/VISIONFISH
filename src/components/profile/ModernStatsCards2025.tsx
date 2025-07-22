
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfileStats } from '@/types/profile';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Users, 
  Heart, 
  Star, 
  Activity,
  TrendingUp,
  Award,
  Target,
  Zap,
  Fish,
  Camera,
  MessageCircle,
  Eye,
  Sparkles,
  Trophy
} from 'lucide-react';

interface ModernStatsCards2025Props {
  stats: ProfileStats;
  layout?: 'mobile' | 'desktop';
  isOwnProfile?: boolean;
}

const ModernStatsCards2025 = ({
  stats,
  layout = 'mobile',
  isOwnProfile = true
}: ModernStatsCards2025Props) => {
  const isMobile = useIsMobile();
  const [animatedStats, setAnimatedStats] = useState<ProfileStats>({
    total_catches: 0,
    total_posts: 0,
    followers_count: 0,
    following_count: 0
  });

  // Enhanced animated counter
  useEffect(() => {
    Object.keys(stats).forEach((key) => {
      let start = 0;
      const end = stats[key as keyof ProfileStats] || 0;
      const duration = 2500;
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
      label: 'Total Catches',
      value: animatedStats.total_catches,
      icon: Fish,
      color: 'from-amber-500 via-yellow-500 to-orange-500',
      bgColor: 'from-amber-50/90 via-yellow-50/80 to-orange-50/90 dark:from-amber-900/30 dark:via-yellow-900/20 dark:to-orange-900/30',
      glowColor: 'shadow-amber-500/30',
      description: 'Ikan yang berhasil ditangkap',
      trend: '+12%',
      emoji: '🐟',
      sparkleColor: 'text-amber-400'
    },
    {
      key: 'posts',
      label: 'Posts & Stories',
      value: animatedStats.total_posts,
      icon: Camera,
      color: 'from-emerald-500 via-green-500 to-teal-500',
      bgColor: 'from-emerald-50/90 via-green-50/80 to-teal-50/90 dark:from-emerald-900/30 dark:via-green-900/20 dark:to-teal-900/30',
      glowColor: 'shadow-emerald-500/30',
      description: 'Konten yang dibagikan',
      trend: '+8%',
      emoji: '📸',
      sparkleColor: 'text-emerald-400'
    },
    {
      key: 'followers',
      label: 'Followers',
      value: animatedStats.followers_count,
      icon: Users,
      color: 'from-blue-500 via-cyan-500 to-sky-500',
      bgColor: 'from-blue-50/90 via-cyan-50/80 to-sky-50/90 dark:from-blue-900/30 dark:via-cyan-900/20 dark:to-sky-900/30',
      glowColor: 'shadow-blue-500/30',
      description: 'Pengikut Anda',
      trend: '+25%',
      emoji: '👥',
      sparkleColor: 'text-blue-400'
    },
    {
      key: 'following',
      label: 'Following',
      value: animatedStats.following_count,
      icon: Heart,
      color: 'from-pink-500 via-rose-500 to-red-500',
      bgColor: 'from-pink-50/90 via-rose-50/80 to-red-50/90 dark:from-pink-900/30 dark:via-rose-900/20 dark:to-red-900/30',
      glowColor: 'shadow-pink-500/30',
      description: 'Akun yang Anda ikuti',
      trend: '+3%',
      emoji: '❤️',
      sparkleColor: 'text-pink-400'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <div className={`grid ${
        isMobile 
          ? 'grid-cols-2 gap-4' 
          : 'grid-cols-4 gap-6'
      }`}>
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.key}
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05,
              y: -8,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className={`overflow-hidden border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl ${
              isMobile ? 'shadow-xl hover:shadow-2xl' : 'shadow-2xl hover:shadow-3xl'
            } hover:${stat.glowColor} transition-all duration-500 group relative`}>
              <CardContent className={`p-${isMobile ? '4' : '6'} relative`}>
                
                {/* Enhanced Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-60 group-hover:opacity-80 transition-opacity duration-500`} />
                
                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-white/20 rounded-full"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-1 -left-1 w-4 h-4 bg-white/15 rounded-full"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Header with Enhanced Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-2xl relative overflow-hidden group-hover:shadow-3xl transition-all duration-300`}
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <stat.icon className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-white relative z-10`} />
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        animate={{ scale: [1, 1.2, 1], opacity: [0, 0.3, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      {/* Emoji overlay */}
                      <div className="absolute -top-1 -right-1 text-lg">{stat.emoji}</div>
                    </motion.div>
                    
                    {isOwnProfile && (
                      <motion.div 
                        className="flex items-center gap-1"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Badge
                          variant="outline"
                          className={`${
                            isMobile ? 'text-[10px] px-2 py-1' : 'text-xs px-3 py-1'
                          } bg-white/70 dark:bg-gray-800/70 border-white/50 dark:border-gray-700/50 backdrop-blur-sm font-bold text-green-600 dark:text-green-400 hover:bg-white dark:hover:bg-gray-700 transition-colors duration-200`}
                        >
                          <TrendingUp className="w-2 h-2 mr-1" />
                          {stat.trend}
                        </Badge>
                      </motion.div>
                    )}
                  </div>

                  {/* Enhanced Animated Value */}
                  <motion.div className="mb-3">
                    <motion.span
                      className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent relative`}
                      key={stat.value}
                      initial={{ scale: 1.2, opacity: 0.8 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, ease: "backOut" }}
                    >
                      {(stat.value || 0).toLocaleString()}
                      <motion.span
                        className={`absolute -top-1 -right-1 ${stat.sparkleColor}`}
                        animate={{ 
                          rotate: [0, 180, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="w-3 h-3" />
                      </motion.span>
                    </motion.span>
                  </motion.div>

                  {/* Enhanced Label */}
                  <p className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-gray-900 dark:text-white mb-2`}>
                    {stat.label}
                  </p>

                  {/* Enhanced Description */}
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400 leading-relaxed mb-3`}>
                    {stat.description}
                  </p>

                  {/* Enhanced Progress Bar for Desktop */}
                  {!isMobile && isOwnProfile && (
                    <motion.div
                      className="mt-4 pt-4 border-t border-gray-200/60 dark:border-gray-700/60"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-200/80 dark:bg-gray-700/80 rounded-full overflow-hidden backdrop-blur-sm">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${stat.color} rounded-full relative overflow-hidden`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((stat.value || 0) / 100 * 100, 100)}%` }}
                            transition={{ delay: 0.8 + index * 0.1, duration: 1.5, ease: "easeOut" }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-white/30"
                              animate={{ x: [-100, 200] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                          </motion.div>
                        </div>
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Trophy className="w-4 h-4 text-yellow-500" />
                        </motion.div>
                      </div>
                      
                      {/* Achievement Level */}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Level {Math.floor((stat.value || 0) / 10) + 1}
                        </span>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                          {Math.floor(((stat.value || 0) % 10) / 10 * 100)}% to next
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Mobile Achievement Indicator */}
                  {isMobile && isOwnProfile && (
                    <motion.div
                      className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3 text-blue-500" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Lvl {Math.floor((stat.value || 0) / 10) + 1}
                        </span>
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Award className="w-3 h-3 text-yellow-500" />
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Mobile Summary Card */}
      {isMobile && (
        <motion.div
          variants={cardVariants}
          className="mt-6"
        >
          <Card className="border-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500 group relative overflow-hidden">
            <CardContent className="p-5 relative">
              {/* Enhanced Background Effects */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10"
                animate={{
                  scale: [1, 1.02, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    Profile Strength
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Kekuatan profil Anda
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden max-w-[120px]">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ delay: 1, duration: 2, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">85%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Zap className="w-10 h-10 text-yellow-500" />
                  </motion.div>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Target className="w-8 h-8 text-purple-500" />
                  </motion.div>
                </div>
              </div>
              
              {/* Floating Sparkles */}
              <motion.div
                className="absolute top-2 right-2"
                animate={{ 
                  rotate: [0, 180, 360],
                  scale: [1, 1.3, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ModernStatsCards2025;
