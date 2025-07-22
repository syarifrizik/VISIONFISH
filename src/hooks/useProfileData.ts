
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { ProfileData } from './useProfile';
import { ProfileStats } from '@/types/profile';

interface UseProfileDataReturn {
  profile: ProfileData | null;
  stats: ProfileStats;
  isLoading: boolean;
  error: string | null;
  isPremium: boolean;
  refetch: () => Promise<void>;
  updateProfileState: (updatedData: Partial<ProfileData>) => void; // New method for immediate updates
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

export const useProfileData = (userId?: string): UseProfileDataReturn => {
  const { user, isPremium: authIsPremium } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<ProfileStats>({
    total_catches: 0,
    total_posts: 0,
    followers_count: 0,
    following_count: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  const targetUserId = userId || user?.id;

  // New method for immediate profile state updates
  const updateProfileState = (updatedData: Partial<ProfileData>) => {
    console.log('useProfileData: Immediate state update with:', updatedData);
    setProfile(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedData };
      console.log('useProfileData: Updated profile state:', updated);
      return updated;
    });
  };

  const fetchProfileData = async () => {
    if (!targetUserId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('useProfileData: Fetching profile data for user:', targetUserId);

      // Fetch profile data with more specific selection
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          display_name,
          bio,
          avatar_url,
          location,
          fish_caught,
          created_at,
          updated_at,
          followers_count,
          following_count,
          is_private,
          is_online,
          last_seen_at,
          privacy_settings
        `)
        .eq('id', targetUserId)
        .maybeSingle();

      if (profileError) {
        throw new Error(`Profile error: ${profileError.message}`);
      }

      console.log('useProfileData: Raw profile data fetched:', profileData);

      // Fetch stats data in parallel
      const [fishCatchesRes, notesRes, followsRes, profileItemsRes, premiumRes] = await Promise.allSettled([
        supabase.from('fish_catches').select('id', { count: 'exact' }).eq('user_id', targetUserId),
        supabase.from('notes').select('id', { count: 'exact' }).eq('user_id', targetUserId),
        supabase.from('user_follows').select('follower_id, following_id').or(`follower_id.eq.${targetUserId},following_id.eq.${targetUserId}`),
        supabase.from('user_profile_items').select('id', { count: 'exact' }).eq('user_id', targetUserId),
        supabase.rpc('is_user_premium', { user_uuid: targetUserId })
      ]);

      // Process results safely
      const fishCatches = fishCatchesRes.status === 'fulfilled' ? (fishCatchesRes.value.count || 0) : 0;
      const notes = notesRes.status === 'fulfilled' ? (notesRes.value.count || 0) : 0;
      const profileItems = profileItemsRes.status === 'fulfilled' ? (profileItemsRes.value.count || 0) : 0;
      
      let followersCount = 0;
      let followingCount = 0;
      if (followsRes.status === 'fulfilled' && followsRes.value.data) {
        followersCount = followsRes.value.data.filter(f => f.following_id === targetUserId).length;
        followingCount = followsRes.value.data.filter(f => f.follower_id === targetUserId).length;
      }

      const premiumStatus = premiumRes.status === 'fulfilled' ? !!premiumRes.value.data : authIsPremium;

      // Set profile data with STRICT DATABASE PRIORITY for avatar
      if (profileData) {
        const parsedProfile: ProfileData = {
          id: profileData.id,
          username: profileData.username || '',
          display_name: profileData.display_name || profileData.username || '',
          bio: profileData.bio || '',
          avatar_url: profileData.avatar_url || '', // STRICT: Only use database value, no fallback
          location: profileData.location || '',
          fish_caught: profileData.fish_caught || fishCatches,
          created_at: profileData.created_at || new Date().toISOString(),
          updated_at: profileData.updated_at,
          followers_count: profileData.followers_count || followersCount,
          following_count: profileData.following_count || followingCount,
          is_private: profileData.is_private || false,
          is_online: profileData.is_online || false,
          last_seen_at: profileData.last_seen_at,
          privacy_settings: parsePrivacySettings(profileData.privacy_settings)
        };
        
        console.log('useProfileData: Final profile with DATABASE-ONLY avatar_url:', parsedProfile.avatar_url);
        setProfile(parsedProfile);
      } else {
        console.log('useProfileData: No profile data found for user:', targetUserId);
        setProfile(null);
      }

      // Set stats
      setStats({
        total_catches: fishCatches,
        total_posts: notes + profileItems,
        followers_count: followersCount,
        following_count: followingCount
      });

      setIsPremium(premiumStatus);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('useProfileData: Error fetching profile data:', err);
      
      toast({
        title: "❌ Gagal Memuat Data",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [targetUserId]);

  return {
    profile,
    stats,
    isLoading,
    error,
    isPremium,
    refetch: fetchProfileData,
    updateProfileState // Export the new immediate update method
  };
};
