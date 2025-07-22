
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface TabItem {
  value: string;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
  count: number;
}

interface DesktopTabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
}

const DesktopTabNavigation = ({ tabs, activeTab }: DesktopTabNavigationProps) => {
  return (
    <TabsList className={`w-full gap-3 p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-3xl shadow-xl ${
      tabs.length === 5 ? 'grid-cols-5' : tabs.length === 4 ? 'grid-cols-4' : tabs.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
    } grid`}>
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.value;
        return (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={`relative flex flex-col items-center gap-2.5 py-4 px-3 rounded-2xl transition-all duration-500 group min-h-[88px] overflow-hidden ${
              isActive
                ? 'text-white shadow-xl transform scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:scale-[1.02]'
            }`}
          >
            <motion.div
              whileHover={{ scale: isActive ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-full flex flex-col items-center gap-2.5"
            >
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${tab.color} opacity-0 transition-opacity duration-500 rounded-2xl ${
                  isActive ? 'opacity-100' : 'group-hover:opacity-10'
                }`}
                layoutId={isActive ? "desktop-bg" : undefined}
              />

              {isActive && (
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${tab.color} blur-xl opacity-30 scale-110`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.1, opacity: 0.3 }}
                  transition={{ duration: 0.8 }}
                />
              )}

              <div className="absolute top-2 right-2 w-4 h-4 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
              <div className="absolute bottom-2 left-2 w-3 h-3 bg-gradient-to-tr from-white/5 to-transparent rounded-full" />
              
              <div className="relative z-10 flex flex-col items-center gap-1.5 text-center">
                <motion.div
                  className={`p-2.5 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-white/20 shadow-lg'
                      : 'bg-white/10 group-hover:bg-white/20'
                  }`}
                  animate={isActive ? { 
                    scale: 1.05,
                    rotate: [0, -1, 1, 0],
                  } : { scale: 1 }}
                  transition={{ 
                    scale: { duration: 0.2 },
                    rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <IconComponent className="w-5 h-5" />
                </motion.div>
                
                <div className="space-y-1">
                  <motion.div 
                    className="font-bold text-sm leading-tight"
                    animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {tab.label}
                  </motion.div>
                  <div className="text-[11px] opacity-80 max-w-[100px] leading-tight">
                    {tab.description}
                  </div>
                  {tab.count > 0 && (
                    <Badge className="text-[9px] bg-white/20 border-white/30 mt-1 px-2 py-0.5">
                      {tab.count > 999 ? '999+' : tab.count}
                    </Badge>
                  )}
                </div>

                {isActive && (
                  <>
                    <motion.div
                      className="absolute -top-1 -right-1"
                      initial={{ scale: 0, rotate: 0 }}
                      animate={{ scale: 1, rotate: 360 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Star className="w-3 h-3 text-yellow-300 fill-current" />
                    </motion.div>
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    />
                  </>
                )}
              </div>
            </motion.div>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
};

export default DesktopTabNavigation;
