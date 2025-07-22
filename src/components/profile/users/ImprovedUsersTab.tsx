import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserCheck, UserX, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { useOptimizedUserCounts } from '@/hooks/useOptimizedUserCounts';
import AllUsersSubTab from './AllUsersSubTab';
import FollowersSubTab from './FollowersSubTab';
import NonFollowersSubTab from './NonFollowersSubTab';

interface ImprovedUsersTabProps {
  searchQuery?: string;
  onItemCountChange?: (count: number) => void;
}

const ImprovedUsersTab = ({ searchQuery = '', onItemCountChange }: ImprovedUsersTabProps) => {
  const isMobile = useIsMobile();
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const { counts, isLoading, error, refreshCounts, updateActiveTabCount } = useOptimizedUserCounts();

  const subTabs = [
    {
      id: 'all',
      label: 'All',
      icon: Users,
      description: 'Semua pengguna',
      color: 'from-blue-500 to-cyan-500',
      count: counts.all
    },
    {
      id: 'followers', 
      label: 'Follow',
      icon: UserCheck,
      description: 'Yang mengikuti Anda',
      color: 'from-green-500 to-emerald-500',
      count: counts.followers
    },
    {
      id: 'nonFollowers',
      label: 'New',
      icon: UserX,
      description: 'Pengguna baru',
      color: 'from-purple-500 to-pink-500',
      count: counts.nonFollowers
    }
  ];

  // Handle count updates from sub-tabs
  const handleSubTabCountUpdate = useCallback((subTabId: string, count: number) => {
    // Only update if this is the currently active tab
    if (subTabId === activeSubTab) {
      updateActiveTabCount(subTabId, count);
      
      // Notify parent component with the current active tab count
      if (onItemCountChange) {
        onItemCountChange(count);
      }
    }
  }, [activeSubTab, updateActiveTabCount, onItemCountChange]);

  // Update parent when active tab changes
  useEffect(() => {
    if (onItemCountChange) {
      onItemCountChange(counts.total);
    }
  }, [counts.total, onItemCountChange]);

  // Sync with parent search query
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Handle tab changes
  const handleTabChange = useCallback((newTabId: string) => {
    setActiveSubTab(newTabId);
    // Update active tab count immediately based on base counts
    const newCount = counts[newTabId as keyof typeof counts] || 0;
    updateActiveTabCount(newTabId, newCount);
  }, [counts, updateActiveTabCount]);

  const renderSubTabContent = () => {
    const commonProps = {
      searchQuery: localSearchQuery,
      onCountChange: (count: number) => handleSubTabCountUpdate(activeSubTab, count)
    };

    switch (activeSubTab) {
      case 'all':
        return <AllUsersSubTab {...commonProps} />;
      case 'followers':
        return <FollowersSubTab {...commonProps} />;
      case 'nonFollowers':
        return <NonFollowersSubTab {...commonProps} />;
      default:
        return <AllUsersSubTab {...commonProps} />;
    }
  };

  if (error) {
    return (
      <div className="text-center py-4 px-1">
        <p className="text-red-600 dark:text-red-400 mb-2 text-sm">{error}</p>
        <button 
          onClick={refreshCounts}
          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {/* Ultra-compact mobile header */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-lg border border-white/30 dark:border-gray-700/30 p-1.5 shadow-lg">
        <div className="flex flex-col gap-1.5 items-start justify-between mb-1.5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
            <Users className="w-3 h-3" />
            Pengguna
            {isLoading && (
              <div className="w-2 h-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin ml-1" />
            )}
          </h3>
          
          {/* Ultra-compact search */}
          <div className="relative w-full">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 text-gray-400" />
            <Input
              placeholder="Cari..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-6 h-7 text-[10px] bg-white/60 dark:bg-gray-800/60 border-white/40 dark:border-gray-700/40 rounded-md focus:ring-1 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Ultra-compact Sub-Tab Buttons */}
        <div className="flex gap-0">
          {subTabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeSubTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex items-center justify-center gap-0.5 px-0 py-2 flex-1 rounded-md font-semibold transition-all duration-300 ${
                  isActive
                    ? 'text-white shadow-lg scale-[1.01]'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50'
                } min-h-[40px] text-center`}
                whileHover={{ scale: isActive ? 1.01 : 1.005 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation'
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSubTab"
                    className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-md`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                  />
                )}
                
                <div className="relative z-10 flex flex-col items-center gap-0.5">
                  <IconComponent className="w-3 h-3" />
                  <Badge className={`text-[7px] h-3 px-0.5 font-medium ${
                    isActive 
                      ? 'bg-white/35 text-white border-white/35' 
                      : 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                  } min-w-[14px]`}>
                    {isLoading ? '..' : (tab.count > 99 ? '99+' : tab.count)}
                  </Badge>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Content with minimal padding */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: 0.15 }}
          className="min-h-[200px]"
        >
          {renderSubTabContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ImprovedUsersTab;
