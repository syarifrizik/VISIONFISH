
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserCheck, MessageSquare, Users } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useIsMobile } from '@/hooks/use-mobile';

interface FollowersSubTabProps {
  searchQuery?: string;
  onCountChange?: (count: number) => void;
}

interface Follower {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  fish_caught: number;
  followers_count: number;
  is_online: boolean;
  is_mutual: boolean;
}

const FollowersSubTab = ({ searchQuery = '', onCountChange }: FollowersSubTabProps) => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  const isMobile = useIsMobile();
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFollowers = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      // Get users who follow the current user
      const { data: followsData, error: followsError } = await supabase
        .from('user_follows')
        .select('follower_id')
        .eq('following_id', user.id);

      if (followsError) throw followsError;

      if (!followsData || followsData.length === 0) {
        setFollowers([]);
        return;
      }

      const followerIds = followsData.map(follow => follow.follower_id);

      // Get profile data for followers
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url, bio, fish_caught, followers_count, is_online')
        .in('id', followerIds);

      if (profilesError) throw profilesError;

      // Check which followers are also followed by current user (mutual)
      const { data: mutualData, error: mutualError } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', user.id)
        .in('following_id', followerIds);

      if (mutualError) throw mutualError;

      const mutualIds = new Set(mutualData?.map(m => m.following_id) || []);

      const transformedFollowers = (profilesData || []).map(profile => ({
        id: profile.id,
        username: profile.username || '',
        display_name: profile.display_name || profile.username || 'Unnamed User',
        avatar_url: profile.avatar_url || '',
        bio: profile.bio || '',
        fish_caught: profile.fish_caught || 0,
        followers_count: profile.followers_count || 0,
        is_online: profile.is_online || false,
        is_mutual: mutualIds.has(profile.id)
      }));

      setFollowers(transformedFollowers);
    } catch (error) {
      console.error('Error fetching followers:', error);
      setError('Gagal memuat daftar followers');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchFollowers();
    }
  }, [fetchFollowers]);

  const handleFollowBack = useCallback(async (userId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('user_follows')
        .insert({ follower_id: user.id, following_id: userId });

      if (error) throw error;

      // Update local state
      setFollowers(prev => prev.map(f => 
        f.id === userId ? { ...f, is_mutual: true } : f
      ));
      showNotification('Berhasil follow back!', 'success');
    } catch (error) {
      console.error('Error following back:', error);
      showNotification('Gagal follow back', 'error');
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

      // Update local state
      setFollowers(prev => prev.map(f => 
        f.id === userId ? { ...f, is_mutual: false } : f
      ));
      showNotification('Berhasil unfollow', 'success');
    } catch (error) {
      console.error('Error unfollowing:', error);
      showNotification('Gagal unfollow', 'error');
    }
  }, [user?.id, showNotification]);

  // Memoize filtered followers to prevent unnecessary recalculations
  const filteredFollowers = useMemo(() => {
    if (!searchQuery) return followers;
    const query = searchQuery.toLowerCase();
    return followers.filter(follower =>
      follower.display_name.toLowerCase().includes(query) ||
      follower.username.toLowerCase().includes(query) ||
      follower.bio.toLowerCase().includes(query)
    );
  }, [followers, searchQuery]);

  // Stable callback for count updates to prevent infinite loops
  const stableOnCountChange = useCallback((count: number) => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [onCountChange]);

  // Update count only when filtered followers actually change
  useEffect(() => {
    stableOnCountChange(filteredFollowers.length);
  }, [filteredFollowers.length, stableOnCountChange]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse bg-white/50 dark:bg-gray-900/50">
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
        <Button onClick={fetchFollowers} variant="outline" className="mt-2">
          Coba Lagi
        </Button>
      </div>
    );
  }

  if (filteredFollowers.length === 0) {
    return (
      <div className="text-center py-8">
        <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          {searchQuery ? 'Tidak ada followers yang ditemukan' : 'Belum ada yang mengikuti Anda'}
        </p>
        {!searchQuery && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Bagikan profil Anda untuk mendapatkan followers
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {filteredFollowers.map((follower, index) => (
        <motion.div
          key={follower.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.02 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-white/30 dark:border-gray-700/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={follower.avatar_url} alt={follower.display_name} />
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                      {follower.display_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {follower.is_online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                  )}
                  {follower.is_mutual && (
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
                          {follower.display_name}
                        </h3>
                        {follower.is_mutual && (
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
                            Mutual
                          </Badge>
                        )}
                      </div>
                      {follower.username && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          @{follower.username}
                        </p>
                      )}
                      {follower.bio && (
                        <p className="text-gray-600 dark:text-gray-300 mt-1 line-clamp-2 text-sm">
                          {follower.bio}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900/30 text-xs">
                          {follower.fish_caught} tangkapan
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-xs">
                          {follower.followers_count} followers
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-8"
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Chat
                      </Button>
                      
                      {follower.is_mutual ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnfollow(follower.id)}
                          className="text-blue-600 hover:text-blue-700 text-xs h-8"
                        >
                          <UserCheck className="w-3 h-3 mr-1" />
                          Following
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleFollowBack(follower.id)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs h-8"
                        >
                          Follow Back
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
  );
};

export default FollowersSubTab;
