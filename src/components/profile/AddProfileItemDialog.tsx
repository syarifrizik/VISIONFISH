
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Upload, Calendar, MapPin, Eye, EyeOff, Trophy, Activity, BarChart3 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { useActivityTracking } from '@/hooks/useActivityTracking';
import { createUserProfileItem, updateUserProfileItem, UserProfileItem } from '@/services/userProfileItemsService';

interface AddProfileItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemAdded: () => void;
  editingItem?: UserProfileItem | null;
  onPublicPost?: () => void;
  defaultPublic?: boolean;
  mode?: 'profile' | 'community';
}

const AddProfileItemDialog = ({
  open,
  onOpenChange,
  onItemAdded,
  editingItem,
  onPublicPost,
  defaultPublic = false,
  mode = 'profile'
}: AddProfileItemDialogProps) => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  const { trackContentCreationActivity, trackCommunityPostActivity } = useActivityTracking();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'activity' as 'achievement' | 'activity' | 'statistic',
    location: '',
    date: new Date().toISOString().split('T')[0],
    is_private: mode === 'community' ? false : !defaultPublic,
    image_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens/closes or mode changes
  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title,
        description: editingItem.description || '',
        category: editingItem.category,
        location: editingItem.location || '',
        date: editingItem.date.split('T')[0],
        is_private: editingItem.is_private,
        image_url: editingItem.image_url || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'activity',
        location: '',
        date: new Date().toISOString().split('T')[0],
        is_private: mode === 'community' ? false : !defaultPublic,
        image_url: ''
      });
    }
  }, [editingItem, open, defaultPublic, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      console.log('Submitting profile item:', { ...formData, mode });
      
      const itemData = {
        user_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        category: formData.category,
        location: formData.location.trim() || null,
        image_url: formData.image_url.trim() || null,
        video_url: null,
        date: new Date(formData.date).toISOString(),
        is_private: formData.is_private
      };

      let result;
      if (editingItem) {
        result = await updateUserProfileItem(editingItem.id, itemData);
        console.log('Update result:', result);
      } else {
        result = await createUserProfileItem(itemData);
        console.log('Create result:', result);
      }

      if (result.success && result.data) {
        const actionText = editingItem ? 'diperbarui' : 'ditambahkan';
        const visibilityText = formData.is_private ? 'pribadi' : 'komunitas';
        
        // Track activity based on the mode and item
        if (!editingItem) {
          if (!formData.is_private && (mode === 'community' || onPublicPost)) {
            await trackCommunityPostActivity(result.data.id, result.data.title);
          } else {
            await trackContentCreationActivity(result.data.category, result.data.id, result.data.title);
          }
        }
        
        showNotification(
          `Konten berhasil ${actionText} ${!formData.is_private ? 'dan dibagikan ke ' + visibilityText : ''}!`, 
          'success'
        );
        
        // Call callbacks
        onItemAdded();
        onOpenChange(false);
        
        // Special handling for public posts in community mode
        if (!editingItem && !formData.is_private && (mode === 'community' || onPublicPost)) {
          setTimeout(() => {
            if (onPublicPost) {
              onPublicPost();
            }
          }, 500);
        }
      } else {
        throw new Error(result.error || 'Gagal menyimpan konten');
      }
    } catch (error) {
      console.error('Error saving item:', error);
      showNotification('Gagal menyimpan konten. Silakan coba lagi.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'achievement': return <Trophy className="w-4 h-4" />;
      case 'activity': return <Activity className="w-4 h-4" />;
      case 'statistic': return <BarChart3 className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getDialogTitle = () => {
    if (editingItem) return 'Edit Konten';
    if (mode === 'community') return 'Bagikan ke Komunitas';
    return defaultPublic ? 'Bagikan Konten' : 'Tambah Konten';
  };

  const getSubmitButtonText = () => {
    if (isSubmitting) return 'Menyimpan...';
    if (editingItem) return 'Perbarui';
    if (mode === 'community') return 'Bagikan';
    return defaultPublic ? 'Bagikan' : 'Tambahkan';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-[#49225B] to-[#6E3482] border-[#A56ABD]/20 text-[#F5EBFA] max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#F5EBFA] flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {getDialogTitle()}
          </DialogTitle>
          {mode === 'community' && (
            <p className="text-sm text-[#A56ABD] mt-1">
              Konten akan langsung terlihat di feed komunitas
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label className="text-[#A56ABD] font-medium">Kategori</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value: any) => handleInputChange('category', value)}
            >
              <SelectTrigger className="bg-white/10 border-[#A56ABD]/30 text-[#F5EBFA]">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(formData.category)}
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#49225B] border-[#A56ABD]/20">
                <SelectItem value="achievement" className="text-[#F5EBFA] hover:bg-[#6E3482]">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Pencapaian
                  </div>
                </SelectItem>
                <SelectItem value="activity" className="text-[#F5EBFA] hover:bg-[#6E3482]">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Aktivitas
                  </div>
                </SelectItem>
                <SelectItem value="statistic" className="text-[#F5EBFA] hover:bg-[#6E3482]">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Statistik
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label className="text-[#A56ABD] font-medium">Judul*</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Masukkan judul konten..."
              className="bg-white/10 border-[#A56ABD]/30 text-[#F5EBFA] placeholder:text-[#A56ABD]"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-[#A56ABD] font-medium">Deskripsi</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Ceritakan lebih detail tentang konten ini..."
              className="bg-white/10 border-[#A56ABD]/30 text-[#F5EBFA] placeholder:text-[#A56ABD] min-h-[80px]"
              rows={3}
            />
          </div>

          {/* Date and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#A56ABD] font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Tanggal
              </Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="bg-white/10 border-[#A56ABD]/30 text-[#F5EBFA]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#A56ABD] font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Lokasi
              </Label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Lokasi (opsional)"
                className="bg-white/10 border-[#A56ABD]/30 text-[#F5EBFA] placeholder:text-[#A56ABD]"
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label className="text-[#A56ABD] font-medium flex items-center gap-1">
              <Upload className="w-3 h-3" />
              URL Gambar
            </Label>
            <Input
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              placeholder="https://example.com/image.jpg (opsional)"
              className="bg-white/10 border-[#A56ABD]/30 text-[#F5EBFA] placeholder:text-[#A56ABD]"
            />
          </div>

          {/* Privacy Toggle - Hide in community mode */}
          {mode !== 'community' && (
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-[#A56ABD]/20">
              <div className="flex items-center gap-2">
                {formData.is_private ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <div>
                  <Label className="text-[#F5EBFA] font-medium">
                    {formData.is_private ? 'Privat' : 'Publik'}
                  </Label>
                  <p className="text-xs text-[#A56ABD]">
                    {formData.is_private 
                      ? 'Hanya Anda yang dapat melihat konten ini'
                      : 'Konten ini akan terlihat di feed komunitas'
                    }
                  </p>
                </div>
              </div>
              <Switch
                checked={!formData.is_private}
                onCheckedChange={(checked) => handleInputChange('is_private', !checked)}
                className="data-[state=checked]:bg-[#6E3482]"
              />
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-[#A56ABD]/30 text-[#A56ABD] hover:bg-[#A56ABD]/10"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title.trim()}
              className="flex-1 bg-[#6E3482] hover:bg-[#49225B] text-[#F5EBFA]"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {getSubmitButtonText()}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProfileItemDialog;
