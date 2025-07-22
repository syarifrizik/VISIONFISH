
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Fish, 
  Cloud, 
  Thermometer, 
  Droplets, 
  Wind, 
  Target,
  TrendingUp,
  MapPin,
  Calendar,
  Star
} from 'lucide-react';
import { UserProfile, ProfileStats } from '@/types/profile';

interface SmartFishingDashboardProps {
  user: UserProfile;
  stats: ProfileStats;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  fishingScore: number;
}

interface FishingRecommendation {
  id: string;
  location: string;
  species: string[];
  bestTime: string;
  probability: number;
  distance: string;
  tips: string[];
}

const SmartFishingDashboard = ({ user, stats }: SmartFishingDashboardProps) => {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 28,
    humidity: 75,
    windSpeed: 12,
    condition: 'Partly Cloudy',
    fishingScore: 85
  });

  const [recommendations, setRecommendations] = useState<FishingRecommendation[]>([
    {
      id: '1',
      location: 'Danau Toba',
      species: ['Ikan Mas', 'Mujair', 'Nila'],
      bestTime: '05:00 - 07:00',
      probability: 92,
      distance: '2.5 km',
      tips: ['Gunakan umpan cacing', 'Posisi di area teduh']
    },
    {
      id: '2',
      location: 'Sungai Citarum',
      species: ['Bawal', 'Gurame'],
      bestTime: '17:00 - 19:00',
      probability: 78,
      distance: '5.1 km',
      tips: ['Arus sedang bagus', 'Bawa umpan pelet']
    }
  ]);

  const getFishingScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const getFishingScoreText = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Fair';
  };

  return (
    <div className="space-y-4">
      {/* Smart Weather Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl"
      >
        {/* Glassmorphism Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/15 to-purple-500/20 backdrop-blur-2xl" />
        <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />
        <div className="absolute inset-0 border border-white/30 dark:border-gray-700/30 rounded-3xl" />
        
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Smart Fishing
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI Recommendations
                </p>
              </div>
            </div>
            
            {/* Fishing Score */}
            <div className="text-center">
              <div className={`text-2xl font-bold bg-gradient-to-r ${getFishingScoreColor(weatherData.fishingScore)} bg-clip-text text-transparent`}>
                {weatherData.fishingScore}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {getFishingScoreText(weatherData.fishingScore)}
              </div>
            </div>
          </div>

          {/* Weather Grid */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                <Thermometer className="w-5 h-5 text-white" />
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {weatherData.temperature}°C
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Temp</div>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {weatherData.humidity}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Humidity</div>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center">
                <Wind className="w-5 h-5 text-white" />
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {weatherData.windSpeed} km/h
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Wind</div>
            </div>
          </div>

          {/* AI Insight */}
          <div className="bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                AI Insight
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Perfect conditions for freshwater fishing! High humidity and moderate temperature make fish more active. Best spots are near vegetation.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Location Recommendations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-500" />
            Recommended Spots
          </h4>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Near You
          </span>
        </div>

        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden rounded-2xl"
          >
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-cyan-500/20 backdrop-blur-xl" />
            <div className="absolute inset-0 bg-white/10 dark:bg-black/10" />
            <div className="absolute inset-0 border border-white/20 dark:border-gray-700/20 rounded-2xl" />
            
            <div className="relative z-10 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <h5 className="font-semibold text-gray-900 dark:text-white">
                      {rec.location}
                    </h5>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {rec.bestTime}
                    </span>
                    <span>{rec.distance}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${rec.probability >= 90 ? 'text-green-500' : rec.probability >= 75 ? 'text-yellow-500' : 'text-orange-500'}`}>
                    {rec.probability}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Success Rate
                  </div>
                </div>
              </div>

              {/* Fish Species */}
              <div className="flex flex-wrap gap-2 mb-3">
                {rec.species.map((species, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-700 dark:text-emerald-300 rounded-lg border border-emerald-500/20"
                  >
                    {species}
                  </span>
                ))}
              </div>

              {/* Tips */}
              <div className="space-y-1">
                {rec.tips.map((tip, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" />
                    {tip}
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <Fish className="w-4 h-4" />
                Get Directions
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SmartFishingDashboard;
