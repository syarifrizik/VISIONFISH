
import { motion } from "framer-motion";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WorkflowSectionProps {
  currentStep: number;
  fishName: string;
  hasResults: boolean;
}

const WORKFLOW_STEPS = [
  {
    id: 1,
    title: "Pilih Jenis Ikan",
    description: "Tentukan spesies ikan yang akan dianalisis",
    required: true
  },
  {
    id: 2,
    title: "Input Parameter",
    description: "Masukkan nilai parameter kualitas ikan (1-9)",
    required: true
  },
  {
    id: 3,
    title: "Analisis & Hasil",
    description: "Lihat hasil analisis dan rekomendasi SNI",
    required: false
  }
];

const WorkflowSection = ({ currentStep, fishName, hasResults }: WorkflowSectionProps) => {
  const getStepStatus = (stepId: number) => {
    if (stepId === 1 && fishName) return "completed";
    if (stepId === 2 && currentStep >= 2) return "completed";
    if (stepId === 3 && hasResults) return "completed";
    if (stepId === currentStep) return "active";
    return "pending";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-background/80 to-visionfish-neon-blue/5 backdrop-blur-sm rounded-lg border border-visionfish-neon-blue/20 p-6 mb-8"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold">Alur Analisis Kualitas Ikan</h3>
          <p className="text-sm text-muted-foreground">
            Ikuti langkah-langkah berikut untuk analisis yang akurat
          </p>
        </div>
        <Badge 
          variant="outline" 
          className="bg-visionfish-neon-blue/10 text-visionfish-neon-blue border-visionfish-neon-blue/30"
        >
          Standar SNI
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {WORKFLOW_STEPS.map((step, index) => {
          const status = getStepStatus(step.id);
          
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative"
            >
              <div className={`
                p-4 rounded-lg border transition-all duration-300
                ${status === "completed" 
                  ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800" 
                  : status === "active" 
                    ? "bg-visionfish-neon-blue/10 border-visionfish-neon-blue/30 shadow-md" 
                    : "bg-muted/50 border-muted"
                }
              `}>
                <div className="flex items-start gap-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors
                    ${status === "completed" 
                      ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400" 
                      : status === "active" 
                        ? "bg-visionfish-neon-blue/20 text-visionfish-neon-blue" 
                        : "bg-muted text-muted-foreground"
                    }
                  `}>
                    {status === "completed" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <h4 className={`
                      font-medium mb-1 text-sm
                      ${status === "completed" 
                        ? "text-green-700 dark:text-green-300" 
                        : status === "active" 
                          ? "text-visionfish-neon-blue" 
                          : "text-muted-foreground"
                      }
                    `}>
                      {step.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    
                    {step.id === 1 && fishName && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {fishName}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Arrow connector for larger screens */}
              {index < WORKFLOW_STEPS.length - 1 && (
                <div className="hidden sm:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                  <div className="w-4 h-4 bg-background border border-muted rounded-full flex items-center justify-center">
                    <ArrowRight className="w-2.5 h-2.5 text-muted-foreground" />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default WorkflowSection;
