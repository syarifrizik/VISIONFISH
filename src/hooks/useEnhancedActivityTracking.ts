
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedActivityMetadata {
  // Message activities
  content_preview?: string;
  message_type?: 'general' | 'news' | 'question' | 'promotion';
  
  // Fishing activities
  species_name?: string;
  weight?: string | number;
  location?: string;
  fishing_gear?: string;
  
  // Social activities
  target_user?: string;
  target_username?: string;
  target_type?: 'post' | 'comment' | 'message';
  
  // Achievement activities
  achievement_name?: string;
  new_level?: number;
  expires_at?: string;
  
  // Learning activities
  title?: string;
  analysis_type?: string;
  
  // General metadata
  media_url?: string;
  additional_data?: Record<string, any>;
}

export const useEnhancedActivityTracking = () => {
  const { user } = useAuth();

  const trackActivity = async (
    activityType: string, 
    metadata: EnhancedActivityMetadata = {}
  ) => {
    if (!user?.id) return;

    try {
      // Convert metadata to proper JSON format for Supabase
      const jsonMetadata = JSON.parse(JSON.stringify(metadata));
      
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          metadata: jsonMetadata
        });

      if (error) throw error;
      console.log(`Activity tracked: ${activityType}`, metadata);
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  };

  // Specific tracking methods
  const trackFishCatch = async (fishData: {
    species_name: string;
    weight?: number;
    location?: string;
    fishing_gear?: string;
  }) => {
    await trackActivity('fish_catch_added', {
      species_name: fishData.species_name,
      weight: fishData.weight?.toString(),
      location: fishData.location,
      fishing_gear: fishData.fishing_gear
    });
  };

  const trackMessage = async (messageData: {
    content_preview: string;
    message_type?: 'general' | 'news' | 'question' | 'promotion';
  }) => {
    await trackActivity('message_sent', {
      content_preview: messageData.content_preview.substring(0, 100),
      message_type: messageData.message_type || 'general'
    });
  };

  const trackPostCreation = async (postData: {
    title?: string;
    content_preview?: string;
  }) => {
    await trackActivity('post_created', {
      title: postData.title,
      content_preview: postData.content_preview?.substring(0, 100)
    });
  };

  const trackFollow = async (targetUser: {
    username: string;
    display_name?: string;
  }) => {
    await trackActivity('user_followed', {
      target_username: targetUser.username,
      target_user: targetUser.display_name || targetUser.username
    });
  };

  const trackAchievement = async (achievementData: {
    achievement_name: string;
    category?: string;
  }) => {
    await trackActivity('achievement_unlocked', {
      achievement_name: achievementData.achievement_name,
      additional_data: { category: achievementData.category }
    });
  };

  const trackLevelUp = async (newLevel: number) => {
    await trackActivity('level_up', {
      new_level: newLevel
    });
  };

  const trackPremiumActivation = async (expiresAt?: string) => {
    await trackActivity('premium_activated', {
      expires_at: expiresAt
    });
  };

  const trackNoteCreation = async (noteData: {
    title: string;
    category?: string;
  }) => {
    await trackActivity('note_created', {
      title: noteData.title,
      additional_data: { category: noteData.category }
    });
  };

  const trackSpeciesIdentification = async (speciesData: {
    species_name: string;
    confidence_score?: number;
  }) => {
    await trackActivity('species_identified', {
      species_name: speciesData.species_name,
      additional_data: { confidence_score: speciesData.confidence_score }
    });
  };

  const trackFishingTripCompletion = async (tripData: {
    location?: string;
    total_catch?: number;
    duration_hours?: number;
  }) => {
    await trackActivity('fishing_trip_completed', {
      location: tripData.location,
      additional_data: {
        total_catch: tripData.total_catch,
        duration_hours: tripData.duration_hours
      }
    });
  };

  return {
    trackActivity,
    trackFishCatch,
    trackMessage,
    trackPostCreation,
    trackFollow,
    trackAchievement,
    trackLevelUp,
    trackPremiumActivation,
    trackNoteCreation,
    trackSpeciesIdentification,
    trackFishingTripCompletion
  };
};
