
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Fish, FileText, MapPin, Calendar, Eye, Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface SmartGridProps {
  variant?: 'detailed' | 'compact';
  showPublicFeed?: boolean;
  profileUserId?: string;
  filterByUser?: boolean;
  searchQuery?: string;
  viewMode?: 'grid' | 'list';
  onItemCountChange?: (count: number) => void;
}

interface GridItem {
  id: string;
  type: 'fish_catch' | 'note' | 'profile_item';
  title: string;
  description?: string;
  image_url?: string;
  created_at: string;
  location?: string;
  likes_count?: number;
  views_count?: number;
  species_name?: string;
  weight_kg?: number;
  category?: string;
}

const SmartGrid = ({ 
  variant = 'detailed', 
  showPublicFeed = false, 
  profileUserId,
  filterByUser = false,
  searchQuery = '',
  viewMode = 'grid',
  onItemCountChange
}: SmartGridProps) => {
  // Add debug logging and safe auth usage
  const authContext = useAuth();
  const [items, setItems] = useState<GridItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Safe access to user with fallback
  const user = authContext?.user || null;
  const isLoggedIn = authContext?.isLoggedIn || false;

  console.log('SmartGrid - Auth Context:', { 
    hasAuthContext: !!authContext, 
    hasUser: !!user, 
    isLoggedIn,
    profileUserId,
    filterByUser 
  });

  const targetUserId = filterByUser && profileUserId ? profileUserId : user?.id;

  useEffect(() => {
    // Only fetch if we have a target user ID or if it's public feed
    if (targetUserId || showPublicFeed) {
      fetchItems();
    } else {
      console.log('SmartGrid - No target user ID, skipping fetch');
      setIsLoading(false);
      setItems([]);
      if (onItemCountChange) {
        onItemCountChange(0);
      }
    }
  }, [targetUserId, showPublicFeed]);

  const fetchItems = async () => {
    // For public feed without user, we might want to show public content
    if (!targetUserId && !showPublicFeed) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('SmartGrid - Fetching items for user:', targetUserId);

      // Fetch fish catches
      const { data: fishCatches, error: fishError } = await supabase
        .from('fish_catches')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (fishError) {
        console.error('SmartGrid - Fish catches error:', fishError);
        throw fishError;
      }

      // Fetch notes
      const { data: notes, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (notesError) {
        console.error('SmartGrid - Notes error:', notesError);
        throw notesError;
      }

      // Fetch profile items
      const { data: profileItems, error: itemsError } = await supabase
        .from('user_profile_items')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (itemsError) {
        console.error('SmartGrid - Profile items error:', itemsError);
        throw itemsError;
      }

      // Transform and combine all items
      const transformedItems: GridItem[] = [
        ...(fishCatches || []).map(item => ({
          id: item.id,
          type: 'fish_catch' as const,
          title: item.species_name,
          description: item.notes || `Berat: ${item.weight_kg || 'Tidak diketahui'} kg`,
          image_url: item.image_urls?.[0],
          created_at: item.created_at,
          location: item.location,
          species_name: item.species_name,
          weight_kg: item.weight_kg
        })),
        ...(notes || []).map(item => ({
          id: item.id,
          type: 'note' as const,
          title: item.title,
          description: item.content?.substring(0, 100) + (item.content?.length > 100 ? '...' : ''),
          created_at: item.created_at,
          category: item.category
        })),
        ...(profileItems || []).map(item => ({
          id: item.id,
          type: 'profile_item' as const,
          title: item.title,
          description: item.description,
          image_url: item.image_url,
          created_at: item.created_at,
          location: item.location,
          likes_count: item.likes_count,
          views_count: item.views_count,
          category: item.category
        }))
      ];

      // Sort by creation date
      transformedItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      console.log('SmartGrid - Fetched items:', transformedItems.length);
      setItems(transformedItems);
      
      // Call the item count callback if provided
      if (onItemCountChange) {
        onItemCountChange(transformedItems.length);
      }
    } catch (error) {
      console.error('SmartGrid - Error fetching items:', error);
      setError('Gagal memuat konten');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter items based on search query
  const filteredItems = items.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.location?.toLowerCase().includes(query) ||
      item.species_name?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query)
    );
  });

  // Update item count when filtered items change
  useEffect(() => {
    if (onItemCountChange) {
      onItemCountChange(filteredItems.length);
    }
  }, [filteredItems.length, onItemCountChange]);

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'fish_catch': return Fish;
      case 'note': return FileText;
      default: return FileText;
    }
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case 'fish_catch': return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
      case 'note': return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400';
      default: return 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400';
    }
  };

  // Show auth error if needed
  if (!authContext) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">
          Error: Komponen tidak terhubung dengan sistem autentikasi
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-32 w-full rounded mb-3" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          {searchQuery ? 'Tidak ada hasil yang ditemukan' : 'Belum ada konten'}
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
      {filteredItems.map((item, index) => {
        const ItemIcon = getItemIcon(item.type);
        
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              {item.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
              )}
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg ${getItemColor(item.type)}`}>
                    <ItemIcon className="w-4 h-4" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.type === 'fish_catch' ? 'Tangkapan' : item.type === 'note' ? 'Catatan' : 'Item'}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                  {item.title}
                </h3>
                
                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-3">
                    {item.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-20">{item.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {item.views_count !== undefined && (
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{item.views_count}</span>
                      </div>
                    )}
                    {item.likes_count !== undefined && (
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{item.likes_count}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SmartGrid;
