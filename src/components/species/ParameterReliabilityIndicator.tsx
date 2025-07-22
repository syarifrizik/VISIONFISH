
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Eye, Camera, Calculator, AlertTriangle } from 'lucide-react';
import { getParameterReliability } from '@/utils/parameter-classification';

interface ParameterReliabilityIndicatorProps {
  parameterName: string;
  score?: number | null;
  compact?: boolean;
}

const ParameterReliabilityIndicator: React.FC<ParameterReliabilityIndicatorProps> = ({
  parameterName,
  score,
  compact = false
}) => {
  const classification = getParameterReliability(parameterName);
  
  const getIcon = () => {
    switch (classification.type) {
      case 'visual':
        return <Eye className="w-3 h-3" />;
      case 'hybrid':
        return <Camera className="w-3 h-3" />;
      case 'non-visual':
        return <Calculator className="w-3 h-3" />;
      default:
        return <AlertTriangle className="w-3 h-3" />;
    }
  };

  const getColor = () => {
    switch (classification.reliability) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getReliabilityText = () => {
    switch (classification.reliability) {
      case 'high':
        return 'Akurat';
      case 'medium':
        return 'Estimasi';
      case 'low':
        return 'Terbatas';
      default:
        return 'Unknown';
    }
  };

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className={`${getColor()} text-xs flex items-center gap-1`}>
              {getIcon()}
              {getReliabilityText()}
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-2">
              <div className="font-semibold">{classification.name}</div>
              <div className="text-sm">{classification.description}</div>
              {classification.limitations && (
                <div className="text-xs text-muted-foreground">
                  <div className="font-medium">Limitasi:</div>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    {classification.limitations.map((limitation, index) => (
                      <li key={index}>{limitation}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center gap-1">
        {getIcon()}
        <span className="text-sm font-medium">{classification.name}</span>
      </div>
      <Badge variant="outline" className={`${getColor()} text-xs`}>
        {getReliabilityText()}
      </Badge>
      <div className="text-xs text-muted-foreground">
        {classification.analysisMethod === 'direct' ? 'Analisis Langsung' : 
         classification.analysisMethod === 'inference' ? 'Inferensi Visual' : 'Estimasi'}
      </div>
    </div>
  );
};

export default ParameterReliabilityIndicator;
