
import React from "react";
import { motion } from "framer-motion";
import { Camera, Download, Share, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StickyActionBarProps {
  onDownloadCSV: () => void;
  onDownloadScreenshot: () => void;
  onShare: () => void;
  onFilter?: () => void;
  resultsCount: number;
}

const StickyActionBar: React.FC<StickyActionBarProps> = ({
  onDownloadCSV,
  onDownloadScreenshot,
  onShare,
  onFilter,
  resultsCount,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-50 pb-4 px-4"
    >
      <div className="mx-auto max-w-md">
        <div className="w-full bg-background/80 backdrop-blur-md border border-visionfish-neon-blue/30 rounded-full shadow-lg p-2 flex items-center justify-between">
          <div className="px-3">
            <span className="text-sm font-medium">
              {resultsCount} sampel
            </span>
          </div>
          
          <div className="flex gap-2">
            {onFilter && (
              <Button
                onClick={onFilter}
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-visionfish-neon-blue/10"
              >
                <Filter className="h-4 w-4" />
              </Button>
            )}
            
            <Button
              onClick={onShare}
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-visionfish-neon-blue/10"
            >
              <Share className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={onDownloadScreenshot}
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full hover:bg-visionfish-neon-blue/10"
            >
              <Camera className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={onDownloadCSV}
              variant="outline"
              size="sm"
              className="rounded-full border-visionfish-neon-blue px-4 hover:bg-visionfish-neon-blue/10"
            >
              <Download className="h-4 w-4 mr-2" />
              <span className="text-xs font-medium">CSV</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StickyActionBar;
