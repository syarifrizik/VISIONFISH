import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Fish, 
  MessageSquare, 
  Heart, 
  Calendar,
  MapPin,
  Filter,
  Search,
  Grid3X3,
  List,
  Download,
  RefreshCw,
  BarChart3,
  Flame,
  Trophy,
  Users,
  Share2,
  Bookmark,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import ImprovedActivityFeed from './ImprovedActivityFeed';

interface ActivityItem {
  id: string;
  activity_type: string;
  activity_data: any;
  created_at: string;
  user_id: string;
  profiles?: {
    display_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

const ModernEnhancedActivityTab = () => {
  const { user } = useAuth();
  const { isPremium, loading: premiumLoading } = usePremiumStatus();
  const isMobile = useIsMobile();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<string>('all');

  // Debug log for premium status
  useEffect(() => {
    console.log('ModernEnhancedActivityTab: isPremium:', isPremium, 'premiumLoading:', premiumLoading);
  }, [isPremium, premiumLoading]);

  // Sample stats for demonstration
  const stats = {
    totalActivities: activities.length,
    activitiesToday: activities.filter(a => {
      const today = new Date().toDateString();
      return new Date(a.created_at).toDateString() === today;
    }).length,
    currentStreak: 7,
    totalPoints: 1250,
    level: 12,
    achievements: 8
  };

  useEffect(() => {
    loadActivities();
  }, [user]);

  const loadActivities = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      console.log('ModernEnhancedActivityTab: Loading activities for user:', user.id);
      
      // First, get activities from user_activities table
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (activitiesError) {
        console.error('ModernEnhancedActivityTab: Error loading activities:', activitiesError);
        throw activitiesError;
      }

      // Then get profile data separately to avoid relation issues
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, display_name, username, avatar_url')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.warn('ModernEnhancedActivityTab: Error loading profile:', profileError);
      }

      // Transform the data to match our interface
      const transformedActivities: ActivityItem[] = (activitiesData || []).map(activity => ({
        id: activity.id,
        activity_type: activity.activity_type,
        activity_data: activity.metadata || {}, // Use metadata as activity_data
        created_at: activity.created_at,
        user_id: activity.user_id,
        profiles: profileData ? {
          display_name: profileData.display_name,
          username: profileData.username,
          avatar_url: profileData.avatar_url
        } : undefined
      }));

      console.log('ModernEnhancedActivityTab: Loaded activities:', transformedActivities.length);
      setActivities(transformedActivities);
    } catch (error) {
      console.error('ModernEnhancedActivityTab: Error loading activities:', error);
      // Set empty array on error to prevent crashes
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter activities based on search and filter type
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = searchQuery === '' || 
      activity.activity_type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || activity.activity_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'fish_catch': return Fish;
      case 'post_created': return MessageSquare;
      case 'like_given': return Heart;
      case 'achievement_earned': return Award;
      case 'community_joined': return Users;
      case 'share_content': return Share2;
      case 'bookmark_added': return Bookmark;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'fish_catch': return 'text-blue-500';
      case 'post_created': return 'text-green-500';
      case 'like_given': return 'text-red-500';
      case 'achievement_earned': return 'text-yellow-500';
      case 'community_joined': return 'text-purple-500';
      case 'share_content': return 'text-cyan-500';
      case 'bookmark_added': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
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

  return (
    <div className="space-y-6">
      {/* Header with Search and Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              ⚡ Aktivitas Saya
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Riwayat aktivitas dan interaksi Anda - Enhanced Version
              {!premiumLoading && (
                <span className="ml-2 text-xs">
                  {isPremium ? '(Premium User)' : '(Free User)'}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadActivities}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari aktivitas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
            >
              <option value="all">Semua Aktivitas</option>
              <option value="fish_catch_added">Tangkapan Ikan</option>
              <option value="message_sent">Pesan</option>
              <option value="post_created">Postingan</option>
              <option value="achievement_unlocked">Pencapaian</option>
            </select>
            
            {/* View Mode Toggle - Updated with Gray Styling */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid' 
                    ? 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600' 
                    : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`p-2 ${
                  viewMode === 'list' 
                    ? 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600' 
                    : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-blue-600 font-medium">Total</p>
                <p className="text-lg font-bold text-blue-700">{stats.totalActivities}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-xs text-green-600 font-medium">Hari Ini</p>
                <p className="text-lg font-bold text-green-700">{stats.activitiesToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-xs text-orange-600 font-medium">Streak</p>
                <p className="text-lg font-bold text-orange-700">{stats.currentStreak}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xs text-purple-600 font-medium">Level</p>
                <p className="text-lg font-bold text-purple-700">{stats.level}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Activity Feed */}
      <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Aktivitas Terbaru - Enhanced
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tampilan yang diperbaiki dengan informasi yang lebih lengkap
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <ImprovedActivityFeed />
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernEnhancedActivityTab;
