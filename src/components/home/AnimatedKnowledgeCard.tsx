
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { Book, Fish, Anchor, GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface KnowledgeItem {
  title: string;
  description: string;
}

interface KnowledgeTopic {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: KnowledgeItem[];
}

interface AnimatedKnowledgeCardProps {
  topic: KnowledgeTopic;
  isActive: boolean;
  onClick: () => void;
  activeContent: number;
  onContentChange: (index: number) => void;
  autoRotate?: boolean;
}

const AnimatedKnowledgeCard = ({
  topic,
  isActive,
  onClick,
  activeContent,
  onContentChange,
  autoRotate = false,
}: AnimatedKnowledgeCardProps) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const getCurrentContent = () => topic.content[activeContent];

  return (
    <motion.div
      onClick={onClick}
      className={cn(
        "rounded-xl overflow-hidden cursor-pointer transition-all duration-300",
        isActive ? "shadow-lg hover:shadow-xl" : "shadow-md hover:shadow-lg"
      )}
      animate={{
        scale: isActive ? 1 : 0.98,
        opacity: isActive ? 1 : 0.9,
        y: isActive ? 0 : 4,
      }}
      transition={{ duration: 0.3 }}
      layout
    >
      <Card
        className={cn(
          "h-full overflow-hidden transition-all duration-300",
          isActive
            ? theme === "light"
              ? "border-sky-300/60 bg-sky-50/90 shadow-sky-100/40"
              : "border-primary/40 bg-primary/5"
            : theme === "light"
            ? "border-slate-200/60 bg-slate-50/80 hover:bg-slate-50/90"
            : "border-gray-700/30 bg-white/5"
        )}
      >
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={cn(
                "rounded-full p-3 transition-all duration-300",
                isActive
                  ? theme === "light"
                    ? "bg-sky-100 text-sky-700"
                    : "bg-primary/15 text-primary"
                  : theme === "light"
                  ? "bg-slate-100 text-slate-600"
                  : "bg-gray-800/50 text-gray-300"
              )}
            >
              {topic.icon}
            </div>
            <h3 className={cn(
              "text-lg font-semibold",
              theme === "light" ? "text-slate-900" : "text-white"
            )}>
              {topic.title}
            </h3>
          </div>

          {!isActive && (
            <p className={cn(
              "text-sm line-clamp-2 mt-2",
              theme === "light" ? "text-slate-600" : "text-muted-foreground"
            )}>
              {topic.content[0].description}
            </p>
          )}

          <Collapsible
            open={isActive || isExpanded}
            onOpenChange={setIsExpanded}
            className={cn(!isActive && "hidden")}
          >
            <CollapsibleContent forceMount className="mt-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${topic.id}-${activeContent}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className={cn(
                    "text-base font-medium mb-2",
                    theme === "light" ? "text-sky-700" : "text-primary"
                  )}>
                    {getCurrentContent().title}
                  </h4>
                  <p className={cn(
                    "text-sm leading-relaxed",
                    theme === "light" ? "text-slate-600" : "text-muted-foreground"
                  )}>
                    {getCurrentContent().description}
                  </p>

                  {/* Content navigation dots */}
                  <div className="flex gap-1.5 mt-4 justify-center">
                    {topic.content.map((_, i) => (
                      <motion.button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          onContentChange(i);
                        }}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300",
                          i === activeContent
                            ? theme === "light"
                              ? "bg-sky-600 w-6"
                              : "bg-primary w-6"
                            : theme === "light"
                            ? "bg-slate-300 w-3 hover:bg-slate-400"
                            : "bg-gray-600 w-3",
                          "hover:opacity-80"
                        )}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </Card>
    </motion.div>
  );
};

export default AnimatedKnowledgeCard;
