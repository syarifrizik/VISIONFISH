
import { useState } from 'react';
import { generateFisheryAdvice, EnhancedWeatherData, FishingConditions } from '@/utils/enhanced-weather';
import { toast } from 'sonner';

export const useAquacultureAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);

  const generateAquacultureAdvice = async (
    weatherData: EnhancedWeatherData,
    fishingConditions: FishingConditions,
    userQuestion?: string
  ): Promise<string> => {
    setIsLoading(true);
    
    try {
      console.log("Weather AI: Generating optimized advice...");
      
      const advice = await generateFisheryAdvice(
        weatherData,
        fishingConditions,
        'aquaculture',
        userQuestion
      );
      
      // Track conversation for context
      if (userQuestion) {
        setConversationHistory(prev => [...prev, userQuestion]);
      }
      
      console.log("Weather AI: Advice generated successfully");
      return advice;
    } catch (error) {
      console.error('Weather AI Error:', error);
      toast.error('Gagal mendapat respons AI. Silakan coba lagi.');
      
      // Return fallback response
      return `**Analisis Cepat**

Kondisi ${weatherData.location}: ${weatherData.temperature}°C
Skor Kesesuaian: ${fishingConditions.overallScore}/10

**Rekomendasi:**
• ${fishingConditions.overallScore >= 7 ? 'Kondisi baik untuk aktivitas akuakultur' : 'Kondisi kurang optimal'}
• Pantau perubahan cuaca secara berkala
• Sesuaikan strategi berdasarkan kondisi

**Kesimpulan:** ${fishingConditions.category} untuk aktivitas akuakultur.`;
    } finally {
      setIsLoading(false);
    }
  };

  const resetConversation = () => {
    setConversationHistory([]);
  };

  return {
    generateAquacultureAdvice,
    isLoading,
    conversationHistory,
    resetConversation
  };
};
