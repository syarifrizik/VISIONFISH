
import { supabase } from '@/integrations/supabase/client';

export interface CommunityPostView {
  id: string;
  post_id: string;
  user_id?: string;
  viewed_at: string;
  ip_address?: string;
}

class CommunityPostViewsService {
  private viewSessionCache = new Set<string>();
  private viewTimeouts = new Map<string, NodeJS.Timeout>();
  private readonly MIN_VIEW_DURATION = 3000; // 3 seconds minimum
  private readonly DEBOUNCE_TIME = 1000; // 1 second debounce

  /**
   * Record a view for a community post (like YouTube)
   * - 1 user can only view once per post
   * - Minimum viewing time required
   * - Debounced to prevent spam
   */
  async recordView(postId: string, userId?: string): Promise<{ success: boolean; isFirstView: boolean }> {
    try {
      const sessionKey = `${postId}-${userId || 'guest'}`;
      
      // Check if already viewed in this session
      if (this.viewSessionCache.has(sessionKey)) {
        return { success: true, isFirstView: false };
      }

      // Check if user already viewed this post in database
      if (userId) {
        const { data: existingView } = await supabase
          .from('community_post_views')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', userId)
          .maybeSingle();

        if (existingView) {
          this.viewSessionCache.add(sessionKey);
          return { success: true, isFirstView: false };
        }
      }

      // Record the view
      const { error } = await supabase
        .from('community_post_views')
        .insert({
          post_id: postId,
          user_id: userId || null,
          viewed_at: new Date().toISOString(),
          ip_address: null // Will be handled by RLS/triggers if needed
        });

      if (error) {
        console.error('Error recording view:', error);
        return { success: false, isFirstView: false };
      }

      // Add to session cache
      this.viewSessionCache.add(sessionKey);
      
      console.log('View recorded successfully for post:', postId);
      return { success: true, isFirstView: true };
    } catch (error) {
      console.error('Error in recordView:', error);
      return { success: false, isFirstView: false };
    }
  }

  /**
   * Record view with minimum duration check (like YouTube)
   */
  recordViewWithDuration(postId: string, userId?: string): Promise<{ success: boolean; isFirstView: boolean }> {
    return new Promise((resolve) => {
      const timeoutId = setTimeout(async () => {
        const result = await this.recordView(postId, userId);
        this.viewTimeouts.delete(postId);
        resolve(result);
      }, this.MIN_VIEW_DURATION);

      this.viewTimeouts.set(postId, timeoutId);
    });
  }

  /**
   * Cancel view recording if user leaves too quickly
   */
  cancelViewRecording(postId: string): void {
    const timeoutId = this.viewTimeouts.get(postId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.viewTimeouts.delete(postId);
    }
  }

  /**
   * Check if user has already viewed this post
   */
  async hasUserViewed(postId: string, userId?: string): Promise<boolean> {
    if (!userId) return false;

    try {
      const { data, error } = await supabase
        .from('community_post_views')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking view status:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error in hasUserViewed:', error);
      return false;
    }
  }

  /**
   * Get view count for a post
   */
  async getViewCount(postId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('community_post_views')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

      if (error) {
        console.error('Error getting view count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getViewCount:', error);
      return 0;
    }
  }

  /**
   * Clear session cache (useful for logout)
   */
  clearSessionCache(): void {
    this.viewSessionCache.clear();
    this.viewTimeouts.forEach(timeout => clearTimeout(timeout));
    this.viewTimeouts.clear();
  }
}

export const communityPostViewsService = new CommunityPostViewsService();
