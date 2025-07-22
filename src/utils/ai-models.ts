export interface FishParameter {
  Mata: number;
  Insang: number;
  Lendir: number;
  Daging: number;
  Bau: number;
  Tekstur: number;
}

export interface FishSample extends FishParameter {
  Skor: number;
  Kategori: string;
  id?: string;
  timestamp?: number;
  fishName?: string;
}

export type FreshnessBadge = "Baik" | "Sedang" | "Buruk" | "Invalid";
export type FreshnessStatus = "success" | "warning" | "error" | "neutral";

// Parameter weights according to SNI standards
const parameterWeights = {
  Mata: 0.2,
  Insang: 0.2,
  Lendir: 0.15,
  Daging: 0.2,
  Bau: 0.15,
  Tekstur: 0.1,
};

// Function to calculate freshness based on SNI standards
export function calculateFreshness(params: FishParameter): FishSample {
  let totalScore = 0;
  let validParameters = 0;
  
  Object.entries(params).forEach(([key, value]) => {
    // Exclude value 4 as it's not valid in SNI standards
    if (value >= 1 && value <= 9 && value !== 4) { 
      totalScore += value;
      validParameters++;
    }
  });
  
  // Calculate average score if there are valid parameters
  const normalizedScore = validParameters > 0 
    ? parseFloat((totalScore / validParameters).toFixed(2))
    : 0;
  
  // Determine category based on normalized score
  const category = getFreshnessCategory(normalizedScore);
  
  return {
    ...params,
    Skor: normalizedScore,
    Kategori: category,
    id: generateId(),
    timestamp: Date.now(),
  };
}

// Generate a unique ID for each sample
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Get freshness category according to SNI standards
export function getFreshnessCategory(score: number): FreshnessBadge {
  if (score >= 8 && score <= 9) return "Baik";
  if (score >= 6 && score < 8) return "Sedang";
  if (score >= 4 && score < 6) return "Sedang";
  if (score >= 1 && score < 4) return "Buruk";
  return "Invalid"; // Only for score 0 or invalid calculations
}

// Adding the missing getFreshnessEmoji function that returns the appropriate icon based on freshness category
export function getFreshnessEmoji(category: FreshnessBadge): JSX.Element {
  switch (category) {
    case "Baik":
      return null; // Will be replaced with StatusIndicator component
    case "Sedang":
      return null; // Will be replaced with StatusIndicator component
    case "Buruk":
      return null; // Will be replaced with StatusIndicator component
    case "Invalid":
    default:
      return null; // Will be replaced with StatusIndicator component
  }
}

export function getFreshnessBadgeColor(category: FreshnessBadge): string {
  switch (category) {
    case "Baik":
      return "bg-green-500";
    case "Sedang":
      return "bg-amber-500";
    case "Buruk":
      return "bg-red-500";
    case "Invalid":
    default:
      return "bg-gray-500";
  }
}

// Convert FreshnessBadge to status for our StatusIndicator component
export function getFreshnessStatus(category: FreshnessBadge): FreshnessStatus {
  switch (category) {
    case "Baik":
      return "success";
    case "Sedang":
      return "warning";
    case "Buruk":
      return "error";
    case "Invalid":
    default:
      return "neutral";
  }
}

export function getFreshnessIndicator(category: FreshnessBadge): string {
  switch (category) {
    case "Baik":
      return "bg-green-500 animate-pulse";
    case "Sedang":
      return "bg-yellow-500 animate-pulse";
    case "Buruk":
      return "bg-red-500 animate-pulse";
    case "Invalid":
    default:
      return "bg-gray-500";
  }
}

export function getRecommendation(category: FreshnessBadge): string {
  switch (category) {
    case "Baik":
      return "Ikan dalam kondisi baik, sangat layak untuk dikonsumsi atau dijual.";
    case "Sedang":
      return "Ikan dalam kondisi sedang, disarankan untuk segera diolah atau dikonsumsi.";
    case "Buruk":
      return "Ikan dalam kondisi buruk, tidak layak untuk dikonsumsi atau dijual.";
    case "Invalid":
    default:
      return "Data tidak valid untuk analisis.";
  }
}

