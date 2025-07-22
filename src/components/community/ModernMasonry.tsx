import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Heart, Eye, MapPin, Lock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { getOptimizedImageUrl } from '@/lib/imagekit';
import { useCommunityPostViews } from '@/hooks/useCommunityPostViews';
import { PostContextMenu } from './PostContextMenu';

const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const get = () =>
    values[queries.findIndex((q) => matchMedia(q).matches)] ?? defaultValue;

  const [value, setValue] = useState<number>(get);

  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach((q) => matchMedia(q).addEventListener("change", handler));
    return () =>
      queries.forEach((q) =>
        matchMedia(q).removeEventListener("change", handler)
      );
  }, [queries]);

  return value;
};

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
};

interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content?: string;
  image_url?: string;
  location?: string;
  likes_count: number;
  views_count: number;
  is_private?: boolean;
  created_at: string;
  profiles?: {
    display_name: string;
    username: string;
    avatar_url?: string;
  };
  user_has_liked?: boolean;
}

interface ModernMasonryProps {
  posts: CommunityPost[];
  onLike: (postId: string) => void;
  onEdit?: (post: CommunityPost) => void;
  onDelete?: (postId: string) => void;
  currentUserId?: string;
  onRefresh?: () => void;
}

// Individual post card component to handle views
const PostCard: React.FC<{
  post: CommunityPost & { x: number; y: number; w: number; h: number };
  onLike: (postId: string) => void;
  currentUserId?: string;
  formatDate: (dateString: string) => string;
  onRefresh?: () => void;
}> = ({ post, onLike, currentUserId, formatDate, onRefresh }) => {
  const [localViewsCount, setLocalViewsCount] = useState(post.views_count);
  const { elementRef, hasViewed, recordViewManually } = useCommunityPostViews({
    postId: post.id,
    onViewRecorded: (isFirstView) => {
      if (isFirstView) {
        setLocalViewsCount(prev => prev + 1);
      }
    }
  });

  const handleViewClick = async () => {
    const result = await recordViewManually();
    if (result.success && result.isFirstView) {
      console.log('Manual view recorded for post:', post.id);
    }
  };

  const handlePostEdit = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const handlePostDelete = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div
      ref={elementRef}
      data-post-id={post.id}
      className="absolute bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden shadow-lg transition-all duration-300 hover:bg-white/15 hover:scale-[1.02] hover:shadow-xl"
      style={{
        transform: `translateX(${post.x}px) translateY(${post.y}px)`,
        width: post.w,
        minHeight: post.h
      }}
    >
      {/* Post Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <img
              src={post.profiles?.avatar_url || '/api/placeholder/32/32'}
              alt={post.profiles?.display_name || 'User'}
              className="w-8 h-8 rounded-full border border-white/20"
            />
            <div>
              <h4 className="text-white font-medium text-sm">
                {post.profiles?.display_name || 'Anonymous'}
              </h4>
              <span className="text-white/60 text-xs">
                {formatDate(post.created_at)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {post.is_private && (
              <Lock className="w-4 h-4 text-white/60" />
            )}
            {!post.is_private && (
              <Globe className="w-4 h-4 text-white/60" />
            )}
            <PostContextMenu
              postId={post.id}
              postTitle={post.title}
              postOwnerId={post.user_id}
              onEdit={handlePostEdit}
              onDelete={handlePostDelete}
            />
          </div>
        </div>

        {/* Post Content */}
        <div className="mb-3">
          <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
            {post.title}
          </h3>
          {post.content && (
            <p className="text-white/80 text-xs leading-relaxed line-clamp-3">
              {post.content}
            </p>
          )}
          {post.location && (
            <div className="flex items-center gap-1 mt-2 text-white/60">
              <MapPin className="w-3 h-3" />
              <span className="text-xs">{post.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Post Image */}
      {post.image_url && (
        <div className="px-4 pb-3">
          <img 
            src={getOptimizedImageUrl(post.image_url, {
              'w': '400',
              'h': '300',
              'c': 'maintain_ratio'
            })}
            alt="Post content"
            className="w-full h-32 object-cover rounded-xl"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="px-4 pb-4 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg transition-all ${
              post.user_has_liked 
                ? 'text-red-400 bg-red-500/20 hover:bg-red-500/30' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${post.user_has_liked ? 'fill-current' : ''}`} />
            <span>{post.likes_count}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewClick}
            className={`flex items-center gap-1 text-xs text-white/60 hover:text-white hover:bg-white/10 px-2 py-1 rounded-lg transition-all ${
              hasViewed ? 'text-blue-400' : ''
            }`}
            title={hasViewed ? 'Anda sudah melihat post ini' : 'Klik untuk melihat'}
          >
            <Eye className={`w-3.5 h-3.5 ${hasViewed ? 'text-blue-400' : ''}`} />
            <span className="font-medium">{localViewsCount}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

const ModernMasonry: React.FC<ModernMasonryProps> = ({
  posts,
  onLike,
  onEdit,
  onDelete,
  currentUserId,
  onRefresh
}) => {
  const columns = useMedia(
    ["(min-width:1200px)", "(min-width:768px)", "(min-width:480px)"],
    [3, 2, 1],
    1
  );

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();

  const grid = useMemo(() => {
    if (!width || !posts.length) return [];

    const colHeights = new Array(columns).fill(0);
    const columnWidth = Math.floor((width - (columns - 1) * 16) / columns);

    return posts.map((post) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = (columnWidth + 16) * col;
      
      const baseHeight = 200;
      const contentHeight = post.content ? Math.min(post.content.length * 0.4, 80) : 0;
      const imageHeight = post.image_url ? 160 : 0;
      const height = baseHeight + contentHeight + imageHeight;
      
      const y = colHeights[col];
      colHeights[col] += height + 16;

      return { ...post, x, y, w: columnWidth, h: height };
    });
  }, [columns, posts, width]);

  // Calculate container height based on the tallest column
  const containerHeight = useMemo(() => {
    if (!grid.length) return 400;
    const maxHeight = Math.max(...grid.map(item => item.y + item.h));
    return maxHeight + 64; // Add extra padding at bottom
  }, [grid]);

  useLayoutEffect(() => {
    if (!grid.length) return;

    grid.forEach((item, index) => {
      const selector = `[data-post-id="${item.id}"]`;
      
      gsap.fromTo(selector, 
        {
          opacity: 0,
          y: item.y + 50,
          x: item.x,
          scale: 0.9
        },
        {
          opacity: 1,
          y: item.y,
          x: item.x,
          scale: 1,
          width: item.w,
          duration: 0.6,
          delay: index * 0.1,
          ease: "power3.out"
        }
      );
    });
  }, [grid]);

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

  return (
    <div 
      ref={containerRef} 
      className="relative w-full p-4 mb-12"
      style={{ minHeight: `${containerHeight}px` }}
    >
      {grid.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={onLike}
          currentUserId={currentUserId}
          formatDate={formatDate}
          onRefresh={onRefresh}
        />
      ))}
      
      {posts.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4">
            <Globe className="w-8 h-8 text-white/60" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Belum Ada Post</h3>
          <p className="text-sm text-white/70">
            Jadilah yang pertama membagikan sesuatu di komunitas
          </p>
        </div>
      )}
    </div>
  );
};

export default ModernMasonry;
