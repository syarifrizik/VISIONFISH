
import { motion } from "framer-motion";
import { 
  Brain, 
  CloudRain, 
  FileBarChart, 
  MessageCircle, 
  Sparkles, 
  TrendingUp,
  Zap,
  Shield
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import HorizontalFeatureScroller from "./HorizontalFeatureScroller";
import { useIsMobile } from "@/hooks/use-mobile";

const PremiumBenefitsShowcase = () => {
  const isMobile = useIsMobile();
  
  const benefits = [
    {
      icon: Brain,
      title: "VisionFish AI Canggih",
      description: "Akses ke teknologi VisionFish AI terdepan untuk analisis yang lebih akurat dan mendalam",
      color: "from-blue-500 to-cyan-500",
      features: ["Identifikasi spesies 99% akurat", "Analisis kesegaran real-time", "Rekomendasi personal"]
    },
    {
      icon: CloudRain,
      title: "Data Historis Cuaca",
      description: "Analisis tren cuaca 5 tahun terakhir untuk prediksi yang lebih baik",
      color: "from-green-500 to-teal-500",
      features: ["Riwayat cuaca 5 tahun", "Prediksi pattern musiman", "Alert cuaca ekstrem"]
    },
    {
      icon: FileBarChart,
      title: "Laporan PDF Premium",
      description: "Dapatkan laporan analisis mendalam dengan visualisasi profesional",
      color: "from-purple-500 to-pink-500",
      features: ["Grafik interaktif", "Export ke PDF/Excel", "Analisis trend personal"]
    },
    {
      icon: MessageCircle,
      title: "Chat Unlimited",
      description: "Diskusi tanpa batas dengan VisionFish AI expert dan komunitas premium",
      color: "from-orange-500 to-red-500",
      features: ["Chat unlimited", "Priority response", "Expert consultation"]
    },
    {
      icon: Sparkles,
      title: "Fitur Eksperimental",
      description: "Akses awal ke fitur terbaru dan teknologi cutting-edge VisionFish",
      color: "from-yellow-500 to-orange-500",
      features: ["Beta features", "Early access", "Feedback priority"]
    },
    {
      icon: Shield,
      title: "Support Prioritas",
      description: "Bantuan langsung dari tim ahli dengan response time <2 jam",
      color: "from-indigo-500 to-purple-500",
      features: ["Response <2 jam", "Live chat support", "Personal consultation"]
    }
  ];

  const BenefitCard = ({ benefit, index }: { benefit: typeof benefits[0], index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className={`h-full ${isMobile ? 'min-w-[280px] snap-start' : ''}`}
    >
      <Card className="h-full border-0 bg-gradient-to-br from-background to-muted/30 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6 md:p-8">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
            className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-r ${benefit.color} p-3 md:p-4 mb-4 md:mb-6`}
          >
            <benefit.icon className="w-full h-full text-white" />
          </motion.div>

          {/* Content */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-lg md:text-xl font-bold">{benefit.title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              {benefit.description}
            </p>

            {/* Features List */}
            <ul className="space-y-2">
              {benefit.features.map((feature, featureIndex) => (
                <motion.li
                  key={featureIndex}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + featureIndex * 0.05 }}
                  className="flex items-center gap-2 text-xs md:text-sm"
                >
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${benefit.color}`} />
                  {feature}
                </motion.li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <section className="px-4 md:px-6 py-8 md:py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
            Mengapa Memilih <span className="text-visionfish-neon-pink">Premium?</span>
          </h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Premium memberikan Anda akses ke teknologi VisionFish terdepan dan dukungan profesional 
            untuk memaksimalkan hasil tangkapan dan pengalaman memancing Anda.
          </p>
        </motion.div>

        {/* Benefits Grid/Scroll */}
        {isMobile ? (
          <HorizontalFeatureScroller className="mb-8 md:mb-16">
            {benefits.map((benefit, index) => (
              <BenefitCard key={index} benefit={benefit} index={index} />
            ))}
          </HorizontalFeatureScroller>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <BenefitCard key={index} benefit={benefit} index={index} />
            ))}
          </div>
        )}

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
        >
          {[
            { label: "Akurasi Analisis", value: "99.2%", icon: TrendingUp },
            { label: "Response Time", value: "<2 jam", icon: Zap },
            { label: "User Premium", value: "500+", icon: Sparkles },
            { label: "Kepuasan", value: "98%", icon: Shield },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 bg-gradient-to-r from-visionfish-neon-pink to-visionfish-neon-purple rounded-lg flex items-center justify-center">
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="text-lg md:text-2xl font-bold text-visionfish-neon-pink">{stat.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumBenefitsShowcase;
