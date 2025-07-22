import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2, Calendar, Clock, Crown, ChevronRight, ChevronLeft } from "lucide-react";
import { hasPremiumAccess } from '@/utils/ai-models';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useAuth } from "@/hooks/useAuth";

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  date: Date;
  preview: string;
  category?: string;
}

// Enhanced mock data for chat history with categories
const mockChatHistory: ChatSession[] = [
  {
    id: "chat-1",
    title: "Analisis Ikan Kerapu",
    lastMessage: "Bagaimana ciri-ciri ikan kerapu yang sehat?",
    date: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    preview: "Ikan kerapu yang sehat memiliki warna cerah, gerakan aktif, dan nafsu makan baik...",
    category: "Perikanan"
  },
  {
    id: "chat-2",
    title: "Tips Budidaya Udang",
    lastMessage: "Apa parameter air yang ideal untuk budidaya udang?",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    preview: "Parameter ideal untuk budidaya udang: suhu 28-31°C, pH 7.5-8.5, salinitas 10-25 ppt...",
    category: "Budidaya"
  },
  {
    id: "chat-3",
    title: "Jenis Pakan Ikan Nila",
    lastMessage: "Apa pakan terbaik untuk ikan nila?",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    preview: "Pakan terbaik untuk ikan nila mengandung protein 25-35%, karbohidrat 30-40%...",
    category: "Perikanan"
  },
  {
    id: "chat-4",
    title: "Teknologi Tambak Modern",
    lastMessage: "Apa teknologi terbaru untuk tambak udang?",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    preview: "Teknologi terbaru untuk tambak udang termasuk sistem bioflok, monitoring IoT untuk kualitas air...",
    category: "Teknologi"
  },
  {
    id: "chat-5",
    title: "Permasalahan Penyakit Lobster",
    lastMessage: "Bagaimana mengatasi penyakit pada lobster air tawar?",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    preview: "Penyakit umum pada lobster air tawar dan solusinya meliputi...",
    category: "Kesehatan"
  },
];

interface ChatHistoryProps {
  onSelectChat?: (chatId: string) => void;
  onClose?: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ onSelectChat, onClose }) => {
  const navigate = useNavigate();
  const { isPremium } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const filteredChats = mockChatHistory.filter(
    chat => 
      (activeCategory ? chat.category === activeCategory : true) &&
      (searchQuery ? 
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      : true)
  );

  // Get unique categories
  const categories = Array.from(new Set(mockChatHistory.map(chat => chat.category))).filter(Boolean) as string[];

  const handleSelectChat = (chatId: string) => {
    if (onSelectChat) {
      onSelectChat(chatId);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleCategorySelect = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  // Scroll left/right functionality for category tabs on mobile
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -100, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 100, behavior: 'smooth' });
    }
  };

  if (!hasPremiumAccess(isPremium)) {
    return (
      <Card className="border-visionfish-neon-blue/30 bg-card/95 backdrop-blur-sm w-full max-w-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Crown className="h-5 w-5 text-visionfish-neon-pink" />
            Riwayat Chat Premium
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 px-4 space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Crown className="h-12 w-12 text-visionfish-neon-pink opacity-70" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Fitur Premium</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Akses riwayat chat lengkap dan simpan percakapan penting Anda dengan upgrade ke Premium.
            </p>
            <Button 
              className="bg-gradient-to-r from-visionfish-neon-blue to-visionfish-neon-pink text-white font-medium"
              onClick={() => navigate("/premium")}
            >
              Upgrade ke Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-visionfish-neon-blue/30 bg-card/95 backdrop-blur-sm w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Crown className="h-5 w-5 text-visionfish-neon-pink" />
          Riwayat Chat Premium
        </CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari percakapan..."
            className="pl-8 bg-background/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      
      {/* Category Tabs - Horizontal scrolling for mobile */}
      <div className="relative px-3 mb-2">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full bg-background/50 shadow-sm" onClick={scrollLeft}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="overflow-x-auto scrollbar-none px-4" ref={scrollContainerRef}>
          <div className="flex space-x-2 py-1">
            {categories.map(category => (
              <Button
                key={category}
                size="sm"
                variant={activeCategory === category ? "default" : "outline"}
                className={`whitespace-nowrap text-xs px-2.5 py-1 h-auto ${
                  activeCategory === category 
                    ? "bg-visionfish-neon-blue text-white" 
                    : "border-visionfish-neon-blue/40"
                }`}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full bg-background/50 shadow-sm" onClick={scrollRight}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="px-3 pb-3">
        <Carousel className="w-full">
          <CarouselContent>
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <CarouselItem key={chat.id} className="md:basis-1/1">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-3 rounded-md hover:bg-accent cursor-pointer transition-colors border border-transparent hover:border-border"
                    onClick={() => handleSelectChat(chat.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm line-clamp-1">{chat.title}</h4>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(chat.date, { addSuffix: true, locale: id })}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{chat.preview}</p>
                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-border/50">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {chat.date.toLocaleDateString('id-ID')}
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem className="basis-full">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground text-sm">Tidak ada riwayat chat ditemukan</p>
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>

      {/* Recent Chats in Collapsible Groups */}
      <div className="px-3 pb-3">
        <Collapsible className="w-full">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-accent">
            <span className="text-sm font-medium">Chat Terkini</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2 p-2">
                {filteredChats.length > 0 ? (
                  filteredChats.slice(0, 3).map((chat) => (
                    <motion.div
                      key={`recent-${chat.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="p-2 rounded-md hover:bg-accent/50 cursor-pointer"
                      onClick={() => handleSelectChat(chat.id)}
                    >
                      <div className="flex justify-between items-start">
                        <h5 className="text-xs font-medium">{chat.title}</h5>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(chat.date, { addSuffix: true, locale: id })}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    Tidak ada chat terkini
                  </p>
                )}
              </div>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Card>
  );
};

export default ChatHistory;
