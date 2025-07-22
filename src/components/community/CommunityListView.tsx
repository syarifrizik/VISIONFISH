import { Heart, Eye, MapPin, MessageCircle, Lock, Globe, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { PostContextMenu } from './PostContextMenu';
import { motion } from 'framer-motion';
import MobilePostActions from './MobilePostActions';
import { useIsMobile } from '@/hooks/use-mobile';
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
interface CommunityListViewProps {
  posts: CommunityPost[];
  onLike: (postId: string) => void;
  currentUserId?: string;
  onRefresh?: () => void;
}
const CommunityListView = ({
  posts,
  onLike,
  currentUserId,
  onRefresh
}: CommunityListViewProps) => {
  const isMobile = useIsMobile();
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
  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
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
  if (posts.length === 0) {
    return <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} className="text-center py-16">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-6 border border-white/10">
          <Globe className="w-10 h-10 text-white/60" />
        </div>
        <h3 className="text-lg font-bold text-white mb-3">Belum Ada Post</h3>
        <p className="text-white/70 max-w-sm mx-auto leading-relaxed text-sm">
          Jadilah yang pertama membagikan pengalaman memancing yang menginspirasi
        </p>
      </motion.div>;
  }
  return <div className="space-y-4">
      {posts.map((post, index) => <motion.div key={post.id} initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: index * 0.1
    }} className="group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300">
          <div className={`relative ${isMobile ? 'p-4' : 'p-6'}`}>
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={post.profiles?.avatar_url || '/api/placeholder/40/40'} alt={post.profiles?.display_name || 'User'} className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl border border-white/20 object-cover`} />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-sm leading-tight">
                    {post.profiles?.display_name || 'Anonymous'}
                  </h4>
                  <div className="flex items-center gap-2 text-white/60 text-xs">
                    <span>{formatDate(post.created_at)}</span>
                    {post.location && <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate max-w-20">{post.location}</span>
                        </div>
                      </>}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {post.is_private ? <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 rounded-lg border border-orange-500/30">
                    <Lock className="w-3 h-3 text-orange-400" />
                    {!isMobile && <span className="text-orange-400 text-xs">Private</span>}
                  </div> : <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-lg border border-green-500/30">
                    <Globe className="w-3 h-3 text-green-400" />
                    {!isMobile && <span className="text-green-400 text-xs">Public</span>}
                  </div>}
                <PostContextMenu postId={post.id} postTitle={post.title} postOwnerId={post.user_id} onEdit={handlePostEdit} onDelete={handlePostDelete} />
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <h3 className="text-white font-bold text-base mb-3 leading-tight">
                {post.title}
              </h3>
              {post.content && <p className="text-white/90 leading-relaxed text-sm">
                  {truncateText(post.content, isMobile ? 120 : 200)}
                </p>}
            </div>

            {/* Post Image */}
            {post.image_url && <div className="mb-4 rounded-xl overflow-hidden">
                <img src={post.image_url} alt="Post content" className={`w-full ${isMobile ? 'h-48' : 'h-64'} object-cover`} />
              </div>}

            {/* Post Actions */}
            {isMobile ? <MobilePostActions likesCount={post.likes_count} viewsCount={post.views_count} commentsCount={0} isLiked={post.user_has_liked} onLike={() => onLike(post.id)} onComment={() => {}} onBookmark={() => {}} /> : <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onLike(post.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${post.user_has_liked ? 'text-red-400 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30' : 'text-white/70 hover:text-white hover:bg-white/10 border border-white/20 hover:border-white/30'}`}>
                    <Heart className={`w-4 h-4 ${post.user_has_liked ? 'fill-current' : ''}`} />
                    <span className="font-medium">{post.likes_count}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 border border-white/20 hover:border-white/30 transition-all">
                    <MessageCircle className="w-4 h-4" />
                    
                  </Button>

                  <Button variant="ghost" size="sm" className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 border border-white/20 hover:border-white/30 transition-all">
                    <Bookmark className="w-4 h-4" />
                  </Button>

                  
                </div>

                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">{post.views_count.toLocaleString()} dilihat</span>
                </div>
              </div>}
          </div>
        </motion.div>)}
    </div>;
};
export default CommunityListView;