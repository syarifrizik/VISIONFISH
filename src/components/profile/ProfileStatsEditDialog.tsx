
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { updateUserProfileStats, UserProfileStats } from '@/services/profileStatsService';

interface ProfileStatsEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserProfileStats | null;
  onStatsUpdated: () => void;
}

export const ProfileStatsEditDialog = ({ 
  isOpen, 
  onClose, 
  stats,
  onStatsUpdated 
}: ProfileStatsEditDialogProps) => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    job_title: '',
    company: '',
    experience_years: 0,
    specialization: '',
    total_catch: 0,
    monthly_catch_increase: 0,
    achievements_count: 0,
    new_achievements: 0,
    followers_count: 0,
    weekly_followers_increase: 0,
    user_rating: 0,
    total_reviews: 0,
    active_days: 0,
    trend_score: 0,
    trend_change: 0,
    location: '',
    bio: '',
    website_url: ''
  });

  useEffect(() => {
    if (stats) {
      setFormData({
        job_title: stats.job_title || '',
        company: stats.company || '',
        experience_years: stats.experience_years || 0,
        specialization: stats.specialization || '',
        total_catch: stats.total_catch || 0,
        monthly_catch_increase: stats.monthly_catch_increase || 0,
        achievements_count: stats.achievements_count || 0,
        new_achievements: stats.new_achievements || 0,
        followers_count: stats.followers_count || 0,
        weekly_followers_increase: stats.weekly_followers_increase || 0,
        user_rating: stats.user_rating || 0,
        total_reviews: stats.total_reviews || 0,
        active_days: stats.active_days || 0,
        trend_score: stats.trend_score || 0,
        trend_change: stats.trend_change || 0,
        location: stats.location || '',
        bio: stats.bio || '',
        website_url: stats.website_url || ''
      });
    }
  }, [stats, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const result = await updateUserProfileStats(user.id, formData);

      if (result.success) {
        showNotification('Statistik profil berhasil diperbarui', 'success');
        onStatsUpdated();
        onClose();
      } else {
        showNotification('Gagal memperbarui statistik profil', 'error');
      }
    } catch (error) {
      showNotification('Gagal memperbarui statistik profil', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-gradient-to-br from-[#F5EBFA] to-white border-[#A56ABD]/30">
        <DialogHeader>
          <DialogTitle className="text-[#49225B] text-xl font-bold">
            Tambah Statistik Profil
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#6E3482] border-b border-[#A56ABD]/30 pb-2">
              Informasi Profesional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job_title" className="text-[#6E3482] font-medium">
                  Pekerjaan
                </Label>
                <Input
                  id="job_title"
                  value={formData.job_title}
                  onChange={(e) => handleInputChange('job_title', e.target.value)}
                  placeholder="Posisi/jabatan Anda"
                  className="border-[#A56ABD]/30 focus:border-[#6E3482] bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-[#6E3482] font-medium">
                  Perusahaan
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Nama perusahaan"
                  className="border-[#A56ABD]/30 focus:border-[#6E3482] bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience_years" className="text-[#6E3482] font-medium">
                  Pengalaman (tahun)
                </Label>
                <Input
                  id="experience_years"
                  type="number"
                  value={formData.experience_years}
                  onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="border-[#A56ABD]/30 focus:border-[#6E3482] bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization" className="text-[#6E3482] font-medium">
                  Spesialisasi
                </Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  placeholder="Bidang keahlian"
                  className="border-[#A56ABD]/30 focus:border-[#6E3482] bg-white"
                />
              </div>
            </div>
          </div>

          {/* Fishing Statistics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#6E3482] border-b border-[#A56ABD]/30 pb-2">
              Statistik Fishing
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total_catch" className="text-[#6E3482] font-medium text-sm">
                  Total Tangkapan
                </Label>
                <Input
                  id="total_catch"
                  type="number"
                  value={formData.total_catch}
                  onChange={(e) => handleInputChange('total_catch', parseInt(e.target.value) || 0)}
                  className="border-[#A56ABD]/30 focus:border-[#6E3482] bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly_catch_increase" className="text-[#6E3482] font-medium text-sm">
                  Peningkatan Bulanan
                </Label>
                <Input
                  id="monthly_catch_increase"
                  type="number"
                  value={formData.monthly_catch_increase}
                  onChange={(e) => handleInputChange('monthly_catch_increase', parseInt(e.target.value) || 0)}
                  className="border-[#A56ABD]/30 focus:border-[#6E3482] bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="followers_count" className="text-[#6E3482] font-medium text-sm">
                  Followers
                </Label>
                <Input
                  id="followers_count"
                  type="number"
                  value={formData.followers_count}
                  onChange={(e) => handleInputChange('followers_count', parseInt(e.target.value) || 0)}
                  className="border-[#A56ABD]/30 focus:border-[#6E3482] bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user_rating" className="text-[#6E3482] font-medium text-sm">
                  Rating (1-5)
                </Label>
                <Input
                  id="user_rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.user_rating}
                  onChange={(e) => handleInputChange('user_rating', parseFloat(e.target.value) || 0)}
                  className="border-[#A56ABD]/30 focus:border-[#6E3482] bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_reviews" className="text-[#6E3482] font-medium text-sm">
                  Total Reviews
                </Label>
                <Input
                  id="total_reviews"
                  type="number"
                  value={formData.total_reviews}
                  onChange={(e) => handleInputChange('total_reviews', parseInt(e.target.value) || 0)}
                  className="border-[#A56ABD]/30 focus:border-[#6E3482] bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="active_days" className="text-[#6E3482] font-medium text-sm">
                  Hari Aktif
                </Label>
                <Input
                  id="active_days"
                  type="number"
                  value={formData.active_days}
                  onChange={(e) => handleInputChange('active_days', parseInt(e.target.value) || 0)}
                  className="border-[#A56ABD]/30 focus:border-[#6E3482] bg-white"
                />
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#6E3482] border-b border-[#A56ABD]/30 pb-2">
              Informasi Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-[#6E3482] font-medium">
                  Lokasi
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Kota, Negara"
                  className="border-[#A56ABD]/30 focus:border-[#6E3482] bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website_url" className="text-[#6E3482] font-medium">
                  Website
                </Label>
                <Input
                  id="website_url"
                  value={formData.website_url}
                  onChange={(e) => handleInputChange('website_url', e.target.value)}
                  placeholder="https://website.com"
                  className="border-[#A56ABD]/30 focus:border-[#6E3482] bg-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-[#6E3482] font-medium">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Ceritakan tentang diri Anda..."
                className="border-[#A56ABD]/30 focus:border-[#6E3482] min-h-[100px] bg-white"
              />
            </div>
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
              disabled={isLoading}
              className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Statistik'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
