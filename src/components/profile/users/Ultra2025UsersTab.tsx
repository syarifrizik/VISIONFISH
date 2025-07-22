import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Search,
  MapPin,
  Fish,
  Crown,
  Star,
  MessageCircle,
  UserPlus,
  Eye,
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  Award
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import ModernChatPopup from '@/components/chat/ModernChatPopup';

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  location?: string;
  bio?: string;
  fish_caught: number;
  followers_count: number;
  following_count: number;
  is_online: boolean;
  is_private: boolean;
  created_at: string;
  level: number;
  isPremium: boolean;
  isVerified: boolean;
}

interface ChatUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  is_online: boolean;
}

interface Ultra2025UsersTabProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

const Ultra2025UsersTab = ({
  searchQuery = '',
  onSearchChange = () => {},
  viewMode = 'grid',
  onViewModeChange = () => {}
}: Ultra2025UsersTabProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [activeFilter, setActiveFilter] = useState<'all' | 'online' | 'premium' | 'nearby'>('all');
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set());
  
  // Chat popup state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedChatUser, setSelectedChatUser] = useState<ChatUser | null>(null);

  const stats = {
    totalUsers: users.length,
    onlineUsers: users.filter(u => u.is_online).length,
    premiumUsers: users.filter(u => u.isPremium).length,
    verifiedUsers: users.filter(u => u.isVerified).length
  };

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (user) {
      loadUsers();
      loadFollowingStatus();
    }
  }, [user]);

  const loadUsers = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          display_name,
          avatar_url,
          location,
          bio,
          fish_caught,
          followers_count,
          following_count,
          is_online,
          is_private,
          created_at
        `)
        .neq('id', user.id)
        .order('fish_caught', { ascending: false })
        .limit(50);

      if (profilesError) throw profilesError;

      const userIds = profiles?.map(p => p.id) || [];
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('user_id')
        .in('user_id', userIds)
        .eq('plan_type', 'premium')
        .eq('is_active', true);

      const premiumUserIds = new Set(subscriptions?.map(s => s.user_id) || []);

      const transformedUsers: UserProfile[] = profiles?.map(profile => ({
        id: profile.id,
        username: profile.username || 'user',
        display_name: profile.display_name || profile.username || 'User',
        avatar_url: profile.avatar_url || '/api/placeholder/60/60',
        location: profile.location,
        bio: profile.bio,
        fish_caught: profile.fish_caught || 0,
        followers_count: profile.followers_count || 0,
        following_count: profile.following_count || 0,
        is_online: profile.is_online || false,
        is_private: profile.is_private || false,
        created_at: profile.created_at,
        level: Math.floor((profile.fish_caught || 0) / 5) + 1,
        isPremium: premiumUserIds.has(profile.id),
        isVerified: Math.random() > 0.7
      })) || [];

      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadFollowingStatus = async () => {
    if (!user) return;
    
    try {
      const { data: followData } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', user.id);

      const followingIds = new Set(followData?.map(f => f.following_id) || []);
      setFollowingUsers(followingIds);
    } catch (error) {
      console.error('Error loading following status:', error);
    }
  };

  const handleFollow = async (userId: string) => {
    if (!user) return;

    try {
      const isFollowing = followingUsers.has(userId);
      
      if (isFollowing) {
        await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', userId);
        
        setFollowingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
        
        toast({
          title: "✅ Berhasil Unfollow",
          description: "Anda tidak lagi mengikuti pengguna ini",
        });
      } else {
        await supabase
          .from('user_follows')
          .insert({
            follower_id: user.id,
            following_id: userId
          });
        
        setFollowingUsers(prev => new Set([...prev, userId]));
        
        toast({
          title: "✅ Berhasil Follow",
          description: "Anda sekarang mengikuti pengguna ini",
        });
      }
    } catch (error) {
      console.error('Error handling follow:', error);
      toast({
        title: "❌ Gagal",
        description: "Terjadi kesalahan saat memproses permintaan",
        variant: "destructive",
      });
    }
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  const handleMessage = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      const chatUser: ChatUser = {
        id: targetUser.id,
        username: targetUser.username,
        display_name: targetUser.display_name,
        avatar_url: targetUser.avatar_url,
        is_online: targetUser.is_online
      };
      setSelectedChatUser(chatUser);
      setIsChatOpen(true);
    }
  };

  const filteredUsers = users.filter(userProfile => {
    const matchesSearch = localSearchQuery === '' || 
      userProfile.display_name.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
      userProfile.username.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
      userProfile.location?.toLowerCase().includes(localSearchQuery.toLowerCase());
    
    const matchesFilter = (() => {
      switch (activeFilter) {
        case 'online': return userProfile.is_online;
        case 'premium': return userProfile.isPremium;
        case 'nearby': return userProfile.location?.toLowerCase().includes('jakarta');
        default: return true;
      }
    })();
    
    return matchesSearch && matchesFilter;
  });

  const handleSearchChange = (query: string) => {
    setLocalSearchQuery(query);
    onSearchChange(query);
  };

  if (loading) {
    return (
      <div className="space-y-6 px-4 py-6">
        {/* Loading Header */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 animate-pulse">
          <div className="h-8 bg-white/10 rounded-lg w-48 mb-4" />
          <div className="h-4 bg-white/10 rounded w-32" />
        </div>

        {/* Loading Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 animate-pulse">
              <div className="h-12 bg-white/10 rounded-lg mb-2" />
              <div className="h-4 bg-white/10 rounded w-16" />
            </div>
          ))}
        </div>

        {/* Loading Users */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/10 rounded-2xl" />
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded mb-2" />
                  <div className="h-3 bg-white/10 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 px-4 py-6">
        {/* Modern Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-200 bg-clip-text text-transparent flex items-center gap-3">
                🌟 Jelajahi Angler
              </h2>
              <p className="text-white/70 text-sm mt-1">
                Temukan dan terhubung dengan {users.length} pemancing lainnya
              </p>
            </div>
          </div>

          {/* Modern Search and Filter */}
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <Input
                placeholder="Cari angler berdasarkan nama atau lokasi..."
                value={localSearchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-white/40 backdrop-blur-xl"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'Semua', icon: Users },
                { id: 'online', label: 'Online', icon: Eye },
                { id: 'premium', label: 'Premium', icon: Crown },
                { id: 'nearby', label: 'Terdekat', icon: MapPin }
              ].map((filter) => (
                <Button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as any)}
                  variant={activeFilter === filter.id ? 'default' : 'outline'}
                  size="sm"
                  className={`${
                    activeFilter === filter.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-xl'
                  }`}
                >
                  <filter.icon className="w-4 h-4 mr-2" />
                  {filter.label}
                </Button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-white/10 backdrop-blur-xl rounded-lg p-1 border border-white/20">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange('grid')}
                  className={`p-2 ${
                    viewMode === 'grid' 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewModeChange('list')}
                  className={`p-2 ${
                    viewMode === 'list' 
                      ? 'bg-white/20 text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Modern Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { icon: Users, label: 'Total', value: stats.totalUsers, gradient: 'from-blue-500 to-cyan-500' },
            { icon: Eye, label: 'Online', value: stats.onlineUsers, gradient: 'from-green-500 to-emerald-500' },
            { icon: Crown, label: 'Premium', value: stats.premiumUsers, gradient: 'from-yellow-500 to-orange-500' },
            { icon: Award, label: 'Verified', value: stats.verifiedUsers, gradient: 'from-purple-500 to-pink-500' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-xs font-medium">{stat.label}</p>
                  <p className="text-xl font-bold text-white group-hover:scale-105 transition-transform duration-200">
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modern Users Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Angler Terpilih
              </h3>
              <Badge className="bg-white/20 text-white border-white/30">
                {filteredUsers.length}
              </Badge>
            </div>
          </div>

          <div className="p-6">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white/60" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  {localSearchQuery || activeFilter !== 'all' ? 'Tidak Ada Hasil' : 'Belum Ada Pengguna'}
                </h3>
                <p className="text-white/60 text-sm">
                  {localSearchQuery || activeFilter !== 'all' 
                    ? 'Coba ubah filter atau kata kunci pencarian'
                    : 'Belum ada pengguna yang ditemukan'
                  }
                </p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                <AnimatePresence>
                  {filteredUsers.map((userProfile, index) => (
                    <motion.div
                      key={userProfile.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                    >
                      {/* User Header */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                          <img
                            src={userProfile.avatar_url}
                            alt={userProfile.display_name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20"
                          />
                          {userProfile.is_online && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white/50 flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white text-lg truncate">
                              {userProfile.display_name}
                            </h3>
                            {userProfile.isPremium && (
                              <Crown className="w-4 h-4 text-yellow-500" />
                            )}
                            {userProfile.isVerified && (
                              <Star className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                          <p className="text-white/70 text-sm">@{userProfile.username}</p>
                          {userProfile.location && (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3 text-white/60" />
                              <p className="text-white/60 text-xs">{userProfile.location}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Fish className="w-4 h-4 text-blue-400" />
                            <span className="text-white font-semibold">{userProfile.fish_caught}</span>
                          </div>
                          <p className="text-white/60 text-xs">Tangkapan</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Users className="w-4 h-4 text-green-400" />
                            <span className="text-white font-semibold">{userProfile.followers_count}</span>
                          </div>
                          <p className="text-white/60 text-xs">Pengikut</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Award className="w-4 h-4 text-purple-400" />
                            <span className="text-white font-semibold">{userProfile.level}</span>
                          </div>
                          <p className="text-white/60 text-xs">Level</p>
                        </div>
                      </div>

                      {/* Bio */}
                      {userProfile.bio && (
                        <p className="text-white/70 text-sm mb-4 line-clamp-2">
                          {userProfile.bio}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleViewProfile(userProfile.id)}
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-xl"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Lihat
                        </Button>
                        
                        <Button
                          onClick={() => handleFollow(userProfile.id)}
                          variant={followingUsers.has(userProfile.id) ? 'default' : 'outline'}
                          size="sm"
                          className={`flex-1 ${
                            followingUsers.has(userProfile.id)
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-transparent'
                              : 'bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-xl'
                          }`}
                        >
                          {followingUsers.has(userProfile.id) ? (
                            <>
                              <UserCheck className="w-4 h-4 mr-2" />
                              Following
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Follow
                            </>
                          )}
                        </Button>
                        
                        <Button
                          onClick={() => handleMessage(userProfile.id)}
                          variant="outline"
                          size="sm"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-xl"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modern Chat Popup with Back Navigation */}
      <ModernChatPopup
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setSelectedChatUser(null);
        }}
        selectedUser={selectedChatUser}
      />
    </>
  );
};

export default Ultra2025UsersTab;
