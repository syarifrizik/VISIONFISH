
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface UserCounts {
  all: number;
  followers: number;
  nonFollowers: number;
  total: number;
}

interface UseOptimizedUserCountsReturn {
  counts: UserCounts;
  isLoading: boolean;
  error: string | null;
  refreshCounts: () => Promise<void>;
  updateActiveTabCount: (activeTab: string, count: number) => void;
}

export const useOptimizedUserCounts = (): UseOptimizedUserCountsReturn => {
  const { user } = useAuth();
  const [counts, setCounts] = useState<UserCounts>({
    all: 0,
    followers: 0,
    nonFollowers: 0,
    total: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTabCount, setActiveTabCount] = useState(0);
  const currentActiveTab = useRef<string>('all');
  
  const fetchAllCounts = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch all data in a single optimized query batch
      const [
        allUsersResult,
        followersResult,
        followingResult
      ] = await Promise.all([
        // Get total users count (excluding current user)
        supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .neq('id', user.id),
        
        // Get followers count
        supabase
          .from('user_follows')
          .select('follower_id', { count: 'exact', head: true })
          .eq('following_id', user.id),
        
        // Get following count (to calculate non-followers)
        supabase
          .from('user_follows')
          .select('following_id', { count: 'exact', head: true })
          .eq('follower_id', user.id)
      ]);

      const allUsersCount = allUsersResult.count || 0;
      const followersCount = followersResult.count || 0;
      const followingCount = followingResult.count || 0;
      
      // Calculate non-followers (all users minus the ones we're following)
      const nonFollowersCount = Math.max(0, allUsersCount - followingCount);

      const newCounts = {
        all: allUsersCount,
        followers: followersCount,
        nonFollowers: nonFollowersCount,
        total: allUsersCount // Default to all users for total
      };

      setCounts(newCounts);
      
      // Set initial active tab count based on current active tab
      setActiveTabCount(newCounts[currentActiveTab.current as keyof Omit<UserCounts, 'total'>] || newCounts.all);

    } catch (error) {
      console.error('Error fetching user counts:', error);
      setError('Gagal memuat data pengguna');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Update the total count based on the currently active tab
  const updateActiveTabCount = useCallback((activeTab: string, count: number) => {
    currentActiveTab.current = activeTab;
    setActiveTabCount(count);
    
    // Update the total in counts to reflect the current active tab
    setCounts(prev => ({
      ...prev,
      total: count
    }));
  }, []);

  // Initial load with debouncing
  useEffect(() => {
    if (user?.id) {
      const timeoutId = setTimeout(() => {
        fetchAllCounts();
      }, 100); // Small debounce to prevent rapid calls

      return () => clearTimeout(timeoutId);
    }
  }, [fetchAllCounts]);

  return {
    counts: {
      ...counts,
      total: activeTabCount // Always use the active tab count as total
    },
    isLoading,
    error,
    refreshCounts: fetchAllCounts,
    updateActiveTabCount
  };
};
