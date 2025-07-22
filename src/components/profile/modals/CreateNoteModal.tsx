
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { FileText, Save, X, Sparkles, Pin, Archive, Palette, Tag } from 'lucide-react';

interface CreateNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateNote: (noteData: {
    title: string;
    content: string;
    category: string;
    is_pinned: boolean;
    is_archived: boolean;
    color?: string;
  }) => Promise<void>;
}

const CreateNoteModal = ({ open, onOpenChange, onCreateNote }: CreateNoteModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'personal',
    is_pinned: false,
    is_archived: false,
    color: '#6366f1'
  });

  const categories = [
    { value: 'personal', label: 'Personal', icon: '💭', color: 'from-pink-400 to-rose-500' },
    { value: 'fishing', label: 'Memancing', icon: '🎣', color: 'from-blue-400 to-cyan-500' },
    { value: 'technique', label: 'Teknik', icon: '⚙️', color: 'from-orange-400 to-red-500' },
    { value: 'equipment', label: 'Peralatan', icon: '🎯', color: 'from-purple-400 to-violet-500' },
    { value: 'location', label: 'Lokasi', icon: '📍', color: 'from-green-400 to-emerald-500' }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    setIsLoading(true);
    try {
      await onCreateNote(formData);
      // Reset form
      setFormData({
        title: '',
        content: '',
        category: 'personal',
        is_pinned: false,
        is_archived: false,
        color: '#6366f1'
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      // Reset form when closing
      setFormData({
        title: '',
        content: '',
        category: 'personal',
        is_pinned: false,
        is_archived: false,
        color: '#6366f1'
      });
    }
  };

  const selectedCategory = categories.find(cat => cat.value === formData.category);
  const wordCount = formData.content.split(/\s+/).filter(word => word.length > 0).length;
  const charCount = formData.content.length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 max-h-[90vh] overflow-y-auto shadow-2xl">
        <DialogHeader className="border-b border-white/10 dark:border-gray-700/10 pb-4">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                Buat Catatan Baru
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-sm font-normal text-gray-600 dark:text-gray-400 mt-1">
                Simpan ide dan pemikiran Anda dengan mudah
              </p>
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
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Masukkan judul yang menarik..."
              className="text-lg font-medium bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30 rounded-xl focus:ring-2 focus:ring-blue-500/20"
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
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
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
                    onClick={() => setFormData({ ...formData, color: color.value })}
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
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Tulis catatan Anda di sini... Anda bisa menambahkan detail, ide, atau apapun yang ingin Anda ingat."
              className="bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30 rounded-xl min-h-[150px] resize-none focus:ring-2 focus:ring-blue-500/20"
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

          {/* Options Section */}
          <motion.div 
            className="space-y-4 p-6 bg-gradient-to-br from-gray-50/50 to-blue-50/30 dark:from-gray-800/30 dark:to-blue-900/20 rounded-2xl border border-white/30 dark:border-gray-700/30"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
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
                  onCheckedChange={(checked) => setFormData({ ...formData, is_pinned: checked })}
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
                  onCheckedChange={(checked) => setFormData({ ...formData, is_archived: checked })}
                />
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-white/10 dark:border-gray-700/10">
            <Button 
              type="button"
              onClick={handleClose}
              variant="outline" 
              className="flex-1 rounded-xl border-white/30 dark:border-gray-700/30"
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg"
              disabled={isLoading || !formData.title.trim() || !formData.content.trim()}
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </div>
              ) : (
                'Buat Catatan'
              )}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteModal;
