
import { useRef, useEffect, useState } from "react";
import { motion, useTransform, useScroll, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const HeroSection = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isInView, setIsInView] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);
  const imageTranslateX = useSpring(useTransform(mouseX, [-100, 100], [10, -10]), { stiffness: 50, damping: 15 });
  const imageTranslateY = useSpring(useTransform(mouseY, [-100, 100], [5, -5]), { stiffness: 50, damping: 15 });

  // Handle mouse move for parallax effect (desktop only)
  useEffect(() => {
    if (isMobile || !heroRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY, isMobile]);

  // Check if hero section is in view
  useEffect(() => {
    if (!heroRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    observer.observe(heroRef.current);
    
    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  // Text animation variants
  const headingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.3,
        duration: 0.7,
        ease: [0.6, 0.05, 0.01, 0.9]
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.5,
        duration: 0.7,
        ease: [0.6, 0.05, 0.01, 0.9]
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.7,
        duration: 0.7,
        ease: [0.6, 0.05, 0.01, 0.9]
      }
    }
  };

  return (
    <motion.div 
      ref={heroRef}
      style={{ opacity: heroOpacity, scale: heroScale }}
      className="hero-section relative rounded-2xl overflow-hidden mb-10"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="hero-image-container h-[500px] sm:h-[450px] md:h-[500px] lg:h-[550px] overflow-hidden relative">
        <motion.img 
          ref={imageRef}
          src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80" 
          alt="Ocean waves" 
          className="w-full h-full object-cover transform scale-[1.03]"
          style={!isMobile ? {
            translateX: imageTranslateX,
            translateY: imageTranslateY
          } : undefined}
          animate={{ scale: isInView ? 1.08 : 1.03 }}
          transition={{ duration: 20, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        />
        <div className={cn(
          "absolute inset-0",
          theme === 'light' 
            ? 'bg-gradient-to-r from-blue-600/85 to-sky-600/75' 
            : 'bg-gradient-to-r from-purple-deep/95 to-visionfish-neon-purple/85'
        )}>
          
          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-16 py-6 sm:py-8">
            <div className="max-w-xl relative z-10 w-full">
              <motion.h1 
                className={cn(
                  "font-bold mb-4 sm:mb-6 text-white leading-tight",
                  "text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
                )}
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.7), 0 0 8px rgba(0,0,0,0.5)'
                }}
                variants={headingVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                Optimalkan Pengalaman Ilmu Perikanan Anda dengan VisionFish!
              </motion.h1>
              
              <motion.p 
                className={cn(
                  "text-white mb-6 sm:mb-8 max-w-lg leading-relaxed",
                  "text-sm sm:text-base md:text-lg"
                )}
                style={{
                  textShadow: '1px 1px 3px rgba(0,0,0,0.7), 0 0 6px rgba(0,0,0,0.5)'
                }}
                variants={textVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                Analisis kesegaran ikan, identifikasi spesies, dapatkan informasi cuaca, 
                saling berinteraksi, hingga terkoneksi dengan AI spesialis perikanan dalam satu platform terintegrasi.
              </motion.p>
              
              <motion.div
                className="flex flex-col gap-3 sm:flex-row sm:gap-4"
                variants={buttonVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                <Button 
                  onClick={() => navigate('/fish-analysis')} 
                  size={isMobile ? "lg" : "lg"}
                  className={cn(
                    "relative overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 w-full sm:w-auto font-semibold text-base sm:text-lg py-3 px-6",
                    theme === "light" 
                      ? "bg-white text-blue-700 hover:bg-blue-50 border-2 border-white/60 hover:border-white" 
                      : "bg-visionfish-neon-purple text-white hover:bg-visionfish-neon-purple/90 border-2 border-white/30"
                  )}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Coba Sekarang
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </Button>
                <Button 
                  onClick={() => navigate('/premium')} 
                  variant="outline" 
                  size={isMobile ? "lg" : "lg"}
                  className="border-2 border-white text-white hover:bg-white/20 hover:text-white w-full sm:w-auto font-semibold text-base sm:text-lg py-3 px-6 backdrop-blur-sm shadow-xl hover:shadow-2xl bg-white/10 transition-all duration-300"
                  style={{
                    textShadow: '1px 1px 3px rgba(0,0,0,0.7)'
                  }}
                >
                  Fitur Premium
                </Button>
              </motion.div>
              
              {!isMobile && (
                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-xl animate-pulse opacity-60"></div>
              )}
            </div>
          </div>
          
          {/* Floating elements for desktop */}
          {!isMobile && (
            <>
              <motion.div 
                className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-white opacity-70"
                animate={{ 
                  y: [0, -15, 0],
                  opacity: [0.7, 0.4, 0.7]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute bottom-1/4 right-1/3 w-3 h-3 rounded-full bg-white opacity-60"
                animate={{ 
                  y: [0, -10, 0],
                  opacity: [0.6, 0.3, 0.6]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
            </>
          )}
          
          {/* Wave decoration at bottom of hero */}
          <svg className="absolute bottom-0 left-0 right-0" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 1440 320">
            <path 
              fill={theme === 'light' ? '#FFFFFF' : '#121212'} 
              fillOpacity="1" 
              d="M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,197.3C672,213,768,235,864,224C960,213,1056,171,1152,160C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
            </path>
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
