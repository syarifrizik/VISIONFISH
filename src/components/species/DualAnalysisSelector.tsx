
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Fish, Gauge, Zap, Lightbulb, Camera, Sun, Focus, Target, AlertTriangle } from 'lucide-react';

export type AnalysisType = 'species' | 'freshness' | 'both';

interface DualAnalysisSelectorProps {
  selectedType: AnalysisType;
  onChange: (type: AnalysisType) => void;
  disabled?: boolean;
}

const DualAnalysisSelector = ({ selectedType, onChange, disabled = false }: DualAnalysisSelectorProps) => {
  const analysisOptions = [
    {
      id: 'species' as const,
      title: 'Identifikasi Spesies',
      description: 'Analisis jenis dan karakteristik ikan',
      icon: Fish,
      gradient: 'from-blue-500 to-cyan-400',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/30 to-cyan-950/30'
    },
    {
      id: 'freshness' as const,
      title: 'Analisis Kesegaran',
      description: 'Evaluasi tingkat kesegaran dan kualitas',
      icon: Gauge,
      gradient: 'from-green-500 to-emerald-400',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-950/30 to-emerald-950/30'
    },
    {
      id: 'both' as const,
      title: 'Analisis Lengkap',
      description: 'Identifikasi spesies + analisis kesegaran',
      icon: Zap,
      gradient: 'from-purple-500 to-pink-400',
      bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-950/30 to-pink-950/30',
      popular: true
    }
  ];

  const getContextualTips = (type: AnalysisType) => {
    const baseTips = [
      {
        icon: <Camera className="h-4 w-4" />,
        title: "Kualitas Foto",
        description: "Gunakan resolusi tinggi (minimal 1080p) untuk detail yang jelas",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      },
      {
        icon: <Sun className="h-4 w-4" />,
        title: "Pencahayaan",
        description: "Pastikan pencahayaan alami atau lampu putih yang cukup terang",
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      }
    ];

    switch (type) {
      case 'species':
        return [
          ...baseTips,
          {
            icon: <Focus className="h-4 w-4" />,
            title: "Tampilan Morfologi",
            description: "Foto seluruh ikan dari samping, pastikan sirip, bentuk tubuh, dan pola terlihat",
            color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
          },
          {
            icon: <Target className="h-4 w-4" />,
            title: "Fokus Identifikasi",
            description: "Ciri khas spesies seperti warna, bentuk kepala, dan karakteristik unik",
            color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
          }
        ];
      case 'freshness':
        return [
          ...baseTips,
          {
            icon: <Focus className="h-4 w-4" />,
            title: "Parameter SNI",
            description: "Fokus pada mata (kejernihan), insang (warna), dan kulit (kilap) untuk analisis SNI",
            color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
          },
          {
            icon: <AlertTriangle className="h-4 w-4" />,
            title: "Keterbatasan Visual",
            description: "Parameter bau dan tekstur daging akan diestimasi dari indikator visual",
            color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
          }
        ];
      case 'both':
        return [
          ...baseTips,
          {
            icon: <Focus className="h-4 w-4" />,
            title: "Analisis Komprehensif",
            description: "Satu foto optimal untuk identifikasi spesies dan evaluasi kesegaran SNI",
            color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
          },
          {
            icon: <Target className="h-4 w-4" />,
            title: "Posisi Ideal",
            description: "Samping dengan pencahayaan baik, mata dan insang terlihat jelas untuk SNI",
            color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
          }
        ];
      default:
        return baseTips;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Pilih Jenis Analisis</h3>
        <p className="text-muted-foreground text-sm">
          Tentukan jenis analisis yang ingin Anda lakukan pada gambar ikan
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {analysisOptions.map((option, index) => {
          const Icon = option.icon;
          const isSelected = selectedType === option.id;
          
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: disabled ? 1 : 1.02 }}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
            >
              <Card 
                className={`
                  relative overflow-hidden cursor-pointer transition-all duration-300 border-2
                  ${isSelected 
                    ? `border-transparent bg-gradient-to-br ${option.bgGradient} shadow-xl ring-2 ring-blue-500/20` 
                    : 'border-border hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onClick={() => !disabled && onChange(option.id)}
              >
                {/* Background Effect */}
                {isSelected && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.bgGradient} opacity-50`} />
                )}
                
                {/* Popular Badge */}
                {option.popular && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30">
                      Terpopuler
                    </Badge>
                  </div>
                )}
                
                <CardContent className="relative p-4 sm:p-6 text-center space-y-3 sm:space-y-4">
                  {/* Icon */}
                  <div className={`
                    mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center
                    ${isSelected 
                      ? `bg-gradient-to-r ${option.gradient} shadow-lg` 
                      : 'bg-muted'
                    }
                  `}>
                    <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${isSelected ? 'text-white' : 'text-muted-foreground'}`} />
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-1 sm:space-y-2">
                    <h4 className={`font-semibold text-base sm:text-lg ${isSelected ? 'text-foreground' : 'text-foreground'}`}>
                      {option.title}
                    </h4>
                    <p className={`text-xs sm:text-sm ${isSelected ? 'text-foreground/80' : 'text-muted-foreground'}`}>
                      {option.description}
                    </p>
                  </div>
                  
                  {/* Selection Indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute bottom-3 right-3"
                    >
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r ${option.gradient} flex items-center justify-center`}>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Dynamic Tips Section */}
      <AnimatePresence mode="wait">
        {selectedType && (
          <motion.div
            key={selectedType}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-visionfish-neon-blue/30 bg-gradient-to-br from-blue-50/50 to-cyan-50/30 dark:from-blue-950/30 dark:to-cyan-950/20">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-visionfish-neon-blue" />
                  <h4 className="font-semibold text-base sm:text-lg bg-gradient-to-r from-visionfish-neon-blue to-visionfish-neon-pink bg-clip-text text-transparent">
                    Tips untuk {analysisOptions.find(opt => opt.id === selectedType)?.title}
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {getContextualTips(selectedType).map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-white/20"
                    >
                      <div className={`p-2 rounded-full ${tip.color} flex-shrink-0`}>
                        {tip.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-sm mb-1">{tip.title}</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed">{tip.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DualAnalysisSelector;
