
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  UserPlus, 
  Crown, 
  MapPin, 
  Calendar,
  Star,
  Fish,
  Trophy,
  Zap,
  Heart,
  Share,
  MoreHorizontal
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  imageUrl: string;
  category: 'local' | 'technique' | 'species' | 'equipment';
  isJoined: boolean;
  isVerified: boolean;
  location?: string;
  lastActivity: string;
  gradient: string;
}

interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    isVerified: boolean;
    level: number;
  };
  content: string;
  imageUrl?: string;
  timestamp: string;
  likes: number;
  comments: number;
  group: string;
  location?: string;
}

interface Ultra2025CommunitySectionProps {
  userId: string;
}

const Ultra2025CommunitySection = ({ userId }: Ultra2025CommunitySectionProps) => {
  const [activeTab, setActiveTab] = useState<'groups' | 'feed'>('groups');
  const [communityGroups, setCommunityGroups] = useState<CommunityGroup[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch community data from Supabase
  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch community posts
        const { data: posts, error: postsError } = await supabase
          .from('community_posts')
          .select(`
            *,
            profiles:user_id (
              username,
              display_name,
              avatar_url
            )
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(10);

        if (postsError) throw postsError;

        // Transform posts data
        const transformedPosts: CommunityPost[] = posts?.map(post => ({
          id: post.id,
          author: {
            name: post.profiles?.display_name || post.profiles?.username || 'Anonymous',
            avatar: post.profiles?.avatar_url || '/api/placeholder/40/40',
            isVerified: Math.random() > 0.5, // Mock verification
            level: Math.floor(Math.random() * 25) + 1
          },
          content: post.content || post.title,
          imageUrl: post.image_url,
          timestamp: formatTimestamp(post.created_at),
          likes: post.likes_count || 0,
          comments: Math.floor(Math.random() * 20),
          group: 'VisionFish Community',
          location: post.location
        })) || [];

        setCommunityPosts(transformedPosts);
        
        // Set mock groups (since we don't have groups table yet)
        setCommunityGroups(getMockGroups());
        
      } catch (error) {
        console.error('Error fetching community data:', error);
        toast({
          title: "❌ Gagal Memuat Data Komunitas",
          description: "Menggunakan data contoh",
          variant: "destructive"
        });
        
        // Fallback to mock data
        setCommunityGroups(getMockGroups());
        setCommunityPosts(getMockPosts());
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchCommunityData();
    }
  }, [userId, toast]);

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Baru saja';
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString('id-ID');
  };

  const getMockGroups = (): CommunityGroup[] => [
    {
      id: '1',
      name: 'Pemancing Jakarta Timur',
      description: 'Komunitas pemancing di wilayah Jakarta Timur dan sekitarnya',
      memberCount: 1247,
      imageUrl: '/api/placeholder/80/80',
      category: 'local',
      isJoined: true,
      isVerified: true,
      location: 'Jakarta Timur',
      lastActivity: '5 menit lalu',
      gradient: 'from-blue-400 to-cyan-500'
    },
    {
      id: '2',
      name: 'Master Teknik Casting',
      description: 'Berbagi tips dan trik teknik casting untuk pemancing tingkat lanjut',
      memberCount: 892,
      imageUrl: '/api/placeholder/80/80',
      category: 'technique',
      isJoined: false,
      isVerified: true,
      lastActivity: '1 jam lalu',
      gradient: 'from-purple-400 to-pink-500'
    },
    {
      id: '3',
      name: 'Predator Hunter Indonesia',
      description: 'Spesialis mancing ikan predator seperti Giant Trevally, Barracuda',
      memberCount: 2156,
      imageUrl: '/api/placeholder/80/80',
      category: 'species',
      isJoined: true,
      isVerified: true,
      lastActivity: '30 menit lalu',
      gradient: 'from-orange-400 to-red-500'
    },
    {
      id: '4',
      name: 'Review Peralatan Mancing',
      description: 'Review honest tentang rod, reel, dan peralatan mancing terbaru',
      memberCount: 654,
      imageUrl: '/api/placeholder/80/80',
      category: 'equipment',
      isJoined: false,
      isVerified: false,
      lastActivity: '2 jam lalu',
      gradient: 'from-green-400 to-emerald-500'
    }
  ];

  const getMockPosts = (): CommunityPost[] => [
    {
      id: '1',
      author: {
        name: 'Budi Santoso',
        avatar: '/api/placeholder/40/40',
        isVerified: true,
        level: 15
      },
      content: 'Spot baru di Pantai Anyer! Hasil tangkapan pagi ini lumayan bagus, dapat 5 ekor kakap merah. Cuaca perfect, ombak tenang 👍',
      imageUrl: '/api/placeholder/400/300',
      timestamp: '2 jam lalu',
      likes: 47,
      comments: 12,
      group: 'Pemancing Jakarta Timur',
      location: 'Pantai Anyer, Banten'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'local': return MapPin;
      case 'technique': return Star;
      case 'species': return Fish;
      case 'equipment': return Trophy;
      default: return Users;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-2xl rounded-3xl p-5 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl" />
              <div className="flex-1">
                <div className="h-4 bg-white/20 rounded mb-2" />
                <div className="h-3 bg-white/20 rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Komunitas Ultra</h2>
        <p className="text-white/70 text-sm">
          Terhubung dengan {communityGroups.reduce((sum, group) => sum + group.memberCount, 0).toLocaleString()} pemancing dari database
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-2xl p-1 border border-white/20">
        {[
          { id: 'groups', label: 'Grup', icon: Users },
          { id: 'feed', label: 'Timeline', icon: MessageSquare }
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                isActive 
                  ? 'bg-white/20 backdrop-blur-xl border border-white/30 text-white shadow-lg' 
                  : 'text-white/70'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/60'}`} />
              {tab.label}
            </motion.button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'groups' && (
        <div className="space-y-4">
          {communityGroups.map((group, index) => {
            const CategoryIcon = getCategoryIcon(group.category);
            
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 overflow-hidden">
                  {/* Background */}
                  <div className="absolute inset-0 opacity-20">
                    <div className={`absolute inset-0 bg-gradient-to-br ${group.gradient}/30`} />
                  </div>

                  <div className="relative z-10 p-5">
                    <div className="flex items-start gap-4">
                      {/* Group Image */}
                      <motion.div
                        className="relative"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/20 backdrop-blur-sm">
                          <img
                            src={group.imageUrl}
                            alt={group.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {group.isVerified && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Crown className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </motion.div>

                      {/* Group Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1 leading-tight">
                              {group.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-white/60 mb-2">
                              <CategoryIcon className="w-3 h-3" />
                              <span>{group.memberCount.toLocaleString()} anggota</span>
                              {group.location && (
                                <>
                                  <span>•</span>
                                  <span>{group.location}</span>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                          >
                            <MoreHorizontal className="w-4 h-4 text-white/70" />
                          </motion.button>
                        </div>

                        <p className="text-white/90 text-sm leading-relaxed mb-4">
                          {group.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-white/60">
                            <Zap className="w-3 h-3 text-green-400" />
                            <span>Aktif {group.lastActivity}</span>
                          </div>

                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-xl font-semibold text-sm ${
                              group.isJoined
                                ? 'bg-white/20 backdrop-blur-sm border border-white/30 text-white'
                                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                            }`}
                          >
                            {group.isJoined ? (
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>Anggota</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <UserPlus className="w-4 h-4" />
                                <span>Gabung</span>
                              </div>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {activeTab === 'feed' && (
        <div className="space-y-4">
          {communityPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-5">
                {/* Post Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-12 h-12 rounded-2xl object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {post.author.level}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white">{post.author.name}</h4>
                      {post.author.isVerified && (
                        <Crown className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <span>{post.group}</span>
                      <span>•</span>
                      <span>{post.timestamp}</span>
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

                {/* Post Content */}
                <p className="text-white/90 text-sm leading-relaxed mb-4">
                  {post.content}
                </p>

                {/* Post Image */}
                {post.imageUrl && (
                  <motion.div
                    className="w-full h-48 rounded-2xl overflow-hidden mb-4"
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={post.imageUrl}
                      alt="Post content"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-xl"
                    >
                      <Heart className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-semibold text-white">
                        {post.likes}
                      </span>
                    </motion.button>
                    
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-xl"
                    >
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-semibold text-white">
                        {post.comments}
                      </span>
                    </motion.button>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center"
                  >
                    <Share className="w-4 h-4 text-white/70" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}

          {communityPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <motion.div
                className="w-24 h-24 mx-auto bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-6"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(255, 255, 255, 0.1)',
                    '0 0 40px rgba(255, 255, 255, 0.2)',
                    '0 0 20px rgba(255, 255, 255, 0.1)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Users className="w-12 h-12 text-white/60" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">Belum Ada Post</h3>
              <p className="text-white/70 mb-6 max-w-sm mx-auto">
                Timeline komunitas akan muncul di sini setelah ada aktivitas dari anggota
              </p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default Ultra2025CommunitySection;
