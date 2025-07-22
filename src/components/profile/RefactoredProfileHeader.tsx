
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileHeaderProps } from '@/types/profile';
import ProfileAvatar from './ProfileAvatar';
import ProfileInfo from './ProfileInfo';
import ProfileStats from './ProfileStats';
import ProfileActions from './ProfileActions';
import EditFishCountModal from './EditFishCountModal';

const RefactoredProfileHeader = ({
  user,
  stats,
  isOwnProfile = false,
  onStatsUpdate
}: ProfileHeaderProps) => {
  const [isEditFishModalOpen, setIsEditFishModalOpen] = useState(false);
  const [currentStats, setCurrentStats] = useState(stats);

  const handleFishCountUpdate = (newCount: number) => {
    const updatedStats = { ...currentStats, total_catches: newCount };
    setCurrentStats(updatedStats);
    onStatsUpdate?.(updatedStats);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
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
    hidden: { opacity: 0, y: 20, scale: 0.95 },
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

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6E3482]/5 via-[#A56ABD]/3 to-transparent rounded-3xl blur-3xl" />
        
        {/* Main Card */}
        <Card className="relative overflow-hidden border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl">
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent dark:from-white/5 dark:via-white/2 dark:to-transparent" />
          
          {/* Animated border gradient */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#A56ABD]/20 via-[#6E3482]/20 to-[#A56ABD]/20 animate-pulse" />
          <div className="absolute inset-[1px] rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl" />
          
          {/* Floating elements */}
          <motion.div
            animate={{
              x: [0, 10, 0],
              y: [0, -5, 0],
              rotate: [0, 2, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-[#A56ABD]/10 to-[#6E3482]/10 rounded-full blur-xl"
          />
          
          <CardContent className="relative p-4 md:p-6 z-10">
            {/* Mobile Layout */}
            <div className="md:hidden space-y-4">
              <motion.div variants={itemVariants} className="flex items-center gap-4">
                <ProfileAvatar 
                  avatarUrl={user.avatar_url}
                  displayName={user.display_name}
                  username={user.username}
                  size="mobile"
                />
                
                <ProfileInfo user={user} layout="mobile" />
                
                <ProfileActions 
                  layout="mobile" 
                  isOwnProfile={isOwnProfile}
                />
              </motion.div>

              {/* Bio for mobile */}
              {user.bio && (
                <motion.div variants={itemVariants}>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-lg p-3 border border-white/20 dark:border-gray-700/20">
                    {user.bio}
                  </p>
                </motion.div>
              )}

              {/* Stats Grid - Mobile 2x2 */}
              <motion.div variants={itemVariants}>
                <ProfileStats 
                  stats={currentStats} 
                  layout="mobile" 
                  isOwnProfile={isOwnProfile}
                  onEditFishCount={() => setIsEditFishModalOpen(true)}
                />
              </motion.div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
              <div className="flex items-start gap-6">
                <motion.div variants={itemVariants}>
                  <ProfileAvatar 
                    avatarUrl={user.avatar_url}
                    displayName={user.display_name}
                    username={user.username}
                    size="desktop"
                  />
                </motion.div>

                <ProfileInfo user={user} layout="desktop" />
                
                <motion.div variants={itemVariants}>
                  <ProfileActions 
                    layout="desktop" 
                    isOwnProfile={isOwnProfile}
                  />
                </motion.div>
              </div>

              {/* Stats Grid - Desktop 4 columns */}
              <motion.div variants={itemVariants} className="mt-6">
                <ProfileStats 
                  stats={currentStats} 
                  layout="desktop" 
                  isOwnProfile={isOwnProfile}
                  onEditFishCount={() => setIsEditFishModalOpen(true)}
                />
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Fish Count Modal */}
      {isOwnProfile && (
        <EditFishCountModal
          open={isEditFishModalOpen}
          onOpenChange={setIsEditFishModalOpen}
          currentCount={currentStats.total_catches}
          userId={user.id}
          onCountUpdated={handleFishCountUpdate}
        />
      )}
    </>
  );
};

export default RefactoredProfileHeader;
