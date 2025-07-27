
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

// Valid scores for each parameter according to SNI standards
const validScores: Record<string, number[]> = {
  Mata: [1, 3, 5, 6, 7, 8, 9],
  Insang: [1, 3, 6, 7, 8, 9],
  Lendir: [1, 3, 5, 6, 7, 8, 9],
  Daging: [1, 5, 6, 7, 8, 9],
  Bau: [1, 3, 5, 6, 7, 8, 9],
  Tekstur: [1, 3, 6, 7, 8, 9],
};

// Specific descriptions for each parameter score
const scoreDescriptions: Record<string, Record<number, string>> = {
  Mata: {
    9: "Bola mata cembung, pupil dan kornea jernih",
    8: "Bola mata rata, pupil dan kornea jernih",
    7: "Bola mata rata, pupil berwarna abu-abu, kornea agak keruh",
    6: "Bola mata agak cekung, pupil berwarna abu-abu, kornea agak keruh",
    5: "Bola mata agak cekung, pupil berwarna abu-abu, kornea keruh, tidak mengkilap",
    3: "Bola mata agak cekung, pupil abu-abu, kornea sangat keruh, tidak mengkilap",
    1: "Bola mata sangat cekung, pupil abu-abu, kornea sangat keruh, tidak mengkilap"
  },
  Insang: {
    9: "Warna insang merah tua, cemerlang dengan sedikit sekali lendir transparan",
    8: "Warna insang merah tua, kurang cemerlang dengan sedikit lendir transparan",
    7: "Warna insang merah muda dengan sedikit lendir agak keruh",
    6: "Warna insang merah muda dengan lendir keruh",
    3: "Warna insang abu-abu dengan lendir putih susu bergumpal",
    1: "Warna insang abu-abu dengan lendir coklat bergumpal"
  },
  Lendir: {
    9: "Lapisan lendir permukaan badan jernih, transparan, mengkilap cerah",
    8: "Lapisan lendir permukaan badan jernih, transparan, cukup cerah",
    7: "Lapisan lendir permukaan badan mulai agak keruh",
    6: "Lapisan lendir permukaan badan mulai keruh",
    5: "Lendir permukaan badan agak tebal dan mulai berubah warna",
    3: "Lendir permukaan badan tebal, sedikit menggumpal, berubah warna",
    1: "Lendir permukaan badan tebal menggumpal, berubah warna"
  },
  Daging: {
    9: "Jaringan daging sangat kuat",
    8: "Jaringan daging kuat",
    7: "Jaringan daging kurang kuat, sayatan daging kurang cemerlang",
    6: "Jaringan daging kurang kuat, sayatan daging mulai pudar",
    5: "Jaringan daging kurang kuat, sayatan daging kusam",
    1: "Jaringan daging kurang kuat, sayatan daging sangat kusam"
  },
  Bau: {
    9: "Sangat segar, bau khas ikan",
    8: "Segar",
    7: "Segar, bau khas ikan berkurang",
    6: "Netral",
    5: "Sedikit bau asam",
    3: "Bau asam kuat",
    1: "Bau busuk kuat"
  },
  Tekstur: {
    9: "Padat, kompak, sangat elastis",
    8: "Padat, kompak, elastis",
    7: "Agak lunak, agak elastis",
    6: "Agak lunak, sedikit kurang elastis",
    3: "Lunak, ditekan bekas jari akan hilang kembali lambat",
    1: "Lunak, ditekan bekas jari tidak kembali"
  }
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
  
  // Get specific description for current score
  const getScoreDesc = (param: string, score: number | null): string => {
    if (score === null) return "";
    return scoreDescriptions[param]?.[score] || "";
  };
  
  const desc = description || getScoreDesc(name, value) || "";
  
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
  
  // Get valid scores for current parameter
  const currentValidScores = validScores[name] || [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  // Find closest valid score
  const getClosestValidScore = (targetValue: number): number => {
    return currentValidScores.reduce((closest, current) => 
      Math.abs(current - targetValue) < Math.abs(closest - targetValue) ? current : closest
    );
  };
  
  // Optimized slider change handler with validation
  const handleSliderChange = useCallback((newValue: number[]) => {
    // Use requestAnimationFrame to ensure smooth UI updates
    requestAnimationFrame(() => {
      const targetValue = newValue[0];
      
      // Check if the value is valid for this parameter
      if (currentValidScores.includes(targetValue)) {
        onChange(name, newValue);
      } else {
        // Find closest valid score and use that instead
        const closestValidScore = getClosestValidScore(targetValue);
        onChange(name, [closestValidScore]);
      }
    });
  }, [name, onChange, currentValidScores]);
  
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
              value={value === null ? [currentValidScores[0]] : [value]}
              min={min}
              max={max}
              step={step}
              onValueChange={handleSliderChange}
              className="my-2"
              disabled={false}
              validValues={currentValidScores}
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
              {value !== null && !currentValidScores.includes(value) && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                  Nilai {value} tidak valid untuk parameter {name} dalam standar SNI. 
                  Nilai valid: {currentValidScores.join(', ')}.
                </p>
              )}
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-500">
                <strong>Nilai Valid:</strong> {currentValidScores.join(', ')}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});
