
import { supabase } from '@/integrations/supabase/client';

export interface UserActivity {
  id: string;
  activity_type: string;
  target_message_id?: string;
  metadata: any;
  created_at: string;
  chat_message?: {
    id: string;
    content: string;
    message_type: string;
    created_at: string;
    user_id: string;
    profile?: {
      username: string;
      display_name: string;
      avatar_url: string;
    };
  };
}

export interface UserStats {
  id: string;
  user_id: string;
  total_messages: number;
  total_likes_given: number;
  total_likes_received: number;
  total_pins: number;
  messages_by_type: {
    general: number;
    question: number;
    news: number;
    promotion: number;
  };
  created_at: string;
  updated_at: string;
}

export const ensureProfileExists = async (userId: string, email?: string | null) => {
  try {
    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking profile:', fetchError);
      return;
    }
    
    // If profile doesn't exist, create it
    if (!existingProfile) {
      const username = email ? email.split('@')[0] : `user_${Math.random().toString(36).substring(2, 9)}`;
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          username,
          display_name: username,
          avatar_url: '/placeholder.svg',
          fish_caught: 0
        });
      
      if (insertError) {
        console.error('Error creating profile:', insertError);
      }
    }
  } catch (error) {
    console.error('Error in ensureProfileExists:', error);
  }
};

export const checkPremiumStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('is_user_premium', { user_uuid: userId });
    
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
};

export const fetchUserActivities = async (userId: string, limit: number = 50): Promise<UserActivity[]> => {
  try {
    const { data: activities, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return activities || [];
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return [];
  }
};

export const fetchUserStats = async (userId: string): Promise<UserStats | null> => {
  try {
    const { data: stats, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    if (!stats) return null;
    
    // Transform the data to match our interface
    const transformedStats: UserStats = {
      id: stats.id,
      user_id: stats.user_id,
      total_messages: stats.total_messages,
      total_likes_given: stats.total_likes_given,
      total_likes_received: stats.total_likes_received,
      total_pins: stats.total_pins,
      messages_by_type: typeof stats.messages_by_type === 'object' && stats.messages_by_type !== null
        ? stats.messages_by_type as { general: number; question: number; news: number; promotion: number; }
        : { general: 0, question: 0, news: 0, promotion: 0 },
      created_at: stats.created_at,
      updated_at: stats.updated_at
    };
    
    return transformedStats;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }
};

export const fetchUserMessages = async (userId: string, limit: number = 20): Promise<any[]> => {
  try {
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        profile:profiles!user_id (
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    return messages || [];
  } catch (error) {
    console.error('Error fetching user messages:', error);
    return [];
  }
};
