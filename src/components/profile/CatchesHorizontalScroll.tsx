import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Fish, ChevronRight, ChevronLeft, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';

interface CatchItem {
  id: number;
  title: string;
  location: string;
  date: string;
  image?: string;
  species?: string;
  weight?: string;
}

const CatchesHorizontalScroll = () => {
  const { theme } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  
  // Placeholder data
  const catches: CatchItem[] = [
    {
      id: 1,
      title: "Ikan Koi",
      location: "Danau Toba",
      date: new Date().toISOString(),
      species: "Cyprinus rubrofuscus",
      weight: "2.5 kg"
    },
    {
      id: 2,
      title: "Ikan Mas",
      location: "Sungai Ciliwung",
      date: new Date(Date.now() - 86400000 * 3).toISOString(),
      species: "Cyprinus carpio",
      weight: "1.8 kg"
    },
    {
      id: 3,
      title: "Ikan Nila",
      location: "Waduk Jatiluhur",
      date: new Date(Date.now() - 86400000 * 7).toISOString(),
      species: "Oreochromis niloticus",
      weight: "1.2 kg"
    }
  ];
  
  useEffect(() => {
    if (scrollRef.current) {
      const updateMaxScroll = () => {
        const { scrollWidth, clientWidth } = scrollRef.current!;
        setMaxScroll(scrollWidth - clientWidth);
      };
      
      updateMaxScroll();
      window.addEventListener('resize', updateMaxScroll);
      return () => window.removeEventListener('resize', updateMaxScroll);
    }
  }, []);
  
  const scrollLeft = () => {
    if (scrollRef.current) {
      const newPosition = scrollPosition - 300;
      scrollRef.current.scrollTo({ left: Math.max(0, newPosition), behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollRef.current) {
      const newPosition = scrollPosition + 300;
      scrollRef.current.scrollTo({ left: Math.min(maxScroll, newPosition), behavior: 'smooth' });
    }
  };
  
  const handleScroll = () => {
    if (scrollRef.current) {
      setScrollPosition(scrollRef.current.scrollLeft);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: id });
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="relative"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium">Penangkapan Terbaru</h2>
        
        {/* Navigation arrows - desktop only */}
        <div className="hidden md:flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={scrollLeft}
            disabled={scrollPosition <= 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={scrollRight}
            disabled={scrollPosition >= maxScroll}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Horizontal scrolling container */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 pb-4 scrollbar-none snap-x snap-mandatory"
        onScroll={handleScroll}
      >
        {catches.length > 0 ? (
          catches.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -5 }}
              className={cn(
                "flex-shrink-0 snap-start first:pl-0 last:pr-4 w-[280px] md:w-[320px] rounded-lg border overflow-hidden shadow-sm",
                theme === "light" ? "bg-white" : "bg-gray-800/70"
              )}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mr-3">
                      <Fish className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      {item.species && (
                        <p className="text-xs text-muted-foreground italic">{item.species}</p>
                      )}
                    </div>
                  </div>
                  {item.weight && (
                    <span className="text-sm font-medium">{item.weight}</span>
                  )}
                </div>
                
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1.5 opacity-70" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1.5 opacity-70" />
                    <span>{formatDate(item.date)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex items-center justify-center bg-muted/30 border rounded-lg w-full h-32">
            <p className="text-muted-foreground text-sm">Belum ada data penangkapan.</p>
          </div>
        )}
      </div>
      
      {/* Scroll indicators - mobile only */}
      <div className="flex justify-center mt-2 space-x-1.5 md:hidden">
        {catches.map((_, index) => (
          <div 
            key={index}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === Math.round(scrollPosition / 300) 
                ? "w-4 bg-primary" 
                : "w-1.5 bg-muted"
            )}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default CatchesHorizontalScroll;
