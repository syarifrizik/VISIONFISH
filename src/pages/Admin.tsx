
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminDashboardOverview from "@/components/admin/AdminDashboardOverview";
import UserManagementSection from "@/components/admin/UserManagementSection";
import PaymentManagementSection from "@/components/admin/PaymentManagementSection";
import ContentManagementSection from "@/components/admin/ContentManagementSection";
import AnalyticsSection from "@/components/admin/AnalyticsSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      toast.error("Silakan login terlebih dahulu untuk mengakses halaman admin");
      navigate('/auth');
    }
  }, [isLoggedIn, isLoading, navigate]);

  if (!isLoggedIn) {
    return null; // Will redirect to auth
  }

  return (
    <Layout>
      <AdminGuard>
        <div className="max-w-7xl mx-auto w-full px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-visionfish-neon-pink to-visionfish-neon-purple bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Kelola semua aspek VisionFish dari satu tempat
              </p>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <AdminDashboardOverview />
              </TabsContent>

              <TabsContent value="users">
                <UserManagementSection />
              </TabsContent>

              <TabsContent value="payments">
                <PaymentManagementSection />
              </TabsContent>

              <TabsContent value="content">
                <ContentManagementSection />
              </TabsContent>

              <TabsContent value="analytics">
                <AnalyticsSection />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </AdminGuard>
    </Layout>
  );
};

export default AdminPage;
