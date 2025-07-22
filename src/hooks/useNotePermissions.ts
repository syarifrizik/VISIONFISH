
import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface Note {
  id: string;
  user_id: string;
  is_private: boolean;
  [key: string]: any;
}

export const useNotePermissions = (note?: Note | null, profileUserId?: string) => {
  const { user } = useAuth();

  return useMemo(() => {
    const currentUserId = user?.id;
    const noteOwnerId = note?.user_id;
    const isViewingOwnProfile = currentUserId === profileUserId;
    const isNoteOwner = currentUserId === noteOwnerId;
    
    return {
      // Basic permissions
      canEdit: isNoteOwner,
      canDelete: isNoteOwner,
      canPin: isNoteOwner,
      canArchive: isNoteOwner,
      canTogglePrivacy: isNoteOwner,
      
      // View permissions
      canView: isNoteOwner || !note?.is_private,
      canViewPrivateNotes: isViewingOwnProfile,
      
      // UI states
      isNoteOwner,
      isViewingOwnProfile,
      showOwnerControls: isNoteOwner,
      showPublicView: !isNoteOwner,
    };
  }, [user?.id, note?.user_id, note?.is_private, profileUserId]);
};
