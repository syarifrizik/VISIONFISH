
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Bookmark, Eye } from 'lucide-react';

interface MobilePostActionsProps {
  likesCount: number;
  viewsCount: number;
  commentsCount?: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  onLike: () => void;
  onComment?: () => void;
  onBookmark?: () => void;
}

const MobilePostActions = ({
  likesCount,
  viewsCount,
  commentsCount = 0,
  isLiked = false,
  isBookmarked = false,
  onLike,
  onComment,
  onBookmark
}: MobilePostActionsProps) => {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-white/10">
      {/* Left side - Action buttons */}
      <div className="flex items-center gap-1">
        {/* Like */}
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLike}
            className={`h-8 px-3 rounded-xl transition-all ${
              isLiked 
                ? 'text-red-400 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-xs font-medium">{likesCount}</span>
          </Button>
        </motion.div>

        {/* Comment - icon only */}
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onComment}
            className="h-8 px-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            <span className="text-xs font-medium">{commentsCount}</span>
          </Button>
        </motion.div>

        {/* Bookmark */}
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBookmark}
            className={`h-8 w-8 p-0 rounded-xl transition-all ${
              isBookmarked
                ? 'text-yellow-400 bg-yellow-500/20 hover:bg-yellow-500/30'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>
        </motion.div>
      </div>

      {/* Right side - Views */}
      <div className="flex items-center gap-1 text-white/60 text-xs">
        <Eye className="w-3 h-3" />
        <span>{viewsCount > 999 ? `${(viewsCount / 1000).toFixed(1)}k` : viewsCount}</span>
      </div>
    </div>
  );
};

export default MobilePostActions;
