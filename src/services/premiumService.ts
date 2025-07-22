
import { supabase } from '@/integrations/supabase/client';

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'free' | 'premium';
  starts_at: string;
  ends_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const getUserSubscription = async (userId: string): Promise<Subscription | null> => {
  try {
    const { data, error } = await (supabase as any)
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data ? {
      ...data,
      plan_type: data.plan_type as 'free' | 'premium'
    } : null;
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return null;
  }
};

export const checkPremiumStatus = async (userId: string): Promise<boolean> => {
  try {
    console.log('Checking premium status for user ID:', userId);
    
    // Use the database function to check premium status
    const { data, error } = await supabase
      .rpc('is_user_premium', { user_uuid: userId });
    
    if (error) {
      console.error('Error calling is_user_premium function:', error);
      
      // Fallback: check subscriptions table directly
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('plan_type', 'premium')
        .eq('is_active', true)
        .maybeSingle();
      
      if (subError) {
        console.error('Error checking subscriptions table:', subError);
        return false;
      }
      
      const isPremium = subscription && (
        !subscription.ends_at || new Date(subscription.ends_at) > new Date()
      );
      
      console.log('Fallback premium check result:', isPremium, subscription);
      return !!isPremium;
    }
    
    console.log('Premium status function result:', data);
    return !!data;
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
};

export const upgradeToPremium = async (userId: string, endsAt?: Date): Promise<Subscription> => {
  try {
    // First, deactivate any existing subscriptions
    await (supabase as any)
      .from('subscriptions')
      .update({ is_active: false })
      .eq('user_id', userId);
    
    // Create new premium subscription
    const { data, error } = await (supabase as any)
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_type: 'premium',
        is_active: true,
        ends_at: endsAt?.toISOString() || null,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      plan_type: data.plan_type as 'free' | 'premium'
    };
  } catch (error) {
    console.error('Error upgrading to premium:', error);
    throw error;
  }
};

export const cancelPremium = async (userId: string): Promise<void> => {
  try {
    const { error } = await (supabase as any)
      .from('subscriptions')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('plan_type', 'premium');
    
    if (error) throw error;
  } catch (error) {
    console.error('Error canceling premium:', error);
    throw error;
  }
};
