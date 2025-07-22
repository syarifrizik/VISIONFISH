/**
 * Enhanced Prompt Engineering for AI Consistency
 * Structured prompts with strict output format and validation rules
 */

import { AnalysisType } from '@/components/species/DualAnalysisSelector';

/**
 * Enhanced prompt templates with strict output format
 */
export const CONSISTENCY_PROMPTS = {
  species: `SISTEM IDENTIFIKASI SPESIES IKAN - MODE KONSISTEN

INSTRUKSI WAJIB:
1. Gunakan format output PERSIS seperti contoh
2. Jangan variasi kata-kata atau struktur
3. Selalu sertakan confidence level yang sama untuk kondisi serupa

FORMAT OUTPUT WAJIB:
**Nama Spesies**: [Nama dalam Bahasa Indonesia]
**Nama Ilmiah**: [Nama Latin] 
**Famili**: [Nama famili]
**Confidence**: [TINGGI/SEDANG/RENDAH]

CIRI PEMBEDA:
- [Ciri spesifik 1]
- [Ciri spesifik 2]
- [Ciri spesifik 3]

DESKRIPSI:
[Deskripsi singkat dan konsisten]

ATURAN KONSISTENSI:
- Jika ikan jelas terlihat = CONFIDENCE: TINGGI
- Jika ada keraguan minor = CONFIDENCE: SEDANG  
- Jika sulit diidentifikasi = CONFIDENCE: RENDAH
- Selalu gunakan nama Indonesia yang sama untuk spesies yang sama
- Konsisten dalam penulisan nama ilmiah

Analisis gambar berikut:`,

  freshness: `SISTEM ANALISIS KESEGARAN IKAN - MODE KONSISTEN SNI 2729-2013

INSTRUKSI WAJIB:
1. Gunakan skala scoring yang SAMA untuk kondisi serupa
2. Format output harus PERSIS sama setiap analisis
3. Kategori harus konsisten: SEGAR/KURANG SEGAR/TIDAK SEGAR

FORMAT OUTPUT WAJIB:
**Spesies**: [Nama ikan atau "Tidak teridentifikasi"]
**Skor Keseluruhan**: [X.X]/9
**Kategori**: [SEGAR/KURANG SEGAR/TIDAK SEGAR]

PARAMETER SNI 2729-2013:
| Parameter | Kondisi | Skor | Status |
|-----------|---------|------|--------|
| **Mata** | [Deskripsi] | [1-3] | [Visual/Non-Visual] |
| **Insang** | [Deskripsi] | [1-3] | [Visual/Non-Visual] |
| **Kulit** | [Deskripsi] | [1-3] | [Visual/Non-Visual] |
| **Daging** | [Deskripsi] | [1-3] | [Visual/Non-Visual] |
| **Bau** | [Deskripsi] | [1-3] | [Non-Visual] |

ATURAN SCORING KONSISTEN:
- Mata jernih, menonjol = 3 poin
- Mata sedikit keruh = 2 poin  
- Mata sangat keruh/cekung = 1 poin
- Insang merah cerah = 3 poin
- Insang merah gelap = 2 poin
- Insang coklat/hitam = 1 poin

KATEGORI FINAL:
- 7.5-9.0 = SEGAR
- 5.0-7.4 = KURANG SEGAR  
- 1.0-4.9 = TIDAK SEGAR

Analisis gambar berikut:`,

  both: `SISTEM ANALISIS GABUNGAN - MODE KONSISTEN

BAGIAN 1 - IDENTIFIKASI SPESIES:
[Gunakan format spesies di atas]

BAGIAN 2 - ANALISIS KESEGARAN:
[Gunakan format freshness di atas]

ATURAN KONSISTENSI GABUNGAN:
- Identifikasi spesies DULU, baru analisis kesegaran
- Gunakan nama spesies yang konsisten di kedua bagian
- Scoring kesegaran disesuaikan dengan karakteristik spesies
- Format output harus identik setiap analisis

Analisis gambar berikut:`
};

