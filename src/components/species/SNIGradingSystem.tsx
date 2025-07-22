
import React from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, Award, AlertTriangle, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface SNIGradingSystemProps {
  onOpenFlipbook?: () => void;
}

const SNIGradingSystem = ({ onOpenFlipbook }: SNIGradingSystemProps) => {
  const gradingLevels = [
    {
      category: "Prima",
      score: "9",
      status: "Sangat Segar",
      description: "Kondisi optimal, mata jernih, insang merah cerah, tekstur padat",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      icon: <Award className="h-4 w-4" />,
      borderColor: "border-blue-300",
      gradient: "from-blue-400/20 to-blue-600/20"
    },
    {
      category: "Baik",
      score: "7-8",
      status: "Segar",
      description: "Kondisi baik, sedikit penurunan kualitas namun masih layak konsumsi",
      color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      icon: <CheckCircle className="h-4 w-4" />,
      borderColor: "border-green-300",
      gradient: "from-green-400/20 to-green-600/20"
    },
    {
      category: "Sedang",
      score: "5-6",
      status: "Kurang Segar",
      description: "Mulai menurun, disarankan segera diolah atau dikonsumsi",
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      icon: <AlertTriangle className="h-4 w-4" />,
      borderColor: "border-yellow-300",
      gradient: "from-yellow-400/20 to-yellow-600/20"
    },
    {
      category: "Busuk",
      score: "1-3",
      status: "Tidak Segar",
      description: "Kondisi buruk, tidak layak konsumsi, tanda pembusukan jelas",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      icon: <XCircle className="h-4 w-4" />,
      borderColor: "border-red-300",
      gradient: "from-red-400/20 to-red-600/20"
    }
  ];

  const parameters = [
    { name: "Mata", description: "Kejernihan dan bentuk mata ikan" },
    { name: "Insang", description: "Warna dan kondisi insang" },
    { name: "Lendir", description: "Kondisi lendir pada permukaan tubuh" },
    { name: "Daging", description: "Tekstur dan elastisitas daging" },
    { name: "Tekstur", description: "Kekenyalan dan kepadatan" },
    { name: "Bau", description: "Aroma karakteristik ikan segar" }
  ];

  // Embla Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      align: 'start',
      loop: true,
      dragFree: true,
      containScroll: 'trimSnaps'
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="border-2 border-visionfish-neon-pink/30 bg-gradient-to-br from-pink-50/50 to-purple-50/30 dark:from-pink-950/30 dark:to-purple-950/20">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-bold bg-gradient-to-r from-visionfish-neon-pink to-visionfish-neon-blue bg-clip-text text-transparent">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-visionfish-neon-pink" />
              Sistem Penilaian SNI 2729-2013
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenFlipbook}
              className="border-visionfish-neon-pink/30 hover:bg-visionfish-neon-pink/10"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Baca Selengkapnya</span>
              <span className="sm:hidden">Detail</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Modern Carousel for Grading Levels */}
          <div className="relative">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Level Penilaian</h3>
            </div>

            {/* Embla Carousel */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-2 sm:gap-4">
                {gradingLevels.map((level, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex-[0_0_calc(100vw-3rem)] sm:flex-[0_0_320px] p-3 sm:p-4 rounded-xl border-2 ${level.borderColor} 
                      bg-gradient-to-br ${level.gradient} backdrop-blur-sm relative overflow-hidden
                      hover:scale-105 transition-all duration-300 cursor-pointer group`}
                  >
                    {/* Glass morphism overlay */}
                    <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-sm"></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={`${level.color} border-0 font-semibold text-xs px-3 py-1 rounded-full`}>
                          {level.icon}
                          <span className="ml-2">{level.category}</span>
                        </Badge>
                        <div className="text-2xl font-bold text-muted-foreground opacity-80">
                          {level.score}
                        </div>
                      </div>
                      
                      <h4 className="font-bold text-sm mb-2 text-foreground">{level.status}</h4>
                      
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {level.description}
                      </p>

                      {/* Decorative element */}
                      <div className="absolute -bottom-2 -right-2 w-16 h-16 opacity-10 group-hover:opacity-20 transition-opacity">
                        {level.icon && React.cloneElement(level.icon as React.ReactElement, { 
                          className: "w-full h-full" 
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Carousel Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {gradingLevels.map((_, index) => (
                <div
                  key={index}
                  className="w-3 h-3 rounded-full bg-blue-500/60 dark:bg-purple-500/60 
                    hover:bg-blue-600 dark:hover:bg-purple-400 transition-colors cursor-pointer"
                />
              ))}
            </div>
          </div>

          {/* Special Note for Invalid Score */}
          <div className="bg-gray-100 dark:bg-gray-800 p-3 sm:p-4 rounded-lg border-l-4 border-gray-400">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                  Invalid (4) - Diabaikan*
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  *Nilai 4 diabaikan karena tidak sesuai dengan standar SNI yang menggunakan 
                  skala 1-3 untuk produk tidak segar dan 5-9 untuk produk segar
                </p>
              </div>
            </div>
          </div>

          {/* Parameters Reference */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Parameter Penilaian</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {parameters.map((param, index) => (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <span className="font-medium text-visionfish-neon-blue min-w-[50px] sm:min-w-[60px]">
                    {param.name}:
                  </span>
                  <span className="text-muted-foreground leading-relaxed">{param.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Parameter Note */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/20 p-3 sm:p-4 rounded-lg border border-orange-200/50">
            <h4 className="font-semibold text-sm text-orange-800 dark:text-orange-300 mb-2">
              ⚠️ Catatan Penting untuk Analisis Visual
            </h4>
            <ul className="space-y-1 text-xs text-orange-700 dark:text-orange-400 leading-relaxed">
              <li>• <strong>Parameter Visual:</strong> Mata, Insang, Lendir - dapat dinilai dari foto</li>
              <li>• <strong>Parameter Non-Visual:</strong> Bau, Tekstur, Daging - memerlukan pemeriksaan fisik</li>
              <li>• AI akan memberikan perkiraan berdasarkan indikator visual yang tersedia</li>
            </ul>
          </div>

          {/* Quick Reference */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/20 p-3 sm:p-4 rounded-lg border border-blue-200/50">
            <h4 className="font-semibold text-sm mb-2 text-blue-800 dark:text-blue-300">
              📊 Cara Membaca Hasil
            </h4>
            <ul className="space-y-1 text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
              <li>• Setiap parameter dinilai dengan skala 1-9 (kecuali 4)</li>
              <li>• Skor akhir adalah rata-rata dari semua parameter</li>
              <li>• Kategori ditentukan berdasarkan skor rata-rata</li>
              <li>• Nilai 4 otomatis diabaikan dalam perhitungan</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SNIGradingSystem;
