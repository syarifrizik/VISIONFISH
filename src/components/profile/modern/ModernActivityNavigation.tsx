
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  BarChart3, 
  Sparkles,
  TrendingUp,
  Target,
  Calendar,
  Filter,
  Share2
} from 'lucide-react';

interface ModernActivityNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats?: {
    totalActivities: number;
    todayActivities: number;
    weeklyGrowth: number;
  };
}

const ModernActivityNavigation = ({ 
  activeTab, 
  onTabChange, 
  stats = { totalActivities: 0, todayActivities: 0, weeklyGrowth: 0 }
}: ModernActivityNavigationProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const tabs = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: Sparkles,
      description: 'Quick insights & summary',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3,
      description: 'Deep dive & trends',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Quick Stats Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Activity Center</h2>
            <p className="text-white/70 text-sm">Track your progress and insights</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2"
          >
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center p-4 bg-white/5 rounded-2xl border border-white/10"
          >
            <div className="text-2xl font-bold text-white">{stats.totalActivities}</div>
            <div className="text-white/60 text-sm">Total</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center p-4 bg-white/5 rounded-2xl border border-white/10"
          >
            <div className="text-2xl font-bold text-white">{stats.todayActivities}</div>
            <div className="text-white/60 text-sm">Today</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center p-4 bg-white/5 rounded-2xl border border-white/10"
          >
            <div className="text-2xl font-bold text-green-400">
              +{stats.weeklyGrowth}%
            </div>
            <div className="text-white/60 text-sm">Growth</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Modern Tab Navigation */}
      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-2">
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <div className="flex items-center gap-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <motion.div
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    variant="ghost"
                    onClick={() => onTabChange(tab.id)}
                    className={`w-full h-16 p-4 transition-all duration-300 rounded-2xl ${
                      isActive 
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-blue-600/25` 
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        isActive ? 'bg-white/20' : 'bg-white/10'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">{tab.label}</div>
                        <div className="text-xs opacity-80">{tab.description}</div>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex items-center gap-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <motion.div
                  key={tab.id}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1"
                >
                  <Button
                    variant="ghost"
                    onClick={() => onTabChange(tab.id)}
                    className={`w-full h-14 p-3 transition-all duration-300 rounded-2xl ${
                      isActive 
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg` 
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <IconComponent className="w-5 h-5" />
                      <span className="text-xs font-medium">{tab.label}</span>
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Active Tab Description - Mobile */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-3 pt-3 border-t border-white/10"
          >
            <div className="text-center">
              <p className="text-white/60 text-sm">
                {tabs.find(tab => tab.id === activeTab)?.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernActivityNavigation;
