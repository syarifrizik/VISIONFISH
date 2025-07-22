
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Clock, Thermometer, Droplets, Wind } from 'lucide-react';
import { HourlyForecast } from '@/utils/weather';

interface HourlyForecastSectionProps {
  forecast: HourlyForecast[];
}

export const HourlyForecastSection = ({ forecast }: HourlyForecastSectionProps) => {
  if (!forecast || forecast.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Prakiraan Per Jam (24 Jam)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="flex gap-4 pb-4 min-w-max">
              {forecast.map((hour, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex-shrink-0 w-32 p-4 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 text-center border border-white/20"
                >
                  <div className="font-semibold text-sm mb-2 text-blue-600 dark:text-purple-400">
                    {hour.time}
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    {hour.date}
                  </div>
                  
                  <img 
                    src={hour.icon} 
                    alt={hour.condition}
                    className="w-12 h-12 mx-auto mb-3"
                  />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-1">
                      <Thermometer className="w-3 h-3 text-orange-500" />
                      <span className="text-sm font-medium">{hour.temperature}°</span>
                    </div>
                    
                    {hour.humidity && (
                      <div className="flex items-center justify-center gap-1">
                        <Droplets className="w-3 h-3 text-blue-500" />
                        <span className="text-xs">{hour.humidity}%</span>
                      </div>
                    )}
                    
                    {hour.windSpeed && (
                      <div className="flex items-center justify-center gap-1">
                        <Wind className="w-3 h-3 text-gray-500" />
                        <span className="text-xs">{hour.windSpeed}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {hour.condition}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
