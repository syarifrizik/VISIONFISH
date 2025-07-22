import { useState, useEffect, useCallback, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Upload, Activity, Trash2, Camera, Share } from "lucide-react";
import { toast } from "sonner";
import { 
  FishParameter, 
  FishSample, 
  calculateFreshness,
  findBestParameter,
  generateCSV,
  parseCsvFile,
  sortSamples,
  getFreshnessBadgeColor,
  getFreshnessStatus
} from '@/utils/fish-analysis';
import { motion } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { captureScreenshot, downloadScreenshot, formatDateForFilename, shareToWhatsApp } from "@/utils/screenshot-utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { useIsMobile } from "@/hooks/use-mobile";

// Import our custom components
import ResultsTable from "@/components/fish-analysis/ResultsTable";
import AnalysisCard from "@/components/fish-analysis/AnalysisCard";
import HorizontalCardScroller from "@/components/fish-analysis/HorizontalCardScroller";
import InputParametersSection from "@/components/fish-analysis/InputParametersSection";
import SummarySection from "@/components/fish-analysis/SummarySection";
import StickyActionBar from "@/components/fish-analysis/StickyActionBar";
import RoleBasedHero from "@/components/fish-analysis/RoleBasedHero";
import EnhancedSNIInfo from "@/components/fish-analysis/EnhancedSNIInfo";
import FishSpeciesInput from "@/components/fish-analysis/FishSpeciesInput";
import WorkflowSection from "@/components/fish-analysis/WorkflowSection";
import { ParameterCard } from "@/components/ui/parameter-card";

// Define type for radar chart data
interface RadarChartDataPoint {
  subject: string;
  A: number;
  fullMark: number;
}

