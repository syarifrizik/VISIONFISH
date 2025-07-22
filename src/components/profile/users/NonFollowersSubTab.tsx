
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, MessageSquare, Sparkles } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useIsMobile } from '@/hooks/use-mobile';

interface NonFollowersSubTabProps {
  searchQuery?: string;
  onCountChange?: (count: number) => void;
}

interface NonFollower {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  fish_caught: number;
  followers_count: number;
  is_online: boolean;
  is_new: boolean;
}

const NonFollowersSubTab = ({ searchQuery = '', onCountChange }: NonFollowersSubTabProps) => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  const isMobile = useIsMobile();
  const [nonFollowers, setNonFollowers] = useState<NonFollower[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNonFollowers = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      // Get users that current user is following
      const { data: followingData, error: followingError } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', user.id);

      if (followingError) throw followingError;

      const followingIds = followingData?.map(f => f.following_id) || [];
      const excludeIds = [...followingIds, user.id]; // Exclude following users and self

      // Get profiles not being followed
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url, bio, fish_caught, followers_count, is_online, created_at')
        .not('id', 'in', `(${excludeIds.join(',')})`)
        .order('created_at', { ascending: false })
        .limit(50); // Limit for performance

      if (profilesError) throw profilesError;

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const transformedNonFollowers = (profilesData || []).map(profile => ({
        id: profile.id,
        username: profile.username || '',
        display_name: profile.display_name || profile.username || 'Unnamed User',
        avatar_url: profile.avatar_url || '',
        bio: profile.bio || '',
        fish_caught: profile.fish_caught || 0,
        followers_count: profile.followers_count || 0,
        is_online: profile.is_online || false,
        is_new: new Date(profile.created_at) > thirtyDaysAgo
      }));

      setNonFollowers(transformedNonFollowers);
    } catch (error) {
      console.error('Error fetching non-followers:', error);
      setError('Gagal memuat daftar pengguna');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchNonFollowers();
    }
  }, [fetchNonFollowers]);

  const handleFollow = useCallback(async (userId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('user_follows')
        .insert({ follower_id: user.id, following_id: userId });

      if (error) throw error;

      // Remove from non-followers list
      setNonFollowers(prev => prev.filter(u => u.id !== userId));
      showNotification('Berhasil mengikuti pengguna!', 'success');
    } catch (error) {
      console.error('Error following user:', error);
      showNotification('Gagal mengikuti pengguna', 'error');
    }
  }, [user?.id, showNotification]);

  // Memoize filtered non-followers to prevent unnecessary recalculations
  const filteredNonFollowers = useMemo(() => {
    if (!searchQuery) return nonFollowers;
    const query = searchQuery.toLowerCase();
    return nonFollowers.filter(user =>
      user.display_name.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.bio.toLowerCase().includes(query)
    );
  }, [nonFollowers, searchQuery]);

  // Stable callback for count updates to prevent infinite loops
  const stableOnCountChange = useCallback((count: number) => {
    if (onCountChange) {
      onCountChange(count);
    }
  }, [onCountChange]);

  // Update count only when filtered non-followers actually change
  useEffect(() => {
    stableOnCountChange(filteredNonFollowers.length);
  }, [filteredNonFollowers.length, stableOnCountChange]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse bg-white/50 dark:bg-gray-900/50 mx-3">
            <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
              <div className="flex items-center gap-3">
                <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} bg-gray-200 dark:bg-gray-700 rounded-full`}></div>
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
      <div className={`text-center py-8 ${isMobile ? 'px-3' : 'px-0'}`}>
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <Button onClick={fetchNonFollowers} variant="outline" className="mt-2">
          Coba Lagi
        </Button>
      </div>
    );
  }

  if (filteredNonFollowers.length === 0) {
    return (
      <div className={`text-center py-8 ${isMobile ? 'px-3' : 'px-0'}`}>
        <Sparkles className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} text-gray-400 mx-auto mb-4`} />
        <p className="text-gray-600 dark:text-gray-400">
          {searchQuery ? 'Tidak ada pengguna baru yang ditemukan' : 'Semua pengguna sudah Anda ikuti!'}
        </p>
        {!searchQuery && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Periksa kembali nanti untuk pengguna baru
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`grid gap-3 ${isMobile ? 'max-h-[250px] overflow-y-auto' : ''}`}>
      {filteredNonFollowers.map((targetUser, index) => (
        <motion.div
          key={targetUser.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.02 }}
          className={isMobile ? 'mx-3' : ''}
        >
          <Card className="hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-white/30 dark:border-gray-700/30 relative overflow-hidden">
            {targetUser.is_new && (
              <div className={`absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-pink-500 text-white ${isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1'} rounded-bl-lg`}>
                <Sparkles className={`${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'} inline mr-1`} />
                Baru
              </div>
            )}
            
            <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
              <div className={`flex items-center gap-${isMobile ? '2' : '3'}`}>
                <div className="relative">
                  <Avatar className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'}`}>
                    <AvatarImage src={targetUser.avatar_url} alt={targetUser.display_name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      {targetUser.display_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {targetUser.is_online && (
                    <div className={`absolute -bottom-0.5 -right-0.5 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'} bg-green-500 border-2 border-white dark:border-gray-900 rounded-full`}></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold text-gray-900 dark:text-white ${isMobile ? 'text-sm' : 'text-base'}`}>
                          {targetUser.display_name}
                        </h3>
                        {targetUser.is_new && (
                          <Badge className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 ${isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs'}`}>
                            New
                          </Badge>
                        )}
                      </div>
                      {targetUser.username && (
                        <p className={`text-gray-500 dark:text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          @{targetUser.username}
                        </p>
                      )}
                      {targetUser.bio && (
                        <p className={`text-gray-600 dark:text-gray-300 mt-1 line-clamp-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          {targetUser.bio}
                        </p>
                      )}
                      
                      <div className={`flex items-center gap-${isMobile ? '2' : '3'} mt-2`}>
                        <Badge variant="outline" className={`bg-purple-50 dark:bg-purple-900/30 ${isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs'}`}>
                          {targetUser.fish_caught} tangkapan
                        </Badge>
                        <Badge variant="outline" className={`bg-pink-50 dark:bg-pink-900/30 ${isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs'}`}>
                          {targetUser.followers_count} followers
                        </Badge>
                      </div>
                    </div>
                    
                    <div className={`flex gap-${isMobile ? '1' : '2'} ${isMobile ? 'flex-col' : ''}`}>
                      <Button
                        size={isMobile ? "sm" : "sm"}
                        variant="outline"
                        className={`${isMobile ? 'text-xs h-7 px-2' : 'text-xs h-8'}`}
                        style={{ minHeight: isMobile ? '28px' : '32px' }}
                      >
                        <MessageSquare className={`${isMobile ? 'w-3 h-3 mr-0.5' : 'w-3 h-3 mr-1'}`} />
                        {!isMobile && 'Chat'}
                      </Button>
                      
                      <Button
                        size={isMobile ? "sm" : "sm"}
                        onClick={() => handleFollow(targetUser.id)}
                        className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white ${isMobile ? 'text-xs h-7 px-2' : 'text-xs h-8'}`}
                        style={{ minHeight: isMobile ? '28px' : '32px' }}
                      >
                        <UserPlus className={`${isMobile ? 'w-3 h-3 mr-0.5' : 'w-3 h-3 mr-1'}`} />
                        {!isMobile && 'Follow'}
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

export default NonFollowersSubTab;
