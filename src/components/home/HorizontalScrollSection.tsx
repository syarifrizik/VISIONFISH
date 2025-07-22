import React, { useRef, useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";

interface HorizontalScrollSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  showControls?: boolean;
  itemWidth?: number; // Width in percentage for each item
  autoScroll?: boolean;
}

const HorizontalScrollSection = ({
  title,
  children,
  className,
  showControls = true,
  itemWidth = 80, // Default to 80% width on mobile
  autoScroll = false,
}: HorizontalScrollSectionProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const controls = useAnimation();
  
  // Calculate item count
  useEffect(() => {
    if (children) {
      setItemCount(React.Children.count(children));
    }
  }, [children]);
  
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
    
    // Calculate active index based on scroll position
    if (scrollContainerRef.current.children.length > 0) {
      const itemWidth = scrollContainerRef.current.children[0].clientWidth;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.min(newIndex, itemCount - 1));
    }
  };
  
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const { clientWidth } = scrollContainerRef.current;
    const scrollAmount = clientWidth * 0.7; // Scroll 70% of the visible width
    
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Auto-scroll feature
  useEffect(() => {
    if (autoScroll && scrollContainerRef.current) {
      let interval: number;
      
      // Only auto-scroll if there's content to scroll to
      if (canScrollRight) {
        interval = window.setInterval(() => {
          if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            
            // If we're at the end, scroll back to the start
            if (scrollLeft >= scrollWidth - clientWidth - 20) {
              scrollContainerRef.current.scrollTo({
                left: 0,
                behavior: 'smooth'
              });
            } else {
              // Otherwise, continue scrolling
              scroll('right');
            }
          }
        }, 5000);
      }
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [autoScroll, canScrollRight]);

  // Animate the indicator bar
  useEffect(() => {
    const animateIndicator = async () => {
      if (!canScrollRight) return;
      
      await controls.start({
        scaleX: [1, 3, 1],
        transition: { duration: 4, ease: "easeInOut", repeat: Infinity }
      });
    };
    
    animateIndicator();
  }, [controls, canScrollRight]);

  return (
    <div className={cn("relative mb-10", className)}>
      <div className="flex items-center justify-between mb-4">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "text-2xl font-bold",
            theme === "light" ? "text-ocean-deep" : "text-gradient-purple"
          )}>
          {title}
        </motion.h2>
        
        {showControls && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={cn(
                "p-2 rounded-full transition-all",
                canScrollLeft 
                  ? theme === "light"
                    ? "bg-ocean-light/10 text-ocean-blue hover:bg-ocean-light/20"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                  : "opacity-30 cursor-not-allowed",
                "focus:outline-none focus:ring-2",
                theme === "light"
                  ? "focus:ring-ocean-blue/30"
                  : "focus:ring-primary/30"
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={cn(
                "p-2 rounded-full transition-all",
                canScrollRight 
                  ? theme === "light"
                    ? "bg-ocean-light/10 text-ocean-blue hover:bg-ocean-light/20"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                  : "opacity-30 cursor-not-allowed",
                "focus:outline-none focus:ring-2",
                theme === "light"
                  ? "focus:ring-ocean-blue/30"
                  : "focus:ring-primary/30"
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
      
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-none scroll-smooth pb-4 -mx-2 px-2"
        onScroll={checkScrollPosition}
      >
        {React.Children.map(children, (child, index) => (
          <motion.div 
            key={index} 
            className="flex-shrink-0 px-2 first:pl-0 last:pr-0 transition-all duration-300"
            style={{ width: isMobile ? `${itemWidth}%` : 'auto' }}
            whileHover={{ scale: 1.02 }}
            animate={{ 
              scale: activeIndex === index ? 1.03 : 1,
              opacity: activeIndex === index ? 1 : 0.85
            }}
            transition={{ duration: 0.2 }}
          >
            {child}
          </motion.div>
        ))}
      </div>
      
      {/* Visual scroll indicators */}
      {itemCount > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {Array.from({ length: itemCount }).map((_, i) => (
            <motion.div 
              key={i} 
              className={cn(
                "h-1.5 rounded-full transition-all",
                theme === "light" 
                  ? activeIndex === i ? "bg-ocean-blue" : "bg-ocean-light/30"
                  : activeIndex === i ? "bg-primary" : "bg-primary/30"
              )}
              initial={{ width: i === activeIndex ? "20px" : "10px" }}
              animate={{ 
                width: i === activeIndex ? "20px" : "10px",
                opacity: i === activeIndex ? 1 : 0.5
              }}
              onClick={() => {
                if (scrollContainerRef.current && scrollContainerRef.current.children[i]) {
                  const element = scrollContainerRef.current.children[i] as HTMLElement;
                  scrollContainerRef.current.scrollTo({
                    left: element.offsetLeft - scrollContainerRef.current.offsetLeft,
                    behavior: 'smooth'
                  });
                }
              }}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
      )}
      
      {/* Additional scroll hint animation for desktop */}
      <div className="hidden mt-4 md:flex justify-center gap-1.5">
        <motion.div 
          className={cn(
            "h-1 rounded-full bg-gradient-to-r",
            theme === "light" 
              ? "from-ocean-blue to-ocean-teal" 
              : "from-visionfish-neon-purple to-visionfish-neon-blue"
          )}
          animate={controls}
          initial={{ scaleX: 1, width: "10%" }}
        />
      </div>
    </div>
  );
};

export default HorizontalScrollSection;
