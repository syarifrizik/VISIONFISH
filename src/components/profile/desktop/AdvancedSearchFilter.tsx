
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Calendar, Tag, User, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdvancedSearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterChange: (filters: SearchFilters) => void;
}

interface SearchFilters {
  dateRange: string;
  contentType: string;
  tags: string[];
  sortBy: string;
}

const AdvancedSearchFilter = ({
  searchQuery,
  onSearchChange,
  onFilterChange
}: AdvancedSearchFilterProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    dateRange: 'all',
    contentType: 'all',
    tags: [],
    sortBy: 'recent'
  });

  const predefinedTags = ['Ikan Nila', 'Sungai', 'Laut', 'Kolam', 'Trophy', 'Pemula'];

  const handleFilterUpdate = (newFilters: Partial<SearchFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      handleFilterUpdate({ tags: [...filters.tags, tag] });
    }
  };

  const removeTag = (tag: string) => {
    handleFilterUpdate({ tags: filters.tags.filter(t => t !== tag) });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          <Input
            placeholder="Cari konten, lokasi, atau jenis ikan..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-cyan-400 rounded-xl"
          />
        </div>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="bg-white/20 border-white/30 text-white hover:bg-white/30"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
          {filters.tags.length > 0 && (
            <Badge className="ml-2 bg-cyan-500">{filters.tags.length}</Badge>
          )}
        </Button>

        {/* Quick Sort */}
        <Select value={filters.sortBy} onValueChange={(value) => handleFilterUpdate({ sortBy: value })}>
          <SelectTrigger className="w-40 bg-white/20 border-white/30 text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Terbaru</SelectItem>
            <SelectItem value="popular">Terpopuler</SelectItem>
            <SelectItem value="oldest">Terlama</SelectItem>
            <SelectItem value="az">A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filter Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-6 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Filter Lanjutan</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFilterOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Rentang Waktu
                </label>
                <Select value={filters.dateRange} onValueChange={(value) => handleFilterUpdate({ dateRange: value })}>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Waktu</SelectItem>
                    <SelectItem value="today">Hari Ini</SelectItem>
                    <SelectItem value="week">Minggu Ini</SelectItem>
                    <SelectItem value="month">Bulan Ini</SelectItem>
                    <SelectItem value="year">Tahun Ini</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Content Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Jenis Konten
                </label>
                <Select value={filters.contentType} onValueChange={(value) => handleFilterUpdate({ contentType: value })}>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Konten</SelectItem>
                    <SelectItem value="catches">Tangkapan</SelectItem>
                    <SelectItem value="notes">Catatan</SelectItem>
                    <SelectItem value="photos">Foto</SelectItem>
                    <SelectItem value="locations">Lokasi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </label>
              
              {/* Selected Tags */}
              {filters.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {filters.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 hover:bg-cyan-500/30 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Available Tags */}
              <div className="flex flex-wrap gap-2">
                {predefinedTags.filter(tag => !filters.tags.includes(tag)).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-white/30 text-white/70 hover:bg-white/20 cursor-pointer"
                    onClick={() => addTag(tag)}
                  >
                    + {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdvancedSearchFilter;
