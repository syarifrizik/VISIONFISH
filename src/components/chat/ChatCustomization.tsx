
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Sparkles, Crown, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ChatCustomizationProps {
  conversationId: string;
  isPremium: boolean;
  onCustomizationChange: (customization: any) => void;
}

const themes = [
  { name: 'Purple Ocean', color: '#6E3482', gradient: 'from-[#6E3482] to-[#A56ABD]' },
  { name: 'Sunset Glow', color: '#FF6B6B', gradient: 'from-[#FF6B6B] to-[#4ECDC4]' },
  { name: 'Forest Green', color: '#2ECC71', gradient: 'from-[#2ECC71] to-[#27AE60]' },
  { name: 'Ocean Blue', color: '#3498DB', gradient: 'from-[#3498DB] to-[#2980B9]' },
  { name: 'Rose Gold', color: '#E91E63', gradient: 'from-[#E91E63] to-[#FF9800]' },
  { name: 'Midnight', color: '#2C3E50', gradient: 'from-[#2C3E50] to-[#34495E]' },
];

const backgroundPatterns = [
  { name: 'Default', value: 'default' },
  { name: 'Bubbles', value: 'bubbles' },
  { name: 'Hearts', value: 'hearts' },
  { name: 'Stars', value: 'stars' },
  { name: 'Waves', value: 'waves' },
];

const bubbleStyles = [
  { name: 'Modern', value: 'modern' },
  { name: 'Classic', value: 'classic' },
  { name: 'Rounded', value: 'rounded' },
  { name: 'Sharp', value: 'sharp' },
];

const ChatCustomization = ({ conversationId, isPremium, onCustomizationChange }: ChatCustomizationProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [customization, setCustomization] = useState({
    theme_color: '#6E3482',
    background_pattern: 'default',
    bubble_style: 'modern',
    emoji_reactions_enabled: true,
    custom_sounds: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id && isPremium) {
      loadCustomization();
    }
  }, [user?.id, conversationId, isPremium]);

  const loadCustomization = async () => {
    try {
      const { data } = await supabase
        .from('chat_customizations')
        .select('*')
        .eq('user_id', user?.id)
        .eq('conversation_id', conversationId)
        .single();

      if (data) {
        setCustomization(data);
        onCustomizationChange(data);
      }
    } catch (error) {
      console.log('No existing customization found');
    }
  };

  const saveCustomization = async (newCustomization: any) => {
    if (!user?.id || !isPremium) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('chat_customizations')
        .upsert({
          user_id: user.id,
          conversation_id: conversationId,
          ...newCustomization,
          is_premium_feature: true,
        });

      if (error) throw error;

      setCustomization(newCustomization);
      onCustomizationChange(newCustomization);
    } catch (error) {
      console.error('Error saving customization:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (theme: any) => {
    const newCustomization = { ...customization, theme_color: theme.color };
    saveCustomization(newCustomization);
  };

  const handlePatternChange = (pattern: string) => {
    const newCustomization = { ...customization, background_pattern: pattern };
    saveCustomization(newCustomization);
  };

  const handleBubbleStyleChange = (style: string) => {
    const newCustomization = { ...customization, bubble_style: style };
    saveCustomization(newCustomization);
  };

  const toggleFeature = (feature: string) => {
    const newCustomization = { ...customization, [feature]: !customization[feature as keyof typeof customization] };
    saveCustomization(newCustomization);
  };

  if (!isPremium) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#A56ABD] hover:bg-white/10"
          >
            <Palette className="w-4 h-4 mr-2" />
            Customize
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gradient-to-br from-[#49225B] via-[#6E3482] to-[#A56ABD] border-[#A56ABD]/20 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#F5EBFA]">
              <Crown className="w-5 h-5 text-yellow-400" />
              Premium Feature
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Unlock Chat Customization</h3>
            <p className="text-[#E7D0EF] mb-6">
              Personalisasi tampilan chat dengan tema, pattern, dan fitur eksklusif premium!
            </p>
            <Button className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:from-yellow-300 hover:to-orange-300">
              Upgrade ke Premium
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-[#A56ABD] hover:bg-white/10"
        >
          <Palette className="w-4 h-4 mr-2" />
          Customize
          <Badge className="ml-2 bg-yellow-400 text-black text-xs">Premium</Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-[#49225B] via-[#6E3482] to-[#A56ABD] border-[#A56ABD]/20 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#F5EBFA]">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            Chat Customization
            <Badge className="bg-yellow-400 text-black text-xs">Premium</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Theme Colors */}
          <div>
            <h4 className="font-semibold mb-3 text-[#F5EBFA]">Chat Theme</h4>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((theme) => (
                <motion.button
                  key={theme.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleThemeChange(theme)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    customization.theme_color === theme.color
                      ? 'border-yellow-400'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                  style={{ background: `linear-gradient(135deg, ${theme.color}, ${theme.color}dd)` }}
                >
                  <div className="text-white text-sm font-medium">{theme.name}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Background Patterns */}
          <div>
            <h4 className="font-semibold mb-3 text-[#F5EBFA]">Background Pattern</h4>
            <div className="grid grid-cols-5 gap-2">
              {backgroundPatterns.map((pattern) => (
                <Button
                  key={pattern.value}
                  variant={customization.background_pattern === pattern.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePatternChange(pattern.value)}
                  className={`text-xs ${
                    customization.background_pattern === pattern.value
                      ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                      : 'border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  {pattern.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Bubble Styles */}
          <div>
            <h4 className="font-semibold mb-3 text-[#F5EBFA]">Bubble Style</h4>
            <div className="grid grid-cols-4 gap-2">
              {bubbleStyles.map((style) => (
                <Button
                  key={style.value}
                  variant={customization.bubble_style === style.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleBubbleStyleChange(style.value)}
                  className={`text-xs ${
                    customization.bubble_style === style.value
                      ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                      : 'border-white/20 text-white hover:bg-white/10'
                  }`}
                >
                  {style.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-3">
            <h4 className="font-semibold text-[#F5EBFA]">Features</h4>
            
            <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Emoji Reactions</span>
              </div>
              <Button
                variant={customization.emoji_reactions_enabled ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFeature('emoji_reactions_enabled')}
                className={customization.emoji_reactions_enabled 
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300' 
                  : 'border-white/20 text-white hover:bg-white/10'
                }
              >
                {customization.emoji_reactions_enabled ? 'ON' : 'OFF'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Custom Sounds</span>
              </div>
              <Button
                variant={customization.custom_sounds ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFeature('custom_sounds')}
                className={customization.custom_sounds 
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300' 
                  : 'border-white/20 text-white hover:bg-white/10'
                }
              >
                {customization.custom_sounds ? 'ON' : 'OFF'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatCustomization;
