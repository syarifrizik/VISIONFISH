
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, RefreshCw, SlidersHorizontal, Activity, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ActivityFilterBarProps {
  title: string;
  totalCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: string) => void;
  onSortChange: (sort: string) => void;
  onRefresh: () => void;
  onAddActivity?: () => void;
  activeFilter?: string;
  sortBy?: string;
  showAddButton?: boolean;
}

const ActivityFilterBar = ({
  title,
  totalCount,
  searchQuery,
  onSearchChange,
  onFilterChange,
  onSortChange,
  onRefresh,
  onAddActivity,
  activeFilter = 'all',
  sortBy = 'newest',
  showAddButton = true
}: ActivityFilterBarProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-16 md:top-20 z-20 mb-6"
    >
      <Card className="bg-white/5 backdrop-blur-xl border-[#A56ABD]/20 shadow-lg">
        <CardContent className="p-4">
          {/* Header dengan judul dan counter */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-[#F5EBFA] flex items-center gap-2">
                <Activity className="w-5 h-5" />
                {title}
              </h2>
              <span className="bg-[#A56ABD]/20 text-[#F5EBFA] px-3 py-1 rounded-full text-sm font-medium">
                {totalCount} item
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {showAddButton && onAddActivity && (
                <Button
                  onClick={onAddActivity}
                  size="sm"
                  className="bg-[#6E3482] hover:bg-[#49225B] text-[#F5EBFA]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Konten
                </Button>
              )}
              <Button
                onClick={onRefresh}
                variant="ghost"
                size="sm"
                className="text-[#F5EBFA] hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A56ABD] w-4 h-4" />
              <Input
                placeholder="Cari aktivitas atau konten..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-white/5 backdrop-blur-xl border-[#A56ABD]/30 text-[#F5EBFA] placeholder:text-[#A56ABD] focus:border-[#A56ABD]"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex gap-2">
              {/* Category Filter */}
              <Select value={activeFilter} onValueChange={onFilterChange}>
                <SelectTrigger className="w-40 bg-white/5 backdrop-blur-xl border-[#A56ABD]/30 text-[#F5EBFA]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Semua" />
                </SelectTrigger>
                <SelectContent className="bg-[#49225B] border-[#A56ABD]/20">
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="achievement">🏆 Pencapaian</SelectItem>
                  <SelectItem value="activity">🎣 Aktivitas</SelectItem>
                  <SelectItem value="statistic">📊 Statistik</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Filter */}
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-32 bg-white/5 backdrop-blur-xl border-[#A56ABD]/30 text-[#F5EBFA]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#49225B] border-[#A56ABD]/20">
                  <SelectItem value="newest">Terbaru</SelectItem>
                  <SelectItem value="oldest">Terlama</SelectItem>
                  <SelectItem value="popular">Populer</SelectItem>
                </SelectContent>
              </Select>

              {/* Advanced Filters Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="border-[#A56ABD]/30 text-[#F5EBFA] hover:bg-white/10"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-[#A56ABD]/20"
            >
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#A56ABD]/30 text-[#F5EBFA] hover:bg-[#A56ABD]/20"
                >
                  Hari Ini
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#A56ABD]/30 text-[#F5EBFA] hover:bg-[#A56ABD]/20"
                >
                  Minggu Ini
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#A56ABD]/30 text-[#F5EBFA] hover:bg-[#A56ABD]/20"
                >
                  Bulan Ini
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#A56ABD]/30 text-[#F5EBFA] hover:bg-[#A56ABD]/20"
                >
                  Dengan Gambar
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ActivityFilterBar;
