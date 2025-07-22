
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VisionRequest {
  imageBase64: string;
  prompt: string;
  sessionId?: string;
  responseCount?: number;
  enterpriseMode?: boolean;
  isTextOnlyChat?: boolean;
  generationConfig?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');
    if (!googleApiKey) {
      throw new Error('Google API key not configured');
    }

    const { 
      imageBase64, 
      prompt, 
      sessionId, 
      responseCount, 
      enterpriseMode, 
      isTextOnlyChat = false,
      generationConfig 
    }: VisionRequest = await req.json();
    
    console.log(`Analysis Request - Session: ${sessionId}, Text-Only: ${isTextOnlyChat}, Enterprise: ${enterpriseMode}`);
    console.log(`Generation Config Override:`, generationConfig ? 'Applied' : 'Default');
    
    if (!prompt || prompt.trim() === '') {
      throw new Error('Prompt is required');
    }

    // Determine if this is a text-only request
    const isTextOnly = isTextOnlyChat || !imageBase64 || imageBase64.trim() === '' || imageBase64 === 'data:,';
    console.log(`Request type: ${isTextOnly ? 'text-only' : 'with-image'}`);

    let cleanBase64Data = '';
    if (!isTextOnly) {
      cleanBase64Data = imageBase64.includes('base64,') 
        ? imageBase64.split('base64,')[1] 
        : imageBase64;
    }

    // Configuration optimized for different modes
    const defaultConfig = {
      temperature: isTextOnlyChat ? 0.3 : 0.05, // Higher creativity for chat
      topK: isTextOnlyChat ? 16 : 8,
      topP: isTextOnlyChat ? 0.8 : 0.6,
      maxOutputTokens: isTextOnlyChat ? 800 : 600, // More tokens for chat
      candidateCount: 1
    };

    // Apply custom generation config if provided
    const finalGenerationConfig = generationConfig ? 
      { ...defaultConfig, ...generationConfig } : 
      defaultConfig;

    console.log(`Generation Config:`, finalGenerationConfig);

    const requestParts = [{ text: prompt }];
    
    if (!isTextOnly && cleanBase64Data) {
      requestParts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: cleanBase64Data
        }
      });
    }

    const requestBody = {
      contents: [
        {
          parts: requestParts
        }
      ],
      generationConfig: finalGenerationConfig,
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH", 
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    console.log(`API Call - Mode: ${isTextOnly ? 'Text-Only' : 'Image+Text'}, Temp: ${finalGenerationConfig.temperature}`);

    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + googleApiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("API Error:", data.error);
      throw new Error(data.error.message || 'Unknown API error');
    }
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      let responseText = data.candidates[0].content.parts[0].text || "";
      
      responseText = responseText.trim();
      
      if (responseText === "") {
        throw new Error("Empty response from AI");
      }

      // Response optimization based on mode
      if (isTextOnlyChat) {
        // For chat, preserve conversational flow
        responseText = optimizeChatResponse(responseText);
      } else {
        // For image analysis, apply enterprise optimization
        responseText = enterpriseOptimizeResponse(responseText, enterpriseMode);
      }

      // Enhanced relevance validation
      const isRelevant = validateRelevance(responseText, isTextOnly, isTextOnlyChat);

      if (!isRelevant && !isTextOnly) {
        return new Response(JSON.stringify({ result: "VALIDATION_FAILED: Gambar tidak memenuhi standar analisis atau tidak menunjukkan ikan" }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      console.log(`Response processed: ${responseText.length} characters, Mode: ${isTextOnly ? 'Text-Only' : 'Image+Text'}`);
      
      return new Response(JSON.stringify({ result: responseText }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      console.error("Invalid API response structure:", JSON.stringify(data, null, 2));
      throw new Error("Invalid response format from AI service");
    }
  } catch (error) {
    console.error('Error in google-vision function:', error);
    
    const errorMessage = error.message || 'Unknown error occurred';
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: 'AI service temporarily unavailable. Please try again later.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Chat response optimization - preserves conversational flow
function optimizeChatResponse(text: string): string {
  let optimized = text;
  
  // For chat responses, maintain natural conversation
  // Only trim if extremely long (over 1200 chars)
  if (optimized.length > 1200) {
    // Find a good breaking point (sentence end)
    const sentences = optimized.split('. ');
    let result = '';
    let charCount = 0;
    
    for (const sentence of sentences) {
      if (charCount + sentence.length > 1000) {
        break;
      }
      result += sentence + '. ';
      charCount += sentence.length + 2;
    }
    
    optimized = result.trim();
    if (optimized.endsWith('.')) {
      optimized = optimized.slice(0, -1);
    }
    optimized += '.';
  }
  
  return optimized;
}

// Enterprise response optimization for image analysis
function enterpriseOptimizeResponse(text: string, enterpriseMode: boolean = false): string {
  let optimized = text;
  
  // Enterprise mode preserves more content for quality control
  if (enterpriseMode) {
    // Preserve quality markers and validation content
    if (optimized.includes('ENTERPRISE') || optimized.includes('QUALITY_CHECK')) {
      return optimized.length > 2000 ? optimized.substring(0, 2000) + '\n\n[Enterprise response optimized for performance]' : optimized;
    }
  }
  
  // Standard optimization for non-enterprise mode
  if (optimized.includes('|') && optimized.includes('---')) {
    const tableStart = optimized.indexOf('|');
    if (tableStart > 100) {
      const beforeTable = optimized.substring(0, tableStart);
      const fromTable = optimized.substring(tableStart);
      
      const essentialIntro = beforeTable.substring(0, 80).includes('ikan') ? 
        beforeTable.substring(0, 80) + '...\n\n' : '';
      
      optimized = essentialIntro + fromTable;
    }
  }
  
  if (optimized.length > 1500) {
    const lines = optimized.split('\n');
    let result = '';
    let charCount = 0;
    
    for (const line of lines) {
      if (charCount + line.length > 1500) {
        if (result.includes('|') && line.includes('|')) {
          result += line + '\n';
        }
        break;
      }
      result += line + '\n';
      charCount += line.length + 1;
    }
    
    optimized = result.trim();
  }
  
  return optimized;
}

// Enhanced relevance validation for different modes
function validateRelevance(text: string, isTextOnly: boolean, isTextOnlyChat: boolean): boolean {
  const lowerResponse = text.toLowerCase();
  
  // For text-only chat, be more permissive
  if (isTextOnlyChat) {
    // Chat responses should be conversational and helpful
    const chatKeywords = ['visionfish', 'perikanan', 'ikan', 'laut', 'budidaya', 'akuakultur'];
    const hasRelevantContent = chatKeywords.some(keyword => lowerResponse.includes(keyword));
    
    // Even if not directly fish-related, allow helpful responses
    return hasRelevantContent || lowerResponse.length > 20;
  }
  
  // For image analysis, use strict validation
  const fishKeywords = ['ikan', 'fish', 'mata', 'insang', 'segar', 'kesegaran', 'spesies'];
  const analysisKeywords = ['skor', 'kategori', 'parameter', 'analisis', 'sns', 'prima', 'baik', 'sedang'];
  
  const fishMatch = fishKeywords.some(keyword => lowerResponse.includes(keyword));
  const analysisMatch = analysisKeywords.some(keyword => lowerResponse.includes(keyword));
  
  return fishMatch || analysisMatch || isTextOnly;
}
