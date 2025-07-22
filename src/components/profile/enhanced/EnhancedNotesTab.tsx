
import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNotesManagement } from '@/hooks/useNotesManagement';
import { useAuth } from '@/hooks/useAuth';
import ModernNotesNavigation from '../notes/ModernNotesNavigation';
import ModernNotesGrid from '../notes/ModernNotesGrid';
import PublicNotesGrid from '../notes/PublicNotesGrid';
import ModernCreateNoteModal from '../notes/ModernCreateNoteModal';
import NotePreviewModal from '../notes/NotePreviewModal';
import EditNoteDialog from '../EditNoteDialog';

interface EnhancedNotesTabProps {
  profileUserId?: string;
  isOwnProfile?: boolean;
  profileOwnerName?: string;
}

const EnhancedNotesTab = ({ 
  profileUserId, 
  isOwnProfile = true,
  profileOwnerName = 'User'
}: EnhancedNotesTabProps) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'created' | 'updated' | 'title'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [previewNote, setPreviewNote] = useState<any>(null);

  // Use the updated notes management hook with proper context
  const {
    allNotes,
    isLoading,
    error,
    getFilteredNotes,
    getCounts,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive,
    togglePrivacy,
  } = useNotesManagement({
    profileUserId: profileUserId,
    isOwnProfile: isOwnProfile
  });

  console.log('EnhancedNotesTab: profileUserId:', profileUserId, 'isOwnProfile:', isOwnProfile, 'notes count:', allNotes.length);

  // Get available categories from existing notes (including privacy categories)
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(allNotes.map(note => note.category))];
    const defaultCategories = ['personal', 'fishing', 'technique', 'location', 'equipment', 'tips', 'recipes'];
    
    return [...new Set([...defaultCategories, ...uniqueCategories])];
  }, [allNotes]);

  // Apply client-side filtering
  const filteredNotes = useMemo(() => {
    return getFilteredNotes({
      searchQuery,
      category: selectedCategory
    });
  }, [getFilteredNotes, searchQuery, selectedCategory]);

  // Sort notes client-side for UI display
  const sortedNotes = useMemo(() => {
    if (!filteredNotes.length) return filteredNotes;

    let sorted = [...filteredNotes];

    // Sort by selected criteria
    sorted.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;
        case 'created':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'updated':
        default:
          comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Keep pinned notes at top for updated/created sort
    if (sortBy === 'updated' || sortBy === 'created') {
      const pinned = sorted.filter(note => note.is_pinned);
      const unpinned = sorted.filter(note => !note.is_pinned);
      sorted = [...pinned, ...unpinned];
    }

    return sorted;
  }, [filteredNotes, sortBy, sortOrder]);

  // Calculate note counts by category (including privacy counts)
  const noteCounts = useMemo(() => {
    const counts = getCounts(allNotes);
    const byCategory: Record<string, number> = {};
    
    // Count notes by category (excluding archived)
    allNotes.forEach(note => {
      if (!note.is_archived) {
        byCategory[note.category] = (byCategory[note.category] || 0) + 1;
      }
    });

    return {
      total: counts.total,
      pinned: counts.pinned,
      archived: counts.archived,
      private: counts.private,
      public: counts.public,
      byCategory
    };
  }, [allNotes, getCounts]);

  // Stable event handlers
  const handleCreateNote = useCallback(async (noteData: any) => {
    const result = await createNote(noteData);
    if (result) {
      setShowCreateModal(false);
      return true;
    }
    return false;
  }, [createNote]);

  const handleEditNote = useCallback(async (noteId: string, noteData: any) => {
    const success = await updateNote(noteId, noteData);
    if (success) {
      setEditingNote(null);
    }
    return success;
  }, [updateNote]);

  const handleViewNote = useCallback((note: any) => {
    if (isOwnProfile) {
      // For own profile, allow editing
      setEditingNote(note);
    } else {
      // For public profile, show preview modal
      setPreviewNote(note);
    }
  }, [isOwnProfile]);

  const handlePreviewEdit = useCallback(() => {
    if (previewNote && user?.id === previewNote.user_id) {
      setPreviewNote(null);
      setEditingNote(previewNote);
    }
  }, [previewNote, user?.id]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const handleDeleteNote = useCallback(async (noteId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan ini?')) return;
    await deleteNote(noteId);
  }, [deleteNote]);

  const handleTogglePin = useCallback(async (noteId: string, isPinned: boolean) => {
    await togglePin(noteId, isPinned);
  }, [togglePin]);

  const handleToggleArchive = useCallback(async (noteId: string, isArchived: boolean) => {
    await toggleArchive(noteId, isArchived);
  }, [toggleArchive]);

  const handleTogglePrivacy = useCallback(async (noteId: string, isPrivate: boolean) => {
    await togglePrivacy(noteId, isPrivate);
  }, [togglePrivacy]);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="bg-red-500/10 backdrop-blur-xl rounded-3xl border border-red-500/20 p-8 max-w-md mx-auto">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-200 mb-2">Terjadi Kesalahan</h3>
          <p className="text-red-300/80 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-6 py-2 rounded-2xl transition-colors"
          >
            Muat Ulang
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation - Only show full controls for own profile */}
      {isOwnProfile && (
        <ModernNotesNavigation
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          onCreateNote={() => setShowCreateModal(true)}
          categories={categories}
          noteCounts={noteCounts}
        />
      )}

      {/* Notes Grid */}
      {isOwnProfile ? (
        <ModernNotesGrid
          notes={sortedNotes}
          viewMode={viewMode}
          onEdit={setEditingNote}
          onDelete={handleDeleteNote}
          onTogglePin={handleTogglePin}
          onToggleArchive={handleToggleArchive}
          onTogglePrivacy={handleTogglePrivacy}
          onView={handleViewNote}
          isLoading={isLoading}
          profileUserId={profileUserId}
          isOwnProfile={isOwnProfile}
        />
      ) : (
        <PublicNotesGrid
          notes={sortedNotes}
          viewMode={viewMode}
          onView={handleViewNote}
          isLoading={isLoading}
          profileOwnerName={profileOwnerName}
        />
      )}

      {/* Create/Edit Note Modal - Only for own profile */}
      {isOwnProfile && (
        <ModernCreateNoteModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateNote}
          categories={categories}
        />
      )}

      {/* Edit Note Dialog - Only for own profile */}
      {isOwnProfile && (
        <EditNoteDialog
          note={editingNote}
          isOpen={!!editingNote}
          onClose={() => setEditingNote(null)}
          onNoteUpdated={() => setEditingNote(null)}
        />
      )}

      {/* Note Preview Modal - For public profiles */}
      <NotePreviewModal
        note={previewNote}
        isOpen={!!previewNote}
        onClose={() => setPreviewNote(null)}
        authorName={profileOwnerName}
        isOwner={user?.id === previewNote?.user_id}
        onEdit={handlePreviewEdit}
      />
    </div>
  );
};

export default EnhancedNotesTab;
