import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PrivacyAwareProfileTabs from '@/components/profile/PrivacyAwareProfileTabs';
import Ultra2025ProfileHeader from '@/components/profile/mobile2025/Ultra2025ProfileHeader';
import MobileStatsGrid2025 from '@/components/profile/mobile2025/MobileStatsGrid2025';
import OptimizedMobileHeader from '@/components/profile/mobile2025/OptimizedMobileHeader';
import ModernEditProfileDialog from '@/components/profile/dialogs/ModernEditProfileDialog';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useProfileData } from '@/hooks/useProfileData';
import { motion } from 'framer-motion';
import { ProfileStats } from '@/types/profile';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProfilePage = () => {
  const { user } = useAuth();
  const { profile, stats, isLoading, refetch, updateProfileState } = useProfileData(); // Added updateProfileState
  const { isPremium, loading: premiumLoading } = usePremiumStatus();
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentStats, setCurrentStats] = useState<ProfileStats>({
    total_posts: 0,
    total_catches: 0,
    following_count: 0,
    followers_count: 0
  });

  // SIMPLIFIED: Single source of truth for current profile
  const [displayProfile, setDisplayProfile] = useState<any>(null);

  const activeTab = searchParams.get('tab') || 'aktivitas';

  // SIMPLIFIED: Get display data directly from database with NO FALLBACKS
  const getDisplayName = () => {
    if (displayProfile?.display_name && displayProfile.display_name !== 'User') {
      return displayProfile.display_name;
    }
    if (displayProfile?.username && !displayProfile.username.includes('@')) {
      return displayProfile.username;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getUsername = () => {
    if (displayProfile?.username && !displayProfile.username.includes('@')) {
      return displayProfile.username;
    }
    return user?.email?.split('@')[0] || 'user';
  };

  const getBio = () => displayProfile?.bio || '';
  const getLocation = () => displayProfile?.location || '';

  // FIXED: STRICT DATABASE-ONLY AVATAR with no Google fallback
  const getAvatarUrl = () => {
    const dbAvatar = displayProfile?.avatar_url;
    console.log('Profile.tsx: getAvatarUrl - Database avatar_url:', dbAvatar);
    
    // STRICT: Only return database avatar, NO fallbacks to Google OAuth
    return dbAvatar || '';
  };

  // Update stats when data changes
  useEffect(() => {
    if (stats) {
      setCurrentStats(stats);
    }
  }, [stats]);

  // SIMPLIFIED: Update display profile when profile data changes
  useEffect(() => {
    if (profile) {
      console.log('Profile.tsx: Setting displayProfile from profile data:', profile);
      setDisplayProfile(profile);
    }
  }, [profile]);

  // Debug premium status
  useEffect(() => {
    console.log('ProfilePage: Premium status - isPremium:', isPremium, 'loading:', premiumLoading, 'user:', user?.id);
  }, [isPremium, premiumLoading, user]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  const handleTabChange = (tabValue: string) => {
    setSearchParams({ tab: tabValue });
  };

  const handleStatsUpdate = (newStats: ProfileStats) => {
    setCurrentStats(newStats);
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const handleEditProfile = () => {
    setShowEditDialog(true);
  };

  // IMPROVED: Immediate update with proper state management
  const handleProfileUpdated = (updatedProfile?: any) => {
    console.log('Profile.tsx: handleProfileUpdated called with:', updatedProfile);
    
    if (updatedProfile) {
      // IMMEDIATE: Update display state first for instant UI response
      console.log('Profile.tsx: Immediate displayProfile update with avatar_url:', updatedProfile.avatar_url);
      setDisplayProfile(prev => {
        const newProfile = { ...prev, ...updatedProfile };
        console.log('Profile.tsx: New displayProfile state:', newProfile);
        return newProfile;
      });
      
      // IMMEDIATE: Update useProfileData state as well
      updateProfileState(updatedProfile);
    }
    
    // BACKGROUND: Still refetch for database sync but don't block UI
    setTimeout(() => {
      console.log('Profile.tsx: Background refetch for database sync');
      refetch();
    }, 1000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center">
        <motion.div 
          className="text-center bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Akses Terbatas
          </h2>
          <p className="text-white/70">
            Silakan login untuk melihat profil
          </p>
        </motion.div>
      </div>
    );
  }

  if (isLoading || !displayProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-white/30 border-t-cyan-400 rounded-full relative z-10"
        />
      </div>
    );
  }

  // Create unified profile for components
  const unifiedProfile = {
    id: user.id,
    display_name: getDisplayName(),
    username: getUsername(),
    bio: getBio(),
    location: getLocation(),
    avatar_url: getAvatarUrl(),
    created_at: displayProfile?.created_at || user.created_at || new Date().toISOString(),
    updated_at: displayProfile?.updated_at,
    followers_count: currentStats.followers_count,
    following_count: currentStats.following_count,
    is_private: displayProfile?.is_private || false,
    is_online: displayProfile?.is_online || false,
    last_seen_at: displayProfile?.last_seen_at,
    privacy_settings: displayProfile?.privacy_settings || {
      bio_visibility: 'public',
      photo_visibility: 'public',
      stats_visibility: 'public',
      profile_visibility: 'public'
    }
  };

  console.log('Profile.tsx: Rendering with unifiedProfile avatar_url:', unifiedProfile.avatar_url);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
        {/* Mobile Header */}
        <OptimizedMobileHeader
          title="Profil Saya"
          onSearch={() => console.log('Search')}
          onSettings={handleEditProfile}
          onShare={() => console.log('Share')}
          onNotifications={() => console.log('Notifications')}
          onAdd={() => console.log('Add')}
          showAddButton={true}
        />

        {/* Mobile Profile Content */}
        <div className="pb-20 relative z-10">
          {/* Ultra2025 Profile Header with Achievement Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="px-4 mb-4">
              <div className="flex justify-end">
                <Button
                  onClick={handleEditProfile}
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/10"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profil
                </Button>
              </div>
            </div>
            <Ultra2025ProfileHeader
              user={unifiedProfile}
              stats={currentStats}
              isOwnProfile={true}
              isPremium={!premiumLoading ? isPremium : false}
              onStatsUpdate={handleStatsUpdate}
              onProfileUpdate={handleProfileUpdated}
            />
          </motion.div>

          {/* Mobile Stats Grid with Achievement Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <MobileStatsGrid2025
              stats={currentStats}
              isOwnProfile={true}
            />
          </motion.div>

          {/* Profile Content Tabs */}
          <motion.div 
            className="px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              <PrivacyAwareProfileTabs
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                isOwnProfile={true}
                profileUserId={user?.id}
              />
            </div>
          </motion.div>
        </div>

        {/* Edit Profile Dialog */}
        <ModernEditProfileDialog
          currentProfile={unifiedProfile}
          onProfileUpdated={handleProfileUpdated}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Desktop Profile Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-end mb-4">
              <Button
                onClick={handleEditProfile}
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit Profil
              </Button>
            </div>
            <Ultra2025ProfileHeader
              user={unifiedProfile}
              stats={currentStats}
              isOwnProfile={true}
              isPremium={!premiumLoading ? isPremium : false}
              onStatsUpdate={handleStatsUpdate}
              onProfileUpdate={handleProfileUpdated}
            />
          </motion.div>
        </div>

        {/* Desktop Stats */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <MobileStatsGrid2025
              stats={currentStats}
              isOwnProfile={true}
            />
          </motion.div>
        </div>

        {/* Profile Content with Privacy-Aware Tabs */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <PrivacyAwareProfileTabs
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              isOwnProfile={true}
              profileUserId={user?.id}
            />
          </motion.div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <ModernEditProfileDialog
        currentProfile={unifiedProfile}
        onProfileUpdated={handleProfileUpdated}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </div>
  );
};

export default ProfilePage;
