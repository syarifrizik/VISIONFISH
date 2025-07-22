
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserCheck, UserX, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import AllUsersSubTab from './users/AllUsersSubTab';
import FollowersSubTab from './users/FollowersSubTab';
import NonFollowersSubTab from './users/NonFollowersSubTab';

interface UsersTabProps {
  searchQuery?: string;
  onItemCountChange?: (count: number) => void;
}

const UsersTab = ({ searchQuery = '', onItemCountChange }: UsersTabProps) => {
  const isMobile = useIsMobile();
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [counts, setCounts] = useState({
    all: 0,
    followers: 0,
    nonFollowers: 0
  });
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);

  const subTabs = [
    {
      id: 'all',
      label: 'Semua',
      icon: Users,
      description: 'Semua pengguna',
      color: 'from-blue-500 to-cyan-500',
      count: counts.all
    },
    {
      id: 'followers',
      label: 'Followers',
      icon: UserCheck,
      description: 'Yang mengikuti Anda',
      color: 'from-green-500 to-emerald-500',
      count: counts.followers
    },
    {
      id: 'nonFollowers',
      label: 'Discover',
      icon: UserX,
      description: 'Pengguna baru',
      color: 'from-purple-500 to-pink-500',
      count: counts.nonFollowers
    }
  ];

  // Stable callback to prevent infinite loops
  const handleCountUpdate = useCallback((subTabId: string, count: number) => {
    setCounts(prev => {
      if (prev[subTabId as keyof typeof prev] !== count) {
        return { ...prev, [subTabId]: count };
      }
      return prev;
    });
  }, []);

  // Calculate total and update parent component
  useEffect(() => {
    const totalCount = counts.all + counts.followers + counts.nonFollowers;
    if (onItemCountChange) {
      onItemCountChange(totalCount);
    }
    setIsLoadingCounts(false);
  }, [counts, onItemCountChange]);

  // Sync with parent search query
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'all':
        return (
          <AllUsersSubTab 
            searchQuery={localSearchQuery}
            onCountChange={(count) => handleCountUpdate('all', count)}
          />
        );
      case 'followers':
        return (
          <FollowersSubTab 
            searchQuery={localSearchQuery}
            onCountChange={(count) => handleCountUpdate('followers', count)}
          />
        );
      case 'nonFollowers':
        return (
          <NonFollowersSubTab 
            searchQuery={localSearchQuery}
            onCountChange={(count) => handleCountUpdate('nonFollowers', count)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-${isMobile ? '4' : '6'} ${isMobile ? 'px-0' : 'px-0'}`}>
      {/* Sub-Tab Navigation with Glassmorphism - Removed padding that causes overflow */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/30 p-4 shadow-xl">
        <div className={`flex flex-col ${isMobile ? 'gap-3' : 'sm:flex-row gap-4'} items-start ${isMobile ? '' : 'sm:items-center'} justify-between ${isMobile ? 'mb-4' : 'mb-4'}`}>
          <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900 dark:text-white flex items-center gap-2`}>
            <Users className={`${isMobile ? 'w-5 h-5' : 'w-5 h-5'}`} />
            Pengguna
          </h3>
          
          {/* Local Search for Users */}
          <div className={`relative flex-1 ${isMobile ? 'w-full' : 'max-w-sm'}`}>
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isMobile ? 'w-4 h-4' : 'w-4 h-4'} text-gray-400`} />
            <Input
              placeholder="Cari pengguna..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className={`${isMobile ? 'pl-10 h-10 text-sm' : 'pl-10 h-9'} bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30 rounded-xl`}
            />
          </div>
        </div>

        {/* Sub-Tab Buttons - Fixed overflow and better mobile layout */}
        <div className={`flex ${isMobile ? 'gap-2' : 'gap-3'} ${isMobile ? 'justify-between' : ''}`}>
          {subTabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeSubTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`relative flex items-center gap-2 ${isMobile ? 'px-3 py-2.5 flex-1' : 'px-4 py-2.5'} rounded-xl font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-white shadow-lg scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/40 dark:hover:bg-gray-800/40'
                } ${isMobile ? 'min-h-[44px] justify-center text-center' : ''}`}
                whileHover={{ scale: isActive ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSubTab"
                    className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-xl`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                
                <div className={`relative z-10 flex items-center gap-2 ${isMobile ? 'flex-col' : ''}`}>
                  <IconComponent className={`${isMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
                  <span className={`${isMobile ? 'text-sm' : 'text-sm'}`}>{tab.label}</span>
                  {(tab.count > 0 || isLoadingCounts) && (
                    <Badge className={`${isMobile ? 'text-xs h-4 px-1.5' : 'text-xs h-5 px-1.5'} ${
                      isActive 
                        ? 'bg-white/30 text-white border-white/30' 
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                    } ${isMobile ? 'min-w-[20px]' : ''}`}>
                      {isLoadingCounts ? '...' : (tab.count > 999 ? '999+' : tab.count)}
                    </Badge>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Sub-Tab Content - Fixed mobile padding and removed overflow issues */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: isMobile ? -10 : -20 }}
          transition={{ duration: 0.3 }}
          className={`${isMobile ? 'min-h-[320px]' : 'min-h-[400px]'}`}
        >
          <div className={isMobile ? 'px-0' : ''}>
            {renderSubTabContent()}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default UsersTab;
