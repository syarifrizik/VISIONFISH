
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Eye, 
  MessageCircle, 
  UserPlus, 
  UserCheck,
  MapPin,
  Fish,
  Filter
} from 'lucide-react';
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
}

const DesktopUserExplorer = () => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, [searchQuery]);

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
          fish_caught
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

      const usersWithMockData = (data || []).map(user => ({
        ...user,
        username: user.username || `user_${user.id.slice(0, 8)}`,
        display_name: user.display_name || `User ${user.id.slice(0, 8)}`,
        fish_caught: user.fish_caught || Math.floor(Math.random() * 50),
        location: user.location || ['Jakarta', 'Bali', 'Surabaya', 'Medan'][Math.floor(Math.random() * 4)],
        is_following: Math.random() > 0.7
      }));

      setUsers(usersWithMockData);
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

  const handleViewProfile = (userId: string) => {
    navigate(`/user/${userId}`);
    toast({
      title: "Navigasi Profil",
      description: "Menuju ke profil pengguna...",
    });
  };

  const handleMessage = (userId: string) => {
    navigate(`/chat/${userId}`);
    toast({
      title: "Membuka Chat",
      description: "Menuju ke halaman chat...",
    });
  };

  const handleFollow = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, is_following: !user.is_following }
        : user
    ));
    
    const user = users.find(u => u.id === userId);
    const isFollowing = user?.is_following;
    
    toast({
      title: isFollowing ? "Berhenti Mengikuti" : "Mengikuti",
      description: `${isFollowing ? 'Berhenti mengikuti' : 'Mengikuti'} ${user?.display_name}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari pemancing..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/70 dark:bg-gray-800/70 border-white/30"
          />
        </div>
        <Button variant="outline" className="bg-white/70 dark:bg-gray-800/70">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Users Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {/* Avatar - Clickable */}
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer"
                      onClick={() => handleViewProfile(user.id)}
                    >
                      <Avatar className="w-12 h-12 ring-2 ring-white/20 shadow-lg">
                        <AvatarImage src={user.avatar_url} alt={user.display_name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-bold">
                          {user.display_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>

                    {/* User Info - Clickable */}
                    <div 
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => handleViewProfile(user.id)}
                    >
                      <h3 className="font-bold text-gray-900 dark:text-white truncate hover:text-blue-600 transition-colors">
                        {user.display_name || user.username}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        @{user.username}
                      </p>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
                    {user.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{user.location}</span>
                      </div>
                    )}
                    {user.fish_caught && (
                      <div className="flex items-center gap-1">
                        <Fish className="w-3 h-3" />
                        <span>{user.fish_caught}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* View Profile */}
                    <Button
                      onClick={() => handleViewProfile(user.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Profil
                    </Button>

                    {/* Message */}
                    <Button
                      onClick={() => handleMessage(user.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </Button>

                    {/* Follow/Unfollow */}
                    <Button
                      onClick={() => handleFollow(user.id)}
                      variant={user.is_following ? "default" : "outline"}
                      size="sm"
                      className="flex-1"
                    >
                      {user.is_following ? (
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
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {users.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mb-6">
            <span className="text-3xl">🔍</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Tidak ada hasil
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Coba kata kunci lain atau ubah filter pencarian
          </p>
        </div>
      )}
    </div>
  );
};

export default DesktopUserExplorer;
