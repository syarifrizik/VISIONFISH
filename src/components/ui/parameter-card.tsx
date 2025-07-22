
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface ParameterCardProps {
  name: string;
  value: number | null;
  onChange: (name: string, value: number[]) => void;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
}

const parameterDescriptions: Record<string, string> = {
  Mata: "Nilai 9: Bola mata cembung, kornea jernih, pupil hitam mengkilap. Nilai 7-8: Bola mata rata, kornea agak keruh. Nilai 5-6: Bola mata cekung, kornea keruh. Nilai 1-3: Bola mata sangat cekung, kornea sangat keruh",
  Insang: "Nilai 9: Warna merah tua/coklat cemerlang, tanpa lendir. Nilai 7-8: Warna merah muda, sedikit lendir jernih. Nilai 5-6: Warna merah muda kelabu, lendir agak keruh. Nilai 1-3: Warna coklat kelabu, lendir tebal dan keruh",
  Lendir: "Nilai 9: Lapisan tipis, transparan, jernih mengkilap. Nilai 7-8: Lapisan tipis, jernih sedikit keruh. Nilai 5-6: Lapisan agak tebal, keruh. Nilai 1-3: Lapisan tebal, keruh, lengket",
  Daging: "Nilai 9: Sayatan cemerlang, jaringan kuat, elastis. Nilai 7-8: Sayatan kurang cemerlang, jaringan kuat. Nilai 5-6: Sayatan agak suram, jaringan agak lunak. Nilai 1-3: Sayatan suram, jaringan sangat lunak",
  Bau: "Nilai 9: Segar, spesifik jenis. Nilai 7-8: Kurang segar, spesifik jenis. Nilai 5-6: Netral, tidak spesifik. Nilai 1-3: Busuk, tidak spesifik jenis",
  Tekstur: "Nilai 9: Padat, kompak, elastis. Nilai 7-8: Padat, kurang elastis. Nilai 5-6: Agak lunak, kurang elastis. Nilai 1-3: Lunak, bekas jari tertinggal",
};

const getValueDescription = (param: string, value: number | null): string => {
  // Fix: Only treat null as "Belum dinilai", not 0
  if (value === null) return "Belum dinilai";
  if (value === 9) return "Sangat Baik";
  if (value >= 7 && value <= 8) return "Baik";
  if (value >= 5 && value <= 6) return "Sedang";
  if (value >= 1 && value <= 3) return "Busuk";
  if (value === 4) return "Tidak Valid (SNI)";
  return "";
};

export const ParameterCard = React.memo(function ParameterCard({
  name,
  value,
  onChange,
  description,
  min = 1,
  max = 9,
  step = 1,
}: ParameterCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const desc = description || parameterDescriptions[name] || "";
  
  // Memoized calculations to prevent unnecessary recalculations
  const { valueDescription, styling } = useMemo(() => {
    const valueDescription = getValueDescription(name, value);
    
    // Determine color based on value
    let valueColor = "text-gray-400 dark:text-gray-500";
    let valueClass = "font-bold text-lg";
    let trackColor = "slider-warning";
    let cardBorder = "border-gray-200 dark:border-gray-700";
    
    // Fix: Only treat null as unset state, not 0
    if (value === null) {
      valueColor = "text-gray-400 dark:text-gray-500";
      valueClass += " italic";
      cardBorder = "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50";
    } else if (value === 9) {
      valueColor = "text-blue-500 dark:text-blue-400";
      trackColor = "";
      cardBorder = "border-blue-200 dark:border-blue-700/50 bg-blue-50 dark:bg-blue-900/20";
    } else if (value >= 7 && value <= 8) {
      valueColor = "text-green-500 dark:text-green-400";
      trackColor = "";
      cardBorder = "border-green-200 dark:border-green-700/50 bg-green-50 dark:bg-green-900/20";
    } else if (value >= 5 && value <= 6) {
      valueColor = "text-amber-500 dark:text-amber-400";
      trackColor = "";
      cardBorder = "border-amber-200 dark:border-amber-700/50 bg-amber-50 dark:bg-amber-900/20";
    } else if (value === 4) {
      valueColor = "text-gray-500 dark:text-gray-400";
      valueClass += " line-through";
      trackColor = "";
      cardBorder = "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/50";
    } else {
      valueColor = "text-red-500 dark:text-red-400";
      trackColor = "";
      cardBorder = "border-red-200 dark:border-red-700/50 bg-red-50 dark:bg-red-900/20";
    }
    
    return {
      valueDescription,
      styling: { valueColor, valueClass, trackColor, cardBorder }
    };
  }, [name, value]);
  
  // Optimized slider change handler with debouncing effect
  const handleSliderChange = useCallback((newValue: number[]) => {
    // Use requestAnimationFrame to ensure smooth UI updates
    requestAnimationFrame(() => {
      // Skip value 4 as it's not valid in SNI
      if (newValue[0] !== 4) {
        onChange(name, newValue);
      }
    });
  }, [name, onChange]);
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={() => setIsExpanded(!isExpanded)}
      className="cursor-pointer"
    >
      <Card className={`${styling.cardBorder} hover:border-visionfish-neon-blue/40 dark:hover:border-visionfish-neon-blue/60 hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-900/50`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <Label className="text-md font-medium text-gray-900 dark:text-gray-100">{name}</Label>
            <div className={`${styling.valueClass} ${styling.valueColor}`}>
              {/* Fix: Show "—" only for null values */}
              {value === null ? "—" : value}
              {value === 4 && (
                <Badge variant="outline" className="ml-2 text-xs px-1 py-0 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600">
                  Tidak SNI
                </Badge>
              )}
            </div>
          </div>
          
          <div className={`${styling.trackColor}`}>
            <Slider
              value={value === null ? [1] : [value]}
              min={min}
              max={max}
              step={step}
              onValueChange={handleSliderChange}
              className="my-2"
              disabled={false}
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground dark:text-gray-400 mt-1">
            <span>Busuk (1-3)</span>
            <span className={styling.valueColor}>{valueDescription}</span>
            <span>Sangat Baik (9)</span>
          </div>
          
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 text-sm text-muted-foreground dark:text-gray-400 border-t pt-2 border-visionfish-neon-blue/10 dark:border-visionfish-neon-blue/20"
            >
              {desc}
              {value === 4 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                  Nilai 4 tidak valid dalam standar SNI. Gunakan nilai 1-3 atau 5-9.
                </p>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});