export function findBestParameter(data: FishSample[]): { parameter: string; score: number } {
  // Include all parameters in calculations, including value 4
  const paramAverages = Object.keys(parameterWeights).reduce<Record<string, number>>((acc, param) => {
    const validSamples = data;
    
    if (validSamples.length === 0) {
      acc[param] = 0;
      return acc;
    }
    
    acc[param] = validSamples.reduce((sum, item) => sum + item[param as keyof FishParameter], 0) / validSamples.length;
    return acc;
  }, {});

  const bestParam = Object.entries(paramAverages).reduce(
    (best, [param, score]) => (score > best.score ? { param, score } : best),
    { param: '', score: 0 }
  );

  return {
    parameter: bestParam.param,
    score: parseFloat(bestParam.score.toFixed(2)),
  };
}

export function generateCSV(data: FishSample[]): string {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(item => Object.values(item).join(','));
  return [headers, ...rows].join('\n');
}

export function parseCsvFile(csvContent: string): FishSample[] {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const sample = {} as any;
    
    headers.forEach((header, index) => {
      const value = values[index];
      sample[header.trim()] = isNaN(Number(value)) ? value : Number(value);
    });
    
    // Calculate score and category if not present
    if (!sample.Skor || !sample.Kategori) {
      const params: FishParameter = {
        Mata: sample.Mata || 0,
        Insang: sample.Insang || 0,
        Lendir: sample.Lendir || 0,
        Daging: sample.Daging || 0,
        Bau: sample.Bau || 0,
        Tekstur: sample.Tekstur || 0
      };
      
      const result = calculateFreshness(params);
      sample.Skor = result.Skor;
      sample.Kategori = result.Kategori;
      sample.id = result.id; // Add unique id for tracking
      sample.timestamp = result.timestamp; // Add timestamp
    }
    
    return sample as FishSample;
  });
}

// Sort fish samples by specified field
export function sortSamples(samples: FishSample[], field: keyof FishSample, ascending: boolean = true): FishSample[] {
  return [...samples].sort((a, b) => {
    if (ascending) {
      return a[field] > b[field] ? 1 : -1;
    } else {
      return a[field] < b[field] ? 1 : -1;
    }
  });
}

// Check if a sample has invalid value 4 in any parameter
export function hasInvalidValues(sample: FishSample): boolean {
  return Object.entries(sample).some(([key, value]) => {
    if (key !== 'id' && key !== 'Kategori' && key !== 'Skor' && key !== 'timestamp' && key !== 'fishName') {
      return value === 4;
    }
    return false;
  });
}

// Get a summary of parameters that are at value 4
export function getInvalidParametersList(sample: FishSample): string[] {
  return Object.entries(sample)
    .filter(([key, value]) => {
      if (key !== 'id' && key !== 'Kategori' && key !== 'Skor' && key !== 'timestamp' && key !== 'fishName') {
        return value === 4;
      }
      return false;
    })
    .map(([key]) => key);
}

export type AI_MODEL = 'neptune-flow' | 'coral-wave' | 'regal-tide';

export const AI_MODELS = {
    NEPTUNE_FLOW: "neptune-flow" as AI_MODEL,
    CORAL_WAVE: "coral-wave" as AI_MODEL,
    REGAL_TIDE: "regal-tide" as AI_MODEL,
} as const;

export const AVAILABLE_MODELS = [
    {
        id: AI_MODELS.NEPTUNE_FLOW,
        name: "Neptune Flow",
        description: "Model standar untuk identifikasi spesies ikan dan analisis kesegaran.",
        isPremium: false,
        iconType: "fish"
    },
    {
        id: AI_MODELS.CORAL_WAVE,
        name: "Coral Wave",
        description: "Model premium dengan akurasi lebih tinggi dan detail analisis yang lebih mendalam.",
        isPremium: true,
        iconType: "bot"
    },
    {
        id: AI_MODELS.REGAL_TIDE,
        name: "Regal Tide",
        description: "Model eksklusif dengan kemampuan analisis tercanggih dan fitur tambahan.",
        isPremium: true,
        iconType: "activity"
    },
] as const;

