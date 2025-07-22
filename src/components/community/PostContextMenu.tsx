
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MoreHorizontal,
  Bookmark,
  BookmarkCheck,
  Flag,
  Edit,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { usePostActions } from '@/hooks/usePostActions';
import { useAuth } from '@/hooks/useAuth';
import { ReportDialog } from './ReportDialog';
import { EditPostDialog } from './EditPostDialog';

interface PostContextMenuProps {
  postId: string;
  postTitle: string;
  postOwnerId: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const PostContextMenu: React.FC<PostContextMenuProps> = ({
  postId,
  postTitle,
  postOwnerId,
  onEdit,
  onDelete
}) => {
  const { user } = useAuth();
  const { toggleBookmark, deletePost, checkIfBookmarked, isLoading } = usePostActions();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner = user?.id === postOwnerId;

  useEffect(() => {
    const loadBookmarkStatus = async () => {
      const bookmarked = await checkIfBookmarked(postId);
      setIsBookmarked(bookmarked);
    };
    loadBookmarkStatus();
  }, [postId, checkIfBookmarked]);

  const handleBookmark = async () => {
    const newBookmarkStatus = await toggleBookmark(postId);
    if (newBookmarkStatus !== false) {
      setIsBookmarked(newBookmarkStatus);
    }
  };

  const handleDelete = async () => {
    const success = await deletePost(postId);
    if (success && onDelete) {
      onDelete();
    }
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="bg-slate-800/95 backdrop-blur-xl border-slate-700 text-white min-w-[180px]"
          align="end"
        >
          {/* Bookmark */}
          {user && (
            <DropdownMenuItem 
              onClick={handleBookmark}
              disabled={isLoading}
              className="hover:bg-slate-700/50 cursor-pointer"
            >
              {isBookmarked ? (
                <>
                  <BookmarkCheck className="w-4 h-4 mr-2 text-yellow-400" />
                  Hapus Bookmark
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save Post
                </>
              )}
            </DropdownMenuItem>
          )}

          {/* Owner Actions */}
          {isOwner && (
            <>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem 
                onClick={() => setShowEditDialog(true)}
                className="hover:bg-slate-700/50 cursor-pointer"
              >
                <Edit className="w-4 h-4 mr-2 text-blue-400" />
                Edit Post
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => setShowDeleteConfirm(true)}
                className="hover:bg-red-500/20 text-red-400 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Post
              </DropdownMenuItem>
            </>
          )}

          {/* Report (for non-owners) */}
          {!isOwner && user && (
            <>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem 
                onClick={() => setShowReportDialog(true)}
                className="hover:bg-orange-500/20 text-orange-400 cursor-pointer"
              >
                <Flag className="w-4 h-4 mr-2" />
                Report Post
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Report Dialog */}
      <ReportDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        postId={postId}
      />

      {/* Edit Dialog */}
      <EditPostDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        postId={postId}
        onEdit={onEdit}
      />

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-6 max-w-sm mx-4 border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-white mb-3">
                Delete Post?
              </h3>
              <p className="text-slate-300 text-sm mb-6">
                This action cannot be undone. The post will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
