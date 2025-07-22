
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
import { Switch } from '@/components/ui/switch';
import { StickyNote, Loader2, Palette, Lock, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface AddNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNoteAdded: () => void;
}

const AddNoteDialog = ({
  open,
  onOpenChange,
  onNoteAdded
}: AddNoteDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'personal',
    color: '#A56ABD',
    is_private: false
  });

  const colorOptions = [
    { value: '#A56ABD', label: 'Ungu', class: 'bg-[#A56ABD]' },
    { value: '#3B82F6', label: 'Biru', class: 'bg-blue-500' },
    { value: '#10B981', label: 'Hijau', class: 'bg-emerald-500' },
    { value: '#F59E0B', label: 'Kuning', class: 'bg-amber-500' },
    { value: '#EF4444', label: 'Merah', class: 'bg-red-500' },
    { value: '#8B5CF6', label: 'Violet', class: 'bg-violet-500' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title: formData.title,
          content: formData.content,
          category: formData.category,
          color: formData.color,
          is_private: formData.is_private
        });

      if (error) throw error;

      toast({
        title: "📝 Catatan Berhasil Ditambahkan!",
        description: `"${formData.title}" telah disimpan`,
      });
      
      onNoteAdded();
      onOpenChange(false);
      setFormData({
        title: '',
        content: '',
        category: 'personal',
        color: '#A56ABD',
        is_private: false
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: "❌ Gagal Menambahkan Catatan",
        description: "Terjadi kesalahan saat menyimpan catatan",
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
            <StickyNote className="w-5 h-5" />
            Tambah Catatan Baru
          </DialogTitle>
        </DialogHeader>
        
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">
                Judul Catatan *
              </Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Contoh: Tips Mancing di Laut"
                className="border-[#A56ABD]/30 focus:border-[#6E3482]"
              />
            </div>
            
            <div>
              <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">
                Kategori
              </Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="border-[#A56ABD]/30 focus:border-[#6E3482]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="fishing">Memancing</SelectItem>
                  <SelectItem value="technique">Teknik</SelectItem>
                  <SelectItem value="location">Lokasi</SelectItem>
                  <SelectItem value="equipment">Peralatan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <Palette className="w-3 h-3" />
                Warna
              </Label>
              <div className="flex gap-2 mt-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                    className={`w-8 h-8 rounded-full ${color.class} border-2 ${
                      formData.color === color.value ? 'border-gray-800 dark:border-white' : 'border-gray-300'
                    } hover:scale-110 transition-transform`}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="content" className="text-gray-700 dark:text-gray-300">
                Isi Catatan
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Tulis catatan Anda di sini..."
                className="border-[#A56ABD]/30 focus:border-[#6E3482] min-h-[100px]"
              />
            </div>

            {/* Privacy Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-[#A56ABD]/20">
              <div className="flex items-center gap-3">
                {formData.is_private ? (
                  <Lock className="w-4 h-4 text-orange-500" />
                ) : (
                  <Globe className="w-4 h-4 text-green-500" />
                )}
                <div>
                  <Label className="text-sm font-medium">
                    {formData.is_private ? 'Catatan Privat' : 'Catatan Publik'}
                  </Label>
                  <p className="text-xs text-gray-500">
                    {formData.is_private 
                      ? 'Hanya Anda yang bisa melihat catatan ini'
                      : 'Orang lain bisa melihat catatan ini di profil Anda'
                    }
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.is_private}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_private: checked }))}
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
              disabled={isLoading || !formData.title}
              className="flex-1 bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Simpan Catatan'
              )}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNoteDialog;
