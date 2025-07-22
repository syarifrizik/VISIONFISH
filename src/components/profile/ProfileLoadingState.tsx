
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Layout from '@/components/Layout';
import { useIsMobile } from '@/hooks/use-mobile';

const ProfileLoadingState = () => {
  const isMobile = useIsMobile();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50/98 via-blue-50/95 to-purple-50/98 dark:from-gray-950/98 dark:via-blue-950/95 dark:to-purple-950/98">
        <div className={`container mx-auto ${isMobile ? 'px-2 py-3' : 'px-6 py-8'} max-w-6xl`}>
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header Skeleton */}
            <Card className="border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg">
              <CardContent className={isMobile ? 'p-4' : 'p-8'}>
                <div className={`flex ${isMobile ? 'flex-col items-center space-y-4' : 'items-start space-x-6'}`}>
                  {/* Avatar Skeleton */}
                  <Skeleton className={`${isMobile ? 'w-24 h-24' : 'w-32 h-32'} rounded-full`} />
                  
                  {/* Info Skeleton */}
                  <div className={`flex-1 space-y-3 ${isMobile ? 'text-center' : ''}`}>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-64" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>

                {/* Desktop Stats */}
                {!isMobile && (
                  <div className="mt-6 grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-white/40 dark:bg-gray-800/40 rounded-2xl p-4">
                        <Skeleton className="w-10 h-10 rounded-xl mb-3" />
                        <Skeleton className="h-6 w-16 mb-1" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mobile Stats Skeleton */}
            {isMobile && (
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
                    <CardContent className="p-3">
                      <Skeleton className="w-8 h-8 rounded-xl mb-3" />
                      <Skeleton className="h-6 w-12 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Tabs Skeleton */}
            <Card className="border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-5 gap-4'} mb-6`}>
                  {[...Array(isMobile ? 4 : 5)].map((_, i) => (
                    <Skeleton key={i} className={`h-${isMobile ? '16' : '20'} rounded-xl`} />
                  ))}
                </div>
                <Skeleton className="h-64 w-full rounded-xl" />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileLoadingState;
