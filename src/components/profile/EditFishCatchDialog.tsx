
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Upload, MapPin, Calendar, Weight, Ruler, Clock, Fish } from 'lucide-react';
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
import { updateFishCatch } from '@/services/fishCatchesService';

interface FishCatch {
  id: string;
  species_name: string;
  weight_kg?: number;
  length_cm?: number;
  location?: string;
  catch_time?: string;
  image_urls?: string[];
  notes?: string;
  is_released: boolean;
  is_record: boolean;
  fishing_method?: string;
  bait_used?: string;
  weather_condition?: string;
  is_private?: boolean;
}

interface EditFishCatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catchData: FishCatch | null;
  onCatchUpdated: () => void;
}

const EditFishCatchDialog = ({ open, onOpenChange, catchData, onCatchUpdated }: EditFishCatchDialogProps) => {
  const { showNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    species_name: '',
    weight_kg: '',
    length_cm: '',
    location: '',
    catch_time: '',
    notes: '',
    fishing_method: '',
    bait_used: '',
    weather_condition: '',
    is_released: false,
    is_record: false,
    is_private: false,
    image_urls: [] as string[]
  });

  useEffect(() => {
    if (catchData) {
      setFormData({
        species_name: catchData.species_name || '',
        weight_kg: catchData.weight_kg?.toString() || '',
        length_cm: catchData.length_cm?.toString() || '',
        location: catchData.location || '',
        catch_time: catchData.catch_time || '',
        notes: catchData.notes || '',
        fishing_method: catchData.fishing_method || '',
        bait_used: catchData.bait_used || '',
        weather_condition: catchData.weather_condition || '',
        is_released: catchData.is_released || false,
        is_record: catchData.is_record || false,
        is_private: catchData.is_private || false,
        image_urls: catchData.image_urls || []
      });
    }
  }, [catchData]);

  const handleSave = async () => {
    if (!catchData) return;

    if (!formData.species_name.trim()) {
      showNotification('Nama spesies harus diisi', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const updateData = {
        species_name: formData.species_name.trim(),
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        length_cm: formData.length_cm ? parseFloat(formData.length_cm) : null,
        location: formData.location.trim() || null,
        catch_time: formData.catch_time || null,
        notes: formData.notes.trim() || null,
        fishing_method: formData.fishing_method.trim() || null,
        bait_used: formData.bait_used.trim() || null,
        weather_condition: formData.weather_condition || null,
        is_released: formData.is_released,
        is_record: formData.is_record,
        is_private: formData.is_private,
        image_urls: formData.image_urls.filter(url => url.trim())
      };

      const result = await updateFishCatch(catchData.id, updateData);
      if (result.success) {
        showNotification('Tangkapan berhasil diperbarui', 'success');
        onCatchUpdated();
      } else {
        showNotification(result.error || 'Gagal memperbarui tangkapan', 'error');
      }
    } catch (error) {
      console.error('Error updating catch:', error);
      showNotification('Terjadi kesalahan saat memperbarui', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const addImageUrl = () => {
    setFormData(prev => ({
      ...prev,
      image_urls: [...prev.image_urls, '']
    }));
  };

  const updateImageUrl = (index: number, url: string) => {
    setFormData(prev => ({
      ...prev,
      image_urls: prev.image_urls.map((item, i) => i === index ? url : item)
    }));
  };

  const removeImageUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-gradient-to-br from-[#1a1a2e] to-[#2d1b69] border-[#A56ABD]/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#F5EBFA] flex items-center gap-2">
            <Fish className="w-5 h-5 text-[#A56ABD]" />
            Edit Tangkapan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Species Name */}
          <div className="space-y-2">
            <Label htmlFor="species_name" className="text-sm font-medium text-[#E7D7EF]">
              Nama Spesies *
            </Label>
            <Input
              id="species_name"
              value={formData.species_name}
              onChange={(e) => setFormData(prev => ({ ...prev, species_name: e.target.value }))}
              placeholder="Contoh: Ikan Kakap Merah"
              className="bg-white/10 border-[#A56ABD]/30 text-white placeholder:text-gray-400"
            />
          </div>

          {/* Weight and Length */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm font-medium text-[#E7D7EF]">
                Berat (kg)
              </Label>
              <div className="relative">
                <Weight className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight_kg}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight_kg: e.target.value }))}
                  placeholder="0.0"
                  className="bg-white/10 border-[#A56ABD]/30 text-white placeholder:text-gray-400 pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="length" className="text-sm font-medium text-[#E7D7EF]">
                Panjang (cm)
              </Label>
              <div className="relative">
                <Ruler className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="length"
                  type="number"
                  step="0.1"
                  value={formData.length_cm}
                  onChange={(e) => setFormData(prev => ({ ...prev, length_cm: e.target.value }))}
                  placeholder="0.0"
                  className="bg-white/10 border-[#A56ABD]/30 text-white placeholder:text-gray-400 pl-10"
                />
              </div>
            </div>
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
                placeholder="Lokasi penangkapan"
                className="bg-white/10 border-[#A56ABD]/30 text-white placeholder:text-gray-400 pl-10"
              />
            </div>
          </div>

          {/* Catch Time */}
          <div className="space-y-2">
            <Label htmlFor="catch_time" className="text-sm font-medium text-[#E7D7EF]">
              Waktu Tangkap
            </Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="catch_time"
                type="time"
                value={formData.catch_time}
                onChange={(e) => setFormData(prev => ({ ...prev, catch_time: e.target.value }))}
                className="bg-white/10 border-[#A56ABD]/30 text-white pl-10"
              />
            </div>
          </div>

          {/* Fishing Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#E7D7EF]">
                Metode Memancing
              </Label>
              <Input
                value={formData.fishing_method}
                onChange={(e) => setFormData(prev => ({ ...prev, fishing_method: e.target.value }))}
                placeholder="Contoh: Casting, Trolling"
                className="bg-white/10 border-[#A56ABD]/30 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#E7D7EF]">
                Umpan yang Digunakan
              </Label>
              <Input
                value={formData.bait_used}
                onChange={(e) => setFormData(prev => ({ ...prev, bait_used: e.target.value }))}
                placeholder="Contoh: Udang, Cacing"
                className="bg-white/10 border-[#A56ABD]/30 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Weather Condition */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#E7D7EF]">
              Kondisi Cuaca
            </Label>
            <Select
              value={formData.weather_condition}
              onValueChange={(value) => setFormData(prev => ({ ...prev, weather_condition: value }))}
            >
              <SelectTrigger className="bg-white/10 border-[#A56ABD]/30 text-white">
                <SelectValue placeholder="Pilih kondisi cuaca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cerah">Cerah</SelectItem>
                <SelectItem value="berawan">Berawan</SelectItem>
                <SelectItem value="mendung">Mendung</SelectItem>
                <SelectItem value="hujan_ringan">Hujan Ringan</SelectItem>
                <SelectItem value="hujan_lebat">Hujan Lebat</SelectItem>
                <SelectItem value="berangin">Berangin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-[#E7D7EF]">
              Catatan
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Tambahkan catatan atau cerita tentang tangkapan ini..."
              className="bg-white/10 border-[#A56ABD]/30 text-white placeholder:text-gray-400 min-h-[80px]"
            />
          </div>

          {/* Image URLs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-[#E7D7EF]">
                URL Gambar
              </Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addImageUrl}
                className="border-[#A56ABD]/30 text-[#A56ABD] hover:bg-[#A56ABD]/20"
              >
                <Upload className="w-4 h-4 mr-2" />
                Tambah Gambar
              </Button>
            </div>
            {formData.image_urls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={url}
                  onChange={(e) => updateImageUrl(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="bg-white/10 border-[#A56ABD]/30 text-white placeholder:text-gray-400"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => removeImageUrl(index)}
                  className="border-red-400 text-red-400 hover:bg-red-500/20 px-3"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Status toggles */}
          <div className="space-y-4 pt-4 border-t border-[#A56ABD]/20">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-[#E7D7EF]">
                  Ikan Dilepas
                </Label>
                <p className="text-xs text-gray-400">
                  Tandai jika ikan ini dilepas kembali
                </p>
              </div>
              <Switch
                checked={formData.is_released}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_released: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-[#E7D7EF]">
                  Rekor Pribadi
                </Label>
                <p className="text-xs text-gray-400">
                  Tandai sebagai rekor pribadi Anda
                </p>
              </div>
              <Switch
                checked={formData.is_record}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_record: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-[#E7D7EF]">
                  Privat
                </Label>
                <p className="text-xs text-gray-400">
                  Hanya Anda yang dapat melihat tangkapan ini
                </p>
              </div>
              <Switch
                checked={formData.is_private}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_private: checked }))}
              />
            </div>
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
            disabled={isLoading || !formData.species_name.trim()}
            className="flex-1 bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Simpan Perubahan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditFishCatchDialog;
