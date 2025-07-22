import { motion } from 'framer-motion';
import { Thermometer, Droplets, Wind, Gauge, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WeatherData } from '@/utils/weather';

interface CurrentWeatherProps {
  weather: WeatherData | null;
}

export const CurrentWeather = ({ weather }: CurrentWeatherProps) => {
  if (!weather) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded-lg mb-4"></div>
            <div className="h-16 bg-white/20 rounded-lg mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-white/20 rounded-lg"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getConditionColor = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('rain') || cond.includes('hujan')) return 'from-blue-500 to-blue-600';
    if (cond.includes('cloud') || cond.includes('berawan')) return 'from-gray-500 to-gray-600';
    if (cond.includes('sun') || cond.includes('cerah')) return 'from-yellow-500 to-orange-500';
    return 'from-blue-500 to-purple-500';
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 20) return 'from-blue-500 to-cyan-500';
    if (temp < 30) return 'from-green-500 to-emerald-500';
    if (temp < 35) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-red-600';
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const weatherStats = [
    {
      label: 'Kelembaban',
      value: `${weather.humidity}%`,
      icon: Droplets,
      color: 'from-blue-400 to-blue-500'
    },
    {
      label: 'Kecepatan Angin',
      value: `${weather.windSpeed} m/s`,
      icon: Wind,
      color: 'from-cyan-400 to-cyan-500'
    },
    {
      label: 'Tekanan',
      value: `${weather.pressure} hPa`,
      icon: Gauge,
      color: 'from-purple-400 to-purple-500'
    },
    {
      label: 'Diperbarui',
      value: formatTime(),
      icon: Clock,
      color: 'from-gray-400 to-gray-500'
    }
  ];

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
      <CardContent className="p-0">
        {/* Main Weather Display */}
        <div className="relative p-8 pb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full lg:w-auto">
              {/* Weather Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
                <div className="relative p-3 sm:p-4 bg-white/10 rounded-full">
                  <img 
                    src={weather.icon} 
                    alt={weather.condition}
                    className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
                  />
                </div>
              </div>
              
              {/* Temperature and Condition */}
              <div className="text-center sm:text-left">
                <div className="flex items-baseline justify-center sm:justify-start space-x-2">
                  <span className={`text-4xl sm:text-6xl font-bold bg-gradient-to-r ${getTemperatureColor(weather.temperature)} bg-clip-text text-transparent`}>
                    {weather.temperature}
                  </span>
                  <span className="text-xl sm:text-2xl text-muted-foreground">°C</span>
                </div>
                
                <div className="flex items-center justify-center sm:justify-start space-x-2 mt-2">
                  <Badge className={`bg-gradient-to-r ${getConditionColor(weather.condition)} text-white border-0 text-xs sm:text-sm`}>
                    {weather.condition}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Location */}
            <div className="text-center lg:text-right w-full lg:w-auto">
              <p className="text-sm text-muted-foreground">Lokasi</p>
              <p className="text-base sm:text-lg font-semibold text-foreground line-clamp-1">
                {weather.location}
              </p>
            </div>
          </div>
        </div>

        {/* Weather Stats Grid */}
        <div className="border-t border-white/10 bg-white/5">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {weatherStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 sm:p-4 border-r border-white/10 last:border-r-0 even:border-r-0 lg:even:border-r lg:last:border-r-0"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}/20`}>
                    <stat.icon className={`h-4 w-4 text-white`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground line-clamp-1">{stat.label}</p>
                    <p className="text-sm font-semibold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};