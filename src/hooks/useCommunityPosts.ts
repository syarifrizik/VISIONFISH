import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content?: string;
  image_url?: string;
  location?: string;
  likes_count: number;
  views_count: number;
  is_active: boolean;
  is_private?: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    display_name: string;
    username: string;
    avatar_url?: string;
  };
  user_has_liked?: boolean;
}

// Add caching layer
const postsCache = new Map<string, { data: CommunityPost[]; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

export const useCommunityPosts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<any>(null);
  const isCleaningUpRef = useRef(false);
  const fetchTimeoutRef = useRef<NodeJS.Timeout>();

  const cleanupSubscriptions = useCallback(async () => {
    if (isCleaningUpRef.current) return;
    
    isCleaningUpRef.current = true;
    
    if (channelRef.current) {
      console.log('Cleaning up community subscriptions...');
      try {
        const channel = channelRef.current;
        channelRef.current = null;
        
        await supabase.removeChannel(channel);
        await new Promise(resolve => setTimeout(resolve, 50)); // Reduced cleanup time
      } catch (error) {
        console.warn('Error cleaning up community subscriptions:', error);
      }
    }
    
    isCleaningUpRef.current = false;
  }, []);

  const fetchPosts = useCallback(async (useCache = true) => {
    try {
      // Check cache first
      const cacheKey = user?.id || 'guest';
      const cached = postsCache.get(cacheKey);
      const now = Date.now();
      
      if (useCache && cached && (now - cached.timestamp) < CACHE_DURATION) {
        console.log('Using cached community posts');
        setPosts(cached.data);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      console.log('Fetching fresh community posts...');
      
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
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20); // Reduced limit for faster loading

      if (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }

      console.log('Fetched posts:', data?.length || 0);

      let postsWithLikes = data || [];

      // Check likes in parallel only if user is logged in
      if (user?.id && data?.length) {
        const postIds = data.map(post => post.id);
        const { data: likes } = await supabase
          .from('community_post_likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postIds);

        const likedPostIds = new Set(likes?.map(like => like.post_id) || []);
        
        postsWithLikes = data.map(post => ({
          ...post,
          user_has_liked: likedPostIds.has(post.id)
        }));
      }
      
      // Cache the result
      postsCache.set(cacheKey, { data: postsWithLikes, timestamp: now });
      setPosts(postsWithLikes);
    } catch (err) {
      console.error('Error fetching community posts:', err);
      toast({
        title: "❌ Gagal memuat post",
        description: "Menggunakan mode darurat",
        variant: "destructive"
      });
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  const setupRealtimeSubscription = useCallback(async () => {
    if (!user?.id || channelRef.current || isCleaningUpRef.current) {
      console.log('Skipping community subscription - already exists or cleaning up');
      return;
    }

    try {
      console.log('Setting up community subscription...');
      
      const channelName = `community_updates_${user.id}_${Date.now()}`;
      
      const channel = supabase
        .channel(channelName)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'community_posts'
        }, (payload) => {
          console.log('Community posts updated:', payload);
          // Debounce the refetch
          if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current);
          }
          fetchTimeoutRef.current = setTimeout(() => {
            if (!isCleaningUpRef.current) {
              fetchPosts(false); // Skip cache for real-time updates
            }
          }, 300); // Reduced debounce time
        })
        .subscribe((status) => {
          console.log('Community subscription status:', status);
        });

      channelRef.current = channel;
    } catch (error) {
      console.error('Error setting up community subscription:', error);
    }
  }, [user?.id, fetchPosts]);

  useEffect(() => {
    let isMounted = true;
    
    const initializeCommunity = async () => {
      if (!isMounted) return;
      
      try {
        await cleanupSubscriptions();
        
        if (!isMounted) return;
        
        await fetchPosts(true); // Use cache on initial load
        
        if (!isMounted) return;
        
        // Setup subscription with reduced delay
        setTimeout(() => {
          if (isMounted && !isCleaningUpRef.current) {
            setupRealtimeSubscription();
          }
        }, 100);
      } catch (error) {
        console.error('Error initializing community:', error);
        setIsLoading(false);
      }
    };

    initializeCommunity();

    return () => {
      isMounted = false;
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      cleanupSubscriptions();
    };
  }, [user?.id, cleanupSubscriptions, fetchPosts, setupRealtimeSubscription]);

  const createPost = async (postData: Partial<CommunityPost> & { imageUrl?: string }) => {
    if (!user?.id) {
      toast({
        title: "❌ Tidak dapat membuat post",
        description: "Anda harus login terlebih dahulu",
        variant: "destructive"
      });
      return null;
    }

    try {
      console.log('Creating post with data:', postData);
      
      const postPayload = {
        title: postData.title || 'Untitled Post',
        content: postData.content || null,
        image_url: postData.imageUrl || null,
        location: postData.location || null,
        is_private: postData.is_private || false,
        user_id: user.id,
        is_active: true,
        likes_count: 0,
        views_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('community_posts')
        .insert(postPayload)
        .select(`
          *,
          profiles:user_id (
            display_name,
            username,
            avatar_url
          )
        `)
        .single();

      if (error) {
        console.error('Database error creating post:', error);
        throw error;
      }

      // Clear cache to force refresh
      postsCache.clear();

      toast({
        title: "🎉 Post berhasil dibuat",
        description: postData.is_private ? "Post privat telah dipublikasikan" : "Post publik telah dipublikasikan"
      });

      return data;
    } catch (err) {
      console.error('Error creating post:', err);
      toast({
        title: "❌ Gagal membuat post",
        description: "Silakan coba lagi",
        variant: "destructive"
      });
      return null;
    }
  };

  const updatePost = async (postId: string, updates: Partial<CommunityPost>) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('community_posts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Clear cache
      postsCache.clear();

      toast({
        title: "✅ Post berhasil diperbarui",
        description: "Perubahan telah disimpan"
      });

      return data;
    } catch (err) {
      console.error('Error updating post:', err);
      toast({
        title: "❌ Gagal memperbarui post",
        description: err instanceof Error ? err.message : "Gagal memperbarui post",
        variant: "destructive"
      });
      return null;
    }
  };

  const deletePost = async (postId: string) => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('community_posts')
        .update({ is_active: false })
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Clear cache
      postsCache.clear();

      toast({
        title: "🗑️ Post berhasil dihapus",
        description: "Post telah dihapus dari komunitas"
      });

      return true;
    } catch (err) {
      console.error('Error deleting post:', err);
      toast({
        title: "❌ Gagal menghapus post",
        description: err instanceof Error ? err.message : "Gagal menghapus post",
        variant: "destructive"
      });
      return false;
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user?.id) {
      toast({
        title: "❌ Tidak dapat menyukai post",
        description: "Anda harus login terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    const currentPost = posts.find(p => p.id === postId);
    if (!currentPost) return;

    try {
      // Optimistic update
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { 
              ...p, 
              user_has_liked: !p.user_has_liked,
              likes_count: p.user_has_liked ? p.likes_count - 1 : p.likes_count + 1
            }
          : p
      ));

      if (currentPost.user_has_liked) {
        const { error } = await supabase
          .from('community_post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('community_post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });

        if (error) throw error;
      }

      // Clear cache to sync with server
      postsCache.clear();
    } catch (err) {
      console.error('Error toggling like:', err);
      // Revert optimistic update
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { 
              ...p, 
              user_has_liked: currentPost.user_has_liked,
              likes_count: currentPost.likes_count
            }
          : p
      ));
      toast({
        title: "❌ Gagal",
        description: "Gagal memperbarui status suka",
        variant: "destructive"
      });
    }
  };

  return {
    posts,
    isLoading,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    refetch: () => fetchPosts(false)
  };
};
