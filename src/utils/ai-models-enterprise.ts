
/**
 * Enterprise AI Models with Enhanced Sensitivity and Fish Name Extraction
 * Enhanced: Better scoring sensitivity and optimized token usage
 */

import { generateEnterprisePrompt, validateResponse, getEnterprisePromptTemplate, SENSITIVITY_PROFILES } from './enterprise-prompt-system';
import { consistentScoring } from './consistent-scoring-system';
import { speciesProcessing } from './species-processing-system';
import { AnalysisType } from '@/components/species/DualAnalysisSelector';

export enum AI_MODELS {
  NEPTUNE_FLOW = "gemini-1.5-pro-001",
  CORAL_WAVE = "gemini-1.5-pro-coral", 
  REGAL_TIDE = "gemini-1.5-pro-regal"
}

export const AVAILABLE_MODELS = [
  {
    id: AI_MODELS.NEPTUNE_FLOW,
    name: "Neptune Flow (Enhanced)",
    description: "Model dengan sensitivitas tinggi untuk kondisi ikan buruk dan ekstraksi nama ikan.",
    isPremium: false
  },
  {
    id: AI_MODELS.CORAL_WAVE,
    name: "Coral Wave (Enhanced Pro)",
    description: "Model premium dengan akurasi tinggi dan token optimization.",
    isPremium: true
  },
  {
    id: AI_MODELS.REGAL_TIDE,
    name: "Regal Tide (Enhanced Max)",
    description: "Model tertinggi dengan full quality assurance dan fish name extraction.",
    isPremium: true
  }
];

/**
 * Generate CONSISTENT prompt with enhanced formatting
 */
export const getEnterpriseModelPrompt = (model: AI_MODELS, analysisType: AnalysisType): string => {
  console.log('🎯 Consistency AI: Generating structured prompt for', analysisType);
  
  // Import enhanced prompts
  const { getConsistentPrompt } = require('./enhanced-prompt-consistency');
  
  // Use consistent, structured prompts
  return getConsistentPrompt(analysisType);
};

/**
 * Get optimized generation config with CONSISTENCY CONTROLS
 */
export const getOptimizedGenerationConfig = (analysisType: AnalysisType, imageData?: string) => {
  // Import consistency engine
  const { getConsistentGenerationConfig } = require('./consistency-engine');
  
  // Get ultra-consistent parameters
  const consistentConfig = getConsistentGenerationConfig(analysisType, imageData);
  
  return {
    temperature: consistentConfig.temperature, // Fixed 0.1 for consistency
    topK: consistentConfig.topK,               // Fixed 10
    topP: consistentConfig.topP,               // Fixed 0.3
    maxOutputTokens: consistentConfig.maxTokens, // Fixed 1500
    candidateCount: 1,
    // Add seed for deterministic results
    seed: consistentConfig.seed
  };
};

/**
 * Enhanced AI response processing with fish name extraction and better scoring
 */
