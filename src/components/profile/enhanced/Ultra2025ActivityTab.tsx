import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Activity, Fish, MessageSquare, Heart, Calendar, Search, Grid3X3, List, RefreshCw, Flame, Trophy, Users, Share2, Bookmark, Award, Eye, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
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
interface Ultra2025ActivityTabProps {
  profileUserId?: string;
  isOwnProfile: boolean;
  profileOwnerName?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}
const Ultra2025ActivityTab = ({
  profileUserId,
  isOwnProfile,
  profileOwnerName = 'User',
  searchQuery = '',
  onSearchChange = () => {},
  viewMode = 'grid',
  onViewModeChange = () => {}
}: Ultra2025ActivityTabProps) => {
  const {
    user
  } = useAuth();
  const isMobile = useIsMobile();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [filterType, setFilterType] = useState<string>('all');
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
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);
  useEffect(() => {
    loadActivities();
  }, [profileUserId, user]);
  const loadActivities = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const targetUserId = profileUserId || user.id;
      console.log('Loading activities for user:', targetUserId);
      const {
        data: activitiesData,
        error: activitiesError
      } = await supabase.from('user_activities').select('*').eq('user_id', targetUserId).order('created_at', {
        ascending: false
      }).limit(50);
      if (activitiesError) {
        console.error('Error loading activities:', activitiesError);
        throw activitiesError;
      }
      const {
        data: profileData,
        error: profileError
      } = await supabase.from('profiles').select('id, display_name, username, avatar_url').eq('id', targetUserId).single();
      if (profileError) {
        console.warn('Error loading profile:', profileError);
      }
      const transformedActivities: ActivityItem[] = (activitiesData || []).map(activity => ({
        id: activity.id,
        activity_type: activity.activity_type,
        activity_data: activity.metadata || {},
        created_at: activity.created_at,
        user_id: activity.user_id,
        profiles: profileData ? {
          display_name: profileData.display_name,
          username: profileData.username,
          avatar_url: profileData.avatar_url
        } : undefined
      }));
      console.log('Loaded activities:', transformedActivities.length);
      setActivities(transformedActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = localSearchQuery === '' || activity.activity_type.toLowerCase().includes(localSearchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || activity.activity_type === filterType;
    return matchesSearch && matchesFilter;
  });
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'fish_catch':
        return Fish;
      case 'post_created':
        return MessageSquare;
      case 'like_given':
        return Heart;
      case 'achievement_earned':
        return Award;
      case 'community_joined':
        return Users;
      case 'share_content':
        return Share2;
      case 'bookmark_added':
        return Bookmark;
      default:
        return Activity;
    }
  };
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'fish_catch':
        return 'from-blue-500/20 to-cyan-500/10';
      case 'post_created':
        return 'from-green-500/20 to-emerald-500/10';
      case 'like_given':
        return 'from-red-500/20 to-pink-500/10';
      case 'achievement_earned':
        return 'from-yellow-500/20 to-orange-500/10';
      case 'community_joined':
        return 'from-purple-500/20 to-violet-500/10';
      case 'share_content':
        return 'from-cyan-500/20 to-blue-500/10';
      case 'bookmark_added':
        return 'from-orange-500/20 to-red-500/10';
      default:
        return 'from-gray-500/20 to-slate-500/10';
    }
  };
  const handleSearchChange = (query: string) => {
    setLocalSearchQuery(query);
    onSearchChange(query);
  };
  if (loading) {
    return <div className="space-y-6 px-4 py-6">
        {/* Modern Loading Header */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 animate-pulse">
          <div className="h-8 bg-white/10 rounded-lg w-48 mb-4" />
          <div className="h-4 bg-white/10 rounded w-32" />
        </div>

        {/* Modern Loading Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 animate-pulse">
              <div className="h-12 bg-white/10 rounded-lg mb-2" />
              <div className="h-4 bg-white/10 rounded w-16" />
            </div>)}
        </div>

        {/* Modern Loading Activities */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-white/10 rounded w-3/4" />
                  <div className="h-4 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            </div>)}
        </div>
      </div>;
  }
  return <div className="space-y-6 px-4 py-6">
      {/* Modern Header with Glassmorphism */}
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent flex items-center gap-3">
              ⚡ {isOwnProfile ? 'Aktivitas Saya' : `Aktivitas ${profileOwnerName}`}
            </h2>
            <p className="text-white/70 text-sm mt-1">
              {isOwnProfile ? 'Riwayat aktivitas dan interaksi Anda' : `Aktivitas publik dari ${profileOwnerName}`}
            </p>
          </div>
          <Button onClick={loadActivities} variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-xl">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Modern Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <Input placeholder="Cari aktivitas..." value={localSearchQuery} onChange={e => handleSearchChange(e.target.value)} className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white/40 backdrop-blur-xl" />
          </div>
          
          <div className="flex items-center gap-2">
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm backdrop-blur-xl focus:border-white/40">
              <option value="all" className="bg-gray-800 text-white">Semua</option>
              <option value="fish_catch" className="bg-gray-800 text-white">Tangkapan</option>
              <option value="post_created" className="bg-gray-800 text-white">Postingan</option>
              <option value="like_given" className="bg-gray-800 text-white">Like</option>
            </select>
            
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-xl rounded-lg p-1 border border-white/20">
              <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => onViewModeChange('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => onViewModeChange('list')} className={`p-2 ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modern Stats Grid */}
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.1
    }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[{
        icon: Activity,
        label: 'Total',
        value: stats.totalActivities,
        gradient: 'from-blue-500 to-cyan-500'
      }, {
        icon: Calendar,
        label: 'Hari Ini',
        value: stats.activitiesToday,
        gradient: 'from-green-500 to-emerald-500'
      }, {
        icon: Flame,
        label: 'Streak',
        value: stats.currentStreak,
        gradient: 'from-orange-500 to-red-500'
      }, {
        icon: Trophy,
        label: 'Level',
        value: stats.level,
        gradient: 'from-purple-500 to-pink-500'
      }].map((stat, index) => <motion.div key={stat.label} initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        delay: 0.1 + index * 0.05
      }} className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs font-medium">{stat.label}</p>
                <p className="text-xl font-bold text-white group-hover:scale-105 transition-transform duration-200">
                  {stat.value}
                </p>
              </div>
            </div>
          </motion.div>)}
      </motion.div>

      {/* Modern Activities List */}
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.2
    }} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Aktivitas Terbaru
            </h3>
            <Badge className="bg-white/20 text-white border-white/30">
              {filteredActivities.length}
            </Badge>
          </div>
        </div>

        <div className="p-6">
          {filteredActivities.length === 0 ? <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-white/60" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                {localSearchQuery || filterType !== 'all' ? 'Tidak Ada Hasil' : 'Belum Ada Aktivitas'}
              </h3>
              <p className="text-white/60 text-sm">
                {localSearchQuery || filterType !== 'all' ? 'Coba ubah filter atau kata kunci pencarian' : isOwnProfile ? 'Mulai beraktivitas untuk melihat riwayat di sini' : `${profileOwnerName} belum memiliki aktivitas publik`}
              </p>
            </div> : <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}>
              <AnimatePresence>
                {filteredActivities.map((activity, index) => {
              const IconComponent = getActivityIcon(activity.activity_type);
              const gradientColor = getActivityColor(activity.activity_type);
              return <motion.div key={activity.id} initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} exit={{
                opacity: 0,
                y: -20
              }} transition={{
                delay: index * 0.05
              }} className={`bg-gradient-to-br ${gradientColor} backdrop-blur-xl rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer`}>
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-white/20 backdrop-blur-xl border border-white/30 group-hover:scale-105 transition-transform duration-200">
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white text-sm capitalize">
                            {activity.activity_type.replace('_', ' ')}
                          </h4>
                          <p className="text-xs text-white/70 mt-1">
                            {formatDistanceToNow(new Date(activity.created_at), {
                        addSuffix: true,
                        locale: idLocale
                      })}
                          </p>
                          {activity.activity_data && Object.keys(activity.activity_data).length > 0}
                        </div>
                      </div>
                    </motion.div>;
            })}
              </AnimatePresence>
            </div>}
        </div>
      </motion.div>
    </div>;
};
export default Ultra2025ActivityTab;