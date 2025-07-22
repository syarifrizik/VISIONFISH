
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from './use-toast';

export interface PrivacySettings {
  user_id: string;
  profile_visibility: 'public' | 'private' | 'members_only';
  show_activity: boolean;
  show_followers: boolean;
  show_following: boolean;
  show_catches: boolean;
  created_at?: string;
  updated_at?: string;
}

export const usePrivacySettings = (userId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (targetUserId) {
      loadPrivacySettings();
    }
  }, [targetUserId]);

  const loadPrivacySettings = async () => {
    if (!targetUserId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('user_id', targetUserId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading privacy settings:', error);
        // Set default settings on error
        setPrivacySettings({
          user_id: targetUserId,
          profile_visibility: 'public',
          show_activity: true,
          show_followers: true,
          show_following: true,
          show_catches: true
        });
      } else if (!data) {
        // Create default settings if they don't exist
        const defaultSettings = {
          user_id: targetUserId,
          profile_visibility: 'public' as const,
          show_activity: true,
          show_followers: true,
          show_following: true,
          show_catches: true
        };
        
        try {
          const { data: newData, error: createError } = await supabase
            .from('privacy_settings')
            .insert(defaultSettings)
            .select()
            .single();

          if (createError) {
            console.error('Error creating privacy settings:', createError);
            setPrivacySettings(defaultSettings);
          } else {
            // Map database fields to interface
            const profileVisibility = ['public', 'private', 'members_only'].includes(newData.profile_visibility) 
              ? newData.profile_visibility as 'public' | 'private' | 'members_only'
              : 'public';
              
            setPrivacySettings({
              user_id: newData.user_id,
              profile_visibility: profileVisibility,
              show_activity: newData.show_activity,
              show_followers: newData.show_followers || true,
              show_following: newData.show_following || true,
              show_catches: newData.show_catches || true,
              created_at: newData.created_at,
              updated_at: newData.updated_at
            });
          }
        } catch (createErr) {
          console.error('Error creating default privacy settings:', createErr);
          setPrivacySettings(defaultSettings);
        }
      } else {
        // Map database fields to interface with proper type casting
        const profileVisibility = ['public', 'private', 'members_only'].includes(data.profile_visibility) 
          ? data.profile_visibility as 'public' | 'private' | 'members_only'
          : 'public';
          
        setPrivacySettings({
          user_id: data.user_id,
          profile_visibility: profileVisibility,
          show_activity: data.show_activity,
          show_followers: data.show_followers || true,
          show_following: data.show_following || true,
          show_catches: data.show_catches || true,
          created_at: data.created_at,
          updated_at: data.updated_at
        });
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
      // Set default settings on error
      setPrivacySettings({
        user_id: targetUserId,
        profile_visibility: 'public',
        show_activity: true,
        show_followers: true,
        show_following: true,
        show_catches: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<PrivacySettings>) => {
    if (!targetUserId || !user?.id || targetUserId !== user.id) {
      toast({
        title: "Tidak dapat memperbarui pengaturan",
        description: "Anda hanya dapat mengubah pengaturan privasi Anda sendiri",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('privacy_settings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', targetUserId)
        .select()
        .single();

      if (error) {
        console.error('Error updating privacy settings:', error);
        toast({
          title: "Gagal memperbarui pengaturan",
          description: "Terjadi kesalahan saat menyimpan perubahan",
          variant: "destructive"
        });
        return false;
      }

      // Map database fields to interface with proper type casting
      const profileVisibility = ['public', 'private', 'members_only'].includes(data.profile_visibility) 
        ? data.profile_visibility as 'public' | 'private' | 'members_only'
        : 'public';
        
      setPrivacySettings({
        user_id: data.user_id,
        profile_visibility: profileVisibility,
        show_activity: data.show_activity,
        show_followers: data.show_followers || true,
        show_following: data.show_following || true,
        show_catches: data.show_catches || true,
        created_at: data.created_at,
        updated_at: data.updated_at
      });

      toast({
        title: "Pengaturan privasi diperbarui",
        description: "Perubahan telah disimpan",
      });
      return true;
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast({
        title: "Gagal memperbarui pengaturan",
        description: "Terjadi kesalahan saat menyimpan perubahan",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateProfilePrivacy = async (isPrivate: boolean) => {
    if (!targetUserId || !user?.id || targetUserId !== user.id) {
      toast({
        title: "Tidak dapat memperbarui privasi profil",
        description: "Anda hanya dapat mengubah privasi profil Anda sendiri",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_private: isPrivate })
        .eq('id', targetUserId);

      if (error) {
        console.error('Error updating profile privacy:', error);
        toast({
          title: "Gagal memperbarui privasi profil",
          description: "Terjadi kesalahan saat mengubah pengaturan",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: isPrivate ? "Profil dijadikan privat" : "Profil dijadikan publik",
        description: "Pengaturan privasi profil telah diperbarui",
      });
      return true;
    } catch (error) {
      console.error('Error updating profile privacy:', error);
      toast({
        title: "Gagal memperbarui privasi profil",
        description: "Terjadi kesalahan saat mengubah pengaturan",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    privacySettings,
    isLoading,
    updateSettings,
    updateProfilePrivacy,
    loadPrivacySettings
  };
};
