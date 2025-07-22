
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Calculator, Eye, AlertTriangle, BookOpen, Info, Zap, Fish, Bot, Camera } from 'lucide-react';
import ParameterScoreCard, { ParameterScore } from './ParameterScoreCard';
import ParameterReliabilityIndicator from './ParameterReliabilityIndicator';
import SNIReference from './SNIReference';
import { consistentScoring } from '@/utils/consistent-scoring-system';
import { speciesProcessing } from '@/utils/species-processing-system';

interface EnhancedFreshnessAnalysisProps {
  analysisData: string;
  isVisible: boolean;
}

/**
 * CONTEXT: AI-Powered Automated Analysis Component
 * Route: /species-id - Automated AI visual analysis with Excel-format scoring
 * Features: Computer vision analysis, automated parameter detection, AI confidence scoring
 * Format: Excel-style 6-parameter scoring system (Mata, Insang, Lendir, Daging, Bau, Tekstur)
 * 
 * Note: This differs from manual input analysis (/fish-analysis) which uses user-provided scores
 */
const EnhancedFreshnessAnalysis = ({ analysisData, isVisible }: EnhancedFreshnessAnalysisProps) => {
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);

  // AI-powered automated scoring system - processes computer vision analysis results
  const processedResult = consistentScoring.processAnalysisResult(analysisData);
  
  // AI species identification - extracts species info from visual analysis
  const speciesInfo = speciesProcessing.processSpeciesResult(analysisData);
  
  // Enhanced species name extraction with fallback to processedResult
  const displayFishName = speciesInfo.speciesName && speciesInfo.speciesName !== 'Spesies Tidak Teridentifikasi' 
    ? speciesInfo.speciesName 
    : processedResult.fishName;
  
  // Convert AI analysis to ParameterScore format for display components
  const parameters: ParameterScore[] = processedResult.parameters.map(param => ({
    name: param.name,
    score: param.score,
    description: param.condition,
    condition: param.reasoning,
    aiReasoning: `${param.condition} ${param.reasoning}`,
    confidence: param.confidence,
    isAnalyzable: param.isAnalyzable
  }));

  // AI-analyzed parameters (all 6 parameters from Excel format)
  const analyzableParameters = parameters.filter(p => ['Mata', 'Insang', 'Lendir', 'Daging', 'Bau', 'Tekstur'].includes(p.name));
  const nonAnalyzableParameters: any[] = []; // No non-analyzable parameters in automated AI analysis

  console.log('AI-Powered EnhancedFreshnessAnalysis: Processing automated visual analysis', {
    context: 'AUTOMATED_AI_ANALYSIS',
    route: '/species-id',
    analysisType: 'computer_vision',
    fishName: displayFishName,
    scientificName: speciesInfo.scientificName,
    family: speciesInfo.family,
    analyzableCount: analyzableParameters.length,
    overallScore: processedResult.overallScore,
    category: processedResult.category,
    rawAnalysisData: analysisData.substring(0, 500)
  });

  const getCategoryColor = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('prima')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    if (lowerCategory.includes('baik')) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    if (lowerCategory.includes('sedang')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    if (lowerCategory.includes('buruk')) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* AI-Powered Analysis Header with Context Indicators */}
      <Card className="border-2 border-visionfish-neon-pink/30 bg-gradient-to-br from-pink-50/50 to-purple-50/30 dark:from-pink-950/30 dark:to-purple-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-bold bg-gradient-to-r from-visionfish-neon-pink to-visionfish-neon-blue bg-clip-text text-transparent">
            <Fish className="h-5 w-5 sm:h-6 sm:w-6 text-visionfish-neon-pink" />
            Analisis Kesegaran AI: {displayFishName || 'Ikan'}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                SNI 2729-2013
              </Badge>
              <Badge className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 flex items-center gap-1">
                <Bot className="h-3 w-3" />
                AI Powered
              </Badge>
              <Badge variant="outline" className="text-xs bg-cyan-50 text-cyan-700 border-cyan-200 flex items-center gap-1">
                <Camera className="h-3 w-3" />
                Computer Vision
              </Badge>
            </div>
          </CardTitle>
          
          {/* Context Information Banner */}
          <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/20 rounded-lg border border-blue-200/50">
            <div className="flex items-start gap-3">
              <Bot className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-300">
                  Analisis Otomatis dengan AI
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1 leading-relaxed">
                  Hasil analisis ini dihasilkan secara otomatis menggunakan teknologi Computer Vision AI. 
                  Semua parameter dinilai berdasarkan analisis visual gambar yang Anda unggah.
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Enhanced Fish Name Display with Scientific Name and Family */}
          {(displayFishName && displayFishName !== 'Ikan') || speciesInfo.scientificName || speciesInfo.family ? (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/20 rounded-lg border border-blue-200/50">
              <div className="space-y-2">
                {displayFishName && displayFishName !== 'Ikan' && (
                  <div className="flex items-center gap-2">
                    <Fish className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-blue-800 dark:text-blue-300">Spesies (AI Detection):</span>
                    <span className="text-blue-700 dark:text-blue-400 font-medium">{displayFishName}</span>
                  </div>
                )}
                {speciesInfo.scientificName && (
                  <div className="flex items-center gap-2 ml-6">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Nama Ilmiah:</span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 italic">{speciesInfo.scientificName}</span>
                  </div>
                )}
                {speciesInfo.family && (
                  <div className="flex items-center gap-2 ml-6">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Famili:</span>
                    <span className="text-xs text-blue-600 dark:text-blue-400">{speciesInfo.family}</span>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-visionfish-neon-blue mb-1">
                {processedResult.overallScore.toFixed(1)}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Skor AI Rata-rata</div>
              <div className="text-xs text-muted-foreground mt-1">
                ({processedResult.analyzableCount} parameter otomatis)
              </div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <Badge className={`${getCategoryColor(processedResult.category)} border-0 text-sm sm:text-lg font-semibold px-3 sm:px-4 py-1 sm:py-2`}>
                {processedResult.category}
              </Badge>
              <div className="text-xs sm:text-sm text-muted-foreground mt-2">Kategori AI</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-lg font-bold text-green-600 mb-1">
                {analyzableParameters.length}/6
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Parameter AI</div>
              {processedResult.autoAssignedCount > 0 && (
                <div className="text-xs text-purple-600 mt-1 flex items-center justify-center gap-1">
                  <Zap className="h-3 w-3" />
                  {processedResult.autoAssignedCount} auto-assigned
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Category Status */}
          {processedResult.category.toLowerCase() === 'buruk' && (
            <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-200/50 mb-4">
              <h4 className="font-semibold text-sm text-red-800 dark:text-red-300 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Status AI: Tidak Layak Konsumsi
              </h4>
              <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                Berdasarkan analisis AI, ikan dalam kondisi buruk. Tidak disarankan untuk dikonsumsi.
              </p>
            </div>
          )}

          {/* Auto-Assignment Notice */}
          {processedResult.autoAssignedCount > 0 && (
            <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg border border-purple-200/50 mb-4">
              <h4 className="font-semibold text-sm text-purple-800 dark:text-purple-300 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Sistem Auto-Assignment AI Aktif
              </h4>
              <ul className="text-xs text-purple-700 dark:text-purple-400 mt-2 space-y-1">
                {processedResult.validationWarnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Enhanced SNI Notice with AI Context */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/20 p-3 sm:p-4 rounded-lg border border-blue-200/50">
            <h4 className="font-semibold text-sm mb-2 text-blue-800 dark:text-blue-300 flex items-center gap-2">
              <Info className="h-4 w-4" />
              SNI 2729-2013 AI Enhanced System
            </h4>
            <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-400 leading-relaxed">
              Sistem perhitungan menggunakan format Excel dengan AI Computer Vision untuk 
              <strong>6 Parameter</strong> (Mata, Insang, Lendir, Daging, Bau, Tekstur) 
              yang semuanya dianalisis secara otomatis dan dihitung dalam rata-rata skor total.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AI-Analyzed Parameters Section with Enhanced Context */}
      <Card className="border border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-600" />
            Parameter AI Analysis (6/6)
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                Format Excel
              </Badge>
              <Badge className="text-xs bg-gradient-to-r from-green-500 to-blue-500 text-white border-0 flex items-center gap-1">
                <Bot className="h-3 w-3" />
                Auto-Detected
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {analyzableParameters.map((parameter, index) => (
              <div key={parameter.name} className="space-y-2">
                <ParameterReliabilityIndicator 
                  parameterName={parameter.name} 
                  score={parameter.score || 0}
                  compact={true}
                />
                <ParameterScoreCard
                  parameter={parameter}
                  index={index}
                />
              </div>
            ))}
          </div>
          
          {/* Updated Info with AI Context */}
          <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/20 p-3 sm:p-4 rounded-lg border border-green-200/50">
            <h4 className="font-semibold text-sm text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" />
              AI Computer Vision - Format Excel
            </h4>
            <ul className="space-y-1 text-xs text-green-700 dark:text-green-400 leading-relaxed">
              <li>• <strong>6 Parameter AI:</strong> Mata, Insang, Lendir, Daging, Bau, Tekstur</li>
              <li>• <strong>Rumus:</strong> (Mata + Insang + Lendir + Daging + Bau + Tekstur) / 6</li>
              <li>• <strong>Bau:</strong> Estimasi AI berdasarkan kondisi visual keseluruhan</li>
              <li>• <strong>Analisis:</strong> Computer Vision otomatis dengan confidence scoring</li>
              <li>• <strong>Format:</strong> Sesuai dengan perhitungan Excel standar SNI 2729-2013</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Read More Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={() => setIsReferenceOpen(true)}
          className="bg-gradient-to-r from-visionfish-neon-blue to-visionfish-neon-pink hover:from-visionfish-neon-blue/80 hover:to-visionfish-neon-pink/80 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Baca Selengkapnya tentang SNI 2729-2013
        </Button>
      </div>

      {/* SNI Reference Modal */}
      <SNIReference 
        isOpen={isReferenceOpen} 
        onOpenChange={setIsReferenceOpen} 
      />
    </motion.div>
  );
};

export default EnhancedFreshnessAnalysis;
