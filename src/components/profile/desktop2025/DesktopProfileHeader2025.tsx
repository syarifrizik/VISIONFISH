
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ProfileHeaderProps } from '@/types/profile';
import { 
  Settings, 
  Share2, 
  MoreHorizontal, 
  MapPin, 
  Calendar,
  Shield,
  Crown,
  Sparkles,
  Zap,
  Star
} from 'lucide-react';

const DesktopProfileHeader2025 = ({
  user,
  stats,
  isOwnProfile = true,
  isPremium = false,
  onStatsUpdate
}: ProfileHeaderProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const avatarUrl = user.avatar_url || '/api/placeholder/200/200';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative"
    >
      {/* Enhanced Desktop Profile Card */}
      <div className="relative overflow-hidden rounded-3xl">
        {/* Multi-layer background with glassmorphism */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-pink-500/10" />
        <div className="absolute inset-0 rounded-3xl border border-white/30" />
        
        {/* Enhanced glow effects */}
        <motion.div
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/20 to-purple-400/20 opacity-0 blur-xl"
          animate={{
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="relative z-10 p-8">
          <div className="flex items-start gap-8">
            {/* Enhanced 3D Avatar Section */}
            <motion.div
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {/* Avatar glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-400 p-1"
                animate={{
                  rotate: [0, 360],
                  scale: isHovered ? [1, 1.1, 1] : [1, 1.05, 1]
                }}
                transition={{
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <div className="w-32 h-32 rounded-full bg-slate-900 flex items-center justify-center">
                  <img
                    src={avatarUrl}
                    alt={user.display_name}
                    className="w-28 h-28 rounded-full object-cover border-2 border-white/20"
                  />
                </div>
              </motion.div>

              {/* Status indicators */}
              <motion.div
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-3 border-white/30 flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(34, 197, 94, 0.4)',
                    '0 0 0 8px rgba(34, 197, 94, 0)',
                    '0 0 0 0 rgba(34, 197, 94, 0)'
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Zap className="w-4 h-4 text-white" />
              </motion.div>

              {/* Premium badge */}
              {isPremium && (
                <motion.div
                  className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-3 border-white/30 flex items-center justify-center"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <Crown className="w-4 h-4 text-white" />
                </motion.div>
              )}

              {/* Floating particles around avatar */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full"
                  style={{
                    top: `${20 + i * 15}%`,
                    left: `${-10 + i * 20}%`
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 0.8, 0],
                    y: [0, -20, 0],
                    x: [0, Math.sin(i) * 10, 0]
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>

            {/* Enhanced Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <motion.h1
                    className="text-3xl font-bold text-white mb-2 flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {user.display_name || user.username}
                    {isPremium && (
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                      </motion.div>
                    )}
                  </motion.h1>
                  
                  <motion.p
                    className="text-lg text-white/80 mb-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    @{user.username}
                  </motion.p>

                  {user.location && (
                    <motion.div
                      className="flex items-center gap-2 text-white/70 mb-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{user.location}</span>
                    </motion.div>
                  )}

                  {user.bio && (
                    <motion.p
                      className="text-white/80 leading-relaxed max-w-2xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      {user.bio}
                    </motion.p>
                  )}
                </div>

                {/* Enhanced Action Buttons */}
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {isOwnProfile ? (
                    <>
                      <motion.button
                        className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Settings className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Share2 className="w-5 h-5" />
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl text-white font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all duration-300"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Follow
                      </motion.button>
                      <motion.button
                        className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </motion.button>
                    </>
                  )}
                </motion.div>
              </div>

              {/* Enhanced Stats Row for Desktop */}
              <motion.div
                className="grid grid-cols-4 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {[
                  { label: 'Tangkapan', value: stats.total_catches, icon: '🎣', color: 'from-amber-400 to-orange-500' },
                  { label: 'Postingan', value: stats.total_posts, icon: '📝', color: 'from-emerald-400 to-teal-500' },
                  { label: 'Pengikut', value: stats.followers_count, icon: '👥', color: 'from-blue-400 to-purple-500' },
                  { label: 'Mengikuti', value: stats.following_count, icon: '❤️', color: 'from-pink-400 to-rose-500' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                      {stat.value?.toLocaleString() || 0}
                    </div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DesktopProfileHeader2025;
