import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Share2, Loader2, Sparkles, Activity, Brain, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { extractTableData, extractConclusion } from './SpeciesInfoBoxes';
import ResultsTable from './ResultsTable';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface LiveResultsTableProps {
  analysisResult: string;
  isAnalyzing: boolean;
  analysisType: 'species' | 'freshness' | 'both';
  onDownload?: () => void;
  onShare?: () => void;
}

const LiveResultsTable = ({
  analysisResult,
  isAnalyzing,
  analysisType,
  onDownload,
  onShare
}: LiveResultsTableProps) => {
  const [currentResult, setCurrentResult] = useState('');
  const [currentAnalysisType, setCurrentAnalysisType] = useState(analysisType);
  const [loadingStage, setLoadingStage] = useState(0);

  // Enhanced loading stages
  const loadingStages = [{
    icon: Brain,
    text: "Menganalisis Data...",
    color: "text-blue-500"
  }, {
    icon: Activity,
    text: "Memproses Gambar...",
    color: "text-green-500"
  }, {
    icon: Zap,
    text: "Menghasilkan Insight...",
    color: "text-purple-500"
  }];

  // Cycle through loading stages
  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setLoadingStage(prev => (prev + 1) % loadingStages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  // Clear results when analysis type changes (except when returning to same type)
  useEffect(() => {
    if (analysisType !== currentAnalysisType) {
      console.log("LiveResultsTable: Analysis type changed from", currentAnalysisType, "to", analysisType);
      setCurrentResult('');
      setCurrentAnalysisType(analysisType);
    }
  }, [analysisType, currentAnalysisType]);

  // Update current result when new analysis comes in
  useEffect(() => {
    if (analysisResult && analysisResult !== currentResult) {
      console.log("LiveResultsTable: New analysis result received:", analysisResult.length, "characters");
      setCurrentResult(analysisResult);
    }
  }, [analysisResult, currentResult]);

  // Reset when analysis starts
  useEffect(() => {
    if (isAnalyzing) {
      console.log("LiveResultsTable: Analysis started, keeping current type but clearing if different");
      // Only clear if we're starting a new analysis, not if we're continuing with same type
    }
  }, [isAnalyzing]);

  const getAnalysisTypeLabel = () => {
    switch (analysisType) {
      case 'species':
        return 'Identifikasi Spesies';
      case 'freshness':
        return 'Analisis Kesegaran';
      case 'both':
        return 'Analisis Lengkap';
      default:
        return 'Hasil Analisis';
    }
  };

  const getAnalysisTypeBadge = () => {
    switch (analysisType) {
      case 'species':
        return {
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
          icon: '🐟'
        };
      case 'freshness':
        return {
          color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
          icon: '✨'
        };
      case 'both':
        return {
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
          icon: '⚡'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
          icon: '🔍'
        };
    }
  };

  const badgeStyle = getAnalysisTypeBadge();
  const CurrentStageIcon = loadingStages[loadingStage].icon;

  // Shimmer effect component
  const ShimmerEffect = () => (
    <div className="animate-pulse">
      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-5/6" />
        <div className="space-y-2 pt-4">
          <Skeleton className="h-6 w-1/3" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    </div>
  );

  // Enhanced table parsing for freshness analysis
  const parseFreshnessTable = (data: string) => {
    const tableData = [];
    const lines = data.split('\n');
    
    for (const line of lines) {
      // Look for parameter rows with scores
      const parameterMatch = line.match(/\|\s*(\w+)\s*\|\s*([^|]+)\s*\|\s*(\d+)\s*\|/);
      if (parameterMatch) {
        tableData.push({
          parameter: parameterMatch[1],
          condition: parameterMatch[2].trim(),
          score: parseInt(parameterMatch[3])
        });
      }
    }
    
    return tableData;
  };

  const freshnessTableData = parseFreshnessTable(currentResult);
  const showFreshnessTable = freshnessTableData.length > 0 && 
    (analysisType === 'freshness' || analysisType === 'both');

  console.log("LiveResultsTable render:", { 
    analysisResult: analysisResult ? analysisResult.substring(0, 50) + "..." : "empty",
    currentResult: currentResult ? currentResult.substring(0, 50) + "..." : "empty",
    isAnalyzing,
    analysisType,
    currentAnalysisType
  });

  return (
    <Card className="relative overflow-hidden border-2 border-visionfish-neon-blue/30 bg-gradient-to-br from-white/50 to-blue-50/30 dark:from-gray-900/50 dark:to-blue-950/30 backdrop-blur-sm">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-visionfish-neon-blue/10 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-visionfish-neon-pink/10 to-transparent rounded-full blur-2xl"></div>

      <CardHeader className="relative bg-gradient-to-r from-visionfish-neon-blue/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-visionfish-neon-blue to-visionfish-neon-pink bg-clip-text text-transparent">
              {getAnalysisTypeLabel()}
            </CardTitle>
            <Badge className={`${badgeStyle.color} border-0 font-medium`}>
              {badgeStyle.icon} {getAnalysisTypeLabel()}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              disabled={!currentResult || isAnalyzing}
              className="border-visionfish-neon-blue/30 hover:bg-visionfish-neon-blue/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Unduh
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
              disabled={!currentResult || isAnalyzing}
              className="border-visionfish-neon-blue/30 hover:bg-visionfish-neon-blue/10"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Bagikan
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4 p-6">
        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12 space-y-6"
            >
              {/* Enhanced Loading Animation */}
              <div className="relative">
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    rotate: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    },
                    scale: {
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  className={`w-16 h-16 mx-auto ${loadingStages[loadingStage].color}`}
                >
                  <CurrentStageIcon className="w-full h-full" />
                </motion.div>
                <div className="absolute inset-0 bg-visionfish-neon-blue/20 rounded-full blur-xl animate-pulse"></div>
              </div>
              
              {/* Dynamic Loading Text */}
              <div className="space-y-2">
                <motion.p
                  key={loadingStage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`text-lg font-semibold ${loadingStages[loadingStage].color}`}
                >
                  {loadingStages[loadingStage].text}
                </motion.p>
                <p className="text-muted-foreground">
                  Teknologi computer vision sedang memproses gambar Anda
                </p>
              </div>
              
              {/* Enhanced Progress Animation */}
              <div className="w-full max-w-xs mx-auto space-y-4">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-visionfish-neon-blue to-visionfish-neon-pink"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
                
                {/* Shimmer Preview */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-6"
                >
                  <ShimmerEffect />
                </motion.div>
              </div>
            </motion.div>
          ) : currentResult ? (
            <motion.div
              key={`results-${analysisType}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Instant Results Display */}
              <div className="relative">
                <ScrollArea className="h-[400px] relative">
                  <div className="space-y-4">
                    {/* Enhanced Freshness Table Display */}
                    {showFreshnessTable && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mb-6"
                      >
                        <Card className="border border-visionfish-neon-pink/30 bg-gradient-to-br from-pink-50/30 to-purple-50/20 dark:from-pink-950/20 dark:to-purple-950/10">
                          <CardHeader>
                            <CardTitle className="text-lg font-semibold text-visionfish-neon-pink">
                              Parameter Kesegaran (SNI 2729-2013)
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="font-semibold">Parameter</TableHead>
                                  <TableHead className="font-semibold">Kondisi</TableHead>
                                  <TableHead className="font-semibold text-center">Skor</TableHead>
                                  <TableHead className="font-semibold text-center">Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {freshnessTableData.map((row, index) => {
                                  const getScoreColor = (score: number) => {
                                    if (score >= 9) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
                                    if (score >= 7) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
                                    if (score >= 5) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
                                    if (score >= 1) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
                                    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
                                  };

                                  const getScoreStatus = (score: number) => {
                                    if (score >= 9) return 'Prima';
                                    if (score >= 7) return 'Baik';
                                    if (score >= 5) return 'Sedang';
                                    if (score >= 1) return 'Buruk';
                                    return 'Invalid';
                                  };

                                  return (
                                    <TableRow key={index}>
                                      <TableCell className="font-medium">{row.parameter}</TableCell>
                                      <TableCell className="text-sm">{row.condition}</TableCell>
                                      <TableCell className="text-center">
                                        <Badge className={`${getScoreColor(row.score)} border-0 font-bold`}>
                                          {row.score}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-center text-sm font-medium">
                                        {getScoreStatus(row.score)}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                    
                    {/* Instant Text Display */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="prose prose-sm dark:prose-invert max-w-none"
                    >
                      <ReactMarkdown>{currentResult}</ReactMarkdown>
                    </motion.div>
                    
                    {/* Standard Table Display for other analyses */}
                    {!showFreshnessTable && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        <ResultsTable markdownData={currentResult} />
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Fade effect at bottom */}
                  <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
                </ScrollArea>
              </div>
              
              {/* Analysis Summary Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">AI</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-300">Analisis Selesai</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Hasil analisis dengan tingkat akurasi tinggi
                      </p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-900 dark:text-green-300">Siap Digunakan</h4>
                      <p className="text-sm text-green-700 dark:text-green-400">
                        Hasil dapat diunduh dan dibagikan
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key={`empty-${analysisType}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12 space-y-4 text-muted-foreground"
            >
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-medium">Hasil analisis akan ditampilkan di sini</p>
                <p className="text-sm">Unggah gambar dan pilih jenis analisis untuk memulai</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default LiveResultsTable;
