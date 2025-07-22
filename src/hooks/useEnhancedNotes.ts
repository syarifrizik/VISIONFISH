
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  is_pinned: boolean;
  is_archived: boolean;
  color?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useEnhancedNotes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(['personal', 'fishing', 'tips', 'recipes']);

  // Stable fetch function with proper error handling
  const fetchNotes = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      console.log('useEnhancedNotes: Fetching notes for user:', user.id);
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('is_pinned', { ascending: false })
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('useEnhancedNotes: Supabase error:', error);
        throw error;
      }
      
      const notesList = data || [];
      setNotes(notesList);

      // Extract unique categories
      const uniqueCategories = [...new Set([
        ...categories,
        ...notesList.map(note => note.category).filter(Boolean)
      ])];
      setCategories(uniqueCategories);
      
      console.log('useEnhancedNotes: Notes loaded successfully:', notesList.length);
    } catch (err) {
      console.error('useEnhancedNotes: Error fetching notes:', err);
      toast({
        title: "❌ Gagal Memuat Catatan",
        description: err instanceof Error ? err.message : "Gagal memuat catatan",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast, categories]);

  // Initial load and realtime setup
  useEffect(() => {
    if (!user?.id) return;

    // Initial fetch
    fetchNotes();

    // Setup realtime subscription
    const channel = supabase
      .channel('user-notes-enhanced')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notes',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('useEnhancedNotes: Realtime event:', payload);
        // Debounce realtime updates to prevent excessive re-fetching
        setTimeout(() => {
          fetchNotes();
        }, 500);
      })
      .subscribe();

    return () => {
      console.log('useEnhancedNotes: Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchNotes]);

  const createNote = useCallback(async (noteData: Partial<Note>) => {
    if (!user?.id) return null;

    try {
      const insertData = {
        title: noteData.title || 'Untitled',
        content: noteData.content || '',
        category: noteData.category || 'personal',
        is_pinned: noteData.is_pinned || false,
        is_archived: noteData.is_archived || false,
        color: noteData.color,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('useEnhancedNotes: Creating note:', insertData);

      const { data, error } = await supabase
        .from('notes')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('useEnhancedNotes: Create error:', error);
        throw error;
      }

      // Optimistically update local state
      setNotes(prev => [data, ...prev]);

      toast({
        title: "✅ Catatan Disimpan",
        description: "Catatan berhasil dibuat"
      });

      return data;
    } catch (err) {
      console.error('useEnhancedNotes: Error creating note:', err);
      toast({
        title: "❌ Gagal Menyimpan",
        description: err instanceof Error ? err.message : "Gagal membuat catatan",
        variant: "destructive"
      });
      return null;
    }
  }, [user?.id, toast]);

  const updateNote = useCallback(async (id: string, updates: Partial<Note>) => {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      console.log('useEnhancedNotes: Updating note:', id, updateData);

      const { error } = await supabase
        .from('notes')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('useEnhancedNotes: Update error:', error);
        throw error;
      }

      // Optimistically update local state
      setNotes(prev => prev.map(note => 
        note.id === id ? { ...note, ...updateData } : note
      ));

      toast({
        title: "✅ Catatan Diperbarui",
        description: "Perubahan berhasil disimpan"
      });
    } catch (err) {
      console.error('useEnhancedNotes: Error updating note:', err);
      toast({
        title: "❌ Gagal Memperbarui",
        description: err instanceof Error ? err.message : "Gagal memperbarui catatan",
        variant: "destructive"
      });
    }
  }, [toast]);

  const deleteNote = useCallback(async (id: string) => {
    try {
      console.log('useEnhancedNotes: Deleting note:', id);

      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('useEnhancedNotes: Delete error:', error);
        throw error;
      }

      // Optimistically update local state
      setNotes(prev => prev.filter(note => note.id !== id));

      toast({
        title: "🗑️ Catatan Dihapus",
        description: "Catatan berhasil dihapus"
      });
    } catch (err) {
      console.error('useEnhancedNotes: Error deleting note:', err);
      toast({
        title: "❌ Gagal Menghapus",
        description: err instanceof Error ? err.message : "Gagal menghapus catatan",
        variant: "destructive"
      });
    }
  }, [toast]);

  return {
    notes,
    isLoading,
    categories,
    createNote,
    updateNote,
    deleteNote,
    refreshNotes: fetchNotes
  };
};
