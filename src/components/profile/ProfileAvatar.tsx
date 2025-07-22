
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProfileAvatarProps {
  avatarUrl?: string;
  displayName?: string;
  username?: string;
  size?: 'mobile' | 'desktop';
  showStatus?: boolean;
}

const ProfileAvatar = ({ 
  avatarUrl, 
  displayName, 
  username, 
  size = 'mobile',
  showStatus = true 
}: ProfileAvatarProps) => {
  const sizeClasses = size === 'desktop' ? 'w-28 h-28' : 'w-20 h-20';
  const fallbackSize = size === 'desktop' ? 'text-3xl' : 'text-xl';
  const glowSize = size === 'desktop' ? 'w-32 h-32' : 'w-24 h-24';

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.08, rotateY: 5 }}
        whileTap={{ scale: 0.92 }}
        className="relative group cursor-pointer"
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        {/* Enhanced multi-layered glow effect */}
        <motion.div 
          className={`absolute inset-0 ${glowSize} -translate-x-2 -translate-y-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700`}
          animate={{ 
            background: [
              'radial-gradient(circle, rgba(165,106,189,0.4) 0%, rgba(110,52,130,0.2) 50%, transparent 100%)',
              'radial-gradient(circle, rgba(110,52,130,0.4) 0%, rgba(165,106,189,0.2) 50%, transparent 100%)',
              'radial-gradient(circle, rgba(165,106,189,0.4) 0%, rgba(110,52,130,0.2) 50%, transparent 100%)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Rotating border ring */}
        <motion.div
          className={`absolute inset-0 ${sizeClasses} rounded-full`}
          style={{
            background: 'conic-gradient(from 0deg, #A56ABD, #6E3482, #49225B, #A56ABD)',
            padding: '3px'
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <div className={`${sizeClasses} rounded-full bg-white dark:bg-gray-900`} />
        </motion.div>

        {/* Main avatar with glassmorphism */}
        <Avatar className={`relative ${sizeClasses} border-0 shadow-2xl backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 overflow-hidden`}>
          <AvatarImage 
            src={avatarUrl} 
            alt={displayName || username || 'User'} 
            className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
          />
          <AvatarFallback className={`bg-gradient-to-br from-[#6E3482] via-[#A56ABD] to-[#E7D0EF] text-white ${fallbackSize} font-bold relative overflow-hidden`}>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            <span className="relative z-10">
              {(displayName || username || 'U').charAt(0).toUpperCase()}
            </span>
          </AvatarFallback>
        </Avatar>
        
        {/* Enhanced status indicator with pulse effect */}
        {showStatus && (
          <motion.div 
            className={`absolute ${size === 'desktop' ? '-bottom-1 -right-1 w-7 h-7' : '-bottom-0.5 -right-0.5 w-6 h-6'} rounded-full border-4 border-white dark:border-gray-900 shadow-2xl overflow-hidden`}
            animate={{ 
              scale: [1, 1.15, 1],
              boxShadow: [
                '0 0 0 0 rgba(16, 185, 129, 0.7)',
                '0 0 0 8px rgba(16, 185, 129, 0)',
                '0 0 0 0 rgba(16, 185, 129, 0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              />
            </div>
          </motion.div>
        )}

        {/* Floating sparkles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-[#A56ABD] to-[#6E3482] rounded-full opacity-0 group-hover:opacity-100"
            style={{
              top: `${20 + i * 20}%`,
              left: `${15 + i * 25}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default ProfileAvatar;
