
import { useState, useRef } from "react";
import { motion, PanInfo, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Heart, Bookmark } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

interface IoTDevice {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  parameters: string[];
  color: string;
}

interface MobileSwipeCardsProps {
  devices: IoTDevice[];
  onLearnMore: () => void;
}

const SwipeCard = ({ 
  device, 
  index, 
  isActive, 
  onSwipeLeft, 
  onSwipeRight, 
  onLearnMore 
}: {
  device: IoTDevice;
  index: number;
  isActive: boolean;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onLearnMore: () => void;
}) => {
  const { theme } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-20, 20]);
  const opacity = useTransform(x, [-300, -100, 0, 100, 300], [0, 1, 1, 1, 0]);

  const handlePan = (event: any, info: PanInfo) => {
    x.set(info.offset.x);
  };

  const handlePanEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      // Swiped right - like/bookmark
      onSwipeRight();
      if (navigator.vibrate) {
        navigator.vibrate([50, 50, 50]);
      }
    } else if (info.offset.x < -threshold) {
      // Swiped left - dismiss
      onSwipeLeft();
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
    } else {
      // Snap back
      x.set(0);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{
        x,
        rotate,
        opacity,
        zIndex: isActive ? 10 : index,
      }}
      drag={isActive ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onPan={handlePan}
      onPanEnd={handlePanEnd}
      initial={{ scale: 0.9, y: index * 10 }}
      animate={{ 
        scale: isActive ? 1 : 0.95 - index * 0.05,
        y: isActive ? 0 : index * 10,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={cn(
        "h-full border-0 shadow-2xl overflow-hidden",
        "bg-gradient-to-br backdrop-blur-sm",
        theme === "light" 
          ? "from-white/95 to-gray-50/95 shadow-blue-500/10" 
          : "from-slate-900/95 to-slate-800/95 shadow-cyan-500/20",
        "border border-white/10"
      )}>
        {/* Swipe indicators */}
        <motion.div
          className="absolute top-4 left-4 bg-red-500/20 text-red-600 px-3 py-1 rounded-full text-sm font-semibold"
          style={{ opacity: useTransform(x, [-150, -50], [1, 0]) }}
        >
          Skip
        </motion.div>
        
        <motion.div
          className="absolute top-4 right-4 bg-green-500/20 text-green-600 px-3 py-1 rounded-full text-sm font-semibold"
          style={{ opacity: useTransform(x, [50, 150], [0, 1]) }}
        >
          Interested
        </motion.div>

        {/* Gradient accent */}
        <div className={`h-1 bg-gradient-to-r ${device.color}`} />
        
        {/* Floating sparkle */}
        <motion.div
          className="absolute top-6 right-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-4 w-4 text-cyan-400" />
        </motion.div>

        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className={cn(
                "p-3 rounded-xl transition-all duration-300",
                theme === "light" 
                  ? "bg-blue-50" 
                  : "bg-slate-800"
              )}
              whileTap={{ scale: 0.9, rotate: 10 }}
            >
              {device.icon}
            </motion.div>
            <div className="flex-1">
              <CardTitle className="text-lg">{device.title}</CardTitle>
              <Badge 
                variant="secondary" 
                className="mt-1 text-xs bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30"
              >
                Terbaru
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 flex-1 pb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {device.description}
          </p>

          <div className="space-y-3">
            <p className="text-sm font-semibold">Parameter Monitoring:</p>
            <div className="flex flex-wrap gap-2">
              {device.parameters.slice(0, 4).map((param, idx) => (
                <motion.div
                  key={param}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-background/50 backdrop-blur-sm border-muted-foreground/20 hover:border-cyan-500/50"
                  >
                    {param}
                  </Badge>
                </motion.div>
              ))}
              {device.parameters.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{device.parameters.length - 4} more
                </Badge>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={onLearnMore}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              style={{ minHeight: '44px' }}
            >
              <span>Pelajari</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 border-2"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <Heart className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 border-2"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const MobileSwipeCards: React.FC<MobileSwipeCardsProps> = ({ devices, onLearnMore }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [removedCards, setRemovedCards] = useState<string[]>([]);

  const handleSwipeLeft = () => {
    setRemovedCards(prev => [...prev, devices[currentIndex].id]);
    setCurrentIndex(prev => (prev + 1) % devices.length);
  };

  const handleSwipeRight = () => {
    // Handle like/bookmark action
    setRemovedCards(prev => [...prev, devices[currentIndex].id]);
    setCurrentIndex(prev => (prev + 1) % devices.length);
  };

  const visibleDevices = devices.filter(device => !removedCards.includes(device.id));
  const currentDevice = visibleDevices[currentIndex % visibleDevices.length];

  if (visibleDevices.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Semua kartu telah dilihat!</p>
        <Button 
          onClick={() => setRemovedCards([])}
          className="mt-4"
        >
          Reset Kartu
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold">Pilih Sistem IoT Anda</h3>
        <p className="text-sm text-muted-foreground">
          Swipe kanan untuk bookmark, kiri untuk skip
        </p>
      </div>
      
      <div className="relative h-96 mx-4">
        <AnimatePresence>
          {visibleDevices.slice(currentIndex, currentIndex + 3).map((device, index) => (
            <SwipeCard
              key={device.id}
              device={device}
              index={index}
              isActive={index === 0}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onLearnMore={onLearnMore}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center space-x-2 mt-4">
        {devices.map((_, index) => (
          <motion.div
            key={index}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === currentIndex % devices.length
                ? "bg-blue-600 w-6"
                : "bg-gray-300 dark:bg-gray-600 w-2"
            )}
            layoutId={`progress-${index}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileSwipeCards;
