
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Bookmark } from 'lucide-react';

interface MobileTabNavigationProps {
  activeTab: 'posts' | 'saved';
  onTabChange: (tab: 'posts' | 'saved') => void;
  postsCount?: number;
  savedCount?: number;
}

const MobileTabNavigation = ({ 
  activeTab, 
  onTabChange, 
  postsCount = 0, 
  savedCount = 0 
}: MobileTabNavigationProps) => {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center bg-white/5 backdrop-blur-xl rounded-2xl p-1 border border-white/10">
        {/* All Posts Tab */}
        <Button
          variant={activeTab === 'posts' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('posts')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'posts'
              ? 'bg-white/20 backdrop-blur-xl border border-white/30 text-white shadow-lg'
              : 'text-white/70 hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden xs:inline">Posts</span>
          {postsCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-blue-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
            >
              {postsCount > 99 ? '99+' : postsCount}
            </motion.span>
          )}
        </Button>

        {/* Saved Posts Tab */}
        <Button
          variant={activeTab === 'saved' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('saved')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'saved'
              ? 'bg-white/20 backdrop-blur-xl border border-white/30 text-white shadow-lg'
              : 'text-white/70 hover:bg-white/5'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span className="hidden xs:inline">Saved</span>
          {savedCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-yellow-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
            >
              {savedCount > 99 ? '99+' : savedCount}
            </motion.span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MobileTabNavigation;
