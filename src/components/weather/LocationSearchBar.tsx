
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  MapPin, 
  Loader2,
  Navigation
} from 'lucide-react';

interface LocationSearchBarProps {
  onLocationSelect: (location: string) => void;
  onCurrentLocation: () => void;
  isLoading?: boolean;
  currentLocation?: string;
}

export const LocationSearchBar = ({ 
  onLocationSelect, 
  onCurrentLocation, 
  isLoading = false,
  currentLocation 
}: LocationSearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    onLocationSelect(searchQuery.trim());
    setSearchQuery('');
    setIsSearching(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 p-4 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-white/20"
    >
      <div className="flex-1 flex gap-2">
        <Input
          placeholder={`Cari lokasi... (saat ini: ${currentLocation || 'Tidak diketahui'})`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 bg-white/70 dark:bg-gray-900/70 border-white/30"
        />
        <Button 
          onClick={handleSearch}
          disabled={!searchQuery.trim() || isSearching || isLoading}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </div>
      
      <Button 
        onClick={onCurrentLocation}
        disabled={isLoading}
        size="sm"
        variant="outline"
        className="bg-white/70 dark:bg-gray-900/70 border-white/30"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Navigation className="w-4 h-4" />
        )}
      </Button>
    </motion.div>
  );
};
