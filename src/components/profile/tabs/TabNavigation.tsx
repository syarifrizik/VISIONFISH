
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

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  isMobile?: boolean;
}

const TabNavigation = ({ tabs, activeTab, isMobile = false }: TabNavigationProps) => {
  if (isMobile) {
    return (
      <div className="w-full mb-6">
        <div className="overflow-x-auto scrollbar-hide">
          <TabsList className="inline-flex w-max min-w-full gap-1.5 p-1.5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl shadow-xl">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.value;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={`relative flex flex-col items-center gap-1.5 py-2.5 px-3 min-w-[70px] rounded-xl transition-all duration-300 shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105 border-0'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/40 dark:hover:bg-gray-800/40'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobile-active-bg"
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <motion.div
                      animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20' : 'bg-transparent'}`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </motion.div>
                    
                    <span className="text-xs font-medium leading-tight text-center">
                      {tab.label.length > 8 ? tab.label.substring(0, 8) + '...' : tab.label}
                    </span>
                    
                    {tab.count > 0 && (
                      <Badge className={`text-[10px] px-1.5 py-0 h-4 min-w-[16px] ${
                        isActive ? 'bg-white/30 text-white' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {tab.count > 99 ? '99+' : tab.count}
                      </Badge>
                    )}
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="mobile-indicator"
                      className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>
      </div>
    );
  }

  // Desktop Layout - Improved grid responsiveness
  return (
    <TabsList className={`w-full gap-3 p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-3xl shadow-2xl ${
      tabs.length === 5 ? 'grid-cols-5' : tabs.length === 4 ? 'grid-cols-4' : tabs.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
    } grid`}>
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.value;
        return (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={`relative flex flex-col items-center gap-3 py-4 px-3 rounded-2xl transition-all duration-500 group min-h-[100px] overflow-hidden ${
              isActive
                ? 'text-white shadow-2xl transform scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:scale-[1.02]'
            }`}
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

            <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
            <div className="absolute bottom-2 left-2 w-4 h-4 bg-gradient-to-tr from-white/5 to-transparent rounded-full" />
            
            <div className="relative z-10 flex flex-col items-center gap-2 text-center">
              <motion.div
                className={`p-2.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-white/20 shadow-xl'
                    : 'bg-white/10 group-hover:bg-white/20'
                }`}
                animate={isActive ? { 
                  scale: 1.1,
                  rotate: [0, -2, 2, 0],
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
                <div className="text-xs opacity-80 max-w-[120px] leading-tight">
                  {tab.description}
                </div>
                {tab.count > 0 && (
                  <Badge className="text-xs bg-white/20 border-white/30 mt-1">
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
                    <Star className="w-4 h-4 text-yellow-300 fill-current" />
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
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
};

export default TabNavigation;
