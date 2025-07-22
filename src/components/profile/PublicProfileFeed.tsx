
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, Eye, Share2, MapPin, Calendar, User, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { fetchPublicProfileItems, UserProfileItem, deleteUserProfileItem } from '@/services/userProfileItemsService';
import { toggleLike, checkIfLiked, recordView } from '@/services/profileItemInteractionsService';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import ProfileItemInteractions from './ProfileItemInteractions';
import ActivityFilterBar from './ActivityFilterBar';
import AddProfileItemDialog from './AddProfileItemDialog';

interface PublicProfileFeedProps {
  maxItems?: number;
  refreshTrigger?: number;
  onEditItem?: (item: UserProfileItem) => void;
}

const PublicProfileFeed = ({ maxItems, refreshTrigger, onEditItem }: PublicProfileFeedProps) => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  
  const [items, setItems] = useState<UserProfileItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<UserProfileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<UserProfileItem | null>(null);

  useEffect(() => {
    loadPublicItems();
  }, [refreshTrigger]);

  useEffect(() => {
    filterAndSortItems();
  }, [items, searchQuery, activeFilter, sortBy]);

  const loadPublicItems = async () => {
    setIsLoading(true);
    try {
      console.log('Loading public profile items...');
      const data = await fetchPublicProfileItems();
      console.log('Public items loaded:', data.length);
      setItems(data);
    } catch (error) {
      console.error('Error loading public profile items:', error);
      showNotification('Gagal memuat feed komunitas', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortItems = () => {
    let filtered = items;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (activeFilter !== 'all') {
      filtered = filtered.filter(item => {
        switch (activeFilter) {
          case 'achievement':
            return item.category === 'achievement';
          case 'activity':
            return item.category === 'activity';
          case 'statistic':
            return item.category === 'statistic';
          case 'fish_catch':
            return item.category === 'activity'; // Assuming fish catch is under activity
          default:
            return true;
        }
      });
    }

    // Sort items
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'popular':
          return (b.stats.likes + b.stats.views) - (a.stats.likes + a.stats.views);
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    // Apply max items limit
    if (maxItems) {
      filtered = filtered.slice(0, maxItems);
    }

    setFilteredItems(filtered);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus konten ini?')) return;
    
    try {
      const result = await deleteUserProfileItem(itemId);
      if (result.success) {
        showNotification('Konten berhasil dihapus', 'success');
        loadPublicItems(); // Refresh the feed
      } else {
        showNotification(result.error || 'Gagal menghapus konten', 'error');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      showNotification('Terjadi kesalahan saat menghapus', 'error');
    }
  };

  const handleEditItem = (item: UserProfileItem) => {
    setEditingItem(item);
    setShowAddDialog(true);
    if (onEditItem) {
      onEditItem(item);
    }
  };

  const handleAddContent = () => {
    setEditingItem(null);
    setShowAddDialog(true);
  };

  const handleItemAdded = () => {
    loadPublicItems();
    setShowAddDialog(false);
    setEditingItem(null);
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-white/5 border-[#A56ABD]/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#A56ABD]/20 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-[#A56ABD]/20 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-[#A56ABD]/20 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-32 bg-[#A56ABD]/20 rounded mb-4"></div>
                <div className="h-4 bg-[#A56ABD]/20 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <ActivityFilterBar
        title="Feed Komunitas"
        totalCount={filteredItems.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterChange={setActiveFilter}
        onSortChange={setSortBy}
        onRefresh={loadPublicItems}
        onAddActivity={handleAddContent}
        activeFilter={activeFilter}
        sortBy={sortBy}
      />

      {/* Feed Content */}
      <AnimatePresence>
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Card className="bg-white/5 border-[#A56ABD]/20 hover:bg-white/10 transition-all duration-300 overflow-hidden">
                <CardContent className="p-6">
                  {/* User Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-12 h-12 border-2 border-[#A56ABD]/30">
                      <AvatarImage src={item.profiles?.avatar_url || ''} />
                      <AvatarFallback className="bg-[#6E3482] text-white">
                        {item.profiles?.display_name?.charAt(0) || item.profiles?.username?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-[#F5EBFA]">
                          {item.profiles?.display_name || item.profiles?.username || 'User'}
                        </h4>
                        <Badge variant="secondary" className="bg-[#A56ABD]/20 text-[#A56ABD] text-xs">
                          <span className="mr-1">{getCategoryIcon(item.category)}</span>
                          {getCategoryLabel(item.category)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#A56ABD]">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(item.created_at), {
                            addSuffix: true,
                            locale: idLocale
                          })}
                        </span>
                        {item.location && (
                          <>
                            <span>•</span>
                            <MapPin className="w-3 h-3" />
                            <span>{item.location}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions Menu - Show only for item owner */}
                    {user?.id === item.user_id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-[#A56ABD] hover:text-[#F5EBFA] hover:bg-white/10"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#49225B] border-[#A56ABD]/20" align="end">
                          <DropdownMenuItem 
                            onClick={() => handleEditItem(item)}
                            className="text-[#F5EBFA] hover:bg-[#6E3482] cursor-pointer"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-400 hover:bg-red-500/20 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#F5EBFA]">{item.title}</h3>
                    
                    {item.description && (
                      <p className="text-[#E7D0EF] leading-relaxed">{item.description}</p>
                    )}

                    {/* Image */}
                    {item.image_url && (
                      <div className="rounded-xl overflow-hidden border border-[#A56ABD]/20">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-auto object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Interactions */}
                  <ProfileItemInteractions
                    itemId={item.id}
                    ownerId={item.user_id}
                    initialStats={item.stats}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredItems.length === 0 && !isLoading && (
        <motion.div 
          className="text-center py-12 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-6xl mb-4">🌊</div>
          <h3 className="text-lg font-semibold text-[#F5EBFA]">
            {searchQuery || activeFilter !== 'all' 
              ? 'Tidak ada postingan yang ditemukan' 
              : 'Belum ada postingan di komunitas'}
          </h3>
          <p className="text-[#A56ABD]">
            {searchQuery || activeFilter !== 'all' 
              ? 'Coba ubah filter atau kata kunci pencarian' 
              : 'Jadilah yang pertama berbagi aktivitas mancing Anda!'}
          </p>
          {(!searchQuery && activeFilter === 'all') && (
            <Button
              onClick={handleAddContent}
              className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white"
            >
              Bagikan Konten Pertama
            </Button>
          )}
        </motion.div>
      )}

      {/* Add/Edit Dialog */}
      <AddProfileItemDialog
        open={showAddDialog}
        onOpenChange={(open) => {
          setShowAddDialog(open);
          if (!open) {
            setEditingItem(null);
          }
        }}
        onItemAdded={handleItemAdded}
        editingItem={editingItem}
        mode="community"
        onPublicPost={() => showNotification('Konten berhasil dibagikan ke komunitas! 🎉', 'success')}
      />
    </div>
  );
};

export default PublicProfileFeed;