const FishAnalysis = () => {
  console.log('FishAnalysis component mounting...');
  
  const [analysisResults, setAnalysisResults] = useState<FishSample[]>([]);
  const [parameters, setParameters] = useState<FishParameter>({
    Mata: null,
    Insang: null,
    Lendir: null,
    Daging: null,
    Bau: null,
    Tekstur: null,
  });
  const [fishName, setFishName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"manual" | "csv">("manual");
  const isMobile = useIsMobile();
  const [showStickyActions, setShowStickyActions] = useState(false);
  
  console.log('Current state:', { fishName, analysisResults: analysisResults.length, parameters });
  
  // Determine current workflow step based on state
  const currentStep = useMemo(() => {
    if (!fishName) return 1;
    if (analysisResults.length === 0) return 2;
    return 3;
  }, [fishName, analysisResults.length]);
  
  console.log('Current workflow step:', currentStep);
  
  // Show sticky action bar after scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 500 && analysisResults.length) {
        setShowStickyActions(true);
      } else {
        setShowStickyActions(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [analysisResults.length]);

  // Fixed parameter change handler to properly handle reset signals
  const handleParameterChange = useCallback((name: keyof FishParameter, value: number[]) => {
    console.log('Parameter change:', name, value);
    
    try {
      // Handle reset signal (-1 means reset to null)
      if (value[0] === -1) {
        console.log('Resetting parameter to null:', name);
        setParameters(prev => ({
          ...prev,
          [name]: null
        }));
        return;
      }
      
      // Normal parameter update
      setParameters(prev => ({
        ...prev,
        [name]: value[0]
      }));
    } catch (error) {
      console.error('Error handling parameter change:', error);
      toast.error('Terjadi kesalahan saat mengubah parameter');
    }
  }, []);

  const handleSubmitManualForm = useCallback(() => {
    console.log('Submitting manual form with:', { fishName, parameters });
    
    try {
      if (!fishName.trim()) {
        toast.error("Silahkan pilih jenis ikan terlebih dahulu");
        return;
      }

      const result = calculateFreshness(parameters);
      console.log('Analysis result:', result);
      
      // Add fish name to the result if available
      const fishSampleWithName = {
        ...result,
        fishName: fishName.trim()
      };
      
      setAnalysisResults(prev => [...prev, fishSampleWithName]);
      toast.success(`Analisis kualitas ikan ${fishName} berhasil ditambahkan!`);
    } catch (error) {
      console.error('Error submitting manual form:', error);
      toast.error('Terjadi kesalahan saat melakukan analisis');
    }
  }, [parameters, fishName]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File upload triggered');
    
    try {
      if (!fishName.trim()) {
        toast.error("Silahkan pilih jenis ikan terlebih dahulu");
        return;
      }

      const file = event.target.files?.[0];
      if (!file) return;

      console.log('File selected:', file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvContent = e.target?.result as string;
          console.log('CSV content loaded');
          
          const parsedData = parseCsvFile(csvContent);
          console.log('Parsed data:', parsedData);
          
          // Add fish name to the parsed data if available
          const dataWithFishName = parsedData.map(sample => ({
            ...sample,
            fishName: fishName.trim()
          }));
          
          // Add the new samples to existing results
          setAnalysisResults(prev => [...prev, ...dataWithFishName]);
          toast.success(`${parsedData.length} sampel ikan ${fishName} berhasil dianalisis!`);
        } catch (error) {
          console.error('CSV parsing error:', error);
          toast.error("Format CSV tidak valid. Pastikan file berisi kolom parameter yang sesuai.");
        }
      };
      reader.readAsText(file);

      // Reset the input to allow uploading the same file again
      event.target.value = '';
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Terjadi kesalahan saat mengupload file');
    }
  };

  const handleDownloadCSV = () => {
    console.log('Download CSV triggered');
    
    try {
      if (!analysisResults.length) {
        toast.error("Tidak ada data analisis untuk diunduh");
        return;
      }
      
      const csvContent = generateCSV(analysisResults);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      const fileName = fishName 
        ? `visionfish_analisis_ikan_${fishName.replace(/\s+/g, '_')}_${formatDateForFilename()}.csv`
        : `visionfish_analisis_ikan_${formatDateForFilename()}.csv`;
        
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("File CSV berhasil diunduh!");
    } catch (error) {
      console.error('Download CSV error:', error);
      toast.error('Terjadi kesalahan saat mengunduh file');
    }
  };

  const handleDownloadTemplate = () => {
    console.log('Download template triggered');
    
    try {
      const headers = "Mata,Insang,Lendir,Daging,Bau,Tekstur\n";
      const sampleRows = "8,7,8,9,8,8\n7,6,7,8,6,7\n";
      
      const blob = new Blob([headers + sampleRows], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'visionfish_template.csv');
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Template CSV berhasil diunduh!");
    } catch (error) {
      console.error('Download template error:', error);
      toast.error('Terjadi kesalahan saat mengunduh template');
    }
  };

  const handleDeleteResult = (id: string) => {
    console.log('Delete result:', id);
    setAnalysisResults(prev => prev.filter(item => item.id !== id));
    toast.success("Hasil analisis berhasil dihapus");
  };

  const handleDeleteAllResults = () => {
    console.log('Delete all results');
    setAnalysisResults([]);
    toast.success("Semua hasil analisis berhasil dihapus");
  };
  
  const handleSortResults = (field: keyof FishSample, ascending: boolean) => {
    console.log('Sort results:', field, ascending);
    const sortedResults = sortSamples(analysisResults, field, ascending);
    setAnalysisResults(sortedResults);
  };

  const handleUpdateResults = (updatedResults: FishSample[]) => {
    console.log('Update results:', updatedResults.length);
    setAnalysisResults(updatedResults);
    recalculateChartData(updatedResults);
  };

  // Handle full screenshot of the results section
  const handleDownloadFullResults = async () => {
    console.log('Download full results screenshot');
    
    try {
      if (!analysisResults.length) {
        toast.error("Tidak ada data analisis untuk diunduh");
        return;
      }
      
      const filename = fishName 
        ? `VisionFish-Analisis-${fishName.replace(/\s+/g, '-')}-${formatDateForFilename()}.png`
        : `VisionFish-Analisis-${formatDateForFilename()}.png`;
        
      const toastId = toast.loading('Menyiapkan screenshot hasil analisis...');
      
      const screenshotData = await captureScreenshot('results-section', filename);
      if (screenshotData) {
        downloadScreenshot(screenshotData, filename);
        toast.dismiss(toastId);
        toast.success("Screenshot hasil analisis berhasil diunduh");
      }
    } catch (error) {
      console.error("Screenshot error:", error);
      toast.error("Gagal mengunduh screenshot");
    }
  };
  
  // Handle share results to WhatsApp
  const handleShareResults = async () => {
    console.log('Share results to WhatsApp');
    
    try {
      if (!analysisResults.length) {
        toast.error("Tidak ada data analisis untuk dibagikan");
        return;
      }
      
      const toastId = toast.loading('Menyiapkan hasil untuk dibagikan...');
      
      // Create text summary of results
      const shareText = `Hasil analisis kualitas ikan ${fishName || 'Tidak Diketahui'}: 
${dominantCategory} dengan skor rata-rata ${avgScore}/9.
Parameter terbaik: ${bestParameter.parameter} (${bestParameter.score}/9).
${resultsCount} sampel dianalisis.

Analisis oleh VisionFish.io`;
      
      shareToWhatsApp(shareText);
      toast.dismiss(toastId);
      toast.success("Hasil analisis siap dibagikan ke WhatsApp");
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Gagal membagikan hasil analisis");
    }
  };

  // Recalculate chart data when results are updated
  const recalculateChartData = (results: FishSample[]) => {
    console.log('Recalculating chart data for', results.length, 'results');
    // Existing chart calculation logic remains the same
    // This is called when results are updated through the table
  };

  // Memoized calculations to prevent unnecessary recalculations
  const { 
    hasResults, 
    validResults, 
    avgScore, 
    categoryStats, 
    dominantCategory, 
    bestParameter, 
    resultsCount, 
    pieChartData, 
    radarDataFormatted 
  } = useMemo(() => {
    console.log('Recalculating analysis statistics...');
    
    try {
      const hasResults = analysisResults.length > 0;
      
      // Skip parameters with value 4 or null in calculations for accurate SNI standards
      const filteredResults = analysisResults.map(sample => {
        const filtered = { ...sample };
        Object.entries(filtered).forEach(([key, value]) => {
          if ((value === 4 || value === null) && key !== 'id' && key !== 'Kategori' && key !== 'Skor' && key !== 'timestamp' && key !== 'fishName') {
            // Mark parameters with value 4 or null as null for calculation purposes
            (filtered as any)[key] = null;
          }
        });
        return filtered;
      });
      
      // Calculate aggregate statistics if we have results
      const validResults = hasResults 
        ? filteredResults.filter(item => item.Kategori !== 'Invalid') 
        : [];
      
      const avgScore = validResults.length 
        ? parseFloat((validResults.reduce((sum, item) => sum + item.Skor, 0) / validResults.length).toFixed(2))
        : 0;
      
      const categoryStats = validResults.reduce((acc: Record<string, number>, item) => {
        acc[item.Kategori] = (acc[item.Kategori] || 0) + 1;
        return acc;
      }, {});
      
      const dominantCategory = validResults.length
        ? Object.entries(categoryStats).sort((a, b) => b[1] - a[1])[0]?.[0] || ""
        : '';

      const bestParameter = validResults.length
        ? findBestParameter(validResults)
        : { parameter: '', score: 0 };
          
      const resultsCount = analysisResults.length;
      
      // Chart data for pie chart - fixed to properly count category distribution
      const pieChartData = validResults.length 
        ? Object.entries(categoryStats).map(([name, value]) => ({ name, value }))
        : [];

      // Radar chart data
      const radarChartData = validResults.length
        ? [Object.keys(parameters).reduce((acc, key) => {
            const paramKey = key as keyof FishParameter;
            // Filter out any parameter with value 4 or null for accurate calculations
            const validValues = validResults
              .map(r => r[paramKey])
              .filter(v => typeof v === 'number'&& v !== 4) as number[];
              
            acc[paramKey] = validValues.length 
              ? validValues.reduce((sum, val) => sum + val, 0) / validValues.length 
              : 0;
            return acc;
          }, {} as Record<string, number>)]
        : [];

      // Fix the radar data formatting to ensure it's always a number
      const radarDataFormatted: RadarChartDataPoint[] = validResults.length
        ? Object.entries(radarChartData[0]).map(([key, value]) => ({
            subject: key,
            A: typeof value === 'number' ? value : 0, // Ensure A is always a number
            fullMark: 9
          }))
        : [];

      console.log('Statistics calculated:', {
        hasResults,
        validResults: validResults.length,
        avgScore,
        dominantCategory,
        bestParameter,
        resultsCount
      });

      return {
        hasResults,
        validResults,
        avgScore,
        categoryStats,
        dominantCategory,
        bestParameter,
        resultsCount,
        pieChartData,
        radarDataFormatted
      };
    } catch (error) {
      console.error('Error calculating statistics:', error);
      return {
        hasResults: false,
        validResults: [],
        avgScore: 0,
        categoryStats: {},
        dominantCategory: '',
        bestParameter: { parameter: '', score: 0 },
        resultsCount: 0,
        pieChartData: [],
        radarDataFormatted: []
      };
    }
  }, [analysisResults, parameters]);

  // Animation variants
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  console.log('Rendering FishAnalysis component');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl space-y-8">
      {/* Role-Based Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <RoleBasedHero />
      </motion.div>

      {/* Enhanced SNI Information */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <EnhancedSNIInfo />
      </motion.div>

      {/* Fish Species Input - Now prominent and first */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-10"
      >
        <Card className="border border-visionfish-neon-blue/30 shadow-lg bg-gradient-to-r from-background/95 to-visionfish-neon-blue/5">
          <CardContent className="p-8">
            <FishSpeciesInput
              value={fishName}
              onChange={setFishName}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Workflow Progress Section */}
      <WorkflowSection 
        currentStep={currentStep}
        fishName={fishName}
        hasResults={hasResults}
      />

      {/* Input Tabs Section - Only show when fish is selected */}
      {fishName && (
        <motion.div 
          variants={containerAnimation}
          initial="hidden"
          animate="show"
        >
          <Tabs 
            value={activeTab} 
            onValueChange={(val) => setActiveTab(val as "manual" | "csv")}
            className="w-full max-w-4xl mx-auto"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="manual" className="flex items-center gap-2 text-sm sm:text-base py-3">
                <Activity className="w-4 h-4" />
                Input Manual
              </TabsTrigger>
              <TabsTrigger value="csv" className="flex items-center gap-2 text-sm sm:text-base py-3">
                <Upload className="w-4 h-4" />
                Upload CSV
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual">
              <motion.div variants={itemAnimation}>
                <Card className="border border-visionfish-neon-blue/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-visionfish-neon-blue/10 to-transparent border-b border-visionfish-neon-blue/10 p-6 sm:p-8">
                    <CardTitle className="text-lg sm:text-xl">Input Parameter untuk Ikan {fishName}</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Masukkan nilai untuk setiap parameter kualitas ikan (skala 1-9), parameter dengan nilai 4 akan diabaikan sesuai standar SNI
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 sm:space-y-8 pt-6 sm:pt-8 p-6 sm:p-8">
                    <InputParametersSection 
                      parameters={parameters}
                      onChangeParameter={handleParameterChange}
                      onSubmit={handleSubmitManualForm}
                      fishName={fishName}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="csv">
              <motion.div variants={itemAnimation}>
                <Card className="border border-visionfish-neon-blue/20 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-visionfish-neon-blue/10 to-transparent border-b border-visionfish-neon-blue/10 p-6 sm:p-8">
                    <CardTitle className="text-lg sm:text-xl">Upload File CSV untuk Ikan {fishName}</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Upload file CSV dengan kolom: Mata, Insang, Lendir, Daging, Bau, Tekstur
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6 pt-6 sm:pt-8 p-6 sm:p-8">
                    <div className="flex items-center justify-center w-full">
                      <Label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-background border-visionfish-neon-blue hover:bg-visionfish-neon-blue/5 relative after:absolute after:inset-0 after:content-[''] after:shadow-neon-blue after:opacity-70 after:rounded-lg after:z-[-1] transition-all duration-300"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-visionfish-neon-blue" />
                          <p className="mb-2 text-sm text-foreground">
                            <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                          </p>
                          <p className="text-xs text-muted-foreground">File CSV (*.csv)</p>
                        </div>
                        <Input
                          id="dropzone-file"
                          type="file"
                          accept=".csv"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </Label>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button 
                        onClick={handleDownloadTemplate} 
                        variant="outline" 
                        className="flex items-center gap-2 border-visionfish-neon-blue/30 hover:bg-visionfish-neon-blue/10"
                      >
                        <Download className="w-4 h-4" />
                        Download Template CSV
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}

      {/* Results Section */}
      {hasResults && (
        <motion.div 
          id="results-section"
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold">Hasil Analisis</h2>
              <Badge 
                variant="outline" 
                className="bg-visionfish-neon-blue/10 text-visionfish-neon-blue border-visionfish-neon-blue/30"
              >
                {analysisResults.length} sampel
              </Badge>
              {fishName && (
                <Badge 
                  variant="outline" 
                  className="bg-visionfish-neon-pink/10 text-visionfish-neon-pink border-visionfish-neon-pink/30"
                >
                  Ikan {fishName}
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 border-visionfish-neon-blue/30 text-visionfish-neon-blue hover:bg-visionfish-neon-blue/10"
                onClick={handleShareResults}
              >
                <Share className="w-4 h-4" />
                <span className="hidden sm:inline">Bagikan</span>
              </Button>
            
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 border-visionfish-neon-blue/30 text-visionfish-neon-blue hover:bg-visionfish-neon-blue/10"
                onClick={handleDownloadFullResults}
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">Screenshot</span>
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Hapus Semua</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Semua Hasil?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini tidak dapat dibatalkan. Semua hasil analisis akan dihapus secara permanen.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAllResults}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          <motion.div variants={itemAnimation}>
            <SummarySection 
              dominantCategory={dominantCategory}
              avgScore={avgScore}
              bestParameter={bestParameter}
              resultsCount={resultsCount}
              pieChartData={pieChartData}
              radarDataFormatted={radarDataFormatted}
              fishName={fishName}
            />
          </motion.div>
          
          <motion.div variants={itemAnimation}>
            <Card className="fish-analysis-card border border-visionfish-neon-blue/20 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-visionfish-neon-blue/10 to-transparent border-b border-visionfish-neon-blue/10 p-6 sm:p-8">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Data Lengkap Penilaian</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Hasil analisis untuk setiap sampel
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <ResultsTable 
                  results={analysisResults}
                  onDelete={handleDeleteResult}
                  onSort={handleSortResults}
                  onUpdateResults={handleUpdateResults}
                />
              </CardContent>
              <CardFooter className="p-6 sm:p-8">
                <Button 
                  onClick={handleDownloadCSV}
                  className="neon-button w-full flex items-center gap-2 bg-visionfish-neon-blue hover:bg-visionfish-neon-blue/90 transition-all duration-300 h-12"
                >
                  <Download className="w-4 h-4" />
                  Download Hasil Analisis (CSV)
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          
          <motion.div variants={itemAnimation}>
            <AnalysisCard
              dominantCategory={dominantCategory}
              avgScore={avgScore}
              bestParameter={bestParameter}
              resultsCount={analysisResults.length}
              fishName={fishName}
              analysisResult={analysisResults.length > 0 ? analysisResults[analysisResults.length - 1]?.aiResponse : null}
            />
          </motion.div>
          
          {isMobile && showStickyActions && (
            <StickyActionBar
              resultsCount={resultsCount}
              onDownloadCSV={handleDownloadCSV}
              onDownloadScreenshot={handleDownloadFullResults}
              onShare={handleShareResults}
            />
          )}
        </motion.div>
      )}
    </div>
  );
};

export default FishAnalysis;
