
import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  colorAccent?: string;
  className?: string;
  fadeIn?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  colorAccent = "from-visionfish-neon-blue/5 to-transparent",
  className = "",
  fadeIn = true,
}) => {
  return (
    <motion.div
      whileHover={{ translateY: -5, transition: { duration: 0.2 } }}
      initial={fadeIn ? { opacity: 0, y: 10 } : undefined}
      animate={fadeIn ? { opacity: 1, y: 0 } : undefined}
      transition={fadeIn ? { duration: 0.5 } : undefined}
      className={`h-full ${className}`}
    >
      <Card className={`h-full rounded-lg p-4 border border-visionfish-neon-blue/20 shadow-sm space-y-2 transition-all duration-300 hover:shadow-lg hover:border-visionfish-neon-blue/40`}>
        {/* Using background gradient on inner div instead of the card itself */}
        <div className={`absolute inset-0 bg-gradient-to-r ${colorAccent} rounded-lg z-0 pointer-events-none`}></div>
        
        {/* Content positioned above the background */}
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {icon && <div>{icon}</div>}
          </div>
          
          <div className="flex items-end gap-2">
            <p className="text-2xl md:text-3xl font-bold text-visionfish-neon-blue">
              {value}
            </p>
            {description && <p className="text-muted-foreground text-xs pb-1">{description}</p>}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;
