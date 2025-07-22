
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { communityPostViewsService } from '@/services/communityPostViewsService';
import { useToast } from '@/hooks/use-toast';

interface UseCommunityPostViewsProps {
  postId: string;
  onViewRecorded?: (isFirstView: boolean) => void;
}

export const useCommunityPostViews = ({ postId, onViewRecorded }: UseCommunityPostViewsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hasViewed, setHasViewed] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const viewStartTimeRef = useRef<number | null>(null);
  const hasRecordedViewRef = useRef(false);

  // Check if user has already viewed this post
  useEffect(() => {
    const checkViewStatus = async () => {
      if (user?.id) {
        const viewed = await communityPostViewsService.hasUserViewed(postId, user.id);
        setHasViewed(viewed);
      }
    };

    checkViewStatus();
  }, [postId, user?.id]);

  // Intersection Observer setup
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.5; // 50% visible
        setIsInView(isVisible);

        if (isVisible && !hasRecordedViewRef.current) {
          viewStartTimeRef.current = Date.now();
          // Start recording view with duration check
          communityPostViewsService.recordViewWithDuration(postId, user?.id)
            .then(({ success, isFirstView }) => {
              if (success && isFirstView) {
                setHasViewed(true);
                hasRecordedViewRef.current = true;
                onViewRecorded?.(true);
                console.log('View recorded for post:', postId);
              }
            });
        } else if (!isVisible && viewStartTimeRef.current) {
          // Cancel view if user scrolled away too quickly
          const viewDuration = Date.now() - viewStartTimeRef.current;
          if (viewDuration < 3000 && !hasRecordedViewRef.current) {
            communityPostViewsService.cancelViewRecording(postId);
          }
          viewStartTimeRef.current = null;
        }
      },
      {
        threshold: [0.5], // Trigger when 50% visible
        rootMargin: '0px'
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      // Cancel any pending view recording
      if (!hasRecordedViewRef.current) {
        communityPostViewsService.cancelViewRecording(postId);
      }
    };
  }, [postId, user?.id, onViewRecorded]);

  // Manual view recording (for click events)
  const recordViewManually = useCallback(async () => {
    if (hasRecordedViewRef.current) return { success: true, isFirstView: false };

    try {
      const result = await communityPostViewsService.recordView(postId, user?.id);
      
      if (result.success && result.isFirstView) {
        setHasViewed(true);
        hasRecordedViewRef.current = true;
        onViewRecorded?.(true);
        
        toast({
          title: "👁️ View recorded",
          description: "Terima kasih telah melihat post ini!",
        });
      }

      return result;
    } catch (error) {
      console.error('Error recording manual view:', error);
      return { success: false, isFirstView: false };
    }
  }, [postId, user?.id, onViewRecorded, toast]);

  return {
    elementRef,
    hasViewed,
    isInView,
    recordViewManually
  };
};
