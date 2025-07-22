import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Brain, MessageCircle, Sparkles, Zap, Shield } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ModernAIChatHeroProps {
  onStartChat: () => void;
  onUpgrade: () => void;
}

const FloatingAIIcon = ({ icon: Icon, delay = 0, className = "" }) => (
  <motion.div
    className={cn(
      "absolute p-3 rounded-xl backdrop-blur-sm border border-white/20",
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
    <Icon className="h-6 w-6 text-white" />
  </motion.div>
);

const ModernAIChatHero: React.FC<ModernAIChatHeroProps> = ({
  onStartChat,
  onUpgrade
}) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleStartChat = () => {
    // Use the global function exposed by EnhancedAIChatComponent
    if ((window as any).scrollToChatInput) {
      (window as any).scrollToChatInput();
    } else {
      // Fallback: scroll to chat area
      const chatElement = document.querySelector('[data-chat-area]');
      if (chatElement) {
        chatElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
    onStartChat();
  };

  const handleUpgrade = () => {
    navigate('/premium');
  };

  return (
    <div className="relative overflow-hidden rounded-2xl mb-8">
      {/* Background Layers */}
      <div className="absolute inset-0">
        {/* Base gradient with AI-focused colors */}
        <div className={cn(
          "absolute inset-0",
          theme === 'light' 
            ? "bg-gradient-to-br from-purple-600/90 via-blue-500/80 to-cyan-600/90" 
            : "bg-gradient-to-br from-purple-900/95 via-blue-900/90 to-cyan-900/95"
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
        
        {/* AI-themed animated mesh gradient */}
        <motion.div
          className="absolute inset-0 opacity-25"
          animate={{
            background: [
              "radial-gradient(circle at 30% 40%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 70% 60%, #3b82f6 0%, transparent 50%)",
              "radial-gradient(circle at 60% 20%, #06b6d4 0%, transparent 50%), radial-gradient(circle at 40% 80%, #8b5cf6 0%, transparent 50%)",
              "radial-gradient(circle at 30% 40%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 70% 60%, #3b82f6 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating AI Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingAIIcon 
          icon={Bot} 
          delay={0} 
          className="top-20 left-16 bg-purple-500/30" 
        />
        <FloatingAIIcon 
          icon={Brain} 
          delay={1} 
          className="top-24 right-16 bg-blue-500/30" 
        />
        <FloatingAIIcon 
          icon={MessageCircle} 
          delay={2} 
          className="bottom-24 left-20 bg-cyan-500/30" 
        />
        <FloatingAIIcon 
          icon={Sparkles} 
          delay={1.5} 
          className="bottom-20 right-20 bg-purple-500/30" 
        />
        <FloatingAIIcon 
          icon={Zap} 
          delay={0.5} 
          className="top-32 left-1/2 transform -translate-x-1/2 bg-indigo-500/30" 
        />
        <FloatingAIIcon 
          icon={Shield} 
          delay={2.5} 
          className="bottom-32 left-1/3 bg-emerald-500/30" 
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 mb-6">
              <Brain className="h-4 w-4 mr-2 text-purple-300" />
              <span className="text-white/90 text-sm font-medium">
                AI Assistant Terdepan
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="block">Konsultasi</span>
              <span className="block bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                AI Perikanan
              </span>
              <span className="block">Cerdas</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto"
          >
            Dapatkan analisis mendalam, rekomendasi budidaya, dan solusi perikanan 
            dengan teknologi AI terdepan. Asisten virtual yang memahami kebutuhan spesifik Anda.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <Button
              onClick={handleStartChat}
              size="lg"
              className="group bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 active:scale-95 transition-all duration-200 shadow-lg px-8 py-4 text-lg"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              <span>Mulai Chat Sekarang</span>
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              onClick={handleUpgrade}
              variant="outline"
              size="lg"
              className="group border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 active:scale-95 transition-all duration-200 px-8 py-4 text-lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              <span>Upgrade Premium</span>
            </Button>
          </motion.div>

          {/* AI Capabilities Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">3</div>
              <div className="text-white/70 text-sm">Model AI</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/70 text-sm">Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1000+</div>
              <div className="text-white/70 text-sm">Knowledge Base</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ModernAIChatHero;
