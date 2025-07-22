
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, TrendingDown, Droplets, Wind } from 'lucide-react';
import { DailyForecast } from '@/utils/weather';

interface DailyForecastSectionProps {
  forecast: DailyForecast[];
}

export const DailyForecastSection = ({ forecast }: DailyForecastSectionProps) => {
  if (!forecast || forecast.length === 0) {
    return null;
  }

  return (
    <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Prakiraan 5 Hari Mendatang
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {forecast.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between p-4 rounded-xl backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="text-center min-w-[80px]">
                  <div className="font-semibold text-sm">{day.day}</div>
                  <div className="text-xs text-muted-foreground">{day.date}</div>
                </div>
                
                <img 
                  src={day.icon} 
                  alt={day.condition}
                  className="w-12 h-12"
                />
                
                <div className="flex-1">
                  <div className="font-medium text-sm mb-1">{day.condition}</div>
                  <div className="text-xs text-muted-foreground">
                    Kelembaban {day.humidity}% • Angin {day.windSpeed} km/h
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center min-w-[60px]">
                  <div className="flex items-center gap-1 text-sm">
                    <Droplets className="w-3 h-3 text-blue-500" />
                    <span>{day.rainChance}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Hujan</div>
                </div>
                
                <div className="text-right min-w-[100px]">
                  <div className="flex items-center justify-end gap-2 mb-1">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-red-500" />
                      <span className="font-semibold text-red-600">{day.highTemp}°</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingDown className="w-3 h-3 text-blue-500" />
                      <span className="font-medium text-blue-600">{day.lowTemp}°</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">Max / Min</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
