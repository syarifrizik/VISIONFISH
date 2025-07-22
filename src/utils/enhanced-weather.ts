import { supabase } from "@/integrations/supabase/client";

export interface EnhancedWeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  dewPoint: number;
  feelsLike: number;
  timestamp: Date;
}

export interface FishingConditions {
  overallScore: number;
  category: string;
  advice: string;
  factors: {
    temperature: { score: number; description: string };
    pressure: { score: number; description: string };
    wind: { score: number; description: string };
    humidity: { score: number; description: string };
    visibility: { score: number; description: string };
    uvIndex: { score: number; description: string };
    timeOfDay: { score: number; description: string };
    weatherStability: { score: number; description: string };
  };
  recommendations: string[];
  bestTimeSlots: string[];
  speciesRecommendations: string[];
}

// Add the missing function that was referenced
export function calculateEnhancedFishingScore(weatherData: EnhancedWeatherData): FishingConditions {
  const tempScore = weatherData.temperature >= 20 && weatherData.temperature <= 30 ? 8 : 
                   weatherData.temperature >= 15 && weatherData.temperature <= 35 ? 6 : 4;
  
  const pressureScore = weatherData.pressure >= 1010 && weatherData.pressure <= 1020 ? 8 :
                       weatherData.pressure >= 1000 && weatherData.pressure <= 1030 ? 6 : 4;
  
  const windScore = weatherData.windSpeed <= 15 ? 8 :
                   weatherData.windSpeed <= 25 ? 6 : 4;
  
  const humidityScore = weatherData.humidity >= 40 && weatherData.humidity <= 70 ? 8 :
                       weatherData.humidity >= 30 && weatherData.humidity <= 80 ? 6 : 4;
  
  const visibilityScore = weatherData.visibility >= 10 ? 8 :
                         weatherData.visibility >= 5 ? 6 : 4;
  
  const uvScore = weatherData.uvIndex <= 6 ? 8 :
                 weatherData.uvIndex <= 8 ? 6 : 4;

  // Add time of day scoring
  const currentHour = new Date().getHours();
  const timeOfDayScore = (currentHour >= 5 && currentHour <= 8) || (currentHour >= 17 && currentHour <= 20) ? 8 : 
                        (currentHour >= 4 && currentHour <= 10) || (currentHour >= 16 && currentHour <= 21) ? 6 : 4;

  // Add weather stability scoring
  const condition = weatherData.condition.toLowerCase();
  const weatherStabilityScore = condition.includes('clear') || condition.includes('cerah') ? 8 :
                               condition.includes('partly') || condition.includes('berawan') ? 6 : 4;
  
  const overallScore = Math.round(
    (tempScore + pressureScore + windScore + humidityScore + visibilityScore + uvScore + timeOfDayScore + weatherStabilityScore) / 8
  );
  
  const category = overallScore >= 7 ? 'Baik' : overallScore >= 5 ? 'Sedang' : 'Buruk';

  // Generate advice based on overall score
  const advice = overallScore >= 8 ? 
    "Kondisi sangat ideal untuk memancing! Semua parameter mendukung aktivitas perikanan yang optimal." :
    overallScore >= 6 ? 
    "Kondisi baik untuk memancing. Beberapa parameter mendukung aktivitas perikanan yang produktif." :
    overallScore >= 4 ?
    "Kondisi cukup untuk memancing. Perhatikan faktor-faktor yang kurang mendukung." :
    "Kondisi kurang ideal untuk memancing. Pertimbangkan untuk menunda atau pilih lokasi yang lebih baik.";

  // Generate time slots and species recommendations
  const bestTimeSlots = overallScore >= 7 ? 
    ['05:00-08:00 (Pagi)', '17:00-20:00 (Sore)'] : 
    ['06:00-07:00 (Pagi)', '18:00-19:00 (Sore)'];

  const speciesRecommendations = overallScore >= 7 ? 
    ['Nila', 'Lele', 'Gurame', 'Mas'] : 
    overallScore >= 5 ? ['Nila', 'Lele'] : ['Lele'];
  
  return {
    overallScore,
    category,
    advice,
    factors: {
      temperature: { score: tempScore, description: `${weatherData.temperature}°C` },
      pressure: { score: pressureScore, description: `${weatherData.pressure} hPa` },
      wind: { score: windScore, description: `${weatherData.windSpeed} km/h` },
      humidity: { score: humidityScore, description: `${weatherData.humidity}%` },
      visibility: { score: visibilityScore, description: `${weatherData.visibility} km` },
      uvIndex: { score: uvScore, description: `${weatherData.uvIndex}` },
      timeOfDay: { score: timeOfDayScore, description: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) },
      weatherStability: { score: weatherStabilityScore, description: weatherData.condition }
    },
    recommendations: [],
    bestTimeSlots,
    speciesRecommendations
  };
}