const FREE_TIER_LIMIT = 5;
const usageCounts: { [key: string]: number } = {
  "species-id": 0,
  "freshness": 0,
  "chat": 0,
};

export function trackFreeUsage(featureType: string): boolean {
  if (usageCounts[featureType] === undefined) {
    usageCounts[featureType] = 0;
  }

  if (usageCounts[featureType] < FREE_TIER_LIMIT) {
    usageCounts[featureType]++;
    return true;
  }

  return false;
}

// FIXED: Updated function to only check premium access from auth context
export function hasPremiumAccess(isPremium: boolean): boolean {
  return isPremium;
}

// This function can be used as fallback if the API call fails
export function simulateModelResponse(userMessage: string, modelId: AI_MODEL = AI_MODELS.NEPTUNE_FLOW): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      switch (modelId) {
        case AI_MODELS.NEPTUNE_FLOW:
            resolve(`
**Hasil Identifikasi Spesies Ikan:**

| Kategori             | Detail                                      |
| -------------------- | ------------------------------------------- |
| Nama Lokal           | Ikan Nila                                   |
| Nama Ilmiah          | *Oreochromis niloticus*                     |
| Famili               | Cichlidae                                   |
| Habitat Alami        | Air tawar, seperti sungai dan danau          |
| Karakteristik Utama  | Warna tubuh bervariasi, mudah beradaptasi   |
| Pemanfaatan          | Konsumsi, budidaya                          |
| Daerah Penyebaran    | Afrika, Asia (termasuk Indonesia)           |

**Analisis Tambahan:**
Ikan Nila (*Oreochromis niloticus*) adalah spesies ikan air tawar yang populer di kalangan petani ikan dan konsumen. Ikan ini dikenal karena pertumbuhannya yang cepat dan kemampuannya untuk beradaptasi dengan berbagai kondisi lingkungan.
`);
            break;
        case AI_MODELS.CORAL_WAVE:
            resolve(`
**Hasil Identifikasi Spesies Ikan:**

| Kategori             | Detail                                                                 |
| -------------------- | ---------------------------------------------------------------------- |
| Nama Lokal           | Ikan Lele Dumbo                                                        |
| Nama Ilmiah          | *Clarias gariepinus*                                                   |
| Famili               | Clariidae                                                              |
| Habitat Alami        | Rawa, sungai, dan danau dengan air tenang                               |
| Karakteristik Utama  | Memiliki sungut panjang, kulit licin, toleran terhadap kualitas air rendah |
| Pemanfaatan          | Konsumsi, budidaya                                                     |
| Daerah Penyebaran    | Afrika, Asia (termasuk Indonesia)                                      |

**Analisis Tambahan:**
Ikan Lele Dumbo (*Clarias gariepinus*) adalah varietas lele yang populer di Indonesia. Ikan ini memiliki pertumbuhan yang sangat cepat dan mudah dipelihara, menjadikannya pilihan yang baik untuk budidaya.
`);
            break;
        case AI_MODELS.REGAL_TIDE:
            resolve(`
**Hasil Identifikasi Spesies Ikan:**

| Kategori             | Detail                                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Nama Lokal           | Ikan Tuna Sirip Kuning                                                                                                               |
| Nama Ilmiah          | *Thunnus albacares*                                                                                                                  |
| Famili               | Scombridae                                                                                                                           |
| Habitat Alami        | Laut tropis dan subtropis                                                                                                            |
| Karakteristik Utama  | Sirip kuning mencolok, tubuh ramping, perenang cepat                                                                                 |
| Pemanfaatan          | Konsumsi (sushi, sashimi, steak), perikanan komersial                                                                               |
| Daerah Penyebaran    | Samudra Pasifik, Samudra Hindia, Samudra Atlantik                                                                                    |

**Analisis Tambahan:**
Ikan Tuna Sirip Kuning (*Thunnus albacares*) adalah spesies tuna yang sangat dihargai karena dagingnya yang berkualitas tinggi. Ikan ini merupakan target penting dalam perikanan komersial dan sering dikonsumsi dalam bentuk sushi dan sashimi.
`);
            break;
        default:
            resolve("Tidak dapat mengidentifikasi spesies ikan.");
      }
    }, 1500);
  });
}

