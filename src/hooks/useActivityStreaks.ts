
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ActivityStreak {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  streak_type: string;
}

interface PersonalRecord {
  id: string;
  record_type: string;
  record_value: number;
  record_date: string;
  description: string;
}

export const useActivityStreaks = () => {
  const { user } = useAuth();
  const [streaks, setStreaks] = useState<ActivityStreak[]>([]);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchStreaksAndRecords = async () => {
      try {
        setIsLoading(true);
        
        // Calculate streaks from user_activities
        const { data: activities } = await supabase
          .from('user_activities')
          .select('activity_type, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (activities) {
          const streakData = calculateStreaks(activities);
          setStreaks(streakData);
        }

        // Fetch personal records
        const { data: records } = await supabase
          .from('user_profile_items')
          .select('*')
          .eq('user_id', user.id)
          .eq('category', 'achievement')
          .order('created_at', { ascending: false })
          .limit(10);

        if (records) {
          const personalRecords = records.map(record => ({
            id: record.id,
            record_type: record.title,
            record_value: parseInt(record.description || '0'),
            record_date: record.created_at,
            description: record.description || ''
          }));
          setPersonalRecords(personalRecords);
        }

      } catch (error) {
        console.error('Error fetching streaks and records:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreaksAndRecords();
  }, [user?.id]);

  const calculateStreaks = (activities: any[]): ActivityStreak[] => {
    const streakTypes = ['message_sent', 'fish_caught', 'note_created', 'community_post_created'];
    const streakData: ActivityStreak[] = [];

    streakTypes.forEach(type => {
      const typeActivities = activities.filter(a => a.activity_type === type);
      const streak = calculateStreakForType(typeActivities);
      if (streak) {
        streakData.push({
          ...streak,
          streak_type: type
        });
      }
    });

    return streakData;
  };

  const calculateStreakForType = (activities: any[]): Omit<ActivityStreak, 'streak_type'> | null => {
    if (activities.length === 0) return null;

    const dates = activities.map(a => new Date(a.created_at).toDateString());
    const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    // Calculate current streak
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
      currentStreak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(uniqueDates[i-1]);
        const currDate = new Date(uniqueDates[i]);
        const dayDiff = (prevDate.getTime() - currDate.getTime()) / (1000 * 3600 * 24);
        
        if (dayDiff === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i-1]);
      const currDate = new Date(uniqueDates[i]);
      const dayDiff = (prevDate.getTime() - currDate.getTime()) / (1000 * 3600 * 24);
      
      if (dayDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      current_streak: currentStreak,
      longest_streak: longestStreak,
      last_activity_date: uniqueDates[0] || ''
    };
  };

  return {
    streaks,
    personalRecords,
    isLoading
  };
};
