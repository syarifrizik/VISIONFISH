import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Edit3, Crown, MapPin, Calendar } from 'lucide-react';
import { UserProfile, ProfileStats } from '@/types/profile';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProfileHeaderProps {
  user: UserProfile;
  stats: ProfileStats;
  isOwnProfile?: boolean;
  isPremium?: boolean;
}

const ProfileHeader = ({ user, stats, isOwnProfile = true, isPremium = false }: ProfileHeaderProps) => {
  const isMobile = useIsMobile();
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  if (isMobile) {
    return (
      <motion.div 
        className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-4 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Compact Mobile Profile Section */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex-shrink-0"
            >
              <Avatar className="w-14 h-14 ring-4 ring-blue-500/20 shadow-lg">
                <AvatarImage src={user.avatar_url || ''} alt={user.display_name || ''} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-base">
                  {(user.display_name || user.username || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isPremium && (
                <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="w-2 h-2 text-white" />
                </div>
              )}
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                      {user.display_name || user.username}
                    </h1>
                    {isPremium && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-1.5 py-0.5 text-xs">
                        Premium
                      </Badge>
                    )}
                  </div>
                  
                  {user.username && user.display_name !== user.username && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">@{user.username}</p>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    {user.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />
                        <span className="truncate max-w-16">{user.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      <span className="text-xs">Bergabung {formatDate(user.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Action Buttons - Repositioned */}
                {isOwnProfile && (
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-6 w-6 p-0 rounded-lg border-slate-300 dark:border-slate-600"
                      onClick={() => console.log('Edit profile clicked')}
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-6 w-6 p-0 rounded-lg border-slate-300 dark:border-slate-600"
                      onClick={() => console.log('Settings clicked')}
                    >
                      <Settings className="w-2.5 h-2.5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bio - More Compact */}
        {user.bio && (
          <div className="mb-3">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-2">
              {user.bio}
            </p>
          </div>
        )}

        {/* Compact Mobile Stats Grid - Icons Only */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { 
              icon: '🎣',
              value: stats.total_catches, 
              color: 'text-blue-600 dark:text-blue-400',
              bgColor: 'bg-blue-50 dark:bg-blue-900/20'
            },
            { 
              icon: '📝',
              value: stats.total_posts, 
              color: 'text-emerald-600 dark:text-emerald-400',
              bgColor: 'bg-emerald-50 dark:bg-emerald-900/20'
            },
            { 
              icon: '👥',
              value: stats.followers_count, 
              color: 'text-purple-600 dark:text-purple-400',
              bgColor: 'bg-purple-50 dark:bg-purple-900/20'
            },
            { 
              icon: '❤️',
              value: stats.following_count, 
              color: 'text-orange-600 dark:text-orange-400',
              bgColor: 'bg-orange-50 dark:bg-orange-900/20'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className={`text-center p-2 rounded-xl ${stat.bgColor} transition-all duration-200 hover:scale-105`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="text-lg mb-1">
                {stat.icon}
              </div>
              <div className={`text-sm font-bold ${stat.color}`}>
                {stat.value.toLocaleString()}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Profile Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Avatar className="w-20 h-20 ring-4 ring-blue-500/20 shadow-lg">
              <AvatarImage src={user.avatar_url || ''} alt={user.display_name || ''} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl">
                {(user.display_name || user.username || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isPremium && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Crown className="w-3 h-3 text-white" />
              </div>
            )}
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 truncate">
                {user.display_name || user.username}
              </h1>
              {isPremium && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-3 py-1 text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            
            {user.username && user.display_name !== user.username && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">@{user.username}</p>
            )}
            
            {user.bio && (
              <p className="text-sm text-slate-700 dark:text-slate-300 max-w-md leading-relaxed mb-3">
                {user.bio}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Bergabung {formatDate(user.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isOwnProfile && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 px-4">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="h-9 px-3">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
        {[
          { 
            label: 'Tangkapan', 
            value: stats.total_catches, 
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
          },
          { 
            label: 'Postingan', 
            value: stats.total_posts, 
            color: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-50 dark:bg-emerald-900/20'
          },
          { 
            label: 'Pengikut', 
            value: stats.followers_count, 
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20'
          },
          { 
            label: 'Mengikuti', 
            value: stats.following_count, 
            color: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className={`text-center p-3 rounded-xl ${stat.bgColor} transition-all duration-200 hover:scale-105`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className={`text-xl font-bold ${stat.color}`}>
              {stat.value.toLocaleString()}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
