import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CloudRain, MapPin, RefreshCw, Settings, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

import { CurrentWeather } from './CurrentWeather';
import { HourlyForecast } from './HourlyForecast';
import { DailyForecast } from './DailyForecast';
import { LocationSearch } from './LocationSearch';
import { WeatherMap } from './premium/WeatherMap';
import { DetailedAnalysis } from './premium/DetailedAnalysis';
import { ExtendedForecast } from './premium/ExtendedForecast';

import { fetchWeatherData, fetchForecastData, fetchDailyForecast, WeatherData, HourlyForecast as HourlyForecastType, DailyForecast as DailyForecastType } from '@/utils/weather';
import { isPremiumUser } from '@/utils/premiumCheck';

interface WeatherPageProps {
  className?: string;
}

export const WeatherPage = ({ className }: WeatherPageProps) => {
  const { theme } = useTheme();
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastType[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecastType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState({ lat: 0, lon: 0, name: '' });
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [activeTab, setActiveTab] = useState<'hourly' | 'daily' | 'map' | 'analysis'>('hourly');
  
  const isPremium = isPremiumUser();

  // Get user's location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude, name: '' });
          fetchWeatherForLocation(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to default location (Jakarta)
          setLocation({ lat: -6.2088, lon: 106.8456, name: 'Jakarta' });
          fetchWeatherForLocation(-6.2088, 106.8456);
        }
      );
    }
  };

  const fetchWeatherForLocation = async (lat: number, lon: number, locationName?: string) => {
    try {
      setLoading(true);
      const [current, hourly, daily] = await Promise.all([
        fetchWeatherData('', lat, lon),
        fetchForecastData('', lat, lon),
        fetchDailyForecast('', lat, lon)
      ]);

      setCurrentWeather(current);
      setHourlyForecast(hourly);
      setDailyForecast(daily);
      
      if (locationName) {
        setLocation(prev => ({ ...prev, name: locationName }));
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      toast.error('Gagal memuat data cuaca');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWeatherForLocation(location.lat, location.lon);
  };

  const handleLocationSelect = (lat: number, lon: number, name: string) => {
    setLocation({ lat, lon, name });
    fetchWeatherForLocation(lat, lon, name);
    setShowLocationSearch(false);
  };

  const getWeatherBg = () => {
    if (!currentWeather) return 'from-blue-500/10 to-purple-500/10';
    
    const condition = currentWeather.condition.toLowerCase();
    if (condition.includes('rain') || condition.includes('hujan')) {
      return 'from-gray-500/10 to-blue-500/10';
    }
    if (condition.includes('cloud') || condition.includes('berawan')) {
      return 'from-gray-400/10 to-blue-400/10';
    }
    if (condition.includes('sun') || condition.includes('cerah')) {
      return 'from-yellow-400/10 to-orange-400/10';
    }
    return 'from-blue-500/10 to-purple-500/10';
  };

  const tabs = [
    { id: 'hourly', label: 'Per Jam', icon: CloudRain },
    { id: 'daily', label: '7 Hari', icon: CloudRain },
    ...(isPremium ? [
      { id: 'map', label: 'Peta', icon: MapPin },
      { id: 'analysis', label: 'Analisis', icon: Star }
    ] : [])
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className={`absolute inset-0 bg-gradient-to-br ${getWeatherBg()}`} />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Dynamic Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getWeatherBg()}`} />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-sm">
              <CloudRain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Cuaca
              </h1>
              <p className="text-muted-foreground text-sm line-clamp-1">
                {location.name || currentWeather?.location || 'Lokasi Anda'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLocationSearch(true)}
              className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 min-h-[44px] min-w-[44px] p-2"
              aria-label="Pilih lokasi"
            >
              <MapPin className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 min-h-[44px] min-w-[44px] p-2"
              aria-label="Refresh data cuaca"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </motion.div>

        {/* Current Weather */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <CurrentWeather weather={currentWeather} />
        </motion.div>

        {/* Premium Badge */}
        {isPremium && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              <Star className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex space-x-1 p-1 bg-white/10 backdrop-blur-sm rounded-2xl overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col sm:flex-row items-center justify-center sm:space-x-2 px-2 sm:px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium min-h-[44px] min-w-[60px] sm:min-w-auto ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/10'
                }`}
                aria-label={tab.label}
              >
                <tab.icon className="h-4 w-4 mb-1 sm:mb-0" />
                <span className="text-xs sm:text-sm hidden sm:block">{tab.label}</span>
                <span className="text-xs block sm:hidden leading-tight">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {activeTab === 'hourly' && (
            <HourlyForecast forecast={hourlyForecast} />
          )}
          
          {activeTab === 'daily' && (
            <DailyForecast forecast={dailyForecast} />
          )}
          
          {activeTab === 'map' && isPremium && (
            <WeatherMap location={location} />
          )}
          
          {activeTab === 'analysis' && isPremium && (
            <DetailedAnalysis weather={currentWeather} />
          )}
        </motion.div>

        {/* Premium Upgrade Prompt for Free Users */}
        {!isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-amber-500/20">
                    <Star className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Upgrade ke Premium</h3>
                    <p className="text-sm text-muted-foreground">
                      Dapatkan peta cuaca, analisis detail, dan prakiraan 14 hari
                    </p>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  Upgrade
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Location Search Modal */}
      <LocationSearch
        isOpen={showLocationSearch}
        onClose={() => setShowLocationSearch(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
};

export default WeatherPage;