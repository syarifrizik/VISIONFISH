import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Layers, Satellite, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherMapProps {
  location: {
    lat: number;
    lon: number;
    name: string;
  };
}

export const WeatherMap = ({ location }: WeatherMapProps) => {
  const mapLayers = [
    { id: 'precipitation', label: 'Curah Hujan', icon: '🌧️', active: true },
    { id: 'temperature', label: 'Suhu', icon: '🌡️', active: false },
    { id: 'wind', label: 'Angin', icon: '💨', active: false },
    { id: 'pressure', label: 'Tekanan', icon: '🌀', active: false },
  ];

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Peta Cuaca</span>
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
            Premium
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Map Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Layer</span>
            </div>
            <div className="flex space-x-2">
              {mapLayers.map((layer, index) => (
                <motion.button
                  key={layer.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                    layer.active
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white/10 text-muted-foreground hover:bg-white/20'
                  }`}
                >
                  {layer.icon} {layer.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="relative h-96 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
            
            {/* Map Content */}
            <div className="relative z-10 p-6 h-full flex flex-col items-center justify-center">
              <div className="text-center space-y-4">
                <div className="p-4 bg-white/10 rounded-full">
                  <Satellite className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Peta Cuaca Interaktif</h3>
                  <p className="text-sm text-muted-foreground">
                    Visualisasi radar cuaca untuk lokasi: {location.name}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Koordinat: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                </div>
              </div>
            </div>

            {/* Location Marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/30 rounded-full animate-pulse"></div>
                <div className="relative p-2 bg-red-500 rounded-full">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Map Legend */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Legenda</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-muted-foreground">Hujan Ringan</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-700 rounded"></div>
                <span className="text-muted-foreground">Hujan Sedang</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-900 rounded"></div>
                <span className="text-muted-foreground">Hujan Lebat</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-muted-foreground">Lokasi Anda</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};