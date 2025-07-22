
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Calendar, Shield, Crown, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProfileHeaderProps } from '@/types/profile';
import ProfileAvatar from './ProfileAvatar';
import { useIsMobile } from '@/hooks/use-mobile';
import AddFishCatchDialog from './AddFishCatchDialog';
import AddNoteDialog from './AddNoteDialog';
import EditFishCountModal from './EditFishCountModal';

const SimplifiedProfileHeader = ({ 
  user, 
  stats, 
  isOwnProfile = false, 
  isPremium = false,
  onStatsUpdate 
}: ProfileHeaderProps) => {
  const isMobile = useIsMobile();
  const [isAddCatchModalOpen, setIsAddCatchModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [isEditFishModalOpen, setIsEditFishModalOpen] = useState(false);

  const handleCatchAdded = () => {
    if (onStatsUpdate) {
      onStatsUpdate({
        ...stats,
        total_catches: stats.total_catches + 1
      });
    }
  };

  const handleNoteAdded = () => {
    if (onStatsUpdate) {
      onStatsUpdate({
        ...stats,
        total_posts: stats.total_posts + 1
      });
    }
  };

  const handleFishCountUpdate = (newCount: number) => {
    if (onStatsUpdate) {
      onStatsUpdate({
        ...stats,
        total_catches: newCount
      });
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {/* Clean background */}
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
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
              <div className="space-y-4">
                {/* Name and Status */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {user.display_name || user.username}
                    </h1>
                    
                    {isPremium && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}

                    {user.is_private && (
                      <Badge variant="outline" className="bg-gray-100/80 dark:bg-gray-800/80">
                        <Shield className="w-3 h-3 mr-1" />
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
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {user.bio}
                  </p>
                )}

                {/* Location and Join Date */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  {user.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Bergabung {new Date(user.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </span>
                  </div>
                </div>

                {/* Clean Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div 
                    className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    onClick={() => isOwnProfile && setIsEditFishModalOpen(true)}
                  >
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.total_catches.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Ikan Ditangkap
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-xl font-bold text-green-600 dark:text-green-400">
                      {stats.total_posts.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Konten
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {stats.followers_count.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Pengikut
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                      {stats.following_count.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Mengikuti
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
                  className="bg-white/50 border-gray-300 hover:bg-white/70"
                >
                  <User className="w-4 h-4 mr-2" />
                  Edit Profil
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    onClick={() => setIsAddCatchModalOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Tangkapan
                  </Button>
                  
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAddNoteModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Catatan
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      {isOwnProfile && (
        <>
          <AddFishCatchDialog
            open={isAddCatchModalOpen}
            onOpenChange={setIsAddCatchModalOpen}
            onCatchAdded={handleCatchAdded}
          />
          <AddNoteDialog
            open={isAddNoteModalOpen}
            onOpenChange={setIsAddNoteModalOpen}
            onNoteAdded={handleNoteAdded}
          />
          <EditFishCountModal
            open={isEditFishModalOpen}
            onOpenChange={setIsEditFishModalOpen}
            currentCount={stats.total_catches}
            userId={user.id}
            onCountUpdated={handleFishCountUpdate}
          />
        </>
      )}
    </>
  );
};

export default SimplifiedProfileHeader;
