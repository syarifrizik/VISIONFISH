
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Thermometer, Droplets, Wind } from 'lucide-react';
import { HourlyForecast, DailyForecast } from '@/utils/weather';

interface ModernForecastCardProps {
  forecast: HourlyForecast | DailyForecast;
  type: 'hourly' | 'daily';
  index: number;
}

export const ModernForecastCard = ({ forecast, type, index }: ModernForecastCardProps) => {
  const isDaily = type === 'daily';
  const dailyForecast = forecast as DailyForecast;
  const hourlyForecast = forecast as HourlyForecast;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="flex-shrink-0"
    >
      <Card className="w-32 md:w-36 backdrop-blur-md bg-white/20 dark:bg-gray-800/20 border-white/30 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300">
        <CardContent className="p-4 text-center">
          <div className="space-y-3">
            {/* Time/Day */}
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              {isDaily ? dailyForecast?.day : hourlyForecast?.time}
            </div>
            {isDaily && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {dailyForecast?.date}
              </div>
            )}
            
            {/* Weather Icon */}
            <div className="flex justify-center">
              <img 
                src={forecast.icon} 
                alt={forecast.condition}
                className="w-12 h-12 drop-shadow-lg"
              />
            </div>
            
            {/* Temperature */}
            <div className="space-y-1">
              {isDaily ? (
                <div className="flex justify-between items-center px-1">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {dailyForecast?.highTemp}°
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {dailyForecast?.lowTemp}°
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1">
                  <Thermometer className="w-3 h-3 text-orange-500" />
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {hourlyForecast?.temperature}°
                  </span>
                </div>
              )}
            </div>
            
            {/* Additional Info */}
            <div className="space-y-1">
              {(isDaily ? dailyForecast?.humidity : hourlyForecast?.humidity) && (
                <div className="flex items-center justify-center gap-1">
                  <Droplets className="w-3 h-3 text-blue-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    {isDaily ? dailyForecast?.humidity : hourlyForecast?.humidity}%
                  </span>
                </div>
              )}
              
              {(isDaily ? dailyForecast?.windSpeed : hourlyForecast?.windSpeed) && (
                <div className="flex items-center justify-center gap-1">
                  <Wind className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    {isDaily ? `${dailyForecast?.windSpeed}` : hourlyForecast?.windSpeed}
                  </span>
                </div>
              )}
            </div>
            
            {/* Condition */}
            <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-tight">
              {forecast.condition}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
