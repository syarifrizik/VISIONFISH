
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FishParameter } from '@/utils/fish-analysis';
import { TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface ParameterSummaryCardProps {
  parameters: FishParameter;
  className?: string;
  onClick?: () => void;
}

const ParameterSummaryCard: React.FC<ParameterSummaryCardProps> = ({
  parameters,
  className = "",
  onClick,
}) => {
  const validValues = Object.values(parameters).filter(val => val !== null && val !== 4);
  const avgScore = validValues.length > 0 
    ? validValues.reduce((sum, val) => sum + val, 0) / validValues.length 
    : 0;
  const validParams = validValues.length;
  const invalidParams = Object.values(parameters).filter(val => val === 4).length;
  const emptyParams = Object.values(parameters).filter(val => val === null).length;
  
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-blue-600";
    if (score >= 7) return "text-green-600";
    if (score >= 5) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (validParams === 0) return "Belum Ada Input";
    if (score >= 8) return "Prima";
    if (score >= 7) return "Baik";
    if (score >= 5) return "Sedang";
    return "Perlu Perhatian";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Card 
        className="cursor-pointer border border-visionfish-neon-blue/20 hover:border-visionfish-neon-blue/40 transition-all duration-200"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-visionfish-neon-blue" />
              <span className="font-medium text-sm">Ringkasan Parameter</span>
            </div>
            <div className={`text-lg font-bold ${validParams > 0 ? getScoreColor(avgScore) : 'text-gray-400'}`}>
              {validParams > 0 ? avgScore.toFixed(1) : "—"}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status Keseluruhan</span>
              <Badge 
                variant="outline" 
                className={`${validParams > 0 ? getScoreColor(avgScore) : 'text-gray-400'} border-current`}
              >
                {validParams > 0 ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                {getScoreLabel(avgScore)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Parameter Lengkap</span>
              <span className="font-medium">{validParams}/6</span>
            </div>
            
            {emptyParams > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Belum Diisi
                </span>
                <span className="font-medium text-gray-500">{emptyParams}</span>
              </div>
            )}
            
            {invalidParams > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Diabaikan
                </span>
                <span className="font-medium text-amber-600">{invalidParams}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ParameterSummaryCard;
