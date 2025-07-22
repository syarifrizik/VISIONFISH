
import { Fish } from "lucide-react";
import { motion } from "framer-motion";

interface FishSelectionDisplayProps {
  fishName: string;
}

const FishSelectionDisplay = ({ fishName }: FishSelectionDisplayProps) => {
  if (!fishName) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-cyan-50/40 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-cyan-950/20 border border-emerald-200/50 dark:border-emerald-800/30 p-4 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
          <Fish className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Ikan yang dipilih:</p>
          <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">{fishName}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default FishSelectionDisplay;
