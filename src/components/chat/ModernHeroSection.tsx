
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Crown, 
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '@/services/chatroomService';

interface ModernHeroSectionProps {
  totalMessages: number;
  onlineUsers: number;
  onPromoteProduct: () => void;
  onJoinChat: () => void;
  isPremium: boolean;
  recentMessages: ChatMessage[];
}

const ModernHeroSection: React.FC<ModernHeroSectionProps> = ({
  totalMessages,
  onlineUsers,
  onPromoteProduct,
  onJoinChat,
  isPremium,
  recentMessages
}) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [currentCommunityIndex, setCommunityIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  const communityTypes = ['Nelayan', 'Umum', 'Peneliti', 'Pembudidaya', 'Konsumen'];

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, []);

  // Typing effect for community types
  useEffect(() => {
    const currentCommunity = communityTypes[currentCommunityIndex];
    let charIndex = 0;
    
    setIsTyping(true);
    setCurrentText('');
    
    const typingInterval = setInterval(() => {
      if (charIndex < currentCommunity.length) {
        setCurrentText(currentCommunity.substring(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        
        // Wait before starting to delete
        setTimeout(() => {
          const deletingInterval = setInterval(() => {
            if (charIndex > 0) {
              charIndex--;
              setCurrentText(currentCommunity.substring(0, charIndex));
            } else {
              clearInterval(deletingInterval);
              setCommunityIndex((prev) => (prev + 1) % communityTypes.length);
            }
          }, 80);
        }, 2500);
      }
    }, 120);

    return () => clearInterval(typingInterval);
  }, [currentCommunityIndex]);

  // Auto-rotate recent messages
  useEffect(() => {
    if (recentMessages.length > 1) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % recentMessages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [recentMessages.length]);

  const currentMessage = recentMessages[currentMessageIndex];

  const stats = [
    { 
      icon: MessageSquare, 
      value: totalMessages.toLocaleString(), 
      label: 'Total Pesan',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    { 
      icon: Users, 
      value: onlineUsers.toLocaleString(), 
      label: 'Pengguna Aktif',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    { 
      icon: TrendingUp, 
      value: '24/7', 
      label: 'Selalu Aktif',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    { 
      icon: Crown, 
      value: '4.9★', 
      label: 'Rating Komunitas',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
  ];

  return (
    <div className={`relative overflow-hidden ${
      theme === 'light' 
        ? 'bg-gradient-to-br from-purple-100 via-purple-50 to-white' 
        : 'bg-gradient-to-br from-purple-900 via-purple-800 to-gray-900'
    }`}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20 ${
          theme === 'light' ? 'bg-purple-400' : 'bg-purple-500'
        }`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20 ${
          theme === 'light' ? 'bg-blue-400' : 'bg-blue-500'
        }`} />
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 rounded-full ${
                theme === 'light' ? 'bg-purple-300/30' : 'bg-purple-400/20'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        <div className="text-center space-y-8">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Badge className={`${
                theme === 'light' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-500 text-white'
              } px-4 py-1`}>
                <Sparkles className="h-4 w-4 mr-2" />
                Community Chat
              </Badge>
            </div>
            
            <h1 className={`text-4xl md:text-6xl font-bold leading-tight`}>
              <span className={`${
                theme === 'light' 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800' 
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-100'
              }`}>
                Terhubung dengan
              </span>
              <br />
              <span className="relative">
                <span className={`${
                  theme === 'light' 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800' 
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-purple-100'
                }`}>
                  Komunitas{' '}
                </span>
                <span className={`inline-block font-mono ${
                  theme === 'light' 
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-blue-500' 
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400'
                }`}>
                  {currentText}
                  <span 
                    className={`ml-1 ${
                      theme === 'light' ? 'text-violet-500' : 'text-violet-400'
                    } ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}
                  >
                    |
                  </span>
                </span>
                <motion.div
                  className={`absolute -bottom-2 left-0 right-0 h-1 ${
                    theme === 'light' ? 'bg-purple-300' : 'bg-purple-500'
                  } rounded-full`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </span>
            </h1>
            
            <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${
              theme === 'light' ? 'text-purple-700' : 'text-purple-300'
            }`}>
              Bergabunglah dalam diskusi real-time dengan nelayan dari seluruh Indonesia. 
              Berbagi pengalaman, tips, dan temukan peluang bisnis baru.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`grid ${
              isMobile ? 'grid-cols-2' : 'grid-cols-4'
            } gap-4 max-w-4xl mx-auto`}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`p-4 rounded-2xl ${
                  theme === 'light' 
                    ? 'bg-white/80 backdrop-blur-sm border border-purple-200' 
                    : 'bg-purple-900/50 backdrop-blur-sm border border-purple-700/50'
                } transition-all duration-300 hover:shadow-lg`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.bgColor} mb-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className={`text-2xl font-bold ${
                  theme === 'light' ? 'text-purple-900' : 'text-purple-100'
                }`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${
                  theme === 'light' ? 'text-purple-600' : 'text-purple-400'
                }`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Recent Message Preview */}
          {currentMessage && (
            <motion.div
              key={currentMessageIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5 }}
              className={`max-w-2xl mx-auto p-6 rounded-2xl ${
                theme === 'light' 
                  ? 'bg-white/90 border border-purple-200' 
                  : 'bg-purple-900/60 border border-purple-700/50'
              } backdrop-blur-sm`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-2 h-2 rounded-full bg-green-400 animate-pulse`} />
                <span className={`text-sm font-medium ${
                  theme === 'light' ? 'text-purple-700' : 'text-purple-300'
                }`}>
                  Pesan Terbaru dari {currentMessage.profile?.display_name || 'Komunitas'}
                </span>
              </div>
              <p className={`text-left ${
                theme === 'light' ? 'text-purple-800' : 'text-purple-200'
              }`}>
                "{currentMessage.content.substring(0, 120)}..."
              </p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Button
              onClick={onJoinChat}
              size="lg"
              className={`px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-xl shadow-purple-500/30'
                  : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-xl shadow-purple-500/40'
              } hover:scale-105 hover:shadow-2xl`}
            >
              <MessageSquare className="h-5 w-5 mr-3" />
              Mulai Ngobrol
              <ArrowRight className="h-5 w-5 ml-3" />
            </Button>
            
            <Button
              onClick={onPromoteProduct}
              variant="outline"
              size="lg"
              className={`px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 ${
                theme === 'light'
                  ? 'border-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400'
                  : 'border-2 border-purple-600 text-purple-300 hover:bg-purple-900/50 hover:border-purple-500'
              } hover:scale-105 backdrop-blur-sm`}
            >
              {!isPremium && <Crown className="h-5 w-5 mr-3 text-yellow-500" />}
              <Zap className="h-5 w-5 mr-3" />
              Promosikan Produk
            </Button>
          </motion.div>

          {/* Premium Badge */}
          {isPremium && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-medium"
            >
              <Crown className="h-4 w-4" />
              <span>Premium Member</span>
              <Sparkles className="h-4 w-4" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernHeroSection;
