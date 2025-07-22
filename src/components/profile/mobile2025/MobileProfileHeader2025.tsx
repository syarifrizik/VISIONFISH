
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
  Zap
} from 'lucide-react';
import { UserProfile, ProfileStats } from '@/types/profile';
import { supabase } from '@/integrations/supabase/client';

interface MobileProfileHeader2025Props {
  user: UserProfile;
  stats: ProfileStats;
  isOwnProfile: boolean;
  isPremium?: boolean;
  onStatsUpdate?: (stats: ProfileStats) => void;
}

const MobileProfileHeader2025 = ({
  user,
  stats,
  isOwnProfile,
  isPremium = false,
  onStatsUpdate
}: MobileProfileHeader2025Props) => {
  const [isOnline, setIsOnline] = useState(true);
  const [lastActive, setLastActive] = useState('Active now');

  // Simulate real-time status (in real app, would use Supabase realtime)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.3); // 70% chance online
    }, 30000);

    return () => clearInterval(interval);
  }, []);

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
    <div className="relative px-6 pt-12 pb-6">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl" />
      <div className="absolute inset-0 border-b border-white/10" />
      
      <div className="relative z-10">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center"
          >
            <Settings className="w-5 h-5 text-white" />
          </motion.button>
          
          <div className="flex items-center gap-3">
            {isPremium && (
              <motion.div
                className="px-3 py-1.5 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-xl rounded-full border border-yellow-400/30"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-semibold text-yellow-400">Premium</span>
                </div>
              </motion.div>
            )}
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center"
            >
              <Share2 className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex items-start gap-4 mb-6">
          {/* Avatar with Status */}
          <div className="relative">
            <motion.div
              className="w-24 h-24 rounded-3xl overflow-hidden border-3 border-white/30 shadow-2xl"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={user.avatar_url || '/api/placeholder/96/96'}
                alt={user.display_name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Online Status */}
            <motion.div
              className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                isOnline ? 'bg-green-400' : 'bg-gray-400'
              }`}
              animate={isOnline ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Camera Button for Own Profile */}
            {isOwnProfile && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <Camera className="w-4 h-4 text-white" />
              </motion.button>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white truncate">
                {user.display_name}
              </h1>
              {isPremium && (
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
              )}
            </div>
            
            <p className="text-white/70 text-sm mb-2">@{user.username}</p>
            
            <div className="flex items-center gap-4 text-xs text-white/60 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{user.location || 'Indonesia'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Bergabung {formatJoinDate(user.created_at)}</span>
              </div>
            </div>

            {/* Status */}
            <p className="text-white/80 text-sm leading-relaxed">
              {user.bio || 'Passionate angler exploring Indonesian waters 🎣'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3 mb-4">
          {isOwnProfile ? (
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-semibold text-white shadow-lg flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </motion.button>
          ) : (
            <>
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-semibold text-white shadow-lg"
              >
                Follow
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl font-semibold text-white"
              >
                Message
              </motion.button>
            </>
          )}
        </div>

        {/* Achievement Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { icon: '🏆', label: 'Master Angler', color: 'from-yellow-400 to-orange-500' },
            { icon: '🎣', label: 'Big Catch', color: 'from-blue-400 to-cyan-500' },
            { icon: '📍', label: 'Explorer', color: 'from-green-400 to-emerald-500' },
            { icon: '⭐', label: 'Pro Fisher', color: 'from-purple-400 to-pink-500' }
          ].map((badge, index) => (
            <motion.div
              key={index}
              className={`flex-shrink-0 px-3 py-2 bg-gradient-to-r ${badge.color}/20 backdrop-blur-xl rounded-xl border border-white/20 flex items-center gap-2`}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-sm">{badge.icon}</span>
              <span className="text-xs font-medium text-white whitespace-nowrap">{badge.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileProfileHeader2025;
