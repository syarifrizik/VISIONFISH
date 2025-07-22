
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { addUserAchievement, updateUserAchievement, UserAchievement } from '@/services/profileStatsService';

interface AddAchievementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAchievementAdded: () => void;
  editingAchievement?: UserAchievement | null;
}

export const AddAchievementDialog = ({ 
  isOpen, 
  onClose, 
  onAchievementAdded,
  editingAchievement 
}: AddAchievementDialogProps) => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    achievement_type: '',
    title: '',
    description: '',
    icon_name: 'trophy',
    badge_color: '#6E3482',
    is_featured: false
  });

  useEffect(() => {
    if (editingAchievement) {
      setFormData({
        achievement_type: editingAchievement.achievement_type,
        title: editingAchievement.title,
        description: editingAchievement.description || '',
        icon_name: editingAchievement.icon_name || 'trophy',
        badge_color: editingAchievement.badge_color,
        is_featured: editingAchievement.is_featured
      });
    } else {
      setFormData({
        achievement_type: '',
        title: '',
        description: '',
        icon_name: 'trophy',
        badge_color: '#6E3482',
        is_featured: false
      });
    }
  }, [editingAchievement, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsLoading(true);
    try {
      let result;
      if (editingAchievement) {
        result = await updateUserAchievement(editingAchievement.id, formData);
      } else {
        result = await addUserAchievement(user.id, formData);
      }

      if (result.success) {
        showNotification(
          editingAchievement ? 'Pencapaian berhasil diperbarui' : 'Pencapaian berhasil ditambahkan', 
          'success'
        );
        onAchievementAdded();
        onClose();
      } else {
        showNotification('Gagal menyimpan pencapaian', 'error');
      }
    } catch (error) {
      showNotification('Gagal menyimpan pencapaian', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const achievementTypes = [
    { value: 'milestone', label: 'Milestone' },
    { value: 'skill', label: 'Keahlian' },
    { value: 'community', label: 'Komunitas' },
    { value: 'competition', label: 'Kompetisi' },
    { value: 'experience', label: 'Pengalaman' }
  ];

  const iconOptions = [
    { value: 'trophy', label: 'Trophy' },
    { value: 'star', label: 'Star' },
    { value: 'award', label: 'Award' },
    { value: 'target', label: 'Target' },
    { value: 'users', label: 'Users' },
    { value: 'cpu', label: 'Technology' },
    { value: 'zap', label: 'Lightning' }
  ];

  const colorOptions = [
    { value: '#6E3482', label: 'Purple' },
    { value: '#FFD700', label: 'Gold' },
    { value: '#A56ABD', label: 'Light Purple' },
    { value: '#49225B', label: 'Dark Purple' },
    { value: '#E70BEF', label: 'Pink' },
    { value: '#4CAF50', label: 'Green' },
    { value: '#2196F3', label: 'Blue' },
    { value: '#FF9800', label: 'Orange' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-[#F5EBFA] to-white border-[#A56ABD]/30">
        <DialogHeader>
          <DialogTitle className="text-[#49225B] text-xl font-bold">
            {editingAchievement ? 'Edit Pencapaian' : 'Tambah Pencapaian Baru'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="achievement_type" className="text-[#6E3482] font-medium">
              Jenis Pencapaian
            </Label>
            <Select 
              value={formData.achievement_type} 
              onValueChange={(value) => setFormData(prev => ({...prev, achievement_type: value}))}
            >
              <SelectTrigger className="border-[#A56ABD]/30 focus:border-[#6E3482]">
                <SelectValue placeholder="Pilih jenis pencapaian" />
              </SelectTrigger>
              <SelectContent>
                {achievementTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#6E3482] font-medium">
              Judul
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
              placeholder="Masukkan judul pencapaian"
              className="border-[#A56ABD]/30 focus:border-[#6E3482]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#6E3482] font-medium">
              Deskripsi
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              placeholder="Deskripsi pencapaian (opsional)"
              className="border-[#A56ABD]/30 focus:border-[#6E3482] min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon_name" className="text-[#6E3482] font-medium">
                Ikon
              </Label>
              <Select 
                value={formData.icon_name} 
                onValueChange={(value) => setFormData(prev => ({...prev, icon_name: value}))}
              >
                <SelectTrigger className="border-[#A56ABD]/30 focus:border-[#6E3482]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      {icon.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="badge_color" className="text-[#6E3482] font-medium">
                Warna Badge
              </Label>
              <Select 
                value={formData.badge_color} 
                onValueChange={(value) => setFormData(prev => ({...prev, badge_color: value}))}
              >
                <SelectTrigger className="border-[#A56ABD]/30 focus:border-[#6E3482]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.value }}
                        />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => setFormData(prev => ({...prev, is_featured: checked}))}
            />
            <Label htmlFor="is_featured" className="text-[#6E3482] font-medium">
              Jadikan pencapaian unggulan
            </Label>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#A56ABD] text-[#6E3482] hover:bg-[#F5EBFA]"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.achievement_type || !formData.title}
              className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white"
            >
              {isLoading ? 'Menyimpan...' : editingAchievement ? 'Perbarui' : 'Tambah'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
