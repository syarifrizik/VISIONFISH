
import { supabase } from '@/integrations/supabase/client';

interface UsernameCheckResult {
  available: boolean;
  message: string;
}

interface SetUserProfileResult {
  success: boolean;
  message: string;
}

export const checkUsernameAvailability = async (username: string): Promise<UsernameCheckResult> => {
  try {
    const { data, error } = await supabase
      .rpc('check_username_availability', { username_input: username });

    if (error) {
      throw new Error(error.message);
    }

    // Type cast the response data
    const result = data as { available: boolean; message: string };

    return {
      available: result.available,
      message: result.message
    };
  } catch (error) {
    console.error('Error checking username availability:', error);
    return {
      available: false,
      message: 'Terjadi kesalahan saat mengecek username'
    };
  }
};

export const setUserProfile = async (
  userId: string, 
  username: string, 
  email: string
): Promise<SetUserProfileResult> => {
  try {
    const { data, error } = await supabase
      .rpc('set_user_profile', { 
        user_id_input: userId,
        username_input: username,
        email_input: email
      });

    if (error) {
      throw new Error(error.message);
    }

    // Type cast the response data
    const result = data as { success: boolean; message: string };

    return {
      success: result.success,
      message: result.message
    };
  } catch (error) {
    console.error('Error setting user profile:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan saat menyimpan profil'
    };
  }
};
