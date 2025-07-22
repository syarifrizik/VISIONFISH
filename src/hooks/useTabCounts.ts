
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface TabCounts {
  myContent: number;
  notes: number;
  publicFeed: number;
  activity: number;
}

export const useTabCounts = () => {
  const { user } = useAuth();
  const [counts, setCounts] = useState<TabCounts>({
    myContent: 0,
    notes: 0,
    publicFeed: 0,
    activity: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchCounts = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Batch all queries for better performance and consistency
      const [
        fishCatchesResult,
        notesResult,
        profileItemsResult,
        activitiesResult
      ] = await Promise.all([
        supabase.from('fish_catches').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('notes').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('user_profile_items').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('user_activities').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
      ]);

      // Update all counts atomically to prevent inconsistencies
      setCounts({
        myContent: (fishCatchesResult.count || 0) + (profileItemsResult.count || 0),
        notes: notesResult.count || 0,
        publicFeed: fishCatchesResult.count || 0,
        activity: activitiesResult.count || 0
      });
    } catch (error) {
      console.error('Error fetching tab counts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchCounts();
    }
  }, [fetchCounts]);

  return { counts, isLoading, refreshCounts: fetchCounts };
};
