
import { motion } from 'framer-motion';
import { UserProfile, ProfileStats } from '@/types/profile';
import { 
  Activity, 
  BookOpen, 
  Users, 
  Star, 
  User,
  Fish,
  MessageCircle,
  Heart,
  Share,
  Bookmark,
  Clock,
  MapPin
} from 'lucide-react';

interface DynamicContentCardsProps {
  activeTab: string;
  user: UserProfile;
  stats: ProfileStats;
}

const DynamicContentCards = ({
  activeTab,
  user,
  stats
}: DynamicContentCardsProps) => {
  
  const getTabContent = () => {
    switch (activeTab) {
      case 'activity':
        return <ActivityCards stats={stats} />;
      case 'notes':
        return <NotesCards user={user} />;
      case 'community':
        return <CommunityCards stats={stats} />;
      case 'history':
        return <HistoryCards stats={stats} />;
      case 'profile':
        return <ProfileCards user={user} />;
      default:
        return <ActivityCards stats={stats} />;
    }
  };

  return (
    <div className="space-y-4">
      {getTabContent()}
    </div>
  );
};

const ActivityCards = ({ stats }: { stats: ProfileStats }) => {
  const activities = [
    {
      id: 1,
      type: 'catch',
      title: 'Tangkapan Terbaru',
      description: 'Berhasil menangkap ikan lele seberat 2.5kg',
      time: '2 jam yang lalu',
      location: 'Sungai Ciliwung',
      likes: 24,
      comments: 8,
      icon: Fish,
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Pencapaian Baru',
      description: 'Mendapat badge "Master Angler"',
      time: '1 hari yang lalu',
      likes: 45,
      comments: 12,
      icon: Star,
      gradient: 'from-yellow-500 to-amber-500'
    },
    {
      id: 3,
      type: 'social',
      title: 'Aktivitas Sosial',
      description: 'Mengikuti 3 angler baru',
      time: '2 hari yang lalu',
      likes: 12,
      comments: 3,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500'
    }
  ];

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative overflow-hidden rounded-2xl"
        >
          {/* Glassmorphism Background */}
          <div className="absolute inset-0 bg-white/20 dark:bg-gray-900/30 backdrop-blur-xl border border-white/30 dark:border-gray-700/40" />
          
          <div className="relative z-10 p-4">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${activity.gradient} flex items-center justify-center shadow-lg`}>
                <activity.icon className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                  {activity.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs mb-2 leading-relaxed">
                  {activity.description}
                </p>
                
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{activity.time}</span>
                  </div>
                  {activity.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{activity.location}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{activity.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{activity.comments}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full bg-white/20 dark:bg-gray-800/30"
                    >
                      <Bookmark className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full bg-white/20 dark:bg-gray-800/30"
                    >
                      <Share className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const NotesCards = ({ user }: { user: UserProfile }) => (
  <div className="text-center py-12">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/20 dark:bg-gray-900/30 backdrop-blur-xl rounded-2xl p-8 border border-white/30 dark:border-gray-700/40"
    >
      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Catatan Kosong</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Mulai tulis catatan pancing pertama Anda
      </p>
    </motion.div>
  </div>
);

const CommunityCards = ({ stats }: { stats: ProfileStats }) => (
  <div className="text-center py-12">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/20 dark:bg-gray-900/30 backdrop-blur-xl rounded-2xl p-8 border border-white/30 dark:border-gray-700/40"
    >
      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Komunitas</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        Terhubung dengan {stats.followers_count} pengikut
      </p>
      <div className="flex justify-center gap-4">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.followers_count}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Pengikut</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.following_count}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Mengikuti</div>
        </div>
      </div>
    </motion.div>
  </div>
);

const HistoryCards = ({ stats }: { stats: ProfileStats }) => (
  <div className="text-center py-12">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/20 dark:bg-gray-900/30 backdrop-blur-xl rounded-2xl p-8 border border-white/30 dark:border-gray-700/40"
    >
      <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Riwayat Tangkapan</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        Total {stats.total_catches} tangkapan berhasil
      </p>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total_catches}</div>
        <div className="text-xs text-gray-600 dark:text-gray-400">Ikan Tertangkap</div>
      </div>
    </motion.div>
  </div>
);

const ProfileCards = ({ user }: { user: UserProfile }) => (
  <div className="text-center py-12">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/20 dark:bg-gray-900/30 backdrop-blur-xl rounded-2xl p-8 border border-white/30 dark:border-gray-700/40"
    >
      <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Profil {user.display_name}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Bergabung sejak {new Date(user.created_at).toLocaleDateString('id-ID')}
      </p>
    </motion.div>
  </div>
);

export default DynamicContentCards;
