
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, PanInfo } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Cpu, Waves, Zap, Shield, TrendingUp, Wifi } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

interface MobileOptimizedHeroProps {
  onConsultClick: () => void;
  onAIChatClick: () => void;
}

const FloatingMobileIcon = ({ icon: Icon, delay = 0, className = "" }) => (
  <motion.div
    className={cn(
      "absolute p-2 rounded-xl backdrop-blur-sm border border-white/20",
      className
    )}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ 
      opacity: [0.6, 1, 0.6],
      scale: [0.8, 1.1, 0.8],
      rotate: [0, 10, -10, 0]
    }}
    transition={{
      duration: 6,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    whileTap={{ scale: 1.2, rotate: 15 }}
  >
    <Icon className="h-4 w-4 text-white" />
  </motion.div>
);

const MobileOptimizedHero: React.FC<MobileOptimizedHeroProps> = ({
  onConsultClick,
  onAIChatClick
}) => {
  const { theme } = useTheme();
  const [touchStartY, setTouchStartY] = useState(0);
  const { scrollY } = useScroll();
  
  const headerY = useTransform(scrollY, [0, 200], [0, -50]);
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  const handlePanStart = (event: any, info: PanInfo) => {
    setTouchStartY(info.point.y);
  };

  const handlePanEnd = (event: any, info: PanInfo) => {
    const deltaY = info.point.y - touchStartY;
    if (deltaY > 100 && info.velocity.y > 0) {
      // Pull down gesture detected
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  };

  return (
    <motion.div 
      className="relative overflow-hidden rounded-2xl mb-6"
      style={{ y: headerY, opacity: headerOpacity }}
      onPanStart={handlePanStart}
      onPanEnd={handlePanEnd}
    >
      {/* Mobile-optimized background */}
      <div className="absolute inset-0">
        <div className={cn(
          "absolute inset-0",
          theme === 'light' 
            ? "bg-gradient-to-br from-blue-600/95 via-cyan-500/85 to-teal-600/95" 
            : "bg-gradient-to-br from-slate-900/98 via-blue-900/95 to-teal-900/98"
        )} />
        
        {/* Mobile-specific animated gradients */}
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{
            background: [
              "radial-gradient(circle at 30% 60%, #22d3ee 0%, transparent 60%)",
              "radial-gradient(circle at 70% 40%, #06b6d4 0%, transparent 60%)",
              "radial-gradient(circle at 30% 60%, #22d3ee 0%, transparent 60%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Mobile glassmorphism */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[0.5px]" />
      </div>

      {/* Mobile floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingMobileIcon 
          icon={Cpu} 
          delay={0} 
          className="top-16 left-4 bg-blue-500/30" 
        />
        <FloatingMobileIcon 
          icon={Waves} 
          delay={1} 
          className="top-24 right-6 bg-cyan-500/30" 
        />
        <FloatingMobileIcon 
          icon={Zap} 
          delay={2} 
          className="bottom-24 left-6 bg-teal-500/30" 
        />
        <FloatingMobileIcon 
          icon={Shield} 
          delay={1.5} 
          className="bottom-16 right-4 bg-emerald-500/30" 
        />
        <FloatingMobileIcon 
          icon={TrendingUp} 
          delay={0.5} 
          className="top-32 left-1/2 transform -translate-x-1/2 bg-indigo-500/30" 
        />
      </div>

      {/* Mobile-optimized content */}
      <div className="relative z-10 px-4 py-8">
        <div className="max-w-sm mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 mb-4">
              <Cpu className="h-3 w-3 mr-2 text-cyan-300" />
              <span className="text-white/90 text-xs font-medium">
                IoT Perikanan Terdepan
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
              <span className="block">Revolusi</span>
              <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                Monitoring
              </span>
              <span className="block">Perikanan</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-white/90 mb-6 leading-relaxed"
          >
            Pantau kondisi perairan real-time dengan teknologi IoT canggih. 
            Analisis data mendalam dan AI assistant untuk hasil optimal.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col gap-3"
          >
            <Button
              onClick={onConsultClick}
              size="lg"
              className="group bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 active:scale-95 transition-all duration-200 shadow-lg w-full h-12"
              style={{ minHeight: '48px' }} // Touch target optimization
            >
              <span className="mr-2">Konsultasi Sekarang</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              onClick={onAIChatClick}
              variant="outline"
              size="lg"
              className="group border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 active:scale-95 transition-all duration-200 w-full h-12"
              style={{ minHeight: '48px' }} // Touch target optimization
            >
              <Bot className="h-4 w-4 mr-2" />
              <span>AI Assistant</span>
            </Button>
          </motion.div>

          {/* Mobile stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20"
          >
            <div className="text-center">
              <div className="text-lg font-bold text-white mb-1">24/7</div>
              <div className="text-white/70 text-xs">Monitor</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white mb-1">99.9%</div>
              <div className="text-white/70 text-xs">Akurasi</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white mb-1">Real-time</div>
              <div className="text-white/70 text-xs">Alerts</div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileOptimizedHero;
