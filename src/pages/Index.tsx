
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import HeroSection from "@/components/home/HeroSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PromoBanner from "@/components/home/PromoBanner";
import WeatherWidget from "@/components/home/WeatherWidget";
import TipOfTheDay from "@/components/home/TipOfTheDay";
import PremiumFeature from "@/components/home/PremiumFeature";
import { FeatureCardProps } from "@/types/home";
import { Camera, Fish, CloudRain, MessageCircle, Bot } from "lucide-react";

// New imports for the redesigned homepage
import HorizontalScrollSection from "@/components/home/HorizontalScrollSection";
import InteractiveKnowledgeSection from "@/components/home/InteractiveKnowledgeSection";
import InteractiveCarousel from "@/components/home/InteractiveCarousel";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

// Sample testimonials data
const testimonials = [
  {
    author: "Pak Joko",
    quote: "VisionFish membantu saya menganalisa kesegaran ikan dengan lebih akurat!",
    rating: 5
  },
  {
    author: "Bu Siti",
    quote: "Rekomendasi cuaca membantu saya merencanakan kapan pergi melaut",
    rating: 4
  },
  {
    author: "Dani",
    quote: "Fitur identifikasi jenis ikan sangat membantu untuk mengenali ikan-ikan baru",
    rating: 5
  }
];

// Sample features data
const features: FeatureCardProps[] = [
  {
    title: "Analisis Kesegaran",
    description: "Tentukan tingkat kesegaran ikan dengan teknologi AI",
    icon: Camera,
    path: "/fish-analysis",
    preview: "Mudah digunakan"
  },
  {
    title: "Identifikasi Spesies",
    description: "Kenali jenis ikan dengan sekali tangkapan kamera",
    icon: Fish,
    path: "/species-id",
    preview: "Akurasi tinggi"
  },
  {
    title: "Prakiraan Cuaca",
    description: "Informasi cuaca terupdate untuk area perairan",
    icon: CloudRain,
    path: "/weather",
    preview: "Update setiap jam"
  },
  {
    title: "Komunitas Nelayan",
    description: "Terhubung dengan sesama nelayan dan berbagi informasi",
    icon: MessageCircle,
    path: "/chatroom",
    preview: "Diskusi aktif"
  },
  {
    title: "AI Asisten",
    description: "Dapatkan jawaban dan bantuan dari asisten cerdas",
    icon: Bot,
    path: "/ai-chat",
    preview: "Selalu siap"
  }
];

// Sample tips data
const tips = [
  "Ikan segar memiliki mata yang jernih dan cembung",
  "Simpan ikan dalam wadah tertutup di lemari es untuk menjaga kesegarannya",
  "Pastikan insang ikan berwarna merah cerah, bukan kecoklatan",
  "Untuk memeriksa kesegaran, tekan badan ikan. Jika kembali cepat, ikan masih segar",
  "Ikan laut sebaiknya dikonsumsi dalam 2 hari setelah dibeli"
];

// Reordered featured content for carousel - Community first, then AI Technology, then Fishing Tips
const featuredContent = [
  <div key="slide1" className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
    <img 
      src="https://ik.imagekit.io/biajcse64/VisionFish/VisionFish.io/fisherman.png?updatedAt=1750970454694" 
      alt="Komunitas nelayan VisionFish - Bergabung dengan nelayan Indonesia" 
      className="w-full h-full object-cover"
      loading="eager"
      fetchPriority="high"
      decoding="async"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4 md:p-6">
      <h3 className="text-white text-lg md:text-2xl font-bold mb-2">Bergabung dengan Komunitas</h3>
      <p className="text-white/80 text-sm md:text-base">Bagikan pengalaman dan dapatkan tips dari sesama nelayan</p>
    </div>
  </div>,
  <div key="slide2" className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
    <img 
      src="https://ik.imagekit.io/biajcse64/VisionFish/VisionFish.io/underwaterman.png?updatedAt=1750982629340" 
      alt="Teknologi AI VisionFish - Identifikasi ikan dengan teknologi canggih" 
      className="w-full h-full object-cover"
      loading="eager"
      fetchPriority="high"
      decoding="async"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4 md:p-6">
      <h3 className="text-white text-lg md:text-2xl font-bold mb-2">Teknologi AI untuk Perikanan</h3>
      <p className="text-white/80 text-sm md:text-base">Identifikasi jenis dan kesegaran ikan dengan akurasi tinggi</p>
    </div>
  </div>,
  <div key="slide3" className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
    <img 
      src="https://ik.imagekit.io/biajcse64/VisionFish/VisionFish.io/man.png?updatedAt=1750970454751" 
      alt="Tips memancing dan nelayan - tingkatkan hasil tangkapan ikan" 
      className="w-full h-full object-cover"
      loading="eager"
      fetchPriority="high"
      decoding="async"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4 md:p-6">
      <h3 className="text-white text-lg md:text-2xl font-bold mb-2">Tingkatkan Hasil Tangkapan Anda</h3>
      <p className="text-white/80 text-sm md:text-base">Pelajari teknik terbaru untuk penangkapan ikan yang efisien dan berkelanjutan</p>
    </div>
  </div>
];

