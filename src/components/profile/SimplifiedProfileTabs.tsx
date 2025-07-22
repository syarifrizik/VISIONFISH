
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid, List, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import SmartGrid from './SmartGrid';
import NotesTab from './NotesTab';
import FollowingTab from './FollowingTab';
import EnhancedRecentActivity from './EnhancedRecentActivity';

interface SimplifiedProfileTabsProps {
  isOwnProfile?: boolean;
  userId?: string;
}

const SimplifiedProfileTabs = ({ isOwnProfile = true, userId }: SimplifiedProfileTabsProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('my-content');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const tabs = [
    {
      value: 'my-content',
      label: 'Konten Saya',
      description: 'Tangkapan ikan dan aktivitas pribadi',
      component: <SmartGrid variant="detailed" showPublicFeed={false} searchQuery={searchQuery} viewMode={viewMode} />
    },
    {
      value: 'notes',
      label: 'Catatan',
      description: 'Catatan dan jurnal pribadi',
      component: <NotesTab searchQuery={searchQuery} />
    },
    {
      value: 'activity',
      label: 'Aktivitas',
      description: 'Riwayat aktivitas terbaru',
      component: <EnhancedRecentActivity />
    },
    {
      value: 'following',
      label: 'Mengikuti',
      description: 'Pengguna yang Anda ikuti',
      component: <FollowingTab />
    }
  ];

  const currentTab = tabs.find(tab => tab.value === activeTab);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-4"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari konten, catatan, atau aktivitas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Filters Toggle */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  Ikan Terbaru
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20">
                  Catatan Terbaru
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  Bulan Ini
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20">
                  Favorit
                </Badge>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value}
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              {isMobile ? tab.label.split(' ')[0] : tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Content */}
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6"
              >
                {/* Tab Header */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {tab.label}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tab.description}
                  </p>
                </div>
                
                {/* Tab Content */}
                <div>
                  {tab.component}
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SimplifiedProfileTabs;