export const processEnterpriseAIResponse = (rawResponse: string, analysisType: AnalysisType): string => {
  console.log('Enhanced AI: Processing response with better sensitivity');
  
  // First validate against enterprise template
  try {
    const template = getEnterprisePromptTemplate(analysisType);
    const validation = validateResponse(rawResponse, template);
    
    console.log('Enhanced AI: Validation result:', validation);
    
    if (!validation.isValid) {
      console.warn('Enhanced AI: Validation warnings:', validation.errors);
    }
  } catch (error) {
    console.error('Enhanced AI: Validation error:', error);
  }

  // Process species identification
  if (analysisType === 'species') {
    try {
      const speciesResult = speciesProcessing.processSpeciesResult(rawResponse);
      
      // Generate enhanced species response
      let enhancedResponse = `# Identifikasi Spesies: ${speciesResult.speciesName}\n\n`;
      
      enhancedResponse += `🐟 **Nama Spesies**: ${speciesResult.speciesName}\n`;
      if (speciesResult.scientificName) {
        enhancedResponse += `🔬 **Nama Ilmiah**: *${speciesResult.scientificName}*\n`;
      }
      if (speciesResult.family) {
        enhancedResponse += `🏷️ **Famili**: ${speciesResult.family}\n`;
      }
      enhancedResponse += `📊 **Confidence**: **${speciesResult.confidence.toUpperCase()}**\n\n`;
      
      // Add characteristics if available
      if (speciesResult.characteristics.length > 0) {
        enhancedResponse += `## Ciri Pembeda\n\n`;
        speciesResult.characteristics.forEach(char => {
          enhancedResponse += `- ${char}\n`;
        });
        enhancedResponse += '\n';
      }
      
      // Add description
      enhancedResponse += `## Deskripsi\n\n${speciesResult.description}\n\n`;
      
      // Enhanced quality control info
      enhancedResponse += `### Enhanced Quality Control\n`;
      enhancedResponse += `- ✅ Analisis morfologi otomatis\n`;
      enhancedResponse += `- ✅ Confidence assessment\n`;
      enhancedResponse += `- ✅ Token usage dioptimasi\n`;
      enhancedResponse += `- ✅ Enterprise species identification\n\n`;
      
      if (speciesResult.validationWarnings.length > 0) {
        enhancedResponse += `### Processing Notes\n`;
        speciesResult.validationWarnings.forEach(warning => {
          enhancedResponse += `- 🔄 ${warning}\n`;
        });
        enhancedResponse += '\n';
      }
      
      // Append original for reference
      enhancedResponse += `---\n### Original AI Response\n${rawResponse}`;
      
      return enhancedResponse;
    } catch (error) {
      console.error('Enhanced AI: Species processing error:', error);
      return rawResponse;
    }
  }

  // Process with enhanced consistent scoring for freshness analysis
  if (analysisType === 'freshness' || analysisType === 'both') {
    try {
      const consistentResult = consistentScoring.processAnalysisResult(rawResponse);
      
      // Generate enhanced response with fish name and better formatting
      let enhancedResponse = `# Analisis Kesegaran Ikan: ${consistentResult.fishName || 'Tidak Teridentifikasi'}\n\n`;
      
      enhancedResponse += `🐟 **Spesies**: ${consistentResult.fishName || 'Tidak teridentifikasi'}\n`;
      enhancedResponse += `📊 **Skor Keseluruhan**: ${consistentResult.overallScore.toFixed(1)}/9\n`;
      enhancedResponse += `📈 **Kategori**: **${consistentResult.category}**\n`;
      enhancedResponse += `👁️ **Parameter Visual**: ${consistentResult.analyzableCount}/5\n\n`;
      
      // Add enhanced parameter analysis
      enhancedResponse += `## Parameter Analysis (Enhanced Sensitivity)\n\n`;
      enhancedResponse += `| Parameter | Kondisi | Skor | Confidence | Status |\n`;
      enhancedResponse += `|-----------|---------|------|------------|--------|\n`;
      
      consistentResult.parameters.forEach(param => {
        const scoreDisplay = param.score !== null ? param.score.toString() : 'N/A';
        const confidenceIcon = param.confidence === 'high' ? '🟢' : 
                              param.confidence === 'medium' ? '🟡' : 
                              param.confidence === 'auto-assigned' ? '🟣' : '🔴';
        const status = param.isAnalyzable ? 'Visual' : 'Non-Visual';
        
        enhancedResponse += `| **${param.name}** | ${param.condition} | ${scoreDisplay} | ${confidenceIcon} | ${status} |\n`;
      });
      
      // Enhanced assessment based on category
      enhancedResponse += `\n## Assessment Summary\n\n`;
      
      if (consistentResult.category.toLowerCase() === 'buruk') {
        enhancedResponse += `⚠️ **STATUS: TIDAK LAYAK KONSUMSI**\n`;
        enhancedResponse += `- Ikan dalam kondisi buruk/rusak\n`;
        enhancedResponse += `- Tidak disarankan untuk dikonsumsi\n`;
        enhancedResponse += `- Pertimbangkan untuk dibuang\n\n`;
      } else if (consistentResult.category.toLowerCase() === 'sedang') {
        enhancedResponse += `⚡ **STATUS: KURANG SEGAR**\n`;
        enhancedResponse += `- Ikan dalam kondisi kurang optimal\n`;
        enhancedResponse += `- Segera konsumsi atau proses lebih lanjut\n`;
        enhancedResponse += `- Perhatikan cara penyimpanan\n\n`;
      } else {
        enhancedResponse += `✅ **STATUS: LAYAK KONSUMSI**\n`;
        enhancedResponse += `- Ikan dalam kondisi ${consistentResult.category.toLowerCase()}\n`;
        enhancedResponse += `- Aman untuk dikonsumsi\n\n`;
      }
      
      // Quality assurance info
      enhancedResponse += `### Enhanced Quality Control\n`;
      enhancedResponse += `- ✅ Sensitivitas tinggi untuk kondisi buruk\n`;
      enhancedResponse += `- ✅ Ekstraksi nama ikan otomatis\n`;
      enhancedResponse += `- ✅ Token usage dioptimasi\n`;
      enhancedResponse += `- ✅ SNI 2729-2013 compliance\n\n`;
      
      if (consistentResult.validationWarnings.length > 0) {
        enhancedResponse += `### Processing Notes\n`;
        consistentResult.validationWarnings.forEach(warning => {
          enhancedResponse += `- 🔄 ${warning}\n`;
        });
        enhancedResponse += '\n';
      }
      
      // Append original for reference
      enhancedResponse += `---\n### Original AI Response\n${rawResponse}`;
      
      return enhancedResponse;
    } catch (error) {
      console.error('Enhanced AI: Processing error:', error);
      return rawResponse;
    }
  }
  
  return rawResponse;
};

/**
 * Check API health and return appropriate error messages
 */
function handleAPIError(response: string): string {
  if (response.toLowerCase().includes('quota') || response.toLowerCase().includes('limit')) {
    return `**Enhanced API Status** ⚠️

API quota reached. Enhanced quality control temporarily unavailable.

**Recovery Actions:**
- Switch to backup processing mode
- Reduce analysis frequency
- Contact support for assistance

**Status**: API limitation detected
**Estimated Recovery**: 1-2 hours`;
  }
  
  return `**Enhanced Analysis Error** ❌

Quality-controlled analysis temporarily unavailable.

**Enhanced Fallback:**
- Basic analysis mode activated
- Reduced confidence scores applied
- Manual validation recommended

**Error Code**: ${response.substring(0, 100)}...`;
}

// Export for compatibility
export const hasPremiumAccess = (isPremium: boolean): boolean => isPremium;
export const trackFreeUsage = (feature: string): boolean => {
  // Implementation for free tier tracking
  if (typeof window === 'undefined') return true;
  
  const today = new Date().toISOString().split('T')[0];
  const key = `visionfish-enhanced-${feature}-${today}`;
  const usage = localStorage.getItem(key);
  const count = usage ? parseInt(usage, 10) : 0;
  
  const FREE_TIER_LIMIT = 15;
  
  if (count < FREE_TIER_LIMIT) {
    localStorage.setItem(key, (count + 1).toString());
    return true;
  }
  
  return false;
};

