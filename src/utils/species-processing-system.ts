
/**
 * Species Processing System for VisionFish
 * Handles species identification results with standardized output
 */

export interface SpeciesIdentificationResult {
  speciesName: string;
  scientificName?: string;
  family?: string;
  confidence: 'high' | 'medium' | 'low';
  characteristics: string[];
  description: string;
  validationWarnings: string[];
}

export class SpeciesProcessingSystem {
  /**
   * Clean text from markdown formatting and other unwanted characters
   */
  private cleanText(text: string): string {
    if (!text) return '';
    
    return text
      .replace(/\*\*/g, '') // Remove bold markdown
      .replace(/\*/g, '') // Remove italic markdown
      .replace(/\|/g, '') // Remove table separators
      .replace(/#{1,6}\s*/g, '') // Remove headers
      .replace(/`/g, '') // Remove code backticks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert markdown links to text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Check if text contains meaningful content (not just generic fallback)
   */
  private isMeaningfulContent(text: string, minLength: number = 20): boolean {
    if (!text || text.length < minLength) return false;
    
    const genericPhrases = [
      'berdasarkan analisis visual',
      'analisis visual gambar',
      'gambar yang diunggah',
      'berdasarkan gambar',
      'deskripsi spesies'
    ];
    
    const lowerText = text.toLowerCase();
    return !genericPhrases.some(phrase => lowerText.includes(phrase));
  }

  /**
   * Process species identification result from AI
   */
  processSpeciesResult(rawText: string): SpeciesIdentificationResult {
    console.log('SpeciesProcessingSystem: Processing species identification');
    
    const speciesName = this.cleanText(this.extractSpeciesName(rawText));
    const scientificName = this.extractScientificName(rawText);
    const family = this.extractFamily(rawText);
    const confidence = this.determineConfidence(rawText);
    const characteristics = this.extractCharacteristics(rawText);
    const description = this.extractDescription(rawText);
    const validationWarnings: string[] = [];

    // Add validation warnings if information is missing
    if (!speciesName || speciesName === 'Ikan' || speciesName === 'Spesies Tidak Teridentifikasi') {
      validationWarnings.push('Nama spesies tidak teridentifikasi dengan jelas');
    }
    if (!scientificName) {
      validationWarnings.push('Nama ilmiah tidak tersedia');
    }

    console.log('SpeciesProcessingSystem: Results', {
      speciesName,
      confidence,
      characteristicsCount: characteristics.length
    });

    return {
      speciesName,
      scientificName: scientificName ? this.cleanText(scientificName) : undefined,
      family: family ? this.cleanText(family) : undefined,
      confidence,
      characteristics,
      description,
      validationWarnings
    };
  }

  /**
   * Extract species name from AI response
   */
  private extractSpeciesName(text: string): string {
    const patterns = [
      // Table format or structured format
      /\*\*(?:Nama Spesies|Species Name)\*\*[:\s]*([^\n\r|]+)/i,
      // Direct mention patterns
      /(?:spesies|species)[:\s]*\*\*([^*]+)\*\*/i,
      /(?:nama|name)[:\s]*\*\*([^*]+)\*\*/i,
      // Common Indonesian fish names
      /(nila|lele|tongkol|bandeng|gurame|mas|patin|bawal|kakap|baronang|kerapu|mujair|gabus|belut|udang|ikan\s+\w+)/i,
      // Fallback pattern
      /identifikasi[:\s]*([^\n\r.]+)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const name = this.cleanText(match[1]);
        if (name.length > 2 && name.length < 50 && !name.toLowerCase().includes('tidak')) {
          return name;
        }
      }
    }

    return 'Spesies Tidak Teridentifikasi';
  }

  /**
   * Extract scientific name
   */
  private extractScientificName(text: string): string | undefined {
    const patterns = [
      /\*\*(?:Nama Ilmiah|Scientific Name)\*\*[:\s]*\*([^*]+)\*/i,
      /nama ilmiah[:\s]*\*([^*]+)\*/i,
      /scientific[:\s]*\*([^*]+)\*/i,
      /\*([A-Z][a-z]+\s+[a-z]+)\*/g
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const scientific = this.cleanText(match[1]);
        if (scientific.includes(' ') && scientific.length > 5) {
          return scientific;
        }
      }
    }

    return undefined;
  }

  /**
   * Extract family information
   */
  private extractFamily(text: string): string | undefined {
    const patterns = [
      /\*\*(?:Famili|Family)\*\*[:\s]*([^\n\r|]+)/i,
      /famili[:\s]*([^\n\r|]+)/i,
      /family[:\s]*([^\n\r|]+)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const family = this.cleanText(match[1]);
        if (family.length > 2 && family.length < 30) {
          return family;
        }
      }
    }

    return undefined;
  }

  /**
   * Determine confidence level based on content
   */
  private determineConfidence(text: string): 'high' | 'medium' | 'low' {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('confidence: high') || 
        lowerText.includes('tinggi') || 
        lowerText.includes('yakin') ||
        lowerText.includes('jelas')) {
      return 'high';
    }
    
    if (lowerText.includes('confidence: low') || 
        lowerText.includes('rendah') || 
        lowerText.includes('tidak yakin') ||
        lowerText.includes('sulit') ||
        lowerText.includes('kemungkinan')) {
      return 'low';
    }
    
    return 'medium';
  }

  /**
   * Extract characteristics
   */
  private extractCharacteristics(text: string): string[] {
    const characteristics: string[] = [];
    
    // Look for bullet points or numbered lists
    const bulletMatches = text.match(/[-•*]\s*([^\n\r]+)/g);
    if (bulletMatches) {
      bulletMatches.forEach(match => {
        const char = this.cleanText(match.replace(/[-•*]\s*/, ''));
        if (char.length > 5 && char.length < 100) {
          characteristics.push(char);
        }
      });
    }

    // Look for "Ciri Pembeda" section
    const ciriSection = text.match(/ciri pembeda[:\s]*\n([\s\S]*?)(?=\n\n|\n#|$)/i);
    if (ciriSection && ciriSection[1]) {
      const lines = ciriSection[1].split('\n').filter(line => line.trim());
      lines.forEach(line => {
        const clean = this.cleanText(line.replace(/[-•*]\s*/, ''));
        if (clean.length > 5 && clean.length < 100) {
          characteristics.push(clean);
        }
      });
    }

    return characteristics.slice(0, 5); // Limit to 5 characteristics
  }

  /**
   * Extract description
   */
  private extractDescription(text: string): string {
    // Look for descriptive paragraphs
    const paragraphs = text.split('\n\n').filter(p => 
      p.length > 50 && 
      !p.includes('|') && 
      !p.includes('#') &&
      !p.includes('**')
    );

    if (paragraphs.length > 0) {
      const cleanDescription = this.cleanText(paragraphs[0]);
      if (this.isMeaningfulContent(cleanDescription)) {
        return cleanDescription.substring(0, 200) + (cleanDescription.length > 200 ? '...' : '');
      }
    }

    // Return empty string instead of generic fallback
    return '';
  }
}

// Export singleton instance
export const speciesProcessing = new SpeciesProcessingSystem();
