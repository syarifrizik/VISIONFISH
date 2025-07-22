
import { EnhancedWeatherData } from './enhanced-weather';

export const convertToEnhancedWeatherData = (weatherData: any): EnhancedWeatherData => {
  return {
    location: weatherData.location || 'Unknown Location',
    temperature: weatherData.temperature || 0,
    condition: weatherData.condition || 'Unknown',
    humidity: weatherData.humidity || 0,
    windSpeed: weatherData.windSpeed || 0,
    pressure: weatherData.pressure || 1013,
    visibility: weatherData.visibility || 10,
    uvIndex: weatherData.uvIndex || 0,
    dewPoint: weatherData.dewPoint || weatherData.temperature - 5,
    feelsLike: weatherData.feelsLike || weatherData.temperature,
    timestamp: weatherData.timestamp ? new Date(weatherData.timestamp) : new Date()
  };
};
