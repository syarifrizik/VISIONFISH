
import { motion } from "framer-motion";
import { Crown, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const PremiumFeature = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <motion.div 
      className={cn(
        "relative overflow-hidden rounded-xl mb-10 cursor-pointer transition-all duration-300 hover:shadow-lg",
        theme === 'light' 
          ? 'bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200/60 hover:border-sky-300/80' 
          : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-white/10'
      )}
      onClick={() => navigate('/premium')}
      whileHover={{ scale: 1.01 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 relative z-10">
        <div className="flex-1 mb-4 md:mb-0 max-w-full md:max-w-[75%]">
          <div className="flex items-center gap-2 mb-2">
            <Crown className={cn(
              "h-5 w-5",
              theme === 'light' ? 'text-sky-600' : 'text-blue-400'
            )} />
            <span className={cn(
              "text-xs font-medium uppercase tracking-wider",
              theme === 'light' ? 'text-sky-700' : 'text-blue-400'
            )}>
              Premium
            </span>
          </div>
          <h3 className={cn(
            "text-lg md:text-xl font-bold mb-2",
            theme === 'light' ? 'text-slate-900' : 'text-white'
          )}>
            Unlock Advanced Features
          </h3>
          <p className={cn(
            "text-sm md:text-base",
            theme === 'light' ? 'text-slate-600' : 'text-white/80'
          )}>
            Akses analisis mendalam, prediksi AI, dan fitur eksklusif lainnya
          </p>
        </div>
        <div className="w-full md:w-auto flex justify-center">
          <Button className={cn(
            "w-full md:w-auto font-semibold transition-all duration-300 shadow-md hover:shadow-lg",
            theme === 'light' 
              ? 'bg-sky-600 hover:bg-sky-700 text-white border-0' 
              : 'bg-blue-500 hover:bg-blue-600 text-white border-0'
          )}>
            Upgrade Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className={cn(
        "absolute -right-4 top-1/2 transform -translate-y-1/2",
        theme === 'light' ? 'opacity-10' : 'opacity-15'
      )}>
        <Sparkles className={cn(
          "w-16 h-16",
          theme === 'light' ? 'text-sky-400' : 'text-blue-300'
        )} />
      </div>
    </motion.div>
  );
};

export default PremiumFeature;
