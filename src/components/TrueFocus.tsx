
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface TrueFocusProps {
  sentence?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
}

interface FocusRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence = "True Focus",
  manualMode = false,
  blurAmount = 3,
  borderColor = "#00bcd4",
  glowColor = "rgba(0, 188, 212, 0.6)",
  animationDuration = 1.5,
  pauseBetweenAnimations = 1,
  className = "",
}) => {
  const words = sentence.split(" ");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState<FocusRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // Auto-cycle through words if not in manual mode
  useEffect(() => {
    if (!manualMode && words.length > 1) {
      const interval = setInterval(
        () => {
          setCurrentIndex((prev) => (prev + 1) % words.length);
        },
        (animationDuration + pauseBetweenAnimations) * 1000
      );

      return () => clearInterval(interval);
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  // Update focus rectangle when current index changes
  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return;

    const updateFocusRect = () => {
      if (!wordRefs.current[currentIndex] || !containerRef.current) return;

      const parentRect = containerRef.current.getBoundingClientRect();
      const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect();

      setFocusRect({
        x: activeRect.left - parentRect.left,
        y: activeRect.top - parentRect.top,
        width: activeRect.width,
        height: activeRect.height,
      });
    };

    // Small delay to ensure DOM has updated
    const timeoutId = setTimeout(updateFocusRect, 50);
    return () => clearTimeout(timeoutId);
  }, [currentIndex, words.length]);

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setLastActiveIndex(currentIndex);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentIndex(lastActiveIndex ?? 0);
    }
  };

  return (
    <div 
      className={`relative flex gap-4 justify-center items-center flex-wrap ${className}`} 
      ref={containerRef}
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={`${word}-${index}`}
            ref={(el) => {
              wordRefs.current[index] = el;
            }}
            className={`relative font-black cursor-pointer transition-all duration-300 ${
              manualMode ? "hover:scale-105" : ""
            }`}
            style={{
              filter: isActive ? `blur(0px)` : `blur(${blurAmount}px)`,
              transition: `filter ${animationDuration}s ease, transform 0.3s ease`,
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        );
      })}

      {/* Focus Border Animation */}
      <motion.div
        className="absolute top-0 left-0 pointer-events-none"
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 && focusRect.width > 0 ? 1 : 0,
        }}
        transition={{
          duration: animationDuration,
          ease: "easeInOut",
        }}
      >
        {/* Corner borders with glow effect */}
        <span 
          className="absolute w-4 h-4 border-2 rounded-sm -top-2 -left-2"
          style={{
            borderColor: borderColor,
            borderRight: 'none',
            borderBottom: 'none',
            filter: `drop-shadow(0px 0px 8px ${glowColor})`
          }}
        />
        <span 
          className="absolute w-4 h-4 border-2 rounded-sm -top-2 -right-2"
          style={{
            borderColor: borderColor,
            borderLeft: 'none',
            borderBottom: 'none',
            filter: `drop-shadow(0px 0px 8px ${glowColor})`
          }}
        />
        <span 
          className="absolute w-4 h-4 border-2 rounded-sm -bottom-2 -left-2"
          style={{
            borderColor: borderColor,
            borderRight: 'none',
            borderTop: 'none',
            filter: `drop-shadow(0px 0px 8px ${glowColor})`
          }}
        />
        <span 
          className="absolute w-4 h-4 border-2 rounded-sm -bottom-2 -right-2"
          style={{
            borderColor: borderColor,
            borderLeft: 'none',
            borderTop: 'none',
            filter: `drop-shadow(0px 0px 8px ${glowColor})`
          }}
        />
      </motion.div>
    </div>
  );
};

export default TrueFocus;
