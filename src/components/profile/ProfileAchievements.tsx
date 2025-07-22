
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Plus, Star, Trophy, Users, Cpu, Target, Zap, Edit3, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { fetchUserAchievements, UserAchievement, deleteUserAchievement } from '@/services/profileStatsService';
import { AddAchievementDialog } from './AddAchievementDialog';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { useNotifications } from '@/hooks/useNotifications';

const ProfileAchievements = () => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<UserAchievement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadAchievements();
    }
  }, [user?.id]);

  const loadAchievements = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const data = await fetchUserAchievements(user.id);
      setAchievements(data);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAchievement = async (achievementId: string) => {
    try {
      const result = await deleteUserAchievement(achievementId);
      if (result.success) {
        showNotification('Pencapaian berhasil dihapus', 'success');
        loadAchievements();
      } else {
        showNotification('Gagal menghapus pencapaian', 'error');
      }
    } catch (error) {
      showNotification('Gagal menghapus pencapaian', 'error');
    }
  };

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return Trophy;
      case 'star': return Star;
      case 'users': return Users;
      case 'cpu': return Cpu;
      case 'target': return Target;
      case 'zap': return Zap;
      default: return Award;
    }
  };

  const featuredAchievements = achievements.filter(a => a.is_featured);
  const regularAchievements = achievements.filter(a => !a.is_featured);
  const displayedRegularAchievements = showAll ? regularAchievements : regularAchievements.slice(0, 8);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-[#A56ABD]/20 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-[#A56ABD]/20 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-gradient-to-br from-[#F5EBFA] to-white">
              <CardContent className="p-4">
                <div className="h-20 bg-[#A56ABD]/20 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Updated colors */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Pencapaian & Badge</h2>
          <p className="text-[#d4bcdf] text-sm">Koleksi prestasi dan pengakuan Anda</p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          size="sm"
          className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah
        </Button>
      </div>

      {/* Featured Achievements - Updated title color */}
      {featuredAchievements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Pencapaian Unggulan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredAchievements.map((achievement, index) => {
              const IconComponent = getAchievementIcon(achievement.icon_name || 'award');
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Card className="bg-gradient-to-br from-[#6E3482] to-[#A56ABD] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 relative overflow-hidden group">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 text-white"
                        onClick={() => setEditingAchievement(achievement)}
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 bg-white/20 hover:bg-red-500/70 text-white"
                        onClick={() => handleDeleteAchievement(achievement.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-bl-full"></div>
                    <CardContent className="p-4 md:p-6 text-white">
                      <div className="flex items-start gap-3">
                        <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-lg">{achievement.title}</h4>
                            <Star className="w-4 h-4 text-yellow-300 fill-current" />
                          </div>
                          <p className="text-white/90 text-sm mb-3">{achievement.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                              {achievement.achievement_type}
                            </Badge>
                            <span className="text-xs text-white/80">
                              {formatDistanceToNow(new Date(achievement.earned_date), { 
                                addSuffix: true, 
                                locale: idLocale 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Regular Achievements - Updated title color */}
      {regularAchievements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Semua Pencapaian</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {displayedRegularAchievements.map((achievement, index) => {
              const IconComponent = getAchievementIcon(achievement.icon_name || 'award');
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Card className="bg-gradient-to-br from-[#F5EBFA] to-white hover:shadow-lg transition-all duration-300 hover:scale-105 border-[#A56ABD]/30 group relative">
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 bg-[#6E3482]/10 hover:bg-[#6E3482]/20 text-[#6E3482]"
                        onClick={() => setEditingAchievement(achievement)}
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 bg-red-100 hover:bg-red-200 text-red-600"
                        onClick={() => handleDeleteAchievement(achievement.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <CardContent className="p-3 md:p-4">
                      <div className="text-center space-y-2">
                        <div 
                          className="p-2 md:p-3 rounded-full mx-auto w-fit"
                          style={{ backgroundColor: achievement.badge_color }}
                        >
                          <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#49225B] text-sm">{achievement.title}</h4>
                          <p className="text-xs text-[#6E3482] line-clamp-2">{achievement.description}</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className="text-xs border-[#A56ABD]/30 text-[#6E3482]"
                        >
                          {achievement.achievement_type}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          
          {/* Show More Button */}
          {regularAchievements.length > 8 && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setShowAll(!showAll)}
                className="border-[#A56ABD] text-[#6E3482] hover:bg-[#F5EBFA] hover:border-[#6E3482]"
              >
                {showAll ? 'Tampilkan Lebih Sedikit' : `Tampilkan Semua (${regularAchievements.length - 8} lainnya)`}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {achievements.length === 0 && (
        <motion.div 
          className="text-center py-12 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Award className="w-16 h-16 text-[#A56ABD] mx-auto" />
          <h3 className="text-lg font-semibold text-[#6E3482]">Belum ada pencapaian</h3>
          <p className="text-[#A56ABD]">
            Mulai tambahkan pencapaian dan badge Anda untuk menunjukkan prestasi
          </p>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Pencapaian Pertama
          </Button>
        </motion.div>
      )}

      {/* Add/Edit Achievement Dialog */}
      <AddAchievementDialog
        isOpen={isAddDialogOpen || !!editingAchievement}
        onClose={() => {
          setIsAddDialogOpen(false);
          setEditingAchievement(null);
        }}
        onAchievementAdded={loadAchievements}
        editingAchievement={editingAchievement}
      />
    </div>
  );
};

export default ProfileAchievements;
