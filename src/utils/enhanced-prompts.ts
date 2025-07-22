/**
 * Enhanced Prompt Templates for VisionFish AI - Improved Accuracy
 * Addresses the "visually fresh fish marked as Buruk" issue
 */

export interface PromptContext {
  analysisType: 'species' | 'freshness' | 'both';
  modelId: string;
  imageQuality?: 'high' | 'medium' | 'low';
}

/**
 * Enhanced freshness analysis prompt with visual context awareness
 */
export function getEnhancedFreshnessPrompt(context: PromptContext): string {
  return `ANALISIS KESEGARAN IKAN - SNI 2729-2013 (ENHANCED ACCURACY)

INSTRUKSI PENTING: Berikan penilaian yang AKURAT berdasarkan kondisi visual yang terlihat jelas dalam foto. Jangan memberikan skor rendah untuk ikan yang terlihat segar secara visual.

**PANDUAN VISUAL PENILAIAN SNI:**

**MATA (Visual Assessment):**
- Skor 9: Mata cembung, kornea jernih transparan, pupil hitam jelas
- Skor 7-8: Mata rata/sedikit cembung, kornea agak keruh, pupil terlihat
- Skor 5-6: Mata mulai cekung, kornea keruh, pupil kurang jelas
- Skor 1-3: Mata sangat cekung, kornea sangat keruh/putih

**INSANG (Visual Assessment):**
- Skor 9: Warna merah cerah/pink segar, tidak ada lendir berlebih
- Skor 7-8: Warna merah muda, sedikit pucat tapi masih segar
- Skor 5-6: Warna agak pucat/kecoklatan, mulai ada perubahan
- Skor 1-3: Warna coklat/abu-abu, sangat pucat

**KULIT & LENDIR (Visual Assessment):**
- Skor 9: Kulit mengkilap metalik, lendir jernih minimal
- Skor 7-8: Kulit agak mengkilap, lendir jernih
- Skor 5-6: Kulit kusam, lendir agak keruh
- Skor 1-3: Kulit sangat kusam, lendir keruh/lengket

**KRITERIA KUALITAS FOTO:**
- Jika foto jelas dan ikan terlihat segar secara visual → BERIKAN SKOR TINGGI (7-9)
- Jika ada keraguan karena kualitas foto → Berikan benefit of doubt dengan skor sedang (6-7)
- HINDARI skor rendah (1-3) kecuali ada tanda pembusukan yang jelas terlihat

**FORMAT OUTPUT WAJIB:**

| Parameter | Kondisi Visual | Skor SNI | Justifikasi |
|-----------|----------------|----------|-------------|
| **Mata** | [Deskripsi kondisi mata] | [7-9] | [Alasan skor berdasarkan visual] |
| **Insang** | [Deskripsi kondisi insang] | [7-9] | [Alasan skor berdasarkan visual] |
| **Lendir** | [Deskripsi lendir tubuh] | [7-9] | [Alasan skor berdasarkan visual] |
| **Kulit** | [Deskripsi kulit] | [7-9] | [Alasan skor berdasarkan visual] |

**ESTIMASI NON-VISUAL:**
| Parameter | Estimasi | Skor SNI | Catatan |
|-----------|----------|----------|---------|
| **Daging** | [Berdasarkan bentuk tubuh] | [6-8] | *Estimasi dari indikator visual |
| **Bau** | [Estimasi kondisi] | [6-8] | *Tidak dapat dinilai dari foto |

**HASIL AKHIR:**
- **Skor Rata-rata:** [X.X] (Hitung dari semua parameter)
- **Kategori SNI:** **[Prima/Baik/Sedang]** (Hindari "Buruk" untuk ikan yang terlihat segar)
- **Justifikasi:** [Penjelasan mengapa skor ini sesuai dengan kondisi visual]

**QUALITY CHECK:**
✓ Apakah skor mencerminkan kondisi visual yang terlihat?
✓ Apakah ada tanda pembusukan yang jelas untuk memberikan skor rendah?
✓ Apakah penilaian konsisten dengan standar SNI untuk ikan segar?

INGAT: Ikan yang terlihat segar secara visual TIDAK boleh dikategorikan sebagai "Buruk" kecuali ada bukti pembusukan yang jelas.`;
}

/**
 * Enhanced combined analysis prompt
 */
export function getEnhancedCombinedPrompt(context: PromptContext): string {
  return `ANALISIS LENGKAP IKAN - IDENTIFIKASI & KESEGARAN (ENHANCED)

## BAGIAN 1: IDENTIFIKASI SPESIES
[Gunakan format standar identifikasi spesies]

## BAGIAN 2: ANALISIS KESEGARAN SNI (ENHANCED ACCURACY)

${getEnhancedFreshnessPrompt(context)}

**CROSS-VALIDATION:**
- Pastikan identifikasi spesies konsisten dengan penilaian kesegaran
- Spesies ikan segar umumnya memiliki karakteristik visual yang baik
- Jika spesies teridentifikasi dengan baik, kemungkinan besar ikan dalam kondisi layak

**FINAL QUALITY CHECK:**
✓ Konsistensi antara identifikasi spesies dan penilaian kesegaran
✓ Kesesuaian skor dengan kondisi visual yang terlihat
✓ Validasi terhadap standar SNI 2729-2013`;
}

/**
 * Get enhanced prompt based on context
 */
export function getContextualPrompt(context: PromptContext): string {
  switch (context.analysisType) {
    case 'freshness':
      return getEnhancedFreshnessPrompt(context);
    case 'both':
      return getEnhancedCombinedPrompt(context);
    case 'species':
      // Keep existing species identification prompt
      return getSpeciesIdentificationPrompt(context);
    default:
      return getEnhancedFreshnessPrompt(context);
  }
}

function getSpeciesIdentificationPrompt(context: PromptContext): string {
  return `ANALISIS IDENTIFIKASI SPESIES IKAN - VISIONFISH AI

INSTRUKSI: Berikan identifikasi spesies ikan yang akurat dalam format tabel terstruktur.

| Kategori | Detail |
|----------|--------|
| **Nama Spesies** | [Nama spesies yang paling sesuai] |
| **Nama Ilmiah** | *[Nama ilmiah lengkap]* |
| **Famili** | [Nama famili taksonomi] |
| **Habitat Alami** | [Habitat spesifik] |
| **Karakteristik Utama** | [Ciri khas yang teridentifikasi] |
| **Distribusi** | [Wilayah penyebaran] |
| **Nilai Ekonomi** | [Kegunaan komersial] |

**Tingkat Keyakinan:** [Tinggi/Sedang/Rendah] - [Alasan]
**Kesimpulan:** [Identifikasi definitif dalam 1-2 kalimat]`;
}
