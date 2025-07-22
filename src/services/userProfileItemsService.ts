
import { supabase } from '@/integrations/supabase/client';

export interface UserProfileItem {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  video_url: string | null;
  location: string | null;
  date: string;
  category: 'achievement' | 'activity' | 'statistic';
  is_private: boolean;
  views_count: number;
  likes_count: number;
  comments_count: number;
  profiles?: {
    username: string;
    display_name: string;
    avatar_url: string | null;
  };
  stats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
}

export const fetchUserProfileItems = async (userId: string): Promise<UserProfileItem[]> => {
  try {
    const { data, error } = await supabase
      .from('user_profile_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user profile items:', error);
      throw error;
    }

    return data?.map(item => ({
      ...item,
      category: item.category as 'achievement' | 'activity' | 'statistic',
      video_url: null,
      stats: {
        views: item.views_count || 0,
        likes: item.likes_count || 0,
        comments: item.comments_count || 0,
        shares: 0
      }
    })) || [];
  } catch (error) {
    console.error('Error in fetchUserProfileItems:', error);
    throw error;
  }
};

export const fetchPublicProfileItems = async (profileUserId?: string): Promise<UserProfileItem[]> => {
  try {
    let query = supabase
      .from('user_profile_items')
      .select(`
        *,
        profiles!inner(username, display_name, avatar_url)
      `)
      .eq('is_private', false)
      .order('created_at', { ascending: false });

    if (profileUserId) {
      query = query.eq('user_id', profileUserId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching public profile items:', error);
      throw error;
    }

    return data?.map(item => ({
      ...item,
      category: item.category as 'achievement' | 'activity' | 'statistic',
      video_url: null,
      profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles,
      stats: {
        views: item.views_count || 0,
        likes: item.likes_count || 0,
        comments: item.comments_count || 0,
        shares: 0
      }
    })) || [];
  } catch (error) {
    console.error('Error in fetchPublicProfileItems:', error);
    throw error;
  }
};

export const createUserProfileItem = async (item: Omit<UserProfileItem, 'id' | 'created_at' | 'stats' | 'profiles' | 'views_count' | 'likes_count' | 'comments_count'>): Promise<{ success: boolean; data?: UserProfileItem; error?: string }> => {
  try {
    console.log('Creating profile item with data:', item);
    
    const { data, error } = await supabase
      .from('user_profile_items')
      .insert([
        {
          user_id: item.user_id,
          title: item.title,
          description: item.description,
          image_url: item.image_url,
          location: item.location,
          date: item.date,
          category: item.category,
          is_private: item.is_private,
          views_count: 0,
          likes_count: 0,
          comments_count: 0
        }
      ])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating user profile item:', error);
      return { success: false, error: error.message };
    }

    console.log('Profile item created successfully:', data);

    return {
      success: true,
      data: {
        ...data,
        category: data.category as 'achievement' | 'activity' | 'statistic',
        video_url: null,
        stats: {
          views: data.views_count || 0,
          likes: data.likes_count || 0,
          comments: data.comments_count || 0,
          shares: 0
        }
      }
    };
  } catch (error) {
    console.error('Error in createUserProfileItem:', error);
    return { success: false, error: 'Failed to create item' };
  }
};

export const updateUserProfileItem = async (id: string, updates: Partial<Omit<UserProfileItem, 'id' | 'created_at' | 'stats' | 'profiles' | 'views_count' | 'likes_count' | 'comments_count'>>): Promise<{ success: boolean; data?: UserProfileItem; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('user_profile_items')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating user profile item:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: {
        ...data,
        category: data.category as 'achievement' | 'activity' | 'statistic',
        video_url: null,
        stats: {
          views: data.views_count || 0,
          likes: data.likes_count || 0,
          comments: data.comments_count || 0,
          shares: 0
        }
      }
    };
  } catch (error) {
    console.error('Error in updateUserProfileItem:', error);
    return { success: false, error: 'Failed to update item' };
  }
};

export const deleteUserProfileItem = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('user_profile_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user profile item:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteUserProfileItem:', error);
    return { success: false, error: 'Failed to delete item' };
  }
};
