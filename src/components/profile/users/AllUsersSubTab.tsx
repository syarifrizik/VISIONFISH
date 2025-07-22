import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, UserCheck, MessageSquare, Users, Eye } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import ChatPopup from '@/components/chat/ChatPopup';

interface AllUsersSubTabProps {
  searchQuery?: string;
  onCountChange?: (count: number) => void;
}

interface User {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  fish_caught: number;
  followers_count: number;
  is_online: boolean;
  is_following: boolean;
  is_followed_by: boolean;
  is_private: boolean;
}

const AllUsersSubTab = ({ searchQuery = '', onCountChange }: AllUsersSubTabProps) => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatPopupOpen, setChatPopupOpen] = useState(false);
  const [selectedChatUserId, setSelectedChatUserId] = useState<string | null>(null);

  const fetchAllUsers = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      // Get all profiles except current user
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url, bio, fish_caught, followers_count, is_online, is_private')
        .neq('id', user.id)
        .order('created_at', { ascending: false })
        .limit(100); // Limit for performance

      if (profilesError) throw profilesError;

      if (!profilesData || profilesData.length === 0) {
        setUsers([]);
        return;
      }

      const userIds = profilesData.map(profile => profile.id);

      // Get following relationships
      const { data: followingData, error: followingError } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', user.id)
        .in('following_id', userIds);

      if (followingError) throw followingError;

      // Get follower relationships
      const { data: followersData, error: followersError } = await supabase
        .from('user_follows')
        .select('follower_id')
        .eq('following_id', user.id)
        .in('follower_id', userIds);

      if (followersError) throw followersError;

      const followingIds = new Set(followingData?.map(f => f.following_id) || []);
      const followerIds = new Set(followersData?.map(f => f.follower_id) || []);

      const transformedUsers = profilesData.map(profile => ({
        id: profile.id,
        username: profile.username || '',
        display_name: profile.display_name || profile.username || 'Unnamed User',
        avatar_url: profile.avatar_url || '',
        bio: profile.bio || '',
        fish_caught: profile.fish_caught || 0,
        followers_count: profile.followers_count || 0,
        is_online: profile.is_online || false,
        is_following: followingIds.has(profile.id),
        is_followed_by: followerIds.has(profile.id),
        is_private: profile.is_private || false
      }));

      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching all users:', error);
      setError('Gagal memuat daftar pengguna');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchAllUsers();
    }
  }, [fetchAllUsers]);

  const handleFollow = useCallback(async (userId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('user_follows')
        .insert({ follower_id: user.id, following_id: userId });

      if (error) throw error;

      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, is_following: true } : u
      ));
      showNotification('Berhasil mengikuti pengguna!', 'success');
    } catch (error) {
      console.error('Error following user:', error);
      showNotification('Gagal mengikuti pengguna', 'error');
    }
  }, [user?.id, showNotification]);

  const handleUnfollow = useCallback(async (userId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, is_following: false } : u
      ));
      showNotification('Berhasil unfollow', 'success');
    } catch (error) {
      console.error('Error unfollowing:', error);
      showNotification('Gagal unfollow', 'error');
    }
  }, [user?.id, showNotification]);

  const handleViewProfile = useCallback((userId: string, isPrivate: boolean, isFollowing: boolean) => {
    // Check if user can view profile based on privacy settings
    if (isPrivate && !isFollowing) {
      showNotification('Profil ini bersifat privat', 'info');
      return;
    }
    
    // Navigate to user profile page
    navigate(`/user/${userId}`);
  }, [navigate, showNotification]);

  const handleChat = useCallback((userId: string) => {
    setSelectedChatUserId(userId);
    setChatPopupOpen(true);
  }, []);

  // Memoize filtered users to prevent unnecessary recalculations
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(user =>
      user.display_name.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.bio.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  // Stable callback for count updates to prevent infinite loops
  const stableOnCountChange = useCallback((count: number) => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [onCountChange]);

  // Update count only when filtered users actually change
  useEffect(() => {
    stableOnCountChange(filteredUsers.length);
  }, [filteredUsers.length, stableOnCountChange]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse bg-white/50 dark:bg-gray-900/50">
            <CardContent className={`${isMobile ? 'p-4' : 'p-4'}`}>
              <div className="flex items-center gap-3">
                <div className={`${isMobile ? 'w-12 h-12' : 'w-12 h-12'} bg-gray-200 dark:bg-gray-700 rounded-full`}></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <Button onClick={fetchAllUsers} variant="outline" className="mt-2">
          Coba Lagi
        </Button>
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className={`${isMobile ? 'w-12 h-12' : 'w-12 h-12'} text-gray-400 mx-auto mb-4`} />
        <p className="text-gray-600 dark:text-gray-400">
          {searchQuery ? 'Tidak ada pengguna yang ditemukan' : 'Belum ada pengguna lain'}
        </p>
        {!searchQuery && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Pengguna baru akan muncul di sini
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {filteredUsers.map((targetUser, index) => (
          <motion.div
            key={targetUser.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-white/30 dark:border-gray-700/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={targetUser.avatar_url} alt={targetUser.display_name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                        {targetUser.display_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {targetUser.is_online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                    )}
                    {targetUser.is_following && targetUser.is_followed_by && (
                      <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center">
                        <Users className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                            {targetUser.display_name}
                          </h3>
                          {targetUser.is_private && (
                            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 text-xs">
                              Private
                            </Badge>
                          )}
                          {targetUser.is_following && targetUser.is_followed_by && (
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
                              Mutual
                            </Badge>
                          )}
                          {targetUser.is_followed_by && !targetUser.is_following && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs">
                              Follows You
                            </Badge>
                          )}
                        </div>
                        {targetUser.username && (
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            @{targetUser.username}
                          </p>
                        )}
                        {targetUser.bio && (
                          <p className="text-gray-600 dark:text-gray-300 mt-1 line-clamp-2 text-sm">
                            {targetUser.bio}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-xs">
                            {targetUser.fish_caught} tangkapan
                          </Badge>
                          <Badge variant="outline" className="bg-cyan-50 dark:bg-cyan-900/30 text-xs">
                            {targetUser.followers_count} followers
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewProfile(targetUser.id, targetUser.is_private, targetUser.is_following)}
                          className="text-xs h-8"
                          title="Lihat Profil"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Profil
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleChat(targetUser.id)}
                          className="text-xs h-8"
                          title="Mulai Chat"
                        >
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Chat
                        </Button>
                        
                        {targetUser.is_following ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUnfollow(targetUser.id)}
                            className="text-blue-600 hover:text-blue-700 text-xs h-8"
                          >
                            <UserCheck className="w-3 h-3 mr-1" />
                            Following
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleFollow(targetUser.id)}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xs h-8"
                          >
                            <UserPlus className="w-3 h-3 mr-1" />
                            Follow
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chat Popup */}
      <ChatPopup
        isOpen={chatPopupOpen}
        onClose={() => {
          setChatPopupOpen(false);
          setSelectedChatUserId(null);
        }}
        initialUserId={selectedChatUserId || undefined}
      />
    </>
  );
};

export default AllUsersSubTab;
