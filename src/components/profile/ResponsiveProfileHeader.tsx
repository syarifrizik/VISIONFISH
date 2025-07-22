
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { ProfileHeaderProps } from '@/types/profile';
import ProfileAvatar from './ProfileAvatar';
import ProfileInfo from './ProfileInfo';
import ProfileStats from './ProfileStats';
import ProfileActions from './ProfileActions';
import EditFishCountModal from './EditFishCountModal';
import AddFishCatchDialog from './AddFishCatchDialog';
import AddNoteDialog from './AddNoteDialog';

const ResponsiveProfileHeader = ({
  user,
  stats,
  isOwnProfile = false,
  onStatsUpdate
}: ProfileHeaderProps) => {
  const isMobile = useIsMobile();
  const [isEditFishModalOpen, setIsEditFishModalOpen] = useState(false);
  const [isAddCatchModalOpen, setIsAddCatchModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [currentStats, setCurrentStats] = useState(stats);

  const handleFishCountUpdate = (newCount: number) => {
    const updatedStats = { ...currentStats, total_catches: newCount };
    setCurrentStats(updatedStats);
    onStatsUpdate?.(updatedStats);
  };

  const handleCatchAdded = () => {
    // Refresh stats after adding a catch
    const updatedStats = { ...currentStats, total_catches: currentStats.total_catches + 1 };
    setCurrentStats(updatedStats);
    onStatsUpdate?.(updatedStats);
  };

  const handleNoteAdded = () => {
    // Refresh stats after adding a note
    const updatedStats = { ...currentStats, total_posts: currentStats.total_posts + 1 };
    setCurrentStats(updatedStats);
    onStatsUpdate?.(updatedStats);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
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

  if (isMobile) {
    return (
      <>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {/* Main Profile Card - Mobile */}
          <div className="relative overflow-hidden">
            {/* Simplified background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F5EBFA]/60 via-[#E7D0EF]/40 to-[#A56ABD]/20 dark:from-[#49225B]/30 dark:via-[#6E3482]/20 dark:to-[#A56ABD]/10 rounded-2xl" />
            
            {/* Static border */}
            <div className="absolute inset-0 rounded-2xl border border-[#A56ABD]/20" />
            <div className="absolute inset-[1px] rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl" />

            <Card className="relative border-0 bg-transparent shadow-none">
              <CardContent className="p-4 relative z-10">
                {/* Avatar and basic info row */}
                <motion.div variants={itemVariants} className="flex items-start gap-4 mb-4">
                  <ProfileAvatar 
                    avatarUrl={user.avatar_url}
                    displayName={user.display_name}
                    username={user.username}
                    size="mobile"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <ProfileInfo user={user} layout="mobile" />
                  </div>
                  
                  <ProfileActions 
                    layout="mobile" 
                    isOwnProfile={isOwnProfile}
                    onAddCatch={() => setIsAddCatchModalOpen(true)}
                    onAddNote={() => setIsAddNoteModalOpen(true)}
                  />
                </motion.div>

                {/* Bio section */}
                {user.bio && (
                  <motion.div variants={itemVariants} className="mb-4">
                    <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm rounded-xl p-3 border border-white/30 dark:border-gray-700/30">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {user.bio}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Stats grid */}
                <motion.div variants={itemVariants}>
                  <ProfileStats 
                    stats={currentStats} 
                    layout="mobile" 
                    isOwnProfile={isOwnProfile}
                    onEditFishCount={() => setIsEditFishModalOpen(true)}
                  />
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Modals */}
        {isOwnProfile && (
          <>
            <EditFishCountModal
              open={isEditFishModalOpen}
              onOpenChange={setIsEditFishModalOpen}
              currentCount={currentStats.total_catches}
              userId={user.id}
              onCountUpdated={handleFishCountUpdate}
            />
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
          </>
        )}
      </>
    );
  }

  // Desktop Layout
  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        {/* Simplified background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6E3482]/5 via-[#A56ABD]/3 to-transparent rounded-3xl" />
        
        <div className="relative overflow-hidden">
          {/* Static glassmorphism background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-gray-900/80 dark:via-gray-900/60 dark:to-gray-900/40 rounded-3xl backdrop-blur-xl" />
          
          {/* Static border */}
          <div className="absolute inset-0 rounded-3xl border border-[#A56ABD]/20" />

          <Card className="relative border-0 bg-transparent shadow-none">
            <CardContent className="p-8 relative z-10">
              {/* Header section with avatar, info, and actions */}
              <motion.div variants={itemVariants} className="flex items-start gap-8 mb-8">
                <ProfileAvatar 
                  avatarUrl={user.avatar_url}
                  displayName={user.display_name}
                  username={user.username}
                  size="desktop"
                />

                <div className="flex-1">
                  <ProfileInfo user={user} layout="desktop" />
                </div>
                
                <ProfileActions 
                  layout="desktop" 
                  isOwnProfile={isOwnProfile}
                  onAddCatch={() => setIsAddCatchModalOpen(true)}
                  onAddNote={() => setIsAddNoteModalOpen(true)}
                />
              </motion.div>

              {/* Stats section */}
              <motion.div variants={itemVariants}>
                <ProfileStats 
                  stats={currentStats} 
                  layout="desktop" 
                  isOwnProfile={isOwnProfile}
                  onEditFishCount={() => setIsEditFishModalOpen(true)}
                />
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Modals */}
      {isOwnProfile && (
        <>
          <EditFishCountModal
            open={isEditFishModalOpen}
            onOpenChange={setIsEditFishModalOpen}
            currentCount={currentStats.total_catches}
            userId={user.id}
            onCountUpdated={handleFishCountUpdate}
          />
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
        </>
      )}
    </>
  );
};

export default ResponsiveProfileHeader;
