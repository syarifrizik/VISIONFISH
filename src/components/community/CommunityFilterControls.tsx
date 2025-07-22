
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, Grid3X3, List, Calendar, TrendingUp, Heart, Eye, Globe, Lock, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface CommunityFilterControlsProps {
  totalPosts: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterBy: string;
  onFilterChange: (filter: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onRefresh: () => void;
}

const CommunityFilterControls = ({
  totalPosts,
  searchQuery,
  onSearchChange,
  filterBy,
  onFilterChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onRefresh
}: CommunityFilterControlsProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const filterOptions = [
    { value: 'all', label: 'Semua Post', icon: Globe, count: totalPosts },
    { value: 'public', label: 'Publik', icon: Globe, count: totalPosts },
    { value: 'private', label: 'Privat', icon: Lock, count: 0 },
    { value: 'with_images', label: 'Dengan Gambar', icon: Users, count: 0 },
    { value: 'today', label: 'Hari Ini', icon: Calendar, count: 0 }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Terbaru', icon: Calendar },
    { value: 'oldest', label: 'Terlama', icon: Calendar },
    { value: 'most_liked', label: 'Paling Disukai', icon: Heart },
    { value: 'most_viewed', label: 'Paling Dilihat', icon: Eye },
    { value: 'trending', label: 'Trending', icon: TrendingUp }
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">Komunitas Memancing</h2>
          <Badge className="bg-white/20 text-white border-white/30">
            {totalPosts} post
          </Badge>
        </div>
        
        <Button
          onClick={onRefresh}
          variant="outline"
          size="sm"
          className="border-white/30 text-white hover:bg-white/10"
        >
          Refresh
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
        <Input
          placeholder="Cari post, lokasi, atau penulis..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white/10 backdrop-blur-xl border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Content Filter */}
        <Select value={filterBy} onValueChange={onFilterChange}>
          <SelectTrigger className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter konten" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/20">
            {filterOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="text-white focus:bg-white/10"
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    <span>{option.label}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {option.count}
                    </Badge>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* Sort Options */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/20">
            {sortOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="text-white focus:bg-white/10"
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className={`px-3 py-2 ${
              viewMode === 'grid' 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className={`px-3 py-2 ${
              viewMode === 'list' 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>

        {/* Advanced Filters Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="border-white/30 text-white hover:bg-white/10"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filter Lanjutan
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10"
        >
          <h3 className="text-white font-semibold mb-3 text-sm">Filter Lanjutan</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
              Posting Hari Ini
            </Button>
            <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
              Minggu Ini
            </Button>
            <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
              Bulan Ini
            </Button>
            <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
              Dengan Lokasi
            </Button>
            <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
              Video
            </Button>
            <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
              {'>'}10 Likes
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CommunityFilterControls;
