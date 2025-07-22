
/**
 * Parameter Classification System for VisionFish AI
 * Based on SNI 2729-2013 - Corrected parameter list
 */

export interface ParameterClassification {
  name: string;
  type: 'visual' | 'non-visual' | 'hybrid';
  reliability: 'high' | 'medium' | 'low' | 'impossible';
  analysisMethod: 'direct' | 'inference' | 'estimation' | 'impossible';
  description: string;
  visualIndicators?: string[];
  limitations?: string[];
}

export const PARAMETER_CLASSIFICATIONS: Record<string, ParameterClassification> = {
  mata: {
    name: 'Mata',
    type: 'visual',
    reliability: 'high',
    analysisMethod: 'direct',
    description: 'Dapat dianalisis langsung dari foto dengan akurasi tinggi',
    visualIndicators: ['Kejernihan kornea', 'Bentuk mata (cembung/cekung)', 'Warna pupil'],
    limitations: ['Kualitas foto mempengaruhi akurasi', 'Sudut pengambilan gambar']
  },
  insang: {
    name: 'Insang',
    type: 'visual',
    reliability: 'high',
    analysisMethod: 'direct',
    description: 'Dapat dianalisis langsung dari warna dan kondisi visual',
    visualIndicators: ['Warna (merah cerah/pucat)', 'Tekstur permukaan', 'Kelembaban visual'],
    limitations: ['Perlu foto yang jelas pada area insang', 'Pencahayaan mempengaruhi persepsi warna']
  },
  lendir: {
    name: 'Lendir',
    type: 'visual',
    reliability: 'medium',
    analysisMethod: 'inference',
    description: 'Dapat diestimasikan dari indikator visual permukaan tubuh',
    visualIndicators: ['Kilap permukaan', 'Tekstur visual', 'Refleksi cahaya'],
    limitations: ['Sulit membedakan antara air dan lendir alami', 'Interpretasi subjektif']
  },
  daging: {
    name: 'Daging',
    type: 'non-visual',
    reliability: 'low',
    analysisMethod: 'estimation',
    description: 'TIDAK dapat dianalisis dari foto - elastisitas memerlukan sentuhan fisik',
    visualIndicators: ['Bentuk tubuh', 'Tonus otot visual'],
    limitations: ['Tidak dapat menilai elastisitas', 'Tidak dapat menilai kekenyalan', 'Estimasi berdasarkan penampakan luar saja']
  },
  bau: {
    name: 'Bau',
    type: 'non-visual',
    reliability: 'impossible',
    analysisMethod: 'impossible',
    description: 'TIDAK MUNGKIN dianalisis dari foto - memerlukan indra penciuman',
    visualIndicators: ['Kondisi mata dan insang sebagai indikator tidak langsung'],
    limitations: ['Tidak dapat mencium aroma dari foto', 'Estimasi berdasarkan korelasi visual sangat tidak akurat']
  },
  tekstur: {
    name: 'Tekstur',
    type: 'non-visual',
    reliability: 'low',
    analysisMethod: 'estimation',
    description: 'TIDAK dapat dianalisis dari foto - tekstur memerlukan sentuhan fisik',
    visualIndicators: ['Penampakan permukaan kulit'],
    limitations: ['Tidak dapat menilai kekasaran/kehalusan aktual', 'Tekstur visual ≠ tekstur fisik', 'Estimasi berdasarkan penampakan saja']
  }
};

export function getParameterReliability(paramName: string): ParameterClassification {
  const param = paramName.toLowerCase();
  return PARAMETER_CLASSIFICATIONS[param] || {
    name: paramName,
    type: 'visual',
    reliability: 'medium',
    analysisMethod: 'direct',
    description: 'Parameter tidak terdefinisi dalam SNI 2729-2013'
  };
}

export function getConfidenceScore(paramName: string, visualQuality: 'high' | 'medium' | 'low'): number {
  const classification = getParameterReliability(paramName);
  
  const baseScores = {
    visual: { high: 0.9, medium: 0.8, low: 0.6 },
    'non-visual': { high: 0.2, medium: 0.15, low: 0.1 }
  };
  
  return baseScores[classification.type][visualQuality];
}

