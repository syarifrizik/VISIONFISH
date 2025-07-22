
export interface FishParameter {
  Mata: number | null;
  Insang: number | null;
  Lendir: number | null;
  Daging: number | null;
  Bau: number | null;
  Tekstur: number | null;
}

export interface FishSample extends FishParameter {
  id: string;
  Skor: number;
  Kategori: string;
  timestamp: string;
  fishName?: string;
  aiResponse?: string | null;
}

export const calculateFreshness = (parameters: FishParameter): FishSample => {
  // Include all 6 parameters that have non-null values (like Excel format)
  const validParams = Object.entries(parameters).filter(([_, value]) => 
    value !== null
  ) as Array<[keyof FishParameter, number]>;
  
  if (validParams.length === 0) {
    return {
      id: `sample_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...parameters,
      Skor: 0,
      Kategori: 'Invalid',
      timestamp: new Date().toISOString(),
    };
  }

  // Calculate exactly like Excel: sum all parameters / count of parameters
  const totalScore = validParams.reduce((sum, [_, value]) => sum + value, 0);
  const averageScore = totalScore / validParams.length;
  
  // Updated categorization matching 4-category system
  let category: string;
  if (averageScore >= 8) {
    category = 'Sangat Baik';
  } else if (averageScore >= 6) {
    category = 'Baik';
  } else if (averageScore >= 4) {
    category = 'Sedang';
  } else {
    category = 'Busuk';
  }

  return {
    id: `sample_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...parameters,
    Skor: parseFloat(averageScore.toFixed(2)),
    Kategori: category,
    timestamp: new Date().toISOString(),
  };
};

export const findBestParameter = (samples: FishSample[]): { parameter: string; score: number } => {
  const parameterScores: { [key: string]: number[] } = {
    Mata: [],
    Insang: [],
    Lendir: [],
    Daging: [],
    Bau: [],
    Tekstur: [],
  };

  samples.forEach(sample => {
    for (const key in parameterScores) {
      const value = sample[key as keyof FishParameter];
      if (typeof value === 'number') {
        parameterScores[key].push(value);
      }
    }
  });

  let bestParameter = '';
  let bestAverageScore = 0;

  for (const key in parameterScores) {
    const scores = parameterScores[key];
    if (scores.length > 0) {
      const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      if (averageScore > bestAverageScore) {
        bestAverageScore = averageScore;
        bestParameter = key;
      }
    }
  }

  return { parameter: bestParameter, score: parseFloat(bestAverageScore.toFixed(2)) };
};

export const generateCSV = (data: FishSample[]): string => {
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header as keyof FishSample];
      return value;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};

export const parseCsvFile = (csvContent: string): FishSample[] => {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  const data: FishSample[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(value => value.trim());
    const sample: Partial<FishSample> = {};

    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      const value = values[j];

      if (header === 'Mata' || header === 'Insang' || header === 'Lendir' || header === 'Daging' || header === 'Bau' || header === 'Tekstur') {
        const numValue = parseInt(value);
        sample[header] = isNaN(numValue) ? null : numValue;
      } else if (header === 'Skor') {
        sample[header] = parseFloat(value);
      } else {
        sample[header] = value;
      }
    }

    // Basic validation to ensure required fields are present
    if (sample.Mata !== undefined && sample.Insang !== undefined && sample.Lendir !== undefined &&
        sample.Daging !== undefined && sample.Bau !== undefined && sample.Tekstur !== undefined) {
      
      const result = calculateFreshness(sample as FishParameter);
      data.push(result);
    }
  }

  return data as FishSample[];
};

export const sortSamples = (samples: FishSample[], field: keyof FishSample, ascending: boolean): FishSample[] => {
  return [...samples].sort((a, b) => {
    const valueA = a[field];
    const valueB = b[field];

    if (valueA === null && valueB === null) return 0;
    if (valueA === null) return ascending ? -1 : 1;
    if (valueB === null) return ascending ? 1 : -1;

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return ascending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    } else if (typeof valueA === 'number' && typeof valueB === 'number') {
      return ascending ? valueA - valueB : valueB - valueA;
    } else {
      return 0;
    }
  });
};

