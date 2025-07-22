/**
 * Consistency & Confidence Indicator UI Component
 * Shows confidence levels and consistency warnings
 */

import { useState } from 'react';
import { AlertCircle, CheckCircle, Info, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfidenceScore } from '@/utils/consistency-engine';
import { SimilarityMatch } from '@/utils/image-cache-system';

interface ConsistencyIndicatorProps {
  confidence: ConfidenceScore;
  similarResults?: SimilarityMatch[];
  onReanalyze?: () => void;
  isAnalyzing?: boolean;
  analysisCount?: number;
}

const ConsistencyIndicator: React.FC<ConsistencyIndicatorProps> = ({
  confidence,
  similarResults = [],
  onReanalyze,
  isAnalyzing = false,
  analysisCount = 1
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'very-high': return 'text-green-600 bg-green-50 border-green-200';
      case 'high': return 'text-green-500 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getConfidenceIcon = (level: string) => {
    switch (level) {
      case 'very-high':
      case 'high':
        return <CheckCircle className="h-4 w-4" />;
      case 'medium':
        return <Info className="h-4 w-4" />;
      case 'low':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getConfidenceLabel = (level: string) => {
    switch (level) {
      case 'very-high': return 'Sangat Konsisten';
      case 'high': return 'Konsisten';
      case 'medium': return 'Cukup Konsisten';
      case 'low': return 'Kurang Konsisten';
      default: return 'Unknown';
    }
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {getConfidenceIcon(confidence.level)}
            <span>Konsistensi Analisis</span>
          </div>
          <Badge 
            variant="outline" 
            className={getConfidenceColor(confidence.level)}
          >
            {getConfidenceLabel(confidence.level)}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Confidence Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Tingkat Kepercayaan</span>
            <span className="font-semibold">{confidence.percentage}%</span>
          </div>
          <Progress 
            value={confidence.percentage} 
            className="h-2"
          />
          <p className="text-xs text-muted-foreground">
            {confidence.reasoning}
          </p>
        </div>

        {/* Analysis Count */}
        {analysisCount > 1 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <RefreshCw className="h-3 w-3" />
            <span>Analisis ke-{analysisCount}</span>
          </div>
        )}

        {/* Similar Results */}
        {similarResults.length > 0 && (
          <div className="space-y-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-primary hover:underline"
            >
              {similarResults.length} hasil serupa ditemukan
            </button>
            
            {showDetails && (
              <div className="space-y-1">
                {similarResults.map((match, index) => (
                  <div 
                    key={index}
                    className="text-xs p-2 bg-muted rounded border-l-2 border-l-primary/30"
                  >
                    <div className="flex justify-between items-center">
                      <span>{match.reason}</span>
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(match.similarity * 100)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Re-analyze Button */}
        {onReanalyze && confidence.percentage < 75 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReanalyze}
            disabled={isAnalyzing}
            className="w-full text-xs"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                Menganalisis...
              </>
            ) : (
              <>
                <RefreshCw className="h-3 w-3 mr-2" />
                Analisis Ulang untuk Konsistensi
              </>
            )}
          </Button>
        )}

        {/* Consistency Tips */}
        {confidence.level === 'low' && (
          <div className="text-xs p-2 bg-yellow-50 border border-yellow-200 rounded">
            <p className="font-medium text-yellow-800">Tips Konsistensi:</p>
            <ul className="list-disc list-inside text-yellow-700 mt-1 space-y-1">
              <li>Pastikan pencahayaan cukup</li>
              <li>Foto seluruh bagian ikan</li>
              <li>Hindari bayangan atau refleksi</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsistencyIndicator;