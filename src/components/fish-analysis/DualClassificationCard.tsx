import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { classifyFishQuality, ClassificationResult } from '@/utils/classification-systems';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DualClassificationCardProps {
  score: number;
  fishName?: string;
}

const DualClassificationCard: React.FC<DualClassificationCardProps> = ({ 
  score, 
  fishName 
}) => {
  const classification = classifyFishQuality(score);

  const getSNIIcon = () => {
    return classification.sni.category === 'Baik' ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <AlertTriangle className="w-5 h-5 text-red-600" />
    );
  };

  const getSNIBadgeColor = () => {
    return classification.sni.category === 'Baik' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getHadiwiyotoBadgeColor = () => {
    switch (classification.hadiwiyoto.category) {
      case 'Prima':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Advance':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Sedang':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Busuk':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span>Sistem Klasifikasi Ganda</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Perbandingan hasil klasifikasi menurut SNI 2729:2013 dan Hadiwiyoto (1993)
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        {fishName && (
          <p className="text-sm text-muted-foreground">
            Hasil untuk ikan {fishName}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl font-bold text-primary mb-2"
          >
            {classification.score}/9
          </motion.div>
          <p className="text-sm text-muted-foreground">Skor Rata-rata</p>
        </div>

        {/* Classification Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SNI Classification */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3 p-4 rounded-lg bg-background/50 border"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">SNI 2729:2013</h3>
              {getSNIIcon()}
            </div>
            
            <Badge className={`w-full justify-center ${getSNIBadgeColor()}`}>
              {classification.sni.category}
            </Badge>
            
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                {classification.sni.description}
              </p>
              <div className="text-xs">
                <span className="font-medium">Ambang batas:</span> ≥{classification.sni.threshold}
              </div>
            </div>
          </motion.div>

          {/* Hadiwiyoto Classification */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3 p-4 rounded-lg bg-background/50 border"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Hadiwiyoto (1993)</h3>
              <Info className="w-4 h-4 text-muted-foreground" />
            </div>
            
            <Badge className={`w-full justify-center ${getHadiwiyotoBadgeColor()}`}>
              {classification.hadiwiyoto.category}
            </Badge>
            
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                {classification.hadiwiyoto.description}
              </p>
              <div className="text-xs">
                <span className="font-medium">Rentang:</span> {classification.hadiwiyoto.range}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-lg bg-muted/50 border-l-4 border-primary"
        >
          <h4 className="font-medium text-sm mb-2">Kesimpulan</h4>
          <p className="text-sm text-muted-foreground">
            {classification.score >= 7 
              ? `Ikan ${fishName || ''} memenuhi standar SNI dan tergolong ${classification.hadiwiyoto.category} menurut Hadiwiyoto. Layak untuk dikonsumsi.`
              : `Ikan ${fishName || ''} di bawah standar SNI (< 7) namun tergolong ${classification.hadiwiyoto.category} menurut Hadiwiyoto. ${classification.hadiwiyoto.description.toLowerCase()}.`
            }
          </p>
        </motion.div>

        {/* Reference Note */}
        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>
            <strong>SNI 2729:2013:</strong> Untari et al. (2021) - Minimal skor 7 untuk kategori baik
          </p>
          <p>
            <strong>Hadiwiyoto (1993):</strong> Sistem 4 kategori dengan interval tertentu
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DualClassificationCard;