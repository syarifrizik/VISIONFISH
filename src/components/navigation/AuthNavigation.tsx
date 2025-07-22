
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Fish, 
  Home, 
  BarChart3, 
  Database, 
  Cloud, 
  Cpu, 
  MessageCircle, 
  Crown,
  Sun,
  Moon,
  Search,
  User,
  Menu,
  X
} from 'lucide-react';

export const AuthNavigation = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Analisis', href: '/fish-analysis', icon: BarChart3 },
    { name: 'Spesies', href: '/species-id', icon: Database },
    { name: 'Cuaca', href: '/weather', icon: Cloud },
    { name: 'AI&IoT', href: '/ai-iot', icon: Cpu },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'Premium', href: '/premium', icon: Crown },
  ];

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-purple-500/20"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Fish className="w-6 h-6 text-white" />
            </div>
            <div className="hidden md:block">
              <span className="text-xl font-bold text-white">VisionFish</span>
              <span className="text-purple-400">.io</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all duration-200"
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Button */}
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-purple-500/20 hidden md:flex"
            >
              <Search className="w-4 h-4" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-gray-300 hover:text-white hover:bg-purple-500/20"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Login Button */}
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-purple-500/20 hidden md:flex"
            >
              <User className="w-4 h-4 mr-2" />
              Masuk
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white lg:hidden"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 pb-4 border-t border-purple-500/20"
          >
            <div className="grid grid-cols-2 gap-2 mt-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-2 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
