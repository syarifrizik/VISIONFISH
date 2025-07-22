
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const usePremiumStatus = () => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPremiumStatus();
  }, [user]);

  const checkPremiumStatus = async () => {
    if (!user?.id) {
      setIsPremium(false);
      setLoading(false);
      return;
    }

    try {
      // Use the database function to check premium status
      const { data, error } = await supabase
        .rpc('is_user_premium', { user_uuid: user.id });

      if (error) {
        console.error('Error checking premium status:', error);
        setIsPremium(false);
      } else {
        setIsPremium(!!data);
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  };

  return { isPremium, loading, checkPremiumStatus };
};
