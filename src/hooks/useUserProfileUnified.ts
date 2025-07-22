
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface UnifiedUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  location?: string;
  bio?: string;
  fish_caught?: number;
  is_following?: boolean;
  is_private?: boolean;
  followers_count?: number;
  following_count?: number;
  privacy_settings?: {
    profile_visibility: 'public' | 'members_only' | 'private';
    bio_visibility: 'public' | 'members_only' | 'private';
    photo_visibility: 'public' | 'members_only' | 'private';
    stats_visibility: 'public' | 'members_only' | 'private';
  };
}

export interface UserStats {
  total_posts: number;
  total_catches: number;
  followers_count: number;
  following_count: number;
}

interface UseUserProfileUnifiedReturn {
  user: UnifiedUser | null;
  stats: UserStats;
  isLoading: boolean;
  error: string | null;
  canViewProfile: boolean;
  isFollowing: boolean;
  followLoading: boolean;
  handleFollow: () => Promise<void>;
  handleMessage: () => void;
  handleViewProfile: () => void;
  refreshProfile: () => Promise<void>;
}

// Helper function to safely parse privacy settings
const parsePrivacySettings = (settings: any) => {
  if (!settings || typeof settings !== 'object') {
    return {
      profile_visibility: 'public' as const,
      bio_visibility: 'public' as const,
      photo_visibility: 'public' as const,
      stats_visibility: 'public' as const
    };
  }

  return {
    profile_visibility: (settings.profile_visibility || 'public') as 'public' | 'members_only' | 'private',
    bio_visibility: (settings.bio_visibility || 'public') as 'public' | 'members_only' | 'private',
    photo_visibility: (settings.photo_visibility || 'public') as 'public' | 'members_only' | 'private',
    stats_visibility: (settings.stats_visibility || 'public') as 'public' | 'members_only' | 'private'
  };
};

export const useUserProfileUnified = (userId: string): UseUserProfileUnifiedReturn => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  
  const [user, setUser] = useState<UnifiedUser | null>(null);
  const [stats, setStats] = useState<UserStats>({
    total_posts: 0,
    total_catches: 0,
    followers_count: 0,
    following_count: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canViewProfile, setCanViewProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const checkPrivacyAccess = useCallback((userData: any) => {
    if (!userData) return false;
    
    const privacySettings = parsePrivacySettings(userData.privacy_settings);
    const profileVisibility = privacySettings.profile_visibility;
    const isPrivate = userData.is_private || false;

    // Public profiles are always accessible
    if (profileVisibility === 'public' && !isPrivate) {
      return true;
    }

    // Own profile is always accessible
    if (currentUser?.id === userId) {
      return true;
    }

    // Private profiles require following
    if (profileVisibility === 'private' || isPrivate) {
      return isFollowing;
    }

    // Members only requires login
    if (profileVisibility === 'members_only') {
      return !!currentUser;
    }

    return true;
  }, [currentUser, userId, isFollowing]);

  const loadUserProfile = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Load user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Load stats in parallel
      const [fishRes, postsRes, followRes] = await Promise.allSettled([
        supabase.from('fish_catches').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('user_profile_items').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('user_follows').select('follower_id, following_id').or(`follower_id.eq.${userId},following_id.eq.${userId}`)
      ]);

      const fishCount = fishRes.status === 'fulfilled' ? (fishRes.value.count || 0) : 0;
      const postsCount = postsRes.status === 'fulfilled' ? (postsRes.value.count || 0) : 0;
      
      let followersCount = 0;
      let followingCount = 0;
      if (followRes.status === 'fulfilled' && followRes.value.data) {
        followersCount = followRes.value.data.filter(f => f.following_id === userId).length;
        followingCount = followRes.value.data.filter(f => f.follower_id === userId).length;
      }

      const transformedUser: UnifiedUser = {
        id: profileData.id,
        username: profileData.username || `user_${profileData.id.slice(0, 8)}`,
        display_name: profileData.display_name || profileData.username || 'User',
        avatar_url: profileData.avatar_url,
        location: profileData.location,
        bio: profileData.bio,
        fish_caught: profileData.fish_caught || fishCount,
        is_private: profileData.is_private || false,
        followers_count: followersCount,
        following_count: followingCount,
        privacy_settings: parsePrivacySettings(profileData.privacy_settings)
      };

      setUser(transformedUser);
      setStats({
        total_posts: postsCount,
        total_catches: fishCount,
        followers_count: followersCount,
        following_count: followingCount
      });

      setCanViewProfile(checkPrivacyAccess(transformedUser));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
      setError(errorMessage);
      console.error('Error loading user profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, checkPrivacyAccess]);

  const checkFollowStatus = useCallback(async () => {
    if (!currentUser?.id || !userId) return;

    try {
      const { data } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', currentUser.id)
        .eq('following_id', userId)
        .single();

      setIsFollowing(!!data);
    } catch (error) {
      setIsFollowing(false);
    }
  }, [currentUser?.id, userId]);

  const handleFollow = async () => {
    if (!currentUser?.id || !userId || followLoading) return;

    setFollowLoading(true);
    try {
      if (isFollowing) {
        const { error } = await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', userId);

        if (error) throw error;

        setIsFollowing(false);
        setStats(prev => ({ ...prev, followers_count: prev.followers_count - 1 }));
        toast({
          title: "Berhenti Mengikuti",
          description: "Berhasil berhenti mengikuti pengguna",
        });
      } else {
        const { error } = await supabase
          .from('user_follows')
          .insert({
            follower_id: currentUser.id,
            following_id: userId
          });

        if (error) throw error;

        setIsFollowing(true);
        setStats(prev => ({ ...prev, followers_count: prev.followers_count + 1 }));
        toast({
          title: "Mengikuti",
          description: "Berhasil mengikuti pengguna",
        });
      }

      // Recheck privacy access after follow status change
      if (user) {
        setCanViewProfile(checkPrivacyAccess(user));
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
      toast({
        title: "Error",
        description: "Gagal mengubah status mengikuti",
        variant: "destructive"
      });
    } finally {
      setFollowLoading(false);
    }
  };

  const handleMessage = () => {
    if (!currentUser) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login untuk memulai chat",
        variant: "destructive"
      });
      return;
    }
    window.location.href = `/chat/${userId}`;
  };

  const handleViewProfile = () => {
    window.location.href = `/user/${userId}`;
  };

  const refreshProfile = async () => {
    await loadUserProfile();
    await checkFollowStatus();
  };

  useEffect(() => {
    loadUserProfile();
    checkFollowStatus();
  }, [loadUserProfile, checkFollowStatus]);

  return {
    user,
    stats,
    isLoading,
    error,
    canViewProfile,
    isFollowing,
    followLoading,
    handleFollow,
    handleMessage,
    handleViewProfile,
    refreshProfile
  };
};
