
import { useState, useEffect } from 'react';

interface RotatingTextProps {
  texts: string[];
  className?: string;
  interval?: number;
}

const RotatingText = ({ texts, className = "", interval = 3000 }: RotatingTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <div className={`transition-all duration-500 ease-in-out ${className}`}>
      <span className="inline-block animate-fade-in bg-gradient-to-r from-visionfish-neon-blue to-visionfish-neon-pink bg-clip-text text-transparent">
        {texts[currentIndex]}
      </span>
    </div>
  );
};

export default RotatingText;
