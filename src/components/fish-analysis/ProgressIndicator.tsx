
import React from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface ProgressIndicatorProps {
  completedParams: number;
  totalParams: number;
  isComplete: boolean;
}

const ProgressIndicator = React.memo<ProgressIndicatorProps>(function ProgressIndicator({
  completedParams,
  totalParams,
  isComplete
}) {
  // Ensure we don't divide by zero and handle edge cases
  const safeCompletedParams = Math.max(0, completedParams);
  const safeTotalParams = Math.max(1, totalParams);
  const progressPercentage = Math.round((safeCompletedParams / safeTotalParams) * 100);

  console.log('ProgressIndicator:', { 
    completedParams: safeCompletedParams, 
    totalParams: safeTotalParams, 
    progressPercentage,
    isComplete 
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="mb-4"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-purple-600">Progress Penilaian</span>
        <span className="text-sm text-muted-foreground">
          {safeCompletedParams}/{safeTotalParams}
        </span>
      </div>
      <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div 
          className={`h-3 rounded-full transition-all duration-500 ${
            !isComplete 
              ? 'bg-gradient-to-r from-purple-400 to-purple-500 animate-pulse' 
              : 'bg-gradient-to-r from-purple-500 to-purple-600'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
        />
      </div>
      {!isComplete && (
        <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-purple-600 font-medium animate-pulse">
          <AlertCircle className="w-4 h-4 text-purple-600" />
          Lengkapi parameter untuk melanjutkan analisis!
        </div>
      )}
    </motion.div>
  );
});

export default ProgressIndicator;
