
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import ParameterInfoPopup from './ParameterInfoPopup';

export interface ParameterScore {
  name: string;
  score: number | null;
  description?: string;
  condition?: string;
  aiReasoning?: string;
  confidence?: 'high' | 'medium' | 'low' | 'auto-assigned';
  isAnalyzable?: boolean;
}

interface ParameterScoreCardProps {
  parameter: ParameterScore;
  index: number;
}

const ParameterScoreCard = ({ parameter, index }: ParameterScoreCardProps) => {
  const [showInfoPopup, setShowInfoPopup] = useState(false);

  // Updated parameter categorization
  const isAnalyzable = ['Mata', 'Insang', 'Lendir', 'Daging', 'Tekstur'].includes(parameter.name);
  const isNonAnalyzable = ['Bau'].includes(parameter.name);
  
  // Special handling for Bau - show bar but empty with N/A
  const displayScore = parameter.score;
  const hasScore = parameter.score !== null && parameter.score !== undefined;
  const progressValue = hasScore ? (parameter.score / 9) * 100 : 0;

  console.log(`ParameterScoreCard ${parameter.name}: score=${parameter.score}, hasScore=${hasScore}, analyzable=${isAnalyzable}`);

  // Enhanced text cleaning function for display
  const cleanDisplayText = (text: string): string => {
    if (!text) return '';
    
    return text
      // Remove all markdown artifacts
      .replace(/\*\*([^*]+)\*\*/g, '$1') // **bold** -> bold
      .replace(/\*([^*]+)\*/g, '$1') // *italic* -> italic
      .replace(/#{1,6}\s?/g, '') // Remove headers
      
      // Remove bullet point artifacts - COMPREHENSIVE
      .replace(/^[\s]*[-*•]\s*\*+[\s]*/gm, '') // "- *", "* *", "• *"
      .replace(/^[\s]*\*+[\s]*[-*•][\s]*/gm, '') // "* -", "** *"
      .replace(/^[\s]*[-*•]\s*$/gm, '') // Standalone bullets
      .replace(/[-*•]\s*\*+[\s]*$/gm, '') // Trailing "- *"
      .replace(/\*+[\s]*[-*•][\s]*$/gm, '') // Trailing "* -"
      
      // Clean up symbols and formatting
      .replace(/\|/g, '') // Remove pipes
      .replace(/[_`~]/g, '') // Remove underscores, backticks, tildes
      .replace(/^\s*[:>]/gm, '') // Remove leading colons and quotes
      
      // Remove standalone symbols
      .replace(/^[\s]*[*-•]+[\s]*$/gm, '') // Remove lines with only bullets
      .replace(/[\s]*\*+[\s]*$/gm, '') // Remove trailing asterisks
      .replace(/^[\s]*\*+[\s]*/gm, '') // Remove leading asterisks
      
      // Clean up whitespace
      .replace(/\s+/g, ' ') // Multiple spaces to single
      .replace(/\n\s*\n/g, '\n') // Multiple newlines to single
      .trim()
      
      // Final cleanup
      .replace(/^[:\-*•\s]+/, '') // Remove any leading symbols
      .replace(/[:\-*•\s]+$/, '') // Remove any trailing symbols
      .trim();
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    if (score >= 7) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    if (score >= 1) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  const getProgressColor = (score: number) => {
    if (score >= 9) return 'bg-blue-500';
    if (score >= 7) return 'bg-green-500';
    if (score >= 5) return 'bg-yellow-500';
    if (score >= 1) return 'bg-red-500';
    return 'bg-gray-300';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 9) return 'Prima';
    if (score >= 7) return 'Baik';
    if (score >= 5) return 'Sedang';
    if (score >= 1) return 'Buruk';
    return 'Invalid';
  };

  // Clean condition text for display
  const cleanCondition = parameter.condition ? cleanDisplayText(parameter.condition) : '';
  const displayCondition = cleanCondition || (isNonAnalyzable ? 'Tidak dapat dianalisis dari foto' : 'Kondisi tidak terdeteksi');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className={`h-full ${isNonAnalyzable ? 'bg-orange-50/50 dark:bg-orange-950/20' : 'bg-white/50 dark:bg-gray-800/50'} border ${isNonAnalyzable ? 'border-orange-200/50' : 'border-white/20'} hover:shadow-md transition-shadow`}>
        <CardContent className="p-3 sm:p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm">{parameter.name}</h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-visionfish-neon-blue/10"
                onClick={() => setShowInfoPopup(true)}
              >
                <Info className="h-3 w-3 text-visionfish-neon-blue" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {hasScore && (
                <Badge className={`${getScoreColor(displayScore!)} border-0 text-xs font-bold`}>
                  {displayScore}
                </Badge>
              )}
              {!hasScore && parameter.name === 'Bau' && (
                <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-0 text-xs">
                  N/A
                </Badge>
              )}
              {parameter.confidence === 'auto-assigned' && (
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-0 text-xs">
                  Auto
                </Badge>
              )}
            </div>
          </div>

          {/* Progress Bar - Show for all parameters, but empty for Bau */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Skor</span>
              {hasScore ? (
                <>
                  <span className="hidden sm:inline">{getScoreStatus(displayScore!)}</span>
                  <span className="sm:hidden">
                    {getScoreStatus(displayScore!).substring(0, 6)}
                  </span>
                </>
              ) : (
                <span className="text-gray-500">Tidak Dinilai</span>
              )}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${hasScore ? getProgressColor(displayScore!) : 'bg-gray-300'}`}
                style={{ width: `${progressValue}%` }}
              />
            </div>
          </div>

          {/* Enhanced Description Display - Full text, no truncation issues */}
          {displayCondition && displayCondition.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground leading-relaxed break-words">
                {displayCondition}
              </p>
            </div>
          )}

          {/* Enhanced note for non-analyzable parameters (Bau only) */}
          {isNonAnalyzable && (
            <div className="pt-2 border-t border-orange-200 dark:border-orange-700">
              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                {parameter.name} tidak dapat dianalisis dari foto - tidak dihitung dalam skor total
              </p>
              <p className="text-xs text-orange-500 dark:text-orange-500 mt-1">
                Mohon periksa aroma secara langsung untuk penilaian yang akurat
              </p>
            </div>
          )}

          {/* Enhanced note for analyzable parameters */}
          {isAnalyzable && (
            <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                {parameter.name === 'Daging' 
                  ? 'Estimasi berdasarkan bentuk visual'
                  : parameter.name === 'Tekstur'
                  ? 'Estimasi berdasarkan tampilan visual'
                  : 'Dianalisis berdasarkan pengamatan visual'
                }
                {parameter.confidence === 'auto-assigned' && (
                  <span className="block mt-1 text-purple-600 dark:text-purple-400">
                    Skor ditetapkan otomatis dari deskripsi kondisi
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Score Scale Reference - Hidden on mobile for space */}
          <div className="hidden sm:block pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
              <span>1-3: Buruk</span>
              <span>5-6: Sedang</span>
              <span>7-8: Baik</span>
              <span>9: Prima</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parameter Info Popup */}
      <ParameterInfoPopup
        isOpen={showInfoPopup}
        onOpenChange={setShowInfoPopup}
        parameterName={parameter.name}
        aiReasoning={parameter.aiReasoning} 
      />
    </motion.div>
  );
};

export default ParameterScoreCard;
