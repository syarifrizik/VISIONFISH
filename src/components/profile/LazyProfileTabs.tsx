
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  User,
  BookOpen,
  Globe,
  Activity,
  Users,
  TrendingUp,
  Plus,
  MoreHorizontal,
  Sparkles,
  ArrowRight,
  Clock,
  Star
} from 'lucide-react';

interface LazyProfileTabsProps {
  isOwnProfile?: boolean;
  userId: string;
  profileUserId: string;
}

const LazyProfileTabs = ({
  isOwnProfile = true,
  userId,
  profileUserId
}: LazyProfileTabsProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('aktivitas-saya');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [animatedCounts, setAnimatedCounts] = useState<Record<string, number>>({});

  // Enhanced tab configuration with better design
  const tabs = [
    {
      id: 'aktivitas-saya',
      label: isMobile ? 'Aktivitas' : 'Aktivitas Saya',
      icon: User,
      count: 45,
      trend: '+12%',
      color: 'from-blue-500 via-blue-600 to-cyan-500',
      bgColor: 'from-blue-50/90 via-blue-100/60 to-cyan-50/90 dark:from-blue-900/30 dark:via-blue-800/20 dark:to-cyan-900/30',
      glowColor: 'shadow-blue-500/25',
      description: 'Semua aktivitas pribadi Anda',
      emoji: '🎯'
    },
    {
      id: 'catatan-saya',
      label: isMobile ? 'Catatan' : 'Catatan Saya',
      icon: BookOpen,
      count: 28,
      trend: '+8%',
      color: 'from-emerald-500 via-emerald-600 to-teal-500',
      bgColor: 'from-emerald-50/90 via-emerald-100/60 to-teal-50/90 dark:from-emerald-900/30 dark:via-emerald-800/20 dark:to-teal-900/30',
      glowColor: 'shadow-emerald-500/25',
      description: 'Catatan dan jurnal tangkapan ikan',
      emoji: '📚'
    },
    {
      id: 'feed-komunitas',
      label: isMobile ? 'Komunitas' : 'Feed Komunitas',
      icon: Globe,
      count: 156,
      trend: '+25%',
      color: 'from-purple-500 via-purple-600 to-pink-500',
      bgColor: 'from-purple-50/90 via-purple-100/60 to-pink-50/90 dark:from-purple-900/30 dark:via-purple-800/20 dark:to-pink-900/30',
      glowColor: 'shadow-purple-500/25',
      description: 'Aktivitas terbaru dari komunitas',
      emoji: '🌍'
    },
    {
      id: 'riwayat-aktivitas',
      label: isMobile ? 'Riwayat' : 'Riwayat Aktivitas',
      icon: Activity,
      count: 89,
      trend: '+15%',
      color: 'from-orange-500 via-orange-600 to-red-500',
      bgColor: 'from-orange-50/90 via-orange-100/60 to-red-50/90 dark:from-orange-900/30 dark:via-orange-800/20 dark:to-red-900/30',
      glowColor: 'shadow-orange-500/25',
      description: 'Log aktivitas dan interaksi',
      emoji: '📈'
    },
    {
      id: 'pengguna',
      label: 'Pengguna',
      icon: Users,
      count: 342,
      trend: '+30%',
      color: 'from-indigo-500 via-indigo-600 to-purple-500',
      bgColor: 'from-indigo-50/90 via-indigo-100/60 to-purple-50/90 dark:from-indigo-900/30 dark:via-indigo-800/20 dark:to-purple-900/30',
      glowColor: 'shadow-indigo-500/25',
      description: 'Jelajahi pengguna lain',
      emoji: '👥'
    }
  ];

  // Animated counter effect
  useEffect(() => {
    tabs.forEach((tab) => {
      let start = 0;
      const end = tab.count;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setAnimatedCounts(prev => ({ ...prev, [tab.id]: end }));
          clearInterval(timer);
        } else {
          setAnimatedCounts(prev => ({ ...prev, [tab.id]: Math.floor(start) }));
        }
      }, 16);
    });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: isMobile ? 10 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.98,
      transition: { duration: 0.3 }
    }
  };

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        
        {/* Enhanced Search & Filter Bar */}
        <motion.div 
          variants={itemVariants}
          className={`${isMobile ? 'mb-4 mx-1' : 'mb-8'} space-y-4`}
        >
          <Card className="border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500">
            <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
              <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'flex-row items-center'} gap-3`}>
                {/* Enhanced Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    placeholder={`Cari di ${currentTab?.label || 'aktivitas'}... ${currentTab?.emoji || '🔍'}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-12 ${
                      isMobile 
                        ? 'h-12 text-sm bg-white/95 dark:bg-gray-800/95' 
                        : 'h-14 bg-white/90 dark:bg-gray-800/90'
                    } border-white/50 dark:border-gray-700/50 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 rounded-2xl shadow-inner`}
                  />
                  <motion.div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    animate={{ rotate: searchQuery ? 360 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Sparkles className="w-4 h-4 text-blue-500" />
                  </motion.div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className={`flex items-center gap-3 ${isMobile ? 'justify-between' : ''}`}>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size={isMobile ? "sm" : "default"}
                      onClick={() => setFilterOpen(!filterOpen)}
                      className={`${
                        isMobile ? 'h-12 px-4' : 'h-14 px-6'
                      } bg-white/80 dark:bg-gray-800/80 border-white/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-300 rounded-2xl ${
                        filterOpen ? 'bg-white dark:bg-gray-700 shadow-lg' : ''
                      }`}
                    >
                      <Filter className="w-4 h-4" />
                      {!isMobile && <span className="ml-2">Filter</span>}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size={isMobile ? "sm" : "default"}
                      onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                      className={`${
                        isMobile ? 'h-12 px-4' : 'h-14 px-6'
                      } bg-white/80 dark:bg-gray-800/80 border-white/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-300 rounded-2xl`}
                    >
                      {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
                      {!isMobile && <span className="ml-2">{viewMode === 'grid' ? 'List' : 'Grid'}</span>}
                    </Button>
                  </div>

                  {isOwnProfile && (
                    <Button
                      size={isMobile ? "sm" : "default"}
                      className={`${
                        isMobile ? 'h-12 px-5' : 'h-14 px-8'
                      } bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl group`}
                    >
                      <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                      {!isMobile && <span className="ml-2">Buat Baru</span>}
                      {isMobile && <span className="ml-2 text-sm font-medium">Buat</span>}
                    </Button>
                  )}
                </div>
              </div>

              {/* Enhanced Filter Dropdown */}
              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50"
                  >
                    <div className={`flex flex-wrap gap-2 ${isMobile ? 'gap-2' : 'gap-3'}`}>
                      {[
                        { label: 'Terbaru', icon: Clock, color: 'from-blue-500 to-cyan-500' },
                        { label: 'Populer', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
                        { label: 'Favorit', icon: Star, color: 'from-yellow-500 to-orange-500' },
                        { label: 'Minggu Ini', icon: Clock, color: 'from-purple-500 to-pink-500' },
                        { label: 'Bulan Ini', icon: Activity, color: 'from-indigo-500 to-purple-500' }
                      ].map((filter) => (
                        <motion.div
                          key={filter.label}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className={`${
                              isMobile ? 'text-xs h-9 px-3' : 'text-sm h-10 px-4'
                            } bg-white/90 dark:bg-gray-700/90 border-white/60 dark:border-gray-600/60 hover:bg-gradient-to-r hover:${filter.color} hover:text-white hover:border-transparent transition-all duration-300 rounded-xl group`}
                          >
                            <filter.icon className="w-3 h-3 mr-2 group-hover:animate-pulse" />
                            {filter.label}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Tab Navigation */}
        <motion.div variants={itemVariants} className={`${isMobile ? 'mb-4 mx-1' : 'mb-8'}`}>
          <Card className="border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <TabsList className={`w-full h-auto ${
                isMobile ? 'grid grid-cols-2 gap-2 p-3' : 'flex justify-center gap-3 p-4'
              } bg-transparent`}>
                {tabs.map((tab, index) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={`relative ${
                      isMobile ? 'flex-col p-3 h-auto min-h-[80px]' : 'flex-row p-5 min-w-[160px] min-h-[100px]'
                    } bg-white/70 dark:bg-gray-800/70 border-0 rounded-2xl hover:bg-white/90 dark:hover:bg-gray-700/90 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-2xl data-[state=active]:${tab.glowColor} transition-all duration-500 overflow-hidden group cursor-pointer`}
                  >
                    {/* Enhanced Background Gradient */}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTabBg"
                        className={`absolute inset-0 bg-gradient-to-br ${tab.bgColor} opacity-80`}
                        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                      />
                    )}
                    
                    {/* Floating Elements */}
                    {activeTab === tab.id && (
                      <>
                        <motion.div
                          className="absolute -top-1 -right-1 w-3 h-3 bg-white/30 rounded-full"
                          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.div
                          className="absolute top-2 left-2 w-2 h-2 bg-white/20 rounded-full"
                          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                        />
                      </>
                    )}
                    
                    <motion.div
                      className={`relative z-10 flex items-center ${isMobile ? 'flex-col gap-2' : 'gap-4'} w-full`}
                      whileHover={{ scale: isMobile ? 1.02 : 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Enhanced Icon with gradient */}
                      <div className={`${
                        isMobile ? 'w-8 h-8' : 'w-12 h-12'
                      } rounded-2xl bg-gradient-to-r ${tab.color} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}>
                        <tab.icon className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} text-white relative z-10`} />
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          animate={activeTab === tab.id ? { scale: [1, 1.2, 1], opacity: [0, 0.3, 0] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                      
                      {/* Enhanced Content */}
                      <div className={`${isMobile ? 'text-center' : 'text-left flex-1'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`${
                            isMobile ? 'text-sm' : 'text-base'
                          } font-bold ${
                            activeTab === tab.id 
                              ? 'text-gray-900 dark:text-white' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {tab.label}
                          </span>
                          <span className="text-lg">{tab.emoji}</span>
                        </div>
                        
                        {/* Animated Count */}
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                          <motion.span
                            className={`${
                              isMobile ? 'text-lg' : 'text-xl'
                            } font-bold bg-gradient-to-r ${tab.color} bg-clip-text text-transparent`}
                            key={animatedCounts[tab.id]}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {animatedCounts[tab.id] || 0}
                          </motion.span>
                          
                          <Badge 
                            variant="outline" 
                            className={`${
                              isMobile ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'
                            } bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400`}
                          >
                            <TrendingUp className="w-2 h-2 mr-1" />
                            {tab.trend}
                          </Badge>
                        </div>
                        
                        {/* Description - Desktop only */}
                        {!isMobile && (
                          <p className={`text-xs mt-1 ${
                            activeTab === tab.id 
                              ? 'text-gray-700 dark:text-gray-300' 
                              : 'text-gray-500 dark:text-gray-500'
                          }`}>
                            {tab.description}
                          </p>
                        )}
                      </div>
                    </motion.div>

                    {/* Enhanced Active indicator */}
                    {activeTab === tab.id && (
                      <motion.div
                        className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 ${
                          isMobile ? 'w-8 h-1' : 'w-12 h-1.5'
                        } bg-gradient-to-r ${tab.color} rounded-full`}
                        layoutId="activeIndicator"
                        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                      />
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Tab Content */}
        <motion.div variants={itemVariants} className={isMobile ? 'mx-1' : ''}>
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab.id}
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="relative"
                >
                  {/* Enhanced Dynamic Background */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${tab.bgColor} ${
                      isMobile ? 'rounded-2xl' : 'rounded-3xl'
                    } opacity-40 blur-3xl -z-10`}
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.3, 0.5, 0.3],
                      rotate: [0, 1, -1, 0]
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <Card className={`border-0 bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl ${
                    isMobile ? 'rounded-2xl shadow-2xl' : 'rounded-3xl shadow-3xl'
                  } overflow-hidden hover:shadow-4xl transition-all duration-500`}>
                    <CardContent className={`${isMobile ? 'p-5' : 'p-8'}`}>
                      
                      {/* Enhanced Content Header */}
                      <div className={`flex items-center justify-between ${
                        isMobile ? 'mb-5 pb-4' : 'mb-8 pb-6'
                      } border-b border-gray-200/60 dark:border-gray-700/60`}>
                        <div className="flex items-center gap-4">
                          <motion.div 
                            className={`${isMobile ? 'p-3' : 'p-4'} rounded-2xl bg-gradient-to-br ${tab.color} shadow-2xl relative overflow-hidden`}
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            transition={{ duration: 0.3 }}
                          >
                            <tab.icon className={`${isMobile ? 'w-5 h-5' : 'w-7 h-7'} text-white relative z-10`} />
                            <motion.div
                              className="absolute inset-0 bg-white/20"
                              animate={{ scale: [1, 1.3, 1], opacity: [0, 0.4, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </motion.div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-bold text-gray-900 dark:text-white ${
                                isMobile ? 'text-lg' : 'text-2xl'
                              }`}>
                                {tab.label}
                              </h3>
                              <span className="text-2xl">{tab.emoji}</span>
                            </div>
                            <p className={`${
                              isMobile ? 'text-sm' : 'text-base'
                            } text-gray-600 dark:text-gray-400`}>
                              {tab.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className={`${
                              isMobile ? 'text-sm px-3 py-2' : 'text-base px-4 py-3'
                            } bg-white/70 dark:bg-gray-800/70 rounded-2xl border border-white/50 dark:border-gray-700/50 font-bold shadow-lg backdrop-blur-sm`}
                            whileHover={{ scale: 1.05 }}
                          >
                            <motion.span
                              className={`bg-gradient-to-r ${tab.color} bg-clip-text text-transparent`}
                            >
                              {animatedCounts[tab.id] || 0}
                            </motion.span>
                            <span className="text-gray-500 ml-1">items</span>
                          </motion.div>
                          <Button variant="ghost" size="sm" className="hover:bg-white/20 dark:hover:bg-gray-800/20 rounded-xl">
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>

                      {/* Enhanced Content Area */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`${isMobile ? 'min-h-[300px]' : 'min-h-[500px]'} flex items-center justify-center`}
                      >
                        <div className="text-center space-y-6 max-w-lg mx-auto">
                          {/* Enhanced Icon Display */}
                          <motion.div 
                            className={`${
                              isMobile ? 'w-20 h-20' : 'w-28 h-28'
                            } mx-auto rounded-3xl bg-gradient-to-br ${tab.color} flex items-center justify-center shadow-2xl relative overflow-hidden`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.3 }}
                          >
                            <tab.icon className={`${isMobile ? 'w-10 h-10' : 'w-14 h-14'} text-white relative z-10`} />
                            <motion.div
                              className="absolute inset-0 bg-white/20"
                              animate={{ scale: [1, 1.2, 1], opacity: [0, 0.3, 0] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            />
                            <div className="absolute -top-2 -right-2 text-3xl">{tab.emoji}</div>
                          </motion.div>
                          
                          <div className="space-y-3">
                            <h4 className={`${
                              isMobile ? 'text-xl' : 'text-2xl'
                            } font-bold text-gray-900 dark:text-white`}>
                              {tab.id === 'aktivitas-saya' && 'Aktivitas & Pencapaian Saya'}
                              {tab.id === 'catatan-saya' && 'Catatan & Tangkapan Ikan'}
                              {tab.id === 'feed-komunitas' && 'Feed Komunitas Pemancing'}
                              {tab.id === 'riwayat-aktivitas' && 'Riwayat & Log Aktivitas'}
                              {tab.id === 'pengguna' && 'Jelajahi Komunitas Pemancing'}
                            </h4>
                            
                            <p className={`${
                              isMobile ? 'text-sm px-3' : 'text-base px-2'
                            } text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed`}>
                              {tab.id === 'aktivitas-saya' && 'Semua aktivitas, pencapaian, dan interaksi Anda akan ditampilkan di sini dengan detail lengkap'}
                              {tab.id === 'catatan-saya' && 'Catatan tangkapan ikan, jurnal harian, dan data yang terintegrasi dengan total catches Anda'}
                              {tab.id === 'feed-komunitas' && 'Aktivitas terbaru dari komunitas pemancing, tips berguna, dan berbagi pengalaman memancing'}
                              {tab.id === 'riwayat-aktivitas' && 'Log lengkap semua aktivitas dan interaksi Anda di platform dengan timestamp detail'}
                              {tab.id === 'pengguna' && 'Temukan dan terhubung dengan pemancing lain, ikuti aktivitas mereka, dan bangun komunitas'}
                            </p>
                          </div>

                          <div className="pt-4">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button 
                                className={`${
                                  isMobile ? 'text-sm px-8 py-3 h-12' : 'text-base px-10 py-4 h-14'
                                } bg-gradient-to-r ${tab.color} hover:shadow-2xl transition-all duration-300 rounded-2xl group relative overflow-hidden`}
                                size={isMobile ? "sm" : "default"}
                              >
                                <motion.div
                                  className="absolute inset-0 bg-white/20"
                                  animate={{ x: [-100, 300] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300 relative z-10" />
                                <span className="ml-3 font-semibold relative z-10">
                                  {tab.id === 'aktivitas-saya' && 'Tambah Aktivitas'}
                                  {tab.id === 'catatan-saya' && 'Buat Catatan Baru'}
                                  {tab.id === 'feed-komunitas' && 'Ikuti Diskusi'}
                                  {tab.id === 'riwayat-aktivitas' && 'Lihat Detail'}
                                  {tab.id === 'pengguna' && 'Cari Pengguna'}
                                </span>
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          ))}
        </motion.div>

        {/* Enhanced Mobile Bottom Spacing */}
        {isMobile && (
          <div className="h-8" />
        )}
      </Tabs>
    </motion.div>
  );
};

export default LazyProfileTabs;
