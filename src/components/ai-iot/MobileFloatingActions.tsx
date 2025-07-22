
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  MessageCircle, 
  Phone, 
  Share2, 
  Settings,
  X,
  Bot,
  Wifi
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

interface FloatingAction {
  icon: React.ComponentType<any>;
  label: string;
  onClick: () => void;
  color: string;
}

interface MobileFloatingActionsProps {
  onConsultClick: () => void;
  onAIChatClick: () => void;
  onShareClick: () => void;
  onSettingsClick: () => void;
}

const MobileFloatingActions: React.FC<MobileFloatingActionsProps> = ({
  onConsultClick,
  onAIChatClick,
  onShareClick,
  onSettingsClick
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const actions: FloatingAction[] = [
    {
      icon: Phone,
      label: "Konsultasi",
      onClick: onConsultClick,
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Bot,
      label: "AI Chat",
      onClick: onAIChatClick,
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Share2,
      label: "Bagikan",
      onClick: onShareClick,
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Settings,
      label: "Pengaturan",
      onClick: onSettingsClick,
      color: "from-gray-500 to-slate-600"
    }
  ];

  const handleMainButtonClick = () => {
    setIsExpanded(!isExpanded);
    if (navigator.vibrate) {
      navigator.vibrate(isExpanded ? 50 : [50, 50, 50]);
    }
  };

  const handleActionClick = (action: FloatingAction) => {
    action.onClick();
    setIsExpanded(false);
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  return (
    <div className="fixed bottom-24 right-3 z-50">
      {/* Backdrop for expanded state */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            style={{ zIndex: -1 }}
          />
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute bottom-12 right-0 flex flex-col-reverse gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ 
                  opacity: 0, 
                  scale: 0.5, 
                  x: 20,
                  y: -8 * index
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  x: 0,
                  y: 0
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.5, 
                  x: 20 
                }}
                transition={{ 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
                className="flex items-center gap-2"
              >
                {/* Label */}
                <motion.div
                  className={cn(
                    "px-2 py-1 rounded-lg shadow-lg backdrop-blur-sm border text-xs",
                    theme === "light"
                      ? "bg-white/95 border-gray-200 text-gray-900"
                      : "bg-gray-900/95 border-gray-700 text-white"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="font-medium whitespace-nowrap">
                    {action.label}
                  </span>
                </motion.div>

                {/* Action button */}
                <motion.button
                  className={cn(
                    "w-9 h-9 rounded-full shadow-lg flex items-center justify-center",
                    "bg-gradient-to-r text-white",
                    "active:scale-95 transition-transform duration-150",
                    action.color
                  )}
                  onClick={() => handleActionClick(action)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{ minHeight: '36px', minWidth: '36px' }}
                >
                  <action.icon className="h-4 w-4" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        className={cn(
          "w-11 h-11 rounded-full shadow-xl flex items-center justify-center",
          "bg-gradient-to-r from-blue-600 to-cyan-600 text-white",
          "active:scale-95 transition-all duration-200",
          "border-2 border-white/20"
        )}
        onClick={handleMainButtonClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isExpanded ? 45 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{ minHeight: '44px', minWidth: '44px' }}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="plus"
              initial={{ opacity: 0, rotate: 45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -45 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Connection indicator */}
      <motion.div
        className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Wifi className="h-1.5 w-1.5 text-white absolute top-0.5 left-0.5" />
      </motion.div>
    </div>
  );
};

export default MobileFloatingActions;