// Optimized AI advice generation with token limits
export async function generateFisheryAdvice(
  weatherData: EnhancedWeatherData,
  fishingConditions: FishingConditions,
  activityType: 'fishing' | 'aquaculture' = 'fishing',
  userQuestion?: string
): Promise<string> {
  try {
    // Create concise prompt for weather AI consultation
    const optimizedPrompt = createOptimizedWeatherPrompt(weatherData, fishingConditions, activityType, userQuestion);
    
    const { data, error } = await supabase.functions.invoke('google-vision', {
      body: {
        imageBase64: '', // Text-only request
        prompt: optimizedPrompt,
        sessionId: 'weather-chat',
        responseCount: 1
      }
    });

    if (error) {
      console.error("Weather AI Error:", error);
      return getDefaultWeatherResponse(weatherData, fishingConditions, activityType);
    }

    if (data?.error) {
      console.error("Weather API Error:", data.error);
      return getDefaultWeatherResponse(weatherData, fishingConditions, activityType);
    }

    // Post-process and optimize response
    let response = data?.result || '';
    response = optimizeWeatherResponse(response);
    
    return response || getDefaultWeatherResponse(weatherData, fishingConditions, activityType);
  } catch (error) {
    console.error("Weather consultation error:", error);
    return getDefaultWeatherResponse(weatherData, fishingConditions, activityType);
  }
}

function createOptimizedWeatherPrompt(
  weatherData: EnhancedWeatherData,
  fishingConditions: FishingConditions,
  activityType: 'fishing' | 'aquaculture',
  userQuestion?: string
): string {
  const baseData = `Data: ${weatherData.location}, ${weatherData.temperature}°C, ${weatherData.condition}, Angin ${weatherData.windSpeed}km/h, Skor ${fishingConditions.overallScore}/10`;
  
  if (userQuestion) {
    return `${baseData}

Pertanyaan: ${userQuestion}

Jawab singkat dengan:
- Analisis kondisi (2-3 kalimat)
- Rekomendasi praktis (maksimal 3 poin)
- Kesimpulan (1 kalimat)

Fokus pada ${activityType === 'fishing' ? 'memancing' : 'budidaya ikan'}.`;
  }

  const activityPrompt = activityType === 'fishing' ? 
    `Analisis kondisi memancing:

**Kondisi Saat Ini:**
- Suhu: ${weatherData.temperature}°C
- Angin: ${weatherData.windSpeed} km/h  
- Skor: ${fishingConditions.overallScore}/10

**Rekomendasi:**
[3 poin praktis]

**Kesimpulan:** [1 kalimat]` :
    `Analisis akuakultur:

**Kondisi Lingkungan:**
- Suhu: ${weatherData.temperature}°C
- Kelembaban: ${weatherData.humidity}%
- Skor: ${fishingConditions.overallScore}/10

**Rekomendasi:**
[3 poin praktis]

**Kesimpulan:** [1 kalimat]`;

  return `${baseData}

${activityPrompt}

Batasi response maksimal 200 kata.`;
}

function optimizeWeatherResponse(response: string): string {
  // Remove verbose introductions
  const redundantPhrases = [
    'Berdasarkan kondisi cuaca saat ini',
    'Dengan mempertimbangkan data yang tersedia',
    'Setelah menganalisis kondisi lingkungan'
  ];
  
  let optimized = response;
  redundantPhrases.forEach(phrase => {
    const regex = new RegExp(`${phrase}[^.]*\\.\\s*`, 'gi');
    optimized = optimized.replace(regex, '');
  });
  
  // Limit response length
  if (optimized.length > 800) {
    const sentences = optimized.split('.');
    let result = '';
    for (const sentence of sentences) {
      if ((result + sentence + '.').length > 750) break;
      result += sentence + '.';
    }
    optimized = result;
  }
  
  return optimized.trim();
}

