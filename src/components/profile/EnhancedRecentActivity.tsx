
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Fish, 
  MessageSquare, 
  Heart, 
  Eye, 
  Clock,
  MapPin,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface EnhancedRecentActivityProps {
  searchQuery?: string;
  onItemCountChange?: (count: number) => void;
}

interface ActivityItem {
  id: string;
  activity_type: string;
  created_at: string;
  metadata: any;
  target_message_id?: string;
}

const EnhancedRecentActivity = ({ searchQuery = '', onItemCountChange }: EnhancedRecentActivityProps) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchActivities();
    }
  }, [user?.id]);

  const fetchActivities = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: activitiesError } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (activitiesError) throw activitiesError;

      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError('Gagal memuat aktivitas');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter activities based on search query
  const filteredActivities = activities.filter(activity => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      activity.activity_type.toLowerCase().includes(query) ||
      JSON.stringify(activity.metadata).toLowerCase().includes(query)
    );
  });

  // Update item count when filtered activities change
  useEffect(() => {
    if (onItemCountChange) {
      onItemCountChange(filteredActivities.length);
    }
  }, [filteredActivities.length, onItemCountChange]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'fish_catch': return Fish;
      case 'message_sent': return MessageSquare;
      case 'like_given': return Heart;
      case 'profile_view': return Eye;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'fish_catch': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'message_sent': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'like_given': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'profile_view': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getActivityDescription = (activity: ActivityItem) => {
    switch (activity.activity_type) {
      case 'fish_catch':
        return `Menangkap ${activity.metadata?.species_name || 'ikan'} di ${activity.metadata?.location || 'lokasi tidak diketahui'}`;
      case 'message_sent':
        return `Mengirim pesan di ${activity.metadata?.channel || 'chat'}`;
      case 'like_given':
        return `Menyukai ${activity.metadata?.target_type || 'konten'}`;
      case 'profile_view':
        return `Melihat profil ${activity.metadata?.target_user || 'pengguna'}`;
      default:
        return activity.activity_type.replace('_', ' ');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
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

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <Button onClick={fetchActivities} variant="outline" className="mt-2">
          Coba Lagi
        </Button>
      </div>
    );
  }

  if (filteredActivities.length === 0) {
    return (
      <div className="text-center py-8">
        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          {searchQuery ? 'Tidak ada aktivitas yang ditemukan' : 'Belum ada aktivitas'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredActivities.map((activity, index) => {
        const ActivityIcon = getActivityIcon(activity.activity_type);
        
        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.activity_type)}`}>
                    <ActivityIcon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {getActivityDescription(activity)}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>
                            {formatDistanceToNow(new Date(activity.created_at), {
                              addSuffix: true,
                              locale: idLocale
                            })}
                          </span>
                        </div>
                        
                        {activity.metadata?.location && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <MapPin className="w-3 h-3" />
                            <span>{activity.metadata.location}</span>
                          </div>
                        )}
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {activity.activity_type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default EnhancedRecentActivity;
