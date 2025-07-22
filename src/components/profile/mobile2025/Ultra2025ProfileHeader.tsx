
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Crown, 
  MapPin, 
  Calendar,
  MessageCircle,
  UserPlus,
  UserCheck,
  Settings,
  Camera,
  Trophy,
  Target,
  Fish
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatMemberSince } from '@/utils/timeUtils';

interface ProfileStats {
  total_posts?: number;
  total_catches?: number;
  following_count?: number;
  followers_count?: number;
}

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  created_at: string;
  updated_at?: string;
  followers_count?: number;
  following_count?: number;
  is_private?: boolean;
  is_online?: boolean;
  last_seen_at?: string;
  privacy_settings?: {
    bio_visibility: string;
    photo_visibility: string;
    stats_visibility: string;
    profile_visibility: string;
  };
}

interface Ultra2025ProfileHeaderProps {
  user: UserProfile;
  stats: ProfileStats;
  isOwnProfile: boolean;
  isFollowing?: boolean;
  followLoading?: boolean;
  onBack?: () => void;
  onFollow?: () => void;
  onMessage?: () => void;
  onStatsUpdate?: (stats: ProfileStats) => void;
  canViewProfile?: boolean;
  isPremium?: boolean;
  onProfileUpdate?: (updatedProfile: UserProfile) => void;
}

const Ultra2025ProfileHeader = ({
  user,
  stats,
  isOwnProfile,
  isFollowing = false,
  followLoading = false,
  onBack,
  onFollow,
  onMessage,
  onStatsUpdate,
  canViewProfile = true,
  isPremium = false,
  onProfileUpdate
}: Ultra2025ProfileHeaderProps) => {
  const { theme } = useTheme();
  const { user: currentUser } = useAuth();
  const isDark = theme === 'dark';
  
  // SIMPLIFIED: Direct use of user prop with forced re-render key
  const [renderKey, setRenderKey] = useState(0);

  // Force re-render when user prop changes
  useEffect(() => {
    console.log('Ultra2025ProfileHeader mobile2025: user prop changed, forcing re-render:', user);
    setRenderKey(prev => prev + 1);
  }, [user.avatar_url, user.username, user.display_name, user.bio, user.location]); // Watch specific fields

  // SIMPLIFIED: Get display name directly from prop
  const getDisplayName = () => {
    return user.display_name || user.username || 'User';
  };

  // FIXED: STRICT DATABASE-ONLY AVATAR with enhanced debugging
  const getAvatarUrl = () => {
    const avatarUrl = user.avatar_url;
    console.log('Ultra2025ProfileHeader mobile2025: Using STRICT database avatar_url:', avatarUrl);
    console.log('Ultra2025ProfileHeader mobile2025: User object:', user);
    
    // STRICT: Only return database avatar, no fallbacks
    return avatarUrl || '';
  };

  // Get member since text using proper time formatting
  const getMemberSinceText = () => {
    if (user.created_at) {
      return formatMemberSince(user.created_at);
    }
    return 'bergabung hari ini';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  console.log('Ultra2025ProfileHeader mobile2025: Rendering with avatar_url:', getAvatarUrl(), 'renderKey:', renderKey);

  return (
    <motion.div 
      key={renderKey} // Force re-render when key changes
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-3xl" />
      
      {/* Glass morphism container */}
      <div className={cn(
        "relative bg-white/10 backdrop-blur-xl rounded-3xl border shadow-2xl p-6",
        isDark ? "border-white/20" : "border-white/30"
      )}>
        {/* Header with back button */}
        {onBack && (
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            {isOwnProfile && (
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <Settings className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}

        {/* Profile Info */}
        <div className="flex items-start space-x-4 mb-6">
          {/* Avatar */}
          <div className="relative">
            <Avatar key={`avatar-${renderKey}`} className="w-20 h-20 border-4 border-white/20 shadow-xl">
              <AvatarImage 
                src={getAvatarUrl()} 
                alt={getDisplayName()}
                onLoad={() => console.log('Avatar loaded successfully:', getAvatarUrl())}
                onError={() => console.log('Avatar failed to load:', getAvatarUrl())}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            
            {/* Online indicator */}
            {user.is_online && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white/20 rounded-full" />
            )}
            
            {/* Premium badge */}
            {isPremium && (
              <div className="absolute -top-2 -right-2">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h1 className="text-2xl font-bold text-white truncate">
                {getDisplayName()}
              </h1>
            </div>
            
            <p className="text-white/70 text-sm mb-2">@{user.username}</p>
            
            {user.bio && canViewProfile && (
              <p className="text-white/80 text-sm mb-3 line-clamp-2">
                {user.bio}
              </p>
            )}
            
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
              {user.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{getMemberSinceText()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {!isOwnProfile && (
          <div className="flex space-x-3 mb-6">
            <Button
              onClick={onFollow}
              disabled={followLoading}
              className={cn(
                "flex-1 font-semibold transition-all duration-300",
                isFollowing
                  ? "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
              )}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-4 h-4 mr-2" />
                  Mengikuti
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Ikuti
                </>
              )}
            </Button>
            
            <Button
              onClick={onMessage}
              variant="outline"
              className="bg-white/10 text-white border-white/30 hover:bg-white/20"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Stats Grid */}
        {canViewProfile && (
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-full mb-2 mx-auto">
                <Fish className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-lg font-bold text-white">
                {stats.total_catches || 0}
              </div>
              <div className="text-xs text-white/60">Tangkapan</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-500/20 rounded-full mb-2 mx-auto">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-lg font-bold text-white">
                {stats.total_posts || 0}
              </div>
              <div className="text-xs text-white/60">Postingan</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-500/20 rounded-full mb-2 mx-auto">
                <UserPlus className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-lg font-bold text-white">
                {stats.followers_count || user.followers_count || 0}
              </div>
              <div className="text-xs text-white/60">Pengikut</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-500/20 rounded-full mb-2 mx-auto">
                <UserCheck className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-lg font-bold text-white">
                {stats.following_count || user.following_count || 0}
              </div>
              <div className="text-xs text-white/60">Mengikuti</div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Ultra2025ProfileHeader;
