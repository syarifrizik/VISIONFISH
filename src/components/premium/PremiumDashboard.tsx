
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Crown, 
  Calendar, 
  Clock, 
  Zap, 
  TrendingUp, 
  Gift,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import MidtransPayment from "./MidtransPayment";

interface SubscriptionData {
  ends_at: string | null;
  plan_type: string;
  is_active: boolean;
}

const PremiumDashboard = () => {
  const { user } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExtendModal, setShowExtendModal] = useState(false);

  useEffect(() => {
    fetchSubscriptionData();
  }, [user]);

  const fetchSubscriptionData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('ends_at, plan_type, is_active')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setSubscriptionData(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysRemaining = () => {
    if (!subscriptionData?.ends_at) return null;
    const endDate = new Date(subscriptionData.ends_at);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateProgressPercentage = () => {
    if (!subscriptionData?.ends_at) return 100;
    const endDate = new Date(subscriptionData.ends_at);
    const startDate = new Date(endDate.getTime() - (30 * 24 * 60 * 60 * 1000)); // 30 days ago
    const now = new Date();
    
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    const percentage = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
    
    return 100 - percentage; // Remaining percentage
  };

  const daysRemaining = calculateDaysRemaining();
  const progressPercentage = calculateProgressPercentage();

  const handleExtendSuccess = () => {
    setShowExtendModal(false);
    fetchSubscriptionData();
    toast.success("Subscription berhasil diperpanjang!");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex justify-center items-center gap-2 mb-2">
          <Crown className="h-8 w-8 text-visionfish-neon-pink" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-visionfish-neon-pink to-visionfish-neon-purple bg-clip-text text-transparent">
            Premium Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground">
          Selamat datang di dashboard premium Anda
        </p>
      </motion.div>

      {/* Subscription Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-visionfish-neon-pink/20 bg-gradient-to-br from-visionfish-neon-pink/5 to-visionfish-neon-purple/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Status Subscription
              <Badge variant="secondary" className="bg-visionfish-neon-pink/20 text-visionfish-neon-pink">
                Premium Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscriptionData?.ends_at ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Berakhir pada:</span>
                  </div>
                  <span className="font-medium">
                    {new Date(subscriptionData.ends_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Sisa waktu:</span>
                    </div>
                    <span className={`font-medium ${daysRemaining && daysRemaining < 7 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {daysRemaining !== null ? (
                        daysRemaining > 0 ? `${daysRemaining} hari` : 'Berakhir hari ini'
                      ) : 'Lifetime'}
                    </span>
                  </div>
                  
                  {daysRemaining !== null && (
                    <div className="space-y-1">
                      <Progress 
                        value={progressPercentage} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground text-center">
                        {Math.round(progressPercentage)}% waktu tersisa
                      </p>
                    </div>
                  )}
                </div>

                {daysRemaining !== null && daysRemaining < 7 && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      Subscription Anda akan segera berakhir. Perpanjang sekarang!
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-500" />
                <span className="text-green-600 font-medium">Subscription Lifetime</span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Aksi Cepat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => setShowExtendModal(true)}
                className="bg-gradient-to-r from-visionfish-neon-blue to-visionfish-neon-purple hover:opacity-90 text-white"
                size="lg"
              >
                <Gift className="w-4 h-4 mr-2" />
                Perpanjang Subscription
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.open('https://wa.me/6281234567890?text=Halo, saya butuh bantuan dengan subscription premium saya', '_blank')}
                size="lg"
              >
                <Clock className="w-4 h-4 mr-2" />
                Hubungi Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Premium Features Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Fitur Premium Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Analisis Gambar Tanpa Batas",
                "AI Chat Tanpa Batas", 
                "Model AI Canggih",
                "Data Historis Cuaca",
                "Laporan PDF dengan Visualisasi",
                "Prioritas Dukungan"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Extend Subscription Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background p-6 rounded-xl max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-bold mb-4">Perpanjang Subscription</h3>
            <p className="text-muted-foreground mb-6">
              Perpanjang subscription premium Anda untuk 1 bulan lagi dengan harga yang sama.
            </p>
            
            <div className="space-y-4">
              <MidtransPayment 
                onPaymentSuccess={handleExtendSuccess}
                onPaymentError={(error) => toast.error(`Pembayaran gagal: ${error}`)}
              />
              
              <Button
                variant="outline"
                onClick={() => setShowExtendModal(false)}
                className="w-full"
              >
                Batal
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PremiumDashboard;
