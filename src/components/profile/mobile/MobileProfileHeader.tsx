
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserProfile, ProfileStats } from '@/types/profile';
import { Crown, MapPin, Users, Heart, Star, Activity } from 'lucide-react';

interface MobileProfileHeaderProps {
  user: UserProfile;
  stats: ProfileStats;
  isPremium?: boolean;
  onStatsUpdate?: (stats: ProfileStats) => void;
}

const MobileProfileHeader = ({
  user,
  stats,
  isPremium = false,
  onStatsUpdate
}: MobileProfileHeaderProps) => {
  const quickStats = [
    { icon: Users, value: stats.followers_count, label: 'Followers', color: 'from-blue-500 to-cyan-500' },
    { icon: Heart, value: stats.following_count, label: 'Following', color: 'from-pink-500 to-rose-500' },
    { icon: Star, value: stats.total_catches, label: 'Catches', color: 'from-yellow-500 to-orange-500' },
    { icon: Activity, value: stats.total_posts, label: 'Posts', color: 'from-green-500 to-emerald-500' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* Enhanced glassmorphism background */}
      <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20" />
      
      <div className="relative z-10 p-6 space-y-6">
        {/* Profile section */}
        <div className="flex items-center space-x-4">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Avatar className="w-20 h-20 ring-3 ring-white/30 shadow-xl">
              <AvatarImage src={user.avatar_url || '/placeholder.svg'} alt={user.display_name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-bold">
                {user.display_name?.charAt(0) || user.username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            {/* Online status */}
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full" />
            
            {/* Premium crown */}
            {isPremium && (
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Crown className="w-8 h-8 text-yellow-400" fill="currentColor" />
              </motion.div>
            )}
          </motion.div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
              {user.display_name || user.username}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              @{user.username}
            </p>
            
            {user.location && (
              <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 dark:text-gray-500">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{user.location}</span>
              </div>
            )}

            {isPremium && (
              <Badge className="mt-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {user.bio}
          </p>
        )}

        {/* Compact stats grid */}
        <div className="grid grid-cols-4 gap-3">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/20 dark:border-gray-700/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className={`w-8 h-8 mx-auto mb-2 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {stat.value?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MobileProfileHeader;
