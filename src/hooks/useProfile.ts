
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from './use-toast';

export interface ProfileData {
  id: string;
  username?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  fish_caught?: number;
  created_at: string;
  updated_at?: string;
  followers_count?: number;
  following_count?: number;
  is_private?: boolean;
  is_online?: boolean;
  last_seen_at?: string;
  privacy_settings?: {
    bio_visibility: string;
    photo_visibility: string;
    stats_visibility: string;
    profile_visibility: string;
  };
}

// Helper function to safely parse privacy settings
const parsePrivacySettings = (data: any) => {
  const defaultSettings = {
    bio_visibility: 'public',
    photo_visibility: 'public',
    stats_visibility: 'public',
    profile_visibility: 'public'
  };

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return defaultSettings;
  }

  return {
    bio_visibility: typeof data.bio_visibility === 'string' ? data.bio_visibility : 'public',
    photo_visibility: typeof data.photo_visibility === 'string' ? data.photo_visibility : 'public',
    stats_visibility: typeof data.stats_visibility === 'string' ? data.stats_visibility : 'public',
    profile_visibility: typeof data.profile_visibility === 'string' ? data.profile_visibility : 'public'
  };
};

export const useProfile = (userId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Start with false
  const [error, setError] = useState<Error | null>(null);

  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (targetUserId) {
      // Quick profile fetch without long loading
      fetchProfileQuick(targetUserId);
    } else {
      setIsLoading(false);
    }
  }, [targetUserId]);

  const fetchProfileQuick = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Quick profile fetch for user:', id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        throw new Error(error.message);
      }
      
      if (data) {
        const profileData: ProfileData = {
          id: data.id,
          username: data.username || 'user_' + data.id.slice(0, 8),
          display_name: data.display_name || data.username || 'User',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
          location: data.location || '',
          fish_caught: data.fish_caught || 0,
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || undefined,
          followers_count: data.followers_count || 0,
          following_count: data.following_count || 0,
          is_private: data.is_private || false,
          is_online: data.is_online || false,
          last_seen_at: data.last_seen_at || undefined,
          privacy_settings: parsePrivacySettings(data.privacy_settings)
        };
        
        setProfile(profileData);
        console.log('Profile loaded quickly:', profileData);
      } else {
        // Create basic profile if doesn't exist
        console.log('Profile not found, creating basic profile for user:', id);
        const basicProfile: ProfileData = {
          id: id,
          username: 'user_' + id.slice(0, 8),
          display_name: 'User',
          bio: '',
          avatar_url: '',
          location: '',
          fish_caught: 0,
          created_at: new Date().toISOString(),
          followers_count: 0,
          following_count: 0,
          is_private: false,
          is_online: false,
          privacy_settings: parsePrivacySettings(null)
        };
        setProfile(basicProfile);
        
        // Try to create in background
        try {
          await supabase.from('profiles').insert({
            id: id,
            username: basicProfile.username,
            display_name: basicProfile.display_name,
            fish_caught: 0
          });
        } catch (createError) {
          console.log('Profile creation in background failed:', createError);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error fetching profile'));
      console.error('Error fetching profile:', err);
      
      // Still show basic profile on error
      if (id) {
        const fallbackProfile: ProfileData = {
          id: id,
          username: 'user_' + id.slice(0, 8),
          display_name: 'User',
          bio: '',
          avatar_url: '',
          location: '',
          fish_caught: 0,
          created_at: new Date().toISOString(),
          followers_count: 0,
          following_count: 0,
          is_private: false,
          is_online: false,
          privacy_settings: parsePrivacySettings(null)
        };
        setProfile(fallbackProfile);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfile = async (id: string) => {
    return fetchProfileQuick(id);
  };

  const updateProfile = async (updates: Partial<ProfileData>) => {
    try {
      if (!targetUserId) {
        throw new Error('No user ID available');
      }
      
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', targetUserId)
        .select()
        .maybeSingle();
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data) {
        const updatedProfileData: ProfileData = {
          id: data.id,
          username: data.username || '',
          display_name: data.display_name || data.username || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
          location: data.location || '',
          fish_caught: data.fish_caught || 0,
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || undefined,
          followers_count: data.followers_count || 0,
          following_count: data.following_count || 0,
          is_private: data.is_private || false,
          is_online: data.is_online || false,
          last_seen_at: data.last_seen_at || undefined,
          privacy_settings: parsePrivacySettings(data.privacy_settings)
        };
        
        setProfile(updatedProfileData);
        
        toast({
          title: "✨ Profil Diperbarui!",
          description: "Informasi profil Anda berhasil disimpan",
        });
        return { success: true, data: updatedProfileData };
      }
      return { success: false, error: new Error('No data returned') };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error updating profile'));
      console.error('Error updating profile:', err);
      toast({
        title: "❌ Gagal Memperbarui",
        description: err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga",
        variant: "destructive"
      });
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile
  };
};