export const getFreshnessBadgeColor = (category: string): string => {
  switch (category) {
    case 'Sangat Baik':
    case 'Prima':
      return 'bg-blue-100 text-blue-800';
    case 'Baik':
      return 'bg-green-100 text-green-800';
    case 'Sedang':
      return 'bg-yellow-100 text-yellow-800';
    case 'Busuk':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getFreshnessStatus = (score: number): string => {
    if (score >= 8) {
        return 'Very Fresh';
    } else if (score >= 6) {
        return 'Fresh';
    } else if (score >= 4) {
        return 'Acceptable';
    } else {
        return 'Spoiled';
    }
};

// Add missing functions that other components are trying to import
export const getRecommendation = (category: string): string => {
  switch (category) {
    case 'Sangat Baik':
    case 'Prima':
      return 'Ikan dalam kondisi sangat baik, layak untuk dikonsumsi dan dijual.';
    case 'Baik':
      return 'Ikan dalam kondisi baik, masih layak untuk dikonsumsi.';
    case 'Sedang':
      return 'Ikan dalam kondisi sedang, disarankan untuk segera diolah.';
    case 'Busuk':
      return 'Ikan dalam kondisi buruk, tidak layak untuk dikonsumsi.';
    default:
      return 'Status tidak diketahui.';
  }
};

export const getDetailedExplanation = (category: string): string => {
  switch (category) {
    case 'Sangat Baik':
    case 'Prima':
      return 'Berdasarkan analisis parameter visual, ikan ini menunjukkan ciri-ciri kesegaran optimal. Mata jernih dan menonjol, insang berwarna merah cerah, tekstur daging elastis dan padat, serta tidak ada tanda-tanda pembusukan. Ikan ini sangat aman untuk dikonsumsi dan memiliki nilai gizi yang tinggi.';
    case 'Baik':
      return 'Ikan ini masih dalam kondisi segar dengan sebagian besar parameter menunjukkan kualitas yang baik. Meskipun ada beberapa parameter yang sedikit menurun, secara keseluruhan ikan masih layak konsumsi dan aman untuk diolah menjadi berbagai hidangan.';
    case 'Sedang':
      return 'Ikan menunjukkan tanda-tanda penurunan kesegaran dengan beberapa parameter berada di batas toleransi. Disarankan untuk segera mengolah atau mengonsumsi ikan ini. Pastikan memasak dengan suhu yang cukup tinggi untuk memastikan keamanan pangan.';
    case 'Busuk':
      return 'Ikan menunjukkan tanda-tanda pembusukan yang jelas dengan multiple parameter di bawah standar keamanan. Mata cekung dan keruh, insang pucat atau kehitaman, tekstur daging lunak, dan kemungkinan berbau tidak sedap. Ikan ini tidak aman untuk dikonsumsi dan sebaiknya dibuang.';
    default:
      return 'Tidak dapat memberikan penjelasan untuk kategori yang tidak dikenal.';
  }
};

export const hasInvalidValues = (sample: FishSample): boolean => {
  return Object.entries(sample).some(([key, value]) => {
    if (key !== 'id' && key !== 'Kategori' && key !== 'Skor' && key !== 'timestamp' && key !== 'fishName' && key !== 'aiResponse') {
      return value === 4;
    }
    return false;
  });
};

export const getInvalidParametersList = (sample: FishSample): string[] => {
  return Object.entries(sample)
    .filter(([key, value]) => {
      if (key !== 'id' && key !== 'Kategori' && key !== 'Skor' && key !== 'timestamp' && key !== 'fishName' && key !== 'aiResponse') {
        return value === 4;
      }
      return false;
    })
    .map(([key]) => key);
};
