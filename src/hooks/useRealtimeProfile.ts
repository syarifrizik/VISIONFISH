
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProfileStats } from '@/types/profile';

interface UseRealtimeProfileProps {
  userId: string;
  onStatsUpdate: (stats: ProfileStats) => void;
  enabled?: boolean;
}

export const useRealtimeProfile = ({ 
  userId, 
  onStatsUpdate, 
  enabled = true 
}: UseRealtimeProfileProps) => {
  const channelsRef = useRef<any[]>([]);

  useEffect(() => {
    if (!userId || !enabled) return;

    const setupRealtimeSubscriptions = () => {
      const timestamp = Date.now();
      
      try {
        // Subscribe to fish catches
        const catchesChannel = supabase
          .channel(`profile-catches-${userId}-${timestamp}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'fish_catches',
            filter: `user_id=eq.${userId}`
          }, () => {
            console.log('Fish catches updated, refreshing stats...');
            refreshStats();
          })
          .subscribe((status) => {
            if (status === 'CHANNEL_ERROR') {
              console.error('Catches channel error');
            }
          });

        // Subscribe to notes
        const notesChannel = supabase
          .channel(`profile-notes-${userId}-${timestamp + 1}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'notes',
            filter: `user_id=eq.${userId}`
          }, () => {
            console.log('Notes updated, refreshing stats...');
            refreshStats();
          })
          .subscribe();

        // Subscribe to profile items
        const profileItemsChannel = supabase
          .channel(`profile-items-${userId}-${timestamp + 2}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'user_profile_items',
            filter: `user_id=eq.${userId}`
          }, () => {
            console.log('Profile items updated, refreshing stats...');
            refreshStats();
          })
          .subscribe();

        // Subscribe to follows
        const followsChannel = supabase
          .channel(`profile-follows-${userId}-${timestamp + 3}`)
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'user_follows',
            filter: `follower_id=eq.${userId}`
          }, () => refreshStats())
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'user_follows',
            filter: `following_id=eq.${userId}`
          }, () => refreshStats())
          .subscribe();

        channelsRef.current = [catchesChannel, notesChannel, profileItemsChannel, followsChannel];
      } catch (error) {
        console.error('Error setting up real-time subscriptions:', error);
      }
    };

    const refreshStats = async () => {
      try {
        const [fishCatchesRes, notesRes, followsRes, profileItemsRes] = await Promise.allSettled([
          supabase.from('fish_catches').select('id', { count: 'exact' }).eq('user_id', userId),
          supabase.from('notes').select('id', { count: 'exact' }).eq('user_id', userId),
          supabase.from('user_follows').select('follower_id, following_id').or(`follower_id.eq.${userId},following_id.eq.${userId}`),
          supabase.from('user_profile_items').select('id', { count: 'exact' }).eq('user_id', userId)
        ]);

        const fishCatches = fishCatchesRes.status === 'fulfilled' ? (fishCatchesRes.value.count || 0) : 0;
        const notes = notesRes.status === 'fulfilled' ? (notesRes.value.count || 0) : 0;
        const profileItems = profileItemsRes.status === 'fulfilled' ? (profileItemsRes.value.count || 0) : 0;
        
        let followersCount = 0;
        let followingCount = 0;
        if (followsRes.status === 'fulfilled' && followsRes.value.data) {
          followersCount = followsRes.value.data.filter(f => f.following_id === userId).length;
          followingCount = followsRes.value.data.filter(f => f.follower_id === userId).length;
        }

        const newStats: ProfileStats = {
          total_catches: fishCatches,
          total_posts: notes + profileItems,
          followers_count: followersCount,
          following_count: followingCount
        };

        onStatsUpdate(newStats);
      } catch (error) {
        console.error('Error refreshing stats:', error);
      }
    };

    setupRealtimeSubscriptions();

    // Cleanup function
    return () => {
      console.log('Cleaning up real-time subscriptions');
      channelsRef.current.forEach(channel => {
        if (channel) {
          supabase.removeChannel(channel);
        }
      });
      channelsRef.current = [];
    };
  }, [userId, enabled, onStatsUpdate]);
};
