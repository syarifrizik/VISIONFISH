
import { useAuth } from '@/hooks/useAuth';
import { 
  trackProfileUpdate, 
  trackContentCreation, 
  trackNoteCreation, 
  trackFishCatch,
  trackFollowAction,
  trackCommunityPost,
  trackAchievement
} from '@/services/activityTrackingService';

export const useActivityTracking = () => {
  const { user } = useAuth();

  const trackProfileUpdateActivity = async (changes: string[]) => {
    if (!user?.id) return false;
    return await trackProfileUpdate(user.id, changes);
  };

  const trackContentCreationActivity = async (contentType: string, contentId: string, title?: string) => {
    if (!user?.id) return false;
    return await trackContentCreation(user.id, contentType, contentId, title);
  };

  const trackNoteCreationActivity = async (noteId: string, title: string) => {
    if (!user?.id) return false;
    return await trackNoteCreation(user.id, noteId, title);
  };

  const trackFishCatchActivity = async (catchId: string, species: string, weight?: number, location?: string) => {
    if (!user?.id) return false;
    return await trackFishCatch(user.id, catchId, species, weight, location);
  };

  const trackFollowActivity = async (targetUserId: string, action: 'follow' | 'unfollow') => {
    if (!user?.id) return false;
    return await trackFollowAction(user.id, targetUserId, action);
  };

  const trackCommunityPostActivity = async (postId: string, title: string) => {
    if (!user?.id) return false;
    return await trackCommunityPost(user.id, postId, title);
  };

  const trackAchievementActivity = async (achievementId: string, title: string) => {
    if (!user?.id) return false;
    return await trackAchievement(user.id, achievementId, title);
  };

  return {
    trackProfileUpdateActivity,
    trackContentCreationActivity,
    trackNoteCreationActivity,
    trackFishCatchActivity,
    trackFollowActivity,
    trackCommunityPostActivity,
    trackAchievementActivity
  };
};
