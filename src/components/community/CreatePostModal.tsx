
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MapPin, Globe, Lock, Image as ImageIcon, Loader2 } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { useCommunityPosts } from '@/hooks/useCommunityPosts';
import { useToast } from '@/hooks/use-toast';
import { uploadToImageKit } from '@/lib/imagekit';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated?: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
  open, 
  onOpenChange, 
  onPostCreated 
}) => {
  const { createPost } = useCommunityPosts();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: '',
    is_private: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "❌ Judul diperlukan",
        description: "Silakan masukkan judul post",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      let imageUrl = '';
      
      // Upload image to ImageKit only when creating the post
      if (selectedFile) {
        console.log('Uploading image to ImageKit...');
        const fileName = `community_${Date.now()}_${selectedFile.name}`;
        imageUrl = await uploadToImageKit(selectedFile, fileName);
        console.log('Image uploaded successfully:', imageUrl);
      }

      console.log('Creating post with data:', {
        ...formData,
        imageUrl: imageUrl || undefined
      });

      const result = await createPost({
        ...formData,
        imageUrl: imageUrl || undefined
      });

      if (result) {
        console.log('Post created successfully:', result);
        
        // Reset form
        setFormData({
          title: '',
          content: '',
          location: '',
          is_private: false
        });
        setSelectedFile(null);
        setImagePreview('');
        onOpenChange(false);
        
        // Call the callback to refresh posts
        if (onPostCreated) {
          onPostCreated();
        }
        
        toast({
          title: "🎉 Post berhasil dibuat!",
          description: selectedFile 
            ? "Post dengan gambar telah dipublikasikan" 
            : "Post telah dipublikasikan"
        });
      } else {
        console.error('Post creation returned null');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "❌ Gagal membuat post",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat membuat post. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelect = (file: File, preview: string) => {
    console.log('Image selected for preview:', { fileName: file.name, size: file.size });
    setSelectedFile(file);
    setImagePreview(preview);
  };

  const handleImageRemove = () => {
    console.log('Image removed from preview');
    setSelectedFile(null);
    setImagePreview('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white">
            <ImageIcon className="w-5 h-5" />
            Buat Post Baru
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-white font-medium">
              Judul Post *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Masukkan judul post..."
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content" className="text-white font-medium">
              Konten
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Ceritakan tentang pengalaman memancing Anda..."
              className="mt-1 min-h-[100px] bg-white/10 border-white/20 text-white placeholder:text-white/60"
              disabled={isSubmitting}
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label className="text-white font-medium mb-2 block">
              Gambar
            </Label>
            <ImageUpload
              onImageSelect={handleImageSelect}
              onImageRemove={handleImageRemove}
              preview={imagePreview}
              disabled={isSubmitting}
            />
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location" className="text-white font-medium flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Lokasi
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Lokasi memancing..."
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              disabled={isSubmitting}
            />
          </div>

          {/* Privacy Settings */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              {formData.is_private ? (
                <Lock className="w-5 h-5 text-white/70" />
              ) : (
                <Globe className="w-5 h-5 text-white/70" />
              )}
              <div>
                <p className="text-white font-medium">
                  {formData.is_private ? 'Post Privat' : 'Post Publik'}
                </p>
                <p className="text-white/60 text-sm">
                  {formData.is_private 
                    ? 'Hanya Anda yang bisa melihat post ini'
                    : 'Semua orang bisa melihat post ini'
                  }
                </p>
              </div>
            </div>
            <Switch
              checked={formData.is_private}
              onCheckedChange={(checked) => setFormData({ ...formData, is_private: checked })}
              disabled={isSubmitting}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {selectedFile ? 'Mengupload & Membuat...' : 'Membuat...'}
                </>
              ) : (
                'Buat Post'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
