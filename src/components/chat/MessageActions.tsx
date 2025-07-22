
import React, { useState } from "react";
import { Copy, Check, Share, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface MessageActionsProps {
  content: string;
  position?: "top-right" | "bottom-right";
  className?: string;
}

const MessageActions: React.FC<MessageActionsProps> = ({
  content,
  position = "top-right",
  className = "",
}) => {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Teks berhasil disalin ke clipboard");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        text: content,
      })
      .then(() => toast.success("Berhasil berbagi pesan"))
      .catch((error) => console.error("Error sharing:", error));
    } else {
      handleCopy();
      toast.info("Teks telah disalin. Berbagi secara manual");
    }
  };

  const positionClasses = {
    "top-right": "top-2 right-2",
    "bottom-right": "bottom-2 right-2",
  };

  const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div 
      className={`absolute ${positionClasses[position]} flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${className}`}
      initial="hidden"
      animate={isHovered ? "visible" : "hidden"}
      variants={variants}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.2 }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              onClick={handleCopy}
              className="p-1.5 rounded-full bg-background/90 hover:bg-background shadow-sm border border-border/40 backdrop-blur-sm transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
            </motion.button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{copied ? "Disalin!" : "Salin teks"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              onClick={handleShare}
              className="p-1.5 rounded-full bg-background/90 hover:bg-background shadow-sm border border-border/40 backdrop-blur-sm transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share className="h-3.5 w-3.5 text-muted-foreground" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bagikan</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  );
};

export default MessageActions;
