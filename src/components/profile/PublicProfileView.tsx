import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, UserPlus, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { supabase } from '@/integrations/supabase/client';

interface PrivacySettings {
  profile_visibility: 'public' | 'members_only' | 'private';
  photo_visibility: 'public' | 'members_only' | 'private';
  bio_visibility: 'public' | 'members_only' | 'private';
  stats_visibility: 'public' | 'members_only' | 'private';
}

interface PublicProfile {
  id: string;
  display_name: string;
  username: string;
  avatar_url: string;
  bio: string;
  location: string;
  created_at: string;
  updated_at: string;
  privacy_settings?: PrivacySettings;
}

const PublicProfileView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

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

      // Parse privacy settings safely with proper type checking
      let privacySettings: PrivacySettings = {
        profile_visibility: 'public',
        photo_visibility: 'public',
        bio_visibility: 'public',
        stats_visibility: 'public'
      };

      if (data.privacy_settings) {
        try {
          // Handle JSONB field properly
          const settings = typeof data.privacy_settings === 'string' 
            ? JSON.parse(data.privacy_settings) 
            : data.privacy_settings;
          
          if (settings && typeof settings === 'object' && !Array.isArray(settings)) {
            privacySettings = {
              profile_visibility: (settings as any).profile_visibility || 'public',
              photo_visibility: (settings as any).photo_visibility || 'public',
              bio_visibility: (settings as any).bio_visibility || 'public',
              stats_visibility: (settings as any).stats_visibility || 'public'
            };
          }
        } catch (parseError) {
          console.warn('Could not parse privacy settings, using defaults', parseError);
        }
      }

      const transformedProfile: PublicProfile = {
        id: data.id,
        display_name: data.display_name || data.username || 'User',
        username: data.username || 'user',
        avatar_url: data.avatar_url || '',
        bio: data.bio || '',
        location: data.location || '',
        created_at: data.created_at,
        updated_at: data.updated_at,
        privacy_settings: privacySettings
      };

      setProfile(transformedProfile);

      // Check privacy settings
      if (privacySettings.profile_visibility === 'private' && user?.id !== userId) {
        showNotification('Profil ini bersifat privat', 'error');
        navigate('/');
        return;
      }
      
      if (privacySettings.profile_visibility === 'members_only' && !user) {
        showNotification('Silakan login untuk melihat profil ini', 'error');
        navigate('/auth');
        return;
      }

    } catch (error) {
      console.error('Error fetching profile:', error);
      showNotification('Gagal memuat profil', 'error');
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
      // Error means no follow relationship exists
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
        showNotification('Berhenti mengikuti', 'success');
      } else {
        await supabase
          .from('user_follows')
          .insert({
            follower_id: user.id,
            following_id: userId
          });
        
        setIsFollowing(true);
        showNotification('Berhasil mengikuti', 'success');
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
      showNotification('Gagal mengubah status mengikuti', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#49225B] via-[#6E3482] to-[#A56ABD] flex items-center justify-center">
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 border-4 border-[#E7D0EF]/30 border-t-white rounded-full mx-auto"
          />
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-[#F5EBFA]">Memuat Profil</h3>
            <p className="text-[#E7D0EF] text-lg">Mengambil data pengguna...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#49225B] via-[#6E3482] to-[#A56ABD] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <h1 className="text-2xl font-bold text-[#F5EBFA]">Profil Tidak Ditemukan</h1>
          <p className="text-[#E7D0EF]">Pengguna yang Anda cari tidak ditemukan</p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#49225B] via-[#6E3482] to-[#A56ABD]">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-[#F5EBFA] hover:bg-white/10 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-[#A56ABD]/20">
            <div className="flex items-center gap-6 mb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar_url} alt={profile.display_name} />
                <AvatarFallback className="bg-[#6E3482] text-[#F5EBFA] text-2xl">
                  {profile.display_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-[#F5EBFA] mb-2">{profile.display_name}</h1>
                <p className="text-[#A56ABD] mb-2">@{profile.username}</p>
                
                {profile.location && (
                  <p className="text-[#E7D0EF] mb-3">{profile.location}</p>
                )}
                
                {profile.privacy_settings?.bio_visibility !== 'private' && profile.bio && (
                  <p className="text-[#E7D0EF]">{profile.bio}</p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              {user?.id !== userId && (
                <>
                  <Button
                    onClick={handleFollow}
                    className={`${
                      isFollowing 
                        ? 'bg-gray-600 hover:bg-gray-700' 
                        : 'bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482]'
                    } text-white`}
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
                    className="border-[#A56ABD]/30 text-[#A56ABD] hover:bg-[#A56ABD]/10"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicProfileView;
