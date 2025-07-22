
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface TabCounts {
  allUsers: number;
  followers: number;
  nonFollowers: number;
  myContent: number;
  publicFeed: number;
  notes: number;
  activity: number;
}

export const useTabCounts = () => {
  const { user } = useAuth();
  const [counts, setCounts] = useState<TabCounts>({
    allUsers: 0,
    followers: 0,
    nonFollowers: 0,
    myContent: 0,
    publicFeed: 0,
    notes: 0,
    activity: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchCounts = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      // Fetch all counts in parallel for better performance
      const [
        allUsersResult,
        followersResult,
        followingResult,
        myContentResult,
        publicFeedResult,
        notesResult,
        activityResult
      ] = await Promise.all([
        // All users count (excluding current user)
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .neq('id', user.id),
        
        // Followers count
        supabase
          .from('user_follows')
          .select('follower_id', { count: 'exact', head: true })
          .eq('following_id', user.id),
        
        // Following count (for non-followers calculation)
        supabase
          .from('user_follows')
          .select('following_id', { count: 'exact', head: true })
          .eq('follower_id', user.id),
        
        // My content count (fish catches + posts)
        Promise.all([
          supabase
            .from('fish_catches')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id),
          supabase
            .from('posts')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
        ]),
        
        // Public feed count
        supabase
          .from('community_posts')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true),
        
        // Notes count
        supabase
          .from('notes')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
        
        // Activity count (user activities)
        supabase
          .from('user_activities')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
      ]);

      const allUsersCount = allUsersResult.count || 0;
      const followersCount = followersResult.count || 0;
      const followingCount = followingResult.count || 0;
      
      // Calculate non-followers (all users minus followers minus self)
      const nonFollowersCount = Math.max(0, allUsersCount - followingCount);
      
      // My content count (fish catches + posts)
      const [fishCatchesResult, postsResult] = myContentResult;
      const myContentCount = (fishCatchesResult.count || 0) + (postsResult.count || 0);
      
      const publicFeedCount = publicFeedResult.count || 0;
      const notesCount = notesResult.count || 0;
      const activityCount = activityResult.count || 0;

      setCounts({
        allUsers: allUsersCount,
        followers: followersCount,
        nonFollowers: nonFollowersCount,
        myContent: myContentCount,
        publicFeed: publicFeedCount,
        notes: notesCount,
        activity: activityCount
      });

    } catch (error) {
      console.error('Error fetching tab counts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Initial load and periodic refresh
  useEffect(() => {
    if (user?.id) {
      fetchCounts();
      
      // Refresh counts every 30 seconds
      const interval = setInterval(fetchCounts, 30000);
      return () => clearInterval(interval);
    }
  }, [fetchCounts]);

  return {
    counts,
    isLoading,
    refreshCounts: fetchCounts
  };
};
