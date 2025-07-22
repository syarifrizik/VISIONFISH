/**
 * Consistent Scoring System for VisionFish AI Analysis
 * Updated: Enhanced text cleaning and better artifact removal
 */

export interface ConsistentParameter {
  name: string;
  score: number; // Always a number for visual parameters, null for Bau
  condition: string;
  reasoning: string;
  isAnalyzable: boolean;
  confidence: 'high' | 'medium' | 'low' | 'auto-assigned';
}

export interface ConsistentAnalysisResult {
  parameters: ConsistentParameter[];
  overallScore: number;
  category: string;
  analyzableCount: number;
  autoAssignedCount: number;
  validationWarnings: string[];
  fishName?: string; // Added fish name extraction
}

export class ConsistentScoringSystem {
  // Fixed: All 6 parameters are now analyzable/calculable like Excel format
  private readonly ANALYZABLE_PARAMS = ['Mata', 'Insang', 'Lendir', 'Daging', 'Bau', 'Tekstur'];
  // Updated: No parameters excluded from calculation
  private readonly NON_ANALYZABLE_PARAMS: string[] = [];
  
  // Enhanced keyword to score mapping with better sensitivity for poor conditions
  private readonly CONDITION_SCORE_MAP = {
    // Excellent conditions (8-9)
    'jernih': 9, 'transparan': 9, 'cembung': 8, 'terang': 8, 'cerah': 8, 'prima': 9, 'sangat baik': 8,
    'merah cerah': 9, 'merah segar': 8, 'mengkilap': 9, 'bening': 9, 'elastis': 8, 'kenyal': 8,
    'kompak': 8, 'solid': 8, 'utuh': 9, 'firm': 8, 'segar': 8, 'optimal': 8,
    
    // Good conditions (6-7)
    'merah muda': 7, 'merah': 7, 'tipis': 7, 'padat': 7, 'kencang': 7, 'baik': 7,
    
    // Fair conditions (4-5)
    'agak keruh': 5, 'rata': 5, 'agak pucat': 5, 'agak kendur': 5, 'soft': 5, 'sedang': 5,
    
    // Poor conditions (2-3) - Enhanced sensitivity
    'keruh': 3, 'kusam': 3, 'pucat mata': 2, 'cekung': 2, 'abu-abu': 2,
    'pucat insang': 2, 'keabu-abuan': 2, 'coklat': 2, 'berlendir': 2,
    'kental': 2, 'lengket': 2, 'berbusa': 1, 'kotor': 2,
    'lembek': 2, 'keras': 3, 'kendur': 3, 'rusak daging': 1,
    'mudah hancur': 2, 'rapuh': 2, 'terpisah': 1,
    
    // Very poor conditions (1-2) - More aggressive for clearly bad fish
    'busuk': 1, 'sangat buruk': 1, 'rusak': 1, 'hancur': 1, 'membusuk': 1,
    'berbau busuk': 1, 'sangat keruh': 1, 'sangat kusam': 1, 'sangat pucat': 1,
    'sangat lembek': 1, 'sangat kendur': 1, 'sangat kotor': 1, 'sangat lengket': 1,
    'tidak segar': 2, 'kurang segar': 2, 'kondisi buruk': 1, 'sangat rusak': 1,
    'pembusukan': 1, 'deteriorasi': 1, 'decomposing': 1, 'spoiled': 1,
    
    // Additional poor condition indicators
    'berjamur': 1, 'berulat': 1, 'berbintik hitam': 1, 'kehitaman': 1,
    'sangat kental': 1, 'berbuih': 1, 'berminyak berlebih': 2
  };

