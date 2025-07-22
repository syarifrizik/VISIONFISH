
export interface WeatherExplanation {
  explanation: string;
  example: string;
  actionable: string;
  severity: 'low' | 'medium' | 'high';
  references?: string[];
}

export interface WeatherReference {
  id: string;
  title: string;
  authors: string;
  year: number;
  journal: string;
  quote?: string;
  url?: string;
}

export const weatherReferences: Record<string, WeatherReference[]> = {
  suhu: [
    {
      id: 'temp-1',
      title: 'Pengaruh Suhu Air terhadap Aktivitas Ikan Tropis',
      authors: 'Sari, D.P., et al.',
      year: 2021,
      journal: 'Jurnal Perikanan Indonesia',
      quote: 'Suhu optimal 28-30°C meningkatkan aktivitas feeding ikan hingga 85%',
      url: 'https://example.com/research1'
    }
  ],
  kelembaban: [
    {
      id: 'humid-1',
      title: 'Kelembaban dan Pola Makan Ikan Air Tawar',
      authors: 'Pratama, A.S.',
      year: 2022,
      journal: 'Indonesian Fisheries Research',
      quote: 'Kelembaban 60-70% memberikan kondisi optimal untuk aktivitas perikanan',
      url: 'https://example.com/research2'
    }
  ],
  angin: [],
  tekanan: [],
  kondisi: []
};

export const generateTemperatureExplanation = (temperature: number): WeatherExplanation => {
  if (temperature < 20) {
    return {
      explanation: "Suhu rendah - kurang ideal untuk aktivitas memancing",
      example: "Ikan cenderung kurang aktif mencari makan pada suhu dibawah 20°C",
      actionable: "Pertimbangkan menunda aktivitas atau gunakan umpan yang lebih menarik",
      severity: 'medium',
      references: ['temp-1']
    };
  } else if (temperature >= 20 && temperature <= 30) {
    return {
      explanation: "Suhu optimal untuk memancing - ikan lebih aktif",
      example: "Kondisi suhu ideal meningkatkan peluang tangkapan hingga 80%",
      actionable: "Manfaatkan kondisi optimal ini untuk aktivitas memancing",
      severity: 'low',
      references: ['temp-1']
    };
  } else {
    return {
      explanation: "Suhu tinggi - ikan cenderung kurang aktif di siang hari",
      example: "Pada suhu tinggi, ikan biasanya berada di kedalaman atau tempat teduh",
      actionable: "Coba memancing di pagi atau sore hari, atau di tempat yang lebih dalam",
      severity: 'medium',
      references: ['temp-1']
    };
  }
};

export const generateHumidityExplanation = (humidity: number): WeatherExplanation => {
  if (humidity < 40) {
    return {
      explanation: "Kelembaban rendah - cuaca kering, baik untuk memancing",
      example: "Kondisi kering membuat ikan lebih mudah terdeteksi di permukaan",
      actionable: "Kondisi baik untuk memancing, pastikan hidrasi yang cukup",
      severity: 'low'
    };
  } else if (humidity >= 40 && humidity <= 70) {
    return {
      explanation: "Kelembaban ideal untuk aktivitas memancing",
      example: "Kelembaban optimal meningkatkan kenyamanan dan aktivitas ikan",
      actionable: "Kondisi sangat baik untuk memancing dalam waktu lama",
      severity: 'low',
      references: ['humid-1']
    };
  } else {
    return {
      explanation: "Kelembaban tinggi - kemungkinan hujan, siapkan perlengkapan",
      example: "Kelembaban tinggi sering diikuti hujan yang dapat mempengaruhi aktivitas",
      actionable: "Siapkan perlengkapan hujan dan pantau perubahan cuaca",
      severity: 'medium'
    };
  }
};

export const generateWindExplanation = (windSpeed: number): WeatherExplanation => {
  if (windSpeed < 5) {
    return {
      explanation: "Angin tenang - ideal untuk memancing",
      example: "Kondisi tenang memudahkan penggunaan umpan dan deteksi strike",
      actionable: "Kondisi sangat baik untuk semua teknik memancing",
      severity: 'low'
    };
  } else if (windSpeed >= 5 && windSpeed <= 15) {
    return {
      explanation: "Angin sedang - kondisi baik untuk memancing",
      example: "Angin ringan dapat membantu oksigenasi air dan aktivitas ikan",
      actionable: "Sesuaikan teknik casting dengan arah angin",
      severity: 'low'
    };
  } else {
    return {
      explanation: "Angin kencang - hati-hati saat memancing",
      example: "Angin kencang dapat menyulitkan casting dan membahayakan keselamatan",
      actionable: "Pertimbangkan lokasi terlindung atau tunda aktivitas",
      severity: 'high'
    };
  }
};

export const generatePressureExplanation = (pressure: number): WeatherExplanation => {
  if (pressure < 1010) {
    return {
      explanation: "Tekanan rendah - ikan mungkin kurang aktif",
      example: "Tekanan rendah sering membuat ikan turun ke kedalaman",
      actionable: "Gunakan umpan yang tenggelam atau pancing di kedalaman",
      severity: 'medium'
    };
  } else if (pressure >= 1010 && pressure <= 1020) {
    return {
      explanation: "Tekanan ideal - kondisi baik untuk memancing",
      example: "Tekanan stabil membuat ikan beraktivitas normal",
      actionable: "Kondisi optimal untuk berbagai teknik memancing",
      severity: 'low'
    };
  } else {
    return {
      explanation: "Tekanan tinggi - cuaca stabil, baik untuk memancing",
      example: "Tekanan tinggi biasanya diikuti cuaca cerah dan stabil",
      actionable: "Manfaatkan kondisi stabil untuk memancing jangka panjang",
      severity: 'low'
    };
  }
};

export const generateConditionExplanation = (condition: string, temperature: number, humidity: number): WeatherExplanation => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('cerah') || conditionLower.includes('clear')) {
    return {
      explanation: "Cuaca cerah - kondisi excellent untuk memancing",
      example: "Cuaca cerah memungkinkan visibilitas baik dan aktivitas ikan optimal",
      actionable: "Kondisi terbaik untuk memancing, manfaatkan sepanjang hari",
      severity: 'low'
    };
  } else if (conditionLower.includes('berawan') || conditionLower.includes('cloud')) {
    return {
      explanation: "Berawan - kondisi baik, ikan aktif di cuaca mendung",
      example: "Cuaca berawan sering membuat ikan lebih berani ke permukaan",
      actionable: "Kondisi baik untuk memancing, terutama ikan permukaan",
      severity: 'low'
    };
  } else if (conditionLower.includes('hujan') || conditionLower.includes('rain')) {
    return {
      explanation: "Hujan - hati-hati, tapi ikan sering aktif saat hujan ringan",
      example: "Hujan ringan dapat meningkatkan oksigen dan aktivitas ikan",
      actionable: "Jika aman, coba memancing saat hujan ringan dengan perlengkapan tahan air",
      severity: 'high'
    };
  } else {
    return {
      explanation: "Pantau kondisi cuaca untuk keamanan memancing",
      example: "Kondisi cuaca tidak biasa memerlukan perhatian ekstra",
      actionable: "Pantau perkembangan cuaca dan prioritaskan keselamatan",
      severity: 'medium'
    };
  }
};
