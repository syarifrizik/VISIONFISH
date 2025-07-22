
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useNotifications } from './useNotifications';
import { enhancedFishCatchesService, FishCatch, CreateFishCatchData } from '@/services/enhancedFishCatchesService';

interface UseFishCatchesManagementProps {
  initialFilters?: {
    searchQuery?: string;
    species?: string;
    location?: string;
    dateFrom?: string;
    dateTo?: string;
    isPrivate?: boolean;
    isRecord?: boolean;
    minWeight?: number;
    maxWeight?: number;
    sortBy?: 'created_at' | 'weight_kg' | 'species_name';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
  };
}

export const useFishCatchesManagement = (props?: UseFishCatchesManagementProps) => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  
  const [catches, setCatches] = useState<FishCatch[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState(props?.initialFilters || {});
  const [selectedCatches, setSelectedCatches] = useState<string[]>([]);

  // Fetch catches
  const fetchCatches = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    const result = await enhancedFishCatchesService.fetchFishCatches(user.id, filters);
    
    if (result.error) {
      setError(result.error);
      showNotification('Gagal memuat data tangkapan', 'error');
    } else {
      setCatches(result.data || []);
    }
    
    setIsLoading(false);
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    if (!user?.id) return;

    const result = await enhancedFishCatchesService.getCatchStatistics(user.id);
    
    if (result.error) {
      console.error('Error fetching statistics:', result.error);
    } else {
      setStatistics(result.data);
    }
  };

  // Create catch
  const createCatch = async (catchData: CreateFishCatchData): Promise<boolean> => {
    if (!user?.id) return false;

    const result = await enhancedFishCatchesService.createFishCatch(user.id, catchData);
    
    if (result.error) {
      showNotification('Gagal menambah tangkapan', 'error');
      return false;
    } else {
      showNotification('Tangkapan berhasil ditambahkan!', 'success');
      await Promise.all([fetchCatches(), fetchStatistics()]);
      return true;
    }
  };

  // Update catch
  const updateCatch = async (catchId: string, catchData: Partial<CreateFishCatchData>): Promise<boolean> => {
    const result = await enhancedFishCatchesService.updateFishCatch(catchId, catchData);
    
    if (result.error) {
      showNotification('Gagal memperbarui tangkapan', 'error');
      return false;
    } else {
      showNotification('Tangkapan berhasil diperbarui!', 'success');
      await Promise.all([fetchCatches(), fetchStatistics()]);
      return true;
    }
  };

  // Delete catch
  const deleteCatch = async (catchId: string): Promise<boolean> => {
    const result = await enhancedFishCatchesService.deleteFishCatch(catchId);
    
    if (result.error) {
      showNotification('Gagal menghapus tangkapan', 'error');
      return false;
    } else {
      showNotification('Tangkapan berhasil dihapus!', 'success');
      await Promise.all([fetchCatches(), fetchStatistics()]);
      return true;
    }
  };

  // Bulk delete
  const bulkDelete = async (catchIds: string[]): Promise<boolean> => {
    const result = await enhancedFishCatchesService.bulkDelete(catchIds);
    
    if (result.error) {
      showNotification('Gagal menghapus tangkapan', 'error');
      return false;
    } else {
      showNotification(`${catchIds.length} tangkapan berhasil dihapus!`, 'success');
      setSelectedCatches([]);
      await Promise.all([fetchCatches(), fetchStatistics()]);
      return true;
    }
  };

  // Bulk update privacy
  const bulkUpdatePrivacy = async (catchIds: string[], isPrivate: boolean): Promise<boolean> => {
    const result = await enhancedFishCatchesService.bulkUpdatePrivacy(catchIds, isPrivate);
    
    if (result.error) {
      showNotification('Gagal mengubah privasi', 'error');
      return false;
    } else {
      const action = isPrivate ? 'pribadi' : 'publik';
      showNotification(`${catchIds.length} tangkapan berhasil diubah ke ${action}!`, 'success');
      setSelectedCatches([]);
      await fetchCatches();
      return true;
    }
  };

  // Update filters
  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({});
  };

  //Selection management
  const toggleCatchSelection = (catchId: string) => {
    setSelectedCatches(prev => 
      prev.includes(catchId) 
        ? prev.filter(id => id !== catchId)
        : [...prev, catchId]
    );
  };

  const selectAllCatches = () => {
    setSelectedCatches(catches.map(catch_ => catch_.id));
  };

  const deselectAllCatches = () => {
    setSelectedCatches([]);
  };

  // Get filtered counts
  const getCounts = () => {
    const total = catches.length;
    const privateCount = catches.filter(catch_ => catch_.is_private).length;
    const publicCount = catches.filter(catch_ => !catch_.is_private).length;
    const records = catches.filter(catch_ => catch_.is_record).length;
    const released = catches.filter(catch_ => catch_.is_released).length;
    
    return { total, private: privateCount, public: publicCount, records, released };
  };

  // Initial fetch
  useEffect(() => {
    if (user?.id) {
      Promise.all([fetchCatches(), fetchStatistics()]);
    }
  }, [user?.id, filters]);

  return {
    // Data
    catches,
    statistics,
    isLoading,
    error,
    filters,
    selectedCatches,
    counts: getCounts(),

    // Actions
    createCatch,
    updateCatch,
    deleteCatch,
    bulkDelete,
    bulkUpdatePrivacy,
    fetchCatches,

    // Filters
    updateFilters,
    clearFilters,

    // Selection
    toggleCatchSelection,
    selectAllCatches,
    deselectAllCatches,
    
    // Utils
    refetch: () => Promise.all([fetchCatches(), fetchStatistics()])
  };
};