  /**
   * Enhanced text cleaning function to remove all markdown artifacts
   */
  private cleanText(text: string): string {
    if (!text) return '';
    
    return text
      // Remove all markdown formatting
      .replace(/\*\*([^*]+)\*\*/g, '$1') // **bold** -> bold
      .replace(/\*([^*]+)\*/g, '$1') // *italic* -> italic
      .replace(/#{1,6}\s?/g, '') // Remove headers
      
      // Remove bullet point artifacts - COMPREHENSIVE CLEANUP
      .replace(/^[\s]*[-*•]\s*\*+[\s]*/gm, '') // "- *", "* *", "• *"
      .replace(/^[\s]*\*+[\s]*[-*•][\s]*/gm, '') // "* -", "** *"
      .replace(/^[\s]*[-*•]\s*$/gm, '') // Standalone bullets
      .replace(/[-*•]\s*\*+[\s]*$/gm, '') // Trailing "- *"
      .replace(/\*+[\s]*[-*•][\s]*$/gm, '') // Trailing "* -"
      
      // Remove table formatting
      .replace(/\|/g, '') // Remove pipes
      .replace(/^[\s]*-+[\s]*$/gm, '') // Remove table separators
      
      // Clean up markdown artifacts and symbols
      .replace(/[_`~]/g, '') // Remove underscores, backticks, tildes
      .replace(/^\s*[:>]/gm, '') // Remove leading colons and quotes
      
      // Remove standalone symbols and artifacts
      .replace(/^[\s]*[*-•]+[\s]*$/gm, '') // Remove lines with only bullets
      .replace(/[\s]*\*+[\s]*$/gm, '') // Remove trailing asterisks
      .replace(/^[\s]*\*+[\s]*/gm, '') // Remove leading asterisks
      
      // Clean up whitespace and formatting
      .replace(/\s+/g, ' ') // Multiple spaces to single
      .replace(/\n\s*\n/g, '\n') // Multiple newlines to single
      .trim()
      
      // Final cleanup for any remaining artifacts
      .replace(/^[:\-*•\s]+/, '') // Remove any leading symbols
      .replace(/[:\-*•\s]+$/, '') // Remove any trailing symbols
      .trim();
  }

  /**
   * Main processing function with fish name extraction
   */
  processAnalysisResult(rawText: string): ConsistentAnalysisResult {
    console.log('ConsistentScoringSystem: Processing analysis with enhanced text cleaning');
    
    const parameters: ConsistentParameter[] = [];
    const validationWarnings: string[] = [];
    let autoAssignedCount = 0;

    // Extract fish name from analysis
    const fishName = this.extractFishName(rawText);
    
    // Process each parameter
    for (const paramName of [...this.ANALYZABLE_PARAMS, ...this.NON_ANALYZABLE_PARAMS]) {
      const isAnalyzable = this.ANALYZABLE_PARAMS.includes(paramName);
      const param = this.processParameter(rawText, paramName, isAnalyzable);
      
      if (param.confidence === 'auto-assigned') {
        autoAssignedCount++;
        validationWarnings.push(`${paramName}: Skor ditetapkan otomatis berdasarkan deskripsi`);
      }
      
      parameters.push(param);
    }

    // Calculate metrics (including all 6 parameters like Excel)
    const analyzableParams = parameters.filter(p => p.score !== null);
    const analyzableCount = analyzableParams.length;
    const overallScore = this.calculateOverallScore(analyzableParams);
    const category = this.determineCategory(overallScore);

    console.log('ConsistentScoringSystem: Enhanced results', {
      fishName,
      analyzableCount,
      autoAssignedCount,
      overallScore,
      category
    });

    return {
      parameters,
      overallScore,
      category, 
      analyzableCount,
      autoAssignedCount,
      validationWarnings,
      fishName
    };
  }

  /**
   * Extract fish name from AI analysis result
   */
  private extractFishName(text: string): string {
    // Try multiple patterns to extract fish name
    const patterns = [
      // Table format: |**Nama Spesies**|Fish Name|
      /\*\*Nama Spesies\*\*.*?\|\s*([^|]+)\s*\|/i,
      // Alternative: Nama Spesies: Fish Name
      /Nama Spesies[:\s]*([^\n\r]+)/i,
      // Species identification: **Fish Name**
      /(?:identifikasi|spesies)[:\s]*\*\*([^*]+)\*\*/i,
      // Direct mention: Ikan yang dianalisis adalah X
      /ikan yang dianalisis adalah\s+([^\n\r.]+)/i,
      // Simple pattern: Spesies: Name
      /spesies[:\s]*([^\n\r,.|]+)/i,
      // Common Indonesian fish names in context
      /(nila|lele|tongkol|bandeng|gurame|mas|patin|bawal|kakap|baronang|kerapu|mujair|gabus|belut|udang)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const fishName = this.cleanText(match[1]);
        if (fishName.length > 2 && fishName.length < 50) {
          return fishName;
        }
      }
    }

    return 'Ikan'; // Default fallback
  }

  /**
   * Process individual parameter with enhanced text cleaning
   */
  private processParameter(text: string, paramName: string, isAnalyzable: boolean): ConsistentParameter {
    console.log(`Processing ${paramName}, analyzable: ${isAnalyzable}`);
    
    // Try to extract explicit score first
    const explicitScore = this.extractExplicitScore(text, paramName);
    const condition = this.extractCondition(text, paramName);
    const reasoning = this.extractReasoning(text, paramName);
    
    if (explicitScore !== null && explicitScore >= 1 && explicitScore <= 9) {
      console.log(`${paramName}: Found explicit score ${explicitScore}`);
      return {
        name: paramName,
        score: explicitScore,
        condition: condition || this.getDefaultCondition(paramName, explicitScore),
        reasoning: reasoning || 'Berdasarkan analisis AI',
        isAnalyzable,
        confidence: 'high'
      };
    }

    // For analyzable parameters, derive score with enhanced sensitivity
    if (isAnalyzable) {
      const derivedScore = this.deriveScoreFromText(condition + ' ' + reasoning, paramName);
      console.log(`${paramName}: Derived score ${derivedScore} from description`);
      
      return {
        name: paramName,
        score: derivedScore,
        condition: condition || this.getDefaultCondition(paramName, derivedScore),
        reasoning: reasoning || 'Estimasi berdasarkan deskripsi kondisi',
        isAnalyzable,
        confidence: explicitScore === null ? 'auto-assigned' : 'medium'
      };
    }

    // Fallback
    const estimatedScore = 6;
    return {
      name: paramName,
      score: estimatedScore,
      condition: condition || 'Tidak dapat dianalisis dari foto',
      reasoning: reasoning || 'Parameter memerlukan pemeriksaan fisik langsung',
      isAnalyzable,
      confidence: 'low'
    };
  }

  /**
   * Extract explicit score using multiple patterns
   */
  private extractExplicitScore(text: string, paramName: string): number | null {
    const patterns = [
      // Table format: |**Parameter**|Condition|Score|
      new RegExp(`\\*\\*${paramName}\\*\\*.*?\\|.*?\\|.*?(\\d+).*?\\|`, 'i'),
      // Alternative format: Parameter: condition, score: X
      new RegExp(`${paramName}[^\\d]*?(?:skor|score)[^\\d]*(\\d+)`, 'i'),
      // Direct format: Parameter (condition) - 8
      new RegExp(`${paramName}[\\s\\S]*?(?:^|\\s)(\\d+)(?=\\s|$|\\|)`, 'im'),
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const score = parseInt(match[1]);
        if (score >= 1 && score <= 9) {
          return score;
        }
      }
    }

    return null;
  }

  /**
   * Enhanced condition extraction with comprehensive text cleaning
   */
  private extractCondition(text: string, paramName: string): string {
    const patterns = [
      new RegExp(`\\*\\*${paramName}\\*\\*.*?\\|\\s*([^|]+)\\s*\\|`, 'i'),
      new RegExp(`${paramName}[^\\n]*?(?:\\(([^)]+)\\)|:\\s*([^,\\n]+))`, 'i'),
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const rawCondition = (match[1] || match[2] || '').trim();
        const cleanedCondition = this.cleanText(rawCondition);
        
        // Validate condition quality
        if (this.isValidCondition(cleanedCondition)) {
          return cleanedCondition;
        }
      }
    }

    return '';
  }

  /**
   * Enhanced reasoning extraction with better text cleaning
   */
  private extractReasoning(text: string, paramName: string): string {
    const sectionMatch = text.match(new RegExp(`${paramName}[\\s\\S]*?(?=${this.ANALYZABLE_PARAMS.concat(this.NON_ANALYZABLE_PARAMS).filter(p => p !== paramName).join('|')}|$)`, 'i'));
    
    if (sectionMatch) {
      // Clean the section text comprehensively
      const rawText = sectionMatch[0];
      const cleanedText = this.cleanText(rawText);
      
      // Extract meaningful sentences
      const sentences = cleanedText.split(/[.!?]/).filter(s => s.trim().length > 10);
      const meaningfulSentence = sentences.find(s => this.isValidReasoning(s.trim()));
      
      return meaningfulSentence?.trim() || '';
    }

    return '';
  }

  /**
   * Validate condition text quality
   */
  private isValidCondition(condition: string): boolean {
    if (!condition || condition.length < 3) return false;
    
    // Check if condition contains meaningless artifacts
    const invalidPatterns = [
      /^[\s\-\*•]+$/, // Only symbols
      /^(skor|score|nilai)\s*\d*$/i, // Just "skor" or "score"
      /^[\d\s\-\*•]+$/, // Only numbers and symbols
    ];
    
    return !invalidPatterns.some(pattern => pattern.test(condition));
  }

  /**
   * Validate reasoning text quality
   */
  private isValidReasoning(reasoning: string): boolean {
    if (!reasoning || reasoning.length < 5) return false;
    
    // Exclude generic AI phrases and artifacts
    const invalidPhrases = [
      /berdasarkan analisis/i,
      /dari gambar/i,
      /terlihat/i,
      /dapat dilihat/i,
      /skor|score/i
    ];
    
    // Must have some meaningful content beyond generic phrases
    return reasoning.length > 10 && !invalidPhrases.every(phrase => phrase.test(reasoning));
  }

  /**
   * Enhanced score derivation with better sensitivity for poor conditions
   */
  private deriveScoreFromText(text: string, paramName: string): number {
    const lowerText = text.toLowerCase();
    
    // Enhanced matching with priority for poor conditions
    let bestScore = 6; // Default moderate score
    let matchFound = false;

    // First check for very poor conditions (priority)
    for (const [keyword, score] of Object.entries(this.CONDITION_SCORE_MAP)) {
      if (score <= 3 && lowerText.includes(keyword.toLowerCase())) {
        bestScore = score;
        matchFound = true;
        console.log(`${paramName}: Found poor condition keyword "${keyword}" -> score ${score}`);
        break;
      }
    }

    // If no poor condition found, check other conditions
    if (!matchFound) {
      for (const [keyword, score] of Object.entries(this.CONDITION_SCORE_MAP)) {
        if (lowerText.includes(keyword.toLowerCase())) {
          bestScore = score;
          matchFound = true;
          console.log(`${paramName}: Found keyword "${keyword}" -> score ${score}`);
          break;
        }
      }
    }

    // Enhanced parameter-specific defaults if no keywords found (including Bau)
    if (!matchFound) {
      const paramDefaults = {
        'Mata': 7,
        'Insang': 7, 
        'Lendir': 7,
        'Daging': 6,
        'Tekstur': 6,
        'Bau': 7  // Default for Bau when not explicitly mentioned
      };
      bestScore = paramDefaults[paramName as keyof typeof paramDefaults] || 6;
    }

    return bestScore;
  }

  /**
   * Get default condition based on parameter and score
   */
  private getDefaultCondition(paramName: string, score: number): string {
    const conditions = {
      'Mata': score >= 7 ? 'Mata jernih dan cembung' : score >= 5 ? 'Mata agak keruh' : 'Mata keruh dan cekung',
      'Insang': score >= 7 ? 'Insang merah cerah' : score >= 5 ? 'Insang agak pucat' : 'Insang pucat keabu-abuan',
      'Lendir': score >= 7 ? 'Lendir jernih mengkilap' : score >= 5 ? 'Lendir agak keruh' : 'Lendir keruh dan kental',
      'Daging': score >= 7 ? 'Daging elastis' : score >= 5 ? 'Daging agak kendur' : 'Daging lembek',
      'Tekstur': score >= 7 ? 'Tekstur kompak dan utuh' : score >= 5 ? 'Tekstur agak kendur' : 'Tekstur mudah hancur',
      'Bau': score >= 7 ? 'Bau segar khas ikan' : score >= 5 ? 'Bau netral' : 'Bau kurang segar'
    };

    return conditions[paramName as keyof typeof conditions] || 'Kondisi normal';
  }

  /**
   * Calculate overall score from analyzable parameters only
   */
  private calculateOverallScore(analyzableParams: ConsistentParameter[]): number {
    if (analyzableParams.length === 0) return 6;

    const totalScore = analyzableParams.reduce((sum, param) => sum + param.score, 0);
    return Math.round((totalScore / analyzableParams.length) * 10) / 10;
  }

  /**
   * Enhanced category determination with better thresholds
   */
  private determineCategory(overallScore: number): string {
    if (overallScore >= 8.5) return 'Prima';
    if (overallScore >= 7) return 'Baik';
    if (overallScore >= 4.5) return 'Sedang'; // Lowered threshold
    return 'Buruk'; // More aggressive categorization for poor fish
  }
}

// Export singleton instance
export const consistentScoring = new ConsistentScoringSystem();
