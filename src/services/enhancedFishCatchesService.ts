
import { supabase } from '@/integrations/supabase/client';

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
  notes?: string;
  image_urls?: string[];
  fishing_gear?: string;
  fishing_method?: string;
  bait_used?: string;
  weather_condition?: string;
  water_temperature?: number;
  duration_hours?: number;
  is_released: boolean;
  is_record: boolean;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateFishCatchData {
  species_name: string;
  weight_kg?: number;
  length_cm?: number;
  location?: string;
  location_lat?: number;
  location_lng?: number;
  catch_time?: string;
  notes?: string;
  image_urls?: string[];
  fishing_gear?: string;
  fishing_method?: string;
  bait_used?: string;
  weather_condition?: string;
  water_temperature?: number;
  duration_hours?: number;
  is_released?: boolean;
  is_record?: boolean;
  is_private?: boolean;
}

export const enhancedFishCatchesService = {
  // Fetch fish catches with advanced filtering
  async fetchFishCatches(userId: string, filters?: {
    searchQuery?: string;
    species?: string;
    location?: string;
    dateFrom?: string;
    dateTo?: string;
    isPrivate?: boolean;
    isRecord?: boolean;
    minWeight?: number;
    maxWeight?: number;
    sortBy?: 'created_at' | 'weight_kg' | 'species_name';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
  }): Promise<{ data: FishCatch[] | null; error: string | null }> {
    try {
      let query = supabase
        .from('fish_catches')
        .select('*')
        .eq('user_id', userId);

      // Apply filters
      if (filters?.species && filters.species !== 'all') {
        query = query.eq('species_name', filters.species);
      }

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      if (filters?.isPrivate !== undefined) {
        query = query.eq('is_private', filters.isPrivate);
      }

      if (filters?.isRecord !== undefined) {
        query = query.eq('is_record', filters.isRecord);
      }

      if (filters?.minWeight) {
        query = query.gte('weight_kg', filters.minWeight);
      }

      if (filters?.maxWeight) {
        query = query.lte('weight_kg', filters.maxWeight);
      }

      // Apply sorting
      const sortBy = filters?.sortBy || 'created_at';
      const sortOrder = filters?.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply limit
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredData = data || [];

      // Apply search filter if provided
      if (filters?.searchQuery) {
        const searchQuery = filters.searchQuery.toLowerCase();
        filteredData = filteredData.filter(fishCatch => 
          fishCatch.species_name.toLowerCase().includes(searchQuery) ||
          fishCatch.location?.toLowerCase().includes(searchQuery) ||
          fishCatch.notes?.toLowerCase().includes(searchQuery) ||
          fishCatch.fishing_gear?.toLowerCase().includes(searchQuery) ||
          fishCatch.bait_used?.toLowerCase().includes(searchQuery)
        );
      }

      return { data: filteredData, error: null };
    } catch (error) {
      console.error('Error fetching fish catches:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch fish catches' };
    }
  },

  // Create a new fish catch
  async createFishCatch(userId: string, catchData: CreateFishCatchData): Promise<{ data: FishCatch | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('fish_catches')
        .insert([{
          user_id: userId,
          is_released: false,
          is_record: false,
          is_private: false,
          ...catchData
        }])
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error creating fish catch:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Failed to create fish catch' };
    }
  },

  // Update fish catch
  async updateFishCatch(catchId: string, catchData: Partial<CreateFishCatchData>): Promise<{ data: FishCatch | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('fish_catches')
        .update({
          ...catchData,
          updated_at: new Date().toISOString()
        })
        .eq('id', catchId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error updating fish catch:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Failed to update fish catch' };
    }
  },

  // Delete fish catch
  async deleteFishCatch(catchId: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('fish_catches')
        .delete()
        .eq('id', catchId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting fish catch:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to delete fish catch' };
    }
  },

  // Get catch statistics
  async getCatchStatistics(userId: string): Promise<{
    data: {
      totalCatches: number;
      totalWeight: number;
      averageWeight: number;
      biggestCatch: FishCatch | null;
      favoriteSpecies: string | null;
      favoriteLocation: string | null;
    } | null;
    error: string | null;
  }> {
    try {
      const { data: catches, error } = await supabase
        .from('fish_catches')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      if (!catches || catches.length === 0) {
        return {
          data: {
            totalCatches: 0,
            totalWeight: 0,
            averageWeight: 0,
            biggestCatch: null,
            favoriteSpecies: null,
            favoriteLocation: null
          },
          error: null
        };
      }

      const totalCatches = catches.length;
      const totalWeight = catches.reduce((sum, catch_) => {
        const weight = Number(catch_.weight_kg) || 0;
        return sum + weight;
      }, 0);
      const averageWeight = totalCatches > 0 ? totalWeight / totalCatches : 0;

      const biggestCatch = catches.reduce((biggest, current) => {
        const currentWeight = Number(current.weight_kg) || 0;
        const biggestWeight = biggest ? (Number(biggest.weight_kg) || 0) : 0;
        
        if (!biggest || currentWeight > biggestWeight) {
          return current;
        }
        return biggest;
      }, null as FishCatch | null);

      // Get favorite species
      const speciesCount = catches.reduce((acc, catch_) => {
        const currentCount = Number(acc[catch_.species_name]) || 0;
        acc[catch_.species_name] = currentCount + 1;
        return acc;
      }, {} as Record<string, number>);

      const favoriteSpecies = Object.entries(speciesCount)
        .sort(([,a], [,b]) => (Number(b) || 0) - (Number(a) || 0))[0]?.[0] || null;

      // Get favorite location
      const locationCount = catches.reduce((acc, catch_) => {
        if (catch_.location) {
          const currentCount = Number(acc[catch_.location]) || 0;
          acc[catch_.location] = currentCount + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const favoriteLocation = Object.entries(locationCount)
        .sort(([,a], [,b]) => (Number(b) || 0) - (Number(a) || 0))[0]?.[0] || null;

      return {
        data: {
          totalCatches,
          totalWeight,
          averageWeight,
          biggestCatch,
          favoriteSpecies,
          favoriteLocation
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting catch statistics:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Failed to get statistics' };
    }
  },

  // Bulk operations
  async bulkDelete(catchIds: string[]): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('fish_catches')
        .delete()
        .in('id', catchIds);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error bulk deleting catches:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to delete catches' };
    }
  },

  async bulkUpdatePrivacy(catchIds: string[], isPrivate: boolean): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('fish_catches')
        .update({ 
          is_private: isPrivate,
          updated_at: new Date().toISOString()
        })
        .in('id', catchIds);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error bulk updating privacy:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update privacy' };
    }
  }
};
