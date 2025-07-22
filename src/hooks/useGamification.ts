
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: string;
}

export const useGamification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const loadGamificationData = async () => {
      try {
        setIsLoading(true);
        
        // Load user stats untuk calculate achievements
        const { data: userStats } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        const { data: userActivities } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', user.id);

        const { data: userAchievements } = await supabase
          .from('user_achievements')
          .select('*, achievement_types(*)')
          .eq('user_id', user.id);

        // Calculate achievements progress
        const achievementsList = calculateAchievements(userStats, userActivities || [], userAchievements || []);
        setAchievements(achievementsList);

        // Load badges from user_profile_items
        const { data: userBadges } = await supabase
          .from('user_profile_items')
          .select('*')
          .eq('user_id', user.id)
          .eq('category', 'achievement');

        if (userBadges) {
          const badgesList = userBadges.map(item => ({
            id: item.id,
            name: item.title,
            description: item.description || '',
            icon: '🏆',
            color: '#FFD700',
            earnedAt: item.created_at
          }));
          setBadges(badgesList);
        }

        // Calculate points and level
        const points = calculateTotalPoints(userStats, achievementsList);
        setTotalPoints(points);
        setLevel(Math.floor(points / 1000) + 1);

      } catch (error) {
        console.error('Error loading gamification data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGamificationData();
  }, [user?.id]);

  const calculateAchievements = (userStats: any, activities: any[], userAchievements: any[]): Achievement[] => {
    const achievementTemplates = [
      {
        id: 'first_post',
        name: 'First Post',
        description: 'Buat postingan pertama Anda',
        icon: '📝',
        category: 'social',
        maxProgress: 1,
        checkProgress: () => activities.filter(a => a.activity_type === 'community_post_created').length
      },
      {
        id: 'social_butterfly',
        name: 'Social Butterfly',
        description: 'Kirim 50 pesan di chat',
        icon: '🦋',
        category: 'social',
        maxProgress: 50,
        checkProgress: () => userStats?.total_messages || 0
      },
      {
        id: 'fishing_master',
        name: 'Fishing Master',
        description: 'Catat 10 hasil tangkapan',
        icon: '🎣',
        category: 'fishing',
        maxProgress: 10,
        checkProgress: () => activities.filter(a => a.activity_type === 'fish_caught').length
      },
      {
        id: 'note_taker',
        name: 'Note Taker',
        description: 'Buat 20 catatan',
        icon: '📔',
        category: 'productivity',
        maxProgress: 20,
        checkProgress: () => activities.filter(a => a.activity_type === 'note_created').length
      },
      {
        id: 'liked',
        name: 'Popular',
        description: 'Terima 100 like',
        icon: '❤️',
        category: 'social',
        maxProgress: 100,
        checkProgress: () => userStats?.total_likes_received || 0
      }
    ];

    return achievementTemplates.map(template => {
      const progress = template.checkProgress();
      const isUnlocked = progress >= template.maxProgress;
      const existingAchievement = userAchievements.find(ua => ua.achievement_types?.name === template.name);

      return {
        id: template.id,
        name: template.name,
        description: template.description,
        icon: template.icon,
        category: template.category,
        progress: Math.min(progress, template.maxProgress),
        maxProgress: template.maxProgress,
        isUnlocked,
        unlockedAt: existingAchievement?.awarded_at
      };
    });
  };

  const calculateTotalPoints = (userStats: any, achievements: Achievement[]): number => {
    let points = 0;
    
    // Points from activities
    points += (userStats?.total_messages || 0) * 5;
    points += (userStats?.total_likes_received || 0) * 10;
    points += (userStats?.total_likes_given || 0) * 2;
    
    // Points from achievements
    points += achievements.filter(a => a.isUnlocked).length * 100;
    
    return points;
  };

  const checkAndUnlockAchievements = async () => {
    const newlyUnlocked = achievements.filter(a => a.progress >= a.maxProgress && !a.isUnlocked);
    
    for (const achievement of newlyUnlocked) {
      // Create achievement record
      await supabase
        .from('user_profile_items')
        .insert({
          user_id: user?.id,
          title: achievement.name,
          description: achievement.description,
          category: 'achievement',
          date: new Date().toISOString()
        });

      // Show toast notification
      toast({
        title: "🎉 Achievement Unlocked!",
        description: `${achievement.name}: ${achievement.description}`,
      });
    }
  };

  return {
    achievements,
    badges,
    totalPoints,
    level,
    isLoading,
    checkAndUnlockAchievements
  };
};
