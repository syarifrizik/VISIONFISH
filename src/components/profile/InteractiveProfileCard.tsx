import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Share2, 
  Heart, 
  MessageCircle, 
  Bookmark,
  MoreHorizontal,
  ExternalLink,
  Download,
  Edit3,
  Star,
  Trophy,
  Target,
  Zap,
  Trash2,
  Camera,
  MapPin,
  Calendar
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { useTheme } from '@/hooks/use-theme';
import { toggleLike, checkIfLiked, recordView } from '@/services/profileItemInteractionsService';
import ProfileItemPreviewModal from './ProfileItemPreviewModal';

interface InteractiveProfileCardProps {
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
  isPrivate?: boolean;
  ownerId: string;
  ownerName?: string;
  ownerAvatar?: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

const InteractiveProfileCard = ({
  id,
  title,
  description,
  imageUrl,
  category,
  date = new Date().toISOString(),
  location,
  stats: initialStats,
  isPrivate = false,
  ownerId,
  ownerName,
  ownerAvatar,
  onEdit,
  onDelete,
  onShare
}: InteractiveProfileCardProps) => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  const { theme } = useTheme();
  
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [stats, setStats] = useState(initialStats);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if current user is the owner
  const isOwner = user?.id === ownerId;

  useEffect(() => {
    if (user?.id) {
      checkIfLiked(id, user.id).then(setIsLiked);
    }
  }, [id, user?.id]);

