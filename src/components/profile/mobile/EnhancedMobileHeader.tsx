
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserProfile, ProfileStats } from '@/types/profile';
import { 
  Crown, 
  MapPin, 
  Users, 
  Heart, 
  Star, 
  Activity,
  Camera,
  Share,
  MoreVertical
} from 'lucide-react';

interface EnhancedMobileHeaderProps {
  user: UserProfile;
  stats: ProfileStats;
  isPremium?: boolean;
  onStatsUpdate?: (stats: ProfileStats) => void;
}

const EnhancedMobileHeader = ({
  user,
  stats,
  isPremium = false,
  onStatsUpdate
}: EnhancedMobileHeaderProps) => {
  const [showActions, setShowActions] = useState(false);
  const [avatarPressed, setAvatarPressed] = useState(false);

  const quickStats = [
    { 
      icon: Users, 
      value: stats.followers_count, 
      label: 'Followers', 
      gradient: 'from-blue-400 to-cyan-400',
      delay: 0.1
    },
    { 
      icon: Heart, 
      value: stats.following_count, 
      label: 'Following', 
      gradient: 'from-pink-400 to-rose-400',
      delay: 0.15
    },
    { 
      icon: Star, 
      value: stats.total_catches, 
      label: 'Catches', 
      gradient: 'from-yellow-400 to-orange-400',
      delay: 0.2
    },
    { 
      icon: Activity, 
      value: stats.total_posts, 
      label: 'Posts', 
      gradient: 'from-green-400 to-emerald-400',
      delay: 0.25
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="relative mx-4 mt-6 mb-8"
    >
      {/* Floating Card Container */}
      <div className="relative">
        {/* Enhanced Glassmorphism Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/20 to-white/10 dark:from-gray-900/40 dark:via-gray-900/30 dark:to-gray-900/20 backdrop-blur-2xl rounded-3xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/3 to-pink-500/5 rounded-3xl" />
        <div className="absolute inset-0 border border-white/20 dark:border-gray-700/30 rounded-3xl" />
        
        {/* Floating Particles */}
        <div className="absolute top-4 right-6 w-2 h-2 bg-cyan-400/60 rounded-full animate-pulse" />
        <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-purple-400/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 p-6 space-y-6">
          {/* Header Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <motion.button
              className="w-10 h-10 bg-white/20 dark:bg-gray-800/30 backdrop-blur-xl border border-white/30 dark:border-gray-700/40 rounded-2xl flex items-center justify-center"
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowActions(!showActions)}
            >
              <MoreVertical className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </motion.button>
            
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 10 }}
                  className="flex gap-2"
                >
                  <motion.button
                    className="w-10 h-10 bg-white/20 dark:bg-gray-800/30 backdrop-blur-xl border border-white/30 dark:border-gray-700/40 rounded-2xl flex items-center justify-center"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Enhanced Avatar Section */}
          <div className="flex items-start space-x-4">
            <motion.div
              className="relative"
              onTapStart={() => setAvatarPressed(true)}
              onTap={() => setAvatarPressed(false)}
              onTapCancel={() => setAvatarPressed(false)}
              animate={{ 
                scale: avatarPressed ? 0.95 : 1,
                rotate: avatarPressed ? -2 : 0
              }}
              transition={{ duration: 0.2 }}
            >
              {/* Avatar Glow Ring */}
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/30 via-blue-500/20 to-purple-500/30 rounded-full blur-lg" />
              
              <Avatar className="w-24 h-24 ring-4 ring-white/40 dark:ring-gray-700/40 shadow-2xl relative z-10">
                <AvatarImage src={user.avatar_url || '/placeholder.svg'} alt={user.display_name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl font-bold">
                  {user.display_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              {/* Enhanced Online Status */}
              <motion.div
                className="absolute bottom-1 right-1 w-6 h-6 bg-green-400 border-4 border-white dark:border-gray-900 rounded-full shadow-lg"
                animate={{ 
                  boxShadow: [
                    '0 0 0 0 rgba(34, 197, 94, 0.4)', 
                    '0 0 0 8px rgba(34, 197, 94, 0)', 
                    '0 0 0 0 rgba(34, 197, 94, 0)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Premium Crown */}
              {isPremium && (
                <motion.div 
                  className="absolute -top-2 -right-2"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Crown className="w-8 h-8 text-yellow-400 drop-shadow-lg" fill="currentColor" />
                </motion.div>
              )}

              {/* Camera Button */}
              <motion.button
                className="absolute bottom-1 left-1 w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </motion.button>
            </motion.div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0 pt-2">
              <motion.h1 
                className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent truncate"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {user.display_name || user.username}
              </motion.h1>
              
              <motion.p 
                className="text-gray-600 dark:text-gray-400 font-medium"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                @{user.username}
              </motion.p>
              
              {user.location && (
                <motion.div 
                  className="flex items-center gap-1 mt-2 text-sm text-gray-500 dark:text-gray-500"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{user.location}</span>
                </motion.div>
              )}

              {isPremium && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45 }}
                  className="mt-3"
                >
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 shadow-lg">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                </motion.div>
              )}
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/40 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 border border-white/30 dark:border-gray-700/30"
            >
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                {user.bio}
              </p>
            </motion.div>
          )}

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-4 gap-3">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="relative group"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.5,
                  delay: stat.delay,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Glassmorphism Background */}
                <div className="absolute inset-0 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-gray-700/30" />
                
                {/* Hover Glow */}
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                
                <div className="relative z-10 p-3 text-center">
                  <div className={`w-8 h-8 mx-auto mb-2 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                  
                  <motion.p 
                    className="text-lg font-bold text-gray-900 dark:text-white"
                    animate={{ 
                      scale: [1, 1.1, 1] 
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: stat.delay + 1
                    }}
                  >
                    {stat.value?.toLocaleString() || 0}
                  </motion.p>
                  
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Shadow */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-6 bg-black/10 dark:bg-black/20 blur-xl rounded-full" />
      </div>
    </motion.div>
  );
};

export default EnhancedMobileHeader;
