import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Palette, MapPin, Tag, Lock, Globe, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Note {
  id?: string;
  title: string;
  content: string;
  category: string;
  is_pinned?: boolean;
  is_archived?: boolean;
  is_private?: boolean;
  color?: string;
  tags?: string[];
  location?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

interface ModernCreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: Partial<Note>) => Promise<boolean>;
  categories: string[];
  editingNote?: Note | null;
}

const ModernCreateNoteModal = ({
  isOpen,
  onClose,
  onSave,
  categories,
  editingNote
}: ModernCreateNoteModalProps) => {
  const [formData, setFormData] = useState<Partial<Note>>({
    title: '',
    content: '',
    category: 'personal',
    is_private: false,
    color: '#6E3482',
    tags: [],
    location: ''
  });
  
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Predefined colors for notes
  const noteColors = [
    { name: 'Purple', value: '#6E3482' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Teal', value: '#14B8A6' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Slate', value: '#64748B' }
  ];

  // Load editing note data
  useEffect(() => {
    if (editingNote) {
      setFormData({
        title: editingNote.title,
        content: editingNote.content,
        category: editingNote.category,
        is_private: editingNote.is_private || false,
        color: editingNote.color || '#6E3482',
        tags: editingNote.tags || [],
        location: editingNote.location || ''
      });
    } else {
      // Reset form for new note
      setFormData({
        title: '',
        content: '',
        category: 'personal',
        is_private: false,
        color: '#6E3482',
        tags: [],
        location: ''
      });
    }
  }, [editingNote, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    setIsSubmitting(true);
    try {
      const success = await onSave(formData);
      if (success) {
        handleClose();
      }
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      content: '',
      category: 'personal',
      is_private: false,
      color: '#6E3482',
      tags: [],
      location: ''
    });
    setTagInput('');
    setShowColorPicker(false);
    onClose();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const categoryIcons: Record<string, string> = {
    'fishing': '🎣',
    'technique': '⚙️',
    'location': '📍',
    'equipment': '🎯',
    'personal': '💭',
    'tips': '💡',
    'recipes': '🍽️'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              {/* Header */}
              <div className="relative p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {editingNote ? 'Edit Catatan' : 'Buat Catatan Baru'}
                    </h2>
                    <p className="text-white/60 text-sm">
                      {editingNote ? 'Perbarui catatan Anda' : 'Tulis ide dan pengalaman baru'}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Title */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Judul Catatan
                  </label>
                  <Input
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Masukkan judul catatan..."
                    className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white/40"
                    required
                  />
                </div>

                {/* Category and Privacy */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Kategori
                    </label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/10 backdrop-blur-xl border-white/20">
                        {categories.map((category) => (
                          <SelectItem 
                            key={category} 
                            value={category}
                            className="text-white hover:bg-white/10"
                          >
                            <span className="flex items-center gap-2">
                              <span>{categoryIcons[category] || '📄'}</span>
                              <span className="capitalize">{category}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Privasi
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData(prev => ({ ...prev, is_private: !prev.is_private }))}
                      className={`w-full justify-start ${
                        formData.is_private
                          ? 'bg-orange-500/20 border-orange-400/30 text-orange-400'
                          : 'bg-green-500/20 border-green-400/30 text-green-400'
                      }`}
                    >
                      {formData.is_private ? (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Privat
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4 mr-2" />
                          Publik
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Color Picker */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Warna Catatan
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className="border-white/20 text-white hover:bg-white/10"
                      style={{ backgroundColor: `${formData.color}20` }}
                    >
                      <Palette className="w-4 h-4 mr-2" />
                      <div 
                        className="w-4 h-4 rounded-full border border-white/30"
                        style={{ backgroundColor: formData.color }}
                      />
                    </Button>
                    {showColorPicker && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-wrap gap-2 p-3 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20"
                      >
                        {noteColors.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, color: color.value }));
                              setShowColorPicker(false);
                            }}
                            className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform ${
                              formData.color === color.value 
                                ? 'border-white' 
                                : 'border-white/30'
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Isi Catatan
                  </label>
                  <Textarea
                    value={formData.content || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Tulis catatan Anda di sini..."
                    className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white/40 min-h-[120px] resize-none"
                    rows={6}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Lokasi (Opsional)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                    <Input
                      value={formData.location || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Contoh: Danau Toba, Sumatera Utara"
                      className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white/40 pl-10"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Tags
                  </label>
                  <div className="space-y-3">
                    {/* Tag Input */}
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleTagInputKeyDown}
                          placeholder="Tambah tag..."
                          className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white/40 pl-10"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-400/30"
                      >
                        Tambah
                      </Button>
                    </div>

                    {/* Tag List */}
                    {formData.tags && formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-white/20 text-white/80 hover:bg-white/10 cursor-pointer"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            #{tag}
                            <X className="w-3 h-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Eye className="w-4 h-4" />
                    <span>
                      {formData.is_private ? 'Hanya Anda yang dapat melihat catatan ini' : 'Catatan akan terlihat publik'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleClose}
                      className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      disabled={!formData.title?.trim() || isSubmitting}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {editingNote ? 'Memperbarui...' : 'Menyimpan...'}
                        </div>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {editingNote ? 'Perbarui' : 'Simpan'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Color Border Effect */}
            <div 
              className="absolute inset-0 rounded-3xl opacity-5 pointer-events-none"
              style={{ 
                background: `linear-gradient(135deg, ${formData.color}40, transparent)` 
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModernCreateNoteModal;
