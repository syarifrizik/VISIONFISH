
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface StatItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  color: string;
  period: string;
  description: string;
}

interface HorizontalStatsCarouselProps {
  stats: StatItem[];
  autoScroll?: boolean;
  itemsPerView?: number;
}

const HorizontalStatsCarousel = ({ 
  stats, 
  autoScroll = false, 
  itemsPerView = 2 
}: HorizontalStatsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < stats.length - itemsPerView;

  const scrollLeft = () => {
    if (canScrollLeft) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const scrollRight = () => {
    if (canScrollRight) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const getTrendIcon = (changeType: 'increase' | 'decrease' | 'neutral') => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'decrease':
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return <Minus className="w-3 h-3 text-gray-500" />;
    }
  };

  const getTrendColor = (changeType: 'increase' | 'decrease' | 'neutral') => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600 bg-green-100';
      case 'decrease':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#49225B]">Statistik Real-time</h3>
        
        {/* Navigation Controls */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="w-8 h-8 p-0 border-[#A56ABD]/30 hover:bg-[#F5EBFA] disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="w-8 h-8 p-0 border-[#A56ABD]/30 hover:bg-[#F5EBFA] disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-2xl">
        <motion.div
          className="flex gap-4"
          animate={{ x: -currentIndex * (100 / itemsPerView) + '%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className={`flex-shrink-0 ${itemsPerView === 2 ? 'w-1/2' : 'w-1/3'}`}
              style={{ minWidth: `${100 / itemsPerView}%` }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className={`h-full border-0 bg-gradient-to-br ${stat.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}>
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12 group-hover:scale-110 transition-transform duration-500" />
                </div>

                <CardContent className="p-6 relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors duration-300">
                      {stat.icon}
                    </div>
                    <Badge className={`${getTrendColor(stat.changeType)} border-0 flex items-center gap-1`}>
                      {getTrendIcon(stat.changeType)}
                      {Math.abs(stat.change)}%
                    </Badge>
                  </div>

                  {/* Value */}
                  <div className="space-y-2">
                    <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                    <div className="text-sm opacity-90">{stat.label}</div>
                    <div className="text-xs opacity-75">{stat.period}</div>
                  </div>

                  {/* Description */}
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-xs opacity-80 leading-relaxed">{stat.description}</p>
                  </div>

                  {/* Hover Effect Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    initial={false}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: Math.ceil(stats.length / itemsPerView) }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index * itemsPerView)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              Math.floor(currentIndex / itemsPerView) === index
                ? 'bg-[#6E3482] w-6'
                : 'bg-[#A56ABD]/40 hover:bg-[#A56ABD]/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HorizontalStatsCarousel;
