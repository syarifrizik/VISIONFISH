
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, MapPin, Calendar, Crown, Star } from 'lucide-react';
import { UserProfile } from '@/types/profile';

interface ProfileInfoProps {
  user: UserProfile;
  layout?: 'mobile' | 'desktop';
}

const ProfileInfo = ({ user, layout = 'mobile' }: ProfileInfoProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long'
    });
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "backOut" }
    },
    hover: { 
      scale: 1.1, 
      y: -2,
      transition: { duration: 0.2 }
    }
  };

  if (layout === 'mobile') {
    return (
      <div className="flex-1 min-w-0 space-y-3">
        <motion.div variants={textVariants} initial="hidden" animate="visible">
          <motion.h1 
            className="text-2xl font-bold bg-gradient-to-r from-[#49225B] via-[#6E3482] to-[#A56ABD] bg-clip-text text-transparent mb-1 relative"
            whileHover={{ scale: 1.02 }}
          >
            {user.display_name || user.username || 'Pengguna'}
            {/* Subtle shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
            />
          </motion.h1>
          
          {user.username && user.display_name && (
            <motion.p 
              className="text-sm text-[#A56ABD] dark:text-[#E7D0EF] mb-3 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              @{user.username}
            </motion.p>
          )}
        </motion.div>
        
        <motion.div 
          className="flex flex-wrap gap-2"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={badgeVariants} whileHover="hover">
            <Badge className="bg-gradient-to-r from-[#A56ABD] to-[#6E3482] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
              <Crown className="w-3 h-3 mr-1 relative z-10" />
              <span className="relative z-10">Premium</span>
            </Badge>
          </motion.div>
          
          <motion.div variants={badgeVariants} whileHover="hover">
            <Badge variant="outline" className="border-emerald-500/40 bg-emerald-50/80 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
              <TrendingUp className="w-3 h-3 mr-1" />
              Aktif
            </Badge>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <motion.div variants={textVariants} initial="hidden" animate="visible">
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-[#49225B] via-[#6E3482] to-[#A56ABD] bg-clip-text text-transparent relative"
              whileHover={{ scale: 1.02 }}
            >
              {user.display_name || user.username || 'Pengguna'}
              {/* Enhanced shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 pointer-events-none"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
              />
            </motion.h1>
            {user.username && user.display_name && (
              <motion.p 
                className="text-xl text-[#A56ABD] dark:text-[#E7D0EF] font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                @{user.username}
              </motion.p>
            )}
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap gap-3"
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={badgeVariants} whileHover="hover">
              <Badge className="bg-gradient-to-r from-[#A56ABD] via-[#6E3482] to-[#49225B] text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 px-4 py-2 text-sm relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
                <Crown className="w-4 h-4 mr-2 relative z-10" />
                <span className="relative z-10 font-semibold">Premium</span>
              </Badge>
            </motion.div>
            
            <motion.div variants={badgeVariants} whileHover="hover">
              <Badge variant="outline" className="border-emerald-500/40 bg-gradient-to-r from-emerald-50/80 to-emerald-100/60 dark:from-emerald-900/20 dark:to-emerald-800/10 text-emerald-700 dark:text-emerald-300 shadow-lg hover:shadow-xl transition-all duration-300 px-4 py-2 backdrop-blur-sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span className="font-semibold">Aktif</span>
              </Badge>
            </motion.div>

            <motion.div variants={badgeVariants} whileHover="hover">
              <Badge variant="outline" className="border-amber-500/40 bg-gradient-to-r from-amber-50/80 to-amber-100/60 dark:from-amber-900/20 dark:to-amber-800/10 text-amber-700 dark:text-amber-300 shadow-lg hover:shadow-xl transition-all duration-300 px-4 py-2 backdrop-blur-sm">
                <Star className="w-4 h-4 mr-2" />
                <span className="font-semibold">VIP Member</span>
              </Badge>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {user.bio && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/60 via-white/40 to-white/20 dark:from-gray-800/60 dark:via-gray-800/40 dark:to-gray-900/20 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 shadow-2xl overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#A56ABD]/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#6E3482]/10 to-transparent rounded-full translate-y-12 -translate-x-12" />
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl relative z-10 text-lg">
              {user.bio}
            </p>
          </div>
        </motion.div>
      )}

      <motion.div 
        className="flex flex-wrap gap-8 text-gray-600 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {user.location && (
          <motion.div 
            className="flex items-center gap-3 group cursor-pointer"
            whileHover={{ x: 5, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#A56ABD]/10 to-[#6E3482]/10 group-hover:from-[#A56ABD]/20 group-hover:to-[#6E3482]/20 transition-all duration-300">
              <MapPin className="w-5 h-5 text-[#A56ABD] group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="font-medium group-hover:text-[#A56ABD] transition-colors duration-300">{user.location}</span>
          </motion.div>
        )}
        
        <motion.div 
          className="flex items-center gap-3 group cursor-pointer"
          whileHover={{ x: 5, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="p-2 rounded-lg bg-gradient-to-br from-[#A56ABD]/10 to-[#6E3482]/10 group-hover:from-[#A56ABD]/20 group-hover:to-[#6E3482]/20 transition-all duration-300">
            <Calendar className="w-5 h-5 text-[#A56ABD] group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="font-medium group-hover:text-[#A56ABD] transition-colors duration-300">
            Bergabung {formatDate(user.created_at)}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfileInfo;
