
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Info, Mail, FileText, Shield, Fish } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export const AuthFooter = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      className={cn(
        "py-6 border-t backdrop-blur-2xl relative z-10",
        isDark 
          ? "bg-slate-900/50 border-slate-700/30" 
          : "bg-white/50 border-slate-200/30"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo & Copyright */}
          <div className="flex items-center space-x-3">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              isDark 
                ? "bg-gradient-to-br from-purple-500/20 to-cyan-500/20" 
                : "bg-gradient-to-br from-purple-500/10 to-cyan-500/10"
            )}>
              <Fish className={cn(
                "w-4 h-4",
                isDark ? "text-purple-400" : "text-purple-600"
              )} />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "text-sm font-bold bg-gradient-to-r bg-clip-text text-transparent",
                isDark 
                  ? "from-purple-400 to-cyan-400" 
                  : "from-purple-600 to-cyan-600"
              )}>
                VisionFish
              </span>
              <p className={cn(
                "text-xs",
                isDark ? "text-slate-400" : "text-slate-600"
              )}>
                © {currentYear} Semua hak dilindungi.
              </p>
            </div>
          </div>
          
          {/* Footer Links */}
          <div className="flex items-center gap-6">
            <Link 
              to="/about" 
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:scale-105 group",
                isDark 
                  ? "text-slate-400 hover:text-purple-400" 
                  : "text-slate-600 hover:text-purple-600"
              )}
            >
              <Info className="h-4 w-4 transition-transform group-hover:rotate-12" />
              <span className="relative">
                Tentang Kami
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full" />
              </span>
            </Link>
            
            <Link 
              to="/contact" 
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:scale-105 group",
                isDark 
                  ? "text-slate-400 hover:text-cyan-400" 
                  : "text-slate-600 hover:text-cyan-600"
              )}
            >
              <Mail className="h-4 w-4 transition-transform group-hover:rotate-12" />
              <span className="relative">
                Kontak
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full" />
              </span>
            </Link>
            
            <Link 
              to="/privacy" 
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:scale-105 group",
                isDark 
                  ? "text-slate-400 hover:text-emerald-400" 
                  : "text-slate-600 hover:text-emerald-600"
              )}
            >
              <Shield className="h-4 w-4 transition-transform group-hover:rotate-12" />
              <span className="relative">
                Kebijakan Privasi
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