function getDefaultWeatherResponse(
  weatherData: EnhancedWeatherData,
  fishingConditions: FishingConditions,
  activityType: 'fishing' | 'aquaculture'
): string {
  const activity = activityType === 'fishing' ? 'memancing' : 'budidaya ikan';
  
  return `**Kondisi ${weatherData.location}**

Suhu: ${weatherData.temperature}°C
Skor: ${fishingConditions.overallScore}/10

**Rekomendasi:**
${fishingConditions.overallScore >= 7 ? 
  `• Kondisi baik untuk ${activity}
• Manfaatkan kondisi optimal ini
• Perhatikan perubahan cuaca` :
  `• Kondisi kurang ideal untuk ${activity}
• Pertimbangkan menunda aktivitas
• Tunggu perbaikan cuaca`
}

**Kesimpulan:** ${fishingConditions.category} - ${fishingConditions.overallScore >= 7 ? 'Direkomendasikan' : 'Tidak direkomendasikan'}.`;
}

export function calculateFishingConditions(weatherData: EnhancedWeatherData): FishingConditions {
  const tempScore = weatherData.temperature >= 20 && weatherData.temperature <= 30 ? 8 : 
                   weatherData.temperature >= 15 && weatherData.temperature <= 35 ? 6 : 4;
  
  const pressureScore = weatherData.pressure >= 1010 && weatherData.pressure <= 1020 ? 8 :
                       weatherData.pressure >= 1000 && weatherData.pressure <= 1030 ? 6 : 4;
  
  const windScore = weatherData.windSpeed <= 15 ? 8 :
                   weatherData.windSpeed <= 25 ? 6 : 4;
  
  const humidityScore = weatherData.humidity >= 40 && weatherData.humidity <= 70 ? 8 :
                       weatherData.humidity >= 30 && weatherData.humidity <= 80 ? 6 : 4;
  
  const visibilityScore = weatherData.visibility >= 10 ? 8 :
                         weatherData.visibility >= 5 ? 6 : 4;
  
  const uvScore = weatherData.uvIndex <= 6 ? 8 :
                 weatherData.uvIndex <= 8 ? 6 : 4;

  // Add time of day scoring
  const currentHour = new Date().getHours();
  const timeOfDayScore = (currentHour >= 5 && currentHour <= 8) || (currentHour >= 17 && currentHour <= 20) ? 8 : 
                        (currentHour >= 4 && currentHour <= 10) || (currentHour >= 16 && currentHour <= 21) ? 6 : 4;

  // Add weather stability scoring
  const condition = weatherData.condition.toLowerCase();
  const weatherStabilityScore = condition.includes('clear') || condition.includes('cerah') ? 8 :
                               condition.includes('partly') || condition.includes('berawan') ? 6 : 4;
  
  const overallScore = Math.round(
    (tempScore + pressureScore + windScore + humidityScore + visibilityScore + uvScore + timeOfDayScore + weatherStabilityScore) / 8
  );
  
  const category = overallScore >= 7 ? 'Baik' : overallScore >= 5 ? 'Sedang' : 'Buruk';

  // Generate advice based on overall score
  const advice = overallScore >= 8 ? 
    "Kondisi sangat ideal untuk memancing! Semua parameter mendukung aktivitas perikanan yang optimal." :
    overallScore >= 6 ? 
    "Kondisi baik untuk memancing. Beberapa parameter mendukung aktivitas perikanan yang produktif." :
    overallScore >= 4 ?
    "Kondisi cukup untuk memancing. Perhatikan faktor-faktor yang kurang mendukung." :
    "Kondisi kurang ideal untuk memancing. Pertimbangkan untuk menunda atau pilih lokasi yang lebih baik.";

  // Generate time slots and species recommendations
  const bestTimeSlots = overallScore >= 7 ? 
    ['05:00-08:00 (Pagi)', '17:00-20:00 (Sore)'] : 
    ['06:00-07:00 (Pagi)', '18:00-19:00 (Sore)'];

  const speciesRecommendations = overallScore >= 7 ? 
    ['Nila', 'Lele', 'Gurame', 'Mas'] : 
    overallScore >= 5 ? ['Nila', 'Lele'] : ['Lele'];
  
  return {
    overallScore,
    category,
    advice,
    factors: {
      temperature: { score: tempScore, description: `${weatherData.temperature}°C` },
      pressure: { score: pressureScore, description: `${weatherData.pressure} hPa` },
      wind: { score: windScore, description: `${weatherData.windSpeed} km/h` },
      humidity: { score: humidityScore, description: `${weatherData.humidity}%` },
      visibility: { score: visibilityScore, description: `${weatherData.visibility} km` },
      uvIndex: { score: uvScore, description: `${weatherData.uvIndex}` },
      timeOfDay: { score: timeOfDayScore, description: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) },
      weatherStability: { score: weatherStabilityScore, description: weatherData.condition }
    },
    recommendations: [],
    bestTimeSlots,
    speciesRecommendations
  };
}
