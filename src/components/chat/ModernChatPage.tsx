
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, MoreVertical, Phone, Video, Image, Smile, Heart, ThumbsUp, Fish, Zap } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  message_status: 'sent' | 'delivered' | 'read';
  reactions?: any;
}

interface ChatPartner {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  is_online: boolean;
  fish_caught?: number;
}

const QUICK_REACTIONS = ['❤️', '👍', '😂', '😮', '🎣', '🐟'];

const ModernChatPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatPartner, setChatPartner] = useState<ChatPartner | null>(null);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (userId) {
      loadChatPartner();
      loadMessages();
      setupRealtimeSubscription();
    }

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [userId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatPartner = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url, is_online, fish_caught')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setChatPartner(data);
    } catch (error) {
      console.error('Error loading chat partner:', error);
      toast({
        title: "Error",
        description: "Gagal memuat data pengguna",
        variant: "destructive"
      });
    }
  };

  const loadMessages = async () => {
    if (!user?.id || !userId) return;

    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      const typedMessages = (data || []).map(msg => ({
        ...msg,
        message_status: (msg.message_status as 'sent' | 'delivered' | 'read') || 'sent'
      }));
      setMessages(typedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user?.id || !userId) return;

    const channel = supabase
      .channel(`chat_${user.id}_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `or(and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id}))`
        },
        (payload) => {
          const newMessage: ChatMessage = {
            id: payload.new.id,
            sender_id: payload.new.sender_id,
            receiver_id: payload.new.receiver_id,
            content: payload.new.content,
            created_at: payload.new.created_at,
            message_status: (payload.new.message_status as 'sent' | 'delivered' | 'read') || 'sent',
            reactions: payload.new.reactions
          };
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    channelRef.current = channel;
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user?.id || !userId || sending) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: user.id,
          receiver_id: userId,
          content: newMessage.trim(),
          message_status: 'sent'
        });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Gagal mengirim pesan",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const addReaction = async (messageId: string, emoji: string) => {
    if (!user?.id) return;

    try {
      await supabase
        .from('message_reactions')
        .insert({
          message_id: messageId,
          user_id: user.id,
          reaction_emoji: emoji
        });
      
      setShowReactions(null);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTyping = () => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  };

  if (!chatPartner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-blue-950 dark:to-cyan-950 flex items-center justify-center">
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-500 rounded-full mx-auto animate-spin" />
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Memuat Chat...</h3>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-blue-950 dark:to-cyan-950">
      <div className="container mx-auto max-w-4xl h-screen flex flex-col">
        {/* Glassmorphism Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-blue-50/40 dark:from-slate-800/40 dark:to-blue-900/40 backdrop-blur-2xl rounded-b-3xl" />
          <div className="relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-2xl border-b border-white/20 dark:border-slate-700/20 p-6 rounded-b-3xl shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/chat')}
                  className="text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-slate-700/30 rounded-xl"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                
                <div className="relative">
                  <Avatar className="w-12 h-12 ring-2 ring-white/50 dark:ring-slate-600/50 shadow-lg">
                    <AvatarImage src={chatPartner.avatar_url} alt={chatPartner.display_name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold">
                      {chatPartner.display_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {chatPartner.is_online && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-slate-800"
                    />
                  )}
                </div>
                
                <div>
                  <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-lg">
                    {chatPartner.display_name}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span>{chatPartner.is_online ? 'Online' : 'Offline'}</span>
                    {chatPartner.fish_caught && (
                      <>
                        <span>•</span>
                        <Fish className="w-3 h-3" />
                        <span>{chatPartner.fish_caught} tangkapan</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-slate-700/30 rounded-xl">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-slate-700/30 rounded-xl">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-slate-700/30 rounded-xl">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => {
              const isOwnMessage = message.sender_id === user?.id;
              const showAvatar = index === messages.length - 1 || messages[index + 1]?.sender_id !== message.sender_id;
              
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ type: "spring", bounce: 0.3 }}
                  className={`flex items-end gap-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  {!isOwnMessage && showAvatar && (
                    <Avatar className="w-8 h-8 ring-1 ring-white/30 dark:ring-slate-600/30">
                      <AvatarImage src={chatPartner.avatar_url} alt={chatPartner.display_name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-cyan-400 text-white text-xs">
                        {chatPartner.display_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`group relative max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`relative px-4 py-3 rounded-3xl shadow-lg backdrop-blur-xl ${
                        isOwnMessage
                          ? 'bg-gradient-to-r from-blue-500/90 to-cyan-500/90 text-white rounded-br-lg ml-4'
                          : 'bg-white/70 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 rounded-bl-lg mr-4'
                      }`}
                      onDoubleClick={() => setShowReactions(message.id)}
                    >
                      <p className="text-sm leading-relaxed break-words">{message.content}</p>
                      <div className={`flex items-center gap-2 mt-2 text-xs ${
                        isOwnMessage ? 'text-white/70 justify-end' : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        <span>
                          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true, locale: idLocale })}
                        </span>
                        {isOwnMessage && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`w-2 h-2 rounded-full ${
                              message.message_status === 'read' ? 'bg-green-400' :
                              message.message_status === 'delivered' ? 'bg-blue-400' : 'bg-slate-400'
                            }`}
                          />
                        )}
                      </div>
                    </motion.div>

                    {/* Quick Reactions */}
                    <AnimatePresence>
                      {showReactions === message.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 10 }}
                          className={`absolute ${isOwnMessage ? 'right-0' : 'left-0'} top-full mt-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-2 shadow-2xl border border-white/20 dark:border-slate-700/20 z-10`}
                        >
                          <div className="flex gap-1">
                            {QUICK_REACTIONS.map((emoji, idx) => (
                              <motion.button
                                key={emoji}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => addReaction(message.id, emoji)}
                                className="w-8 h-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-lg transition-colors"
                              >
                                {emoji}
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-end gap-3"
              >
                <Avatar className="w-8 h-8 ring-1 ring-white/30 dark:ring-slate-600/30">
                  <AvatarImage src={chatPartner.avatar_url} alt={chatPartner.display_name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-cyan-400 text-white text-xs">
                    {chatPartner.display_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl rounded-bl-lg px-4 py-3 shadow-lg">
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        className="w-2 h-2 bg-slate-400 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>

        {/* Modern Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-blue-50/40 dark:from-slate-800/40 dark:to-blue-900/40 backdrop-blur-2xl rounded-t-3xl" />
          <div className="relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-2xl border-t border-white/20 dark:border-slate-700/20 p-6 rounded-t-3xl shadow-xl">
            <div className="flex items-end gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-slate-700/30 rounded-xl p-2"
              >
                <Image className="w-5 h-5" />
              </Button>
              
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Ketik pesan Anda..."
                  className="bg-white/60 dark:bg-slate-900/60 border-white/30 dark:border-slate-600/30 focus:border-blue-400 dark:focus:border-blue-500 rounded-2xl py-3 px-4 backdrop-blur-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                  disabled={sending}
                />
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-slate-700/30 rounded-xl"
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
              
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim() || sending}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl px-6 py-3 shadow-lg disabled:opacity-50 transition-all duration-300 hover:scale-105"
              >
                {sending ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernChatPage;
