
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageCircle, 
  MoreHorizontal,
  Fish,
  MapPin,
  Clock,
  User,
  Eye,
  Bookmark
} from 'lucide-react';
import { UserProfile, ProfileStats } from '@/types/profile';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePostActions } from '@/hooks/usePostActions';

interface SocialPost {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  location?: string;
  created_at: string;
  likes_count: number;
  views_count: number;
  profile?: {
    display_name: string;
    username: string;
    avatar_url?: string;
  };
}

interface EnhancedSocialFeedProps {
  user: UserProfile;
  stats: ProfileStats;
}

const EnhancedSocialFeed = ({ user, stats }: EnhancedSocialFeedProps) => {
  const { user: currentUser } = useAuth();
  const { toggleBookmark, checkIfBookmarked, isLoading } = usePostActions();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadSocialFeed();
  }, []);

  const loadSocialFeed = async () => {
    try {
      // Load from community posts and user profile items
      const [communityRes, profileItemsRes] = await Promise.allSettled([
        supabase
          .from('community_posts')
          .select(`
            id,
            user_id,
            title as content,
            image_url,
            location,
            created_at,
            likes_count,
            views_count
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(5),
        
        supabase
          .from('user_profile_items')
          .select(`
            id,
            user_id,
            title as content,
            image_url,
            location,
            created_at,
            likes_count,
            views_count
          `)
          .eq('is_private', false)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      let allPosts: any[] = [];
      
      if (communityRes.status === 'fulfilled' && communityRes.value.data) {
        allPosts = [...allPosts, ...communityRes.value.data];
      }
      
      if (profileItemsRes.status === 'fulfilled' && profileItemsRes.value.data) {
        allPosts = [...allPosts, ...profileItemsRes.value.data];
      }

      // Sort by created_at and limit
      allPosts = allPosts
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 8);

      // Add mock profile data
      const postsWithProfiles = allPosts.map(post => ({
        ...post,
        profile: {
          display_name: 'Angler Pro',
          username: 'angler_pro',
          avatar_url: null
        }
      }));

      setPosts(postsWithProfiles);

      // Check bookmark status for each post
      if (currentUser) {
        const bookmarkChecks = await Promise.all(
          postsWithProfiles.map(post => checkIfBookmarked(post.id))
        );
        const bookmarkedSet = new Set<string>();
        postsWithProfiles.forEach((post, index) => {
          if (bookmarkChecks[index]) {
            bookmarkedSet.add(post.id);
          }
        });
        setBookmarkedPosts(bookmarkedSet);
      }
    } catch (error) {
      console.error('Error loading social feed:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleBookmark = async (postId: string) => {
    const isBookmarked = await toggleBookmark(postId);
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev);
      if (isBookmarked) {
        newSet.add(postId);
      } else {
        newSet.delete(postId);
      }
      return newSet;
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Baru saja';
    if (diffInHours < 24) return `${diffInHours}j yang lalu`;
    return `${Math.floor(diffInHours / 24)}h yang lalu`;
  };

  if (loadingData) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 bg-white/10 backdrop-blur-xl border-white/20 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                <div className="h-16 bg-white/20 rounded"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Fish className="w-5 h-5" />
          Social Feed
        </h3>
        <Badge className="bg-white/20 text-white border-white/30">
          {posts.length} posts
        </Badge>
      </div>

      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {post.profile?.display_name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">
                      {post.profile?.display_name || 'Angler'}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(post.created_at)}</span>
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
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white/60 hover:text-white">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* Post Content */}
              <div className="mb-3">
                <p className="text-white text-sm leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Post Image */}
              {post.image_url && (
                <div className="mb-3 rounded-xl overflow-hidden">
                  <img 
                    src={post.image_url} 
                    alt="Post content"
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-white/70 hover:text-red-400">
                    <Heart className="w-4 h-4 mr-1" />
                    <span className="text-xs">{post.likes_count || 0}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-white/70 hover:text-blue-400">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span className="text-xs">0</span>
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-white/50">
                    <Eye className="w-3 h-3" />
                    <span>{post.views_count || 0}</span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-8 w-8 p-0 transition-all ${
                      bookmarkedPosts.has(post.id)
                        ? 'text-yellow-400 hover:text-yellow-300'
                        : 'text-white/60 hover:text-yellow-400'
                    }`}
                    onClick={() => handleBookmark(post.id)}
                    disabled={isLoading}
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarkedPosts.has(post.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {posts.length === 0 && (
        <Card className="p-8 bg-white/10 backdrop-blur-xl border-white/20 text-center">
          <Fish className="w-12 h-12 mx-auto mb-4 text-white/50" />
          <h3 className="text-lg font-medium text-white mb-2">
            Belum Ada Aktivitas
          </h3>
          <p className="text-white/60 text-sm">
            Mulai berbagi pengalaman memancing Anda
          </p>
        </Card>
      )}
    </div>
  );
};

export default EnhancedSocialFeed;
