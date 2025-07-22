
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Clock, 
  MapPin, 
  Tag, 
  Eye, 
  Heart, 
  User,
  Calendar,
  Globe,
  Lock,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';
import { noteInteractionsService } from '@/services/noteInteractionsService';
import { useToast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  is_pinned: boolean;
  is_private: boolean;
  color?: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  location?: string;
  user_id: string;
  views_count?: number;
  likes_count?: number;
}

interface NotePreviewModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  authorName?: string;
  authorAvatar?: string;
  isOwner?: boolean;
  onEdit?: () => void;
}

const NotePreviewModal = ({
  note,
  isOpen,
  onClose,
  authorName = 'Unknown User',
  authorAvatar,
  isOwner = false,
  onEdit
}: NotePreviewModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [stats, setStats] = useState({ views: 0, likes: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [hasRecordedView, setHasRecordedView] = useState(false);

  // Check if current user is the owner of the note
  const isNoteOwner = user?.id === note?.user_id;

  useEffect(() => {
    if (!note || !isOpen) {
      setHasRecordedView(false);
      return;
    }

    const loadNoteData = async () => {
      try {
        setIsLoading(true);
        console.log('Loading note data for note:', note.id);
        
        // Load initial stats
        const noteStats = await noteInteractionsService.getNoteStats(note.id);
        console.log('Note stats loaded:', noteStats);
        
        setStats({
          views: note.views_count || noteStats.views || 0,
          likes: note.likes_count || noteStats.likes || 0
        });

        // Check if user liked this note
        if (user?.id) {
          const liked = await noteInteractionsService.checkIfLiked(note.id, user.id);
          console.log('User liked status:', liked);
          setIsLiked(liked);
        }

        // Record view if user is not the owner and hasn't recorded view yet
        if (user?.id && user.id !== note.user_id && !hasRecordedView) {
          console.log('Recording view for note:', note.id);
          const viewResult = await noteInteractionsService.recordView(note.id, user.id);
          console.log('View recorded:', viewResult);
          
          if (viewResult.success && viewResult.message !== 'Already viewed') {
            setStats(prev => ({ ...prev, views: prev.views + 1 }));
          }
          setHasRecordedView(true);
        }
      } catch (error) {
        console.error('Error loading note data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNoteData();
  }, [note, isOpen, user?.id, hasRecordedView]);

  const handleLike = async () => {
    if (!user?.id || !note || isLoading) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login untuk menyukai catatan",
        variant: "destructive"
      });
      return;
    }

    if (user.id === note.user_id) {
      toast({
        title: "Tidak Dapat Menyukai",
        description: "Anda tidak dapat menyukai catatan sendiri",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log('Toggling like for note:', note.id);
      
      const result = await noteInteractionsService.toggleLike(note.id, user.id);
      console.log('Like toggle result:', result);
      
      if (result.success) {
        setIsLiked(result.isLiked);
        setStats(prev => ({
          ...prev,
          likes: result.isLiked ? prev.likes + 1 : Math.max(0, prev.likes - 1)
        }));

        toast({
          title: result.isLiked ? "❤️ Disukai!" : "Batal menyukai",
          description: result.isLiked ? "Catatan telah disukai" : "Like dibatalkan"
        });
      } else {
        throw new Error(result.error || 'Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "❌ Gagal",
        description: "Terjadi kesalahan saat memproses like",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!note) return null;

  const categoryColors: Record<string, string> = {
    'fishing': 'from-blue-400 to-cyan-500',
    'technique': 'from-green-400 to-emerald-500',
    'location': 'from-orange-400 to-red-500',
    'equipment': 'from-purple-400 to-pink-500',
    'personal': 'from-gray-400 to-slate-500',
    'tips': 'from-yellow-400 to-orange-500',
    'recipes': 'from-pink-400 to-rose-500'
  };

  const categoryIcons: Record<string, string> = {
    'fishing': '🎣',
    'technique': '⚙️',
    'location': '📍',
    'equipment': '🎯',
    'personal': '💭',
    'tips': '💡',
    'recipes': '🍽️'
  };

  const categoryColor = categoryColors[note.category] || 'from-gray-400 to-slate-500';
  const categoryIcon = categoryIcons[note.category] || '📄';

  const formatDate = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'PPP', { locale: idLocale });
    } catch {
      return 'Unknown date';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: idLocale
      });
    } catch {
      return 'Unknown time';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 max-w-2xl w-full max-h-[85vh] overflow-hidden mx-4 sm:mx-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-4 sm:p-6 border-b border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  {/* Category Badge */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <div className={`px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r ${categoryColor}/20 border border-white/20`}>
                      <span className="text-xs sm:text-sm font-medium text-white flex items-center gap-2">
                        <span>{categoryIcon}</span>
                        <span className="capitalize">{note.category}</span>
                      </span>
                    </div>
                    <Badge variant="outline" className={`text-xs ${
                      note.is_private 
                        ? 'border-orange-400/30 text-orange-400' 
                        : 'border-green-400/30 text-green-400'
                    }`}>
                      {note.is_private ? (
                        <>
                          <Lock className="w-2 h-2 mr-1" />
                          <span className="hidden sm:inline">Privat</span>
                        </>
                      ) : (
                        <>
                          <Globe className="w-2 h-2 mr-1" />
                          <span className="hidden sm:inline">Publik</span>
                        </>
                      )}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg sm:text-2xl font-bold text-white mb-4 leading-tight">
                    {note.title}
                  </h2>

                  {/* Author Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      {authorAvatar ? (
                        <img src={authorAvatar} alt={authorName} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{authorName}</p>
                      <p className="text-white/60 text-xs">
                        {formatTimeAgo(note.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="w-8 h-8 p-0 text-white/70 hover:text-white hover:bg-white/10 rounded-lg flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[45vh] sm:max-h-[50vh]">
              {/* Main Content */}
              <div className="prose prose-invert max-w-none mb-6">
                <p className="text-white/90 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                  {note.content}
                </p>
              </div>

              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2 text-sm">
                    <Tag className="w-4 h-4" />
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-white/20 text-white/80 hover:bg-white/10 transition-colors text-xs"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              {note.location && (
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    Lokasi
                  </h4>
                  <p className="text-white/70 text-sm">{note.location}</p>
                </div>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <p className="text-white/60 text-xs mb-1">Dibuat</p>
                  <p className="text-white text-xs sm:text-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(note.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-xs mb-1">Diperbarui</p>
                  <p className="text-white text-xs sm:text-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(note.updated_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Actions - Stats and Like button */}
            <div className="p-4 sm:p-6 border-t border-white/10 bg-white/5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">{stats.views}</span>
                    <span className="text-xs text-white/40 hidden sm:inline">views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">{stats.likes}</span>
                    <span className="text-xs text-white/40 hidden sm:inline">likes</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Like Button - only show for non-owners */}
                  {user?.id && !isNoteOwner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLike}
                      disabled={isLoading}
                      className={`h-10 px-3 sm:px-4 text-white/70 hover:text-white hover:bg-white/10 transition-colors ${
                        isLiked ? 'text-red-400 hover:text-red-300' : ''
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      <span className="hidden sm:inline sm:ml-2">{isLiked ? 'Disukai' : 'Suka'}</span>
                    </Button>
                  )}
                  
                  {/* Edit Button - only show for owner */}
                  {isNoteOwner && onEdit && (
                    <Button
                      size="sm"
                      onClick={onEdit}
                      className="h-10 px-3 sm:px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="hidden sm:inline sm:ml-2">Edit</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Gradient Border Effect */}
            <div className={`absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r ${categoryColor} opacity-5 pointer-events-none`} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotePreviewModal;
