
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Pin, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  content: string;
  timestamp: Date;
  isPinned: boolean;
  replyTo?: string;
  replyToMessage?: Message;
  isOnline?: boolean;
}

interface PinnedMessagesProps {
  messages: Message[];
  onUnpin: (messageId: string) => void;
  currentUserIsAdmin: boolean;
}

const PinnedMessages: React.FC<PinnedMessagesProps> = ({ 
  messages, 
  onUnpin,
  currentUserIsAdmin
}) => {
  const { theme } = useTheme();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  if (messages.length === 0) {
    return null;
  }

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className={`relative ${theme === 'light' ? 'bg-blue-50/80 backdrop-blur-lg border-b border-blue-100' : 'bg-primary/5 backdrop-blur-lg border-b border-primary/10'}`}>
      <div className="flex items-center px-3 py-2">
        <Pin className={`h-4 w-4 mr-1 ${theme === 'light' ? 'text-blue-600' : 'text-primary'}`} />
        <span className="text-sm font-medium">Pesan Tersemat</span>
        <span className="ml-2 text-xs text-muted-foreground">
          {messages.length > 1 ? `${messages.length} pesan` : '1 pesan'}
        </span>
      </div>

      <div className="relative">
        {showLeftArrow && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 h-6 w-6 rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        <div 
          ref={scrollContainerRef} 
          className="flex overflow-x-auto pb-3 px-3 space-x-3 no-scrollbar"
          onScroll={handleScroll}
        >
          {messages.map((msg) => (
            <motion.div
              key={`pinned-${msg.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`min-w-[250px] max-w-[300px] p-3 rounded-lg flex-shrink-0 ${
                theme === 'light' 
                  ? 'bg-white border border-blue-100 shadow-sm' 
                  : 'bg-gray-800/60 border border-primary/20 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center">
                  <Pin className={`h-3.5 w-3.5 mr-1 ${theme === 'light' ? 'text-blue-600' : 'text-primary'}`} />
                  <span className={`text-xs font-medium ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
                    {msg.userName}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-muted-foreground mr-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {currentUserIsAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 hover:bg-background/80 -mt-1 -mr-1"
                      onClick={() => onUnpin(msg.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-sm line-clamp-3 break-words">{msg.content}</p>
            </motion.div>
          ))}
        </div>

        {showRightArrow && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 h-6 w-6 rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
            onClick={scrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default PinnedMessages;
