
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Shield, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MidtransPayment from "./MidtransPayment";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess, onPaymentError }: PaymentModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);

  const features = [
    "Analisis Gambar Tanpa Batas",
    "AI Chat Model Canggih",
    "Data Historis Cuaca",
    "Laporan PDF dengan Visualisasi",
    "Prioritas Dukungan 24/7",
    "Fitur Eksperimental"
  ];

  const paymentMethods = [
    { name: "Transfer Bank", icon: "🏦", desc: "BCA, BNI, BRI, Mandiri" },
    { name: "E-Wallet", icon: "📱", desc: "GoPay, OVO, DANA, LinkAja" },
    { name: "Kartu Kredit", icon: "💳", desc: "Visa, Mastercard" },
    { name: "Minimarket", icon: "🏪", desc: "Alfamart, Indomaret" }
  ];

  const handlePaymentSuccess = () => {
    setCurrentStep(3);
    setTimeout(() => {
      onPaymentSuccess();
      onClose();
      setCurrentStep(1);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold">Upgrade ke Premium</h2>
                <p className="text-muted-foreground">Unlock semua fitur canggih VisionFish</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6">
              {/* Step Indicator */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      currentStep >= step 
                        ? 'bg-visionfish-neon-pink text-white' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {currentStep > step ? <CheckCircle className="w-4 h-4" /> : step}
                    </div>
                    {step < 3 && (
                      <div className={`w-12 h-0.5 mx-2 transition-colors ${
                        currentStep > step ? 'bg-visionfish-neon-pink' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Pricing */}
                    <Card className="border-visionfish-neon-pink/20 bg-gradient-to-br from-visionfish-neon-pink/5 to-visionfish-neon-purple/5">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl font-bold mb-2">
                          <span className="bg-gradient-to-r from-visionfish-neon-pink to-visionfish-neon-purple bg-clip-text text-transparent">
                            Rp49.000
                          </span>
                        </div>
                        <p className="text-muted-foreground">per bulan</p>
                        <div className="flex items-center justify-center gap-2 mt-4">
                          <Shield className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-600">30 hari garansi uang kembali</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Features */}
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-visionfish-neon-pink" />
                        Yang Anda Dapatkan:
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {features.map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={() => setCurrentStep(2)}
                      className="w-full bg-gradient-to-r from-visionfish-neon-pink to-visionfish-neon-purple hover:opacity-90 text-white py-6"
                      size="lg"
                    >
                      Lanjutkan ke Pembayaran
                    </Button>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Payment Methods Info */}
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Metode Pembayaran Tersedia:
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {paymentMethods.map((method, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                            <span className="text-2xl">{method.icon}</span>
                            <div>
                              <div className="font-medium text-sm">{method.name}</div>
                              <div className="text-xs text-muted-foreground">{method.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Security Info */}
                    <div className="flex items-center gap-2 p-4 rounded-lg bg-green-50 border border-green-200">
                      <Shield className="w-5 h-5 text-green-600" />
                      <div className="text-sm">
                        <div className="font-medium text-green-800">Pembayaran Aman</div>
                        <div className="text-green-600">Diproses oleh Midtrans - Partner terpercaya</div>
                      </div>
                    </div>

                    {/* Payment Button */}
                    <div className="space-y-4">
                      <MidtransPayment 
                        onPaymentSuccess={handlePaymentSuccess}
                        onPaymentError={onPaymentError}
                      />
                      
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        className="w-full"
                      >
                        Kembali
                      </Button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                    >
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </motion.div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-green-600 mb-2">Pembayaran Berhasil!</h3>
                      <p className="text-muted-foreground">
                        Selamat! Akun premium Anda telah diaktifkan.
                      </p>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
                    >
                      <Clock className="w-4 h-4" />
                      Mengalihkan ke dashboard premium...
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
