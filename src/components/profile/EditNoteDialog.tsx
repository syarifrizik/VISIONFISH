import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Save, X, Lock, Globe, Palette, Tag, Pin, Archive, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { useActivityTracking } from '@/hooks/useActivityTracking';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface Note {
  id: string;
  title: string;
  content: string | null;
  category: string;
  color: string | null;
  is_pinned: boolean;
  is_archived: boolean;
  is_private: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface EditNoteDialogProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onNoteUpdated: () => void;
}

const EditNoteDialog = ({ note, isOpen, onClose, onNoteUpdated }: EditNoteDialogProps) => {
  const { showNotification } = useNotifications();
  const { trackNoteCreationActivity } = useActivityTracking();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'personal',
    color: '#6366f1',
    is_private: false,
    is_pinned: false,
    is_archived: false
  });

  const categories = [
    { value: 'personal', label: 'Personal', icon: '💭', color: 'from-pink-400 to-rose-500' },
    { value: 'fishing', label: 'Memancing', icon: '🎣', color: 'from-blue-400 to-cyan-500' },
    { value: 'technique', label: 'Teknik', icon: '⚙️', color: 'from-orange-400 to-red-500' },
    { value: 'equipment', label: 'Peralatan', icon: '🎯', color: 'from-purple-400 to-violet-500' },
    { value: 'location', label: 'Lokasi', icon: '📍', color: 'from-green-400 to-emerald-500' },
    { value: 'tips', label: 'Tips', icon: '💡', color: 'from-yellow-400 to-orange-500' },
    { value: 'recipes', label: 'Resep', icon: '🍽️', color: 'from-pink-400 to-rose-500' }
  ];

  const colorPresets = [
    { name: 'Indigo', value: '#6366f1', class: 'bg-indigo-500' },
    { name: 'Blue', value: '#3b82f6', class: 'bg-blue-500' },
    { name: 'Green', value: '#10b981', class: 'bg-emerald-500' },
    { name: 'Yellow', value: '#f59e0b', class: 'bg-amber-500' },
    { name: 'Red', value: '#ef4444', class: 'bg-red-500' },
    { name: 'Purple', value: '#8b5cf6', class: 'bg-violet-500' },
    { name: 'Pink', value: '#ec4899', class: 'bg-pink-500' },
    { name: 'Orange', value: '#f97316', class: 'bg-orange-500' }
  ];

  useEffect(() => {
    if (note) {
      console.log('EditNoteDialog: Setting form data from note:', {
        title: note.title,
        is_private: note.is_private,
        note_data: note
      });
      
      setFormData({
        title: note.title || '',
        content: note.content || '',
        category: note.category || 'personal',
        color: note.color || '#6366f1',
        is_private: Boolean(note.is_private),
        is_pinned: Boolean(note.is_pinned),
        is_archived: Boolean(note.is_archived)
      });
    }
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note?.id || !formData.title.trim()) return;

    setIsLoading(true);
    try {
      console.log('EditNoteDialog: Submitting form with data:', formData);
      console.log('EditNoteDialog: Privacy setting being saved:', formData.is_private);
      
      const updateData = {
        title: formData.title.trim(),
        content: formData.content.trim() || null,
        category: formData.category,
        color: formData.color,
        is_private: formData.is_private,
        is_pinned: formData.is_pinned,
        is_archived: formData.is_archived,
        updated_at: new Date().toISOString()
      };

      console.log('EditNoteDialog: Update data being sent to database:', updateData);

      const { error } = await supabase
        .from('notes')
        .update(updateData)
        .eq('id', note.id);

      if (error) {
        console.error('EditNoteDialog: Database error:', error);
        throw error;
      }

      console.log('EditNoteDialog: Note updated successfully in database');

      // Track activity untuk note update
      await trackNoteCreationActivity(note.id, formData.title.trim());

      showNotification('Catatan berhasil diperbarui', 'success');
      
      // Close dialog first for immediate feedback
      onClose();
      
      // Then trigger refresh - this will make the updated note appear immediately
      setTimeout(() => {
        onNoteUpdated();
      }, 100);
      
    } catch (error) {
      console.error('Error updating note:', error);
      showNotification('Gagal memperbarui catatan', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacyToggle = (checked: boolean) => {
    console.log('EditNoteDialog: Privacy toggle changed to:', checked);
    setFormData(prev => {
      const newData = { ...prev, is_private: checked };
      console.log('EditNoteDialog: New form data after privacy toggle:', newData);
      return newData;
    });
  };

  if (!note) return null;

  const selectedCategory = categories.find(cat => cat.value === formData.category);
  const wordCount = (formData.content || '').split(/\s+/).filter(word => word.length > 0).length;
  const charCount = (formData.content || '').length;
  
  const hasChanges = 
    formData.title !== note.title ||
    formData.content !== (note.content || '') ||
    formData.category !== note.category ||
    formData.color !== note.color ||
    formData.is_private !== note.is_private ||
    formData.is_pinned !== note.is_pinned ||
    formData.is_archived !== note.is_archived;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 max-h-[90vh] overflow-y-auto shadow-2xl">
        <DialogHeader className="border-b border-white/10 dark:border-gray-700/10 pb-4">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <div>
              <div>Edit Catatan</div>
              <div className="flex items-center gap-4 text-sm font-normal text-gray-600 dark:text-gray-400 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Dibuat {formatDistanceToNow(new Date(note.created_at), { addSuffix: true, locale: id })}
                </span>
                {note.updated_at !== note.created_at && (
                  <span>
                    • Diubah {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true, locale: id })}
                  </span>
                )}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 py-6"
        >
          {/* Title Section */}
          <div className="space-y-3">
            <Label htmlFor="title" className="text-base font-semibold flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Judul Catatan *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Masukkan judul yang menarik..."
              className="text-lg font-medium bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30 rounded-xl focus:ring-2 focus:ring-orange-500/20"
              required
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Tips: Gunakan judul yang deskriptif dan mudah dicari</span>
              <span>{formData.title.length}/100</span>
            </div>
          </div>

          {/* Category and Color Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div className="space-y-3">
              <Label htmlFor="category" className="text-base font-semibold">
                Kategori
              </Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-white/20 dark:border-gray-700/20">
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center text-sm`}>
                          {category.icon}
                        </div>
                        <span className="font-medium">{category.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCategory && (
                <Badge className={`bg-gradient-to-r ${selectedCategory.color} text-white border-0`}>
                  <span className="mr-1">{selectedCategory.icon}</span>
                  {selectedCategory.label}
                </Badge>
              )}
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Warna Catatan
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {colorPresets.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                    className={`w-full h-10 rounded-lg ${color.class} border-2 transition-all duration-200 hover:scale-105 ${
                      formData.color === color.value 
                        ? 'border-gray-800 dark:border-white ring-2 ring-gray-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-3">
            <Label htmlFor="content" className="text-base font-semibold">
              Isi Catatan *
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Tulis catatan Anda di sini..."
              className="bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30 rounded-xl min-h-[150px] resize-none focus:ring-2 focus:ring-orange-500/20"
              required
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex gap-4">
                <span>{wordCount} kata</span>
                <span>{charCount} karakter</span>
              </div>
              <span>{charCount}/2000</span>
            </div>
          </div>

          {/* Privacy Settings */}
          <motion.div 
            className="space-y-4 p-6 bg-gradient-to-br from-blue-50/50 to-purple-50/30 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-white/30 dark:border-gray-700/30"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Pengaturan Privasi
            </h4>
            
            <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                {formData.is_private ? (
                  <Lock className="w-5 h-5 text-red-500" />
                ) : (
                  <Globe className="w-5 h-5 text-green-500" />
                )}
                <div>
                  <Label className="font-medium">
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
                onCheckedChange={handlePrivacyToggle}
              />
            </div>
          </motion.div>

          {/* Options Section */}
          <motion.div 
            className="space-y-4 p-6 bg-gradient-to-br from-orange-50/50 to-red-50/30 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-white/30 dark:border-gray-700/30"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Opsi Catatan
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Pin className="w-5 h-5 text-orange-500" />
                  <div>
                    <Label htmlFor="pin" className="font-medium">Sematkan</Label>
                    <p className="text-xs text-gray-500">Tampilkan di atas daftar</p>
                  </div>
                </div>
                <Switch
                  id="pin"
                  checked={formData.is_pinned}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_pinned: checked }))}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Archive className="w-5 h-5 text-gray-500" />
                  <div>
                    <Label htmlFor="archive" className="font-medium">Arsipkan</Label>
                    <p className="text-xs text-gray-500">Sembunyikan dari tampilan utama</p>
                  </div>
                </div>
                <Switch
                  id="archive"
                  checked={formData.is_archived}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_archived: checked }))}
                />
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-white/10 dark:border-gray-700/10">
            <Button 
              type="button"
              onClick={onClose}
              variant="outline" 
              className="flex-1 rounded-xl border-white/30 dark:border-gray-700/30"
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl shadow-lg"
              disabled={isLoading || !formData.title.trim() || !formData.content.trim() || !hasChanges}
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </div>
              ) : (
                'Simpan Perubahan'
              )}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};

export default EditNoteDialog;
