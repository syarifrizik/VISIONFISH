
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  WifiIcon, 
  Share2, 
  ThermometerSun, 
  Droplets, 
  Wind, 
  Waves,
  Activity,
  Zap
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

interface Parameter {
  name: string;
  icon: React.ComponentType<any>;
  value: string;
  status: 'normal' | 'warning' | 'alert';
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

const LiveParameterDemo = ({ onShare }: { onShare: () => void }) => {
  const { theme } = useTheme();
  const [parameters, setParameters] = useState<Parameter[]>([
    {
      name: "Suhu Air",
      icon: ThermometerSun,
      value: "28.5",
      status: "normal",
      unit: "°C",
      trend: "stable"
    },
    {
      name: "pH Air",
      icon: Droplets,
      value: "7.2",
      status: "normal",
      unit: "",
      trend: "up"
    },
    {
      name: "Oksigen Terlarut",
      icon: Wind,
      value: "5.8",
      status: "warning",
      unit: "mg/L",
      trend: "down"
    },
    {
      name: "Salinitas",
      icon: Waves,
      value: "15",
      status: "normal",
      unit: "ppt",
      trend: "stable"
    },
    {
      name: "Kekeruhan",
      icon: Droplets,
      value: "25",
      status: "alert",
      unit: "NTU",
      trend: "up"
    }
  ]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setParameters(prev => prev.map(param => ({
        ...param,
        value: (parseFloat(param.value) + (Math.random() - 0.5) * 0.5).toFixed(1)
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-500 bg-green-500/20 border-green-500/30';
      case 'warning':
        return 'text-amber-500 bg-amber-500/20 border-amber-500/30';
      case 'alert':
        return 'text-red-500 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-500 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden border-0 shadow-xl",
      theme === "light" 
        ? "bg-white/95 backdrop-blur-sm" 
        : "bg-slate-900/95 backdrop-blur-sm",
      "border border-white/10"
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className={cn(
                "p-2 rounded-lg",
                theme === "light" ? "bg-blue-100" : "bg-blue-900/50"
              )}
            >
              <WifiIcon className="h-5 w-5 text-blue-600" />
            </motion.div>
            <span>Live Parameter Monitoring</span>
            <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
              <Activity className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Data Visualization */}
          <Card className="col-span-1 lg:col-span-2 bg-background/50 border-0 shadow-sm backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-cyan-500" />
                Real-time Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn(
                "rounded-xl p-4 mb-4 border",
                theme === "light" 
                  ? "bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border-blue-200/50" 
                  : "bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-800/30"
              )}>
                <div className="flex justify-between items-end h-32 sm:h-48 px-2">
                  {parameters.map((param, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <motion.div
                        className={cn(
                          "w-6 sm:w-8 rounded-t-lg relative overflow-hidden",
                          param.status === "normal" ? "bg-green-400" :
                          param.status === "warning" ? "bg-amber-400" : "bg-red-400"
                        )}
                        initial={{ height: 0 }}
                        animate={{ 
                          height: `${30 + Math.random() * 80}px`
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "reverse",
                          repeatDelay: Math.random() * 2,
                          ease: "easeInOut"
                        }}
                      >
                        {/* Shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent"
                          animate={{ y: ["-100%", "100%"] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      </motion.div>
                      <div className="mt-2 text-center">
                        <span className="text-xs sm:text-sm font-semibold">
                          {param.value}{param.unit}
                        </span>
                        <div className="text-xs text-muted-foreground mt-1">
                          {param.name.split(' ')[0]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onShare}
                  className="hover:bg-blue-500/10 hover:border-blue-500/50"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Bagikan Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Parameter List */}
          <Card className="bg-background/50 border-0 shadow-sm backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Parameter Terkini</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[200px] sm:h-[280px]">
                <div className="p-4 space-y-3">
                  <AnimatePresence>
                    {parameters.map((param, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border transition-all duration-200",
                          "hover:shadow-md cursor-pointer",
                          theme === "light" 
                            ? "bg-white/80 border-gray-200/50 hover:border-blue-300/50" 
                            : "bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            theme === "light" ? "bg-gray-100" : "bg-slate-700"
                          )}>
                            <param.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{param.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Trend: {getTrendIcon(param.trend)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {param.value}{param.unit}
                          </span>
                          <div className={cn(
                            "w-3 h-3 rounded-full border",
                            getStatusColor(param.status)
                          )} />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveParameterDemo;
