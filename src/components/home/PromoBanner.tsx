
import { motion } from "framer-motion";
import { ArrowRight, Navigation, Fish } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const PromoBanner = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <motion.div 
      className={cn(
        "relative overflow-hidden rounded-xl mb-10 cursor-pointer shadow-md hover:shadow-lg transition-all duration-300",
        theme === 'light' 
          ? 'bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700' 
          : 'bg-gradient-to-r from-visionfish-neon-purple to-visionfish-neon-blue'
      )}
      onClick={() => navigate('/species-id')}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.7 }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 relative z-10">
        <div className="flex-1 mb-4 md:mb-0 max-w-full md:max-w-[80%]">
          <div className="w-full">
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-white text-shadow-md">
              <div className="block py-1">
                <span className="inline-block w-full">
                  Identifikasi spesies ikan dan analisis kesegaran melalui teknologi Artificial Intelligence
                </span>
              </div>
            </h3>
          </div>
        </div>
        <div className="w-full md:w-auto flex justify-center">
          <Button className="w-full md:w-auto text-white backdrop-blur-sm shadow-md hover:shadow-lg border-2 border-white/30 bg-white/20 hover:bg-white/30 transition-all duration-300">
            Pelajari Lebih Lanjut
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 opacity-15">
        <Navigation className="w-20 h-20 text-white" />
      </div>
      <div className="absolute -left-4 -bottom-4 opacity-10">
        <Fish className="w-16 h-16 text-white" />
      </div>
      
      {/* Additional wave background */}
      <svg className="absolute bottom-0 left-0 right-0 opacity-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="white" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,154.7C960,128,1056,96,1152,96C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </motion.div>
  );
};

export default PromoBanner;
