import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Droplets, Wind, CloudRain } from 'lucide-react';
import { DailyForecast as DailyForecastType } from '@/utils/weather';

interface DailyForecastProps {
  forecast: DailyForecastType[];
}

export const DailyForecast = ({ forecast }: DailyForecastProps) => {
  const getTemperatureColor = (temp: number) => {
    if (temp < 20) return 'from-blue-500 to-cyan-500';
    if (temp < 30) return 'from-green-500 to-emerald-500';
    if (temp < 35) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-red-600';
  };

  const getRainChanceColor = (chance: number) => {
    if (chance < 30) return 'from-green-500 to-green-600';
    if (chance < 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const isToday = (date: string) => {
    const today = new Date().toLocaleDateString('id-ID');
    return date === today;
  };

  const isTomorrow = (date: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date === tomorrow.toLocaleDateString('id-ID');
  };

  const formatDay = (day: string, date: string) => {
    if (isToday(date)) return 'Hari Ini';
    if (isTomorrow(date)) return 'Besok';
    return day;
  };

  if (!forecast || forecast.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Prakiraan 7 Hari</span>
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
          <Calendar className="h-5 w-5" />
          <span>Prakiraan 7 Hari</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {forecast.map((item, index) => (
            <motion.div
              key={`${item.date}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all duration-200 min-h-[120px] flex flex-col justify-between"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                {/* Day and Date */}
                <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                  <div className="min-w-[80px] sm:min-w-[90px]">
                    <p className="font-semibold text-foreground text-sm sm:text-base">
                      {formatDay(item.day, item.date)}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{item.date}</p>
                  </div>
                  
                  {/* Weather Icon */}
                  <div className="p-2 bg-white/5 rounded-xl">
                    <img 
                      src={item.icon} 
                      alt={item.condition}
                      className="h-7 w-7 sm:h-9 sm:w-9 object-contain"
                    />
                  </div>
                  
                  {/* Condition */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground line-clamp-1">{item.condition}</p>
                  </div>
                </div>

                {/* Temperature Range */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg sm:text-xl font-bold bg-gradient-to-r ${getTemperatureColor(item.highTemp)} bg-clip-text text-transparent`}>
                      {item.highTemp}°
                    </span>
                    <span className="text-muted-foreground text-sm">/</span>
                    <span className={`text-lg sm:text-xl font-bold bg-gradient-to-r ${getTemperatureColor(item.lowTemp)} bg-clip-text text-transparent`}>
                      {item.lowTemp}°
                    </span>
                  </div>

                  {/* Rain Chance - Mobile only */}
                  <div className="flex items-center space-x-1 sm:hidden">
                    <CloudRain className="h-3 w-3 text-blue-400" />
                    <span className="text-xs text-muted-foreground">{item.rainChance}%</span>
                  </div>
                </div>
              </div>

              {/* Additional Info - Show more details on desktop */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-4">
                  {/* Humidity */}
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Droplets className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                    <span className="text-xs sm:text-sm text-muted-foreground">{item.humidity}%</span>
                  </div>
                  
                  {/* Wind Speed */}
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Wind className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
                    <span className="text-xs sm:text-sm text-muted-foreground">{item.windSpeed} m/s</span>
                  </div>
                </div>

                {/* Rain Chance - Desktop only */}
                <div className="hidden sm:flex items-center space-x-2">
                  <CloudRain className="h-4 w-4 text-blue-400" />
                  <Badge className={`bg-gradient-to-r ${getRainChanceColor(item.rainChance)} text-white border-0 text-xs`}>
                    {item.rainChance}% hujan
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};