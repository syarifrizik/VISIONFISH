
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Heart, MessageSquare, Share, MapPin, Clock, Trophy, Target, TrendingUp, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { fetchUserProfileItems, UserProfileItem } from '@/services/userProfileItemsService';
import { useNotifications } from '@/hooks/useNotifications';

interface IntelligentCardGridProps {
  activeFilter: string;
  searchQuery: string;
}

const IntelligentCardGrid = ({ activeFilter, searchQuery }: IntelligentCardGridProps) => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  const [items, setItems] = useState<UserProfileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const loadItems = async () => {
      if (user?.id) {
        try {
          setIsLoading(true);
          console.log('Loading profile items for user:', user.id);
          const data = await fetchUserProfileItems(user.id);
          console.log('Loaded profile items:', data);
          setItems(data);
        } catch (error) {
          console.error('Error loading profile items:', error);
          showNotification('Gagal memuat data profil', 'error');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadItems();
  }, [user?.id, showNotification]);

  // Filter items berdasarkan kategori dan pencarian
  const filteredItems = items.filter(item => {
    const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  // Paginate items
  const paginatedItems = filteredItems.slice(0, currentPage * itemsPerPage);
  const hasMoreItems = filteredItems.length > paginatedItems.length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'achievement': return Trophy;
      case 'activity': return Target;
      case 'statistic': return TrendingUp;
      default: return Target;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'achievement': return 'from-yellow-500 to-yellow-600';
      case 'activity': return 'from-blue-500 to-cyan-500';
      case 'statistic': return 'from-emerald-500 to-green-500';
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Baru saja';
    } else if (diffInHours < 24) {
      return `${diffInHours} jam lalu`;
    } else if (diffInHours < 48) {
      return 'Kemarin';
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} hari lalu`;
    }
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-white/10 rounded animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-48 md:h-64 bg-white/10 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg md:text-xl font-bold text-white">
          Aktivitas & Pencapaian
        </h3>
        <Badge className="bg-white/20 text-white px-3 py-1 text-xs md:text-sm">
          {filteredItems.length} item
        </Badge>
      </div>

      {/* Smart Grid Layout */}
      {filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 md:py-16"
        >
          <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 md:w-12 md:h-12 text-[#E7D7EF]" />
          </div>
          <h4 className="text-lg md:text-xl font-semibold text-white mb-2">
            {searchQuery || activeFilter !== 'all' ? 'Tidak ada hasil' : 'Belum ada aktivitas'}
          </h4>
          <p className="text-[#E7D7EF] mb-6 max-w-md mx-auto">
            {searchQuery || activeFilter !== 'all' 
              ? 'Coba ubah filter atau kata kunci pencarian'
              : 'Mulai tambahkan aktivitas dan pencapaian mancing Anda'
            }
          </p>
          {(!searchQuery && activeFilter === 'all') && (
            <Button 
              className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white"
              onClick={() => showNotification('Fitur tambah item akan segera hadir', 'info')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Item Baru
            </Button>
          )}
        </motion.div>
      ) : (
        <>
          {/* Grid Items */}
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
          >
            <AnimatePresence mode="popLayout">
              {paginatedItems.map((item, index) => {
                const IconComponent = getCategoryIcon(item.category);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ 
                      duration: 0.3,
                      delay: index * 0.05,
                      layout: { duration: 0.3 }
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group cursor-pointer"
                  >
                    <Card className="h-48 md:h-64 overflow-hidden border-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm hover:from-white/20 hover:to-white/10 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-[#49225B]/20">
                      <CardContent className="p-0 h-full flex flex-col">
                        {/* Image/Visual Area */}
                        <div className="h-24 md:h-32 relative overflow-hidden">
                          {item.image_url ? (
                            <img 
                              src={item.image_url} 
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(item.category)} flex items-center justify-center`}>
                              <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white/80" />
                            </div>
                          )}
                          
                          {/* Category Badge */}
                          <div className="absolute top-2 left-2">
                            <Badge className={`bg-gradient-to-r ${getCategoryColor(item.category)} text-white text-xs px-2 py-1`}>
                              {getCategoryLabel(item.category)}
                            </Badge>
                          </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-3 md:p-4 flex flex-col justify-between">
                          <div className="space-y-1 md:space-y-2">
                            <h4 className="font-semibold text-white text-sm md:text-base line-clamp-2 leading-tight">
                              {item.title}
                            </h4>
                            {item.description && (
                              <p className="text-[#E7D7EF] text-xs leading-relaxed line-clamp-2">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {/* Footer Info */}
                          <div className="space-y-2 mt-2">
                            {/* Location & Date */}
                            <div className="flex items-center justify-between text-xs text-[#E7D7EF]">
                              {item.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span className="truncate">{item.location}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatDate(item.created_at)}</span>
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-[#E7D7EF]">
                                  <Eye className="w-3 h-3" />
                                  <span>{item.stats.views}</span>
                                </div>
                                <div className="flex items-center gap-1 text-pink-300">
                                  <Heart className="w-3 h-3" />
                                  <span>{item.stats.likes}</span>
                                </div>
                                <div className="flex items-center gap-1 text-blue-300">
                                  <MessageSquare className="w-3 h-3" />
                                  <span>{item.stats.comments}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Load More Button */}
          {hasMoreItems && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <Button
                onClick={handleLoadMore}
                className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white px-8 py-3"
              >
                Muat Lebih Banyak ({filteredItems.length - paginatedItems.length} tersisa)
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default IntelligentCardGrid;
