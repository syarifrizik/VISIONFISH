
import { supabase } from "@/integrations/supabase/client";

export interface FishSpeciesHistoryItem {
  id: string;
  user_id: string;
  species_name: string;
  usage_count: number;
  last_used_at: string;
  created_at: string;
  updated_at: string;
}

const MAX_HISTORY_ITEMS = 5;

export const fishSpeciesHistoryService = {
  // Get user's fish species history (limited to most recent items)
  async getHistory(): Promise<string[]> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('No authenticated user, returning empty history');
        return [];
      }

      const { data, error } = await supabase
        .from('fish_species_history')
        .select('species_name, usage_count, last_used_at')
        .eq('user_id', user.id)
        .order('last_used_at', { ascending: false })
        .limit(MAX_HISTORY_ITEMS);

      if (error) {
        console.error('Error fetching fish species history:', error);
        return [];
      }

      return data?.map(item => item.species_name) || [];
    } catch (error) {
      console.error('Error in getHistory:', error);
      return [];
    }
  },

  // Add or update species in history
  async addToHistory(speciesName: string): Promise<void> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('No authenticated user, cannot save to history');
        return;
      }

      // Check if species already exists for this user
      const { data: existing, error: fetchError } = await supabase
        .from('fish_species_history')
        .select('id, usage_count')
        .eq('user_id', user.id)
        .eq('species_name', speciesName)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking existing species:', fetchError);
        return;
      }

      if (existing) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('fish_species_history')
          .update({
            usage_count: existing.usage_count + 1,
            last_used_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (updateError) {
          console.error('Error updating species history:', updateError);
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('fish_species_history')
          .insert({
            user_id: user.id,
            species_name: speciesName,
            usage_count: 1,
            last_used_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Error inserting species history:', insertError);
          return;
        }

        // Check if we exceed the limit and remove oldest entries
        await this.cleanupOldHistory(user.id);
      }
    } catch (error) {
      console.error('Error in addToHistory:', error);
    }
  },

  // Remove oldest entries if we exceed the limit
  async cleanupOldHistory(userId: string): Promise<void> {
    try {
      const { data: allHistory, error: fetchError } = await supabase
        .from('fish_species_history')
        .select('id, last_used_at')
        .eq('user_id', userId)
        .order('last_used_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching history for cleanup:', fetchError);
        return;
      }

      if (allHistory && allHistory.length > MAX_HISTORY_ITEMS) {
        const itemsToDelete = allHistory.slice(MAX_HISTORY_ITEMS);
        const idsToDelete = itemsToDelete.map(item => item.id);

        const { error: deleteError } = await supabase
          .from('fish_species_history')
          .delete()
          .in('id', idsToDelete);

        if (deleteError) {
          console.error('Error cleaning up old history:', deleteError);
        } else {
          console.log(`Cleaned up ${itemsToDelete.length} old history items`);
        }
      }
    } catch (error) {
      console.error('Error in cleanupOldHistory:', error);
    }
  }
};
