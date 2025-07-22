
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Upload, MapPin, Calendar, FileText, Award, Target, TrendingUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useNotifications } from '@/hooks/useNotifications';
import { UserProfileItem } from '@/services/userProfileItemsService';

interface EditProfileItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: UserProfileItem | null;
  onSave: (updatedItem: Partial<UserProfileItem>) => Promise<void>;
}

const EditProfileItemDialog = ({ open, onOpenChange, item, onSave }: EditProfileItemDialogProps) => {
  const { showNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'activity' as 'achievement' | 'activity' | 'statistic',
    location: '',
    date: '',
    is_private: false,
    image_url: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        category: item.category || 'activity',
        location: item.location || '',
        date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
        is_private: item.is_private || false,
        image_url: item.image_url || ''
      });
    }
  }, [item]);

  const handleSave = async () => {
    if (!formData.title.trim()) {
      showNotification('Judul harus diisi', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await onSave({
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        category: formData.category,
        location: formData.location.trim() || null,
        date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
        is_private: formData.is_private,
        image_url: formData.image_url.trim() || null
      });
      
      showNotification('Item berhasil diperbarui', 'success');
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating item:', error);
      showNotification('Gagal memperbarui item', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'achievement': return Award;
      case 'activity': return Target;
      case 'statistic': return TrendingUp;
      default: return Target;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-[#1a1a2e] to-[#2d1b69] border-[#A56ABD]/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#F5EBFA] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#A56ABD]" />
            Edit Item Profil
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-[#E7D7EF]">
              Judul *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Masukkan judul item..."
              className="bg-white/10 border-[#A56ABD]/30 text-white placeholder:text-gray-400"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-[#E7D7EF]">
              Deskripsi
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Tambahkan deskripsi..."
              className="bg-white/10 border-[#A56ABD]/30 text-white placeholder:text-gray-400 min-h-[80px]"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#E7D7EF]">Kategori</Label>
            <Select
              value={formData.category}
              onValueChange={(value: 'achievement' | 'activity' | 'statistic') => 
                setFormData(prev => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger className="bg-white/10 border-[#A56ABD]/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activity">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Aktivitas
                  </div>
                </SelectItem>
                <SelectItem value="achievement">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Pencapaian
                  </div>
                </SelectItem>
                <SelectItem value="statistic">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Statistik
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-[#E7D7EF]">
              Lokasi
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Masukkan lokasi..."
                className="bg-white/10 border-[#A56ABD]/30 text-white placeholder:text-gray-400 pl-10"
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium text-[#E7D7EF]">
              Tanggal
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="bg-white/10 border-[#A56ABD]/30 text-white pl-10"
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image_url" className="text-sm font-medium text-[#E7D7EF]">
              URL Gambar
            </Label>
            <div className="relative">
              <Upload className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://..."
                className="bg-white/10 border-[#A56ABD]/30 text-white placeholder:text-gray-400 pl-10"
              />
            </div>
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-[#E7D7EF]">
                Privat
              </Label>
              <p className="text-xs text-gray-400">
                Hanya Anda yang dapat melihat item ini
              </p>
            </div>
            <Switch
              checked={formData.is_private}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_private: checked }))}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-[#A56ABD]/20">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-[#A56ABD]/30 text-[#E7D7EF] hover:bg-white/10"
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !formData.title.trim()}
            className="flex-1 bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Simpan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileItemDialog;
