
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Calendar,
  Clock,
  Eye,
  ThumbsUp,
  MessageSquare,
  Copy,
  ExternalLink
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { ChatMessage } from '@/services/chatroomService';

interface ChatMessageDetailProps {
  message: ChatMessage | null;
  isOpen: boolean;
  onClose: () => void;
  onReply?: (message: ChatMessage) => void;
  onPin?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  isPremium: boolean;
  currentUserId?: string;
}

const ChatMessageDetail: React.FC<ChatMessageDetailProps> = ({
  message,
  isOpen,
  onClose,
  onReply,
  onPin,
  onDelete,
  isPremium,
  currentUserId
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  if (!isOpen || !message) return null;

  const isOwnMessage = message.user_id === currentUserId;
  const messageContent: string = message.content || '';
  
  // Enhanced message analysis with proper typing
  const containsUrl = messageContent.includes('http');
  const urlMatches = messageContent.match(/https?:\/\/[^\s]+/g);
  const urls = urlMatches || [];
  
  const containsEmoji = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(messageContent);
  const wordCount = messageContent.trim().split(/\s+/).length;
  
  const formatMessageTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: id
      });
    } catch {
      return 'Waktu tidak valid';
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(messageContent);
  };

  const shareMessage = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Pesan dari VisionFish',
        text: messageContent,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        <Card className="border-0 shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Detail Pesan</CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Sender Info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src={message.profile?.avatar_url} 
                  alt={message.profile?.display_name || 'User'} 
                />
                <AvatarFallback className="bg-visionfish-neon-blue text-white">
                  {(message.profile?.display_name || 'U')[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">
                  {message.profile?.display_name || 'Pengguna'}
                </p>
                <p className="text-sm text-muted-foreground">
                  @{message.profile?.username || 'unknown'}
                </p>
              </div>
              {isOwnMessage && (
                <Badge variant="secondary" className="text-xs">
                  Pesan Anda
                </Badge>
              )}
            </div>

            <Separator />

            {/* Message Content */}
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <ScrollArea className="max-h-48">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {messageContent}
                  </p>
                </ScrollArea>
              </div>

              {/* Image if present */}
              {message.image_url && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Gambar:</p>
                  <img 
                    src={message.image_url} 
                    alt="Message attachment" 
                    className="w-full max-w-md rounded-lg shadow-sm"
                  />
                </div>
              )}

              {/* URLs if present */}
              {urls.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Link dalam pesan:
                  </p>
                  {urls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/20 rounded">
                      <span className="text-xs text-muted-foreground truncate flex-1">
                        {url}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(url, '_blank')}
                        className="text-xs"
                      >
                        Buka
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Message Analytics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <div className="text-sm font-medium">{wordCount}</div>
                <div className="text-xs text-muted-foreground">Kata</div>
              </div>
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <div className="text-sm font-medium">{messageContent.length}</div>
                <div className="text-xs text-muted-foreground">Karakter</div>
              </div>
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <div className="text-sm font-medium">{containsEmoji ? 'Ya' : 'Tidak'}</div>
                <div className="text-xs text-muted-foreground">Emoji</div>
              </div>
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <div className="text-sm font-medium">{urls.length}</div>
                <div className="text-xs text-muted-foreground">Link</div>
              </div>
            </div>

            <Separator />

            {/* Message Metadata */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Dikirim: {formatMessageTime(message.created_at)}</span>
              </div>
              
              {message.updated_at && message.updated_at !== message.created_at && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Diedit: {formatMessageTime(message.updated_at)}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Eye className="w-4 h-4" />
                <Badge variant="default" className="text-xs">
                  {message.message_type === 'promotion' ? 'Promosi' : 
                   message.message_type === 'question' ? 'Pertanyaan' :
                   message.message_type === 'news' ? 'Berita' : 'Umum'}
                </Badge>
              </div>

              {message.is_pinned && (
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="text-xs">
                    📌 Pesan Disematkan
                  </Badge>
                </div>
              )}
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? 'text-red-500 border-red-200' : ''}
              >
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {message.likes_count || 0} Suka
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={isBookmarked ? 'text-blue-500 border-blue-200' : ''}
              >
                <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                {isBookmarked ? 'Tersimpan' : 'Simpan'}
              </Button>

              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="w-4 h-4 mr-2" />
                Salin
              </Button>

              <Button variant="outline" size="sm" onClick={shareMessage}>
                <Share2 className="w-4 h-4 mr-2" />
                Bagikan
              </Button>

              {onReply && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onReply(message)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Balas
                </Button>
              )}

              {isPremium && onPin && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onPin(message.id)}
                >
                  📌 {message.is_pinned ? 'Lepas Pin' : 'Pin'}
                </Button>
              )}

              {isOwnMessage && onDelete && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => onDelete(message.id)}
                >
                  <MoreHorizontal className="w-4 h-4 mr-2" />
                  Hapus
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ChatMessageDetail;
