
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import Layout from "@/components/Layout";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="text-center space-y-6 max-w-lg px-4">
          <div className="text-8xl font-bold text-visionfish-neon-blue animate-pulse-glow mb-6">404</div>
          <AlertCircle className="h-16 w-16 mx-auto text-visionfish-neon-pink" />
          <h1 className="text-3xl font-bold">Halaman Tidak Ditemukan</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. Silakan kembali ke halaman utama.
          </p>
          <Button 
            onClick={() => navigate("/")}
            className="neon-button"
          >
            <Home className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
