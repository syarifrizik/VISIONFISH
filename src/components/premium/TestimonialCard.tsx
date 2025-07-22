
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  className?: string;
}

const TestimonialCard = ({
  quote,
  author,
  role,
  className,
}: TestimonialCardProps) => {
  const { theme } = useTheme();
  
  return (
    <motion.div 
      className={cn(
        "bg-background/40 rounded-lg p-5 border border-visionfish-neon-blue/30 h-full flex flex-col",
        "hover:border-visionfish-neon-blue transition-all duration-300",
        "scroll-snap-align-start min-w-[280px] max-w-[350px]",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -5, 
        boxShadow: theme === "light" 
          ? "0 8px 24px rgba(0, 194, 255, 0.15)" 
          : "0 8px 24px rgba(0, 194, 255, 0.1)" 
      }}
    >
      <p className="italic mb-4 flex-grow">{quote}</p>
      <div className="mt-auto">
        <p className="font-semibold text-visionfish-neon-blue">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
