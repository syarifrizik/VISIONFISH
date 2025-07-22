
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const PremiumTestimonials = () => {
  const isMobile = useIsMobile();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const testimonials = [
    {
      name: "Budi Santoso",
      role: "Nelayan Profesional",
      location: "Bali",
      rating: 5,
      text: "Sejak pakai Premium, hasil tangkapan saya naik 40%! VisionFish AI analysis-nya sangat akurat, dan data cuaca historis membantu saya planning trip yang lebih efektif. Worth every penny!",
      initials: "BS",
      color: "bg-blue-500"
    },
    {
      name: "Sinta Dewi",
      role: "Pengusaha Perikanan",
      location: "Surabaya",
      rating: 5,
      text: "Premium features yang paling saya suka adalah laporan PDF-nya. Sangat membantu untuk analisis bisnis dan presentasi ke investor. Customer support-nya juga responsif banget!",
      initials: "SD",
      color: "bg-pink-500"
    },
    {
      name: "Anto Wijaya",
      role: "Pemancing Rekreasi",
      location: "Jakarta",
      rating: 5,
      text: "Data historis cuaca 5 tahun itu game changer! Sekarang bisa prediksi kondisi terbaik untuk memancing. Chat unlimited juga membantu belajar teknik baru dari komunitas.",
      initials: "AW",
      color: "bg-green-500"
    },
    {
      name: "Diana Putri",
      role: "Pemilik Restoran Seafood",
      location: "Medan",
      rating: 5,
      text: "Fitur identifikasi kesegaran ikan Premium sangat membantu bisnis saya. Akurasinya 99% dan bisa export laporan untuk dokumentasi supplier. Recommended!",
      initials: "DP",
      color: "bg-purple-500"
    },
    {
      name: "Rudi Hermawan",
      role: "Guide Memancing",
      location: "Lombok",
      rating: 5,
      text: "Sebagai guide, Premium membership sangat membantu memberikan layanan terbaik ke klien. VisionFish AI chat unlimited memungkinkan saya sharing knowledge real-time.",
      initials: "RH",
      color: "bg-orange-500"
    },
    {
      name: "Maya Sari",
      role: "Content Creator",
      location: "Yogyakarta",
      rating: 5,
      text: "Analisis unlimited dan laporan PDF premium sangat membantu konten saya. Subscriber jadi lebih engage karena data yang saya share lebih detail dan akurat.",
      initials: "MS",
      color: "bg-teal-500"
    }
  ];

  // For mobile, show 1 testimonial per slide; for desktop, show all
  const itemsPerSlide = isMobile ? 1 : testimonials.length;
  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentTestimonials = () => {
    if (!isMobile) return testimonials;
    const start = currentSlide * itemsPerSlide;
    return testimonials.slice(start, start + itemsPerSlide);
  };

  return (
    <section className="px-4 md:px-6 py-8 md:py-16 bg-gradient-to-b from-muted/20 to-background">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
            Apa Kata <span className="text-visionfish-neon-pink">Pengguna Premium?</span>
          </h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Dengar langsung dari komunitas pemancing profesional yang telah merasakan 
            manfaat upgrade ke Premium.
          </p>
        </motion.div>

        {/* Mobile Carousel Controls */}
        {isMobile && (
          <div className="flex justify-center items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              className="w-8 h-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-visionfish-neon-pink' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              className="w-8 h-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Testimonials Grid/Carousel */}
        <div className={`${isMobile ? '' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'}`}>
          {getCurrentTestimonials().map((testimonial, index) => (
            <motion.div
              key={`${testimonial.name}-${currentSlide}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <Card className="h-full border-0 bg-background shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 md:p-6">
                  {/* Quote Icon */}
                  <div className="flex justify-between items-start mb-3 md:mb-4">
                    <Quote className="w-6 h-6 md:w-8 md:h-8 text-visionfish-neon-pink/30" />
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-muted-foreground leading-relaxed mb-4 md:mb-6 text-sm md:text-sm">
                    "{testimonial.text}"
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 md:w-12 md:h-12">
                      <AvatarFallback className={`${testimonial.color} text-white font-bold text-sm`}>
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                      <div className="text-xs text-visionfish-neon-pink">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8 md:mt-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-3xl mx-auto">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-visionfish-neon-pink">98%</div>
              <div className="text-xs md:text-sm text-muted-foreground">Tingkat Kepuasan</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-visionfish-neon-pink">500+</div>
              <div className="text-xs md:text-sm text-muted-foreground">Premium Users</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-visionfish-neon-pink">4.9/5</div>
              <div className="text-xs md:text-sm text-muted-foreground">Rating Average</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumTestimonials;
