
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Fish, 
  MessageSquare, 
  Heart, 
  Trophy, 
  UserPlus,
  BookOpen,
  MapPin,
  Camera,
  Star,
  Target,
  Zap,
  Award,
  TrendingUp,
  FileText,
  Users,
  Crown,
  Clock,
  Eye,
  ThumbsUp
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface ActivityItem {
  id: string;
  activity_type: string;
  metadata: Record<string, any>;
  created_at: string;
  user_id: string;
  target_user?: {
    display_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

interface ActivityConfig {
  icon: any;
  color: string;
  bgColor: string;
  getDescription: (metadata: any, targetUser?: any, activityType?: string) => string;
  category: 'fishing' | 'social' | 'achievement' | 'learning' | 'system';
}

const ACTIVITY_CONFIGS: Record<string, ActivityConfig> = {
  // Fishing Activities
  fish_catch_added: {
    icon: Fish,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    category: 'fishing',
    getDescription: (metadata) => 
      `Menangkap ${metadata?.species_name || 'ikan'} seberat ${metadata?.weight || 'N/A'}kg di ${metadata?.location || 'lokasi tidak diketahui'}`
  },
  fishing_trip_completed: {
    icon: Target,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    category: 'fishing',
    getDescription: (metadata) => 
      `Menyelesaikan trip memancing di ${metadata?.location || 'lokasi'} dengan ${metadata?.total_catch || 0} tangkapan`
  },
  species_identified: {
    icon: Eye,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    category: 'fishing',
    getDescription: (metadata) => 
      `Mengidentifikasi spesies ${metadata?.species_name || 'ikan'} menggunakan AI`
  },

  // Social Activities
  message_sent: {
    icon: MessageSquare,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
    category: 'social',
    getDescription: (metadata) => {
      const messageType = metadata?.message_type || 'general';
      const preview = metadata?.content_preview ? 
        `"${metadata.content_preview.substring(0, 50)}${metadata.content_preview.length > 50 ? '...' : ''}"` : 
        'mengirim pesan';
      return `Mengirim pesan ${messageType}: ${preview}`;
    }
  },
  post_created: {
    icon: Camera,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100 dark:bg-pink-900/20',
    category: 'social',
    getDescription: (metadata) => 
      `Membuat postingan komunitas${metadata?.title ? `: "${metadata.title}"` : ''}`
  },
  user_followed: {
    icon: UserPlus,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
    category: 'social',
    getDescription: (metadata, targetUser) => 
      `Mengikuti ${targetUser?.display_name || metadata?.target_username || 'pengguna'}`
  },
  like_given: {
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    category: 'social',
    getDescription: (metadata) => 
      `Menyukai ${metadata?.target_type || 'konten'} dari ${metadata?.target_user || 'pengguna'}`
  },

  // Achievement Activities
  achievement_unlocked: {
    icon: Trophy,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    category: 'achievement',
    getDescription: (metadata) => 
      `Membuka pencapaian "${metadata?.achievement_name || 'Achievement Baru'}"`
  },
  level_up: {
    icon: TrendingUp,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    category: 'achievement',
    getDescription: (metadata) => 
      `Naik ke level ${metadata?.new_level || 'baru'}! 🎉`
  },
  premium_activated: {
    icon: Crown,
    color: 'text-violet-600',
    bgColor: 'bg-violet-100 dark:bg-violet-900/20',
    category: 'achievement',
    getDescription: (metadata) => 
      `Mengaktifkan VisionFish Premium hingga ${metadata?.expires_at ? new Date(metadata.expires_at).toLocaleDateString('id-ID') : 'waktu tidak terbatas'}`
  },

  // Learning Activities
  note_created: {
    icon: FileText,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100 dark:bg-teal-900/20',
    category: 'learning',
    getDescription: (metadata) => 
      `Membuat catatan "${metadata?.title || 'Catatan Baru'}"`
  },
  analysis_completed: {
    icon: BookOpen,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/20',
    category: 'learning',
    getDescription: (metadata) => 
      `Menyelesaikan analisis ${metadata?.analysis_type || 'data'}`
  },

  // Default fallback
  default: {
    icon: Zap,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100 dark:bg-gray-900/20',
    category: 'system',
    getDescription: (metadata, targetUser, activityType) => 
      `Melakukan aktivitas ${activityType?.replace('_', ' ') || 'tidak diketahui'}`
  }
};

const ImprovedActivityFeed = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'fishing' | 'social' | 'achievement' | 'learning'>('all');

  useEffect(() => {
    if (user?.id) {
      loadActivities();
    }
  }, [user?.id]);

  const loadActivities = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Load activities with enhanced metadata
      const { data: activitiesData, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;

      // Transform activities dengan data yang lebih kaya
      const enhancedActivities: ActivityItem[] = (activitiesData || []).map(activity => {
        // Safely parse metadata
        let parsedMetadata: Record<string, any> = {};
        try {
          if (activity.metadata && typeof activity.metadata === 'object') {
            parsedMetadata = activity.metadata as Record<string, any>;
          } else if (typeof activity.metadata === 'string') {
            parsedMetadata = JSON.parse(activity.metadata);
          }
        } catch (e) {
          console.warn('Failed to parse metadata:', activity.metadata);
          parsedMetadata = {};
        }

        return {
          id: activity.id,
          activity_type: activity.activity_type,
          metadata: {
            ...parsedMetadata,
            // Enhance metadata based on activity type
            ...(activity.activity_type === 'message_sent' && {
              content_preview: parsedMetadata?.content_preview || 'Mengirim pesan di chat',
              message_type: parsedMetadata?.message_type || 'general'
            }),
            ...(activity.activity_type === 'fish_catch_added' && {
              species_name: parsedMetadata?.species_name || 'Ikan',
              weight: parsedMetadata?.weight || '0',
              location: parsedMetadata?.location || 'Lokasi tidak diketahui'
            })
          },
          created_at: activity.created_at,
          user_id: activity.user_id
        };
      });

      setActivities(enhancedActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    const config = ACTIVITY_CONFIGS[activity.activity_type] || ACTIVITY_CONFIGS.default;
    return config.category === filter;
  });

  const categoryStats = {
    all: activities.length,
    fishing: activities.filter(a => (ACTIVITY_CONFIGS[a.activity_type] || ACTIVITY_CONFIGS.default).category === 'fishing').length,
    social: activities.filter(a => (ACTIVITY_CONFIGS[a.activity_type] || ACTIVITY_CONFIGS.default).category === 'social').length,
    achievement: activities.filter(a => (ACTIVITY_CONFIGS[a.activity_type] || ACTIVITY_CONFIGS.default).category === 'achievement').length,
    learning: activities.filter(a => (ACTIVITY_CONFIGS[a.activity_type] || ACTIVITY_CONFIGS.default).category === 'learning').length,
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
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

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(categoryStats).map(([category, count]) => (
          <Button
            key={category}
            variant={filter === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(category as any)}
            className="text-xs"
          >
            {category === 'all' ? 'Semua' : 
             category === 'fishing' ? 'Memancing' :
             category === 'social' ? 'Sosial' :
             category === 'achievement' ? 'Pencapaian' : 'Pembelajaran'}
            <Badge variant="secondary" className="ml-2 text-xs">
              {count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Activities List */}
      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {filter === 'all' ? 'Belum Ada Aktivitas' : `Belum Ada Aktivitas ${filter}`}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {filter === 'all' 
                  ? 'Mulai beraktivitas untuk melihat riwayat di sini'
                  : `Belum ada aktivitas dalam kategori ${filter}`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence>
            {filteredActivities.map((activity, index) => {
              const config = ACTIVITY_CONFIGS[activity.activity_type] || ACTIVITY_CONFIGS.default;
              const IconComponent = config.icon;
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Activity Icon */}
                        <div className={`p-2.5 rounded-full ${config.bgColor} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          <IconComponent className={`w-5 h-5 ${config.color}`} />
                        </div>
                        
                        {/* Activity Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">
                              {config.getDescription(activity.metadata, activity.target_user, activity.activity_type)}
                            </p>
                            
                            {/* Category Badge */}
                            <Badge 
                              variant="outline" 
                              className={`text-xs ml-2 flex-shrink-0 ${config.color} border-current`}
                            >
                              {config.category === 'fishing' ? '🎣' :
                               config.category === 'social' ? '👥' :
                               config.category === 'achievement' ? '🏆' :
                               config.category === 'learning' ? '📚' : '⚡'}
                            </Badge>
                          </div>
                          
                          {/* Metadata Display */}
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>
                                {formatDistanceToNow(new Date(activity.created_at), {
                                  addSuffix: true,
                                  locale: idLocale
                                })}
                              </span>
                            </div>
                            
                            {activity.metadata?.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate max-w-24">
                                  {activity.metadata.location}
                                </span>
                              </div>
                            )}
                            
                            {(activity.metadata?.weight || activity.metadata?.species_name) && (
                              <div className="flex items-center gap-1">
                                <Fish className="w-3 h-3" />
                                <span>
                                  {activity.metadata.species_name} 
                                  {activity.metadata.weight && ` (${activity.metadata.weight}kg)`}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Load More Button */}
      {filteredActivities.length > 0 && filteredActivities.length >= 30 && (
        <div className="text-center pt-4">
          <Button variant="outline" onClick={loadActivities}>
            Muat Lebih Banyak
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImprovedActivityFeed;
