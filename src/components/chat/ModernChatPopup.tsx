import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Image, Smile, ArrowLeft, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { useNavigate } from 'react-router-dom';
import EmoteBar from './EmoteBar';
import ImageUploader from './ImageUploader';
import MessageStatusIndicator from './MessageStatusIndicator';
import MessageContextMenu from './MessageContextMenu';

interface DirectMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  media_url?: string;
  created_at: string;
  edited_at?: string;
  message_status: 'sent' | 'delivered' | 'read';
  sender_profile?: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

interface ChatUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  is_online: boolean;
}

interface ModernChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: ChatUser | null;
}

// Enhanced timezone-aware timestamp formatting function
const formatMessageTime = (timestamp?: string) => {
  if (!timestamp) return 'Baru saja';
  
  try {
    // Get user's timezone (with fallback to Asia/Jakarta for Indonesia)
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Jakarta';
    
    // Parse the UTC timestamp from Supabase
    const utcDate = new Date(timestamp + (timestamp.includes('Z') ? '' : 'Z'));
    
    // Check if date is valid
    if (isNaN(utcDate.getTime())) {
      console.warn('Invalid timestamp received:', timestamp);
      return 'Baru saja';
    }
    
    // Convert UTC to user's local timezone
    const localDate = toZonedTime(utcDate, userTimeZone);
    const now = new Date();
    
    // Calculate difference in milliseconds using proper timezone-aware dates
    const diffInMs = now.getTime() - localDate.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    
    // Handle very recent messages
    if (diffInSeconds < 30) {
      return 'Baru saja';
    }
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} detik yang lalu`;
    }
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`;
    }
    
    // For messages within the same day, show time
    const isToday = localDate.toDateString() === now.toDateString();
    if (isToday && diffInHours < 24) {
      return localDate.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: userTimeZone
      });
    }
    
    // For older messages, use relative time with proper locale
    return formatDistanceToNow(localDate, { 
      addSuffix: true, 
      locale: idLocale 
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error, 'Original timestamp:', timestamp);
    return 'Baru saja';
  }
};

// Helper function to create proper UTC timestamp for new messages
const createUTCTimestamp = (): string => {
  return new Date().toISOString();
};

