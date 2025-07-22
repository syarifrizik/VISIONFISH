
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Crown, Key, Users, ExternalLink, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface ErrorHandlingModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorType: 'quota_exceeded' | 'login_required' | 'cooldown' | 'api_quota' | 'invalid_key' | 'network' | 'unknown';
  errorMessage: string;
  quotaInfo?: {
    dailyCount?: number;
    maxSessions?: number;
    isPremium?: boolean;
    cooldownUntil?: string;
  };
}

const ErrorHandlingModal = ({ 
  isOpen, 
  onClose, 
  errorType, 
  errorMessage, 
  quotaInfo 
}: ErrorHandlingModalProps) => {
  const { isLoggedIn, isPremium, isAdmin } = useAuth();
  const navigate = useNavigate();

  const getModalContent = () => {
    switch (errorType) {
      case 'quota_exceeded':
        if (!isLoggedIn) {
          return {
            title: "Batas Penggunaan Tercapai",
            description: "Batas penggunaan species id visionfish Anda telah tercapai.",
            suggestion: "Login agar dapat kuota 5x sehari",
            icon: <Users className="w-6 h-6 text-orange-500" />,
            actions: [
              { label: "Login", onClick: () => navigate('/auth'), variant: "default" as const }
            ]
          };
        } else if (!isPremium) {
          return {
            title: "Kuota Harian Habis",
            description: "Batas penggunaan species id visionfish Anda telah tercapai.",
            suggestion: "Tunggu hingga kuota direset (24 jam) atau upgrade ke Premium untuk akses unlimited",
            icon: <AlertTriangle className="w-6 h-6 text-orange-500" />,
            actions: [
              { label: "Upgrade ke Premium", onClick: () => navigate('/premium'), variant: "default" as const }
            ]
          };
        } else {
          return {
            title: "Cooldown Aktif",
            description: "Silakan tunggu sebelum melakukan analisis berikutnya.",
            suggestion: "Pengguna premium memiliki cooldown 3 jam antara analisis",
            icon: <Crown className="w-6 h-6 text-yellow-500" />,
            actions: []
          };
        }

      case 'login_required':
        return {
          title: "Login Diperlukan",
          description: "Silakan login untuk melanjutkan analisis.",
          suggestion: "Login agar dapat kuota 5x sehari",
          icon: <Users className="w-6 h-6 text-blue-500" />,
          actions: [
            { label: "Login", onClick: () => navigate('/auth'), variant: "default" as const }
          ]
        };

      case 'api_quota':
      case 'invalid_key':
        return {
          title: "Layanan Tidak Tersedia",
          description: "VisionFish AI sedang dalam pemeliharaan.",
          suggestion: "Silakan coba lagi nanti atau hubungi admin",
          icon: <Key className="w-6 h-6 text-red-500" />,
          actions: []
        };

      case 'network':
        return {
          title: "Koneksi Bermasalah",
          description: "Gagal terhubung ke layanan AI.",
          suggestion: "Periksa koneksi internet Anda",
          icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
          actions: []
        };

      default:
        return {
          title: "Terjadi Kesalahan",
          description: errorMessage || "Terjadi kesalahan yang tidak terduga.",
          suggestion: "Silakan coba lagi atau hubungi admin jika masalah berlanjut",
          icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
          actions: []
        };
    }
  };

  const content = getModalContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {content.icon}
            {content.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">
            {content.description}
          </p>
          
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {content.suggestion}
            </p>
          </div>

          {quotaInfo && isLoggedIn && (
            <div className="flex items-center justify-between text-sm">
              <span>Status:</span>
              <Badge variant={isPremium ? "default" : "secondary"}>
                {isPremium ? "Premium" : "Free User"}
              </Badge>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {content.actions.map((action, index) => (
              <Button 
                key={index}
                onClick={action.onClick}
                variant={action.variant}
                className="w-full"
              >
                {action.label}
              </Button>
            ))}
            
            {/* Only show admin button for logged-in admins */}
            {isLoggedIn && isAdmin && (
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin')}
                className="w-full"
              >
                <Settings className="w-4 h-4 mr-2" />
                Pengaturan Admin
              </Button>
            )}
            
            <Button variant="outline" onClick={onClose} className="w-full">
              Tutup
            </Button>
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Butuh bantuan lebih lanjut?{" "}
              <a 
                href="https://wa.me/6289561931339" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline inline-flex items-center gap-1"
              >
                Hubungi WhatsApp
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorHandlingModal;
