import { useState } from "react";
import { Check, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
interface FeatureComparisonProps {
  className?: string;
}
interface FeatureItem {
  name: string;
  free: boolean | string;
  premium: boolean | string;
}
const features: FeatureItem[] = [{
  name: "Analisis Kualitas Ikan",
  free: true,
  premium: true
}, {
  name: "Analisis Gambar",
  free: "5 analisis/hari",
  premium: "Tanpa batas"
}, {
  name: "AI Chat",
  free: "10 pesan/hari",
  premium: "Tanpa batas"
}, {
  name: "Model AI Canggih",
  free: false,
  premium: true
}, {
  name: "Laporan PDF",
  free: false,
  premium: true
}, {
  name: "Data Historis Cuaca",
  free: false,
  premium: true
}];
const FeatureComparison = ({
  className
}: FeatureComparisonProps) => {
  const [view, setView] = useState<"table" | "cards">("table");
  const isMobile = useIsMobile();

  // Mobile automatically uses cards view
  const currentView = isMobile ? "cards" : view;
  return <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Perbandingan Fitur</h3>
        
        {!isMobile && <Tabs value={view} onValueChange={v => setView(v as "table" | "cards")} className="hidden md:block">
            
          </Tabs>}
      </div>
      
      {currentView === "table" ? <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="bg-background/30 backdrop-blur-sm">
                <th className="text-left p-3 border-b border-visionfish-neon-blue/20">Fitur</th>
                <th className="p-3 border-b border-visionfish-neon-blue/20">Gratis</th>
                <th className="p-3 border-b border-visionfish-neon-blue/20 text-visionfish-neon-pink">Premium</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => <motion.tr key={index} className="hover:bg-background/20" initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.1
          }}>
                  <td className="p-3 border-b border-visionfish-neon-blue/10">{feature.name}</td>
                  <td className="p-3 border-b border-visionfish-neon-blue/10 text-center">
                    {typeof feature.free === "boolean" ? feature.free ? <Check className="h-5 w-5 text-visionfish-neon-blue mx-auto" /> : <AlertCircle className="h-5 w-5 text-yellow-500 mx-auto" /> : <span className="text-muted-foreground">{feature.free}</span>}
                  </td>
                  <td className="p-3 border-b border-visionfish-neon-blue/10 text-center">
                    {typeof feature.premium === "boolean" ? feature.premium ? <Check className="h-5 w-5 text-visionfish-neon-pink mx-auto" /> : <AlertCircle className="h-5 w-5 text-yellow-500 mx-auto" /> : <span className="text-visionfish-neon-pink font-medium">{feature.premium}</span>}
                  </td>
                </motion.tr>)}
            </tbody>
          </table>
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => <motion.div key={index} className="bg-background/20 backdrop-blur-sm rounded-lg border border-visionfish-neon-blue/20 p-4" initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: index * 0.1
      }}>
              <h4 className="font-medium mb-2">{feature.name}</h4>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Gratis:</span>
                  {typeof feature.free === "boolean" ? feature.free ? <Check className="h-4 w-4 text-visionfish-neon-blue" /> : <AlertCircle className="h-4 w-4 text-yellow-500" /> : <span className="text-sm">{feature.free}</span>}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Premium:</span>
                  {typeof feature.premium === "boolean" ? feature.premium ? <Check className="h-4 w-4 text-visionfish-neon-pink" /> : <AlertCircle className="h-4 w-4 text-yellow-500" /> : <span className="text-sm text-visionfish-neon-pink font-medium">{feature.premium}</span>}
                </div>
              </div>
            </motion.div>)}
        </div>}
    </div>;
};
export default FeatureComparison;