  useEffect(() => {
    // Record view when card is mounted (only once per day per user)
    if (user?.id && !isOwner) {
      recordView(id, user.id);
    } else if (!user?.id) {
      recordView(id); // Anonymous view
    }
  }, [id, user?.id, isOwner]);

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
      const result = await toggleLike(id, user.id);
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
      } else {
        showNotification('Gagal memproses like', 'error');
      }
    } catch (error) {
      showNotification('Terjadi kesalahan', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = () => {
    try {
      if (navigator.share && navigator.canShare) {
        navigator.share({
          title: title,
          text: description,
          url: window.location.href
        }).catch((error) => {
          // Fallback to clipboard if share fails
          navigator.clipboard.writeText(window.location.href);
          showNotification('Link berhasil disalin!', 'success');
        });
      } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        showNotification('Link berhasil disalin!', 'success');
      }
    } catch (error) {
      // Final fallback
      console.log('Share URL:', window.location.href);
      showNotification('URL telah disiapkan untuk dibagikan', 'success');
    }
    
    setStats(prev => ({
      ...prev,
      shares: prev.shares + 1
    }));
    
    onShare?.();
  };

  const handleViewClick = () => {
    setShowPreview(true);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
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

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'achievement':
        return <Trophy className="w-2.5 h-2.5 md:w-3 md:h-3" />;
      case 'activity':
        return <Zap className="w-2.5 h-2.5 md:w-3 md:h-3" />;
      case 'statistic':
        return <Target className="w-2.5 h-2.5 md:w-3 md:h-3" />;
      default:
        return <Star className="w-2.5 h-2.5 md:w-3 md:h-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <>
      <motion.div
        className="group relative"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        layout
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Card className={`
          overflow-hidden transition-all duration-500 relative
          ${theme === 'dark' 
            ? 'bg-gradient-to-br from-slate-900/90 to-purple-900/90 border-purple-500/20 hover:border-purple-400/40' 
            : 'bg-gradient-to-br from-white/95 to-purple-50/90 border-purple-200/30 hover:border-purple-300/50'
          }
          hover:shadow-xl backdrop-blur-xl
          ${isHovered ? 'shadow-purple-500/20' : ''}
        `}>
          {/* Enhanced Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Private Badge - Smaller */}
          {isPrivate && (
            <motion.div 
              className="absolute top-1 left-1 z-20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className={`
                flex items-center gap-0.5 px-1.5 py-0.5 text-xs rounded-md backdrop-blur-sm
                ${theme === 'dark' 
                  ? 'bg-slate-800/80 text-slate-200 border-slate-600/50' 
                  : 'bg-white/80 text-slate-600 border-slate-300/50'
                }
              `}>
                <EyeOff className="w-2 h-2" />
                <span className="text-xs font-medium hidden sm:inline">Privat</span>
              </Badge>
            </motion.div>
          )}

          {/* Category Badge - Smaller */}
          <motion.div 
            className="absolute top-1 right-1 z-20"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Badge className={`
              bg-gradient-to-r ${getCategoryColor(category)} text-white border-0 
              flex items-center gap-0.5 px-1.5 py-0.5 text-xs rounded-md shadow-md
              hover:scale-105 transition-transform duration-200
            `}>
              {getCategoryIcon(category)}
              <span className="text-xs font-semibold hidden sm:inline">{category}</span>
            </Badge>
          </motion.div>

          {/* Owner Info for Public Posts - Much smaller */}
          {!isOwner && ownerName && (
            <motion.div 
              className="absolute top-8 left-1 z-20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className={`
                flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs backdrop-blur-sm
                ${theme === 'dark' 
                  ? 'bg-slate-800/80 text-slate-200' 
                  : 'bg-white/80 text-slate-600'
                }
              `}>
                <Avatar className="w-3 h-3 ring-1 ring-white/20">
                  <AvatarImage src={ownerAvatar} />
                  <AvatarFallback className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    {ownerName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-xs truncate max-w-[60px] hidden sm:inline">{ownerName}</span>
              </div>
            </motion.div>
          )}

          {/* Much smaller image area */}
          <div className="relative h-20 md:h-24 overflow-hidden">
            {imageUrl ? (
              <motion.img 
                src={imageUrl} 
                alt={title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(category)} relative overflow-hidden`}>
                {/* Simplified Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <motion.div
                    className="absolute top-0 right-0 w-8 h-8 md:w-12 md:h-12 bg-white rounded-full"
                    animate={{
                      x: isHovered ? [0, 5, 0] : 0,
                      y: isHovered ? [0, -4, 0] : 0,
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transform: 'translate(50%, -50%)' }}
                  />
                </div>

                {/* Smaller Floating Category Icon */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{
                    y: isHovered ? [0, -3, 0] : 0,
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    {React.cloneElement(getCategoryIcon(category), { className: "w-3 h-3 md:w-4 md:h-4 text-white" })}
                  </div>
                </motion.div>
              </div>
            )}

            {/* Enhanced Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Much smaller Interactive Hover Actions */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-1"
                >
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Button
                      size="sm"
                      className="bg-white/90 text-black hover:bg-white shadow-lg backdrop-blur-sm text-xs px-1.5 py-0.5 h-6"
                      onClick={handleViewClick}
                    >
                      <Eye className="w-2.5 h-2.5 mr-0.5" />
                      <span className="hidden sm:inline">Detail</span>
                    </Button>
                  </motion.div>
                  
                  {isOwner && onEdit && (
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 10, opacity: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Button
                        size="sm"
                        className="bg-blue-500/90 text-white hover:bg-blue-600 shadow-lg backdrop-blur-sm text-xs px-1.5 py-0.5 h-6"
                        onClick={onEdit}
                      >
                        <Edit3 className="w-2.5 h-2.5 mr-0.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                    </motion.div>
                  )}
                  
                  {isOwner && onDelete && (
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 10, opacity: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        size="sm"
                        className="bg-red-500/90 text-white hover:bg-red-600 shadow-lg backdrop-blur-sm text-xs px-1.5 py-0.5 h-6"
                        onClick={onDelete}
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <CardContent className="p-2 md:p-3 space-y-2 relative">
            {/* Title and Description - More compact */}
            <div className="space-y-1">
              <motion.h3 
                className={`font-bold text-xs md:text-sm leading-tight line-clamp-1 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-white group-hover:text-purple-300' : 'text-slate-800 group-hover:text-purple-600'
                }`}
                animate={isHovered ? { scale: 1.01 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {title}
              </motion.h3>
              
              <p className={`text-xs line-clamp-1 leading-relaxed transition-colors duration-300 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {description}
              </p>
            </div>

            {/* Meta Information - Very compact */}
            <div className="flex items-center gap-2 text-xs">
              {date && (
                <div className={`flex items-center gap-0.5 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <Calendar className="w-2.5 h-2.5" />
                  <span className="text-xs hidden sm:inline">{formatDate(date)}</span>
                </div>
              )}
              {location && (
                <div className={`flex items-center gap-0.5 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <MapPin className="w-2.5 h-2.5" />
                  <span className="truncate max-w-[50px] text-xs hidden sm:inline">{location}</span>
                </div>
              )}
            </div>

            {/* Very compact Stats Row */}
            <div className={`flex items-center justify-between text-xs pt-1 border-t transition-colors duration-300 ${
              theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'
            }`}>
              <div className="flex items-center gap-2">
                <motion.span 
                  className={`flex items-center gap-0.5 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Eye className="w-2.5 h-2.5" />
                  <span className="font-medium text-xs">{stats.views > 999 ? '999+' : stats.views}</span>
                </motion.span>
                
                <motion.span 
                  className={`flex items-center gap-0.5 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Heart className="w-2.5 h-2.5" />
                  <span className="font-medium text-xs">{stats.likes}</span>
                </motion.span>
              </div>
            </div>

            {/* Much smaller Action Buttons */}
            <div className={`flex items-center justify-between pt-1 border-t transition-colors duration-300 ${
              theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'
            }`}>
              <div className="flex items-center gap-0.5">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleLike}
                    disabled={isProcessing}
                    className={`flex items-center gap-0.5 px-1 py-0.5 text-xs rounded-md transition-all duration-300 h-6 ${
                      isLiked 
                        ? 'text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-950/30' 
                        : theme === 'dark'
                          ? 'text-slate-400 hover:text-red-400 hover:bg-red-950/20'
                          : 'text-slate-500 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <Heart className={`w-2.5 h-2.5 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="font-medium text-xs hidden sm:inline">{stats.likes}</span>
                  </Button>
                </motion.div>

                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleShare}
                    className={`flex items-center gap-0.5 px-1 py-0.5 text-xs rounded-md transition-all duration-300 h-6 ${
                      theme === 'dark'
                        ? 'text-slate-400 hover:text-blue-400 hover:bg-blue-950/20'
                        : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Share2 className="w-2.5 h-2.5" />
                  </Button>
                </motion.div>
              </div>

              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowActions(!showActions)}
                  className={`flex items-center gap-0.5 px-1 py-0.5 text-xs rounded-md transition-all duration-300 h-6 ${
                    theme === 'dark'
                      ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
                      : 'text-slate-500 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <MoreHorizontal className="w-2.5 h-2.5" />
                </Button>
              </motion.div>
            </div>

            {/* Smaller Extended Actions */}
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -5 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -5 }}
                  className={`flex gap-1 pt-1 border-t transition-colors duration-300 ${
                    theme === 'dark' ? 'border-slate-700/30' : 'border-slate-200/30'
                  }`}
                >
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs gap-0.5 rounded-md hover:scale-105 transition-transform duration-200 h-6 py-0.5"
                  >
                    <Download className="w-2.5 h-2.5" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs gap-0.5 rounded-md hover:scale-105 transition-transform duration-200 h-6 py-0.5"
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                    <span className="hidden sm:inline">Buka</span>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          {/* Enhanced Hover Border Effect */}
          <motion.div
            className={`absolute inset-0 rounded-lg pointer-events-none transition-all duration-500 ${
              isHovered 
                ? 'ring-1 ring-purple-400/30 shadow-lg shadow-purple-500/10' 
                : ''
            }`}
          />
        </Card>
      </motion.div>

      {/* Preview Modal */}
      <ProfileItemPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        item={{
          id,
          title,
          description,
          imageUrl,
          category,
          date,
          location,
          stats,
          ownerId,
          ownerName,
          ownerAvatar,
          isPrivate
        }}
      />
    </>
  );
};

export default InteractiveProfileCard;
