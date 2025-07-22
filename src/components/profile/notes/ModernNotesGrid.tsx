import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  MapPin, 
  Tag, 
  Edit3, 
  Trash2, 
  Pin, 
  Archive, 
  Eye, 
  Heart, 
  Globe, 
  Lock,
  PinOff,
  ArchiveRestore
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  is_pinned: boolean;
  is_archived: boolean;
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

interface ModernNotesGridProps {
  notes: Note[];
  viewMode: 'grid' | 'list';
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onTogglePin: (noteId: string, isPinned: boolean) => void;
  onToggleArchive: (noteId: string, isArchived: boolean) => void;
  onTogglePrivacy: (noteId: string, isPrivate: boolean) => void;
  onView: (note: Note) => void;
  isLoading?: boolean;
  profileUserId?: string;
  isOwnProfile?: boolean;
}

const ModernNotesGrid = ({
  notes,
  viewMode,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive,
  onTogglePrivacy,
  onView,
  isLoading = false,
  profileUserId,
  isOwnProfile = true
}: ModernNotesGridProps) => {
  const { toast } = useToast();
  const [reorderedNotes, setReorderedNotes] = useState<Note[]>([]);

  // Update reordered notes when notes prop changes
  useEffect(() => {
    setReorderedNotes(notes);
  }, [notes]);

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

  const formatTimeAgo = (timestamp: string): string => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: idLocale
      });
    } catch {
      return 'Unknown time';
    }
  };

  const truncateContent = (content: string, maxLength: number = 120): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  // Handle note click - only owners can edit, others just view
  const handleNoteClick = (note: Note) => {
    console.log('Note clicked by owner, opening for edit');
    onView(note);
  };

  const handleQuickAction = async (
    e: React.MouseEvent,
    action: () => Promise<void> | void,
    actionName: string
  ) => {
    e.stopPropagation();
    try {
      await action();
    } catch (error) {
      console.error(`Error performing ${actionName}:`, error);
      toast({
        title: `❌ Gagal ${actionName}`,
        description: `Tidak dapat ${actionName.toLowerCase()}`,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-3 bg-white/10 rounded"></div>
                <div className="h-3 bg-white/10 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reorderedNotes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 max-w-md mx-auto">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-white mb-2">Tidak Ada Catatan</h3>
          <p className="text-white/60 mb-6">
            Mulai dokumentasikan pengalaman memancing Anda dengan membuat catatan pertama
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {viewMode === 'grid' ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {reorderedNotes.map((note, index) => {
              const categoryColor = categoryColors[note.category] || 'from-gray-400 to-slate-500';
              const categoryIcon = categoryIcons[note.category] || '📄';

              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Card 
                    className="group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                    onClick={() => handleNoteClick(note)}
                  >
                    {/* Pin Indicator */}
                    {note.is_pinned && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="bg-yellow-400/20 backdrop-blur-sm rounded-full p-1.5 border border-yellow-400/30">
                          <Pin className="w-3 h-3 text-yellow-400" />
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <CardContent className="p-4 sm:p-6">
                      {/* Category and Privacy Badges */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <div className={`px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r ${categoryColor}/20 border border-white/20`}>
                          <span className="text-xs font-medium text-white flex items-center gap-1">
                            <span>{categoryIcon}</span>
                            <span className="capitalize hidden sm:inline">{note.category}</span>
                          </span>
                        </div>
                        <Badge variant="outline" className={`text-xs ${note.is_private ? 'border-red-400/30 text-red-400' : 'border-green-400/30 text-green-400'}`}>
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
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-blue-200 transition-colors">
                        {note.title}
                      </h3>

                      {/* Content Preview */}
                      <p className="text-white/70 text-sm line-clamp-3 mb-4">
                        {truncateContent(note.content || '')}
                      </p>

                      {/* Tags */}
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {note.tags.slice(0, 2).map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="outline"
                              className="text-xs border-white/20 text-white/70 px-2 py-0.5"
                            >
                              <Tag className="w-2 h-2 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {note.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                              +{note.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Location */}
                      {note.location && (
                        <div className="flex items-center gap-1 mb-3 text-white/60 text-xs">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{note.location}</span>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-4 mb-4 text-xs text-white/50">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{note.views_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>{note.likes_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span className="hidden sm:inline">{formatTimeAgo(note.updated_at)}</span>
                          <span className="sm:hidden">{formatTimeAgo(note.updated_at).split(' ')[0]}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {isOwnProfile && (
                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-white/10"
                              onClick={(e) => handleQuickAction(e, () => onEdit(note), 'Edit')}
                            >
                              <Edit3 className="w-3 h-3 text-blue-400" />
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-white/10"
                              onClick={(e) => handleQuickAction(e, () => onTogglePin(note.id, !note.is_pinned), 'Toggle Pin')}
                            >
                              {note.is_pinned ? (
                                <PinOff className="w-3 h-3 text-yellow-400" />
                              ) : (
                                <Pin className="w-3 h-3 text-white/60" />
                              )}
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-white/10"
                              onClick={(e) => handleQuickAction(e, () => onTogglePrivacy(note.id, !note.is_private), 'Toggle Privacy')}
                            >
                              {note.is_private ? (
                                <Lock className="w-3 h-3 text-red-400" />
                              ) : (
                                <Globe className="w-3 h-3 text-green-400" />
                              )}
                            </Button>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-white/10"
                              onClick={(e) => handleQuickAction(e, () => onToggleArchive(note.id, !note.is_archived), 'Toggle Archive')}
                            >
                              {note.is_archived ? (
                                <ArchiveRestore className="w-3 h-3 text-blue-400" />
                              ) : (
                                <Archive className="w-3 h-3 text-white/60" />
                              )}
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-red-500/20 text-red-400"
                              onClick={(e) => handleQuickAction(e, () => onDelete(note.id), 'Delete')}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>

                    {/* Gradient Border Effect */}
                    <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${categoryColor} opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none`} />
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-4">
          <Reorder.Group 
            axis="y" 
            values={reorderedNotes} 
            onReorder={setReorderedNotes}
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {reorderedNotes.map((note, index) => {
                const categoryColor = categoryColors[note.category] || 'from-gray-400 to-slate-500';
                const categoryIcon = categoryIcons[note.category] || '📄';

                return (
                  <Reorder.Item
                    key={note.id}
                    value={note}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    whileDrag={{ scale: 1.02 }}
                  >
                    <Card 
                      className="group relative overflow-hidden transition-all duration-300 cursor-pointer bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                      onClick={() => handleNoteClick(note)}
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            {/* Category and Privacy Badges */}
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <div className={`px-2 py-1 rounded-full bg-gradient-to-r ${categoryColor}/20 border border-white/20`}>
                                <span className="text-xs font-medium text-white flex items-center gap-1">
                                  <span>{categoryIcon}</span>
                                  <span className="capitalize">{note.category}</span>
                                </span>
                              </div>
                              <Badge variant="outline" className={`text-xs ${note.is_private ? 'border-red-400/30 text-red-400' : 'border-green-400/30 text-green-400'}`}>
                                {note.is_private ? (
                                  <>
                                    <Lock className="w-2 h-2 mr-1" />
                                    Privat
                                  </>
                                ) : (
                                  <>
                                    <Globe className="w-2 h-2 mr-1" />
                                    Publik
                                  </>
                                )}
                              </Badge>
                              {note.is_pinned && (
                                <Badge variant="outline" className="text-xs border-yellow-400/30 text-yellow-400">
                                  <Pin className="w-2 h-2 mr-1" />
                                  Pinned
                                </Badge>
                              )}
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-200 transition-colors">
                              {note.title}
                            </h3>

                            {/* Content Preview */}
                            <p className="text-white/70 text-sm mb-3 line-clamp-2">
                              {truncateContent(note.content || '', 200)}
                            </p>

                            {/* Meta Information */}
                            <div className="flex items-center gap-4 text-xs text-white/50">
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>{note.views_count || 0} views</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                <span>{note.likes_count || 0} likes</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatTimeAgo(note.updated_at)}</span>
                              </div>
                              {note.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span className="truncate max-w-32">{note.location}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          {isOwnProfile && (
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-white/10"
                                onClick={(e) => handleQuickAction(e, () => onEdit(note), 'Edit')}
                              >
                                <Edit3 className="w-3 h-3 text-blue-400" />
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-white/10"
                                onClick={(e) => handleQuickAction(e, () => onTogglePin(note.id, !note.is_pinned), 'Toggle Pin')}
                              >
                                {note.is_pinned ? (
                                  <PinOff className="w-3 h-3 text-yellow-400" />
                                ) : (
                                  <Pin className="w-3 h-3 text-white/60" />
                                )}
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-white/10"
                                onClick={(e) => handleQuickAction(e, () => onTogglePrivacy(note.id, !note.is_private), 'Toggle Privacy')}
                              >
                                {note.is_private ? (
                                  <Lock className="w-3 h-3 text-red-400" />
                                ) : (
                                  <Globe className="w-3 h-3 text-green-400" />
                                )}
                              </Button>

                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-white/10"
                                onClick={(e) => handleQuickAction(e, () => onToggleArchive(note.id, !note.is_archived), 'Toggle Archive')}
                              >
                                {note.is_archived ? (
                                  <ArchiveRestore className="w-3 h-3 text-blue-400" />
                                ) : (
                                  <Archive className="w-3 h-3 text-white/60" />
                                )}
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-red-500/20 text-red-400"
                                onClick={(e) => handleQuickAction(e, () => onDelete(note.id), 'Delete')}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Reorder.Item>
                );
              })}
            </AnimatePresence>
          </Reorder.Group>
        </div>
      )}
    </div>
  );
};

export default ModernNotesGrid;
