
import { supabase } from '@/integrations/supabase/client';

export interface ActivityData {
  activity_type: string;
  target_id?: string;
  metadata?: any;
}

export const trackActivity = async (userId: string, activityData: ActivityData) => {
  try {
    const { error } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        activity_type: activityData.activity_type,
        target_message_id: activityData.target_id,
        metadata: activityData.metadata || {}
      });

    if (error) {
      console.error('Error tracking activity:', error);
      return false;
    }

    console.log('Activity tracked:', activityData.activity_type);
    return true;
  } catch (error) {
    console.error('Error in trackActivity:', error);
    return false;
  }
};

// Track profile updates
export const trackProfileUpdate = async (userId: string, changes: string[]) => {
  return trackActivity(userId, {
    activity_type: 'profile_updated',
    metadata: {
      changes,
      timestamp: new Date().toISOString()
    }
  });
};

// Track content creation
export const trackContentCreation = async (userId: string, contentType: string, contentId: string, title?: string) => {
  return trackActivity(userId, {
    activity_type: 'content_created',
    target_id: contentId,
    metadata: {
      content_type: contentType,
      title,
      timestamp: new Date().toISOString()
    }
  });
};

// Track note creation
export const trackNoteCreation = async (userId: string, noteId: string, title: string) => {
  return trackActivity(userId, {
    activity_type: 'note_created',
    target_id: noteId,
    metadata: {
      title,
      timestamp: new Date().toISOString()
    }
  });
};

// Track fish catch
export const trackFishCatch = async (userId: string, catchId: string, species: string, weight?: number, location?: string) => {
  return trackActivity(userId, {
    activity_type: 'fish_caught',
    target_id: catchId,
    metadata: {
      species,
      weight,
      location,
      timestamp: new Date().toISOString()
    }
  });
};

// Track follow/unfollow
export const trackFollowAction = async (userId: string, targetUserId: string, action: 'follow' | 'unfollow') => {
  return trackActivity(userId, {
    activity_type: action === 'follow' ? 'user_followed' : 'user_unfollowed',
    target_id: targetUserId,
    metadata: {
      target_user: targetUserId,
      timestamp: new Date().toISOString()
    }
  });
};

// Track community post creation
export const trackCommunityPost = async (userId: string, postId: string, title: string) => {
  return trackActivity(userId, {
    activity_type: 'community_post_created',
    target_id: postId,
    metadata: {
      title,
      timestamp: new Date().toISOString()
    }
  });
};

// Track achievement earned
export const trackAchievement = async (userId: string, achievementId: string, title: string) => {
  return trackActivity(userId, {
    activity_type: 'achievement_earned',
    target_id: achievementId,
    metadata: {
      title,
      timestamp: new Date().toISOString()
    }
  });
};
