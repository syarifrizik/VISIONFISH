
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { NavItem } from "@/types/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

interface NavbarFooterProps {
  navItems: NavItem[];
}

export const NavbarFooter = ({ navItems }: NavbarFooterProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  
  const isActive = (path: string) => location.pathname === path;

  // Filter to only show main navigation items for mobile
  const mobileItems = navItems.filter(item => 
    !item.desktopOnly && 
    item.path !== '/' && 
    item.path !== '/settings' && 
    (item.path === '/fish-analysis' || 
     item.path === '/species-id' || 
     item.path === '/weather' || 
     item.path === '/ai-iot' || 
     item.path === '/chatroom')
  );

  // Enhanced mobile labels with Indonesian
  const getMobileLabel = (path: string, label: string): string => {
    switch (path) {
      case '/fish-analysis': return 'Analisis';
      case '/species-id': return 'Spesies';
      case '/weather': return 'Cuaca';
      case '/ai-iot': return 'AI&IoT';
      case '/chatroom': return 'Chat';
      default: return label;
    }
  };

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "mobile-nav fixed bottom-0 left-0 right-0 z-50 lg:hidden",
        "backdrop-blur-2xl border-t shadow-2xl",
        theme === "light" 
          ? "bg-white/90 border-gray-200/50" 
          : "bg-slate-900/90 border-slate-700/50"
      )}
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute inset-0 ${theme === "light" 
          ? "bg-gradient-to-t from-white/95 to-white/85" 
          : "bg-gradient-to-t from-slate-900/95 to-slate-900/85"
        }`} />
        
        {/* Subtle mesh pattern */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23${theme === 'light' ? '6366f1' : 'a855f7'}' fillOpacity='0.1'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E")`
          }} 
        />
      </div>

      {/* Navigation Items */}
      <div className="relative z-10 grid grid-cols-5 w-full px-2 py-2">
        {mobileItems.map((item) => {
          const isItemActive = isActive(item.path);
          const mobileLabel = getMobileLabel(item.path, item.label);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center py-2 px-1 relative group"
            >
              {/* Active indicator */}
              <div className={cn(
                "absolute top-0 h-1 rounded-b-md transition-all duration-300",
                isItemActive
                  ? theme === "light"
                    ? "bg-purple-600 w-8 opacity-100"
                    : "bg-purple-400 w-8 opacity-100"
                  : "w-0 opacity-0"
              )} />
              
              {/* Icon container with enhanced hover effects */}
              <div className={cn(
                "rounded-xl p-2 transition-all duration-300 group-hover:scale-110",
                isItemActive
                  ? theme === "light" 
                    ? "bg-purple-100/80 shadow-md" 
                    : "bg-purple-900/40 shadow-lg"
                  : "bg-transparent group-hover:bg-gray-100/50 dark:group-hover:bg-gray-800/30"
              )}>
                <item.icon className={cn(
                  "w-5 h-5 transition-all duration-300",
                  isItemActive
                    ? theme === "light" 
                      ? "text-purple-700" 
                      : "text-purple-300"
                    : theme === "light"
                      ? "text-gray-600 group-hover:text-purple-600"
                      : "text-gray-400 group-hover:text-purple-400"
                )} />
              </div>
              
              {/* Label with enhanced styling */}
              <span className={cn(
                "text-[10px] mt-1 font-medium truncate transition-all duration-300",
                isItemActive
                  ? theme === "light" 
                    ? "text-purple-700" 
                    : "text-purple-300"
                  : theme === "light"
                    ? "text-gray-600 group-hover:text-purple-600"
                    : "text-gray-400 group-hover:text-purple-400"
              )}>
                {mobileLabel}
              </span>
              
              {/* Enhanced active dot indicator */}
              {isItemActive && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full mt-1",
                    theme === "light" 
                      ? "bg-purple-600" 
                      : "bg-purple-400"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Enhanced Bottom Safe Area */}
      <div className={`h-2 ${theme === "light" 
        ? "bg-gradient-to-b from-white/50 to-white/80" 
        : "bg-gradient-to-b from-slate-900/50 to-slate-900/80"
      }`} />
    </motion.nav>
  );
};
