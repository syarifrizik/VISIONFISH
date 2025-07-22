
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Target, 
  Star, 
  Calendar, 
  Activity,
  Fish,
  Users,
  Zap,
  Eye,
  Heart
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { fetchUserProfileStats, UserProfileStats, getTrendData, TrendData } from '@/services/profileStatsService';

const EfficientStatsGrid = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserProfileStats | null>(null);
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('overview');

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

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-[#A56ABD]" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-[#6E3482]" />;
    }
  };

  // Organized stats by category
  const statCategories = {
    overview: [
      {
        key: 'total_catch',
        title: 'Total Tangkapan',
        subtitle: 'Keseluruhan (kg)',
        value: stats?.total_catch || 0,
        change: stats?.monthly_catch_increase || 0,
        changeLabel: 'bulan ini',
        icon: Fish,
        color: 'from-[#6E3482] to-[#A56ABD]'
      },
      {
        key: 'user_rating',
        title: 'Rating VisionFish',
        subtitle: 'Dari komunitas',
        value: stats?.user_rating || 0,
        change: stats?.total_reviews || 0,
        changeLabel: 'reviews',
        icon: Star,
        color: 'from-[#A56ABD] to-[#E7D7EF]',
        isRating: true
      },
      {
        key: 'followers_count',
        title: 'Aktivitas Score',
        subtitle: 'Poin interaksi',
        value: stats?.followers_count || 0,
        change: stats?.weekly_followers_increase || 0,
        changeLabel: 'minggu ini',
        icon: Activity,
        color: 'from-[#49225B] to-[#6E3482]'
      },
      {
        key: 'trend_score',
        title: 'Trend Score',
        subtitle: 'Popularitas',
        value: stats?.trend_score || 0,
        change: stats?.trend_change || 0,
        changeLabel: 'perubahan',
        icon: TrendingUp,
        color: 'from-[#6E3482] to-[#49225B]',
        trendData: trendData
      }
    ],
    achievements: [
      {
        key: 'achievements_count',
        title: 'Total Prestasi',
        subtitle: 'Badge earned',
        value: stats?.achievements_count || 0,
        change: stats?.new_achievements || 0,
        changeLabel: 'baru',
        icon: Award,
        color: 'from-[#A56ABD] to-[#E7D7EF]'
      },
      {
        key: 'active_days',
        title: 'Hari Aktif',
        subtitle: 'Bulan ini',
        value: stats?.active_days || 0,
        change: 0,
        changeLabel: 'hari',
        icon: Calendar,
        color: 'from-[#6E3482] to-[#49225B]'
      }
    ],
    engagement: [
      {
        key: 'profile_views',
        title: 'Profile Views',
        subtitle: 'Total kunjungan',
        value: 2450,
        change: 23,
        changeLabel: 'minggu ini',
        icon: Eye,
        color: 'from-[#49225B] to-[#6E3482]'
      },
      {
        key: 'likes_received',
        title: 'Likes Diterima',
        subtitle: 'Dari komunitas',
        value: 1890,
        change: 15,
        changeLabel: 'hari ini',
        icon: Heart,
        color: 'from-[#A56ABD] to-[#E7D7EF]'
      }
    ]
  };

  const categories = [
    { key: 'overview', label: 'Overview', icon: Target },
    { key: 'achievements', label: 'Prestasi', icon: Award },
    { key: 'engagement', label: 'Engagement', icon: Users }
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Mobile Loading */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-3">
                  <div className="h-16 bg-[#E7D7EF] rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Desktop Loading */}
        <div className="hidden md:block">
          <div className="grid grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-20 bg-[#E7D7EF] rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile: Compact Tabbed Stats */}
      <div className="md:hidden">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          {/* Sticky Category Tabs */}
          <div className="sticky top-16 z-10 bg-[#E7D7EF]/95 backdrop-blur-sm p-2 rounded-xl border border-[#A56ABD]/20 shadow-lg mb-4">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 rounded-lg p-1 gap-1">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <TabsTrigger 
                    key={category.key}
                    value={category.key} 
                    className="data-[state=active]:bg-[#6E3482] data-[state=active]:text-white rounded-lg font-medium transition-all duration-300 text-xs flex items-center gap-1 py-2 px-2 text-[#49225B]"
                  >
                    <IconComponent className="w-3 h-3" />
                    <span>{category.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* Tab Content with 2-Column Grid */}
          <AnimatePresence mode="wait">
            {categories.map((category) => (
              <TabsContent key={category.key} value={category.key} className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 gap-3"
                >
                  {statCategories[category.key as keyof typeof statCategories]?.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <motion.div
                        key={stat.key}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Card className={`bg-gradient-to-br ${stat.color} border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-white`}>
                          <CardContent className="p-3 space-y-2">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                              <IconComponent className="w-4 h-4 text-white" />
                              {stat.change !== 0 && (
                                <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30 px-1.5 py-0.5">
                                  {stat.change > 0 ? '+' : ''}{stat.change}
                                </Badge>
                              )}
                            </div>
                            
                            {/* Value */}
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <span className="text-lg font-bold text-white">
                                  {stat.isRating ? stat.value.toFixed(1) : stat.value}
                                  {stat.key === 'trend_score' && '%'}
                                </span>
                                {stat.isRating && (
                                  <Star className="w-3 h-3 text-[#E7D7EF] fill-current" />
                                )}
                                {stat.key === 'trend_score' && stat.trendData && (
                                  <div className="flex items-center gap-1">
                                    {getTrendIcon(stat.trendData.trend_direction)}
                                  </div>
                                )}
                              </div>
                              
                              <div>
                                <p className="text-xs font-medium text-white/90 leading-tight">
                                  {stat.title}
                                </p>
                                <p className="text-xs text-white/70">
                                  {stat.subtitle}
                                </p>
                              </div>
                              
                              {stat.change !== 0 && stat.key !== 'trend_score' && (
                                <div className="flex items-center gap-1">
                                  {stat.change > 0 ? (
                                    <TrendingUp className="w-2.5 h-2.5 text-white/80" />
                                  ) : (
                                    <TrendingDown className="w-2.5 h-2.5 text-white/80" />
                                  )}
                                  <span className="text-xs text-white/80">
                                    {stat.changeLabel}
                                  </span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>
      </div>

      {/* Desktop: Comprehensive Stats Grid */}
      <div className="hidden md:block space-y-6">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          {/* Desktop Category Tabs */}
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-[#A56ABD]/20 shadow-lg gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TabsTrigger 
                  key={category.key}
                  value={category.key} 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6E3482] data-[state=active]:to-[#A56ABD] data-[state=active]:text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2 py-3 px-4 text-[#49225B]"
                >
                  <IconComponent className="w-5 h-5" />
                  {category.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Desktop Tab Content */}
          <AnimatePresence mode="wait">
            {categories.map((category) => (
              <TabsContent key={category.key} value={category.key} className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  {statCategories[category.key as keyof typeof statCategories]?.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <motion.div
                        key={stat.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        <Card className={`bg-gradient-to-br ${stat.color} border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-white group`}>
                          <CardContent className="p-6 space-y-4">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                              <div className="p-3 rounded-lg bg-white/20 group-hover:bg-white/30 transition-all duration-300">
                                <IconComponent className="w-6 h-6 text-white" />
                              </div>
                              {stat.change !== 0 && (
                                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                                  {stat.change > 0 ? '+' : ''}{stat.change}
                                </Badge>
                              )}
                            </div>
                            
                            {/* Value */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-white">
                                  {stat.isRating ? stat.value.toFixed(1) : stat.value}
                                  {stat.key === 'trend_score' && '%'}
                                </span>
                                {stat.isRating && (
                                  <Star className="w-4 h-4 text-[#E7D7EF] fill-current" />
                                )}
                                {stat.key === 'trend_score' && stat.trendData && (
                                  <div className="flex items-center gap-1">
                                    {getTrendIcon(stat.trendData.trend_direction)}
                                    <span className="text-sm text-white/80">
                                      {stat.trendData.change > 0 ? '+' : ''}{stat.trendData.change}%
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              <div>
                                <p className="font-medium text-white">
                                  {stat.title}
                                </p>
                                <p className="text-sm text-white/70">
                                  {stat.subtitle}
                                </p>
                              </div>
                              
                              {stat.change !== 0 && stat.key !== 'trend_score' && (
                                <div className="flex items-center gap-2">
                                  {stat.change > 0 ? (
                                    <TrendingUp className="w-4 h-4 text-white/80" />
                                  ) : (
                                    <TrendingDown className="w-4 h-4 text-white/80" />
                                  )}
                                  <span className="text-sm text-white/80">
                                    {stat.changeLabel}
                                  </span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
};

export default EfficientStatsGrid;
