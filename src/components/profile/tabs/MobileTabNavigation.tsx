
import { motion } from 'framer-motion';
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

interface MobileTabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
}

const MobileTabNavigation = ({ tabs, activeTab }: MobileTabNavigationProps) => {
  return (
    <div className="w-full mb-2">
      {/* Optimized mobile navigation container with better spacing */}
      <div className="w-full px-2">
        <TabsList className={`w-full p-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-2xl shadow-lg grid ${
          tabs.length === 5 ? 'grid-cols-5' : 
          tabs.length === 4 ? 'grid-cols-4' : 
          tabs.length === 3 ? 'grid-cols-3' : 
          'grid-cols-2'
        } gap-1`}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.value;
            
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={`relative flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg scale-[1.02] border-0'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-800/60'
                }`}
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  minHeight: '60px', // Increased touch target
                  flex: '1 1 0%'
                }}
              >
                {/* Enhanced background animation */}
                {isActive && (
                  <motion.div
                    layoutId="mobile-active-bg"
                    className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.3, 
                      ease: [0.23, 1, 0.32, 1],
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }}
                  />
                )}
                
                <div className="relative z-10 flex flex-col items-center justify-center gap-1 text-center">
                  {/* Enhanced icon with better animations */}
                  <motion.div
                    animate={isActive ? { 
                      scale: 1.1,
                      rotate: [0, -5, 5, 0]
                    } : { 
                      scale: 1 
                    }}
                    transition={{ 
                      duration: isActive ? 0.6 : 0.2,
                      ease: "easeOut",
                      rotate: { duration: 0.5, ease: "easeInOut" }
                    }}
                    className={`p-1.5 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/25 shadow-md' 
                        : 'bg-transparent group-hover:bg-white/10 dark:group-hover:bg-gray-700/20'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </motion.div>
                  
                  {/* Optimized label with better typography */}
                  <motion.span 
                    className={`text-[10px] font-semibold leading-none transition-all duration-300 ${
                      isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                    }`}
                    animate={isActive ? { 
                      y: 0,
                      opacity: 1 
                    } : { 
                      y: 1,
                      opacity: 0.8 
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {tab.label}
                  </motion.span>
                  
                  {/* Enhanced badge positioning and styling */}
                  {tab.count > 0 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        delay: 0.1
                      }}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge 
                        className={`text-[8px] px-1.5 py-0.5 h-auto min-w-[16px] leading-none font-bold shadow-md border-2 transition-all duration-300 ${
                          isActive 
                            ? 'bg-white text-blue-600 border-white/50 shadow-white/20' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-400/50 dark:border-purple-400/50 hover:scale-105'
                        }`}
                      >
                        {tab.count > 99 ? '99+' : tab.count}
                      </Badge>
                    </motion.div>
                  )}
                </div>

                {/* Enhanced bottom indicator */}
                {isActive && (
                  <motion.div
                    layoutId="mobile-indicator"
                    className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white/90 rounded-full shadow-lg"
                    initial={{ scale: 0, opacity: 0, y: 5 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      ease: [0.23, 1, 0.32, 1],
                      delay: 0.1
                    }}
                  />
                )}

                {/* Subtle hover effect */}
                {!isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>
    </div>
  );
};

export default MobileTabNavigation;
