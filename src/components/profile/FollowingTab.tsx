
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, UserMinus, MessageSquare, UserPlus } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

interface FollowingTabProps {
  searchQuery?: string;
  onItemCountChange?: (count: number) => void;
}

interface FollowingUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  fish_caught: number;
  followers_count: number;
  is_online: boolean;
}

const FollowingTab = ({ searchQuery = '', onItemCountChange }: FollowingTabProps) => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  const [followingUsers, setFollowingUsers] = useState<FollowingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchFollowingUsers();
    }
  }, [user?.id]);

  const fetchFollowingUsers = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      // First get the list of users that the current user is following
      const { data: followsData, error: followsError } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', user.id);

      if (followsError) throw followsError;

      if (!followsData || followsData.length === 0) {
        setFollowingUsers([]);
        return;
      }

      // Extract the following user IDs
      const followingIds = followsData.map(follow => follow.following_id);

      // Now get the profile data for those users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url, bio, fish_caught, followers_count, is_online')
        .in('id', followingIds);

      if (profilesError) throw profilesError;

      const transformedUsers = (profilesData || []).map(profile => ({
        id: profile.id,
        username: profile.username || '',
        display_name: profile.display_name || profile.username || 'Unnamed User',
        avatar_url: profile.avatar_url || '',
        bio: profile.bio || '',
        fish_caught: profile.fish_caught || 0,
        followers_count: profile.followers_count || 0,
        is_online: profile.is_online || false
      }));

      setFollowingUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching following users:', error);
      setError('Gagal memuat daftar following');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async (userId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userId);

      if (error) throw error;

      // Update local state
      setFollowingUsers(prev => prev.filter(u => u.id !== userId));
      showNotification('Berhasil unfollow pengguna', 'success');
    } catch (error) {
      console.error('Error unfollowing user:', error);
      showNotification('Gagal unfollow pengguna', 'error');
    }
  };

  // Filter users based on search query
  const filteredUsers = followingUsers.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.display_name.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.bio.toLowerCase().includes(query)
    );
  });

  // Update item count when filtered users change
  useEffect(() => {
    if (onItemCountChange) {
      onItemCountChange(filteredUsers.length);
    }
  }, [filteredUsers.length, onItemCountChange]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
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
        <Button onClick={fetchFollowingUsers} variant="outline" className="mt-2">
          Coba Lagi
        </Button>
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          {searchQuery ? 'Tidak ada pengguna yang ditemukan' : 'Belum mengikuti siapa pun'}
        </p>
        {!searchQuery && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Mulai ikuti pengguna lain untuk melihat aktivitas mereka
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredUsers.map((followingUser, index) => (
        <motion.div
          key={followingUser.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={followingUser.avatar_url} alt={followingUser.display_name} />
                    <AvatarFallback>
                      {followingUser.display_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {followingUser.is_online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {followingUser.display_name}
                      </h3>
                      {followingUser.username && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          @{followingUser.username}
                        </p>
                      )}
                      {followingUser.bio && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                          {followingUser.bio}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {followingUser.fish_caught} tangkapan
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {followingUser.followers_count} followers
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Chat
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUnfollow(followingUser.id)}
                        className="text-red-600 hover:text-red-700 text-xs"
                      >
                        <UserMinus className="w-3 h-3 mr-1" />
                        Unfollow
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default FollowingTab;
