
import { useState } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

interface CollapsibleFAQProps {
  faqs: FAQItem[];
  className?: string;
}

const CollapsibleFAQ = ({ faqs, className }: CollapsibleFAQProps) => {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});
  
  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center mb-4">
        <AlertCircle className="h-5 w-5 mr-2 text-visionfish-neon-blue" />
        <h3 className="text-xl font-semibold">Pertanyaan Umum</h3>
      </div>
      
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <Collapsible
            key={index}
            open={openItems[index] || false}
            onOpenChange={() => toggleItem(index)}
            className={cn(
              "bg-background/20 backdrop-blur-sm border border-visionfish-neon-blue/20 rounded-lg overflow-hidden",
              openItems[index] ? "border-visionfish-neon-blue/50" : ""
            )}
          >
            <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left">
              <span className="font-medium">{faq.question}</span>
              <motion.div
                animate={{ rotate: openItems[index] ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-5 w-5 text-visionfish-neon-blue" />
              </motion.div>
            </CollapsibleTrigger>
            
            <AnimatePresence>
              {openItems[index] && (
                <CollapsibleContent
                  forceMount
                  asChild
                >
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-4 pt-0 border-t border-visionfish-neon-blue/10">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default CollapsibleFAQ;
