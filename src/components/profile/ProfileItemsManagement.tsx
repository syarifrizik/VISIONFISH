import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, Heart, MessageSquare, Share, Filter, Search, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { fetchUserProfileItems, deleteUserProfileItem, UserProfileItem } from '@/services/userProfileItemsService';
import AddProfileItemDialog from './AddProfileItemDialog';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

const ProfileItemsManagement = () => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  
  const [items, setItems] = useState<UserProfileItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<UserProfileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UserProfileItem | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadItems();
    }
  }, [user?.id]);

  useEffect(() => {
    let filtered = items;
    
    if (activeFilter !== 'all') {
      filtered = items.filter(item => item.category === activeFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredItems(filtered);
  }, [items, activeFilter, searchQuery]);

  const loadItems = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const data = await fetchUserProfileItems(user.id);
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
    setIsAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
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
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6E3482] mx-auto"></div>
          <p className="text-[#6E3482]">Memuat item profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#49225B]">Kelola Item Profil</h2>
          <p className="text-[#6E3482] text-sm">Tambah, edit, dan kelola konten profil Anda</p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white w-full md:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Item Baru
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="sticky top-0 z-10 bg-[#F5EBFA]/95 backdrop-blur-sm p-4 rounded-2xl border border-[#A56ABD]/20 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A56ABD] w-4 h-4" />
            <Input
              placeholder="Cari item profil..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-[#A56ABD]/30 focus:border-[#6E3482] bg-white/80 rounded-xl"
            />
          </div>
          
          <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full md:w-auto">
            <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4 bg-white/80 rounded-xl p-1">
              <TabsTrigger value="all" className="text-xs md:text-sm data-[state=active]:bg-[#6E3482] data-[state=active]:text-white rounded-lg">
                Semua
              </TabsTrigger>
              <TabsTrigger value="achievement" className="text-xs md:text-sm data-[state=active]:bg-[#6E3482] data-[state=active]:text-white rounded-lg">
                Pencapaian
              </TabsTrigger>
              <TabsTrigger value="activity" className="text-xs md:text-sm data-[state=active]:bg-[#6E3482] data-[state=active]:text-white rounded-lg">
                Aktivitas
              </TabsTrigger>
              <TabsTrigger value="statistic" className="text-xs md:text-sm data-[state=active]:bg-[#6E3482] data-[state=active]:text-white rounded-lg">
                Statistik
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Items Grid */}
      <AnimatePresence>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
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
              <Card className="group overflow-hidden border-[#A56ABD]/20 hover:border-[#6E3482] transition-all duration-300 hover:shadow-lg hover:shadow-[#6E3482]/20 bg-white/90 backdrop-blur-sm relative">
                {/* Category Badge */}
                <div className={`h-2 bg-gradient-to-r ${getCategoryColor(item.category)}`}></div>
                
                {/* Action Buttons */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1 z-10">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-blue-100 text-blue-600"
                    onClick={() => handleEditItem(item)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-red-100 text-red-600"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                <CardContent className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(item.category)} text-white text-lg`}>
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs bg-[#F5EBFA] text-[#6E3482] border-[#A56ABD]/30">
                        {getCategoryLabel(item.category)}
                      </Badge>
                      {item.is_private && (
                        <Badge variant="outline" className="text-xs mt-1 border-orange-300 text-orange-600 bg-orange-50">
                          Privat
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-[#49225B] line-clamp-2">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-[#6E3482] line-clamp-3">{item.description}</p>
                    )}
                    
                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-2 text-xs text-[#A56ABD]">
                      {item.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{item.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDistanceToNow(new Date(item.date), { addSuffix: true, locale: idLocale })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between items-center pt-2 border-t border-[#A56ABD]/20">
                    <div className="flex gap-3 text-xs text-[#6E3482]">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{item.stats.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{item.stats.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{item.stats.comments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share className="w-3 h-3" />
                        <span>{item.stats.shares || 0}</span>
                      </div>
                    </div>
                  </div>
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
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-[#6E3482]">
            {searchQuery || activeFilter !== 'all' 
              ? 'Tidak ada item yang ditemukan' 
              : 'Belum ada item profil'}
          </h3>
          <p className="text-[#A56ABD]">
            {searchQuery || activeFilter !== 'all' 
              ? 'Coba ubah filter atau kata kunci pencarian' 
              : 'Mulai tambahkan item profil untuk menunjukkan pencapaian dan aktivitas Anda'}
          </p>
          {(!searchQuery && activeFilter === 'all') && (
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Item Pertama
            </Button>
          )}
        </motion.div>
      )}

      {/* Summary */}
      {items.length > 0 && (
        <div className="bg-gradient-to-r from-[#F5EBFA] to-white p-4 rounded-xl border border-[#A56ABD]/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-[#6E3482]">{items.length}</div>
              <div className="text-sm text-[#A56ABD]">Total Item</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#6E3482]">
                {items.filter(item => item.category === 'achievement').length}
              </div>
              <div className="text-sm text-[#A56ABD]">Pencapaian</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#6E3482]">
                {items.filter(item => item.category === 'activity').length}
              </div>
              <div className="text-sm text-[#A56ABD]">Aktivitas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#6E3482]">
                {items.filter(item => item.category === 'statistic').length}
              </div>
              <div className="text-sm text-[#A56ABD]">Statistik</div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <AddProfileItemDialog
        open={isAddDialogOpen}
        onOpenChange={handleCloseDialog}
        onItemAdded={loadItems}
        editingItem={editingItem}
      />
    </div>
  );
};

export default ProfileItemsManagement;
