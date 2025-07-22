
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Users, MessageSquare, CreditCard, TrendingUp, Activity, Eye, Calendar } from "lucide-react";

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalMessages: number;
  totalRevenue: number;
  userGrowth: any[];
  messagesByType: any[];
  revenueByMonth: any[];
  dailyActivity: any[];
}

const AnalyticsSection = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    totalMessages: 0,
    totalRevenue: 0,
    userGrowth: [],
    messagesByType: [],
    revenueByMonth: [],
    dailyActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch user statistics
      const { data: usersData } = await supabase
        .from('profiles')
        .select('id, created_at, last_seen_at');

      const totalUsers = usersData?.length || 0;
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const activeUsers = usersData?.filter(user => 
        user.last_seen_at && new Date(user.last_seen_at) > oneWeekAgo
      ).length || 0;

      // Fetch message statistics
      const { data: messagesData } = await supabase
        .from('chat_messages')
        .select('message_type, created_at');

      const totalMessages = messagesData?.length || 0;

      // Fetch payment statistics
      const { data: paymentsData } = await supabase
        .from('midtrans_transactions')
        .select('gross_amount, transaction_status, created_at')
        .eq('transaction_status', 'settlement');

      const totalRevenue = paymentsData?.reduce((sum, payment) => 
        sum + Number(payment.gross_amount), 0) || 0;

      // Process user growth data (last 6 months)
      const userGrowth = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const usersInMonth = usersData?.filter(user => {
          const createdAt = new Date(user.created_at);
          return createdAt >= monthStart && createdAt <= monthEnd;
        }).length || 0;

        userGrowth.push({
          month: date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
          users: usersInMonth
        });
      }

      // Process messages by type
      const messageTypes = messagesData?.reduce((acc: any, message) => {
        const type = message.message_type || 'general';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {}) || {};

      const messagesByType = Object.entries(messageTypes).map(([type, count]) => ({
        type,
        count
      }));

      // Process revenue by month (last 6 months)
      const revenueByMonth = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const revenueInMonth = paymentsData?.filter(payment => {
          const createdAt = new Date(payment.created_at);
          return createdAt >= monthStart && createdAt <= monthEnd;
        }).reduce((sum, payment) => sum + Number(payment.gross_amount), 0) || 0;

        revenueByMonth.push({
          month: date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
          revenue: revenueInMonth
        });
      }

      // Process daily activity (last 7 days)
      const dailyActivity = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
        
        const messagesInDay = messagesData?.filter(message => {
          const createdAt = new Date(message.created_at);
          return createdAt >= dayStart && createdAt < dayEnd;
        }).length || 0;

        dailyActivity.push({
          day: date.toLocaleDateString('id-ID', { weekday: 'short' }),
          messages: messagesInDay
        });
      }

      setAnalytics({
        totalUsers,
        activeUsers,
        totalMessages,
        totalRevenue,
        userGrowth,
        messagesByType,
        revenueByMonth,
        dailyActivity
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{analytics.activeUsers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold">{analytics.totalMessages.toLocaleString()}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">Rp {analytics.totalRevenue.toLocaleString()}</p>
              </div>
              <CreditCard className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Pertumbuhan Pengguna (6 bulan)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Aktivitas Harian (7 hari)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="messages" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Revenue per Bulan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Messages by Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Pesan Berdasarkan Tipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.messagesByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.messagesByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Statistik Cepat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
              <span className="text-sm">Rata-rata pesan per hari</span>
              <span className="font-semibold">
                {Math.round(analytics.totalMessages / 30)} pesan
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
              <span className="text-sm">User aktivitas (%)</span>
              <span className="font-semibold">
                {analytics.totalUsers > 0 ? 
                  ((analytics.activeUsers / analytics.totalUsers) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
              <span className="text-sm">Rata-rata revenue per user</span>
              <span className="font-semibold">
                Rp {analytics.totalUsers > 0 ? 
                  Math.round(analytics.totalRevenue / analytics.totalUsers).toLocaleString() : 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsSection;
