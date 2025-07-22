/**
 * Enhanced AI Models with Updated Consistent Scoring System
 * Updated: Tekstur moved to visual parameters, Bau excluded from scoring
 */

import { consistentScoring } from './consistent-scoring-system';
import { AnalysisType } from '@/components/species/DualAnalysisSelector';

export enum AI_MODELS {
  NEPTUNE_FLOW = "gemini-1.5-pro-001",
  CORAL_WAVE = "gemini-1.5-pro-coral",
  REGAL_TIDE = "gemini-1.5-pro-regal"
}

export const AVAILABLE_MODELS = [
  {
    id: AI_MODELS.NEPTUNE_FLOW,
    name: "Neptune Flow (Standard)",
    description: "Model standar untuk analisis umum dan informasi praktis.",
    isPremium: false
  },
  {
    id: AI_MODELS.CORAL_WAVE,
    name: "Coral Wave (Scientific)",
    description: "Model ilmiah untuk analisis mendalam dan referensi penelitian.",
    isPremium: true
  },
  {
    id: AI_MODELS.REGAL_TIDE,
    name: "Regal Tide (Business)",
    description: "Model bisnis untuk strategi pasar dan implementasi teknologi.",
    isPremium: true
  }
];

const FREE_TIER_LIMIT = 20; // 20 analysis per day
const FREE_TIER_KEY = "visionfish-free-tier-usage";

/**
 * Check if user has premium access
 */
export const hasPremiumAccess = (isPremium: boolean): boolean => {
  return isPremium;
};

/**
 * Track free tier usage
 */
export const trackFreeUsage = (feature: string): boolean => {
  if (typeof window === 'undefined') return true; // Skip server-side

  const today = new Date().toISOString().split('T')[0];
  const key = `${FREE_TIER_KEY}-${feature}-${today}`;
  const usage = localStorage.getItem(key);
  const count = usage ? parseInt(usage, 10) : 0;

  if (count < FREE_TIER_LIMIT) {
    localStorage.setItem(key, (count + 1).toString());
    return true;
  }

  return false;
};

/**
 * Enhanced logical model prompt with updated parameter system
 */
