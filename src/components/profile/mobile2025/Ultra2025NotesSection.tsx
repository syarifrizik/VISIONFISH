import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  Pin, 
  Calendar,
  Tag,
  Edit3,
  MoreVertical,
  Star,
  Archive
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useActivityTracking } from '@/hooks/useActivityTracking';

interface Note {
  id: string;
  title: string;
  content: string;
  category: 'technique' | 'location' | 'equipment' | 'experience' | 'tips' | 'personal';
  isPinned: boolean;
  createdAt: string;
  tags: string[];
  color: string;
  is_archived?: boolean;
  is_private?: boolean;
}

interface Ultra2025NotesSectionProps {
  userId: string;
}

const Ultra2025NotesSection = ({ userId }: Ultra2025NotesSectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { trackNoteCreationActivity } = useActivityTracking();

  // Fetch notes from Supabase
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        
        const { data: supabaseNotes, error } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform Supabase notes to our Note interface
        const transformedNotes: Note[] = supabaseNotes?.map(note => ({
          id: note.id,
          title: note.title,
          content: note.content || '',
          category: (note.category as any) || 'personal',
          isPinned: note.is_pinned || false,
          createdAt: note.created_at,
          tags: extractTags(note.content || ''),
          color: getCategoryColor(note.category || 'personal'),
          is_archived: note.is_archived,
          is_private: note.is_private
        })) || [];

        setNotes(transformedNotes);
      } catch (error) {
        console.error('Error fetching notes:', error);
        toast({
          title: "❌ Gagal Memuat Catatan",
          description: "Tidak dapat mengambil catatan dari database",
          variant: "destructive"
        });
        
        // Fallback to mock data
        setNotes(getMockNotes());
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchNotes();
    }
  }, [userId, toast]);

  const extractTags = (content: string): string[] => {
    const tagRegex = /#(\w+)/g;
    const matches = content.match(tagRegex);
    return matches ? matches.map(tag => tag.substring(1)) : [];
  };

  const getCategoryColor = (category: string): string => {
    const colors = {
      technique: 'from-blue-400 to-cyan-500',
      location: 'from-green-400 to-emerald-500',
      equipment: 'from-purple-400 to-pink-500',
      experience: 'from-orange-400 to-red-500',
      tips: 'from-yellow-400 to-orange-500',
      personal: 'from-gray-400 to-gray-500'
    };
    return colors[category as keyof typeof colors] || colors.personal;
  };

  const getMockNotes = (): Note[] => [
    {
      id: '1',
      title: 'Teknik Mancing Malam',
      content: 'Gunakan umpan hidup seperti cacing laut atau udang kecil. Lampu underwater sangat membantu menarik ikan...',
      category: 'technique',
      isPinned: true,
      createdAt: '2024-01-15',
      tags: ['malam', 'teknik', 'umpan'],
      color: 'from-blue-400 to-cyan-500'
    }
  ];

  const createNewNote = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: userId,
          title: 'Catatan Baru',
          content: 'Mulai menulis catatan Anda di sini...',
          category: 'personal',
          is_private: false
        })
        .select()
        .single();

      if (error) throw error;

      const newNote: Note = {
        id: data.id,
        title: data.title,
        content: data.content || '',
        category: 'personal',
        isPinned: false,
        createdAt: data.created_at,
        tags: [],
        color: getCategoryColor('personal')
      };

      setNotes([newNote, ...notes]);
      
      // Track activity for note creation
      await trackNoteCreationActivity(data.id, data.title);
      
      toast({
        title: "✨ Catatan Dibuat!",
        description: "Catatan baru berhasil dibuat",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "❌ Gagal Membuat Catatan",
        description: "Tidak dapat membuat catatan baru",
        variant: "destructive"
      });
    }
  };

  const categories = [
    { id: 'all', label: 'Semua', icon: BookOpen, color: 'text-white' },
    { id: 'technique', label: 'Teknik', icon: Star, color: 'text-blue-400' },
    { id: 'location', label: 'Lokasi', icon: Pin, color: 'text-green-400' },
    { id: 'equipment', label: 'Peralatan', icon: Tag, color: 'text-purple-400' },
    { id: 'experience', label: 'Pengalaman', icon: Calendar, color: 'text-orange-400' },
    { id: 'personal', label: 'Personal', icon: BookOpen, color: 'text-gray-400' }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technique': return Star;
      case 'location': return Pin;
      case 'equipment': return Tag;
      case 'experience': return Calendar;
      default: return BookOpen;
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    const notArchived = !note.is_archived;
    
    return matchesSearch && matchesCategory && notArchived;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-2xl rounded-3xl p-5 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-2xl" />
              <div className="flex-1">
                <div className="h-4 bg-white/20 rounded mb-2" />
                <div className="h-3 bg-white/20 rounded w-2/3" />
              </div>
            </div>
            <div className="h-20 bg-white/20 rounded-2xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Catatan Saya</h2>
          <p className="text-white/70 text-sm">
            {filteredNotes.length} catatan dari database
          </p>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={createNewNote}
          className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl"
        >
          <Plus className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Search & Filter */}
      <div className="space-y-4">
        {/* Search Bar */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          <input
            type="text"
            placeholder="Cari catatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-white/40"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center"
          >
            <Filter className="w-4 h-4 text-white/70" />
          </motion.button>
        </motion.div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isActive = selectedCategory === category.id;
            
            return (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  isActive 
                    ? 'bg-white/20 backdrop-blur-xl border border-white/30 text-white' 
                    : 'bg-white/10 backdrop-blur-sm border border-white/10 text-white/70'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : category.color}`} />
                {category.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="space-y-4">
        {filteredNotes.map((note, index) => {
          const CategoryIcon = getCategoryIcon(note.category);
          
          return (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Ultra Modern Note Card */}
              <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className={`absolute inset-0 bg-gradient-to-br ${note.color}/30`} />
                  <motion.div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_60%)]"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                </div>

                <div className="relative z-10 p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <motion.div
                        className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${note.color} flex items-center justify-center shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <CategoryIcon className="w-5 h-5 text-white" />
                      </motion.div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-white truncate">
                            {note.title}
                          </h3>
                          {note.isPinned && (
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Pin className="w-4 h-4 text-yellow-400 fill-current" />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-xs text-white/60">
                          {new Date(note.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                    >
                      <MoreVertical className="w-4 h-4 text-white/70" />
                    </motion.button>
                  </div>

                  {/* Content Preview */}
                  <p className="text-white/90 text-sm leading-relaxed mb-4 line-clamp-3">
                    {note.content}
                  </p>

                  {/* Tags */}
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {note.tags.map((tag, tagIndex) => (
                        <motion.span
                          key={tagIndex}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: tagIndex * 0.1 }}
                          className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white/80"
                        >
                          #{tag}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-xl"
                      >
                        <Edit3 className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-white">Edit</span>
                      </motion.button>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center"
                      >
                        <Archive className="w-4 h-4 text-white/70" />
                      </motion.button>
                      
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center"
                      >
                        <Star className="w-4 h-4 text-yellow-400" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <motion.div
            className="w-24 h-24 mx-auto bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-6"
            animate={{
              boxShadow: [
                '0 0 20px rgba(255, 255, 255, 0.1)',
                '0 0 40px rgba(255, 255, 255, 0.2)',
                '0 0 20px rgba(255, 255, 255, 0.1)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <BookOpen className="w-12 h-12 text-white/60" />
          </motion.div>
          <h3 className="text-xl font-bold text-white mb-2">
            {searchQuery ? 'Tidak Ditemukan' : 'Belum Ada Catatan'}
          </h3>
          <p className="text-white/70 mb-6 max-w-sm mx-auto">
            {searchQuery 
              ? `Tidak ditemukan catatan yang cocok dengan "${searchQuery}"`
              : 'Mulai dokumentasikan pengalaman memancing Anda dengan membuat catatan pertama'
            }
          </p>
          {!searchQuery && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={createNewNote}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl text-white font-semibold shadow-xl"
            >
              Buat Catatan Pertama
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Ultra2025NotesSection;
