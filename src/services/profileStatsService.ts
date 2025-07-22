
import { supabase } from '@/integrations/supabase/client';

export interface UserProfileStats {
  id: string;
  user_id: string;
  total_catch: number;
  achievements_count: number;
  followers_count: number;
  user_rating: number;
  active_days: number;
  trend_score: number;
  monthly_catch_increase: number;
  new_achievements: number;
  weekly_followers_increase: number;
  total_reviews: number;
  trend_change: number;
  job_title?: string;
  company?: string;
  experience_years: number;
  specialization?: string;
  bio?: string;
  location?: string;
  website_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: string;
  title: string;
  description?: string;
  icon_name?: string;
  badge_color: string;
  is_featured: boolean;
  earned_date: string;
  created_at: string;
}

export interface TrendData {
  current_score: number;
  previous_score: number;
  trend_direction: 'up' | 'down' | 'stable';
  change: number;
}

export const fetchUserProfileStats = async (userId: string): Promise<UserProfileStats | null> => {
  try {
    // Get basic profile stats from existing user_profile_stats table
    const { data: profileStats, error: statsError } = await supabase
      .from('user_profile_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (statsError && statsError.code !== 'PGRST116') {
      throw statsError;
    }

    // Get user stats (real-time activity metrics) from existing user_stats table
    const { data: userStats, error: userStatsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (userStatsError && userStatsError.code !== 'PGRST116') {
      console.error('Error fetching user stats:', userStatsError);
    }

    // Get profile info for bio and location
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('bio, location')
      .eq('id', userId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching profile:', profileError);
    }

    // Calculate activity score (total messages + likes given + likes received + pins)
    const activityScore = (userStats?.total_messages || 0) + 
                         (userStats?.total_likes_given || 0) + 
                         (userStats?.total_likes_received || 0) + 
                         (userStats?.total_pins || 0);

    // Create stats object using available data
    const stats: UserProfileStats = {
      id: profileStats?.id || '',
      user_id: userId,
      total_catch: profileStats?.total_catches || 0,
      achievements_count: 0, // No achievements table yet
      followers_count: activityScore, // Use activity score as followers
      user_rating: 4.5, // Default rating
      active_days: Math.floor(activityScore / 10), // Estimate based on activity
      trend_score: Math.min(100, activityScore * 2), // Calculate trend from activity
      monthly_catch_increase: 0,
      new_achievements: 0,
      weekly_followers_increase: 0,
      total_reviews: 1, // Default
      trend_change: 5, // Default positive trend
      job_title: undefined,
      company: undefined,
      experience_years: profileStats?.years_fishing || 0,
      specialization: undefined,
      bio: profile?.bio,
      location: profile?.location,
      website_url: undefined,
      created_at: profileStats?.created_at || new Date().toISOString(),
      updated_at: profileStats?.updated_at || new Date().toISOString()
    };

    return stats;
  } catch (error) {
    console.error('Error fetching user profile stats:', error);
    return null;
  }
};

export const updateUserProfileStats = async (
  userId: string, 
  updates: Partial<UserProfileStats>
): Promise<{ success: boolean; message: string }> => {
  try {
    // Update user_profile_stats table with available fields
    const profileUpdates: any = {};
    
    if (updates.total_catch !== undefined) {
      profileUpdates.total_catches = updates.total_catch;
    }
    if (updates.experience_years !== undefined) {
      profileUpdates.years_fishing = updates.experience_years;
    }

    if (Object.keys(profileUpdates).length > 0) {
      const { error: profileError } = await supabase
        .from('user_profile_stats')
        .update(profileUpdates)
        .eq('user_id', userId);

      if (profileError) {
        throw profileError;
      }
    }

    // Update profile table for bio and location
    const bioLocationUpdates: any = {};
    if (updates.bio !== undefined) {
      bioLocationUpdates.bio = updates.bio;
    }
    if (updates.location !== undefined) {
      bioLocationUpdates.location = updates.location;
    }

    if (Object.keys(bioLocationUpdates).length > 0) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update(bioLocationUpdates)
        .eq('id', userId);

      if (profileError) {
        throw profileError;
      }
    }

    return { success: true, message: 'Statistik berhasil diperbarui' };
  } catch (error) {
    console.error('Error updating profile stats:', error);
    return { success: false, message: 'Gagal memperbarui statistik' };
  }
};

export const getTrendData = async (userId: string): Promise<TrendData | null> => {
  try {
    // Get user stats to calculate trend
    const { data: userStats, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // Calculate current score from activity
    const currentScore = (userStats?.total_messages || 0) + 
                        (userStats?.total_likes_given || 0) + 
                        (userStats?.total_likes_received || 0) + 
                        (userStats?.total_pins || 0);

    // Simulate previous score (in real app, this would be historical data)
    const previousScore = Math.max(0, currentScore - 5);
    const change = currentScore - previousScore;
    
    let trendDirection: 'up' | 'down' | 'stable' = 'stable';
    if (change > 0) trendDirection = 'up';
    else if (change < 0) trendDirection = 'down';

    return {
      current_score: currentScore,
      previous_score: previousScore,
      trend_direction: trendDirection,
      change: Math.abs(change)
    };
  } catch (error) {
    console.error('Error fetching trend data:', error);
    return null;
  }
};

// Achievement-related functions (simplified for existing schema)
export const fetchUserAchievements = async (userId: string): Promise<UserAchievement[]> => {
  try {
    // Return empty array since achievements table doesn't exist yet
    console.log('Achievements table not implemented yet');
    return [];
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    return [];
  }
};

export const addUserAchievement = async (
  userId: string,
  achievementData: Omit<UserAchievement, 'id' | 'user_id' | 'created_at' | 'earned_date'>
): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Achievements table not implemented yet');
    return { success: false, message: 'Fitur pencapaian belum tersedia' };
  } catch (error) {
    console.error('Error adding achievement:', error);
    return { success: false, message: 'Gagal menambahkan pencapaian' };
  }
};

export const updateUserAchievement = async (
  achievementId: string,
  updates: Partial<Omit<UserAchievement, 'id' | 'user_id' | 'created_at'>>
): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Achievements table not implemented yet');
    return { success: false, message: 'Fitur pencapaian belum tersedia' };
  } catch (error) {
    console.error('Error updating achievement:', error);
    return { success: false, message: 'Gagal memperbarui pencapaian' };
  }
};

export const deleteUserAchievement = async (
  achievementId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Achievements table not implemented yet');
    return { success: false, message: 'Fitur pencapaian belum tersedia' };
  } catch (error) {
    console.error('Error deleting achievement:', error);
    return { success: false, message: 'Gagal menghapus pencapaian' };
  }
};
