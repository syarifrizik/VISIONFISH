
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Eye, MessageCircle, MapPin, X, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { toast } from 'sonner';

interface PostComment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string;
    username: string;
    avatar_url?: string;
  };
}

interface PostDetail {
  id: string;
  title: string;
  content?: string;
  image_url?: string;
  location?: string;
  likes_count: number;
  views_count: number;
  created_at: string;
  user_id: string;
  profiles: {
    display_name: string;
    username: string;
    avatar_url?: string;
  };
  user_has_liked?: boolean;
}

interface PostDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  onLike?: (postId: string) => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({
  open,
  onOpenChange,
  postId,
  onLike
}) => {
  const { user } = useAuth();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    if (open && postId) {
      fetchPostDetail();
      fetchComments();
    }
  }, [open, postId]);

  const fetchPostDetail = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles:user_id (
            display_name,
            username,
            avatar_url
          )
        `)
        .eq('id', postId)
        .single();

      if (error) throw error;

      // Check if user has liked this post
      if (user?.id) {
        const { data: likeData } = await supabase
          .from('community_post_likes')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .single();

        setPost({
          ...data,
          user_has_liked: !!likeData
        });
      } else {
        setPost(data);
      }
    } catch (error) {
      console.error('Error fetching post detail:', error);
      toast.error('Gagal memuat detail post');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles:user_id (
            display_name,
            username,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const submitComment = async () => {
    if (!user?.id || !newComment.trim()) return;

    try {
      setIsSubmittingComment(true);
      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: newComment.trim()
        });

      if (error) throw error;

      setNewComment('');
      fetchComments(); // Refresh comments
      toast.success('Komentar berhasil ditambahkan');
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('Gagal menambahkan komentar');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: idLocale
      });
    } catch {
      return 'Baru saja';
    }
  };

  if (!post && !isLoading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-white/20 overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <h2 className="text-xl font-bold text-white">Detail Post</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-white/60" />
          </div>
        ) : post ? (
          <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Post Content */}
            <div className="space-y-4">
              {/* Author Info */}
              <div className="flex items-center gap-3">
                <img 
                  src={post.profiles?.avatar_url || '/api/placeholder/40/40'} 
                  alt={post.profiles?.display_name || 'User'} 
                  className="w-10 h-10 rounded-full border border-white/20" 
                />
                <div>
                  <h4 className="text-white font-medium">
                    {post.profiles?.display_name || 'Anonymous'}
                  </h4>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <span>{formatDate(post.created_at)}</span>
                    {post.location && (
                      <>
                        <span>•</span>
                        <MapPin className="w-3 h-3" />
                        <span>{post.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Title and Content */}
              <div>
                <h3 className="text-white font-semibold text-xl mb-3">
                  {post.title}
                </h3>
                {post.content && (
                  <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
                )}
              </div>

              {/* Image */}
              {post.image_url && (
                <div className="rounded-xl overflow-hidden">
                  <img 
                    src={post.image_url} 
                    alt="Post content" 
                    className="w-full max-h-96 object-cover" 
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLike?.(post.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      post.user_has_liked 
                        ? 'text-red-400 bg-red-500/20 hover:bg-red-500/30' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.user_has_liked ? 'fill-current' : ''}`} />
                    <span>{post.likes_count}</span>
                  </Button>
                  
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <MessageCircle className="w-4 h-4" />
                    <span>{comments.length}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Eye className="w-4 h-4" />
                  <span>{post.views_count} dilihat</span>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-4 border-t border-white/10 pt-6">
              <h4 className="text-white font-semibold">Komentar ({comments.length})</h4>
              
              {/* Add Comment */}
              {user && (
                <div className="flex gap-3">
                  <img 
                    src={user.user_metadata?.avatar_url || '/api/placeholder/32/32'} 
                    alt="You" 
                    className="w-8 h-8 rounded-full border border-white/20" 
                  />
                  <div className="flex-1 space-y-2">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Tulis komentar..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 resize-none"
                      rows={2}
                    />
                    <Button
                      onClick={submitComment}
                      disabled={!newComment.trim() || isSubmittingComment}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmittingComment ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Kirim
                    </Button>
                  </div>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <img 
                      src={comment.profiles?.avatar_url || '/api/placeholder/32/32'} 
                      alt={comment.profiles?.display_name || 'User'} 
                      className="w-8 h-8 rounded-full border border-white/20" 
                    />
                    <div className="flex-1">
                      <div className="bg-white/10 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium text-sm">
                            {comment.profiles?.display_name || 'Anonymous'}
                          </span>
                          <span className="text-white/60 text-xs">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-white/80 text-sm whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {comments.length === 0 && (
                  <p className="text-white/60 text-center py-4">
                    Belum ada komentar. Jadilah yang pertama berkomentar!
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default PostDetailModal;
