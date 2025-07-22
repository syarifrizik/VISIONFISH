/**
 * Enterprise Prompt Engineering System for VisionFish
 * Enhanced: Better sensitivity for poor fish conditions and fish name extraction
 */

export interface PromptTemplate {
  id: string;
  name: string;
  type: 'species' | 'freshness' | 'both';
  template: string;
  sensitivity: PromptSensitivity;
  qualityMarkers: string[];
  validationRules: ValidationRule[];
}

export interface PromptSensitivity {
  temperature: number;
  topK: number;
  topP: number;
  maxTokens: number;
  confidenceThreshold: number;
}

export interface ValidationRule {
  type: 'structure' | 'content' | 'parameter' | 'scoring';
  rule: string;
  errorMessage: string;
}

/**
 * Optimized sensitivity settings based on analysis type
 */
export const SENSITIVITY_PROFILES = {
  species: {
    temperature: 0.1,
    topK: 10,
    topP: 0.7,
    maxTokens: 300, // Reduced for efficiency
    confidenceThreshold: 0.8
  },
  freshness: {
    temperature: 0.05,
    topK: 8,
    topP: 0.6,
    maxTokens: 500, // Reduced for efficiency
    confidenceThreshold: 0.85
  },
  both: {
    temperature: 0.07,
    topK: 12,
    topP: 0.65,
    maxTokens: 650, // Reduced for efficiency
    confidenceThreshold: 0.82
  }
} as const;

/**
 * Enhanced prompt templates with better fish condition sensitivity
 */
export const ENTERPRISE_PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'freshness-analysis-v3',
    name: 'Enhanced SNI 2729-2013 Freshness Analysis',
    type: 'freshness',
    sensitivity: SENSITIVITY_PROFILES.freshness,
    qualityMarkers: [
      'ENTERPRISE_QUALITY_CONTROL',
      'SNI_2729_2013_COMPLIANT',
      'ENHANCED_SENSITIVITY'
    ],
    template: `**ANALISIS KESEGARAN IKAN SNI 2729-2013 (Enhanced Sensitivity)**

QUALITY_CONTROL_MARKER: ENTERPRISE_ANALYSIS_V3

**INSTRUKSI PENTING:**
- Berikan NAMA IKAN/SPESIES yang teridentifikasi di awal analisis
- Jika ikan terlihat JELAS RUSAK/BUSUK, berikan skor 1-3 tanpa ragu
- Jika mata keruh, insang pucat, lendir kental = SKOR RENDAH (1-3)
- Jangan terlalu konservatif untuk kondisi yang jelas buruk

**KLASIFIKASI PARAMETER:**
- **5 Parameter Visual:** Mata, Insang, Lendir, Daging, Tekstur (skor 1-9)
- **1 Parameter Non-Visual:** Bau (tidak dinilai dari foto)

**FORMAT OUTPUT WAJIB:**
\`\`\`markdown
# Analisis Kesegaran: [NAMA IKAN]

QUALITY_CHECK: ✓ Enhanced sensitivity validation

## Identifikasi
**Spesies:** [Nama ikan yang teridentifikasi]

## Parameter Analysis

| Parameter | Kondisi Visual | Skor | Catatan |
|-----------|---------------|------|---------|
| **Mata** | [Deskripsi] | [1-9] | [Alasan skor] |
| **Insang** | [Deskripsi] | [1-9] | [Alasan skor] |
| **Lendir** | [Deskripsi] | [1-9] | [Alasan skor] |
| **Daging** | [Deskripsi] | [1-9] | [Alasan skor] |
| **Tekstur** | [Deskripsi] | [1-9] | [Alasan skor] |
| **Bau** | Tidak dapat dinilai dari foto | N/A | Memerlukan pemeriksaan fisik |

## Kesimpulan
- **Spesies:** [Nama ikan]
- **Skor Rata-rata:** [X.X]/9 (5 parameter visual)
- **Kategori:** [Prima/Baik/Sedang/Buruk]

VALIDATION_MARKER: ENHANCED_SENSITIVITY_APPLIED
\`\`\`

**PANDUAN SCORING SENSIF:**
- Skor 1-2: Kondisi sangat buruk (busuk, rusak parah)
- Skor 3-4: Kondisi buruk (tidak layak konsumsi)
- Skor 5-6: Kondisi sedang (kurang segar)
- Skor 7-8: Kondisi baik (segar)
- Skor 9: Kondisi prima (sangat segar)`,
    validationRules: [
      {
        type: 'structure',
        rule: 'Must contain fish name and parameter table',
        errorMessage: 'Missing fish name or parameter structure'
      },
      {
        type: 'parameter',
        rule: 'All visual parameters must have scores 1-9',
        errorMessage: 'Invalid scoring for visual parameters'
      },
      {
        type: 'content',
        rule: 'Must identify fish species/name',
        errorMessage: 'Fish species identification missing'
      }
    ]
  },
  {
    id: 'species-identification-v3',
    name: 'Enhanced Species Identification',
    type: 'species',
    sensitivity: SENSITIVITY_PROFILES.species,
    qualityMarkers: [
      'ENTERPRISE_SPECIES_ID',
      'MORPHOLOGICAL_ANALYSIS',
      'ENHANCED_ACCURACY'
    ],
    template: `**IDENTIFIKASI SPESIES IKAN - Enhanced System**

QUALITY_CONTROL_MARKER: ENTERPRISE_SPECIES_V3

Identifikasi spesies ikan berdasarkan ciri morfologi yang terlihat pada gambar.

**INSTRUKSI ANALISIS:**
- Fokus pada ciri visual yang jelas terlihat
- Berikan nama spesies yang paling sesuai
- Sertakan confidence level berdasarkan kejelasan ciri
- Jika tidak yakin, berikan kemungkinan alternatif

**FORMAT OUTPUT WAJIB:**
\`\`\`markdown
# Identifikasi Spesies Ikan

## Hasil Identifikasi
**Nama Spesies:** [Nama yang paling sesuai]
**Nama Ilmiah:** *[Genus species]* (jika diketahui)
**Famili:** [Famili taksonomi] (jika diketahui)
**Confidence:** [High/Medium/Low]

## Ciri Pembeda
- [Ciri morfologi utama yang terlihat]
- [Karakteristik khusus dari gambar]
- [Bentuk tubuh/sirip yang menonjol]

## Deskripsi
[Deskripsi singkat tentang spesies ini berdasarkan ciri yang terlihat]

VALIDATION_MARKER: SPECIES_ID_COMPLETE
\`\`\`

**PANDUAN CONFIDENCE:**
- High: Ciri sangat jelas dan khas
- Medium: Beberapa ciri terlihat jelas
- Low: Ciri kurang jelas atau ambigu`,
    validationRules: [
      {
        type: 'content',
        rule: 'Must provide species name',
        errorMessage: 'Species name missing'
      }
    ]
  },
  {
    id: 'comprehensive-analysis-v3',
    name: 'Enhanced Comprehensive Analysis',
    type: 'both',
    sensitivity: SENSITIVITY_PROFILES.both,
    qualityMarkers: [
      'ENTERPRISE_COMPREHENSIVE',
      'DUAL_VALIDATION',
      'ENHANCED_COMPLETE'
    ],
    template: `**ANALISIS KOMPREHENSIF IKAN (Enhanced)**

QUALITY_CONTROL_MARKER: ENTERPRISE_COMPREHENSIVE_V3

Lakukan identifikasi spesies DAN analisis kesegaran sekaligus.

**FORMAT OUTPUT:**
\`\`\`markdown
# Analisis Komprehensif: [NAMA IKAN]

## 1. IDENTIFIKASI SPESIES
**Nama Spesies:** [Nama ikan]
**Nama Ilmiah:** *[Genus species]*
**Confidence:** [Level]

## 2. ANALISIS KESEGARAN SNI 2729-2013

[Ikuti format tabel parameter seperti template freshness]

## 3. REKOMENDASI
- **Status:** [Layak/Tidak layak konsumsi]
- **Saran:** [Rekomendasi penggunaan]

VALIDATION_MARKER: COMPREHENSIVE_COMPLETE
\`\`\``,
    validationRules: [
      {
        type: 'structure',
        rule: 'Must contain both species ID and freshness analysis',
        errorMessage: 'Incomplete comprehensive analysis'
      }
    ]
  }
];

