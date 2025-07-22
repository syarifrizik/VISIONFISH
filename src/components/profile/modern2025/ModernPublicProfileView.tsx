
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MessageCircle, UserPlus, UserCheck, Shield, Settings, Share2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PrivacySettings {
  profile_visibility: 'public' | 'members_only' | 'private';
  photo_visibility: 'public' | 'members_only' | 'private';
  bio_visibility: 'public' | 'members_only' | 'private';
  stats_visibility: 'public' | 'members_only' | 'private';
}

interface ModernProfile {
  id: string;
  display_name: string;
  username: string;
  avatar_url: string;
  bio: string;
  location: string;
  created_at: string;
  followers_count: number;
  following_count: number;
  fish_caught: number;
  privacy_settings?: PrivacySettings;
  is_private: boolean;
}

const ModernPublicProfileView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<ModernProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchProfile();
      checkFollowStatus();
    }
  }, [userId]);

  const fetchProfile = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Parse privacy_settings from jsonb
      let privacySettings: PrivacySettings = {
        profile_visibility: 'public',
        photo_visibility: 'public',
        bio_visibility: 'public',
        stats_visibility: 'public'
      };

      if (data.privacy_settings && typeof data.privacy_settings === 'object') {
        privacySettings = {
          profile_visibility: (data.privacy_settings as any).profile_visibility || 'public',
          photo_visibility: (data.privacy_settings as any).photo_visibility || 'public',
          bio_visibility: (data.privacy_settings as any).bio_visibility || 'public',
          stats_visibility: (data.privacy_settings as any).stats_visibility || 'public'
        };
      }

      const transformedProfile: ModernProfile = {
        id: data.id,
        display_name: data.display_name || data.username || 'User',
        username: data.username || 'user',
        avatar_url: data.avatar_url || '',
        bio: data.bio || '',
        location: data.location || '',
        created_at: data.created_at,
        followers_count: data.followers_count || 0,
        following_count: data.following_count || 0,
        fish_caught: data.fish_caught || 0,
        is_private: data.is_private || false,
        privacy_settings: privacySettings
      };

      setProfile(transformedProfile);

      // Check privacy access
      if (transformedProfile.privacy_settings?.profile_visibility === 'private' && user?.id !== userId) {
        toast.error('Profil ini bersifat privat');
        navigate('/');
        return;
      }
      
      if (transformedProfile.privacy_settings?.profile_visibility === 'members_only' && !user) {
        toast.error('Silakan login untuk melihat profil ini');
        navigate('/auth');
        return;
      }

    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    if (!user?.id || !userId) return;
    
    try {
      const { data } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', userId)
        .single();
      
      setIsFollowing(!!data);
    } catch (error) {
      setIsFollowing(false);
    }
  };

  const handleFollow = async () => {
    if (!user?.id || !userId) return;

    try {
      if (isFollowing) {
        await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', userId);
        
        setIsFollowing(false);
        toast.success('Berhenti mengikuti');
      } else {
        await supabase
          .from('user_follows')
          .insert({
            follower_id: user.id,
            following_id: userId
          });
        
        setIsFollowing(true);
        toast.success('Berhasil mengikuti');
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
      toast.error('Gagal mengubah status mengikuti');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center">
        <motion.div
          className="text-center space-y-6"
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <h1 className="text-2xl font-bold text-white">Profil Tidak Ditemukan</h1>
          <p className="text-white/70">Pengguna yang Anda cari tidak ditemukan</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-br from-cyan-400/20 via-blue-500/15 to-purple-600/25 rounded-full blur-3xl"
          style={{ top: '10%', right: '10%' }}
          animate={{
            scale: [1, 1.3, 1.1, 1],
            opacity: [0.2, 0.5, 0.3, 0.2],
            x: [0, 40, -30, 0],
            y: [0, -50, 30, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10 backdrop-blur-xl rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
              className="text-white/70 hover:bg-white/10 rounded-xl"
            >
              {showPrivacyInfo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:bg-white/10 rounded-xl"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Privacy Info */}
        <AnimatePresence>
          {showPrivacyInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span className="text-white font-medium">Pengaturan Privasi</span>
                </div>
                <div className="text-sm text-white/70 space-y-1">
                  <p>Profil: {profile.privacy_settings?.profile_visibility === 'public' ? 'Publik' : 'Terbatas'}</p>
                  <p>Foto: {profile.privacy_settings?.photo_visibility === 'public' ? 'Publik' : 'Terbatas'}</p>
                  <p>Bio: {profile.privacy_settings?.bio_visibility === 'public' ? 'Publik' : 'Terbatas'}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Profile Header */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <Avatar className="h-32 w-32 ring-4 ring-white/30 shadow-2xl">
                  <AvatarImage src={profile.avatar_url} alt={profile.display_name} />
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white text-4xl">
                    {profile.display_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {profile.is_private && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                  <h1 className="text-3xl font-bold text-white">{profile.display_name}</h1>
                  <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-400/30 w-fit">
                    Angler Aktif
                  </Badge>
                </div>
                
                <p className="text-cyan-300 mb-4 text-lg">@{profile.username}</p>
                
                {profile.location && (
                  <p className="text-white/70 mb-4">{profile.location}</p>
                )}
                
                {profile.privacy_settings?.bio_visibility !== 'private' && profile.bio && (
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/10">
                    <p className="text-white/90 leading-relaxed">{profile.bio}</p>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{profile.fish_caught}</div>
                    <div className="text-xs text-white/60">Tangkapan</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{profile.followers_count}</div>
                    <div className="text-xs text-white/60">Pengikut</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{profile.following_count}</div>
                    <div className="text-xs text-white/60">Mengikuti</div>
                  </div>
                </div>

                {/* Action Buttons */}
                {user?.id !== userId && (
                  <div className="flex gap-3 justify-center md:justify-start">
                    <Button
                      onClick={handleFollow}
                      className={`${
                        isFollowing 
                          ? 'bg-white/20 hover:bg-white/30 text-white' 
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'
                      } backdrop-blur-xl shadow-lg`}
                    >
                      {isFollowing ? (
                        <UserCheck className="w-4 h-4 mr-2" />
                      ) : (
                        <UserPlus className="w-4 h-4 mr-2" />
                      )}
                      {isFollowing ? 'Mengikuti' : 'Ikuti'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 backdrop-blur-xl"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity Placeholder */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-4">Aktivitas Terbaru</h2>
            <div className="text-center py-8">
              <p className="text-white/60">Belum ada aktivitas untuk ditampilkan</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernPublicProfileView;
