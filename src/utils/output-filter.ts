/**
 * Utility to filter and clean AI output for user-friendly display
 * Enhanced version with better markdown structure and readability
 */

export const filterUserOutput = (rawOutput: string): string => {
  if (!rawOutput) return '';

  let filteredOutput = rawOutput;

  // Remove debug sections
  const debugSections = [
    /\*\*Enterprise.*?\*\*/gis,
    /\*\*Enhanced Quality Control.*?\*\*/gis,
    /\*\*Original AI Response.*?\*\*/gis,
    /\*\*API Status.*?\*\*/gis,
    /\*\*Analysis Error.*?\*\*/gis,
    /\*\*Recovery Mode.*?\*\*/gis,
    /\*\*System Recovery.*?\*\*/gis,
    /\*\*Enterprise System.*?\*\*/gis,
    /Error detected:.*?\n/gi,
    /Recovery Actions Active:.*?\n/gi,
    /Status:.*enterprise.*?\n/gi
  ];

  debugSections.forEach(pattern => {
    filteredOutput = filteredOutput.replace(pattern, '');
  });

  // Remove technical validation messages
  const technicalPatterns = [
    /✅.*parameter.*system.*?\n/gi,
    /⚠️.*validation.*disabled.*?\n/gi,
    /confidence threshold.*?\n/gi,
    /advanced validation.*?\n/gi,
    /enterprise features:.*?\n/gi,
    /neural network.*processing.*?\n/gi,
    /deep learning.*processing.*?\n/gi
  ];

  technicalPatterns.forEach(pattern => {
    filteredOutput = filteredOutput.replace(pattern, '');
  });

  // Remove backend log indicators
  const backendPatterns = [
    /console\.log.*?\n/gi,
    /DEBUG:.*?\n/gi,
    /INFO:.*?\n/gi,
    /WARNING:.*?\n/gi,
    /ERROR:.*?\n/gi,
    /\[LOG\].*?\n/gi,
    /\[DEBUG\].*?\n/gi,
    /Processing.*validation.*?\n/gi
  ];

  backendPatterns.forEach(pattern => {
    filteredOutput = filteredOutput.replace(pattern, '');
  });

  // Enhanced markdown structure processing
  filteredOutput = filteredOutput
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    
    // Fix heading spacing - ensure proper breaks around headers
    .replace(/^(#{1,6})\s*(.+)$/gm, '\n$1 $2\n')
    
    // Fix bold text spacing - ensure proper spacing around bold text
    .replace(/\*\*([^*]+)\*\*/g, '\n\n**$1**\n\n')
    
    // Fix list formatting - normalize bullet points
    .replace(/^[\s]*[-*•]\s*/gm, '- ')
    .replace(/^[\s]*(\d+)[\.\)]\s*/gm, '$1. ')
    
    // Clean up excessive newlines but preserve structure
    .replace(/\n{4,}/g, '\n\n\n')
    .replace(/\n{2,}(#{1,6})/g, '\n\n$1')
    .replace(/(#{1,6}[^\n]+)\n{2,}/g, '$1\n\n')
    
    // Ensure proper spacing after headers before content
    .replace(/(#{1,6}[^\n]+)\n([^#\n-])/g, '$1\n\n$2')
    
    // Fix table formatting
    .replace(/\|\s*([^|]+)\s*\|/g, '| $1 |')
    
    // Clean up extra spaces
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

  // Enhanced structure detection and improvement
  if (!filteredOutput.includes('**') && !filteredOutput.includes('#')) {
    const lines = filteredOutput.split('\n').filter(line => line.trim().length > 0);
    const structuredLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Make first meaningful line a header
      if (i === 0 && line.length > 10 && line.length < 80) {
        structuredLines.push(`## ${line}\n`);
      }
      // Detect potential section headers
      else if (line.length < 60 && i < lines.length - 1 && 
               (line.toLowerCase().includes('spesies') || 
                line.toLowerCase().includes('kesegaran') ||
                line.toLowerCase().includes('analisis') ||
                line.toLowerCase().includes('hasil') ||
                line.toLowerCase().includes('parameter') ||
                line.toLowerCase().includes('skor'))) {
        structuredLines.push(`\n### ${line}\n`);
      }
      // Convert potential lists
      else if (line.match(/^[a-zA-Z0-9]+[\.\:\-]/)) {
        structuredLines.push(`- ${line.replace(/^[a-zA-Z0-9]+[\.\:\-]\s*/, '')}`);
      }
      // Regular content with proper spacing
      else {
        structuredLines.push(line + '\n');
      }
    }
    
    filteredOutput = structuredLines.join('');
  }

  return filteredOutput;
};

export const isBackendDebugInfo = (text: string): boolean => {
  const debugIndicators = [
    'Enterprise',
    'Enhanced Quality Control',
    'Original AI Response',
    'API Status',
    'Recovery Mode',
    'System Recovery',
    'console.log',
    'DEBUG:',
    'Processing validation',
    'confidence threshold',
    'neural network processing'
  ];

  const lowerText = text.toLowerCase();
  return debugIndicators.some(indicator => 
    lowerText.includes(indicator.toLowerCase())
  );
};

export const extractUserRelevantContent = (output: string): {
  species: string;
  freshness: string;
  confidence: string;
  recommendations: string[];
} => {
  const filtered = filterUserOutput(output);
  
  // Extract species information
  const speciesMatch = filtered.match(/\*\*(?:Nama Spesies|Species)\*\*[:\s]*([^\n]+)/i);
  const species = speciesMatch?.[1] || '';

  // Extract freshness information
  const freshnessMatch = filtered.match(/\*\*(?:Kesegaran|Freshness)\*\*[:\s]*([^\n]+)/i);
  const freshness = freshnessMatch?.[1] || '';

  // Extract confidence level
  const confidenceMatch = filtered.match(/\*\*(?:Confidence|Keyakinan)\*\*[:\s]*([^\n]+)/i);
  const confidence = confidenceMatch?.[1] || '';

  // Extract recommendations
  const recommendations: string[] = [];
  const recMatches = filtered.match(/[-•*]\s*([^\n]+)/g);
  if (recMatches) {
    recMatches.forEach(match => {
      const rec = match.replace(/[-•*]\s*/, '').trim();
      if (rec.length > 10 && rec.length < 200) {
        recommendations.push(rec);
      }
    });
  }

  return {
    species: species.trim(),
    freshness: freshness.trim(),
    confidence: confidence.trim(),
    recommendations: recommendations.slice(0, 5) // Limit to 5 recommendations
  };
};
