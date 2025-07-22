
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Calendar, Users, Fish, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PublicProfileContentProps {
  userId: string;
  profileData: {
    id: string;
    display_name: string;
    username: string;
    avatar_url: string;
    bio: string;
    location: string;
    created_at: string;
  };
  stats: {
    total_posts: number;
    total_catches: number;
    following_count: number;
    followers_count: number;
  };
}

interface PrivacySettings {
  profile_visibility: string;
  show_activity: boolean;
  show_followers: boolean;
  show_catches: boolean;
}

const PublicProfileContent = ({ userId, profileData, stats }: PublicProfileContentProps) => {
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings | null>(null);
  const [recentCatches, setRecentCatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, [userId]);

  const loadProfileData = async () => {
    try {
      // Load privacy settings
      const { data: privacy } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      setPrivacySettings(privacy || {
        profile_visibility: 'public',
        show_activity: true,
        show_followers: true,
        show_catches: true
      });

      // Load recent catches if allowed
      if (!privacy || privacy.show_catches !== false) {
        const { data: catches } = await supabase
          .from('fish_catches')
          .select('*')
          .eq('user_id', userId)
          .eq('is_private', false)
          .order('created_at', { ascending: false })
          .limit(3);

        setRecentCatches(catches || []);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Basic Profile Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 ring-4 ring-white/30">
            <AvatarImage src={profileData.avatar_url} alt={profileData.display_name} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl">
              {profileData.display_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
              <h1 className="text-2xl font-bold text-white">{profileData.display_name}</h1>
              <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-400/30 w-fit">
                Angler
              </Badge>
            </div>
            
            <p className="text-purple-300 mb-3">@{profileData.username}</p>
            
            {profileData.bio && (
              <p className="text-white/80 mb-4">{profileData.bio}</p>
            )}
            
            <div className="flex flex-wrap gap-4 text-sm text-white/60">
              {profileData.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {profileData.location}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Bergabung {new Date(profileData.created_at).toLocaleDateString('id-ID', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Public Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Statistik Publik</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {privacySettings?.show_catches !== false && (
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <Fish className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.total_catches}</div>
                  <div className="text-sm text-white/60">Tangkapan</div>
                </div>
              )}
              
              {privacySettings?.show_followers !== false && (
                <>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{stats.followers_count}</div>
                    <div className="text-sm text-white/60">Pengikut</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{stats.following_count}</div>
                    <div className="text-sm text-white/60">Mengikuti</div>
                  </div>
                </>
              )}
              
              {privacySettings?.show_activity !== false && (
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.total_posts}</div>
                  <div className="text-sm text-white/60">Postingan</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Catches (if allowed) */}
      {privacySettings?.show_catches !== false && recentCatches.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Tangkapan Terbaru</h3>
              <div className="grid gap-4">
                {recentCatches.map((catch_item, index) => (
                  <div key={catch_item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                    <Fish className="w-8 h-8 text-blue-400" />
                    <div className="flex-1">
                      <h4 className="font-medium">{catch_item.species_name}</h4>
                      <div className="text-sm text-white/60 flex gap-4">
                        {catch_item.weight_kg && (
                          <span>{catch_item.weight_kg} kg</span>
                        )}
                        {catch_item.location && (
                          <span>{catch_item.location}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-white/60">
                      {new Date(catch_item.created_at).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Privacy Notice */}
      {(privacySettings?.show_activity === false || 
        privacySettings?.show_followers === false || 
        privacySettings?.show_catches === false) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-yellow-500/10 backdrop-blur-xl border-yellow-500/20 text-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full flex-shrink-0"></div>
                <p className="text-sm">
                  Beberapa informasi profil dibatasi oleh pengaturan privasi pengguna
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default PublicProfileContent;
