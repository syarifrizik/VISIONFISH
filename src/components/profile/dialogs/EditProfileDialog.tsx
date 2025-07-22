
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Edit3, User, MapPin, FileText, Camera, Save, X } from 'lucide-react';

interface EditProfileDialogProps {
  currentProfile: {
    display_name?: string;
    username?: string;
    bio?: string;
    location?: string;
  };
  onProfileUpdated: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditProfileDialog = ({ currentProfile, onProfileUpdated, open, onOpenChange }: EditProfileDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: currentProfile.display_name || '',
    username: currentProfile.username || '',
    bio: currentProfile.bio || '',
    location: currentProfile.location || ''
  });

  useEffect(() => {
    if (open) {
      setFormData({
        display_name: currentProfile.display_name || '',
        username: currentProfile.username || '',
        bio: currentProfile.bio || '',
        location: currentProfile.location || ''
      });
    }
  }, [open, currentProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      console.log('Updating profile for user:', user.id);
      console.log('Form data:', formData);

      // Check if username is already taken (if changed)
      if (formData.username !== currentProfile.username && formData.username.trim()) {
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', formData.username)
          .neq('id', user.id)
          .single();

        if (existingUser) {
          toast({
            title: "❌ Username Sudah Digunakan",
            description: "Pilih username lain yang belum digunakan",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
      }

      // Update profile in Supabase
      const updateData = {
        display_name: formData.display_name || null,
        username: formData.username || null,
        bio: formData.bio || null,
        location: formData.location || null,
        updated_at: new Date().toISOString()
      };

      console.log('Sending update to Supabase:', updateData);

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Profile updated successfully:', data);

      toast({
        title: "✅ Profil Berhasil Diperbarui!",
        description: "Perubahan profil Anda telah disimpan ke database",
      });

      onOpenChange(false);
      onProfileUpdated();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "❌ Gagal Memperbarui Profil",
        description: error instanceof Error ? error.message : "Terjadi kesalahan tidak terduga",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-blue-200/50 dark:border-blue-700/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-blue-900 dark:text-blue-100">
            <User className="w-6 h-6" />
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
                  <User className="w-8 h-8 text-gray-400" />
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display_name" className="text-gray-700 dark:text-gray-300">
                Nama Tampilan
              </Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="Nama yang akan ditampilkan"
                className="bg-white/80 dark:bg-gray-800/80 border-blue-200 dark:border-blue-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">
                Username
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') 
                })}
                placeholder="username_unik"
                className="bg-white/80 dark:bg-gray-800/80 border-blue-200 dark:border-blue-700"
              />
              <p className="text-xs text-gray-500">Hanya huruf kecil, angka, dan underscore</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-700 dark:text-gray-300">
                <MapPin className="w-4 h-4 inline mr-1" />
                Lokasi
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Jakarta, Indonesia"
                className="bg-white/80 dark:bg-gray-800/80 border-blue-200 dark:border-blue-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-700 dark:text-gray-300">
                <FileText className="w-4 h-4 inline mr-1" />
                Bio
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Ceritakan sedikit tentang diri Anda..."
                className="bg-white/80 dark:bg-gray-800/80 border-blue-200 dark:border-blue-700"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-500">{formData.bio.length}/500 karakter</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={loading}
              >
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.display_name.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
