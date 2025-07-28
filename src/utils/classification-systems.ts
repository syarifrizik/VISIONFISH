/**
 * Dual Classification System for Fish Quality Assessment
 * Based on SNI 2729:2013 and Hadiwiyoto 1993
 */

export interface ClassificationResult {
  sni: {
    category: 'Baik' | 'Kurang';
    description: string;
    threshold: number;
  };
  hadiwiyoto: {
    category: 'Prima' | 'Advance' | 'Sedang' | 'Busuk';
    description: string;
    range: string;
  };
  score: number;
}

export const classifyFishQuality = (score: number): ClassificationResult => {
  // SNI 2729:2013 Classification (Simple Binary)
  const sniCategory = score >= 7 ? 'Baik' : 'Kurang';
  const sniDescription = score >= 7 
    ? 'Memenuhi standar SNI untuk ikan segar' 
    : 'Di bawah standar minimal SNI';

  // Hadiwiyoto 1993 Classification (4 Categories)
  let hadiwiyotoCategory: 'Prima' | 'Advance' | 'Sedang' | 'Busuk';
  let hadiwiyotoDescription: string;
  let hadiwiyotoRange: string;

  if (score >= 8) {
    hadiwiyotoCategory = 'Prima';
    hadiwiyotoDescription = 'Kualitas sangat baik, optimal untuk konsumsi';
    hadiwiyotoRange = '8-9';
  } else if (score >= 6) {
    hadiwiyotoCategory = 'Advance';
    hadiwiyotoDescription = 'Kualitas baik, layak untuk konsumsi';
    hadiwiyotoRange = '6-7.9';
  } else if (score >= 4) {
    hadiwiyotoCategory = 'Sedang';
    hadiwiyotoDescription = 'Kualitas sedang, segera olah';
    hadiwiyotoRange = '4-5.9';
  } else {
    hadiwiyotoCategory = 'Busuk';
    hadiwiyotoDescription = 'Tidak layak konsumsi';
    hadiwiyotoRange = '1-3.9';
  }

  return {
    sni: {
      category: sniCategory,
      description: sniDescription,
      threshold: 7
    },
    hadiwiyoto: {
      category: hadiwiyotoCategory,
      description: hadiwiyotoDescription,
      range: hadiwiyotoRange
    },
    score: parseFloat(score.toFixed(2))
  };
};

export const getSNIStatus = (score: number): 'Baik' | 'Kurang' => {
  return score >= 7 ? 'Baik' : 'Kurang';
};

export const getHadiwiyotoCategory = (score: number): 'Prima' | 'Advance' | 'Sedang' | 'Busuk' => {
  if (score >= 8) return 'Prima';
  if (score >= 6) return 'Advance';
  if (score >= 4) return 'Sedang';
  return 'Busuk';
};

export const getClassificationComparison = (score: number) => {
  const classification = classifyFishQuality(score);
  
  return {
    score,
    sni: classification.sni,
    hadiwiyoto: classification.hadiwiyoto,
    summary: `SNI: ${classification.sni.category} | Hadiwiyoto: ${classification.hadiwiyoto.category}`,
    recommendation: score >= 7 
      ? 'Memenuhi standar nasional dan berkualitas baik'
      : 'Perlu perhatian khusus dalam pengolahan'
  };
};