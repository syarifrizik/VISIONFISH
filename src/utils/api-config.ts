// Secure API Configuration - Private keys moved to Supabase Edge Functions
export const API_KEYS = {
  SUPABASE_URL: "https://hxekcssuzixhieadgcxx.supabase.co",
  SUPABASE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4ZWtjc3N1eml4aGllYWRnY3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2ODAyNDAsImV4cCI6MjA2NDI1NjI0MH0.FLfZG0BEaT9f0E6JTMtRaYUgrgCmbvzfIt5oBp1AprU",
  // Private API keys moved to Supabase Secrets for security
  // WEATHER_API_KEY: moved to edge function
  // GOOGLE_API_KEY: moved to edge function  
  // GFW_API_TOKEN: moved to edge function
};

import { supabase } from "@/integrations/supabase/client";

// Secure function to use Google Vision API via Edge Function
export async function analyzeImageWithGoogle(
  imageBase64: string, 
  prompt: string, 
  generationConfig?: any,
  isTextOnlyChat: boolean = false
): Promise<string> {
  try {
    console.log('API Call: Starting analysis', { 
      hasImage: !!imageBase64 && imageBase64 !== '' && imageBase64 !== 'data:,',
      isTextOnlyChat,
      promptLength: prompt?.length || 0
    });
    
    // For text-only chat mode, we don't require an image
    if (isTextOnlyChat) {
      console.log('Text-only chat mode detected');
    } else {
      // For image analysis mode, we require both image and prompt
      if (!imageBase64 || !prompt) {
        throw new Error('Image and prompt are required for enterprise analysis');
      }
    }

    if (!prompt || prompt.trim() === '') {
      throw new Error('Prompt is required for all analysis modes');
    }

    // Enhanced request payload with enterprise optimization
    const requestPayload = {
      imageBase64: imageBase64 || '',
      prompt,
      sessionId: `session-${Date.now()}`,
      responseCount: 1,
      enterpriseMode: !isTextOnlyChat,
      isTextOnlyChat,
      ...(generationConfig && { generationConfig })
    };

    console.log('API Request configured:', {
      hasImage: !!requestPayload.imageBase64,
      isTextOnlyChat: requestPayload.isTextOnlyChat,
      enterpriseMode: requestPayload.enterpriseMode
    });

    const { data, error } = await supabase.functions.invoke('google-vision', {
      body: requestPayload
    });

    if (error) {
      console.error('API error:', error);
      throw new Error(`Analysis failed: ${error.message}`);
    }

    if (!data || !data.result) {
      throw new Error('Invalid API response format');
    }

    console.log('API: Analysis completed successfully');
    return data.result;
  } catch (error) {
    console.error('API: Critical error:', error);
    
    // Provide more specific error messages
    if (error.message?.includes('Image and prompt are required')) {
      throw new Error('Mode analisis gambar memerlukan gambar dan prompt');
    } else if (error.message?.includes('Prompt is required')) {
      throw new Error('Prompt diperlukan untuk semua mode analisis');
    } else if (error.message?.includes('Analysis failed')) {
      throw new Error('Terjadi kesalahan dalam analisis. Silakan coba lagi.');
    } else {
      throw new Error('Layanan AI sementara tidak tersedia. Silakan coba lagi nanti.');
    }
  }
}

// Optimized prompts for efficient token usage
export function getModelPrompt(modelId: string, isIdentification: boolean): string {
  if (isIdentification) {
    // Highly optimized species identification prompt
    return `Analisis gambar ikan. Buat tabel Markdown dengan format:

| Kategori | Detail |
|----------|--------|
| Nama Lokal | [nama dalam bahasa Indonesia] |
| Nama Ilmiah | [nama Latin] |
| Famili | [famili ikan] |
| Habitat | [tempat hidup] |
| Distribusi | [wilayah penyebaran] |
| Karakteristik | [ciri fisik utama] |
| Status Konservasi | [status] |
| Nilai Ekonomi | [pemanfaatan] |

Jika bukan ikan, tulis: 'NOT_A_FISH: [alasan]'

Akhiri dengan 1 kalimat kesimpulan.`;
  } else {
    // Highly optimized freshness analysis prompt
    return `Analisis kesegaran ikan berdasarkan SNI 2729-2013. Buat tabel:

| Parameter | Deskripsi | Skor (1-9) |
|-----------|-----------|------------|
| Mata | [kondisi mata] | [angka] |
| Insang | [kondisi insang] | [angka] |
| Lendir | [kondisi lendir] | [angka] |
| Daging | [kondisi daging] | [angka] |
| Tekstur | [kekenyalan] | [angka] |
| Bau | [perkiraan aroma] | [angka] |

Skor Keseluruhan: [rata-rata]

Kategori:
- 8-9: Prima
- 7-<8: Baik  
- 5-<7: Sedang
- <5: Busuk

Kesimpulan: [1 kalimat ringkas]

Jika bukan ikan: 'NOT_A_FISH: [alasan]'`;
  }
}