/**
 * Get enhanced consistent prompt
 */
export function getConsistentPrompt(analysisType: AnalysisType): string {
  return CONSISTENCY_PROMPTS[analysisType];
}

/**
 * Validation rules for output format
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  confidence: number;
  hasRequiredElements: boolean;
}

export function validateConsistentOutput(
  output: string, 
  analysisType: AnalysisType
): ValidationResult {
  const errors: string[] = [];
  let confidence = 100;
  
  if (analysisType === 'species' || analysisType === 'both') {
    // Check species format
    if (!output.includes('**Nama Spesies**')) {
      errors.push('Missing species name format');
      confidence -= 30;
    }
    
    if (!output.includes('**Confidence**')) {
      errors.push('Missing confidence indicator');
      confidence -= 20;
    }
    
    if (!output.includes('CIRI PEMBEDA:')) {
      errors.push('Missing characteristics section');
      confidence -= 15;
    }
  }
  
  if (analysisType === 'freshness' || analysisType === 'both') {
    // Check freshness format
    if (!output.includes('**Skor Keseluruhan**')) {
      errors.push('Missing overall score');
      confidence -= 30;
    }
    
    if (!output.includes('**Kategori**')) {
      errors.push('Missing category classification');
      confidence -= 25;
    }
    
    const hasTable = output.includes('| Parameter |') && 
                     output.includes('| **Mata** |');
    if (!hasTable) {
      errors.push('Missing parameter table');
      confidence -= 20;
    }
  }
  
  // Check for consistency keywords
  const consistencyKeywords = ['SNI 2729-2013', 'Visual', 'Non-Visual'];
  const foundKeywords = consistencyKeywords.filter(keyword => 
    output.includes(keyword)
  ).length;
  
  if (foundKeywords < 2) {
    errors.push('Missing consistency keywords');
    confidence -= 10;
  }
  
  const hasRequiredElements = errors.length === 0;
  const isValid = errors.length < 2 && confidence > 50;
  
  return {
    isValid,
    errors,
    confidence: Math.max(0, confidence),
    hasRequiredElements
  };
}

/**
 * Post-process output for better consistency
 */
export function normalizeOutput(output: string, analysisType: AnalysisType): string {
  let normalized = output;
  
  // Standardize confidence levels
  normalized = normalized.replace(/confidence:\s*(very\s*high|tinggi\s*sekali)/gi, 'CONFIDENCE: TINGGI');
  normalized = normalized.replace(/confidence:\s*(high|tinggi)/gi, 'CONFIDENCE: TINGGI');
  normalized = normalized.replace(/confidence:\s*(medium|sedang)/gi, 'CONFIDENCE: SEDANG');
  normalized = normalized.replace(/confidence:\s*(low|rendah)/gi, 'CONFIDENCE: RENDAH');
  
  // Standardize categories for freshness
  if (analysisType === 'freshness' || analysisType === 'both') {
    normalized = normalized.replace(/kategori:\s*(fresh|segar|baik)/gi, 'KATEGORI: SEGAR');
    normalized = normalized.replace(/kategori:\s*(medium|sedang|kurang\s*segar)/gi, 'KATEGORI: KURANG SEGAR');
    normalized = normalized.replace(/kategori:\s*(poor|buruk|tidak\s*segar|rusak)/gi, 'KATEGORI: TIDAK SEGAR');
  }
  
  // Ensure consistent table formatting
  if (normalized.includes('| Parameter |')) {
    // Normalize table spacing
    normalized = normalized.replace(/\|\s*Parameter\s*\|/g, '| Parameter |');
    normalized = normalized.replace(/\|\s*Kondisi\s*\|/g, '| Kondisi |');
    normalized = normalized.replace(/\|\s*Skor\s*\|/g, '| Skor |');
    normalized = normalized.replace(/\|\s*Status\s*\|/g, '| Status |');
  }
  
  return normalized;
}