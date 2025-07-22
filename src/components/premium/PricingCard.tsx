
import { ReactNode } from "react";
import { Crown, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: PricingFeature[];
  buttonText: string;
  isPremium?: boolean;
  onButtonClick: () => void;
  className?: string;
}

const PricingCard = ({
  title,
  price,
  description,
  features,
  buttonText,
  isPremium = false,
  onButtonClick,
  className,
}: PricingCardProps) => {
  const { theme } = useTheme();
  
  return (
    <motion.div 
      className={cn(
        "rounded-xl border overflow-hidden h-full flex flex-col",
        isPremium 
          ? "bg-gradient-to-br from-visionfish-neon-purple/80 to-visionfish-neon-pink/80 text-white border-visionfish-neon-pink" 
          : "bg-background/80 border-visionfish-neon-blue/30",
        "backdrop-blur-md relative z-10",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: theme === "light" 
        ? (isPremium ? "0 10px 25px rgba(255, 0, 184, 0.2)" : "0 10px 25px rgba(0, 194, 255, 0.2)") 
        : (isPremium ? "0 10px 25px rgba(255, 0, 184, 0.1)" : "0 10px 25px rgba(0, 194, 255, 0.1)")
      }}
    >
      {/* Card header */}
      <div className={cn(
        "p-6 border-b", 
        isPremium ? "border-white/20" : "border-visionfish-neon-blue/20"
      )}>
        <div className="flex items-center mb-4">
          {isPremium && <Crown className="h-5 w-5 mr-2" />}
          <h3 className={cn(
            "text-xl font-bold",
            isPremium ? "text-white" : ""
          )}>
            {title}
          </h3>
        </div>
        
        <div className="mb-4">
          <div className="flex items-end">
            <span className="text-3xl font-bold">{price}</span>
            {price !== "Gratis" && <span className="text-sm ml-1 mb-1">/bulan</span>}
          </div>
          <p className={cn(
            "text-sm mt-2", 
            isPremium ? "text-white/80" : "text-muted-foreground"
          )}>
            {description}
          </p>
        </div>
      </div>
      
      {/* Features list */}
      <div className="p-6 flex-grow">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <motion.li 
              key={index}
              className="flex items-start"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Check className={cn(
                "h-5 w-5 mr-2 mt-0.5 flex-shrink-0",
                isPremium ? "text-white" : "text-visionfish-neon-blue"
              )} />
              <span className={isPremium ? "text-white/90" : ""}>
                {feature.text}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
      
      {/* Card footer */}
      <div className="p-6 pt-0 mt-auto">
        <Button 
          onClick={onButtonClick}
          className={cn(
            "w-full py-6",
            isPremium 
              ? "shadow-md hover:shadow-lg bg-white hover:bg-white/90 text-visionfish-neon-pink font-medium" 
              : "border border-visionfish-neon-blue/30 hover:border-visionfish-neon-blue/50"
          )}
          variant={isPremium ? "default" : "outline"}
        >
          {buttonText}
        </Button>
      </div>
      
      {/* Premium badge */}
      {isPremium && (
        <div className="absolute top-0 right-0">
          <div className="bg-white text-visionfish-neon-pink text-xs font-bold px-3 py-1 rounded-bl-lg">
            TERBAIK
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PricingCard;
