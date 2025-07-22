import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  analysisType: 'species' | 'freshness' | 'both';
}

const LoadingState = ({ analysisType }: LoadingStateProps) => {
  const getAnalysisLabel = () => {
    switch (analysisType) {
      case 'species':
        return 'Species Analysis';
      case 'freshness':
        return 'Freshness Analysis';
      case 'both':
        return 'Complete Analysis';
      default:
        return 'AI Analysis';
    }
  };

  return (
    <div className="space-y-4">
      {/* Loading Header */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20 glass-modern">
        <Bot className="h-5 w-5 text-primary animate-pulse" />
        <span className="font-semibold text-primary text-lg">
          Memproses Analisis AI...
        </span>
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 text-sm px-3 py-1 rounded-full flex items-center gap-2">
          <Sparkles className="h-3 w-3 animate-spin" />
          {getAnalysisLabel()}
        </div>
      </div>

      {/* Loading Content */}
      <Card className="p-6 glass-modern border border-primary/20">
        <div className="space-y-4">
          {/* Header Skeleton */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </div>
          
          {/* Content Skeletons */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* List Skeletons */}
          <div className="space-y-2 pt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-1.5 w-1.5 rounded-full mt-2" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>

          {/* Bottom Skeletons */}
          <div className="space-y-3 pt-4">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoadingState;