
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PremiumFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isExclusive?: boolean;
  className?: string;
}

const PremiumFeatureCard = ({
  icon: Icon,
  title,
  description,
  isExclusive = false,
  className,
}: PremiumFeatureCardProps) => {
  return (
    <motion.div
      className={cn(
        "bg-background/20 backdrop-blur-sm rounded-lg p-4 border border-visionfish-neon-blue/30 h-full",
        "hover:border-visionfish-neon-blue transition-all duration-300",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex items-start h-full">
        <div className="mr-3 p-2 rounded-full bg-visionfish-neon-blue/20 h-fit">
          <Icon className="h-5 w-5 text-visionfish-neon-blue" />
        </div>
        <div className="flex-1">
          <div className="flex items-center flex-wrap gap-2">
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
            {isExclusive && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-visionfish-neon-pink/20 border border-visionfish-neon-pink/50 text-visionfish-neon-pink whitespace-nowrap">
                ✨ Premium Eksklusif
              </span>
            )}
          </div>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumFeatureCard;
