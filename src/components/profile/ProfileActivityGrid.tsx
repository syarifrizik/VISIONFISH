
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, Pin, Calendar, User, List, Grid3X3, Plus, Eye, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { fetchUserActivities, fetchUserStats, UserActivity, UserStats } from '@/services/profileService';
import { fetchUserProfileItems, UserProfileItem } from '@/services/userProfileItemsService';
import AddProfileItemDialog from './AddProfileItemDialog';

interface ProfileActivityGridProps {
  viewMode?: 'grid' | 'list';
  searchQuery?: string;
}

const ProfileActivityGrid = ({ viewMode = 'grid', searchQuery = '' }: ProfileActivityGridProps) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [profileItems, setProfileItems] = useState<UserProfileItem[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [localViewMode, setLocalViewMode] = useState<'grid' | 'list'>(viewMode);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    setLocalViewMode(viewMode);
  }, [viewMode]);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const [activitiesData, profileItemsData, statsData] = await Promise.all([
        fetchUserActivities(user.id, 20),
        fetchUserProfileItems(user.id),
        fetchUserStats(user.id)
      ]);
      
      setActivities(activitiesData);
      setProfileItems(profileItemsData);
      setStats(statsData);
      console.log('Loaded profile items:', profileItemsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message_sent':
        return <MessageSquare className="w-4 h-4" />;
      case 'message_liked':
        return <Heart className="w-4 h-4" />;
      case 'message_pinned':
        return <Pin className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'achievement':
        return '🏆';
      case 'activity':
        return '🎣';
      case 'statistic':
        return '📊';
      default:
        return '📝';
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
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'message_sent':
        return 'Pesan Terkirim';
      case 'message_liked':
        return 'Pesan Disukai';
      case 'message_pinned':
        return 'Pesan Terpin';
      default:
        return 'Aktivitas';
    }
  };

  // Combine activities and profile items
  const combinedItems = [
    ...profileItems.map(item => ({
      ...item,
      type: 'profile_item' as const,
      created_at: item.created_at
    })),
    ...activities.map(activity => ({
      ...activity,
      type: 'activity' as const
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const filteredItems = combinedItems.filter(item => {
    if (searchQuery === '') return true;
    
    if (item.type === 'profile_item') {
      return (
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    } else {
      return (
        getActivityLabel(item.activity_type).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.chat_message?.content || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  });

  const toggleViewMode = () => {
    setLocalViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };

  if (isLoading) {
    return (
      <div className={`grid ${localViewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-gradient-to-br from-[#F5EBFA] to-white">
            <CardContent className="p-4">
              <div className="h-20 bg-[#A56ABD]/20 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Summary Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6" />
                  <div>
                    <p className="text-2xl font-bold">{stats.total_messages}</p>
                    <p className="text-sm opacity-90">Total Pesan</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-pink-500 to-rose-500 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6" />
                  <div>
                    <p className="text-2xl font-bold">{stats.total_likes_received}</p>
                    <p className="text-sm opacity-90">Like Diterima</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6" />
                  <div>
                    <p className="text-2xl font-bold">{stats.total_likes_given}</p>
                    <p className="text-sm opacity-90">Like Diberikan</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-purple-500 to-violet-500 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Pin className="w-6 h-6" />
                  <div>
                    <p className="text-2xl font-bold">{profileItems.length}</p>
                    <p className="text-sm opacity-90">Total Postingan</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Header with Add Button */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#49225B]">Aktivitas & Postingan</h3>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowAddDialog(true)}
              size="sm"
              className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Buat Postingan
            </Button>
            <Badge variant="outline" className="border-[#A56ABD]/30 text-[#6E3482]">
              {filteredItems.length} item
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleViewMode}
              className="border-[#A56ABD]/30 text-[#6E3482] hover:bg-[#F5EBFA]/50"
            >
              {localViewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Items Grid/List */}
        {filteredItems.length === 0 ? (
          <Card className="border-[#A56ABD]/20 bg-white/90">
            <CardContent className="p-8 text-center">
              <User className="w-12 h-12 text-[#A56ABD] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#49225B] mb-2">Belum Ada Aktivitas</h3>
              <p className="text-[#6E3482] mb-4">
                {searchQuery ? 'Tidak ada aktivitas yang sesuai dengan pencarian.' : 'Mulai berinteraksi dan buat postingan untuk melihat aktivitas di sini.'}
              </p>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Buat Postingan Pertama
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={`
            ${localViewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
              : 'space-y-3'
            }
          `}>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Card className={`
                  border-[#A56ABD]/20 bg-white/90 hover:shadow-lg transition-all duration-300
                  ${localViewMode === 'list' ? 'hover:shadow-md' : 'hover:scale-105'}
                `}>
                  <CardContent className={`${localViewMode === 'list' ? 'p-4' : 'p-6'}`}>
                    {item.type === 'profile_item' ? (
                      // Profile Item Card
                      <div className={`${localViewMode === 'list' ? 'flex gap-4' : 'space-y-3'}`}>
                        <div className={`${localViewMode === 'list' ? 'flex-shrink-0' : ''}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{getCategoryIcon(item.category)}</span>
                            <Badge variant="secondary" className="bg-[#F5EBFA] text-[#6E3482] text-xs">
                              {item.category === 'activity' ? 'Aktivitas' : 
                               item.category === 'achievement' ? 'Pencapaian' : 'Statistik'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-[#49225B] mb-2 line-clamp-2">
                            {item.title}
                          </h4>
                          
                          {item.description && (
                            <p className={`text-[#6E3482] text-sm mb-3 ${
                              localViewMode === 'list' ? 'line-clamp-2' : 'line-clamp-3'
                            }`}>
                              {item.description}
                            </p>
                          )}
                          
                          {item.location && (
                            <div className="flex items-center gap-1 text-xs text-[#A56ABD] mb-2">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{item.location}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-[#A56ABD]">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>{item.stats.views}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                <span>{item.stats.likes}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Activity Card
                      <div className={`flex items-start gap-3 ${localViewMode === 'list' ? '' : 'mb-3'}`}>
                        <div className={`
                          p-2 rounded-lg bg-gradient-to-r ${getActivityColor(item.activity_type)} text-white
                          ${localViewMode === 'list' ? 'flex-shrink-0' : ''}
                        `}>
                          {getActivityIcon(item.activity_type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-[#49225B] truncate">
                              {getActivityLabel(item.activity_type)}
                            </h4>
                            <Badge variant="secondary" className="bg-[#F5EBFA] text-[#6E3482] text-xs flex-shrink-0 ml-2">
                              {new Date(item.created_at).toLocaleDateString('id-ID')}
                            </Badge>
                          </div>
                          
                          {item.chat_message && (
                            <p className={`
                              text-[#6E3482] text-sm
                              ${localViewMode === 'list' ? 'line-clamp-1' : 'line-clamp-2'}
                            `}>
                              {item.chat_message.content}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-[#A56ABD]">
                              {new Date(item.created_at).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            
                            {item.chat_message?.message_type && (
                              <Badge variant="outline" className="text-xs border-[#A56ABD]/30 text-[#6E3482]">
                                {item.chat_message.message_type}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Profile Item Dialog */}
      <AddProfileItemDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onItemAdded={loadData}
      />
    </div>
  );
};

export default ProfileActivityGrid;
