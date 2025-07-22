import { supabase } from '@/integrations/supabase/client';

export const noteInteractionsService = {
  // Record view for a note (permanent - one time per user per note)
  async recordView(noteId: string, userId?: string) {
    try {
      console.log('Recording view for note:', noteId, 'by user:', userId);
      
      if (!userId) {
        console.log('No user ID provided, skipping view recording');
        return { success: false, error: 'User not authenticated' };
      }

      // Check if user has already viewed this note (permanent check)
      const { data: existingView } = await supabase
        .from('note_views')
        .select('id')
        .eq('note_id', noteId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existingView) {
        console.log('User already viewed this note, skipping');
        return { success: true, message: 'Already viewed' };
      }

      // Record new view (only if not viewed before)
      const { error } = await supabase
        .from('note_views')
        .insert({
          note_id: noteId,
          user_id: userId,
          viewed_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error recording view:', error);
        // Handle unique constraint violation gracefully
        if (error.code === '23505') {
          console.log('View already exists (caught by unique constraint)');
          return { success: true, message: 'Already viewed' };
        }
        return { success: false, error: error.message };
      }

      console.log('View recorded successfully');
      return { success: true };
    } catch (error) {
      console.error('Error recording view:', error);
      return { success: false, error: 'Failed to record view' };
    }
  },

  // Check if user has already viewed a note
  async hasUserViewedNote(noteId: string, userId?: string): Promise<boolean> {
    try {
      if (!userId) return false;
      
      const { data } = await supabase
        .from('note_views')
        .select('id')
        .eq('note_id', noteId)
        .eq('user_id', userId)
        .maybeSingle();

      return !!data;
    } catch (error) {
      console.error('Error checking view status:', error);
      return false;
    }
  },

  // Toggle like for a note
  async toggleLike(noteId: string, userId: string) {
    try {
      console.log('Toggling like for note:', noteId, 'by user:', userId);
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('note_likes')
        .select('id')
        .eq('note_id', noteId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existingLike) {
        // Unlike
        console.log('Removing like');
        const { error } = await supabase
          .from('note_likes')
          .delete()
          .eq('note_id', noteId)
          .eq('user_id', userId);

        if (error) {
          console.error('Error removing like:', error);
          throw error;
        }
        
        console.log('Like removed successfully');
        return { success: true, isLiked: false };
      } else {
        // Like
        console.log('Adding like');
        const { error } = await supabase
          .from('note_likes')
          .insert({
            note_id: noteId,
            user_id: userId
          });

        if (error) {
          console.error('Error adding like:', error);
          throw error;
        }
        
        console.log('Like added successfully');
        return { success: true, isLiked: true };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to toggle like' };
    }
  },

  // Check if user has liked a note
  async checkIfLiked(noteId: string, userId: string) {
    try {
      console.log('Checking if user liked note:', noteId, 'by user:', userId);
      
      if (!userId) {
        return false;
      }
      
      const { data } = await supabase
        .from('note_likes')
        .select('id')
        .eq('note_id', noteId)
        .eq('user_id', userId)
        .maybeSingle();

      const isLiked = !!data;
      console.log('User liked status:', isLiked);
      return isLiked;
    } catch (error) {
      console.error('Error checking like status:', error);
      return false;
    }
  },

  // Get note stats
  async getNoteStats(noteId: string) {
    try {
      console.log('Getting stats for note:', noteId);
      
      // Get views count (unique users only)
      const { count: viewsCount } = await supabase
        .from('note_views')
        .select('*', { count: 'exact', head: true })
        .eq('note_id', noteId);

      // Get likes count
      const { count: likesCount } = await supabase
        .from('note_likes')
        .select('*', { count: 'exact', head: true })
        .eq('note_id', noteId);

      const stats = {
        views: viewsCount || 0,
        likes: likesCount || 0
      };
      
      console.log('Note stats:', stats);
      return stats;
    } catch (error) {
      console.error('Error getting note stats:', error);
      return { views: 0, likes: 0 };
    }
  }
};
