import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Clock,
  TrendingUp,
  Crown,
  Info,
  Calculator,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Fish,
  Sun,
  Moon,
  ArrowRight,
  Calendar,
  Activity,
  Waves,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchWeatherData, fetchForecastData, fetchDailyForecast } from '@/utils/weather';
import { 
  calculateEnhancedFishingScore, 
  generateFisheryAdvice,
  EnhancedWeatherData,
  FishingConditions 
} from '@/utils/enhanced-weather';
import { toast } from 'sonner';
import { WeatherExplanationCard } from './WeatherExplanationCard';
import { WeatherChatBot } from './WeatherChatBot';
import { PremiumWeatherFeatures } from './PremiumWeatherFeatures';
import { LocationPermissionModal } from './LocationPermissionModal';
import { ResponsiveWeatherCard } from './ResponsiveWeatherCard';
import { ModernLocationBar } from './ModernLocationBar';
import { ModernForecastCard } from './ModernForecastCard';
import { ModernWeatherHeader } from './ModernWeatherHeader';
import { ParameterContributionBar } from './ParameterContributionBar';
import { ScoreExplanationModal } from './ScoreExplanationModal';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  generateTemperatureExplanation,
  generateHumidityExplanation, 
  generateWindExplanation,
  generatePressureExplanation,
  generateConditionExplanation
} from '@/utils/weather-explanations';
import { AquacultureOverview } from './AquacultureOverview';
import { AquacultureAIModal } from './AquacultureAIModal';
import { convertToEnhancedWeatherData } from '@/utils/weather-converter';

