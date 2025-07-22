
import { motion } from "framer-motion";
import { Crown, Sparkles, Star, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PremiumUpgradeCard from "./PremiumUpgradeCard";

interface EnhancedPremiumHeroProps {
  onUpgradeSuccess: () => void;
}

const EnhancedPremiumHero = ({ onUpgradeSuccess }: EnhancedPremiumHeroProps) => {
  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient and animated elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-visionfish-neon-purple/10 via-visionfish-neon-pink/10 to-visionfish-neon-blue/10">
        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-visionfish-neon-pink to-visionfish-neon-purple opacity-20"
            style={{
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-4 md:px-6 py-8 md:py-16 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Column - Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 md:space-y-8"
            >
              {/* Premium Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-visionfish-neon-pink to-visionfish-neon-purple p-1 rounded-full"
              >
                <div className="bg-white rounded-full p-2">
                  <Crown className="w-4 h-4 text-visionfish-neon-pink" />
                </div>
                <span className="text-white px-3 md:px-4 py-1 text-xs md:text-sm font-medium">
                  Upgrade to Premium
                </span>
              </motion.div>

              {/* Main Headline */}
              <div className="space-y-3 md:space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-4xl lg:text-6xl font-bold leading-tight"
                >
                  Maksimalkan
                  <span className="bg-gradient-to-r from-visionfish-neon-pink to-visionfish-neon-purple bg-clip-text text-transparent">
                    {" "}Pengalaman{" "}
                  </span>
                  Memancing Anda
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-base md:text-xl text-muted-foreground leading-relaxed"
                >
                  Dapatkan akses tak terbatas ke analisis VisionFish AI canggih, data historis cuaca, 
                  dan fitur eksklusif yang dirancang untuk meningkatkan hasil tangkapan Anda.
                </motion.p>
              </div>

              {/* Key Benefits - Mobile Optimized */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 gap-3 md:gap-4"
              >
                {[
                  { icon: Zap, text: "Analisis Tanpa Batas", color: "text-yellow-500" },
                  { icon: Star, text: "VisionFish AI Premium", color: "text-blue-500" },
                  { icon: Sparkles, text: "Data Historis", color: "text-purple-500" },
                  { icon: Crown, text: "Support Prioritas", color: "text-pink-500" },
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-2 md:gap-3"
                  >
                    <div className={`p-1.5 md:p-2 rounded-lg bg-background/50 ${benefit.color}`}>
                      <benefit.icon className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <span className="font-medium text-sm md:text-base">{benefit.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Social Proof - Mobile Optimized */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col md:flex-row items-center gap-4 md:gap-6 pt-4"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-visionfish-neon-pink to-visionfish-neon-purple border-2 border-background flex items-center justify-center text-white font-bold text-xs md:text-sm"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Dipercaya oleh <span className="font-semibold">500+</span> pemancing profesional
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Upgrade Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center"
            >
              <PremiumUpgradeCard onUpgradeSuccess={onUpgradeSuccess} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedPremiumHero;
