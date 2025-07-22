
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Cpu, Waves, Zap, Shield, TrendingUp } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

interface ModernHeroSectionProps {
  onConsultClick: () => void;
  onAIChatClick: () => void;
}

const FloatingIcon = ({ icon: Icon, delay = 0, className = "" }) => (
  <motion.div
    className={cn("absolute p-3 rounded-xl backdrop-blur-sm border border-white/20", className)}
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: [0.7, 1, 0.7],
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0]
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <Icon className="h-6 w-6 text-white" />
  </motion.div>
);

const ModernHeroSection: React.FC<ModernHeroSectionProps> = ({
  onConsultClick,
  onAIChatClick
}) => {
  const { theme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl mb-8">
      {/* Background Layers */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className={cn(
          "absolute inset-0",
          theme === 'light' 
            ? "bg-gradient-to-br from-blue-600/90 via-cyan-500/80 to-teal-600/90" 
            : "bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-teal-900/95"
        )} />
        
        {/* Dynamic gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 40%)`
          }}
        />
        
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />
        
        {/* Animated mesh gradient */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, #22d3ee 0%, transparent 50%), radial-gradient(circle at 80% 20%, #06b6d4 0%, transparent 50%)",
              "radial-gradient(circle at 60% 30%, #0891b2 0%, transparent 50%), radial-gradient(circle at 40% 70%, #0e7490 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, #22d3ee 0%, transparent 50%), radial-gradient(circle at 80% 20%, #06b6d4 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating IoT Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingIcon 
          icon={Cpu} 
          delay={0} 
          className="top-20 left-16 bg-blue-500/20" 
        />
        <FloatingIcon 
          icon={Waves} 
          delay={1} 
          className="top-32 right-20 bg-cyan-500/20" 
        />
        <FloatingIcon 
          icon={Zap} 
          delay={2} 
          className="bottom-32 left-24 bg-teal-500/20" 
        />
        <FloatingIcon 
          icon={Shield} 
          delay={1.5} 
          className="bottom-20 right-16 bg-emerald-500/20" 
        />
        <FloatingIcon 
          icon={TrendingUp} 
          delay={0.5} 
          className="top-40 left-1/2 bg-indigo-500/20" 
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 sm:px-8 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Cpu className="h-4 w-4 mr-2 text-cyan-300" />
              <span className="text-white/90 text-sm font-medium">
                Teknologi IoT Terdepan untuk Perikanan
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="block">Revolusi</span>
              <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                Monitoring Perikanan
              </span>
              <span className="block">Real-time</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Pantau kondisi perairan secara real-time dengan teknologi IoT canggih. 
            Analisis data mendalam, peringatan otomatis, dan AI assistant untuk 
            hasil optimal dalam budidaya, penangkapan, dan konservasi.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={onConsultClick}
              size="lg"
              className="group bg-white/15 backdrop-blur-sm border border-white/30 text-white hover:bg-white/25 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
            >
              <span className="mr-2">Konsultasi Sekarang</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              onClick={onAIChatClick}
              variant="outline"
              size="lg"
              className="group border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:scale-105 transition-all duration-300"
            >
              <Bot className="h-5 w-5 mr-2" />
              <span>Tanya AI Assistant</span>
            </Button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/20"
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-white/70 text-sm">Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">99.9%</div>
              <div className="text-white/70 text-sm">Akurasi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">Real-time</div>
              <div className="text-white/70 text-sm">Alerts</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ModernHeroSection;
