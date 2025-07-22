
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Crown, Eye, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface QuotaData {
  dailyUsage: number;
  dailyLimit: number;
  resetTime: string;
  isUnlimited: boolean;
}

const UserQuotaDisplay: React.FC = () => {
  const { user, isPremium, isLoggedIn } = useAuth();
  const [quotaData, setQuotaData] = useState<QuotaData>({
    dailyUsage: 0,
    dailyLimit: 5,
    resetTime: '24:00:00',
    isUnlimited: false
  });
  const [loading, setLoading] = useState(true);

  const fetchQuotaData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      // Get today's usage
      const today = new Date().toISOString().split('T')[0];
      const { data: usageData, error: usageError } = await supabase
        .from('species_analysis_usage')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lt('created_at', `${today}T23:59:59.999Z`);

      if (usageError) {
        console.error('Error fetching usage data:', usageError);
        return;
      }

      const dailyUsage = usageData?.length || 0;
      
      // Calculate reset time (next midnight)
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diffMs = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const resetTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

      setQuotaData({
        dailyUsage,
        dailyLimit: isPremium ? 999 : 5,
        resetTime,
        isUnlimited: isPremium
      });
    } catch (error) {
      console.error('Error in fetchQuotaData:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchQuotaData();
    } else {
      setLoading(false);
    }
  }, [user?.id, isPremium, isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/20">
              <Eye className="h-4 w-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                Mode Tamu - 1x Analisis
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                Login untuk mendapat kuota 5x sehari
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const usagePercentage = quotaData.isUnlimited ? 0 : 
    Math.min((quotaData.dailyUsage / quotaData.dailyLimit) * 100, 100);

  return (
    <Card className={`${isPremium ? 'border-green-200 bg-green-50 dark:bg-green-950/20' : 'border-blue-200 bg-blue-50 dark:bg-blue-950/20'}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isPremium ? (
                <Crown className="h-4 w-4 text-green-600" />
              ) : (
                <User className="h-4 w-4 text-blue-600" />
              )}
              <span className="text-sm font-medium">
                {isPremium ? 'Premium' : 'Free User'}
              </span>
            </div>
            <Badge variant={isPremium ? 'default' : 'secondary'} className="text-xs">
              {quotaData.isUnlimited ? 'Unlimited' : `${quotaData.dailyUsage}/${quotaData.dailyLimit}`}
            </Badge>
          </div>

          {/* Progress Bar (only for non-premium) */}
          {!quotaData.isUnlimited && (
            <div className="space-y-1">
              <Progress value={usagePercentage} className="h-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Sisa: {Math.max(0, quotaData.dailyLimit - quotaData.dailyUsage)} analisis hari ini
              </p>
            </div>
          )}

          {/* Reset Time */}
          {!quotaData.isUnlimited && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>Reset dalam {quotaData.resetTime}</span>
            </div>
          )}

          {/* Premium message */}
          {quotaData.isUnlimited && (
            <p className="text-xs text-green-600 dark:text-green-400">
              Akses unlimited untuk analisis species!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserQuotaDisplay;
