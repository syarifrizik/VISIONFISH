
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { image, analysisType = 'species', sessionFingerprint, ipAddress, userId } = await req.json();

    // Get browser fingerprint
    const userAgent = req.headers.get('user-agent') || '';
    const clientIP = req.headers.get('x-forwarded-for') || ipAddress || '127.0.0.1';

    console.log('VisionFish Analysis Request:', { userId, sessionFingerprint, analysisType, hasImage: !!image });

    // Check user quota before analysis
    const { data: quotaCheck, error: quotaError } = await supabase.rpc(
      'check_user_analysis_quota',
      {
        p_user_id: userId || null,
        p_session_fingerprint: sessionFingerprint,
        p_ip_address: clientIP
      }
    );

    if (quotaError) {
      console.error('Quota check error:', quotaError);
      await recordUsage(supabase, userId, sessionFingerprint, clientIP, userAgent, false, { error: 'Quota check failed' });
      
      return new Response(JSON.stringify({
        error: 'Sistem quota mengalami gangguan',
        type: 'unknown'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if user can analyze
    if (!quotaCheck?.can_analyze) {
      console.log('User quota exceeded:', quotaCheck);
      await recordUsage(supabase, userId, sessionFingerprint, clientIP, userAgent, false, { 
        error: 'Quota exceeded',
        quota_info: quotaCheck 
      });

      const errorType = quotaCheck?.is_premium && quotaCheck?.cooldown_until ? 'cooldown' :
                       !userId ? 'login_required' :
                       !quotaCheck?.is_premium ? 'quota_exceeded' : 'unknown';

      return new Response(JSON.stringify({
        error: quotaCheck?.message || 'Batas analisis tercapai',
        type: errorType,
        quota_info: quotaCheck
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get appropriate API key (user-specific for premium users, system key for others)
    const { data: apiKey, error: keyError } = await supabase.rpc('get_user_api_key', { target_user_id: userId });
    
    if (keyError || !apiKey) {
      console.error('No API key available:', keyError);
      await recordUsage(supabase, userId, sessionFingerprint, clientIP, userAgent, false, { error: 'No API key available' });
      
      return new Response(JSON.stringify({
        error: 'VisionFish AI sedang dalam pemeliharaan. API key tidak tersedia.',
        type: 'invalid_key',
        details: 'Silakan hubungi administrator untuk mengaktifkan layanan analisis.'
      }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Prepare analysis prompt based on type
    const getAnalysisPrompt = (type: string) => {
      const baseInstruction = `Anda adalah VisionFish AI, sistem Computer Vision Technology untuk analisis ikan. Berikan respons dalam bahasa Indonesia yang profesional dan mudah dipahami.`;
      
      switch (type) {
        case 'species':
          return `${baseInstruction}

ANALISIS SPESIES IKAN:
Identifikasi spesies ikan pada gambar dengan detail:
1. **Nama Spesies**: [Nama ilmiah dan nama lokal]
2. **Klasifikasi**: [Family, Genus, Species]
3. **Karakteristik**: [Ciri-ciri fisik yang membedakan]
4. **Habitat**: [Tempat hidup alami]
5. **Ukuran**: [Estimasi panjang dan berat]
6. **Nilai Ekonomis**: [Harga pasar dan popularitas]
7. **Tips Budidaya**: [Cara pemeliharaan jika applicable]

Format jawaban dalam format yang rapi dan informatif untuk nelayan/petani ikan.`;

        case 'freshness':
          return `${baseInstruction}

ANALISIS KESEGARAN IKAN (BERDASARKAN SNI 2729-2013):
Evaluasi tingkat kesegaran ikan berdasarkan standar:

**MATA**: Kondisi dan kejernihan
**INSANG**: Warna dan kondisi
**DAGING**: Tekstur dan elastisitas  
**BAU**: Aroma karakteristik
**TEKSTUR**: Kekenyalan daging

**HASIL PENILAIAN**:
- **PRIMA (9)**: Sangat Segar - mata jernih, insang merah cerah
- **BAIK (7-8)**: Segar - kondisi baik, sedikit penurunan kualitas
- **SEDANG (5-6)**: Kurang Segar - mulai menurun, segera dikonsumsi
- **BURUK (1-3)**: Tidak Segar - tidak layak konsumsi

Berikan penilaian akhir dengan skala SNI dan rekomendasi penggunaan.`;

        case 'both':
          return `${baseInstruction}

ANALISIS LENGKAP - SPESIES & KESEGARAN:

**BAGIAN 1 - IDENTIFIKASI SPESIES:**
1. **Nama Spesies**: [Nama ilmiah dan lokal]
2. **Klasifikasi**: [Family, Genus, Species]
3. **Karakteristik**: [Ciri-ciri fisik utama]
4. **Habitat & Distribusi**: [Tempat hidup]
5. **Nilai Ekonomis**: [Harga pasar]

**BAGIAN 2 - EVALUASI KESEGARAN (SNI 2729-2013):**
1. **Mata**: [Kondisi dan skor]
2. **Insang**: [Warna dan skor]  
3. **Daging**: [Tekstur dan skor]
4. **Bau**: [Aroma dan skor]
5. **Skor Total**: [X/9 - PRIMA/BAIK/SEDANG/BURUK]

**REKOMENDASI:**
- Metode pengolahan terbaik
- Daya tahan dan penyimpanan
- Nilai jual optimal

Berikan analisis yang komprehensif namun mudah dipahami.`;

        default:
          return `${baseInstruction} Analisis ikan pada gambar dan berikan informasi yang berguna.`;
      }
    };

    // Call Gemini API with improved error handling
    try {
      const geminiResponse = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: getAnalysisPrompt(analysisType) },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: image.split(',')[1] // Remove data:image/jpeg;base64, prefix
                  }
                }
              ]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            }
          })
        }
      );

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('Gemini API error:', errorText, 'Status:', geminiResponse.status);
        
        // Increment API usage even on error
        await supabase.rpc('increment_user_api_usage', { 
          target_user_id: userId,
          api_key_value: apiKey 
        });
        await recordUsage(supabase, userId, sessionFingerprint, clientIP, userAgent, false, { 
          error: 'Gemini API error',
          status: geminiResponse.status,
          response: errorText 
        });

        // Better error messaging based on status code
        let errorMessage = 'VisionFish AI sedang mengalami gangguan teknis.';
        let errorType = 'unknown';
        
        if (geminiResponse.status === 429) {
          errorMessage = 'Terlalu banyak permintaan. Silakan coba lagi dalam beberapa menit.';
          errorType = 'api_quota';
        } else if (geminiResponse.status === 403) {
          errorMessage = 'API key tidak valid atau expired. Hubungi administrator.';
          errorType = 'invalid_key';
        } else if (geminiResponse.status >= 500) {
          errorMessage = 'Server AI sedang mengalami gangguan. Silakan coba lagi.';
          errorType = 'network';
        }

        return new Response(JSON.stringify({
          error: errorMessage,
          type: errorType,
          details: `Status: ${geminiResponse.status}`
        }), {
          status: geminiResponse.status >= 500 ? 503 : 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const result = await geminiResponse.json();
      
      if (!result.candidates || result.candidates.length === 0) {
        console.error('No candidates in Gemini response:', result);
        await recordUsage(supabase, userId, sessionFingerprint, clientIP, userAgent, false, { 
          error: 'No analysis result',
          gemini_response: result 
        });
        
        return new Response(JSON.stringify({
          error: 'Tidak dapat menganalisis gambar. Pastikan gambar ikan terlihat jelas dan berkualitas baik.',
          type: 'unknown',
          details: 'AI tidak dapat mengenali konten gambar'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const analysisResult = result.candidates[0].content.parts[0].text;

      // Increment API usage on success
      await supabase.rpc('increment_user_api_usage', { 
        target_user_id: userId,
        api_key_value: apiKey 
      });
      
      // Record successful usage
      await recordUsage(supabase, userId, sessionFingerprint, clientIP, userAgent, true, {
        analysis_result: analysisResult,
        analysis_type: analysisType,
        gemini_response: result
      });

      console.log('VisionFish Analysis completed successfully');

      return new Response(JSON.stringify({
        analysis: analysisResult,
        quota_info: quotaCheck,
        analysis_type: analysisType
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (networkError) {
      console.error('Network error calling Gemini API:', networkError);
      await recordUsage(supabase, userId, sessionFingerprint, clientIP, userAgent, false, { 
        error: 'Network error',
        details: networkError.message 
      });
      
      return new Response(JSON.stringify({
        error: 'Gagal terhubung ke layanan AI. Periksa koneksi internet Anda.',
        type: 'network',
        details: 'Network connection failed'
      }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('VisionFish Analysis critical error:', error);
    
    return new Response(JSON.stringify({
      error: 'Terjadi kesalahan sistem yang tidak terduga. Silakan coba lagi.',
      type: 'unknown',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function recordUsage(
  supabase: any,
  userId: string | null,
  sessionFingerprint: string,
  ipAddress: string,
  userAgent: string,
  success: boolean,
  apiResponse: any
) {
  try {
    await supabase.rpc('record_analysis_usage', {
      p_user_id: userId,
      p_session_fingerprint: sessionFingerprint,
      p_ip_address: ipAddress,
      p_success: success,
      p_api_response: apiResponse
    });
  } catch (error) {
    console.error('Failed to record usage:', error);
  }
}
