
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const usePostActions = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const toggleBookmark = async (postId: string) => {
    if (!user) {
      toast.error('Please login to bookmark posts');
      return false;
    }

    setIsLoading(true);
    try {
      // Check if already bookmarked
      const { data: existing } = await supabase
        .from('post_bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .single();

      if (existing) {
        // Remove bookmark
        await supabase
          .from('post_bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId);
        
        toast.success('Bookmark removed');
        return false;
      } else {
        // Add bookmark
        await supabase
          .from('post_bookmarks')
          .insert({
            user_id: user.id,
            post_id: postId
          });
        
        toast.success('Post bookmarked');
        return true;
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Failed to update bookmark');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const reportPost = async (postId: string, reason: string, description?: string) => {
    if (!user) {
      toast.error('Please login to report posts');
      return false;
    }

    setIsLoading(true);
    try {
      await supabase
        .from('post_reports')
        .insert({
          user_id: user.id,
          post_id: postId,
          reason,
          description
        });
      
      toast.success('Post reported successfully');
      return true;
    } catch (error: any) {
      console.error('Error reporting post:', error);
      if (error.code === '23505') {
        toast.error('You have already reported this post');
      } else {
        toast.error('Failed to report post');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    if (!user) return false;

    setIsLoading(true);
    try {
      await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);
      
      toast.success('Post deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfBookmarked = async (postId: string) => {
    if (!user) return false;

    try {
      const { data } = await supabase
        .from('post_bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .single();
      
      return !!data;
    } catch (error) {
      return false;
    }
  };

  return {
    toggleBookmark,
    reportPost,
    deletePost,
    checkIfBookmarked,
    isLoading
  };
};
