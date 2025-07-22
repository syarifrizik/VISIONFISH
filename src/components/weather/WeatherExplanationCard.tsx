
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Clock, 
  Star,
  Info,
  Target
} from 'lucide-react';
import { EnhancedWeatherData, FishingConditions } from '@/utils/enhanced-weather';

interface WeatherExplanationCardProps {
  weatherData: EnhancedWeatherData | null;
  fishingConditions: FishingConditions | null;
}

export const WeatherExplanationCard = ({ weatherData, fishingConditions }: WeatherExplanationCardProps) => {
  const getTemperatureExplanation = (temp: number) => {
    if (temp >= 25 && temp <= 30) {
      return "Suhu optimal untuk aktivitas perikanan. Ikan aktif dan kondisi nyaman untuk aktivitas outdoor.";
    } else if (temp >= 20 && temp <= 35) {
      return "Suhu baik untuk kegiatan perikanan. Masih dalam rentang yang mendukung aktivitas normal.";
    } else if (temp < 20) {
      return "Suhu agak dingin. Aktivitas ikan mungkin berkurang, pertimbangkan waktu yang tepat.";
    } else {
      return "Suhu tinggi. Hindari aktivitas saat terik matahari, pilih waktu pagi atau sore.";
    }
  };

  const getHumidityExplanation = (humidity: number) => {
    if (humidity >= 60 && humidity <= 80) {
      return "Kelembaban ideal untuk aktivitas outdoor dan kesehatan ikan.";
    } else if (humidity > 80) {
      return "Kelembaban tinggi. Mungkin terasa gerah, pastikan hidrasi yang cukup.";
    } else {
      return "Kelembaban rendah. Udara kering, perhatikan asupan cairan.";
    }
  };

  const getWindExplanation = (windSpeed: number) => {
    if (windSpeed >= 5 && windSpeed <= 15) {
      return "Angin ideal untuk memancing. Menciptakan gelombang kecil yang menarik ikan.";
    } else if (windSpeed < 5) {
      return "Angin tenang. Permukaan air halus, cocok untuk teknik memancing tertentu.";
    } else {
      return "Angin kencang. Hati-hati saat beraktivitas di air, pertimbangkan keselamatan.";
    }
  };

  const getPressureExplanation = (pressure: number) => {
    if (pressure >= 1013 && pressure <= 1020) {
      return "Tekanan udara stabil. Kondisi ideal untuk aktivitas perikanan.";
    } else if (pressure > 1020) {
      return "Tekanan tinggi. Cuaca cenderung cerah dan stabil.";
    } else {
      return "Tekanan rendah. Kemungkinan perubahan cuaca, pantau kondisi.";
    }
  };

  if (!weatherData || !fishingConditions) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Parameter Explanations */}
      <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Penjelasan Parameter Cuaca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-start gap-4 p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20"
            >
              <Thermometer className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">Suhu: {weatherData.temperature}°C</span>
                  <Badge variant="outline" className="text-xs">
                    {fishingConditions.factors.temperature.score}/10
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getTemperatureExplanation(weatherData.temperature)}
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20"
            >
              <Droplets className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">Kelembaban: {weatherData.humidity}%</span>
                  <Badge variant="outline" className="text-xs">
                    {fishingConditions.factors.humidity.score}/10
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getHumidityExplanation(weatherData.humidity)}
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/20"
            >
              <Wind className="w-6 h-6 text-gray-500 mt-1 flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">Angin: {weatherData.windSpeed} km/h</span>
                  <Badge variant="outline" className="text-xs">
                    {fishingConditions.factors.wind.score}/10
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getWindExplanation(weatherData.windSpeed)}
                </p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-start gap-4 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20"
            >
              <Eye className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">Tekanan: {weatherData.pressure} hPa</span>
                  <Badge variant="outline" className="text-xs">
                    {fishingConditions.factors.pressure.score}/10
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getPressureExplanation(weatherData.pressure)}
                </p>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Best Time Slots */}
      <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Waktu Optimal Hari Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fishingConditions.bestTimeSlots.map((timeSlot, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
              >
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">{timeSlot}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Species Recommendations */}
      <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Rekomendasi Spesies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Berdasarkan kondisi cuaca saat ini, spesies berikut direkomendasikan:
          </p>
          <div className="flex flex-wrap gap-2">
            {fishingConditions.speciesRecommendations.map((species, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge 
                  variant="outline" 
                  className="px-3 py-1 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800"
                >
                  {species}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
