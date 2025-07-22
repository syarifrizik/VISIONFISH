
import React, { useState, useEffect } from 'react';
import { Bookmark, Heart, Eye, MessageCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SavedPost {
  id: string;
  created_at: string;
  community_posts: {
    id: string;
    title: string;
    content?: string;
    image_url?: string;
    location?: string;
    likes_count: number;
    views_count: number;
    created_at: string;
    profiles?: {
      display_name: string;
      username: string;
      avatar_url?: string;
    };
  };
}

interface SavedPostsTabProps {
  onPostClick?: (postId: string) => void;
}

const SavedPostsTab: React.FC<SavedPostsTabProps> = ({ onPostClick }) => {
  const { user } = useAuth();
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchSavedPosts();
    }
  }, [user?.id]);

  const fetchSavedPosts = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('post_bookmarks')
        .select(`
          id,
          created_at,
          community_posts!inner (
            id,
            title,
            content,
            image_url,
            location,
            likes_count,
            views_count,
            created_at,
            profiles:user_id (
              display_name,
              username,
              avatar_url
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedPosts(data || []);
    } catch (error) {
      console.error('Error fetching saved posts:', error);
      toast.error('Gagal memuat saved posts');
    } finally {
      setIsLoading(false);
    }
  };

  const removeSavedPost = async (bookmarkId: string) => {
    try {
      const { error } = await supabase
        .from('post_bookmarks')
        .delete()
        .eq('id', bookmarkId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setSavedPosts(prev => prev.filter(post => post.id !== bookmarkId));
      toast.success('Post dihapus dari saved');
    } catch (error) {
      console.error('Error removing saved post:', error);
      toast.error('Gagal menghapus saved post');
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

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-white/60" />
        <span className="ml-2 text-white/60">Memuat saved posts...</span>
      </div>
    );
  }

  if (savedPosts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4">
          <Bookmark className="w-8 h-8 text-white/60" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Belum Ada Saved Posts</h3>
        <p className="text-sm text-white/70">
          Posts yang kamu save akan muncul di sini
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {savedPosts.map((savedPost) => {
        const post = savedPost.community_posts;
        return (
          <div 
            key={savedPost.id} 
            className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300"
          >
            <div className="p-6">
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
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
                      <span>Saved {formatDate(savedPost.created_at)}</span>
                      <span>•</span>
                      <span>Posted {formatDate(post.created_at)}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSavedPost(savedPost.id)}
                  className="text-white/60 hover:text-red-400 hover:bg-red-500/20"
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </Button>
              </div>

              {/* Post Content */}
              <div className="mb-4 cursor-pointer" onClick={() => onPostClick?.(post.id)}>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {post.title}
                </h3>
                {post.content && (
                  <p className="text-white/80 leading-relaxed">
                    {truncateText(post.content, 150)}
                  </p>
                )}
                {post.location && (
                  <p className="text-white/60 text-sm mt-2">
                    📍 {post.location}
                  </p>
                )}
              </div>

              {/* Post Image */}
              {post.image_url && (
                <div className="mb-4 rounded-xl overflow-hidden cursor-pointer" onClick={() => onPostClick?.(post.id)}>
                  <img 
                    src={post.image_url} 
                    alt="Post content" 
                    className="w-full h-48 object-cover" 
                  />
                </div>
              )}

              {/* Post Stats */}
              <div className="flex items-center gap-4 text-white/60 text-sm">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{post.likes_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.views_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>0</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SavedPostsTab;
