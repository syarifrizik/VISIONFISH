
import React from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";

const SNIStandardsInfo = React.memo(function SNIStandardsInfo() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-4 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50"
    >
      <h3 className="text-sm font-medium flex items-center mb-2">
        <Info className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
        <span className="text-purple-800 dark:text-purple-200">Standar Penilaian SNI</span>
      </h3>
      <p className="text-xs text-muted-foreground dark:text-gray-400">
        Sistem klasifikasi ganda: SNI 2729:2013 (Binary) dan Hadiwiyoto 1993 (4 kategori):
      </p>
      <div className="space-y-3 mt-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-background/50 rounded-lg border">
            <h4 className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-2">SNI 2729:2013</h4>
            <div className="space-y-1">
              <div className="text-xs p-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded">Baik (≥7)</div>
              <div className="text-xs p-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded">Kurang (&lt;7)</div>
            </div>
          </div>
          <div className="p-3 bg-background/50 rounded-lg border">
            <h4 className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-2">Hadiwiyoto (1993)</h4>
            <div className="grid grid-cols-2 gap-1">
              <div className="text-xs p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded">Prima (8-9)</div>
              <div className="text-xs p-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded">Advance (6-7.9)</div>
              <div className="text-xs p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded">Sedang (4-5.9)</div>
              <div className="text-xs p-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded">Busuk (1-3.9)</div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
        Catatan: Setiap parameter memiliki nilai valid yang berbeda sesuai standar organoletik SNI.
      </p>
    </motion.div>
  );
});

export default SNIStandardsInfo;
