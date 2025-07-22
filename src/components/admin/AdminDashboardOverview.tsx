
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  DollarSign,
  UserCheck,
  MessageSquare,
  Image,
  Fish
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  premiumUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalMessages: number;
  totalFishCatches: number;
  totalImageUploads: number;
  conversionRate: number;
}

const AdminDashboardOverview = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    premiumUsers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalMessages: 0,
    totalFishCatches: 0,
    totalImageUploads: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Get total users from profiles table (since auth.users isn't directly accessible)
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id');

      // Get premium users
      const { data: premiumData } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('plan_type', 'premium')
        .eq('is_active', true);

      // Get revenue data
      const { data: revenueData } = await supabase
        .from('midtrans_transactions')
        .select('gross_amount, created_at')
        .eq('transaction_status', 'settlement');

      // Get chat messages count
      const { data: messagesData } = await supabase
        .from('chat_messages')
        .select('id');

      // Get fish catches count
      const { data: fishCatchesData } = await supabase
        .from('fish_catches')
        .select('id');

      // Get image uploads count
      const { data: imageUploadsData } = await supabase
        .from('image_upload_usage')
        .select('upload_count');

      // Calculate stats
      const totalUsers = profilesData?.length || 0;
      const premiumUsers = premiumData?.length || 0;
      const totalRevenue = revenueData?.reduce((sum, item) => sum + Number(item.gross_amount), 0) || 0;
      
      // Calculate monthly revenue (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = revenueData?.filter(item => {
        const itemDate = new Date(item.created_at);
        return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
      }).reduce((sum, item) => sum + Number(item.gross_amount), 0) || 0;

      const totalMessages = messagesData?.length || 0;
      const totalFishCatches = fishCatchesData?.length || 0;
      const totalImageUploads = imageUploadsData?.reduce((sum, item) => sum + item.upload_count, 0) || 0;
      const conversionRate = totalUsers > 0 ? (premiumUsers / totalUsers) * 100 : 0;

      setStats({
        totalUsers,
        premiumUsers,
        totalRevenue,
        monthlyRevenue,
        totalMessages,
        totalFishCatches,
        totalImageUploads,
        conversionRate
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Premium Users",
      value: stats.premiumUsers.toLocaleString(),
      icon: UserCheck,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Revenue",
      value: `Rp ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Monthly Revenue",
      value: `Rp ${stats.monthlyRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      title: "Chat Messages",
      value: stats.totalMessages.toLocaleString(),
      icon: MessageSquare,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Fish Catches",
      value: stats.totalFishCatches.toLocaleString(),
      icon: Fish,
      color: "text-cyan-500",
      bgColor: "bg-cyan-50"
    },
    {
      title: "Image Uploads",
      value: stats.totalImageUploads.toLocaleString(),
      icon: Image,
      color: "text-pink-500",
      bgColor: "bg-pink-50"
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate.toFixed(1)}%`,
      icon: CreditCard,
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-8 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
            <h3 className="font-medium">Manage Users</h3>
            <p className="text-sm text-muted-foreground">View and manage user accounts</p>
          </div>
          <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
            <h3 className="font-medium">Payment Overview</h3>
            <p className="text-sm text-muted-foreground">Monitor payment transactions</p>
          </div>
          <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
            <h3 className="font-medium">Generate Reports</h3>
            <p className="text-sm text-muted-foreground">Export analytics data</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardOverview;
