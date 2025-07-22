
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface EmoteBarProps {
  onEmoteSelect: (emote: string) => void;
  onClose: () => void;
}

const EMOTE_CATEGORIES = {
  recent: { name: 'Terbaru', emotes: ['😊', '😂', '❤️', '👍', '😍', '🔥', '💯', '🎉'] },
  faces: { 
    name: 'Wajah', 
    emotes: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '😋', '😎', '😍', '🥰', '😘', '😗', '😚', '😙', '😜', '🤪', '😝', '🤑', '🤗', '🤫', '🤔']
  },
  gestures: { 
    name: 'Gesture', 
    emotes: ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '👏', '🙌', '🤲', '🤝', '🙏']
  },
  nature: { 
    name: 'Alam', 
    emotes: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦢', '🦅']
  },
  objects: { 
    name: 'Objek', 
    emotes: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '⛳', '🏹', '🎣', '🥊', '🥋', '🎽', '🛹', '🛷']
  }
};

const EmoteBar = ({ onEmoteSelect, onClose }: EmoteBarProps) => {
  const [activeCategory, setActiveCategory] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();

  const filteredEmotes = searchQuery
    ? Object.values(EMOTE_CATEGORIES)
        .flatMap(category => category.emotes)
        .filter(emote => 
          emote.includes(searchQuery) || 
          Object.entries(EMOTE_CATEGORIES).some(([key, cat]) => 
            cat.emotes.includes(emote) && cat.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
    : EMOTE_CATEGORIES[activeCategory as keyof typeof EMOTE_CATEGORIES].emotes;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`absolute left-4 md:left-6 right-4 md:right-6 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-4 z-40 ${
        isMobile ? 'bottom-20 max-h-64' : 'bottom-24 max-h-80'
      }`}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : 'text-lg'}`}>
          Pilih Emoji
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 rounded-full p-1"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Cari emoji..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`pl-10 bg-gray-50/50 border-gray-200/50 rounded-xl ${isMobile ? 'text-sm h-8' : 'text-sm'} text-gray-900 placeholder-gray-500`}
          style={{ color: '#1f2937' }}
        />
      </div>

      {/* Categories */}
      {!searchQuery && (
        <div className={`flex gap-1 mb-3 overflow-x-auto pb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          {Object.entries(EMOTE_CATEGORIES).map(([key, category]) => (
            <Button
              key={key}
              variant={activeCategory === key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveCategory(key)}
              className={`whitespace-nowrap rounded-xl ${isMobile ? 'text-xs px-2 py-1 h-7' : 'text-xs'} ${
                activeCategory === key
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>
      )}

      {/* Emotes Grid */}
      <div className={`grid ${isMobile ? 'grid-cols-6 gap-1 max-h-32' : 'grid-cols-8 gap-2 max-h-40'} overflow-y-auto`}>
        {filteredEmotes.slice(0, isMobile ? 24 : 40).map((emote, index) => (
          <motion.button
            key={`${emote}-${index}`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEmoteSelect(emote)}
            className={`${isMobile ? 'w-6 h-6 text-lg' : 'w-8 h-8 text-xl'} flex items-center justify-center hover:bg-gray-100/50 rounded-lg transition-colors`}
          >
            {emote}
          </motion.button>
        ))}
      </div>

      {filteredEmotes.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <p className="text-sm">Tidak ada emoji yang ditemukan</p>
        </div>
      )}
    </motion.div>
  );
};

export default EmoteBar;
