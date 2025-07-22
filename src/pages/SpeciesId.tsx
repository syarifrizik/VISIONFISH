import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, Camera, Image as ImageIcon, Loader2, Download, Share2, History, Crown, AlertTriangle, CheckCircle, Info, Sparkles, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { AVAILABLE_MODELS, AI_MODELS, hasPremiumAccess, getOptimizedGenerationConfig } from '@/utils/ai-models-enterprise';
import { imageCacheSystem, generateImageHash } from '@/utils/image-cache-system';
import { calculateConfidence, ConfidenceScore } from '@/utils/consistency-engine';
import { validateConsistentOutput, normalizeOutput } from '@/utils/enhanced-prompt-consistency';
import ConsistencyIndicator from '@/components/species/ConsistencyIndicator';
import { supabase } from '@/integrations/supabase/client';
import ModelSelector from "@/components/species/ModelSelector";
import { useAuth } from "@/hooks/useAuth";
import MobileSafeContainer from "@/components/layout/MobileSafeContainer";
import { useIsMobile } from "@/hooks/use-mobile";
import UserQuotaDisplay from "@/components/species/UserQuotaDisplay";

// Enhanced Components
import ModernSpeciesHeader from "@/components/species/ModernSpeciesHeader";
import DualAnalysisSelector, { AnalysisType } from "@/components/species/DualAnalysisSelector";
import EnhancedUploadZone from "@/components/species/EnhancedUploadZone";
import EnhancedResultsTable from "@/components/species/EnhancedResultsTable";
import SNIGradingSystem from "@/components/species/SNIGradingSystem";
import EnhancedFreshnessAnalysis from "@/components/species/EnhancedFreshnessAnalysis";
import EnhancedSpeciesAnalysis from "@/components/species/EnhancedSpeciesAnalysis";
import SNIReference from "@/components/species/SNIReference";
import ErrorHandlingModal from "@/components/species/ErrorHandlingModal";
import { analyzeError, formatErrorForUser, shouldShowUpgradePrompt, shouldShowAdminSettings } from "@/utils/error-handling";
import { filterUserOutput } from "@/utils/output-filter";

interface AnalysisResult {
  id: string;
  image: string;
  result: string;
  model: AI_MODELS;
  timestamp: Date;
  type: 'species' | 'freshness' | 'both';
}

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * MAIN ROUTE: /species-id - AI-Powered Automated Fish Analysis
 * 
 * CONTEXT: This is the automated AI analysis route using computer vision
 * Features: 
 * - Automated image upload and AI processing
 * - Computer vision-based species identification  
 * - Automated freshness analysis with Excel-format scoring
 * - AI confidence scoring and auto-assignment
 * 
 * IMPORTANT: This differs from /fish-analysis (manual input route)
 * - This route: AI analyzes uploaded images automatically
 * - Manual route: Users input their own scores and data
 */
const SpeciesIdentificationPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isPremium } = useAuth();
  
  // AI Analysis State Management
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<AI_MODELS>(AI_MODELS.NEPTUNE_FLOW);
  const [analysisType, setAnalysisType] = useState<AnalysisType>('both');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  
  // UI State Management
  const [showHistory, setShowHistory] = useState(false);
  const [showSNIReference, setShowSNIReference] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [currentError, setCurrentError] = useState<'api_quota' | 'network' | 'invalid_key' | 'unknown'>('unknown');
  const [errorDetails, setErrorDetails] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Consistency System State
  const [confidence, setConfidence] = useState<ConfidenceScore | null>(null);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [imageHash, setImageHash] = useState<string | null>(null);

  useEffect(() => {
    console.log("AI-SpeciesId: Analysis type changed to:", analysisType);
    console.log("AI-SpeciesId: Route context - /species-id (automated AI analysis)");
    setAnalysisResult("");
    setConfidence(null);
    setAnalysisCount(0);
  }, [analysisType]);

  // AI Image Processing Handler
  const handleImageUpload = useCallback(async (file: File) => {
    try {
      console.log("AI-SpeciesId: Starting automated image upload process...", file.name, file.size);
      const compressedImage = await compressImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedImage(result);
        
        // Generate image hash for consistency tracking
        const hash = generateImageHash(result);
        setImageHash(hash);
        
        // Check for cached results
        const cachedResult = imageCacheSystem.getCachedResult(hash, analysisType);
        if (cachedResult) {
          setAnalysisResult(cachedResult.result);
          setConfidence(calculateConfidence(cachedResult.result, analysisType));
          toast.success("🎯 Hasil konsisten ditemukan! Menggunakan analisis terdahulu.");
        } else {
          // Check for similar results
          const similarResults = imageCacheSystem.findSimilarResults(hash, analysisType);
          if (similarResults.length > 0) {
            console.log('🔍 Similar results found:', similarResults.length);
          }
        }
        
        console.log("AI-SpeciesId: Image uploaded successfully for AI analysis, size:", result.length);
        toast.success("Gambar berhasil diunggah untuk analisis AI!");
      };
      reader.readAsDataURL(compressedImage);
    } catch (error) {
      console.error("AI-SpeciesId: Error handling image upload:", error);
      toast.error("Gagal mengunggah gambar untuk analisis AI. Silakan coba lagi.");
    }
  }, []);

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => {
        const img = new Image();
        img.onload = () => {
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(blob => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Failed to compress image'));
              }
            }, 'image/jpeg', 0.7);
          } else {
            reject(new Error('Could not get canvas context'));
          }
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setAnalysisResult("");
    setConfidence(null);
    setImageHash(null);
    setAnalysisCount(0);
    toast.success("Gambar berhasil dihapus");
  };

  const handleModelChange = (modelId: AI_MODELS) => {
    const model = AVAILABLE_MODELS.find(m => m.id === modelId);
    if (model?.isPremium && !hasPremiumAccess(isPremium)) {
      toast.warning("Model enterprise ini hanya tersedia untuk pengguna Premium", {
        action: {
          label: "Upgrade",
          onClick: () => navigate("/premium")
        }
      });
      return;
    }
    setSelectedModel(modelId);
    toast.success(`Model berhasil diubah ke ${model?.name}`);
  };

  const handleAnalysisTypeChange = (type: AnalysisType) => {
    console.log("SpeciesId: Changing analysis type from", analysisType, "to", type);
    setAnalysisType(type);
  };

  const analyzeImage = async () => {
    console.log("🔴 AI-ANALYSIS STARTED! VisionFish AI automated analysis");
    console.log("🔴 Route Context: /species-id (automated AI analysis)");
    console.log("🔴 Analysis Type: computer_vision_automated");
    console.log("🔴 Selected image exists:", !!selectedImage);
    console.log("🔴 Analysis type:", analysisType);
    console.log("🔴 Is analyzing:", isAnalyzing);
    console.log("🔴 Button should be enabled:", !isButtonDisabled);
    
    if (!selectedImage) {
      console.log("🔴 ERROR: No image selected for AI analysis");
      toast.error("Silakan pilih gambar terlebih dahulu untuk analisis AI");
      return;
    }

    if (isAnalyzing) {
      console.log("🔴 ERROR: AI analysis already in progress");
      return;
    }

    console.log("🔴 Setting isAnalyzing to true - starting AI processing");
    setIsAnalyzing(true);
    setAnalysisResult("");
    
    try {
      console.log("🔴 Starting automated AI analysis process...");
      
      // Generate session fingerprint for AI analysis
      const sessionFingerprint = btoa(JSON.stringify({
        userAgent: navigator.userAgent,
        screen: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        context: 'automated_ai_analysis',
        route: '/species-id'
      }));

      // Get user info for AI analysis
      const { data: authData } = await supabase.auth.getUser();
      console.log("🔴 User auth data for AI analysis:", authData.user?.id || 'No user logged in');
      
      console.log("🔴 Calling Supabase AI function with automated analysis type:", analysisType);
      
      // Call AI analysis edge function
      const { data, error } = await supabase.functions.invoke('gemini-analysis-v2', {
        body: {
          image: selectedImage,
          analysisType,
          sessionFingerprint,
          userId: authData.user?.id || null,
          context: 'automated_ai_analysis', // Route context identifier
          route: '/species-id'
        }
      });

      console.log("🔴 Supabase AI function response:", { data, error });

      if (error) {
        console.error("🔴 AI Analysis error:", error);
        
        // Enhanced error handling with AI context
        if (error.name === 'FunctionsHttpError') {
          console.log("🔴 AI Functions HTTP Error - checking response status");
          
          try {
            const errorResponse = await fetch(error.url || '', { method: 'HEAD' }).catch(() => null);
            if (errorResponse?.status === 503) {
              setCurrentError('invalid_key');
              setErrorDetails('AI API key tidak tersedia atau layanan sedang maintenance');
            } else if (errorResponse?.status === 429) {
              setCurrentError('api_quota');
              setErrorDetails('Quota AI API telah habis');
            } else {
              setCurrentError('network');
              setErrorDetails('Koneksi ke layanan AI gagal');
            }
          } catch {
            setCurrentError('unknown');
            setErrorDetails('Terjadi kesalahan yang tidak terduga pada AI analysis');
          }
          
          setShowErrorModal(true);
          return;
        }
        
        // Handle specific AI error types
        const errorMessage = error.message?.toLowerCase() || '';
        
        if (errorMessage.includes('quota') || errorMessage.includes('exceeded') || errorMessage.includes('429')) {
          console.log("🔴 AI Quota exceeded error detected");
          setCurrentError('api_quota');
          setErrorDetails(error.message || 'AI API quota exceeded');
          setShowErrorModal(true);
          return;
        }
        
        if (errorMessage.includes('api key') || errorMessage.includes('key') || errorMessage.includes('503')) {
          console.log("🔴 AI API key error detected");
          setCurrentError('invalid_key');
          setErrorDetails(error.message || 'AI API key not available');
          setShowErrorModal(true);
          return;
        }
        
        if (errorMessage.includes('network') || errorMessage.includes('connection') || errorMessage.includes('fetch')) {
          console.log("🔴 AI Network error detected");
          setCurrentError('network');
          setErrorDetails(error.message || 'AI Network connection failed');
          setShowErrorModal(true);
          return;
        }
        
        // Default AI error handling
        setCurrentError('unknown');
        setErrorDetails(error.message || 'Unknown AI analysis error occurred');
        setShowErrorModal(true);
        return;
      }

      if (data?.error) {
        console.log("🔴 AI quota/permission error:", data);
        
        // Handle AI quota-related errors from response data
        if (data.type === 'login_required') {
          console.log("🔴 AI Login required from response");
          setCurrentError('api_quota');
          setErrorDetails('Silakan login untuk melanjutkan analisis AI');
          setShowErrorModal(true);
          return;
        }
        
        if (data.type === 'quota_exceeded' || data.type === 'api_quota') {
          console.log("🔴 AI Quota exceeded from response");
          setCurrentError('api_quota');
          setErrorDetails(data.details || data.error);
          setShowErrorModal(true);
          return;
        }
        
        if (data.type === 'cooldown') {
          console.log("🔴 AI Cooldown active from response");
          toast.warning("Mohon tunggu cooldown AI selesai sebelum analisis berikutnya", {
            description: `Cooldown: ${new Date(data.quota_info?.cooldown_until).toLocaleTimeString()}`
          });
          return;
        }
        
        if (data.type === 'invalid_key') {
          console.log("🔴 AI Invalid key from response");
          setCurrentError('invalid_key');
          setErrorDetails(data.details || data.error);
          setShowErrorModal(true);
          return;
        }
        
        if (data.type === 'network') {
          console.log("🔴 AI Network error from response");
          setCurrentError('network');
          setErrorDetails(data.details || data.error);
          setShowErrorModal(true);
          return;
        }
        
        // Handle other AI error types
        setCurrentError(data.type || 'unknown');
        setErrorDetails(data.details || data.error);
        setShowErrorModal(true);
        return;
      }
      
      // Process successful AI analysis result with consistency
      console.log("🔴 AI Analysis successful, processing result...");
      const analysisText = data.analysis;
      
      // Apply consistency processing
      const normalizedResult = normalizeOutput(analysisText, analysisType);
      const validation = validateConsistentOutput(normalizedResult, analysisType);
      
      console.log('🎯 Consistency validation:', validation);
      
      // Calculate confidence score
      const confidenceScore = calculateConfidence(normalizedResult, analysisType);
      setConfidence(confidenceScore);
      
      // Cache the result for future consistency
      if (imageHash) {
        imageCacheSystem.setCachedResult(imageHash, analysisType, normalizedResult, confidenceScore.percentage);
      }
      
      const userFriendlyResult = filterUserOutput(normalizedResult);
      
      console.log("🔴 Setting AI analysis result...");
      setAnalysisResult(userFriendlyResult);
      setAnalysisCount(prev => prev + 1);
      
      toast.success("VisionFish AI berhasil menganalisis gambar!", {
        description: "Hasil telah divalidasi dengan Computer Vision Technology"
      });

      // Add to AI analysis history
      const newAnalysis: AnalysisResult = {
        id: generateId(),
        image: selectedImage,
        result: userFriendlyResult,
        model: selectedModel,
        timestamp: new Date(),
        type: analysisType
      };
      setAnalysisHistory(prev => [newAnalysis, ...prev]);
      console.log("🔴 AI Analysis completed successfully!");

    } catch (error) {
      console.error("🔴 AI Analysis error:", error);
      
      // Handle different types of caught AI errors
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('login') || errorMessage.includes('auth')) {
          setCurrentError('api_quota');
          setErrorDetails('Silakan login untuk melanjutkan analisis AI');
          setShowErrorModal(true);
          return;
        }
        
        if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
          setCurrentError('api_quota');
          setErrorDetails(error.message);
          setShowErrorModal(true);
          return;
        }
        
        if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
          setCurrentError('network');
          setErrorDetails(error.message);
          setShowErrorModal(true);
          return;
        }
      }
      
      setCurrentError('unknown');
      setErrorDetails(error instanceof Error ? error.message : 'Unexpected AI analysis error occurred');
      setShowErrorModal(true);
      
    } finally {
      console.log("🔴 Setting isAnalyzing to false - AI analysis complete");
      setIsAnalyzing(false);
    }
  };

  const downloadResult = () => {
    const element = document.createElement("a");
    const file = new Blob([analysisResult], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "analysis_result.txt";
    document.body.appendChild(element);
    element.click();
    toast.success("Hasil analisis berhasil diunduh!");
  };

  const shareResult = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Hasil Analisis Ikan",
          text: analysisResult
        });
        toast.success("Hasil analisis berhasil dibagikan!");
      } catch (error) {
        console.error("Sharing failed:", error);
        toast.error("Gagal membagikan hasil analisis.");
      }
    } else {
      try {
        await navigator.clipboard.writeText(analysisResult);
        toast.success("Hasil analisis berhasil disalin ke clipboard!");
      } catch (error) {
        toast.warning("Fitur berbagi tidak didukung di perangkat ini.");
      }
    }
  };

  const viewHistory = () => {
    if (!hasPremiumAccess(isPremium)) {
      toast.info("Fitur riwayat hanya tersedia untuk pengguna Premium", {
        action: {
          label: "Upgrade",
          onClick: () => navigate("/premium")
        }
      });
      return;
    }
    setShowHistory(!showHistory);
  };

  // Check if AI analysis button should be disabled
  const isButtonDisabled = !selectedImage || isAnalyzing;
  
  console.log("🔴 AI Button state check - disabled:", isButtonDisabled, "selectedImage:", !!selectedImage, "isAnalyzing:", isAnalyzing);

  const getAnalysisButtonText = () => {
    switch (analysisType) {
      case 'species':
        return 'Mulai Analisis Spesies AI';
      case 'freshness':
        return 'Mulai Analisis Kesegaran AI';
      case 'both':
        return 'Mulai Analisis Lengkap AI';
      default:
        return 'Mulai Analisis AI';
    }
  };

  const PageContent = () => (
    <div className="space-y-8 sm:space-y-12">
      {/* Route Context Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/20 p-4 rounded-lg border border-blue-200/50 mb-6">
        <div className="flex items-center gap-3">
          <Bot className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="font-semibold text-blue-800 dark:text-blue-300">Analisis AI Otomatis</h2>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Upload gambar ikan untuk analisis otomatis menggunakan Computer Vision AI
            </p>
          </div>
        </div>
      </div>

      {/* Modern Header */}
      <ModernSpeciesHeader />

      {/* Model Selector */}
      <ModelSelector selectedModel={selectedModel} onModelChange={handleModelChange} />
      
      {/* User Quota Display */}
      <UserQuotaDisplay />
      
      {/* Analysis Type Selector with Dynamic Tips */}
      <DualAnalysisSelector 
        selectedType={analysisType} 
        onChange={handleAnalysisTypeChange}
        disabled={isAnalyzing}
      />

      {/* SNI Grading System - Show only for freshness or both analysis */}
      {(analysisType === 'freshness' || analysisType === 'both') && (
        <SNIGradingSystem onOpenFlipbook={() => setShowSNIReference(true)} />
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Upload Zone */}
        <div className="space-y-6">
          <Card className="border-visionfish-neon-blue/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-visionfish-neon-blue" />
                Unggah Gambar untuk Analisis AI
                <Badge className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 flex items-center gap-1">
                  <Bot className="h-3 w-3" />
                  AI Ready
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedUploadZone
                selectedImage={selectedImage}
                onImageUpload={handleImageUpload}
                onImageRemove={handleImageRemove}
                disabled={isAnalyzing}
              />
            </CardContent>
          </Card>

          {/* Enhanced AI Analyze Button */}
          <motion.div
            whileHover={{ scale: isButtonDisabled ? 1 : 1.02 }}
            whileTap={{ scale: isButtonDisabled ? 1 : 0.98 }}
          >
            <Button 
              onClick={(e) => {
                console.log("🔴 AI BUTTON ELEMENT CLICKED!", e);
                console.log("🔴 AI Route context: /species-id");
                console.log("🔴 Event target:", e.target);
                console.log("🔴 Current button disabled state:", isButtonDisabled);
                console.log("🔴 Selected image exists:", !!selectedImage);
                console.log("🔴 Is AI analyzing:", isAnalyzing);
                
                e.preventDefault();
                e.stopPropagation();
                
                if (isButtonDisabled) {
                  console.log("🔴 AI Button is disabled, not proceeding");
                  toast.error("Silakan pilih gambar terlebih dahulu untuk analisis AI");
                  return;
                }
                
                console.log("🔴 Calling AI analyzeImage function...");
                analyzeImage();
              }}
              disabled={isButtonDisabled}
              size="lg"
              className={`
                w-full font-semibold py-4 text-lg shadow-lg transition-all duration-300 relative z-10
                ${isButtonDisabled 
                  ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-r from-visionfish-neon-blue to-visionfish-neon-pink hover:from-visionfish-neon-blue/90 hover:to-visionfish-neon-pink/90 cursor-pointer'
                } text-white
              `}
              style={{ 
                pointerEvents: isButtonDisabled ? 'none' : 'auto',
                zIndex: 10
              }}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Sedang Menganalisis...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  {getAnalysisButtonText()}
                </>
              )}
            </Button>
          </motion.div>
        </div>

        {/* Enhanced Results Table */}
        <EnhancedResultsTable
          analysisResult={analysisResult}
          isAnalyzing={isAnalyzing}
          analysisType={analysisType}
          onDownload={downloadResult}
          onShare={shareResult}
        />
      </div>

      {/* Enhanced Species Analysis - Show only for species analysis, hide species card for freshness/both */}
      {(analysisType === 'species' || analysisType === 'both') && (
        <EnhancedSpeciesAnalysis
          analysisData={analysisResult}
          isVisible={!isAnalyzing && !!analysisResult}
          hideSpeciesCard={analysisType !== 'species'}
        />
      )}

      {/* Enhanced Freshness Analysis - Show only for freshness or both analysis */}
      {(analysisType === 'freshness' || analysisType === 'both') && (
        <EnhancedFreshnessAnalysis
          analysisData={analysisResult}
          isVisible={!isAnalyzing && !!analysisResult}
        />
      )}

      {/* Consistency Indicator - Show when there's a result */}
      {confidence && !isAnalyzing && analysisResult && (
        <ConsistencyIndicator 
          confidence={confidence}
          similarResults={imageHash ? imageCacheSystem.findSimilarResults(imageHash, analysisType) : []}
          onReanalyze={analyzeImage}
          isAnalyzing={isAnalyzing}
          analysisCount={analysisCount}
        />
      )}

      {/* Enhanced Error Handling Modal */}
      <ErrorHandlingModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorType={currentError}
        errorMessage={errorDetails}
      />

      {/* History Section */}
      <div className="flex justify-between items-center">
        <div></div>
        <Button 
          variant="ghost" 
          onClick={viewHistory} 
          className="flex items-center gap-2"
        >
          <History className="h-4 w-4" />
          Riwayat Analisis AI
          {hasPremiumAccess(isPremium) ? (
            <Crown className="h-3 w-3 text-visionfish-neon-pink" />
          ) : (
            <Crown className="h-3 w-3 text-gray-400" />
          )}
        </Button>
      </div>

      {/* History Display */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-visionfish-neon-blue/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Riwayat Analisis AI
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-visionfish-neon-pink" />
                    <Badge className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 flex items-center gap-1">
                      <Bot className="h-3 w-3" />
                      AI Powered
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {analysisHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Belum ada riwayat analisis AI</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {analysisHistory.map(analysis => (
                        <motion.div
                          key={analysis.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border rounded-lg p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {AVAILABLE_MODELS.find(m => m.id === analysis.model)?.name} - {analysis.type}
                              </Badge>
                              <Badge className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 flex items-center gap-1">
                                <Bot className="h-3 w-3" />
                                AI
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {analysis.timestamp.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <img 
                              src={analysis.image} 
                              alt="AI Analyzed fish" 
                              className="w-20 h-20 object-cover rounded-lg flex-shrink-0" 
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm prose prose-sm dark:prose-invert">
                                <ReactMarkdown>
                                  {analysis.result.substring(0, 200) + "..."}
                                </ReactMarkdown>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 pt-2 border-t">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => {
                                setSelectedImage(analysis.image);
                                setAnalysisResult(analysis.result);
                                setSelectedModel(analysis.model);
                                setAnalysisType(analysis.type);
                                setShowHistory(false);
                                toast.success("Analisis AI dimuat ulang");
                              }}
                            >
                              Muat Ulang AI
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Upgrade Prompt */}
      {!hasPremiumAccess(isPremium) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-purple-500/20 rounded-xl"
        >
          <div className="flex items-start gap-4">
            <Crown className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2 text-lg">
                Upgrade ke Premium untuk AI Unlimited
              </h4>
              <p className="text-muted-foreground mb-4">
                Dapatkan akses unlimited analisis AI, model AI premium, riwayat lengkap, dan fitur eksklusif lainnya.
              </p>
              <Button 
                onClick={() => navigate("/premium")} 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Bot className="h-4 w-4 mr-2" />
                Upgrade AI Premium
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* SNI Reference Modal */}
      <SNIReference 
        isOpen={showSNIReference} 
        onOpenChange={setShowSNIReference} 
      />

    </div>
  );

  if (isMobile) {
    return (
      <MobileSafeContainer variant="full" className="pb-24">
        <div className="px-4 py-6">
          <PageContent />
        </div>
      </MobileSafeContainer>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50/30 dark:to-blue-950/30">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <PageContent />
      </div>
    </div>
  );
};

export default SpeciesIdentificationPage;
