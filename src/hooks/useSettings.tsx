import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from './use-toast';

export interface UserSettings {
  theme: 'light' | 'dark';
  language: 'id' | 'en' | 'ja' | 'ko' | 'zh' | 'ar' | 'es' | 'fr' | 'de' | 'pt' | 'ru' | 'hi';
  notifications_app_updates: boolean;
  notifications_new_tips: boolean;
  notifications_weather_alerts: boolean;
  notifications_chat_messages: boolean;
}

export const useSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'light',
    language: 'id',
    notifications_app_updates: true,
    notifications_new_tips: true,
    notifications_weather_alerts: true,
    notifications_chat_messages: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSettings();
    } else {
      // Load from localStorage if not logged in
      loadLocalSettings();
      setIsLoading(false);
    }
  }, [user]);

  const loadLocalSettings = () => {
    try {
      const savedLanguage = localStorage.getItem('visionfish_language') as UserSettings['language'];
      const savedTheme = localStorage.getItem('visionfish_theme') as UserSettings['theme'];
      
      if (savedLanguage) {
        setSettings(prev => ({ ...prev, language: savedLanguage }));
      }
      if (savedTheme) {
        setSettings(prev => ({ ...prev, theme: savedTheme }));
      }
    } catch (error) {
      console.error('Error loading local settings:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      if (!user) return;
      
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        const newSettings = {
          theme: (data.theme as 'light' | 'dark') || 'light',
          language: (data.language as UserSettings['language']) || 'id',
          notifications_app_updates: data.notifications_app_updates ?? true,
          notifications_new_tips: data.notifications_new_tips ?? true,
          notifications_weather_alerts: data.notifications_weather_alerts ?? true,
          notifications_chat_messages: data.notifications_chat_messages ?? false,
        };
        
        setSettings(newSettings);
        
        // Also save to localStorage
        localStorage.setItem('visionfish_language', newSettings.language);
        localStorage.setItem('visionfish_theme', newSettings.theme);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      loadLocalSettings(); // Fallback to local settings
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    try {
      setIsLoading(true);
      
      // Always update local state and localStorage immediately
      setSettings(prev => {
        const newSettings = { ...prev, ...updates };
        
        // Save to localStorage
        if (updates.language) {
          localStorage.setItem('visionfish_language', updates.language);
        }
        if (updates.theme) {
          localStorage.setItem('visionfish_theme', updates.theme);
        }
        
        return newSettings;
      });
      
      if (!user) {
        // If not logged in, just save to localStorage
        return { success: true };
      }
      
      // First, try to update existing record
      const { data: updateData, error: updateError } = await supabase
        .from('user_settings')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();
      
      // If update fails because record doesn't exist, create new one
      if (updateError && updateError.code === 'PGRST116') {
        const { data: insertData, error: insertError } = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();
        
        if (insertError) throw insertError;
        
        if (insertData) {
          toast({
            title: "Pengaturan berhasil disimpan",
            description: "Perubahan pengaturan telah diterapkan",
          });
          
          return { success: true, data: insertData };
        }
      } else if (updateError) {
        throw updateError;
      } else if (updateData) {
        toast({
          title: "Pengaturan berhasil disimpan",
          description: "Perubahan pengaturan telah diterapkan",
        });
        
        return { success: true, data: updateData };
      }
      
      return { success: false, error: 'No data returned' };
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Gagal menyimpan pengaturan",
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    settings,
    isLoading,
    updateSettings,
    fetchSettings,
  };
};
