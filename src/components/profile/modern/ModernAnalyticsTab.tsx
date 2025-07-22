
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Share2, 
  Filter,
  Calendar,
  Target,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  dailyActivities: Array<{ date: string; count: number; type: string }>;
  weeklyTrends: Array<{ week: string; activities: number; growth: number }>;
  activityDistribution: Array<{ type: string; count: number; percentage: number }>;
  performanceMetrics: {
    averageDaily: number;
    peakDay: string;
    mostActiveTime: string;
    consistency: number;
  };
}

interface FilterOptions {
  timeRange: '7d' | '30d' | '90d' | '1y';
  activityType: 'all' | 'fishing' | 'notes' | 'social';
}

const ModernAnalyticsTab = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    timeRange: '30d',
    activityType: 'all'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadAnalyticsData();
    }
  }, [user?.id, filters]);

  const loadAnalyticsData = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      
      switch (filters.timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      // Load user activities
      const { data: activities, error: activitiesError } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      if (activitiesError) throw activitiesError;

      // Load additional data based on filter
      let additionalData = [];
      if (filters.activityType === 'fishing') {
        const { data: fishCatches } = await supabase
          .from('fish_catches')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());
        additionalData = fishCatches || [];
      } else if (filters.activityType === 'notes') {
        const { data: notes } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());
        additionalData = notes || [];
      }

      // Process analytics data
      const processedData = processAnalyticsData(activities || [], additionalData, filters);
      setAnalyticsData(processedData);

    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processAnalyticsData = (activities: any[], additionalData: any[], filters: FilterOptions): AnalyticsData => {
    // Combine all activities
    const allActivities = [
      ...activities.map(a => ({ ...a, source: 'activity' })),
      ...additionalData.map(a => ({ ...a, source: filters.activityType, activity_type: filters.activityType }))
    ];

    // Process daily activities
    const dailyActivities = processDailyActivities(allActivities);
    
    // Process weekly trends
    const weeklyTrends = processWeeklyTrends(allActivities);
    
    // Process activity distribution
    const activityDistribution = processActivityDistribution(allActivities);
    
    // Calculate performance metrics
    const performanceMetrics = calculatePerformanceMetrics(allActivities);

    return {
      dailyActivities,
      weeklyTrends,
      activityDistribution,
      performanceMetrics
    };
  };

  const processDailyActivities = (activities: any[]) => {
    const dailyCount: Record<string, number> = {};
    
    activities.forEach(activity => {
      const date = new Date(activity.created_at).toISOString().split('T')[0];
      dailyCount[date] = (dailyCount[date] || 0) + 1;
    });

    return Object.entries(dailyCount)
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
        count,
        type: 'activity'
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30); // Last 30 days
  };

  const processWeeklyTrends = (activities: any[]) => {
    const weeklyData: Record<string, number> = {};
    
    activities.forEach(activity => {
      const date = new Date(activity.created_at);
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
      const weekKey = weekStart.toISOString().split('T')[0];
      weeklyData[weekKey] = (weeklyData[weekKey] || 0) + 1;
    });

    const weeks = Object.entries(weeklyData)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .slice(-8); // Last 8 weeks

    return weeks.map(([week, activities], index) => {
      const prevWeek = index > 0 ? weeks[index - 1][1] : activities;
      const growth = prevWeek > 0 ? Math.round(((activities - prevWeek) / prevWeek) * 100) : 0;
      
      return {
        week: new Date(week).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
        activities,
        growth
      };
    });
  };

  const processActivityDistribution = (activities: any[]) => {
    const typeCount: Record<string, number> = {};
    
    activities.forEach(activity => {
      const type = activity.activity_type || activity.source || 'other';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    const total = Object.values(typeCount).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(typeCount)
      .map(([type, count]) => ({
        type: getActivityLabel(type),
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  };

  const calculatePerformanceMetrics = (activities: any[]) => {
    if (activities.length === 0) {
      return {
        averageDaily: 0,
        peakDay: 'Tidak ada data',
        mostActiveTime: 'Tidak ada data',
        consistency: 0
      };
    }

    // Calculate average daily
    const days = Math.max(1, Math.ceil((new Date().getTime() - new Date(activities[activities.length - 1]?.created_at).getTime()) / (1000 * 60 * 60 * 24)));
    const averageDaily = Math.round((activities.length / days) * 10) / 10;

    // Find peak day
    const dayCount: Record<string, number> = {};
    activities.forEach(activity => {
      const day = new Date(activity.created_at).toLocaleDateString('id-ID', { weekday: 'long' });
      dayCount[day] = (dayCount[day] || 0) + 1;
    });
    const peakDay = Object.entries(dayCount).reduce((a, b) => dayCount[a[0]] > dayCount[b[0]] ? a : b)[0];

    // Find most active time
    const hourCount: Record<number, number> = {};
    activities.forEach(activity => {
      const hour = new Date(activity.created_at).getHours();
      hourCount[hour] = (hourCount[hour] || 0) + 1;
    });
    const mostActiveHour = Object.entries(hourCount).reduce((a, b) => hourCount[parseInt(a[0])] > hourCount[parseInt(b[0])] ? a : b)[0];
    const mostActiveTime = `${mostActiveHour}:00 - ${parseInt(mostActiveHour) + 1}:00`;

    // Calculate consistency (days with activity / total days)
    const uniqueDays = new Set(activities.map(a => new Date(a.created_at).toDateString())).size;
    const consistency = Math.round((uniqueDays / days) * 100);

    return {
      averageDaily,
      peakDay,
      mostActiveTime,
      consistency
    };
  };

  const getActivityLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'message_sent': 'Pesan',
      'message_liked': 'Like',
      'fishing': 'Memancing',
      'notes': 'Catatan',
      'social': 'Sosial',
      'other': 'Lainnya'
    };
    return labels[type] || type;
  };

  const handleExport = () => {
    if (!analyticsData) return;
    
    const exportData = {
      exported_at: new Date().toISOString(),
      filters,
      data: analyticsData
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const chartColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="h-64 bg-white/10 rounded-2xl"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-6">
      {/* Filters & Controls */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Advanced Analytics
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleExport}
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white/60" />
              <Select
                value={filters.timeRange}
                onValueChange={(value: any) => setFilters({ ...filters, timeRange: value })}
              >
                <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="7d">7 Hari</SelectItem>
                  <SelectItem value="30d">30 Hari</SelectItem>
                  <SelectItem value="90d">90 Hari</SelectItem>
                  <SelectItem value="1y">1 Tahun</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-white/60" />
              <Select
                value={filters.activityType}
                onValueChange={(value: any) => setFilters({ ...filters, activityType: value })}
              >
                <SelectTrigger className="w-36 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="fishing">Memancing</SelectItem>
                  <SelectItem value="notes">Catatan</SelectItem>
                  <SelectItem value="social">Sosial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm">Rata-rata Harian</p>
                  <p className="text-2xl font-bold text-white">{analyticsData.performanceMetrics.averageDaily}</p>
                </div>
                <Target className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm">Hari Paling Aktif</p>
                  <p className="text-lg font-bold text-white truncate">{analyticsData.performanceMetrics.peakDay}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Waktu Paling Aktif</p>
                  <p className="text-lg font-bold text-white">{analyticsData.performanceMetrics.mostActiveTime}</p>
                </div>
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-200 text-sm">Konsistensi</p>
                  <p className="text-2xl font-bold text-white">{analyticsData.performanceMetrics.consistency}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Activity Trends Chart */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Daily Activity Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.dailyActivities}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="date" stroke="#ffffff60" fontSize={12} />
              <YAxis stroke="#ffffff60" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: 'white'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ r: 6, fill: '#3B82F6' }}
                activeDot={{ r: 8, fill: '#1D4ED8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weekly Trends & Activity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Weekly Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analyticsData.weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="week" stroke="#ffffff60" fontSize={11} />
                <YAxis stroke="#ffffff60" fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: 'white'
                  }} 
                />
                <Bar dataKey="activities" fill="#10B981" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Activity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analyticsData.activityDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={({ type, percentage }) => `${type}: ${percentage}%`}
                >
                  {analyticsData.activityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: 'white'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity Breakdown Table */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Activity Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analyticsData.activityDistribution.map((item, index) => (
              <motion.div
                key={item.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: chartColors[index % chartColors.length] }}
                  />
                  <span className="text-white font-medium">{item.type}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white/60">{item.count} aktivitas</span>
                  <span className="text-white font-semibold">{item.percentage}%</span>
                  <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${item.percentage}%`,
                        backgroundColor: chartColors[index % chartColors.length]
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernAnalyticsTab;
