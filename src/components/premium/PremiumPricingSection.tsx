
import { motion } from "framer-motion";
import { Crown, Check, Star } from "lucide-react";
import PremiumUpgradeCard from "./PremiumUpgradeCard";

interface PremiumPricingSectionProps {
  onUpgradeSuccess: () => void;
}

const PremiumPricingSection = ({ onUpgradeSuccess }: PremiumPricingSectionProps) => {
  return (
    <section className="px-4 md:px-6 py-8 md:py-16">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
            Investasi Terbaik untuk <span className="text-visionfish-neon-pink">Memancing</span>
          </h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Hanya dengan harga secangkir kopi per hari, dapatkan akses ke teknologi VisionFish AI terdepan 
            dan tingkatkan hasil tangkapan Anda secara signifikan.
          </p>
        </motion.div>

        {/* Pricing Comparison */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-muted/30 rounded-2xl p-6 md:p-8 relative"
          >
            <div className="text-center mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-bold mb-2">Free</h3>
              <div className="text-2xl md:text-3xl font-bold">Rp0</div>
              <div className="text-muted-foreground text-sm md:text-base">per bulan</div>
            </div>

            <ul className="space-y-2 md:space-y-3">
              {[
                "5 analisis gambar per hari",
                "10 chat VisionFish AI per hari",
                "Info cuaca basic",
                "3 promosi produk per hari",
                "Profile basic"
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs md:text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-visionfish-neon-pink/10 to-visionfish-neon-purple/10 rounded-2xl p-6 md:p-8 relative border-2 border-visionfish-neon-pink/20"
          >
            {/* Popular Badge */}
            <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-visionfish-neon-pink to-visionfish-neon-purple text-white px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-medium flex items-center gap-1">
                <Star className="w-3 h-3" />
                Paling Populer
              </div>
            </div>

            <div className="text-center mb-4 md:mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="w-5 h-5 md:w-6 md:h-6 text-visionfish-neon-pink" />
                <h3 className="text-xl md:text-2xl font-bold">Premium</h3>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-visionfish-neon-pink">Rp49.000</div>
              <div className="text-muted-foreground text-sm md:text-base">per bulan</div>
              <div className="text-xs md:text-sm text-muted-foreground mt-1">
                ~Rp1.600/hari
              </div>
            </div>

            <ul className="space-y-2 md:space-y-3">
              {[
                "Analisis gambar unlimited",
                "Chat VisionFish AI unlimited + Premium",
                "Data historis cuaca 5 tahun",
                "Promosi produk unlimited",
                "Laporan PDF profesional",
                "Support prioritas <2 jam"
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-visionfish-neon-pink flex-shrink-0" />
                  <span className="text-xs md:text-sm font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 md:p-6 max-w-2xl mx-auto">
            <h3 className="text-base md:text-lg font-bold text-green-700 mb-2">
              ROI Terbukti untuk Pemancing Profesional
            </h3>
            <p className="text-green-600 text-xs md:text-sm">
              Premium users melaporkan peningkatan hasil tangkapan hingga <strong>40%</strong> 
              dan penghematan waktu <strong>60%</strong> dalam planning trip memancing.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          <PremiumUpgradeCard onUpgradeSuccess={onUpgradeSuccess} />
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumPricingSection;
