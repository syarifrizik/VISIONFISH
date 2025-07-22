
import { ReactNode, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Home, Activity, Fish, CloudRain, MessageCircle, Crown, Settings, Users, Mail, FileText, Layers } from 'lucide-react';
import { DesktopNav } from '@/components/navigation/DesktopNav';
import { MobileMenu } from '@/components/navigation/MobileMenu';
import { NavbarFooter } from '@/components/navigation/NavbarFooter';
import { ThemeToggleMobile } from '@/components/navigation/ThemeToggleMobile';
import { Footer } from '@/components/Footer';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { MainContent } from '@/components/MainContent';
import ConstrainedOceanAnimations from '@/components/ocean/ConstrainedOceanAnimations';
import AdminAccessButton from '@/components/premium/AdminAccessButton';
import { useTheme } from '@/hooks/use-theme';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { useIsMobile } from '@/hooks/use-mobile';
import { NavItem } from '@/types/navigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { usageCount } = useUsageTracking();
  const { isLoggedIn, isPremium, handleLogin, handleLogout, refreshPremiumStatus } = useAuth();
  const { activeNotifications, showNotification, dismissNotification } = useNotifications();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prevPath, setPrevPath] = useState(location.pathname);
  const [hasShownPremiumNotification, setHasShownPremiumNotification] = useState(false);

  // Navigation items for top navbar
  const navItems: NavItem[] = [
    { path: '/', label: 'Beranda', icon: Home },
    { path: '/fish-analysis', label: 'Analisis', icon: Activity },
    { path: '/species-id', label: 'Spesies', icon: Fish },
    { path: '/weather', label: 'Cuaca', icon: CloudRain },
    { path: '/ai-iot', label: 'Ai&IoT', icon: Layers },
    { path: '/chatroom', label: 'Chatroom', icon: MessageCircle },
    { path: '/premium', label: 'Premium', icon: Crown, desktopOnly: true },
    ...(isLoggedIn ? [{ path: '/settings', label: 'Pengaturan', icon: Settings }] : []),
  ];
  
  // All navigation items including those for mobile menu
  const allNavItems: NavItem[] = [
    ...navItems,
    { path: '/about', label: 'About Us', icon: Users, mobileOnly: true },
    { path: '/contact', label: 'Contact', icon: Mail, mobileOnly: true },
    { path: '/privacy', label: 'Privacy', icon: FileText, mobileOnly: true },
  ];

  // Determine animation intensity based on current page
  const getAnimationIntensity = () => {
    if (location.pathname === '/auth') return 'minimal';
    if (location.pathname === '/' || 
        location.pathname === '/profile' || 
        location.pathname.startsWith('/user/')) return 'normal';
    return 'minimal';
  };

  // Memoize the notification function to prevent infinite loops
  const showPremiumNotification = useCallback(() => {
    if (usageCount === 3 && !hasShownPremiumNotification) {
      showNotification("Unlock premium features for the best experience!", "info");
      setHasShownPremiumNotification(true);
    }
  }, [usageCount, hasShownPremiumNotification, showNotification]);

  useEffect(() => {
    // Show premium notification at certain usage count
    showPremiumNotification();
    
    // Set previous path for transition effects
    setPrevPath(location.pathname);
    
    // Refresh premium status when navigating to premium features pages
    if (isLoggedIn && ['/fish-analysis', '/species-id', '/weather', '/ai-iot'].includes(location.pathname)) {
      refreshPremiumStatus();
    }
  }, [location.pathname, showPremiumNotification, isLoggedIn, refreshPremiumStatus]);

  // Helper function to check if path is active
  const isActive = (path: string) => location.pathname === path;

  // Handler for login button with sample email/password
  const handleLoginClick = async () => {
    // In a real app, you would get these values from a form
    const email = "user@example.com"; 
    const password = "password123";
    
    try {
      const result = await handleLogin(email, password);
      if (result.success) {
        showNotification(result.message, "success", 3000);
      } else {
        showNotification(result.message, "error", 3000);
      }
    } catch (error) {
      showNotification("Login error occurred", "error", 3000);
    }
  };

  // Handler for logout button
  const handleLogoutClick = async () => {
    try {
      const result = await handleLogout();
      if (result.success) {
        showNotification(result.message, "info", 3000);
      } else {
        showNotification(result.message, "error", 3000);
      }
    } catch (error) {
      showNotification("Logout error occurred", "error", 3000);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-poppins relative ${isMobile ? 'mobile-constrained mobile-optimized' : ''}`}>
      {/* Constrained Ocean Animations - Better Mobile Performance */}
      <ConstrainedOceanAnimations 
        intensity={getAnimationIntensity()}
        enableAnimations={location.pathname !== '/auth'}
      />
      
      <DesktopNav
        navItems={navItems}
        isLoggedIn={isLoggedIn}
        isPremium={isPremium}
        theme={theme}
        setTheme={setTheme}
        handleLogin={handleLoginClick}
        handleLogout={handleLogoutClick}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <MobileMenu
        mobileMenuOpen={mobileMenuOpen}
        navItems={allNavItems}
        isActive={isActive}
        theme={theme}
        isLoggedIn={isLoggedIn}
        isPremium={isPremium}
        handleLogin={handleLoginClick}
        handleLogout={handleLogoutClick}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <MainContent children={children} prevPath={prevPath} navItems={navItems} />

      {/* Admin Access Button - Only show if user is logged in */}
      {isLoggedIn && <AdminAccessButton />}

      {/* Theme Toggle - Mobile Only */}
      <ThemeToggleMobile />

      {/* Bottom Mobile Navigation */}
      <NavbarFooter navItems={navItems} />

      {/* Footer - Desktop Only, Sticky at Bottom */}
      <Footer />

      {/* Custom Toast Notifications */}
      <NotificationCenter 
        notifications={activeNotifications}
        dismissNotification={dismissNotification}
      />
    </div>
  );
};

export default Layout;
