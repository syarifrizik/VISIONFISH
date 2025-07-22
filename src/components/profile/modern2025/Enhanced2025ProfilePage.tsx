
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileData } from '@/hooks/useProfileData';
import { Settings, Activity, Shield, User, Fish, BookOpen } from 'lucide-react';
import Ultra2025ProfileHeader from '../mobile2025/Ultra2025ProfileHeader';
import MobileStatsGrid2025 from '../mobile2025/MobileStatsGrid2025';
import ModernPrivacySettings from './ModernPrivacySettings';
import ModernCommunityTab2025 from '../enhanced/ModernCommunityTab2025';

const Enhanced2025ProfilePage = () => {
  const { user } = useAuth();
  const { profile, stats, isLoading } = useProfileData();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <h2 className="text-2xl font-semibold text-white">Akses Terbatas</h2>
          <p className="text-white/70">Silakan login untuk melihat profil</p>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-white/30 border-t-cyan-400 rounded-full"
        />
      </div>
    );
  }

  // Transform ProfileData to UserProfile format to fix type compatibility
  const transformedProfile = {
    id: profile.id,
    username: profile.username || '', // Ensure username is always a string
    display_name: profile.display_name || profile.username || '',
    bio: profile.bio,
    avatar_url: profile.avatar_url,
    location: profile.location,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
    followers_count: profile.followers_count,
    following_count: profile.following_count,
    is_private: profile.is_private,
    is_online: profile.is_online,
    last_seen_at: profile.last_seen_at,
    privacy_settings: profile.privacy_settings
  };

  const tabItems = [
    { id: 'overview', label: 'Ringkasan', icon: User },
    { id: 'activity', label: 'Aktivitas', icon: Activity },
    { id: 'catches', label: 'Tangkapan', icon: Fish },
    { id: 'community', label: 'Komunitas', icon: BookOpen },
    { id: 'privacy', label: 'Privasi', icon: Shield },
    { id: 'settings', label: 'Pengaturan', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-br from-cyan-400/15 via-blue-500/10 to-purple-600/20 rounded-full blur-3xl"
          style={{ top: '20%', right: '15%' }}
          animate={{
            scale: [1, 1.2, 1.1, 1],
            opacity: [0.3, 0.6, 0.4, 0.3],
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          className="absolute w-80 h-80 bg-gradient-to-br from-pink-400/20 via-purple-500/15 to-cyan-400/20 rounded-full blur-2xl"
          style={{ bottom: '10%', left: '10%' }}
          animate={{
            scale: [1, 1.3, 0.9, 1.1, 1],
            opacity: [0.2, 0.5, 0.3, 0.4, 0.2],
            x: [0, -25, 15, -10, 0],
            y: [0, 25, -35, 15, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
      </div>

      <div className="relative z-10">
        {/* Modern Profile Header */}
        <Ultra2025ProfileHeader
          user={transformedProfile}
          stats={stats}
          isOwnProfile={true}
          isPremium={false}
        />

        {/* Stats Grid */}
        <MobileStatsGrid2025
          stats={stats}
          isOwnProfile={true}
        />

        {/* Enhanced Tabs */}
        <div className="px-4 pb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab Navigation */}
            <div className="mb-6">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-1">
                {tabItems.map((tab) => (
                  <TabsTrigger 
                    key={tab.id}
                    value={tab.id} 
                    className="flex flex-col items-center gap-1 p-3 text-white/70 data-[state=active]:text-white data-[state=active]:bg-white/20 rounded-xl transition-all duration-200"
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="overview" className="mt-0">
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
                    <h2 className="text-xl font-bold text-white mb-4">Ringkasan Profil</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-white/5 rounded-xl p-4">
                          <h3 className="text-white font-medium mb-2">Informasi Dasar</h3>
                          <div className="space-y-2 text-sm text-white/70">
                            <p>Nama: {transformedProfile.display_name}</p>
                            <p>Username: @{transformedProfile.username}</p>
                            <p>Lokasi: {transformedProfile.location || 'Tidak disebutkan'}</p>
                          </div>
                        </div>
                        
                        <div className="bg-white/5 rounded-xl p-4">
                          <h3 className="text-white font-medium mb-2">Statistik</h3>
                          <div className="space-y-2 text-sm text-white/70">
                            <p>Total Tangkapan: {stats.total_catches}</p>
                            <p>Total Postingan: {stats.total_posts}</p>
                            <p>Pengikut: {stats.followers_count}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-white/5 rounded-xl p-4">
                          <h3 className="text-white font-medium mb-2">Bio</h3>
                          <p className="text-sm text-white/70 leading-relaxed">
                            {transformedProfile.bio || 'Belum ada bio yang ditambahkan.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="mt-0">
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
                    <h2 className="text-xl font-bold text-white mb-4">Aktivitas Terbaru</h2>
                    <div className="text-center py-8">
                      <Activity className="w-16 h-16 text-white/30 mx-auto mb-4" />
                      <p className="text-white/60">Belum ada aktivitas untuk ditampilkan</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="catches" className="mt-0">
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
                    <h2 className="text-xl font-bold text-white mb-4">Tangkapan Ikan</h2>
                    <div className="text-center py-8">
                      <Fish className="w-16 h-16 text-white/30 mx-auto mb-4" />
                      <p className="text-white/60 mb-4">Belum ada tangkapan yang tercatat</p>
                      <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                        Tambah Tangkapan Pertama
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="community" className="mt-0">
                  <ModernCommunityTab2025 />
                </TabsContent>

                <TabsContent value="privacy" className="mt-0">
                  <ModernPrivacySettings />
                </TabsContent>

                <TabsContent value="settings" className="mt-0">
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
                    <h2 className="text-xl font-bold text-white mb-4">Pengaturan Akun</h2>
                    <div className="text-center py-8">
                      <Settings className="w-16 h-16 text-white/30 mx-auto mb-4" />
                      <p className="text-white/60">Pengaturan akan segera tersedia</p>
                    </div>
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Enhanced2025ProfilePage;
