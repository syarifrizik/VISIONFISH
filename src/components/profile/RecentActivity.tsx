import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, MessageSquare, Heart, Pin, Eye, Clock, User, RefreshCw, Search, Filter,
  Edit, Trash2, Plus, Image, UserCheck, Settings, FileText, Camera, MapPin, Star,
  Users, NotebookPen, Fish, ExternalLink
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { fetchUserActivities, UserActivity } from '@/services/profileService';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import ActivityDetailModal from './ActivityDetailModal';

interface ExtendedActivity extends UserActivity {
  action_details?: {
    item_type?: string;
    item_title?: string;
    changes?: string[];
    location?: string;
    image_count?: number;
    target_user?: string;
    species?: string;
    weight?: number;
  };
}

const RecentActivity = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ExtendedActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [selectedActivity, setSelectedActivity] = useState<ExtendedActivity | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadActivities();
    }
  }, [user?.id]);

  const loadActivities = async (isRefresh = false) => {
    if (!user?.id) return;
    
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const data = await fetchUserActivities(user.id, 50);
      
      // Transform data dan tambah detail aktivitas
      const extendedData: ExtendedActivity[] = data.map((activity) => {
        const metadata = activity.metadata || {};
        
        return {
          ...activity,
          action_details: {
            item_type: metadata.content_type || metadata.item_type,
            item_title: metadata.title || metadata.species,
            changes: metadata.changes,
            location: metadata.location,
            image_count: metadata.image_count,
            target_user: metadata.target_user,
            species: metadata.species,
            weight: metadata.weight
          }
        };
      });
      
      setActivities(extendedData);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleShowActivityDetail = (activity: ExtendedActivity) => {
    setSelectedActivity(activity);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedActivity(null);
  };

  // Filter and sort activities
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = !searchQuery || 
      getActivityLabel(activity.activity_type).toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.action_details?.item_title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || activity.activity_type === selectedType;
    
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message_sent':
        return <MessageSquare className="w-4 h-4" />;
      case 'message_liked':
        return <Heart className="w-4 h-4" />;
      case 'message_pinned':
        return <Pin className="w-4 h-4" />;
      case 'profile_updated':
        return <Settings className="w-4 h-4" />;
      case 'content_created':
        return <Plus className="w-4 h-4" />;
      case 'note_created':
        return <NotebookPen className="w-4 h-4" />;
      case 'fish_caught':
        return <Fish className="w-4 h-4" />;
      case 'user_followed':
        return <UserCheck className="w-4 h-4" />;
      case 'user_unfollowed':
        return <Users className="w-4 h-4" />;
      case 'community_post_created':
        return <Image className="w-4 h-4" />;
      case 'achievement_earned':
        return <Star className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'message_sent':
        return 'from-blue-500 to-cyan-500';
      case 'message_liked':
        return 'from-pink-500 to-rose-500';
      case 'message_pinned':
        return 'from-yellow-500 to-orange-500';
      case 'profile_updated':
        return 'from-purple-500 to-violet-500';
      case 'content_created':
        return 'from-green-500 to-emerald-500';
      case 'note_created':
        return 'from-indigo-500 to-blue-500';
      case 'fish_caught':
        return 'from-teal-500 to-cyan-500';
      case 'user_followed':
        return 'from-emerald-500 to-green-500';
      case 'user_unfollowed':
        return 'from-red-500 to-rose-500';
      case 'community_post_created':
        return 'from-orange-500 to-amber-500';
      case 'achievement_earned':
        return 'from-yellow-400 to-orange-400';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'message_sent':
        return 'Mengirim Pesan';
      case 'message_liked':
        return 'Menyukai Pesan';
      case 'message_pinned':
        return 'Menyematkan Pesan';
      case 'profile_updated':
        return 'Memperbarui Profil';
      case 'content_created':
        return 'Membuat Konten';
      case 'note_created':
        return 'Membuat Catatan';
      case 'fish_caught':
        return 'Menangkap Ikan';
      case 'user_followed':
        return 'Mengikuti Pengguna';
      case 'user_unfollowed':
        return 'Berhenti Mengikuti';
      case 'community_post_created':
        return 'Posting ke Komunitas';
      case 'achievement_earned':
        return 'Meraih Pencapaian';
      default:
        return 'Aktivitas';
    }
  };

  const getActivityDescription = (activity: ExtendedActivity) => {
    const details = activity.action_details;
    
    switch (activity.activity_type) {
      case 'profile_updated':
        return details?.changes ? 
          `Mengubah ${details.changes.join(', ')}` : 
          'Memperbarui informasi profil';
      case 'content_created':
        return `Membuat konten: ${details?.item_title || 'konten baru'}`;
      case 'note_created':
        return `Membuat catatan: ${details?.item_title || 'catatan baru'}`;
      case 'fish_caught':
        const weight = details?.weight ? ` (${details.weight}kg)` : '';
        return `Menangkap ${details?.species || 'ikan'}${weight}`;
      case 'user_followed':
        return `Mengikuti pengguna baru`;
      case 'user_unfollowed':
        return `Berhenti mengikuti pengguna`;
      case 'community_post_created':
        return `Membuat postingan: ${details?.item_title || 'postingan baru'}`;
      case 'achievement_earned':
        return `Meraih pencapaian: ${details?.item_title || 'pencapaian baru'}`;
      case 'message_sent':
        return 'Mengirim pesan di chat';
      case 'message_liked':
        return 'Menyukai pesan dalam chat';
      case 'message_pinned':
        return 'Menyematkan pesan penting';
      default:
        return 'Melakukan aktivitas';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 mt-8">
        {/* Loading Header */}
        <div className="h-20 bg-white/5 backdrop-blur-md rounded-2xl animate-pulse border border-white/10"></div>
        
        {/* Loading Activities */}
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-white/5 border-[#A56ABD]/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#A56ABD]/20 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#A56ABD]/20 rounded w-3/4"></div>
                    <div className="h-3 bg-[#A56ABD]/20 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-8">
      {/* Header with Search and Controls */}
      <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Title & Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-white" />
                <h3 className="text-xl md:text-2xl font-bold text-white">Aktivitas Terbaru</h3>
              </div>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                {filteredActivities.length} aktivitas
              </Badge>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
                <Input
                  placeholder="Cari aktivitas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-48 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                />
              </div>

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#49225B] border-[#A56ABD]/20">
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="message_sent">Chat</SelectItem>
                  <SelectItem value="profile_updated">Profil</SelectItem>
                  <SelectItem value="content_created">Konten</SelectItem>
                  <SelectItem value="note_created">Catatan</SelectItem>
                  <SelectItem value="fish_caught">Tangkapan</SelectItem>
                  <SelectItem value="user_followed">Follow</SelectItem>
                  <SelectItem value="community_post_created">Komunitas</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#49225B] border-[#A56ABD]/20">
                  <SelectItem value="newest">Terbaru</SelectItem>
                  <SelectItem value="oldest">Terlama</SelectItem>
                </SelectContent>
              </Select>

              {/* Refresh Button */}
              <Button
                onClick={() => loadActivities(true)}
                disabled={isRefreshing}
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities List with ScrollArea */}
      {filteredActivities.length === 0 ? (
        <Card className="bg-white/5 border-[#A56ABD]/20">
          <CardContent className="p-8 text-center">
            <Activity className="w-12 h-12 text-[#A56ABD] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#F5EBFA] mb-2">
              {searchQuery || selectedType !== 'all' ? 'Tidak Ada Aktivitas Ditemukan' : 'Belum Ada Aktivitas'}
            </h3>
            <p className="text-[#A56ABD]">
              {searchQuery || selectedType !== 'all' 
                ? 'Coba ubah kata kunci pencarian atau filter tipe'
                : 'Mulai berinteraksi untuk melihat aktivitas di sini'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/5 border-[#A56ABD]/20 overflow-hidden">
          <ScrollArea className="h-[600px] w-full">
            <div className="p-4 space-y-3">
              <AnimatePresence>
                {filteredActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.03, duration: 0.3 }}
                  >
                    <Card className="bg-white/10 border-[#A56ABD]/30 hover:bg-white/15 transition-all duration-300 hover:border-[#A56ABD]/50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          {/* Activity Icon */}
                          <div className={`
                            p-2.5 rounded-xl bg-gradient-to-r ${getActivityColor(activity.activity_type)} 
                            text-white flex-shrink-0 shadow-lg
                          `}>
                            {getActivityIcon(activity.activity_type)}
                          </div>

                          {/* Activity Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-[#F5EBFA] text-sm">
                                {getActivityLabel(activity.activity_type)}
                              </h4>
                              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                <Badge 
                                  variant="secondary" 
                                  className="bg-[#A56ABD]/20 text-[#E7D0EF] text-xs border-[#A56ABD]/30"
                                >
                                  {activity.action_details?.item_type || 'aktivitas'}
                                </Badge>
                              </div>
                            </div>

                            {/* Activity Description */}
                            <p className="text-[#E7D0EF] text-sm mb-3 line-clamp-2">
                              {getActivityDescription(activity)}
                            </p>

                            {/* Additional Info */}
                            {activity.action_details?.location && (
                              <div className="flex items-center gap-1 text-xs text-[#A56ABD] mb-2">
                                <MapPin className="w-3 h-3" />
                                <span>{activity.action_details.location}</span>
                              </div>
                            )}

                            {/* Time and Metadata */}
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-4 text-[#A56ABD]">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    {formatDistanceToNow(new Date(activity.created_at), {
                                      addSuffix: true,
                                      locale: idLocale
                                    })}
                                  </span>
                                </div>
                                
                                {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0 h-auto text-xs text-[#A56ABD] hover:text-[#F5EBFA] hover:bg-transparent"
                                    onClick={() => handleShowActivityDetail(activity)}
                                  >
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    <span className="underline">Detail tersedia</span>
                                  </Button>
                                )}
                              </div>

                              <span className="text-[#A56ABD] text-xs">
                                {new Date(activity.created_at).toLocaleTimeString('id-ID', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </Card>
      )}

      {/* Activity Summary */}
      {filteredActivities.length > 0 && (
        <Card className="bg-gradient-to-r from-white/5 to-white/10 border-[#A56ABD]/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
              <div>
                <div className="text-xl font-bold text-[#F5EBFA]">
                  {filteredActivities.filter(a => a.activity_type.includes('message')).length}
                </div>
                <div className="text-[#A56ABD]">Chat</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#F5EBFA]">
                  {filteredActivities.filter(a => ['content_created', 'note_created', 'community_post_created'].includes(a.activity_type)).length}
                </div>
                <div className="text-[#A56ABD]">Konten</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#F5EBFA]">
                  {filteredActivities.filter(a => a.activity_type === 'fish_caught').length}
                </div>
                <div className="text-[#A56ABD]">Tangkapan</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#F5EBFA]">
                  {filteredActivities.filter(a => ['user_followed', 'user_unfollowed'].includes(a.activity_type)).length}
                </div>
                <div className="text-[#A56ABD]">Follow</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Detail Modal */}
      <ActivityDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        activity={selectedActivity}
      />
    </div>
  );
};

export default RecentActivity;
