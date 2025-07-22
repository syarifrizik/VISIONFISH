import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfileUnified } from '@/hooks/useUserProfileUnified';
import PrivacyAwareProfileTabs from '@/components/profile/PrivacyAwareProfileTabs';
import Ultra2025ProfileHeader from '@/components/profile/mobile2025/Ultra2025ProfileHeader';
import ModernChatPopup from '@/components/chat/ModernChatPopup';
import MobileSafeContainer from '@/components/layout/MobileSafeContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';

interface ChatUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  is_online: boolean;
}

const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user: currentUser, isLoggedIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Chat popup state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedChatUser, setSelectedChatUser] = useState<ChatUser | null>(null);

  // Debug logging for userId parameter
  useEffect(() => {
    console.log('UserProfile rendered with userId:', userId);
    console.log('Current URL params:', window.location.pathname);
  }, [userId]);

  const {
    user: profile,
    stats,
    isLoading,
    error,
    canViewProfile,
    isFollowing,
    followLoading,
    handleFollow,
    handleMessage,
    refreshProfile
  } = useUserProfileUnified(userId || '');

  // Debug profile loading
  useEffect(() => {
    console.log('Profile data:', { profile, userId, currentUser: currentUser?.id });
  }, [profile, userId, currentUser]);

  // Handle chat button click
  const handleChatClick = () => {
    if (!profile || !currentUser) return;
    
    console.log('Opening chat with user:', profile);
    
    const chatUser: ChatUser = {
      id: profile.id,
      username: profile.username || 'user',
      display_name: profile.display_name || profile.username || 'User',
      avatar_url: profile.avatar_url || '',
      is_online: false // Default to false since UnifiedUser doesn't have is_online property
    };
    
    setSelectedChatUser(chatUser);
    setIsChatOpen(true);
  };

  const handleCloseChatPopup = () => {
    setIsChatOpen(false);
    setSelectedChatUser(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 relative z-10"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="text-xl font-bold text-white">Akses Terbatas</h1>
          <p className="text-white/70">Silakan login untuk melihat profil pengguna</p>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center">
        <motion.div
          className="text-center space-y-6 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-white/30 border-t-cyan-400 rounded-full mx-auto"
          />
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-white">Memuat Profil</h3>
            <p className="text-white/70">Mengambil data pengguna...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 relative z-10"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h1 className="text-xl font-bold text-white">
            {error ? 'Terjadi Kesalahan' : 'Profil Tidak Ditemukan'}
          </h1>
          <p className="text-white/70">
            {error || 'Pengguna yang Anda cari tidak ditemukan'}
          </p>
        </motion.div>
      </div>
    );
  }

  // Check if this is current user's own profile - redirect to /profile
  if (currentUser?.id === userId) {
    console.log('Redirecting to own profile');
    navigate('/profile');
    return null;
  }

  // Check if profile is private and user can't view it
  if (!canViewProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 relative z-10"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="text-xl font-bold text-white">Profil Privat</h1>
          <p className="text-white/70">
            Profil ini bersifat privat. Ikuti pengguna ini untuk melihat profilnya.
          </p>
        </motion.div>
      </div>
    );
  }

  // Transform UnifiedUser to UserProfile to match Ultra2025ProfileHeader expectations
  const transformedProfile = {
    ...profile,
    created_at: new Date().toISOString() // Add missing created_at field with current timestamp
  };

  const PageContent = () => (
    <>
      <div className="relative z-10 space-y-6">
        {/* Modern Profile Header */}
        <Ultra2025ProfileHeader
          user={transformedProfile}
          stats={stats}
          isOwnProfile={false}
          isFollowing={isFollowing}
          followLoading={followLoading}
          onBack={() => navigate(-1)}
          onFollow={handleFollow}
          onMessage={handleChatClick} // Updated to use our chat handler
          canViewProfile={canViewProfile}
          isPremium={false}
        />

        {/* Profile Content - Pass the correct userId to ensure proper data filtering */}
        {canViewProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
          >
            <PrivacyAwareProfileTabs 
              isOwnProfile={false} 
              profileUserId={userId} // This is the key fix - pass the actual userId from URL
              profileOwnerName={profile.display_name || profile.username || 'User'}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </motion.div>
        )}
      </div>

      {/* Chat Popup - Positioned with high z-index */}
      <ModernChatPopup
        isOpen={isChatOpen}
        onClose={handleCloseChatPopup}
        selectedUser={selectedChatUser}
      />
    </>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
        <MobileSafeContainer variant="full" className="pb-24">
          <div className="px-4 py-6">
            <PageContent />
          </div>
        </MobileSafeContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 relative overflow-hidden">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <PageContent />
      </div>
    </div>
  );
};

export default UserProfilePage;
