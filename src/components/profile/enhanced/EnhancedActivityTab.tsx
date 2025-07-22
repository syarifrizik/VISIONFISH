
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Fish, 
  MessageSquare, 
  Heart, 
  Calendar,
  MapPin,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  Flame,
  Trophy
} from 'lucide-react';
import { useEnhancedActivityFeed } from '@/hooks/useEnhancedActivityFeed';
import { useActivityStreaks } from '@/hooks/useActivityStreaks';
import { useGamification } from '@/hooks/useGamification';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import EnhancedActivityFeed from './EnhancedActivityFeed';
import ActivityStatsCards from './ActivityStatsCards';
import ActivityPatternChart from './ActivityPatternChart';

const EnhancedActivityTab = () => {
  const { activities, isLoading, error } = useEnhancedActivityFeed();
  const { streaks } = useActivityStreaks();
  const { totalPoints, level, achievements } = useGamification();

  // Calculate stats for cards
  const stats = {
    totalActivities: activities.length,
    activitiesToday: activities.filter(a => {
      const today = new Date().toDateString();
      return new Date(a.created_at).toDateString() === today;
    }).length,
    currentStreak: Math.max(...(streaks.map(s => s.current_streak).concat([0]))),
    totalPoints,
    level,
    achievements: achievements.filter(a => a.isUnlocked).length
  };

  // Generate sample data for charts (in real app, calculate from activities)
  const weeklyData = [
    { day: 'Sen', activities: 12, messages: 8, posts: 2 },
    { day: 'Sel', activities: 15, messages: 10, posts: 3 },
    { day: 'Rab', activities: 8, messages: 5, posts: 1 },
    { day: 'Kam', activities: 20, messages: 15, posts: 4 },
    { day: 'Jum', activities: 18, messages: 12, posts: 3 },
    { day: 'Sab', activities: 25, messages: 18, posts: 5 },
    { day: 'Min', activities: 22, messages: 16, posts: 4 }
  ];

  const monthlyData = [
    { month: 'Jan', total: 150 },
    { month: 'Feb', total: 180 },
    { month: 'Mar', total: 200 },
    { month: 'Apr', total: 175 },
    { month: 'Mei', total: 220 },
    { month: 'Jun', total: 250 }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Coba Lagi
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            🚀 Aktivitas Enhanced
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track your progress, streaks, and achievements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <ActivityStatsCards stats={stats} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="gamification" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Gamification
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Activity Pattern Charts */}
          <ActivityPatternChart weeklyData={weeklyData} monthlyData={monthlyData} />
          
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Aktivitas Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Belum Ada Aktivitas
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Mulai beraktivitas untuk melihat riwayat di sini
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activities.slice(0, 5).map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.activity_type.replace('_', ' ').toLowerCase()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(activity.created_at), {
                            addSuffix: true,
                            locale: idLocale
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gamification" className="mt-6">
          <EnhancedActivityFeed />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6 space-y-6">
          <ActivityPatternChart weeklyData={weeklyData} monthlyData={monthlyData} />
          
          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Performance Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.activitiesToday}
                  </div>
                  <div className="text-sm text-blue-600">Aktivitas Hari Ini</div>
                  <div className="text-xs text-gray-500 mt-1">+20% dari kemarin</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(stats.totalActivities / 30)}
                  </div>
                  <div className="text-sm text-green-600">Rata-rata Harian</div>
                  <div className="text-xs text-gray-500 mt-1">30 hari terakhir</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.currentStreak}
                  </div>
                  <div className="text-sm text-purple-600">Streak Terpanjang</div>
                  <div className="text-xs text-gray-500 mt-1">Hari berturut-turut</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedActivityTab;
