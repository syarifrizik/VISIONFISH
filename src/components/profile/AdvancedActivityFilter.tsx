
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Calendar, Search, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';

export interface ActivityFilters {
  search: string;
  types: string[];
  dateRange: DateRange | undefined;
  sortBy: 'newest' | 'oldest' | 'type' | 'popularity';
  groupBy: 'none' | 'date' | 'type';
}

interface AdvancedActivityFilterProps {
  filters: ActivityFilters;
  onFiltersChange: (filters: ActivityFilters) => void;
  activityTypes: Array<{ value: string; label: string; count: number }>;
  totalCount: number;
}

const AdvancedActivityFilter = ({
  filters,
  onFiltersChange,
  activityTypes,
  totalCount
}: AdvancedActivityFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof ActivityFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleTypeToggle = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    
    handleFilterChange('types', newTypes);
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      types: [],
      dateRange: undefined,
      sortBy: 'newest',
      groupBy: 'none'
    });
  };

  const hasActiveFilters = filters.search || filters.types.length > 0 || filters.dateRange || 
    filters.sortBy !== 'newest' || filters.groupBy !== 'none';

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.types.length > 0) count++;
    if (filters.dateRange) count++;
    if (filters.sortBy !== 'newest') count++;
    if (filters.groupBy !== 'none') count++;
    return count;
  };

  const presetDateRanges = [
    { label: '7 Hari Terakhir', value: { from: subDays(new Date(), 7), to: new Date() } },
    { label: '30 Hari Terakhir', value: { from: subDays(new Date(), 30), to: new Date() } },
    { label: '90 Hari Terakhir', value: { from: subDays(new Date(), 90), to: new Date() } },
  ];

  return (
    <Card className="bg-white/5 backdrop-blur-md border-[#A56ABD]/20">
      <CardContent className="p-4">
        {/* Quick Filters Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A56ABD] w-4 h-4" />
            <Input
              placeholder="Cari aktivitas..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 bg-white/10 border-[#A56ABD]/30 text-[#F5EBFA] placeholder:text-[#A56ABD]/70"
            />
          </div>

          {/* Sort */}
          <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
            <SelectTrigger className="w-32 bg-white/10 border-[#A56ABD]/30 text-[#F5EBFA]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#49225B] border-[#A56ABD]/20">
              <SelectItem value="newest">Terbaru</SelectItem>
              <SelectItem value="oldest">Terlama</SelectItem>
              <SelectItem value="type">Tipe</SelectItem>
              <SelectItem value="popularity">Populer</SelectItem>
            </SelectContent>
          </Select>

          {/* Advanced Filter Toggle */}
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            size="sm"
            className="border-[#A56ABD]/30 text-[#A56ABD] hover:bg-[#A56ABD]/20"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filter
            {getActiveFilterCount() > 0 && (
              <Badge className="ml-2 bg-[#6E3482] text-white text-xs">
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              variant="ghost"
              size="sm"
              className="text-[#A56ABD] hover:bg-[#A56ABD]/20"
            >
              <X className="w-4 h-4 mr-1" />
              Reset
            </Button>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-[#E7D0EF]">
            Menampilkan {totalCount} aktivitas
            {hasActiveFilters && ' (difilter)'}
          </span>

          {/* Active Filter Tags */}
          <div className="flex flex-wrap gap-1">
            {filters.types.map(type => {
              const typeInfo = activityTypes.find(t => t.value === type);
              return (
                <Badge 
                  key={type}
                  variant="secondary"
                  className="bg-[#6E3482]/20 text-[#E7D0EF] text-xs cursor-pointer hover:bg-[#6E3482]/30"
                  onClick={() => handleTypeToggle(type)}
                >
                  {typeInfo?.label}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 pt-4 border-t border-[#A56ABD]/20"
            >
              {/* Date Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#E7D0EF]">Rentang Tanggal</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {presetDateRanges.map((preset, index) => (
                    <Button
                      key={index}
                      onClick={() => handleFilterChange('dateRange', preset.value)}
                      variant="outline"
                      size="sm"
                      className="text-xs border-[#A56ABD]/30 text-[#A56ABD] hover:bg-[#A56ABD]/20"
                    >
                      {preset.label}
                    </Button>
                  ))}
                  <Button
                    onClick={() => handleFilterChange('dateRange', undefined)}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-[#A56ABD] hover:bg-[#A56ABD]/20"
                  >
                    Hapus
                  </Button>
                </div>
                <DatePickerWithRange
                  date={filters.dateRange}
                  onDateChange={(date) => handleFilterChange('dateRange', date)}
                  className="bg-white/10 border-[#A56ABD]/30"
                />
              </div>

              {/* Activity Types Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#E7D0EF]">Tipe Aktivitas</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {activityTypes.map((type) => (
                    <div
                      key={type.value}
                      className="flex items-center space-x-2 p-2 rounded-lg bg-white/5 border border-[#A56ABD]/20 hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => handleTypeToggle(type.value)}
                    >
                      <Checkbox
                        checked={filters.types.includes(type.value)}
                        onCheckedChange={() => handleTypeToggle(type.value)}
                        className="border-[#A56ABD]/50"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-[#F5EBFA] truncate block">{type.label}</span>
                        <span className="text-xs text-[#A56ABD]">{type.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group By */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#E7D0EF]">Kelompokkan Berdasarkan</label>
                <Select value={filters.groupBy} onValueChange={(value) => handleFilterChange('groupBy', value)}>
                  <SelectTrigger className="bg-white/10 border-[#A56ABD]/30 text-[#F5EBFA]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#49225B] border-[#A56ABD]/20">
                    <SelectItem value="none">Tidak Ada</SelectItem>
                    <SelectItem value="date">Tanggal</SelectItem>
                    <SelectItem value="type">Tipe Aktivitas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default AdvancedActivityFilter;
