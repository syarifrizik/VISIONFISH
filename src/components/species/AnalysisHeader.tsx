import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Bot, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatConfidence } from '@/utils/textProcessing';

interface AnalysisHeaderProps {
  analysisType: 'species' | 'freshness' | 'both';
  confidence?: number;
  quality?: 'high' | 'medium' | 'low';
  species?: string;
}

const AnalysisHeader = ({ analysisType, confidence, quality, species }: AnalysisHeaderProps) => {
  const getAnalysisConfig = () => {
    switch (analysisType) {
      case 'species':
        return { 
          gradient: 'from-ocean-blue to-ocean-light', 
          label: 'Species Analysis',
          bgGradient: 'from-primary/5 to-ocean-light/10'
        };
      case 'freshness':
        return { 
          gradient: 'from-emerald-500 to-teal-500', 
          label: 'Freshness Analysis',
          bgGradient: 'from-emerald-500/5 to-teal-500/10'
        };
      case 'both':
        return { 
          gradient: 'from-purple-500 to-pink-500', 
          label: 'Complete Analysis',
          bgGradient: 'from-purple-500/5 to-pink-500/10'
        };
      default:
        return { 
          gradient: 'from-primary to-primary/80', 
          label: 'AI Analysis',
          bgGradient: 'from-primary/5 to-primary/10'
        };
    }
  };

  const config = getAnalysisConfig();
  const confidenceInfo = formatConfidence(confidence);

  const getQualityIcon = () => {
    switch (quality) {
      case 'high':
        return <CheckCircle className="h-4 w-4 text-primary" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Analysis Header */}
      <div className={`flex items-center gap-3 p-4 bg-gradient-to-r ${config.bgGradient} rounded-lg border border-primary/20 glass-modern`}>
        <Bot className="h-5 w-5 text-primary" />
        <span className="font-semibold text-primary text-lg">
          Hasil Analisis AI
        </span>
        <Badge className={`bg-gradient-to-r ${config.gradient} text-white border-0 text-sm px-3 py-1 shadow-lg`}>
          <Sparkles className="h-3 w-3 mr-1" />
          {config.label}
        </Badge>
      </div>

      {/* Analysis Summary */}
      {(species || confidence || quality) && (
        <div className="flex flex-wrap items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
          {species && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Spesies:</span>
              <Badge variant="outline" className="font-medium">
                {species}
              </Badge>
            </div>
          )}
          
          {confidence && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Akurasi:</span>
              <Badge variant="outline" className={`font-medium ${confidenceInfo.color}`}>
                {confidenceInfo.percentage}
              </Badge>
            </div>
          )}

          {quality && (
            <div className="flex items-center gap-2">
              {getQualityIcon()}
              <span className="text-sm font-medium text-muted-foreground">
                Kualitas: {quality === 'high' ? 'Tinggi' : quality === 'medium' ? 'Sedang' : 'Rendah'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisHeader;