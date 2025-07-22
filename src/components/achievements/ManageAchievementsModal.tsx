
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
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
  profiles?: {
    name: string;
    email: string;
  };
  awarded_by_profile?: {
    name: string;
  };
}

interface ManageAchievementsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetUserId?: string;
}

const ManageAchievementsModal = ({ open, onOpenChange, targetUserId }: ManageAchievementsModalProps) => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && targetUserId) {
      fetchUserAchievements();
    }
  }, [open, targetUserId]);

  const fetchUserAchievements = async () => {
    if (!targetUserId) return;
    
    setLoading(true);
    try {
      // Get user achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', targetUserId)
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

      // Get user profile
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('display_name, username')
        .eq('id', targetUserId)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
      }

      // Combine the data
      const combinedAchievements: UserAchievement[] = achievementsData.map(achievement => {
        const achievementType = typesData?.find(t => t.id === achievement.achievement_type_id);
        
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
          profiles: userProfile ? {
            name: userProfile.display_name || userProfile.username || 'User',
            email: ''
          } : undefined
        };
      });

      setAchievements(combinedAchievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      showNotification('Gagal memuat pencapaian', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Kelola Pencapaian</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : achievements.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Belum ada pencapaian untuk user ini.</p>
          ) : (
            <div className="space-y-2">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="border rounded p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{achievement.achievement_types.name}</h3>
                      <p className="text-sm text-gray-600">{achievement.achievement_types.description}</p>
                      {achievement.custom_message && (
                        <p className="text-sm italic">"{achievement.custom_message}"</p>
                      )}
                    </div>
                    <Badge variant="outline">{achievement.achievement_types.category}</Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    Diberikan pada {new Date(achievement.awarded_at).toLocaleDateString('id-ID')}
                    {achievement.awarded_by_profile && ` oleh ${achievement.awarded_by_profile.name}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageAchievementsModal;
