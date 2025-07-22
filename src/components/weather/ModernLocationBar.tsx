
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  MapPin, 
  Loader2,
  Navigation,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernLocationBarProps {
  onLocationSelect: (location: string) => void;
  onCurrentLocation: () => void;
  isLoading?: boolean;
  currentLocation?: string;
}

export const ModernLocationBar = ({ 
  onLocationSelect, 
  onCurrentLocation, 
  isLoading = false,
  currentLocation 
}: ModernLocationBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    onLocationSelect(searchQuery.trim());
    setSearchQuery('');
    setIsExpanded(false);
    setIsSearching(false);
  };

  const popularCities = [
    'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Makassar'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative">
        {/* Main Search Bar */}
        <div className="flex items-center gap-2 p-2 rounded-2xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 shadow-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 px-3">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline truncate max-w-32">
              {currentLocation || 'Pilih lokasi'}
            </span>
          </div>
          
          <div className="flex-1 flex gap-2">
            <motion.div
              animate={{ width: isExpanded ? '100%' : '0%' }}
              className="overflow-hidden"
            >
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex gap-2"
                  >
                    <Input
                      placeholder="Cari kota..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="border-0 bg-white/50 dark:bg-gray-700/50 focus-visible:ring-1"
                      autoFocus
                    />
                    <Button
                      onClick={() => {
                        setIsExpanded(false);
                        setSearchQuery('');
                      }}
                      size="sm"
                      variant="ghost"
                      className="px-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            <div className="flex gap-2">
              <Button 
                onClick={isExpanded ? handleSearch : () => setIsExpanded(true)}
                disabled={isExpanded && (!searchQuery.trim() || isSearching) || isLoading}
                size="sm"
                className="bg-blue-500/80 hover:bg-blue-600/80 text-white border-0 backdrop-blur-sm px-3"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
              
              <Button 
                onClick={onCurrentLocation}
                disabled={isLoading}
                size="sm"
                variant="outline"
                className="bg-white/50 dark:bg-gray-700/50 border-white/30 backdrop-blur-sm px-3"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Cities */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 p-4 rounded-xl backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/40 shadow-xl z-50"
            >
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Kota Populer:
              </p>
              <div className="flex flex-wrap gap-2">
                {popularCities.map((city) => (
                  <Button
                    key={city}
                    onClick={() => {
                      onLocationSelect(city);
                      setIsExpanded(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-white/50 dark:bg-gray-700/50 border-white/30 hover:bg-blue-500/20"
                  >
                    {city}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
