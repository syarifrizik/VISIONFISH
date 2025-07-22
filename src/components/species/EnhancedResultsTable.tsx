import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Share2, Copy, Check, Bot, Camera, Fish, TrendingUp, Award, Sparkles, Cpu, Zap } from 'lucide-react';
import { toast } from 'sonner';
import ShareDialog from './ShareDialog';
import EnhancedTextDisplay from './EnhancedTextDisplay';

interface EnhancedResultsTableProps {
  analysisResult: string;
  isAnalyzing: boolean;
  analysisType: 'species' | 'freshness' | 'both';
  onDownload: () => void;
  onShare: () => void;
}

/**
 * AI-Powered Analysis Results Display Component - Enhanced Edition
 * Features: Modern glassmorphism design, enhanced text display, improved readability
 */
const EnhancedResultsTable = ({ 
  analysisResult, 
  isAnalyzing, 
  analysisType, 
  onDownload, 
  onShare 
}: EnhancedResultsTableProps) => {
  const [copied, setCopied] = useState(false);

  const getAnalysisConfig = () => {
    switch (analysisType) {
      case 'species':
        return {
          icon: Fish,
          label: 'Identifikasi Spesies AI',
          color: 'from-blue-500 to-cyan-500',
          bgColor: 'from-blue-500/10 to-cyan-500/10'
        };
      case 'freshness':
        return {
          icon: TrendingUp,
          label: 'Analisis Kesegaran AI',
          color: 'from-green-500 to-emerald-500',
          bgColor: 'from-green-500/10 to-emerald-500/10'
        };
      case 'both':
        return {
          icon: Award,
          label: 'Analisis Lengkap AI',
          color: 'from-purple-500 to-pink-500',
          bgColor: 'from-purple-500/10 to-pink-500/10'
        };
      default:
        return {
          icon: Sparkles,
          label: 'Analisis AI',
          color: 'from-indigo-500 to-purple-500',
          bgColor: 'from-indigo-500/10 to-purple-500/10'
        };
    }
  };

  const config = getAnalysisConfig();
  const IconComponent = config.icon;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(analysisResult);
      setCopied(true);
      toast.success("Hasil AI berhasil disalin!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Gagal menyalin hasil AI");
    }
  };

  if (isAnalyzing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-modern border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/20">
            <CardTitle className="flex items-center gap-3">
              <div className="relative">
                <IconComponent className="h-6 w-6 text-primary" />
                <div className="absolute inset-0 animate-ping">
                  <IconComponent className="h-6 w-6 text-primary opacity-20" />
                </div>
              </div>
              <span className="gradient-text font-bold text-xl">{config.label}</span>
              <Badge className={`bg-gradient-to-r ${config.color} text-white border-0 px-3 py-1`}>
                <Bot className="h-3 w-3 mr-1" />
                AI Processing
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu className="h-8 w-8 text-primary animate-pulse" />
                </div>
              </div>
              
              <div className="text-center space-y-3 max-w-md">
                <h3 className="text-2xl font-bold gradient-text">
                  AI Sedang Menganalisis
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Memproses gambar dengan teknologi computer vision dan machine learning terdepan
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span>Computer Vision</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                  <span>Deep Learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                  <span>AI Analysis</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!analysisResult) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="glass-modern border-0 overflow-hidden relative">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-4 left-4 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
            <div className="absolute bottom-4 right-4 w-24 h-24 bg-secondary rounded-full blur-2xl"></div>
          </div>
          
          <CardContent className="relative z-10 flex flex-col items-center justify-center py-16 px-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
              className="text-center space-y-8"
            >
              <div className="relative">
                <div className="w-24 h-24 mx-auto glass-card rounded-2xl flex items-center justify-center">
                  <IconComponent className="h-12 w-12 text-primary" />
                </div>
                <div className="absolute inset-0 w-24 h-24 mx-auto rounded-2xl border-2 border-primary/30 animate-ping"></div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-3xl font-bold gradient-text">
                  Hasil {config.label}
                </h3>
                <p className="text-muted-foreground max-w-lg leading-relaxed">
                  Unggah gambar ikan dan mulai analisis AI untuk mendapatkan hasil yang detail dan akurat
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                {[
                  { icon: Camera, label: 'Computer Vision', delay: 0 },
                  { icon: Zap, label: 'Real-time AI', delay: 0.2 },
                  { icon: Cpu, label: 'High Accuracy', delay: 0.4 }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: feature.delay + 0.5 }}
                    className="flex items-center gap-3 glass-card p-4 rounded-xl"
                  >
                    <feature.icon className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{feature.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-modern border-0 overflow-hidden">
        <CardHeader className={`bg-gradient-to-r ${config.bgColor} border-b border-primary/20`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-3">
              <IconComponent className="h-6 w-6 text-primary" />
              <span className="gradient-text font-bold text-xl">Hasil {config.label}</span>
              <div className="flex items-center gap-2">
                <Badge className={`bg-gradient-to-r ${config.color} text-white border-0 px-3 py-1`}>
                  <Bot className="h-3 w-3 mr-1" />
                  AI Generated
                </Badge>
                <Badge variant="outline" className="glass-card border-primary/30 text-primary">
                  <Camera className="h-3 w-3 mr-1" />
                  Computer Vision
                </Badge>
              </div>
            </CardTitle>
            
            <div className="flex items-center gap-3">
              <Badge className="glass-card border-green-500/30 text-green-600 px-4 py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Analisis Selesai
              </Badge>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="glass-card border-primary/30 hover:bg-primary/10 transition-all duration-200"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Disalin</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        <span className="text-sm">Salin</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDownload}
                  className="glass-card border-primary/30 hover:bg-primary/10 transition-all duration-200"
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span className="text-sm">Unduh</span>
                </Button>

                <ShareDialog
                  elementId="ai-analysis-results"
                  title="Hasil Analisis VisionFish AI"
                  speciesName={config.label}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <ScrollArea className="max-h-[700px] w-full">
            <div id="ai-analysis-results" className="p-6">
              <EnhancedTextDisplay 
                content={analysisResult} 
                analysisType={analysisType}
              />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnhancedResultsTable;
