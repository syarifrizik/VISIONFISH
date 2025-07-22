
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProfileStats } from '@/types/profile';

interface UseRealtimeProfileSync2025Options {
  userId: string;
  onStatsUpdate?: (stats: ProfileStats) => void;
  enabled?: boolean;
}

interface UseRealtimeProfileSync2025Return {
  isOnline: boolean;
  lastSync: Date | null;
  syncError: string | null;
  forceRefresh: () => Promise<boolean>;
}

export const useRealtimeProfileSync2025 = ({
  userId,
  onStatsUpdate,
  enabled = true
}: UseRealtimeProfileSync2025Options): UseRealtimeProfileSync2025Return => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch and sync profile stats
  const syncProfileStats = useCallback(async (): Promise<boolean> => {
    if (!enabled || !userId || !isOnline) return false;

    try {
      setSyncError(null);

      // Fetch stats in parallel
      const [fishCatchesRes, notesRes, followsRes] = await Promise.allSettled([
        supabase.from('fish_catches').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('notes').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('user_follows').select('follower_id, following_id').or(`follower_id.eq.${userId},following_id.eq.${userId}`)
      ]);

      // Process results safely
      const fishCatches = fishCatchesRes.status === 'fulfilled' ? (fishCatchesRes.value.count || 0) : 0;
      const notes = notesRes.status === 'fulfilled' ? (notesRes.value.count || 0) : 0;
      
      let followersCount = 0;
      let followingCount = 0;
      if (followsRes.status === 'fulfilled' && followsRes.value.data) {
        followersCount = followsRes.value.data.filter(f => f.following_id === userId).length;
        followingCount = followsRes.value.data.filter(f => f.follower_id === userId).length;
      }

      const stats: ProfileStats = {
        total_catches: fishCatches,
        total_posts: notes,
        followers_count: followersCount,
        following_count: followingCount
      };

      if (onStatsUpdate) {
        onStatsUpdate(stats);
      }

      setLastSync(new Date());
      return true;

    } catch (error) {
      console.error('Sync error:', error);
      setSyncError(error instanceof Error ? error.message : 'Sync failed');
      return false;
    }
  }, [userId, enabled, isOnline, onStatsUpdate]);

  // Auto sync on mount and periodically
  useEffect(() => {
    if (!enabled) return;

    syncProfileStats();

    // Sync every 30 seconds
    const interval = setInterval(syncProfileStats, 30000);

    return () => clearInterval(interval);
  }, [syncProfileStats, enabled]);

  // Set up realtime subscriptions
  useEffect(() => {
    if (!enabled || !userId) return;

    const channels = [
      supabase
        .channel('profile-fish-catches')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'fish_catches',
          filter: `user_id=eq.${userId}`
        }, () => {
          syncProfileStats();
        }),

      supabase
        .channel('profile-notes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'notes',
          filter: `user_id=eq.${userId}`
        }, () => {
          syncProfileStats();
        }),

      supabase
        .channel('profile-follows')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'user_follows'
        }, () => {
          syncProfileStats();
        })
    ];

    channels.forEach(channel => channel.subscribe());

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [enabled, userId, syncProfileStats]);

  const forceRefresh = useCallback(async (): Promise<boolean> => {
    console.log('🔄 Force refreshing profile data...');
    return await syncProfileStats();
  }, [syncProfileStats]);

  return {
    isOnline,
    lastSync,
    syncError,
    forceRefresh
  };
};
