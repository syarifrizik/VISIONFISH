
import { motion } from 'framer-motion';

interface MobileSkeletonLoaderProps {
  type?: 'full' | 'cards' | 'header';
}

const MobileSkeletonLoader = ({ type = 'full' }: MobileSkeletonLoaderProps) => {
  const shimmer = {
    animate: {
      x: ['-100%', '100%'],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  const SkeletonBox = ({ className }: { className: string }) => (
    <div className={`relative overflow-hidden bg-white/10 backdrop-blur-xl rounded-2xl ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        {...shimmer}
      />
    </div>
  );

  if (type === 'header') {
    return (
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <SkeletonBox className="w-10 h-10" />
          <div className="flex gap-3">
            <SkeletonBox className="w-16 h-6" />
            <SkeletonBox className="w-10 h-10" />
          </div>
        </div>
        
        <div className="flex items-start gap-4 mb-6">
          <SkeletonBox className="w-24 h-24 rounded-3xl" />
          <div className="flex-1 space-y-2">
            <SkeletonBox className="w-32 h-6" />
            <SkeletonBox className="w-24 h-4" />
            <SkeletonBox className="w-full h-4" />
            <SkeletonBox className="w-3/4 h-4" />
          </div>
        </div>
        
        <SkeletonBox className="w-full h-12 mb-4" />
        
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <SkeletonBox key={i} className="w-20 h-8" />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'cards') {
    return (
      <div className="space-y-4 p-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl" />
            <div className="relative z-10 p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <SkeletonBox className="w-10 h-10" />
                  <div className="space-y-2">
                    <SkeletonBox className="w-32 h-4" />
                    <SkeletonBox className="w-24 h-3" />
                  </div>
                </div>
                <SkeletonBox className="w-8 h-8" />
              </div>
              
              <SkeletonBox className="w-full h-4" />
              <SkeletonBox className="w-3/4 h-4" />
              
              <SkeletonBox className="w-full h-48 rounded-2xl" />
              
              <div className="flex items-center justify-between pt-3">
                <div className="flex gap-6">
                  <SkeletonBox className="w-12 h-8" />
                  <SkeletonBox className="w-12 h-8" />
                  <SkeletonBox className="w-8 h-8" />
                </div>
                <SkeletonBox className="w-8 h-8" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Full skeleton
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-br from-cyan-400/10 via-blue-500/5 to-purple-600/10 rounded-full blur-3xl"
          style={{ top: '10%', right: '10%' }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
      
      <div className="relative z-10">
        <MobileSkeletonLoader type="header" />
        
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonBox key={i} className="h-28" />
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonBox key={i} className="h-20" />
            ))}
          </div>
        </div>
        
        <MobileSkeletonLoader type="cards" />
      </div>
    </div>
  );
};

export default MobileSkeletonLoader;
