
import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Camera, Image as ImageIcon, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedUploadZoneProps {
  selectedImage: string | null;
  onImageUpload: (file: File) => void;
  onImageRemove: () => void;
  disabled?: boolean;
}

const EnhancedUploadZone = ({ 
  selectedImage, 
  onImageUpload, 
  onImageRemove, 
  disabled = false 
}: EnhancedUploadZoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error("File tidak valid. Harap unggah file gambar.");
      return;
    }

    setIsUploading(true);
    try {
      await onImageUpload(file);
      toast.success("Gambar berhasil diunggah!");
    } catch (error) {
      toast.error("Gagal mengunggah gambar. Silakan coba lagi.");
    } finally {
      setIsUploading(false);
    }
  }, [onImageUpload]);

  const handleDragEvents = {
    onDragEnter: (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setDragActive(true);
    },
    onDragLeave: (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
    },
    onDragOver: (e: React.DragEvent) => e.preventDefault(),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (disabled) return;
      
      const file = e.dataTransfer.files[0];
      if (file) {
        handleImageUpload(file);
      }
    }
  };

  const handleFileSelect = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  const handleCameraClick = async () => {
    if (disabled) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const track = stream.getVideoTracks()[0];

      if ('ImageCapture' in window) {
        const imageCapture = new (window as any).ImageCapture(track);
        const blob = await imageCapture.takePhoto();
        stream.getTracks().forEach(track => track.stop());
        const imageFile = new File([blob], 'camera_photo.jpg', { type: 'image/jpeg' });
        handleImageUpload(imageFile);
      } else {
        // Fallback for browsers that don't support ImageCapture
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        video.addEventListener('loadedmetadata', () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0);
            canvas.toBlob(blob => {
              if (blob) {
                const imageFile = new File([blob], 'camera_photo.jpg', { type: 'image/jpeg' });
                handleImageUpload(imageFile);
              }
              stream.getTracks().forEach(track => track.stop());
            }, 'image/jpeg');
          }
        });
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Gagal mengakses kamera. Pastikan izin kamera telah diberikan.");
    }
  };

  return (
    <div className="space-y-4">
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={e => {
          if (e.target.files && e.target.files[0]) {
            handleImageUpload(e.target.files[0]);
          }
        }} 
      />

      <AnimatePresence mode="wait">
        {selectedImage ? (
          <motion.div
            key="with-image"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="relative overflow-hidden border-2 border-green-500/30 bg-green-50/30 dark:bg-green-950/30">
              <CardContent className="p-4">
                <div className="relative">
                  <img 
                    src={selectedImage} 
                    alt="Uploaded fish" 
                    className="w-full max-h-80 object-contain rounded-lg shadow-md" 
                  />
                  
                  {/* Success Indicator */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-5 h-5 text-white" />
                  </motion.div>

                  {/* Remove Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onImageRemove}
                    className="absolute top-3 left-3 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </motion.button>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                    ✅ Gambar siap dianalisis
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="without-image"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            {...handleDragEvents}
          >
            <Card className={`
              relative overflow-hidden border-2 border-dashed transition-all duration-300 cursor-pointer
              ${dragActive
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 shadow-lg scale-105'
                : 'border-muted-foreground/30 hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-950/20'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}>
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
              
              <CardContent 
                className="relative p-8 md:p-12 text-center space-y-6"
                onClick={handleFileSelect}
              >
                <AnimatePresence mode="wait">
                  {dragActive ? (
                    <motion.div
                      key="drag-active"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="text-blue-500"
                    >
                      <Upload className="h-16 w-16 mx-auto animate-bounce" />
                      <p className="text-xl font-semibold mt-4">Lepaskan gambar di sini</p>
                    </motion.div>
                  ) : isUploading ? (
                    <motion.div
                      key="uploading"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="text-blue-500"
                    >
                      <div className="w-16 h-16 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                      <p className="text-lg font-medium mt-4">Mengunggah gambar...</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="space-y-4"
                    >
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground" />
                      </motion.div>
                      
                      <div className="space-y-2">
                        <p className="text-xl font-semibold">Unggah Gambar Ikan</p>
                        <p className="text-muted-foreground">
                          Seret dan lepas gambar di sini atau klik untuk memilih file
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Format: JPG, PNG, WEBP (Maks. 10MB)
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!dragActive && !isUploading && (
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button 
                      variant="default" 
                      size="lg"
                      onClick={handleFileSelect} 
                      disabled={disabled}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <ImageIcon className="h-5 w-5 mr-2" />
                      Pilih Gambar
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={handleCameraClick} 
                      disabled={disabled}
                      className="border-2 hover:bg-muted/50"
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      Ambil Foto
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedUploadZone;
