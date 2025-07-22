
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserProfile, ProfileStats } from '@/types/profile';
import CompactMobileProfileHeader from './CompactMobileProfileHeader';
import CompactMobileStatsGrid from './CompactMobileStatsGrid';
import MobileBottomNav2025 from './MobileBottomNav2025';
import EnhancedMobileGestureHandler2025 from './EnhancedMobileGestureHandler2025';

interface CompactMobileContainerProps {
  user: UserProfile;
  stats: ProfileStats;
  isPremium?: boolean;
  onStatsUpdate?: (stats: ProfileStats) => void;
  onRefresh?: () => Promise<void>;
}

const CompactMobileContainer = ({
  user,
  stats,
  isPremium = false,
  onStatsUpdate,
  onRefresh
}: CompactMobileContainerProps) => {
  const [activeTab, setActiveTab] = useState('aktivitas');
  const [currentStats, setCurrentStats] = useState(stats);

  useEffect(() => {
    setCurrentStats(stats);
  }, [stats]);

  const handleStatsUpdate = (newStats: ProfileStats) => {
    setCurrentStats(newStats);
    onStatsUpdate?.(newStats);
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <EnhancedMobileGestureHandler2025
        onRefresh={handleRefresh}
        enablePullToRefresh={true}
        enableSwipeNavigation={false}
        className="min-h-screen"
      >
        <div className="relative z-10 pb-20">
          {/* Background Effects - Subtle */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-20 left-4 w-32 h-32 bg-gradient-to-r from-cyan-400/10 to-blue-400/5 rounded-full blur-2xl" />
            <div className="absolute top-40 right-6 w-24 h-24 bg-gradient-to-r from-purple-400/10 to-pink-400/5 rounded-full blur-2xl" />
            <div className="absolute bottom-40 left-8 w-28 h-28 bg-gradient-to-r from-emerald-400/10 to-teal-400/5 rounded-full blur-2xl" />
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-4"
          >
            {/* Compact Profile Header */}
            <CompactMobileProfileHeader
              user={user}
              stats={currentStats}
              isOwnProfile={true}
              isPremium={isPremium}
              onStatsUpdate={handleStatsUpdate}
            />

            {/* Compact Stats Grid */}
            <CompactMobileStatsGrid
              stats={currentStats}
              isOwnProfile={true}
            />

            {/* Content Area */}
            <div className="px-4">
              <motion.div
                className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/20 p-6 min-h-[400px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🎣</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Konten {activeTab}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Konten untuk tab {activeTab} akan ditampilkan di sini
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Navigation */}
        <MobileBottomNav2025
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOwnProfile={true}
        />
      </EnhancedMobileGestureHandler2025>
    </div>
  );
};

export default CompactMobileContainer;
