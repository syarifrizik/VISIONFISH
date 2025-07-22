
import { useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Shield, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AdminGuardProps {
  children: ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const { user, isLoggedIn } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
  }, [user, isLoggedIn]);

  const checkAdminStatus = async () => {
    if (!isLoggedIn || !user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        toast.error("Akses ditolak. Anda tidak memiliki izin admin.");
        navigate('/');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      toast.error("Terjadi kesalahan saat memeriksa status admin");
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-visionfish-neon-pink" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Verifying Admin Access</h3>
              <p className="text-muted-foreground">Please wait...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Access Denied</h3>
              <p className="text-muted-foreground">
                Anda tidak memiliki izin untuk mengakses halaman admin
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Admin Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm shadow-lg">
          <Shield className="w-4 h-4" />
          Admin Mode
        </div>
      </div>
      {children}
    </div>
  );
};

export default AdminGuard;
