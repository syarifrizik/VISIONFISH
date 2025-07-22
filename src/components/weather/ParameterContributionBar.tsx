
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Info, ExternalLink } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ParameterContribution {
  name: string;
  score: number;
  weight: number;
  description: string;
  currentValue: string;
  optimalRange: string;
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

interface ParameterContributionBarProps {
  name: string;
  score: number;
  weight: number;
  description: string;
  currentValue: string;
  optimalRange: string;
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

export const ParameterContributionBar = ({ 
  name,
  score,
  weight,
  description,
  currentValue,
  optimalRange,
  status
}: ParameterContributionBarProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'fair': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{name}</span>
          <Badge variant="outline" className={cn("text-xs", getStatusColor(status))}>
            {score}/10
          </Badge>
          <span className="text-xs text-muted-foreground">
            (bobot {Math.round(weight * 100)}%)
          </span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground">
                <Info className="w-3 h-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <div className="space-y-2">
                <p className="font-medium">{description}</p>
                <div className="text-xs space-y-1">
                  <p><strong>Nilai Saat Ini:</strong> {currentValue}</p>
                  <p><strong>Rentang Optimal:</strong> {optimalRange}</p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="space-y-1">
        <Progress 
          value={score * 10} 
          className="h-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Buruk (0-3)</span>
          <span>Cukup (4-6)</span>
          <span>Baik (7-8)</span>
          <span>Excellent (9-10)</span>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800/50 p-2 rounded">
        <div className="flex items-center justify-between">
          <span>
            Kontribusi: {score} × {weight.toFixed(3)} = {(score * weight).toFixed(2)} poin
          </span>
        </div>
      </div>
    </motion.div>
  );
};
