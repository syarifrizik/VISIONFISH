import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, Upload, Crown, LogIn, ArrowUp } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/use-theme';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { useAuth } from '@/hooks/useAuth';

// Import our chat services and components
import { 
  fetchChatMessages, 
  sendChatMessage, 
  deleteChatMessage, 
  pinChatMessage, 
  likeMessage,
  uploadProductImage,
  ChatMessage 
} from '@/services/chatroomService';
import MessageInputArea from '@/components/chat/MessageInputArea';
import ModernChatGrid from '@/components/chat/ModernChatGrid';
import ChatMessageDetail from '@/components/chat/ChatMessageDetail';
import ModernHeroSection from '@/components/chat/ModernHeroSection';
import MessageTypeSelector from '@/components/chat/MessageTypeSelector';

const ChatroomPage = () => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { isLoggedIn, isPremium, user, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messageText, setMessageText] = useState('');
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isMessageTypeSelectorOpen, setIsMessageTypeSelectorOpen] = useState(false);
  const [currentMessageType, setCurrentMessageType] = useState<'question' | 'news' | 'promotion' | 'general'>('general');
  
  // Product promotion modal states
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [productTitle, setProductTitle] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productContact, setProductContact] = useState('');
  const [productImage, setProductImage] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Fetch chat messages using React Query
  const { data: messages = [], isLoading: messagesLoading, error } = useQuery({
    queryKey: ['chat-messages'],
    queryFn: () => fetchChatMessages(100),
    enabled: isLoggedIn,
    refetchInterval: 30000,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ content, replyTo, messageType, imageUrl }: { 
      content: string; 
      replyTo?: string; 
      messageType: 'question' | 'news' | 'promotion' | 'general';
      imageUrl?: string;
    }) => sendChatMessage(content, replyTo, messageType, imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
      setMessageText('');
      setReplyTo(null);
      toast.success('Pesan terkirim');
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error('Gagal mengirim pesan');
    }
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: (messageId: string) => deleteChatMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
      toast.success('Pesan berhasil dihapus');
    },
    onError: (error) => {
      console.error('Error deleting message:', error);
      toast.error('Gagal menghapus pesan');
    }
  });

  // Pin message mutation
  const pinMessageMutation = useMutation({
    mutationFn: ({ messageId, isPinned }: { messageId: string; isPinned: boolean }) => 
      pinChatMessage(messageId, isPinned),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
    },
    onError: (error) => {
      console.error('Error pinning message:', error);
      toast.error('Gagal mengubah status pin pesan');
    }
  });

  // Like message mutation
  const likeMessageMutation = useMutation({
    mutationFn: (messageId: string) => likeMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
    },
    onError: (error) => {
      console.error('Error liking message:', error);
      toast.error('Gagal menyukai pesan');
    }
  });

  // Handle scroll events for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle sending messages with type selector
  const handleSendMessage = () => {
    if (!messageText.trim() || !isLoggedIn) return;
    
    // Open message type selector first
    setIsMessageTypeSelectorOpen(true);
  };

  // Handle message type selection
  const handleMessageTypeSelection = (type: 'question' | 'news' | 'promotion' | 'general', prefix: string) => {
    setCurrentMessageType(type);
    const finalContent = messageText.trim();
    
    sendMessageMutation.mutate({
      content: finalContent,
      replyTo: replyTo?.id,
      messageType: type
    });
    
    setIsMessageTypeSelectorOpen(false);
  };

  // Handle message selection
  const handleMessageClick = (message: ChatMessage) => {
    setSelectedMessage(message);
    setIsDetailOpen(true);
  };

  // Handle message pin toggle
  const handleTogglePin = (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      pinMessageMutation.mutate({
        messageId,
        isPinned: !message.is_pinned
      });
    }
  };

  // Handle message delete
  const handleDeleteMessage = (messageId: string) => {
    deleteMessageMutation.mutate(messageId);
  };

  // Handle message like
  const handleLikeMessage = (messageId: string) => {
    likeMessageMutation.mutate(messageId);
  };

  // Handle image upload
  const handleImageUpload = (imageUrl: string) => {
    console.log('Image uploaded:', imageUrl);
  };

  // Handle promotion submit
  const handlePromotionSubmit = async () => {
    if (!productTitle.trim() || !productDescription.trim()) {
      toast.error('Judul dan deskripsi produk wajib diisi');
      return;
    }
    
    let imageUrl = '';
    
    if (productImage) {
      setIsUploadingImage(true);
      try {
        imageUrl = await uploadProductImage(productImage);
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Gagal mengupload gambar');
        setIsUploadingImage(false);
        return;
      }
      setIsUploadingImage(false);
    }
    
    const promotionContent = `${productTitle}\n\n${productDescription}\n\nHarga: ${productPrice || 'Hubungi penjual'}\n\nKontak: ${productContact || 'Lihat profil'}`;
    
    sendMessageMutation.mutate({
      content: promotionContent,
      messageType: 'promotion',
      imageUrl: imageUrl || undefined
    });
    
    setIsPromotionModalOpen(false);
    resetPromotionForm();
    toast.success('Produk berhasil dipromosikan!');
  };

  // Reset promotion form
  const resetPromotionForm = () => {
    setProductTitle('');
    setProductDescription('');
    setProductPrice('');
    setProductContact('');
    setProductImage(null);
  };

  // Handle file upload for promotion
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran gambar maksimal 5MB');
        return;
      }
      
      setProductImage(file);
    }
  };

  const handlePromotionClick = () => {
    if (!isLoggedIn) {
      toast.error("Login Diperlukan", {
        description: "Silahkan login terlebih dahulu untuk menggunakan fitur ini.",
      });
      return;
    }
    
    if (!isPremium) {
      toast("Fitur Premium", {
        description: "Promosi produk hanya tersedia untuk pengguna premium. Upgrade akun Anda untuk menggunakan fitur ini.",
        action: {
          label: "Upgrade Sekarang",
          onClick: () => navigate('/premium')
        },
        dismissible: true,
      });
      return;
    }
    setIsPromotionModalOpen(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToChat = () => {
    const chatElement = document.getElementById('chat-section');
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <StatusIndicator status="warning" size="lg" className="animate-pulse" />
          <span className={`text-lg ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`}>
            Memuat...
          </span>
        </div>
      </div>
    );
  }

  // Show login required state with blur effect
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen relative">
        {/* Blurred background preview */}
        <div className="absolute inset-0 filter blur-sm scale-105 opacity-30">
          <ModernHeroSection
            totalMessages={150}
            onlineUsers={45}
            onPromoteProduct={() => {}}
            onJoinChat={() => {}}
            isPremium={false}
            recentMessages={[]}
          />
        </div>
        
        {/* Login overlay */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`max-w-lg mx-auto p-8 rounded-3xl ${
              theme === 'light' 
                ? 'bg-white/95 border border-purple-200/50 shadow-2xl backdrop-blur-xl' 
                : 'bg-purple-900/90 border border-purple-700/30 shadow-2xl backdrop-blur-xl'
            }`}
          >
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 ${
              theme === 'light' 
                ? 'bg-gradient-to-br from-purple-500 to-purple-600' 
                : 'bg-gradient-to-br from-purple-400 to-purple-500'
            } shadow-lg`}>
              <LogIn className="h-10 w-10 text-white" />
            </div>
            
            <h3 className={`text-2xl font-bold mb-4 ${
              theme === 'light' ? 'text-purple-900' : 'text-purple-100'
            }`}>
              Login untuk Bergabung
            </h3>
            
            <p className={`text-base mb-8 leading-relaxed ${
              theme === 'light' ? 'text-purple-600' : 'text-purple-400'
            }`}>
              Silahkan login untuk mengirim pesan dan berinteraksi dengan nelayan lainnya. 
              Chat Anda akan tersimpan dan semua fitur premium tersedia.
            </p>
            
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className={`w-full text-lg font-semibold py-4 rounded-2xl transition-all duration-300 ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-xl shadow-purple-500/30'
                  : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-xl shadow-purple-500/40'
              } hover:scale-105 hover:shadow-2xl`}
            >
              <LogIn className="h-5 w-5 mr-3" />
              Login / Daftar Sekarang
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Modern Hero Section */}
      <ModernHeroSection
        totalMessages={messages.length}
        onlineUsers={messages.filter(m => m.profile).length}
        onPromoteProduct={handlePromotionClick}
        onJoinChat={scrollToChat}
        isPremium={isPremium}
        recentMessages={messages.slice(0, 5)}
      />

      {/* Chat Section */}
      <div id="chat-section" className={`${
        theme === 'light' ? 'bg-purple-50/50' : 'bg-gray-900/50'
      } min-h-screen`}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className={`rounded-2xl overflow-hidden shadow-2xl ${
              theme === 'light' 
                ? 'bg-white/95 border border-purple-200' 
                : 'bg-gray-800/95 border border-purple-700/60'
            } backdrop-blur-lg`}>
              
              {messagesLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="flex items-center space-x-4">
                    <StatusIndicator status="warning" size="lg" className="animate-pulse" />
                    <span className={`text-lg ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`}>
                      Memuat pesan...
                    </span>
                  </div>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 px-4">
                  <MessageCircle className="h-16 w-16 text-red-500 mb-4" />
                  <h3 className="text-xl font-semibold text-red-600 mb-2">
                    Gagal Memuat Pesan
                  </h3>
                  <p className="text-red-500 text-center mb-4">
                    Terjadi kesalahan saat memuat pesan. Silahkan refresh halaman.
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Refresh Halaman
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col h-[80vh]">
                  {/* Chat Grid */}
                  <div className="flex-1 overflow-hidden">
                    <ModernChatGrid
                      messages={messages}
                      onMessageClick={handleMessageClick}
                      onPinMessage={handleTogglePin}
                      onDeleteMessage={handleDeleteMessage}
                      onLikeMessage={handleLikeMessage}
                      isPremium={isPremium}
                      currentUserId={user?.id}
                    />
                  </div>
                  
                  {/* Input Area */}
                  <div className={`border-t ${
                    theme === 'light' ? 'border-purple-200' : 'border-purple-700/60'
                  }`}>
                    <MessageInputArea
                      messageText={messageText}
                      setMessageText={setMessageText}
                      onSendMessage={handleSendMessage}
                      isPremium={isPremium}
                      onImageUpload={handleImageUpload}
                      replyTo={replyTo ? {
                        id: replyTo.id,
                        userId: replyTo.user_id,
                        userName: replyTo.profile?.display_name || '...',
                        avatar: replyTo.profile?.avatar_url || '/placeholder.svg',
                        content: replyTo.content,
                        timestamp: new Date(replyTo.created_at),
                        isPinned: replyTo.is_pinned,
                        isOnline: true
                      } : null}
                      setReplyTo={() => setReplyTo(null)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={scrollToTop}
              size="icon"
              className={`h-14 w-14 rounded-full shadow-xl transition-all duration-300 ${
                theme === 'light'
                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/30'
                  : 'bg-purple-500 hover:bg-purple-600 text-white shadow-purple-500/40'
              } hover:scale-110`}
            >
              <ArrowUp className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Type Selector */}
      <MessageTypeSelector
        isOpen={isMessageTypeSelectorOpen}
        onClose={() => setIsMessageTypeSelectorOpen(false)}
        onSelectType={handleMessageTypeSelection}
        isPremium={isPremium}
      />

      {/* Message Detail Modal */}
      <ChatMessageDetail
        message={selectedMessage}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onReply={(message) => {
          setReplyTo(message);
          setIsDetailOpen(false);
          scrollToChat();
        }}
        onPin={handleTogglePin}
        onDelete={handleDeleteMessage}
        isPremium={isPremium}
        currentUserId={user?.id}
      />

      {/* Product Promotion Modal */}
      <Dialog open={isPromotionModalOpen} onOpenChange={setIsPromotionModalOpen}>
        <DialogContent className={`max-w-2xl ${
          theme === 'light' 
            ? 'bg-white/95 border-purple-200' 
            : 'bg-gray-800/95 border-purple-700/70'
        } backdrop-blur-lg`}>
          <DialogHeader>
            <DialogTitle className={`text-center text-2xl font-bold ${
              theme === 'light' ? 'text-purple-900' : 'text-purple-100'
            }`}>
              Promosikan Produk Anda
            </DialogTitle>
            <DialogDescription className={`text-center ${
              theme === 'light' ? 'text-purple-600' : 'text-purple-400'
            }`}>
              Promosikan produk ikan atau peralatan memancing Anda kepada komunitas nelayan.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productTitle" className={
                  theme === 'light' ? 'text-purple-700' : 'text-purple-300'
                }>
                  Judul Produk *
                </Label>
                <Input
                  id="productTitle"
                  placeholder="Ikan Tuna Segar dari Banda Aceh"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  className={`${
                    theme === 'light' 
                      ? 'bg-white border-purple-200 focus:border-purple-400' 
                      : 'bg-gray-800/70 border-purple-700/60 focus:border-purple-500'
                  }`}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="productPrice" className={
                  theme === 'light' ? 'text-purple-700' : 'text-purple-300'
                }>
                  Harga
                </Label>
                <Input
                  id="productPrice"
                  placeholder="Rp50.000/kg"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  className={`${
                    theme === 'light' 
                      ? 'bg-white border-purple-200 focus:border-purple-400' 
                      : 'bg-gray-800/70 border-purple-700/60 focus:border-purple-500'
                  }`}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="productDescription" className={
                theme === 'light' ? 'text-purple-700' : 'text-purple-300'
              }>
                Deskripsi Produk *
              </Label>
              <textarea
                id="productDescription"
                placeholder="Deskripsi detail tentang produk Anda..."
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                rows={4}
                className={`w-full p-3 rounded-lg border-2 transition-all duration-300 ${
                  theme === 'light' 
                    ? 'bg-white border-purple-200 focus:border-purple-400' 
                    : 'bg-gray-800/70 border-purple-700/60 focus:border-purple-500'
                } focus:outline-none focus:ring-2 focus:ring-purple-400/30`}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="productContact" className={
                theme === 'light' ? 'text-purple-700' : 'text-purple-300'
              }>
                Kontak
              </Label>
              <Input
                id="productContact"
                placeholder="WhatsApp/Email untuk pemesanan"
                value={productContact}
                onChange={(e) => setProductContact(e.target.value)}
                className={`${
                  theme === 'light' 
                    ? 'bg-white border-purple-200 focus:border-purple-400' 
                    : 'bg-gray-800/70 border-purple-700/60 focus:border-purple-500'
                }`}
              />
            </div>
            
            <div className="space-y-2">
              <Label className={
                theme === 'light' ? 'text-purple-700' : 'text-purple-300'
              }>
                Foto Produk (Maks. 5MB) - Akan dikompres otomatis
              </Label>
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('productImageInput')?.click()}
                  className={`${
                    theme === 'light' 
                      ? 'bg-white border-purple-200 hover:bg-purple-50' 
                      : 'bg-gray-800/70 border-purple-700/60 hover:bg-purple-800/50'
                  }`}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Pilih Gambar
                </Button>
                <input
                  id="productImageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                {productImage && (
                  <span className={`text-sm ${
                    theme === 'light' ? 'text-purple-600' : 'text-purple-400'
                  }`}>
                    ✓ {productImage.name}
                  </span>
                )}
              </div>
              
              {productImage && (
                <div className="mt-4 relative rounded-xl overflow-hidden">
                  <img 
                    src={URL.createObjectURL(productImage)} 
                    alt="Preview produk" 
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 rounded-full"
                    onClick={() => setProductImage(null)}
                  >
                    ✕
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsPromotionModalOpen(false);
                resetPromotionForm();
              }}
              className={`${
                theme === 'light' 
                  ? 'bg-white border-purple-200 hover:bg-purple-50' 
                  : 'bg-gray-800/70 border-purple-700/60 hover:bg-purple-800/50'
              }`}
            >
              Batal
            </Button>
            <Button 
              type="button"
              onClick={handlePromotionSubmit}
              disabled={sendMessageMutation.isPending || isUploadingImage}
              className={`${
                theme === 'light'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                  : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
              } text-white shadow-lg transition-all duration-300 hover:scale-105`}
            >
              {(sendMessageMutation.isPending || isUploadingImage) ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {isUploadingImage ? 'Mengupload...' : 'Memproses...'}
                </>
              ) : (
                <>
                  <Crown className="h-4 w-4 mr-2" />
                  Promosikan Sekarang
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatroomPage;
