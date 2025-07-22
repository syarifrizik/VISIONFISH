
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Activity {
  id: string;
  user_id: string;
  type: string;
  title: string;
  description?: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

interface UseActivitiesManagementOptions {
  profileUserId?: string;
  isOwnProfile?: boolean;
}

export const useActivitiesManagement = (options: UseActivitiesManagementOptions = {}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { profileUserId, isOwnProfile = true } = options;
  
  // Determine which user ID to use for data fetching
  const targetUserId = profileUserId || user?.id;
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    if (!targetUserId) {
      setIsLoading(false);
      return;
    }

    try {
      console.log('useActivitiesManagement: Fetching activities for user:', targetUserId, 'isOwnProfile:', isOwnProfile);
      setError(null);
      setIsLoading(true);
      
      // For other users (not own profile), check if activities should be shown
      if (!isOwnProfile) {
        // First try to get privacy settings, but don't fail if they don't exist
        const { data: privacyData, error: privacyError } = await supabase
          .from('privacy_settings')
          .select('show_activity')
          .eq('user_id', targetUserId)
          .maybeSingle();
        
        // If privacy settings exist and show_activity is false, don't fetch activities
        if (privacyData && privacyData.show_activity === false) {
          console.log('useActivitiesManagement: Activities are private for user:', targetUserId);
          setActivities([]);
          setIsLoading(false);
          return;
        }
        
        // If privacy settings don't exist or there's an error, default to allowing viewing (public)
        if (privacyError && privacyError.code !== 'PGRST116') {
          console.warn('useActivitiesManagement: Privacy settings error (defaulting to public):', privacyError);
        }
      }
      
      // Fetch from user_activities table - RLS policy will handle access control
      const { data, error: fetchError } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });
      
      if (fetchError) {
        console.error('useActivitiesManagement: Supabase error:', fetchError);
        throw new Error(fetchError.message);
      }

      const activitiesList = (data || []).map(activity => ({
        id: activity.id,
        user_id: activity.user_id,
        type: activity.activity_type,
        title: activity.activity_type.replace('_', ' ').toUpperCase(),
        description: `Aktivitas ${activity.activity_type}`,
        metadata: activity.metadata || {},
        created_at: activity.created_at,
        updated_at: activity.created_at
      })) as Activity[];
      
      setActivities(activitiesList);
      
      console.log('useActivitiesManagement: Activities fetched successfully:', activitiesList.length, 'for user:', targetUserId, 'isOwnProfile:', isOwnProfile);
      console.log('useActivitiesManagement: Sample activity data:', activitiesList[0]);
    } catch (err) {
      console.error('useActivitiesManagement: Error fetching activities:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch activities';
      setError(errorMessage);
      
      // Only show toast for own profile errors to avoid spam
      if (isOwnProfile) {
        toast({
          title: "❌ Gagal Memuat Aktivitas",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [targetUserId, isOwnProfile, toast]);

  // Initial load
  useEffect(() => {
    if (targetUserId) {
      console.log('useActivitiesManagement: Initial load for user:', targetUserId, 'isOwnProfile:', isOwnProfile);
      fetchActivities();
    }
  }, [targetUserId, isOwnProfile, fetchActivities]);

  return {
    activities,
    isLoading,
    error,
    refreshActivities: fetchActivities
  };
};
