
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

interface IoTDevice {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  parameters: string[];
  color: string;
}

interface EnhancedIoTCardProps {
  device: IoTDevice;
  index: number;
  onLearnMore: () => void;
}

const EnhancedIoTCard: React.FC<EnhancedIoTCardProps> = ({
  device,
  index,
  onLearnMore
}) => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group h-full"
    >
      <Card className={cn(
        "relative overflow-hidden h-full transition-all duration-500 border-0",
        "bg-gradient-to-br shadow-lg hover:shadow-2xl",
        theme === "light" 
          ? "from-white/90 to-gray-50/90 hover:shadow-blue-500/10" 
          : "from-slate-900/90 to-slate-800/90 hover:shadow-cyan-500/20",
        "backdrop-blur-sm border border-white/10"
      )}>
        {/* Gradient accent bar */}
        <div className={`h-1 bg-gradient-to-r ${device.color}`} />
        
        {/* Floating sparkle effect */}
        <motion.div
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-4 w-4 text-cyan-400" />
        </motion.div>

        {/* Glassmorphism overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />

        <CardHeader className="relative z-10 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className={cn(
                  "p-3 rounded-xl transition-all duration-300",
                  theme === "light" 
                    ? "bg-blue-50 group-hover:bg-blue-100" 
                    : "bg-slate-800 group-hover:bg-slate-700",
                  "group-hover:scale-110"
                )}
                whileHover={{ rotate: 5 }}
              >
                {device.icon}
              </motion.div>
              <div>
                <CardTitle className="text-lg group-hover:text-cyan-600 transition-colors">
                  {device.title}
                </CardTitle>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "mt-1 text-xs",
                    "bg-gradient-to-r from-cyan-500/20 to-blue-500/20",
                    "text-cyan-700 dark:text-cyan-300",
                    "border-cyan-500/30"
                  )}
                >
                  Terbaru
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {device.description}
          </p>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">
              Parameter Monitoring:
            </p>
            <div className="flex flex-wrap gap-2">
              {device.parameters.map((param, idx) => (
                <motion.div
                  key={param}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs transition-all duration-200 hover:scale-105",
                      "bg-background/50 backdrop-blur-sm",
                      "border-muted-foreground/20 hover:border-cyan-500/50",
                      "hover:bg-cyan-500/10"
                    )}
                  >
                    {param}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          <Button 
            onClick={onLearnMore}
            variant="outline" 
            className={cn(
              "w-full mt-6 group/btn transition-all duration-300",
              "border-muted-foreground/20 hover:border-cyan-500/50",
              "hover:bg-cyan-500/10 hover:text-cyan-600",
              "hover:shadow-lg hover:shadow-cyan-500/20"
            )}
          >
            <span>Pelajari Lebih Lanjut</span>
            <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </CardContent>

        {/* Animated border gradient */}
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent, ${device.color.includes('blue') ? '#06b6d4' : device.color.includes('green') ? '#10b981' : '#8b5cf6'}, transparent)`,
            maskImage: 'linear-gradient(90deg, transparent, black, transparent)',
          }}
        />
      </Card>
    </motion.div>
  );
};

export default EnhancedIoTCard;
