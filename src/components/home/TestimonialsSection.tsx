
import { useState, useEffect, useRef } from "react";
import { motion, useInView, useAnimationControls } from "framer-motion";
import { Star } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { TestimonialProps } from "@/types/home";

interface TestimonialsSectionProps {
  testimonials: TestimonialProps[];
}

// Extended testimonials with the requested Indonesian names
const extendedTestimonials: TestimonialProps[] = [
  {
    author: "Adi",
    quote: "VisionFish sangat membantu pekerjaan saya sebagai pedagang ikan. Sekarang saya bisa menilai kualitas ikan dengan lebih akurat.",
    rating: 5
  },
  {
    author: "Indra",
    quote: "Aplikasi yang luar biasa! Membantu saya menentukan kesegaran ikan dengan standar SNI yang tepat.",
    rating: 5
  },
  {
    author: "Bayu",
    quote: "Sebagai nelayan, aplikasi ini sangat berguna untuk memastikan hasil tangkapan saya berkualitas prima sebelum dijual.",
    rating: 4
  },
  {
    author: "Fajar",
    quote: "Fitur analisis kesegaran ikan membantu saya mendapatkan harga terbaik untuk hasil tangkapan saya.",
    rating: 5
  },
  {
    author: "Andi",
    quote: "Saya menggunakan VisionFish setiap hari untuk memastikan saya hanya menjual ikan terbaik kepada pelanggan.",
    rating: 4
  },
  {
    author: "Ibu Kamsiah",
    quote: "Sangat memudahkan untuk memilih ikan segar di pasar. Aplikasi yang praktis dan mudah digunakan.",
    rating: 5
  },
  {
    author: "Bapak Hasyim",
    quote: "Sebagai pemilik usaha pengolahan ikan, VisionFish membantu saya menjaga standar kualitas yang konsisten.",
    rating: 5
  }
];

const TestimonialsSection = ({ testimonials: initialTestimonials }: TestimonialsSectionProps) => {
  const { theme } = useTheme();
  const testimonialsRef = useRef(null);
  const isTestimonialsInView = useInView(testimonialsRef, { once: false, margin: "-100px" });
  const controls = useAnimationControls();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Merge initial testimonials with our extended ones
  const allTestimonials = [...initialTestimonials, ...extendedTestimonials];
  
  // Auto advance testimonials every 4 seconds
  useEffect(() => {
    if (!isTestimonialsInView) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % allTestimonials.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isTestimonialsInView, allTestimonials.length]);
  
  useEffect(() => {
    if (isTestimonialsInView) {
      controls.start({ opacity: 1 });
    }
  }, [isTestimonialsInView, controls]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div ref={testimonialsRef} className="mb-12 md:mb-20">
      <motion.h2 
        className={cn(
          "text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-center",
          theme === "light" ? "text-black" : "text-white"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={isTestimonialsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        Apa Kata Pengguna Kami
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={controls}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-4xl mx-auto"
      >
        <div className="relative overflow-hidden">
          <motion.div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {allTestimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="w-full flex-shrink-0 px-2 md:px-4"
              >
                <div className={cn(
                  "p-4 md:p-6 h-full max-w-2xl mx-auto",
                  theme === "light" 
                    ? "bg-white/20 backdrop-blur-md border border-white/20" 
                    : "bg-white/5 backdrop-blur-md border border-white/10",
                  "rounded-xl shadow-md"
                )}>
                  <div className="flex items-start">
                    <div className="mr-3 md:mr-4">
                      <div className={cn(
                        "rounded-full p-1.5 md:p-2",
                        theme === "light" ? "bg-ocean-light/20" : "bg-primary/20"
                      )}>
                        <Star className={cn(
                          "h-4 w-4 md:h-6 md:w-6",
                          theme === "light" ? "text-ocean-blue" : "text-primary"
                        )} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm md:text-lg italic leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                      <p className={cn(
                        "text-right text-xs md:text-sm mt-2",
                        theme === "light" ? "text-ocean-blue" : "text-primary"
                      )}>– {testimonial.author}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
          
          {/* Navigation dots */}
          <div className="flex justify-center mt-4 md:mt-6 gap-1.5 md:gap-2">
            {allTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "h-1.5 md:h-2 rounded-full transition-all duration-300",
                  index === currentIndex
                    ? theme === "light" 
                      ? "bg-ocean-blue w-6 md:w-8" 
                      : "bg-purple-500 w-6 md:w-8"
                    : theme === "light"
                      ? "bg-ocean-blue/40 w-1.5 md:w-2 hover:bg-ocean-blue/60" 
                      : "bg-purple-500/40 w-1.5 md:w-2 hover:bg-purple-500/60"
                )}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TestimonialsSection;
