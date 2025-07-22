
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, BarChart3, Download, Share2, Filter, Users, Activity as ActivityIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { supabase } from '@/integrations/supabase/client';
import { DateRange } from 'react-day-picker';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface ActivityStats {
  totalActivities: number;
  activitiesByType: Record<string, number>;
  dailyActivities: Array<{ date: string; count: number }>;
  topActivities: Array<{ type: string; count: number; label: string }>;
  weeklyGrowth: number;
  monthlyGrowth: number;
}

interface ActivityAnalyticsProps {
  onExport: (data: any) => void;
  onShare: () => void;
}

const ActivityAnalytics = ({ onExport, onShare }: ActivityAnalyticsProps) => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30days');

  useEffect(() => {
    if (user?.id) {
      loadActivityStats();
    }
  }, [user?.id, dateRange]);

  const loadActivityStats = async () => {
    if (!user?.id || !dateRange.from || !dateRange.to) return;

    setIsLoading(true);
    try {
      const { data: activities, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate statistics
      const totalActivities = activities?.length || 0;
      
      // Activities by type
      const activitiesByType: Record<string, number> = {};
      activities?.forEach(activity => {
        activitiesByType[activity.activity_type] = (activitiesByType[activity.activity_type] || 0) + 1;
      });

      // Daily activities for trend
      const dailyActivities: Array<{ date: string; count: number }> = [];
      const dailyCount: Record<string, number> = {};
      
      activities?.forEach(activity => {
        const date = format(new Date(activity.created_at), 'yyyy-MM-dd');
        dailyCount[date] = (dailyCount[date] || 0) + 1;
      });

      Object.entries(dailyCount).forEach(([date, count]) => {
        dailyActivities.push({ date, count });
      });

      // Top activities
      const topActivities = Object.entries(activitiesByType)
        .map(([type, count]) => ({
          type,
          count,
          label: getActivityLabel(type)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Growth calculations (compare with previous period)
      const periodDays = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
      const previousFrom = subDays(dateRange.from, periodDays);
      const previousTo = dateRange.from;

      const { data: previousActivities } = await supabase
        .from('user_activities')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', previousFrom.toISOString())
        .lt('created_at', previousTo.toISOString());

      const previousCount = previousActivities?.length || 0;
      const weeklyGrowth = previousCount > 0 ? ((totalActivities - previousCount) / previousCount) * 100 : 0;
      const monthlyGrowth = weeklyGrowth; // Simplified for now

      setStats({
        totalActivities,
        activitiesByType,
        dailyActivities,
        topActivities,
        weeklyGrowth,
        monthlyGrowth
      });

    } catch (error) {
      console.error('Error loading activity stats:', error);
      showNotification('Gagal memuat statistik aktivitas', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'message_sent': return 'Mengirim Pesan';
      case 'profile_updated': return 'Update Profil';
      case 'content_created': return 'Buat Konten';
      case 'note_created': return 'Buat Catatan';
      case 'fish_caught': return 'Tangkap Ikan';
      case 'user_followed': return 'Follow User';
      case 'community_post_created': return 'Post Komunitas';
      case 'achievement_earned': return 'Raih Achievement';
      default: return 'Aktivitas';
    }
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    const today = new Date();
    
    switch (period) {
      case '7days':
        setDateRange({ from: subDays(today, 7), to: today });
        break;
      case '30days':
        setDateRange({ from: subDays(today, 30), to: today });
        break;
      case 'thisweek':
        setDateRange({ from: startOfWeek(today), to: endOfWeek(today) });
        break;
      case 'thismonth':
        setDateRange({ from: startOfMonth(today), to: endOfMonth(today) });
        break;
      default:
        break;
    }
  };

  const handleExportStats = () => {
    if (!stats) return;
    
    const exportData = {
      period: `${format(dateRange.from!, 'dd MMM yyyy', { locale: idLocale })} - ${format(dateRange.to!, 'dd MMM yyyy', { locale: idLocale })}`,
      stats,
      exportedAt: new Date().toISOString()
    };
    
    onExport(exportData);
    showNotification('Data statistik berhasil diekspor', 'success');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-white/5 border-[#A56ABD]/20">
            <CardContent className="p-6">
              <div className="h-20 bg-[#A56ABD]/20 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-white/5 backdrop-blur-md border-[#A56ABD]/20">
        <CardHeader>
          <CardTitle className="text-[#F5EBFA] flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analitik Aktivitas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-[#E7D0EF] mb-2">
                Periode
              </label>
              <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                <SelectTrigger className="bg-white/10 border-[#A56ABD]/30 text-[#F5EBFA]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#49225B] border-[#A56ABD]/20">
                  <SelectItem value="7days">7 Hari Terakhir</SelectItem>
                  <SelectItem value="30days">30 Hari Terakhir</SelectItem>
                  <SelectItem value="thisweek">Minggu Ini</SelectItem>
                  <SelectItem value="thismonth">Bulan Ini</SelectItem>
                  <SelectItem value="custom">Kustom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedPeriod === 'custom' && (
              <div className="flex-1 min-w-64">
                <label className="block text-sm font-medium text-[#E7D0EF] mb-2">
                  Rentang Tanggal
                </label>
                <DatePickerWithRange
                  date={dateRange}
                  onDateChange={setDateRange}
                  className="bg-white/10 border-[#A56ABD]/30 text-[#F5EBFA]"
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleExportStats}
                size="sm"
                className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={onShare}
                size="sm"
                variant="outline"
                className="border-[#A56ABD] text-[#A56ABD] hover:bg-[#A56ABD]/20"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Bagikan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm">Total Aktivitas</p>
                  <p className="text-2xl font-bold text-white">{stats.totalActivities}</p>
                </div>
                <ActivityIcon className="w-8 h-8 text-blue-400" />
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
                  <p className="text-green-200 text-sm">Tipe Aktivitas</p>
                  <p className="text-2xl font-bold text-white">{Object.keys(stats.activitiesByType).length}</p>
                </div>
                <Filter className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Pertumbuhan</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.weeklyGrowth > 0 ? '+' : ''}{stats.weeklyGrowth.toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-orange-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-200 text-sm">Rata-rata Harian</p>
                  <p className="text-2xl font-bold text-white">
                    {(stats.totalActivities / Math.max(stats.dailyActivities.length, 1)).toFixed(1)}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Activities */}
      <Card className="bg-white/5 backdrop-blur-md border-[#A56ABD]/20">
        <CardHeader>
          <CardTitle className="text-[#F5EBFA]">Aktivitas Teratas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topActivities.map((activity, index) => (
              <motion.div
                key={activity.type}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-[#A56ABD]/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <Badge className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] text-white">
                    #{index + 1}
                  </Badge>
                  <span className="text-[#F5EBFA] font-medium">{activity.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#E7D0EF]">{activity.count}x</span>
                  <div className="w-20 h-2 bg-[#A56ABD]/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#6E3482] to-[#A56ABD] rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(activity.count / Math.max(...stats.topActivities.map(a => a.count))) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Distribution */}
      <Card className="bg-white/5 backdrop-blur-md border-[#A56ABD]/20">
        <CardHeader>
          <CardTitle className="text-[#F5EBFA]">Distribusi Aktivitas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(stats.activitiesByType).map(([type, count]) => (
              <div key={type} className="text-center p-3 rounded-lg bg-white/5 border border-[#A56ABD]/20">
                <div className="text-2xl font-bold text-[#F5EBFA]">{count}</div>
                <div className="text-sm text-[#A56ABD]">{getActivityLabel(type)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityAnalytics;
