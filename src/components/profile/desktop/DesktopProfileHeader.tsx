
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserProfile, ProfileStats } from '@/types/profile';
import { 
  Crown, 
  MapPin, 
  Calendar,
  Edit3,
  Settings,
  Users,
  Heart,
  Star,
  Activity,
  TrendingUp
} from 'lucide-react';

interface DesktopProfileHeaderProps {
  user: UserProfile;
  stats: ProfileStats;
  isPremium?: boolean;
  onStatsUpdate?: (stats: ProfileStats) => void;
}

const DesktopProfileHeader = ({
  user,
  stats,
  isPremium = false,
  onStatsUpdate
}: DesktopProfileHeaderProps) => {
  const quickStats = [
    { icon: Users, value: stats.followers_count, label: 'Followers', color: 'from-blue-500 to-cyan-500' },
    { icon: Heart, value: stats.following_count, label: 'Following', color: 'from-pink-500 to-rose-500' },
    { icon: Star, value: stats.total_catches, label: 'Catches', color: 'from-yellow-500 to-orange-500' },
    { icon: Activity, value: stats.total_posts, label: 'Posts', color: 'from-green-500 to-emerald-500' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative"
    >
      {/* Asymmetric background with glassmorphism */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/10" />
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 rounded-[2rem]" />

      <div className="relative z-10 p-8">
        {/* Header actions */}
        <div className="absolute top-6 right-6 flex gap-3">
          <Button
            variant="outline"
            size="icon"
            className="bg-white/10 border-white/20 hover:bg-white/20 backdrop-blur-sm text-white"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-white/10 border-white/20 hover:bg-white/20 backdrop-blur-sm text-white"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>

        {/* Asymmetric layout */}
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left side - Profile info (7 columns) */}
          <div className="col-span-7 space-y-6">
            <div className="flex items-start space-x-6">
              {/* Enhanced avatar */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Avatar className="w-28 h-28 ring-4 ring-white/20 shadow-2xl">
                  <AvatarImage src={user.avatar_url || '/placeholder.svg'} alt={user.display_name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl font-bold">
                    {user.display_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                {/* Online status */}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-lg" />
                
                {/* Premium crown */}
                {isPremium && (
                  <motion.div
                    className="absolute -top-3 -right-3"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Crown className="w-10 h-10 text-yellow-400 drop-shadow-lg" fill="currentColor" />
                  </motion.div>
                )}
              </motion.div>

              {/* Profile details */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {user.display_name || user.username}
                  </h1>
                  <p className="text-xl text-gray-300 font-medium">@{user.username}</p>
                </div>

                {user.bio && (
                  <p className="text-gray-300 leading-relaxed text-lg max-w-lg">
                    {user.bio}
                  </p>
                )}

                <div className="flex items-center gap-6 text-gray-400">
                  {user.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>Joined {new Date(user.created_at).toLocaleDateString('id-ID', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}</span>
                  </div>
                </div>

                {isPremium && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                    <Crown className="w-4 h-4 mr-2" />
                    Premium Member
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Stats grid (5 columns) */}
          <div className="col-span-5">
            <div className="grid grid-cols-2 gap-4">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {stat.value?.toLocaleString() || 0}
                      </p>
                      <p className="text-sm text-gray-400 font-medium">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trend indicator */}
            <motion.div
              className="mt-4 flex items-center justify-center gap-2 text-green-400"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Profile trending up 12%</span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DesktopProfileHeader;
