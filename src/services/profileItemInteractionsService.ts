
import { supabase } from '@/integrations/supabase/client';

export interface ProfileItemLike {
  id: string;
  user_id: string;
  item_id: string;
  created_at: string;
}

export interface ProfileItemComment {
  id: string;
  user_id: string;
  item_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileItemView {
  id: string;
  user_id?: string;
  item_id: string;
  viewed_at: string;
  ip_address?: string;
}

// Like functions
export const toggleLike = async (itemId: string, userId: string): Promise<{ success: boolean; isLiked: boolean }> => {
  try {
    // Check if already liked
    const { data: existingLike, error: checkError } = await supabase
      .from('user_profile_item_likes')
      .select('id')
      .eq('item_id', itemId)
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing like:', checkError);
      throw checkError;
    }

    if (existingLike) {
      // Unlike
      const { error: deleteError } = await supabase
        .from('user_profile_item_likes')
        .delete()
        .eq('id', existingLike.id);

      if (deleteError) {
        console.error('Error removing like:', deleteError);
        throw deleteError;
      }
      
      console.log('Like removed successfully');
      return { success: true, isLiked: false };
    } else {
      // Like
      const { error: insertError } = await supabase
        .from('user_profile_item_likes')
        .insert({ item_id: itemId, user_id: userId });

      if (insertError) {
        console.error('Error adding like:', insertError);
        throw insertError;
      }
      
      console.log('Like added successfully');
      return { success: true, isLiked: true };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return { success: false, isLiked: false };
  }
};

export const checkIfLiked = async (itemId: string, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_profile_item_likes')
      .select('id')
      .eq('item_id', itemId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error checking if liked:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in checkIfLiked:', error);
    return false;
  }
};

// View functions - hanya 1 view per user per item
export const recordView = async (itemId: string, userId?: string): Promise<{ success: boolean }> => {
  try {
    // Jika user sudah login, cek apakah sudah pernah view
    if (userId) {
      const { data: existingView } = await supabase
        .from('user_profile_item_views')
        .select('id')
        .eq('item_id', itemId)
        .eq('user_id', userId)
        .maybeSingle();

      // Jika sudah pernah view, jangan tambah lagi
      if (existingView) {
        console.log('User already viewed this item');
        return { success: true };
      }
    }

    const { error } = await supabase
      .from('user_profile_item_views')
      .insert({
        item_id: itemId,
        user_id: userId || null,
        viewed_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error recording view:', error);
      throw error;
    }

    console.log('View recorded successfully');
    return { success: true };
  } catch (error) {
    console.error('Error in recordView:', error);
    return { success: false };
  }
};

// Comment functions
export const addComment = async (itemId: string, userId: string, content: string): Promise<{ success: boolean; comment?: ProfileItemComment }> => {
  try {
    const { data, error } = await supabase
      .from('user_profile_item_comments')
      .insert({
        item_id: itemId,
        user_id: userId,
        content: content.trim()
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      throw error;
    }

    console.log('Comment added successfully');
    return { success: true, comment: data };
  } catch (error) {
    console.error('Error in addComment:', error);
    return { success: false };
  }
};

export const getComments = async (itemId: string): Promise<ProfileItemComment[]> => {
  try {
    const { data, error } = await supabase
      .from('user_profile_item_comments')
      .select(`
        *,
        profiles!user_id(username, display_name, avatar_url)
      `)
      .eq('item_id', itemId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getComments:', error);
    return [];
  }
};

export const deleteComment = async (commentId: string): Promise<{ success: boolean }> => {
  try {
    const { error } = await supabase
      .from('user_profile_item_comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }

    console.log('Comment deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('Error in deleteComment:', error);
    return { success: false };
  }
};

// Get interaction stats
export const getItemStats = async (itemId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_profile_items')
      .select('views_count, likes_count, comments_count, stats')
      .eq('id', itemId)
      .single();

    if (error) {
      console.error('Error fetching item stats:', error);
      throw error;
    }
    
    return {
      views: data.views_count || 0,
      likes: data.likes_count || 0,
      comments: data.comments_count || 0,
      shares: (data.stats as any)?.shares || 0
    };
  } catch (error) {
    console.error('Error in getItemStats:', error);
    return { views: 0, likes: 0, comments: 0, shares: 0 };
  }
};
