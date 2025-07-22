import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, TrendingUp, TrendingDown, Cloud, Sun, CloudRain } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExtendedForecastProps {
  className?: string;
}

export const ExtendedForecast = ({ className }: ExtendedForecastProps) => {
  // Mock data for 14-day forecast
  const extendedForecast = [
    { date: '2024-01-01', day: 'Senin', highTemp: 32, lowTemp: 24, condition: 'Cerah', icon: Sun, rainChance: 10 },
    { date: '2024-01-02', day: 'Selasa', highTemp: 30, lowTemp: 23, condition: 'Berawan', icon: Cloud, rainChance: 20 },
    { date: '2024-01-03', day: 'Rabu', highTemp: 28, lowTemp: 22, condition: 'Hujan', icon: CloudRain, rainChance: 80 },
    { date: '2024-01-04', day: 'Kamis', highTemp: 29, lowTemp: 21, condition: 'Berawan', icon: Cloud, rainChance: 40 },
    { date: '2024-01-05', day: 'Jumat', highTemp: 31, lowTemp: 23, condition: 'Cerah', icon: Sun, rainChance: 5 },
    { date: '2024-01-06', day: 'Sabtu', highTemp: 33, lowTemp: 25, condition: 'Cerah', icon: Sun, rainChance: 15 },
    { date: '2024-01-07', day: 'Minggu', highTemp: 30, lowTemp: 24, condition: 'Berawan', icon: Cloud, rainChance: 30 },
    { date: '2024-01-08', day: 'Senin', highTemp: 27, lowTemp: 21, condition: 'Hujan', icon: CloudRain, rainChance: 75 },
    { date: '2024-01-09', day: 'Selasa', highTemp: 28, lowTemp: 22, condition: 'Berawan', icon: Cloud, rainChance: 45 },
    { date: '2024-01-10', day: 'Rabu', highTemp: 30, lowTemp: 23, condition: 'Cerah', icon: Sun, rainChance: 20 },
    { date: '2024-01-11', day: 'Kamis', highTemp: 32, lowTemp: 24, condition: 'Cerah', icon: Sun, rainChance: 10 },
    { date: '2024-01-12', day: 'Jumat', highTemp: 29, lowTemp: 22, condition: 'Berawan', icon: Cloud, rainChance: 35 },
    { date: '2024-01-13', day: 'Sabtu', highTemp: 31, lowTemp: 23, condition: 'Cerah', icon: Sun, rainChance: 15 },
    { date: '2024-01-14', day: 'Minggu', highTemp: 28, lowTemp: 21, condition: 'Hujan', icon: CloudRain, rainChance: 70 },
  ];

  const getTemperatureColor = (temp: number) => {
    if (temp < 20) return 'from-blue-500 to-cyan-500';
    if (temp < 30) return 'from-green-500 to-emerald-500';
    if (temp < 35) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-red-600';
  };

  const getRainChanceColor = (chance: number) => {
    if (chance < 30) return 'from-green-500 to-green-600';
    if (chance < 60) return 'from-yellow-500 to-yellow-600';
    return 'from-blue-500 to-blue-600';
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'cerah': return 'from-yellow-400 to-orange-400';
      case 'berawan': return 'from-gray-400 to-gray-500';
      case 'hujan': return 'from-blue-400 to-blue-600';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <Card className={`bg-white/10 backdrop-blur-sm border-white/20 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CalendarDays className="h-5 w-5" />
          <span>Prakiraan 14 Hari</span>
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
            Premium
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {extendedForecast.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                {/* Date and Day */}
                <div className="flex items-center space-x-4">
                  <div className="min-w-[100px]">
                    <p className="font-semibold text-foreground">{day.day}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(day.date).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </p>
                  </div>
                  
                  {/* Weather Icon */}
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${getConditionColor(day.condition)}/20 rounded-full blur-lg`}></div>
                    <div className={`relative p-3 bg-gradient-to-r ${getConditionColor(day.condition)}/10 rounded-full`}>
                      <day.icon className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                  
                  {/* Condition */}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{day.condition}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getRainChanceColor(day.rainChance)}`}></div>
                      <span className="text-xs text-muted-foreground">{day.rainChance}% hujan</span>
                    </div>
                  </div>
                </div>

                {/* Temperature */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg font-bold bg-gradient-to-r ${getTemperatureColor(day.highTemp)} bg-clip-text text-transparent`}>
                      {day.highTemp}°
                    </span>
                    <span className="text-muted-foreground">/</span>
                    <span className={`text-lg font-bold bg-gradient-to-r ${getTemperatureColor(day.lowTemp)} bg-clip-text text-transparent`}>
                      {day.lowTemp}°
                    </span>
                  </div>
                  
                  {/* Temperature Trend */}
                  <div className="flex items-center">
                    {index > 0 && (
                      <>
                        {day.highTemp > extendedForecast[index - 1].highTemp ? (
                          <TrendingUp className="h-4 w-4 text-red-400" />
                        ) : day.highTemp < extendedForecast[index - 1].highTemp ? (
                          <TrendingDown className="h-4 w-4 text-blue-400" />
                        ) : (
                          <div className="w-4 h-4 flex items-center justify-center">
                            <div className="w-2 h-0.5 bg-gray-400 rounded"></div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Extended Forecast Info */}
        <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-foreground">Akurasi Prakiraan</h4>
              <p className="text-sm text-muted-foreground">
                Prakiraan 7 hari pertama: 85-90% akurat
              </p>
              <p className="text-sm text-muted-foreground">
                Prakiraan 8-14 hari: 70-75% akurat
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">Diperbarui</p>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleTimeString('id-ID', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};