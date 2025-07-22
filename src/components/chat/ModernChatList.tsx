
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MessageCircle, 
  Users, 
  Eye,
  Crown,
  MapPin,
  Filter,
  Waves,
  Fish
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ModernChatPopup from './ModernChatPopup';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';

interface ChatUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  is_online: boolean;
  location?: string;
  fish_caught?: number;
  isPremium?: boolean;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
}

// Enhanced timezone-aware timestamp formatting function for chat list
const formatMessageTime = (timestamp?: string) => {
  if (!timestamp) return '';
  
  try {
    // Get user's timezone (with fallback to Asia/Jakarta for Indonesia)
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Jakarta';
    
    // Parse the UTC timestamp from Supabase and ensure it's treated as UTC
    const utcDate = new Date(timestamp + (timestamp.includes('Z') ? '' : 'Z'));
    
    // Check if date is valid
    if (isNaN(utcDate.getTime())) {
      return '';
    }
    
    // Convert UTC to user's local timezone
    const localDate = toZonedTime(utcDate, userTimeZone);
    const now = new Date();
    const diffInHours = (now.getTime() - localDate.getTime()) / (1000 * 60 * 60);
    
    // If less than 24 hours, show relative time
    if (diffInHours < 24) {
      return formatDistanceToNow(localDate, { addSuffix: true, locale: idLocale });
    }
    
    // If more than 24 hours, show date with proper timezone
    return localDate.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: userTimeZone
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return '';
  }
};

