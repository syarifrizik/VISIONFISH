import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Key, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Users, 
  Activity, 
  Settings, 
  TrendingUp,
  Crown,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface APIKey {
  id: string;
  name: string;
  key_value: string;
  provider: string;
  is_active: boolean;
  daily_limit: number;
  current_usage: number;
  created_at: string;
  last_reset_at: string;
}

interface AnalysisUsage {
  id: string;
  user_id: string | null;
  session_fingerprint: string;
  analysis_type: string;
  success: boolean;
  created_at: string;
  ip_address: string;
}

interface DashboardStats {
  total_users: number;
  active_premium_users: number;
  total_analysis_today: number;
  success_rate: number;
  api_usage_percentage: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [usageData, setUsageData] = useState<AnalysisUsage[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    total_users: 0,
    active_premium_users: 0,
    total_analysis_today: 0,
    success_rate: 0,
    api_usage_percentage: 0
  });
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [newKeyLimit, setNewKeyLimit] = useState("1000");

  useEffect(() => {
    checkAdminAccess();
    loadDashboardData();
  }, []);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      const { data: adminRole } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (!adminRole) {
        toast.error("Akses tidak diizinkan. Anda bukan admin.");
        navigate("/");
        return;
      }
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/");
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadAPIKeys(),
        loadUsageData(),
        loadDashboardStats()
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadAPIKeys = async () => {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error loading API keys:", error);
      return;
    }

    setApiKeys(data || []);
  };

  const loadUsageData = async () => {
    const { data, error } = await supabase
      .from('species_analysis_usage')
      .select('*')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error("Error loading usage data:", error);
      return;
    }

    setUsageData(data || []);
  };

  const loadDashboardStats = async () => {
    try {
      // Get total users from profiles
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get premium users
      const { count: premiumUsers } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .eq('plan_type', 'premium');

      // Get today's analysis count
      const today = new Date().toISOString().split('T')[0];
      const { count: todayAnalysis } = await supabase
        .from('species_analysis_usage')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      // Calculate success rate
      const { count: successfulAnalysis } = await supabase
        .from('species_analysis_usage')
        .select('*', { count: 'exact', head: true })
        .eq('success', true)
        .gte('created_at', today);

      const successRate = todayAnalysis ? (successfulAnalysis || 0) / todayAnalysis * 100 : 0;

      // Calculate API usage percentage
      const totalLimit = apiKeys.reduce((sum, key) => sum + key.daily_limit, 0);
      const totalUsage = apiKeys.reduce((sum, key) => sum + key.current_usage, 0);
      const usagePercentage = totalLimit ? (totalUsage / totalLimit) * 100 : 0;

      setDashboardStats({
        total_users: totalUsers || 0,
        active_premium_users: premiumUsers || 0,
        total_analysis_today: todayAnalysis || 0,
        success_rate: successRate,
        api_usage_percentage: usagePercentage
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    }
  };

  const addAPIKey = async () => {
    if (!newKeyName.trim() || !newKeyValue.trim()) {
      toast.error("Nama dan API key harus diisi");
      return;
    }

    try {
      const { error } = await supabase
        .from('api_keys')
        .insert({
          name: newKeyName,
          key_value: newKeyValue,
          provider: 'gemini',
          daily_limit: parseInt(newKeyLimit),
          created_by_admin: user?.id
        });

      if (error) throw error;

      toast.success("API key berhasil ditambahkan");
      setNewKeyName("");
      setNewKeyValue("");
      setNewKeyLimit("1000");
      loadAPIKeys();
    } catch (error) {
      console.error("Error adding API key:", error);
      toast.error("Gagal menambahkan API key");
    }
  };

  const toggleAPIKey = async (keyId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: !currentStatus })
        .eq('id', keyId);

      if (error) throw error;

      toast.success(`API key ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`);
      loadAPIKeys();
    } catch (error) {
      console.error("Error toggling API key:", error);
      toast.error("Gagal mengubah status API key");
    }
  };

  const deleteAPIKey = async (keyId: string) => {
    if (!confirm("Yakin ingin menghapus API key ini?")) return;

    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;

      toast.success("API key berhasil dihapus");
      loadAPIKeys();
    } catch (error) {
      console.error("Error deleting API key:", error);
      toast.error("Gagal menghapus API key");
    }
  };

  const resetAPIUsage = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ 
          current_usage: 0,
          last_reset_at: new Date().toISOString()
        })
        .eq('id', keyId);

      if (error) throw error;

      toast.success("Usage API key direset");
      loadAPIKeys();
    } catch (error) {
      console.error("Error resetting API usage:", error);
      toast.error("Gagal mereset usage API key");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-visionfish-neon-blue" />
          <p>Memuat dashboard admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50/30 dark:to-blue-950/30">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-visionfish-neon-blue to-visionfish-neon-pink bg-clip-text text-transparent">
            VisionFish Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Kelola API keys, monitor penggunaan, dan analisis sistem
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.total_users}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
              <Crown className="h-4 w-4 text-visionfish-neon-pink" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.active_premium_users}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analisis Hari Ini</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.total_analysis_today}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.success_rate.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="api-keys" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="usage">Monitoring Usage</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys" className="space-y-6">
            {/* Add New API Key */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Tambah API Key Baru
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="keyName">Nama API Key</Label>
                    <Input
                      id="keyName"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g., Gemini Production"
                    />
                  </div>
                  <div>
                    <Label htmlFor="keyValue">API Key Value</Label>
                    <Input
                      id="keyValue"
                      type="password"
                      value={newKeyValue}
                      onChange={(e) => setNewKeyValue(e.target.value)}
                      placeholder="AIza..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="keyLimit">Daily Limit</Label>
                    <Input
                      id="keyLimit"
                      type="number"
                      value={newKeyLimit}
                      onChange={(e) => setNewKeyLimit(e.target.value)}
                      placeholder="1000"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addAPIKey} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Keys List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Daftar API Keys
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div
                      key={apiKey.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{apiKey.name}</h4>
                          <Badge variant={apiKey.is_active ? "default" : "secondary"}>
                            {apiKey.is_active ? "Aktif" : "Nonaktif"}
                          </Badge>
                          <Badge variant="outline">
                            {apiKey.provider.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Usage: {apiKey.current_usage} / {apiKey.daily_limit} ({
                            Math.round((apiKey.current_usage / apiKey.daily_limit) * 100)
                          }%)
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-visionfish-neon-blue h-2 rounded-full"
                            style={{
                              width: `${Math.min((apiKey.current_usage / apiKey.daily_limit) * 100, 100)}%`
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleAPIKey(apiKey.id, apiKey.is_active)}
                        >
                          {apiKey.is_active ? "Nonaktifkan" : "Aktifkan"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resetAPIUsage(apiKey.id)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteAPIKey(apiKey.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {apiKeys.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Belum ada API key yang ditambahkan</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Monitoring Usage Real-time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {usageData.map((usage) => (
                    <div
                      key={usage.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        {usage.success ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        )}
                        <div>
                          <div className="font-medium">
                            {usage.analysis_type.replace('_', ' ').toUpperCase()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {usage.user_id ? 'Logged User' : 'Guest'} • {usage.ip_address}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {new Date(usage.created_at).toLocaleTimeString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(usage.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {usageData.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Belum ada aktivitas analisis hari ini</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Analytics Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">API Usage Overview</h4>
                    <div className="text-2xl font-bold text-visionfish-neon-blue">
                      {dashboardStats.api_usage_percentage.toFixed(1)}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-visionfish-neon-blue to-visionfish-neon-pink h-3 rounded-full"
                        style={{ width: `${Math.min(dashboardStats.api_usage_percentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total penggunaan API dari semua keys
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Success Rate</h4>
                    <div className="text-2xl font-bold text-green-600">
                      {dashboardStats.success_rate.toFixed(1)}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full"
                        style={{ width: `${dashboardStats.success_rate}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tingkat keberhasilan analisis hari ini
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;