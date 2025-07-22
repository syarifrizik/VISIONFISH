
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FishParameter } from '@/utils/fish-analysis';
import { Zap, RotateCcw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuickFillPresetsProps {
  onPresetApply: (preset: Partial<FishParameter>) => void;
  className?: string;
}

const QuickFillPresets: React.FC<QuickFillPresetsProps> = ({
  onPresetApply,
  className = "",
}) => {
  const presets = [
    {
      name: "Prima",
      description: "Semua parameter = 9",
      icon: <TrendingUp className="w-4 h-4" />,
      values: { Mata: 9, Insang: 9, Lendir: 9, Daging: 9, Bau: 9, Tekstur: 9 },
      color: "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white",
    },
    {
      name: "Baik",
      description: "Semua parameter = 7-8",
      icon: <TrendingUp className="w-4 h-4" />,
      values: { Mata: 8, Insang: 7, Lendir: 8, Daging: 8, Bau: 7, Tekstur: 8 },
      color: "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white",
    },
    {
      name: "Sedang",
      description: "Semua parameter = 5-6",
      icon: <Minus className="w-4 h-4" />,
      values: { Mata: 6, Insang: 5, Lendir: 6, Daging: 5, Bau: 6, Tekstur: 5 },
      color: "bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white",
    },
    {
      name: "Busuk",
      description: "Semua parameter = 1-3",
      icon: <TrendingDown className="w-4 h-4" />,
      values: { Mata: 2, Insang: 1, Lendir: 2, Daging: 3, Bau: 1, Tekstur: 2 },
      color: "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white",
    },
    {
      name: "Reset",
      description: "Reset ke default",
      icon: <RotateCcw className="w-4 h-4" />,
      values: { Mata: null, Insang: null, Lendir: null, Daging: null, Bau: null, Tekstur: null },
      color: "bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white",
    },
  ];

  return (
    <motion.div 
      className={`space-y-4 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border border-purple-200 dark:border-purple-800/50 bg-white dark:bg-gray-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-purple-800 dark:text-purple-200">Quick Fill Presets</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {presets.map((preset, index) => (
              <motion.div
                key={preset.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-full h-auto p-2 flex flex-col items-center gap-1 transition-all duration-200 hover:scale-105 ${preset.color} border-0`}
                  onClick={() => onPresetApply(preset.values)}
                >
                  {preset.icon}
                  <span className="text-xs font-medium">{preset.name}</span>
                  <span className="text-xs opacity-80 hidden sm:block">{preset.description}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuickFillPresets;
