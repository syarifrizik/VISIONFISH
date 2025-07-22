
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileLoadingSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Header Skeleton */}
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
          <div className="flex items-start gap-8">
            <Skeleton className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-200/50 to-purple-200/50 dark:from-blue-800/50 dark:to-purple-800/50" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-48 bg-gradient-to-r from-blue-200/50 to-purple-200/50 dark:from-blue-800/50 dark:to-purple-800/50" />
              <Skeleton className="h-4 w-32 bg-gradient-to-r from-blue-200/50 to-purple-200/50 dark:from-blue-800/50 dark:to-purple-800/50" />
              <Skeleton className="h-16 w-full bg-gradient-to-r from-blue-200/50 to-purple-200/50 dark:from-blue-800/50 dark:to-purple-800/50" />
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20 h-36 md:h-48"
            >
              <div className="space-y-4">
                <Skeleton className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-200/50 to-purple-200/50 dark:from-blue-800/50 dark:to-purple-800/50" />
                <Skeleton className="h-8 w-16 bg-gradient-to-r from-blue-200/50 to-purple-200/50 dark:from-blue-800/50 dark:to-purple-800/50" />
                <Skeleton className="h-4 w-20 bg-gradient-to-r from-blue-200/50 to-purple-200/50 dark:from-blue-800/50 dark:to-purple-800/50" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
          <Skeleton className="h-96 w-full bg-gradient-to-r from-blue-200/50 to-purple-200/50 dark:from-blue-800/50 dark:to-purple-800/50" />
        </div>
      </motion.div>
    </div>
  </div>
);

export default ProfileLoadingSkeleton;
