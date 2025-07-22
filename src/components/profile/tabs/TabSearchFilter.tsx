
import { motion } from 'framer-motion';
import { Search, Grid, List, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

interface TabSearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  activeTab: string;
  totalItems: number;
  isLoading?: boolean;
}

const TabSearchFilter = ({ 
  searchQuery, 
  onSearchChange, 
  viewMode, 
  onViewModeChange, 
  activeTab, 
  totalItems,
  isLoading = false
}: TabSearchFilterProps) => {
  const isMobile = useIsMobile();

  const getTabDisplayName = (tabValue: string) => {
    switch (tabValue) {
      case 'my-content': return 'Aktivitas Saya';
      case 'notes': return 'Catatan';
      case 'public-feed': return 'Feed Komunitas';
      case 'activity': return 'Aktivitas';
      case 'users': return 'Pengguna';
      default: return 'Konten';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl ${
        isMobile ? 'rounded-2xl p-3' : 'rounded-3xl p-4'
      } border border-white/20 dark:border-gray-700/20 shadow-xl`}
    >
      <div className={`flex flex-col ${isMobile ? 'gap-3' : 'sm:flex-row gap-4'} items-start ${
        isMobile ? '' : 'sm:items-center'
      } justify-between`}>
        {/* Header with count */}
        <div className={`flex items-center gap-${isMobile ? '2' : '3'}`}>
          <div className={`${isMobile ? 'p-1.5' : 'p-2'} rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg`}>
            <Search className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
          </div>
          <div>
            <h3 className={`font-bold text-gray-900 dark:text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>
              {getTabDisplayName(activeTab)}
            </h3>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`bg-blue-50 dark:bg-blue-900/30 ${isMobile ? 'text-xs px-1.5 py-0.5' : 'text-sm'} ${
                  isLoading ? 'animate-pulse' : ''
                }`}
              >
                <TrendingUp className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} />
                {isLoading ? 'Memuat...' : `${totalItems} item`}
              </Badge>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className={`flex flex-col ${isMobile ? 'w-full gap-2' : 'sm:flex-row gap-3'} items-stretch ${
          isMobile ? '' : 'sm:items-center'
        }`}>
          {/* Search Input */}
          <div className={`relative ${isMobile ? 'w-full' : 'w-80'}`}>
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isMobile ? 'w-4 h-4' : 'w-4 h-4'
            } text-gray-400`} />
            <Input
              placeholder={`Cari ${getTabDisplayName(activeTab).toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`${isMobile ? 'pl-10 h-9 text-sm' : 'pl-10 h-10'} bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30 rounded-xl backdrop-blur-sm focus:bg-white dark:focus:bg-gray-800 transition-all duration-200`}
            />
          </div>

          {/* View Mode Toggle */}
          <div className={`flex items-center ${isMobile ? 'justify-center' : ''} gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg`}>
            <Button
              size={isMobile ? "sm" : "sm"}
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              onClick={() => onViewModeChange('grid')}
              className={`${isMobile ? 'h-7 px-2' : 'h-8 px-3'} transition-all duration-200`}
            >
              <Grid className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
              {!isMobile && <span className="ml-1">Grid</span>}
            </Button>
            <Button
              size={isMobile ? "sm" : "sm"}
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => onViewModeChange('list')}
              className={`${isMobile ? 'h-7 px-2' : 'h-8 px-3'} transition-all duration-200`}
            >
              <List className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
              {!isMobile && <span className="ml-1">List</span>}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TabSearchFilter;
