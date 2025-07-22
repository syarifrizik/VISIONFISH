
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Users, 
  MapPin, 
  Fish, 
  Trophy,
  UserPlus,
  MessageCircle,
  Crown,
  Star,
  Calendar,
  Zap,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AnglerProfile {
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
  last_seen_at?: string;
  created_at: string;
  level: number;
  isPremium: boolean;
  isVerified: boolean;
  recentCatch?: {
    species: string;
    weight: number;
    location: string;
  };
}

interface Ultra2025UserExplorerProps {
  userId: string;
}

const Ultra2025UserExplorer = ({ userId }: Ultra2025UserExplorerProps) => {
  const [anglers, setAnglers] = useState<AnglerProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'online' | 'premium' | 'nearby'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch angler profiles from Supabase
  useEffect(() => {
    const fetchAnglers = async () => {
      try {
        setIsLoading(true);
        
        // Fetch profiles with related data
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
            last_seen_at,
            created_at
          `)
          .neq('id', userId) // Exclude current user
          .order('fish_caught', { ascending: false })
          .limit(20);

        if (profilesError) throw profilesError;

        // Get recent catches for each user
        const userIds = profiles?.map(p => p.id) || [];
        const { data: recentCatches } = await supabase
          .from('fish_catches')
          .select('user_id, species_name, weight_kg, location, created_at')
          .in('user_id', userIds)
          .order('created_at', { ascending: false });

        // Check premium status for users
        const { data: subscriptions } = await supabase
          .from('subscriptions')
          .select('user_id')
          .in('user_id', userIds)
          .eq('plan_type', 'premium')
          .eq('is_active', true);

        const premiumUserIds = new Set(subscriptions?.map(s => s.user_id) || []);

        // Transform data
        const transformedAnglers: AnglerProfile[] = profiles?.map(profile => {
          // Find most recent catch for this user
          const userCatches = recentCatches?.filter(c => c.user_id === profile.id) || [];
          const mostRecentCatch = userCatches[0];

          // Calculate level based on fish caught
          const level = Math.floor(profile.fish_caught / 5) + 1;

          return {
            id: profile.id,
            username: profile.username || 'angler',
            display_name: profile.display_name || profile.username || 'Angler',
            avatar_url: profile.avatar_url || '/api/placeholder/60/60',
            location: profile.location,
            bio: profile.bio,
            fish_caught: profile.fish_caught || 0,
            followers_count: profile.followers_count || 0,
            following_count: profile.following_count || 0,
            is_online: profile.is_online || false,
            is_private: profile.is_private || false,
            last_seen_at: profile.last_seen_at,
            created_at: profile.created_at,
            level,
            isPremium: premiumUserIds.has(profile.id),
            isVerified: Math.random() > 0.7, // Mock verification
            recentCatch: mostRecentCatch ? {
              species: mostRecentCatch.species_name,
              weight: mostRecentCatch.weight_kg || 0,
              location: mostRecentCatch.location || 'Unknown'
            } : undefined
          };
        }) || [];

        setAnglers(transformedAnglers);
        
      } catch (error) {
        console.error('Error fetching anglers:', error);
        toast({
          title: "❌ Gagal Memuat Angler",
          description: "Menggunakan data contoh",
          variant: "destructive"
        });
        
        // Fallback to mock data
        setAnglers(getMockAnglers());
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchAnglers();
    }
  }, [userId, toast]);

  const getMockAnglers = (): AnglerProfile[] => [
    {
      id: '1',
      username: 'fishing_pro',
      display_name: 'Budi Santoso',
      avatar_url: '/api/placeholder/60/60',
      location: 'Jakarta Timur',
      bio: 'Professional angler with 10+ years experience',
      fish_caught: 147,
      followers_count: 256,
      following_count: 89,
      is_online: true,
      is_private: false,
      created_at: '2023-01-15',
      level: 29,
      isPremium: true,
      isVerified: true,
      recentCatch: {
        species: 'Kakap Merah',
        weight: 3.2,
        location: 'Kepulauan Seribu'
      }
    }
  ];

  const filteredAnglers = anglers.filter(angler => {
    const matchesSearch = angler.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         angler.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         angler.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = (() => {
      switch (selectedFilter) {
        case 'online': return angler.is_online;
        case 'premium': return angler.isPremium;
        case 'nearby': return angler.location?.includes('Jakarta'); // Mock nearby filter
        default: return true;
      }
    })();
    
    return matchesSearch && matchesFilter;
  });

  const formatLastSeen = (lastSeen?: string) => {
    if (!lastSeen) return 'Tidak diketahui';
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Baru saja';
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return `${diffDays} hari lalu`;
  };

  const handleViewProfile = (anglerId: string, isPrivate: boolean) => {
    if (isPrivate) {
      toast({
        title: "ℹ️ Profil Privat",
        description: "Profil ini bersifat privat. Follow untuk melihat konten.",
      });
    }
    navigate(`/user/${anglerId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
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
        <h2 className="text-2xl font-bold text-white mb-2">Jelajahi Angler</h2>
        <p className="text-white/70 text-sm">
          Temukan dan terhubung dengan {anglers.length} pemancing lainnya
        </p>
      </div>

      {/* Search & Filter */}
      <div className="space-y-4">
        {/* Search Bar */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          <input
            type="text"
            placeholder="Cari angler berdasarkan nama atau lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-white/40"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center"
          >
            <Filter className="w-4 h-4 text-white/70" />
          </motion.button>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'Semua', icon: Users },
            { id: 'online', label: 'Online', icon: Zap },
            { id: 'premium', label: 'Premium', icon: Crown },
            { id: 'nearby', label: 'Terdekat', icon: MapPin }
          ].map((filter) => {
            const IconComponent = filter.icon;
            const isActive = selectedFilter === filter.id;
            
            return (
              <motion.button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id as any)}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  isActive 
                    ? 'bg-white/20 backdrop-blur-xl border border-white/30 text-white' 
                    : 'bg-white/10 backdrop-blur-sm border border-white/10 text-white/70'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/60'}`} />
                {filter.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Angler List */}
      <div className="space-y-4">
        {filteredAnglers.map((angler, index) => (
          <motion.div
            key={angler.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group"
          >
            <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  angler.isPremium ? 'from-yellow-400 to-orange-500' : 'from-blue-400 to-cyan-500'
                }/30`} />
              </div>

              <div className="relative z-10 p-5">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    <motion.div
                      className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src={angler.avatar_url}
                        alt={angler.display_name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    
                    {/* Online Status */}
                    {angler.is_online && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white" />
                    )}
                    
                    {/* Level Badge */}
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {angler.level}
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white truncate">
                        {angler.display_name}
                      </h3>
                      {angler.isVerified && (
                        <Crown className="w-4 h-4 text-blue-400" />
                      )}
                      {angler.isPremium && (
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      )}
                      {angler.is_private && (
                        <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                          Private
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-white/70 mb-2">@{angler.username}</p>
                    
                    {angler.bio && (
                      <p className="text-sm text-white/80 mb-3 line-clamp-2">
                        {angler.bio}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-white/60 mb-3">
                      <div className="flex items-center gap-1">
                        <Fish className="w-3 h-3" />
                        <span>{angler.fish_caught} tangkapan</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{angler.followers_count} pengikut</span>
                      </div>
                      {angler.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{angler.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Recent Catch */}
                    {angler.recentCatch && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Trophy className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm font-semibold text-white">Tangkapan Terbaru</span>
                        </div>
                        <p className="text-xs text-white/80">
                          {angler.recentCatch.species} ({angler.recentCatch.weight}kg) - {angler.recentCatch.location}
                        </p>
                      </div>
                    )}

                    {/* Online Status */}
                    <div className="flex items-center gap-2 text-xs">
                      <div className={`w-2 h-2 rounded-full ${angler.is_online ? 'bg-green-400' : 'bg-gray-400'}`} />
                      <span className="text-white/60">
                        {angler.is_online ? 'Online sekarang' : `Terakhir online ${formatLastSeen(angler.last_seen_at)}`}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewProfile(angler.id, angler.is_private)}
                      className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg"
                      title="Lihat Profil"
                    >
                      <Eye className="w-5 h-5 text-white" />
                    </motion.button>
                    
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
                    >
                      <UserPlus className="w-5 h-5 text-white" />
                    </motion.button>
                    
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                    >
                      <MessageCircle className="w-5 h-5 text-white/70" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredAnglers.length === 0 && (
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
            <h3 className="text-xl font-bold text-white mb-2">
              {searchQuery ? 'Tidak Ditemukan' : 'Belum Ada Angler'}
            </h3>
            <p className="text-white/70 mb-6 max-w-sm mx-auto">
              {searchQuery 
                ? `Tidak ditemukan angler yang cocok dengan "${searchQuery}"`
                : 'Belum ada angler lain yang terdaftar di sistem'
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Ultra2025UserExplorer;
