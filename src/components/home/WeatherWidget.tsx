
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cloud, Sun, CloudRain, Wind, MapPin, Thermometer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { fetchWeatherData } from "@/utils/weather";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  icon: string;
}

const WeatherWidget = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchUserWeather = async () => {
      try {
        // Try to get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const { latitude, longitude } = position.coords;
                const data = await fetchWeatherData("", latitude, longitude);
                setWeatherData(data);
                setLocationPermission(true);
              } catch (error) {
                console.error("Error fetching weather data:", error);
                setFallbackWeather();
              } finally {
                setLoading(false);
              }
            },
            (error) => {
              console.log("Location access denied:", error);
              setLocationPermission(false);
              setFallbackWeather();
              setLoading(false);
            }
          );
        } else {
          console.log("Geolocation not supported");
          setLocationPermission(false);
          setFallbackWeather();
          setLoading(false);
        }
      } catch (error) {
        console.error("Error in weather fetch:", error);
        setFallbackWeather();
        setLoading(false);
      }
    };

    const setFallbackWeather = () => {
      // Fallback weather data when location is not available
      setWeatherData({
        location: "Lokasi Tidak Tersedia",
        temperature: 26,
        condition: "Cuaca Tidak Tersedia",
        humidity: 80,
        windSpeed: 2.5,
        pressure: 1010,
        icon: ""
      });
    };

    fetchUserWeather();
  }, []);

  const getWeatherIcon = (condition: string, isNight: boolean = false) => {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('cerah') || lowerCondition.includes('clear')) {
      return isNight ? <Wind className="h-8 w-8" /> : <Sun className="h-8 w-8" />;
    } else if (lowerCondition.includes('hujan') || lowerCondition.includes('rain')) {
      return <CloudRain className="h-8 w-8" />;
    } else if (lowerCondition.includes('berawan') || lowerCondition.includes('cloud')) {
      return <Cloud className="h-8 w-8" />;
    } else {
      return isNight ? <Wind className="h-8 w-8" /> : <Sun className="h-8 w-8" />;
    }
  };

  const getTimeGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return "Selamat Pagi";
    if (hour >= 12 && hour < 15) return "Selamat Siang";
    if (hour >= 15 && hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  const getRecommendation = () => {
    if (!weatherData) return "Memuat rekomendasi cuaca...";
    
    const condition = weatherData.condition.toLowerCase();
    if (condition.includes('cerah') || condition.includes('clear')) {
      return "Cuaca bagus untuk melaut! 🎣";
    } else if (condition.includes('hujan') || condition.includes('rain')) {
      return "Hindari melaut, cuaca kurang baik ⛈️";
    } else {
      return "Cuaca cukup baik untuk aktivitas ringan 🌤️";
    }
  };

  const isNightTime = () => {
    const hour = currentTime.getHours();
    return hour < 6 || hour >= 18;
  };

  const handleWeatherClick = () => {
    navigate('/weather');
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Card className={cn(
          "p-4 md:p-5 transition-all duration-300 hover:shadow-lg cursor-pointer",
          theme === 'light' 
            ? 'bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200/50 hover:border-blue-300/60' 
            : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50'
        )}>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded mb-4"></div>
            <div className="h-16 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
    >
      <Card 
        className={cn(
          "p-4 md:p-5 transition-all duration-300 hover:shadow-lg cursor-pointer",
          theme === 'light' 
            ? 'bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200/50 hover:border-blue-300/60' 
            : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50'
        )}
        onClick={handleWeatherClick}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className={cn(
              "h-4 w-4",
              theme === 'light' ? 'text-blue-600' : 'text-blue-400'
            )} />
            <h3 className={cn(
              "text-sm font-medium",
              theme === 'light' ? 'text-slate-700' : 'text-white'
            )}>
              Cuaca Saat Ini
            </h3>
          </div>
          <div className={cn(
            "text-xs",
            theme === 'light' ? 'text-slate-500' : 'text-gray-400'
          )}>
            {currentTime.toLocaleTimeString('id-ID', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-full",
              theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-blue-900/50 text-blue-400'
            )}>
              {getWeatherIcon(weatherData?.condition || "", isNightTime())}
            </div>
            <div>
              <div className={cn(
                "text-2xl font-bold",
                theme === 'light' ? 'text-slate-900' : 'text-white'
              )}>
                {weatherData ? `${weatherData.temperature}°C` : "--°C"}
              </div>
              <div className={cn(
                "text-sm",
                theme === 'light' ? 'text-slate-600' : 'text-gray-300'
              )}>
                {weatherData?.condition || "Memuat..."}
              </div>
            </div>
          </div>
          <div className={cn(
            "p-2 rounded-lg",
            theme === 'light' ? 'bg-white/60' : 'bg-gray-800/50'
          )}>
            <Thermometer className={cn(
              "h-6 w-6",
              theme === 'light' ? 'text-blue-600' : 'text-blue-400'
            )} />
          </div>
        </div>

        <div className={cn(
          "text-xs mb-2",
          theme === 'light' ? 'text-slate-500' : 'text-gray-400'
        )}>
          📍 {locationPermission ? weatherData?.location : getTimeGreeting()}
        </div>

        <div className={cn(
          "text-sm p-2 rounded-lg",
          theme === 'light' 
            ? 'bg-blue-100/60 text-blue-800 border border-blue-200/50' 
            : 'bg-blue-900/30 text-blue-200 border border-blue-800/50'
        )}>
          💡 {getRecommendation()}
        </div>
      </Card>
    </motion.div>
  );
};

export default WeatherWidget;
