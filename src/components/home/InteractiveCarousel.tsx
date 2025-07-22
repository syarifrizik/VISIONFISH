import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
interface InteractiveCarouselProps {
  items: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
}
const InteractiveCarousel = ({
  items,
  autoPlay = true,
  interval = 5000,
  showArrows = true,
  showDots = true,
  className
}: InteractiveCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const {
    theme
  } = useTheme();
  const isMobile = useIsMobile();
  const carouselRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Auto-advance slides
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoPlay && !isPaused && !isDragging) {
      timer = setTimeout(() => {
        setDirection(1);
        setCurrentIndex(prevIndex => (prevIndex + 1) % items.length);
      }, interval);
    }
    return () => clearTimeout(timer);
  }, [autoPlay, currentIndex, interval, isPaused, items.length, isDragging]);
  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex(prevIndex => (prevIndex - 1 + items.length) % items.length);
  };
  const goToNext = () => {
    setDirection(1);
    setCurrentIndex(prevIndex => (prevIndex + 1) % items.length);
  };
  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isMobile) {
      setIsDragging(true);
      setDragStart('touches' in e ? e.touches[0].clientX : e.clientX);
    }
  };
  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = dragStart - currentX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
      setIsDragging(false);
    }
  };
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Enhanced slide animation variants with smoother transitions
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: {
          type: "spring",
          stiffness: 300,
          damping: 30
        },
        opacity: {
          duration: 0.6
        },
        scale: {
          duration: 0.6
        }
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.95,
      transition: {
        x: {
          type: "spring",
          stiffness: 300,
          damping: 30
        },
        opacity: {
          duration: 0.5
        },
        scale: {
          duration: 0.5
        }
      }
    })
  };

  // Enhanced background glow animation based on the theme
  useEffect(() => {
    controls.start({
      boxShadow: [`0 0 20px ${theme === "light" ? "rgba(62, 170, 255, 0.3)" : "rgba(147, 51, 234, 0.3)"}`, `0 0 40px ${theme === "light" ? "rgba(62, 170, 255, 0.5)" : "rgba(147, 51, 234, 0.5)"}`, `0 0 20px ${theme === "light" ? "rgba(62, 170, 255, 0.3)" : "rgba(147, 51, 234, 0.3)"}`],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse"
      }
    });
  }, [controls, theme]);
  if (items.length === 0) return null;
  return <div className={cn("relative overflow-hidden rounded-xl mb-8", className)} onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} ref={carouselRef}>
      <motion.div className="absolute inset-0 -z-10 rounded-xl" animate={controls} />
      
      <div className="relative overflow-hidden rounded-xl" onTouchStart={handleDragStart} onTouchMove={handleDragMove} onTouchEnd={handleDragEnd} onMouseDown={handleDragStart} onMouseMove={handleDragMove} onMouseUp={handleDragEnd} onMouseLeave={handleDragEnd}>
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div key={currentIndex} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" className="w-full">
            {items[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation arrows with improved visibility */}
      {showArrows && items.length > 1 && <>
          
          
          
        </>}
      
      {/* Enhanced navigation dots with improved visibility */}
      {showDots && items.length > 1 && <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {items.map((_, index) => <button key={index} onClick={() => goToSlide(index)} className={cn("h-2 rounded-full transition-all", index === currentIndex ? theme === "light" ? "bg-ocean-blue w-8" : "bg-primary w-8" : theme === "light" ? "bg-ocean-light/60 w-2 hover:bg-ocean-light" : "bg-primary/60 w-2 hover:bg-primary/80")} aria-label={`Go to slide ${index + 1}`} />)}
        </div>}
    </div>;
};
export default InteractiveCarousel;