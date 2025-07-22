
import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import ScrollIndicator from "./ScrollIndicator";

interface HorizontalCardScrollerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  cardWidth?: string;
  cardGap?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  snapToCard?: boolean;
  className?: string;
  onCardChange?: (index: number) => void;
  incomplete?: boolean;
  currentIndex?: number;
  forceSync?: boolean;
}

const HorizontalCardScroller: React.FC<HorizontalCardScrollerProps> = ({
  children,
  title,
  description,
  cardWidth = "300px",
  cardGap = 16,
  showControls = true,
  showIndicators = false,
  snapToCard = true,
  className = "",
  onCardChange,
  incomplete = false,
  currentIndex = 0,
  forceSync = false,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [internalIndex, setInternalIndex] = useState(currentIndex);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);
  const isMobile = useIsMobile();
  const childrenArray = React.Children.toArray(children);

  // Calculate actual card width including gap
  const cardWidthNum = parseInt(cardWidth.replace('px', ''));
  const totalCardWidth = cardWidthNum + cardGap;

  // Enhanced external index sync - this is the key fix for navigation buttons
  useEffect(() => {
    if (currentIndex !== internalIndex) {
      console.log('HorizontalCardScroller: External navigation detected', { 
        currentIndex, 
        internalIndex,
        difference: Math.abs(currentIndex - internalIndex)
      });
      
      // Always respond to external navigation changes immediately
      setIsProgrammaticScroll(true);
      setInternalIndex(currentIndex);
      
      // Force scroll to the new position
      setTimeout(() => {
        scrollToCard(currentIndex, false);
      }, 50);
      
      // Reset programmatic scroll flag
      setTimeout(() => {
        setIsProgrammaticScroll(false);
      }, 500);
    }
  }, [currentIndex]);

  // Enhanced scroll state detection
  const updateScrollState = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);

    // Only detect card changes during user scrolling
    if (isMobile && snapToCard && childrenArray.length > 0 && isUserScrolling && !isProgrammaticScroll) {
      const containerPadding = 16;
      const scrollCenter = scrollLeft + (clientWidth / 2);
      
      let closestIndex = 0;
      let minDistance = Infinity;
      
      for (let i = 0; i < childrenArray.length; i++) {
        const cardStart = containerPadding + (i * totalCardWidth);
        const cardCenter = cardStart + (cardWidthNum / 2);
        const distance = Math.abs(cardCenter - scrollCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }
      
      if (closestIndex !== internalIndex && minDistance < cardWidthNum / 2) {
        console.log('HorizontalCardScroller: User scroll detected card change', { 
          from: internalIndex, 
          to: closestIndex
        });
        setInternalIndex(closestIndex);
        onCardChange?.(closestIndex);
      }
    }
  }, [childrenArray.length, isMobile, snapToCard, internalIndex, onCardChange, totalCardWidth, cardWidthNum, isUserScrolling, isProgrammaticScroll]);

  // Improved scroll handler
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollTimeout: NodeJS.Timeout;
    let userScrollTimeout: NodeJS.Timeout;
    
    const handleScrollStart = () => {
      if (!isProgrammaticScroll) {
        setIsUserScrolling(true);
      }
    };
    
    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (userScrollTimeout) clearTimeout(userScrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        updateScrollState();
      }, 50);
      
      userScrollTimeout = setTimeout(() => {
        if (!isProgrammaticScroll) {
          setIsUserScrolling(false);
        }
      }, 200);
    };
    
    scrollContainer.addEventListener('touchstart', handleScrollStart, { passive: true });
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial state check
    setTimeout(updateScrollState, 100);
    
    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (userScrollTimeout) clearTimeout(userScrollTimeout);
      scrollContainer.removeEventListener('touchstart', handleScrollStart);
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [updateScrollState, isProgrammaticScroll]);

  // Enhanced scroll to card with perfect positioning
  const scrollToCard = useCallback((index: number, notify: boolean = true) => {
    if (!scrollContainerRef.current || index < 0 || index >= childrenArray.length) {
      return;
    }
    
    const container = scrollContainerRef.current;
    const containerPadding = 16;
    const containerWidth = container.clientWidth;
    
    // Calculate perfect center position for the target card
    const cardStart = containerPadding + (index * totalCardWidth);
    const cardCenter = cardStart + (cardWidthNum / 2);
    const targetScroll = cardCenter - (containerWidth / 2);
    
    // Ensure scroll position is within bounds
    const maxScroll = container.scrollWidth - containerWidth;
    const finalScroll = Math.max(0, Math.min(targetScroll, maxScroll));
    
    console.log('HorizontalCardScroller: Scrolling to card', {
      index,
      cardStart,
      cardCenter,
      targetScroll,
      finalScroll,
      containerWidth,
      notify
    });
    
    // Update internal state if this is a user-initiated change
    if (notify && index !== internalIndex) {
      setInternalIndex(index);
      onCardChange?.(index);
    }
    
    // Perform smooth scroll with enhanced timing
    container.scrollTo({
      left: finalScroll,
      behavior: 'smooth'
    });
    
  }, [childrenArray.length, totalCardWidth, cardWidthNum, onCardChange, internalIndex]);

  // Enhanced scroll function for controls
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    if (snapToCard && isMobile) {
      const targetIndex = direction === 'left' 
        ? Math.max(0, internalIndex - 1)
        : Math.min(childrenArray.length - 1, internalIndex + 1);
      
      if (targetIndex !== internalIndex) {
        scrollToCard(targetIndex);
      }
    } else {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.75;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Handle indicator clicks
  const handleIndicatorClick = useCallback((index: number) => {
    console.log('HorizontalCardScroller: Indicator clicked', { 
      index, 
      currentIndex: internalIndex 
    });
    if (index !== internalIndex) {
      scrollToCard(index);
    }
  }, [internalIndex, scrollToCard]);

  return (
    <div className={`relative w-full ${className}`}>
      {title && (
        <div className="mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      
      <div className="relative">
        {/* Scrollable container */}
        <div className="relative">
          <div 
            ref={scrollContainerRef} 
            className={cn(
              "flex overflow-x-auto pb-2 scrollbar-hide px-4", // Reduced padding bottom
              snapToCard && isMobile && "snap-x snap-mandatory"
            )}
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none', 
              gap: `${cardGap}px`
            }}
          >
            {React.Children.map(children, (child, index) => (
              <div 
                className={cn(
                  "flex-shrink-0",
                  snapToCard && isMobile && "snap-center"
                )}
                style={{ width: cardWidth }}
                key={index}
              >
                {child}
              </div>
            ))}
          </div>
          
          {/* Gradient shadows */}
          {canScrollLeft && (
            <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none z-10" />
          )}
          {canScrollRight && (
            <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none z-10" />
          )}
        </div>
        
        {/* Desktop Controls */}
        {showControls && !isMobile && (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "absolute top-1/2 -left-4 -translate-y-1/2 h-8 w-8 rounded-full bg-background border shadow-md hover:shadow-lg transition-all",
                !canScrollLeft && "opacity-0 pointer-events-none"
              )}
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "absolute top-1/2 -right-4 -translate-y-1/2 h-8 w-8 rounded-full bg-background border shadow-md hover:shadow-lg transition-all",
                !canScrollRight && "opacity-0 pointer-events-none"
              )}
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Mobile Indicators with adjusted spacing */}
        {showIndicators && isMobile && childrenArray.length > 1 && (
          <div className="flex justify-center pt-2 pb-1"> {/* Reduced spacing */}
            <ScrollIndicator
              currentIndex={internalIndex}
              totalItems={childrenArray.length}
              onIndicatorClick={handleIndicatorClick}
              incomplete={incomplete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HorizontalCardScroller;
