
import { supabase } from '@/integrations/supabase/client';

// Define our own Note interface to avoid circular type issues
export interface Note {
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
}

export const notesService = {
  // Fetch all notes for a user (no filters applied)
  async fetchAllNotes(userId: string) {
    try {
      console.log('notesService: Fetching all notes for user:', userId);
      
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('is_pinned', { ascending: false })
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('notesService: Supabase error:', error);
        throw error;
      }
      
      console.log('notesService: Successfully fetched', data?.length || 0, 'notes');
      return { data, error: null };
    } catch (error) {
      console.error('notesService.fetchAllNotes error:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch notes' };
    }
  },

  // Fetch public notes from other users
  async fetchPublicNotes(userId: string) {
    try {
      console.log('notesService: Fetching public notes for user:', userId);
      
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .eq('is_archived', false)
        .order('is_pinned', { ascending: false })
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('notesService: Supabase error:', error);
        throw error;
      }
      
      console.log('notesService: Successfully fetched', data?.length || 0, 'public notes');
      return { data, error: null };
    } catch (error) {
      console.error('notesService.fetchPublicNotes error:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch public notes' };
    }
  },

  async createNote(userId: string, noteData: Partial<Note>) {
    try {
      const insertData = {
        user_id: userId,
        title: noteData.title || 'Untitled',
        content: noteData.content || '',
        category: noteData.category || 'personal',
        is_pinned: noteData.is_pinned || false,
        is_archived: noteData.is_archived || false,
        color: noteData.color,
        tags: noteData.tags || [],
        location: noteData.location,
        images: noteData.images || [],
        voice_notes: noteData.voice_notes || [],
        fishing_data: noteData.fishing_data,
        metadata: noteData.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('notes')
        .insert([insertData])
        .select()
        .single();

      return { data, error: error?.message };
    } catch (error) {
      console.error('notesService.createNote error:', error);
      return { data: null, error: 'Failed to create note' };
    }
  },

  async updateNote(noteId: string, updates: Partial<Note>) {
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

      return { data, error: error?.message };
    } catch (error) {
      console.error('notesService.updateNote error:', error);
      return { data: null, error: 'Failed to update note' };
    }
  },

  async deleteNote(noteId: string) {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      return { success: !error, error: error?.message };
    } catch (error) {
      console.error('notesService.deleteNote error:', error);
      return { success: false, error: 'Failed to delete note' };
    }
  },

  async togglePin(noteId: string, isPinned: boolean) {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ 
          is_pinned: isPinned, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', noteId);

      return { success: !error, error: error?.message };
    } catch (error) {
      console.error('notesService.togglePin error:', error);
      return { success: false, error: 'Failed to toggle pin' };
    }
  },

  async toggleArchive(noteId: string, isArchived: boolean) {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ 
          is_archived: isArchived, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', noteId);

      return { success: !error, error: error?.message };
    } catch (error) {
      console.error('notesService.toggleArchive error:', error);
      return { success: false, error: 'Failed to toggle archive' };
    }
  },

  async togglePrivacy(noteId: string, isPrivate: boolean) {
    try {
      console.log('notesService.togglePrivacy: Updating note privacy:', noteId, 'to private:', isPrivate);
      
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
        console.error('notesService.togglePrivacy: Supabase error:', error);
        throw error;
      }

      console.log('notesService.togglePrivacy: Update successful:', data);
      return { success: true, error: null };
    } catch (error) {
      console.error('notesService.togglePrivacy error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to toggle privacy' };
    }
  }
};
