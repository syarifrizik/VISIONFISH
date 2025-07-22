
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Fish, Users, Heart, MessageSquare, Edit3, Award } from 'lucide-react';
import { ProfileStats as ProfileStatsType } from '@/types/profile';

interface ProfileStatsProps {
  stats: ProfileStatsType;
  layout?: 'mobile' | 'desktop';
  isOwnProfile?: boolean;
  onEditFishCount?: () => void;
  isLoading?: boolean;
}

const ProfileStats = ({ 
  stats, 
  layout = 'mobile', 
  isOwnProfile = false,
  onEditFishCount,
  isLoading = false
}: ProfileStatsProps) => {
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  const statItems = [
    {
      key: 'total_catches',
      label: 'Ikan Ditangkap',
      value: stats?.total_catches || 0,
      icon: Fish,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50/80 to-cyan-50/60 dark:from-blue-900/20 dark:to-cyan-900/10',
      description: 'Total ikan yang berhasil ditangkap',
      editable: isOwnProfile,
      ariaLabel: `${stats?.total_catches || 0} ikan ditangkap`
    },
    {
      key: 'total_posts',
      label: 'Konten',
      value: stats?.total_posts || 0,
      icon: MessageSquare,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50/80 to-pink-50/60 dark:from-purple-900/20 dark:to-pink-900/10',
      description: 'Total konten yang dibagikan',
      ariaLabel: `${stats?.total_posts || 0} konten dibagikan`
    },
    {
      key: 'followers_count',
      label: 'Pengikut',
      value: stats?.followers_count || 0,
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50/80 to-emerald-50/60 dark:from-green-900/20 dark:to-emerald-900/10',
      description: 'Jumlah pengikut',
      ariaLabel: `${stats?.followers_count || 0} pengikut`
    },
    {
      key: 'following_count',
      label: 'Mengikuti',
      value: stats?.following_count || 0,
      icon: Heart,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50/80 to-red-50/60 dark:from-orange-900/20 dark:to-red-900/10',
      description: 'Jumlah yang diikuti',
      ariaLabel: `${stats?.following_count || 0} diikuti`
    }
  ];

  // Loading skeleton untuk stats
  const StatSkeleton = () => (
    <div className={`grid ${layout === 'desktop' ? 'grid-cols-4' : 'grid-cols-2'} gap-3 md:gap-6`}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 animate-pulse">
          <Skeleton className="h-10 w-10 rounded-lg mb-3" />
          <Skeleton className="h-6 w-16 mb-2" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return <StatSkeleton />;
  }

  return (
    <div className={`grid ${layout === 'desktop' ? 'grid-cols-4' : 'grid-cols-2'} gap-3 md:gap-6`}>
      {statItems.map((item, index) => (
        <div
          key={item.key}
          className="relative group"
          onMouseEnter={() => setHoveredStat(item.key)}
          onMouseLeave={() => setHoveredStat(null)}
        >
          <Card className={`relative overflow-hidden border-0 bg-gradient-to-br ${item.bgColor} backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${layout === 'desktop' ? 'p-6' : 'p-4'}`}>
            <div className="relative z-10">
              {/* Icon dengan edit button */}
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-lg mb-4 relative`}>
                <item.icon className={`${layout === 'desktop' ? 'w-6 h-6' : 'w-5 h-5'} text-white`} />
                {item.editable && onEditFishCount && item.key === 'total_catches' && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditFishCount();
                    }}
                    aria-label="Edit jumlah ikan"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit3 className="w-3 h-3 text-white" />
                  </motion.button>
                )}
              </div>

              {/* Value */}
              <div className={`${layout === 'desktop' ? 'text-3xl' : 'text-2xl'} font-bold text-gray-900 dark:text-white mb-2 relative`}>
                {item.value.toLocaleString('id-ID')}
                
                {/* Achievement indicator untuk high values */}
                {item.value > 0 && item.key === 'total_catches' && (
                  <div className="absolute -top-2 -right-6">
                    <Award className="w-4 h-4 text-amber-500" />
                  </div>
                )}
              </div>

              {/* Label */}
              <p className={`${layout === 'desktop' ? 'text-base' : 'text-sm'} font-medium text-gray-600 dark:text-gray-400`}>
                {item.label}
              </p>

              {/* Hover description tooltip */}
              <AnimatePresence>
                {hoveredStat === item.key && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white text-xs rounded-b-lg"
                  >
                    {item.description}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;
