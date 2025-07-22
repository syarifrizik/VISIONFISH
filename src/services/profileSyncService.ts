
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const syncGoogleProfileData = async (user: User) => {
  try {
    // Check if this is a Google OAuth user
    const isGoogleUser = user.app_metadata?.provider === 'google' || 
                        user.app_metadata?.providers?.includes('google') ||
                        !!user.user_metadata?.name;

    if (!isGoogleUser) return;

    // Get current profile
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Check if profile needs syncing
    const needsSync = !currentProfile?.display_name || 
                     currentProfile.display_name === 'User' ||
                     currentProfile.display_name.includes('@');

    if (needsSync) {
      const updateData = {
        display_name: user.user_metadata?.name || 
                     user.user_metadata?.full_name || 
                     currentProfile?.display_name,
        avatar_url: user.user_metadata?.avatar_url || 
                   user.user_metadata?.picture || 
                   currentProfile?.avatar_url,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        console.error('Error syncing Google profile data:', error);
      } else {
        console.log('Successfully synced Google profile data');
      }
    }
  } catch (error) {
    console.error('Error in syncGoogleProfileData:', error);
  }
};
