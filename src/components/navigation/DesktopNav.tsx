import React, { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, User, LogIn, LogOut, Settings, ChevronDown, UserCircle, Crown, MessageCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavItem } from "@/types/navigation";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/useProfile";
import ChatPopup from "@/components/chat/ChatPopup";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface DesktopNavProps {
  navItems: NavItem[];
  isLoggedIn: boolean;
  isPremium: boolean;
  theme: string;
  setTheme: (theme: string) => void;
  handleLogin: () => void;
  handleLogout: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const DesktopNav = ({
  navItems,
  isLoggedIn,
  isPremium,
  theme,
  setTheme,
  handleLogin,
  handleLogout,
  mobileMenuOpen,
  setMobileMenuOpen
}: DesktopNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const {
    profile
  } = useProfile();
  const {
    toast
  } = useToast();
  const {
    user
  } = useAuth();

  // Check admin status
  useEffect(() => {
    checkAdminStatus();
  }, [user]);
  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    try {
      const {
        data,
        error
      } = await supabase.from('admin_roles').select('role').eq('user_id', user.id).single();
      if (!error && data) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  // Function to handle user actions like navigating to profile or logging out
  const handleUserAction = (action: string) => {
    switch (action) {
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'premium':
        navigate('/premium');
        break;
      case 'admin':
        navigate('/admin');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
    setUserMenuOpen(false);
  };

  // Handle chat button click - always redirect to /chat
  const handleChatClick = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login terlebih dahulu untuk menggunakan fitur chat",
        className: cn("border-2 shadow-lg", theme === "dark" ? "bg-black border-purple-500 text-purple-300" : "bg-white border-purple-600 text-purple-800")
      });
      navigate('/auth');
      return;
    }
    // Always navigate to chat list page
    navigate('/chat');
  };

  // Helper function to get shorter desktop labels
  const getDesktopLabel = (path: string, label: string): string => {
    switch (path) {
      case '/species-id':
        return 'Spesies';
      case '/fish-analysis':
        return 'Analisis';
      case '/weather':
        return 'Cuaca';
      case '/chatroom':
        return 'Chat';
      case '/settings':
        return 'Setting';
      default:
        return label;
    }
  };
  return <>
      <header className={cn("sticky top-0 z-40 backdrop-blur-lg w-full", theme === "light" ? "bg-white/80 border-b border-gray-200" : "bg-black/30 border-b border-visionfish-neon-blue/30")}>
        <div className="container mx-auto flex items-center justify-between py-3 px-4 relative">
          {/* Logo Section - Fixed positioning with corrected URL and cache busting */}
          <div className="flex items-center space-x-3 flex-shrink-0 min-w-0">
            <div className="h-9 w-9 rounded-full flex items-center justify-center cursor-pointer" onClick={() => navigate('/')}>
              <img 
                alt="VisionFish Logo" 
                className="h-9 w-9 object-contain" 
                src={`https://ik.imagekit.io/biajcse64/VisionFish/VisionFish.io/VisionFish-io.png?updatedAt=1750865180351&v=${Date.now()}`}
                onError={(e) => {
                  console.error('Failed to load logo image');
                  e.currentTarget.src = "/placeholder.svg";
                }}
                loading="eager"
                fetchPriority="high"
              />
            </div>
            <h1 className={cn("text-xl font-bold cursor-pointer truncate", theme === "light" ? "text-ocean-blue" : "bg-gradient-to-r from-purple-900 via-purple-600 to-purple-400 bg-clip-text text-transparent")} onClick={() => navigate('/')}>
              Vision
              <span className={theme === "light" ? "text-ocean-teal" : "bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent"}>
                Fish
              </span>
              <span className={cn("hidden sm:inline", theme === "light" ? "text-ocean-light" : "text-white/90 opacity-90")}>.io</span>
            </h1>
          </div>

          {/* Navigation Menu - Centered with proper spacing */}
          <nav className="hidden lg:flex items-center space-x-1 flex-1 justify-center max-w-3xl">
            {/* Home button - always first */}
            <div className="relative group">
              <button onClick={() => navigate('/')} className={cn("py-2 px-3 rounded-md flex items-center space-x-2 transition-colors text-xs", isActive('/') ? theme === "light" ? "text-ocean-blue font-medium" : "text-primary font-medium" : theme === "light" ? "text-gray-700 hover:text-ocean-blue" : "text-gray-300 hover:text-primary")} aria-label="Beranda">
                {navItems[0] && React.createElement(navItems[0].icon, {
                className: cn("h-4 w-4", isActive('/') && theme === "dark" && "text-primary")
              })}
                <span className="hidden xl:inline">Beranda</span>
              </button>
              
              {/* Active indicator line */}
              <motion.div className={cn("absolute bottom-0 left-0 h-0.5 w-0 rounded-full transition-all", theme === "light" ? "bg-ocean-blue" : "bg-primary")} initial={false} animate={{
              width: isActive('/') ? "100%" : "0%"
            }} transition={{
              duration: 0.3
            }} />
            </div>

            {/* Other navigation items */}
            {navItems.map(item => {
            // Skip home (already added) and mobile-only items
            if (item.path === '/' || !item.desktopOnly && item.mobileOnly) {
              return null;
            }
            const active = isActive(item.path);
            const desktopLabel = getDesktopLabel(item.path, item.label);
            return <div key={item.path} className="relative group">
                  <button onClick={() => navigate(item.path)} className={cn("py-2 px-3 rounded-md flex items-center space-x-2 transition-colors text-xs", active ? theme === "light" ? "text-ocean-blue font-medium" : "text-primary font-medium" : theme === "light" ? "text-gray-700 hover:text-ocean-blue" : "text-gray-300 hover:text-primary")} aria-label={item.label}>
                    {React.createElement(item.icon, {
                  className: cn("h-4 w-4", active && theme === "dark" && "text-primary")
                })}
                    <span className="hidden xl:inline">
                      {desktopLabel}
                    </span>
                  </button>
                  
                  {/* Active indicator line */}
                  <motion.div className={cn("absolute bottom-0 left-0 h-0.5 w-0 rounded-full transition-all", theme === "light" ? "bg-ocean-blue" : "bg-primary")} initial={false} animate={{
                width: active ? "100%" : "0%"
              }} transition={{
                duration: 0.3
              }} />
                </div>;
          })}
          </nav>

          {/* Right Action Buttons - Fixed spacing and sizing */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Chat Button */}
            <Button variant="outline" size="icon" onClick={handleChatClick} className={cn("relative rounded-full h-9 w-9", theme === "light" ? "bg-white border-gray-300 hover:bg-gray-100" : "bg-gray-800/40 border-gray-700 hover:bg-gray-700/80")} aria-label="Chat">
              <MessageCircle className="h-4 w-4" />
            </Button>

            {/* User Menu or Login Button */}
            {isLoggedIn ? <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={cn("flex items-center gap-2 px-2 py-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10", userMenuOpen && "bg-black/10 dark:bg-white/10")}>
                    <Avatar className="h-7 w-7 border border-primary/20">
                      <AvatarImage src={profile?.avatar_url || "/lovable-uploads/ad7e6574-b234-401c-8a1c-1dbeee99cbcb.png"} alt={profile?.display_name || profile?.username || "User"} />
                      <AvatarFallback>
                        {profile?.display_name?.[0] || profile?.username?.[0] || <UserCircle className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className={cn("h-3 w-3 transition-transform hidden sm:block", userMenuOpen ? "rotate-180" : "rotate-0")} />
                    {isPremium && <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>}
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent className="w-56 mr-4" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>Akun Saya</span>
                      {isPremium && <span className="text-xs font-normal text-yellow-500">Premium</span>}
                      {isAdmin && <span className="text-xs font-normal text-red-500">Admin</span>}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => handleUserAction('profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => handleUserAction('settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Pengaturan</span>
                    </DropdownMenuItem>
                    {!isPremium && <DropdownMenuItem className="flex items-center cursor-pointer text-yellow-500" onClick={() => handleUserAction('premium')}>
                        <Crown className="mr-2 h-4 w-4" />
                        <span>Upgrade ke Premium</span>
                      </DropdownMenuItem>}
                    {isAdmin && <DropdownMenuItem className="flex items-center cursor-pointer text-red-500" onClick={() => handleUserAction('admin')}>
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center cursor-pointer text-red-500 focus:text-red-500" onClick={() => handleUserAction('logout')}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : <Button variant="outline" size="icon" onClick={() => navigate('/auth')} className={cn("relative rounded-full h-9 w-9", theme === "light" ? "bg-white border-gray-300 hover:bg-gray-100" : "bg-gray-800/40 border-gray-700 hover:bg-gray-700/80")} aria-label="Login">
                <LogIn className="h-4 w-4" />
              </Button>}
            
            {/* Theme Toggle Button */}
            <Button variant="outline" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")} className={cn("rounded-full h-9 w-9", theme === "light" ? "bg-white border-gray-300 hover:bg-gray-100" : "bg-gray-800/40 border-gray-700 hover:bg-gray-700/80")} aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}>
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-yellow-bright" />}
            </Button>

            {/* Mobile menu button - only visible on medium and smaller screens */}
            <Button variant="outline" size="icon" className={cn("lg:hidden rounded-full h-9 w-9", theme === "light" ? "bg-white border-gray-300 hover:bg-gray-100" : "bg-gray-800/40 border-gray-700 hover:bg-gray-700/80")} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                {mobileMenuOpen ? <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </> : <>
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </>}
              </svg>
            </Button>
          </div>
        </div>
      </header>
    </>;
};