const HomePage = () => {
  // Scroll-based animations
  const { scrollY } = useScroll();
  const scrollYSpring = useSpring(scrollY, { stiffness: 100, damping: 30 });
  const weatherOpacity = useTransform(scrollYSpring, [0, 300], [1, 0.7]);
  const weatherScale = useTransform(scrollYSpring, [0, 300], [1, 0.98]);
  const tipOpacity = useTransform(scrollYSpring, [0, 300], [1, 0.7]);
  const tipScale = useTransform(scrollYSpring, [0, 300], [1, 0.98]);
  
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const featuresRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Preload critical images for better performance */}
      <link 
        rel="preload" 
        href="https://ik.imagekit.io/biajcse64/VisionFish/VisionFish.io/fisherman.png?updatedAt=1750970454694" 
        as="image"
      />
      <link 
        rel="preload" 
        href="https://ik.imagekit.io/biajcse64/VisionFish/VisionFish.io/underwaterman.png?updatedAt=1750982629340" 
        as="image"
      />
      <link 
        rel="preload" 
        href="https://ik.imagekit.io/biajcse64/VisionFish/VisionFish.io/man.png?updatedAt=1750970454751" 
        as="image"
      />
      
      <div className="container max-w-5xl mx-auto px-3 md:px-4">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Featured Content Carousel - Now with reordered content and optimized images */}
        <div className="mb-6 md:mb-10">
          <InteractiveCarousel
            items={featuredContent}
            autoPlay={true}
            interval={6000}
          />
        </div>
        
        {/* Weather Widget - Fixed to not pass invalid props */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-10">
          <motion.div style={{ opacity: weatherOpacity, scale: weatherScale }}>
            <WeatherWidget />
          </motion.div>
          <motion.div style={{ opacity: tipOpacity, scale: tipScale }}>
            <TipOfTheDay tips={tips} />
          </motion.div>
        </div>
        
        {/* Feature Cards - Enhanced horizontal scroll with focus effects */}
        <div ref={featuresRef} className="scrollbar-none">
          <HorizontalScrollSection 
            title="Fitur Utama" 
            itemWidth={85}
            autoScroll={isMobile}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                className="feature-card h-full"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <div className={cn(
                  "rounded-lg border shadow-md hover:shadow-lg h-full p-4 md:p-5",
                  "bg-card backdrop-blur-sm",
                  theme === "light" 
                    ? "bg-white/90 border-blue-200/60" 
                    : "bg-white/5 border-blue-500/20"
                )}>
                  <div className="flex items-start mb-3 md:mb-4">
                    <div className={cn(
                      "rounded-full p-2 md:p-3 mr-3 md:mr-4",
                      theme === 'light' 
                        ? 'bg-blue-100/80' 
                        : 'bg-blue-500/20'
                    )}>
                      <feature.icon className={cn(
                        "h-5 w-5 md:h-6 md:w-6",
                        theme === 'light' 
                          ? 'text-blue-700' 
                          : 'text-blue-400'
                      )} />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2">{feature.title}</h3>
                      <p className="text-sm md:text-base text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <span className={cn(
                      "text-xs md:text-sm",
                      theme === "light" 
                        ? "text-blue-700" 
                        : "text-blue-400"
                    )}>
                      {feature.preview}
                    </span>
                    <a 
                      href={feature.path}
                      className={cn(
                        "text-xs md:text-sm flex items-center hover:underline",
                        theme === "light" 
                          ? "text-blue-700" 
                          : "text-blue-400"
                      )}
                    >
                      Lihat
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </HorizontalScrollSection>
        </div>
        
        {/* Premium Feature - More prominent placement */}
        <PremiumFeature />
        
        {/* Interactive Knowledge Section */}
        <InteractiveKnowledgeSection />
        
        {/* Testimonials - Kept as is */}
        <TestimonialsSection testimonials={testimonials} />
        
        {/* Promo Banner - Kept as is */}
        <PromoBanner />
      </div>

      {/* Adding CSS for scroll hiding - replaced jsx syntax with regular style tag */}
      <style>
        {`
          .horizontal-scroll::-webkit-scrollbar {
            display: none;
          }
          
          .horizontal-scroll {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          .scrollbar-none::-webkit-scrollbar {
            display: none;
          }
          
          .scrollbar-none {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </>
  );
};

export default HomePage;
