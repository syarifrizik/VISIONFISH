
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Droplets, Wind } from 'lucide-react';
import { HourlyForecast as HourlyForecastType } from '@/utils/weather';

interface HourlyForecastProps {
  forecast: HourlyForecastType[];
}

export const HourlyForecast = ({ forecast }: HourlyForecastProps) => {
  const getTemperatureColor = (temp: number) => {
    if (temp < 20) return 'from-blue-500 to-cyan-500';
    if (temp < 30) return 'from-green-500 to-emerald-500';
    if (temp < 35) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-red-600';
  };

  const getHourColor = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 6 && hour < 12) return 'from-yellow-400 to-orange-400'; // Morning
    if (hour >= 12 && hour < 18) return 'from-orange-400 to-red-400'; // Afternoon
    if (hour >= 18 && hour < 20) return 'from-purple-400 to-pink-400'; // Evening
    return 'from-blue-400 to-purple-400'; // Night
  };

  if (!forecast || forecast.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Prakiraan Per Jam</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Tidak ada data prakiraan tersedia</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Prakiraan Per Jam (24 Jam)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="flex space-x-3 sm:space-x-4 pb-4 snap-x snap-mandatory">
            {forecast.map((item, index) => (
              <motion.div
                key={`${item.time}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-24 sm:w-32 snap-start"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all duration-200 min-h-[180px] flex flex-col justify-between">
                  {/* Time */}
                  <div className="text-center mb-2 sm:mb-3">
                    <Badge className={`bg-gradient-to-r ${getHourColor(item.time)} text-white border-0 text-xs px-2 py-1`}>
                      {item.time}
                    </Badge>
                    {item.date && (
                      <p className="text-xs text-muted-foreground mt-1 hidden sm:block">{item.date}</p>
                    )}
                  </div>

                  {/* Weather Icon */}
                  <div className="flex justify-center mb-2 sm:mb-3">
                    <div className="p-2 bg-white/5 rounded-xl">
                      <img 
                        src={item.icon} 
                        alt={item.condition}
                        className="h-7 w-7 sm:h-9 sm:w-9 object-contain"
                      />
                    </div>
                  </div>

                  {/* Temperature */}
                  <div className="text-center mb-2 sm:mb-3">
                    <span className={`text-lg sm:text-xl font-bold bg-gradient-to-r ${getTemperatureColor(item.temperature)} bg-clip-text text-transparent`}>
                      {item.temperature}°
                    </span>
                  </div>

                  {/* Condition - Mobile: Show icon only, Desktop: Show text */}
                  <div className="text-center mb-2 sm:mb-3 flex-1">
                    <p className="text-xs text-muted-foreground text-center leading-tight hidden sm:block">
                      {item.condition}
                    </p>
                  </div>

                  {/* Additional Info - Only show on desktop */}
                  <div className="space-y-2 hidden sm:block mt-auto">
                    {item.humidity && (
                      <div className="flex items-center justify-center space-x-1">
                        <Droplets className="h-3 w-3 text-blue-400" />
                        <span className="text-xs text-muted-foreground">{item.humidity}%</span>
                      </div>
                    )}
                    {item.windSpeed && (
                      <div className="flex items-center justify-center space-x-1">
                        <Wind className="h-3 w-3 text-cyan-400" />
                        <span className="text-xs text-muted-foreground">{item.windSpeed} m/s</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
