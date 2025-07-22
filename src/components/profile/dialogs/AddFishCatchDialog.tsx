
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Fish } from 'lucide-react';

interface AddFishCatchDialogProps {
  onCatchAdded: () => void;
}

const AddFishCatchDialog = ({ onCatchAdded }: AddFishCatchDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    species_name: '',
    weight_kg: '',
    length_cm: '',
    location: '',
    bait_used: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "Anda harus login untuk menambah tangkapan",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('fish_catches')
        .insert({
          user_id: user.id,
          species_name: formData.species_name,
          weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
          length_cm: formData.length_cm ? parseFloat(formData.length_cm) : null,
          location: formData.location || null,
          bait_used: formData.bait_used || null,
          notes: formData.notes || null
        });

      if (error) throw error;

      toast({
        title: "Berhasil!",
        description: "Tangkapan ikan berhasil ditambahkan",
      });

      setFormData({
        species_name: '',
        weight_kg: '',
        length_cm: '',
        location: '',
        bait_used: '',
        notes: ''
      });
      setOpen(false);
      onCatchAdded();
    } catch (error) {
      console.error('Error adding catch:', error);
      toast({
        title: "Error",
        description: "Gagal menambahkan tangkapan ikan",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg px-6 py-3">
          <Plus className="w-5 h-5 mr-2" />
          Tambah Tangkapan Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-blue-200/50 dark:border-blue-700/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-blue-900 dark:text-blue-100">
            <Fish className="w-6 h-6" />
            Tambah Tangkapan Baru
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="species_name" className="text-gray-700 dark:text-gray-300">Jenis Ikan *</Label>
            <Input
              id="species_name"
              value={formData.species_name}
              onChange={(e) => setFormData({ ...formData, species_name: e.target.value })}
              placeholder="Contoh: Ikan Bawal, Ikan Mas, dll"
              required
              className="bg-white/80 dark:bg-gray-800/80 border-blue-200 dark:border-blue-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight_kg" className="text-gray-700 dark:text-gray-300">Berat (kg)</Label>
              <Input
                id="weight_kg"
                type="number"
                step="0.1"
                value={formData.weight_kg}
                onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                placeholder="0.5"
                className="bg-white/80 dark:bg-gray-800/80 border-blue-200 dark:border-blue-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="length_cm" className="text-gray-700 dark:text-gray-300">Panjang (cm)</Label>
              <Input
                id="length_cm"
                type="number"
                step="0.1"
                value={formData.length_cm}
                onChange={(e) => setFormData({ ...formData, length_cm: e.target.value })}
                placeholder="25"
                className="bg-white/80 dark:bg-gray-800/80 border-blue-200 dark:border-blue-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-gray-700 dark:text-gray-300">Lokasi</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Danau Toba, Sungai Citarum, dll"
              className="bg-white/80 dark:bg-gray-800/80 border-blue-200 dark:border-blue-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bait_used" className="text-gray-700 dark:text-gray-300">Umpan yang Digunakan</Label>
            <Input
              id="bait_used"
              value={formData.bait_used}
              onChange={(e) => setFormData({ ...formData, bait_used: e.target.value })}
              placeholder="Cacing, Udang, Pelet, dll"
              className="bg-white/80 dark:bg-gray-800/80 border-blue-200 dark:border-blue-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-700 dark:text-gray-300">Catatan</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ceritakan pengalaman memancing Anda..."
              className="bg-white/80 dark:bg-gray-800/80 border-blue-200 dark:border-blue-700"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.species_name}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              {loading ? 'Menambahkan...' : 'Tambah Tangkapan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFishCatchDialog;
