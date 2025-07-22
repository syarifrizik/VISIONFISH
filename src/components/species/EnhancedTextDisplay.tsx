
import React, { useMemo, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { parseAnalysisResponse, validateAnalysisQuality, cleanAnalysisText } from '@/utils/textProcessing';
import AnalysisHeader from './AnalysisHeader';
import MarkdownRenderer from './MarkdownRenderer';
import ErrorBoundary from './ErrorBoundary';
import LoadingState from './LoadingState';

interface EnhancedTextDisplayProps {
  content: string;
  analysisType: 'species' | 'freshness' | 'both';
}

const EnhancedTextDisplay = ({ content, analysisType }: EnhancedTextDisplayProps) => {
  // Process and validate analysis content
  const processedAnalysis = useMemo(() => {
    if (!content) return null;
    
    const parsed = parseAnalysisResponse(content);
    const validation = validateAnalysisQuality(parsed);
    
    return {
      ...parsed,
      validation
    };
  }, [content]);

  // Clean content for display
  const cleanContent = useMemo(() => {
    if (!content) return '';
    return cleanAnalysisText(content, {
      removeMarkdown: false, // Keep markdown for rendering
      removeArtifacts: true,
      normalizeWhitespace: true,
      removeEmptyLines: true
    });
  }, [content]);

  if (!content) return null;

  if (!processedAnalysis) {
    return (
      <Alert variant="destructive" className="max-w-2xl">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Gagal memproses hasil analisis. Silakan coba lagi.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ErrorBoundary fallback={
      <LoadingState analysisType={analysisType} />
    }>
      <div className="space-y-4 animate-fade-in">
        {/* Enhanced Analysis Header */}
        <AnalysisHeader 
          analysisType={analysisType}
          confidence={processedAnalysis.confidence}
          quality={processedAnalysis.validation.quality}
          species={processedAnalysis.species}
        />

        {/* Quality Validation Alert */}
        {!processedAnalysis.validation.isValid && (
          <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 animate-slide-in-top">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-sm">
              <strong className="text-orange-800 dark:text-orange-200">Analisis perlu perbaikan:</strong>
              <span className="text-orange-700 dark:text-orange-300 ml-1">
                {processedAnalysis.validation.issues.join(', ')}
              </span>
            </AlertDescription>
          </Alert>
        )}

        {/* Enhanced Content Display */}
        <Card className="p-0 glass-modern border border-primary/20 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          <ScrollArea className="h-[500px] w-full">
            <div className="p-6">
              <Suspense fallback={<LoadingState analysisType={analysisType} />}>
                <MarkdownRenderer content={cleanContent} />
              </Suspense>
            </div>
          </ScrollArea>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default EnhancedTextDisplay;