/**
 * Get optimized prompts for VisionFish AI analysis - ENTERPRISE VERSION
 */
export function getModelPrompt(modelId: AI_MODEL, isSpeciesId: boolean): string {
  const speciesPrompt = `ANALISIS IDENTIFIKASI SPESIES IKAN - VISIONFISH AI

INSTRUKSI: Berikan identifikasi spesies ikan yang akurat dan meyakinkan dalam format tabel terstruktur.

**WAJIB GUNAKAN FORMAT TABEL BERIKUT:**

| Kategori | Detail |
|----------|--------|
| **Nama Spesies** | [Nama spesies yang paling sesuai] |
| **Nama Ilmiah** | *[Nama ilmiah lengkap dengan author]* |
| **Famili** | [Nama famili taksonomi] |
| **Habitat Alami** | [Habitat spesifik dengan detail ekologi] |
| **Karakteristik Utama** | [Ciri khas yang dapat diidentifikasi dari foto] |
| **Distribusi** | [Wilayah penyebaran geografis] |
| **Nilai Ekonomi** | [Kegunaan komersial dan budidaya] |
| **Status Konservasi** | [Status populasi jika diketahui] |

**Tingkat Keyakinan Identifikasi:** [Tinggi/Sedang/Rendah] - [Alasan singkat]

**Kesimpulan:** [1-2 kalimat definitif tentang identifikasi species]

ATURAN KHUSUS:
- Fokus HANYA pada identifikasi spesies, BUKAN analisis kesegaran
- Hindari kata "kemungkinan" atau "mungkin" - berikan identifikasi yang meyakinkan
- Jika tingkat keyakinan rendah, sebutkan ciri yang perlu konfirmasi lebih lanjut
- Gunakan bahasa Indonesia yang profesional dan mudah dipahami
- Jika bukan ikan: "BUKAN IKAN: [penjelasan singkat apa yang terlihat dalam gambar]"`;

  const freshnessPrompt = `ANALISIS KESEGARAN IKAN - STANDAR SNI 2729-2013

INSTRUKSI: Berikan analisis kesegaran ikan yang komprehensif berdasarkan parameter SNI yang dapat dinilai dari foto.

**WAJIB GUNAKAN FORMAT TABEL PARAMETER SNI:**

| Parameter | Kondisi Teramati | Skor SNI | Keterangan |
|-----------|------------------|----------|------------|
| **Mata** | [Kondisi mata ikan] | [1-3, 5-9] | [Cembung/rata/cekung, jernih/keruh] |
| **Insang** | [Kondisi insang] | [1-3, 5-9] | [Merah cerah/pucat/coklat/abu-abu] |
| **Lendir Permukaan** | [Kondisi lendir tubuh] | [1-3, 5-9] | [Jernih/agak keruh/keruh/sangat keruh] |
| **Kulit** | [Kondisi permukaan kulit] | [1-3, 5-9] | [Mengkilap/agak kusam/kusam/sangat kusam] |

**PARAMETER NON-VISUAL (Estimasi Berdasarkan Indikator Visual):**
| Parameter | Estimasi Kondisi | Skor SNI | Catatan |
|-----------|------------------|----------|---------|
| **Daging** | [Perkiraan elastisitas] | [1-3, 5-9] | *Estimasi berdasarkan bentuk tubuh |
| **Bau** | [Perkiraan berdasarkan visual] | [1-3, 5-9] | *Tidak dapat dinilai langsung dari foto |

**PANDUAN PENILAIAN SNI:**
- **Skor 9:** Prima - Kondisi sangat segar
- **Skor 7-8:** Baik - Kondisi segar
- **Skor 5-6:** Sedang - Kurang segar, perlu segera diolah
- **Skor 1-3:** Buruk - Tidak segar, tidak layak konsumsi
- **Nilai 4 DIABAIKAN** sesuai standar SNI

**HASIL ANALISIS:**
| Aspek | Nilai | Keterangan |
|-------|-------|------------|
| **Skor Rata-rata** | [X.X] | Berdasarkan parameter yang dapat dinilai |
| **Kategori Kesegaran** | **[Prima/Baik/Sedang/Buruk]** | Sesuai SNI 2729-2013 |
| **Rekomendasi** | [Tindakan yang disarankan] | Konsumsi langsung/olah segera/hindari |

**Keterbatasan Analisis Visual:**
Parameter bau dan tekstur daging tidak dapat dinilai secara akurat dari foto. Analisis ini fokus pada indikator visual yang dapat diamati sesuai standar SNI 2729-2013.

**Kesimpulan:** [Ringkasan kondisi kesegaran dengan rekomendasi praktis berdasarkan SNI]

ATURAN KHUSUS:
- Berikan penilaian yang realistis berdasarkan apa yang dapat dilihat
- Jelaskan keterbatasan analisis visual dengan transparan
- Gunakan skala SNI 1-9 (hindari nilai 4 sesuai standar)
- Fokus pada parameter yang dapat dinilai secara visual
- Jika bukan ikan: "BUKAN IKAN: [deskripsi objek yang terlihat]"`;

  const combinedPrompt = `ANALISIS LENGKAP IKAN - IDENTIFIKASI SPESIES & KESEGARAN SNI

INSTRUKSI: Berikan analisis komprehensif yang mencakup identifikasi spesies dan penilaian kesegaran sesuai standar SNI 2729-2013.

## BAGIAN 1: IDENTIFIKASI SPESIES

| Kategori | Detail |
|----------|--------|
| **Nama Spesies** | [Nama spesies yang teridentifikasi] |
| **Nama Ilmiah** | *[Nama ilmiah lengkap]* |
| **Famili** | [Famili taksonomi] |
| **Karakteristik** | [Ciri khas yang dapat diidentifikasi] |
| **Habitat** | [Habitat alami spesies] |

## BAGIAN 2: ANALISIS KESEGARAN (SNI 2729-2013)

| Parameter Visual | Kondisi | Skor SNI | Keterangan |
|------------------|---------|----------|------------|
| **Mata** | [Kondisi mata] | [1-3, 5-9] | [Jernih/keruh/cekung] |
| **Insang** | [Warna insang] | [1-3, 5-9] | [Merah/pucat/coklat] |
| **Lendir** | [Kondisi lendir] | [1-3, 5-9] | [Jernih/keruh/lengket] |
| **Kulit** | [Kondisi kulit] | [1-3, 5-9] | [Mengkilap/kusam] |

| Parameter Non-Visual | Estimasi | Skor SNI | Catatan |
|---------------------|----------|----------|---------|
| **Daging** | [Perkiraan elastisitas] | [1-3, 5-9] | *Estimasi berdasarkan bentuk |
| **Bau** | [Perkiraan] | [1-3, 5-9] | *Tidak dapat dinilai dari foto |

## HASIL GABUNGAN

| Aspek | Nilai | Status |
|-------|-------|--------|
| **Spesies** | [Nama spesies] | ✓ Teridentifikasi |
| **Skor Kesegaran** | [X.X] | [Prima/Baik/Sedang/Buruk] |
| **Rekomendasi** | [Saran penggunaan] | [Konsumsi/olah/hindari] |

**Keterbatasan Analisis:**
Analisis ini berdasarkan parameter visual. Parameter bau dan tekstur memerlukan pemeriksaan fisik langsung sesuai standar SNI 2729-2013.

**Kesimpulan:** [Ringkasan lengkap identifikasi dan kondisi kesegaran dengan rekomendasi praktis]

ATURAN KHUSUS:
- Berikan identifikasi spesies yang meyakinkan
- Analisis kesegaran sesuai standar SNI 2729-2013
- Transparansi mengenai keterbatasan analisis foto
- Jika bukan ikan: "BUKAN IKAN: [deskripsi objek yang terlihat]"`;

  // Model-specific enhancements
  const getEnhancedPrompt = (basePrompt: string) => {
    switch (modelId) {
      case AI_MODELS.CORAL_WAVE:
        return `${basePrompt}\n\n**ENHANCEMENT MODE - CORAL WAVE:**\nTambahkan detail ilmiah tambahan, reference ke literatur jika memungkinkan, dan analisis morfologi yang lebih mendalam.`;
      case AI_MODELS.REGAL_TIDE:
        return `${basePrompt}\n\n**PREMIUM MODE - REGAL TIDE:**\nBerikan analisis paling komprehensif dengan detail ekologi, nilai ekonomi, rekomendasi budidaya, dan insight mendalam tentang spesies.`;
      default:
        return basePrompt;
    }
  };

  if (isSpeciesId) {
    return getEnhancedPrompt(speciesPrompt);
  } else {
    return getEnhancedPrompt(freshnessPrompt);
  }
}

// Combined analysis prompt helper
export function getCombinedAnalysisPrompt(modelId: AI_MODEL): string {
  const combinedPrompt = `ANALISIS LENGKAP IKAN - IDENTIFIKASI SPESIES & KESEGARAN SNI

INSTRUKSI: Berikan analisis komprehensif yang mencakup identifikasi spesies dan penilaian kesegaran sesuai standar SNI 2729-2013.

## BAGIAN 1: IDENTIFIKASI SPESIES

| Kategori | Detail |
|----------|--------|
| **Nama Spesies** | [Nama spesies yang teridentifikasi] |
| **Nama Ilmiah** | *[Nama ilmiah lengkap]* |
| **Famili** | [Famili taksonomi] |
| **Karakteristik** | [Ciri khas yang dapat diidentifikasi] |
| **Habitat** | [Habitat alami spesies] |

## BAGIAN 2: ANALISIS KESEGARAN (SNI 2729-2013)

| Parameter Visual | Kondisi | Skor SNI | Keterangan |
|------------------|---------|----------|------------|
| **Mata** | [Kondisi mata] | [1-3, 5-9] | [Jernih/keruh/cekung] |
| **Insang** | [Warna insang] | [1-3, 5-9] | [Merah/pucat/coklat] |
| **Lendir** | [Kondisi lendir] | [1-3, 5-9] | [Jernih/keruh/lengket] |
| **Kulit** | [Kondisi kulit] | [1-3, 5-9] | [Mengkilap/kusam] |

| Parameter Non-Visual | Estimasi | Skor SNI | Catatan |
|---------------------|----------|----------|---------|
| **Daging** | [Perkiraan elastisitas] | [1-3, 5-9] | *Estimasi berdasarkan bentuk |
| **Bau** | [Perkiraan] | [1-3, 5-9] | *Tidak dapat dinilai dari foto |

## HASIL GABUNGAN

| Aspek | Nilai | Status |
|-------|-------|--------|
| **Spesies** | [Nama spesies] | ✓ Teridentifikasi |
| **Skor Kesegaran** | [X.X] | [Prima/Baik/Sedang/Buruk] |
| **Rekomendasi** | [Saran penggunaan] | [Konsumsi/olah/hindari] |

**Keterbatasan Analisis:**
Analisis ini berdasarkan parameter visual. Parameter bau dan tekstur memerlukan pemeriksaan fisik langsung sesuai standar SNI 2729-2013.

**Kesimpulan:** [Ringkasan lengkap identifikasi dan kondisi kesegaran dengan rekomendasi praktis]

ATURAN KHUSUS:
- Berikan identifikasi spesies yang meyakinkan
- Analisis kesegaran sesuai standar SNI 2729-2013
- Transparansi mengenai keterbatasan analisis foto
- Jika bukan ikan: "BUKAN IKAN: [deskripsi objek yang terlihat]"`;

  switch (modelId) {
    case AI_MODELS.CORAL_WAVE:
      return `${combinedPrompt}\n\n**ENHANCEMENT MODE - CORAL WAVE:**\nTambahkan detail ilmiah tambahan dan analisis morfologi yang lebih mendalam.`;
    case AI_MODELS.REGAL_TIDE:
      return `${combinedPrompt}\n\n**PREMIUM MODE - REGAL TIDE:**\nBerikan analisis paling komprehensif dengan insight mendalam dan rekomendasi praktis.`;
    default:
      return combinedPrompt;
  }
}
