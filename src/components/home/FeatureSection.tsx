
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { FeatureCardProps } from "@/types/home";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface FeatureSectionProps {
  features: FeatureCardProps[];
}

const FeatureSection = ({ features }: FeatureSectionProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const featuresRef = useRef(null);
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-100px" });

  return (
    <div ref={featuresRef} className="mb-8 md:mb-12">
      <motion.h2 
        className={cn(
          "text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-center",
          theme === "light" 
            ? "text-ocean-deep" 
            : "text-gradient-purple"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        Fitur Utama
      </motion.h2>
      
      {isMobile ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={isFeaturesInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {features.map((feature, index) => (
                <CarouselItem key={feature.title} className="pl-2 md:pl-4 basis-4/5 sm:basis-3/5 md:basis-1/2 lg:basis-1/3">
                  <motion.div 
                    className="feature-card group h-full"
                    initial={{ opacity: 0, x: 20 }}
                    animate={isFeaturesInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                    onClick={() => navigate(feature.path)}
                  >
                    <Card className={cn(
                      "h-full overflow-hidden transition-all duration-300",
                      theme === "light" 
                        ? "bg-white/90 border-ocean-light/30" 
                        : "bg-white/5 backdrop-blur-md border-white/10",
                      "shadow-md hover:shadow-lg"
                    )}>
                      <div className="p-4 md:p-6 flex flex-col h-full relative">
                        {/* Background decoration */}
                        <div className={cn(
                          "absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 rounded-full opacity-5 transform translate-x-1/2 -translate-y-1/2 transition-all duration-500",
                          theme === "light" 
                            ? "bg-ocean-blue" 
                            : "bg-visionfish-neon-purple",
                          "group-hover:scale-150"
                        )}></div>
                        
                        <div className="flex items-start mb-3 md:mb-2 relative z-10">
                          <div className={cn(
                            "rounded-full p-2 md:p-2.5 mr-2 md:mr-3",
                            theme === 'light' 
                              ? 'bg-ocean-light/20' 
                              : 'bg-visionfish-neon-blue/20'
                          )}>
                            <feature.icon className={cn(
                              "h-4 w-4 md:h-5 md:w-5",
                              theme === 'light' 
                                ? 'text-ocean-blue' 
                                : 'text-visionfish-neon-blue'
                            )} />
                          </div>
                          <div>
                            <h3 className="text-base md:text-lg font-semibold mb-1">{feature.title}</h3>
                            <p className="text-xs md:text-sm text-muted-foreground leading-snug">{feature.description}</p>
                          </div>
                        </div>
                        
                        <div className="mt-auto flex items-center justify-between relative z-10">
                          <span className={cn(
                            "text-xs md:text-sm",
                            theme === "light" 
                              ? "text-ocean-blue" 
                              : "text-visionfish-neon-blue"
                          )}>
                            {feature.preview}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={cn(
                              "text-xs md:text-sm h-auto p-1",
                              theme === "light" 
                                ? "text-ocean-blue hover:bg-ocean-blue/10" 
                                : "text-visionfish-neon-blue hover:bg-visionfish-neon-blue/10"
                            )}
                          >
                            Lihat <ChevronRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:flex items-center justify-end gap-1 mt-4">
              <CarouselPrevious className="relative -left-0 h-8 w-8" />
              <CarouselNext className="relative -right-0 h-8 w-8" />
            </div>
          </Carousel>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={isFeaturesInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title}
              className="feature-card group"
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={isFeaturesInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              onClick={() => navigate(feature.path)}
            >
              <Card className={cn(
                "h-full overflow-hidden transition-all duration-300",
                theme === "light" 
                  ? "bg-white/90 border-ocean-light/30" 
                  : "bg-white/5 backdrop-blur-md border-white/10",
                "shadow-md hover:shadow-lg"
              )}>
                <div className="p-6 flex flex-col h-full relative">
                  {/* Background decoration */}
                  <div className={cn(
                    "absolute top-0 right-0 w-24 h-24 rounded-full opacity-5 transform translate-x-1/2 -translate-y-1/2 transition-all duration-500",
                    theme === "light" 
                      ? "bg-ocean-blue" 
                      : "bg-visionfish-neon-purple",
                    "group-hover:scale-150"
                  )}></div>
                  
                  <div className="flex items-start mb-4 relative z-10">
                    <div className={cn(
                      "rounded-full p-3 mr-4",
                      theme === 'light' 
                        ? 'bg-ocean-light/20' 
                        : 'bg-visionfish-neon-blue/20'
                    )}>
                      <feature.icon className={cn(
                        "h-6 w-6",
                        theme === 'light' 
                          ? 'text-ocean-blue' 
                          : 'text-visionfish-neon-blue'
                      )} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between relative z-10">
                    <span className={cn(
                      "text-sm",
                      theme === "light" 
                        ? "text-ocean-blue" 
                        : "text-visionfish-neon-blue"
                    )}>
                      {feature.preview}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={cn(
                        theme === "light" 
                          ? "text-ocean-blue hover:bg-ocean-blue/10" 
                          : "text-visionfish-neon-blue hover:bg-visionfish-neon-blue/10"
                      )}
                    >
                      Lihat <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default FeatureSection;
