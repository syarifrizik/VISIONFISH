import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { MessageSquare, Send, Trash2, Crown, Loader2, History, Bot, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { AVAILABLE_MODELS, AI_MODELS, hasPremiumAccess, trackFreeUsage, AI_MODEL } from '@/utils/ai-models';
import { analyzeImageWithGoogle } from '@/utils/api-config';
import { motion, AnimatePresence } from "framer-motion";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import ReactMarkdown from "react-markdown";
import MessageActions from "@/components/chat/MessageActions";
import ChatHistoryDialog from "@/components/chat/ChatHistoryDialog";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIChatComponent = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { isPremium } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState<AI_MODEL>(AI_MODELS.NEPTUNE_FLOW);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);

  // Add welcome message on mount
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: "welcome-message",
        role: "assistant",
        content: "Selamat datang di VisionFish Assistant! Saya dapat membantu Anda dengan pertanyaan seputar perikanan, analisis ikan, informasi IoT perikanan, dan informasi terkait lainnya. Apa yang ingin Anda tanyakan?",
        timestamp: new Date()
      }]);
    }
  }, [messages]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  const handleModelChange = (value: AI_MODEL) => {
    const selectedModelObj = AVAILABLE_MODELS.find(model => model.id === value);
    if (selectedModelObj?.isPremium && !hasPremiumAccess(isPremium)) {
      toast.warning("Model ini hanya tersedia untuk pengguna Premium", {
        action: {
          label: "Upgrade",
          onClick: () => navigate("/premium")
        }
      });
      return;
    }
    setSelectedModel(value);
    setMessages(prev => [...prev, {
      id: `model-change-${Date.now()}`,
      role: "assistant",
      content: `Anda sekarang menggunakan model ${selectedModelObj?.name}.`,
      timestamp: new Date()
    }]);
  };

  // Function to get the Gemini prompt based on model
  const getGeminiPrompt = (userMessage: string, modelType: AI_MODEL) => {
    const basePrompt = `Kamu adalah asisten AI untuk VisionFish, platform perikanan Indonesia yang fokus pada identifikasi, analisis ikan, dan teknologi IoT untuk perikanan. 
    
    Pengguna bertanya: ${userMessage}
    
    Jawab dengan bahasa Indonesia yang sopan dan membantu. Jika ditanya hal di luar perikanan, ilmu kelautan, atau IoT perikanan, tetap jawab dengan sopan tapi ingatkan bahwa kamu difokuskan untuk membantu pengguna seputar perikanan, kelautan, akuakultur, dan teknologi IoT untuk perikanan.`;
    switch (modelType) {
      case AI_MODELS.CORAL_WAVE:
        return `${basePrompt} 
        
        Berikan informasi ilmiah yang mendalam dengan referensi akademis jika relevan. Kamu adalah versi premium dengan pengetahuan spesies laut dan teknologi IoT yang lebih luas.`;
      case AI_MODELS.REGAL_TIDE:
        return `${basePrompt} 
        
        Berikan informasi detail dengan fokus pada aspek komersial, budidaya, dan implementasi teknologi IoT. Kamu adalah versi premium elite dengan kemampuan analisis pasar, tren industri, dan rekomendasi teknologi IoT untuk perikanan.`;
      default:
        return basePrompt;
    }
  };

  // Function to call the secure Google API via Edge Function
  const callSecureGeminiAPI = async (prompt: string): Promise<string> => {
    try {
      const response = await analyzeImageWithGoogle("", prompt);
      return response;
    } catch (error) {
      console.error("Secure Gemini API error:", error);
      return "Terjadi kesalahan dalam memproses pesan Anda. Silakan coba lagi nanti.";
    }
  };
  
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim()) return;
    const userMessage = inputMessage.trim();
    setInputMessage("");

    // Add user message to chat
    const newUserMsgId = `user-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: newUserMsgId,
      role: "user",
      content: userMessage,
      timestamp: new Date()
    }]);

    // Check premium status if needed
    const modelObj = AVAILABLE_MODELS.find(model => model.id === selectedModel);
    if (modelObj?.isPremium && !hasPremiumAccess(isPremium)) {
      setMessages(prev => [...prev, {
        id: `premium-notice-${Date.now()}`,
        role: "assistant",
        content: "Maaf, model ini hanya tersedia untuk pengguna Premium. Silakan upgrade untuk mengakses fitur ini.",
        timestamp: new Date()
      }]);
      return;
    }

    // Check usage limits for free tier
    if (!hasPremiumAccess(isPremium) && !trackFreeUsage("chat")) {
      setMessages(prev => [...prev, {
        id: `limit-notice-${Date.now()}`,
        role: "assistant",
        content: "Anda telah mencapai batas chat gratis (10 pesan/hari). Silakan upgrade ke Premium untuk chat tanpa batas.",
        timestamp: new Date()
      }]);
      return;
    }

    // Start AI typing effect
    setIsTyping(true);
    try {
      // Generate the prompt based on the selected model
      const prompt = getGeminiPrompt(userMessage, selectedModel);

      // Call secure Gemini API via Edge Function
      const response = await callSecureGeminiAPI(prompt);

      // Add AI response to chat
      setMessages(prev => [...prev, {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Terjadi kesalahan dalam chat. Silakan coba lagi.");
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Maaf, terjadi kesalahan dalam memproses pesan Anda. Silakan coba lagi.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleClearChat = () => {
    setMessages([{
      id: "welcome-message-new",
      role: "assistant",
      content: "Chat telah dibersihkan. Ada yang bisa saya bantu seputar perikanan atau IoT perikanan?",
      timestamp: new Date()
    }]);
    toast.success("Chat berhasil dibersihkan");
  };
  
  const viewChatHistory = () => {
    if (hasPremiumAccess(isPremium)) {
      setShowHistoryDialog(true);
    } else {
      toast.info("Fitur riwayat chat hanya tersedia untuk pengguna Premium", {
        action: {
          label: "Upgrade",
          onClick: () => navigate("/premium")
        }
      });
    }
  };
  
  const handleSelectHistoryChat = (chatId: string) => {
    // Implement loading saved chat
    toast.success(`Memuat percakapan: ${chatId}`);
    setShowHistoryDialog(false);
    // In a real app, you would load the chat from the database
  };
  
  const getActiveModelIcon = (modelId: AI_MODEL) => {
    const model = AVAILABLE_MODELS.find(m => m.id === modelId);
    switch (model?.id) {
      case AI_MODELS.NEPTUNE_FLOW:
        return <Bot className="h-5 w-5 text-white" />;
      case AI_MODELS.REGAL_TIDE:
        return <Bot className="h-5 w-5 text-white" strokeWidth={2.5} />;
      case AI_MODELS.CORAL_WAVE:
        return <Bot className="h-5 w-5 text-white" />;
      default:
        return <Bot className="h-5 w-5 text-white" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center text-center space-y-4 mb-4">
        {/* Header content if needed */}
      </div>
      
      <div className="max-w-4xl mx-auto w-full">
        <Card className="fish-analysis-card border-visionfish-neon-blue/50 shadow-lg overflow-hidden bg-card/80 backdrop-blur-sm">
          <Collapsible open={showControls} onOpenChange={setShowControls} className="w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-visionfish-neon-blue/30">
              <CardTitle className="flex items-center space-x-2">
                {getActiveModelIcon(selectedModel)}
                <span>VisionFish AI Assistant</span>
              </CardTitle>
              
              <div className="flex items-center space-x-2">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                    <span className="sr-only">
                      {showControls ? "Close controls" : "Show controls"}
                    </span>
                    {showControls ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
            
            <CollapsibleContent>
              <div className="p-4 grid gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Select value={selectedModel} onValueChange={handleModelChange}>
                    <SelectTrigger className="w-full border-visionfish-neon-blue/50 bg-transparent">
                      <SelectValue placeholder="Pilih Model AI" />
                    </SelectTrigger>
                    <SelectContent className="border-visionfish-neon-blue/70 bg-background/90 backdrop-blur-md">
                      {AVAILABLE_MODELS.map(model => <SelectItem key={model.id} value={model.id}>
                          <span className="flex items-center">
                            {model.id === AI_MODELS.NEPTUNE_FLOW && <Bot className="h-4 w-4 mr-2 text-white" />}
                            {model.id === AI_MODELS.REGAL_TIDE && <Bot className="h-4 w-4 mr-2 text-white" strokeWidth={2.5} />}
                            {model.id === AI_MODELS.CORAL_WAVE && <Bot className="h-4 w-4 mr-2 text-white" />}
                            <span>{model.name}</span>
                            {model.isPremium && <span className="ml-2">
                                <Crown className="w-3 h-3 text-visionfish-neon-pink" />
                              </span>}
                          </span>
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={viewChatHistory} 
                    title="Riwayat Chat" 
                    className="border-visionfish-neon-blue/50 text-visionfish-neon-blue hover:bg-visionfish-neon-blue/10 hover:text-visionfish-neon-blue flex items-center"
                  >
                    <History className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Riwayat</span>
                    {hasPremiumAccess(isPremium) && <Crown className="h-3 w-3 ml-1 text-visionfish-neon-pink" />}
                  </Button>
                  
                  <Button variant="outline" size="sm" onClick={handleClearChat} title="Bersihkan Chat" className="border-visionfish-neon-blue/50 text-visionfish-neon-blue hover:bg-visionfish-neon-blue/10 hover:text-visionfish-neon-blue">
                    <Trash2 className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Bersihkan</span>
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <div className="border-t border-visionfish-neon-blue/30">
            <ScrollArea className="h-[calc(100vh-280px)] sm:h-[500px] rounded-none p-4">
              <div className="space-y-4 mb-4">
                <AnimatePresence initial={false}>
                  {messages.map(message => <motion.div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`} initial={{
                  opacity: 0,
                  y: 10
                  }} animate={{
                    opacity: 1,
                    y: 0
                  }} exit={{
                    opacity: 0
                  }} transition={{
                    duration: 0.3
                  }}>
                      <div className={`group relative ${message.role === "user" ? "ai-message-user max-w-[85%] md:max-w-[70%] shadow-md hover:shadow-lg transition-shadow duration-300" : "ai-message-assistant max-w-[85%] md:max-w-[70%] shadow-md hover:shadow-lg transition-shadow duration-300"}`}>
                        {message.role === "assistant" && <div className="flex items-center mb-1">
                            {getActiveModelIcon(selectedModel)}
                            <span className="text-xs ml-2 text-muted-foreground">
                              VisionFish Assistant • {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                        </div>}
                        <div className="whitespace-pre-wrap markdown-content">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                        
                        {/* Add message actions for copy and share */}
                        <MessageActions 
                          content={message.content} 
                          position={message.role === "user" ? "top-right" : "top-right"}
                        />
                      </div>
                    </motion.div>)}
                </AnimatePresence>
                
                {isTyping && <motion.div className="flex justify-start" initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                duration: 0.3
              }}>
                    <div className="ai-message-assistant max-w-[85%] md:max-w-[70%]">
                      <div className="flex items-center mb-1">
                        {getActiveModelIcon(selectedModel)}
                        <span className="text-xs ml-2 text-muted-foreground">
                          VisionFish Assistant
                        </span>
                      </div>
                      <div className="typing-indicator-container">
                        <span className="typing-indicator"></span>
                        <span className="typing-indicator"></span>
                        <span className="typing-indicator"></span>
                      </div>
                    </div>
                  </motion.div>}
                
                {/* Invisible div for auto scroll */}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>
          
          <CardFooter className="border-t border-visionfish-neon-blue/30 p-4">
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Input 
                placeholder="Tulis pesan Anda di sini..." 
                value={inputMessage} 
                onChange={e => setInputMessage(e.target.value)} 
                className="ai-input shadow-input focus:shadow-neon-blue transition-shadow" 
                disabled={isTyping} 
              />
              <Button 
                type="submit" 
                disabled={!inputMessage.trim() || isTyping} 
                className="bg-visionfish-neon-blue hover:bg-visionfish-neon-blue/90 text-white shadow-md hover:shadow-neon-blue transition-shadow duration-300"
              >
                {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </CardFooter>
        </Card>
        
        {!hasPremiumAccess(isPremium) && <motion.div className="mt-4 p-3 bg-visionfish-neon-pink/10 border border-visionfish-neon-pink/30 rounded-md text-sm flex items-start" initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.3
      }}>
            <Crown className="w-5 h-5 mr-2 text-visionfish-neon-pink flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-visionfish-neon-pink">Batasan Pengguna Gratis:</p>
              <p>Maksimal 10 pesan per hari. Upgrade ke Premium untuk chat tanpa batas dan akses ke model AI canggih.</p>
            </div>
          </motion.div>}
      </div>

      {/* Chat History Dialog */}
      <ChatHistoryDialog 
        isOpen={showHistoryDialog} 
        onClose={() => setShowHistoryDialog(false)} 
        onSelectChat={handleSelectHistoryChat} 
      />

      <style>
        {`
        .markdown-content p {
          margin-bottom: 0.75rem;
        }
        
        .markdown-content ul, .markdown-content ol {
          margin-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .markdown-content ul {
          list-style-type: disc;
        }
        
        .markdown-content ol {
          list-style-type: decimal;
        }
        
        .markdown-content strong, 
        .markdown-content b {
          font-weight: 700;
        }
        
        .markdown-content em, 
        .markdown-content i {
          font-style: italic;
        }
        
        .markdown-content h1, 
        .markdown-content h2, 
        .markdown-content h3, 
        .markdown-content h4 {
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .markdown-content h1 {
          font-size: 1.5rem;
        }
        
        .markdown-content h2 {
          font-size: 1.25rem;
        }
        
        .markdown-content h3 {
          font-size: 1.1rem;
        }
        
        .markdown-content code {
          font-family: monospace;
          background-color: rgba(0, 0, 0, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
        }
        
        .markdown-content pre {
          background-color: rgba(0, 0, 0, 0.1);
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin-bottom: 1rem;
        }
        
        .markdown-content blockquote {
          border-left: 3px solid rgba(0, 0, 0, 0.2);
          padding-left: 1rem;
          margin-left: 0;
          margin-right: 0;
          font-style: italic;
        }
        
        .dark .markdown-content code {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .dark .markdown-content pre {
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        .dark .markdown-content blockquote {
          border-left-color: rgba(255, 255, 255, 0.2);
        }

        @media (max-width: 640px) {
          .markdown-content h1 {
            font-size: 1.3rem;
          }
          
          .markdown-content h2 {
            font-size: 1.15rem;
          }
          
          .markdown-content h3 {
            font-size: 1rem;
          }
        }
        
        .typing-indicator-container {
          display: flex;
          align-items: center;
          padding: 0.5rem;
        }
        
        .typing-indicator {
          width: 0.5rem;
          height: 0.5rem;
          margin: 0 0.15rem;
          background-color: currentColor;
          border-radius: 50%;
          opacity: 0.6;
          animation: typing-indicator 1.4s infinite both;
        }
        
        .typing-indicator:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-indicator:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing-indicator {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-0.5rem);
          }
        }
        
        .ai-message-user, .ai-message-assistant {
          border-radius: 1rem;
          padding: 0.75rem 1rem;
          margin-bottom: 0.5rem;
          position: relative;
        }
        
        .ai-message-user {
          background-color: ${theme === 'light' ? 'rgba(0, 120, 209, 0.1)' : 'rgba(120, 100, 255, 0.2)'};
          border: 1px solid ${theme === 'light' ? 'rgba(0, 120, 209, 0.15)' : 'rgba(120, 100, 255, 0.3)'};
          text-align: right;
          border-bottom-right-radius: 0.25rem;
        }
        
        .ai-message-assistant {
          background-color: ${theme === 'light' ? 'rgba(200, 200, 200, 0.15)' : 'rgba(30, 30, 30, 0.3)'};
          border: 1px solid ${theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
          border-bottom-left-radius: 0.25rem;
        }
        `}
      </style>
    </div>
  );
};

export default AIChatComponent;
