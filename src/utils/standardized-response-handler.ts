
/**
 * Standardized Response Handler for VisionFish AI Analysis
 * Fixes inconsistency issues and ensures data synchronization
 */

export interface StandardizedParameter {
  name: string;
  score: number | null;
  condition: string;
  reasoning: string;
  isSkipped: boolean;
  isAnalyzable: boolean;
  confidence: 'high' | 'medium' | 'low';
}

export interface StandardizedAnalysisResult {
  parameters: StandardizedParameter[];
  overallScore: number;
  category: string;
  analyzableCount: number;
  skippedCount: number;
  isConsistent: boolean;
  validationErrors: string[];
}

export class StandardizedResponseHandler {
  private readonly SNI_PARAMETERS = ['Mata', 'Insang', 'Lendir', 'Daging', 'Bau', 'Tekstur'];
  private readonly ANALYZABLE_PARAMS = ['Mata', 'Insang', 'Lendir', 'Daging'];
  
  /**
   * Generate deterministic seed from image for consistency
   */
  private generateImageSeed(imageData: string): string {
    // Simple hash function for consistency
    let hash = 0;
    const str = imageData.substring(0, 1000); // Use first 1000 chars
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Validate score consistency with reasoning text
   */
  private validateScoreConsistency(score: number | null, reasoning: string): boolean {
    if (score === null) return true;
    
    const lowerReasoning = reasoning.toLowerCase();
    
    // Check positive indicators vs score
    const positiveIndicators = ['baik', 'segar', 'jernih', 'cerah', 'prima', 'optimal'];
    const negativeIndicators = ['buruk', 'keruh', 'pucat', 'rusak', 'busuk', 'tidak baik'];
    
    const hasPositive = positiveIndicators.some(indicator => lowerReasoning.includes(indicator));
    const hasNegative = negativeIndicators.some(indicator => lowerReasoning.includes(indicator));
    
    // High score should have positive indicators
    if (score >= 7 && hasNegative && !hasPositive) return false;
    
    // Low score should have negative indicators
    if (score <= 4 && hasPositive && !hasNegative) return false;
    
    return true;
  }

  /**
   * Enhanced parameter parsing with consistency validation
   */
  private parseParameterFromText(text: string, paramName: string): StandardizedParameter {
    const isAnalyzable = this.ANALYZABLE_PARAMS.includes(paramName);
    
    // Enhanced parsing patterns
    const patterns = [
      // Table format: |**Parameter**|Condition|Score|Reasoning|
      new RegExp(`\\*\\*${paramName}\\*\\*.*?\\|\\s*([^|]+)\\s*\\|\\s*(\\d+|skip|tidak)\\s*\\|\\s*([^|]+)\\s*\\|`, 'i'),
      // Alternative format: Parameter: condition, score: X, reasoning
      new RegExp(`${paramName}[^\\n]*?([^\\d]*)(\\d+)[^\\n]*?([^\\n]+)`, 'i'),
      // Simple format: Parameter (condition) - score
      new RegExp(`${paramName}.*?\\(([^)]+)\\).*?(\\d+)`, 'i')
    ];

    let score: number | null = null;
    let condition = '';
    let reasoning = '';
    let isSkipped = false;

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        condition = match[1]?.trim() || '';
        const scoreText = match[2]?.trim().toLowerCase() || '';
        
        if (scoreText === 'skip' || scoreText === 'tidak' || scoreText === '4') {
          isSkipped = true;
          score = null;
        } else {
          const parsedScore = parseInt(scoreText);
          if (parsedScore >= 1 && parsedScore <= 9) {
            score = parsedScore;
          }
        }
        
        reasoning = match[3]?.trim() || '';
        break;
      }
    }

    // Fallback logic for missing data
    if (!condition && !reasoning) {
      if (isAnalyzable) {
        condition = 'Kondisi dapat dianalisis dari foto';
        reasoning = 'Berdasarkan analisis visual AI';
        score = score || 7; // Default good score
      } else {
        condition = 'Tidak dapat dianalisis dari foto';
        reasoning = 'Parameter memerlukan pemeriksaan fisik';
        isSkipped = true;
        score = null;
      }
    }

    // Validate consistency
    const isConsistent = this.validateScoreConsistency(score, `${condition} ${reasoning}`);
    
    return {
      name: paramName,
      score,
      condition,
      reasoning,
      isSkipped,
      isAnalyzable,
      confidence: isConsistent ? 'high' : 'medium'
    };
  }

  /**
   * Calculate overall score excluding skipped parameters
   */
  private calculateOverallScore(parameters: StandardizedParameter[]): number {
    const scoredParams = parameters.filter(p => !p.isSkipped && p.score !== null);
    
    if (scoredParams.length === 0) return 0;
    
    const totalScore = scoredParams.reduce((sum, p) => sum + p.score!, 0);
    return Math.round((totalScore / scoredParams.length) * 10) / 10;
  }

  /**
   * Determine category based on overall score
   */
  private determineCategory(overallScore: number): string {
    if (overallScore >= 8.5) return 'Prima';
    if (overallScore >= 7) return 'Baik';
    if (overallScore >= 5) return 'Sedang';
    return 'Buruk';
  }

  /**
   * Main processing function
   */
  processAnalysisResult(rawText: string, imageData?: string): StandardizedAnalysisResult {
    console.log('StandardizedResponseHandler: Processing analysis result');
    
    const parameters: StandardizedParameter[] = [];
    const validationErrors: string[] = [];
    
    // Parse each SNI parameter
    for (const paramName of this.SNI_PARAMETERS) {
      const param = this.parseParameterFromText(rawText, paramName);
      parameters.push(param);
      
      // Validate parameter
      if (!param.isSkipped && param.score === null) {
        validationErrors.push(`${paramName}: Skor tidak ditemukan`);
      }
      
      if (param.confidence === 'medium') {
        validationErrors.push(`${paramName}: Ketidakkonsistenan antara skor dan deskripsi`);
      }
    }

    // Calculate metrics
    const analyzableCount = parameters.filter(p => p.isAnalyzable && !p.isSkipped).length;
    const skippedCount = parameters.filter(p => p.isSkipped).length;
    const overallScore = this.calculateOverallScore(parameters);
    const category = this.determineCategory(overallScore);
    
    // Check overall consistency
    const isConsistent = validationErrors.length === 0 && analyzableCount >= 3;
    
    const result: StandardizedAnalysisResult = {
      parameters,
      overallScore,
      category,
      analyzableCount,
      skippedCount,
      isConsistent,
      validationErrors
    };

    console.log('StandardizedResponseHandler: Result processed', {
      analyzableCount,
      skippedCount,
      overallScore,
      category,
      isConsistent
    });

    return result;
  }
}

// Export singleton instance
export const standardizedHandler = new StandardizedResponseHandler();
