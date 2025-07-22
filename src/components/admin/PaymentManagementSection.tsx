
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface PaymentTransaction {
  id: string;
  order_id: string;
  gross_amount: number;
  transaction_status: string;
  created_at: string;
  user_id: string;
  user_profile?: {
    display_name?: string;
    username?: string;
  };
}

const PaymentManagementSection = () => {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    successfulPayments: 0,
    pendingPayments: 0,
    monthlyRevenue: 0
  });

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      // Fetch transactions first
      const { data: transactionsData, error } = await supabase
        .from('midtrans_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Get unique user IDs
      const userIds = [...new Set(transactionsData?.map(t => t.user_id) || [])];
      
      // Fetch user profiles for these IDs
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, display_name, username')
        .in('id', userIds);

      // Create a map of user profiles
      const profilesMap = new Map(
        profilesData?.map(profile => [profile.id, profile]) || []
      );

      // Combine transactions with user profiles
      const transactionsWithProfiles = transactionsData?.map(transaction => ({
        ...transaction,
        user_profile: profilesMap.get(transaction.user_id)
      })) || [];

      setTransactions(transactionsWithProfiles);

      // Calculate stats
      const totalRevenue = transactionsData
        ?.filter(t => t.transaction_status === 'settlement')
        .reduce((sum, t) => sum + Number(t.gross_amount), 0) || 0;

      const successfulPayments = transactionsData
        ?.filter(t => t.transaction_status === 'settlement').length || 0;

      const pendingPayments = transactionsData
        ?.filter(t => t.transaction_status === 'pending').length || 0;

      // Calculate monthly revenue
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = transactionsData
        ?.filter(t => {
          const date = new Date(t.created_at);
          return date.getMonth() === currentMonth && 
                 date.getFullYear() === currentYear &&
                 t.transaction_status === 'settlement';
        })
        .reduce((sum, t) => sum + Number(t.gross_amount), 0) || 0;

      setStats({
        totalRevenue,
        successfulPayments,
        pendingPayments,
        monthlyRevenue
      });

    } catch (error) {
      console.error('Error fetching payment data:', error);
      toast.error("Gagal memuat data pembayaran");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'settlement':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'cancel':
      case 'deny':
      case 'expire':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">Rp {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">Rp {stats.monthlyRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold">{stats.successfulPayments}</p>
              </div>
              <CreditCard className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pendingPayments}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    Rp
                  </div>
                  <div>
                    <div className="font-medium">
                      {transaction.user_profile?.display_name || 
                       transaction.user_profile?.username || 
                       'Unknown User'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Order: {transaction.order_id}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(transaction.created_at).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-lg">
                    Rp {Number(transaction.gross_amount).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(transaction.transaction_status)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {transactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Belum ada transaksi pembayaran
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentManagementSection;