const ModernWeatherPage = () => {
  const [weatherData, setWeatherData] = useState<EnhancedWeatherData | null>(null);
  const [fishingConditions, setFishingConditions] = useState<FishingConditions | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<any[]>([]);
  const [dailyForecast, setDailyForecast] = useState<any[]>([]);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showScoreExplanation, setShowScoreExplanation] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [hasTriedGeolocation, setHasTriedGeolocation] = useState(false);
  const [showAquacultureAI, setShowAquacultureAI] = useState(false);
  const { isPremium, loading: premiumLoading } = usePremiumStatus();
  const isMobile = useIsMobile();

  const weatherParameters = [
    {
      icon: Thermometer,
      iconColor: "text-orange-500",
      value: weatherData?.temperature || 0,
      unit: "°C",
      label: "Suhu",
      weatherExplanation: weatherData ? generateTemperatureExplanation(weatherData.temperature) : undefined
    },
    {
      icon: Droplets,
      iconColor: "text-blue-500",
      value: weatherData?.humidity || 0,
      unit: "%",
      label: "Kelembaban",
      weatherExplanation: weatherData ? generateHumidityExplanation(weatherData.humidity) : undefined
    },
    {
      icon: Wind,
      iconColor: "text-gray-500",
      value: weatherData?.windSpeed || 0,
      unit: " km/h",
      label: "Angin",
      weatherExplanation: weatherData ? generateWindExplanation(weatherData.windSpeed) : undefined
    },
    {
      icon: Eye,
      iconColor: "text-purple-500",
      value: weatherData?.pressure || 0,
      unit: " hPa",
      label: "Tekanan",
      weatherExplanation: weatherData ? generatePressureExplanation(weatherData.pressure) : undefined
    },
    {
      icon: Cloud,
      iconColor: "text-gray-600",
      value: weatherData?.condition || "N/A",
      unit: "",
      label: "Kondisi",
      weatherExplanation: weatherData ? generateConditionExplanation(
        weatherData.condition, 
        weatherData.temperature, 
        weatherData.humidity
      ) : undefined
    }
  ];

  useEffect(() => {
    initializeWeatherData();
  }, []);

  const initializeWeatherData = async () => {
    setWeatherLoading(true);
    
    if (navigator.geolocation && !hasTriedGeolocation) {
      setHasTriedGeolocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await loadWeatherData("", latitude, longitude);
        },
        () => {
          setShowLocationModal(true);
          setWeatherLoading(false);
        },
        { timeout: 5000 }
      );
    } else {
      setShowLocationModal(true);
      setWeatherLoading(false);
    }
  };

  const loadWeatherData = async (location: string, lat?: number, lon?: number) => {
    try {
      setWeatherLoading(true);
      const [current, hourly, daily] = await Promise.all([
        fetchWeatherData(location, lat, lon),
        fetchForecastData(location, lat, lon),
        fetchDailyForecast(location, lat, lon)
      ]);

      const enhancedData = convertToEnhancedWeatherData(current);
      setWeatherData(enhancedData);
      setHourlyForecast(hourly);
      setDailyForecast(daily);

      const conditions = calculateEnhancedFishingScore(enhancedData);
      setFishingConditions(conditions);
      
      toast.success(`Data cuaca ${enhancedData.location} berhasil dimuat`);
    } catch (error) {
      console.error('Error loading weather data:', error);
      toast.error('Gagal memuat data cuaca');
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!weatherData) return;
    setRefreshing(true);
    await loadWeatherData(weatherData.location);
    setRefreshing(false);
  };

  const handleLocationSelect = (location: string) => {
    loadWeatherData(location);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setWeatherLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await loadWeatherData("", latitude, longitude);
        },
        () => {
          toast.error('Gagal mengakses lokasi. Silakan coba lagi atau pilih lokasi manual.');
          setWeatherLoading(false);
        }
      );
    }
  };

  const getParameterContributions = () => {
    if (!fishingConditions || !weatherData) return [];
    
    const weights = {
      temperature: 0.22,
      pressure: 0.28,
      wind: 0.18,
      humidity: 0.08,
      timeOfDay: 0.16,
      weatherStability: 0.08
    };

    const getStatusFromScore = (score: number): 'excellent' | 'good' | 'fair' | 'poor' => {
      if (score >= 8) return 'excellent';
      if (score >= 6) return 'good';
      if (score >= 4) return 'fair';
      return 'poor';
    };

    return [
      {
        name: 'Suhu',
        score: fishingConditions.factors.temperature.score,
        weight: weights.temperature,
        description: fishingConditions.factors.temperature.description,
        currentValue: `${weatherData.temperature}°C`,
        optimalRange: '28-30°C',
        status: getStatusFromScore(fishingConditions.factors.temperature.score)
      },
      {
        name: 'Tekanan Udara',
        score: fishingConditions.factors.pressure.score,
        weight: weights.pressure,
        description: fishingConditions.factors.pressure.description,
        currentValue: `${weatherData.pressure} hPa`,
        optimalRange: '1013-1020 hPa',
        status: getStatusFromScore(fishingConditions.factors.pressure.score)
      }
    ];
  };

  if (weatherLoading && !weatherData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-blue-950 dark:to-cyan-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-6"
        >
          <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-500 rounded-full mx-auto animate-spin" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Memuat Data Cuaca...</h3>
        </motion.div>
      </div>
    );
  }

  const getFishingScore = (hour: any) => {
    if (!hour) return 0;
    const temp = hour.temperature;
    const wind = hour.windSpeed || 0;
    const humidity = hour.humidity || 0;
    
    let score = 10;
    if (temp < 20 || temp > 32) score -= 3;
    if (wind > 15) score -= 2;
    if (humidity > 85) score -= 1;
    
    return Math.max(0, score);
  };

  const getBestFishingTimes = () => {
    if (!hourlyForecast.length) return [];
    
    return hourlyForecast
      .map((hour, index) => ({
        ...hour,
        fishingScore: getFishingScore(hour),
        index
      }))
      .filter(hour => hour.fishingScore >= 7)
      .slice(0, 3);
  };

  const renderCurrentWeather = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {weatherParameters.map((param, index) => (
          <ResponsiveWeatherCard
            key={param.label}
            icon={param.icon}
            iconColor={param.iconColor}
            value={param.value}
            unit={param.unit}
            label={param.label}
            weatherExplanation={param.weatherExplanation}
          />
        ))}
      </div>

      {fishingConditions && (
        <Card className="backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border border-white/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Fish className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Kondisi Perikanan Saat Ini
              <Badge className={cn(
                "ml-auto",
                fishingConditions.overallScore >= 8 ? "bg-green-500" :
                fishingConditions.overallScore >= 6 ? "bg-yellow-500" :
                fishingConditions.overallScore >= 4 ? "bg-orange-500" : "bg-red-500"
              )}>
                {fishingConditions.overallScore.toFixed(1)}/10
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {fishingConditions.advice}
            </p>
            
            <Button
              variant="outline"
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="w-full justify-between"
            >
              <span>Detail Analisis</span>
              {showBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>

            {showBreakdown && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 space-y-3"
              >
                {getParameterContributions().map((param) => (
                  <ParameterContributionBar
                    key={param.name}
                    name={param.name}
                    score={param.score}
                    weight={param.weight}
                    description={param.description}
                    currentValue={param.currentValue}
                    optimalRange={param.optimalRange}
                    status={param.status}
                  />
                ))}
              </motion.div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderHourlyForecast = () => (
    <div className="space-y-6">
      <Card className="backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border border-white/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Prakiraan Per Jam (24 Jam)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex overflow-x-auto gap-4 pb-4">
            {hourlyForecast.map((hour, index) => (
              <div key={index} className="flex-shrink-0">
                <ModernForecastCard
                  forecast={hour}
                  type="hourly"
                  index={index}
                />
                <div className="mt-2 text-center">
                  <Badge variant={getFishingScore(hour) >= 7 ? "default" : "secondary"} className="text-xs">
                    Skor: {getFishingScore(hour)}/10
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDailyForecast = () => (
    <div className="space-y-6">
      <Card className="backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border border-white/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Prakiraan 7 Hari
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {dailyForecast.map((day, index) => (
              <ModernForecastCard
                key={index}
                forecast={day}
                type="daily"
                index={index}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFishingAnalysis = () => {
    const bestTimes = getBestFishingTimes();
    
    return (
      <div className="space-y-6">
        <Card className="backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border border-white/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              Waktu Terbaik Memancing
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bestTimes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {bestTimes.map((time, index) => (
                  <Card key={index} className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                    <CardContent className="p-4 text-center">
                      <div className="flex justify-center mb-2">
                        <img src={time.icon} alt={time.condition} className="w-12 h-12" />
                      </div>
                      <div className="font-semibold text-green-700 dark:text-green-300">
                        {time.time}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        {time.temperature}°C
                      </div>
                      <Badge className="bg-green-500 mt-2">
                        Skor: {time.fishingScore}/10
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Fish className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Tidak ada waktu optimal untuk memancing dalam 24 jam ke depan.</p>
                <p className="text-sm mt-2">Kondisi cuaca kurang mendukung aktivitas perikanan.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border border-white/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Waves className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Kondisi Laut & Perikanan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Aktivitas Ikan
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {weatherData?.temperature && weatherData.temperature >= 25 && weatherData.temperature <= 30
                    ? "Suhu optimal untuk aktivitas ikan"
                    : "Suhu kurang optimal untuk aktivitas ikan"}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Wind className="w-4 h-4" />
                  Kondisi Permukaan Air
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {weatherData?.windSpeed && weatherData.windSpeed <= 10
                    ? "Permukaan air tenang, ideal untuk memancing"
                    : weatherData?.windSpeed && weatherData.windSpeed <= 20
                    ? "Sedikit berombak, masih layak untuk memancing"
                    : "Berombak tinggi, tidak disarankan memancing"}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Rekomendasi Jenis Ikan</h4>
              <div className="flex flex-wrap gap-2">
                {weatherData?.temperature && weatherData.temperature >= 28 ? (
                  <>
                    <Badge variant="outline">Ikan Nila</Badge>
                    <Badge variant="outline">Ikan Mas</Badge>
                    <Badge variant="outline">Ikan Lele</Badge>
                  </>
                ) : (
                  <>
                    <Badge variant="outline">Ikan Trout</Badge>
                    <Badge variant="outline">Ikan Mujair</Badge>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-blue-950 dark:to-cyan-950">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {weatherData && (
          <>
            <ModernWeatherHeader
              weatherData={weatherData}
              onRefresh={handleRefresh}
              isRefreshing={refreshing}
            />

            <div className="mt-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md">
                  <TabsTrigger value="current" className="flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    Saat Ini
                  </TabsTrigger>
                  <TabsTrigger value="hourly" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Per Jam
                  </TabsTrigger>
                  <TabsTrigger value="daily" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    7 Hari
                  </TabsTrigger>
                  <TabsTrigger value="fishing" className="flex items-center gap-2">
                    <Fish className="w-4 h-4" />
                    Analisis Perikanan
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="current" className="mt-6">
                  {renderCurrentWeather()}
                </TabsContent>

                <TabsContent value="hourly" className="mt-6">
                  {renderHourlyForecast()}
                </TabsContent>

                <TabsContent value="daily" className="mt-6">
                  {renderDailyForecast()}
                </TabsContent>

                <TabsContent value="fishing" className="mt-6">
                  {renderFishingAnalysis()}
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>

      <LocationPermissionModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLocationSelect={handleLocationSelect}
        onCurrentLocation={handleCurrentLocation}
      />
    </div>
  );
};

export default ModernWeatherPage;
