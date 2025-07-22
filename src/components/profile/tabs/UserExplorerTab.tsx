
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import CompactMobileTabNavigation from '@/components/profile/mobile2025/CompactMobileTabNavigation';
import OptimizedMobileSearch from '@/components/profile/mobile2025/OptimizedMobileSearch';
import CompactUserCard from '@/components/profile/mobile2025/CompactUserCard';
import DesktopUserExplorer from '@/components/profile/desktop/DesktopUserExplorer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  location?: string;
  fish_caught?: number;
  is_following?: boolean;
  is_private?: boolean;
}

const UserExplorerTab = () => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('all');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, [activeTab, searchQuery]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          username,
          display_name,
          avatar_url,
          location,
          fish_caught,
          is_private
        `)
        .limit(20);

      if (searchQuery) {
        query = query.or(`username.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`);
      }

      if (currentUser?.id) {
        query = query.neq('id', currentUser.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Get follow status for each user
      let usersWithFollowStatus = [];
      if (data && currentUser?.id) {
        const { data: followData } = await supabase
          .from('user_follows')
          .select('following_id')
          .eq('follower_id', currentUser.id)
          .in('following_id', data.map(u => u.id));

        const followingIds = new Set(followData?.map(f => f.following_id) || []);

        usersWithFollowStatus = data.map(user => ({
          ...user,
          username: user.username || `user_${user.id.slice(0, 8)}`,
          display_name: user.display_name || `User ${user.id.slice(0, 8)}`,
          fish_caught: user.fish_caught || 0,
          location: user.location || '',
          is_following: followingIds.has(user.id),
          is_private: user.is_private || false
        }));
      } else {
        usersWithFollowStatus = (data || []).map(user => ({
          ...user,
          username: user.username || `user_${user.id.slice(0, 8)}`,
          display_name: user.display_name || `User ${user.id.slice(0, 8)}`,
          fish_caught: user.fish_caught || 0,
          location: user.location || '',
          is_following: false,
          is_private: user.is_private || false
        }));
      }

      // Filter based on active tab
      if (activeTab === 'following') {
        usersWithFollowStatus = usersWithFollowStatus.filter(u => u.is_following);
      } else if (activeTab === 'followers') {
        // Load followers instead
        if (currentUser?.id) {
          const { data: followerData } = await supabase
            .from('user_follows')
            .select(`
              follower_id,
              profiles!user_follows_follower_id_fkey (
                id,
                username,
                display_name,
                avatar_url,
                location,
                fish_caught,
                is_private
              )
            `)
            .eq('following_id', currentUser.id);

          usersWithFollowStatus = (followerData || []).map(item => {
            const profile = item.profiles as any;
            return {
              id: profile.id,
              username: profile.username || `user_${profile.id.slice(0, 8)}`,
              display_name: profile.display_name || `User ${profile.id.slice(0, 8)}`,
              avatar_url: profile.avatar_url,
              location: profile.location || '',
              fish_caught: profile.fish_caught || 0,
              is_following: true, // They're following us, we might be following back
              is_private: profile.is_private || false
            };
          });
        }
      }

      setUsers(usersWithFollowStatus);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Gagal memuat daftar pengguna",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (filters: any) => {
    console.log('Apply filters:', filters);
    toast({
      title: "Filter Diterapkan",
      description: `Filter: ${filters.type}`,
    });
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  const handleMessage = (userId: string) => {
    if (!currentUser) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login untuk memulai chat",
        variant: "destructive"
      });
      return;
    }
    navigate(`/chat/${userId}`);
  };

  const handleFollow = async (userId: string) => {
    if (!currentUser) {
      toast({
        title: "Login Diperlukan",
        description: "Silakan login untuk mengikuti pengguna",
        variant: "destructive"
      });
      return;
    }

    const user = users.find(u => u.id === userId);
    if (!user) return;

    try {
      if (user.is_following) {
        await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', userId);

        toast({
          title: "Berhenti Mengikuti",
          description: `Berhenti mengikuti ${user.display_name}`,
        });
      } else {
        await supabase
          .from('user_follows')
          .insert({
            follower_id: currentUser.id,
            following_id: userId
          });

        toast({
          title: "Mengikuti",
          description: `Mengikuti ${user.display_name}`,
        });
      }

      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, is_following: !u.is_following }
          : u
      ));
    } catch (error) {
      console.error('Error updating follow status:', error);
      toast({
        title: "Error",
        description: "Gagal mengubah status mengikuti",
        variant: "destructive"
      });
    }
  };

  // Desktop layout
  if (!isMobile) {
    return <DesktopUserExplorer />;
  }

  // Mobile layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Mobile Tab Navigation */}
      <CompactMobileTabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={{
          all: users.length,
          following: users.filter(u => u.is_following).length,
          followers: Math.floor(users.length * 0.3)
        }}
      />

      {/* Mobile Search */}
      <OptimizedMobileSearch
        onSearch={handleSearch}
        onFilter={handleFilter}
        placeholder="Cari pemancing..."
      />

      {/* Users List */}
      <div className="px-4 pb-20">
        {isLoading ? (
          <div className="space-y-3 mt-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-white/10 rounded mb-2" />
                    <div className="h-3 bg-white/10 rounded w-2/3 mb-2" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                  </div>
                  <div className="flex gap-1">
                    <div className="w-9 h-9 bg-white/10 rounded-xl" />
                    <div className="w-9 h-9 bg-white/10 rounded-xl" />
                    <div className="w-9 h-9 bg-white/10 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3 mt-4"
          >
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CompactUserCard
                  user={user}
                  onViewProfile={handleViewProfile}
                  onMessage={handleMessage}
                  onFollow={handleFollow}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {users.length === 0 && !isLoading && (
          <div className="text-center py-12 mt-4">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <p className="text-white/70 text-lg font-medium mb-2">
              Tidak ada hasil
            </p>
            <p className="text-white/50 text-sm">
              Coba kata kunci lain atau ubah filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserExplorerTab;