export function generateParameterAnalysisPrompt(): string {
  return `
## ANALISIS PARAMETER IKAN BERDASARKAN SNI 2729-2013 (CORRECTED)

**PARAMETER YANG DAPAT DIANALISIS SECARA VISUAL (3 Parameter):**

1. **MATA** (Visual - High Confidence)
   - Analisis: Kejernihan kornea, bentuk mata, warna pupil
   - Indikator: Cembung/cekung, jernih/keruh, pupil hitam/abu-abu
   - Skor: 9 (prima), 7-8 (baik), 5-6 (sedang), 1-3 (buruk)

2. **INSANG** (Visual - High Confidence)
   - Analisis: Warna dan kondisi visual insang
   - Indikator: Merah cerah (segar), pucat/coklat (menurun)
   - Skor: 9 (merah cerah), 7-8 (agak pucat), 5-6 (pucat), 1-3 (coklat/abu)

3. **LENDIR** (Visual - Medium Confidence)
   - Analisis: Estimasi dari kilap permukaan
   - Indikator: Kilap alami, tidak berlebihan
   - Skor: 9 (jernih normal), 7-8 (agak keruh), 5-6 (keruh), 1-3 (lengket/berbusa)

**PARAMETER YANG TIDAK DAPAT DIANALISIS DARI FOTO (3 Parameter):**

4. **DAGING** (Non-Visual - Low Confidence)
   - Limitasi: TIDAK dapat menilai elastisitas dari foto
   - Estimasi: Berdasarkan bentuk tubuh saja
   - Skor: 6-7 (estimasi konservatif), SELALU TAMBAHKAN DISCLAIMER

5. **BAU** (Non-Visual - Impossible)
   - Limitasi: TIDAK MUNGKIN mencium aroma dari foto
   - Estimasi: Berdasarkan korelasi dengan mata/insang
   - Skor: 6-7 (estimasi berdasarkan parameter visual), SELALU TAMBAHKAN DISCLAIMER

6. **TEKSTUR** (Non-Visual - Low Confidence)
   - Limitasi: TIDAK dapat menilai kekasaran/kehalusan dari foto
   - Estimasi: Berdasarkan penampakan permukaan saja
   - Skor: 6-7 (estimasi konservatif), SELALU TAMBAHKAN DISCLAIMER

**FORMAT OUTPUT SNI 2729-2013 YANG DIHARUSKAN:**

| Parameter | Tipe Analisis | Kondisi Visual | Skor SNI | Confidence | Keterangan |
|-----------|---------------|----------------|----------|------------|------------|
| **Mata** | Visual Langsung | [Deskripsi] | [1-9] | High | Analisis akurat dari foto |
| **Insang** | Visual Langsung | [Deskripsi] | [1-9] | High | Analisis akurat dari foto |
| **Lendir** | Visual Inferensi | [Deskripsi] | [1-9] | Medium | Estimasi dari kilap permukaan |
| **Daging** | Estimasi | [Deskripsi] | [6-7] | Low | *Tidak dapat dianalisis dari foto |
| **Bau** | Estimasi | [Deskripsi] | [6-7] | Impossible | *Tidak dapat dianalisis dari foto |
| **Tekstur** | Estimasi | [Deskripsi] | [6-7] | Low | *Tidak dapat dianalisis dari foto |

**PERHITUNGAN SKOR AKHIR:**
- **Skor Visual (Akurat):** Rata-rata dari Mata + Insang + Lendir (3 parameter)
- **Skor Keseluruhan (Estimasi):** Termasuk estimasi 3 parameter non-visual
- **Rekomendasi:** Berdasarkan skor visual yang dapat dipercaya

**DISCLAIMER WAJIB:**
- Parameter Daging, Bau, dan Tekstur TIDAK dapat dianalisis akurat dari foto
- Skor untuk 3 parameter non-visual adalah estimasi berdasarkan korelasi
- Untuk penilaian SNI 2729-2013 yang akurat, diperlukan pemeriksaan fisik langsung
`;
}