const ModernChatPopup = ({ isOpen, onClose, selectedUser }: ModernChatPopupProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmoteBar, setShowEmoteBar] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && selectedUser && user) {
      loadMessages();
      setupRealtimeSubscription();
    }
    
    return () => {
      cleanupSubscription();
    };
  }, [isOpen, selectedUser, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    if (!user || !selectedUser) return;

    try {
      const { data } = await supabase
        .from('direct_messages')
        .select(`
          *,
          sender_profile:profiles!sender_id (username, display_name, avatar_url)
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (data) {
        const transformedMessages: DirectMessage[] = data.map(msg => ({
          id: msg.id,
          sender_id: msg.sender_id,
          receiver_id: msg.receiver_id,
          content: msg.content || '',
          media_url: msg.media_url,
          created_at: msg.created_at,
          message_status: (msg.message_status as 'sent' | 'delivered' | 'read') || 'sent',
          sender_profile: msg.sender_profile
        }));
        setMessages(transformedMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user || !selectedUser || channelRef.current) return;

    console.log('Setting up realtime subscription for chat...');
    
    const channel = supabase
      .channel(`chat_${user.id}_${selectedUser.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `or(and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${user.id}))`
        },
        async (payload) => {
          console.log('New message received via realtime:', payload);
          const newMessage = payload.new as any;
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, display_name, avatar_url')
            .eq('id', newMessage.sender_id)
            .single();

          const transformedMessage: DirectMessage = {
            id: newMessage.id,
            sender_id: newMessage.sender_id,
            receiver_id: newMessage.receiver_id,
            content: newMessage.content || '',
            media_url: newMessage.media_url,
            created_at: newMessage.created_at,
            message_status: (newMessage.message_status as 'sent' | 'delivered' | 'read') || 'sent',
            sender_profile: profile
          };

          setMessages(prev => {
            const messageExists = prev.some(msg => msg.id === transformedMessage.id);
            if (messageExists) {
              return prev;
            }
            return [...prev, transformedMessage];
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'direct_messages',
          filter: `or(and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${user.id}))`
        },
        (payload) => {
          console.log('Message updated via realtime:', payload);
          const updatedMessage = payload.new as any;
          
          setMessages(prev => prev.map(msg => 
            msg.id === updatedMessage.id 
              ? {
                  ...msg,
                  content: updatedMessage.content || '',
                  edited_at: updatedMessage.edited_at,
                  message_status: (updatedMessage.message_status as 'sent' | 'delivered' | 'read') || 'sent'
                }
              : msg
          ));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'direct_messages'
        },
        (payload) => {
          console.log('Message deleted via realtime:', payload);
          const deletedMessage = payload.old as any;
          
          setMessages(prev => prev.filter(msg => msg.id !== deletedMessage.id));
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    channelRef.current = channel;
  };

  const cleanupSubscription = () => {
    if (channelRef.current) {
      console.log('Cleaning up realtime subscription...');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  };

  const sendMessage = async (content?: string, imageUrl?: string) => {
    if ((!content?.trim() && !imageUrl) || !user || !selectedUser || isLoading) return;

    const messageContent = content?.trim() || '';
    const utcTimestamp = createUTCTimestamp();
    const tempId = `temp_${Date.now()}`;
    
    const optimisticMessage: DirectMessage = {
      id: tempId,
      sender_id: user.id,
      receiver_id: selectedUser.id,
      content: messageContent,
      media_url: imageUrl,
      created_at: utcTimestamp,
      message_status: 'sent',
      sender_profile: {
        username: user.user_metadata?.username || 'user',
        display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
        avatar_url: user.user_metadata?.avatar_url || ''
      }
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
    setShowEmoteBar(false);
    setShowImageUploader(false);

    setIsLoading(true);
    try {
      const messageStatus: 'sent' | 'delivered' | 'read' = selectedUser.is_online ? 'delivered' : 'sent';
      const { data, error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: user.id,
          receiver_id: selectedUser.id,
          content: messageContent,
          media_url: imageUrl,
          message_status: messageStatus
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setMessages(prev => prev.map(msg => 
          msg.id === tempId 
            ? {
                ...msg,
                id: data.id,
                created_at: data.created_at,
                message_status: (data.message_status as 'sent' | 'delivered' | 'read') || 'sent'
              }
            : msg
        ));
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(newMessage);
    }
  };

  const handleEmoteSelect = (emote: string) => {
    setNewMessage(prev => prev + emote);
    setShowEmoteBar(false);
  };

  const handleImageUpload = (imageUrl: string) => {
    sendMessage('', imageUrl);
  };

  const canEditMessage = (messageTime: string, senderId: string): boolean => {
    if (senderId !== user?.id) return false;
    
    try {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Jakarta';
      const utcDate = new Date(messageTime + (messageTime.includes('Z') ? '' : 'Z'));
      const localDate = toZonedTime(utcDate, userTimeZone);
      const now = new Date();
      const diffInMinutes = (now.getTime() - localDate.getTime()) / (1000 * 60);
      return diffInMinutes <= 15;
    } catch (error) {
      console.error('Error checking edit permission:', error);
      return false;
    }
  };

  const editMessage = async (messageId: string, newContent: string) => {
    if (!user || !newContent.trim()) return;

    try {
      const utcTimestamp = createUTCTimestamp();
      await supabase
        .from('direct_messages')
        .update({ 
          content: newContent.trim(),
          edited_at: utcTimestamp
        })
        .eq('id', messageId);
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: newContent.trim(), edited_at: utcTimestamp }
          : msg
      ));
      
      setEditingMessage(null);
      setEditContent('');
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('direct_messages')
        .delete()
        .eq('id', messageId);
      
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleMobileMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu);
    if (showMobileMenu) {
      setShowEmoteBar(false);
      setShowImageUploader(false);
    }
  };

  const handleBackToChat = () => {
    navigate('/chat');
    onClose();
  };

  if (!isOpen || !selectedUser) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        style={{ 
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(51, 65, 85, 0.95) 100%)',
          backdropFilter: 'blur(20px)' 
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(248,250,252,0.10) 100%)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Header with Ocean Gradient */}
          <div className="sticky top-0 z-50 p-4 md:p-6 flex items-center justify-between"
               style={{
                 background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.6) 0%, rgba(6, 182, 212, 0.6) 50%, rgba(16, 185, 129, 0.6) 100%)',
                 backdropFilter: 'blur(20px)',
                 borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
               }}>
            <div className="flex items-center gap-3 md:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToChat}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <Avatar className="w-10 h-10 md:w-12 md:h-12 ring-2 ring-white/50">
                <AvatarImage src={selectedUser.avatar_url} alt={selectedUser.display_name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold text-sm md:text-base">
                  {selectedUser.display_name[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white">{selectedUser.display_name}</h2>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${selectedUser.is_online ? 'bg-green-400' : 'bg-gray-400'}`} />
                  <p className="text-xs md:text-sm text-white/80">
                    {selectedUser.is_online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.map((message) => {
              const isOwnMessage = message.sender_id === user?.id;
              const canEdit = canEditMessage(message.created_at, message.sender_id);
              
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] group relative ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                    <MessageContextMenu
                      message={message}
                      canEdit={canEdit}
                      canDelete={isOwnMessage}
                      onEdit={() => {
                        setEditingMessage(message.id);
                        setEditContent(message.content);
                      }}
                      onDelete={() => deleteMessage(message.id)}
                    >
                      <div
                        className={`rounded-2xl p-3 md:p-4 ${
                          isOwnMessage
                            ? 'bg-gradient-to-r from-blue-500/80 to-cyan-500/80 text-white rounded-br-md backdrop-blur-sm'
                            : 'bg-white/20 text-white rounded-bl-md backdrop-blur-sm border border-white/30'
                        } shadow-lg`}
                      >
                        {message.media_url && (
                          <img
                            src={message.media_url}
                            alt="Shared image"
                            className="w-full max-w-xs rounded-xl mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => window.open(message.media_url, '_blank')}
                          />
                        )}
                        
                        {editingMessage === message.id ? (
                          <div className="space-y-2">
                            <Input
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="bg-white/20 border-white/30 text-white placeholder-white/70"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  editMessage(message.id, editContent);
                                }
                              }}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => editMessage(message.id, editContent)}
                                className="bg-white/20 hover:bg-white/30 text-white text-xs"
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingMessage(null);
                                  setEditContent('');
                                }}
                                className="text-white/70 hover:text-white hover:bg-white/10 text-xs"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {message.content && (
                              <p className="text-sm leading-relaxed break-words">{message.content}</p>
                            )}
                            <div className={`flex items-center justify-between mt-2 text-xs ${
                              isOwnMessage ? 'text-white/70' : 'text-white/60'
                            }`}>
                              <span>
                                {formatMessageTime(message.created_at)}
                                {message.edited_at && ' (edited)'}
                              </span>
                              {isOwnMessage && (
                                <MessageStatusIndicator 
                                  status={message.message_status} 
                                  isOnline={selectedUser.is_online}
                                />
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </MessageContextMenu>
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-20 right-4 bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-3 md:hidden z-40"
              >
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowImageUploader(!showImageUploader);
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center gap-2 text-white hover:bg-white/20 rounded-xl"
                  >
                    <Image className="w-4 h-4" />
                    <span className="text-sm">Gambar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowEmoteBar(!showEmoteBar);
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center gap-2 text-white hover:bg-white/20 rounded-xl"
                  >
                    <Smile className="w-4 h-4" />
                    <span className="text-sm">Emoji</span>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Emote Bar */}
          <AnimatePresence>
            {showEmoteBar && (
              <EmoteBar 
                onEmoteSelect={(emote) => {
                  setNewMessage(prev => prev + emote);
                  setShowEmoteBar(false);
                }}
                onClose={() => setShowEmoteBar(false)}
              />
            )}
          </AnimatePresence>

          {/* Image Uploader */}
          <AnimatePresence>
            {showImageUploader && (
              <ImageUploader
                onImageUpload={(imageUrl) => {
                  sendMessage('', imageUrl);
                  setShowImageUploader(false);
                }}
                onClose={() => setShowImageUploader(false)}
              />
            )}
          </AnimatePresence>

          {/* Input Area with Ocean Gradient */}
          <div className="sticky bottom-0 z-50 p-4 md:p-6"
               style={{
                 background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(6, 182, 212, 0.4) 50%, rgba(16, 185, 129, 0.4) 100%)',
                 backdropFilter: 'blur(20px)',
                 borderTop: '1px solid rgba(255, 255, 255, 0.2)'
               }}>
            <div className="flex items-end gap-2 md:gap-3">
              {/* Desktop Icons */}
              <div className="hidden md:flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImageUploader(!showImageUploader)}
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2"
                >
                  <Image className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmoteBar(!showEmoteBar)}
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2"
                >
                  <Smile className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ketik pesan..."
                  className="bg-white/20 border-white/30 focus:border-white/50 rounded-2xl px-4 py-3 text-sm backdrop-blur-sm text-white placeholder-white/60"
                  disabled={isLoading}
                />
                
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMobileMenuToggle}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 md:hidden"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
              
              <Button
                onClick={() => sendMessage(newMessage)}
                disabled={!newMessage.trim() || isLoading}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl px-4 py-3 shadow-lg disabled:opacity-50 min-w-[44px] h-[44px]"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModernChatPopup;
