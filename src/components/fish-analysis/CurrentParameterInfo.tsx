
import React from "react";
import { FishParameter } from "@/utils/fish-analysis";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";

interface CurrentParameterInfoProps {
  parameterEntries: [string, number | null][];
  currentCardIndex: number;
}

const CurrentParameterInfo = React.memo<CurrentParameterInfoProps>(function CurrentParameterInfo({
  parameterEntries,
  currentCardIndex
}) {
  // Ensure safe access to parameter entries
  const safeIndex = Math.max(0, Math.min(currentCardIndex, parameterEntries.length - 1));
  const currentParam = parameterEntries[safeIndex];
  
  console.log('CurrentParameterInfo render:', {
    currentCardIndex,
    safeIndex,
    currentParam,
    parameterEntriesLength: parameterEntries.length
  });

  const parameterName = currentParam?.[0] || 'Unknown';
  const parameterValue = currentParam?.[1];
  const isComplete = parameterValue !== null && parameterValue !== 4;

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800/50 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-500 dark:text-amber-400" />
          )}
          <div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Parameter Saat Ini:</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                {parameterName}
              </span>
              {isComplete ? (
                <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700/50">
                  Nilai: {parameterValue}
                </Badge>
              ) : (
                <Badge variant="outline" className="border-amber-300 dark:border-amber-700/50 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20">
                  Belum diisi
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Progress</div>
        <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700/50">
          {safeIndex + 1} dari {parameterEntries.length}
        </Badge>
      </div>
    </div>
  );
});

export default CurrentParameterInfo;
