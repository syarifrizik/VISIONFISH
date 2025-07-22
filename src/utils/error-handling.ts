/**
 * Enhanced error handling utility for VisionFish AI
 */

export type ErrorType = 'api_quota' | 'network' | 'invalid_key' | 'unknown';

export interface ErrorInfo {
  type: ErrorType;
  message: string;
  shouldRetry: boolean;
  needsUpgrade: boolean;
  needsAdminAction: boolean;
}

export const analyzeError = (error: any): ErrorInfo => {
  const errorMessage = error?.message || error?.toString() || '';
  const lowerMessage = errorMessage.toLowerCase();

  // API Quota exceeded
  if (lowerMessage.includes('quota') || 
      lowerMessage.includes('limit exceeded') ||
      lowerMessage.includes('batas') ||
      lowerMessage.includes('usage limit')) {
    return {
      type: 'api_quota',
      message: 'Kuota API harian telah habis. Upgrade ke Premium untuk akses unlimited.',
      shouldRetry: false,
      needsUpgrade: true,
      needsAdminAction: true
    };
  }

  // Network/Connection issues
  if (lowerMessage.includes('network') ||
      lowerMessage.includes('connection') ||
      lowerMessage.includes('timeout') ||
      lowerMessage.includes('fetch') ||
      lowerMessage.includes('tidak tersedia')) {
    return {
      type: 'network',
      message: 'Terjadi masalah koneksi. Periksa internet Anda dan coba lagi.',
      shouldRetry: true,
      needsUpgrade: false,
      needsAdminAction: false
    };
  }

  // API Key issues
  if (lowerMessage.includes('api key') ||
      lowerMessage.includes('unauthorized') ||
      lowerMessage.includes('forbidden') ||
      lowerMessage.includes('invalid key') ||
      lowerMessage.includes('authentication')) {
    return {
      type: 'invalid_key',
      message: 'API key tidak valid atau expired. Hubungi administrator.',
      shouldRetry: false,
      needsUpgrade: false,
      needsAdminAction: true
    };
  }

  // Unknown error
  return {
    type: 'unknown',
    message: 'Terjadi kesalahan sistem. Tim teknis sedang menangani masalah ini.',
    shouldRetry: true,
    needsUpgrade: false,
    needsAdminAction: false
  };
};

export const getRetryDelay = (errorType: ErrorType, attemptCount: number): number => {
  const baseDelays = {
    'api_quota': 0, // Don't retry quota errors
    'network': 2000, // 2 seconds
    'invalid_key': 0, // Don't retry key errors
    'unknown': 1000 // 1 second
  };

  const baseDelay = baseDelays[errorType];
  if (baseDelay === 0) return 0;

  // Exponential backoff with jitter
  const exponentialDelay = baseDelay * Math.pow(2, attemptCount - 1);
  const jitter = Math.random() * 1000; // Add randomness
  
  return Math.min(exponentialDelay + jitter, 10000); // Max 10 seconds
};

export const formatErrorForUser = (errorInfo: ErrorInfo): string => {
  const baseMessage = errorInfo.message;
  
  let actionMessage = '';
  if (errorInfo.needsUpgrade) {
    actionMessage = ' Upgrade ke Premium untuk mengatasi masalah ini.';
  } else if (errorInfo.needsAdminAction) {
    actionMessage = ' Hubungi administrator untuk bantuan lebih lanjut.';
  } else if (errorInfo.shouldRetry) {
    actionMessage = ' Silakan coba lagi dalam beberapa menit.';
  }

  return baseMessage + actionMessage;
};

export const shouldShowUpgradePrompt = (errorType: ErrorType): boolean => {
  return errorType === 'api_quota';
};

export const shouldShowAdminSettings = (errorType: ErrorType): boolean => {
  return errorType === 'invalid_key' || errorType === 'api_quota';
};

export const getErrorRecommendations = (errorType: ErrorType): string[] => {
  switch (errorType) {
    case 'api_quota':
      return [
        'Upgrade ke Premium untuk akses unlimited',
        'Tunggu hingga kuota direset (24 jam)',
        'Administrator dapat menambah API key premium'
      ];
    case 'network':
      return [
        'Periksa koneksi internet Anda',
        'Coba lagi dalam beberapa menit',
        'Pastikan gambar tidak terlalu besar (max 5MB)'
      ];
    case 'invalid_key':
      return [
        'Administrator perlu memperbarui API key',
        'Hubungi admin untuk konfigurasi ulang',
        'Upgrade premium untuk API key dedicated'
      ];
    default:
      return [
        'Sistem sedang dalam mode recovery',
        'Coba lagi dalam beberapa menit',
        'Hubungi support jika masalah berlanjut'
      ];
  }
};