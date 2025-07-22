
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus, Eye, Award, Users, Star, Calendar, Target, Edit3, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { fetchUserProfileStats, updateUserProfileStats, UserProfileStats } from '@/services/profileStatsService';

interface CompactStatsCarouselProps {
  autoRotate?: boolean;
  itemsPerPage?: number;
}

const CompactStatsCarousel = ({ 
  autoRotate = true, 
  itemsPerPage = 6 
}: CompactStatsCarouselProps) => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoRotate);
  const [stats, setStats] = useState<UserProfileStats | null>(null);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    if (user?.id) {
      loadProfileStats();
    }
  }, [user?.id]);

  const loadProfileStats = async () => {
    if (!user?.id) return;
    
    try {
      const data = await fetchUserProfileStats(user.id);
      setStats(data);
    } catch (error) {
      console.error('Error loading profile stats:', error);
    }
  };

  const handleCardEdit = (cardKey: string, currentValue: number | string) => {
    setEditingCard(cardKey);
    setEditValue(currentValue.toString());
  };

  const handleSaveCardEdit = async (cardKey: string) => {
    if (!user?.id || !stats) return;

    const numericValue = cardKey === 'user_rating' ? parseFloat(editValue) : parseInt(editValue);
    
    if (isNaN(numericValue)) {
      showNotification('Nilai harus berupa angka', 'error');
      return;
    }

    try {
      const updateData = { [cardKey]: numericValue };
      const result = await updateUserProfileStats(user.id, updateData);

      if (result.success) {
        setStats(prev => prev ? { ...prev, [cardKey]: numericValue } : null);
        setEditingCard(null);
        showNotification('Statistik berhasil diperbarui', 'success');
      } else {
        showNotification('Gagal memperbarui statistik', 'error');
      }
    } catch (error) {
      console.error('Error updating stat:', error);
      showNotification('Terjadi kesalahan', 'error');
    }
  };

  const handleCancelEdit = () => {
    setEditingCard(null);
    setEditValue('');
  };

  const statItems = [
    {
      id: 'total_catch',
      icon: Target,
      label: 'Total Tangkapan',
      value: stats?.total_catch || 0,
      change: stats?.monthly_catch_increase || 0,
      changeType: (stats?.monthly_catch_increase || 0) > 0 ? 'increase' as const : 'neutral' as const,
      color: 'from-[#6E3482] to-[#A56ABD]',
      period: 'bulan ini',
      description: 'Peningkatan signifikan dalam aktivitas menangkap ikan'
    },
    {
      id: 'achievements_count',
      icon: Award,
      label: 'Prestasi',
      value: stats?.achievements_count || 0,
      change: stats?.new_achievements || 0,
      changeType: (stats?.new_achievements || 0) > 0 ? 'increase' as const : 'neutral' as const,
      color: 'from-[#A56ABD] to-[#E70BEF]',
      period: 'baru',
      description: 'Badge baru berhasil diraih minggu ini'
    },
    {
      id: 'followers_count',
      icon: Users,
      label: 'Followers',
      value: stats?.followers_count || 0,
      change: stats?.weekly_followers_increase || 0,
      changeType: (stats?.weekly_followers_increase || 0) > 0 ? 'increase' as const : 'neutral' as const,
      color: 'from-[#49225B] to-[#6E3482]',
      period: 'minggu ini',
      description: 'Komunitas yang terus berkembang'
    },
    {
      id: 'user_rating',
      icon: Star,
      label: 'Rating',
      value: stats?.user_rating || 0,
      change: stats?.total_reviews || 0,
      changeType: 'increase' as const,
      color: 'from-[#E70BEF] to-[#A56ABD]',
      period: 'reviews',
      description: 'Penilaian positif dari komunitas'
    },
    {
      id: 'active_days',
      icon: Calendar,
      label: 'Hari Aktif',
      value: stats?.active_days || 0,
      change: 0,
      changeType: 'neutral' as const,
      color: 'from-[#6E3482] to-[#49225B]',
      period: 'bulan ini',
      description: 'Konsistensi aktivitas harian'
    },
    {
      id: 'views',
      icon: Eye,
      label: 'Profile Views',
      value: 3254,
      change: 234,
      changeType: 'increase' as const,
      color: 'from-[#A56ABD] to-[#6E3482]',
      period: 'minggu ini',
      description: 'Peningkatan visibilitas profil'
    }
  ];

  const totalPages = Math.ceil(statItems.length / itemsPerPage);
  const currentStats = statItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentPage(prev => (prev + 1) % totalPages);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, totalPages]);

  const getTrendIcon = (changeType: 'increase' | 'decrease' | 'neutral') => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'decrease':
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      default:
        return <Minus className="w-3 h-3 text-gray-400" />;
    }
  };

  const getTrendColor = (changeType: 'increase' | 'decrease' | 'neutral') => {
    switch (changeType) {
      case 'increase':
        return 'text-green-400 bg-green-400/20';
      case 'decrease':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="relative" onMouseEnter={() => setIsPlaying(false)} onMouseLeave={() => setIsPlaying(autoRotate)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Statistik Real-time</h3>
          <p className="text-sm text-[#A56ABD]">Data terupdate secara otomatis</p>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="w-10 h-10 p-0 border-[#A56ABD]/30 hover:bg-[#F5EBFA]/10 disabled:opacity-50 bg-white/5 backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
            className="w-10 h-10 p-0 border-[#A56ABD]/30 hover:bg-[#F5EBFA]/10 disabled:opacity-50 bg-white/5 backdrop-blur-sm"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>

      {/* Stats Grid - Mobile: 2 columns, Desktop: 3 columns */}
      <div className="relative overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-3"
          >
            {currentStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className={`h-full border-0 bg-gradient-to-br ${stat.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group cursor-pointer`}>
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <motion.div 
                        className="absolute top-0 right-0 w-16 h-16 bg-white rounded-full"
                        animate={{ 
                          x: [0, 10, 0],
                          y: [0, -10, 0] 
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        style={{ transform: 'translate(50%, -50%)' }}
                      />
                      <motion.div 
                        className="absolute bottom-0 left-0 w-12 h-12 bg-white rounded-full"
                        animate={{ 
                          x: [0, -8, 0],
                          y: [0, 8, 0] 
                        }}
                        transition={{ 
                          duration: 2.5, 
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.5
                        }}
                        style={{ transform: 'translate(-50%, 50%)' }}
                      />
                    </div>

                    <CardContent className="p-3 md:p-4 relative z-10">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-300 min-w-[40px] min-h-[40px] flex items-center justify-center">
                          <IconComponent className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge className={`${getTrendColor(stat.changeType)} border-0 flex items-center gap-1 text-xs`}>
                            {getTrendIcon(stat.changeType)}
                            {Math.abs(stat.change)}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCardEdit(stat.id, stat.value)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1 h-auto w-auto hover:bg-white/20"
                          >
                            <Edit3 className="w-3 h-3 text-white" />
                          </Button>
                        </div>
                      </div>

                      {/* Value */}
                      <div className="space-y-1">
                        {editingCard === stat.id ? (
                          <div className="flex items-center gap-2 mb-2">
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="text-lg font-bold bg-white/20 border-white/30 text-white placeholder:text-white/70 h-8 text-center"
                              placeholder={stat.value.toString()}
                              type="number"
                              step={stat.id === 'user_rating' ? "0.1" : "1"}
                            />
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => handleSaveCardEdit(stat.id)}
                                className="p-1 h-6 w-6 bg-green-600 hover:bg-green-700"
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={handleCancelEdit}
                                className="p-1 h-6 w-6 bg-red-600 hover:bg-red-700"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-lg md:text-2xl font-bold tracking-tight">
                            {typeof stat.value === 'number' && stat.id === 'user_rating' 
                              ? stat.value.toFixed(1) 
                              : stat.value}
                          </div>
                        )}
                        <div className="text-xs md:text-sm opacity-90 font-medium">{stat.label}</div>
                        <div className="text-xs opacity-75">{stat.period}</div>
                      </div>

                      {/* Mobile: Compact description, Desktop: Full description */}
                      <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-white/20">
                        <p className="text-xs opacity-80 leading-relaxed line-clamp-2 md:line-clamp-none">
                          {stat.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentPage === index
                ? 'bg-white w-6'
                : 'bg-[#A56ABD]/40 w-2 hover:bg-[#A56ABD]/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CompactStatsCarousel;
