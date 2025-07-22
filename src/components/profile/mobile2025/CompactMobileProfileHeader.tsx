
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Share2, 
  Crown, 
  Star, 
  MapPin, 
  Calendar,
  Camera,
  Edit3,
  MoreHorizontal
} from 'lucide-react';
import { UserProfile, ProfileStats } from '@/types/profile';

interface CompactMobileProfileHeaderProps {
  user: UserProfile;
  stats: ProfileStats;
  isOwnProfile: boolean;
  isPremium?: boolean;
  onStatsUpdate?: (stats: ProfileStats) => void;
}

const CompactMobileProfileHeader = ({
  user,
  stats,
  isOwnProfile,
  isPremium = false,
  onStatsUpdate
}: CompactMobileProfileHeaderProps) => {
  const [isOnline, setIsOnline] = useState(true);

  const formatJoinDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} hari lalu`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan lalu`;
    return `${Math.floor(diffDays / 365)} tahun lalu`;
  };

  return (
    <div className="relative px-4 pt-8 pb-4">
      {/* Compact Glassmorphism Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-gray-900/80 dark:via-gray-900/60 dark:to-gray-900/40 backdrop-blur-xl rounded-3xl" />
      <div className="absolute inset-0 border border-white/20 dark:border-gray-700/20 rounded-3xl" />
      
      <div className="relative z-10">
        {/* Header Actions - Compact */}
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 flex items-center justify-center"
          >
            <Settings className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </motion.button>
          
          <div className="flex items-center gap-2">
            {isPremium && (
              <motion.div
                className="px-2 py-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-xl rounded-full border border-yellow-400/30"
              >
                <div className="flex items-center gap-1">
                  <Crown className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs font-semibold text-yellow-400">Premium</span>
                </div>
              </motion.div>
            )}
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 flex items-center justify-center"
            >
              <Share2 className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </motion.button>
          </div>
        </div>

        {/* Compact Profile Info */}
        <div className="flex items-start gap-3 mb-4">
          {/* Smaller Avatar */}
          <div className="relative">
            <motion.div
              className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/30 dark:border-gray-700/30 shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={user.avatar_url || '/api/placeholder/64/64'}
                alt={user.display_name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Online Status - Smaller */}
            <motion.div
              className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${
                isOnline ? 'bg-green-400' : 'bg-gray-400'
              }`}
              animate={isOnline ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Camera Button - Smaller */}
            {isOwnProfile && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-md"
              >
                <Camera className="w-3 h-3 text-white" />
              </motion.button>
            )}
          </div>

          {/* Compact User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                {user.display_name}
              </h1>
              {isPremium && (
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
              )}
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">@{user.username}</p>
            
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500 mb-2">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{user.location || 'Indonesia'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Bergabung {formatJoinDate(user.created_at)}</span>
              </div>
            </div>

            {/* Bio - More compact */}
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
              {user.bio || 'Passionate angler exploring Indonesian waters 🎣'}
            </p>
          </div>
        </div>

        {/* Compact Quick Actions */}
        <div className="flex items-center gap-2">
          {isOwnProfile ? (
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white text-sm shadow-md flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </motion.button>
          ) : (
            <>
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white text-sm shadow-md"
              >
                Follow
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2.5 bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-xl font-semibold text-gray-700 dark:text-gray-300 text-sm"
              >
                Message
              </motion.button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompactMobileProfileHeader;
