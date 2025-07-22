
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Crown, Shield, Calendar, Mail, User, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import UserApiKeyManager from "./UserApiKeyManager";

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  created_at: string;
  is_premium: boolean;
  is_admin: boolean;
  email?: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
  last_seen_at?: string;
  followers_count?: number;
  following_count?: number;
  fish_caught?: number;
}

interface UserDetailDialogProps {
  user: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserDetailDialog = ({ user, open, onOpenChange }: UserDetailDialogProps) => {
  const [userDetails, setUserDetails] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && open) {
      fetchUserDetails();
    }
  }, [user, open]);

  const fetchUserDetails = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get detailed user info from profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Get user stats
      const { data: statsData } = await supabase
        .from('user_profile_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Get auth user email
      const { data: authData } = await supabase.auth.admin.getUserById(user.id);

      setUserDetails({
        ...user,
        ...profileData,
        email: authData.user?.email || user.email,
        ...statsData
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error("Gagal memuat detail user");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const displayUser = userDetails || user;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detail User
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-visionfish-neon-pink to-visionfish-neon-purple flex items-center justify-center text-white font-bold text-xl">
                {displayUser.display_name?.[0] || displayUser.username?.[0] || 'U'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold">
                    {displayUser.display_name || displayUser.username || 'Unknown User'}
                  </h3>
                  {displayUser.is_premium && (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  {displayUser.is_admin && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">@{displayUser.username}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="font-medium">Informasi Dasar</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{displayUser.email || 'Email tidak tersedia'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Bergabung: {new Date(displayUser.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  {displayUser.last_seen_at && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        Terakhir aktif: {new Date(displayUser.last_seen_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  )}

                  {displayUser.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{displayUser.location}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <h4 className="font-medium">Statistik</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Pengikut:</span>
                      <span className="text-sm font-medium">{displayUser.followers_count || 0}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Mengikuti:</span>
                      <span className="text-sm font-medium">{displayUser.following_count || 0}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Ikan Ditangkap:</span>
                      <span className="text-sm font-medium">{displayUser.fish_caught || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {displayUser.bio && (
                  <div>
                    <h4 className="font-medium mb-2">Bio</h4>
                    <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                      {displayUser.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* API Key Management */}
              <div>
                <UserApiKeyManager 
                  userId={displayUser.id} 
                  isPremium={displayUser.is_premium} 
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Tutup
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailDialog;
