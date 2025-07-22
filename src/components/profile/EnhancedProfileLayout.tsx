
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Award, 
  User, 
  Activity, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  Search,
  Grid3X3,
  List,
  Sparkles,
  TrendingUp,
  Star,
  Calendar,
  MapPin,
  Trophy,
  Heart,
  MessageCircle,
  Pin,
  Target,
  Zap
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProfileData } from '@/hooks/useProfile';
import ProfileStatsGrid from './ProfileStatsGrid';
import ProfileAchievements from './ProfileAchievements';
import ProfileActivityGrid from './ProfileActivityGrid';
import ProfileBio from './ProfileBio';

interface EnhancedProfileLayoutProps {
  profileData: ProfileData;
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const EnhancedProfileLayout = ({ profileData, isEditing, handleInputChange }: EnhancedProfileLayoutProps) => {
  const [activeSection, setActiveSection] = useState('stats');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [horizontalScrollIndex, setHorizontalScrollIndex] = useState(0);

  // Quick Stats Data for Horizontal Carousel
  const quickStats = [
    {
      id: 'fish_caught',
      icon: <Target className="w-6 h-6" />,
      label: 'Ikan Ditangkap',
      value: profileData.fish_caught || 0,
      trend: '+12%',
      color: 'from-[#6E3482] to-[#A56ABD]',
      bgGlow: 'shadow-[#6E3482]/30'
    },
    {
      id: 'achievements',
      icon: <Trophy className="w-6 h-6" />,
      label: 'Pencapaian',
      value: 8,
      trend: '+3',
      color: 'from-yellow-500 to-yellow-600',
      bgGlow: 'shadow-yellow-500/30'
    },
    {
      id: 'likes',
      icon: <Heart className="w-6 h-6" />,
      label: 'Total Likes',
      value: 156,
      trend: '+28%',
      color: 'from-pink-500 to-rose-500',
      bgGlow: 'shadow-pink-500/30'
    },
    {
      id: 'messages',
      icon: <MessageCircle className="w-6 h-6" />,
      label: 'Pesan Dikirim',
      value: 89,
      trend: '+15%',
      color: 'from-blue-500 to-cyan-500',
      bgGlow: 'shadow-blue-500/30'
    },
    {
      id: 'streak',
      icon: <Zap className="w-6 h-6" />,
      label: 'Hari Aktif',
      value: 12,
      trend: 'streak',
      color: 'from-orange-500 to-red-500',
      bgGlow: 'shadow-orange-500/30'
    },
    {
      id: 'rating',
      icon: <Star className="w-6 h-6" />,
      label: 'Rating',
      value: '4.8',
      trend: '+0.2',
      color: 'from-emerald-500 to-green-500',
      bgGlow: 'shadow-emerald-500/30'
    }
  ];

  const sections = [
    {
      id: 'stats',
      label: 'Statistik',
      icon: BarChart3,
      color: 'from-[#6E3482] to-[#A56ABD]',
      component: <ProfileStatsGrid />
    },
    {
      id: 'achievements',
      label: 'Pencapaian',
      icon: Award,
      color: 'from-yellow-500 to-yellow-600',
      component: <ProfileAchievements />
    },
    {
      id: 'activity',
      label: 'Aktivitas',
      icon: Activity,
      color: 'from-blue-500 to-cyan-500',
      component: <ProfileActivityGrid viewMode={viewMode} searchQuery={searchQuery} />
    },
    {
      id: 'bio',
      label: 'Bio',
      icon: User,
      color: 'from-emerald-500 to-green-500',
      component: (
        <Card className="border-[#A56ABD]/20 bg-white/90 backdrop-blur-sm">
          <div className="p-6 md:p-8">
            <ProfileBio 
              profileData={profileData}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
            />
          </div>
        </Card>
      )
    }
  ];

  // Handle horizontal scroll for quick stats
  const scrollQuickStats = (direction: 'left' | 'right') => {
    if (direction === 'left' && horizontalScrollIndex > 0) {
      setHorizontalScrollIndex(horizontalScrollIndex - 1);
    } else if (direction === 'right' && horizontalScrollIndex < quickStats.length - 3) {
      setHorizontalScrollIndex(horizontalScrollIndex + 1);
    }
  };

  const activeSection_data = sections.find(s => s.id === activeSection);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Quick Stats Horizontal Carousel - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {/* Mobile: Horizontal Scrolling Quick Stats */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#49225B] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#A56ABD]" />
              Ringkasan Cepat
            </h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => scrollQuickStats('left')}
                disabled={horizontalScrollIndex === 0}
                className="w-8 h-8 p-0 border-[#A56ABD]/30 hover:bg-[#F5EBFA]"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => scrollQuickStats('right')}
                disabled={horizontalScrollIndex >= quickStats.length - 3}
                className="w-8 h-8 p-0 border-[#A56ABD]/30 hover:bg-[#F5EBFA]"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="relative overflow-hidden">
            <motion.div 
              className="flex gap-3"
              animate={{ x: -horizontalScrollIndex * 120 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  className="flex-shrink-0 w-28"
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className={`relative overflow-hidden border-0 bg-gradient-to-br ${stat.color} text-white shadow-lg ${stat.bgGlow} h-24`}>
                    <CardContent className="p-3 h-full flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        {stat.icon}
                        <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">
                          {stat.trend}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{stat.value}</div>
                        <div className="text-xs opacity-90 truncate">{stat.label}</div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Desktop: Grid Layout for Quick Stats */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-[#49225B] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6E3482] to-[#A56ABD] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              Ringkasan Aktivitas
            </h3>
            <Badge className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] text-white px-4 py-2">
              Diperbarui hari ini
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <Card className={`relative overflow-hidden border-0 bg-gradient-to-br ${stat.color} text-white shadow-lg hover:shadow-xl ${stat.bgGlow} transition-all duration-300 group-hover:shadow-2xl`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                        {stat.icon}
                      </div>
                      <Badge variant="secondary" className="bg-white/20 text-white border-0 group-hover:bg-white/30">
                        {stat.trend}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm opacity-90">{stat.label}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="sticky top-16 z-20 bg-gradient-to-r from-[#F5EBFA]/95 via-white/95 to-[#F5EBFA]/95 backdrop-blur-lg p-3 md:p-4 rounded-2xl border border-[#A56ABD]/20 shadow-lg"
      >
        {/* Mobile: Compact Tab Navigation */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                className="w-8 h-8 p-0"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                className="w-8 h-8 p-0"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-1 bg-white/80 rounded-xl p-1">
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <motion.button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all duration-300 ${
                    activeSection === section.id
                      ? `bg-gradient-to-r ${section.color} text-white shadow-lg`
                      : 'text-[#6E3482] hover:bg-[#F5EBFA]'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-xs font-medium truncate">{section.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Desktop: Enhanced Tab Navigation */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-[#49225B]">Profil Dashboard</h2>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  onClick={() => setViewMode('grid')}
                  className="flex items-center gap-2"
                >
                  <Grid3X3 className="w-4 h-4" />
                  Grid
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  onClick={() => setViewMode('list')}
                  className="flex items-center gap-2"
                >
                  <List className="w-4 h-4" />
                  List
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A56ABD] w-4 h-4" />
                <Input
                  placeholder="Cari dalam profil..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 border-[#A56ABD]/30 focus:border-[#6E3482] bg-white/80 rounded-xl"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2">
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <motion.button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 py-4 px-6 rounded-xl transition-all duration-300 relative overflow-hidden ${
                    activeSection === section.id
                      ? `bg-gradient-to-r ${section.color} text-white shadow-lg shadow-${section.color.split(' ')[1]}/30`
                      : 'text-[#6E3482] hover:bg-[#F5EBFA] hover:shadow-md'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {activeSection === section.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-[#6E3482] to-[#A56ABD] rounded-xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-3">
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{section.label}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Collapsible Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-white/90 rounded-xl border border-[#A56ABD]/20"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button size="sm" variant="outline" className="justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Minggu Ini
                </Button>
                <Button size="sm" variant="outline" className="justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending
                </Button>
                <Button size="sm" variant="outline" className="justify-start">
                  <Star className="w-4 h-4 mr-2" />
                  Terfavorit
                </Button>
                <Button size="sm" variant="outline" className="justify-start">
                  <Pin className="w-4 h-4 mr-2" />
                  Terpin
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Dynamic Content Area with Parallax Effect */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        {/* Desktop: Parallax Background Effect */}
        <div className="hidden md:block absolute inset-0 opacity-5 pointer-events-none">
          <div className={`absolute inset-0 bg-gradient-to-br ${activeSection_data?.color} blur-3xl transform scale-150`} />
        </div>

        {/* Content Container */}
        <div className="relative z-10">
          {activeSection_data?.component}
        </div>
      </motion.div>

      {/* Floating Action Button - Mobile */}
      <motion.div
        className="md:hidden fixed bottom-6 right-6 z-30"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          size="lg"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-[#6E3482] to-[#A56ABD] shadow-lg shadow-[#6E3482]/30 border-0"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronLeft className="w-6 h-6 rotate-90" />
        </Button>
      </motion.div>
    </div>
  );
};

export default EnhancedProfileLayout;
