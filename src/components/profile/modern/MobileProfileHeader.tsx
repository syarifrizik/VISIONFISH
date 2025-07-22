
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProfileStats, UserProfile } from '@/types/profile';
import { 
  Settings, 
  Crown, 
  MapPin, 
  Calendar,
  Edit3,
  Verified,
  Plus,
  Camera,
  Share,
  MoreHorizontal
} from 'lucide-react';

interface MobileProfileHeaderProps {
  user: UserProfile;
  stats: ProfileStats;
  isOwnProfile?: boolean;
  isPremium?: boolean;
  onStatsUpdate?: (newStats: ProfileStats) => void;
}

const MobileProfileHeader = ({
  user,
  stats,
  isOwnProfile = true,
  isPremium = false,
  onStatsUpdate
}: MobileProfileHeaderProps) => {
  const [isOnline] = useState(true);
  const [showActions, setShowActions] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden"
    >
      {/* Enhanced 2025+ Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/15 via-purple-600/10 to-pink-600/15 rounded-3xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/75 to-white/60 dark:from-gray-900/90 dark:via-gray-900/75 dark:to-gray-900/60 backdrop-blur-2xl rounded-3xl" />
      
      {/* Subtle Floating Elements (Static) */}
      <div className="absolute top-4 right-8 w-2 h-2 bg-gradient-to-r from-cyan-400/40 to-blue-400/20 rounded-full" />
      <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-gradient-to-r from-purple-400/40 to-pink-400/20 rounded-full" />
      
      {/* Enhanced Border */}
      <div className="absolute inset-0 rounded-3xl border border-gradient-to-r from-white/30 via-gray-200/20 to-white/30 dark:from-gray-700/30 dark:via-gray-600/20 dark:to-gray-700/30" />

      <div className="relative z-10 p-6">
        {/* Header Actions */}
        {isOwnProfile && (
          <motion.div
            variants={itemVariants}
            className="absolute top-4 right-4 flex gap-2"
          >
            <Button
              size="sm"
              variant="ghost"
              className="bg-white/30 dark:bg-gray-800/30 border-white/40 dark:border-gray-700/40 hover:bg-white/40 dark:hover:bg-gray-700/40 backdrop-blur-lg rounded-xl h-9 w-9 p-0"
              onClick={() => setShowActions(!showActions)}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
            
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: 8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 8 }}
                  className="flex gap-1.5"
                >
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-white/30 dark:bg-gray-800/30 border-white/40 dark:border-gray-700/40 hover:bg-white/40 dark:hover:bg-gray-700/40 backdrop-blur-lg rounded-xl h-9 w-9 p-0"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="bg-white/30 dark:bg-gray-800/30 border-white/40 dark:border-gray-700/40 hover:bg-white/40 dark:hover:bg-gray-700/40 backdrop-blur-lg rounded-xl h-9 w-9 p-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-4">
          {/* Enhanced Avatar */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {/* Premium Gradient Ring */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-70 blur-sm" />
              
              <Avatar className="w-24 h-24 ring-4 ring-white/60 dark:ring-gray-800/60 shadow-2xl relative z-10">
                <AvatarImage src={user.avatar_url || '/placeholder.svg'} alt={user.display_name} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xl font-bold">
                  {user.display_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              {/* Enhanced Online Status */}
              <motion.div
                className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white dark:border-gray-900 rounded-full shadow-lg"
                animate={{ 
                  boxShadow: isOnline ? [
                    '0 0 0 0 rgba(34, 197, 94, 0.4)', 
                    '0 0 0 8px rgba(34, 197, 94, 0)', 
                    '0 0 0 0 rgba(34, 197, 94, 0)'
                  ] : undefined
                }}
                transition={{ duration: 1.5, repeat: isOnline ? Infinity : 0 }}
              />
              
              {/* Premium Crown */}
              {isPremium && (
                <motion.div className="absolute -top-1 -right-1">
                  <Crown className="w-6 h-6 text-yellow-500 drop-shadow-lg" fill="currentColor" />
                </motion.div>
              )}

              {/* Camera Button */}
              {isOwnProfile && (
                <motion.button
                  className="absolute bottom-1 left-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Camera className="w-3 h-3 text-white" />
                </motion.button>
              )}
            </motion.div>
          </motion.div>

          {/* Profile Info */}
          <motion.div
            variants={itemVariants}
            className="text-center space-y-2"
          >
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                {user.display_name || user.username}
              </h1>
              {isPremium && (
                <Verified className="w-5 h-5 text-blue-500" fill="currentColor" />
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              @{user.username}
            </p>
          </motion.div>

          {/* Bio */}
          {user.bio && (
            <motion.div
              variants={itemVariants}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-white/40 dark:border-gray-700/40 max-w-xs"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-center">
                {user.bio}
              </p>
            </motion.div>
          )}

          {/* Location and Join Date */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center space-y-1 text-xs text-gray-600 dark:text-gray-400"
          >
            {user.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{user.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Bergabung {new Date(user.created_at).toLocaleDateString('id-ID', { 
                year: 'numeric', 
                month: 'long' 
              })}</span>
            </div>
          </motion.div>

          {/* Premium Badge */}
          {isPremium && (
            <motion.div variants={itemVariants}>
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        {isOwnProfile && (
          <motion.div
            variants={itemVariants}
            className="flex justify-center gap-3 mt-6"
          >
            <motion.button
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
            </motion.button>
            <motion.button
              className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MobileProfileHeader;
