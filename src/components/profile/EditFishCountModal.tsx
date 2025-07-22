
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
import { Fish, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EditFishCountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCount: number;
  userId: string;
  onCountUpdated: (newCount: number) => void;
}

const EditFishCountModal = ({
  open,
  onOpenChange,
  currentCount,
  userId,
  onCountUpdated
}: EditFishCountModalProps) => {
  const [fishCount, setFishCount] = useState(currentCount);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ fish_caught: fishCount })
        .eq('id', userId);

      if (error) throw error;

      onCountUpdated(fishCount);
      onOpenChange(false);
      
      toast({
        title: "🎣 Berhasil Diperbarui!",
        description: `Jumlah ikan ditangkap berhasil diperbarui menjadi ${fishCount}`,
      });
    } catch (error) {
      console.error('Error updating fish count:', error);
      toast({
        title: "❌ Gagal Memperbarui",
        description: "Terjadi kesalahan saat memperbarui jumlah ikan",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-[#A56ABD]/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#6E3482]">
            <Fish className="w-5 h-5" />
            Edit Jumlah Ikan
          </DialogTitle>
        </DialogHeader>
        
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-2">
            <Label htmlFor="fishCount" className="text-gray-700 dark:text-gray-300">
              Jumlah Ikan Ditangkap
            </Label>
            <Input
              id="fishCount"
              type="number"
              min="0"
              value={fishCount}
              onChange={(e) => setFishCount(Number(e.target.value))}
              className="border-[#A56ABD]/30 focus:border-[#6E3482]"
              disabled={isLoading}
            />
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
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Simpan'
              )}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFishCountModal;
