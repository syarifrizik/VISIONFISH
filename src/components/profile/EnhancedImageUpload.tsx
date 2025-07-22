
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Check, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/use-theme';
import { uploadToImageKit } from '@/lib/imagekit';

interface EnhancedImageUploadProps {
  currentImageUrl?: string;
  onImageUpload: (url: string) => void;
  onImageRemove?: () => void;
  disabled?: boolean;
}

const EnhancedImageUpload = ({
  currentImageUrl,
  onImageUpload,
  onImageRemove,
  disabled = false
}: EnhancedImageUploadProps) => {
  const { toast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const compressImage = useCallback((file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        const maxSize = 400;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/webp',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/webp', 0.85);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "❌ File Tidak Valid",
        description: "Silakan pilih file gambar (JPG, PNG, WebP)",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "❌ File Terlalu Besar",
        description: "Ukuran file maksimal 10MB",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(10);
      
      const compressedFile = await compressImage(file);
      setUploadProgress(30);
      
      const previewUrl = URL.createObjectURL(compressedFile);
      setPreviewUrl(previewUrl);
      setUploadProgress(50);
      
      const fileName = `profile_${Date.now()}_${compressedFile.name}`;
      setUploadProgress(70);
      
      const imageUrl = await uploadToImageKit(compressedFile, fileName);
      setUploadProgress(90);
      
      const optimizedUrl = `${imageUrl}?tr=w-400,h-400,c-force,q-85,f-auto`;
      onImageUpload(optimizedUrl);
      setUploadProgress(100);
      
      toast({
        title: "✅ Foto Berhasil Diupload",
        description: "Foto profil Anda telah diperbarui",
      });
      
      // Clean up preview URL
      setTimeout(() => {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }, 1000);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "❌ Gagal Upload Foto",
        description: "Terjadi kesalahan saat mengunggah foto",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [compressImage, onImageUpload, toast]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  const displayImageUrl = previewUrl || currentImageUrl;

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer group
          ${dragActive
            ? isDark 
              ? 'border-blue-400 bg-blue-900/20' 
              : 'border-blue-500 bg-blue-50/50'
            : isDark
              ? 'border-gray-600 hover:border-blue-400 hover:bg-gray-800/30'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled || uploading}
        />
        
        <div className="text-center space-y-4">
          <div className={`
            w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300
            ${isDark 
              ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
              : 'bg-gradient-to-br from-blue-500 to-purple-600'
            }
            group-hover:scale-110 group-hover:shadow-lg
          `}>
            {uploading ? (
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-white" />
            )}
          </div>
          
          <div>
            <p className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {uploading ? 'Mengunggah...' : 'Drag foto atau klik untuk pilih'}
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              PNG, JPG, WebP hingga 10MB
            </p>
          </div>
          
          {!uploading && (
            <Button
              type="button"
              variant="outline"
              className={`
                mt-4 font-medium transition-all duration-200
                ${isDark 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-blue-400' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-400'
                }
              `}
              disabled={disabled}
            >
              <Camera className="w-4 h-4 mr-2" />
              Pilih Foto
            </Button>
          )}
        </div>
      </div>
      
      {/* Progress Bar */}
      <AnimatePresence>
        {uploading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Mengunggah...
              </span>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {uploadProgress}%
              </span>
            </div>
            <div className={`w-full rounded-full h-2 overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Image Actions */}
      {currentImageUrl && !uploading && onImageRemove && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onImageRemove}
            className={`
              font-medium transition-all duration-200
              ${isDark 
                ? 'border-red-600 text-red-400 hover:bg-red-900/20 hover:text-red-300' 
                : 'border-red-500 text-red-600 hover:bg-red-50'
              }
            `}
            disabled={disabled}
          >
            <X className="w-4 h-4 mr-2" />
            Hapus Foto
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnhancedImageUpload;
