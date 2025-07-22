import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Shield, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
const AdminAccessButton = () => {
  const {
    user
  } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [canBecomeFirstAdmin, setCanBecomeFirstAdmin] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    checkAdminStatus();
  }, [user]);
  const checkAdminStatus = async () => {
    if (!user) {
      console.log("AdminAccessButton: No user found");
      setLoading(false);
      return;
    }
    console.log("AdminAccessButton: Checking admin status for user:", user.id);
    try {
      // Check if user is already admin - query only existing columns
      const adminQuery = await supabase.from('admin_roles').select('role').eq('user_id', user.id);
      console.log("AdminAccessButton: Admin check result:", adminQuery);
      if (!adminQuery.error && adminQuery.data && adminQuery.data.length > 0) {
        console.log("AdminAccessButton: User is admin");
        setIsAdmin(true);
        setCanBecomeFirstAdmin(false);
      } else {
        // Check if there are any admins at all
        const allAdminsQuery = await supabase.from('admin_roles').select('id').limit(1);
        console.log("AdminAccessButton: All admins check:", allAdminsQuery);
        if (!allAdminsQuery.error && (!allAdminsQuery.data || allAdminsQuery.data.length === 0)) {
          console.log("AdminAccessButton: No admins exist, user can become first admin");
          setCanBecomeFirstAdmin(true);
          setIsAdmin(false);
        } else {
          console.log("AdminAccessButton: User is not admin and other admins exist");
          setIsAdmin(false);
          setCanBecomeFirstAdmin(false);
        }
      }
    } catch (error) {
      console.error('AdminAccessButton: Error checking admin status:', error);
      setIsAdmin(false);
      setCanBecomeFirstAdmin(false);
    } finally {
      setLoading(false);
    }
  };
  const becomeFirstAdmin = async () => {
    if (!user) return;
    console.log("AdminAccessButton: Attempting to become first admin");
    try {
      const {
        data,
        error
      } = await supabase.rpc('promote_user_to_admin', {
        target_user_id: user.id
      });
      console.log("AdminAccessButton: Promote to admin result:", {
        data,
        error
      });
      if (error) throw error;

      // Handle the response more safely
      if (data && typeof data === 'object' && 'success' in data) {
        const result = data as {
          success: boolean;
          message: string;
        };
        if (result.success) {
          toast.success("Selamat! Anda sekarang adalah admin pertama");
          checkAdminStatus(); // Refresh status
        } else {
          toast.error(result.message || "Gagal menjadi admin");
        }
      } else {
        toast.error("Respons tidak valid dari server");
      }
    } catch (error) {
      console.error('AdminAccessButton: Error becoming first admin:', error);
      toast.error("Gagal menjadi admin");
    }
  };
  if (loading) {
    console.log("AdminAccessButton: Still loading...");
    return null;
  }

  // Only show anything if user is admin OR can become first admin
  if (!isAdmin && !canBecomeFirstAdmin) {
    console.log("AdminAccessButton: User is not admin and cannot become first admin - hiding button");
    return null;
  }
  if (canBecomeFirstAdmin) {
    console.log("AdminAccessButton: Showing become first admin button");
    return <div className="fixed top-20 right-6 z-50">
        <Button onClick={becomeFirstAdmin} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Become First Admin
        </Button>
      </div>;
  }

  // Only show Admin Dashboard button if user is actually an admin
  if (isAdmin) {
    console.log("AdminAccessButton: Showing admin dashboard button");
    return <div className="fixed top-20 right-6 z-50">
        
      </div>;
  }
  return null;
};
export default AdminAccessButton;