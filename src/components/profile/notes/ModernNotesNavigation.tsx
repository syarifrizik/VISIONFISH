
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Plus,
  LayoutGrid,
  List,
  Archive,
  Star,
  BookOpen,
  Sparkles,
  Zap,
  Calendar,
  Tag,
  SortAsc,
  SortDesc
} from 'lucide-react';

interface ModernNotesNavigationProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortBy: 'created' | 'updated' | 'title';
  onSortChange: (sort: 'created' | 'updated' | 'title') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  onCreateNote: () => void;
  categories: string[];
  noteCounts: {
    total: number;
    pinned: number;
    archived: number;
    byCategory: Record<string, number>;
  };
}

const ModernNotesNavigation = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  onCreateNote,
  categories,
  noteCounts
}: ModernNotesNavigationProps) => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const categoryIcons: Record<string, string> = {
    'all': '📋',
    'fishing': '🎣',
    'technique': '⚙️',
    'location': '📍',
    'equipment': '🎯',
    'personal': '💭',
    'tips': '💡',
    'recipes': '🍽️'
  };

  const quickFilters = [
    { id: 'all', label: 'Semua', icon: BookOpen, count: noteCounts.total },
    { id: 'pinned', label: 'Disematkan', icon: Star, count: noteCounts.pinned },
    { id: 'archived', label: 'Diarsipkan', icon: Archive, count: noteCounts.archived }
  ];

  return (
    <div className="space-y-4">
      {/* Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Catatan Pribadi
            </h2>
            <p className="text-white/70 text-sm">
              {noteCounts.total} catatan • {noteCounts.pinned} disematkan
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onCreateNote}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl h-12 px-6 shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Buat Catatan</span>
            </Button>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickFilters.map((filter) => {
            const IconComponent = filter.icon;
            return (
              <motion.div
                key={filter.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCategoryChange(filter.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  selectedCategory === filter.id
                    ? 'bg-white/20 border-white/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-white/10">
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm truncate">
                      {filter.label}
                    </div>
                    <div className="text-white/60 text-xs">
                      {filter.count}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Search and Filters */}
      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
          <Input
            placeholder="Cari catatan, konten, atau kategori..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 pr-4 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-2xl focus:border-white/40 focus:ring-white/20"
          />
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <span className="text-white/60 text-sm">✕</span>
            </motion.button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Categories */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.slice(0, 5).map((category) => {
              const isSelected = selectedCategory === category;
              const count = noteCounts.byCategory[category] || 0;
              
              return (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onCategoryChange(category)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-white/30'
                      : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <span>{categoryIcons[category] || '📄'}</span>
                  <span className="capitalize">{category}</span>
                  {count > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 text-xs bg-white/20 text-white">
                      {count}
                    </Badge>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <List className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
            </Button>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'created' | 'updated' | 'title')}
              className="bg-white/10 border border-white/20 text-white text-sm rounded-xl px-3 py-2 focus:border-white/40 focus:outline-none"
            >
              <option value="updated" className="bg-gray-800">Terakhir Diubah</option>
              <option value="created" className="bg-gray-800">Tanggal Dibuat</option>
              <option value="title" className="bg-gray-800">Judul A-Z</option>
            </select>
          </div>

          {/* Advanced Filter Toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className={`p-2 rounded-xl transition-all duration-200 ${
              isFilterExpanded
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Filter className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {isFilterExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-white/10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Tanggal Dibuat</label>
                  <input
                    type="date"
                    className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 text-sm focus:border-white/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Tag</label>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-white/60" />
                    <Input
                      placeholder="Filter by tags..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Status</label>
                  <select className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 text-sm focus:border-white/40 focus:outline-none">
                    <option value="all" className="bg-gray-800">Semua Status</option>
                    <option value="active" className="bg-gray-800">Aktif</option>
                    <option value="archived" className="bg-gray-800">Diarsipkan</option>
                    <option value="pinned" className="bg-gray-800">Disematkan</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || selectedCategory !== 'all') && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 flex-wrap"
        >
          <span className="text-white/60 text-sm">Filter aktif:</span>
          {searchQuery && (
            <Badge className="bg-blue-500/20 text-blue-200 border-blue-500/30">
              <Search className="w-3 h-3 mr-1" />
              "{searchQuery}"
            </Badge>
          )}
          {selectedCategory !== 'all' && (
            <Badge className="bg-purple-500/20 text-purple-200 border-purple-500/30">
              <Tag className="w-3 h-3 mr-1" />
              {selectedCategory}
            </Badge>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ModernNotesNavigation;
