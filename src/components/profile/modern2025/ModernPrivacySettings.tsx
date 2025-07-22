
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { usePrivacySettings } from '@/hooks/usePrivacySettings';
import { Shield, Eye, Users, Lock, Globe } from 'lucide-react';
import { toast } from 'sonner';

const ModernPrivacySettings = () => {
  const { user } = useAuth();
  const { privacySettings, isLoading, updateSettings } = usePrivacySettings();
  
  const [localSettings, setLocalSettings] = useState({
    profile_visibility: 'public' as 'public' | 'members_only' | 'private',
    show_activity: true,
    show_followers: true,
    show_following: true,
    show_catches: true
  });

  useEffect(() => {
    if (privacySettings) {
      setLocalSettings({
        profile_visibility: privacySettings.profile_visibility,
        show_activity: privacySettings.show_activity,
        show_followers: privacySettings.show_followers,
        show_following: privacySettings.show_following,
        show_catches: privacySettings.show_catches
      });
    }
  }, [privacySettings]);

  const handleSavePrivacy = async () => {
    const success = await updateSettings(localSettings);
    if (success) {
      toast.success("Pengaturan privasi berhasil disimpan!");
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

  const getVisibilityLabel = (level: string) => {
    switch (level) {
      case 'public': return 'Publik';
      case 'members_only': return 'Hanya Member';
      case 'private': return 'Privat';
      default: return 'Publik';
    }
  };

  if (!user) {
    return (
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Pengaturan Privasi
          </CardTitle>
          <CardDescription className="text-white/70">
            Silakan login untuk mengatur privasi akun Anda.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Shield className="w-6 h-6 text-cyan-400" />
            Pengaturan Privasi
          </CardTitle>
          <CardDescription className="text-white/70">
            Kontrol siapa yang dapat melihat informasi profil dan aktivitas Anda.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Profile Visibility */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              <Label className="text-lg font-semibold text-white">Visibilitas Profil</Label>
            </div>
            
            <div className="grid gap-4 pl-7">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <Label className="text-white font-medium">Profil Umum</Label>
                  <p className="text-sm text-white/60 mt-1">Siapa yang dapat melihat profil Anda</p>
                </div>
                <Select
                  value={localSettings.profile_visibility}
                  onValueChange={(value: 'public' | 'members_only' | 'private') => 
                    setLocalSettings(prev => ({ ...prev, profile_visibility: value }))
                  }
                >
                  <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                    <div className="flex items-center gap-2">
                      {getVisibilityIcon(localSettings.profile_visibility)}
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="public" className="text-white hover:bg-slate-700">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Publik
                      </div>
                    </SelectItem>
                    <SelectItem value="members_only" className="text-white hover:bg-slate-700">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Hanya Member
                      </div>
                    </SelectItem>
                    <SelectItem value="private" className="text-white hover:bg-slate-700">
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
              <Users className="w-5 h-5 text-purple-400" />
              <Label className="text-lg font-semibold text-white">Tampilan Aktivitas</Label>
            </div>
            
            <div className="grid gap-4 pl-7">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <Label className="text-white font-medium">Tampilkan Aktivitas</Label>
                  <p className="text-sm text-white/60 mt-1">Aktivitas memancing dan tangkapan</p>
                </div>
                <Switch 
                  checked={localSettings.show_activity}
                  onCheckedChange={(checked) => 
                    setLocalSettings(prev => ({ ...prev, show_activity: checked }))
                  }
                  className="data-[state=checked]:bg-cyan-500"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <Label className="text-white font-medium">Tampilkan Tangkapan Ikan</Label>
                  <p className="text-sm text-white/60 mt-1">Koleksi ikan yang berhasil ditangkap</p>
                </div>
                <Switch 
                  checked={localSettings.show_catches}
                  onCheckedChange={(checked) => 
                    setLocalSettings(prev => ({ ...prev, show_catches: checked }))
                  }
                  className="data-[state=checked]:bg-purple-500"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <Label className="text-white font-medium">Tampilkan Pengikut</Label>
                  <p className="text-sm text-white/60 mt-1">Daftar pengikut Anda</p>
                </div>
                <Switch 
                  checked={localSettings.show_followers}
                  onCheckedChange={(checked) => 
                    setLocalSettings(prev => ({ ...prev, show_followers: checked }))
                  }
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div>
                  <Label className="text-white font-medium">Tampilkan Yang Diikuti</Label>
                  <p className="text-sm text-white/60 mt-1">Daftar pengguna yang Anda ikuti</p>
                </div>
                <Switch
                  checked={localSettings.show_following}
                  onCheckedChange={(checked) =>
                      setLocalSettings(prev => ({ ...prev, show_following: checked }))
                  }
                  className="data-[state=checked]:bg-orange-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
        
        <div className="p-6 pt-0">
          <Button 
            onClick={handleSavePrivacy} 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg"
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Pengaturan Privasi'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default ModernPrivacySettings;
