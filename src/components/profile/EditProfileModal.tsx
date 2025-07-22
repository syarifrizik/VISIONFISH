
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Camera, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: {
    id: string;
    username?: string;
    display_name?: string;
    bio?: string;
    location?: string;
    avatar_url?: string;
  };
  onProfileUpdated?: () => void;
}

const EditProfileModal = ({ 
  open, 
  onOpenChange, 
  profile,
  onProfileUpdated 
}: EditProfileModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: profile.display_name || '',
    bio: profile.bio || '',
    location: profile.location || '',
    avatar_url: profile.avatar_url || ''
  });

  const handleSave = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: formData.display_name,
          bio: formData.bio,
          location: formData.location,
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "✅ Profil Berhasil Diperbarui",
        description: "Perubahan profil Anda telah disimpan.",
      });

      onProfileUpdated?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "❌ Gagal Memperbarui Profil",
        description: "Terjadi kesalahan saat menyimpan perubahan.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <User className="w-5 h-5 text-blue-600" />
            Edit Profil
          </DialogTitle>
        </DialogHeader>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 py-4"
        >
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                  {formData.avatar_url ? (
                    <img 
                      src={formData.avatar_url} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                className="absolute -bottom-1 -right-1 h-8 w-8 p-0 rounded-full border-2 border-white dark:border-gray-900"
              >
                <Camera className="w-3 h-3" />
              </Button>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Foto Profil
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Klik untuk mengubah foto profil
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="display_name" className="text-sm font-medium">
                Nama Tampilan
              </Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="Masukkan nama tampilan"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="bio" className="text-sm font-medium">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Ceritakan tentang diri Anda..."
                className="mt-1 min-h-[80px]"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.bio.length}/500 karakter
              </p>
            </div>

            <div>
              <Label htmlFor="location" className="text-sm font-medium flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Lokasi
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Kota, Provinsi"
                className="mt-1"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => onOpenChange(false)}
              variant="outline" 
              className="flex-1"
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button 
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
