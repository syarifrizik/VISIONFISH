
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Heart, MessageSquare, Share, Edit, Trash2, Plus, MapPin, Calendar, Users, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { useActivityTracking } from '@/hooks/useActivityTracking';
import { fetchUserProfileItems, deleteUserProfileItem, UserProfileItem } from '@/services/userProfileItemsService';
import AddProfileItemDialog from './AddProfileItemDialog';
import PublicProfileFeed from './PublicProfileFeed';
import InteractiveProfileCard from './InteractiveProfileCard';
import ProfileItemDetailModal from './ProfileItemDetailModal';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedProfileGridProps {
  showAddButton?: boolean;
  variant?: 'compact' | 'detailed';
  maxItems?: number;
  defaultTab?: 'my-profile' | 'public-feed';
}

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
}

const EnhancedProfileGrid = ({ 
  showAddButton = true, 
  variant = 'detailed',
  maxItems,
  defaultTab = 'my-profile' 
}: EnhancedProfileGridProps) => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  const { trackContentCreationActivity, trackCommunityPostActivity } = useActivityTracking();
  
  const [activeTab, setActiveTab] = useState<'my-profile' | 'public-feed'>(defaultTab);
  const [items, setItems] = useState<UserProfileItem[]>([]);
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UserProfileItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [dialogMode, setDialogMode] = useState<'profile' | 'community'>('profile');

  // Setup real-time subscription untuk public feed
  useEffect(() => {
    if (activeTab === 'public-feed') {
      const channel = supabase
        .channel('public-profile-items')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_profile_items',
            filter: 'is_private=eq.false'
          },
          (payload) => {
            console.log('Real-time update received:', payload);
            // Trigger refresh of public feed
            setRefreshTrigger(prev => prev + 1);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeTab]);

  useEffect(() => {
    if (user?.id && activeTab === 'my-profile') {
      loadItems();
    }
  }, [user?.id, activeTab]);

  const loadItems = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      console.log('Loading items for user:', user.id);
      const data = await fetchUserProfileItems(user.id);
      console.log('Items loaded:', data.length);
      setItems(data);
    } catch (error) {
      console.error('Error loading profile items:', error);
      showNotification('Gagal memuat item profil', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) return;
    
    try {
      const result = await deleteUserProfileItem(itemId);
      if (result.success) {
        showNotification('Item berhasil dihapus', 'success');
        loadItems();
        // Also trigger public feed refresh if needed
        setRefreshTrigger(prev => prev + 1);
      } else {
        showNotification(result.error || 'Gagal menghapus item', 'error');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      showNotification('Terjadi kesalahan saat menghapus', 'error');
    }
  };

  const handleEditItem = (item: UserProfileItem) => {
    setEditingItem(item);
    setDialogMode('profile');
    setIsAddDialogOpen(true);
  };

  const handleAddContent = (mode: 'profile' | 'community' = 'profile') => {
    setEditingItem(null);
    setDialogMode(mode);
    setIsAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingItem(null);
    setDialogMode('profile');
  };

  const handleViewItem = (item: UserProfileItem) => {
    setSelectedItem({
      id: item.id,
      title: item.title,
      description: item.description || '',
      imageUrl: item.image_url,
      category: item.category,
      date: item.date,
      location: item.location,
      stats: {
        ...item.stats,
        shares: item.stats.shares || 0 // Ensure shares is included
      },
      ownerId: item.user_id,
      ownerName: user?.user_metadata?.display_name || user?.email || 'Anda',
      ownerAvatar: user?.user_metadata?.avatar_url,
      isPrivate: item.is_private
    });
  };

  // Handler untuk auto-switch ke public feed setelah posting publik
  const handlePublicPost = () => {
    setActiveTab('public-feed');
    showNotification('Postingan Anda sekarang terlihat di Feed Publik! 🎉', 'success');
    // Trigger refresh
    setRefreshTrigger(prev => prev + 1);
  };

  // Fixed function signature to match the expected type
  const handleItemAdded = async () => {
    loadItems();
    
    // Trigger refresh public feed juga
    setRefreshTrigger(prev => prev + 1);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'achievement': return '🏆';
      case 'activity': return '🎣';
      case 'statistic': return '📊';
      default: return '📝';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'achievement': return 'from-yellow-500 to-orange-500';
      case 'activity': return 'from-blue-500 to-purple-500';
      case 'statistic': return 'from-green-500 to-teal-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'achievement': return 'Pencapaian';
      case 'activity': return 'Aktivitas';
      case 'statistic': return 'Statistik';
      default: return 'Lainnya';
    }
  };

  const displayedItems = maxItems ? items.slice(0, maxItems) : items;

  if (isLoading && activeTab === 'my-profile') {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Card className="animate-pulse bg-gradient-to-br from-[#F5EBFA] to-white border-[#A56ABD]/20">
                <CardContent className="p-2">
                  <div className="h-10 md:h-12 bg-[#A56ABD]/20 rounded"></div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const handleTabChange = (value: string) => {
    const newTab = value as 'my-profile' | 'public-feed';
    setActiveTab(newTab);
  };

  return (
    <div className="space-y-3">
      {/* Tab Navigation - Enhanced with hover effects */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="flex items-center justify-between mb-3">
          <TabsList className="bg-white/10 backdrop-blur-sm border border-[#A56ABD]/30 h-7 md:h-8">
            <TabsTrigger 
              value="my-profile" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6E3482] data-[state=active]:to-[#A56ABD] data-[state=active]:text-white text-[#E7D7EF] text-xs px-2 py-1 transition-all duration-300 hover:bg-white/10"
            >
              <User className="w-2.5 h-2.5 mr-1" />
              <span className="hidden sm:inline">Profil Saya</span>
              <span className="sm:hidden">Profil</span>
            </TabsTrigger>
            <TabsTrigger 
              value="public-feed" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6E3482] data-[state=active]:to-[#A56ABD] data-[state=active]:text-white text-[#E7D7EF] text-xs px-2 py-1 transition-all duration-300 hover:bg-white/10"
            >
              <Users className="w-2.5 h-2.5 mr-1" />
              <span className="hidden sm:inline">Feed Publik</span>
              <span className="sm:hidden">Feed</span>
            </TabsTrigger>
          </TabsList>

          {/* Enhanced Add Button with micro-interactions */}
          {showAddButton && (
            <div className="flex gap-1">
              {activeTab === 'my-profile' ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => handleAddContent('profile')}
                    size="sm"
                    className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white shadow-lg text-xs px-2 py-1 h-7 transition-all duration-300 hover:shadow-xl"
                  >
                    <Plus className="w-2.5 h-2.5 mr-1" />
                    <span className="hidden md:inline">Tambah</span>
                    <span className="md:hidden">+</span>
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => handleAddContent('community')}
                    size="sm"
                    className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white shadow-lg text-xs px-2 py-1 h-7 transition-all duration-300 hover:shadow-xl"
                  >
                    <Plus className="w-2.5 h-2.5 mr-1" />
                    <span className="hidden md:inline">Bagikan</span>
                    <span className="md:hidden">+</span>
                  </Button>
                </motion.div>
              )}
            </div>
          )}
        </div>

        <TabsContent value="my-profile" className="space-y-3">
          {/* My Profile Content - Enhanced with staggered animations */}
          <AnimatePresence mode="wait">
            <motion.div 
              key="profile-grid"
              className={`grid gap-1.5 ${
                variant === 'compact' 
                  ? 'grid-cols-2 md:grid-cols-3' 
                  : 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {displayedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  transition={{ 
                    delay: index * 0.05, 
                    duration: 0.3,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                >
                  <InteractiveProfileCard
                    id={item.id}
                    title={item.title}
                    description={item.description || ''}
                    imageUrl={item.image_url}
                    category={item.category}
                    date={item.date}
                    location={item.location}
                    stats={item.stats}
                    isPrivate={item.is_private}
                    ownerId={item.user_id}
                    onEdit={() => handleEditItem(item)}
                    onDelete={() => handleDeleteItem(item.id)}
                    onShare={() => showNotification('Link berhasil disalin!', 'success')}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Enhanced Empty State */}
          {items.length === 0 && !isLoading && (
            <motion.div 
              className="text-center py-4 space-y-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="text-xl md:text-2xl mb-1"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                📝
              </motion.div>
              <h4 className="font-medium text-white text-sm">Belum ada konten</h4>
              <p className="text-xs text-[#E7D7EF] mb-3">
                Mulai bagikan aktivitas mancing Anda
              </p>
              {showAddButton && (
                <div className="flex flex-col sm:flex-row gap-1.5 justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => handleAddContent('profile')}
                      size="sm"
                      variant="outline"
                      className="border-[#A56ABD] text-[#A56ABD] hover:bg-[#A56ABD]/20 text-xs px-2 py-1 h-7 transition-all duration-300"
                    >
                      <Plus className="w-2.5 h-2.5 mr-1" />
                      Konten Pribadi
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => handleAddContent('community')}
                      size="sm"
                      className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white text-xs px-2 py-1 h-7 transition-all duration-300"
                    >
                      <Plus className="w-2.5 h-2.5 mr-1" />
                      Bagikan
                    </Button>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}

          {/* Enhanced Show More Button */}
          {maxItems && items.length > maxItems && (
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#A56ABD] text-white hover:bg-[#A56ABD]/20 hover:border-white text-xs px-2 py-1 h-7 transition-all duration-300"
                >
                  Lihat Semua ({items.length - maxItems} lainnya)
                </Button>
              </motion.div>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="public-feed">
          {/* Public Feed Content */}
          <PublicProfileFeed 
            maxItems={maxItems} 
            refreshTrigger={refreshTrigger}
            onEditItem={handleEditItem}
          />
        </TabsContent>
      </Tabs>

      {/* Enhanced Floating Add Button */}
      {showAddButton && items.length > 0 && activeTab === 'my-profile' && (
        <motion.div
          className="fixed bottom-16 right-3 md:hidden z-50"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          transition={{ 
            delay: 1,
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          <Button
            onClick={() => handleAddContent('profile')}
            size="sm"
            className="w-7 h-7 rounded-full bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-2.5 h-2.5" />
          </Button>
        </motion.div>
      )}

      {/* Add/Edit Dialog */}
      <AddProfileItemDialog
        open={isAddDialogOpen}
        onOpenChange={handleCloseDialog}
        onItemAdded={handleItemAdded}
        editingItem={editingItem}
        onPublicPost={handlePublicPost}
        mode={dialogMode}
      />

      {/* Item Detail Modal */}
      <ProfileItemDetailModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem || {}}
      />
    </div>
  );
};

export default EnhancedProfileGrid;
