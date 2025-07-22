
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { ProfileHeaderProps } from '@/types/profile';
import { MapPin, Calendar, Crown, Sparkles, Edit3, Plus, Users, MessageSquare } from 'lucide-react';
import EnhancedProfileAvatar from './EnhancedProfileAvatar';
import ModernCard from './ModernCard';
import AddFishCatchDialog from './dialogs/AddFishCatchDialog';
import FishCatchHistoryDialog from './dialogs/FishCatchHistoryDialog';
import ModernEditProfileDialog from './dialogs/ModernEditProfileDialog';

const ModernProfileHeader = ({
  user,
  stats,
  isOwnProfile = false,
  onStatsUpdate,
  isPremium = false
}: ProfileHeaderProps & { isPremium?: boolean }) => {
  const isMobile = useIsMobile();
  const [isHovered, setIsHovered] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
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

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long'
    });
  };

  const handleCatchAdded = () => {
    if (onStatsUpdate) {
      onStatsUpdate({
        ...stats,
        total_catches: stats.total_catches + 1
      });
    }
  };

  const handleProfileUpdated = () => {
    // Trigger a refresh of the parent component
    window.location.reload();
  };

  if (isMobile) {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative">
        <ModernCard variant="glass" className="overflow-hidden">
          <CardContent className="p-6">
            {/* Mobile Avatar & Name Section */}
            <motion.div variants={itemVariants} className="flex items-start gap-4 mb-6">
              <div className="relative">
                <EnhancedProfileAvatar 
                  avatarUrl={user.avatar_url} 
                  displayName={user.display_name} 
                  username={user.username} 
                  size="lg" 
                  isPremium={isPremium} 
                  isOnline={true} 
                  showBadges={true} 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                    {user.display_name || user.username}
                  </h1>
                  {isPremium && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                      <Crown className="w-3 h-3 mr-1" />
                      Member Premium
                    </Badge>
                  )}
                </div>
                
                {user.username && user.display_name !== user.username && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    @{user.username}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  {user.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Bergabung {formatJoinDate(user.created_at)}</span>
                  </div>
                </div>
              </div>

              {isOwnProfile && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEditDialog(true)}
                    className="border-gray-200 dark:border-gray-700"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {/* Mobile Bio Section */}
            {user.bio && (
              <motion.div variants={itemVariants} className="mb-6">
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {user.bio}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Mobile Stats Grid */}
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: 'Tangkapan',
                    value: stats.total_catches,
                    icon: '🎣',
                    color: 'from-blue-500 to-cyan-500',
                    showHistory: true
                  },
                  {
                    label: 'Konten',
                    value: stats.total_posts,
                    icon: '📝',
                    color: 'from-purple-500 to-pink-500'
                  },
                  {
                    label: 'Pengikut',
                    value: stats.followers_count,
                    icon: '👥',
                    color: 'from-green-500 to-emerald-500'
                  },
                  {
                    label: 'Mengikuti',
                    value: stats.following_count,
                    icon: '❤️',
                    color: 'from-orange-500 to-red-500'
                  }
                ].map((stat, index) => (
                  <motion.div 
                    key={stat.label} 
                    whileHover={{ scale: 1.02, y: -2 }} 
                    className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-white shadow-lg relative overflow-hidden`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{stat.icon}</span>
                      <span className="text-xs font-medium opacity-90">{stat.label}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold">
                        {stat.value.toLocaleString('id-ID')}
                      </div>
                      {stat.showHistory && isOwnProfile && (
                        <FishCatchHistoryDialog totalCatches={stats.total_catches} />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Mobile Action Buttons */}
            {isOwnProfile && (
              <motion.div variants={itemVariants} className="mt-6 flex gap-2">
                <AddFishCatchDialog onCatchAdded={handleCatchAdded} />
                <Button variant="outline" className="flex-1 border-gray-200 dark:border-gray-700">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Catatan
                </Button>
              </motion.div>
            )}
          </CardContent>
        </ModernCard>

        {/* Modern Edit Profile Dialog */}
        <ModernEditProfileDialog
          currentProfile={user}
          onProfileUpdated={handleProfileUpdated}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      </motion.div>
    );
  }

  // Desktop Layout
  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      className="relative" 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <ModernCard variant="glass" className="overflow-hidden">
        {/* Subtle Background Gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-purple-500/5" 
          animate={{
            background: isHovered 
              ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(6, 182, 212, 0.08) 50%, rgba(147, 51, 234, 0.08) 100%)'
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 50%, rgba(147, 51, 234, 0.05) 100%)'
          }} 
          transition={{ duration: 0.6 }} 
        />

        <CardContent className="p-8 relative z-10">
          {/* Desktop Header Section */}
          <motion.div variants={itemVariants} className="flex items-start gap-8 mb-8">
            <div className="relative">
              <EnhancedProfileAvatar 
                avatarUrl={user.avatar_url} 
                displayName={user.display_name} 
                username={user.username} 
                size="xl" 
                isPremium={isPremium} 
                isOnline={true} 
                showBadges={true} 
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {user.display_name || user.username}
                </h1>
                {isPremium && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
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
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {user.username && user.display_name !== user.username && (
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  @{user.username}
                </p>
              )}

              {user.bio && (
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 mb-4 border border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {user.bio}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Bergabung {formatJoinDate(user.created_at)}</span>
                </div>
              </div>
            </div>

            {isOwnProfile && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(true)}
                  className="border-gray-200 dark:border-gray-700"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Desktop Stats Section */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-4 gap-6">
              {[
                {
                  label: 'Total Tangkapan',
                  value: stats.total_catches,
                  icon: '🎣',
                  color: 'from-blue-500 to-cyan-500',
                  description: 'Ikan yang berhasil ditangkap',
                  showHistory: true
                },
                {
                  label: 'Konten Dibagikan',
                  value: stats.total_posts,
                  icon: '📝',
                  color: 'from-purple-500 to-pink-500',
                  description: 'Postingan dan catatan'
                },
                {
                  label: 'Pengikut',
                  value: stats.followers_count,
                  icon: '👥',
                  color: 'from-green-500 to-emerald-500',
                  description: 'Angler yang mengikuti'
                },
                {
                  label: 'Mengikuti',
                  value: stats.following_count,
                  icon: '❤️',
                  color: 'from-orange-500 to-red-500',
                  description: 'Angler yang diikuti'
                }
              ].map((stat, index) => (
                <motion.div 
                  key={stat.label} 
                  whileHover={{ scale: 1.03, y: -5 }} 
                  className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group cursor-pointer`}
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{stat.icon}</span>
                      <span className="text-sm font-medium opacity-90">{stat.label}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold mb-1">
                          {stat.value.toLocaleString('id-ID')}
                        </div>
                        <div className="text-xs opacity-80">
                          {stat.description}
                        </div>
                      </div>
                      {stat.showHistory && isOwnProfile && (
                        <div className="ml-2">
                          <FishCatchHistoryDialog totalCatches={stats.total_catches} />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Desktop Action Buttons */}
          {isOwnProfile && (
            <motion.div variants={itemVariants} className="mt-8 flex gap-4">
              <AddFishCatchDialog onCatchAdded={handleCatchAdded} />
            </motion.div>
          )}
        </CardContent>
      </ModernCard>

      {/* Modern Edit Profile Dialog */}
      <ModernEditProfileDialog
        currentProfile={user}
        onProfileUpdated={handleProfileUpdated}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </motion.div>
  );
};

export default ModernProfileHeader;
