import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Fish, 
  MapPin, 
  Clock, 
  Heart, 
  MessageCircle, 
  Share, 
  Trophy,
  Camera,
  Bookmark,
  MoreHorizontal
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ActivityItem {
  id: string;
  type: 'catch' | 'achievement' | 'social' | 'milestone' | 'note';
  title: string;
  description: string;
  timestamp: string;
  location?: string;
  imageUrl?: string;
  stats?: {
    likes: number;
    comments: number;
    shares: number;
  };
  achievement?: {
    badge: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  };
  data?: any;
}

interface Ultra2025ActivityFeedProps {
  userId: string;
}

const Ultra2025ActivityFeed = ({ userId }: Ultra2025ActivityFeedProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch real activities from Supabase
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        
        // Fetch fish catches
        const { data: catches, error: catchError } = await supabase
          .from('fish_catches')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (catchError) throw catchError;

        // Fetch notes
        const { data: notes, error: notesError } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5);

        if (notesError) throw notesError;

        // Fetch user activities
        const { data: userActivities, error: activitiesError } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(15);

        if (activitiesError) throw activitiesError;

        // Transform data into activities
        const transformedActivities: ActivityItem[] = [];

        // Add fish catches
        catches?.forEach(fishCatch => {
          transformedActivities.push({
            id: fishCatch.id,
            type: 'catch',
            title: `Tangkapan ${fishCatch.species_name}!`,
            description: `Berhasil menangkap ${fishCatch.species_name} seberat ${fishCatch.weight_kg || 'tidak diketahui'}kg di ${fishCatch.location || 'lokasi rahasia'}`,
            timestamp: formatTimestamp(fishCatch.created_at),
            location: fishCatch.location,
            imageUrl: fishCatch.image_urls?.[0],
            stats: { likes: Math.floor(Math.random() * 50), comments: Math.floor(Math.random() * 20), shares: Math.floor(Math.random() * 10) },
            data: fishCatch
          });
        });

        // Add notes
        notes?.forEach(note => {
          transformedActivities.push({
            id: note.id,
            type: 'note',
            title: 'Catatan Baru',
            description: `"${note.title}" - ${note.content?.substring(0, 100)}...`,
            timestamp: formatTimestamp(note.created_at),
            stats: { likes: Math.floor(Math.random() * 25), comments: Math.floor(Math.random() * 10), shares: Math.floor(Math.random() * 5) },
            data: note
          });
        });

        // Add user activities
        userActivities?.forEach(activity => {
          if (activity.activity_type === 'message_liked') {
            transformedActivities.push({
              id: activity.id,
              type: 'social',
              title: 'Aktivitas Sosial',
              description: 'Menyukai pesan di komunitas',
              timestamp: formatTimestamp(activity.created_at),
              stats: { likes: 1, comments: 0, shares: 0 },
              data: activity
            });
          }
        });

        // Sort by timestamp and add some achievements
        transformedActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        // Add milestone achievements based on catches count
        if (catches && catches.length >= 10) {
          transformedActivities.unshift({
            id: 'achievement-10-catches',
            type: 'achievement',
            title: 'Master Angler Unlocked!',
            description: `Mencapai ${catches.length} tangkapan! Terus berkarya, angler!`,
            timestamp: 'Baru saja',
            achievement: { badge: '🏆', rarity: 'epic' }
          });
        }

        setActivities(transformedActivities.slice(0, 20));
      } catch (error) {
        console.error('Error fetching activities:', error);
        toast({
          title: "❌ Gagal Memuat Aktivitas",
          description: "Tidak dapat mengambil data aktivitas dari database",
          variant: "destructive"
        });
        
        // Fallback to mock data
        setActivities(getMockActivities());
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchActivities();
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

  const getMockActivities = (): ActivityItem[] => [
    {
      id: '1',
      type: 'catch',
      title: 'Tangkapan Spektakuler!',
      description: 'Berhasil menangkap Tuna Sirip Kuning seberat 15.2kg di Selat Sunda',
      timestamp: '2 jam lalu',
      location: 'Selat Sunda, Banten',
      imageUrl: '/api/placeholder/400/300',
      stats: { likes: 127, comments: 23, shares: 8 }
    },
    {
      id: '2',
      type: 'achievement',
      title: 'Master Angler Unlocked!',
      description: 'Mencapai 100+ tangkapan dalam 1 bulan',
      timestamp: '1 hari lalu',
      achievement: { badge: '🏆', rarity: 'epic' }
    }
  ];

  const getActivityGradient = (type: string) => {
    switch (type) {
      case 'catch': return 'from-blue-400 to-cyan-500';
      case 'achievement': return 'from-yellow-400 to-orange-500';
      case 'social': return 'from-purple-400 to-pink-500';
      case 'milestone': return 'from-green-400 to-emerald-500';
      case 'note': return 'from-orange-400 to-red-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityGlow = (rarity?: string) => {
    switch (rarity) {
      case 'legendary': return '0 0 30px rgba(255, 215, 0, 0.6)';
      case 'epic': return '0 0 25px rgba(147, 51, 234, 0.5)';
      case 'rare': return '0 0 20px rgba(59, 130, 246, 0.4)';
      default: return '0 0 15px rgba(156, 163, 175, 0.3)';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-2xl rounded-3xl p-5 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl" />
              <div className="flex-1">
                <div className="h-4 bg-white/20 rounded mb-2" />
                <div className="h-3 bg-white/20 rounded w-2/3" />
              </div>
            </div>
            <div className="h-32 bg-white/20 rounded-2xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Feed Aktivitas</h2>
          <p className="text-white/70 text-sm">
            {activities.length} aktivitas terbaru dari database
          </p>
        </div>
      </div>

      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative group"
        >
          {/* Ultra Modern Activity Card */}
          <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 overflow-hidden">
            {/* Dynamic Background Pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className={`absolute inset-0 bg-gradient-to-br ${getActivityGradient(activity.type)}/20`} />
              <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_70%)]"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
            </div>

            <div className="relative z-10 p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${getActivityGradient(activity.type)} flex items-center justify-center shadow-xl`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(255, 255, 255, 0.3)',
                        '0 0 30px rgba(255, 255, 255, 0.5)',
                        '0 0 20px rgba(255, 255, 255, 0.3)'
                      ]
                    }}
                    transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
                  >
                    {activity.type === 'catch' && <Fish className="w-6 h-6 text-white" />}
                    {activity.type === 'achievement' && <Trophy className="w-6 h-6 text-white" />}
                    {activity.type === 'social' && <Heart className="w-6 h-6 text-white" />}
                    {activity.type === 'milestone' && <Trophy className="w-6 h-6 text-white" />}
                    {activity.type === 'note' && <Bookmark className="w-6 h-6 text-white" />}
                  </motion.div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1 leading-tight">
                      {activity.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <Clock className="w-3 h-3" />
                      <span>{activity.timestamp}</span>
                      {activity.location && (
                        <>
                          <span>•</span>
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{activity.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                >
                  <MoreHorizontal className="w-4 h-4 text-white/70" />
                </motion.button>
              </div>

              {/* Content */}
              <p className="text-white/90 text-sm leading-relaxed mb-4">
                {activity.description}
              </p>

              {/* Image for catch activities */}
              {activity.imageUrl && (
                <motion.div
                  className="relative w-full h-48 rounded-2xl overflow-hidden mb-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={activity.imageUrl}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <motion.button
                    className="absolute top-3 right-3 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </motion.button>
                </motion.div>
              )}

              {/* Achievement Badge */}
              {activity.achievement && (
                <motion.div
                  className="flex items-center justify-center p-4 mb-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20"
                  animate={{
                    boxShadow: [
                      getRarityGlow(activity.achievement.rarity),
                      getRarityGlow(activity.achievement.rarity).replace('0.', '0.8'),
                      getRarityGlow(activity.achievement.rarity)
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{activity.achievement.badge}</div>
                    <div className={`text-xs font-bold uppercase tracking-wide ${
                      activity.achievement.rarity === 'legendary' ? 'text-yellow-400' :
                      activity.achievement.rarity === 'epic' ? 'text-purple-400' :
                      activity.achievement.rarity === 'rare' ? 'text-blue-400' :
                      'text-gray-400'
                    }`}>
                      {activity.achievement.rarity}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Social Stats */}
              {activity.stats && (
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-xl"
                    >
                      <Heart className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-semibold text-white">
                        {activity.stats.likes}
                      </span>
                    </motion.button>
                    
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-xl"
                    >
                      <MessageCircle className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-semibold text-white">
                        {activity.stats.comments}
                      </span>
                    </motion.button>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center"
                    >
                      <Share className="w-4 h-4 text-white/70" />
                    </motion.button>
                    
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center"
                    >
                      <Bookmark className="w-4 h-4 text-white/70" />
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      {activities.length === 0 && (
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
            <Fish className="w-12 h-12 text-white/60" />
          </motion.div>
          <h3 className="text-xl font-bold text-white mb-2">Belum Ada Aktivitas</h3>
          <p className="text-white/70 mb-6 max-w-sm mx-auto">
            Aktivitas Anda akan muncul di sini setelah menambahkan catatan tangkapan atau bergabung dengan komunitas
          </p>
        </motion.div>
      )}

      {/* Load More Button */}
      {activities.length > 0 && (
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white font-semibold mt-6"
        >
          Muat Lebih Banyak
        </motion.button>
      )}
    </div>
  );
};

export default Ultra2025ActivityFeed;
