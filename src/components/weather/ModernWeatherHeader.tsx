
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  MapPin, 
  RefreshCw,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EnhancedWeatherData } from '@/utils/enhanced-weather';

interface ModernWeatherHeaderProps {
  weatherData: EnhancedWeatherData;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const ModernWeatherHeader = ({
  weatherData,
  onRefresh,
  isRefreshing
}: ModernWeatherHeaderProps) => {
  const getConditionGradient = () => {
    const condition = weatherData.condition.toLowerCase();
    if (condition.includes('cerah') || condition.includes('clear')) {
      return 'from-yellow-400 via-orange-400 to-red-400';
    } else if (condition.includes('berawan') || condition.includes('cloud')) {
      return 'from-gray-400 to-gray-600';
    } else if (condition.includes('hujan') || condition.includes('rain')) {
      return 'from-blue-500 to-indigo-600';
    }
    return 'from-blue-400 to-blue-600';
  };

  return (
    <div className="relative overflow-hidden rounded-3xl backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border border-white/40 p-6 md:p-8">
      {/* Background Gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-10",
        getConditionGradient()
      )} />
      
      <div className="relative">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-purple-500 dark:to-pink-500 flex items-center justify-center shadow-lg"
            >
              <Cloud className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                VisionFish Weather
              </h1>
              <Badge variant="secondary" className="mt-1 bg-white/20 text-gray-700 dark:text-gray-300">
                <Zap className="w-3 h-3 mr-1" />
                AI Intelligence
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Location & Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {weatherData.location}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  day: 'numeric',
                  month: 'long'
                })}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="backdrop-blur-sm bg-white/50 dark:bg-gray-700/50 border-white/30 hover:bg-white/70 dark:hover:bg-gray-700/70"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