const ModernChatList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'online' | 'premium' | 'nearby'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [chatPopupOpen, setChatPopupOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadChatUsers();
    }
  }, [user]);

  const loadChatUsers = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get users with recent conversations first
      const { data: conversations } = await supabase
        .from('direct_messages')
        .select(`
          sender_id,
          receiver_id,
          content,
          created_at,
          sender_profile:profiles!sender_id (id, username, display_name, avatar_url, is_online, location, fish_caught),
          receiver_profile:profiles!receiver_id (id, username, display_name, avatar_url, is_online, location, fish_caught)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(50);

      // Get all other users for discovery
      const { data: allUsers } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url, is_online, location, fish_caught')
        .neq('id', user.id)
        .order('is_online', { ascending: false })
        .order('fish_caught', { ascending: false })
        .limit(20);

      const chatUsersMap = new Map<string, ChatUser>();

      // Process conversation partners
      conversations?.forEach((msg: any) => {
        const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        const partnerProfile = msg.sender_id === user.id ? msg.receiver_profile : msg.sender_profile;
        
        if (!chatUsersMap.has(partnerId) && partnerProfile) {
          chatUsersMap.set(partnerId, {
            id: partnerId,
            username: partnerProfile.username || 'user',
            display_name: partnerProfile.display_name || 'User',
            avatar_url: partnerProfile.avatar_url,
            is_online: partnerProfile.is_online || false,
            location: partnerProfile.location,
            fish_caught: partnerProfile.fish_caught || 0,
            isPremium: Math.random() > 0.7,
            last_message: msg.content?.substring(0, 50),
            last_message_time: msg.created_at,
            unread_count: Math.floor(Math.random() * 3)
          });
        }
      });

      // Add other users for discovery (without recent messages)
      allUsers?.forEach((profile: any) => {
        if (!chatUsersMap.has(profile.id)) {
          chatUsersMap.set(profile.id, {
            id: profile.id,
            username: profile.username || 'user',
            display_name: profile.display_name || 'User',
            avatar_url: profile.avatar_url,
            is_online: profile.is_online || false,
            location: profile.location,
            fish_caught: profile.fish_caught || 0,
            isPremium: Math.random() > 0.8
          });
        }
      });

      setUsers(Array.from(chatUsersMap.values()));
    } catch (error) {
      console.error('Error loading chat users:', error);
      toast({
        title: "Error",
        description: "Gagal memuat daftar chat",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = (chatUser: ChatUser) => {
    setSelectedUser(chatUser);
    setChatPopupOpen(true);
  };

  const handleCloseChatPopup = () => {
    setChatPopupOpen(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = (() => {
      switch (activeFilter) {
        case 'online': return user.is_online;
        case 'premium': return user.isPremium;
        case 'nearby': return user.location?.toLowerCase().includes('jakarta');
        default: return true;
      }
    })();
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-blue-950 dark:to-cyan-950">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-white/20 dark:bg-slate-800/20 rounded-2xl w-48 mx-auto backdrop-blur-sm" />
            <div className="h-16 bg-white/20 dark:bg-slate-800/20 rounded-3xl backdrop-blur-sm" />
            <div className="grid grid-cols-1 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-white/20 dark:bg-slate-800/20 rounded-3xl backdrop-blur-sm" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-blue-950 dark:to-cyan-950">
        <div className="container mx-auto px-3 md:px-4 py-6 md:py-8 max-w-4xl">
          {/* Glassmorphism Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 md:mb-8"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-xl" />
              <h1 className="relative text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2 flex items-center gap-2 md:gap-3 justify-center">
                <Waves className="w-6 h-6 md:w-10 md:h-10 text-blue-500 dark:text-blue-400" />
                VisionFish Chat
              </h1>
            </div>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
              Terhubung dengan {users.length} angler di seluruh nusantara
            </p>
          </motion.div>

          {/* Advanced Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative mb-6 md:mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-blue-50/40 dark:from-slate-800/40 dark:to-blue-900/40 rounded-3xl blur-xl" />
            <div className="relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl rounded-3xl p-4 md:p-6 border border-white/20 dark:border-slate-700/20 shadow-2xl">
              <div className="flex flex-col gap-3 md:gap-4">
                <div className="relative">
                  <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 md:w-5 md:h-5" />
                  <Input
                    placeholder="Cari angler berdasarkan nama, lokasi, atau spesies ikan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 md:pl-12 bg-white/50 dark:bg-slate-900/50 border-white/30 dark:border-slate-600/30 focus:border-blue-400 dark:focus:border-blue-500 rounded-2xl h-10 md:h-12 backdrop-blur-sm text-slate-700 dark:text-slate-300 text-sm md:text-base"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'Semua', icon: Users, color: 'from-slate-500 to-slate-600' },
                    { id: 'online', label: 'Online', icon: Eye, color: 'from-green-500 to-emerald-600' },
                    { id: 'premium', label: 'Premium', icon: Crown, color: 'from-yellow-500 to-amber-600' },
                    { id: 'nearby', label: 'Terdekat', icon: MapPin, color: 'from-blue-500 to-cyan-600' }
                  ].map((filter) => (
                    <Button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id as any)}
                      variant="ghost"
                      size="sm"
                      className={`relative overflow-hidden rounded-2xl transition-all duration-300 text-xs md:text-sm px-2 md:px-3 py-1.5 md:py-2 ${
                        activeFilter === filter.id
                          ? `bg-gradient-to-r ${filter.color} text-white shadow-lg scale-105`
                          : 'bg-white/30 dark:bg-slate-700/30 text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-600/50'
                      }`}
                    >
                      <filter.icon className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      {filter.label}
                      {activeFilter === filter.id && (
                        <motion.div
                          layoutId="activeFilter"
                          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"
                          initial={false}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chat List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3 md:space-y-4"
          >
            {filteredUsers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 md:py-16"
              >
                <div className="relative inline-block mb-4 md:mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-xl" />
                  <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Fish className="w-8 h-8 md:w-10 md:h-10 text-blue-500 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Belum Ada Angler yang Ditemukan
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Coba ubah filter atau kata kunci pencarian Anda
                </p>
              </motion.div>
            ) : (
              <AnimatePresence>
                {filteredUsers.map((chatUser, index) => (
                  <motion.div
                    key={chatUser.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ delay: index * 0.05, type: "spring", bounce: 0.3 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStartChat(chatUser)}
                    className="group cursor-pointer"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-blue-50/30 dark:from-slate-800/30 dark:to-blue-900/30 rounded-2xl md:rounded-3xl blur-xl transition-all duration-300 group-hover:blur-2xl" />
                      <div className="relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-2xl rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/20 dark:border-slate-700/20 shadow-xl transition-all duration-300 group-hover:shadow-2xl">
                        
                        <div className="flex items-center gap-3 md:gap-4">
                          {/* Avatar with Advanced Presence - Mobile Optimized */}
                          <div className="relative flex-shrink-0">
                            <Avatar className="w-10 h-10 md:w-14 md:h-14 ring-2 ring-white/50 dark:ring-slate-600/50 shadow-lg">
                              <AvatarImage src={chatUser.avatar_url} alt={chatUser.display_name} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold text-sm md:text-lg">
                                {chatUser.display_name[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {chatUser.is_online && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-3 h-3 md:w-5 md:h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-1 md:border-2 border-white dark:border-slate-800 flex items-center justify-center shadow-lg"
                              >
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ repeat: Infinity, duration: 2 }}
                                  className="w-1 h-1 md:w-2 md:h-2 bg-white rounded-full"
                                />
                              </motion.div>
                            )}
                            {chatUser.isPremium && (
                              <motion.div
                                initial={{ rotate: -10, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-4 h-4 md:w-6 md:h-6 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full border-1 md:border-2 border-white dark:border-slate-800 flex items-center justify-center shadow-lg"
                              >
                                <Crown className="w-2 h-2 md:w-3 md:h-3 text-white" />
                              </motion.div>
                            )}
                          </div>
                          
                          {/* User Info - Mobile Optimized */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-base md:text-lg truncate">
                                {chatUser.display_name}
                              </h3>
                              <Badge 
                                variant={chatUser.is_online ? 'default' : 'secondary'} 
                                className={`text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded-full ${
                                  chatUser.is_online 
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                {chatUser.is_online ? 'Online' : 'Offline'}
                              </Badge>
                            </div>
                            
                            {chatUser.last_message && (
                              <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm truncate mb-1">
                                {chatUser.last_message}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-2 md:gap-3 text-xs text-slate-500 dark:text-slate-500">
                              {chatUser.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span className="truncate max-w-20 md:max-w-none">{chatUser.location}</span>
                                </span>
                              )}
                              {chatUser.fish_caught && (
                                <span className="flex items-center gap-1">
                                  <Fish className="w-3 h-3" />
                                  {chatUser.fish_caught} tangkapan
                                </span>
                              )}
                              {chatUser.last_message_time && (
                                <span className="ml-auto text-xs text-slate-400">
                                  {formatMessageTime(chatUser.last_message_time)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action & Indicators - Mobile Optimized */}
                          <div className="flex flex-col items-end gap-1.5 md:gap-2 flex-shrink-0">
                            {chatUser.unread_count && chatUser.unread_count > 0 && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-lg"
                              >
                                {chatUser.unread_count}
                              </motion.div>
                            )}
                            
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg rounded-xl px-2 md:px-4 py-1.5 md:py-2 transition-all duration-300 group-hover:scale-105 h-8 md:h-auto"
                            >
                              <MessageCircle className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                              <span className="hidden md:inline">Chat</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modern Chat Popup */}
      {chatPopupOpen && selectedUser && (
        <ModernChatPopup
          isOpen={chatPopupOpen}
          onClose={handleCloseChatPopup}
          selectedUser={selectedUser}
        />
      )}
    </>
  );
};

export default ModernChatList;
