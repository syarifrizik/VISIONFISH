
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Calendar,
  Plus,
  ArrowRight,
  Trophy,
  MessageSquare,
  Fish,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface OverviewStats {
  totalActivities: number;
  todayActivities: number;
  weeklyGrowth: number;
  currentStreak: number;
  topActivity: string;
  recentMilestone?: {
    title: string;
    description: string;
    achievedAt: string;
  };
}

interface QuickInsight {
  id: string;
  type: 'achievement' | 'trend' | 'recommendation' | 'milestone';
  title: string;
  description: string;
  icon: string;
  color: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  icon: any;
  color: string;
}

const ModernOverviewTab = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<OverviewStats>({
    totalActivities: 0,
    todayActivities: 0,
    weeklyGrowth: 0,
    currentStreak: 0,
    topActivity: 'fishing'
  });
  const [insights, setInsights] = useState<QuickInsight[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadOverviewData();
    }
  }, [user?.id]);

  const loadOverviewData = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      // Load user activities
      const { data: activities, error: activitiesError } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (activitiesError) throw activitiesError;

      // Load fish catches
      const { data: fishCatches, error: fishError } = await supabase
        .from('fish_catches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (fishError) throw fishError;

      // Load user notes
      const { data: notes, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (notesError) throw notesError;

      // Calculate stats
      const today = new Date().toDateString();
      const todayActivities = activities?.filter(a => 
        new Date(a.created_at).toDateString() === today
      ).length || 0;

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const thisWeekActivities = activities?.filter(a => 
        new Date(a.created_at) >= weekAgo
      ).length || 0;
      
      const lastWeekActivities = activities?.filter(a => {
        const activityDate = new Date(a.created_at);
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        return activityDate >= twoWeeksAgo && activityDate < weekAgo;
      }).length || 0;

      const weeklyGrowth = lastWeekActivities > 0 
        ? Math.round(((thisWeekActivities - lastWeekActivities) / lastWeekActivities) * 100)
        : 0;

      setStats({
        totalActivities: activities?.length || 0,
        todayActivities,
        weeklyGrowth,
        currentStreak: calculateStreak(activities || []),
        topActivity: getTopActivityType(activities || [])
      });

      // Generate insights
      setInsights(generateInsights(activities || [], fishCatches || [], notes || []));

      // Format recent activities
      setRecentActivities(formatRecentActivities(activities || [], fishCatches || [], notes || []));

    } catch (error) {
      console.error('Error loading overview data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStreak = (activities: any[]): number => {
    if (!activities.length) return 0;
    
    let streak = 0;
    const today = new Date();
    let currentDate = new Date(today);
    
    for (let i = 0; i < 30; i++) {
      const dateStr = currentDate.toDateString();
      const hasActivity = activities.some(a => 
        new Date(a.created_at).toDateString() === dateStr
      );
      
      if (hasActivity) {
        streak++;
      } else if (streak > 0) {
        break;
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  };

  const getTopActivityType = (activities: any[]): string => {
    const typeCounts: Record<string, number> = {};
    activities.forEach(a => {
      typeCounts[a.activity_type] = (typeCounts[a.activity_type] || 0) + 1;
    });
    
    return Object.keys(typeCounts).reduce((a, b) => 
      typeCounts[a] > typeCounts[b] ? a : b
    ) || 'general';
  };

  const generateInsights = (activities: any[], fishCatches: any[], notes: any[]): QuickInsight[] => {
    const insights: QuickInsight[] = [];

    // Achievement insight
    if (fishCatches.length >= 10) {
      insights.push({
        id: 'achievement-angler',
        type: 'achievement',
        title: '🏆 Master Angler',
        description: `Kamu sudah menangkap ${fishCatches.length} ikan! Luar biasa!`,
        icon: '🎣',
        color: 'from-yellow-400 to-orange-500'
      });
    }

    // Trend insight
    if (stats.weeklyGrowth > 0) {
      insights.push({
        id: 'trend-growth',
        type: 'trend',
        title: '📈 Tren Positif',
        description: `Aktivitas meningkat ${stats.weeklyGrowth}% minggu ini`,
        icon: '📊',
        color: 'from-green-400 to-emerald-500'
      });
    }

    // Recommendation
    if (notes.length < 5) {
      insights.push({
        id: 'rec-notes',
        type: 'recommendation',
        title: '📝 Catat Pengalaman',
        description: 'Buat catatan untuk mengingat momen berharga',
        icon: '✍️',
        color: 'from-blue-400 to-cyan-500',
        action: {
          label: 'Buat Catatan',
          onClick: () => {
            // Navigate to notes creation
            window.location.href = '/notes';
          }
        }
      });
    }

    return insights;
  };

  const formatRecentActivities = (activities: any[], fishCatches: any[], notes: any[]): RecentActivity[] => {
    const combined = [];

    // Add recent fish catches
    fishCatches.slice(0, 3).forEach(fish => {
      combined.push({
        id: fish.id,
        type: 'catch',
        title: `Tangkapan ${fish.species_name}`,
        description: `${fish.weight_kg || 'Unknown'}kg di ${fish.location || 'lokasi rahasia'}`,
        timestamp: fish.created_at,
        icon: Fish,
        color: 'from-blue-400 to-cyan-500'
      });
    });

    // Add recent notes
    notes.slice(0, 2).forEach(note => {
      combined.push({
        id: note.id,
        type: 'note',
        title: 'Catatan Baru',
        description: note.title,
        timestamp: note.created_at,
        icon: MessageSquare,
        color: 'from-purple-400 to-pink-500'
      });
    });

    // Sort by timestamp and return top 5
    return combined
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Baru saja';
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString('id-ID');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="h-20 bg-white/10 rounded-2xl"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Insights */}
      {insights.length > 0 && (
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Quick Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-2xl bg-gradient-to-r ${insight.color}/20 border border-white/10`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{insight.icon}</span>
                    <div>
                      <h4 className="font-semibold text-white">{insight.title}</h4>
                      <p className="text-white/70 text-sm">{insight.description}</p>
                    </div>
                  </div>
                  {insight.action && (
                    <Button
                      onClick={insight.action.onClick}
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-0"
                    >
                      {insight.action.label}
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Goal Progress */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            Progress Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/80">Daily Activity Goal</span>
              <span className="text-white font-semibold">{stats.todayActivities}/5</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((stats.todayActivities / 5) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/80">Weekly Streak</span>
              <span className="text-white font-semibold">{stats.currentStreak} days</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((stats.currentStreak / 7) * 100, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Activities
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Belum Ada Aktivitas</h3>
              <p className="text-white/60 mb-4">
                Mulai beraktivitas untuk melihat riwayat di sini
              </p>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Aktivitas
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${activity.color}`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">{activity.title}</h4>
                      <p className="text-white/60 text-sm truncate">{activity.description}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-white/50">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(activity.timestamp)}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button
              className="h-16 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl"
              onClick={() => window.location.href = '/notes'}
            >
              <div className="flex flex-col items-center gap-1">
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm">New Note</span>
              </div>
            </Button>
            <Button
              className="h-16 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl"
              onClick={() => {
                // Add fish catch
                console.log('Add fish catch');
              }}
            >
              <div className="flex flex-col items-center gap-1">
                <Fish className="w-5 h-5" />
                <span className="text-sm">Log Catch</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernOverviewTab;
