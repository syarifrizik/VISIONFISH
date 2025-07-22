
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { uploadToImageKit } from '@/lib/imagekit';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ProfilePhotoUploadProps {
  currentAvatarUrl?: string;
  onPhotoUpdated: (newAvatarUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

const ProfilePhotoUpload = ({ 
  currentAvatarUrl, 
  onPhotoUpdated, 
  size = 'md' 
}: ProfilePhotoUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Set canvas size to 200x200
        canvas.width = 200;
        canvas.height = 200;
        
        // Draw image with proper scaling
        ctx.drawImage(img, 0, 0, 200, 200);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/webp',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            // Fallback to JPEG if WebP not supported
            canvas.toBlob((jpegBlob) => {
              if (jpegBlob) {
                const jpegFile = new File([jpegBlob], file.name.replace(/\.\w+$/, '.jpg'), {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                resolve(jpegFile);
              } else {
                resolve(file);
              }
            }, 'image/jpeg', 0.8);
          }
        }, 'image/webp', 0.8);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "❌ File Tidak Valid",
        description: "Silakan pilih file gambar (JPG, PNG, WebP)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "❌ File Terlalu Besar",
        description: "Ukuran file maksimal 10MB",
        variant: "destructive"
      });
      return;
    }

    try {
      const compressedFile = await compressImage(file);
      setSelectedFile(compressedFile);
      setPreviewUrl(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error('Error compressing image:', error);
      toast({
        title: "❌ Gagal Memproses Gambar",
        description: "Terjadi kesalahan saat memproses gambar",
        variant: "destructive"
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    try {
      console.log('Starting profile photo upload...');
      
      // Upload to ImageKit with profile-specific transformations
      const fileName = `profile_${user.id}_${Date.now()}.${selectedFile.name.split('.').pop()}`;
      const imageUrl = await uploadToImageKit(selectedFile, fileName);
      
      console.log('Image uploaded to ImageKit:', imageUrl);
      
      // Add ImageKit transformations for profile optimization
      const optimizedUrl = `${imageUrl}?tr=w-200,h-200,c-force,q-80,f-auto`;
      
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: optimizedUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw new Error(error.message);
      }

      console.log('Profile avatar updated in database');
      
      // Call the callback to update parent component
      onPhotoUpdated(optimizedUrl);
      
      // Reset states
      setSelectedFile(null);
      setPreviewUrl(null);
      setIsOpen(false);
      
      toast({
        title: "✅ Foto Profil Berhasil Diperbarui!",
        description: "Foto profil Anda telah disimpan",
      });

    } catch (error) {
      console.error('Error uploading profile photo:', error);
      toast({
        title: "❌ Gagal Mengunggah Foto",
        description: error instanceof Error ? error.message : "Terjadi kesalahan tidak terduga",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.button
          className={`${sizeClasses[size]} bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Camera className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
        </motion.button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-blue-200/50 dark:border-blue-700/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-blue-900 dark:text-blue-100">
            <Camera className="w-6 h-6" />
            Ubah Foto Profil
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current/Preview Image */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : currentAvatarUrl ? (
                <img
                  src={currentAvatarUrl}
                  alt="Current avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* File Input */}
          <div className="space-y-4">
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
              <Button
                variant="outline"
                className="w-full"
                disabled={isUploading}
                asChild
              >
                <div className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Pilih Foto Baru
                </div>
              </Button>
            </label>

            <p className="text-xs text-gray-500 text-center">
              Format: JPG, PNG, WebP • Maksimal: 10MB<br />
              Gambar akan otomatis disesuaikan ke 200x200px
            </p>
          </div>

          {/* Action Buttons */}
          {selectedFile && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                disabled={isUploading}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Mengunggah...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Simpan Foto
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePhotoUpload;