/**
 * Get enterprise prompt template by analysis type
 */
export function getEnterprisePromptTemplate(analysisType: 'species' | 'freshness' | 'both'): PromptTemplate {
  const templateMap = {
    'freshness': 'freshness-analysis-v3',
    'species': 'species-identification-v3', 
    'both': 'comprehensive-analysis-v3'
  };
  
  const template = ENTERPRISE_PROMPT_TEMPLATES.find(t => t.id === templateMap[analysisType]);
  if (!template) {
    throw new Error(`No enhanced template found for analysis type: ${analysisType}`);
  }
  return template;
}

/**
 * Validate AI response against template rules
 */
export function validateResponse(response: string, template: PromptTemplate): {
  isValid: boolean;
  errors: string[];
  qualityScore: number;
} {
  const errors: string[] = [];
  let qualityScore = 100;

  // Check for quality markers
  template.qualityMarkers.forEach(marker => {
    if (!response.includes(marker)) {
      errors.push(`Missing quality marker: ${marker}`);
      qualityScore -= 10;
    }
  });

  // Enhanced validation for fish name
  if (template.type === 'freshness' || template.type === 'both') {
    if (!response.match(/spesies[:\s]*[^\n\r]+/i) && !response.match(/nama[:\s]*[^\n\r]+/i)) {
      errors.push('Fish species name missing from analysis');
      qualityScore -= 15;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    qualityScore: Math.max(0, qualityScore)
  };
}

/**
 * Generate enterprise-grade prompt with quality control
 */
export function generateEnterprisePrompt(
  analysisType: 'species' | 'freshness' | 'both',
  imageQuality: 'high' | 'medium' | 'low' = 'medium'
): string {
  const template = getEnterprisePromptTemplate(analysisType);
  
  const qualityAdjustment = imageQuality === 'low' 
    ? '\n\n**PENYESUAIAN GAMBAR:** Gambar kurang jelas - berikan confidence lebih rendah dan fokus pada ciri yang terlihat jelas'
    : '';

  return template.template + qualityAdjustment;
}
