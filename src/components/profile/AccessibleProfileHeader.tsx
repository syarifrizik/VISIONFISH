
import { motion } from 'framer-motion';
import { User, MapPin, Calendar, Shield, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProfileHeaderProps } from '@/types/profile';
import ProfileAvatar from './ProfileAvatar';
import { useIsMobile } from '@/hooks/use-mobile';

const AccessibleProfileHeader = ({ 
  user, 
  stats, 
  isOwnProfile = false, 
  isPremium = false 
}: ProfileHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
      role="banner"
      aria-label="Profile header"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl" />
      
      <div className="relative bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 shadow-2xl">
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-start gap-6`}>
          {/* Avatar Section */}
          <div className="flex-shrink-0">
            <ProfileAvatar
              avatarUrl={user.avatar_url}
              displayName={user.display_name}
              username={user.username}
              size={isMobile ? "mobile" : "desktop"}
              showStatus={user.is_online}
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <div className="space-y-3">
              {/* Name and Status */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white truncate">
                    {user.display_name || user.username}
                  </h1>
                  
                  {isPremium && (
                    <Badge 
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0"
                      aria-label="Premium member"
                    >
                      <Crown className="w-3 h-3 mr-1" aria-hidden="true" />
                      Premium
                    </Badge>
                  )}

                  {user.is_private && (
                    <Badge 
                      variant="outline" 
                      className="bg-gray-100/80 dark:bg-gray-800/80"
                      aria-label="Private profile"
                    >
                      <Shield className="w-3 h-3 mr-1" aria-hidden="true" />
                      Private
                    </Badge>
                  )}
                </div>

                {user.username && user.display_name !== user.username && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    @{user.username}
                  </p>
                )}
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl">
                  {user.bio}
                </p>
              )}

              {/* Location and Join Date */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                {user.location && (
                  <div className="flex items-center gap-1" role="text" aria-label={`Location: ${user.location}`}>
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                    <span>{user.location}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1" role="text" aria-label={`Member since ${new Date(user.created_at).toLocaleDateString()}`}>
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  <span>
                    Bergabung {new Date(user.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-6 pt-2">
                <div className="text-center" role="text" aria-label={`${stats.following_count} following`}>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stats.following_count.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Mengikuti
                  </div>
                </div>
                
                <div className="text-center" role="text" aria-label={`${stats.followers_count} followers`}>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stats.followers_count.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Pengikut
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isOwnProfile && (
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white/20 border-white/30 hover:bg-white/30"
                aria-label="Edit profile"
              >
                <User className="w-4 h-4 mr-2" aria-hidden="true" />
                Edit Profil
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AccessibleProfileHeader;
