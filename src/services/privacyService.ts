
import { supabase } from '@/integrations/supabase/client';

export interface PrivacySettings {
  id: string;
  user_id: string;
  profile_visibility: 'public' | 'members_only' | 'private';
  show_activity: boolean;
  show_followers: boolean;
  show_following: boolean;
  show_catches: boolean;
  created_at: string;
  updated_at: string;
}

export const privacyService = {
  async getPrivacySettings(userId: string): Promise<PrivacySettings | null> {
    try {
      const { data, error } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        return null;
      }

      // Type-safe conversion with fallback to 'public'
      const profileVisibility = data.profile_visibility === 'members_only' || data.profile_visibility === 'private' 
        ? data.profile_visibility 
        : 'public' as const;

      return {
        id: data.id,
        user_id: data.user_id,
        profile_visibility: profileVisibility,
        show_activity: data.show_activity,
        show_followers: data.show_followers,
        show_following: data.show_following,
        show_catches: data.show_catches,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
      return null;
    }
  },

  async createPrivacySettings(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('privacy_settings')
        .insert({
          user_id: userId,
          profile_visibility: 'public',
          show_activity: true,
          show_followers: true,
          show_following: true,
          show_catches: true
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating privacy settings:', error);
      return false;
    }
  },

  async updatePrivacySettings(userId: string, updates: Partial<PrivacySettings>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('privacy_settings')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      return false;
    }
  },

  async updateProfilePrivacy(userId: string, isPrivate: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          is_private: isPrivate,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating profile privacy:', error);
      return false;
    }
  }
};