export const getLogicalModelPrompt = (model: AI_MODELS, analysisType: AnalysisType): string => {
  const basePrompt = `**Sistem Analisis VisionFish - Mode Logis (Updated SNI 2729-2013)**

Anda adalah sistem AI yang menganalisis gambar ikan untuk mengidentifikasi spesies dan menentukan tingkat kesegaran berdasarkan standar SNI 2729-2013 yang telah diperbarui.

**PENTING - Sistem Parameter Excel:**
- **6 Parameter:** Mata, Insang, Lendir, Daging, Bau, Tekstur (semua dihitung dalam skor)
- **Perhitungan Skor:** Berdasarkan rata-rata semua 6 parameter (seperti format Excel)
- **Format:** Total semua parameter dibagi 6 untuk rata-rata

**Tugas Anda:**
1. **Identifikasi Spesies Ikan:** Tentukan spesies ikan dari gambar. Sertakan nama ilmiah jika memungkinkan.
2. **Analisis Kesegaran (SNI 2729-2013 Excel Format):** Evaluasi kesegaran ikan berdasarkan 6 parameter:
   - **6 Parameter:** Mata, Insang, Lendir, Daging, Bau, Tekstur (semua berikan skor 1-9 dan deskripsi kondisi)
   - **Format Excel:** Hitung rata-rata dari semua 6 parameter untuk skor total
3. **Berikan Skor Keseluruhan:** Berikan skor keseluruhan (1-9) dan kategori berdasarkan rata-rata 6 parameter.
4. **Prioritaskan Akurasi:** Hindari informasi yang tidak relevan atau tidak dapat diverifikasi dari gambar.
5. **Format Output:** Gunakan format Markdown dengan jelas, ringkas, dan mudah dibaca.

**Instruksi Khusus Parameter (Format Excel):**
- **Semua Parameter:** Berikan skor 1-9 untuk semua 6 parameter
- **Bau:** Meski tidak dapat dianalisis dari foto, berikan estimasi skor berdasarkan kondisi visual lainnya
- **Perhitungan Total:** Rata-rata dari 6 parameter (Mata + Insang + Lendir + Daging + Bau + Tekstur) / 6

**Contoh Output (Markdown):**
\`\`\`markdown
# Hasil Analisis Ikan

## Identifikasi Spesies
- **Spesies:** [Nama Spesies] ([Nama Ilmiah, jika ada])

## Analisis Kesegaran (SNI 2729-2013 Updated)
| Parameter | Kondisi | Skor |
|-----------|---------|------|
| **Mata** | Jernih, cembung | 8 |
| **Insang** | Merah cerah | 7 |
| **Lendir** | Tipis, transpiran | 9 |
| **Daging** | Elastis, padat | 7 |
| **Tekstur** | Kompak, utuh | 8 |
| **Bau** | Estimasi segar | 7 |

## Kesimpulan
- **Skor Keseluruhan:** 7.5 (berdasarkan 6 parameter)
- **Kategori:** Baik

Catatan: Skor dihitung seperti format Excel dengan rata-rata semua 6 parameter.
\`\`\`

**Mulai Analisis:**
[Gambar ikan diunggah]`;

  const freshnessPrompt = `**Analisis Kesegaran Ikan (SNI 2729-2013 Updated):** Evaluasi kesegaran ikan berdasarkan sistem parameter yang diperbarui:
   - **5 Parameter Visual:** Mata, Insang, Lendir, Daging, Tekstur (berikan skor dan deskripsi kondisi)
   - **1 Parameter Non-Visual:** Bau (berikan deskripsi tanpa skor numerik)
3. **Berikan Skor Keseluruhan:** Berikan skor keseluruhan (1-9) dan kategori berdasarkan 5 parameter visual.
4. **Prioritaskan Akurasi:** Hindari informasi yang tidak relevan atau tidak dapat diverifikasi dari gambar.
5. **Format Output:** Gunakan format Markdown dengan jelas, ringkas, dan mudah dibaca.

**Instruksi Tambahan:**
- **SNI 2729-2013 Updated:** Wajib gunakan sistem parameter yang diperbarui untuk analisis kesegaran.
- **Parameter Tekstur:** Sekarang dianggap parameter visual - estimasi dari tampilan fisik ikan.
- **Parameter Bau:** Selalu tulis "tidak dapat dinilai dari foto" tanpa skor numerik.
- **Perhitungan Skor:** Berdasarkan rata-rata 5 parameter visual saja.
- **Referensi Visual:** Fokus pada detail visual yang terlihat pada gambar untuk menentukan skor dan kategori.
- **Output:** Gunakan Markdown untuk menyajikan hasil analisis dengan jelas dan terstruktur.`;

  const speciesPrompt = `**Identifikasi Spesies Ikan:** Tentukan spesies ikan dari gambar. Sertakan nama ilmiah jika memungkinkan.`;

  switch (analysisType) {
    case 'freshness':
      return `${basePrompt}\n${freshnessPrompt}`;
    case 'species':
      return `${basePrompt}\n${speciesPrompt}`;
    default:
      return basePrompt;
  }
};

/**
 * Enhanced logical AI response processing with updated consistent scoring
 */
