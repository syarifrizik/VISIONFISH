
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, MoreVertical, Send, Smile, ArrowLeft, Pin, Trash2, Check, CheckCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface DirectMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  message_status: 'sent' | 'delivered' | 'read';
  sender_profile?: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

interface ChatHistory {
  user_id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
  is_pinned: boolean;
}

interface ChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialUserId?: string;
}

const ChatPopup = ({ isOpen, onClose, initialUserId }: ChatPopupProps) => {
  const { user } = useAuth();
  const [view, setView] = useState<'history' | 'chat'>('history');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(initialUserId || null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);
  const isCleaningUpRef = useRef(false);

  // Initialize popup state
  useEffect(() => {
    if (isOpen && user?.id) {
      loadChatHistory();
      if (initialUserId) {
        setSelectedUserId(initialUserId);
        setView('chat');
      }
    } else if (!isOpen) {
      // Clean up when popup closes
      cleanupSubscription();
      setSelectedUserId(null);
      setView('history');
      setMessages([]);
      setNewMessage('');
    }
  }, [isOpen, user?.id, initialUserId]);

  // Main subscription management effect
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    
    const setupChat = async () => {
      if (!selectedUserId || view !== 'chat' || !user?.id || !isMounted || isCleaningUpRef.current) {
        return;
      }

      try {
        // Clean up any existing subscription first
        await cleanupSubscription();
        
        if (!isMounted) return;
        
        // Load messages
        await loadMessages(selectedUserId);
        
        if (!isMounted) return;
        
        // Add a small delay to ensure cleanup is complete
        timeoutId = setTimeout(() => {
          if (isMounted && !isCleaningUpRef.current) {
            setupRealtimeSubscription();
          }
        }, 100);
      } catch (error) {
        console.error('Error setting up chat:', error);
      }
    };

    setupChat();

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      cleanupSubscription();
    };
  }, [selectedUserId, view, user?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const cleanupSubscription = async () => {
    if (isCleaningUpRef.current) return;
    
    isCleaningUpRef.current = true;
    
    if (channelRef.current) {
      console.log('Cleaning up subscription...');
      try {
        const channel = channelRef.current;
        channelRef.current = null;
        
        // Unsubscribe from the channel
        await supabase.removeChannel(channel);
        
        // Add a small delay to ensure cleanup is complete
        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        console.warn('Error cleaning up subscription:', error);
      }
    }
    
    isCleaningUpRef.current = false;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    if (!user?.id) return;

    try {
      // Get all conversations for current user
      const { data: conversations } = await supabase
        .from('direct_messages')
        .select(`
          sender_id,
          receiver_id,
          content,
          created_at,
          sender_profile:profiles!sender_id (username, display_name, avatar_url),
          receiver_profile:profiles!receiver_id (username, display_name, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (!conversations) return;

      // Group by conversation partner
      const historyMap = new Map<string, ChatHistory>();
      
      conversations.forEach((msg: any) => {
        const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        const partnerProfile = msg.sender_id === user.id ? msg.receiver_profile : msg.sender_profile;
        
        if (!historyMap.has(partnerId)) {
          historyMap.set(partnerId, {
            user_id: partnerId,
            username: partnerProfile?.username || 'Unknown',
            display_name: partnerProfile?.display_name || 'Unknown User',
            avatar_url: partnerProfile?.avatar_url,
            last_message: msg.content,
            last_message_time: msg.created_at,
            unread_count: 0,
            is_pinned: false
          });
        }
      });

      setChatHistory(Array.from(historyMap.values()));
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const loadMessages = async (partnerId: string) => {
    if (!user?.id) return;

    try {
      const { data } = await supabase
        .from('direct_messages')
        .select(`
          *,
          sender_profile:profiles!sender_id (username, display_name, avatar_url)
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (data) {
        setMessages(data.map(msg => ({
          ...msg,
          content: msg.content || '',
          created_at: msg.created_at || '',
          message_status: (msg.message_status as 'sent' | 'delivered' | 'read') || 'sent'
        })));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user?.id || !selectedUserId || channelRef.current || isCleaningUpRef.current) {
      console.log('Skipping subscription - already exists or cleaning up');
      return;
    }

    try {
      console.log('Setting up new subscription...');
      
      // Create unique channel name
      const channelName = `dm_${user.id}_${selectedUserId}_${Date.now()}`;
      
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'direct_messages',
            filter: `or(and(sender_id.eq.${user.id},receiver_id.eq.${selectedUserId}),and(sender_id.eq.${selectedUserId},receiver_id.eq.${user.id}))`
          },
          async (payload) => {
            console.log('New message received:', payload);
            const newMessage = payload.new as any;
            
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('username, display_name, avatar_url')
                .eq('id', newMessage.sender_id)
                .single();

              setMessages(prev => [...prev, {
                ...newMessage,
                content: newMessage.content || '',
                created_at: newMessage.created_at || '',
                message_status: (newMessage.message_status as 'sent' | 'delivered' | 'read') || 'sent',
                sender_profile: profile
              }]);
            } catch (error) {
              console.error('Error fetching sender profile:', error);
              setMessages(prev => [...prev, {
                ...newMessage,
                content: newMessage.content || '',
                created_at: newMessage.created_at || '',
                message_status: (newMessage.message_status as 'sent' | 'delivered' | 'read') || 'sent'
              }]);
            }
          }
        )
        .subscribe((status) => {
          console.log('Subscription status:', status);
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to chat messages');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('Channel subscription error');
          }
        });

      channelRef.current = channel;
    } catch (error) {
      console.error('Error setting up realtime subscription:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user?.id || !selectedUserId || sending) return;

    setSending(true);
    try {
      await supabase
        .from('direct_messages')
        .insert({
          sender_id: user.id,
          receiver_id: selectedUserId,
          content: newMessage.trim(),
          message_status: 'sent'
        });
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClose = () => {
    cleanupSubscription();
    setSelectedUserId(null);
    setView('history');
    setMessages([]);
    setNewMessage('');
    onClose();
  };

  const getMessageStatusIcon = (status: string, isOwnMessage: boolean) => {
    if (!isOwnMessage) return null;
    
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const filteredHistory = chatHistory.filter(chat =>
    chat.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedUserProfile = chatHistory.find(chat => chat.user_id === selectedUserId);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[600px] overflow-hidden relative"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(246,240,250,0.95) 100%)',
              boxShadow: '0 0 30px rgba(110, 52, 130, 0.3)'
            }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {view === 'chat' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setView('history')}
                    className="text-white hover:bg-white/20 p-1"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                )}
                <h2 className="text-lg font-semibold">
                  {view === 'history' ? 'Chat' : selectedUserProfile?.display_name}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-white hover:bg-white/20 p-1"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex h-[calc(100%-64px)]">
              {/* Chat History Sidebar */}
              {view === 'history' && (
                <div className="w-full flex flex-col">
                  {/* Search */}
                  <div className="p-4 border-b border-[#A56ABD]/20">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Cari kontak..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-[#A56ABD]/30 focus:border-[#A56ABD]"
                      />
                    </div>
                  </div>

                  {/* Chat List */}
                  <div className="flex-1 overflow-y-auto">
                    {filteredHistory.map((chat) => (
                      <motion.div
                        key={chat.user_id}
                        whileHover={{ backgroundColor: 'rgba(110, 52, 130, 0.05)' }}
                        className="p-4 border-b border-gray-100 cursor-pointer flex items-center gap-3"
                        onClick={() => {
                          setSelectedUserId(chat.user_id);
                          setView('chat');
                        }}
                      >
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={chat.avatar_url} alt={chat.display_name} />
                          <AvatarFallback className="bg-[#6E3482] text-white">
                            {chat.display_name[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 truncate">
                              {chat.display_name}
                            </h3>
                            {chat.last_message_time && (
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(chat.last_message_time), { addSuffix: true, locale: idLocale })}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">{chat.last_message}</p>
                        </div>
                        {chat.unread_count > 0 && (
                          <Badge className="bg-[#A56ABD] text-white">
                            {chat.unread_count}
                          </Badge>
                        )}
                        {chat.is_pinned && (
                          <Pin className="w-4 h-4 text-[#A56ABD]" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat View */}
              {view === 'chat' && selectedUserId && (
                <div className="w-full flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((message) => {
                      const isOwnMessage = message.sender_id === user?.id;
                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                            <div
                              className={`rounded-2xl px-4 py-2 ${
                                isOwnMessage
                                  ? 'bg-gradient-to-r from-[#6E3482] to-[#A56ABD] text-white rounded-br-md'
                                  : 'bg-gray-100 text-gray-900 rounded-bl-md'
                              }`}
                            >
                              <p className="text-sm leading-relaxed break-words">{message.content}</p>
                              <div className={`flex items-center gap-1 mt-1 text-xs ${
                                isOwnMessage ? 'text-white/70 justify-end' : 'text-gray-500'
                              }`}>
                                <span>
                                  {formatDistanceToNow(new Date(message.created_at), { addSuffix: true, locale: idLocale })}
                                </span>
                                {getMessageStatusIcon(message.message_status, isOwnMessage)}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="border-t border-[#A56ABD]/20 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ketik pesan..."
                          className="border-[#A56ABD]/30 focus:border-[#A56ABD] pr-12"
                          disabled={sending}
                        />
                      </div>
                      <Button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || sending}
                        className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] text-white hover:from-[#49225B] hover:to-[#6E3482] shadow-lg"
                      >
                        {sending ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatPopup;
