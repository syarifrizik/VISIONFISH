
import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ChevronUp, ChevronDown } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  snapPoints?: number[];
}

const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  snapPoints = [0.3, 0.6, 0.9]
}) => {
  const { theme } = useTheme();
  const [currentSnap, setCurrentSnap] = useState(1); // Start at middle snap point
  const [isDragging, setIsDragging] = useState(false);

  const handlePanStart = () => {
    setIsDragging(true);
    if (navigator.vibrate) {
      navigator.vibrate(20);
    }
  };

  const handlePanEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    
    // Determine new snap point based on velocity and position
    if (info.velocity.y > 500) {
      // Fast downward swipe - close or go to smaller snap
      if (currentSnap === 0) {
        onClose();
      } else {
        setCurrentSnap(Math.max(0, currentSnap - 1));
      }
    } else if (info.velocity.y < -500) {
      // Fast upward swipe - go to larger snap
      setCurrentSnap(Math.min(snapPoints.length - 1, currentSnap + 1));
    } else {
      // Slow drag - snap to nearest point based on position
      const currentHeight = window.innerHeight * snapPoints[currentSnap];
      if (info.offset.y > currentHeight * 0.2) {
        setCurrentSnap(Math.max(0, currentSnap - 1));
      } else if (info.offset.y < -currentHeight * 0.2) {
        setCurrentSnap(Math.min(snapPoints.length - 1, currentSnap + 1));
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden shadow-2xl",
              theme === "light" 
                ? "bg-white border-gray-200" 
                : "bg-gray-900 border-gray-700",
              "border-t border-l border-r"
            )}
            initial={{ y: "100%" }}
            animate={{ 
              y: `${(1 - snapPoints[currentSnap]) * 100}%`,
              scale: isDragging ? 0.98 : 1
            }}
            exit={{ y: "100%" }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              mass: 0.5 
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onPanStart={handlePanStart}
            onPanEnd={handlePanEnd}
            style={{ 
              minHeight: `${snapPoints[currentSnap] * 100}vh`,
              maxHeight: "95vh"
            }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center py-3">
              <motion.div
                className={cn(
                  "w-12 h-1.5 rounded-full transition-colors duration-200",
                  isDragging 
                    ? "bg-blue-500" 
                    : "bg-gray-300 dark:bg-gray-600"
                )}
                animate={{ 
                  width: isDragging ? 48 : 32,
                  backgroundColor: isDragging ? "#3b82f6" : undefined
                }}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">{title}</h2>
                <Badge variant="secondary" className="text-xs">
                  {currentSnap === 0 ? "Peek" : currentSnap === 1 ? "Half" : "Full"}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Snap controls */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentSnap(Math.min(snapPoints.length - 1, currentSnap + 1))}
                  disabled={currentSnap === snapPoints.length - 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentSnap(Math.max(0, currentSnap - 1))}
                  disabled={currentSnap === 0}
                  className="h-8 w-8 p-0"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-safe overflow-y-auto" style={{ maxHeight: "calc(95vh - 100px)" }}>
              {children}
            </div>

            {/* Snap indicators */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
              {snapPoints.map((_, index) => (
                <motion.button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full border transition-all duration-200",
                    currentSnap === index
                      ? "bg-blue-500 border-blue-600 scale-125"
                      : "bg-gray-300 dark:bg-gray-600 border-gray-400 dark:border-gray-500"
                  )}
                  onClick={() => setCurrentSnap(index)}
                  whileTap={{ scale: 1.5 }}
                />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileBottomSheet;
