
import { useRef, useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, X, Smile, Upload, Crown } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { motion, AnimatePresence } from 'framer-motion';
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
}

interface MessageInputAreaProps {
  onSendMessage: () => void;
  messageText: string;
  setMessageText: (text: string) => void;
  replyTo: Message | null;
  setReplyTo: (message: Message | null) => void;
  isPremium?: boolean;
  onImageUpload?: (imageUrl: string) => void;
}

const MessageInputArea: React.FC<MessageInputAreaProps> = ({
  onSendMessage,
  messageText,
  setMessageText,
  replyTo,
  setReplyTo,
  isPremium = false,
  onImageUpload
}) => {
  const { theme } = useTheme();
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    setIsTyping(true);
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };
  
  const handleKeyUp = () => {
    setIsTyping(false);
  };

  // Function to compress image
  const compressImage = (file: File, quality: number = 0.7): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max 800px width)
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          }
        }, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadToImageKit = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', `chat_${Date.now()}_${file.name}`);
    formData.append('folder', '/chat_uploads');

    console.log('Uploading to ImageKit...', file.name, file.size);

    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa('public_cXvKnq0m87RNK84Baj9qhVtJK88=' + ':')
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('ImageKit upload error:', errorData);
      throw new Error('Failed to upload image to ImageKit');
    }

    const data = await response.json();
    console.log('ImageKit upload success:', data);
    return data.url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPremium) {
      toast.error("Fitur Premium", {
        description: "Upload gambar hanya tersedia untuk pengguna premium. Upgrade akun Anda untuk menggunakan fitur ini.",
      });
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    setIsUploading(true);
    try {
      // Compress image first
      toast.info('Mengkompresi gambar...');
      const compressedFile = await compressImage(file);
      
      console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
      
      // Validate compressed file size (max 3MB after compression)
      if (compressedFile.size > 3 * 1024 * 1024) {
        toast.error('Ukuran gambar masih terlalu besar setelah kompresi. Coba gunakan gambar yang lebih kecil.');
        return;
      }

      toast.info('Mengunggah gambar...');
      const imageUrl = await uploadToImageKit(compressedFile);
      
      // Add image URL directly to message text without [GAMBAR] prefix
      const newMessageText = messageText + (messageText ? '\n' : '') + imageUrl;
      setMessageText(newMessageText);
      
      if (onImageUpload) {
        onImageUpload(imageUrl);
      }
      
      toast.success(`Gambar berhasil diunggah! Ukuran dikurangi ${((1 - compressedFile.size / file.size) * 100).toFixed(0)}%`);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Gagal mengunggah gambar. Periksa koneksi internet dan coba lagi.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    if (!isPremium) {
      toast.error("Fitur Premium", {
        description: "Upload gambar hanya tersedia untuk pengguna premium. Upgrade akun Anda untuk menggunakan fitur ini.",
      });
      return;
    }
    fileInputRef.current?.click();
  };
  
  return (
    <div className={`${theme === 'light' ? 'border-t border-gray-200' : 'border-t border-gray-700/60'} p-3 pb-4`}>
      <AnimatePresence>
        {replyTo && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex justify-between items-center p-2 rounded-lg ${theme === 'light' ? 'bg-blue-50' : 'bg-primary/5'} mb-2`}
          >
            <div className="flex items-center overflow-hidden">
              <div className={`min-w-[20px] flex items-center ${theme === 'light' ? 'text-blue-600' : 'text-primary'} mr-1`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 17 4 12 9 7"></polyline>
                  <path d="M20 18v-2a4 4 0 0 0-4-4H4"></path>
                </svg>
              </div>
              <div className="overflow-hidden">
                <span className="text-sm text-muted-foreground">
                  Membalas ke <span className={theme === 'light' ? 'text-blue-600 font-medium' : 'text-primary font-medium'}>
                    {replyTo.userName}
                  </span>
                </span>
                <div className="text-xs truncate text-muted-foreground max-w-full">
                  {replyTo.content.substring(0, 50)}{replyTo.content.length > 50 ? '...' : ''}
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 hover:bg-white/10 -mt-1 -mr-1 dark:hover:bg-primary/20 flex-shrink-0"
              onClick={() => setReplyTo(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <Textarea
            ref={messageInputRef}
            placeholder="Ketik pesan Anda..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className={`chat-input min-h-[60px] resize-none pr-16 border-${theme === 'light' ? 'gray-200' : 'gray-700'} focus:border-${theme === 'light' ? 'blue-300' : 'visionfish-neon-blue'} transition-colors`}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
          />
          <div className="absolute right-2 bottom-2 flex items-center space-x-1">
            <Button 
              type="button" 
              size="sm" 
              variant="ghost"
              className={`h-7 w-7 p-0 rounded-full bg-transparent ${theme === 'light' ? 'hover:bg-blue-50 hover:text-blue-600' : 'hover:bg-primary/10 hover:text-primary'}`}
            >
              <Smile className="h-5 w-5" />
              <span className="sr-only">Emoji</span>
            </Button>
            <Button 
              type="button" 
              size="sm" 
              variant="ghost"
              className={`h-7 w-7 p-0 rounded-full bg-transparent relative ${
                theme === 'light' ? 'hover:bg-blue-50 hover:text-blue-600' : 'hover:bg-primary/10 hover:text-primary'
              } ${!isPremium ? 'opacity-60' : ''}`}
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              {isUploading ? (
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {!isPremium && (
                <Crown className="h-2 w-2 absolute -top-0.5 -right-0.5 text-yellow-500" />
              )}
              <span className="sr-only">Upload Gambar</span>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          
          <AnimatePresence>
            {isTyping && messageText.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 5 }}
                className="absolute left-3 -top-5 bg-background/80 backdrop-blur-sm text-xs px-2 py-0.5 rounded-md border border-border/40"
              >
                Mengetik...
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            className={`${theme === 'light' ? 'bg-ocean-blue text-white shadow-md hover:shadow-lg hover:bg-ocean-blue/90' : 'bg-visionfish-neon-blue text-white shadow-neon-blue hover:shadow-neon-purple hover:bg-visionfish-neon-blue/90'} self-end h-[60px] min-w-[100px]`}
            onClick={onSendMessage}
            disabled={!messageText.trim() || isUploading}
          >
            <Send className="h-5 w-5 mr-2" />
            Kirim
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default MessageInputArea;
