
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Target, Star, Zap, Edit2 } from 'lucide-react';

interface StatCardProps {
  item: {
    key: string;
    label: string;
    value: number;
    icon: React.ComponentType<any>;
    gradient: string;
    bgGradient: string;
    glowColor: string;
    description: string;
    emoji: string;
    trend: string;
    editable?: boolean;
  };
  index: number;
  layout: 'mobile' | 'desktop';
  onEdit?: () => void;
  isLoading?: boolean;
}

const StatCard = ({ item, index, layout, onEdit, isLoading }: StatCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const isMobile = layout === 'mobile';

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="relative overflow-hidden"
      >
        <Card className={`
          ${isMobile ? 'h-32' : 'h-48'} 
          bg-gradient-to-br from-gray-100/80 to-gray-200/60 
          dark:from-gray-800/60 dark:to-gray-700/40 
          border-0 shadow-lg backdrop-blur-sm
        `}>
          <CardContent className={`${isMobile ? 'p-3' : 'p-6'} relative h-full`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse opacity-50" 
                 style={{
                   backgroundSize: '200% 100%',
                   animation: 'shimmer 2s infinite'
                 }} />
            
            <div className="space-y-3 relative z-10">
              <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} bg-gray-300/50 dark:bg-gray-600/50 rounded-xl animate-pulse`} />
              <div className={`${isMobile ? 'h-6 w-14' : 'h-8 w-16'} bg-gray-300/50 dark:bg-gray-600/50 rounded animate-pulse`} />
              <div className={`${isMobile ? 'h-3 w-16' : 'h-4 w-20'} bg-gray-300/50 dark:bg-gray-600/50 rounded animate-pulse`} />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className="relative group cursor-pointer"
    >
      <motion.div
        whileHover={!isMobile ? { 
          scale: 1.03, 
          y: -6,
          rotateY: 5,
          rotateX: 2
        } : undefined}
        whileTap={{ 
          scale: 0.97,
          y: 1
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 25,
          duration: 0.2
        }}
        style={{
          transformStyle: 'preserve-3d'
        }}
      >
        <Card className={`
          relative overflow-hidden border-0 backdrop-blur-xl shadow-lg
          bg-gradient-to-br ${item.bgGradient}
          transition-all duration-500 group-hover:shadow-xl
          ${item.glowColor} ${isMobile ? 'h-32' : 'h-48'}
          ${isPressed ? 'shadow-inner' : ''}
        `}>
          {/* Enhanced Background Animation */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 transition-opacity duration-500`}
            animate={isHovered || isPressed ? {
              opacity: [0, 0.08, 0.05],
              background: [
                `linear-gradient(135deg, ${item.gradient})`,
                `linear-gradient(225deg, ${item.gradient})`,
                `linear-gradient(135deg, ${item.gradient})`
              ]
            } : { opacity: 0 }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Glassmorphism Overlays */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-10 translate-x-10" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-8 -translate-x-8" />
          
          {/* Floating Particles Effect */}
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={isHovered ? {
              background: [
                'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.1) 0%, transparent 50%)'
              ]
            } : {}}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <CardContent className={`
            relative z-10 h-full flex flex-col justify-between
            ${isMobile ? 'p-3' : 'p-6'}
          `}>
            {/* Header Section */}
            <div className="flex items-center justify-between mb-2">
              <motion.div
                className={`
                  inline-flex rounded-2xl bg-gradient-to-br ${item.gradient} 
                  shadow-xl relative backdrop-blur-sm
                  ${isMobile ? 'p-2.5' : 'p-3'}
                `}
                whileHover={{ 
                  scale: 1.1, 
                  rotate: [0, -3, 3, 0],
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 500, 
                  damping: 20,
                  rotate: { duration: 0.6, ease: "easeInOut" }
                }}
              >
                <item.icon className={`
                  text-white drop-shadow-sm
                  ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}
                `} />
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${item.gradient} 
                  rounded-2xl blur-xl opacity-50 -z-10
                `} />
              </motion.div>

              {/* Edit Button for Mobile */}
              {item.editable && onEdit && item.key === 'total_catches' && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.15, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  className={`
                    bg-gradient-to-r from-emerald-500 to-teal-500 
                    rounded-full flex items-center justify-center 
                    hover:shadow-lg transition-all duration-300
                    ${isMobile ? 'w-6 h-6' : 'w-7 h-7'}
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  <Edit2 className={`text-white ${isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
                </motion.button>
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center space-y-1">
              {/* Value with enhanced animations */}
              <motion.div 
                className={`
                  font-bold text-gray-900 dark:text-white relative
                  ${isMobile ? 'text-2xl' : 'text-4xl'}
                `}
                key={item.value}
                initial={{ scale: 1.2, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 25,
                  duration: 0.6
                }}
              >
                {item.value.toLocaleString('id-ID')}
                
                {/* Achievement Star for catches */}
                {item.value > 0 && item.key === 'total_catches' && (
                  <motion.div
                    className="absolute -top-1 -right-1"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      delay: 0.3, 
                      type: "spring", 
                      stiffness: 300,
                      duration: 0.8
                    }}
                  >
                    <Star className={`
                      text-yellow-500 fill-yellow-500 drop-shadow-lg
                      ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}
                    `} />
                  </motion.div>
                )}
              </motion.div>

              {/* Label */}
              <p className={`
                font-semibold text-gray-600 dark:text-gray-400 leading-tight
                ${isMobile ? 'text-xs' : 'text-sm'}
              `}>
                {item.label}
              </p>

              {/* Trend Indicator */}
              <div className="flex items-center gap-1">
                <TrendingUp className={`
                  text-green-500 flex-shrink-0
                  ${isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}
                `} />
                <span className={`
                  text-green-600 dark:text-green-400 font-medium leading-none
                  ${isMobile ? 'text-[9px]' : 'text-xs'}
                `}>
                  {item.trend}
                </span>
              </div>
            </div>

            {/* Interactive Tooltip for Desktop */}
            <AnimatePresence>
              {isHovered && !isMobile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/80 to-transparent flex items-end p-6 text-white rounded-2xl backdrop-blur-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="text-sm font-medium leading-tight">{item.description}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Target className="w-3 h-3 flex-shrink-0" />
                      <span className="bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                        {item.trend}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Pressed State Feedback */}
            {isMobile && isPressed && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
              >
                <div className="text-2xl">{item.emoji}</div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default StatCard;
