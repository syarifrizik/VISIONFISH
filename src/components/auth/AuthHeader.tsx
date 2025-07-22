
import { ArrowLeft, Home, Fish, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const AuthHeader = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const navItems = [
    { path: '/', label: 'Beranda', icon: Home },
    { path: '/fish-analysis', label: 'Analisis', icon: null },
    { path: '/species-id', label: 'Spesies', icon: null },
    { path: '/weather', label: 'Cuaca', icon: null },
    { path: '/ai-iot', label: 'AI&IoT', icon: null },
    { path: '/chatroom', label: 'Chat', icon: null },
    { path: '/premium', label: 'Premium', icon: null },
  ];

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b"
      style={{
        background: isDark 
          ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.7) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.7) 100%)',
        borderColor: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)'
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                isDark 
                  ? "bg-gradient-to-br from-purple-500/20 to-cyan-500/20 group-hover:from-purple-500/30 group-hover:to-cyan-500/30" 
                  : "bg-gradient-to-br from-purple-500/10 to-cyan-500/10 group-hover:from-purple-500/20 group-hover:to-cyan-500/20"
              )}>
                <Fish className={cn(
                  "w-6 h-6 transition-colors duration-300",
                  isDark ? "text-purple-400" : "text-purple-600"
                )} />
              </div>
              <span className={cn(
                "text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                isDark 
                  ? "from-purple-400 to-cyan-400" 
                  : "from-purple-600 to-cyan-600"
              )}>
                VisionFish.io
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105",
                    isDark
                      ? "text-slate-300 hover:text-white hover:bg-white/10"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Breadcrumb - Hidden on mobile */}
            <div className="hidden md:block">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/" className={cn(
                        "flex items-center gap-1 transition-colors",
                        isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                      )}>
                        <Home className="h-3 w-3" />
                        Beranda
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className={isDark ? "text-slate-600" : "text-slate-400"} />
                  <BreadcrumbItem>
                    <BreadcrumbPage className={isDark ? "text-purple-400" : "text-purple-600"}>
                      Autentikasi
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className={cn(
                "w-10 h-10 rounded-xl transition-all duration-300 hover:scale-110",
                isDark
                  ? "hover:bg-white/10 text-slate-300 hover:text-white"
                  : "hover:bg-slate-100/50 text-slate-600 hover:text-slate-900"
              )}
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Back Button */}
            <Link to="/">
              <Button 
                variant="ghost" 
                size="sm"
                className={cn(
                  "flex items-center gap-2 px-3 h-10 rounded-xl transition-all duration-300 hover:scale-105",
                  isDark
                    ? "text-slate-300 hover:text-white hover:bg-white/10"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                )}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Kembali</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
