
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Eye, Users, Fish, Globe, Lock } from 'lucide-react';
import { toast } from 'sonner';

type ProfileVisibility = 'public' | 'members_only' | 'private';

const EnhancedPrivacySettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    profile_visibility: 'public' as ProfileVisibility,
    show_activity: true,
    show_followers: true,
    show_following: true,
    show_catches: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadPrivacySettings();
    }
  }, [user]);

  const loadPrivacySettings = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading privacy settings:', error);
      }
      
      if (data) {
        setSettings({
          profile_visibility: (data.profile_visibility || 'public') as ProfileVisibility,
          show_activity: data.show_activity ?? true,
          show_followers: data.show_followers ?? true,
          show_following: data.show_following ?? true,
          show_catches: data.show_catches ?? true
        });
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrivacy = async () => {
    if (!user?.id) return;
    
    setSaving(true);
    try {
      // First, try to update existing record
      const { data: updateData, error: updateError } = await supabase
        .from('privacy_settings')
        .update({
          profile_visibility: settings.profile_visibility,
          show_activity: settings.show_activity,
          show_followers: settings.show_followers,
          show_following: settings.show_following,
          show_catches: settings.show_catches,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      // If update fails because record doesn't exist, create new one
      if (updateError && updateError.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('privacy_settings')
          .insert({
            user_id: user.id,
            profile_visibility: settings.profile_visibility,
            show_activity: settings.show_activity,
            show_followers: settings.show_followers,
            show_following: settings.show_following,
            show_catches: settings.show_catches
          });

        if (insertError) throw insertError;
        
        toast.success("Pengaturan privasi berhasil disimpan!");
      } else if (updateError) {
        throw updateError;
      } else {
        toast.success("Pengaturan privasi berhasil diperbarui!");
      }
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      toast.error("Gagal menyimpan pengaturan privasi");
    } finally {
      setSaving(false);
    }
  };

  const getVisibilityIcon = (level: string) => {
    switch (level) {
      case 'public': return <Globe className="w-4 h-4" />;
      case 'members_only': return <Users className="w-4 h-4" />;
      case 'private': return <Lock className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Pengaturan Privasi
          </CardTitle>
          <CardDescription>
            Silakan login untuk mengatur privasi akun Anda.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            Pengaturan Privasi
          </CardTitle>
          <CardDescription>
            Kontrol siapa yang dapat melihat informasi profil dan aktivitas Anda.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Profile Visibility */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <Label className="text-base font-semibold">Visibilitas Profil</Label>
            </div>
            
            <div className="pl-7">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="font-medium">Profil Umum</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Siapa yang dapat melihat profil Anda
                  </p>
                </div>
                <Select
                  value={settings.profile_visibility}
                  onValueChange={(value: ProfileVisibility) => 
                    setSettings(prev => ({ ...prev, profile_visibility: value }))
                  }
                >
                  <SelectTrigger className="w-40">
                    <div className="flex items-center gap-2">
                      {getVisibilityIcon(settings.profile_visibility)}
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Publik
                      </div>
                    </SelectItem>
                    <SelectItem value="members_only">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Hanya Member
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Privat
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Activity Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              <Label className="text-base font-semibold">Tampilan Konten</Label>
            </div>
            
            <div className="pl-7 space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="font-medium">Tampilkan Aktivitas</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Aktivitas memancing dan postingan
                  </p>
                </div>
                <Switch 
                  checked={settings.show_activity}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, show_activity: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="font-medium">Tampilkan Pengikut</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Daftar pengikut dan yang diikuti
                  </p>
                </div>
                <Switch 
                  checked={settings.show_followers}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, show_followers: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="font-medium">Tampilkan Yang Diikuti</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Daftar pengguna yang Anda ikuti
                  </p>
                </div>
                <Switch 
                  checked={settings.show_following}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, show_following: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="font-medium">Tampilkan Tangkapan Ikan</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Koleksi ikan yang berhasil ditangkap
                  </p>
                </div>
                <Switch 
                  checked={settings.show_catches}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, show_catches: checked }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
        
        <div className="p-6 pt-0">
          <Button 
            onClick={handleSavePrivacy} 
            disabled={saving}
            className="w-full"
          >
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan Privasi'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default EnhancedPrivacySettings;
