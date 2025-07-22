import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Navigation, Star, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface LocationSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (lat: number, lon: number, name: string) => void;
}

export const LocationSearch = ({ isOpen, onClose, onLocationSelect }: LocationSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentLocations, setRecentLocations] = useState<any[]>([]);

  // Popular Indonesian cities
  const popularCities = [
    { name: 'Jakarta', lat: -6.2088, lon: 106.8456, country: 'Indonesia' },
    { name: 'Surabaya', lat: -7.2575, lon: 112.7521, country: 'Indonesia' },
    { name: 'Bandung', lat: -6.9175, lon: 107.6191, country: 'Indonesia' },
    { name: 'Medan', lat: 3.5952, lon: 98.6722, country: 'Indonesia' },
    { name: 'Semarang', lat: -6.9667, lon: 110.4167, country: 'Indonesia' },
    { name: 'Makassar', lat: -5.1477, lon: 119.4327, country: 'Indonesia' },
    { name: 'Palembang', lat: -2.9761, lon: 104.7754, country: 'Indonesia' },
    { name: 'Denpasar', lat: -8.6500, lon: 115.2167, country: 'Indonesia' }
  ];

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Simple location search simulation
      // In real implementation, you would use geocoding API
      const filtered = popularCities.filter(city =>
        city.name.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(filtered);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Gagal mencari lokasi');
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationClick = (location: any) => {
    onLocationSelect(location.lat, location.lon, location.name);
    
    // Add to recent locations
    const newRecent = [location, ...recentLocations.filter(l => l.name !== location.name)].slice(0, 5);
    setRecentLocations(newRecent);
    
    onClose();
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationSelect(latitude, longitude, 'Lokasi Saat Ini');
          toast.success('Lokasi berhasil diperbarui');
          onClose();
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Gagal mendapatkan lokasi');
        }
      );
    } else {
      toast.error('Geolocation tidak didukung browser');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Pilih Lokasi</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari kota..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              className="pl-10 bg-white/10 backdrop-blur-sm border-white/20"
            />
          </div>

          {/* Current Location Button */}
          <Button 
            variant="outline" 
            className="w-full justify-start bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
            onClick={getCurrentLocation}
          >
            <Navigation className="h-4 w-4 mr-2" />
            Gunakan Lokasi Saat Ini
          </Button>

          {/* Search Results */}
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <h4 className="text-sm font-medium text-muted-foreground">Hasil Pencarian</h4>
                {searchResults.map((location, index) => (
                  <motion.button
                    key={`${location.name}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="w-full text-left p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
                    onClick={() => handleLocationClick(location)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{location.name}</p>
                        <p className="text-sm text-muted-foreground">{location.country}</p>
                      </div>
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent Locations */}
          {recentLocations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Lokasi Terakhir
              </h4>
              {recentLocations.map((location, index) => (
                <motion.button
                  key={`recent-${location.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="w-full text-left p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
                  onClick={() => handleLocationClick(location)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{location.name}</p>
                      <p className="text-sm text-muted-foreground">{location.country}</p>
                    </div>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* Popular Cities */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center">
              <Star className="h-4 w-4 mr-2" />
              Kota Populer
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {popularCities.slice(0, 8).map((city, index) => (
                <motion.button
                  key={`popular-${city.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
                  onClick={() => handleLocationClick(city)}
                >
                  <p className="text-sm font-medium text-foreground">{city.name}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};