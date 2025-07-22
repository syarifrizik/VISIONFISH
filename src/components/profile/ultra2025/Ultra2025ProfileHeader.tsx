
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  MessageCircle, 
  UserPlus, 
  UserCheck, 
  Shield, 
  Share2, 
  Eye, 
  EyeOff, 
  Crown,
  Sparkles,
  Calendar,
  MapPin,
  Users,
  Heart,
  Fish,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserProfile, ProfileStats } from '@/types/profile';
import { formatMemberSince } from '@/utils/dateUtils';

interface Ultra2025ProfileHeaderProps {
  user: UserProfile;
  stats: ProfileStats;
  isOwnProfile: boolean;
  isFollowing?: boolean;
  followLoading?: boolean;
  onBack?: () => void;
  onFollow?: () => void;
  onMessage?: () => void;
  canViewProfile?: boolean;
  isPremium?: boolean;
  onStatsUpdate?: (stats: ProfileStats) => void;
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
  canViewProfile = true,
  isPremium = false,
  onStatsUpdate,
  onProfileUpdate
}: Ultra2025ProfileHeaderProps) => {
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // SIMPLIFIED: Direct use of user prop with forced re-render key
  const [renderKey, setRenderKey] = useState(0);

  // Force re-render when user prop changes
  useEffect(() => {
    console.log('Ultra2025ProfileHeader desktop: user prop changed, forcing re-render:', user);
    setRenderKey(prev => prev + 1);
  }, [user.avatar_url, user.username, user.display_name, user.bio, user.location]); // Watch specific fields

  // SIMPLIFIED: Get display name directly from prop
  const getDisplayName = () => {
    return user.display_name || user.username || 'User';
  };

  // FIXED: STRICT DATABASE-ONLY AVATAR with enhanced debugging
  const getAvatarUrl = () => {
    const avatarUrl = user.avatar_url;
    console.log('Ultra2025ProfileHeader desktop: Using STRICT database avatar_url:', avatarUrl);
    console.log('Ultra2025ProfileHeader desktop: User object:', user);
    
    // STRICT: Only return database avatar, no fallbacks
    return avatarUrl || '';
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  console.log('Ultra2025ProfileHeader desktop: Rendering with avatar_url:', getAvatarUrl(), 'renderKey:', renderKey);

  return (
    <motion.div
      key={renderKey} // Force re-render when key changes
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with Back Button and Actions */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between mb-6"
      >
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white hover:bg-white/10 backdrop-blur-xl rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
            className="text-white/70 hover:bg-white/10 rounded-xl"
          >
            {showPrivacyInfo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:bg-white/10 rounded-xl"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Privacy Info */}
      <AnimatePresence>
        {showPrivacyInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span className="text-white font-medium">Pengaturan Privasi</span>
              </div>
              <div className="text-sm text-white/70 space-y-1">
                <p>Profil: Publik</p>
                <p>Foto: Publik</p>
                <p>Bio: Publik</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Profile Card */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
        {/* Animated Background Gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5" 
          animate={{
            background: isHovered 
              ? [
                  'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(147, 51, 234, 0.05) 100%)',
                  'linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(6, 182, 212, 0.05) 50%, rgba(59, 130, 246, 0.05) 100%)'
                ] 
              : 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(59, 130, 246, 0.05) 50%, rgba(147, 51, 234, 0.05) 100%)'
          }} 
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }} 
        />

        <div className="relative z-10 p-6">
          {/* Profile Header Section */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center gap-6 mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <Avatar key={`avatar-${renderKey}`} className="h-32 w-32 ring-4 ring-white/30 shadow-2xl">
                <AvatarImage 
                  src={getAvatarUrl()} 
                  alt={getDisplayName()}
                  onLoad={() => console.log('Desktop avatar loaded successfully:', getAvatarUrl())}
                  onError={() => console.log('Desktop avatar failed to load:', getAvatarUrl())}
                />
                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white text-4xl">
                  {getDisplayName().charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isPremium && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-white">{getDisplayName()}</h1>
                {isPremium && (
                  <Badge className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-yellow-300 border-yellow-400/30 w-fit">
                    <Crown className="w-4 h-4 mr-1" />
                    Member Premium
                  </Badge>
                )}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {user.username && user.username !== getDisplayName() && !user.username.includes('@') && (
                <p className="text-cyan-300 mb-4 text-lg">@{user.username}</p>
              )}

              {user.bio && (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/10">
                  <p className="text-white/90 leading-relaxed">{user.bio}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-white/60 mb-6">
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Bergabung {formatMemberSince(user.created_at)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                {
                  label: 'Tangkapan',
                  value: stats.total_catches || 0,
                  icon: Fish,
                  color: 'from-blue-500 to-cyan-500',
                  description: 'Ikan ditangkap'
                },
                {
                  label: 'Konten',
                  value: stats.total_posts || 0,
                  icon: BookOpen,
                  color: 'from-purple-500 to-pink-500',
                  description: 'Postingan dibuat'
                },
                {
                  label: 'Pengikut',
                  value: stats.followers_count || 0,
                  icon: Users,
                  color: 'from-green-500 to-emerald-500',
                  description: 'Angler mengikuti'
                },
                {
                  label: 'Mengikuti',
                  value: stats.following_count || 0,
                  icon: Heart,
                  color: 'from-orange-500 to-red-500',
                  description: 'Angler diikuti'
                }
              ].map((stat, index) => (
                <motion.div 
                  key={stat.label} 
                  whileHover={{ scale: 1.03, y: -5 }} 
                  className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-white shadow-xl relative overflow-hidden group cursor-pointer`}
                >
                  {/* Animated background effect */}
                  <motion.div 
                    className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100" 
                    initial={false} 
                    animate={{
                      background: [
                        'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                        'radial-gradient(circle at 100% 100%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                        'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)'
                      ]
                    }} 
                    transition={{ duration: 2, repeat: Infinity }} 
                  />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className="w-5 h-5" />
                      <span className="text-sm font-medium opacity-90">{stat.label}</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold mb-1">
                        {stat.value.toLocaleString('id-ID')}
                      </div>
                      <div className="text-xs opacity-80">
                        {stat.description}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          {!isOwnProfile && (
            <motion.div variants={itemVariants} className="flex gap-3 justify-center md:justify-start">
              <Button
                onClick={onFollow}
                disabled={followLoading}
                className={`${
                  isFollowing 
                    ? 'bg-white/20 hover:bg-white/30 text-white' 
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'
                } backdrop-blur-xl shadow-lg`}
              >
                {isFollowing ? (
                  <UserCheck className="w-4 h-4 mr-2" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                {followLoading ? 'Loading...' : (isFollowing ? 'Mengikuti' : 'Ikuti')}
              </Button>
              
              <Button
                onClick={onMessage}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-xl"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Ultra2025ProfileHeader;
