
import { useState, useEffect } from 'react';
import { Heart, Eye, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { toggleLike, checkIfLiked, recordView, getItemStats } from '@/services/profileItemInteractionsService';
import InteractionButton from './interactions/InteractionButton';

interface ProfileItemInteractionsProps {
  itemId: string;
  ownerId: string;
  initialStats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  onViewComments?: () => void;
  onShare?: () => void;
  compact?: boolean;
}

const ProfileItemInteractions = ({
  itemId,
  ownerId,
  initialStats,
  onViewComments,
  onShare,
  compact = false
}: ProfileItemInteractionsProps) => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  
  const [stats, setStats] = useState(initialStats);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);

  const isOwner = user?.id === ownerId;

  useEffect(() => {
    // Check if user has liked this item
    if (user?.id) {
      checkIfLiked(itemId, user.id).then(setIsLiked);
    }

    // Record view (only once per session) and increment view count
    if (!hasViewed && !isOwner) {
      recordView(itemId, user?.id).then((result) => {
        if (result.success) {
          setHasViewed(true);
          setStats(prev => ({ ...prev, views: prev.views + 1 }));
        }
      });
    }
  }, [itemId, user?.id, isOwner, hasViewed]);

  // Fetch fresh stats periodically
  useEffect(() => {
    const fetchStats = async () => {
      const freshStats = await getItemStats(itemId);
      setStats(freshStats);
    };

    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [itemId]);

  const handleLike = async () => {
    if (!user?.id) {
      showNotification('Silakan login untuk menyukai postingan', 'error');
      return;
    }

    if (isOwner) {
      showNotification('Anda tidak dapat menyukai postingan sendiri', 'error');
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const result = await toggleLike(itemId, user.id);
      if (result.success) {
        setIsLiked(result.isLiked);
        setStats(prev => ({
          ...prev,
          likes: result.isLiked ? prev.likes + 1 : prev.likes - 1
        }));
        
        if (result.isLiked) {
          showNotification('❤️ Postingan disukai!', 'success');
        } else {
          showNotification('Like dibatalkan', 'success');
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      showNotification('Gagal memproses like', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/profile?item=${itemId}`;
      
      if (navigator.share && navigator.canShare({ url: shareUrl })) {
        await navigator.share({
          title: 'Lihat aktivitas mancing ini',
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        showNotification('🔗 Link berhasil disalin!', 'success');
      }
      
      setStats(prev => ({ ...prev, shares: prev.shares + 1 }));
      onShare?.();
    } catch (error) {
      console.log('Share cancelled or failed:', error);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    showNotification(
      isBookmarked ? '🔖 Bookmark dihapus' : '📌 Ditambahkan ke bookmark', 
      'success'
    );
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 text-xs text-[#A56ABD]">
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {stats.views}
        </span>
        <span className="flex items-center gap-1">
          <Heart className={`w-3 h-3 ${isLiked ? 'fill-current text-red-500' : ''}`} />
          {stats.likes}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="w-3 h-3" />
          {stats.comments}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between pt-3 border-t border-[#A56ABD]/20">
      {/* Left side - Interaction buttons */}
      <div className="flex items-center gap-1">
        <InteractionButton
          icon={Heart}
          count={stats.likes}
          onClick={handleLike}
          disabled={isProcessing || isOwner}
          className={`${
            isLiked 
              ? 'text-red-500 hover:text-red-600 hover:bg-red-50' 
              : 'text-[#6E3482] hover:text-[#49225B] hover:bg-[#F5EBFA]'
          } ${isOwner ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isOwner ? 'Anda tidak bisa menyukai postingan sendiri' : isLiked ? 'Batalkan like' : 'Suka postingan ini'}
          isActive={isLiked}
        />

        <InteractionButton
          icon={MessageCircle}
          count={stats.comments}
          onClick={() => onViewComments?.()}
          className="text-[#6E3482] hover:text-[#49225B] hover:bg-[#F5EBFA]"
          title="Lihat komentar"
        />

        <InteractionButton
          icon={Bookmark}
          count={0}
          onClick={handleBookmark}
          className={`${
            isBookmarked 
              ? 'text-[#6E3482] hover:bg-[#F5EBFA]' 
              : 'text-[#A56ABD] hover:text-[#6E3482] hover:bg-[#F5EBFA]'
          }`}
          title={isBookmarked ? 'Hapus dari bookmark' : 'Simpan ke bookmark'}
          isActive={isBookmarked}
        />
      </div>

      {/* Right side - Stats and Share */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-xs text-[#A56ABD]" title="Total views">
          <Eye className="w-3 h-3" />
          <span className="font-medium">{stats.views}</span>
        </div>

        <InteractionButton
          icon={Share2}
          count={stats.shares > 0 ? stats.shares : 0}
          onClick={handleShare}
          className="text-[#A56ABD] hover:text-[#6E3482] hover:bg-[#F5EBFA]"
          title="Bagikan postingan"
        />
      </div>
    </div>
  );
};

export default ProfileItemInteractions;
