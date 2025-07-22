
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Search, 
  AlertCircle, 
  X,
  Loader2
} from 'lucide-react';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: string) => void;
  onCurrentLocation: () => void;
  isLoading?: boolean;
}

export const LocationPermissionModal = ({ 
  isOpen, 
  onClose, 
  onLocationSelect,
  onCurrentLocation,
  isLoading = false 
}: LocationPermissionModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          onClose();
          onCurrentLocation();
        },
        (error) => {
          console.error('Location permission denied:', error);
        }
      );
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    onLocationSelect(searchQuery.trim());
    setIsSearching(false);
    onClose();
  };

  const popularCities = [
    'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Makassar',
    'Semarang', 'Palembang', 'Balikpapan', 'Pontianak', 'Manado'
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Pilih Lokasi
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Location Permission Option */}
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                      Gunakan Lokasi Saat Ini
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Dapatkan cuaca akurat untuk lokasi Anda
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleLocationPermission}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <MapPin className="w-4 h-4 mr-2" />
                  )}
                  Izinkan Akses Lokasi
                </Button>
              </div>

              {/* Manual Search */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-border"></div>
                  <span className="text-sm text-muted-foreground">atau</span>
                  <div className="flex-1 h-px bg-border"></div>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Cari kota atau wilayah..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSearch}
                      disabled={!searchQuery.trim() || isSearching}
                      size="sm"
                    >
                      {isSearching ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Kota Populer:</p>
                    <div className="flex flex-wrap gap-2">
                      {popularCities.map((city) => (
                        <Button
                          key={city}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            onLocationSelect(city);
                            onClose();
                          }}
                          className="text-xs"
                        >
                          {city}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Untuk hasil terbaik, izinkan akses lokasi atau masukkan nama kota yang spesifik.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
