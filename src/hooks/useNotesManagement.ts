import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useActivityTracking } from '@/hooks/useActivityTracking';

// Define our own Note interface to match what we need
interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  is_pinned: boolean;
  is_archived: boolean;
  is_private: boolean;
  color?: string;
  tags: string[];
  location?: string;
  images: any[];
  voice_notes: any[];
  fishing_data?: any;
  metadata: any;
  created_at: string;
  updated_at: string;
  views_count?: number;
  likes_count?: number;
}

interface NotesCount {
  total: number;
  pinned: number;
  archived: number;
  private: number;
  public: number;
}

interface UseNotesManagementOptions {
  profileUserId?: string;
  isOwnProfile?: boolean;
}

export const useNotesManagement = (options: UseNotesManagementOptions = {}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { trackNoteCreationActivity } = useActivityTracking();
  const { profileUserId, isOwnProfile = true } = options;
  
  // Determine which user ID to use for data fetching
  const targetUserId = profileUserId || user?.id;
  
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);
  
  const fetchTimeoutRef = useRef<NodeJS.Timeout>();

  const calculateCounts = useCallback((notesList: Note[]): NotesCount => {
    return {
      total: notesList.filter(note => !note.is_archived).length,
      pinned: notesList.filter(note => note.is_pinned && !note.is_archived).length,
      archived: notesList.filter(note => note.is_archived).length,
      private: notesList.filter(note => note.is_private && !note.is_archived).length,
      public: notesList.filter(note => !note.is_private && !note.is_archived).length,
    };
  }, []);

  // Fetch notes based on profile context
  const fetchAllNotes = useCallback(async () => {
    if (!targetUserId) {
      setIsLoading(false);
      return;
    }

    // Prevent excessive fetching
    const now = Date.now();
    if (now - lastFetch < 1000) {
      console.log('useNotesManagement: Skipping fetch (too recent)');
      return;
    }

    try {
      console.log('useNotesManagement: Fetching notes for user:', targetUserId, 'isOwnProfile:', isOwnProfile);
      setError(null);
      setIsLoading(true);
      
      // Build query based on context - RLS will handle access control
      let query = supabase
        .from('notes')
        .select('*')
        .eq('user_id', targetUserId);

      // For other profiles, only get public, non-archived notes
      if (!isOwnProfile) {
        query = query
          .eq('is_private', false)
          .eq('is_archived', false);
      }

      const { data, error: fetchError } = await query
        .order('is_pinned', { ascending: false })
        .order('updated_at', { ascending: false });
      
      if (fetchError) {
        console.error('useNotesManagement: Supabase error:', fetchError);
        throw new Error(fetchError.message);
      }

      // Transform the data to match our Note interface
      const notesList = (data || []).map(note => {
        return {
          ...note,
          images: Array.isArray(note.images) ? note.images : [],
          voice_notes: Array.isArray(note.voice_notes) ? note.voice_notes : [],
          metadata: note.metadata || {},
          tags: Array.isArray(note.tags) ? note.tags : [],
          is_private: note.is_private || false,
          views_count: note.views_count || 0,
          likes_count: note.likes_count || 0
        };
      }) as Note[];
      
      setAllNotes(notesList);
      setLastFetch(now);
      
      console.log('useNotesManagement: Notes fetched successfully:', notesList.length, 'for user:', targetUserId, 'isOwnProfile:', isOwnProfile);
      console.log('useNotesManagement: Sample note data:', notesList[0]);
    } catch (err) {
      console.error('useNotesManagement: Error fetching notes:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notes';
      setError(errorMessage);
      
      // Only show toast for own profile errors to avoid spam
      if (isOwnProfile) {
        toast({
          title: "❌ Gagal Memuat Catatan",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [targetUserId, isOwnProfile, lastFetch, toast]);

  // Initial load
  useEffect(() => {
    if (targetUserId) {
      console.log('useNotesManagement: Initial load for user:', targetUserId, 'isOwnProfile:', isOwnProfile);
      fetchAllNotes();
    }
  }, [targetUserId, isOwnProfile, fetchAllNotes]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);

  // Client-side filtering function
  const getFilteredNotes = useCallback((filters: {
    searchQuery?: string;
    category?: string;
    isPinned?: boolean;
    isArchived?: boolean;
    isPrivate?: boolean;
  }) => {
    let filtered = [...allNotes];

    // For public profiles, always filter out private notes
    if (!isOwnProfile) {
      filtered = filtered.filter(note => !note.is_private);
    }

    // Handle special categories first
    if (filters.category === 'pinned') {
      filtered = filtered.filter(note => note.is_pinned && !note.is_archived);
    } else if (filters.category === 'archived') {
      filtered = filtered.filter(note => note.is_archived);
    } else if (filters.category === 'private') {
      filtered = filtered.filter(note => note.is_private && !note.is_archived);
    } else if (filters.category === 'public') {
      filtered = filtered.filter(note => !note.is_private && !note.is_archived);
    } else if (filters.category === 'all') {
      filtered = filtered.filter(note => !note.is_archived);
    } else if (filters.category && filters.category !== 'all') {
      // Regular category filter
      filtered = filtered.filter(note => 
        note.category === filters.category && !note.is_archived
      );
    } else {
      // Default: show non-archived notes
      filtered = filtered.filter(note => !note.is_archived);
    }

    // Apply search query if provided
    if (filters.searchQuery?.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(query) ||
        (note.content || '').toLowerCase().includes(query) ||
        note.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allNotes, isOwnProfile]);

  // CRUD operations - only allow for own profile
  const createNote = useCallback(async (noteData: Partial<Note>) => {
    if (!isOwnProfile || !user?.id) return null;

    try {
      const insertData = {
        user_id: user.id,
        title: noteData.title || 'Untitled',
        content: noteData.content || '',
        category: noteData.category || 'personal',
        is_pinned: noteData.is_pinned || false,
        is_archived: noteData.is_archived || false,
        is_private: noteData.is_private || false,
        color: noteData.color,
        tags: noteData.tags || [],
        location: noteData.location,
        images: noteData.images || [],
        voice_notes: noteData.voice_notes || [],
        fishing_data: noteData.fishing_data,
        metadata: noteData.metadata || {},
        views_count: 0,
        likes_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('notes')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      const transformedNote = {
        ...data,
        images: Array.isArray(data.images) ? data.images : [],
        voice_notes: Array.isArray(data.voice_notes) ? data.voice_notes : [],
        metadata: data.metadata || {},
        tags: Array.isArray(data.tags) ? data.tags : [],
        is_private: data.is_private || false,
        views_count: data.views_count || 0,
        likes_count: data.likes_count || 0
      } as Note;
      
      // Update local state immediately
      setAllNotes(prev => [transformedNote, ...prev]);
      
      // Track activity for note creation
      await trackNoteCreationActivity(transformedNote.id, transformedNote.title);
      
      toast({
        title: "✅ Catatan Dibuat",
        description: "Catatan berhasil dibuat"
      });
      return transformedNote;
    } catch (error) {
      console.error('useNotesManagement: Error creating note:', error);
      toast({
        title: "❌ Gagal Membuat Catatan",
        description: error instanceof Error ? error.message : "Gagal membuat catatan",
        variant: "destructive"
      });
      return null;
    }
  }, [isOwnProfile, user?.id, toast, trackNoteCreationActivity]);

  const updateNote = useCallback(async (noteId: string, updates: Partial<Note>) => {
    if (!isOwnProfile) return false;

    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('notes')
        .update(updateData)
        .eq('id', noteId)
        .select()
        .single();

      if (error) throw error;

      // Update local state immediately
      setAllNotes(prev => prev.map(note => 
        note.id === noteId ? { 
          ...note, 
          ...updates, 
          updated_at: new Date().toISOString(),
          tags: Array.isArray(updates.tags) ? updates.tags : note.tags
        } : note
      ));
      
      toast({
        title: "✅ Catatan Diperbarui",
        description: "Perubahan berhasil disimpan"
      });
      return true;
    } catch (error) {
      console.error('useNotesManagement: Error updating note:', error);
      toast({
        title: "❌ Gagal Memperbarui",
        description: error instanceof Error ? error.message : "Gagal memperbarui catatan",
        variant: "destructive"
      });
      return false;
    }
  }, [isOwnProfile, toast]);

  const deleteNote = useCallback(async (noteId: string) => {
    if (!isOwnProfile) return false;

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      // Update local state immediately
      setAllNotes(prev => prev.filter(note => note.id !== noteId));
      
      toast({
        title: "🗑️ Catatan Dihapus",
        description: "Catatan berhasil dihapus"
      });
      return true;
    } catch (error) {
      console.error('useNotesManagement: Error deleting note:', error);
      toast({
        title: "❌ Gagal Menghapus",
        description: error instanceof Error ? error.message : "Gagal menghapus catatan",
        variant: "destructive"
      });
      return false;
    }
  }, [isOwnProfile, toast]);

  const togglePin = useCallback(async (noteId: string, isPinned: boolean) => {
    if (!isOwnProfile) return false;

    try {
      const { error } = await supabase
        .from('notes')
        .update({ 
          is_pinned: isPinned, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', noteId);

      if (error) throw error;

      // Update local state immediately
      setAllNotes(prev => prev.map(note => 
        note.id === noteId ? { ...note, is_pinned: isPinned, updated_at: new Date().toISOString() } : note
      ));
      
      toast({
        title: isPinned ? "📌 Catatan Disematkan" : "📌 Catatan Tidak Disematkan",
        description: isPinned ? "Catatan berhasil disematkan" : "Catatan berhasil tidak disematkan"
      });
      return true;
    } catch (error) {
      console.error('useNotesManagement: Error toggling pin:', error);
      toast({
        title: "❌ Gagal Mengubah Status Pin",
        description: error instanceof Error ? error.message : "Gagal mengubah status pin",
        variant: "destructive"
      });
      return false;
    }
  }, [isOwnProfile, toast]);

  const toggleArchive = useCallback(async (noteId: string, isArchived: boolean) => {
    if (!isOwnProfile) return false;

    try {
      const { error } = await supabase
        .from('notes')
        .update({ 
          is_archived: isArchived, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', noteId);

      if (error) throw error;

      // Update local state immediately
      setAllNotes(prev => prev.map(note => 
        note.id === noteId ? { ...note, is_archived: isArchived, updated_at: new Date().toISOString() } : note
      ));
      
      toast({
        title: isArchived ? "📦 Catatan Diarsipkan" : "📦 Catatan Tidak Diarsipkan",  
        description: isArchived ? "Catatan berhasil diarsipkan" : "Catatan berhasil tidak diarsipkan"
      });
      return true;
    } catch (error) {
      console.error('useNotesManagement: Error toggling archive:', error);
      toast({
        title: "❌ Gagal Mengubah Status Arsip",
        description: error instanceof Error ? error.message : "Gagal mengubah status arsip",
        variant: "destructive"
      });
      return false;
    }
  }, [isOwnProfile, toast]);

  const togglePrivacy = useCallback(async (noteId: string, isPrivate: boolean) => {
    if (!isOwnProfile) return false;

    try {
      console.log('togglePrivacy: Updating note privacy:', noteId, 'to private:', isPrivate);
      
      const { data, error } = await supabase
        .from('notes')
        .update({ 
          is_private: isPrivate, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', noteId)
        .select()
        .single();

      if (error) {
        console.error('togglePrivacy: Supabase error:', error);
        throw error;
      }

      console.log('togglePrivacy: Database update successful:', data);

      // Update local state immediately
      setAllNotes(prev => prev.map(note => 
        note.id === noteId ? { 
          ...note, 
          is_private: isPrivate, 
          updated_at: new Date().toISOString() 
        } : note
      ));
      
      toast({
        title: isPrivate ? "🔒 Catatan Diprivat" : "🌐 Catatan Dipublik",
        description: isPrivate ? "Catatan sekarang bersifat privat" : "Catatan sekarang bersifat publik"
      });
      return true;
    } catch (error) {
      console.error('useNotesManagement: Error toggling privacy:', error);
      toast({
        title: "❌ Gagal Mengubah Status Privasi",
        description: error instanceof Error ? error.message : "Gagal mengubah status privasi",
        variant: "destructive"
      });
      return false;
    }
  }, [isOwnProfile, toast]);

  return {
    allNotes,
    isLoading,
    error,
    getFilteredNotes,
    getCounts: calculateCounts,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleArchive,
    togglePrivacy,
    refreshNotes: fetchAllNotes
  };
};
