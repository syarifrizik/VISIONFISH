
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Reply, Pin, Trash2, Crown, AlertTriangle, Heart, MessageCircleQuestion, Newspaper, Megaphone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { useTheme } from '@/hooks/use-theme';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

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
  messageType?: 'question' | 'news' | 'promotion' | 'general';
  likesCount?: number;
  isLikedByUser?: boolean;
  imageUrl?: string;
}

interface ChatMessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  currentUserIsAdmin: boolean;
  isPremium?: boolean;
  onReply: (message: Message) => void;
  onTogglePin: (messageId: string) => void;
  onDelete: (messageId: string) => void;
  onLike: (messageId: string) => void;
}

const getMessageTypeIcon = (type: string) => {
  switch (type) {
    case 'question':
      return <MessageCircleQuestion className="h-4 w-4 text-blue-500" />;
    case 'news':
      return <Newspaper className="h-4 w-4 text-green-500" />;
    case 'promotion':
      return <Megaphone className="h-4 w-4 text-orange-500" />;
    default:
      return null;
  }
};

const getMessageTypeLabel = (type: string) => {
  switch (type) {
    case 'question':
      return 'Pertanyaan';
    case 'news':
      return 'Berita';
    case 'promotion':
      return 'Promosi';
    default:
      return '';
  }
};

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  isCurrentUser,
  currentUserIsAdmin,
  isPremium = false,
  onReply,
  onTogglePin,
  onDelete,
  onLike
}) => {
  const { theme } = useTheme();
  const [imageError, setImageError] = useState(false);

  const handleReply = () => {
    if (!isPremium) {
      toast.error("Fitur Premium", {
        description: "Fitur reply hanya tersedia untuk pengguna premium. Upgrade akun Anda untuk menggunakan fitur ini.",
      });
      return;
    }
    onReply(message);
  };

  const handlePin = () => {
    if (!isCurrentUser) {
      toast.error("Akses Ditolak", {
        description: "Anda hanya dapat mengpin/unpin pesan Anda sendiri.",
      });
      return;
    }
    
    if (!isPremium) {
      toast.error("Fitur Premium", {
        description: "Fitur pin pesan hanya tersedia untuk pengguna premium.",
      });
      return;
    }
    onTogglePin(message.id);
  };

  const handleDelete = () => {
    if (!isCurrentUser) {
      toast.error("Akses Ditolak", {
        description: "Anda hanya dapat menghapus pesan Anda sendiri.",
      });
      return;
    }
    onDelete(message.id);
  };

  const handleLike = () => {
    onLike(message.id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3 group`}
    >
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2 ${isCurrentUser ? 'space-x-reverse' : ''}`}>
        {!isCurrentUser && (
          <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
            <AvatarImage src={message.avatar} alt={message.userName} />
            <AvatarFallback className="text-xs md:text-sm">
              {message.userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
          {!isCurrentUser && (
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium">{message.userName}</span>
              {message.isOnline && (
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              )}
            </div>
          )}
          
          <div 
            className={`relative p-3 rounded-2xl max-w-full break-words ${
              isCurrentUser 
                ? `${theme === 'light' ? 'bg-ocean-blue text-white' : 'bg-visionfish-neon-blue text-white'} rounded-br-md`
                : `${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-700 text-gray-100'} rounded-bl-md`
            } ${message.isPinned ? 'ring-2 ring-yellow-400' : ''}`}
          >
            {message.isPinned && (
              <div className="absolute -top-2 -right-2">
                <Badge variant="secondary" className="text-xs bg-yellow-400 text-black">
                  <Pin className="h-3 w-3 mr-1" />
                  Terpin
                </Badge>
              </div>
            )}

            {/* Message Type Badge */}
            {message.messageType && message.messageType !== 'general' && (
              <div className="flex items-center mb-2">
                {getMessageTypeIcon(message.messageType)}
                <span className="text-xs font-medium ml-1">
                  {getMessageTypeLabel(message.messageType)}
                </span>
              </div>
            )}

            {/* Render image if present */}
            {message.imageUrl && (
              <div className="mb-2">
                {!imageError ? (
                  <img 
                    src={message.imageUrl}
                    alt="Uploaded image"
                    className="max-w-full h-auto rounded-lg max-h-60 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    onError={() => setImageError(true)}
                    onClick={() => window.open(message.imageUrl, '_blank')}
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center justify-center p-4 bg-gray-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-500">Gagal memuat gambar</span>
                  </div>
                )}
              </div>
            )}

            {/* Render text content */}
            <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
            
            {/* Action buttons */}
            <div className="flex items-center justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center space-x-2">
                <span className={`text-xs ${isCurrentUser ? 'text-white/70' : 'text-gray-500'}`}>
                  {formatDistanceToNow(message.timestamp, { addSuffix: true, locale: idLocale })}
                </span>
                
                {/* Like button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`h-6 px-2 text-xs ${
                    message.isLikedByUser
                      ? 'text-red-500 hover:text-red-600'
                      : isCurrentUser 
                        ? 'text-white/70 hover:text-white hover:bg-white/10' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`h-3 w-3 mr-1 ${message.isLikedByUser ? 'fill-current' : ''}`} />
                  {message.likesCount || 0}
                </Button>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-6 w-6 p-0 ${isCurrentUser ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}`}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={handleReply} className="flex items-center">
                    <Reply className="h-4 w-4 mr-2" />
                    Balas
                    {!isPremium && <Crown className="h-3 w-3 ml-auto text-yellow-500" />}
                  </DropdownMenuItem>
                  
                  {/* Pin option only for current user */}
                  {isCurrentUser && (
                    <DropdownMenuItem onClick={handlePin} className="flex items-center">
                      <Pin className="h-4 w-4 mr-2" />
                      {message.isPinned ? 'Unpin' : 'Pin'} Pesan
                      {!isPremium && <Crown className="h-3 w-3 ml-auto text-yellow-500" />}
                    </DropdownMenuItem>
                  )}
                  
                  {/* Delete option only for current user */}
                  {isCurrentUser && (
                    <DropdownMenuItem 
                      onClick={handleDelete} 
                      className="flex items-center text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Hapus
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessageBubble;
