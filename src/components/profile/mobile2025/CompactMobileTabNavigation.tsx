
import React from 'react';
import { motion } from 'framer-motion';

interface TabCounts {
  all: number;
  following: number;
  followers: number;
}

interface CompactMobileTabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: TabCounts;
}

const CompactMobileTabNavigation = ({
  activeTab,
  onTabChange,
  counts
}: CompactMobileTabNavigationProps) => {
  const tabs = [
    { id: 'all', label: 'Semua', count: counts.all },
    { id: 'following', label: 'Diikuti', count: counts.following },
    { id: 'followers', label: 'Pengikut', count: counts.followers }
  ];

  return (
    <div className="flex overflow-x-auto scrollbar-hide px-4 py-3 gap-2 bg-white/5 backdrop-blur-xl border-b border-white/10">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${
            activeTab === tab.id
              ? 'bg-white/20 text-white border border-white/30 shadow-lg'
              : 'text-white/60 hover:bg-white/10 hover:text-white/80'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <span className="whitespace-nowrap">{tab.label}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            activeTab === tab.id 
              ? 'bg-white/20 text-white' 
              : 'bg-white/10 text-white/50'
          }`}>
            {tab.count}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default CompactMobileTabNavigation;
