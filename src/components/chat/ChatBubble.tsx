
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Smile, ThumbsUp, Laugh, Angry, Frown, MoreHorizontal, Edit, Copy, Reply, Trash } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface DirectMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  edited_at?: string;
  message_status: 'sent' | 'delivered' | 'read';
  reactions?: Record<string, number>;
  sender_profile?: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

interface ChatBubbleProps {
  message: DirectMessage;
  isOwnMessage: boolean;
  currentUserId: string;
  isPremium: boolean;
  onReact: (messageId: string, emoji: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
  onReply?: (message: DirectMessage) => void;
}

const reactionEmojis = ['❤️', '😊', '👍', '😂', '😢', '😡'];

const ChatBubble = ({ 
  message, 
  isOwnMessage, 
  currentUserId, 
  isPremium,
  onReact, 
  onEdit, 
  onDelete, 
  onReply 
}: ChatBubbleProps) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleReaction = (emoji: string) => {
    onReact(message.id, emoji);
    setShowReactions(false);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
    setShowOptions(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex items-end gap-2 max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {!isOwnMessage && (
          <Avatar className="w-8 h-8">
            <AvatarImage src={message.sender_profile?.avatar_url} alt={message.sender_profile?.display_name} />
            <AvatarFallback className="bg-[#6E3482] text-white text-xs">
              {message.sender_profile?.display_name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}

        {/* Message Container */}
        <div className="relative group">
          {/* Message Bubble */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`relative rounded-2xl px-4 py-3 shadow-lg ${
              isOwnMessage
                ? 'bg-gradient-to-r from-[#6E3482] to-[#A56ABD] text-white rounded-br-md'
                : 'bg-white/95 backdrop-blur-sm text-gray-800 border border-[#A56ABD]/20 rounded-bl-md'
            }`}
          >
            {/* Message Content */}
            <p className="text-sm leading-relaxed break-words">{message.content}</p>
            
            {/* Message Status & Time */}
            <div className={`flex items-center gap-2 mt-2 text-xs ${
              isOwnMessage ? 'text-white/70' : 'text-gray-500'
            }`}>
              <span>
                {formatDistanceToNow(new Date(message.created_at), { addSuffix: true, locale: idLocale })}
              </span>
              {message.edited_at && (
                <span className="italic">(diedit)</span>
              )}
              {isOwnMessage && (
                <div className="flex items-center gap-1">
                  {message.message_status === 'sent' && <div className="w-2 h-2 bg-white/50 rounded-full" />}
                  {message.message_status === 'delivered' && <div className="w-2 h-2 bg-white/70 rounded-full" />}
                  {message.message_status === 'read' && <div className="w-2 h-2 bg-green-400 rounded-full" />}
                </div>
              )}
            </div>

            {/* Premium Features - Reactions Display */}
            {isPremium && message.reactions && Object.keys(message.reactions).length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(message.reactions).map(([emoji, count]) => (
                  <motion.button
                    key={emoji}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleReaction(emoji)}
                    className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs hover:bg-white/30 transition-colors"
                  >
                    <span>{emoji}</span>
                    <span>{count}</span>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Hover Actions */}
          <div className={`absolute top-0 ${isOwnMessage ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
            <div className="flex items-center gap-1 px-2">
              {/* Quick Reactions for Premium Users */}
              {isPremium && (
                <Popover open={showReactions} onOpenChange={setShowReactions}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-[#A56ABD]/20 text-[#6E3482] hover:text-[#A56ABD]"
                    >
                      <Smile className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2 bg-white/95 backdrop-blur-sm border-[#A56ABD]/20">
                    <div className="flex gap-1">
                      {reactionEmojis.map((emoji) => (
                        <motion.button
                          key={emoji}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleReaction(emoji)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-[#A56ABD]/10 rounded-md transition-colors"
                        >
                          {emoji}
                        </motion.button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              {/* More Options */}
              <Popover open={showOptions} onOpenChange={setShowOptions}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-[#A56ABD]/20 text-[#6E3482] hover:text-[#A56ABD]"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2 bg-white/95 backdrop-blur-sm border-[#A56ABD]/20">
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReply?.(message)}
                      className="w-full justify-start text-gray-700 hover:bg-[#A56ABD]/10"
                    >
                      <Reply className="w-4 h-4 mr-2" />
                      Balas
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyMessage}
                      className="w-full justify-start text-gray-700 hover:bg-[#A56ABD]/10"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Salin
                    </Button>
                    {isOwnMessage && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit?.(message.id, message.content)}
                          className="w-full justify-start text-gray-700 hover:bg-[#A56ABD]/10"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete?.(message.id)}
                          className="w-full justify-start text-red-600 hover:bg-red-50"
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Hapus
                        </Button>
                      </>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
