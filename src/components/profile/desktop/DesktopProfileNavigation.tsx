
import { motion } from 'framer-motion';
import { Activity, BookOpen, Users, History, User, Search, Grid3X3, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DesktopProfileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const DesktopProfileNavigation = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange
}: DesktopProfileNavigationProps) => {
  const tabs = [
    { id: 'aktivitas', label: 'Aktivitas', icon: Activity, color: 'from-blue-500 to-cyan-500' },
    { id: 'catatan', label: 'Catatan', icon: BookOpen, color: 'from-emerald-500 to-teal-500' },
    { id: 'komunitas', label: 'Komunitas', icon: Users, color: 'from-purple-500 to-pink-500' },
    { id: 'riwayat', label: 'Riwayat', icon: History, color: 'from-orange-500 to-red-500' },
    { id: 'pengguna', label: 'Pengguna', icon: User, color: 'from-indigo-500 to-purple-500' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/10" />
      
      <div className="relative z-10 p-6">
        {/* Header with search and controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400"
            />
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewModeChange(viewMode === 'grid' ? 'list' : 'grid')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-xl opacity-20`}
                    layoutId="activeDesktopTab"
                    transition={{ duration: 0.3 }}
                  />
                )}
                
                <div className="relative z-10 flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default DesktopProfileNavigation;
