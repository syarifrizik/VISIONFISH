
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Newspaper, Crown, HelpCircle } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { motion } from 'framer-motion';

interface MessageTypeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: 'question' | 'news' | 'promotion' | 'general', prefix: string) => void;
  isPremium: boolean;
}

const MessageTypeSelector: React.FC<MessageTypeSelectorProps> = ({
  isOpen,
  onClose,
  onSelectType,
  isPremium
}) => {
  const { theme } = useTheme();

  const messageTypes = [
    {
      type: 'general' as const,
      title: 'Diskusi Umum',
      description: 'Pesan biasa untuk diskusi sehari-hari',
      icon: MessageSquare,
      prefix: '',
      color: 'bg-purple-500',
      premium: false
    },
    {
      type: 'question' as const,
      title: 'Pertanyaan',
      description: 'Ajukan pertanyaan kepada komunitas',
      icon: HelpCircle,
      prefix: '',
      color: 'bg-green-500',
      premium: false
    },
    {
      type: 'news' as const,
      title: 'Berita',
      description: 'Bagikan berita atau informasi penting',
      icon: Newspaper,
      prefix: '',
      color: 'bg-blue-500',
      premium: false
    },
    {
      type: 'promotion' as const,
      title: 'Promosi Produk',
      description: 'Promosikan produk atau jasa Anda',
      icon: Crown,
      prefix: '',
      color: 'bg-yellow-500',
      premium: true
    }
  ];

  const handleSelectType = (type: any, prefix: string) => {
    if (type === 'promotion' && !isPremium) {
      return; // Handled by disabled state
    }
    onSelectType(type, prefix);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-md ${
        theme === 'light' 
          ? 'bg-white/95 border-purple-200' 
          : 'bg-gray-800/95 border-purple-700/70'
      } backdrop-blur-lg`}>
        <DialogHeader>
          <DialogTitle className={`text-center text-xl font-bold ${
            theme === 'light' ? 'text-purple-900' : 'text-purple-100'
          }`}>
            Pilih Tipe Pesan
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          {messageTypes.map((messageType, index) => {
            const IconComponent = messageType.icon;
            const isDisabled = messageType.premium && !isPremium;
            
            return (
              <motion.div
                key={messageType.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  onClick={() => handleSelectType(messageType.type, messageType.prefix)}
                  disabled={isDisabled}
                  className={`w-full p-4 h-auto flex items-start space-x-3 text-left transition-all duration-300 ${
                    isDisabled
                      ? 'opacity-50 cursor-not-allowed'
                      : theme === 'light'
                        ? 'bg-white hover:bg-purple-50 border border-purple-200 hover:border-purple-300'
                        : 'bg-gray-800/70 hover:bg-purple-800/50 border border-purple-700/60 hover:border-purple-500'
                  }`}
                  variant="outline"
                >
                  <div className={`p-2 rounded-lg ${messageType.color} flex-shrink-0`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-medium ${
                        theme === 'light' ? 'text-purple-900' : 'text-purple-100'
                      }`}>
                        {messageType.title}
                      </h3>
                      {messageType.premium && (
                        <Badge className="bg-yellow-500 text-black">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm ${
                      theme === 'light' ? 'text-purple-600' : 'text-purple-400'
                    }`}>
                      {messageType.description}
                    </p>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageTypeSelector;
