
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  BookOpen, 
  Users, 
  BarChart3, 
  Search,
  Fish,
  Heart,
  MessageSquare
} from 'lucide-react';

interface ProfileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProfileNavigation = ({ activeTab, onTabChange }: ProfileNavigationProps) => {
  const tabs = [
    { 
      id: 'aktivitas', 
      label: 'Aktivitas', 
      icon: Activity, 
      count: 12,
      description: 'Aktivitas terbaru'
    },
    { 
      id: 'catatan', 
      label: 'Catatan', 
      icon: BookOpen, 
      count: 8,
      description: 'Jurnal memancing'
    },
    { 
      id: 'komunitas', 
      label: 'Komunitas', 
      icon: Users, 
      count: 156,
      description: 'Jaringan memancing'
    },
    { 
      id: 'riwayat', 
      label: 'Analitik', 
      icon: BarChart3, 
      count: null,
      description: 'Statistik performa'
    },
    { 
      id: 'pengguna', 
      label: 'Jelajahi', 
      icon: Search, 
      count: null,
      description: 'Temukan pemancing'
    },
  ];

  return (
    <motion.div 
      className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-4 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-between">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.div
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 h-11 px-4 transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                  {tab.count !== null && (
                    <Badge 
                      variant="secondary" 
                      className={`ml-1 text-xs ${
                        isActive 
                          ? 'bg-white/20 text-white border-white/20' 
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {tab.count}
                    </Badge>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
        
        {/* Active Tab Description */}
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {tabs.find(tab => tab.id === activeTab)?.description}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.div
                key={tab.id}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 snap-center"
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(tab.id)}
                  className={`flex flex-col items-center gap-1 h-16 w-16 p-2 transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-b from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="text-xs font-medium leading-none">{tab.label.split(' ')[0]}</span>
                  {tab.count !== null && (
                    <Badge 
                      variant="secondary" 
                      className={`absolute -top-1 -right-1 w-5 h-5 p-0 text-xs flex items-center justify-center ${
                        isActive 
                          ? 'bg-white text-blue-600' 
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {tab.count > 99 ? '99+' : tab.count}
                    </Badge>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Dot indicators for mobile */}
        <div className="flex justify-center gap-1.5 mt-2 mb-1">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-blue-600 dark:bg-blue-400 w-6'
                  : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
              }`}
            />
          ))}
        </div>
        
        {/* Mobile Active Tab Info */}
        <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="text-center">
            <h3 className="font-medium text-slate-900 dark:text-slate-100">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {tabs.find(tab => tab.id === activeTab)?.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileNavigation;
