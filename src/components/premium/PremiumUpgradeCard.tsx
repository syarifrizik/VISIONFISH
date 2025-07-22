
import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PaymentModal from "./PaymentModal";

interface PremiumUpgradeCardProps {
  onUpgradeSuccess: () => void;
}

const PremiumUpgradeCard = ({ onUpgradeSuccess }: PremiumUpgradeCardProps) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePaymentSuccess = () => {
    onUpgradeSuccess();
    setShowPaymentModal(false);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="relative overflow-hidden border-2 border-visionfish-neon-pink/20 bg-gradient-to-br from-visionfish-neon-pink/5 via-visionfish-neon-purple/5 to-visionfish-neon-blue/5">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-10 -right-10 w-20 h-20 bg-visionfish-neon-pink/10 rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-10 -left-10 w-16 h-16 bg-visionfish-neon-purple/10 rounded-full"
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.5, 0.3, 0.5]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>

          <CardContent className="relative z-10 p-8">
            <div className="text-center space-y-6">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex justify-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-visionfish-neon-pink to-visionfish-neon-purple rounded-full flex items-center justify-center">
                  <Crown className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              {/* Title */}
              <div>
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold mb-2"
                >
                  Upgrade ke Premium
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground"
                >
                  Dapatkan akses tanpa batas ke semua fitur canggih VisionFish
                </motion.p>
              </div>

              {/* Price */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-visionfish-neon-pink to-visionfish-neon-purple bg-clip-text text-transparent">
                  Rp49.000
                </div>
                <div className="text-sm text-muted-foreground">per bulan</div>
              </motion.div>

              {/* Features Preview */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 gap-3 text-sm"
              >
                {[
                  "Analisis Tanpa Batas",
                  "AI Model Canggih", 
                  "Data Historis",
                  "Laporan PDF"
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="w-3 h-3 text-visionfish-neon-pink" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full bg-gradient-to-r from-visionfish-neon-pink to-visionfish-neon-purple hover:opacity-90 text-white font-semibold py-6 group"
                  size="lg"
                >
                  <span>Upgrade Sekarang</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-xs text-muted-foreground space-y-1"
              >
                <div>✓ 30 hari garansi uang kembali</div>
                <div>✓ Dapat dibatalkan kapan saja</div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </>
  );
};

export default PremiumUpgradeCard;
