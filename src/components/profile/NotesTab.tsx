import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Search, Filter, StickyNote, Pin, Archive, Trash2, Edit3, Calendar, Tag, Grid, List, Star, Eye, ChevronRight, Clock, Bookmark } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNotesManagement } from '@/hooks/useNotesManagement';
import CreateNoteModal from './modals/CreateNoteModal';
import EditNoteModal from './modals/EditNoteModal';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface NotesTabProps {
  searchQuery?: string;
  viewMode?: 'grid' | 'list';
  onItemCountChange?: (count: number) => void;
}

const NotesTab = ({ searchQuery = '', viewMode = 'grid', onItemCountChange }: NotesTabProps) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [showArchived, setShowArchived] = useState(false);

  const {
    allNotes,
    isLoading,
    error,
    getFilteredNotes,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive
  } = useNotesManagement();

  // Get filtered notes using the hook's filtering function
  const filteredNotes = useMemo(() => {
    const filters: any = {};
    
    // Handle special categories
    if (activeFilter === 'pinned') {
      filters.category = 'pinned';
    } else if (activeFilter === 'archived') {
      filters.category = 'archived';
    } else if (activeFilter !== 'all') {
      filters.category = activeFilter;
    }
    
    // Add archived filter
    if (showArchived) {
      filters.isArchived = true;
    }
    
    // Add search query
    if (localSearchQuery.trim()) {
      filters.searchQuery = localSearchQuery.trim();
    }

    return getFilteredNotes(filters);
  }, [getFilteredNotes, activeFilter, showArchived, localSearchQuery]);

  // Sync with parent search query
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  // Update parent item count
  useEffect(() => {
    if (onItemCountChange) {
      onItemCountChange(filteredNotes.length);
    }
  }, [filteredNotes.length, onItemCountChange]);

  // Memoize categories to prevent recreation
  const categories = useMemo(() => [
    { value: 'all', label: 'Semua', icon: '📝', color: 'from-gray-400 to-gray-600' },
    { value: 'pinned', label: 'Disematkan', icon: '📌', color: 'from-orange-400 to-orange-600' },
    { value: 'archived', label: 'Diarsipkan', icon: '📦', color: 'from-gray-400 to-gray-600' },
    { value: 'fishing', label: 'Mancing', icon: '🎣', color: 'from-blue-400 to-cyan-600' },
    { value: 'technique', label: 'Teknik', icon: '⚙️', color: 'from-orange-400 to-red-600' },
    { value: 'location', label: 'Lokasi', icon: '📍', color: 'from-green-400 to-emerald-600' },
    { value: 'equipment', label: 'Peralatan', icon: '🎯', color: 'from-purple-400 to-violet-600' },
    { value: 'personal', label: 'Pribadi', icon: '💭', color: 'from-pink-400 to-rose-600' }
  ], []);

  const handleCreateNote = async (noteData: any) => {
    const success = await createNote(noteData);
    if (success) {
      setShowCreateModal(false);
    }
  };

  const handleEditNote = async (noteId: string, noteData: any) => {
    const success = await updateNote(noteId, noteData);
    if (success) {
      setShowEditModal(false);
      setSelectedNote(null);
    }
  };

  const handlePreviewNote = (note: any) => {
    setSelectedNote(note);
    setShowPreviewModal(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan ini?')) return;
    await deleteNote(noteId);
  };

  const handleTogglePin = async (noteId: string, isPinned: boolean) => {
    await togglePin(noteId, !isPinned);
  };

  const handleToggleArchive = async (noteId: string, isArchived: boolean) => {
    await toggleArchive(noteId, !isArchived);
  };

  // Simplified bulk actions - delete selected notes one by one
  const handleBulkAction = async (action: 'delete' | 'archive' | 'unarchive') => {
    if (selectedNotes.length === 0) return;

    for (const noteId of selectedNotes) {
      switch (action) {
        case 'delete':
          await deleteNote(noteId);
          break;
        case 'archive':
          await toggleArchive(noteId, true);
          break;
        case 'unarchive':
          await toggleArchive(noteId, false);
          break;
      }
    }
    setSelectedNotes([]);
  };

  const toggleNoteSelection = (noteId: string) => {
    setSelectedNotes(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <FileText className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Terjadi Kesalahan</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modern Header with Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 p-6 shadow-xl"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <StickyNote className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Catatan Saya
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {filteredNotes.length} catatan tersimpan
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Buat Catatan
            </Button>
            
            {selectedNotes.length > 0 && (
              <div className="flex gap-2">
                <Button
                  onClick={() => handleBulkAction('archive')}
                  variant="outline"
                  size="sm"
                >
                  <Archive className="w-4 h-4 mr-1" />
                  Arsip ({selectedNotes.length})
                </Button>
                <Button
                  onClick={() => handleBulkAction('delete')}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Hapus ({selectedNotes.length})
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="mt-6 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari catatan..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-10 bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30 rounded-xl"
            />
          </div>

          <div className="flex gap-2">
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-40 bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30 rounded-xl">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Loading State */}
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      ) : filteredNotes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/20 dark:to-pink-900/30 rounded-3xl flex items-center justify-center shadow-xl">
            <StickyNote className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {localSearchQuery ? 'Tidak ada catatan ditemukan' : 'Belum ada catatan'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {localSearchQuery 
              ? 'Coba ubah kata kunci pencarian atau buat catatan baru'
              : 'Mulai organisir pemikiran Anda dengan membuat catatan pertama'
            }
          </p>
          {!localSearchQuery && (
            <Button
              onClick={() => setShowCreateModal(true)}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Buat Catatan Pertama
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div
          className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredNotes.map((note, index) => {
              const category = categories.find(c => c.value === note.category) || categories[0];
              const isSelected = selectedNotes.includes(note.id);
              
              return (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ 
                    delay: index * 0.03,
                    duration: 0.2,
                    ease: "easeOut"
                  }}
                  whileHover={{ y: -2, scale: 1.01 }}
                  onClick={() => handlePreviewNote(note)}
                  className={`group cursor-pointer ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-white/30 dark:border-gray-700/30 overflow-hidden">
                    <CardContent className="p-0 h-full flex flex-col">
                      {/* Enhanced Color Strip */}
                      <div className={`h-1 bg-gradient-to-r ${category.color} relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                      </div>
                      
                      <div className="p-5 flex-1 flex flex-col">
                        {/* Title and Actions */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {note.is_pinned && (
                                <Pin className="w-4 h-4 text-orange-500 fill-current animate-pulse" />
                              )}
                              <h3 className="font-bold text-gray-900 dark:text-white truncate text-lg">
                                {note.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <span>{category.icon}</span>
                                {category.label}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDistanceToNow(new Date(note.created_at), { 
                                  addSuffix: true, 
                                  locale: id 
                                })}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTogglePin(note.id, note.is_pinned);
                              }}
                              className="h-8 w-8 p-0 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                            >
                              <Pin className={`w-3 h-3 ${note.is_pinned ? 'text-orange-500 fill-current' : 'text-gray-400'}`} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedNote(note);
                                setShowEditModal(true);
                              }}
                              className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                            >
                              <Edit3 className="w-3 h-3 text-gray-400 hover:text-blue-500" />
                            </Button>
                          </div>
                        </div>

                        {/* Content Preview */}
                        {note.content && (
                          <div className="mb-4 flex-1">
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4 leading-relaxed">
                              {note.content}
                            </p>
                          </div>
                        )}

                        {/* Enhanced Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                          <div className="flex gap-1">
                            {note.is_pinned && (
                              <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 border-orange-200">
                                <Star className="w-3 h-3 mr-1" />
                                Disematkan
                              </Badge>
                            )}
                            {note.is_archived && (
                              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                <Archive className="w-3 h-3 mr-1" />
                                Diarsipkan
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            {note.updated_at !== note.created_at && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Diubah
                              </div>
                            )}
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modals */}
      <CreateNoteModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateNote={handleCreateNote}
      />

      {selectedNote && (
        <EditNoteModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          note={selectedNote}
          onUpdateNote={handleEditNote}
        />
      )}

      {/* Enhanced Preview Modal */}
      {selectedNote && (
        <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start gap-4">
                <div className={`w-2 h-12 bg-gradient-to-b ${categories.find(c => c.value === selectedNote.category)?.color || 'from-gray-400 to-gray-600'} rounded-full`}></div>
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-bold flex items-center gap-3 mb-2">
                    {selectedNote.is_pinned && <Pin className="w-5 h-5 text-orange-500 fill-current" />}
                    {selectedNote.title}
                  </DialogTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <span>{categories.find(c => c.value === selectedNote.category)?.icon}</span>
                      <span>{categories.find(c => c.value === selectedNote.category)?.label}</span>
                    </span>
                    <span>•</span>
                    <span>Dibuat {formatDistanceToNow(new Date(selectedNote.created_at), { addSuffix: true, locale: id })}</span>
                    {selectedNote.updated_at !== selectedNote.created_at && (
                      <>
                        <span>•</span>
                        <span>Diperbarui {formatDistanceToNow(new Date(selectedNote.updated_at), { addSuffix: true, locale: id })}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </DialogHeader>
            
            <div className="mt-6 space-y-6">
              {selectedNote.content && (
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                    {selectedNote.content}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  {selectedNote.is_pinned && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      <Bookmark className="w-3 h-3 mr-1" />
                      Disematkan
                    </Badge>
                  )}
                  {selectedNote.is_archived && (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      <Archive className="w-3 h-3 mr-1" />
                      Diarsipkan
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPreviewModal(false);
                      setShowEditModal(true);
                    }}
                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleTogglePin(selectedNote.id, selectedNote.is_pinned);
                      setShowPreviewModal(false);
                    }}
                    className="hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  >
                    <Pin className="w-4 h-4 mr-2" />
                    {selectedNote.is_pinned ? 'Batal Pin' : 'Pin'}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default NotesTab;
