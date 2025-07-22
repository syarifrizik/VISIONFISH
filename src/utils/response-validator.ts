/**
 * Utility to validate and optimize AI responses for token efficiency
 */

export interface ValidationResult {
  isValid: boolean;
  optimizedText: string;
  tokensSaved: number;
}

export function validateAndOptimizeResponse(response: string, maxLength: number = 1000): ValidationResult {
  const originalLength = response.length;
  let optimized = response.trim();
  
  // Remove redundant phrases
  const redundantPhrases = [
    'Berdasarkan analisis gambar',
    'Dari hasil observasi',
    'Berdasarkan pengamatan visual',
    'Setelah menganalisis gambar',
    'Berdasarkan ciri-ciri yang terlihat'
  ];
  
  redundantPhrases.forEach(phrase => {
    const regex = new RegExp(phrase + '[^.]*\\.', 'gi');
    optimized = optimized.replace(regex, '');
  });
  
  // Preserve table structure but optimize surrounding text
  if (optimized.includes('|') && optimized.includes('---')) {
    const tableMatch = optimized.match(/\|[\s\S]*?\|[\s\S]*?\n\s*\n/);
    if (tableMatch) {
      const tableContent = tableMatch[0];
      const beforeTable = optimized.substring(0, optimized.indexOf(tableContent));
      const afterTable = optimized.substring(optimized.indexOf(tableContent) + tableContent.length);
      
      // Keep minimal context before table
      const minimalBefore = beforeTable.length > 50 ? 
        beforeTable.substring(0, 50) + '...\n\n' : beforeTable;
      
      // Keep essential conclusion after table
      const minimalAfter = afterTable.length > 100 ? 
        afterTable.substring(0, 100) + '...' : afterTable;
      
      optimized = minimalBefore + tableContent + minimalAfter;
    }
  }
  
  // Final length check
  if (optimized.length > maxLength) {
    optimized = optimized.substring(0, maxLength - 3) + '...';
  }
  
  const tokensSaved = Math.max(0, originalLength - optimized.length);
  
  return {
    isValid: optimized.length > 0,
    optimizedText: optimized,
    tokensSaved
  };
}

export function isResponseRelevant(response: string, type: 'species' | 'freshness'): boolean {
  const lowerResponse = response.toLowerCase();
  
  if (type === 'species') {
    return lowerResponse.includes('ikan') || 
           lowerResponse.includes('fish') || 
           lowerResponse.includes('spesies') ||
           lowerResponse.includes('nama ilmiah');
  } else {
    return lowerResponse.includes('parameter') || 
           lowerResponse.includes('skor') || 
           lowerResponse.includes('kesegaran') ||
           lowerResponse.includes('mata') ||
           lowerResponse.includes('insang');
  }
}

export function extractTableFromResponse(response: string): string | null {
  // Extract table content from response
  const tableMatch = response.match(/\|[\s\S]*?\|[\s\S]*?\n(?:\s*\n|$)/);
  return tableMatch ? tableMatch[0].trim() : null;
}

export function countTokensApprox(text: string): number {
  // Rough approximation: 1 token ≈ 4 characters for Indonesian text
  return Math.ceil(text.length / 4);
}