export const processLogicalAIResponse = (rawResponse: string, analysisType: AnalysisType): string => {
  console.log('Enhanced AI Response Processing: Starting updated consistent scoring processing');
  
  // First, check for API errors
  if (rawResponse.includes('quota') || rawResponse.includes('limit') || rawResponse.includes('error')) {
    return handleAPIError(rawResponse);
  }

  // Process with updated consistent scoring system for reliability
  if (analysisType === 'freshness' || analysisType === 'both') {
    try {
      const consistentResult = consistentScoring.processAnalysisResult(rawResponse);
      
      // Generate enhanced response format with updated consistent data
      let enhancedResponse = `# Analisis Kesegaran Ikan - SNI 2729-2013 (Updated System)\n\n`;
      
      // Add system update information
      enhancedResponse += `🔄 **System Update**: Tekstur dipindahkan ke parameter visual, Bau tidak dihitung dalam skor total.\n\n`;
      
      // Add auto-assignment information if applicable
      if (consistentResult.autoAssignedCount > 0) {
        enhancedResponse += `🔧 **Auto-Assignment System**: ${consistentResult.autoAssignedCount} parameter memiliki skor yang ditetapkan otomatis untuk konsistensi UI.\n\n`;
      }
      
      // Add parameter table with updated consistent data
      enhancedResponse += `## Parameter Analisis (Updated)\n\n`;
      enhancedResponse += `| Parameter | Kondisi | Skor | Status | Confidence |\n`;
      enhancedResponse += `|-----------|---------|------|--------|------------|\n`;
      
      consistentResult.parameters.forEach(param => {
        const statusText = param.isAnalyzable ? 'Visual' : 'Info Only';
        const confidenceIcon = param.confidence === 'auto-assigned' ? '🔧' : param.confidence === 'high' ? '✅' : param.confidence === 'medium' ? '⚠️' : '📊';
        const scoreDisplay = param.score !== null ? param.score.toString() : 'N/A';
        enhancedResponse += `| **${param.name}** | ${param.condition} | ${scoreDisplay} | ${statusText} | ${confidenceIcon} ${param.confidence} |\n`;
      });
      
      enhancedResponse += `\n## Kesimpulan (Updated System)\n\n`;
      enhancedResponse += `**Skor Rata-rata Visual**: ${consistentResult.overallScore.toFixed(1)}/9\n`;
      enhancedResponse += `**Kategori**: **${consistentResult.category}**\n`;
      enhancedResponse += `**Parameter Visual**: 5/5 (termasuk Tekstur)\n`;
      enhancedResponse += `**Parameter Non-Visual**: 1/1 (hanya Bau, tidak dihitung)\n`;
      enhancedResponse += `**Auto-Assigned**: ${consistentResult.autoAssignedCount}\n\n`;
      
      enhancedResponse += `### Catatan Updated Scoring System\n`;
      enhancedResponse += `- **Parameter Visual (5):** Mata, Insang, Lendir, Daging, Tekstur - semua memiliki skor dan progress bar\n`;
      enhancedResponse += `- **Parameter Non-Visual (1):** Bau - hanya informasi, tidak ada skor atau progress bar\n`;
      enhancedResponse += `- **Perhitungan Skor:** Berdasarkan rata-rata 5 parameter visual saja\n`;
      enhancedResponse += `- **Tekstur:** Kini dianggap parameter visual berdasarkan tampilan fisik ikan\n`;
      enhancedResponse += `- **Bau:** Tetap ditampilkan sebagai informasi tapi tidak dihitung dalam skor total\n`;
      
      if (consistentResult.validationWarnings.length > 0) {
        enhancedResponse += `\n### Validation Warnings\n`;
        consistentResult.validationWarnings.forEach(warning => {
          enhancedResponse += `- ${warning}\n`;
        });
      }
      
      // Append original response for reference
      enhancedResponse += `\n---\n### Data Asli AI\n${rawResponse}`;
      
      return enhancedResponse;
    } catch (error) {
      console.error('Updated consistent scoring processing error:', error);
      // Fallback to original response
      return rawResponse;
    }
  }
  
  // For species-only analysis, return original response
  return rawResponse;
};

function handleAPIError(response: string): string {
  if (response.toLowerCase().includes('quota') || response.toLowerCase().includes('limit')) {
    return `**Kuota API Tercapai** ⚠️

Sistem telah mencapai batas penggunaan API. Silakan coba lagi nanti atau hubungi administrator.

**Saran Sementara:**
- Coba lagi dalam beberapa menit
- Gunakan gambar dengan resolusi lebih kecil
- Batasi jumlah analisis per hari

**Status**: Temporary API limitation
**Estimasi**: Coba lagi dalam 1-2 jam`;
  }
  
  return `**Analisis Gagal** ❌

Terjadi kesalahan dalam proses analisis. Silakan coba lagi.

**Kemungkinan Penyebab:**
- Koneksi internet tidak stabil
- Server sedang sibuk
- Format gambar tidak didukung

**Saran:**
- Periksa koneksi internet Anda
- Coba unggah gambar dengan format JPG/PNG
- Ulangi analisis dalam beberapa saat

**Error Details**: ${response.substring(0, 200)}`;
}
