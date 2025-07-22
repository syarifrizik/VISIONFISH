
import { supabase } from "@/integrations/supabase/client";

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  icon: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity?: number;
  windSpeed?: number;
  date?: string;
}

export interface DailyForecast {
  day: string;
  date: string;
  highTemp: number;
  lowTemp: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  sunriseTime?: string;
  sunsetTime?: string;
}

// Secure weather API calls via Edge Functions
export async function fetchWeatherData(
  location: string = "", 
  lat?: number, 
  lon?: number
): Promise<WeatherData> {
  try {
    console.log('Calling secure weather API via Edge Function');
    
    const { data, error } = await supabase.functions.invoke('weather-api', {
      body: {
        location,
        lat,
        lon,
        type: 'current'
      }
    });
    
    if (error) {
      console.error('Edge Function Error:', error);
      throw error;
    }
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return {
      location: data.name,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      pressure: data.main.pressure,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

export async function fetchForecastData(
  location: string = "",
  lat?: number,
  lon?: number
): Promise<HourlyForecast[]> {
  try {
    console.log('Calling secure forecast API via Edge Function');
    
    const { data, error } = await supabase.functions.invoke('weather-api', {
      body: {
        location,
        lat,
        lon,
        type: 'forecast'
      }
    });
    
    if (error) {
      console.error('Edge Function Error:', error);
      throw error;
    }
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    // Process the first 24 hours (8 entries, 3-hour intervals)
    return data.list.slice(0, 8).map((item: any) => {
      const date = new Date(item.dt * 1000);
      return {
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: date.toLocaleDateString('id-ID', { weekday: 'short' }),
        temperature: Math.round(item.main.temp),
        condition: item.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed
      };
    });
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    throw error;
  }
}

export async function fetchDailyForecast(
  location: string = "",
  lat?: number,
  lon?: number
): Promise<DailyForecast[]> {
  try {
    console.log('Calling secure daily forecast API via Edge Function');
    
    const { data, error } = await supabase.functions.invoke('weather-api', {
      body: {
        location,
        lat,
        lon,
        type: 'daily'
      }
    });
    
    if (error) {
      console.error('Edge Function Error:', error);
      throw error;
    }
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    // Group by day and process daily forecasts
    const dailyData: { [key: string]: any[] } = {};
    
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('id-ID', { weekday: 'long' });
      const dateStr = date.toLocaleDateString('id-ID');
      
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = [];
      }
      
      dailyData[dateStr].push(item);
    });
    
    // Process grouped data
    return Object.keys(dailyData).map(dateStr => {
      const items = dailyData[dateStr];
      const temps = items.map(item => Math.round(item.main.temp));
      const date = new Date(items[0].dt * 1000);
      
      // Use most frequent condition for the day
      const conditions: { [key: string]: number } = {};
      let maxCount = 0;
      let mostFrequentCondition = items[0].weather[0].description;
      let mostFrequentIcon = items[0].weather[0].icon;
      
      items.forEach(item => {
        const cond = item.weather[0].description;
        if (!conditions[cond]) conditions[cond] = 0;
        conditions[cond]++;
        
        if (conditions[cond] > maxCount) {
          maxCount = conditions[cond];
          mostFrequentCondition = cond;
          mostFrequentIcon = item.weather[0].icon;
        }
      });
      
      // Calculate average values
      const avgHumidity = Math.round(items.reduce((sum, item) => sum + item.main.humidity, 0) / items.length);
      const avgWindSpeed = Math.round((items.reduce((sum, item) => sum + item.wind.speed, 0) / items.length) * 10) / 10;
      
      // Rain probability
      const rainItems = items.filter(item => item.weather[0].main.toLowerCase().includes('rain'));
      const rainChance = Math.round((rainItems.length / items.length) * 100);
      
      return {
        day: date.toLocaleDateString('id-ID', { weekday: 'long' }),
        date: dateStr,
        highTemp: Math.max(...temps),
        lowTemp: Math.min(...temps),
        condition: mostFrequentCondition,
        icon: `https://openweathermap.org/img/wn/${mostFrequentIcon}.png`,
        humidity: avgHumidity,
        windSpeed: avgWindSpeed,
        rainChance
      };
    }).slice(0, 5); // Limit to 5 days
  } catch (error) {
    console.error("Error fetching daily forecast:", error);
    throw error;
  }
}

export function calculateFishingScore(weatherData: WeatherData): number {
  let score = 5;
  
  // Temperature: ideal range 20-30°C
  if (weatherData.temperature < 15 || weatherData.temperature > 35) score -= 2;
  else if (weatherData.temperature < 20 || weatherData.temperature > 30) score -= 1;
  
  // Humidity: high humidity (>80%) is not ideal
  if (weatherData.humidity > 80) score -= 1;
  
  // Wind: strong winds (>15 km/h) make fishing difficult
  if (weatherData.windSpeed > 20) score -= 2;
  else if (weatherData.windSpeed > 15) score -= 1;
  
  // Pressure: sudden changes or extreme values are not good
  if (weatherData.pressure < 1000 || weatherData.pressure > 1020) score -= 1;
  
  // Rain/snow conditions
  const condition = weatherData.condition.toLowerCase();
  if (condition.includes("rain") || condition.includes("hujan")) score -= 1;
  if (condition.includes("storm") || condition.includes("badai") || condition.includes("thunder") || condition.includes("petir")) score -= 2;
  
  return Math.max(0, Math.min(5, score));
}

export function getFishingScoreDescription(score: number): string {
  switch (score) {
    case 5:
      return "Kondisi Memancing Sempurna!";
    case 4:
      return "Kondisi Memancing Sangat Baik";
    case 3:
      return "Kondisi Memancing Baik";
    case 2:
      return "Kondisi Memancing Cukup";
    case 1:
      return "Kondisi Memancing Kurang Baik";
    case 0:
      return "Kondisi Memancing Tidak Menguntungkan";
    default:
      return "Kondisi Memancing Tidak Pasti";
  }
}
