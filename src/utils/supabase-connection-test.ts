
import { supabase } from '@/integrations/supabase/client';

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection to VisionFish project...');
    
    // Test basic connection with a simple query to profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('VisionFish Supabase connection successful!');
    return { 
      success: true, 
      message: 'Connected to VisionFish project successfully',
      projectId: 'hxekcssuzixhieadgcxx',
      tablesAccessible: true
    };
  } catch (err) {
    console.error('Connection test failed:', err);
    return { success: false, error: 'Failed to connect to VisionFish project' };
  }
};
