
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Star, Medal, Target, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface UserAchievement {
  id: string;
  achievement_type_id: string;
  user_id: string;
  awarded_at: string;
  awarded_by: string;
  custom_message: string;
  is_new: boolean;
  achievement_types: {
    name: string;
    description: string;
    icon: string;
    category: string;
  };
  awarded_by_profile?: {
    name: string;
  };
}

const AchievementSection = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchUserAchievements();
    }
  }, [user?.id]);

  const fetchUserAchievements = async () => {
    if (!user?.id) return;
    
    try {
      // First get user achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('awarded_at', { ascending: false });

      if (achievementsError) throw achievementsError;

      if (!achievementsData || achievementsData.length === 0) {
        setAchievements([]);
        setLoading(false);
        return;
      }

      // Get achievement types
      const achievementTypeIds = achievementsData.map(a => a.achievement_type_id);
      const { data: typesData, error: typesError } = await supabase
        .from('achievement_types')
        .select('*')
        .in('id', achievementTypeIds);

      if (typesError) throw typesError;

      // Get awarded by profiles
      const awardedByIds = achievementsData
        .map(a => a.awarded_by)
        .filter(id => id);
      
      let profilesData = [];
      if (awardedByIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, display_name')
          .in('id', awardedByIds);
        
        if (!profilesError) {
          profilesData = profiles || [];
        }
      }

      // Combine the data
      const combinedAchievements: UserAchievement[] = achievementsData.map(achievement => {
        const achievementType = typesData?.find(t => t.id === achievement.achievement_type_id);
        const awardedByProfile = profilesData.find(p => p.id === achievement.awarded_by);
        
        return {
          id: achievement.id,
          achievement_type_id: achievement.achievement_type_id,
          user_id: achievement.user_id,
          awarded_at: achievement.awarded_at,
          awarded_by: achievement.awarded_by,
          custom_message: achievement.custom_message,
          is_new: achievement.is_new,
          achievement_types: achievementType || {
            name: 'Achievement',
            description: 'A special achievement',
            icon: 'trophy',
            category: 'general'
          },
          awarded_by_profile: awardedByProfile ? {
            name: awardedByProfile.display_name || 'User'
          } : undefined
        };
      });

      setAchievements(combinedAchievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return <Trophy className="w-6 h-6" />;
      case 'award': return <Award className="w-6 h-6" />;
      case 'star': return <Star className="w-6 h-6" />;
      case 'medal': return <Medal className="w-6 h-6" />;
      case 'target': return <Target className="w-6 h-6" />;
      case 'zap': return <Zap className="w-6 h-6" />;
      default: return <Trophy className="w-6 h-6" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-white/5 backdrop-blur-xl border-[#A56ABD]/20 animate-pulse">
            <CardContent className="p-4">
              <div className="h-20 bg-white/10 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#F5EBFA] mb-4">Pencapaian</h2>
      
      {achievements.length === 0 ? (
        <Card className="bg-white/5 backdrop-blur-xl border-[#A56ABD]/20">
          <CardContent className="p-6 text-center">
            <Trophy className="w-12 h-12 text-[#A56ABD] mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-[#F5EBFA] mb-2">Belum Ada Pencapaian</h3>
            <p className="text-[#A56ABD]">Mulai aktivitas fishing untuk mendapatkan pencapaian pertama!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/5 backdrop-blur-xl border-[#A56ABD]/20 hover:bg-white/10 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-[#6E3482] to-[#A56ABD] rounded-full">
                      {getAchievementIcon(achievement.achievement_types.icon)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[#F5EBFA]">
                          {achievement.achievement_types.name}
                        </h3>
                        {achievement.is_new && (
                          <Badge className="bg-yellow-500 text-black text-xs">New!</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-[#A56ABD] mb-2">
                        {achievement.achievement_types.description}
                      </p>
                      
                      {achievement.custom_message && (
                        <p className="text-xs text-[#E7D0EF] italic">
                          "{achievement.custom_message}"
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2 text-xs text-[#A56ABD]">
                        <span>Diberikan pada {new Date(achievement.awarded_at).toLocaleDateString('id-ID')}</span>
                        {achievement.awarded_by_profile && (
                          <span>• oleh {achievement.awarded_by_profile.name}</span>
                        )}
                      </div>
                    </div>
                    
                    <Badge variant="outline" className="border-[#A56ABD] text-[#A56ABD]">
                      {achievement.achievement_types.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AchievementSection;
