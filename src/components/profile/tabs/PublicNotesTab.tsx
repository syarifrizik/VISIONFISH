
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { notesService, Note } from '@/services/notesService';
import { useToast } from '@/hooks/use-toast';
import { Search, StickyNote, FileText, Calendar, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface PublicNotesTabProps {
  userId: string;
  userName?: string;
}

const PublicNotesTab = ({ userId, userName }: PublicNotesTabProps) => {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPublicNotes();
  }, [userId]);

  const loadPublicNotes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await notesService.fetchPublicNotes(userId);
      
      if (error) {
        throw new Error(error);
      }

      setNotes(data || []);
    } catch (error) {
      console.error('Error loading public notes:', error);
      toast({
        title: "❌ Gagal Memuat Catatan",
        description: "Tidak dapat memuat catatan publik pengguna",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter notes based on search query
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    
    const query = searchQuery.toLowerCase();
    return notes.filter(note =>
      note.title.toLowerCase().includes(query) ||
      (note.content || '').toLowerCase().includes(query) ||
      note.category.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

  const getCategoryInfo = (category: string) => {
    const categoryMap: Record<string, { icon: string; color: string; label: string }> = {
      fishing: { icon: '🎣', color: 'bg-blue-100 text-blue-800', label: 'Memancing' },
      technique: { icon: '⚙️', color: 'bg-orange-100 text-orange-800', label: 'Teknik' },
      location: { icon: '📍', color: 'bg-green-100 text-green-800', label: 'Lokasi' },
      equipment: { icon: '🎯', color: 'bg-purple-100 text-purple-800', label: 'Peralatan' },
      personal: { icon: '💭', color: 'bg-gray-100 text-gray-800', label: 'Personal' },
    };
    
    return categoryMap[category] || { icon: '📝', color: 'bg-gray-100 text-gray-800', label: category };
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Catatan Publik</h3>
        </div>
        
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-white/10 backdrop-blur-xl border-white/20 animate-pulse">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="h-4 bg-white/20 rounded w-3/4" />
                  <div className="h-3 bg-white/20 rounded w-1/2" />
                  <div className="space-y-2">
                    <div className="h-3 bg-white/20 rounded" />
                    <div className="h-3 bg-white/20 rounded w-5/6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <StickyNote className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Catatan Publik</h3>
            <p className="text-sm text-white/70">
              {userName ? `Catatan dari ${userName}` : 'Catatan yang dibagikan oleh pengguna ini'}
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-white/10 text-white">
          {notes.length} catatan
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari catatan..."
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
        />
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white/50" />
          </div>
          <h4 className="text-lg font-medium text-white mb-2">
            {searchQuery ? 'Tidak ada hasil' : 'Belum ada catatan publik'}
          </h4>
          <p className="text-white/60">
            {searchQuery 
              ? 'Coba kata kunci lain untuk mencari catatan'
              : 'Pengguna ini belum membagikan catatan secara publik'
            }
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {filteredNotes.map((note, index) => {
            const categoryInfo = getCategoryInfo(note.category);
            
            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-lg line-clamp-2">
                            {note.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge 
                              variant="secondary" 
                              className={`${categoryInfo.color} text-xs`}
                            >
                              <span className="mr-1">{categoryInfo.icon}</span>
                              {categoryInfo.label}
                            </Badge>
                            {note.is_pinned && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                                📌 Disematkan
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      {note.content && (
                        <div className="prose prose-sm prose-invert max-w-none">
                          <p className="text-white/80 leading-relaxed line-clamp-3">
                            {note.content}
                          </p>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <div className="flex items-center gap-4 text-xs text-white/50">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {formatDistanceToNow(new Date(note.created_at), { 
                                addSuffix: true, 
                                locale: idLocale 
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>Publik</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PublicNotesTab;
