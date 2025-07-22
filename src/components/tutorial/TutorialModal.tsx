import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Play,
  Pause,
  RotateCcw,
  Lightbulb,
  Star,
  ArrowRight,
  Fish,
  Eye,
  Cloud,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface TutorialFeature {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  gradient: string;
  steps: string[];
  tips: string[];
}

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: TutorialFeature | null;
}

const TutorialModal = ({ isOpen, onClose, feature }: TutorialModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && feature && currentStep < feature.steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
        setCompletedSteps(prev => [...prev, currentStep]);
      }, 3000);
    } else if (isPlaying && currentStep >= (feature?.steps.length || 0) - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, feature]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setCompletedSteps([]);
      setIsPlaying(false);
    }
  }, [isOpen]);

  const quickTourSteps = [
    {
      title: "Selamat Datang di VisionFish!",
      description: "Platform AI terdepan untuk analisis dan identifikasi ikan",
      icon: Fish,
      color: "from-cyan-400 to-blue-500"
    },
    {
      title: "Analisis Kesegaran Ikan",
      description: "Upload foto ikan dan dapatkan analisis kesegaran real-time",
      icon: Eye,
      color: "from-green-400 to-emerald-500"
    },
    {
      title: "Prediksi Cuaca",
      description: "Akses data cuaca dan prediksi untuk aktivitas memancing optimal",
      icon: Cloud,
      color: "from-purple-400 to-pink-500"
    },
    {
      title: "Bergabung dengan Komunitas",
      description: "Terhubung dengan nelayan dan penggemar ikan di seluruh Indonesia",
      icon: Users,
      color: "from-orange-400 to-red-500"
    }
  ];

  const handleNext = () => {
    const maxSteps = feature ? feature.steps.length : quickTourSteps.length;
    if (currentStep < maxSteps - 1) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setCompletedSteps(prev => prev.filter(step => step !== currentStep - 1));
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setCompletedSteps(prev => {
      const newCompleted = [];
      for (let i = 0; i < stepIndex; i++) {
        newCompleted.push(i);
      }
      return newCompleted;
    });
  };

  const resetTutorial = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setIsPlaying(false);
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  const renderQuickTour = () => {
    const currentTourStep = quickTourSteps[currentStep];
    const progress = ((currentStep + 1) / quickTourSteps.length) * 100;

    return (
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Progres</span>
            <span className="text-visionfish-neon-blue">{currentStep + 1} dari {quickTourSteps.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Step Content */}
        <Card className="p-8 bg-gradient-to-br from-white/5 to-white/10 border border-white/20 backdrop-blur-xl">
          <div className="text-center">
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${currentTourStep.color} flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
              <currentTourStep.icon className="w-10 h-10 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">
              {currentTourStep.title}
            </h3>
            
            <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto">
              {currentTourStep.description}
            </p>

            {/* Step Indicators */}
            <div className="flex justify-center gap-2 mb-8">
              {quickTourSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleStepClick(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-visionfish-neon-blue scale-125'
                      : index < currentStep
                      ? 'bg-green-400'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderFeatureTutorial = () => {
    if (!feature) return null;

    const progress = ((currentStep + 1) / feature.steps.length) * 100;
    const isLastStep = currentStep === feature.steps.length - 1;

    return (
      <div className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Progres {feature.title}</span>
            <span className="text-visionfish-neon-blue">{currentStep + 1} dari {feature.steps.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Feature Header */}
        <Card className="p-6 bg-gradient-to-r from-white/5 to-white/10 border border-white/20 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-xl`}>
              <feature.icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          </div>
        </Card>

        {/* Current Step */}
        <Card className="p-8 bg-gradient-to-br from-white/5 to-white/10 border border-white/20 backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              completedSteps.includes(currentStep) 
                ? 'bg-green-400 text-white' 
                : 'bg-gradient-to-r from-visionfish-neon-blue to-visionfish-neon-purple text-white'
            }`}>
              {completedSteps.includes(currentStep) ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span className="font-bold text-sm">{currentStep + 1}</span>
              )}
            </div>
            
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-white mb-3">
                Langkah {currentStep + 1}
              </h4>
              <p className="text-lg text-gray-300 leading-relaxed">
                {feature.steps[currentStep]}
              </p>
            </div>
          </div>
        </Card>

        {/* Tips for current step */}
        {feature.tips[currentStep] && (
          <Card className="p-6 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border border-yellow-400/20 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-yellow-400 mb-1">Tips:</h5>
                <p className="text-sm text-gray-300">{feature.tips[currentStep]}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Steps Overview */}
        <Card className="p-6 bg-white/5 border border-white/10 backdrop-blur-xl">
          <h5 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-visionfish-neon-blue" />
            Semua Langkah
          </h5>
          <div className="space-y-2">
            {feature.steps.map((step, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  index === currentStep
                    ? 'bg-visionfish-neon-blue/20 border border-visionfish-neon-blue/30'
                    : completedSteps.includes(index)
                    ? 'bg-green-400/10 border border-green-400/20 hover:bg-green-400/15'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  completedSteps.includes(index)
                    ? 'bg-green-400 text-white'
                    : index === currentStep
                    ? 'bg-visionfish-neon-blue text-white'
                    : 'bg-white/20 text-gray-400'
                }`}>
                  {completedSteps.includes(index) ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`text-sm ${
                  index === currentStep ? 'text-white font-medium' : 'text-gray-300'
                }`}>
                  {step}
                </span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const maxSteps = feature ? feature.steps.length : quickTourSteps.length;
  const isLastStep = currentStep === maxSteps - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-20 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-4xl max-h-[calc(100vh-6rem)] overflow-y-auto bg-gray-900/95 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 p-6 bg-gray-900/95 backdrop-blur-xl border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {feature ? `Tutorial ${feature.title}` : 'Tur Cepat VisionFish'}
                  </h2>
                  <p className="text-gray-400 mt-1">
                    {feature ? 'Pelajari fitur ini step by step' : 'Kenali VisionFish dalam 3 menit'}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Auto-play controls */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleAutoPlay}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetTutorial}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {feature ? renderFeatureTutorial() : renderQuickTour()}
            </div>

            {/* Footer Navigation */}
            <div className="sticky bottom-0 p-6 bg-gray-900/95 backdrop-blur-xl border-t border-white/10">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Sebelumnya
                </Button>

                {isLastStep ? (
                  <Button
                    onClick={onClose}
                    className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-semibold px-8"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Selesai
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-visionfish-neon-blue to-visionfish-neon-purple hover:from-visionfish-neon-purple hover:to-visionfish-neon-pink text-white font-semibold px-8"
                  >
                    Selanjutnya
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TutorialModal;