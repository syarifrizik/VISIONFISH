
import { motion } from "framer-motion";
import { Fish } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const QuickAccessButton = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="fixed bottom-24 right-6 md:bottom-8 z-40">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <Button 
          onClick={() => navigate('/species-id')}
          className={cn(
            "rounded-full shadow-xl hover:shadow-2xl transition-all",
            theme === 'light'
              ? 'bg-ocean-teal text-white hover:bg-ocean-teal/90 border border-ocean-teal/30 shadow-blue-300/30' 
              : 'bg-visionfish-neon-blue text-white hover:bg-visionfish-neon-blue/90 border border-visionfish-neon-blue/50 shadow-neon-blue',
            "px-6 py-3 font-medium"
          )}
        >
          <Fish className={cn("mr-2 h-5 w-5", theme === 'light' ? "text-white" : "text-white")} />
          Scan Ikan Sekarang
        </Button>
      </motion.div>
    </div>
  );
};

export default QuickAccessButton;
