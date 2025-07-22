
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
  Settings,
  Verified
} from 'lucide-react';

interface Revolutionary2025HeaderProps {
  user: UserProfile;
  stats: ProfileStats;
  isPremium?: boolean;
  onStatsUpdate?: (stats: ProfileStats) => void;
}

const Revolutionary2025Header = ({
  user,
  stats,
  isPremium = false,
  onStatsUpdate
}: Revolutionary2025HeaderProps) => {
  const [isOnline] = useState(true);

  const statsData = [
    { 
      icon: Users, 
      value: stats.followers_count, 
      label: 'Pengikut', 
      gradient: 'from-blue-400 to-cyan-400',
      delay: 0.1
    },
    { 
      icon: Heart, 
      value: stats.following_count, 
      label: 'Mengikuti', 
      gradient: 'from-pink-400 to-rose-400',
      delay: 0.15
    },
    { 
      icon: Star, 
      value: stats.total_catches, 
      label: 'Tangkapan', 
      gradient: 'from-yellow-400 to-orange-400',
      delay: 0.2
    },
    { 
      icon: Activity, 
      value: stats.total_posts, 
      label: 'Postingan', 
      gradient: 'from-green-400 to-emerald-400',
      delay: 0.25
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative mx-4 mt-6 mb-6"
    >
      {/* Floating Glassmorphism Container */}
      <div className="relative overflow-hidden">
        {/* Enhanced Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/25 to-white/15 dark:from-gray-900/60 dark:via-gray-900/40 dark:to-gray-900/25 backdrop-blur-2xl rounded-3xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-purple-500/5 to-pink-500/8 rounded-3xl" />
        <div className="absolute inset-0 border border-white/30 dark:border-gray-700/40 rounded-3xl" />
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-purple-400/5 to-pink-400/10 rounded-3xl blur-xl" />

        <div className="relative z-10 p-6">
          {/* Header Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <motion.button
              className="w-10 h-10 bg-white/25 dark:bg-gray-800/40 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-2xl flex items-center justify-center"
              whileTap={{ scale: 0.9 }}
            >
              <Share className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </motion.button>
            <motion.button
              className="w-10 h-10 bg-white/25 dark:bg-gray-800/40 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-2xl flex items-center justify-center"
              whileTap={{ scale: 0.9 }}
            >
              <Settings className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </motion.button>
          </div>

          {/* Profile Section */}
          <div className="flex items-start space-x-4 mb-6">
            <motion.div
              className="relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Avatar Glow Ring */}
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400/40 via-blue-500/30 to-purple-500/40 rounded-full blur-lg" />
              
              <Avatar className="w-20 h-20 ring-4 ring-white/50 dark:ring-gray-700/50 shadow-2xl relative z-10">
                <AvatarImage src={user.avatar_url || '/placeholder.svg'} alt={user.display_name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-bold">
                  {user.display_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              {/* Online Status with Pulse */}
              <motion.div
                className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 border-3 border-white dark:border-gray-900 rounded-full shadow-lg"
                animate={{ 
                  boxShadow: isOnline ? [
                    '0 0 0 0 rgba(34, 197, 94, 0.4)', 
                    '0 0 0 6px rgba(34, 197, 94, 0)', 
                    '0 0 0 0 rgba(34, 197, 94, 0)'
                  ] : undefined
                }}
                transition={{ duration: 2, repeat: isOnline ? Infinity : 0 }}
              />
              
              {/* Premium Crown */}
              {isPremium && (
                <motion.div 
                  className="absolute -top-1 -right-1"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Crown className="w-6 h-6 text-yellow-400 drop-shadow-lg" fill="currentColor" />
                </motion.div>
              )}

              {/* Camera Button */}
              <motion.button
                className="absolute bottom-0 left-0 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Camera className="w-3 h-3 text-white" />
              </motion.button>
            </motion.div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0 pt-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent truncate">
                    {user.display_name || user.username}
                  </h1>
                  {isPremium && <Verified className="w-4 h-4 text-blue-500" fill="currentColor" />}
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">
                  @{user.username}
                </p>
                
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {user.location}
                    </span>
                  </div>
                )}
              </motion.div>

              {isPremium && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-2"
                >
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 shadow-lg text-xs">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                </motion.div>
              )}
            </div>
          </div>

          {/* Bio Section */}
          {user.bio && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/50 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl p-3 mb-6 border border-white/40 dark:border-gray-700/40"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {user.bio}
              </p>
            </motion.div>
          )}

          {/* Enhanced Stats Grid 2x2 */}
          <div className="grid grid-cols-2 gap-3">
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="relative group"
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 0.4,
                  delay: stat.delay,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Glassmorphism Background */}
                <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/40 dark:border-gray-700/40" />
                
                {/* Hover Glow */}
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-15 rounded-2xl transition-opacity duration-300`} />
                
                <div className="relative z-10 p-4 text-center">
                  <div className={`w-10 h-10 mx-auto mb-3 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <motion.p 
                    className="text-xl font-bold text-gray-900 dark:text-white mb-1"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: stat.delay + 0.1 }}
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
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-black/10 dark:bg-black/20 blur-2xl rounded-full" />
      </div>
    </motion.div>
  );
};

export default Revolutionary2025Header;
