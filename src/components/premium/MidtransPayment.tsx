
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, CreditCard, Shield, Clock } from 'lucide-react';

interface MidtransPaymentProps {
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: string) => void;
}

declare global {
  interface Window {
    snap: {
      pay: (snapToken: string, options: any) => void;
    };
  }
}

const MidtransPayment = ({ onPaymentSuccess, onPaymentError }: MidtransPaymentProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu untuk melanjutkan transaksi pembayaran. Login diperlukan untuk keamanan transaksi, melacak riwayat pembayaran Anda, dan mengaktifkan fitur premium pada akun yang tepat.');
      return;
    }

    setIsLoading(true);

    try {
      // Load Midtrans Snap script if not already loaded
      if (!window.snap) {
        await loadMidtransScript();
      }

      // Create payment via edge function
      const { data, error } = await supabase.functions.invoke('midtrans-payment/create-payment', {
        body: {
          userId: user.id,
          customerDetails: {
            first_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
            email: user.email,
            phone: user.user_metadata?.phone || ''
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error('Failed to create payment');
      }

      // Open Midtrans Snap payment popup
      window.snap.pay(data.snapToken, {
        onSuccess: function(result: any) {
          console.log('Payment success:', result);
          toast.success('Pembayaran berhasil! Premium Anda telah diaktifkan.');
          onPaymentSuccess?.();
        },
        onPending: function(result: any) {
          console.log('Payment pending:', result);
          toast.info('Pembayaran pending. Silakan selesaikan pembayaran Anda.');
        },
        onError: function(result: any) {
          console.log('Payment error:', result);
          toast.error('Pembayaran gagal. Silakan coba lagi.');
          onPaymentError?.(result.error_message || 'Payment failed');
        },
        onClose: function() {
          console.log('Payment popup closed');
          toast.info('Pembayaran dibatalkan');
        }
      });

    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Terjadi kesalahan saat memproses pembayaran');
      onPaymentError?.(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMidtransScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.snap) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://app.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', 'Mid-client-xbbmg9ydOrQVQBkY');
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Midtrans script'));
      document.head.appendChild(script);
    });
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-visionfish-neon-pink to-visionfish-neon-purple hover:opacity-90 text-white font-semibold py-6 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Memproses Pembayaran...
        </>
      ) : (
        <>
          <CreditCard className="w-5 h-5 mr-2" />
          <span className="flex items-center gap-2">
            Bayar Sekarang - Rp49.000
            <div className="flex items-center gap-1 text-xs opacity-80">
              <Shield className="w-3 h-3" />
              Aman
            </div>
          </span>
        </>
      )}
    </Button>
  );
};

export default MidtransPayment;
