
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, MessageCircle, Sparkles, FileText, X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { EnhancedWeatherData, FishingConditions } from '@/utils/enhanced-weather';
import { useAquacultureAI } from '@/hooks/useAquacultureAI';
import { useIsMobile } from '@/hooks/use-mobile';

interface AquacultureAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  weatherData: EnhancedWeatherData;
  fishingConditions: FishingConditions;
}

export const AquacultureAIModal = ({
  isOpen,
  onClose,
  weatherData,
  fishingConditions
}: AquacultureAIModalProps) => {
  const isMobile = useIsMobile();
  const [userQuestion, setUserQuestion] = useState('');
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }>>([]);

  const { generateAquacultureAdvice, isLoading, resetConversation } = useAquacultureAI();

  const handleSendQuestion = async () => {
    if (!userQuestion.trim() || isLoading) return;

    const newUserMessage = {
      type: 'user' as const,
      content: userQuestion,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, newUserMessage]);
    setUserQuestion('');

    try {
      const aiResponse = await generateAquacultureAdvice(
        weatherData,
        fishingConditions,
        userQuestion
      );

      const aiMessage = {
        type: 'ai' as const,
        content: aiResponse,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
    }
  };

  const handleQuickConsultation = async () => {
    if (isLoading) return;

    const quickMessage = {
      type: 'user' as const,
      content: 'Berikan analisis dan rekomendasi lengkap untuk kondisi akuakultur saat ini',
      timestamp: new Date()
    };

    setConversation(prev => [...prev, quickMessage]);

    try {
      const aiResponse = await generateAquacultureAdvice(weatherData, fishingConditions);

      const aiMessage = {
        type: 'ai' as const,
        content: aiResponse,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
    }
  };

  const handleResetConversation = () => {
    setConversation([]);
    resetConversation();
    setUserQuestion('');
  };

  const quickQuestions = [
    "Bagaimana optimalisasi feeding dalam kondisi ini?",
    "Spesies apa yang paling cocok untuk kondisi saat ini?", 
    "Apa yang harus disiapkan untuk perubahan cuaca?",
    "Bagaimana prediksi kualitas air hari ini?",
    "Rekomendasi stocking density untuk kondisi ini?",
    "Strategi mitigasi risiko untuk kondisi weather ini?",
    "Tips praktis untuk meningkatkan FCR?",
    "Bagaimana cara monitoring yang efektif?"
  ];

  // Randomly select questions to show variety
  const getRandomQuestions = () => {
    const shuffled = [...quickQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMobile ? 'max-w-[95vw] h-[90vh]' : 'max-w-4xl h-[85vh]'} p-0 gap-0 rounded-3xl border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-[30px]`}>
        {/* Enhanced Modern Header with 2025+ Design */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <DialogHeader className="relative p-6 pb-4 border-b border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                    VisionFish AI Expert
                  </DialogTitle>
                  <Badge variant="outline" className="mt-1 bg-white/50 text-blue-700 border-blue-200/50 backdrop-blur-sm">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Smart Aquaculture AI
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {conversation.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetConversation}
                    className="text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-2xl transition-all duration-200"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-2xl transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Weather Context Card */}
          <div className="mx-6 mt-4 p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-[20px] border border-white/30 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">Real-time Environmental Data</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
              <div className="flex items-center gap-4">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">📍 {weatherData.location}</span>
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-lg">🌡️ {weatherData.temperature}°C</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900/30 rounded-lg">☁️ {weatherData.condition}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Aquaculture Suitability Score:</span>
                <Badge variant="secondary" className="text-xs bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-200">
                  {fishingConditions.overallScore}/10 • {fishingConditions.category}
                </Badge>
              </div>
            </div>
          </div>

          {/* Enhanced Chat Area with Modern Styling */}
          <div className="flex-1 mx-6 my-4 rounded-2xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-[25px] border border-white/20 overflow-hidden shadow-inner">
            <ScrollArea className="h-full p-4">
              <AnimatePresence>
                {conversation.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-800/20 dark:to-purple-800/20 flex items-center justify-center shadow-xl">
                      <MessageCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                      AI Aquaculture Consultation
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                      Dapatkan analisis mendalam dan rekomendasi expert untuk kondisi akuakultur berdasarkan data cuaca real-time
                    </p>
                    <Button 
                      onClick={handleQuickConsultation} 
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl px-8 py-3 rounded-2xl transition-all duration-300 hover:scale-105"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="w-5 h-5 mr-2" />
                      )}
                      Start Expert Analysis
                    </Button>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    {conversation.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] ${message.type === 'user' ? 'order-1' : 'order-2'}`}>
                          <div
                            className={`p-4 shadow-lg ${
                              message.type === 'user'
                                ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white ml-4 rounded-[24px_24px_8px_24px]'
                                : 'bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-white/40 mr-4 rounded-[24px_24px_24px_8px]'
                            }`}
                          >
                            {message.type === 'ai' ? (
                              <div className="prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown>
                                  {message.content}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              <p className="text-sm leading-relaxed">{message.content}</p>
                            )}
                          </div>
                          <div className={`text-xs mt-2 px-2 ${
                            message.type === 'user' 
                              ? 'text-gray-500 text-right' 
                              : 'text-gray-400'
                          }`}>
                            {message.timestamp.toLocaleTimeString('id-ID', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-white/40 p-4 rounded-[24px_24px_24px_8px] max-w-[85%] mr-4 shadow-lg">
                          <div className="flex items-center gap-3">
                            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                            <span className="text-sm text-gray-600 dark:text-gray-300">AI sedang menganalisis kondisi...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </div>

          {/* Dynamic Quick Questions */}
          {conversation.length === 0 && (
            <div className="mx-6 mb-4 space-y-3">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Questions:</div>
              <div className="flex flex-wrap gap-2">
                {getRandomQuestions().map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setUserQuestion(question)}
                    className="text-xs h-auto py-2 px-3 bg-white/60 hover:bg-white/80 border-white/40 text-gray-600 hover:text-gray-800 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Input Area */}
          <div className="mx-6 mb-6 p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-[20px] border border-white/30 shadow-lg">
            <div className="flex gap-3">
              <Textarea
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="Tanyakan tentang manajemen pakan, kualitas air, pemilihan spesies, atau strategi akuakultur lainnya..."
                className="flex-1 min-h-[80px] resize-none bg-white/70 dark:bg-gray-700/70 border-white/50 focus:border-blue-300 placeholder:text-gray-500 rounded-xl backdrop-blur-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendQuestion();
                  }
                }}
              />
              <Button 
                onClick={handleSendQuestion} 
                disabled={!userQuestion.trim() || isLoading}
                size="lg"
                className="self-end bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 rounded-2xl shadow-lg transition-all duration-200 hover:scale-105"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
