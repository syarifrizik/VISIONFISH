
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ActivityFeedItem {
  id: string;
  user_id: string;
  activity_type: string;
  created_at: string;
  metadata?: any;
  target_message_id?: string;
  profiles?: {
    display_name: string;
    username: string;
    avatar_url?: string;
  };
}

export const useEnhancedActivityFeed = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        
        // First get activities
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (activitiesError) throw activitiesError;

        // Then get profile data separately
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, display_name, username, avatar_url')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.warn('Profile not found, using default profile');
        }

        const activitiesWithProfiles = (activitiesData || []).map(activity => ({
          ...activity,
          profiles: profileData || {
            display_name: 'Unknown User',
            username: 'unknown',
            avatar_url: null
          }
        }));
        
        setActivities(activitiesWithProfiles);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch activities');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();

    // Setup realtime subscription
    const channel = supabase
      .channel('user-activities')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_activities',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchActivities();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return { activities, isLoading, error };
};
