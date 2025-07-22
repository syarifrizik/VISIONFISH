
import { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, TrendingUp, Clock, Pin, MessageSquare, Users, Star, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { useTheme } from '@/hooks/use-theme';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '@/services/chatroomService';

interface ModernChatGridProps {
  messages: ChatMessage[];
  onMessageClick: (message: ChatMessage) => void;
  onPinMessage: (messageId: string) => void;
  onDeleteMessage?: (messageId: string) => void;
  onLikeMessage: (messageId: string) => void;
  isPremium: boolean;
  currentUserId?: string;
}

type FilterType = 'all' | 'questions' | 'news' | 'promotions' | 'pinned';
type SortType = 'recent' | 'popular' | 'trending';

const ModernChatGrid: React.FC<ModernChatGridProps> = ({
  messages,
  onMessageClick,
  onPinMessage,
  onDeleteMessage,
  onLikeMessage,
  isPremium,
  currentUserId
}) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('recent');
  const [visibleCount, setVisibleCount] = useState(isMobile ? 12 : 20);

  // Filter dan sort logic
  const filteredAndSortedMessages = useMemo(() => {
    let filtered = messages.filter(message => {
      // Search filter
      if (searchQuery && !message.content.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter - use message_type if available
      switch (activeFilter) {
        case 'questions':
          return (message as any).message_type === 'question' || message.content.includes('?');
        case 'news':
          return (message as any).message_type === 'news';
        case 'promotions':
          return (message as any).message_type === 'promotion';
        case 'pinned':
          return message.is_pinned;
        default:
          return true;
      }
    });

    // Sort logic
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0);
        case 'trending':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default: // recent
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }, [messages, searchQuery, activeFilter, sortBy]);

  const visibleMessages = filteredAndSortedMessages.slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount(prev => prev + (isMobile ? 12 : 20));
  };

  const getMessagePreview = (content: string) => {
    const maxLength = isMobile ? 80 : 120;
    // Remove legacy prefixes
    const cleanContent = content
      .replace(/^\[PROMOSI\]\s*/, '')
      .replace(/^\[BERITA\]\s*/, '')
      .replace(/^\[PERTANYAAN\]\s*/, '');
    return cleanContent.length > maxLength ? cleanContent.substring(0, maxLength) + '...' : cleanContent;
  };

  const getMessageCategory = (message: ChatMessage) => {
    const messageType = (message as any).message_type;
    
    if (messageType === 'promotion') return { label: 'Promosi', color: 'bg-orange-500' };
    if (messageType === 'news') return { label: 'Berita', color: 'bg-blue-500' };
    if (messageType === 'question') return { label: 'Pertanyaan', color: 'bg-green-500' };
    
    // Fallback to legacy content checking
    if (message.content.includes('[PROMOSI]')) return { label: 'Promosi', color: 'bg-orange-500' };
    if (message.content.includes('[BERITA]')) return { label: 'Berita', color: 'bg-blue-500' };
    if (message.content.includes('?')) return { label: 'Pertanyaan', color: 'bg-green-500' };
    
    return { label: 'Chat', color: 'bg-purple-500' };
  };

  const filterOptions = [
    { value: 'all', label: 'Semua', icon: MessageSquare },
    { value: 'questions', label: 'Pertanyaan', icon: Search },
    { value: 'news', label: 'Berita', icon: TrendingUp },
    { value: 'promotions', label: 'Promosi', icon: Star },
    { value: 'pinned', label: 'Terpin', icon: Pin },
  ];

  const sortOptions = [
    { value: 'recent', label: 'Terbaru', icon: Clock },
    { value: 'popular', label: 'Populer', icon: TrendingUp },
    { value: 'trending', label: 'Trending', icon: Star },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Sticky Search and Filter Bar */}
      <div className={`sticky top-0 z-20 ${theme === 'light' 
        ? 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200' 
        : 'bg-gradient-to-r from-purple-900/90 to-purple-800/90 border-purple-700/60'
      } backdrop-blur-lg border-b p-3 space-y-3`}>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
            theme === 'light' ? 'text-purple-600' : 'text-purple-300'
          }`} />
          <input
            type="text"
            placeholder="Cari pesan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl border-2 transition-all duration-300 ${
              theme === 'light' 
                ? 'bg-white/90 border-purple-200 focus:border-purple-400 text-purple-900 placeholder-purple-500' 
                : 'bg-purple-900/50 border-purple-700/60 focus:border-purple-500 text-purple-100 placeholder-purple-400'
            } focus:outline-none focus:ring-2 focus:ring-purple-400/30`}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto scrollbar-none space-x-2 pb-1">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={activeFilter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(option.value as FilterType)}
              className={`flex-shrink-0 h-8 px-3 text-xs font-medium transition-all duration-300 ${
                activeFilter === option.value
                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/30'
                  : theme === 'light'
                    ? 'bg-white/80 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400'
                    : 'bg-purple-800/50 border-purple-600/50 text-purple-300 hover:bg-purple-700/50 hover:border-purple-500'
              }`}
            >
              <option.icon className="h-3 w-3 mr-1.5" />
              {option.label}
            </Button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                variant={sortBy === option.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setSortBy(option.value as SortType)}
                className={`h-7 px-2 text-xs transition-all duration-300 ${
                  sortBy === option.value
                    ? 'bg-purple-600 text-white shadow-md'
                    : theme === 'light'
                      ? 'text-purple-600 hover:bg-purple-100'
                      : 'text-purple-400 hover:bg-purple-800/50'
                }`}
              >
                <option.icon className="h-3 w-3 mr-1" />
                {option.label}
              </Button>
            ))}
          </div>
          
          <div className={`text-xs ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`}>
            {filteredAndSortedMessages.length} pesan
          </div>
        </div>
      </div>

      {/* Messages Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className={`grid gap-3 ${
          isMobile 
            ? 'grid-cols-2 sm:grid-cols-3' 
            : 'grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
        }`}>
          <AnimatePresence mode="popLayout">
            {visibleMessages.map((message, index) => {
              const category = getMessageCategory(message);
              const isPromotion = (message as any).message_type === 'promotion' || message.content.includes('[PROMOSI]');
              const canDelete = message.user_id === currentUserId;
              const canPin = message.user_id === currentUserId; // Only allow pinning own messages
              
              return (
                <motion.div
                  key={message.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.02,
                    layout: { duration: 0.3 }
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onMessageClick(message)}
                  className="cursor-pointer"
                >
                  <Card className={`h-full overflow-hidden transition-all duration-300 ${
                    theme === 'light'
                      ? 'bg-white/90 hover:bg-white border-purple-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/20'
                      : 'bg-purple-900/60 hover:bg-purple-900/80 border-purple-700/60 hover:border-purple-600 hover:shadow-lg hover:shadow-purple-500/30'
                  } backdrop-blur-sm ${message.is_pinned ? 'ring-2 ring-yellow-400/50' : ''}`}>
                    
                    {/* Header */}
                    <div className={`p-2 ${
                      theme === 'light' ? 'bg-purple-50/80' : 'bg-purple-800/50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <Avatar className="h-6 w-6 flex-shrink-0">
                            <AvatarImage 
                              src={message.profile?.avatar_url} 
                              alt={message.profile?.display_name || 'User'} 
                            />
                            <AvatarFallback className="text-xs bg-purple-600 text-white">
                              {(message.profile?.display_name || 'U').charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className={`text-xs font-medium truncate ${
                            theme === 'light' ? 'text-purple-900' : 'text-purple-100'
                          }`}>
                            {message.profile?.display_name || message.profile?.username || 'User'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          {message.is_pinned && (
                            <Pin className="h-3 w-3 text-yellow-500" />
                          )}
                          {isPromotion && (
                            <Star className="h-3 w-3 text-orange-500" />
                          )}
                          {canDelete && onDeleteMessage && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteMessage(message.id);
                              }}
                              className={`p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors ${
                                theme === 'light' ? 'text-red-600' : 'text-red-400'
                              }`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${category.color} text-white`}
                      >
                        {category.label}
                      </Badge>
                    </div>

                    {/* Content */}
                    <CardContent className="p-3 pt-2">
                      <p className={`text-xs leading-relaxed mb-3 ${
                        theme === 'light' ? 'text-purple-800' : 'text-purple-200'
                      }`}>
                        {getMessagePreview(message.content)}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${
                          theme === 'light' ? 'text-purple-500' : 'text-purple-400'
                        }`}>
                          {formatDistanceToNow(new Date(message.created_at), { 
                            addSuffix: true, 
                            locale: idLocale 
                          })}
                        </span>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 px-2 text-xs ${
                            theme === 'light'
                              ? 'text-purple-600 hover:bg-purple-100'
                              : 'text-purple-400 hover:bg-purple-800/50'
                          }`}
                        >
                          Lihat
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Load More Button */}
        {visibleCount < filteredAndSortedMessages.length && (
          <motion.div 
            className="flex justify-center mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={loadMore}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/40'
              } hover:scale-105 hover:shadow-xl`}
            >
              <Users className="h-4 w-4 mr-2" />
              Muat {isMobile ? '12' : '20'} Pesan Lagi
            </Button>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredAndSortedMessages.length === 0 && (
          <motion.div 
            className="flex flex-col items-center justify-center py-16 px-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <MessageSquare className={`h-16 w-16 mb-4 ${
              theme === 'light' ? 'text-purple-400' : 'text-purple-500'
            }`} />
            <h3 className={`text-lg font-medium mb-2 ${
              theme === 'light' ? 'text-purple-900' : 'text-purple-100'
            }`}>
              Tidak ada pesan ditemukan
            </h3>
            <p className={`text-sm text-center ${
              theme === 'light' ? 'text-purple-600' : 'text-purple-400'
            }`}>
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ModernChatGrid;
