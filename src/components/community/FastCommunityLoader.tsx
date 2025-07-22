
import { motion } from 'framer-motion';

const FastCommunityLoader = () => {
  return (
    <div className="p-6 pb-32">
      <div className="space-y-4">
        {/* Quick skeleton for posts */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse" />
              <div className="space-y-1">
                <div className="w-24 h-3 bg-white/20 rounded animate-pulse" />
                <div className="w-16 h-2 bg-white/20 rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-3 bg-white/20 rounded animate-pulse" />
              <div className="w-3/4 h-3 bg-white/20 rounded animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FastCommunityLoader;
