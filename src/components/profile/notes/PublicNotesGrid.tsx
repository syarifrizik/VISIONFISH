import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock,
  MapPin,
  Tag,
  Globe,
  Pin
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';
import { noteInteractionsService } from '@/services/noteInteractionsService';

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

interface PublicNotesGridProps {
  notes: Note[];
  viewMode: 'grid' | 'list';
  onView: (note: Note) => void;
  isLoading?: boolean;
  profileOwnerName?: string;
}

const PublicNotesGrid = ({
  notes,
  viewMode,
  onView,
  isLoading = false,
  profileOwnerName = 'User'
}: PublicNotesGridProps) => {
  const { user } = useAuth();

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

  // Filter out private notes for public view (should already be filtered by backend)
  const publicNotes = notes.filter(note => !note.is_private);

  // Debug logging
  useEffect(() => {
    console.log('PublicNotesGrid: Received notes:', notes.length);
    console.log('PublicNotesGrid: Public notes after filter:', publicNotes.length);
    console.log('PublicNotesGrid: Sample notes:', notes.slice(0, 3));
  }, [notes, publicNotes]);

  // Handle note view with proper view tracking (only for non-owners)
  const handleNoteView = async (note: Note) => {
    // Only record view if user is authenticated and it's not their own note
    if (user?.id && user.id !== note.user_id) {
      console.log('Recording view for note from another user');
      const hasViewed = await noteInteractionsService.hasUserViewedNote(note.id, user.id);
      
      if (!hasViewed) {
        await noteInteractionsService.recordView(note.id, user.id);
      } else {
        console.log('User has already viewed this note, skipping view recording');
      }
    } else if (user?.id === note.user_id) {
      console.log('Owner viewing their own note, not recording view');
    }
    
    // Call the parent's onView handler
    onView(note);
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

  if (publicNotes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 max-w-md mx-auto">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-white mb-2">Tidak Ada Catatan Publik</h3>
          <p className="text-white/60 mb-6">
            {notes.length > 0 
              ? `${profileOwnerName} memiliki ${notes.length} catatan, tetapi semuanya bersifat privat`
              : `${profileOwnerName} belum membuat catatan publik apa pun`
            }
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Public Profile Header */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-medium">Melihat Catatan Publik</h3>
            <p className="text-white/60 text-sm">
              Catatan dari {profileOwnerName} • {publicNotes.length} catatan publik
            </p>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {publicNotes.map((note, index) => {
          const categoryColor = categoryColors[note.category] || 'from-gray-400 to-slate-500';
          const categoryIcon = categoryIcons[note.category] || '📄';

          return (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <Card 
                className="group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                onClick={() => handleNoteView(note)}
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
                  {/* Category Badge */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <div className={`px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r ${categoryColor}/20 border border-white/20`}>
                      <span className="text-xs font-medium text-white flex items-center gap-1">
                        <span>{categoryIcon}</span>
                        <span className="capitalize hidden sm:inline">{note.category}</span>
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs border-green-400/30 text-green-400">
                      <Globe className="w-2 h-2 mr-1" />
                      <span className="hidden sm:inline">Publik</span>
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

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span className="hidden sm:inline">{formatTimeAgo(note.updated_at)}</span>
                      <span className="sm:hidden">{formatTimeAgo(note.updated_at).split(' ')[0]}</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-blue-400">Klik untuk melihat</span>
                    </div>
                  </div>
                </CardContent>

                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${categoryColor} opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none`} />
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PublicNotesGrid;
