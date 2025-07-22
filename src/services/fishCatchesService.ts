
import { supabase } from '@/integrations/supabase/client';
import { trackActivity } from './activityTrackingService';

export interface FishCatch {
  id: string;
  user_id: string;
  species_name: string;
  weight_kg?: number;
  length_cm?: number;
  location?: string;
  location_lat?: number;
  location_lng?: number;
  catch_time?: string;
  fishing_method?: string;
  bait_used?: string;
  fishing_gear?: string;
  weather_condition?: string;
  water_temperature?: number;
  duration_hours?: number;
  notes?: string;
  image_urls?: string[];
  is_released: boolean;
  is_record: boolean;
  is_private?: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
  } | null;
}

export const fetchUserFishCatches = async (userId: string, limit: number = 20): Promise<FishCatch[]> => {
  try {
    const { data, error } = await supabase
      .from('fish_catches')
      .select(`
        *,
        profiles(id, username, display_name, avatar_url)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user fish catches:', error);
      throw error;
    }

    return (data || []).map(item => ({
      ...item,
      profiles: item.profiles || null
    })) as FishCatch[];
  } catch (error) {
    console.error('Error in fetchUserFishCatches:', error);
    throw error;
  }
};

export const fetchPublicFishCatches = async (limit: number = 50): Promise<FishCatch[]> => {
  try {
    const { data, error } = await supabase
      .from('fish_catches')
      .select(`
        *,
        profiles(id, username, display_name, avatar_url)
      `)
      .eq('is_private', false)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching public fish catches:', error);
      throw error;
    }

    return (data || []).map(item => ({
      ...item,
      profiles: item.profiles || null
    })) as FishCatch[];
  } catch (error) {
    console.error('Error in fetchPublicFishCatches:', error);
    throw error;
  }
};

export const createFishCatch = async (catchData: Omit<FishCatch, 'id' | 'created_at' | 'updated_at' | 'profiles'>): Promise<{ success: boolean; data?: FishCatch; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('fish_catches')
      .insert([catchData])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating fish catch:', error);
      return { success: false, error: error.message };
    }

    // Track activity untuk fish catch
    await trackActivity(catchData.user_id, {
      activity_type: 'fish_caught',
      target_id: data.id,
      metadata: {
        species: catchData.species_name,
        weight: catchData.weight_kg,
        location: catchData.location,
        timestamp: new Date().toISOString()
      }
    });

    return { success: true, data: { ...data, profiles: null } as FishCatch };
  } catch (error) {
    console.error('Error in createFishCatch:', error);
    return { success: false, error: 'Failed to create fish catch' };
  }
};

export const updateFishCatch = async (id: string, updates: Partial<Omit<FishCatch, 'id' | 'created_at' | 'updated_at' | 'profiles'>>): Promise<{ success: boolean; data?: FishCatch; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('fish_catches')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating fish catch:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: { ...data, profiles: null } as FishCatch };
  } catch (error) {
    console.error('Error in updateFishCatch:', error);
    return { success: false, error: 'Failed to update fish catch' };
  }
};

export const deleteFishCatch = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('fish_catches')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting fish catch:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in deleteFishCatch:', error);
    return { success: false, error: 'Failed to delete fish catch' };
  }
};

export const getFishCatchById = async (id: string): Promise<FishCatch | null> => {
  try {
    const { data, error } = await supabase
      .from('fish_catches')
      .select(`
        *,
        profiles(id, username, display_name, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching fish catch by id:', error);
      throw error;
    }

    return {
      ...data,
      profiles: data.profiles || null
    } as FishCatch;
  } catch (error) {
    console.error('Error in getFishCatchById:', error);
    return null;
  }
};
