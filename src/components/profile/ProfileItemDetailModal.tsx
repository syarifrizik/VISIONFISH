
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, User, Trophy, Target, TrendingUp, Heart, MessageCircle, Share2, Eye } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { getComments, addComment, ProfileItemComment } from '@/services/profileItemInteractionsService';
import { supabase } from '@/integrations/supabase/client';
import ProfileItemInteractions from './ProfileItemInteractions';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface ProfileItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    category: string;
    date?: string;
    location?: string;
    stats: {
      views: number;
      likes: number;
      comments: number;
      shares: number;
    };
    ownerId: string;
    ownerName?: string;
    ownerAvatar?: string;
    isPrivate?: boolean;
  };
}

interface CommentWithProfile extends ProfileItemComment {
  profile?: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

const ProfileItemDetailModal = ({ isOpen, onClose, item }: ProfileItemDetailModalProps) => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  
  const [comments, setComments] = useState<CommentWithProfile[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && item.id) {
      loadComments();
      setImageLoaded(false);
    }
  }, [isOpen, item.id]);

  const loadComments = async () => {
    setIsLoadingComments(true);
    try {
      const commentsData = await getComments(item.id);
      
      // Fetch user profiles for comments
      if (commentsData.length > 0) {
        const userIds = [...new Set(commentsData.map(c => c.user_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username, display_name, avatar_url')
          .in('id', userIds);

        const profileMap = (profiles || []).reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>);

        const commentsWithProfiles = commentsData.map(comment => ({
          ...comment,
          profile: profileMap[comment.user_id]
        }));

        setComments(commentsWithProfiles);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      showNotification('Gagal memuat komentar', 'error');
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user?.id) {
      showNotification('Silakan login untuk berkomentar', 'error');
      return;
    }

    if (!newComment.trim()) {
      showNotification('Komentar tidak boleh kosong', 'error');
      return;
    }

    setIsSubmittingComment(true);
    try {
      const result = await addComment(item.id, user.id, newComment.trim());
      if (result.success) {
        setNewComment('');
        await loadComments(); // Reload comments
        showNotification('Komentar berhasil ditambahkan', 'success');
      } else {
        showNotification('Gagal menambahkan komentar', 'error');
      }
    } catch (error) {
      showNotification('Terjadi kesalahan', 'error');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    if (!category) return <Target className="w-4 h-4" />;
    
    switch (category.toLowerCase()) {
      case 'achievement':
        return <Trophy className="w-4 h-4" />;
      case 'activity':
        return <Target className="w-4 h-4" />;
      case 'statistic':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    if (!category) return 'from-gray-500 to-gray-600';
    
    switch (category.toLowerCase()) {
      case 'achievement':
        return 'from-yellow-500 to-yellow-600';
      case 'activity':
        return 'from-blue-500 to-cyan-500';
      case 'statistic':
        return 'from-emerald-500 to-green-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  // Safety check for item data
  if (!item || !item.id) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] p-0 overflow-hidden bg-transparent border-0 gap-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full"
        >
          {/* Glass Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/60 backdrop-blur-xl rounded-2xl" />
          
          {/* Close Button */}
          <Button
            onClick={onClose}
            size="sm"
            variant="ghost"
            className="absolute top-4 right-4 z-50 bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10 p-0"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="relative z-10 flex flex-col md:flex-row h-full max-h-[95vh] rounded-2xl overflow-hidden">
            {/* Left side - Image/Visual */}
            <div className="w-full md:w-3/5 relative flex items-center justify-center bg-black/20">
              {item.imageUrl ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoaded(true)}
                  />
                </div>
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(item.category)} flex items-center justify-center`}>
                  <div className="text-white text-center">
                    <div className="text-8xl mb-4 opacity-80">
                      {getCategoryIcon(item.category)}
                    </div>
                    <h3 className="text-2xl font-semibold opacity-90">{item.category || 'Unknown'}</h3>
                  </div>
                </div>
              )}
              
              {/* Category badge */}
              <div className="absolute top-4 left-4">
                <Badge className={`bg-gradient-to-r ${getCategoryColor(item.category)} text-white border-0 flex items-center gap-1`}>
                  {getCategoryIcon(item.category)}
                  {item.category || 'Unknown'}
                </Badge>
              </div>
            </div>

            {/* Right side - Content and Comments */}
            <div className="w-full md:w-2/5 flex flex-col bg-white/5 backdrop-blur-sm">
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                {/* Owner info */}
                {item.ownerName && (
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-12 h-12 border-2 border-white/20">
                      <AvatarImage src={item.ownerAvatar} />
                      <AvatarFallback className="bg-[#6E3482] text-white">
                        {item.ownerName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-white text-lg">{item.ownerName}</p>
                      {item.date && (
                        <p className="text-sm text-white/70">
                          {formatDistanceToNow(new Date(item.date), { addSuffix: true, locale: idLocale })}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Title and description */}
                <h2 className="text-2xl font-bold text-white mb-3">{item.title}</h2>
                {item.description && (
                  <p className="text-white/80 mb-4 leading-relaxed">{item.description}</p>
                )}

                {/* Meta info */}
                <div className="flex flex-wrap gap-4 text-sm text-white/70 mb-4">
                  {item.location && (
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                      <MapPin className="w-4 h-4" />
                      <span>{item.location}</span>
                    </div>
                  )}
                  {item.date && (
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(item.date).toLocaleDateString('id-ID')}</span>
                    </div>
                  )}
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { icon: Eye, label: 'Views', value: item.stats.views, color: 'text-blue-400' },
                    { icon: Heart, label: 'Likes', value: item.stats.likes, color: 'text-red-400' },
                    { icon: MessageCircle, label: 'Comments', value: item.stats.comments, color: 'text-green-400' },
                    { icon: Share2, label: 'Shares', value: item.stats.shares, color: 'text-purple-400' }
                  ].map((stat) => (
                    <div key={stat.label} className="text-center bg-white/5 rounded-lg p-3">
                      <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                      <p className="text-lg font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-white/60">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Interactions */}
                <ProfileItemInteractions
                  itemId={item.id}
                  ownerId={item.ownerId}
                  initialStats={item.stats}
                  onViewComments={() => {}}
                  onShare={() => showNotification('Link berhasil disalin!', 'success')}
                />
              </div>

              {/* Comments Section */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="p-4 border-b border-white/10">
                  <h3 className="font-semibold text-white text-lg">
                    Komentar ({comments.length})
                  </h3>
                </div>

                {/* Comments list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {isLoadingComments ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-white/20 rounded animate-pulse"></div>
                            <div className="h-3 bg-white/20 rounded w-2/3 animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-white/70">Belum ada komentar</p>
                      <p className="text-sm text-white/50">Jadilah yang pertama berkomentar!</p>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {comments.map((comment, index) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex gap-3"
                        >
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarImage src={comment.profile?.avatar_url} />
                            <AvatarFallback className="bg-[#6E3482] text-white text-xs">
                              {(comment.profile?.display_name || comment.profile?.username || 'U').charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="bg-white/10 rounded-lg p-3">
                              <p className="font-medium text-white text-sm">
                                {comment.profile?.display_name || comment.profile?.username || 'Pengguna'}
                              </p>
                              <p className="text-white/80 text-sm mt-1 break-words">
                                {comment.content}
                              </p>
                            </div>
                            <p className="text-xs text-white/50 mt-1 ml-3">
                              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: idLocale })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>

                {/* Comment input */}
                {user ? (
                  <div className="p-4 border-t border-white/10">
                    <div className="flex gap-3">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-[#6E3482] text-white text-xs">
                          {(user.user_metadata?.display_name || user.email || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Textarea
                          placeholder="Tulis komentar..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="resize-none bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                          rows={2}
                        />
                        <Button
                          onClick={handleSubmitComment}
                          disabled={isSubmittingComment || !newComment.trim()}
                          size="sm"
                          className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white"
                        >
                          {isSubmittingComment ? 'Mengirim...' : 'Kirim'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border-t border-white/10 text-center">
                    <p className="text-white/70 mb-2">Masuk untuk berkomentar</p>
                    <Button
                      onClick={() => window.location.href = '/auth'}
                      size="sm"
                      className="bg-gradient-to-r from-[#6E3482] to-[#A56ABD] hover:from-[#49225B] hover:to-[#6E3482] text-white"
                    >
                      Masuk
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileItemDetailModal;
