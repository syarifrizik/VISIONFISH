
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark, 
  MoreHorizontal,
  Fish,
  MapPin,
  Clock,
  Trophy,
  Users,
  Camera,
  Play
} from 'lucide-react';
import { UserProfile, ProfileStats } from '@/types/profile';

interface EnhancedSocialFeedProps {
  user: UserProfile;
  stats: ProfileStats;
}

interface FeedItem {
  id: string;
  type: 'catch' | 'story' | 'achievement' | 'community';
  author: {
    id: string;
    name: string;
    avatar: string;
    level: number;
  };
  content: {
    title: string;
    description?: string;
    media?: {
      type: 'image' | 'video';
      url: string;
      thumbnail?: string;
    }[];
    location?: string;
    stats?: {
      weight?: number;
      length?: number;
      species?: string;
    };
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    isLiked: boolean;
    isBookmarked: boolean;
  };
  timestamp: string;
  badge?: {
    type: 'new' | 'trending' | 'premium';
    label: string;
  };
}

const EnhancedSocialFeed = ({ user, stats }: EnhancedSocialFeedProps) => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([
    {
      id: '1',
      type: 'catch',
      author: {
        id: '1',
        name: 'Budi Santoso',
        avatar: '/api/placeholder/40/40',
        level: 12
      },
      content: {
        title: 'Monster Bass di Danau Toba!',
        description: 'Setelah 3 jam perjuangan akhirnya berhasil! Tips: gunakan umpan hidup saat pagi hari.',
        media: [
          {
            type: 'image',
            url: '/api/placeholder/400/300'
          }
        ],
        location: 'Danau Toba, Sumatera Utara',
        stats: {
          weight: 3.2,
          length: 45,
          species: 'Bass'
        }
      },
      engagement: {
        likes: 89,
        comments: 23,
        shares: 12,
        isLiked: false,
        isBookmarked: true
      },
      timestamp: '2 jam lalu',
      badge: {
        type: 'trending',
        label: 'Trending'
      }
    },
    {
      id: '2',
      type: 'achievement',
      author: {
        id: '2',
        name: 'Andi Wijaya',
        avatar: '/api/placeholder/40/40',
        level: 8
      },
      content: {
        title: 'Achievement Unlocked: Master Angler!',
        description: '50 ikan berhasil ditangkap bulan ini. Terima kasih untuk semua tips dari komunitas!',
        media: [
          {
            type: 'image',
            url: '/api/placeholder/400/200'
          }
        ]
      },
      engagement: {
        likes: 156,
        comments: 41,
        shares: 28,
        isLiked: true,
        isBookmarked: false
      },
      timestamp: '5 jam lalu',
      badge: {
        type: 'new',
        label: 'Achievement'
      }
    },
    {
      id: '3',
      type: 'story',
      author: {
        id: '3',
        name: 'Sari Fishing Club',
        avatar: '/api/placeholder/40/40',
        level: 15
      },
      content: {
        title: 'Live: Kompetisi Mancing Berhadiah',
        description: 'Sedang berlangsung sekarang! Join dan menangkan hadiah jutaan rupiah.',
        media: [
          {
            type: 'video',
            url: '/api/placeholder/400/300',
            thumbnail: '/api/placeholder/400/300'
          }
        ],
        location: 'Pantai Ancol, Jakarta'
      },
      engagement: {
        likes: 234,
        comments: 67,
        shares: 45,
        isLiked: false,
        isBookmarked: false
      },
      timestamp: '1 jam lalu',
      badge: {
        type: 'premium',
        label: 'Live'
      }
    }
  ]);

  const handleLike = (itemId: string) => {
    setFeedItems(items => 
      items.map(item => 
        item.id === itemId 
          ? {
              ...item,
              engagement: {
                ...item.engagement,
                likes: item.engagement.isLiked 
                  ? item.engagement.likes - 1 
                  : item.engagement.likes + 1,
                isLiked: !item.engagement.isLiked
              }
            }
          : item
      )
    );
  };

  const handleBookmark = (itemId: string) => {
    setFeedItems(items => 
      items.map(item => 
        item.id === itemId 
          ? {
              ...item,
              engagement: {
                ...item.engagement,
                isBookmarked: !item.engagement.isBookmarked
              }
            }
          : item
      )
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'catch': return Fish;
      case 'achievement': return Trophy;
      case 'story': return Camera;
      case 'community': return Users;
      default: return Fish;
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'trending': return 'bg-gradient-to-r from-orange-500 to-red-500';
      case 'new': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'premium': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      default: return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    }
  };

  return (
    <div className="space-y-4">
      {/* Feed Header */}
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Community Feed
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Live</span>
        </div>
      </div>

      {/* Feed Items */}
      <div className="space-y-4">
        {feedItems.map((item, index) => {
          const TypeIcon = getTypeIcon(item.type);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden rounded-3xl"
            >
              {/* Glassmorphism Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-gray-900/20 dark:via-gray-900/10 dark:to-gray-900/5 backdrop-blur-xl" />
              <div className="absolute inset-0 border border-white/20 dark:border-gray-700/20 rounded-3xl" />
              
              <div className="relative z-10 p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={item.author.avatar}
                        alt={item.author.name}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-white/30"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <TypeIcon className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {item.author.name}
                        </h4>
                        <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 dark:text-purple-300 rounded-full">
                          Lv.{item.author.level}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        {item.timestamp}
                        {item.content.location && (
                          <>
                            <span>•</span>
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{item.content.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getBadgeStyle(item.badge.type)}`}>
                        {item.badge.label}
                      </span>
                    )}
                    <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {item.content.title}
                  </h5>
                  {item.content.description && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                      {item.content.description}
                    </p>
                  )}

                  {/* Stats for catch posts */}
                  {item.content.stats && (
                    <div className="flex items-center gap-4 mb-3 p-3 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-2xl">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {item.content.stats.weight} kg
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Weight</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {item.content.stats.length} cm
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Length</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {item.content.stats.species}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Species</div>
                      </div>
                    </div>
                  )}

                  {/* Media */}
                  {item.content.media && (
                    <div className="relative rounded-2xl overflow-hidden mb-3">
                      {item.content.media[0].type === 'video' ? (
                        <div className="relative aspect-video bg-black/20 flex items-center justify-center">
                          <img
                            src={item.content.media[0].thumbnail}
                            alt="Video thumbnail"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <Play className="w-8 h-8 text-white ml-1" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={item.content.media[0].url}
                          alt="Post media"
                          className="w-full aspect-video object-cover"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center gap-6">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLike(item.id)}
                      className="flex items-center gap-2 group"
                    >
                      <div className={`p-2 rounded-xl transition-all ${
                        item.engagement.isLiked 
                          ? 'bg-red-500/20 text-red-500' 
                          : 'hover:bg-white/10 text-gray-600 dark:text-gray-400'
                      }`}>
                        <Heart className={`w-5 h-5 ${item.engagement.isLiked ? 'fill-current' : ''}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.engagement.likes}
                      </span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center gap-2 group"
                    >
                      <div className="p-2 rounded-xl hover:bg-white/10 transition-colors">
                        <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.engagement.comments}
                      </span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center gap-2 group"
                    >
                      <div className="p-2 rounded-xl hover:bg-white/10 transition-colors">
                        <Share className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.engagement.shares}
                      </span>
                    </motion.button>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleBookmark(item.id)}
                    className={`p-2 rounded-xl transition-all ${
                      item.engagement.isBookmarked 
                        ? 'bg-yellow-500/20 text-yellow-500' 
                        : 'hover:bg-white/10 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${item.engagement.isBookmarked ? 'fill-current' : ''}`} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Load More Button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-gradient-to-r from-white/10 to-white/5 dark:from-gray-900/10 dark:to-gray-900/5 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-2xl text-gray-700 dark:text-gray-300 font-medium hover:from-white/20 hover:to-white/10 transition-all"
      >
        Load More Posts
      </motion.button>
    </div>
  );
};

export default EnhancedSocialFeed;
