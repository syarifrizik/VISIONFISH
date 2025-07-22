
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

interface OptimizedMobileSearchProps {
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
  placeholder?: string;
}

const OptimizedMobileSearch = ({
  onSearch,
  onFilter,
  placeholder = "Cari..."
}: OptimizedMobileSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="px-4 py-3 bg-white/5 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400/50 focus:bg-white/15"
          />
        </div>

        {/* Filter Button */}
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="ghost"
            size="sm"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 p-3 bg-white/5 rounded-2xl border border-white/10"
        >
          <div className="flex flex-wrap gap-2">
            {['Lokasi Terdekat', 'Aktif Hari Ini', 'Pemancing Pro', 'Baru Bergabung'].map((filter) => (
              <motion.button
                key={filter}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 text-xs bg-white/10 text-white/70 rounded-full border border-white/20 hover:bg-white/20 hover:text-white"
                onClick={() => onFilter({ type: filter })}
              >
                {filter}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OptimizedMobileSearch;
