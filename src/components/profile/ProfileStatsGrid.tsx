
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Award, Target, Star, Calendar, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { fetchUserProfileStats, UserProfileStats, getTrendData, TrendData } from '@/services/profileStatsService';

const ProfileStatsGrid = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserProfileStats | null>(null);
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadProfileStats();
    }
  }, [user?.id]);

  const loadProfileStats = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const [data, trend] = await Promise.all([
        fetchUserProfileStats(user.id),
        getTrendData(user.id)
      ]);
      setStats(data);
      setTrendData(trend);
    } catch (error) {
      console.error('Error loading profile stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-gradient-to-br from-[#F5EBFA] to-white">
            <CardContent className="p-4">
              <div className="h-16 bg-[#A56ABD]/20 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-400" />;
    }
  };

  const statCards = [
    {
      key: 'total_catch',
      title: 'Total Tangkapan keseluruhan (kg)',
      value: stats?.total_catch || 0,
      change: stats?.monthly_catch_increase || 0,
      changeLabel: 'keseluruhan',
      icon: Target,
      color: 'from-[#6E3482] to-[#A56ABD]',
      textColor: 'text-white'
    },
    {
      key: 'achievements_count',
      title: 'Prestasi',
      value: stats?.achievements_count || 0,
      change: stats?.new_achievements || 0,
      changeLabel: 'baru',
      icon: Award,
      color: 'from-[#A56ABD] to-[#E70BEF]',
      textColor: 'text-white'
    },
    {
      key: 'followers_count',
      title: 'Aktivitas',
      value: stats?.followers_count || 0,
      change: stats?.weekly_followers_increase || 0,
      changeLabel: 'minggu ini',
      icon: Activity,
      color: 'from-[#49225B] to-[#6E3482]',
      textColor: 'text-white'
    },
    {
      key: 'user_rating',
      title: 'Rating VisionFish.io',
      value: stats?.user_rating || 0,
      change: stats?.total_reviews || 0,
      changeLabel: 'reviews',
      icon: Star,
      color: 'from-[#E70BEF] to-[#A56ABD]',
      textColor: 'text-white',
      isRating: true
    },
    {
      key: 'active_days',
      title: 'Hari Aktif',
      value: stats?.active_days || 0,
      change: 0,
      changeLabel: 'bulan ini',
      icon: Calendar,
      color: 'from-[#6E3482] to-[#49225B]',
      textColor: 'text-white'
    },
    {
      key: 'trend_score',
      title: 'Trend Score',
      value: stats?.trend_score || 0,
      change: stats?.trend_change || 0,
      changeLabel: 'poin',
      icon: TrendingUp,
      color: 'from-[#A56ABD] to-[#6E3482]',
      textColor: 'text-white',
      trendData: trendData
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Statistik Real-time</h2>
          <p className="text-[#A56ABD] text-sm">Data terupdate secara otomatis</p>
        </div>
      </div>

      {/* Professional Info Card */}
      {(stats?.job_title || stats?.company) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-[#F5EBFA] to-white border-[#A56ABD]/30 shadow-lg">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-[#6E3482] to-[#A56ABD]">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#49225B]">Informasi Profesional</h3>
                  <p className="text-sm text-[#6E3482]">Detail pekerjaan dan pengalaman</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats?.job_title && (
                  <div>
                    <p className="text-xs text-[#A56ABD] mb-1">Posisi</p>
                    <p className="font-medium text-[#49225B]">{stats.job_title}</p>
                  </div>
                )}
                {stats?.company && (
                  <div>
                    <p className="text-xs text-[#A56ABD] mb-1">Perusahaan</p>
                    <p className="font-medium text-[#49225B]">{stats.company}</p>
                  </div>
                )}
                {stats?.experience_years > 0 && (
                  <div>
                    <p className="text-xs text-[#A56ABD] mb-1">Pengalaman</p>
                    <p className="font-medium text-[#49225B]">{stats.experience_years} tahun</p>
                  </div>
                )}
                {stats?.specialization && (
                  <div>
                    <p className="text-xs text-[#A56ABD] mb-1">Spesialisasi</p>
                    <p className="font-medium text-[#49225B]">{stats.specialization}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <Card className={`bg-gradient-to-br ${stat.color} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 relative group`}>
              <CardContent className="p-3 md:p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.textColor}`} />
                  <div className="flex items-center gap-1">
                    {stat.change !== 0 && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-white/20 text-white border-white/30"
                      >
                        {stat.change > 0 ? '+' : ''}{stat.change}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <span className={`text-lg md:text-2xl font-bold ${stat.textColor}`}>
                      {stat.isRating ? stat.value.toFixed(1) : stat.value}
                      {stat.key === 'trend_score' && '%'}
                    </span>
                    {stat.isRating && (
                      <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-300 fill-current" />
                    )}
                    {stat.key === 'trend_score' && stat.trendData && (
                      <div className="flex items-center gap-1 ml-1">
                        {getTrendIcon(stat.trendData.trend_direction)}
                        <span className="text-xs text-white/80">
                          {stat.trendData.change > 0 ? '+' : ''}{stat.trendData.change}%
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <p className={`text-xs ${stat.textColor} opacity-90 font-medium`}>
                    {stat.title}
                  </p>
                  
                  {stat.change !== 0 && stat.key !== 'trend_score' && (
                    <div className="flex items-center gap-1">
                      {stat.change > 0 ? (
                        <TrendingUp className="w-3 h-3 text-white opacity-80" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-white opacity-80" />
                      )}
                      <span className={`text-xs ${stat.textColor} opacity-80`}>
                        {stat.changeLabel}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProfileStatsGrid;
