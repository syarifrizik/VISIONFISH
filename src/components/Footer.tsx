
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { Info, Mail, FileText } from 'lucide-react';

export const Footer = () => {
  const {
    theme
  } = useTheme();
  const currentYear = new Date().getFullYear();
  return <motion.footer className={cn("py-6 border-t hidden lg:block relative z-10 w-full mt-auto", theme === "light" ? "bg-white/80 backdrop-blur-md border-gray-200" : "bg-gray-900/50 backdrop-blur-md border-gray-800")} initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    delay: 0.5,
    duration: 0.7
  }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center">
            <img 
              alt="VisionFish Logo" 
              className="h-6 w-6 mr-2" 
              src={`https://ik.imagekit.io/biajcse64/VisionFish/VisionFish.io/VisionFish-io.png?updatedAt=1750865180351&v=${Date.now()}`}
              onError={(e) => {
                console.error('Failed to load footer logo image');
                e.currentTarget.src = "/placeholder.svg";
              }}
              loading="lazy"
            />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              © {currentYear} VisionFish. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/about" className="flex items-center gap-1 group relative overflow-hidden px-3 py-2 rounded-md transition-all duration-300">
              <div className={cn("absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-md", theme === "light" ? "bg-ocean-teal" : "bg-visionfish-neon-blue")}></div>
              <Info className={cn("h-4 w-4 transition-all duration-300", theme === "light" ? "text-ocean-teal" : "text-visionfish-neon-blue")} />
              <span className={cn("font-medium relative text-sm", theme === "light" ? "text-ocean-teal" : "text-visionfish-neon-blue")}>
                <span className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-current after:origin-bottom-right after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 group-hover:after:origin-bottom-left">
                  Tentang Kami
                </span>
              </span>
            </Link>
            
            <Link to="/contact" className="flex items-center gap-1 group relative overflow-hidden px-3 py-2 rounded-md transition-all duration-300">
              <div className={cn("absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-md", theme === "light" ? "bg-ocean-teal" : "bg-visionfish-neon-blue")}></div>
              <Mail className={cn("h-4 w-4 transition-all duration-300", theme === "light" ? "text-ocean-teal" : "text-visionfish-neon-blue")} />
              <span className={cn("font-medium relative text-sm", theme === "light" ? "text-ocean-teal" : "text-visionfish-neon-blue")}>
                <span className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-current after:origin-bottom-right after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 group-hover:after:origin-bottom-left">
                  Kontak
                </span>
              </span>
            </Link>
            
            <Link to="/privacy" className="flex items-center gap-1 group relative overflow-hidden px-3 py-2 rounded-md transition-all duration-300">
              <div className={cn("absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-md", theme === "light" ? "bg-ocean-teal" : "bg-visionfish-neon-blue")}></div>
              <FileText className={cn("h-4 w-4 transition-all duration-300", theme === "light" ? "text-ocean-teal" : "text-visionfish-neon-blue")} />
              <span className={cn("font-medium relative text-sm", theme === "light" ? "text-ocean-teal" : "text-visionfish-neon-blue")}>
                <span className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-current after:origin-bottom-right after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 group-hover:after:origin-bottom-left">
                  Kebijakan Privasi
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>;
};
