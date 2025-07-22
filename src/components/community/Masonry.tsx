
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './Masonry.css';

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

const preloadImages = async (urls: string[]): Promise<void> => {
  await Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        })
    )
  );
};

interface CommunityPost {
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
  user_has_liked?: boolean;
}

interface MasonryProps {
  posts: CommunityPost[];
  onLike: (postId: string) => void;
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: "bottom" | "top" | "left" | "right" | "center" | "random";
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
}

const Masonry: React.FC<MasonryProps> = ({
  posts,
  onLike,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.98,
  blurToFocus = true,
}) => {
  const columns = useMedia(
    ["(min-width:1200px)", "(min-width:768px)", "(min-width:480px)"],
    [3, 2, 1],
    1
  );

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [imagesReady, setImagesReady] = useState(false);

  const getInitialPosition = (item: any) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;

    if (animateFrom === "random") {
      const directions = ["top", "bottom", "left", "right"];
      direction = directions[
        Math.floor(Math.random() * directions.length)
      ] as typeof animateFrom;
    }

    switch (direction) {
      case "top":
        return { x: item.x, y: -200 };
      case "bottom":
        return { x: item.x, y: window.innerHeight + 200 };
      case "left":
        return { x: -200, y: item.y };
      case "right":
        return { x: window.innerWidth + 200, y: item.y };
      case "center":
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  useEffect(() => {
    const imageUrls = posts
      .filter(post => post.image_url)
      .map(post => post.image_url!);
    
    if (imageUrls.length > 0) {
      preloadImages(imageUrls).then(() => setImagesReady(true));
    } else {
      setImagesReady(true);
    }
  }, [posts]);

  const grid = useMemo(() => {
    if (!width) return [];

    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns - (columns > 1 ? 16 : 0); // Account for gaps

    return posts.map((post) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = (columnWidth + 16) * col;
      
      // Calculate dynamic height based on content
      const baseHeight = 200;
      const contentHeight = post.content ? Math.min(post.content.length * 0.5, 100) : 0;
      const imageHeight = post.image_url ? 200 : 0;
      const height = baseHeight + contentHeight + imageHeight;
      
      const y = colHeights[col];
      colHeights[col] += height + 20; // Add gap

      return { ...post, x, y, w: columnWidth, h: height };
    });
  }, [columns, posts, width]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!imagesReady) return;

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animationProps = {
        x: item.x,
        y: item.y,
        width: item.w,
        height: item.h,
      };

      if (!hasMounted.current) {
        const initialPos = getInitialPosition(item);
        const initialState = {
          opacity: 0,
          x: initialPos.x,
          y: initialPos.y,
          width: item.w,
          height: item.h,
          ...(blurToFocus && { filter: "blur(10px)" }),
        };

        gsap.fromTo(selector, initialState, {
          opacity: 1,
          ...animationProps,
          ...(blurToFocus && { filter: "blur(0px)" }),
          duration: 0.8,
          ease: "power3.out",
          delay: index * stagger,
        });
      } else {
        gsap.to(selector, {
          ...animationProps,
          duration: duration,
          ease: ease,
          overwrite: "auto",
        });
      }
    });

    hasMounted.current = true;
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

  const handleMouseEnter = (e: React.MouseEvent, item: any) => {
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: hoverScale,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = (e: React.MouseEvent, item: any) => {
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString('id-ID');
  };

  return (
    <div ref={containerRef} className="masonry-container">
      {grid.map((post) => (
        <div
          key={post.id}
          data-key={post.id}
          className="masonry-item"
          onMouseEnter={(e) => handleMouseEnter(e, post)}
          onMouseLeave={(e) => handleMouseLeave(e, post)}
        >
          <div className="post-card">
            {/* Post Header */}
            <div className="post-header">
              <div className="post-author">
                <img
                  src={post.profiles?.avatar_url || '/api/placeholder/40/40'}
                  alt={post.profiles?.display_name || 'User'}
                  className="author-avatar"
                />
                <div className="author-info">
                  <h4>{post.profiles?.display_name || 'Anonymous'}</h4>
                  <span>{formatDate(post.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="post-content">
              <h3>{post.title}</h3>
              {post.content && <p>{post.content}</p>}
              {post.location && (
                <div className="post-location">
                  📍 {post.location}
                </div>
              )}
            </div>

            {/* Post Image */}
            {post.image_url && (
              <div className="post-image">
                <img src={post.image_url} alt="Post content" />
              </div>
            )}

            {/* Post Actions */}
            <div className="post-actions">
              <button
                onClick={() => onLike(post.id)}
                className={`action-btn like-btn ${post.user_has_liked ? 'liked' : ''}`}
              >
                <span className="action-icon">❤️</span>
                <span>{post.likes_count}</span>
              </button>
              <div className="post-views">
                <span className="action-icon">👁️</span>
                <span>{post.views_count}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Masonry;
