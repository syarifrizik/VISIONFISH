
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, UserPlus, UserCheck, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UnifiedUser, UserStats } from '@/hooks/useUserProfileUnified';
import { useTheme } from '@/hooks/use-theme';

interface UserProfileHeaderProps {
  user: UnifiedUser;
  stats: UserStats;
  isFollowing: boolean;
  followLoading: boolean;
  onBack: () => void;
  onFollow: () => void;
  onMessage: () => void;
  canViewProfile: boolean;
}

const UserProfileHeader = ({
  user,
  stats,
  isFollowing,
  followLoading,
  onBack,
  onFollow,
  onMessage,
  canViewProfile
}: UserProfileHeaderProps) => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl p-6 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-white/10 to-white/5 border-[#A56ABD]/20 backdrop-blur-md'
          : 'bg-gradient-to-br from-white/20 to-white/10 border-[#A56ABD]/30 backdrop-blur-md'
      }`}
    >
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          size="sm"
          className={`${
            theme === 'dark'
              ? 'text-[#F5EBFA] hover:bg-white/10'
              : 'text-[#49225B] hover:bg-white/20'
          }`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`${
            theme === 'dark'
              ? 'text-[#F5EBFA] hover:bg-white/10'
              : 'text-[#49225B] hover:bg-white/20'
          }`}
        >
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {/* Profile Info */}
      <div className="flex items-start gap-6 mb-6">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Avatar className="w-24 h-24 ring-4 ring-white/20 shadow-xl">
            <AvatarImage src={user.avatar_url} alt={user.display_name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl font-bold">
              {user.display_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h1 className={`text-2xl font-bold truncate ${
              theme === 'dark' ? 'text-[#F5EBFA]' : 'text-[#49225B]'
            }`}>
              {user.display_name}
            </h1>
            {user.is_private && (
              <Badge variant="secondary" className="text-xs">
                Privat
              </Badge>
            )}
          </div>
          
          <p className={`text-sm mb-3 ${
            theme === 'dark' ? 'text-[#A56ABD]' : 'text-[#6E3482]'
          }`}>
            @{user.username}
          </p>

          {user.location && (
            <p className={`text-sm mb-3 ${
              theme === 'dark' ? 'text-[#E7D0EF]' : 'text-[#6E3482]'
            }`}>
              📍 {user.location}
            </p>
          )}

          {canViewProfile && user.bio && (
            <p className={`text-sm leading-relaxed ${
              theme === 'dark' ? 'text-[#E7D0EF]' : 'text-[#6E3482]'
            }`}>
              {user.bio}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      {canViewProfile && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Postingan', value: stats.total_posts },
            { label: 'Tangkapan', value: stats.total_catches },
            { label: 'Pengikut', value: stats.followers_count },
            { label: 'Mengikuti', value: stats.following_count }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`text-xl font-bold ${
                theme === 'dark' ? 'text-[#F5EBFA]' : 'text-[#49225B]'
              }`}>
                {stat.value}
              </div>
              <div className={`text-xs ${
                theme === 'dark' ? 'text-[#A56ABD]' : 'text-[#6E3482]'
              }`}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onFollow}
          disabled={followLoading}
          className={`flex-1 ${
            isFollowing 
              ? 'bg-gray-600 hover:bg-gray-700' 
              : theme === 'dark'
                ? 'bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482]'
                : 'bg-gradient-to-r from-[#A56ABD] to-[#6E3482] hover:from-[#6E3482] hover:to-[#49225B]'
          } text-white`}
        >
          {followLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : isFollowing ? (
            <UserCheck className="w-4 h-4 mr-2" />
          ) : (
            <UserPlus className="w-4 h-4 mr-2" />
          )}
          {isFollowing ? 'Mengikuti' : 'Ikuti'}
        </Button>
        
        <Button
          onClick={onMessage}
          variant="outline"
          className={`flex-1 ${
            theme === 'dark'
              ? 'border-[#A56ABD]/30 text-[#A56ABD] hover:bg-[#A56ABD]/10'
              : 'border-[#6E3482]/50 text-[#6E3482] hover:bg-[#6E3482]/10'
          }`}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat
        </Button>
      </div>
    </motion.div>
  );
};

export default UserProfileHeader;
