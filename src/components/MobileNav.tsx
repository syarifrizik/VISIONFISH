
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { NavItem } from "@/types/navigation";
import { motion } from "framer-motion";

interface MobileNavProps {
  navItems: NavItem[];
}

const MobileNav = ({ navItems }: MobileNavProps) => {
  const location = useLocation();
  const { theme } = useTheme();
  
  // Filter to only show Analysis, Species ID, Weather, AI Chat, Chatroom
  // Skip Home and desktop-only items
  const mobileItems = navItems.filter(item => 
    !item.desktopOnly && 
    item.path !== '/' && 
    (item.path === '/fish-analysis' || 
     item.path === '/species-id' || 
     item.path === '/weather' || 
     item.path === '/ai-chat' || 
     item.path === '/chatroom' || 
     item.path === '/contact' || 
     item.path === '/about' || 
     item.path === '/privacy')
  );
  
  // Create shorter display names for mobile
  const getMobileLabel = (path: string, label: string): string => {
    switch(path) {
      case '/fish-analysis': return 'Analysis';
      case '/species-id': return 'Species';
      case '/weather': return 'Weather';
      case '/ai-chat': return 'AI';
      case '/chatroom': return 'Chat';
      case '/contact': return 'Contact';
      case '/about': return 'About';
      case '/privacy': return 'Privacy';
      default: return label;
    }
  };
  
  return (
    <motion.nav 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "navigation-bar fixed bottom-0 left-0 right-0 z-50 lg:hidden w-full",
        theme === "light" 
          ? "bg-white/90 backdrop-blur-xl border-t border-gray-200 shadow-lg" 
          : "bg-gray-900/80 backdrop-blur-xl border-t border-gray-800 shadow-lg"
      )}
    >
      <div className="grid grid-cols-5 w-full px-1">
        {mobileItems.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.path;
          const mobileLabel = getMobileLabel(item.path, item.label);
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center py-2 px-1 relative"
            >
              {/* Top indicator bar - no animation */}
              <div 
                className={cn(
                  "absolute top-0 h-1 rounded-b-md transition-all duration-300",
                  isActive 
                    ? theme === "light"
                      ? "bg-ocean-blue w-8 opacity-100"
                      : "bg-primary w-8 opacity-100"
                    : "w-0 opacity-0"
                )}
              />
              
              {/* Icon container */}
              <div 
                className={cn(
                  "rounded-full p-1.5 transition-all duration-300",
                  isActive
                    ? theme === "light" 
                      ? "bg-ocean-light/20" 
                      : "bg-primary/20"
                    : "bg-transparent"
                )}
              >
                <item.icon 
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive
                      ? theme === "light" 
                        ? "text-ocean-blue" 
                        : "text-primary"
                      : "text-gray-400"
                  )} 
                />
              </div>
              
              {/* Label */}
              <span 
                className={cn(
                  "text-[10px] mt-0.5 truncate transition-colors",
                  isActive
                    ? theme === "light" 
                      ? "text-ocean-blue" 
                      : "text-primary"
                    : "text-gray-400"
                )}
              >
                {mobileLabel}
              </span>
              
              {/* Simple dot indicator instead of animated effects */}
              {isActive && (
                <div 
                  className={cn(
                    "w-1 h-1 rounded-full mt-1",
                    theme === "light" 
                      ? "bg-ocean-blue" 
                      : "bg-primary"
                  )}
                />
              )}
            </NavLink>
          );
        })}
      </div>
    </motion.nav>
  );
}

export default MobileNav;
