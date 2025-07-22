
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface HorizontalFeatureScrollerProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const HorizontalFeatureScroller = ({
  title,
  children,
  className,
}: HorizontalFeatureScrollerProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isMobile = useIsMobile();

  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScrollPosition);
      // Initial check
      checkScrollPosition();
      
      return () => scrollContainer.removeEventListener("scroll", checkScrollPosition);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const scrollAmount = scrollContainer.clientWidth * 0.75;
    const newPosition = direction === "left" 
      ? scrollContainer.scrollLeft - scrollAmount 
      : scrollContainer.scrollLeft + scrollAmount;
      
    scrollContainer.scrollTo({
      left: newPosition,
      behavior: "smooth"
    });
  };

  return (
    <div className={cn("relative", className)}>
      {title && (
        <h3 className="text-xl font-semibold mb-4">
          {title}
        </h3>
      )}
      
      <div className="relative group">
        {!isMobile && (
          <>
            <motion.button
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-full p-2",
                "border border-visionfish-neon-blue/30 text-foreground -ml-4",
                "hover:bg-visionfish-neon-blue/10 transition-all duration-200",
                !canScrollLeft && "opacity-0 pointer-events-none"
              )}
              onClick={() => scroll("left")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: canScrollLeft ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            
            <motion.button
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-full p-2",
                "border border-visionfish-neon-blue/30 text-foreground -mr-4",
                "hover:bg-visionfish-neon-blue/10 transition-all duration-200",
                !canScrollRight && "opacity-0 pointer-events-none"
              )}
              onClick={() => scroll("right")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: canScrollRight ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </>
        )}
        
        <div 
          ref={scrollContainerRef}
          className={cn(
            "flex overflow-x-auto py-2 gap-4 scrollbar-none snap-x snap-mandatory",
            "scroll-smooth -mx-4 px-4"
          )}
        >
          {children}
        </div>
        
        {/* Scroll indicators for mobile */}
        {isMobile && canScrollRight && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-8 bg-gradient-to-r from-transparent to-background/60 pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default HorizontalFeatureScroller;
