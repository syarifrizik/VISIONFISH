import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Search, Crown, User, Calendar, Shield, UserX } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AddUserDialog from "./AddUserDialog";
import UserDetailDialog from "./UserDetailDialog";

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  created_at: string;
  is_premium: boolean;
  is_admin: boolean;
  email?: string;
}

const UserManagementSection = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userDetailOpen, setUserDetailOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    console.log("Fetching users...");
    setLoading(true);
    try {
      // Get all users from auth.users with admin privileges
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
        // Fallback to profiles table if admin access fails
        await fetchUsersFromProfiles();
        return;
      }

      console.log("Auth users fetched:", authUsers.users.length);

      // Get profiles data
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      console.log("Profiles data:", profilesData?.length || 0);

      // Get all subscriptions
      const { data: subscriptions, error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select('user_id, is_active, ends_at, plan_type')
        .eq('plan_type', 'premium')
        .eq('is_active', true);

      if (subscriptionsError) console.error('Error fetching subscriptions:', subscriptionsError);

      // Get all admin roles
      const { data: adminRoles, error: adminError } = await supabase
        .from('admin_roles')
        .select('user_id, role');

      if (adminError) console.error('Error fetching admin roles:', adminError);

      // Combine data
      const usersWithStatus = authUsers.users.map((authUser) => {
        const profile = profilesData?.find(p => p.id === authUser.id);
        const subscription = subscriptions?.find(s => s.user_id === authUser.id);
        const adminRole = adminRoles?.find(a => a.user_id === authUser.id);

        const isPremium = subscription && 
          (subscription.ends_at === null || new Date(subscription.ends_at) > new Date());

        return {
          id: authUser.id,
          username: profile?.username || authUser.email?.split('@')[0] || 'Unknown',
          display_name: profile?.display_name || authUser.user_metadata?.display_name || profile?.username || 'Unknown User',
          created_at: authUser.created_at,
          is_premium: !!isPremium,
          is_admin: !!adminRole,
          email: authUser.email || 'Unknown'
        };
      });

      console.log("Combined users data:", usersWithStatus.length);
      setUsers(usersWithStatus);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      toast.error("Gagal memuat data pengguna");
      // Fallback to profiles table
      await fetchUsersFromProfiles();
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersFromProfiles = async () => {
    try {
      console.log("Falling back to profiles table...");
      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log("Profiles fallback data:", profilesData?.length || 0);

      // Get subscriptions and admin roles for these users
      const userIds = profilesData?.map(p => p.id) || [];
      
      const [subscriptionsRes, adminRolesRes] = await Promise.all([
        supabase
          .from('subscriptions')
          .select('user_id, is_active, ends_at, plan_type')
          .eq('plan_type', 'premium')
          .eq('is_active', true)
          .in('user_id', userIds),
        supabase
          .from('admin_roles')
          .select('user_id, role')
          .in('user_id', userIds)
      ]);

      const subscriptions = subscriptionsRes.data || [];
      const adminRoles = adminRolesRes.data || [];

      const usersWithStatus = (profilesData || []).map((profile) => {
        const subscription = subscriptions.find(s => s.user_id === profile.id);
        const adminRole = adminRoles.find(a => a.user_id === profile.id);

        const isPremium = subscription && 
          (subscription.ends_at === null || new Date(subscription.ends_at) > new Date());

        return {
          ...profile,
          is_premium: !!isPremium,
          is_admin: !!adminRole,
          email: profile.username || 'Unknown'
        };
      });

      setUsers(usersWithStatus);
    } catch (error) {
      console.error('Error in fetchUsersFromProfiles:', error);
      toast.error("Gagal memuat data pengguna");
    }
  };

  const promoteToPremium = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('promote_user_to_premium', {
          target_user_id: userId,
          duration_days: 30
        });

      if (error) throw error;

      toast.success("User berhasil dipromosikan ke Premium");
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error promoting user:', error);
      toast.error("Gagal mempromosikan user ke Premium");
    }
  };

  const removePremium = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('plan_type', 'premium');

      if (error) throw error;

      toast.success("Status premium user berhasil dihapus");
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error removing premium:', error);
      toast.error("Gagal menghapus status premium");
    }
  };

  const promoteToAdmin = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('promote_user_to_admin', {
          target_user_id: userId
        });

      if (error) throw error;

      const result = data as { success: boolean; message: string };
      
      if (result.success) {
        toast.success(result.message);
        fetchUsers(); // Refresh the list
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error promoting user to admin:', error);
      toast.error("Gagal mempromosikan user ke Admin");
    }
  };

  const removeAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('remove_admin_role', {
          target_user_id: userId
        });

      if (error) throw error;

      const result = data as { success: boolean; message: string };
      
      if (result.success) {
        toast.success(result.message);
        fetchUsers(); // Refresh the list
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error removing admin role:', error);
      toast.error("Gagal menghapus role admin");
    }
  };

  const handleViewDetails = (user: UserProfile) => {
    setSelectedUser(user);
    setUserDetailOpen(true);
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Management
          </CardTitle>
          <AddUserDialog onUserAdded={fetchUsers} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari pengguna..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Users List */}
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-visionfish-neon-pink to-visionfish-neon-purple flex items-center justify-center text-white font-bold">
                  {user.display_name?.[0] || user.username?.[0] || 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {user.display_name || user.username || 'Unknown User'}
                    </span>
                    {user.is_premium && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    {user.is_admin && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        <Shield className="w-3 h-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    Joined {new Date(user.created_at).toLocaleDateString('id-ID')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user.email}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {!user.is_premium ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => promoteToPremium(user.id)}
                    className="hover:bg-yellow-50"
                  >
                    <Crown className="w-4 h-4 mr-1" />
                    Promote to Premium
                  </Button>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-red-50 text-red-600 border-red-200"
                      >
                        <Crown className="w-4 h-4 mr-1" />
                        Remove Premium
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus Premium</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus status premium dari{" "}
                          <strong>{user.display_name || user.username}</strong>{" "}
                          ({user.email})?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => removePremium(user.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Ya, Hapus Premium
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                
                {!user.is_admin ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-blue-50"
                      >
                        <Shield className="w-4 h-4 mr-1" />
                        Promote to Admin
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Promosi Admin</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menjadikan{" "}
                          <strong>{user.display_name || user.username}</strong>{" "}
                          ({user.email}) sebagai admin?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => promoteToAdmin(user.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Ya, Jadikan Admin
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-red-50 text-red-600 border-red-200"
                      >
                        <UserX className="w-4 h-4 mr-1" />
                        Remove Admin
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus Admin</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus role admin dari{" "}
                          <strong>{user.display_name || user.username}</strong>{" "}
                          ({user.email})?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => removeAdminRole(user.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Ya, Hapus Admin
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleViewDetails(user)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'Tidak ada pengguna yang ditemukan' : 'Belum ada pengguna'}
          </div>
        )}

        <UserDetailDialog
          user={selectedUser}
          open={userDetailOpen}
          onOpenChange={setUserDetailOpen}
        />
      </CardContent>
    </Card>
  );
};

export default UserManagementSection;
