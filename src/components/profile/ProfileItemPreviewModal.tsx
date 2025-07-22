
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Calendar, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { toggleLike, checkIfLiked, recordView } from '@/services/profileItemInteractionsService';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface ProfileItemPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    category: string;
    date: string;
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

const ProfileItemPreviewModal = ({ isOpen, onClose, item }: ProfileItemPreviewModalProps) => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  
  const [isLiked, setIsLiked] = useState(false);
  const [stats, setStats] = useState(item.stats);
  const [isProcessing, setIsProcessing] = useState(false);

  const isOwner = user?.id === item.ownerId;

  useEffect(() => {
    if (user?.id && isOpen) {
      checkIfLiked(item.id, user.id).then(setIsLiked);
      // Record view when modal opens
      if (!isOwner) {
        recordView(item.id, user.id);
      }
    }
  }, [item.id, user?.id, isOpen, isOwner]);

  const handleLike = async () => {
    if (!user?.id || isProcessing) {
      showNotification('Silakan login untuk menyukai postingan', 'error');
      return;
    }

    if (isOwner) {
      showNotification('Anda tidak dapat menyukai postingan sendiri', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await toggleLike(item.id, user.id);
      if (result.success) {
        setIsLiked(result.isLiked);
        setStats(prev => ({
          ...prev,
          likes: result.isLiked ? prev.likes + 1 : prev.likes - 1
        }));
        showNotification(
          result.isLiked ? 'Postingan disukai!' : 'Like dibatalkan',
          'success'
        );
      }
    } catch (error) {
      showNotification('Terjadi kesalahan', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showNotification('Link berhasil disalin!', 'success');
    }
    
    setStats(prev => ({
      ...prev,
      shares: prev.shares + 1
    }));
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'achievement':
        return 'from-yellow-500 to-yellow-600';
      case 'activity':
        return 'from-blue-500 to-cyan-500';
      case 'statistic':
        return 'from-[#6E3482] to-[#A56ABD]';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'achievement':
        return '🏆';
      case 'activity':
        return '🎣';
      case 'statistic':
        return '📊';
      default:
        return '📝';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-transparent border-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative"
        >
          {/* Glass Effect Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl" />
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 z-50 bg-black/20 hover:bg-black/40 text-white border border-white/20 backdrop-blur-sm rounded-full w-10 h-10 p-0"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="relative z-10 overflow-hidden rounded-2xl">
            {/* Header Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(item.category)} flex items-center justify-center relative`}>
                  <div className="text-8xl opacity-30">{getCategoryIcon(item.category)}</div>
                  {/* Animated background elements */}
                  <motion.div
                    className="absolute top-10 right-10 w-20 h-20 bg-white/20 rounded-full blur-xl"
                    animate={{
                      x: [0, 20, 0],
                      y: [0, -15, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute bottom-10 left-10 w-16 h-16 bg-white/15 rounded-full blur-xl"
                    animate={{
                      x: [0, -15, 0],
                      y: [0, 10, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 8, repeat: Infinity, delay: 2 }}
                  />
                </div>
              )}
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <Badge className={`bg-gradient-to-r ${getCategoryColor(item.category)} text-white border-0 px-3 py-1`}>
                  {getCategoryIcon(item.category)} {item.category}
                </Badge>
              </div>

              {/* Owner Info */}
              {item.ownerName && (
                <div className="absolute top-4 right-16">
                  <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-full border border-white/20">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={item.ownerAvatar} />
                      <AvatarFallback className="text-xs bg-[#6E3482] text-white">
                        {item.ownerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{item.ownerName}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 bg-white/10 backdrop-blur-sm">
              {/* Title and Description */}
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  {item.title}
                </h2>
                {item.description && (
                  <p className="text-white/80 leading-relaxed text-lg">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Meta Information */}
              <div className="flex flex-wrap gap-4 text-white/70">
                {item.location && (
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full backdrop-blur-sm border border-white/20">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{item.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full backdrop-blur-sm border border-white/20">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {formatDistanceToNow(new Date(item.date), { addSuffix: true, locale: idLocale })}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Eye, label: 'Views', value: stats.views, color: 'text-blue-400' },
                  { icon: Heart, label: 'Likes', value: stats.likes, color: 'text-red-400' },
                  { icon: MessageCircle, label: 'Comments', value: stats.comments, color: 'text-green-400' },
                  { icon: Share2, label: 'Shares', value: stats.shares, color: 'text-purple-400' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center"
                  >
                    <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-white/60 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4 pt-4">
                <Button
                  onClick={handleLike}
                  disabled={isProcessing || isOwner}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-sm border transition-all ${
                    isLiked 
                      ? 'bg-red-500/20 border-red-400/40 text-red-400 hover:bg-red-500/30' 
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <motion.div
                    whileTap={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </motion.div>
                  {isLiked ? 'Disukai' : 'Suka'} ({stats.likes})
                </Button>

                <Button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
                >
                  <Share2 className="w-5 h-5" />
                  Bagikan
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileItemPreviewModal;
