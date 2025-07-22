/**
 * Enhanced Text Processing Utilities for Species Analysis
 * Comprehensive cleaning and parsing for AI responses
 */

export interface CleanTextOptions {
  removeMarkdown?: boolean;
  normalizeWhitespace?: boolean;
  removeEmptyLines?: boolean;
  removeArtifacts?: boolean;
  minimumLength?: number;
}

export interface ParsedAnalysisResult {
  title?: string;
  species?: string;
  confidence?: number;
  characteristics?: string[];
  sections?: { title: string; content: string }[];
  cleanContent: string;
  hasErrors: boolean;
}

/**
 * Advanced text cleaning function with comprehensive artifact removal
 */
export function cleanAnalysisText(
  text: string,
  options: CleanTextOptions = {}
): string {
  if (!text || typeof text !== 'string') return '';

  const {
    removeMarkdown = true,
    normalizeWhitespace = true,
    removeEmptyLines = true,
    removeArtifacts = true,
    minimumLength = 2
  } = options;

  let cleanText = text;

  if (removeArtifacts) {
    // Remove ALL markdown formatting artifacts
    cleanText = cleanText.replace(/\*+/g, ''); // Remove asterisks
    cleanText = cleanText.replace(/#+/g, ''); // Remove hash symbols
    cleanText = cleanText.replace(/\|/g, ''); // Remove pipe symbols
    cleanText = cleanText.replace(/^[-•]\s*\*?\s*/gm, ''); // Remove bullet artifacts
    cleanText = cleanText.replace(/^[-•]\s*$/gm, ''); // Remove standalone bullets
    cleanText = cleanText.replace(/^:\s*/gm, ''); // Remove leading colons
    cleanText = cleanText.replace(/^\s*-\s*\*\s*/gm, ''); // Remove "- *" patterns
    cleanText = cleanText.replace(/^\s*\*\s*-\s*/gm, ''); // Remove "* -" patterns
  }

  if (removeMarkdown) {
    // Remove remaining markdown syntax
    cleanText = cleanText.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1'); // Links
    cleanText = cleanText.replace(/`([^`]*)`/g, '$1'); // Inline code
    cleanText = cleanText.replace(/~~([^~]*)~~/g, '$1'); // Strikethrough
    cleanText = cleanText.replace(/_{1,2}([^_]*)_{1,2}/g, '$1'); // Emphasis
  }

  if (normalizeWhitespace) {
    // Normalize all whitespace
    cleanText = cleanText.replace(/[\r\n]+/g, '\n'); // Normalize line breaks
    cleanText = cleanText.replace(/[ \t]+/g, ' '); // Normalize spaces
    cleanText = cleanText.replace(/\n\s*\n/g, '\n'); // Remove extra line breaks
  }

  if (removeEmptyLines) {
    cleanText = cleanText
      .split('\n')
      .filter(line => line.trim().length >= minimumLength)
      .filter(line => !/^[\s\-•:\*]*$/.test(line)) // Remove lines with only artifacts
      .join('\n');
  }

  return cleanText.trim();
}

/**
 * Parse and structure AI analysis response
 */
export function parseAnalysisResponse(content: string): ParsedAnalysisResult {
  const result: ParsedAnalysisResult = {
    cleanContent: '',
    hasErrors: false,
    characteristics: [],
    sections: []
  };

  try {
    // Clean the content first
    const cleanContent = cleanAnalysisText(content, {
      removeMarkdown: true,
      removeArtifacts: true,
      normalizeWhitespace: true,
      removeEmptyLines: true
    });

    result.cleanContent = cleanContent;

    // Extract species name
    const speciesMatch = cleanContent.match(/(?:spesies|species|ikan)\s*:?\s*([^\n\r]+)/i);
    if (speciesMatch) {
      result.species = speciesMatch[1].trim();
    }

    // Extract confidence level
    const confidenceMatch = cleanContent.match(/(?:confidence|kepercayaan|akurasi)\s*:?\s*(\d+)%?/i);
    if (confidenceMatch) {
      result.confidence = parseInt(confidenceMatch[1]);
    }

    // Extract characteristics
    const charMatch = cleanContent.match(/(?:karakteristik|ciri|features?):(.*?)(?:\n\n|\n[A-Z]|\n\d+\.|\n-|\nCiri|\nKarakteristik|$)/is);
    if (charMatch) {
      const characteristics = charMatch[1]
        .split(/\n/)
        .map(line => cleanAnalysisText(line.replace(/^[-•]\s*/, ''), { minimumLength: 3 }))
        .filter(char => char.length > 3);
      result.characteristics = characteristics;
    }

    // Extract sections
    const sectionMatches = cleanContent.matchAll(/^([A-Z][^:\n]*):(.*)$/gm);
    for (const match of sectionMatches) {
      const title = match[1].trim();
      const content = cleanAnalysisText(match[2], { minimumLength: 5 });
      if (content) {
        result.sections.push({ title, content });
      }
    }

  } catch (error) {
    console.error('Error parsing analysis response:', error);
    result.hasErrors = true;
    result.cleanContent = cleanAnalysisText(content, { minimumLength: 1 });
  }

  return result;
}

/**
 * Validate analysis quality
 */
export function validateAnalysisQuality(analysis: ParsedAnalysisResult): {
  isValid: boolean;
  quality: 'high' | 'medium' | 'low';
  issues: string[];
} {
  const issues: string[] = [];
  let qualityScore = 0;

  // Check for species identification
  if (analysis.species && analysis.species.length > 3) {
    qualityScore += 30;
  } else {
    issues.push('Identifikasi spesies tidak jelas');
  }

  // Check for confidence
  if (analysis.confidence && analysis.confidence > 50) {
    qualityScore += 20;
  } else {
    issues.push('Tingkat kepercayaan rendah');
  }

  // Check for characteristics
  if (analysis.characteristics && analysis.characteristics.length > 2) {
    qualityScore += 25;
  } else {
    issues.push('Karakteristik tidak lengkap');
  }

  // Check content length
  if (analysis.cleanContent.length > 100) {
    qualityScore += 15;
  } else {
    issues.push('Konten analisis terlalu singkat');
  }

  // Check for errors
  if (!analysis.hasErrors) {
    qualityScore += 10;
  } else {
    issues.push('Terdapat error dalam parsing');
  }

  let quality: 'high' | 'medium' | 'low' = 'low';
  if (qualityScore >= 80) quality = 'high';
  else if (qualityScore >= 60) quality = 'medium';

  return {
    isValid: qualityScore >= 50,
    quality,
    issues
  };
}

/**
 * Format confidence score for display
 */
export function formatConfidence(confidence?: number): {
  percentage: string;
  level: 'high' | 'medium' | 'low';
  color: string;
} {
  const conf = confidence || 0;
  
  let level: 'high' | 'medium' | 'low' = 'low';
  let color = 'text-destructive';
  
  if (conf >= 80) {
    level = 'high';
    color = 'text-primary';
  } else if (conf >= 60) {
    level = 'medium'; 
    color = 'text-warning';
  }

  return {
    percentage: `${conf}%`,
    level,
    color
  };
}