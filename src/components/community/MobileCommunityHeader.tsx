
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, RotateCcw, Search, Settings, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface MobileCommunityHeaderProps {
  onRefresh: () => void;
  onCreatePost: () => void;
  onSearch?: () => void;
  onFilter?: () => void;
}

const MobileCommunityHeader = ({ 
  onRefresh, 
  onCreatePost, 
  onSearch, 
  onFilter 
}: MobileCommunityHeaderProps) => {
  const { user } = useAuth();

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-20 bg-white/10 backdrop-blur-2xl border-b border-white/10"
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Title */}
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">
            Komunitas
          </h1>
          <p className="text-xs text-white/60">
            Berbagi & Belajar
          </p>
        </div>
        
        {/* Right side - Action buttons */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <Button
            onClick={onSearch}
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <Search className="w-4 h-4" />
          </Button>

          {/* Filter */}
          <Button
            onClick={onFilter}
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <Filter className="w-4 h-4" />
          </Button>

          {/* Refresh */}
          <Button
            onClick={onRefresh}
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0 text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          {/* Create Post */}
          {user && (
            <Button
              onClick={onCreatePost}
              size="sm"
              className="h-9 w-9 p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg ml-1"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MobileCommunityHeader;
