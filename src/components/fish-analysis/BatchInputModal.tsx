
import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FishParameter } from '@/utils/fish-analysis';
import { Settings, RotateCcw, Activity, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BatchInputModalProps {
  parameters: FishParameter;
  onApply: (parameters: FishParameter) => void;
  onAnalyze?: () => void;
  children: React.ReactNode;
}

const parameterDescriptions: Record<string, string> = {
  Mata: "Mata ikan segar memiliki kornea jernih, pupil hitam, bola mata cembung",
  Insang: "Insang ikan segar berwarna merah cerah, tanpa lendir",
  Lendir: "Lapisan lendir ikan segar transparan, jernih, dan mengkilap",
  Daging: "Daging ikan segar berwarna cemerlang, tekstur elastis, tidak mudah lepas",
  Bau: "Ikan segar memiliki bau segar, khas menurut spesies",
  Tekstur: "Tekstur daging ikan segar padat, kenyal, dan elastis",
};

const BatchInputModal = React.memo<BatchInputModalProps>(function BatchInputModal({
  parameters,
  onApply,
  onAnalyze,
  children,
}) {
  const [tempParameters, setTempParameters] = useState<FishParameter>(parameters);
  const [isOpen, setIsOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [invalidInputs, setInvalidInputs] = useState<Set<string>>(new Set());
  const [showSNIWarning, setShowSNIWarning] = useState(false);

  // Update temp parameters when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempParameters(parameters);
      setInvalidInputs(new Set());
      setShowSNIWarning(false);
    }
  }, [isOpen, parameters]);

  // Enhanced input handler with validation and 4-value prevention
  const handleInputChange = useCallback((param: keyof FishParameter, value: string) => {
    // Clear any existing invalid state for this parameter
    setInvalidInputs(prev => {
      const newSet = new Set(prev);
      newSet.delete(param);
      return newSet;
    });

    if (value === '') {
      setTempParameters(prev => ({ ...prev, [param]: null }));
      return;
    }
    
    // Block value 4 specifically with user feedback
    if (value === '4') {
      setInvalidInputs(prev => new Set([...prev, param]));
      setShowSNIWarning(true);
      toast.error(`Nilai 4 tidak diperbolehkan untuk parameter ${param} (tidak sesuai SNI)`);
      return;
    }

    // Take only the last digit entered (replace behavior)
    const lastChar = value.slice(-1);
    const numValue = parseInt(lastChar);
    
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 9 && numValue !== 4) {
      setTempParameters(prev => ({ ...prev, [param]: numValue }));
      setShowSNIWarning(false);
    } else if (numValue === 4) {
      // Additional check in case 4 gets through
      setInvalidInputs(prev => new Set([...prev, param]));
      setShowSNIWarning(true);
      toast.error(`Nilai 4 tidak diperbolehkan (tidak sesuai SNI)`);
    }
  }, []);

  // Quick fill presets for common quality levels
  const handleQuickFill = useCallback((preset: 'excellent' | 'good' | 'fair' | 'poor') => {
    let values: Record<keyof FishParameter, number>;
    
    switch (preset) {
      case 'excellent':
        values = { Mata: 9, Insang: 9, Lendir: 9, Daging: 9, Bau: 9, Tekstur: 9 };
        break;
      case 'good':
        values = { Mata: 8, Insang: 7, Lendir: 8, Daging: 8, Bau: 7, Tekstur: 8 };
        break;
      case 'fair':
        values = { Mata: 6, Insang: 6, Lendir: 6, Daging: 6, Bau: 6, Tekstur: 6 };
        break;
      case 'poor':
        values = { Mata: 2, Insang: 2, Lendir: 2, Daging: 2, Bau: 2, Tekstur: 2 };
        break;
      default:
        return;
    }
    
    setTempParameters(values);
    setInvalidInputs(new Set());
    setShowSNIWarning(false);
    toast.success(`Preset "${preset}" berhasil diterapkan!`);
  }, []);

  const handleAnalyze = useCallback(async () => {
    setIsApplying(true);
    try {
      // First apply the parameters
      onApply(tempParameters);
      
      // Then trigger analysis if callback is provided
      if (onAnalyze) {
        // Small delay to ensure parameters are applied
        setTimeout(() => {
          onAnalyze();
          toast.success("Analisis berhasil dijalankan!");
          setIsApplying(false);
          // Modal stays open - user can continue inputting values
        }, 100);
      } else {
        setIsApplying(false);
      }
    } catch (error) {
      toast.error("Gagal menjalankan analisis");
      setIsApplying(false);
    }
  }, [tempParameters, onApply, onAnalyze]);

  const handleReset = useCallback(() => {
    // Reset to default empty state (all null values)
    const resetParams: FishParameter = {
      Mata: null,
      Insang: null,
      Lendir: null,
      Daging: null,
      Bau: null,
      Tekstur: null,
    };
    setTempParameters(resetParams);
    setInvalidInputs(new Set());
    setShowSNIWarning(false);
    toast.success("Parameter berhasil direset!");
  }, []);

  // Check if parameters are complete for analysis
  const parameterEntries = Object.entries(tempParameters);
  const completedParams = parameterEntries.filter(([_, value]) => value !== null && value !== 4).length;
  const isComplete = completedParams > 0 && completedParams === parameterEntries.filter(([_, value]) => value !== 4).length;
  const hasInvalidInputs = invalidInputs.size > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-600" />
            Batch Input & Analysis - SNI Compliant
          </DialogTitle>
        </DialogHeader>
        
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* SNI Warning Alert */}
          {showSNIWarning && (
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong>Perhatian:</strong> Nilai 4 tidak diperbolehkan karena tidak sesuai dengan standar SNI 2729-2013 untuk ikan segar.
                Gunakan nilai 1-3 (Busuk), 5-6 (Sedang), 7-8 (Baik), atau 9 (Prima).
              </AlertDescription>
            </Alert>
          )}

          {/* SNI Info */}
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <strong>Standar SNI 2729-2013:</strong> Skala penilaian 1-9 (nilai 4 tidak termasuk dalam standar)
            </AlertDescription>
          </Alert>

          {/* Quick Fill Presets */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Quick Fill Presets
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickFill('excellent')}
                className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
                disabled={isApplying}
              >
                <CheckCircle className="w-4 h-4" />
                Prima (9)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickFill('good')}
                className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                disabled={isApplying}
              >
                <CheckCircle className="w-4 h-4" />
                Baik (7-8)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickFill('fair')}
                className="flex items-center gap-2 border-amber-200 text-amber-700 hover:bg-amber-50"
                disabled={isApplying}
              >
                <AlertTriangle className="w-4 h-4" />
                Sedang (6)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickFill('poor')}
                className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-50"
                disabled={isApplying}
              >
                <AlertTriangle className="w-4 h-4" />
                Busuk (2)
              </Button>
            </div>
          </div>

          {/* Parameter Input Grid */}
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(tempParameters).map(([param, value]) => {
              const isInvalid = invalidInputs.has(param);
              const paramKey = param as keyof FishParameter;
              
              return (
                <div key={param} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label 
                            htmlFor={param} 
                            className={`text-sm font-medium cursor-help ${
                              isInvalid ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {param}
                            <Info className="w-3 h-3 inline ml-1 opacity-60" />
                          </Label>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>{parameterDescriptions[paramKey]}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    {value !== null && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          value >= 7 ? 'bg-green-100 text-green-700 border-green-200' :
                          value >= 5 ? 'bg-amber-100 text-amber-700 border-amber-200' :
                          'bg-red-100 text-red-700 border-red-200'
                        }`}
                      >
                        {value >= 7 ? 'Baik' : value >= 5 ? 'Sedang' : 'Busuk'}
                      </Badge>
                    )}
                  </div>
                  
                  <Input
                    id={param}
                    type="text"
                    inputMode="numeric"
                    pattern="[1-3,5-9]"
                    maxLength={1}
                    value={value === null ? '' : value.toString()}
                    onChange={(e) => handleInputChange(paramKey, e.target.value)}
                    onKeyDown={(e) => {
                      // Prevent typing '4' directly
                      if (e.key === '4') {
                        e.preventDefault();
                        setInvalidInputs(prev => new Set([...prev, param]));
                        setShowSNIWarning(true);
                        toast.error(`Nilai 4 tidak diperbolehkan untuk ${param}`);
                      }
                    }}
                    placeholder="1-3,5-9"
                    className={`text-center h-12 text-lg font-medium transition-all duration-200 ${
                      isInvalid 
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 focus:ring-red-500' 
                        : value !== null 
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'hover:border-purple-300 focus:border-purple-500'
                    }`}
                    disabled={isApplying}
                  />
                  
                  {isInvalid && (
                    <motion.p 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-xs text-red-600 flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      Nilai 4 tidak diperbolehkan
                    </motion.p>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Progress and Actions */}
          <div className="flex flex-col gap-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Progress: {completedParams}/{parameterEntries.length} parameter
              </span>
              <div className="flex gap-2">
                {isComplete && (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Siap Analisis
                  </Badge>
                )}
                {hasInvalidInputs && (
                  <Badge className="bg-red-100 text-red-700 border-red-200">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Input Tidak Valid
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center gap-2"
                disabled={isApplying}
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
            
            {onAnalyze && (
              <Button
                onClick={handleAnalyze}
                className={`w-full flex items-center gap-2 transition-all duration-300 ${
                  !isComplete || hasInvalidInputs
                    ? 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed opacity-70' 
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
                disabled={!isComplete || hasInvalidInputs || isApplying}
              >
                <Activity className={`w-4 h-4 ${isApplying ? 'animate-spin' : ''}`} />
                {isApplying ? 'Processing...' : 'Apply & Analyze'}
              </Button>
            )}
          </div>
          
          <div className="text-xs text-center text-muted-foreground pt-2 border-t">
            {isComplete && !hasInvalidInputs
              ? "✅ Semua parameter valid dan siap untuk analisis!" 
              : hasInvalidInputs
              ? "❌ Perbaiki input yang tidak valid terlebih dahulu"
              : "📝 Lengkapi parameter untuk mengaktifkan analisis"
            }
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
});

export default BatchInputModal;
