
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap } from 'lucide-react';

interface EnhancedProfileAvatarProps {
  avatarUrl?: string;
  displayName?: string;
  username?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isPremium?: boolean;
  isOnline?: boolean;
  showBadges?: boolean;
}

const EnhancedProfileAvatar = ({ 
  avatarUrl, 
  displayName, 
  username, 
  size = 'md',
  isPremium = false,
  isOnline = false,
  showBadges = true
}: EnhancedProfileAvatarProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36'
  };

  const glowSize = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  console.log('EnhancedProfileAvatar received avatar_url:', avatarUrl);

  return (
    <div className="relative">
      <motion.div
        className="relative group"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Animated Ring */}
        <motion.div
          className={`absolute inset-0 ${glowSize[size]} -translate-x-2 -translate-y-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-75 blur-lg`}
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Premium Ring */}
        {isPremium && (
          <motion.div
            className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-gradient-to-r from-amber-400 to-orange-500 p-1`}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <div className={`${sizeClasses[size]} rounded-full bg-white dark:bg-slate-900`} />
          </motion.div>
        )}

        {/* Main Avatar */}
        <Avatar className={`relative ${sizeClasses[size]} border-4 border-white dark:border-slate-800 shadow-2xl`}>
          <AvatarImage 
            src={avatarUrl || undefined} 
            alt={displayName || username || 'User'} 
            className="object-cover"
            onError={(e) => {
              console.log('Avatar image failed to load:', avatarUrl);
            }}
            onLoad={() => {
              console.log('Avatar image loaded successfully:', avatarUrl);
            }}
          />
          <AvatarFallback className={`bg-gradient-to-br from-blue-500 to-purple-600 text-white ${
            size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-3xl'
          } font-bold`}>
            {(displayName || username || 'U').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Online Status */}
        {isOnline && (
          <motion.div 
            className={`absolute ${
              size === 'sm' ? '-bottom-1 -right-1 w-4 h-4' : 
              size === 'md' ? '-bottom-1 -right-1 w-6 h-6' :
              size === 'lg' ? '-bottom-2 -right-2 w-8 h-8' :
              '-bottom-2 -right-2 w-10 h-10'
            } bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900 shadow-lg`}
            animate={{ 
              scale: [1, 1.2, 1],
              boxShadow: [
                '0 0 0 0 rgba(34, 197, 94, 0.7)',
                '0 0 0 8px rgba(34, 197, 94, 0)',
                '0 0 0 0 rgba(34, 197, 94, 0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Premium Badge */}
        {showBadges && isPremium && (
          <motion.div
            className={`absolute ${
              size === 'sm' ? '-top-1 -left-1' : 
              size === 'md' ? '-top-2 -left-2' :
              '-top-3 -left-3'
            }`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
          >
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
              <Crown className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} />
              VIP
            </Badge>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default EnhancedProfileAvatar;
