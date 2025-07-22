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
  Fish, 
  Waves,
  Brain,
  Target,
  TrendingUp,
  MapPin,
  Clock,
  Star,
  Loader2
} from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { fetchWeatherData, fetchDailyForecast } from '@/utils/weather';
import { 
  calculateEnhancedFishingScore, 
  generateFisheryAdvice,
  EnhancedWeatherData,
  FishingConditions 
} from '@/utils/enhanced-weather';
import { toast } from 'sonner';
import { convertToEnhancedWeatherData } from '@/utils/weather-converter';

const EnhancedWeatherPage = () => {
  const { theme } = useTheme();
  const [weatherData, setWeatherData] = useState<EnhancedWeatherData | null>(null);
  const [fishingConditions, setFishingConditions] = useState<FishingConditions | null>(null);
  const [aiAdvice, setAiAdvice] = useState<{
    fishing: string;
    aquaculture: string;
    research: string;
  } | null>(null);
  const [dailyForecast, setDailyForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    fetchWeatherAndAnalyze();
  }, []);

  const fetchWeatherAndAnalyze = async () => {
    try {
      setLoading(true);
      
      // Get user location or use fallback
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const data = await fetchWeatherData("", latitude, longitude);
              const enhancedData = convertToEnhancedWeatherData(data);
              
              setWeatherData(enhancedData);
              setLocationPermission(true);
              
              // Calculate fishing conditions
              const conditions = calculateEnhancedFishingScore(enhancedData);
              setFishingConditions(conditions);
              
              // Fetch daily forecast
              const forecast = await fetchDailyForecast("", latitude, longitude);
              setDailyForecast(forecast);
              
              // Generate AI advice
              generateAllAdvice(enhancedData, conditions);
              
            } catch (error) {
              console.error('Error fetching weather:', error);
              toast.error('Gagal mengambil data cuaca');
            }
          },
          (error) => {
            console.log('Location access denied:', error);
            setLocationPermission(false);
            // Use fallback location (Jakarta)
            fetchFallbackWeather();
          }
        );
      } else {
        fetchFallbackWeather();
      }
    } catch (error) {
      console.error('Error in weather fetch:', error);
      toast.error('Terjadi kesalahan saat mengambil data cuaca');
    } finally {
      setLoading(false);
    }
  };

  const fetchFallbackWeather = async () => {
    try {
      const data = await fetchWeatherData("Jakarta");
      const enhancedData = convertToEnhancedWeatherData(data);
      
      setWeatherData(enhancedData);
      
      const conditions = calculateEnhancedFishingScore(enhancedData);
      setFishingConditions(conditions);
      
      const forecast = await fetchDailyForecast("Jakarta");
      setDailyForecast(forecast);
      
      generateAllAdvice(enhancedData, conditions);
    } catch (error) {
      console.error('Error fetching fallback weather:', error);
      toast.error('Gagal mengambil data cuaca');
    }
  };

  const generateAllAdvice = async (weather: EnhancedWeatherData, conditions: FishingConditions) => {
    setAiLoading(true);
    try {
      const [fishingAdvice, aquacultureAdvice] = await Promise.all([
        generateFisheryAdvice(weather, conditions, 'fishing'),
        generateFisheryAdvice(weather, conditions, 'aquaculture')
      ]);
      
      setAiAdvice({
        fishing: fishingAdvice,
        aquaculture: aquacultureAdvice,
        research: aquacultureAdvice // Use aquaculture advice for research too
      });
    } catch (error) {
      console.error('Error generating AI advice:', error);
      toast.error('Gagal generate AI advice');
    } finally {
      setAiLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-500';
    if (score >= 7.0) return 'text-blue-500';
    if (score >= 5.5) return 'text-yellow-500';
    if (score >= 4.0) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8.5) return 'bg-green-500/20 border-green-500/30';
    if (score >= 7.0) return 'bg-blue-500/20 border-blue-500/30';
    if (score >= 5.5) return 'bg-yellow-500/20 border-yellow-500/30';
    if (score >= 4.0) return 'bg-orange-500/20 border-orange-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-muted-foreground">Menganalisis kondisi cuaca dan perikanan...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            VisionFish Weather Intelligence
          </h1>
          <p className="text-lg text-muted-foreground">
            Analisis cuaca berbasis AI untuk aktivitas perikanan optimal
          </p>
        </motion.div>

        {/* Main Weather Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10" />
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      {weatherData?.location || 'Loading...'}
                    </CardTitle>
                    <p className="text-muted-foreground">
                      {locationPermission ? 'Lokasi Anda' : 'Lokasi Default'}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={fetchWeatherAndAnalyze}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh'}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="relative space-y-6">
              {/* Current Weather Display */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <Thermometer className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-bold">{weatherData?.temperature}°C</div>
                  <div className="text-sm text-muted-foreground">Suhu</div>
                </div>
                <div className="text-center">
                  <Droplets className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{weatherData?.humidity}%</div>
                  <div className="text-sm text-muted-foreground">Kelembaban</div>
                </div>
                <div className="text-center">
                  <Wind className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                  <div className="text-2xl font-bold">{weatherData?.windSpeed}</div>
                  <div className="text-sm text-muted-foreground">km/h</div>
                </div>
                <div className="text-center">
                  <Eye className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">{weatherData?.pressure}</div>
                  <div className="text-sm text-muted-foreground">hPa</div>
                </div>
                <div className="text-center">
                  <Cloud className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <div className="text-sm font-medium">{weatherData?.condition}</div>
                  <div className="text-sm text-muted-foreground">Kondisi</div>
                </div>
              </div>

              {/* Fishing Score */}
              {fishingConditions && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={cn(
                    "p-6 rounded-xl border",
                    getScoreBgColor(fishingConditions.overallScore)
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Fish className="w-8 h-8 text-current" />
                      <div>
                        <h3 className="text-xl font-bold">Skor Perikanan</h3>
                        <p className="text-sm opacity-80">Analisis kondisi memancing</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={cn("text-4xl font-bold", getScoreColor(fishingConditions.overallScore))}>
                        {fishingConditions.overallScore}
                      </div>
                      <Badge variant="secondary" className="mt-1">
                        {fishingConditions.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(fishingConditions.factors).map(([key, factor]) => (
                      <div key={key} className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                        <div className="text-lg font-semibold">{factor.score}/10</div>
                        <div className="text-xs capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="fishing">Memancing</TabsTrigger>
              <TabsTrigger value="aquaculture">Budidaya</TabsTrigger>
              <TabsTrigger value="research">Penelitian</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Best Time Slots */}
              {fishingConditions && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Waktu Optimal Hari Ini
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fishingConditions.bestTimeSlots.map((timeSlot, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <Star className="w-5 h-5 text-yellow-500" />
                          <span className="font-medium">{timeSlot}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Species Recommendations */}
              {fishingConditions && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Spesies Rekomendasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {fishingConditions.speciesRecommendations.map((species, index) => (
                        <Badge key={index} variant="outline" className="px-3 py-1">
                          {species}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="fishing">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fish className="w-5 h-5" />
                    AI Advice - Aktivitas Memancing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {aiLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-center">
                        <Brain className="w-8 h-8 animate-pulse mx-auto mb-2 text-blue-500" />
                        <p className="text-muted-foreground">AI sedang menganalisis...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p className="whitespace-pre-wrap">{aiAdvice?.fishing || 'Sedang memuat advice...'}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="aquaculture">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Waves className="w-5 h-5" />
                    AI Advice - Budidaya Perikanan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {aiLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-center">
                        <Brain className="w-8 h-8 animate-pulse mx-auto mb-2 text-blue-500" />
                        <p className="text-muted-foreground">AI sedang menganalisis...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p className="whitespace-pre-wrap">{aiAdvice?.aquaculture || 'Sedang memuat advice...'}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="research">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    AI Advice - Penelitian Kelautan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {aiLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-center">
                        <Brain className="w-8 h-8 animate-pulse mx-auto mb-2 text-blue-500" />
                        <p className="text-muted-foreground">AI sedang menganalisis...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p className="whitespace-pre-wrap">{aiAdvice?.research || 'Sedang memuat advice...'}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Daily Forecast */}
        {dailyForecast.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Prakiraan 5 Hari</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {dailyForecast.map((forecast, index) => (
                    <div key={index} className="text-center p-4 bg-muted rounded-lg">
                      <div className="font-semibold text-sm mb-2">{forecast.day}</div>
                      <img 
                        src={forecast.icon} 
                        alt={forecast.condition}
                        className="w-12 h-12 mx-auto mb-2"
                      />
                      <div className="text-sm space-y-1">
                        <div className="font-medium">{forecast.highTemp}° / {forecast.lowTemp}°</div>
                        <div className="text-xs text-muted-foreground">{forecast.condition}</div>
                        <div className="text-xs">💧 {forecast.rainChance}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EnhancedWeatherPage;
