
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Trophy, 
  Heart, 
  MessageCircle, 
  Zap, 
  Star, 
  TrendingUp,
  Activity,
  Users,
  Calendar
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { fetchUserStats } from '@/services/profileService';
import { fetchUserProfileStats } from '@/services/profileStatsService';

const CompactStatsOverview = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<any>(null);
  const [profileStats, setProfileStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAllStats = async () => {
      if (user?.id) {
        try {
          setIsLoading(true);
          console.log('Loading stats for user:', user.id);
          
          // Load user stats dari Supabase
          const [statsData, profileStatsData] = await Promise.all([
            fetchUserStats(user.id),
            fetchUserProfileStats(user.id)
          ]);
          
          console.log('User stats loaded:', statsData);
          console.log('Profile stats loaded:', profileStatsData);
          
          setUserStats(statsData);
          setProfileStats(profileStatsData);
        } catch (error) {
          console.error('Error loading stats:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadAllStats();
  }, [user?.id]);

  // Hitung statistik berdasarkan data real dari Supabase
  const quickStats = [
    {
      id: 'fish_caught',
      icon: Target,
      label: 'Ikan Ditangkap',
      value: profileStats?.total_catch || 0,
      trend: profileStats?.monthly_catch_increase > 0 ? `+${profileStats.monthly_catch_increase}` : '0',
      color: 'from-[#6E3482] to-[#A56ABD]',
      bgGlow: 'shadow-[#6E3482]/30'
    },
    {
      id: 'achievements',
      icon: Trophy,
      label: 'Pencapaian',
      value: profileStats?.achievements_count || 0,
      trend: profileStats?.new_achievements > 0 ? `+${profileStats.new_achievements}` : '0',
      color: 'from-yellow-500 to-yellow-600',
      bgGlow: 'shadow-yellow-500/30'
    },
    {
      id: 'likes',
      icon: Heart,
      label: 'Total Likes',
      value: userStats?.total_likes_received || 0,
      trend: userStats?.total_likes_received > userStats?.total_likes_given ? '+' : '0',
      color: 'from-pink-500 to-rose-500',
      bgGlow: 'shadow-pink-500/30'
    },
    {
      id: 'messages',
      icon: MessageCircle,
      label: 'Pesan Dikirim',
      value: userStats?.total_messages || 0,
      trend: userStats?.total_messages > 0 ? `${userStats.total_messages}` : '0',
      color: 'from-blue-500 to-cyan-500',
      bgGlow: 'shadow-blue-500/30'
    },
    {
      id: 'active_days',
      icon: Zap,
      label: 'Hari Aktif',
      value: profileStats?.active_days || 0,
      trend: 'aktif',
      color: 'from-orange-500 to-red-500',
      bgGlow: 'shadow-orange-500/30'
    },
    {
      id: 'rating',
      icon: Star,
      label: 'Rating',
      value: profileStats?.user_rating?.toFixed(1) || '0.0',
      trend: profileStats?.trend_change > 0 ? `+${profileStats.trend_change}` : '0',
      color: 'from-emerald-500 to-green-500',
      bgGlow: 'shadow-emerald-500/30'
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-white/10 rounded animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 md:h-32 bg-white/10 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.h3 
          className="text-lg md:text-xl font-bold text-white flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-[#6E3482] to-[#A56ABD] flex items-center justify-center">
            <Activity className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          Ringkasan Aktivitas
        </motion.h3>
        <Badge className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] text-white px-3 py-1 text-xs md:text-sm">
          Data Real-time
        </Badge>
      </div>

      {/* Compact Stats Grid - Mobile Optimized */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group cursor-pointer"
            >
              <Card className={`
                relative overflow-hidden border-0 bg-gradient-to-br ${stat.color} text-white 
                shadow-lg hover:shadow-xl ${stat.bgGlow} transition-all duration-300 
                group-hover:shadow-2xl h-24 md:h-32
              `}>
                <CardContent className="p-3 md:p-4 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="p-1.5 md:p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                      <IconComponent className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                    <Badge variant="secondary" className="bg-white/20 text-white border-0 group-hover:bg-white/30 text-xs">
                      {stat.trend}
                    </Badge>
                  </div>
                  <div className="space-y-0.5 md:space-y-1">
                    <div className="text-lg md:text-xl font-bold">{stat.value}</div>
                    <div className="text-xs opacity-90 line-clamp-2">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4 text-[#A56ABD]" />
              <span className="text-lg md:text-xl font-bold text-white">
                {userStats?.total_messages > 0 
                  ? ((userStats.total_likes_received / userStats.total_messages) * 100).toFixed(1)
                  : '0.0'
                }%
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#E7D7EF]">Engagement Rate</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Users className="w-4 h-4 text-[#A56ABD]" />
              <span className="text-lg md:text-xl font-bold text-white">{profileStats?.followers_count || 0}</span>
            </div>
            <p className="text-xs md:text-sm text-[#E7D7EF]">Followers</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Calendar className="w-4 h-4 text-[#A56ABD]" />
              <span className="text-lg md:text-xl font-bold text-white">{profileStats?.active_days || 0}</span>
            </div>
            <p className="text-xs md:text-sm text-[#E7D7EF]">Hari Aktif</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-[#A56ABD]" />
              <span className="text-lg md:text-xl font-bold text-white">
                {profileStats?.experience_years > 0 ? `${profileStats.experience_years} Tahun` : 'Pemula'}
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#E7D7EF]">Pengalaman</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CompactStatsOverview;
