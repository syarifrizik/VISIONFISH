/**
 * Enhanced Prompts V2 - SNI 2729-2013 Corrected Parameters
 * Addresses visual vs non-visual parameter analysis accuracy
 */

import { generateParameterAnalysisPrompt } from './parameter-classification';

export interface PromptContextV2 {
  analysisType: 'species' | 'freshness' | 'both';
  modelId: string;
  imageQuality?: 'high' | 'medium' | 'low';
  includeParameterClassification?: boolean;
}

/**
 * Corrected freshness analysis with SNI 2729-2013 parameters
 */
export function getLogicalFreshnessPrompt(context: PromptContextV2): string {
  const parameterPrompt = generateParameterAnalysisPrompt();
  
  return `${parameterPrompt}

**PROTOKOL ANALISIS SNI 2729-2013 (CORRECTED):**

1. **EVALUASI 3 PARAMETER VISUAL (High-Medium Confidence)**
   - Fokus pada Mata, Insang, Lendir
   - Berikan skor akurat berdasarkan kondisi visual
   - Gunakan indikator visual yang jelas

2. **ESTIMASI 3 PARAMETER NON-VISUAL (Low-Impossible Confidence)**
   - Daging: Estimasi konservatif dari bentuk visual
   - Bau: Estimasi berdasarkan korelasi dengan parameter visual
   - Tekstur: Estimasi konservatif dari penampakan permukaan
   - SELALU sertakan disclaimer tentang keterbatasan

3. **QUALITY ASSURANCE CHECKS:**
   ✓ Apakah 3 parameter visual mencerminkan kondisi foto?
   ✓ Apakah estimasi 3 parameter non-visual masuk akal dan konservatif?
   ✓ Apakah disclaimer keterbatasan sudah disertakan?

**FINAL OUTPUT FORMAT:**

## Hasil Analisis Kesegaran Ikan SNI 2729-2013 (Corrected)

### Parameter Visual (Dapat Dianalisis dari Foto - 3 Parameter)
| Parameter | Kondisi | Skor | Confidence | Basis Analisis |
|-----------|---------|------|------------|----------------|
| **Mata** | [Kondisi mata] | [1-9] | High | Analisis visual langsung |
| **Insang** | [Kondisi insang] | [1-9] | High | Analisis visual langsung |
| **Lendir** | [Kondisi lendir] | [1-9] | Medium | Inferensi dari kilap permukaan |

### Parameter Non-Visual (Estimasi - 3 Parameter)
| Parameter | Estimasi | Skor | Confidence | Disclaimer |
|-----------|----------|------|------------|------------|
| **Daging** | [Estimasi dari bentuk] | [6-7] | Low | *Elastisitas tidak dapat dinilai dari foto |
| **Bau** | [Estimasi dari kondisi visual] | [6-7] | Impossible | *Aroma tidak dapat dinilai dari foto |
| **Tekstur** | [Estimasi dari permukaan] | [6-7] | Low | *Kekasaran tidak dapat dinilai dari foto |

### Kesimpulan SNI 2729-2013
- **Skor Visual Rata-rata (Akurat):** [X.X] dari 3 parameter visual
- **Skor Keseluruhan (Estimasi):** [X.X] termasuk 3 parameter non-visual
- **Kategori Berdasarkan Visual:** [Prima/Baik/Sedang/Buruk]
- **Rekomendasi:** Berdasarkan parameter visual yang dapat dipercaya

**DISCLAIMER SNI 2729-2013:** 
Analisis ini terbatas pada 3 parameter visual. Parameter Daging, Bau, dan Tekstur memerlukan pemeriksaan fisik langsung sesuai standar SNI 2729-2013.`;
}

/**
 * Get contextual prompt with logical classification
 */
export function getLogicalContextualPrompt(context: PromptContextV2): string {
  switch (context.analysisType) {
    case 'freshness':
      return getLogicalFreshnessPrompt(context);
    case 'both':
      return getCombinedLogicalPrompt(context);
    case 'species':
      return getSpeciesIdentificationPrompt(context);
    default:
      return getLogicalFreshnessPrompt(context);
  }
}

function getCombinedLogicalPrompt(context: PromptContextV2): string {
  return `## ANALISIS LENGKAP IKAN - IDENTIFIKASI & KESEGARAN (LOGICAL)

### BAGIAN 1: IDENTIFIKASI SPESIES
[Lakukan identifikasi spesies dengan format standar]

### BAGIAN 2: ANALISIS KESEGARAN DENGAN KLASIFIKASI LOGIS

${getLogicalFreshnessPrompt(context)}

**CROSS-VALIDATION LOGIS:**
- Pastikan identifikasi spesies konsisten dengan kondisi kesegaran
- Spesies yang teridentifikasi dengan baik umumnya dalam kondisi visual yang baik
- Validasi logika: ikan yang rusak sulit diidentifikasi spesiesnya`;
}

function getSpeciesIdentificationPrompt(context: PromptContextV2): string {
  return `## ANALISIS IDENTIFIKASI SPESIES IKAN - ENHANCED ACCURACY

**PROTOKOL IDENTIFIKASI VISUAL:**

1. **Analisis Morfologi Utama**
   - Bentuk tubuh secara keseluruhan
   - Proporsi panjang vs tinggi tubuh
   - Bentuk kepala dan mulut

2. **Karakteristik Sirip**
   - Jumlah dan posisi sirip
   - Bentuk sirip ekor
   - Ukuran relatif sirip

3. **Pola Warna dan Sisik**
   - Pola warna alami (bukan akibat pembusukan)
   - Jenis dan ukuran sisik
   - Garis lateral

4. **Identifikasi Berdasarkan Habitat**
   - Ciri-ciri ikan air tawar vs air laut
   - Adaptasi morfologi terhadap habitat

**OUTPUT FORMAT:**
| Kategori | Detail |
|----------|--------|
| **Nama Spesies** | [Nama yang paling sesuai] |
| **Nama Ilmiah** | *[Nama ilmiah]* |
| **Famili** | [Famili taksonomi] |
| **Habitat** | [Air tawar/laut/payau] |
| **Ciri Khas** | [Karakteristik utama] |
| **Confidence** | [High/Medium/Low] |
| **Basis Identifikasi** | [Fitur yang digunakan untuk identifikasi] |

**Tingkat Keyakinan:** [Tinggi/Sedang/Rendah] - [Alasan spesifik]`;
}
