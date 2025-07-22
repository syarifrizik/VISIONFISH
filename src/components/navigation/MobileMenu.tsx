
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, LogOut, User, Settings, X, Crown, Shield, UserCircle } from "lucide-react";
import { NavItem } from "@/types/navigation";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MobileMenuProps {
  mobileMenuOpen: boolean;
  navItems: NavItem[];
  isActive: (path: string) => boolean;
  theme: string;
  isLoggedIn: boolean;
  isPremium: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const MobileMenu = ({
  mobileMenuOpen,
  navItems,
  isActive,
  theme,
  isLoggedIn,
  isPremium,
  handleLogin,
  handleLogout,
  setMobileMenuOpen
}: MobileMenuProps) => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

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
      const { data, error } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      if (!error && data) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Backdrop overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sliding menu from right */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 lg:hidden",
              "backdrop-blur-xl border-l shadow-2xl",
              theme === "light"
                ? "bg-white/90 border-purple-200/50"
                : "bg-gray-900/90 border-purple-500/30"
            )}
          >
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-purple-200/30 dark:border-purple-500/20">
              <h2 className={cn(
                "text-lg font-semibold",
                theme === "light" ? "text-gray-800" : "text-white"
              )}>
                Menu
              </h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  theme === "light"
                    ? "hover:bg-purple-100/50 text-gray-600"
                    : "hover:bg-purple-800/30 text-gray-300"
                )}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex flex-col h-full overflow-y-auto">
              {/* User Profile Section */}
              {isLoggedIn && (
                <div className={cn(
                  "p-4 border-b border-purple-200/30 dark:border-purple-500/20",
                  theme === "light" ? "bg-purple-50/30" : "bg-purple-900/20"
                )}>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 border-2 border-purple-300/50 dark:border-purple-500/30">
                      <AvatarImage
                        src={profile?.avatar_url || "/lovable-uploads/ad7e6574-b234-401c-8a1c-1dbeee99cbcb.png"}
                        alt={profile?.display_name || profile?.username || "User"}
                      />
                      <AvatarFallback className="bg-purple-200 dark:bg-purple-800">
                        {profile?.display_name?.[0] || profile?.username?.[0] || <UserCircle className="h-6 w-6" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <button
                        className={cn(
                          "text-sm font-medium hover:underline block truncate text-left",
                          theme === "light" ? "text-gray-800" : "text-white"
                        )}
                        onClick={() => handleNavigation('/profile')}
                      >
                        {profile?.display_name || profile?.username || "Lihat Profil"}
                      </button>
                      <div className="flex flex-col gap-1">
                        {isPremium && (
                          <span className="text-xs text-yellow-500 font-medium flex items-center gap-1">
                            <Crown className="h-3 w-3" />
                            Premium
                          </span>
                        )}
                        {isAdmin && (
                          <span className="text-xs text-red-500 font-medium flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Admin
                          </span>
                        )}
                        {!isPremium && !isAdmin && (
                          <p className={cn(
                            "text-xs",
                            theme === "light" ? "text-gray-600" : "text-gray-400"
                          )}>
                            Pengguna Terdaftar
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Items */}
              <div className="flex-1 p-4">
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={cn(
                        "w-full flex items-center p-3 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive(item.path)
                          ? theme === "light"
                            ? "bg-purple-100/60 text-purple-700 border border-purple-200/50"
                            : "bg-purple-900/40 text-purple-300 border border-purple-500/30"
                          : theme === "light"
                            ? "text-gray-700 hover:bg-purple-50/50 hover:text-purple-600"
                            : "text-gray-300 hover:bg-purple-800/20 hover:text-purple-200"
                      )}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 mr-3 flex-shrink-0",
                        isActive(item.path) && theme === "dark" ? "text-purple-400" : ""
                      )} />
                      <span className="truncate">{item.label}</span>
                      {isActive(item.path) && (
                        <div className={cn(
                          "ml-auto w-2 h-2 rounded-full",
                          theme === "light" ? "bg-purple-500" : "bg-purple-400"
                        )} />
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Account Actions */}
              <div className={cn(
                "p-4 border-t border-purple-200/30 dark:border-purple-500/20 space-y-2",
                theme === "light" ? "bg-purple-50/20" : "bg-purple-900/10"
              )}>
                {isLoggedIn ? (
                  <>
                    {!isPremium && (
                      <button
                        onClick={() => handleNavigation('/premium')}
                        className="w-full flex items-center p-3 rounded-lg text-sm font-medium transition-colors text-yellow-500 hover:bg-yellow-50/50 dark:hover:bg-yellow-900/20"
                      >
                        <Crown className="h-5 w-5 mr-3" />
                        <span>Upgrade ke Premium</span>
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => handleNavigation('/admin')}
                        className="w-full flex items-center p-3 rounded-lg text-sm font-medium transition-colors text-red-500 hover:bg-red-50/50 dark:hover:bg-red-900/20"
                      >
                        <Shield className="h-5 w-5 mr-3" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center p-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      navigate('/auth');
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-center p-3 rounded-lg text-sm font-medium transition-colors border",
                      theme === "light"
                        ? "bg-purple-500 text-white hover:bg-purple-600 border-purple-500"
                        : "bg-purple-600 text-white hover:bg-purple-700 border-purple-600"
                    )}
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    <span>Login</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
