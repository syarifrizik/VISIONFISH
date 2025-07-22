
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Fish, Loader2, MapPin, Clock, Scale, Ruler } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface AddFishCatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCatchAdded: () => void;
}

const AddFishCatchDialog = ({
  open,
  onOpenChange,
  onCatchAdded
}: AddFishCatchDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    species_name: '',
    weight_kg: '',
    length_cm: '',
    location: '',
    fishing_method: '',
    bait_used: '',
    notes: '',
    catch_time: '',
    weather_condition: 'Cerah',
    is_released: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('fish_catches')
        .insert({
          user_id: user.id,
          species_name: formData.species_name,
          weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
          length_cm: formData.length_cm ? parseFloat(formData.length_cm) : null,
          location: formData.location,
          fishing_method: formData.fishing_method,
          bait_used: formData.bait_used,
          notes: formData.notes,
          catch_time: formData.catch_time || null,
          weather_condition: formData.weather_condition,
          is_released: formData.is_released
        });

      if (error) throw error;

      toast({
        title: "🎣 Tangkapan Berhasil Ditambahkan!",
        description: `${formData.species_name} telah disimpan ke riwayat tangkapan Anda`,
      });
      
      onCatchAdded();
      onOpenChange(false);
      setFormData({
        species_name: '',
        weight_kg: '',
        length_cm: '',
        location: '',
        fishing_method: '',
        bait_used: '',
        notes: '',
        catch_time: '',
        weather_condition: 'Cerah',
        is_released: false
      });
    } catch (error) {
      console.error('Error adding fish catch:', error);
      toast({
        title: "❌ Gagal Menambahkan Tangkapan",
        description: "Terjadi kesalahan saat menyimpan data tangkapan",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-[#A56ABD]/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#6E3482]">
            <Fish className="w-5 h-5" />
            Tambah Tangkapan Baru
          </DialogTitle>
        </DialogHeader>
        
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label htmlFor="species_name" className="text-gray-700 dark:text-gray-300">
                Nama Ikan *
              </Label>
              <Input
                id="species_name"
                required
                value={formData.species_name}
                onChange={(e) => setFormData(prev => ({ ...prev, species_name: e.target.value }))}
                placeholder="Contoh: Tongkol, Tenggiri"
                className="border-[#A56ABD]/30 focus:border-[#6E3482]"
              />
            </div>
            
            <div>
              <Label htmlFor="weight_kg" className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <Scale className="w-3 h-3" />
                Berat (kg)
              </Label>
              <Input
                id="weight_kg"
                type="number"
                step="0.1"
                value={formData.weight_kg}
                onChange={(e) => setFormData(prev => ({ ...prev, weight_kg: e.target.value }))}
                placeholder="5.2"
                className="border-[#A56ABD]/30 focus:border-[#6E3482]"
              />
            </div>
            
            <div>
              <Label htmlFor="length_cm" className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <Ruler className="w-3 h-3" />
                Panjang (cm)
              </Label>
              <Input
                id="length_cm"
                type="number"
                value={formData.length_cm}
                onChange={(e) => setFormData(prev => ({ ...prev, length_cm: e.target.value }))}
                placeholder="45"
                className="border-[#A56ABD]/30 focus:border-[#6E3482]"
              />
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="location" className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Lokasi
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Selat Karimata"
                className="border-[#A56ABD]/30 focus:border-[#6E3482]"
              />
            </div>
            
            <div>
              <Label htmlFor="fishing_method" className="text-gray-700 dark:text-gray-300">
                Metode
              </Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, fishing_method: value }))}>
                <SelectTrigger className="border-[#A56ABD]/30 focus:border-[#6E3482]">
                  <SelectValue placeholder="Pilih metode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Jaring">Jaring</SelectItem>
                  <SelectItem value="Pancing">Pancing</SelectItem>
                  <SelectItem value="Rawai">Rawai</SelectItem>
                  <SelectItem value="Pukat">Pukat</SelectItem>
                  <SelectItem value="Bubu">Bubu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="bait_used" className="text-gray-700 dark:text-gray-300">
                Umpan
              </Label>
              <Input
                id="bait_used"
                value={formData.bait_used}
                onChange={(e) => setFormData(prev => ({ ...prev, bait_used: e.target.value }))}
                placeholder="Cacing, Udang"
                className="border-[#A56ABD]/30 focus:border-[#6E3482]"
              />
            </div>
            
            <div>
              <Label htmlFor="catch_time" className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Waktu
              </Label>
              <Input
                id="catch_time"
                type="time"
                value={formData.catch_time}
                onChange={(e) => setFormData(prev => ({ ...prev, catch_time: e.target.value }))}
                className="border-[#A56ABD]/30 focus:border-[#6E3482]"
              />
            </div>
            
            <div>
              <Label htmlFor="weather_condition" className="text-gray-700 dark:text-gray-300">
                Cuaca
              </Label>
              <Select value={formData.weather_condition} onValueChange={(value) => setFormData(prev => ({ ...prev, weather_condition: value }))}>
                <SelectTrigger className="border-[#A56ABD]/30 focus:border-[#6E3482]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cerah">Cerah</SelectItem>
                  <SelectItem value="Berawan">Berawan</SelectItem>
                  <SelectItem value="Hujan">Hujan</SelectItem>
                  <SelectItem value="Badai">Badai</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="notes" className="text-gray-700 dark:text-gray-300">
                Catatan
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Waktu: Subuh dan malam"
                className="border-[#A56ABD]/30 focus:border-[#6E3482] min-h-[60px]"
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1 border-[#A56ABD]/30"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.species_name}
              className="flex-1 bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Simpan Tangkapan'
              )}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFishCatchDialog;
