import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Camera, Share, ChevronDown, ChevronUp, Info } from "lucide-react";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { 
  FishSample, 
  getFreshnessStatus, 
  getRecommendation,
  getDetailedExplanation
} from '@/utils/fish-analysis';
import { downloadScreenshot, captureScreenshot, shareToWhatsApp, formatDateForFilename } from "@/utils/screenshot-utils";
import { toast } from "sonner";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

interface AnalysisCardProps {
  dominantCategory: string;
  avgScore: number;
  bestParameter: { parameter: string; score: number };
  resultsCount: number;
  fishName: string;
  analysisResult?: string | null; // Tambahkan prop untuk menerima hasil analisis langsung dari AI
}

const AnalysisCard = ({ 
  dominantCategory, 
  avgScore, 
  bestParameter, 
  resultsCount, 
  fishName, 
  analysisResult 
}: AnalysisCardProps) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [showExplanation, setShowExplanation] = React.useState(false);
  const [showAiConclusion, setShowAiConclusion] = React.useState(false);

  // Function to extract conclusion from AI analysis result
  const getAiConclusion = () => {
    if (!analysisResult) return null;
    
    // Mencari bagian kesimpulan dari hasil analisis AI
    const conclusionMatch = analysisResult.match(/Kesimpulan:([\s\S]*?)(?=\n\n|$)/i);
    if (conclusionMatch && conclusionMatch[1]) {
      return conclusionMatch[1].trim();
    }
    
    // Jika tidak ditemukan format "Kesimpulan:", coba cari paragraf terakhir
    const paragraphs = analysisResult.split('\n\n');
    const lastParagraph = paragraphs[paragraphs.length - 1];
    if (lastParagraph && !lastParagraph.includes('|')) {
      return lastParagraph.trim();
    }
    
    return null;
  };

  // Helper function to get the correct status type
  const getFreshnessStatusType = (category: string): "error" | "success" | "warning" | "neutral" => {
    switch (category) {
      case 'Prima':
        return 'success';
      case 'Advance':
        return 'success';
      case 'Sedang':
        return 'warning';
      case 'Busuk':
        return 'error';
      default:
        return 'neutral';
    }
  };

  const handleShareScreenshot = async () => {
    if (!cardRef.current) return;

    const screenshotData = await captureScreenshot('analysis-conclusion', 'visionfish-analysis.png');
    if (screenshotData) {
      const shareText = `Hasil analisis kualitas ikan ${fishName || 'Nila'}: ${dominantCategory} dengan skor ${avgScore}/9. \n\nParameter terbaik: ${bestParameter.parameter} (${bestParameter.score}/9).\n\nAnalisis oleh VisionFish.io`;
      shareToWhatsApp(shareText);
      toast.success("Siap untuk dibagikan ke WhatsApp");
    }
  };

  const handleDownloadScreenshot = async () => {
    if (!cardRef.current) return;
    
    const filename = `VisionFish-Analisis-${fishName ? fishName + '-' : ''}${dominantCategory}-${formatDateForFilename()}.png`;
    const screenshotData = await captureScreenshot('analysis-conclusion', filename);
    
    if (screenshotData) {
      downloadScreenshot(screenshotData, filename);
    }
  };

  const getCategoryColor = () => {
    switch (dominantCategory) {
      case "Prima": return "from-blue-500 to-cyan-400";
      case "Advance": return "from-green-500 to-emerald-400";
      case "Sedang": return "from-amber-500 to-yellow-400";
      case "Busuk": return "from-red-500 to-rose-400";
      default: return "from-visionfish-neon-blue to-visionfish-neon-pink";
    }
  };

  return (
    <Card className="fish-analysis-card relative overflow-hidden" id="analysis-conclusion" ref={cardRef}>
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-visionfish-neon-blue/10 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-visionfish-neon-pink/10 to-transparent rounded-full blur-3xl -z-10"></div>
      
      <CardHeader className="relative bg-gradient-to-r from-visionfish-neon-blue/10 to-transparent">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-visionfish-neon-blue to-visionfish-neon-pink bg-clip-text text-transparent">
            Kesimpulan Analisis {fishName && <span className="font-bold">Ikan {fishName}</span>}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-9 w-9 border-visionfish-neon-blue/30 hover:border-visionfish-neon-blue hover:bg-visionfish-neon-blue/10"
              onClick={handleDownloadScreenshot}
            >
              <Camera className="h-4 w-4 text-visionfish-neon-blue" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 border-visionfish-neon-blue/30 hover:border-visionfish-neon-blue hover:bg-visionfish-neon-blue/10">
                  <span className="sr-only">Open menu</span>
                  <Share className="h-4 w-4 text-visionfish-neon-blue" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleShareScreenshot}>
                  <Share className="mr-2 h-4 w-4" /> Bagikan ke WhatsApp
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDownloadScreenshot}>
                  <Camera className="mr-2 h-4 w-4" /> Simpan sebagai Gambar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadScreenshot}>
                  <Download className="mr-2 h-4 w-4" /> Download Screenshot
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardDescription>
          Berdasarkan analisis {resultsCount} sampel
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 relative">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex items-center space-x-2 mb-1">
            <p className="text-xl font-semibold">Tingkat Mutu Ikan:</p>
            <Badge variant="outline" className="text-base px-3 py-1 bg-background border-visionfish-neon-blue/30">
              {fishName}
            </Badge>
          </div>
          <div className="relative">
            <motion.p
              className={`text-4xl font-bold my-2 text-transparent bg-gradient-to-r ${getCategoryColor()} bg-clip-text relative inline-block after:content-[''] after:absolute after:w-full after:h-1 after:bg-gradient-to-r after:${getCategoryColor()} after:bottom-0 after:left-0 after:rounded-full`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {dominantCategory}
            </motion.p>
            <motion.div 
              className="absolute -right-8 -top-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {dominantCategory === "Prima" && (
                <span className="text-blue-500 text-xl">★★★★</span>
              )}
              {dominantCategory === "Advance" && (
                <span className="text-green-500 text-xl">★★★</span>
              )}
              {dominantCategory === "Sedang" && (
                <span className="text-amber-500 text-xl">★★</span>
              )}
              {dominantCategory === "Busuk" && (
                <span className="text-red-500 text-xl">★</span>
              )}
            </motion.div>
          </div>
          <div className="text-6xl my-4 relative">
            {dominantCategory && (
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-visionfish-neon-blue/20 to-visionfish-neon-pink/20 rounded-full blur-xl"></div>
                <StatusIndicator 
                  status={getFreshnessStatusType(dominantCategory)} 
                  size="lg" 
                  pulse={true} 
                />
              </motion.div>
            )}
          </div>
          <motion.div 
            className="bg-visionfish-neon-blue/10 backdrop-blur-sm rounded-full px-4 py-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-lg">
              Skor rata-rata: <span className="font-bold text-visionfish-neon-blue">{avgScore}</span> dari 9
            </p>
          </motion.div>
          <div className="mt-4">
            <Badge 
              variant="outline" 
              className="px-3 py-1 text-base font-medium border-2 border-visionfish-neon-blue/30"
            >
              {resultsCount} sampel dianalisis
            </Badge>
          </div>
        </div>
        
        <motion.div 
          className="bg-background/30 backdrop-blur-sm rounded-lg p-6 border border-visionfish-neon-blue/30 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {/* Decorative corner accent */}
          <div className="absolute -top-1 -right-1 w-16 h-16">
            <div className="absolute transform rotate-45 bg-gradient-to-r from-visionfish-neon-blue to-visionfish-neon-pink w-16 h-3 top-2 -right-4"></div>
          </div>
          
          <p className="text-foreground/80 leading-relaxed">
            Berdasarkan analisis terhadap <span className="font-semibold text-visionfish-neon-blue">{resultsCount} sampel</span> penilaian 
            (mengabaikan nilai 4 sesuai standar SNI), 
            {fishName && <> ikan <span className="font-semibold text-visionfish-neon-blue">{fishName}</span></>} memiliki kualitas <span className="font-semibold text-visionfish-neon-blue">{dominantCategory?.toLowerCase()}</span> dengan 
            skor rata-rata <span className="font-semibold text-visionfish-neon-blue">{avgScore}</span>.
          </p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div 
              className="bg-visionfish-neon-blue/5 rounded-lg p-4 border border-visionfish-neon-blue/20 transition-all duration-300 hover:border-visionfish-neon-blue/40 hover:shadow-md"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-medium text-visionfish-neon-blue">Parameter Terkuat:</p>
              <p className="font-bold text-lg mt-1">
                {bestParameter.parameter} - {bestParameter.score}/9
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-visionfish-neon-blue/5 rounded-lg p-4 border border-visionfish-neon-blue/20 transition-all duration-300 hover:border-visionfish-neon-blue/40 hover:shadow-md"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-medium text-visionfish-neon-blue">Rekomendasi:</p>
              <p className="font-bold mt-1">
                {getRecommendation(dominantCategory)}
              </p>
            </motion.div>
          </div>
          
          {/* AI Conclusion Section */}
          {analysisResult && (
            <div className="mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowAiConclusion(!showAiConclusion)}
                className="w-full border-visionfish-neon-blue/30 text-visionfish-neon-blue hover:bg-visionfish-neon-blue/10 hover:text-visionfish-neon-blue transition-all group"
              >
                <Info className="mr-2 h-4 w-4 transition-all" />
                <span className="font-medium">Kesimpulan untuk ikan ini</span>
                {showAiConclusion ? 
                  <ChevronUp className="ml-auto h-4 w-4 transition-transform" /> : 
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform" />
                }
              </Button>
              
              <AnimatePresence>
                {showAiConclusion && getAiConclusion() && (
                  <motion.div 
                    className="mt-3 p-4 rounded-lg bg-visionfish-neon-blue/5 border border-visionfish-neon-blue/20"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="text-lg font-semibold text-visionfish-neon-blue mb-2">Hasil Analisis AI:</h4>
                    <div className="space-y-3">
                      <p className="text-foreground/80">
                        {getAiConclusion()}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          {/* AI Explanation Section - Original Feature */}
          <div className="mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowExplanation(!showExplanation)}
              className="w-full border-visionfish-neon-blue/30 text-visionfish-neon-blue hover:bg-visionfish-neon-blue/10 hover:text-visionfish-neon-blue transition-all group"
            >
              <Info className="mr-2 h-4 w-4 transition-all" />
              <span className="font-medium">Alasan Penilaian AI</span>
              {showExplanation ? 
                <ChevronUp className="ml-auto h-4 w-4 transition-transform" /> : 
                <ChevronDown className="ml-auto h-4 w-4 transition-transform" />
              }
            </Button>
            
            <AnimatePresence>
              {showExplanation && (
                <motion.div 
                  className="mt-3 p-4 rounded-lg bg-visionfish-neon-blue/5 border border-visionfish-neon-blue/20"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-lg font-semibold text-visionfish-neon-blue mb-2">Mengapa penilaian ini diberikan?</h4>
                  <div className="space-y-3">
                    <p className="text-foreground/80">
                      {getDetailedExplanation(dominantCategory)}
                    </p>
                    
                    <div className="pl-4 border-l-2 border-visionfish-neon-blue/30 italic text-sm text-foreground/70">
                      <p>Penilaian ini dibuat berdasarkan analisis visual AI terhadap parameter kualitas ikan sesuai standar SNI 2729-2013 untuk ikan segar:</p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Kenampakan: {avgScore >= 7 ? "Cemerlang" : avgScore >= 5 ? "Sedikit kusam" : "Kusam"}</li>
                        <li>Mata: {avgScore >= 7 ? "Cerah dan menonjol" : avgScore >= 5 ? "Sedikit cekung" : "Sangat cekung"}</li>
                        <li>Insang: {avgScore >= 7 ? "Merah cerah" : avgScore >= 5 ? "Merah kecoklatan" : "Coklat pucat"}</li>
                        <li>Tekstur: {avgScore >= 7 ? "Elastis dan padat" : avgScore >= 5 ? "Kurang elastis" : "Lunak"}</li>
                        <li>Aroma: {avgScore >= 7 ? "Segar" : avgScore >= 5 ? "Netral" : "Tidak segar"}</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="mt-4 text-center">
            <a 
              href="https://www.scribd.com/document/348256275/20016-SNI-2729-2013-Ikan-Segar-pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-visionfish-neon-blue hover:underline hover:text-visionfish-neon-pink transition-colors"
            >
              Baca selengkapnya tentang standar SNI 2729-2013 Ikan Segar
            </a>
          </div>
        </motion.div>
        
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button 
              className="bg-visionfish-neon-blue hover:bg-visionfish-neon-blue/90 transition-all duration-300"
              onClick={handleDownloadScreenshot}
            >
              <Camera className="mr-2 h-4 w-4" /> Simpan Hasil Analisis
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button 
              className="bg-[#25D366] hover:bg-[#1ea952] text-white transition-all duration-300"
              onClick={handleShareScreenshot}
            >
              <Share className="mr-2 h-4 w-4" /> Bagikan ke WhatsApp
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisCard;
