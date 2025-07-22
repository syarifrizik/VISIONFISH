
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid3X3, List, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { fetchUserProfileItems } from '@/services/userProfileItemsService';

interface ModernFilterBarProps {
  activeFilter: string;
  searchQuery: string;
  onFilterChange: (filter: string) => void;
  onSearchChange: (query: string) => void;
}

const ModernFilterBar = ({
  activeFilter,
  searchQuery,
  onFilterChange,
  onSearchChange
}: ModernFilterBarProps) => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState<{[key: string]: number}>({});

  useEffect(() => {
    const loadCategoryCounts = async () => {
      if (user?.id) {
        try {
          const items = await fetchUserProfileItems(user.id);
          console.log('Loaded items for filter counts:', items);
          
          const counts = {
            all: items.length,
            achievement: items.filter(item => item.category === 'achievement').length,
            activity: items.filter(item => item.category === 'activity').length,
            statistic: items.filter(item => item.category === 'statistic').length
          };
          
          console.log('Category counts:', counts);
          setCategoryCounts(counts);
        } catch (error) {
          console.error('Error loading category counts:', error);
        }
      }
    };

    loadCategoryCounts();
  }, [user?.id]);

  const filterCategories = [
    { 
      id: 'all', 
      label: 'Semua', 
      count: categoryCounts.all || 0, 
      color: 'from-[#6E3482] to-[#A56ABD]' 
    },
    { 
      id: 'achievement', 
      label: 'Pencapaian', 
      count: categoryCounts.achievement || 0, 
      color: 'from-yellow-500 to-yellow-600' 
    },
    { 
      id: 'activity', 
      label: 'Aktivitas', 
      count: categoryCounts.activity || 0, 
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      id: 'statistic', 
      label: 'Statistik', 
      count: categoryCounts.statistic || 0, 
      color: 'from-emerald-500 to-green-500' 
    }
  ];

  const advancedFilters = [
    { id: 'recent', label: 'Terbaru', active: false },
    { id: 'popular', label: 'Populer', active: false },
    { id: 'trending', label: 'Trending', active: false },
    { id: 'featured', label: 'Unggulan', active: false }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-16 md:top-20 z-20 space-y-3 md:space-y-4"
    >
      {/* Main Filter Card */}
      <Card className="bg-[#E7D7EF]/95 backdrop-blur-sm border-[#A56ABD]/20 shadow-lg">
        <div className="p-3 md:p-4 space-y-3 md:space-y-4">
          {/* Search and View Controls */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6E3482] w-4 h-4" />
              <Input
                placeholder="Cari aktivitas, pencapaian..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 border-[#A56ABD]/30 focus:border-[#6E3482] bg-white/80 rounded-xl text-[#49225B] placeholder:text-[#A56ABD] text-sm md:text-base"
              />
              {searchQuery && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-[#6E3482] hover:bg-[#A56ABD]/20"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>

            {/* View Mode and Advanced Filters */}
            <div className="flex items-center gap-2">
              <div className="flex bg-white/80 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className={`w-8 h-8 p-0 ${
                    viewMode === 'grid' 
                      ? 'bg-[#6E3482] text-white' 
                      : 'text-[#6E3482] hover:bg-[#A56ABD]/20'
                  }`}
                >
                  <Grid3X3 className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className={`w-8 h-8 p-0 ${
                    viewMode === 'list' 
                      ? 'bg-[#6E3482] text-white' 
                      : 'text-[#6E3482] hover:bg-[#A56ABD]/20'
                  }`}
                >
                  <List className="w-3 h-3" />
                </Button>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="border-[#A56ABD]/30 text-[#6E3482] hover:bg-[#A56ABD]/20 px-3"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Filter</span>
              </Button>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {filterCategories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => onFilterChange(category.id)}
                className={`
                  px-3 md:px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2
                  ${activeFilter === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-white/80 text-[#6E3482] hover:bg-[#A56ABD]/20'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xs md:text-sm font-medium">{category.label}</span>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    activeFilter === category.id
                      ? 'bg-white/20 text-white border-0'
                      : 'bg-[#A56ABD]/20 text-[#6E3482] border-0'
                  }`}
                >
                  {category.count}
                </Badge>
              </motion.button>
            ))}
          </div>
        </div>
      </Card>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border-[#A56ABD]/20 shadow-lg">
              <div className="p-3 md:p-4">
                <h4 className="text-sm font-semibold text-[#49225B] mb-3">Filter Lanjutan</h4>
                <div className="flex flex-wrap gap-2">
                  {advancedFilters.map((filter) => (
                    <Button
                      key={filter.id}
                      size="sm"
                      variant={filter.active ? 'default' : 'outline'}
                      className={`
                        text-xs
                        ${filter.active
                          ? 'bg-[#6E3482] text-white hover:bg-[#49225B]'
                          : 'border-[#A56ABD]/30 text-[#6E3482] hover:bg-[#A56ABD]/20'
                        }
                      `}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Summary */}
      {(searchQuery || activeFilter !== 'all') && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2 px-2"
        >
          <span className="text-xs text-[#E7D7EF]">Filter aktif:</span>
          {searchQuery && (
            <Badge variant="secondary" className="bg-[#A56ABD]/20 text-[#E7D7EF] text-xs">
              Pencarian: "{searchQuery}"
            </Badge>
          )}
          {activeFilter !== 'all' && (
            <Badge variant="secondary" className="bg-[#A56ABD]/20 text-[#E7D7EF] text-xs">
              Kategori: {filterCategories.find(c => c.id === activeFilter)?.label}
            </Badge>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              onFilterChange('all');
              onSearchChange('');
            }}
            className="h-6 px-2 text-xs text-[#E7D7EF] hover:text-white hover:bg-white/10"
          >
            Hapus semua
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ModernFilterBar;
